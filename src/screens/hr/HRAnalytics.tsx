import { useEffect, useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { useApp } from "../../context/AppContext"
import ChartModal from "../../components/ChartModal"
import ChartSelection from "../../components/ChartSelection"
import {
  getFacultyDonutData,
  getFacultyGenderData,
  getQualificationData,
  getFacultyRankData,
  getFacultyData,
  getTotalStudents,
} from "../../data/mockData"
import type { FilterState, ScreenId } from "../../types"

/* ─── Constants ────────────────────────────────────────────────── */
const TABS = [
  "Faculty Overview",
  "Demographics",
  "Academic Rank",
  "Teaching Load",
  "Employment Status",
  "Performance",
  "Retention",
] as const
type Tab = typeof TABS[number]

const SCREEN_BY_TAB: Record<Tab, ScreenId> = {
  "Faculty Overview": "hr-analytics",
  Demographics: "hr-analytics-demographics",
  "Academic Rank": "hr-analytics-rank",
  "Teaching Load": "hr-analytics-load",
  "Employment Status": "hr-analytics-employment",
  Performance: "hr-analytics-performance",
  Retention: "hr-analytics-retention",
}

const ACADEMICS = ["All", "2024–2025", "2025–2026", "2026–2027"]
const CAMPUSES = [
  "All",
  "San Bartolome (Main)",
  "San Francisco",
  "Batasan Campus",
]
const COLLEGE_LIST = ["All", "CCS", "COA", "COB", "COE", "COED"]
const PROGRAMS_MAP: Record<string, string[]> = {
  CCS: ["BSIT", "BSIS", "BSCS"],
  COA: ["BSA", "BSMA"],
  COB: ["BSE", "MSENT"],
  COE: ["BSEE", "BSIE"],
  COED: ["BECED"],
}
const EMP_STATUS_OPTS = ["All", "Full-Time", "Part-Time"]

const COLLEGE_COLORS: Record<string, string> = {
  CCS: "#333333",
  COA: "#00875A",
  COB: "#FFC700",
  COE: "#FF6B00",
  COED: "#0052CC",
}

type ModalState = {
  title: string
  description: string
  chart: React.ReactNode
  insights?: string[]
} | null

type ChartVisibilityProps = {
  visibleCharts: Set<string>
}

/* ─── Shared components ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-lilac/20 rounded-xl px-4 py-3 shadow-lg text-xs">
      {label && <p className="font-bold text-primary mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill ?? "#200D2D" }}>
          {p.name ?? p.dataKey}:{" "}
          <strong>
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </strong>
        </p>
      ))}
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-lilac/20 bg-white px-3 py-1.5 text-xs font-medium text-primary hover:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac/30 cursor-pointer"
        style={{ minWidth: 100 }}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

function ChartBtns({
  onView,
  onExport,
}: {
  onView: () => void
  onExport: () => void
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onView}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold bg-lilac/10 text-primary hover:bg-lilac/20 transition-colors"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
        View
      </button>
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold bg-golden/15 text-primary hover:bg-golden/25 transition-colors"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v13M7 11l5 5 5-5M4 20h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Export
      </button>
    </div>
  )
}

/* ─── Scale helper ──────────────────────────────────────────────── */
function getScale(academicYear: string, campus: string): number {
  const a: Record<string, number> = {
    All: 1,
    "2024–2025": 0.92,
    "2025–2026": 0.96,
    "2026–2027": 1,
  }
  const c: Record<string, number> = {
    All: 1,
    "San Bartolome (Main)": 0.62,
    "San Francisco": 0.22,
    "Batasan Campus": 0.16,
  }
  return (a[academicYear] ?? 1) * (c[campus] ?? 1)
}

/* ─── Tab: Faculty Overview ─────────────────────────────────────── */
function TabOverview({
  filters,
  onOpen,
  visibleCharts,
}: {
  filters: FilterState
  onOpen: (m: ModalState) => void
} & ChartVisibilityProps) {
  const { showToast } = useApp()
  const byCollege = useMemo(() => getFacultyDonutData(filters), [filters])
  const { fullTime, partTime } = useMemo(
    () => getFacultyData(filters),
    [filters],
  )
  const total = fullTime + partTime
  const ftPct = total > 0 ? Math.round((fullTime / total) * 100) : 65

  if (!visibleCharts.has("faculty-overview")) return null

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {[
          ["Total Faculty", total.toLocaleString()],
          ["Full-Time Rate", `${ftPct}%`],
          ["Active Depts", "5"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="rounded-xl bg-blossom px-5 py-3 flex flex-col"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
              {k}
            </p>
            <p className="text-2xl font-bold text-primary">{v}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-primary">Faculty by College</p>
          <ChartBtns
            onExport={() =>
              showToast({ type: "success", title: "Chart exported." })
            }
            onView={() =>
              onOpen({
                title: "Faculty by College",
                description:
                  "Total faculty headcount distributed across all five colleges.",
                chart: (
                  <ResponsiveContainer width="100%" height={420}>
                    <BarChart
                      data={byCollege}
                      margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 13, fill: "#7B6891" }}
                      />
                      <YAxis tick={{ fontSize: 13, fill: "#7B6891" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="value"
                        name="Faculty Count"
                        radius={[6, 6, 0, 0]}
                      >
                        {byCollege.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ),
                insights: [
                  `CCS leads with most faculty; total workforce: ${total} faculty members`,
                  `Full-time rate: ${ftPct}%`,
                  "Recommended target: minimum 30 faculty per college",
                ],
              })
            }
          />
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={byCollege}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#7B6891" }} />
              <YAxis tick={{ fontSize: 11, fill: "#7B6891" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Faculty Count" radius={[6, 6, 0, 0]}>
                {byCollege.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

/* ─── Tab: Demographics ─────────────────────────────────────────── */
function TabDemographics({
  filters,
  onOpen,
  visibleCharts,
}: {
  filters: FilterState
  onOpen: (m: ModalState) => void
} & ChartVisibilityProps) {
  const { showToast } = useApp()
  const s = getScale(filters.academicYear, filters.campus)
  const genderRaw = useMemo(() => getFacultyGenderData(filters), [filters])

  const maleTotal = genderRaw
    .filter((g) => g.status.includes("Male"))
    .reduce((a, g) => a + g.count, 0)
  const femaleTotal = genderRaw
    .filter((g) => g.status.includes("Female"))
    .reduce((a, g) => a + g.count, 0)
  const genderData = [
    { group: "Faculty", male: maleTotal, female: femaleTotal },
  ]

  const maritalData = [
    { name: "Single", value: Math.round(130 * s), color: "#BB96E4" },
    { name: "Married", value: Math.round(102 * s), color: "#200D2D" },
    { name: "Widowed", value: Math.round(8 * s), color: "#FFD066" },
  ]
  const ageData = [
    { bracket: "21–30", count: Math.round(45 * s) },
    { bracket: "31–40", count: Math.round(110 * s) },
    { bracket: "41–50", count: Math.round(60 * s) },
    { bracket: "51+", count: Math.round(25 * s) },
  ]

  const charts = [
    {
      id: "demo-gender",
      title: "Gender Distribution",
      small: (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={genderData}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
              <XAxis dataKey="group" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar
                dataKey="male"
                name="Male"
                fill="#200D2D"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="female"
                name="Female"
                fill="#BB96E4"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
      modal: () =>
        onOpen({
          title: "Gender Distribution",
          description: "Male vs Female faculty breakdown.",
          chart: (
            <ResponsiveContainer width="100%" height={420}>
              <BarChart
                data={genderData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                <XAxis dataKey="group" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 13 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "13px" }} />
                <Bar
                  dataKey="male"
                  name="Male"
                  fill="#200D2D"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="female"
                  name="Female"
                  fill="#BB96E4"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ),
          insights: [
            `Female faculty (${femaleTotal}) outnumber male (${maleTotal})`,
            `Gender ratio: ${
              femaleTotal + maleTotal > 0
                ? Math.round((femaleTotal / (femaleTotal + maleTotal)) * 100)
                : 54
            }% Female, ${
              femaleTotal + maleTotal > 0
                ? Math.round((maleTotal / (femaleTotal + maleTotal)) * 100)
                : 46
            }% Male`,
            "Female representation increasing YoY",
          ],
        }),
    },
    {
      id: "demo-marital",
      title: "Marital Status",
      small: (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={maritalData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
              >
                {maritalData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ),
      modal: () =>
        onOpen({
          title: "Marital Status",
          description: "Distribution of faculty by marital status.",
          chart: (
            <ResponsiveContainer width="100%" height={420}>
              <PieChart>
                <Pie
                  data={maritalData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={170}
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(1)}%`
                  }
                  labelLine
                >
                  {maritalData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "13px" }} />
              </PieChart>
            </ResponsiveContainer>
          ),
          insights: [
            `Single faculty (${maritalData[0].value}) form the majority`,
            `Married faculty: ${maritalData[1].value}`,
            `Widowed faculty: ${maritalData[2].value}`,
          ],
        }),
    },
    {
      id: "demo-age",
      title: "Age Brackets",
      small: (
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ageData}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
              <XAxis dataKey="bracket" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Faculty"
                fill="#BB96E4"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
      modal: () =>
        onOpen({
          title: "Age Brackets",
          description: "Faculty distribution across age groups.",
          chart: (
            <ResponsiveContainer width="100%" height={420}>
              <BarChart
                data={ageData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                <XAxis
                  dataKey="bracket"
                  tick={{ fontSize: 13, fill: "#7B6891" }}
                />
                <YAxis tick={{ fontSize: 13, fill: "#7B6891" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  name="Faculty"
                  fill="#BB96E4"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ),
          insights: [
            "Majority of faculty (46%) are aged 31–40",
            "Only 10% are aged 51+, indicating potential succession gap",
            "21–30 cohort at 19%; pipeline remains active",
          ],
        }),
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {charts.filter(({ id }) => visibleCharts.has(id)).map(({ id, title, small, modal }) => (
        <div
          key={id}
          className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-primary">{title}</p>
            <ChartBtns
              onView={modal}
              onExport={() =>
                showToast({ type: "success", title: "Chart exported." })
              }
            />
          </div>
          {small}
        </div>
      ))}
    </div>
  )
}

/* ─── Tab: Academic Rank ─────────────────────────────────────────── */
function TabAcademicRank({
  filters,
  onOpen,
  visibleCharts,
}: {
  filters: FilterState
  onOpen: (m: ModalState) => void
} & ChartVisibilityProps) {
  const { showToast } = useApp()
  const data = useMemo(() => getFacultyRankData(filters), [filters])
  if (!visibleCharts.has("rank-dist")) return null

  return (
    <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-primary">
          Faculty by Academic Rank
        </p>
        <ChartBtns
          onExport={() =>
            showToast({ type: "success", title: "Chart exported." })
          }
          onView={() =>
            onOpen({
              title: "Faculty by Academic Rank",
              description:
                "Distribution of faculty across academic rank classifications.",
              chart: (
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 110, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 13, fill: "#7B6891" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="rank"
                      tick={{ fontSize: 13, fill: "#7B6891" }}
                      width={110}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      name="Faculty"
                      fill="#BB96E4"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ),
              insights: [
                "Instructor I–III remains dominant at 58%",
                "Only 4% have attained Full Professor rank",
                "Rank promotion pipeline needs acceleration for sustainability",
              ],
            })
          }
        />
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 20, left: 80, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#7B6891" }} />
            <YAxis
              type="category"
              dataKey="rank"
              tick={{ fontSize: 11, fill: "#7B6891" }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              name="Faculty"
              fill="#BB96E4"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ─── Tab: Teaching Load ─────────────────────────────────────────── */
function TabTeachingLoad({
  filters,
  onOpen,
  visibleCharts,
}: {
  filters: FilterState
  onOpen: (m: ModalState) => void
} & ChartVisibilityProps) {
  const { showToast } = useApp()
  const s = getScale(filters.academicYear, filters.campus)
  const data = useMemo(
    () => [
      { load: "12–15 units", count: Math.round(80 * s) },
      { load: "18–21 units", count: Math.round(110 * s) },
      { load: "Overload >21", count: Math.round(50 * s) },
    ],
    [s],
  )

  if (!visibleCharts.has("teaching-load")) return null

  return (
    <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-primary">
          Teaching Load Distribution
        </p>
        <ChartBtns
          onExport={() =>
            showToast({ type: "success", title: "Chart exported." })
          }
          onView={() =>
            onOpen({
              title: "Teaching Load Distribution",
              description: "Faculty distribution by unit load per semester.",
              chart: (
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart
                    data={data}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                    <XAxis
                      dataKey="load"
                      tick={{ fontSize: 13, fill: "#7B6891" }}
                    />
                    <YAxis tick={{ fontSize: 13, fill: "#7B6891" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      name="Faculty"
                      fill="#200D2D"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ),
              insights: [
                "46% of faculty carry 18–21 unit loads",
                "21% are on overload — exceeding CSC guidelines",
                "Underload (12–15 units) concentrated in COA and COB",
              ],
            })
          }
        />
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
            <XAxis dataKey="load" tick={{ fontSize: 11, fill: "#7B6891" }} />
            <YAxis tick={{ fontSize: 11, fill: "#7B6891" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              name="Faculty"
              fill="#200D2D"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ─── Tab: Employment Status ─────────────────────────────────────── */
function TabEmploymentStatus({
  filters,
  onOpen,
  visibleCharts,
}: {
  filters: FilterState
  onOpen: (m: ModalState) => void
} & ChartVisibilityProps) {
  const { showToast } = useApp()
  const { fullTime, partTime } = useMemo(
    () => getFacultyData(filters),
    [filters],
  )
  const s = getScale(filters.academicYear, filters.campus)
  const contractual = Math.round(30 * s)

  const typeData = [{ group: "Type", fullTime, partTime, contractual }]
  const statusData = [
    {
      group: "Status",
      active: Math.round(220 * s),
      onLeave: Math.round(10 * s),
      resigned: Math.round(6 * s),
      retired: Math.round(4 * s),
    },
  ]

  const charts: Array<{
    title: string
    data: any[]
    keys: readonly [string, string, string][]
    insights: string[]
  }> = [
    {
      title: "Employment Type",
      data: typeData,
      keys: [
        ["fullTime", "Full-Time", "#200D2D"],
        ["partTime", "Part-Time", "#BB96E4"],
        ["contractual", "Contractual", "#FFD066"],
      ] as const,
      insights: [
        `Full-time faculty (${fullTime}) form ${Math.round((fullTime / (fullTime + partTime + contractual)) * 100)}% of the workforce`,
        `Part-time at ${Math.round((partTime / (fullTime + partTime + contractual)) * 100)}%, contractual at ${Math.round((contractual / (fullTime + partTime + contractual)) * 100)}%`,
        "Target: reduce contractual rate below 8% by 2027",
      ],
    },
    {
      title: "Employment Status",
      data: statusData,
      keys: [
        ["active", "Active", "#00875A"],
        ["onLeave", "On Leave", "#FFD066"],
        ["resigned", "Resigned", "#FF6B00"],
        ["retired", "Retired", "#7B6891"],
      ] as const,
      insights: [
        "Active faculty at 91.7% — above target threshold",
        "2.5% on leave; monitoring for return-to-work compliance",
        "Resignation rate low at 2.5%; retention measures effective",
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {charts.filter(({ title }) => visibleCharts.has(title === "Employment Type" ? "emp-type" : "emp-status")).map(({ title, data, keys, insights }) => (
        <div
          key={title}
          className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-primary">{title}</p>
            <ChartBtns
              onExport={() =>
                showToast({ type: "success", title: "Chart exported." })
              }
              onView={() =>
                onOpen({
                  title,
                  description: `${title} breakdown for all QCU faculty.`,
                  chart: (
                    <ResponsiveContainer width="100%" height={420}>
                      <BarChart
                        data={data}
                        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                        <XAxis dataKey="group" tick={{ fontSize: 13 }} />
                        <YAxis tick={{ fontSize: 13 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "13px" }} />
                        {keys.map(([key, name, fill]) => (
                          <Bar
                            key={key}
                            dataKey={key}
                            name={name}
                            fill={fill}
                            radius={[4, 4, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  ),
                  insights,
                })
              }
            />
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                {keys.map(([key, name, fill]) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={name}
                    fill={fill}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Tab: Performance ───────────────────────────────────────────── */
function TabPerformance({
  filters,
  onOpen,
  visibleCharts,
}: {
  filters: FilterState
  onOpen: (m: ModalState) => void
} & ChartVisibilityProps) {
  const { showToast } = useApp()
  const s = getScale(filters.academicYear, filters.campus)
  const data = useMemo(
    () => [
      { rating: "Outstanding", count: Math.round(85 * s) },
      { rating: "Very Satisfactory", count: Math.round(120 * s) },
      { rating: "Satisfactory", count: Math.round(30 * s) },
      { rating: "Needs Improvement", count: Math.round(5 * s) },
    ],
    [s],
  )
  const colors = ["#200D2D", "#BB96E4", "#FFD066", "#4C1413"]

  if (!visibleCharts.has("perf-rating")) return null

  return (
    <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-primary">
          Performance Rating Distribution
        </p>
        <ChartBtns
          onExport={() =>
            showToast({ type: "success", title: "Chart exported." })
          }
          onView={() =>
            onOpen({
              title: "Performance Rating Distribution",
              description:
                "Faculty IPCR performance ratings for the current evaluation period.",
              chart: (
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart
                    data={data}
                    margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                    <XAxis
                      dataKey="rating"
                      tick={{ fontSize: 12, fill: "#7B6891" }}
                    />
                    <YAxis tick={{ fontSize: 13, fill: "#7B6891" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Faculty" radius={[6, 6, 0, 0]}>
                      {data.map((_, i) => (
                        <Cell key={i} fill={colors[i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ),
              insights: [
                '50% rated "Very Satisfactory" — institutional benchmark met',
                '35% achieved "Outstanding" — highest in 3 years',
                'Only 2% rated "Needs Improvement"; interventions in progress',
              ],
            })
          }
        />
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: -16, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
            <XAxis dataKey="rating" tick={{ fontSize: 10, fill: "#7B6891" }} />
            <YAxis tick={{ fontSize: 11, fill: "#7B6891" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Faculty" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ─── Tab: Retention ─────────────────────────────────────────────── */
function TabRetention({
  filters,
  onOpen,
  visibleCharts,
}: {
  filters: FilterState
  onOpen: (m: ModalState) => void
} & ChartVisibilityProps) {
  const { showToast } = useApp()
  const s = getScale(filters.academicYear, filters.campus)
  const data = [
    {
      year: "2022",
      turnover: +(8.5 * (2 - s)).toFixed(1),
      tenure: Math.round(78 * Math.min(s + 0.1, 1)),
    },
    {
      year: "2023",
      turnover: +(7.2 * (2 - s)).toFixed(1),
      tenure: Math.round(81 * Math.min(s + 0.1, 1)),
    },
    {
      year: "2024",
      turnover: +(6.8 * (2 - s)).toFixed(1),
      tenure: Math.round(84 * Math.min(s + 0.1, 1)),
    },
    {
      year: "2025",
      turnover: +(5.9 * (2 - s)).toFixed(1),
      tenure: Math.round(87 * Math.min(s + 0.1, 1)),
    },
    {
      year: "2026",
      turnover: +(5.1 * (2 - s)).toFixed(1),
      tenure: Math.round(91 * Math.min(s + 0.1, 1)),
    },
  ]

  const charts = [
    {
      key: "turnover" as const,
      title: "Turnover Rate (%)",
      color: "#4C1413",
      insights: [
        "Turnover decreased by 3.4 points over 4 years",
        "2026 rate is lowest on record",
        "Target for 2027: maintain below 5%",
      ],
    },
    {
      key: "tenure" as const,
      title: "Tenure Retention (%)",
      color: "#BB96E4",
      insights: [
        "Tenure retention reached 91% in 2026 — new high",
        "13-point improvement since 2022 baseline",
        "Improvement driven by salary standardization",
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {charts.filter(({ key }) => visibleCharts.has(key === "turnover" ? "ret-turnover" : "ret-tenure")).map(({ key, title, color, insights }) => (
        <div
          key={title}
          className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-primary">{title}</p>
            <ChartBtns
              onExport={() =>
                showToast({ type: "success", title: "Chart exported." })
              }
              onView={() =>
                onOpen({
                  title,
                  description: `5-year trend for faculty ${title.toLowerCase()}.`,
                  chart: (
                    <ResponsiveContainer width="100%" height={420}>
                      <LineChart
                        data={data}
                        margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 13, fill: "#7B6891" }}
                        />
                        <YAxis tick={{ fontSize: 13, fill: "#7B6891" }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey={key}
                          stroke={color}
                          strokeWidth={3}
                          dot={{ r: 5, fill: color }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ),
                  insights,
                })
              }
            />
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#7B6891" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#7B6891" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: color }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── KPI Badge (mirrors SPARDS Analytics design) ───────────────── */
function KpiBadge({ label, value, accent, icon }: { label: string; value: string | number; accent?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-lilac/15 bg-white shadow-sm px-5 py-4 flex flex-col gap-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted leading-tight">{label}</p>
        {icon && <span className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent ?? '#BB96E4'}18`, color: accent ?? '#BB96E4' }}>{icon}</span>}
      </div>
      <p className="text-2xl font-extrabold" style={{ color: accent ?? '#200D2D' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

/* ─── Chart defs per tab for ChartSelection ─────────────────────── */
const CHART_DEFS_BY_TAB: Record<Tab, { id: string; label: string }[]> = {
  "Faculty Overview": [{ id: "faculty-overview", label: "Faculty by College" }],
  Demographics: [
    { id: "demo-gender", label: "Gender Distribution" },
    { id: "demo-marital", label: "Marital Status" },
    { id: "demo-age", label: "Age Brackets" },
  ],
  "Academic Rank": [{ id: "rank-dist", label: "Faculty by Academic Rank" }],
  "Teaching Load": [
    { id: "teaching-load", label: "Teaching Load Distribution" },
  ],
  "Employment Status": [
    { id: "emp-type", label: "Employment Type" },
    { id: "emp-status", label: "Employment Status" },
  ],
  Performance: [
    { id: "perf-rating", label: "Performance Rating Distribution" },
  ],
  Retention: [
    { id: "ret-turnover", label: "Turnover Rate" },
    { id: "ret-tenure", label: "Tenure Retention" },
  ],
}

/* ═══════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════ */
export default function HRAnalytics({ initialTab = "Faculty Overview" }: { initialTab?: Tab }) {
  const { showToast, navigate } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)
  useEffect(() => setActiveTab(initialTab), [initialTab])
  const [chartModal, setChartModal] = useState<ModalState>(null)

  /* Filter state */
  const [academicYear, setAcademicYear] = useState("All")
  const [campus, setCampus] = useState("All")
  const [college, setCollege] = useState("All")
  const [program, setProgram] = useState("All")
  const [employmentStatus, setEmploymentStatus] = useState("All")

  const programOpts = useMemo(() => {
    if (college === "All") return ["All", ...Object.values(PROGRAMS_MAP).flat()]
    return ["All", ...(PROGRAMS_MAP[college] ?? [])]
  }, [college])

  const hasActiveFilter =
    academicYear !== "All" ||
    campus !== "All" ||
    college !== "All" ||
    program !== "All" ||
    employmentStatus !== "All"

  const filters = useMemo<FilterState>(
    () => ({
      academicYear,
      semester: "All",
      campus,
      college,
      program,
      yearLevel: "All",
      studentStatus: "All",
      studentType: "All",
      ageRange: "All",
      firstGenStatus: "All",
      employmentStatus,
      scholarship: "All",
    }),
    [academicYear, campus, college, program, employmentStatus],
  )

  const currentCharts = CHART_DEFS_BY_TAB[activeTab] ?? []
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(
    new Set(
      Object.values(CHART_DEFS_BY_TAB)
        .flat()
        .map((c) => c.id),
    ),
  )

  function handleResetFilters() {
    setAcademicYear("All")
    setCampus("All")
    setCollege("All")
    setProgram("All")
    setEmploymentStatus("All")
  }

  function handleChartVisibility(id: string, checked: boolean) {
    setVisibleCharts((previous) => {
      const next = new Set(previous)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  function open(m: ModalState) {
    setChartModal(m)
  }

  function selectTab(tab: Tab) {
    setActiveTab(tab)
    navigate(SCREEN_BY_TAB[tab])
  }

  const tabContent: Record<Tab, React.ReactNode> = {
    "Faculty Overview": <TabOverview filters={filters} onOpen={open} visibleCharts={visibleCharts} />,
    Demographics: <TabDemographics filters={filters} onOpen={open} visibleCharts={visibleCharts} />,
    "Academic Rank": <TabAcademicRank filters={filters} onOpen={open} visibleCharts={visibleCharts} />,
    "Teaching Load": <TabTeachingLoad filters={filters} onOpen={open} visibleCharts={visibleCharts} />,
    "Employment Status": (
      <TabEmploymentStatus filters={filters} onOpen={open} visibleCharts={visibleCharts} />
    ),
    Performance: <TabPerformance filters={filters} onOpen={open} visibleCharts={visibleCharts} />,
    Retention: <TabRetention filters={filters} onOpen={open} visibleCharts={visibleCharts} />,
  }

  /* ── Global KPI values (filter-driven) ── */
  const { fullTime, partTime } = useMemo(() => getFacultyData(filters), [filters]);
  const totalFacultyKpi = fullTime + partTime;
  const ftPctKpi = totalFacultyKpi > 0 ? Math.round((fullTime / totalFacultyKpi) * 100) : 65;
  const totalStudentsKpi = useMemo(() => getTotalStudents(filters), [filters]);
  const ratioKpi = totalFacultyKpi > 0 ? (totalStudentsKpi / totalFacultyKpi).toFixed(1) : '—';
  const activeColleges = filters.college !== 'All' ? 1 : 5;

  return (
    <div className="space-y-5">
      {/* ── 1. Analytics Tab Navigation (top) ── */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-2 flex flex-wrap gap-1">
        {TABS.map(tab => (
          <button key={tab} onClick={() => selectTab(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'text-muted hover:bg-lilac/10 hover:text-primary'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── 2. Centralized Live Filters (SPARDS Analytics layout) ── */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm px-5 pt-4 pb-4 space-y-4">
        {/* Row 1: Live label + filter dropdowns */}
        <div className="flex flex-wrap items-end gap-5">
          {/* Live Filters label */}
          <div className="flex items-center gap-1.5 pb-1.5 shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-lilac">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-widest text-lilac">Live Filters</span>
          </div>

          {/* Academic Year */}
          <div className="flex flex-col gap-1 min-w-0">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Academic Year</label>
            <select value={academicYear} onChange={e => setAcademicYear(e.target.value)}
              className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary hover:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac/25 cursor-pointer min-w-[130px]">
              {ACADEMICS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Campus */}
          <div className="flex flex-col gap-1 min-w-0">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Campus</label>
            <select value={campus} onChange={e => setCampus(e.target.value)}
              className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary hover:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac/25 cursor-pointer min-w-[160px]">
              {CAMPUSES.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* College */}
          <div className="flex flex-col gap-1 min-w-0">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">College</label>
            <select value={college} onChange={e => { setCollege(e.target.value); setProgram('All'); }}
              className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary hover:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac/25 cursor-pointer min-w-[110px]">
              {COLLEGE_LIST.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Program */}
          <div className="flex flex-col gap-1 min-w-0">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Program</label>
            <select value={program} onChange={e => setProgram(e.target.value)}
              className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary hover:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac/25 cursor-pointer min-w-[120px]">
              {programOpts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {/* Employment Status */}
          <div className="flex flex-col gap-1 min-w-0">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Employment Status</label>
            <select value={employmentStatus} onChange={e => setEmploymentStatus(e.target.value)}
              className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary hover:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac/25 cursor-pointer min-w-[140px]">
              {EMP_STATUS_OPTS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {hasActiveFilter && (
            <button onClick={handleResetFilters}
              className="rounded-xl px-3 py-2 text-xs text-muted hover:text-primary hover:bg-lilac/10 transition-colors flex items-center gap-1.5 self-end">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Reset
            </button>
          )}
        </div>

        {/* Row 2: Actions aligned right */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-lilac/8">
          <ChartSelection charts={currentCharts} visible={visibleCharts} onChange={handleChartVisibility} />
          <button onClick={() => showToast({ type: 'success', title: 'All page data exported.', body: `${activeTab} data downloaded.` })}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3v13M7 11l5 5 5-5M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Export All
          </button>
        </div>
      </div>

      {/* ── 3. Global KPI Cards (SPARDS Analytics design pattern) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiBadge label="Total Faculty" value={totalFacultyKpi} accent="#200D2D"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M3 21c0-4 2.7-7 6-7s6 3 6 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M21 21c0-3.37-1.57-5.92-3.5-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>} />
        <KpiBadge label="Full-Time Faculty" value={fullTime} accent="#BB96E4"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.6"/></svg>} />
        <KpiBadge label="Part-Time Faculty" value={partTime} accent="#FFD066"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>} />
        <KpiBadge label="Full-Time Rate" value={`${ftPctKpi}%`} accent="#00875A"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
        <KpiBadge label="Student-Faculty Ratio" value={`${ratioKpi}:1`} accent="#4C1413"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.6"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>} />
      </div>

      {/* ── 4. Tab Content (Charts & Analytics) ── */}
      {tabContent[activeTab]}
      {currentCharts.every((chart) => !visibleCharts.has(chart.id)) && (
        <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-12 text-center">
          <p className="text-sm font-bold text-primary">All {activeTab.toLowerCase()} charts are hidden</p>
          <p className="mt-1 text-xs text-muted">Use Chart Selection to restore one or more visualizations.</p>
        </section>
      )}

      {chartModal && (
        <ChartModal
          title={chartModal.title}
          description={chartModal.description}
          chart={chartModal.chart}
          insights={chartModal.insights}
          onClose={() => setChartModal(null)}
          onExport={() => {
            showToast({ type: "success", title: "Chart exported." })
            setChartModal(null)
          }}
        />
      )}
    </div>
  )
}
