import { useMemo, useState, type ReactNode } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import ChartModal from "../../components/ChartModal"
import SynergyFilterPanel, {
  SynergyFilterSelect,
} from "../../components/SynergyFilterPanel"
import { useApp } from "../../context/AppContext"
import ChartDataSummary from "../../components/ChartDataSummary"

type ChartId = "geographic" | "ageStatus" | "capacity" | "retention"
type FilterKey = "term" | "college" | "program" | "classification"

type ModuleFilters = Record<FilterKey, string>

const DEFAULT_FILTERS: ModuleFilters = {
  term: "AY 2026-2027 1st Sem",
  college: "All colleges",
  program: "All programs",
  classification: "All classifications",
}

const CHARTS: { id: ChartId; label: string }[] = [
  { id: "geographic", label: "Student Geographic Origin" },
  { id: "ageStatus", label: "Age Range & Civil Status" },
  { id: "capacity", label: "Program Enrollees & Capacity Utilization" },
  {
    id: "retention",
    label: "Retention, Attrition & Graduation Rate Projections",
  },
]

const GEOGRAPHIC_DATA = [
  { district: "District 1", students: 2000},
  { district: "District 2", students: 2500 },
  { district: "District 3", students: 1800 },
  { district: "District 4", students: 2200 },
  { district: "District 5", students: 1500 },
  { district: "District 6", students: 1800 },
  { district: "Non-QC", students: 722 },
]

const AGE_STATUS_DATA = [
  { age: "16–20", single: 9193, married: 50, widowed: 2, separated: 5 },
  { age: "21–25", single: 4088, married: 350, widowed: 12, separated: 25 },
  { age: "26+", single: 319, married: 700, widowed: 45, separated: 61 },
]

const COLLEGE_ORDER = ["COA", "COB", "CCS", "COE", "COED"] as const
const PILLAR_PROGRAMS: Record<string, string[]> = {
  CCS: ["BSIT", "BSIS", "BSCS"],
  COB: ["BSEtrep", "MSENT"],
  COA: ["BSA", "BSMA"],
  COE: ["BSEE", "BSIE", "BSCpE", "BSECE"],
  COED: ["BECED"],
}
const PROGRAM_NAMES: Record<string, string> = {
  BSIT: "Information Technology",
  BSIS: "Information Systems",
  BSCS: "Computer Science",
  BSEtrep: "Entrepreneurship",
  MSENT: "Master of Science in Entrepreneurship",
  BSA: "Accountancy",
  BSMA: "Management Accounting",
  BSEE: "Electrical Engineering",
  BSIE: "Industrial Engineering",
  BSECE: "Electronics Engineering",
  BSCpE: "Computer Engineering",
  BECED: "Early Childhood Education",
}
const PROGRAM_CAPACITY = [
  { college: "CCS", program: "BSIT", enrolled: 2704, capacity: 3000, status: "Near Capacity", color: "#333333" },
  { college: "CCS", program: "BSCS", enrolled: 436, capacity: 500, status: "Near Capacity", color: "#333333" },
  { college: "CCS", program: "BSIS", enrolled: 282, capacity: 500, status: "Optimal", color: "#333333" },
  { college: "COE", program: "BSCE", enrolled: 754, capacity: 1000, status: "Optimal", color: "#FF6B00" },
  { college: "COE", program: "BSECE", enrolled: 50, capacity: 100, status: "Optimal", color: "#FF6B00" },
  { college: "COE", program: "BSIE", enrolled: 1737, capacity: 1800, status: "Full Capacity", color: "#FF6B00" },
  { college: "COE", program: "BSCpE", enrolled: 202, capacity: 300, status: "Optimal", color: "#FF6B00" },
  { college: "COB", program: "MSENT", enrolled: 37, capacity: 100, status: "Optimal", color: "#FFC700" },
  { college: "COB", program: "BSEtrep", enrolled: 3598, capacity: 4000, status: "Near Capacity", color: "#FFC700" },
  { college: "COA", program: "BSA", enrolled: 933, capacity: 1000, status: "Near Capacity", color: "#00875A" },
  { college: "COA", program: "BSMA", enrolled: 807, capacity: 1000, status: "Near Capacity", color: "#00875A" },
  { college: "COED", program: "BECED", enrolled: 982, capacity: 1000, status: "Full Capacity", color: "#0052CC" },
]
const CAPACITY_PROGRAM_ORDER = PROGRAM_CAPACITY.map((row) => row.program)

const COHORT_OUTCOMES = [
  { academicYear: "AY 2023–2024", cohort: "Cohort 2023", enrolled: 3500, retained: 3381, attrition: 119, attritionRate: 3.4, benchmark: "Ceiling ≤ 4.0%", graduationRate: 88.5, graduationType: "Actual", status: "On Track" },
  { academicYear: "AY 2024–2025", cohort: "Cohort 2024", enrolled: 3650, retained: 3518, attrition: 132, attritionRate: 3.6, benchmark: "Ceiling ≤ 4.0%", graduationRate: 87.2, graduationType: "Projected", status: "On Track" },
  { academicYear: "AY 2025–2026", cohort: "Cohort 2025", enrolled: 3800, retained: 3655, attrition: 145, attritionRate: 3.8, benchmark: "Ceiling ≤ 4.0%", graduationRate: 86.0, graduationType: "Projected", status: "On Track" },
  { academicYear: "AY 2026–2027", cohort: "Cohort 2026", enrolled: 3900, retained: 3744, attrition: 156, attritionRate: 4.0, benchmark: "Ceiling ≤ 4.0%", graduationRate: 85.5, graduationType: "Projected", status: "On Track" },
]

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid rgba(187,150,228,.3)",
  background: "#FFFFFF",
  color: "#200D2D",
  boxShadow: "0 12px 32px rgba(32,13,45,.2)",
  fontSize: 11,
  maxWidth: 320,
  whiteSpace: "normal" as const,
}

function Icon({
  type,
}: {
  type: "filter" | "export" | "map" | "people" | "capacity" | "trend" | "owner" | "info"
}) {
  const paths = {
    filter: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />,
    export: (
      <>
        <path d="M12 3v12m0 0l-4-4m4 4 4-4M4 19h16" />
      </>
    ),
    map: (
      <>
        <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3zM9 3v15m6-12v15" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M17 11a3 3 0 100-6m1 9c2.3.5 3.5 2.1 3.5 4.5" />
      </>
    ),
    capacity: (
      <>
        <path d="M4 20V9m5 11V4m5 16v-7m5 7V7" />
        <path d="M2 20h20" />
      </>
    ),
    trend: (
      <>
        <path d="M4 18l5-5 4 3 7-9" />
        <path d="M15 7h5v5" />
      </>
    ),
    owner: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M17 11h4m-2-2v4" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6m0-10h.01" />
      </>
    ),
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[type]}
    </svg>
  )
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  onClick,
  tone = "lilac",
}: {
  icon: Parameters<typeof Icon>[0]["type"]
  label: string
  value: string
  detail: string
  onClick: () => void
  tone?: "lilac" | "gold" | "rose"
}) {
  const tones = {
    lilac: "bg-lilac/15 text-primary",
    gold: "bg-golden/25 text-obsidian",
    rose: "bg-blossom text-obsidian",
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-3xl border border-lilac/20 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lilac/50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-lilac/20"
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}
      >
        <Icon type={icon} />
      </span>
      <span className="mt-5 block text-[9px] font-bold uppercase tracking-[.16em] text-muted">
        {label}
      </span>
      <span className="mt-2 block text-2xl font-bold text-primary count-animate">
        {value}
      </span>
      <span className="mt-1 block text-[10px] leading-relaxed text-muted">
        {detail}
      </span>
    </button>
  )
}

function EmptyState({
  message,
  onReset,
}: {
  message: string
  onReset: () => void
}) {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-lilac/35 bg-surface/60 px-6 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blossom text-obsidian">
        <Icon type="info" />
      </span>
      <p className="mt-3 text-sm font-bold text-primary">
        No sample data for this selection
      </p>
      <p className="mt-1 max-w-md text-[10px] leading-relaxed text-muted">
        {message}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-lilac/25"
      >
        Restore documented scope
      </button>
    </div>
  )
}

function ChartCard({
  title,
  eyebrow,
  description,
  owner,
  note,
  onView,
  onExport,
  summary,
  children,
  className = "",
}: {
  title: string
  eyebrow: string
  description: string
  owner: string
  note: string
  onView: () => void
  onExport: () => void
  summary?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="flex flex-col gap-3 border-b border-lilac/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">
            {eyebrow}
          </p>
          <p className="mt-1 text-base font-bold text-primary">{title}</p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onView}
            className="rounded-xl border border-lilac/25 px-3 py-2 text-[10px] font-bold text-primary hover:bg-lilac/10 focus:outline-none focus:ring-4 focus:ring-lilac/20"
          >
            View Chart
          </button>
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-bold text-white hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-lilac/25"
          >
            <Icon type="export" />
            Export
          </button>
        </div>
      </div>
      <div className="mt-4 min-h-72">{children}</div>
      {summary}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-lilac/10 pt-3 text-[9px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Icon type="owner" /> Data owner{owner.includes(",") ? "s" : ""}:{" "}
          <strong className="text-primary">{owner}</strong>
        </span>
        <span className="rounded-full bg-lilac/10 px-2.5 py-1 font-semibold text-primary">
          {note}
        </span>
      </div>
    </section>
  )
}

export default function PresidentStudentEngagement() {
  const { currentUser, showToast } = useApp()
  const [filters, setFilters] = useState<ModuleFilters>(DEFAULT_FILTERS)
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(
    new Set(CHARTS.map((chart) => chart.id)),
  )
  const [activeChart, setActiveChart] = useState<ChartId | null>(null)

  const classificationSupported =
    filters.classification === DEFAULT_FILTERS.classification
  const termSupported = filters.term === DEFAULT_FILTERS.term
  const aggregateAvailable = termSupported && classificationSupported
  const selectedCollege =
    filters.college === "All colleges" ? "All" : filters.college
  const selectedProgram =
    filters.program === "All programs" ? "All" : filters.program
  const programOptions = [
    "All programs",
    ...new Set(selectedCollege === "All"
      ? COLLEGE_ORDER.flatMap((college) => PILLAR_PROGRAMS[college] ?? [])
      : (PILLAR_PROGRAMS[selectedCollege] ?? [])),
  ]
  const officialProgramsInScope = COLLEGE_ORDER.filter(
    (college) => selectedCollege === "All" || college === selectedCollege,
  )
    .flatMap((college) =>
      (PILLAR_PROGRAMS[college] ?? []).map((program) => ({
        college,
        program,
        enrolled: PROGRAM_CAPACITY.find(row => row.program === program)?.enrolled ?? null,
      })),
    )
    .filter(
      (row) => selectedProgram === "All" || row.program === selectedProgram,
    )
  const capacityRows = useMemo(() => {
    if (!aggregateAvailable) return []
    return PROGRAM_CAPACITY
      .filter(row =>
        (selectedCollege === "All" || row.college === selectedCollege) &&
        (selectedProgram === "All" || row.program === selectedProgram),
      )
      .map((row) => ({
        ...row,
        utilization: row.capacity ? (row.enrolled / row.capacity) * 100 : 0,
        available: Math.max(0, row.capacity - row.enrolled),
      }))
      .sort((left, right) =>
        CAPACITY_PROGRAM_ORDER.indexOf(left.program) -
        CAPACITY_PROGRAM_ORDER.indexOf(right.program),
      )
  }, [aggregateAvailable, selectedCollege, selectedProgram])
  const retentionRows = aggregateAvailable ? COHORT_OUTCOMES : []
  const missingCapacityRows = aggregateAvailable && selectedProgram !== "All"
    ? officialProgramsInScope.filter(
        (official) =>
          !capacityRows.some(
            (row) =>
              row.college === official.college &&
              row.program === official.program,
          ),
      )
    : []
  const retentionAvailable = retentionRows.length > 0
  const capacityTotals = useMemo(() => {
    const enrolled = capacityRows.reduce((sum, row) => sum + row.enrolled, 0)
    const capacity = capacityRows.reduce((sum, row) => sum + row.capacity, 0)
    return {
      enrolled,
      capacity,
      available: Math.max(0, capacity - enrolled),
      utilization: capacity ? (enrolled / capacity) * 100 : 0,
    }
  }, [capacityRows])
  const retentionTotals = useMemo(() => {
    const enrolled = retentionRows.reduce((sum, row) => sum + row.enrolled, 0)
    const retained = retentionRows.reduce((sum, row) => sum + row.retained, 0)
    const weightedGraduationRate = enrolled
      ? retentionRows.reduce((sum, row) => sum + row.graduationRate * row.enrolled, 0) / enrolled
      : 0
    return {
      enrolled,
      retained,
      attrition: enrolled - retained,
      retentionRate: enrolled ? (retained / enrolled) * 100 : 0,
      attritionRate: enrolled ? ((enrolled - retained) / enrolled) * 100 : 0,
      weightedGraduationRate,
    }
  }, [retentionRows])
  const scope = `${filters.term} · ${filters.college} · ${filters.program} · ${filters.classification}`
  const atDefault = Object.entries(DEFAULT_FILTERS).every(
    ([key, value]) => filters[(key as FilterKey)] === value,
  )
  const activeFilterCount = Object.entries(DEFAULT_FILTERS).filter(
    ([key, value]) => filters[(key as FilterKey)] !== value,
  ).length

  const exportRows =
    useMemo<Record<ChartId, Record<string, string | number>[]>>(
      () => ({
        geographic: aggregateAvailable
          ? GEOGRAPHIC_DATA.map((row) => ({
              District: row.district,
              Students: row.students,
              "Data Owners": "Registrar, Admissions",
              "Active Scope": scope,
              "Data Status":
                "Aggregate sample; not segmented by college or program",
            }))
          : [],
        ageStatus: aggregateAvailable
          ? AGE_STATUS_DATA.flatMap((row) =>
              ([
                ["Single", row.single],
                ["Married", row.married],
                ["Widowed", row.widowed],
                ["Separated", row.separated],
              ] as const).map(([category, students]) => ({
                "Age Range": row.age,
                Category: category,
                Students: students,
                "Data Owners": "OSAS, Guidance Center",
                "Active Scope": scope,
              })),
            )
          : [],
        capacity: [
          ...capacityRows.map((row) => ({
            College: row.college,
            "Program Code": row.program,
            "Program Name": PROGRAM_NAMES[row.program],
            Enrollees: row.enrolled,
            "Max Capacity": row.capacity,
            "Available Spaces": row.available,
            Utilization: `${row.utilization.toFixed(1)}%`,
            "Gauge Indicator Status": row.status,
            "Data Owners": "Deans / Registrar",
            "Active Scope": scope,
          })),
          ...missingCapacityRows.map((row) => ({
            College: row.college,
            Program: row.program,
            Enrollees: row.enrolled ?? "Not available",
            Capacity: "Not configured",
            "Available Spaces": "Not available",
            Utilization: "Not available",
            "Data Owners": "Deans / Registrar",
            "Active Scope": scope,
          })),
        ],
        retention: retentionRows.map((row) => ({
            "Academic Year": row.academicYear,
            Cohort: row.cohort,
            "Initial Enrolled": row.enrolled,
            Retained: row.retained,
            "Attrition Count": row.attrition,
            "Attrition Rate": `${row.attritionRate.toFixed(1)}%`,
            "Benchmark Target": row.benchmark,
            "Graduation Rate": `${row.graduationRate.toFixed(1)}%`,
            "Graduation Measure": row.graduationType,
            Status: row.status,
            "Data Owners": "Planning Office, OSAS",
            "Active Scope": scope,
          })),
      }),
      [
        aggregateAvailable,
        capacityRows,
        missingCapacityRows,
        retentionRows,
        scope,
      ],
    )

  function updateFilter(key: FilterKey, value: string) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      ...(key === "college" ? { program: "All programs" } : {}),
      ...(key === "program" && value !== "All programs" && previous.college === "All colleges"
        ? {
            college:
              PROGRAM_CAPACITY.find((row) => row.program === value)?.college ??
              COLLEGE_ORDER.find((college) =>
                (PILLAR_PROGRAMS[college] ?? []).includes(value),
              ) ?? previous.college,
          }
        : {}),
    }))
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
    showToast({
      type: "info",
      title: "University-wide scope restored",
      body: "AY 2026-2027 1st Sem · All colleges · All programs · All classifications.",
    })
  }

  function toggleChart(id: string, checked: boolean) {
    setVisibleCharts((previous) => {
      const next = new Set(previous)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function downloadCsv(
    filename: string,
    rows: Record<string, string | number>[],
    title: string,
  ) {
    if (!rows.length) {
      showToast({
        type: "warning",
        title: "Nothing to export",
        body: "The source provides no sample records for the active filter combination.",
      })
      return
    }
    const headers = Object.keys(rows[0])
    const csv = [
      headers.map((header) => `"${header}"`).join(","),
      ...rows.map((row) =>
        headers
          .map(
            (header) => `"${String(row[header] ?? "").replaceAll('"', '""')}"`,
          )
          .join(","),
      ),
    ].join("\n")
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    showToast({
      type: "success",
      title,
      body: "The displayed sample values, data owners, and active filter context were downloaded as CSV.",
    })
  }

  function exportChart(id: ChartId) {
    downloadCsv(
      `QCU-Dynamic-Student-Engagement-${id}.csv`,
      exportRows[id],
      "Chart data exported",
    )
  }

  function exportPage() {
    const rows = CHARTS.filter((chart) => visibleCharts.has(chart.id)).flatMap(
      (chart) =>
        exportRows[chart.id].map((row) => ({
          Visualization: chart.label,
          ...row,
        })),
    )
    downloadCsv(
      "QCU-Dynamic-Student-Engagement-Page.csv",
      rows,
      "Page data exported",
    )
  }

  function geographicChart(large = false) {
    if (!aggregateAvailable)
      return (
        <EmptyState
          message="The district sample is supplied only for AY 2026-2027 1st Sem and is not segmented by student classification."
          onReset={resetFilters}
        />
      )
    const total = GEOGRAPHIC_DATA.reduce((sum, row) => sum + row.students, 0)
    return (
      <div
        className={large ? "h-[410px]" : "h-72"}
        aria-label="Student geographic origin by Quezon City district"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={GEOGRAPHIC_DATA}
            layout="vertical"
            margin={{ top: 6, right: 48, left: 12, bottom: 4 }}
          >
            <CartesianGrid horizontal={false} stroke="rgba(187,150,228,.16)" />
            <XAxis
              type="number"
              tick={{ fontSize: 9, fill: "#7B6891" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="district"
              type="category"
              width={70}
              tick={{ fontSize: 10, fill: "#7B6891" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              shared={false}
              cursor={{ fill: "rgba(187,150,228,.08)" }}
              contentStyle={tooltipStyle}
              itemStyle={{ color: "#200D2D", fontWeight: 600 }}
              labelStyle={{
                color: "#7B6891",
                fontWeight: 700,
                marginBottom: 6,
              }}
              wrapperStyle={{ zIndex: 50, pointerEvents: "none" }}
              allowEscapeViewBox={{ x: true, y: true }}
              formatter={(value) => [
                `${Number(value).toLocaleString()} students · ${((Number(value) / total) * 100).toFixed(1)}% of district sample`,
                "Students",
              ]}
              labelFormatter={(district) => `${district} · Geographic origin`}
            />
            <Bar
              dataKey="students"
              fill="#BB96E4"
              radius={[0, 9, 9, 0]}
              maxBarSize={large ? 42 : 34}
            >
              <LabelList
                dataKey="students"
                position="right"
                formatter={(value: unknown) => Number(value).toLocaleString()}
                fill="#200D2D"
                fontSize={10}
                fontWeight={700}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  function ageStatusChart(large = false) {
    if (!aggregateAvailable)
      return (
        <EmptyState
          message="The age and civil-status sample is supplied only for AY 2026-2027 1st Sem and is not segmented by student classification."
          onReset={resetFilters}
        />
      )
    return (
      <div
        className={large ? "h-[410px]" : "h-72"}
        aria-label="Age range and civil status stacked bar chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={AGE_STATUS_DATA}
            margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
          >
            <CartesianGrid vertical={false} stroke="rgba(187,150,228,.16)" />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 10, fill: "#7B6891" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#7B6891" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              shared={false}
              cursor={{ fill: "rgba(187,150,228,.08)" }}
              contentStyle={tooltipStyle}
              itemStyle={{ color: "#200D2D", fontWeight: 600 }}
              labelStyle={{
                color: "#7B6891",
                fontWeight: 700,
                marginBottom: 6,
              }}
              wrapperStyle={{ zIndex: 50, pointerEvents: "none" }}
              allowEscapeViewBox={{ x: true, y: true }}
              formatter={(value, name, entry) => {
                const ageTotal =
                  Number(entry.payload.single) + Number(entry.payload.married) +
                  Number(entry.payload.widowed) + Number(entry.payload.separated)
                return [
                  `${Number(value).toLocaleString()} students · ${((Number(value) / ageTotal) * 100).toFixed(1)}% of ${entry.payload.age}`,
                  String(name).replace(/^./, (character) => character.toUpperCase()),
                ]
              }}
              labelFormatter={(age) => `Age range ${age}`}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) =>
                String(value).replace(/^./, (character) => character.toUpperCase())
              }
            />
            <Bar dataKey="single" stackId="status" fill="#BB96E4">
              <LabelList
                dataKey="single"
                position="center"
                fill="#200D2D"
                fontSize={9}
                fontWeight={700}
              />
            </Bar>
            <Bar
              dataKey="married"
              stackId="status"
              fill="#4C1413"
            >
              <LabelList
                dataKey="married"
                position="center"
                fill="#FFFFFF"
                fontSize={9}
                fontWeight={700}
              />
            </Bar>
            <Bar dataKey="widowed" stackId="status" fill="#FFD066">
              <LabelList
                dataKey="widowed"
                position="center"
                fill="#200D2D"
                fontSize={9}
                fontWeight={700}
              />
            </Bar>
            <Bar
              dataKey="separated"
              stackId="status"
              fill="#426BC2"
              radius={[8, 8, 0, 0]}
            >
              <LabelList
                dataKey="separated"
                position="center"
                fill="#FFFFFF"
                fontSize={9}
                fontWeight={700}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  function capacityVisual(large = false) {
    if (!capacityRows.length && !missingCapacityRows.length)
      return (
        <EmptyState
          message="No repository capacity records match the selected term, college, program, and classification scope."
          onReset={resetFilters}
        />
      )
    return (
      <div
        className={`flex flex-col justify-center ${
          large ? "min-h-[410px]" : "min-h-72"
        }`}
      >
        <div className="mb-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Capacity records", String(capacityRows.length)],
            ["Enrollees", capacityTotals.enrolled.toLocaleString()],
            ["Configured capacity", capacityTotals.capacity.toLocaleString()],
            [
              "Weighted utilization",
              `${capacityTotals.utilization.toFixed(1)}%`,
            ],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-surface p-3">
              <p className="text-[8px] font-bold uppercase tracking-wider text-muted">
                {label}
              </p>
              <p className="mt-1 text-sm font-bold text-primary">{value}</p>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-lilac/15">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[1.5fr_.5fr_.65fr_.65fr_1.35fr_.75fr] gap-3 rounded-t-2xl bg-primary px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-white/65">
              <span>Program Code & Name</span>
              <span>College</span>
              <span>Enrollees</span>
              <span>Max Capacity</span>
              <span>Gauge Indicator Status</span>
              <span>Data Owner</span>
            </div>
            {capacityRows.map((row) => (
              <button
                key={`${row.college}-${row.program}`}
                type="button"
                title={`${row.college} · ${row.program}: ${row.enrolled.toLocaleString()} enrollees of ${row.capacity.toLocaleString()} capacity; ${row.utilization.toFixed(1)}% utilized; ${row.available.toLocaleString()} spaces available.`}
                onClick={() =>
                  showToast({
                    type: "info",
                    title: `${row.college} · ${row.program}`,
                    body: `${row.enrolled.toLocaleString()} enrollees of ${row.capacity.toLocaleString()} capacity · ${row.utilization.toFixed(1)}% utilized · ${row.available.toLocaleString()} spaces available.`,
                  })
                }
                className="group relative grid w-full grid-cols-[1.5fr_.5fr_.65fr_.65fr_1.35fr_.75fr] items-center gap-3 border-t border-lilac/10 px-4 py-4 text-left transition-colors first:border-0 hover:bg-lilac/5 focus:bg-lilac/10 focus:outline-none"
              >
                <span className="text-xs font-bold text-primary">
                  {row.program} <span className="font-medium text-muted">· {PROGRAM_NAMES[row.program]}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-primary">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: row.color }}
                  />
                  {row.college}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {row.enrolled.toLocaleString()}
                </span>
                <span className="text-xs text-muted">
                  {row.capacity.toLocaleString()}
                </span>
                <span>
                  <span className="flex items-center justify-between gap-3 text-[10px]">
                    <span className="font-bold text-primary">
                      <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${row.status === "Full Capacity" ? "bg-red-600" : row.status === "Near Capacity" ? "bg-golden" : "bg-coa"}`} />
                      {row.status} · {row.utilization.toFixed(1)}%
                    </span>
                    <span className="font-semibold text-muted">
                      {row.available.toLocaleString()} spaces available
                    </span>
                  </span>
                  <span className="mt-2 block h-2.5 overflow-hidden rounded-full bg-lilac/10">
                    <span
                      className="block h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(row.utilization, 100)}%`,
                        background: row.color,
                      }}
                    />
                  </span>
                </span>
                <span className="text-[9px] font-semibold text-muted">
                  Deans / Registrar
                </span>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-1/2 z-50 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-lilac/25 bg-white px-4 py-3 text-[10px] font-semibold leading-relaxed text-primary opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus:opacity-100"
                >
                  <strong className="block">
                    {row.college} · {row.program}
                  </strong>
                  <span className="mt-1 block text-muted">
                    {row.enrolled.toLocaleString()} enrollees ·{" "}
                    {row.capacity.toLocaleString()} capacity ·{" "}
                    {row.utilization.toFixed(1)}% utilized ·{" "}
                    {row.available.toLocaleString()} spaces available
                  </span>
                </span>
              </button>
            ))}
            {missingCapacityRows.map((row) => (
              <div
                key={`${row.college}-${row.program}-missing-capacity`}
                className="grid grid-cols-[1.5fr_.5fr_.65fr_.65fr_1.35fr_.75fr] items-center gap-3 border-t border-lilac/10 bg-blossom/15 px-4 py-4"
              >
                <span className="text-xs font-bold text-primary">
                  {row.program} · {PROGRAM_NAMES[row.program]}
                </span>
                <span className="text-xs font-bold text-primary">
                  {row.college}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {row.enrolled?.toLocaleString() ?? "Not available"}
                </span>
                <span className="text-[10px] font-semibold text-obsidian">
                  Not configured
                </span>
                <span className="rounded-xl border border-dashed border-lilac/30 bg-white px-3 py-2 text-[9px] font-semibold text-muted">
                  No capacity or available-space record supplied
                </span>
                <span className="text-[9px] font-semibold text-muted">
                  Deans / Registrar
                </span>
              </div>
            ))}
            {!!capacityRows.length && (
              <div className="grid grid-cols-[1.5fr_.5fr_.65fr_.65fr_1.35fr_.75fr] items-center gap-3 border-t-2 border-primary/20 bg-lilac/10 px-4 py-4">
                <span className="text-xs font-extrabold text-primary">
                  {selectedCollege === "All" && selectedProgram === "All" ? "TOTAL UNIVERSITY ENROLLMENT" : "FILTERED SUBTOTAL"}
                </span>
                <span className="text-xs font-extrabold text-primary">All</span>
                <span className="text-xs font-extrabold text-primary">{capacityTotals.enrolled.toLocaleString()}</span>
                <span className="text-xs font-extrabold text-primary">{capacityTotals.capacity.toLocaleString()}</span>
                <span className="text-[10px] font-extrabold text-coa">
                  {capacityTotals.utilization.toFixed(1)}% · {capacityTotals.utilization <= 92 ? "Healthy Capacity" : "Near Capacity"}
                </span>
                <span className="text-[9px] font-bold text-primary">Registrar / SPARD</span>
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-[9px] leading-relaxed text-muted">
          University utilization is calculated from total displayed enrollment ÷
          total displayed configured capacity. Program percentages are never
          averaged.
        </p>
      </div>
    )
  }

  function retentionVisual(large = false) {
    if (!retentionAvailable)
      return (
        <EmptyState
          message="The cohort projection records are available for the documented AY 2026–2027 first-semester institutional scope."
          onReset={resetFilters}
        />
      )
    return (
      <div
        className={`flex flex-col justify-center ${
          large ? "min-h-[410px]" : "min-h-72"
        }`}
      >
        <div className="mb-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Outcome records", String(retentionRows.length)],
            [
              "Weighted retention",
              `${retentionTotals.retentionRate.toFixed(1)}%`,
            ],
            [
              "Weighted attrition",
              `${retentionTotals.attritionRate.toFixed(1)}%`,
            ],
            [
              "Weighted graduation",
              `${retentionTotals.weightedGraduationRate.toFixed(1)}%`,
            ],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-surface p-3">
              <p className="text-[8px] font-bold uppercase tracking-wider text-muted">
                {label}
              </p>
              <p className="mt-1 text-sm font-bold text-primary">{value}</p>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-lilac/15">
          <div className="min-w-[1040px]">
            <div className="grid grid-cols-[1.25fr_.7fr_.7fr_.65fr_.7fr_.9fr_1fr_.65fr] gap-3 rounded-t-2xl bg-primary px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-white/65">
              <span>Academic Year / Cohort</span>
              <span>Initial Enrolled</span>
              <span>Retained</span>
              <span>Attrition</span>
              <span>Attrition Rate</span>
              <span>Benchmark</span>
              <span>Grad Rate</span>
              <span>Status</span>
            </div>
            {retentionRows.map((row) => (
              <button
                key={row.cohort}
                type="button"
                title={`${row.academicYear} · ${row.cohort}: ${row.enrolled.toLocaleString()} initially enrolled; ${row.retained.toLocaleString()} retained; ${row.attrition.toLocaleString()} attrition (${row.attritionRate.toFixed(1)}%); ${row.graduationRate.toFixed(1)}% ${row.graduationType.toLowerCase()} graduation rate; ${row.status}.`}
                onClick={() =>
                  showToast({
                    type: "info",
                    title: `${row.academicYear} · ${row.cohort}`,
                    body: `${row.retained.toLocaleString()} of ${row.enrolled.toLocaleString()} retained · ${row.attritionRate.toFixed(1)}% attrition · ${row.graduationRate.toFixed(1)}% ${row.graduationType.toLowerCase()} graduation rate · ${row.status}.`,
                  })
                }
                className="group relative grid w-full grid-cols-[1.25fr_.7fr_.7fr_.65fr_.7fr_.9fr_1fr_.65fr] items-center gap-3 border-t border-lilac/10 px-4 py-4 text-left transition-colors first:border-0 hover:bg-lilac/5 focus:bg-lilac/10 focus:outline-none"
              >
                <span className="text-xs font-bold text-primary">
                  {row.academicYear}
                  <span className="mt-0.5 block text-[9px] font-semibold text-muted">{row.cohort}</span>
                </span>
                <span className="text-xs font-semibold text-primary">
                  {row.enrolled.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {row.retained.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-primary">
                  {row.attrition.toLocaleString()}
                </span>
                <span>
                  <span className="text-xs font-extrabold text-primary">{row.attritionRate.toFixed(1)}%</span>
                  <span className="mt-2 block h-2 overflow-hidden rounded-full bg-lilac/10">
                    <span className="block h-full rounded-full bg-lilac" style={{ width: `${row.attritionRate / 4 * 100}%` }} />
                  </span>
                </span>
                <span className="text-[10px] font-semibold text-muted">{row.benchmark}</span>
                <span className="text-xs font-extrabold text-primary">
                  {row.graduationRate.toFixed(1)}%
                  <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-wider text-muted">{row.graduationType}</span>
                </span>
                <span className="rounded-full bg-coa/10 px-2.5 py-1 text-center text-[9px] font-bold text-coa">
                  {row.status}
                </span>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-lilac/25 bg-white px-4 py-3 text-[10px] font-semibold leading-relaxed text-primary opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus:opacity-100"
                >
                  <strong className="block">
                    {row.academicYear} · {row.cohort}
                  </strong>
                  <span className="mt-1 block text-muted">
                    {row.enrolled.toLocaleString()} enrolled ·{" "}
                    {row.retained.toLocaleString()} retained ·{" "}
                    {row.attrition.toLocaleString()} attrition (
                    {row.attritionRate.toFixed(1)}%) ·{" "}
                    {row.graduationRate.toFixed(1)}% {row.graduationType.toLowerCase()} graduation
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[9px] leading-relaxed text-muted">
          Attrition remains at or below the institutional ceiling of 4.0% for
          every cohort. AY 2023–2024 is actual; later graduation rates are
          projections supplied for executive planning.
        </p>
      </div>
    )
  }

  function chartContent(id: ChartId, large = false) {
    if (id === "geographic") return geographicChart(large)
    if (id === "ageStatus") return ageStatusChart(large)
    if (id === "capacity") return capacityVisual(large)
    return retentionVisual(large)
  }

  const chartMeta: Record<ChartId, {
    title: string
    description: string
    owner: string
    unit: string
  }> = {
    geographic: {
      title: "Student Geographic Origin",
      description:
        "Quezon City Districts 1–6 and Non-QC origin counts for scholarship and transportation planning.",
      owner: "Registrar, Admissions",
      unit: "Students",
    },
    ageStatus: {
      title: "Age Range & Civil Status",
      description: "Three supplied age ranges split by civil-status category.",
      owner: "OSAS, Guidance Center",
      unit: "Students",
    },
    capacity: {
      title: "Program Enrollees & Capacity Utilization",
      description:
        "University-wide program capacity records across COA, COB, CCS, COE, and COED.",
      owner: "Deans / Registrar",
      unit: "Students, spaces, and percentage",
    },
    retention: {
      title: "Retention, Attrition & Graduation Rate Projections",
      description:
        "Longitudinal cohort outcomes with retained counts, attrition ceilings, and actual or projected graduation rates.",
      owner: "Planning Office, OSAS",
      unit: "Students and percentage",
    },
  }

  function modalSummary(id: ChartId) {
    if (!exportRows[id].length) {
      return [
        { label: "Active Scope", value: scope },
        {
          label: "Data Status",
          value: "No supplied sample for this selection",
        },
        { label: "Units", value: chartMeta[id].unit },
        { label: "Data Owners", value: chartMeta[id].owner },
      ]
    }
    if (id === "geographic") {
      const total = GEOGRAPHIC_DATA.reduce((sum, row) => sum + row.students, 0)
      const highest = GEOGRAPHIC_DATA.reduce((current, row) =>
        row.students > current.students ? row : current,
      )
      return [
        {
          label: "District Sample Total",
          value: `${total.toLocaleString()} students`,
        },
        {
          label: "Highest District",
          value: `${highest.district} · ${highest.students.toLocaleString()}`,
        },
        {
          label: "Highest Share",
          value: `${((highest.students / total) * 100).toFixed(1)}% of sample`,
        },
        { label: "Data Owners", value: chartMeta.geographic.owner },
      ]
    }
    if (id === "ageStatus") {
      return AGE_STATUS_DATA.map((row) => ({
        label: `Age ${row.age}`,
        value: `${(row.single + row.married + row.widowed + row.separated).toLocaleString()} students`,
      })).concat({ label: "Data Owners", value: chartMeta.ageStatus.owner })
    }
    if (id === "capacity") {
      return [
        {
          label: "Programs Shown",
          value: `${capacityRows.length} configured · ${missingCapacityRows.length} selected without capacity data`,
        },
        {
          label: "Displayed Enrollees",
          value: capacityTotals.enrolled.toLocaleString(),
        },
        {
          label: "Displayed Capacity",
          value: capacityTotals.capacity.toLocaleString(),
        },
        {
          label: "Weighted Utilization",
          value: `${capacityTotals.utilization.toFixed(1)}% · ${capacityTotals.available.toLocaleString()} spaces available`,
        },
      ]
    }
    return [
      {
        label: "Cohorts Shown",
        value: `${retentionRows.length} longitudinal cohorts`,
      },
      {
        label: "Weighted Retention",
        value: `${retentionTotals.retained.toLocaleString()} · ${retentionTotals.retentionRate.toFixed(1)}%`,
      },
      {
        label: "Weighted Attrition",
        value: `${retentionTotals.attrition.toLocaleString()} · ${retentionTotals.attritionRate.toFixed(1)}%`,
      },
      {
        label: "Weighted Graduation Rate",
        value: `${retentionTotals.weightedGraduationRate.toFixed(1)}%`,
      },
    ]
  }

  function modalDataSummary(id: ChartId) {
    if (id === "geographic")
      return (
        <ChartDataSummary
          data={aggregateAvailable ? GEOGRAPHIC_DATA : []}
          categoryKey="district"
          totalLabel="District sample total"
          series={[{ key: "students", label: "Students", color: "#BB96E4" }]}
        />
      )
    if (id === "ageStatus")
      return (
        <ChartDataSummary
          data={aggregateAvailable ? AGE_STATUS_DATA : []}
          categoryKey="age"
          totalLabel="Learner profile total"
          series={[
            { key: "single", label: "Single", color: "#BB96E4" },
            {
              key: "married",
              label: "Married",
              color: "#4C1413",
            },
            { key: "widowed", label: "Widowed", color: "#FFD066" },
            { key: "separated", label: "Separated", color: "#426BC2" },
          ]}
        />
      )
    return undefined
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-obsidian p-6 text-white shadow-xl">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 h-52 w-52 rounded-full bg-golden/10 blur-3xl" />
        <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-lilac/25 bg-lilac/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-lilac">
                Strategic Directions · Pillar 3
              </span>
              <span className="rounded-full border border-golden/25 bg-golden/10 px-3 py-1 text-[9px] font-bold text-golden">
                Supplied prototype sample data
              </span>
            </div>
            <p className="mt-5 text-2xl font-bold tracking-tight">
              Dynamic Student Engagement
            </p>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-white/60">
              Review district origin, learner profiles, program capacity, and
              retention risk without overstating the granularity of the supplied
              institutional samples.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[9px] font-semibold text-white/55">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                {currentUser?.name} · {currentUser?.title}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                President · View and export access
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                Select Pillar 3 → Choose College or Program → Review Capacity &
                Outcomes
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportPage}
              className="flex items-center gap-2 rounded-xl bg-golden px-4 py-2.5 text-xs font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-golden/90 focus:outline-none focus:ring-4 focus:ring-white/15"
            >
              <Icon type="export" />
              Export All Page Data
            </button>
          </div>
        </div>
      </section>

      <SynergyFilterPanel
        title="Dynamic Student Engagement Filters"
        description="All supported charts refresh from one shared scope; unsupported classifications and projections remain explicit."
        activeFilterCount={activeFilterCount}
        charts={CHARTS}
        visibleCharts={visibleCharts}
        onChartChange={toggleChart}
        onReset={resetFilters}
        resetDisabled={atDefault}
      >
        <SynergyFilterSelect
          label="Academic Year & Term"
          value={filters.term}
          options={[
            "AY 2026-2027 1st Sem",
            "AY 2026-2027 2nd Sem",
            "AY 2025-2026 2nd Sem",
          ]}
          onChange={(value) => updateFilter("term", value)}
        />
        <SynergyFilterSelect
          label="College"
          value={filters.college}
          options={["All colleges", "COA", "COB", "CCS", "COE", "COED"]}
          onChange={(value) => updateFilter("college", value)}
        />
        <SynergyFilterSelect
          label="Program"
          value={filters.program}
          options={programOptions}
          onChange={(value) => updateFilter("program", value)}
        />
        <SynergyFilterSelect
          label="Student Classification"
          value={filters.classification}
          options={[
            "All classifications",
            "Freshman",
            "Sophomore",
            "Junior",
            "Senior",
          ]}
          onChange={(value) => updateFilter("classification", value)}
        />
      </SynergyFilterPanel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon="map"
          label="Geographic sample total"
          value="12,522"
          detail="Six Quezon City districts plus 722 Non-QC enrollees"
          onClick={() => setActiveChart("geographic")}
        />
        <MetricCard
          icon="people"
          label="Age 26+ sample"
          value="1,125"
          detail="319 single · 700 married · 45 widowed · 61 separated"
          tone="rose"
          onClick={() => setActiveChart("ageStatus")}
        />
        <MetricCard
          icon="capacity"
          label="Weighted capacity use"
          value={
            capacityRows.length
              ? `${capacityTotals.utilization.toFixed(1)}%`
              : "—"
          }
          detail={
            capacityRows.length
              ? `${capacityTotals.enrolled.toLocaleString()} of ${capacityTotals.capacity.toLocaleString()} configured spaces · ${missingCapacityRows.length} program${
                  missingCapacityRows.length === 1 ? "" : "s"
                } without capacity data`
              : "No configured capacity record in scope"
          }
          tone="gold"
          onClick={() => setActiveChart("capacity")}
        />
        <MetricCard
          icon="trend"
          label="Weighted retention"
          value={
            retentionRows.length
              ? `${retentionTotals.retentionRate.toFixed(1)}%`
              : "—"
          }
          detail={
            retentionRows.length
              ? `${retentionTotals.attritionRate.toFixed(1)}% weighted attrition · ${retentionTotals.weightedGraduationRate.toFixed(1)}% weighted graduation`
              : "No program-outcome record in scope"
          }
          tone="gold"
          onClick={() => setActiveChart("retention")}
        />
      </div>

      {!visibleCharts.size && (
        <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm font-bold text-primary">
            All visualization cards are hidden
          </p>
          <p className="mt-2 text-xs text-muted">
            The active filter scope remains unchanged.
          </p>
          <button
            type="button"
            onClick={() =>
              setVisibleCharts(new Set(CHARTS.map((chart) => chart.id)))
            }
            className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90"
          >
            Restore all visualizations
          </button>
        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {visibleCharts.has("geographic") && (
          <ChartCard
            eyebrow="Geographic planning"
            title="Student Geographic Origin"
            description="District-level aggregate sample across Quezon City Districts 1–6 plus a dedicated Non-QC origin category."
            owner="Registrar, Admissions"
            note="Aggregate sample · not program-segmented"
            onView={() => setActiveChart("geographic")}
            onExport={() => exportChart("geographic")}
            summary={
              <ChartDataSummary
                className="mt-3"
                data={aggregateAvailable ? GEOGRAPHIC_DATA : []}
                categoryKey="district"
                totalLabel="District sample total"
                series={[
                  { key: "students", label: "Students", color: "#BB96E4" },
                ]}
              />
            }
          >
            {geographicChart()}
          </ChartCard>
        )}
        {visibleCharts.has("ageStatus") && (
          <ChartCard
            eyebrow="Learner profile"
            title="Age Range & Civil Status"
            description="Stacked comparison of Single, Married, Widowed, and Separated enrollees across all three age groups."
            owner="OSAS, Guidance Center"
            note="Aggregate sample · no employment inference"
            onView={() => setActiveChart("ageStatus")}
            onExport={() => exportChart("ageStatus")}
            summary={
              <ChartDataSummary
                className="mt-3"
                data={aggregateAvailable ? AGE_STATUS_DATA : []}
                categoryKey="age"
                totalLabel="Learner profile total"
                series={[
                  { key: "single", label: "Single", color: "#BB96E4" },
                  {
                    key: "married",
                    label: "Married",
                    color: "#4C1413",
                  },
                  { key: "widowed", label: "Widowed", color: "#FFD066" },
                  { key: "separated", label: "Separated", color: "#426BC2" },
                ]}
              />
            }
          >
            {ageStatusChart()}
          </ChartCard>
        )}
        {visibleCharts.has("capacity") && (
          <ChartCard
            className="xl:col-span-2"
            eyebrow="University space allocation"
            title="Program Enrollees & Capacity Utilization"
            description="Program-level enrollment, configured capacity, weighted utilization, and available spaces across all five colleges."
            owner="Deans / Registrar"
            note={`${capacityRows.length} configured capacity record${
              capacityRows.length === 1 ? "" : "s"
            } · ${missingCapacityRows.length} selected without capacity data`}
            onView={() => setActiveChart("capacity")}
            onExport={() => exportChart("capacity")}
          >
            {capacityVisual()}
          </ChartCard>
        )}
        {visibleCharts.has("retention") && (
          <ChartCard
            className="xl:col-span-2"
            eyebrow="University progression and outcomes"
            title="Retention, Attrition & Graduation Rate Projections"
            description="Longitudinal tracking for four university cohorts with initial enrollment, retained and attrition counts, the ≤4.0% benchmark, and actual or projected graduation rates."
            owner="Planning Office, OSAS"
            note={`${retentionRows.length} cohorts · all on track`}
            onView={() => setActiveChart("retention")}
            onExport={() => exportChart("retention")}
          >
            {retentionVisual()}
          </ChartCard>
        )}
      </div>

      <section className="grid gap-4 rounded-3xl bg-gradient-to-r from-primary to-obsidian p-5 text-white shadow-xl lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">
            Data integrity
          </p>
          <p className="mt-1 text-lg font-bold">
            Independent supplied samples, clearly scoped
          </p>
          <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-white/50">
            Capacity and program-outcome records retain their repository values
            and are filtered consistently by college and program. Aggregate
            rates use underlying counts; missing graduation denominators and
            projections are never inferred.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "Registrar",
            "Admissions",
            "OSAS",
            "Guidance Center",
            "Deans",
            "PFGSD",
            "Planning Office",
          ].map((owner) => (
            <span
              key={owner}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-semibold text-white/70"
            >
              {owner}
            </span>
          ))}
        </div>
      </section>

      {activeChart && (
        <ChartModal
          title={chartMeta[activeChart].title}
          description={`${chartMeta[activeChart].description} Active scope: ${scope}.`}
          chart={chartContent(activeChart, true)}
          dataSummary={modalDataSummary(activeChart)}
          onClose={() => setActiveChart(null)}
          onExport={() => exportChart(activeChart)}
          summary={modalSummary(activeChart)}
          insights={[
            `Active scope: ${scope}. Units: ${chartMeta[activeChart].unit}. Data owners: ${chartMeta[activeChart].owner}.`,
            "All displayed values are supplied samples or transparent calculations from those samples.",
            "Unsupported graduation and classification-level values are not inferred.",
          ]}
        />
      )}
    </div>
  )
}
