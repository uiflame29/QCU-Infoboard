import { useState, useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { useApp } from "../../context/AppContext"
import ChartModal from "../../components/ChartModal"
import ChartSelection from "../../components/ChartSelection"
import {
  getFacultyData,
  getQualificationData,
  getFacultyRankData,
  getTotalStudents,
} from "../../data/mockData"
import type { FilterState } from "../../types"

/* ─── Constants ────────────────────────────────────────────────── */
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

/* Employee classification scale by filter */
const CLASS_BASE = [
  { name: "Faculty", color: "#BB96E4", base: 240 },
  { name: "Admin Staff", color: "#FFD066", base: 45 },
  { name: "Utilities & Maint.", color: "#FFDBED", base: 20 },
  { name: "Security Guards", color: "#4C1413", base: 15 },
]

const CHART_DEFS = [
  { id: "classification", label: "Employees by Classification" },
  { id: "ftpt", label: "Full-Time vs Part-Time Faculty" },
  { id: "ratio", label: "Student-to-Faculty Ratio" },
  { id: "qualifications", label: "Qualifications by College" },
]

/* ─── Shared sub-components ────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-lilac/20 rounded-xl px-4 py-3 shadow-lg text-xs">
      {label && <p className="font-bold text-primary mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill ?? "#200D2D" }}>
          {p.name}:{" "}
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

function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: string
}) {
  return (
    <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5 flex flex-col gap-1 hover:shadow-md transition-shadow">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="text-3xl font-bold" style={{ color: accent ?? "#200D2D" }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  )
}

function ChartCard({
  title,
  children,
  onViewChart,
  onExportChart,
}: {
  title: string
  children: React.ReactNode
  onViewChart: () => void
  onExportChart: () => void
}) {
  return (
    <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-primary">{title}</p>
        <div className="flex gap-2">
          <button
            onClick={onViewChart}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold bg-lilac/10 text-primary hover:bg-lilac/20 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
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
            View Chart
          </button>
          <button
            onClick={onExportChart}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold bg-golden/15 text-primary hover:bg-golden/25 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
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
      </div>
      {children}
    </div>
  )
}

type ChartModalState = {
  title: string
  description: string
  chart: React.ReactNode
  insights?: string[]
} | null

/* ═══════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════ */
export default function HRDashboard() {
  const { showToast } = useApp()

  /* Filter state */
  const [academicYear, setAcademicYear] = useState("All")
  const [campus, setCampus] = useState("All")
  const [college, setCollege] = useState("All")
  const [program, setProgram] = useState("All")

  const programOpts = useMemo(() => {
    if (college === "All") return ["All", ...Object.values(PROGRAMS_MAP).flat()]
    return ["All", ...(PROGRAMS_MAP[college] ?? [])]
  }, [college])

  const [chartModal, setChartModal] = useState<ChartModalState>(null)
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(
    new Set(CHART_DEFS.map((c) => c.id)),
  )

  /* Build FilterState for mockData helpers */
  const filters = useMemo<FilterState>(
    () => ({
      academicYear,
      campus,
      college,
      program,
      yearLevel: "All",
      firstGenStatus: "All",
      employmentStatus: "All",
    }),
    [academicYear, campus, college, program],
  )

  /* Campus scale helper (mirrors mockData getScale) */
  const campusScale = useMemo(() => {
    const cs: Record<string, number> = {
      All: 1,
      "San Bartolome (Main)": 0.62,
      "San Francisco": 0.22,
      "Batasan Campus": 0.16,
    }
    const ys: Record<string, number> = {
      All: 1,
      "2024–2025": 0.92,
      "2025–2026": 0.96,
      "2026–2027": 1,
    }
    return (cs[campus] ?? 1) * (ys[academicYear] ?? 1)
  }, [campus, academicYear])

  /* ── Dynamic data ── */
  const classificationData = useMemo(
    () =>
      CLASS_BASE.map((d) => ({
        ...d,
        value: Math.round(d.base * campusScale),
      })),
    [campusScale],
  )

  const { fullTime, partTime } = useMemo(
    () => getFacultyData(filters),
    [filters],
  )

  const ftPtData = useMemo(
    () => [
      { name: "Full-Time", value: fullTime, color: "#200D2D" },
      { name: "Part-Time", value: partTime, color: "#BB96E4" },
    ],
    [fullTime, partTime],
  )

  const qualData = useMemo(() => getQualificationData(filters), [filters])
  const rankData = useMemo(() => getFacultyRankData(filters), [filters])

  const totalFaculty = fullTime + partTime
  const totalEmployees = Math.round((320 / 240) * totalFaculty)
  const adminStaff = Math.round(45 * campusScale)
  const utilities = Math.round(20 * campusScale)
  const security = Math.round(15 * campusScale)

  const totalStudents = useMemo(() => getTotalStudents(filters), [filters])
  const ratio =
    totalFaculty > 0 ? (totalStudents / totalFaculty).toFixed(1) : "—"
  const ratioData = useMemo(
    () => [
      {
        name: "Ratio",
        value: parseFloat(ratio as string) || 41.6,
        fill: "#BB96E4",
      },
    ],
    [ratio],
  )

  /* ── Actions ── */
  function handleExport(chart: string) {
    showToast({
      type: "success",
      title: "Chart exported.",
      body: `${chart} data downloaded.`,
    })
  }
  function handleExportAll() {
    showToast({
      type: "success",
      title: "All page data exported.",
      body: "HR Dashboard data downloaded.",
    })
  }
  function handleResetFilters() {
    setAcademicYear("All")
    setCampus("All")
    setCollege("All")
    setProgram("All")
  }
  const hasActiveFilter =
    academicYear !== "All" ||
    campus !== "All" ||
    college !== "All" ||
    program !== "All"

  /* ── Chart modal configs ── */
  function openViewChart(id: string) {
    const configs: Record<string, ChartModalState> = {
      classification: {
        title: "Employees by Classification",
        description:
          "Breakdown of all QCU employees by their classification category.",
        chart: (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={classificationData}
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
                {classificationData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: "13px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ),
        insights: [
          `Faculty make up ${Math.round((totalFaculty / totalEmployees) * 100)}% of total workforce`,
          `Admin staff: ${adminStaff}, Support services: ${utilities + security}`,
          "Security headcount is below national campus benchmark",
        ],
      },
      ftpt: {
        title: "Full-Time vs Part-Time Faculty",
        description:
          "Distribution of faculty employment type across all colleges.",
        chart: (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={ftPtData}
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
                {ftPtData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: "13px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ),
        insights: [
          `Full-time rate: ${
            totalFaculty > 0 ? Math.round((fullTime / totalFaculty) * 100) : 65
          }% of faculty headcount`,
          "Part-time faculty concentrated in COE and COED",
          "Target: increase full-time rate to 75% by AY 2027–2028",
        ],
      },
      ratio: {
        title: "Student-to-Faculty Ratio",
        description: "Current student-to-faculty ratio versus CHED benchmark.",
        chart: (
          <div className="flex items-center justify-center gap-16 h-[380px]">
            <div style={{ width: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="60%"
                  innerRadius="50%"
                  outerRadius="90%"
                  data={ratioData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    dataKey="value"
                    fill="#BB96E4"
                    background={{ fill: "#F7F4FC" }}
                    cornerRadius={10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary">{ratio}:1</p>
                <p className="text-sm text-muted mt-2">Current Ratio</p>
              </div>
              <div className="rounded-2xl bg-blossom px-6 py-4 text-center">
                <p className="text-sm font-semibold text-primary">
                  CHED Benchmark
                </p>
                <p className="text-3xl font-bold text-lilac mt-1">45.0:1</p>
                <p className="text-xs text-muted mt-1">
                  {parseFloat(ratio as string) < 45
                    ? "Below benchmark ✓"
                    : "Above benchmark !"}
                </p>
              </div>
            </div>
          </div>
        ),
        insights: [
          `Current ratio of ${ratio}:1 ${
            parseFloat(ratio as string) < 45 ? "is within" : "exceeds"
          } CHED recommended range`,
          `${totalStudents.toLocaleString()} students / ${totalFaculty} faculty`,
          "Hiring 5 additional full-time faculty would further improve the ratio",
        ],
      },
      qualifications: {
        title: "Qualifications by College",
        description:
          "Stacked view of faculty academic qualifications per college.",
        chart: (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={qualData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
              <XAxis dataKey="dept" tick={{ fontSize: 13, fill: "#7B6891" }} />
              <YAxis tick={{ fontSize: 13, fill: "#7B6891" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "13px" }} />
              <Bar dataKey="phd" name="Doctorate" stackId="a" fill="#200D2D" />
              <Bar
                dataKey="masters"
                name="Master's"
                stackId="a"
                fill="#BB96E4"
              />
              <Bar
                dataKey="bachelors"
                name="Bachelor's"
                stackId="a"
                fill="#FFD066"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ),
        insights: [
          "CCS has highest doctorate count (10); COED lowest (4)",
          "Master's degree holders dominate across all colleges",
          "COA has smallest proportion of bachelor-only faculty",
        ],
      },
    }
    setChartModal(configs[id] ?? null)
  }

  return (
    <div className="space-y-6">
      {/* ── Live Filters ── */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex items-center gap-2 shrink-0">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              className="text-lilac"
            >
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-widest text-lilac">
              Live Filters
            </span>
          </div>
          <FilterSelect
            label="Academic Year"
            value={academicYear}
            onChange={setAcademicYear}
            options={ACADEMICS}
          />
          <FilterSelect
            label="Campus"
            value={campus}
            onChange={setCampus}
            options={CAMPUSES}
          />
          <FilterSelect
            label="College"
            value={college}
            onChange={(v) => {
              setCollege(v)
              setProgram("All")
            }}
            options={COLLEGE_LIST}
          />
          <FilterSelect
            label="Program"
            value={program}
            onChange={setProgram}
            options={programOpts}
          />
          {hasActiveFilter && (
            <button
              onClick={handleResetFilters}
              className="rounded-xl px-3 py-1.5 text-xs text-muted hover:text-primary hover:bg-lilac/10 transition-colors flex items-center gap-1"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Reset
            </button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <ChartSelection
              charts={CHART_DEFS}
              visible={visibleCharts}
              onChange={(id, checked) =>
                setVisibleCharts((prev) => {
                  const next = new Set(prev)
                  checked ? next.add(id) : next.delete(id)
                  return next
                })
              }
            />
            <button
              onClick={handleExportAll}
              className="rounded-xl px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Total Employees"
          value={totalEmployees}
          sub="All staff categories"
        />
        <KpiCard
          label="Faculty Headcount"
          value={totalFaculty}
          sub="Teaching workforce"
          accent="#BB96E4"
        />
        <KpiCard
          label="Admin Staff"
          value={adminStaff}
          sub="Administrative personnel"
          accent="#200D2D"
        />
        <KpiCard
          label="Utilities & Maint."
          value={utilities}
          sub="Support services"
          accent="#4C1413"
        />
        <KpiCard
          label="Security Guards"
          value={security}
          sub="Campus security"
          accent="#7B6891"
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {visibleCharts.has("classification") && (
          <ChartCard
            title="Employees by Classification"
            onExportChart={() => handleExport("Employee Classification")}
            onViewChart={() => openViewChart("classification")}
          >
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classificationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {classificationData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {visibleCharts.has("ftpt") && (
          <ChartCard
            title="Full-Time vs Part-Time Faculty"
            onExportChart={() => handleExport("FT/PT Distribution")}
            onViewChart={() => openViewChart("ftpt")}
          >
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ftPtData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {ftPtData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {visibleCharts.has("ratio") && (
          <ChartCard
            title="Student-to-Faculty Ratio"
            onExportChart={() => handleExport("Student-Faculty Ratio")}
            onViewChart={() => openViewChart("ratio")}
          >
            <div className="h-52 flex items-center gap-8 px-4">
              <div className="flex-1 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="60%"
                    innerRadius="55%"
                    outerRadius="90%"
                    data={ratioData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      dataKey="value"
                      fill="#BB96E4"
                      background={{ fill: "#F7F4FC" }}
                      cornerRadius={8}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{ratio}:1</p>
                  <p className="text-xs text-muted mt-1">Current Ratio</p>
                </div>
                <div className="rounded-xl bg-blossom px-3 py-2 text-center">
                  <p className="text-xs font-semibold text-primary">
                    Benchmark
                  </p>
                  <p className="text-lg font-bold text-lilac">45.0:1</p>
                  <p className="text-[10px] text-muted mt-0.5">
                    {parseFloat(ratio as string) < 45
                      ? "Below benchmark ✓"
                      : "Above benchmark !"}
                  </p>
                </div>
              </div>
            </div>
          </ChartCard>
        )}

        {visibleCharts.has("qualifications") && (
          <ChartCard
            title="Qualifications by College"
            onExportChart={() => handleExport("Qualifications Data")}
            onViewChart={() => openViewChart("qualifications")}
          >
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={qualData}
                  margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBF8" />
                  <XAxis
                    dataKey="dept"
                    tick={{ fontSize: 10, fill: "#7B6891" }}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#7B6891" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Bar
                    dataKey="phd"
                    name="Doctorate"
                    stackId="a"
                    fill="#200D2D"
                  />
                  <Bar
                    dataKey="masters"
                    name="Master's"
                    stackId="a"
                    fill="#BB96E4"
                  />
                  <Bar
                    dataKey="bachelors"
                    name="Bachelor's"
                    stackId="a"
                    fill="#FFD066"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}
      </div>

      {/* ── Academic Rank Summary ── */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
        <p className="text-sm font-bold text-primary mb-4">
          Faculty by Academic Rank
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {rankData.map((r) => (
            <div
              key={r.rank}
              className="rounded-xl bg-blossom/30 p-3 text-center"
            >
              <p className="text-xl font-bold text-primary">{r.count}</p>
              <p className="text-[10px] text-muted mt-0.5">{r.rank}</p>
            </div>
          ))}
        </div>
      </div>

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
