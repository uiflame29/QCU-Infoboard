import { useApp } from "../context/AppContext"
import { PROGRAMS } from "../data/mockData"

const AY_OPTIONS = ["All", "2024–2025", "2025–2026", "2026–2027"]
const PRESIDENT_AY_OPTIONS = ["2026–2027", "2027–2028", "2028–2029", "2030–2031"]
const CAMPUS_OPTIONS = [
  "All",
  "San Bartolome (Main)",
  "San Francisco",
  "Batasan Campus",
]
const COLLEGE_OPTIONS = ["All", "CCS", "COE", "COB", "COA", "COED"]

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <label
        className="text-[9px] font-bold uppercase tracking-widest"
        style={{ color: "#7B6891" }}
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-2.5 pr-6 py-1.5 rounded-lg text-xs font-medium outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
          style={{
            background:
              value !== "All"
                ? "rgba(187,150,228,0.18)"
                : "rgba(32,13,45,0.04)",
            border: `1.5px solid ${
              value !== "All" ? "rgba(187,150,228,0.5)" : "rgba(32,13,45,0.12)"
            }`,
            color: value !== "All" ? "1A0D28" : "#7B6891",
            minWidth: 100,
          }}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: "#BB96E4" }}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default function FilterBar() {
  const { currentUser, currentScreen, filters, setFilters, resetFilters } =
    useApp()
  const isDean = currentUser?.role === "dean"
  const isRegistrar = currentUser?.role === "registrar"
  const isPresidentAnalytics = ["president-enrollment", "president-college-share", "president-demographics"].includes(currentScreen)
  const isPresidentDashboard = currentScreen === "president-dashboard"
  const isEnrollmentScope = currentScreen === "student-analytics" || isPresidentAnalytics
  const isAdmissionScope = currentScreen === "admission-analytics"
  const isStudentScope = isEnrollmentScope || isAdmissionScope
  const isFacultyScope = currentScreen === "faculty-analytics" || currentScreen === "hr-analytics"

  const programOptions =
    filters.college !== "All"
      ? ["All", ...(PROGRAMS[filters.college] ?? [])]
      : ["All", ...Object.values(PROGRAMS).flat()]

  function update(key: keyof typeof filters, val: string) {
    setFilters((prev) => {
      if (isDean && key === "college") return prev
      const next = { ...prev, [key]: val }
      if (key === "college") next.program = "All"
      if (key === "program" && val !== "All" && !isDean) {
        next.college =
          Object.entries(PROGRAMS).find(([, programs]) =>
            programs.includes(val),
          )?.[0] ?? prev.college
      }
      return next
    })
  }

  const isFiltered =
    filters.academicYear !== "All" ||
    filters.semester !== "All" ||
    filters.campus !== "All" ||
    filters.college !== "All" ||
    filters.program !== "All" ||
    filters.yearLevel !== "All" ||
    filters.studentStatus !== "All" ||
    filters.studentType !== "All" ||
    filters.ageRange !== "All" ||
    filters.firstGenStatus !== "All" ||
    filters.employmentStatus !== "All" ||
    filters.scholarship !== "All" ||
    (filters.incomeBracket ?? "All") !== "All"

  return (
    <div
      className="mx-6 mb-4 px-4 py-3 rounded-2xl flex flex-wrap items-end gap-4"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(187,150,228,0.15)",
        boxShadow: "0 2px 12px rgba(32,13,45,0.05)",
      }}
    >
      <div className="flex items-center gap-2 mr-1">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: "#BB96E4" }}
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
        <div>
          <p
            className="text-[9px] font-bold uppercase tracking-widest"
            style={{ color: "#BB96E4" }}
          >
            Live Filters
          </p>
          <p className="text-[9px]" style={{ color: "#7B6891" }}>
            {isDean
              ? `${currentUser?.college} access scope enforced`
              : "All visuals update instantly"}
          </p>
        </div>
      </div>

      <FilterSelect
        label="Academic Year"
        value={filters.academicYear}
        options={isPresidentDashboard ? PRESIDENT_AY_OPTIONS : AY_OPTIONS}
        onChange={(v) => update("academicYear", v)}
      />
      {!isPresidentDashboard && (
        <FilterSelect
          label="Semester"
          value={filters.semester}
          options={["All", "1st Semester", "2nd Semester", "Summer"]}
          onChange={(v) => update("semester", v)}
        />
      )}
      <FilterSelect
        label="Campus"
        value={filters.campus}
        options={CAMPUS_OPTIONS}
        onChange={(v) => update("campus", v)}
      />
      <FilterSelect
        label={isDean ? "College · Locked" : "College"}
        value={filters.college}
        options={isDean ? [currentUser?.college ?? "CCS"] : COLLEGE_OPTIONS}
        onChange={(v) => update("college", v)}
        disabled={isDean}
      />
      <FilterSelect
        label="Program"
        value={filters.program}
        options={programOptions}
        onChange={(v) => update("program", v)}
      />
      {isStudentScope && (
        <FilterSelect
          label="Year Level"
          value={filters.yearLevel}
          options={["All", "1st Year", "2nd Year", "3rd Year", "4th Year"]}
          onChange={(v) => update("yearLevel", v)}
        />
      )}
      {isStudentScope && isRegistrar && (
        <FilterSelect
          label="Student Status"
          value={filters.studentStatus}
          options={["All", "Regular", "Irregular", "Graduating", "Leave", "Withdrawn"]}
          onChange={(v) => update("studentStatus", v)}
        />
      )}
      {isStudentScope && isRegistrar && (
        <FilterSelect
          label="Student Type"
          value={filters.studentType}
          options={["All", "New", "Continuing", "Returning", "Transferee"]}
          onChange={(v) => update("studentType", v)}
        />
      )}
      {isStudentScope && isRegistrar && (
        <FilterSelect
          label="Age Range"
          value={filters.ageRange}
          options={["All", "17–20", "21–24", "25+"]}
          onChange={(v) => update("ageRange", v)}
        />
      )}
      {isStudentScope && (
        <FilterSelect
          label="First-Gen Status"
          value={filters.firstGenStatus}
          options={["All", "First-Gen", "Non-First-Gen"]}
          onChange={(v) => update("firstGenStatus", v)}
        />
      )}
      {isFacultyScope && (
        <FilterSelect
          label="Employment"
          value={filters.employmentStatus}
          options={["All", "Full-Time", "Part-Time"]}
          onChange={(v) => update("employmentStatus", v)}
        />
      )}
      {currentScreen === "admission-analytics" && isRegistrar && (
        <FilterSelect
          label="Scholarship"
          value={filters.scholarship}
          options={["All", "QCYDO", "UNIFAST/TES", "CHED"]}
          onChange={(v) => update("scholarship", v)}
        />
      )}

      {isFiltered && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ml-auto"
          style={{
            background: "rgba(187,150,228,0.1)",
            color: "#BB96E4",
            border: "1px solid rgba(187,150,228,0.3)",
          }}
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

      <span
        className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded"
        style={{ background: "rgba(0,135,90,0.08)", color: "#00875A" }}
      >
        • LIVE
      </span>
    </div>
  )
}
