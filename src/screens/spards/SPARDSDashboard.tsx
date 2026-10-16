import { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import ChartModal from '../../components/ChartModal';
import ChartSelection from '../../components/ChartSelection';

/* ─── Color tokens ─────────────────────────────────────────────── */
const GRANT_COLORS = ['#BB96E4', '#FFD066', '#200D2D', '#FFDBED'];
const INCOME_COLORS = ['#4C1413', '#BB96E4', '#FFD066'];
const STANDING_COLORS = ['#00875A', '#BB96E4', '#FF6B00'];
const COLLEGE_COLORS: Record<string, string> = {
  CCS: '#333333', COE: '#FF6B00', COB: '#FFC700', COA: '#00875A', COED: '#0052CC',
};

/* ─── Static base data ─────────────────────────────────────────── */
const BASE_GRANT = [
  { name: 'QCYDO Grant', value: 4000, pct: '58.8%' },
  { name: 'UNIFAST/TES', value: 2000, pct: '29.4%' },
  { name: 'CHED Grant', value: 500, pct: '7.35%' },
  { name: 'Private/Other', value: 300, pct: '4.41%' },
];
const BASE_COLLEGE = [
  { name: 'CCS', scholars: 2380 },
  { name: 'COE', scholars: 1700 },
  { name: 'COB', scholars: 1360 },
  { name: 'COA', scholars: 816 },
  { name: 'COED', scholars: 544 },
];
const BASE_INCOME = [
  { name: 'Low Income (<₱15k)', value: 4216, pct: '62.0%' },
  { name: 'Lower Middle (₱15k–₱30k)', value: 1904, pct: '28.0%' },
  { name: 'Middle Income (>₱30k)', value: 680, pct: '10.0%' },
];
const BASE_STANDING = [
  { name: "Dean's Lister (GPA ≤1.75)", value: 2856, pct: '42.0%' },
  { name: 'Good Standing (1.76–2.25)', value: 3264, pct: '48.0%' },
  { name: 'At-Risk (GPA >2.25)', value: 680, pct: '10.0%' },
];

/* ─── Filter options ───────────────────────────────────────────── */
const AY_OPTS = ['All', '2024–2025', '2025–2026', '2026–2027'];
const CAMPUS_OPTS = ['All', 'San Bartolome (Main)', 'San Francisco', 'Batasan Campus'];
const COLLEGE_OPTS = ['All', 'CCS', 'COA', 'COB', 'COE', 'COED'];
const GRANT_OPTS = ['All', 'QCYDO', 'UNIFAST/TES', 'CHED', 'Academic', 'LGU/Private'];
const INCOME_OPTS = ['All', '<₱15k', '₱15k–₱30k', '>₱30k'];
const PROGRAMS: Record<string, string[]> = {
  CCS: ['BSIT', 'BSIS', 'BSCS'],
  COA: ['BSA', 'BSMA'],
  COB: ['BSE', 'MSENT'],
  COE: ['BSEE', 'BSIE'],
  COED: ['BECED'],
};

/* ─── Chart definitions for ChartSelection ─────────────────────── */
const CHART_DEFS = [
  { id: 'grant', label: 'Scholarship Grant Breakdown' },
  { id: 'college', label: 'Scholars per College' },
  { id: 'income', label: 'Household Income Brackets' },
  { id: 'standing', label: 'Academic Standing Ratio' },
];

/* ─── Scale helper ─────────────────────────────────────────────── */
function getScale(ay: string, campus: string): number {
  const a: Record<string, number> = { 'All': 1, '2024–2025': 0.92, '2025–2026': 0.96, '2026–2027': 1 };
  const c: Record<string, number> = { 'All': 1, 'San Bartolome (Main)': 0.62, 'San Francisco': 0.22, 'Batasan Campus': 0.16 };
  return (a[ay] ?? 1) * (c[campus] ?? 1);
}

/* ─── Tooltip components ───────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-lilac/20 rounded-xl px-4 py-3 shadow-xl text-xs">
      {label && <p className="font-bold text-primary mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill ?? '#200D2D' }}>{p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong></p>
      ))}
    </div>
  );
};
const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-lilac/20 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-bold text-primary">{d.name}</p>
      <p style={{ color: d.payload.fill ?? '#BB96E4' }}>{d.value.toLocaleString()} scholars</p>
    </div>
  );
};

/* ─── Sub-components ───────────────────────────────────────────── */
function KpiCard({ label, value, sub, accent, icon }: { label: string; value: string | number; sub?: string; accent?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5 flex flex-col gap-1.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted leading-tight">{label}</p>
        {icon && <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent ?? '#BB96E4'}18`, color: accent ?? '#BB96E4' }}>{icon}</span>}
      </div>
      <p className="text-3xl font-extrabold tracking-tight" style={{ color: accent ?? '#200D2D' }}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {sub && <p className="text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="rounded-xl border border-lilac/20 bg-white px-3 py-1.5 text-xs font-medium text-primary hover:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac/30 cursor-pointer"
        style={{ minWidth: 100 }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ─── Chart card wrapper ───────────────────────────────────────── */
function ChartCard({ title, children, onView, onExport }: { title: string; children: React.ReactNode; onView: () => void; onExport: () => void }) {
  return (
    <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm font-bold text-primary">{title}</p>
        <div className="flex gap-2">
          <button onClick={onView}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold bg-lilac/10 text-primary hover:bg-lilac/20 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/></svg>
            View Chart
          </button>
          <button onClick={onExport}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold bg-golden/15 text-primary hover:bg-golden/30 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Export
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════ */
export default function SPARDSDashboard() {
  const { showToast, showModal } = useApp();

  /* Filter state */
  const [ay, setAy] = useState('All');
  const [campus, setCampus] = useState('All');
  const [college, setCollege] = useState('All');
  const [grant, setGrant] = useState('All');
  const [income, setIncome] = useState('All');
  const [program, setProgram] = useState('All');

  const programOpts = useMemo(() => {
    if (college === 'All') return ['All', ...Object.values(PROGRAMS).flat()];
    return ['All', ...(PROGRAMS[college] ?? [])];
  }, [college]);

  /* Chart visibility */
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(new Set(CHART_DEFS.map(c => c.id)));
  function toggleChart(id: string, checked: boolean) {
    setVisibleCharts(prev => { const n = new Set(prev); checked ? n.add(id) : n.delete(id); return n; });
  }

  /* ChartModal state */
  const [chartModal, setChartModal] = useState<{ title: string; description: string; chart: React.ReactNode; legend?: { label: string; color: string }[]; insights?: string[] } | null>(null);

  /* Derived data */
  const s = useMemo(() => getScale(ay, campus), [ay, campus]);

  /* College-aware scale for per-college totals */
  const COLLEGE_SHARE: Record<string, number> = { CCS: 0.35, COE: 0.25, COB: 0.20, COA: 0.12, COED: 0.08, All: 1 };
  const collegeShare = COLLEGE_SHARE[college] ?? 1;

  const grantData = useMemo(() => {
    const scaled = BASE_GRANT.map(d => ({ ...d, value: Math.round(d.value * s * collegeShare) }));
    if (grant !== 'All') {
      const grantMap: Record<string, string> = { QCYDO: 'QCYDO Grant', 'UNIFAST/TES': 'UNIFAST/TES', CHED: 'CHED Grant', 'LGU/Private': 'Private/Other' };
      return scaled.filter(d => d.name === grantMap[grant]);
    }
    return scaled;
  }, [s, collegeShare, grant]);

  const collegeData = useMemo(() => {
    const data = BASE_COLLEGE.map(d => ({ ...d, scholars: Math.round(d.scholars * s) }));
    return college !== 'All' ? data.filter(d => d.name === college) : data;
  }, [s, college]);

  const INCOME_SHARE: Record<string, number> = { 'All': 1, '<₱15k': 0.62, '₱15k–₱30k': 0.28, '>₱30k': 0.10 };
  const incomeShare = INCOME_SHARE[income] ?? 1;
  const incomeData = useMemo(() => {
    const scaled = BASE_INCOME.map(d => ({ ...d, value: Math.round(d.value * s * collegeShare) }));
    if (income !== 'All') {
      const incomeMap: Record<string, string> = { '<₱15k': 'Low Income (<₱15k)', '₱15k–₱30k': 'Lower Middle (₱15k–₱30k)', '>₱30k': 'Middle Income (>₱30k)' };
      return scaled.filter(d => d.name === incomeMap[income]);
    }
    return scaled;
  }, [s, collegeShare, income]);

  const standingData = useMemo(() => BASE_STANDING.map(d => ({ ...d, value: Math.round(d.value * s * collegeShare) })), [s, collegeShare]);
  const totalScholars = Math.round(6800 * s * collegeShare);

  /* Helpers */
  function doExport(label: string) {
    showToast({ type: 'success', title: 'Exported', body: `${label} data exported successfully.` });
  }

  function openViewChart(id: string) {
    const configs: Record<string, { title: string; description: string; chart: React.ReactNode; legend: { label: string; color: string }[]; insights: string[] }> = {
      grant: {
        title: 'Scholarship Grant Breakdown',
        description: 'Distribution of active scholars across all scholarship grant providers. QCYDO dominates at 58.8%, reflecting strong municipal LGU investment in QCU student financial assistance.',
        chart: (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie data={grantData} cx="50%" cy="50%" innerRadius={90} outerRadius={160} paddingAngle={3} dataKey="value" label={({ name, payload }) => `${name}: ${(payload as any)?.pct ?? ""}`} labelLine={true}>
                  {grantData.map((_, i) => <Cell key={i} fill={GRANT_COLORS[i % GRANT_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="md:w-64 shrink-0 space-y-3">
              {grantData.map((d, i) => (
                <div key={d.name} className="rounded-xl border border-lilac/15 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: GRANT_COLORS[i] }} />
                    <span className="text-xs font-semibold text-primary">{d.name}</span>
                  </div>
                  <p className="text-xl font-bold text-primary">{d.value.toLocaleString()}</p>
                  <p className="text-xs text-muted">{d.pct} of total</p>
                </div>
              ))}
            </div>
          </div>
        ),
        legend: GRANT_COLORS.map((c, i) => ({ label: grantData[i]?.name ?? '', color: c })),
        insights: [
          `QCYDO accounts for the majority of scholars (${grantData[0]?.value.toLocaleString() ?? 0}) — heavy dependence on municipal LGU funding.`,
          `UNIFAST/TES covers ${grantData[1]?.value.toLocaleString() ?? 0} scholars — national subsidy provides stable secondary coverage.`,
          `Private/Other grants (${grantData[3]?.value.toLocaleString() ?? 0}) represent an expansion opportunity for corporate partnerships.`,
        ],
      },
      college: {
        title: 'Scholars per College',
        description: 'Total scholarship headcount disaggregated by academic college. CCS leads with the highest scholar population, followed by COE and COB.',
        chart: (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={collegeData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7B6891' }} />
              <YAxis tick={{ fontSize: 11, fill: '#7B6891' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="scholars" name="Scholars" radius={[8, 8, 0, 0]}>
                {collegeData.map(d => <Cell key={d.name} fill={COLLEGE_COLORS[d.name] ?? '#BB96E4'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ),
        legend: Object.entries(COLLEGE_COLORS).map(([k, v]) => ({ label: k, color: v })),
        insights: [
          'CCS has the highest scholarship concentration, consistent with its enrollment size advantage.',
          'COA and COED have lower absolute counts but maintain the same 68% coverage ratio.',
          'Apply a college filter to drill down into individual department distributions.',
        ],
      },
      income: {
        title: 'Household Income Brackets',
        description: 'Socioeconomic breakdown of scholar household monthly income. 62% of scholars come from low-income families earning below ₱15,000/month, validating the critical need for financial aid programs.',
        chart: (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie data={incomeData} cx="50%" cy="50%" innerRadius={80} outerRadius={150} paddingAngle={3} dataKey="value" label={({ payload }) => `${(payload as any)?.pct ?? ""}`} labelLine>
                  {incomeData.map((_, i) => <Cell key={i} fill={INCOME_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="md:w-64 space-y-3">
              {incomeData.map((d, i) => (
                <div key={d.name} className="rounded-xl border border-lilac/15 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: INCOME_COLORS[i] }} />
                    <span className="text-xs font-semibold text-primary">{d.name}</span>
                  </div>
                  <p className="text-xl font-bold text-primary">{d.value.toLocaleString()}</p>
                  <p className="text-xs text-muted">{d.pct} of total</p>
                </div>
              ))}
            </div>
          </div>
        ),
        legend: INCOME_COLORS.map((c, i) => ({ label: incomeData[i]?.name ?? '', color: c })),
        insights: [
          `${incomeData[0]?.value.toLocaleString() ?? 0} scholars (62%) come from low-income households — the primary target beneficiary group.`,
          'Lower-middle income families (28%) benefit significantly from UNIFAST/TES subsidies.',
          'Recommend annual reassessment of income brackets to adjust for inflation and DSWD poverty line updates.',
        ],
      },
      standing: {
        title: 'Academic Standing Ratio',
        description: 'Tracks academic compliance of scholarship beneficiaries against retention GPA requirements. 90% of scholars maintain Good Standing or Dean\'s List status.',
        chart: (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie data={standingData} cx="50%" cy="50%" outerRadius={150} paddingAngle={3} dataKey="value" label={({ payload }) => `${(payload as any)?.pct ?? ""}`} labelLine>
                  {standingData.map((_, i) => <Cell key={i} fill={STANDING_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="md:w-64 space-y-3">
              {standingData.map((d, i) => (
                <div key={d.name} className="rounded-xl border border-lilac/15 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: STANDING_COLORS[i] }} />
                    <span className="text-xs font-semibold text-primary">{d.name}</span>
                  </div>
                  <p className="text-xl font-bold text-primary">{d.value.toLocaleString()}</p>
                  <p className="text-xs text-muted">{d.pct} of scholars</p>
                </div>
              ))}
            </div>
          </div>
        ),
        legend: STANDING_COLORS.map((c, i) => ({ label: standingData[i]?.name ?? '', color: c })),
        insights: [
          `${standingData[2]?.value.toLocaleString() ?? 0} scholars (10%) are at academic risk — flag for mandatory academic counseling and mentoring.`,
          "Dean's Listers (42%) demonstrate strong academic performance exceeding scholarship GPA thresholds.",
          'Monitor at-risk scholars each semester to preemptively prevent grant suspension.',
        ],
      },
    };
    const cfg = configs[id];
    if (cfg) setChartModal(cfg);
  }

  function handleExportAll() {
    showModal({
      title: 'Export All Dashboard Data',
      message: 'Export all dashboard charts, KPIs, and data tables as a formatted PDF executive briefing or raw XLSX workbook?',
      confirmLabel: 'Export PDF',
      cancelLabel: 'Export XLSX',
      onConfirm: () => showToast({ type: 'success', title: 'PDF Export Started', body: 'SPARDS Dashboard report is being generated.' }),
      onCancel: () => showToast({ type: 'success', title: 'XLSX Export Started', body: 'Raw data workbook is being prepared.' }),
    });
  }

  return (
    <div className="space-y-5">
      {/* ── Filter bar ── */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-lilac shrink-0"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="text-[9px] font-bold uppercase tracking-widest text-lilac">Live Filters</span>
          </div>
          <FilterSelect label="Academic Year" value={ay} onChange={setAy} options={AY_OPTS} />
          <FilterSelect label="Campus" value={campus} onChange={setCampus} options={CAMPUS_OPTS} />
          <FilterSelect label="College" value={college} onChange={v => { setCollege(v); setProgram('All'); }} options={COLLEGE_OPTS} />
          <FilterSelect label="Program" value={program} onChange={setProgram} options={programOpts} />
          <FilterSelect label="Grant Type" value={grant} onChange={setGrant} options={GRANT_OPTS} />
          <FilterSelect label="Income Bracket" value={income} onChange={setIncome} options={INCOME_OPTS} />
          {(ay !== 'All' || campus !== 'All' || college !== 'All' || grant !== 'All' || income !== 'All') && (
            <button onClick={() => { setAy('All'); setCampus('All'); setCollege('All'); setGrant('All'); setIncome('All'); setProgram('All'); }}
              className="rounded-xl px-3 py-1.5 text-xs text-muted hover:text-primary hover:bg-lilac/10 transition-colors flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Reset
            </button>
          )}
          <div className="ml-auto flex items-center gap-2">
            <ChartSelection charts={CHART_DEFS} visible={visibleCharts} onChange={toggleChart} />
            <button onClick={handleExportAll}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <KpiCard label="Total Active Scholars" value={totalScholars} sub={`${((totalScholars / 10000) * 100).toFixed(1)}% of QCU enrollment`} accent="#200D2D"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M19 8v6m-3-3h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>} />
        <KpiCard label="QCYDO Scholars" value={Math.round(4000 * s * collegeShare)} sub="Municipal LGU Grant" accent="#BB96E4"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 7 .9-5 4.8 1.2 6.8L12 17.4l-6.2 3.1L7 13.7 2 8.9 9 8l3-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>} />
        <KpiCard label="UNIFAST/TES" value={Math.round(2000 * s * collegeShare)} sub="Tertiary Education Subsidy" accent="#FFD066"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 8l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5.5 11.5V16L12 20l6.5-4v-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
        <KpiCard label="CHED Scholars" value={Math.round(500 * s * collegeShare)} sub="State Scholarship Program" accent="#4C1413"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 10v1a10 10 0 01-20 0v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M7 10V7l5-5 5 5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
        <KpiCard label="Private/LGU Grants" value={Math.round(300 * s * collegeShare)} sub="Corporate & Community Grants" accent="#FFDBED"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V8l7-5 7 5v13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>} />
      </div>

      {/* ── Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {visibleCharts.has('grant') && (
          <ChartCard title="Scholarship Grant Breakdown" onView={() => openViewChart('grant')} onExport={() => doExport('Scholarship Grant Breakdown')}>
            <div className="flex gap-4 items-center">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={grantData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {grantData.map((_, i) => <Cell key={i} fill={GRANT_COLORS[i % GRANT_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {grantData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: GRANT_COLORS[i % GRANT_COLORS.length] }} />
                    <span className="text-muted truncate">{d.name}</span>
                    <span className="ml-auto font-bold text-primary whitespace-nowrap">{d.value.toLocaleString()}</span>
                    <span className="text-muted text-[10px] w-12 text-right">{d.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        )}

        {visibleCharts.has('college') && (
          <ChartCard title="Scholars per College" onView={() => openViewChart('college')} onExport={() => doExport('Scholars per College')}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={collegeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7B6891' }} />
                <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="scholars" radius={[6, 6, 0, 0]}>
                  {collegeData.map(d => <Cell key={d.name} fill={COLLEGE_COLORS[d.name] ?? '#BB96E4'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* ── Charts Row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {visibleCharts.has('income') && (
          <ChartCard title="Household Income Brackets" onView={() => openViewChart('income')} onExport={() => doExport('Household Income Brackets')}>
            <div className="flex gap-4 items-center">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={incomeData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {incomeData.map((_, i) => <Cell key={i} fill={INCOME_COLORS[i % INCOME_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {incomeData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: INCOME_COLORS[i % INCOME_COLORS.length] }} />
                    <span className="text-muted text-[11px] truncate">{d.name}</span>
                    <span className="ml-auto font-bold text-primary whitespace-nowrap">{d.value.toLocaleString()}</span>
                    <span className="text-muted text-[10px] w-12 text-right">{d.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        )}

        {visibleCharts.has('standing') && (
          <ChartCard title="Academic Standing Ratio" onView={() => openViewChart('standing')} onExport={() => doExport('Academic Standing Ratio')}>
            <div className="flex gap-4 items-center">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={standingData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value">
                    {standingData.map((_, i) => <Cell key={i} fill={STANDING_COLORS[i % STANDING_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {standingData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STANDING_COLORS[i % STANDING_COLORS.length] }} />
                    <span className="text-muted text-[11px] truncate">{d.name}</span>
                    <span className="ml-auto font-bold text-primary whitespace-nowrap">{d.value.toLocaleString()}</span>
                    <span className="text-muted text-[10px] w-12 text-right">{d.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        )}
      </div>

      {/* ── Expanded Chart Modal ── */}
      {chartModal && (
        <ChartModal
          title={chartModal.title}
          description={chartModal.description}
          chart={chartModal.chart}
          legend={chartModal.legend}
          insights={chartModal.insights}
          onClose={() => setChartModal(null)}
          onExport={() => { doExport(chartModal.title); setChartModal(null); }}
        />
      )}
    </div>
  );
}
