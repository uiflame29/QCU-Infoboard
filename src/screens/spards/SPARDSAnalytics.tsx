import { useEffect, useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import ChartModal from '../../components/ChartModal';
import ChartSelection from '../../components/ChartSelection';
import type { ScreenId } from '../../types';

/* ─── Color tokens ─────────────────────────────────────────────── */
const COLLEGE_COLORS: Record<string, string> = {
  CCS: '#333333', COE: '#FF6B00', COB: '#FFC700', COA: '#00875A', COED: '#0052CC',
};
const INCOME_COLORS = ['#4C1413', '#BB96E4', '#FFD066'];

/* ─── Programs mapping ─────────────────────────────────────────── */
const PROGRAMS: Record<string, string[]> = {
  CCS: ['BSIT', 'BSIS', 'BSCS'],
  COA: ['BSA', 'BSMA'],
  COB: ['BSE', 'MSENT'],
  COE: ['BSEE', 'BSIE'],
  COED: ['BECED'],
};

/* ─── Tooltips ─────────────────────────────────────────────────── */
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
      <p style={{ color: d.payload.fill ?? '#BB96E4' }}>{typeof d.value === 'number' ? d.value.toLocaleString() : d.value}</p>
    </div>
  );
};

/* ─── Scale helper ─────────────────────────────────────────────── */
function getScale(ay: string, campus: string): number {
  const a: Record<string, number> = { All: 1, '2024–2025': 0.92, '2025–2026': 0.96, '2026–2027': 1 };
  const c: Record<string, number> = { All: 1, 'San Bartolome (Main)': 0.62, 'San Francisco': 0.22, 'Batasan Campus': 0.16 };
  return (a[ay] ?? 1) * (c[campus] ?? 1);
}

/* ─── Sub-view definitions ─────────────────────────────────────── */
const SUB_VIEWS = [
  { id: 'overview', label: 'Scholarship Overview', screen: 'spards-analytics' },
  { id: 'socioeconomic', label: 'Scholarship Demographics', screen: 'spards-analytics-demographics' },
  { id: 'grant', label: 'Scholarship Distribution', screen: 'spards-analytics-distribution' },
  { id: 'gpa', label: 'Beneficiary Performance', screen: 'spards-analytics-performance' },
  { id: 'retention', label: 'Scholarship Retention', screen: 'spards-analytics-retention' },
  { id: 'firstgen', label: 'First-Gen Scholars', screen: 'spards-analytics-college' },
  { id: 'disbursement', label: 'Financial Assistance Trends', screen: 'spards-analytics-financial' },
] satisfies { id: string; label: string; screen: ScreenId }[];

const CHARTS_BY_VIEW: Record<string, { id: string; label: string }[]> = {
  overview: [{ id: 'overview-dist', label: 'Scholar Distribution by College & Grant' }],
  socioeconomic: [
    { id: 'income-donut', label: 'Income Bracket Distribution' },
    { id: 'parental-employment', label: 'Parental Employment Breakdown' },
  ],
  grant: [{ id: 'grant-college', label: 'Grant Type Distribution Across Colleges' }],
  gpa: [{ id: 'gpa-dist', label: 'GPA Distribution Per Range' }],
  retention: [{ id: 'retention-funnel', label: 'Scholar Cohort Retention Funnel' }],
  firstgen: [{ id: 'firstgen-compare', label: 'First-Gen vs. Non-First-Gen Scholars' }],
  disbursement: [{ id: 'disbursement-line', label: 'Quarterly Stipend Release Timeline' }],
};

/* ─── Base datasets ────────────────────────────────────────────── */
const BASE_OVERVIEW_DATA = [
  { name: 'CCS', QCYDO: 1400, UNIFAST: 700, CHED: 170, Private: 110 },
  { name: 'COE', QCYDO: 1000, UNIFAST: 500, CHED: 120, Private: 80 },
  { name: 'COB', QCYDO: 800, UNIFAST: 400, CHED: 100, Private: 60 },
  { name: 'COA', QCYDO: 480, UNIFAST: 240, CHED: 60, Private: 36 },
  { name: 'COED', QCYDO: 320, UNIFAST: 160, CHED: 50, Private: 14 },
];
const BASE_INCOME = [
  { name: 'Low Income (<₱15k)', value: 4216, fill: '#4C1413' },
  { name: 'Lower Middle (₱15k–₱30k)', value: 1904, fill: '#BB96E4' },
  { name: 'Middle Income (>₱30k)', value: 680, fill: '#FFD066' },
];
const BASE_PARENTAL = [
  { name: 'Government', value: 680 },
  { name: 'Private Sector', value: 2040 },
  { name: 'OFW', value: 816 },
  { name: 'Self-Employed', value: 1700 },
  { name: 'Unemployed', value: 1564 },
];
const BASE_GRANT_COLLEGE = [
  { name: 'CCS', QCYDO: 1400, UNIFAST: 700, CHED: 170, Academic: 80, Athletic: 30 },
  { name: 'COE', QCYDO: 1000, UNIFAST: 500, CHED: 120, Academic: 60, Athletic: 20 },
  { name: 'COB', QCYDO: 800, UNIFAST: 400, CHED: 100, Academic: 40, Athletic: 20 },
  { name: 'COA', QCYDO: 480, UNIFAST: 240, CHED: 60, Academic: 20, Athletic: 16 },
  { name: 'COED', QCYDO: 320, UNIFAST: 160, CHED: 50, Academic: 10, Athletic: 4 },
];
const GPA_DATA = [
  { range: '1.00–1.50', scholars: 1500, fill: '#00875A' },
  { range: '1.51–2.00', scholars: 3800, fill: '#BB96E4' },
  { range: '2.01–2.50', scholars: 1200, fill: '#FFD066' },
  { range: '>2.50', scholars: 300, fill: '#FF6B00' },
];
const RETENTION_BASE = [
  { name: '1st Year', value: 2500, pct: '100%', fill: '#200D2D' },
  { name: '2nd Year', value: 2000, pct: '80%', fill: '#BB96E4' },
  { name: '3rd Year', value: 1450, pct: '58%', fill: '#FFD066' },
  { name: '4th Year', value: 850, pct: '34%', fill: '#4C1413' },
];
const FIRSTGEN_BASE = [
  { name: 'CCS', FirstGen: 850, NonFirstGen: 1530 },
  { name: 'COE', FirstGen: 620, NonFirstGen: 1080 },
  { name: 'COB', FirstGen: 480, NonFirstGen: 880 },
  { name: 'COA', FirstGen: 310, NonFirstGen: 506 },
  { name: 'COED', FirstGen: 240, NonFirstGen: 304 },
];
const DISBURSE_DATA = [
  { quarter: 'Q1 2025', Released: 6200, Pending: 600 },
  { quarter: 'Q2 2025', Released: 6500, Pending: 300 },
  { quarter: 'Q3 2025', Released: 6700, Pending: 100 },
  { quarter: 'Q4 2025', Released: 6650, Pending: 150 },
  { quarter: 'Q1 2026', Released: 6750, Pending: 50 },
];

function scaleRows<T extends Record<string, any>>(rows: T[], keys: (keyof T)[], s: number): T[] {
  return rows.map(r => {
    const out = { ...r } as T;
    for (const k of keys) {
      if (typeof out[k] === 'number') (out as any)[k] = Math.round((out[k] as number) * s);
    }
    return out;
  });
}

/* ─── Shared sub-components ────────────────────────────────────── */
function KpiBadge({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-lilac/15 bg-white shadow-sm px-5 py-4 flex flex-col gap-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</p>
      <p className="text-2xl font-extrabold" style={{ color: accent ?? '#200D2D' }}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
}

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

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="rounded-xl border border-lilac/20 bg-white px-3 py-1.5 text-xs font-medium text-primary hover:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac/30 cursor-pointer"
        style={{ minWidth: 90 }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════ */
export default function SPARDSAnalytics({ initialView = 'overview' }: { initialView?: string }) {
  const { showToast, showModal, navigate } = useApp();
  const [activeView, setActiveView] = useState(initialView);
  useEffect(() => setActiveView(initialView), [initialView]);

  /* Filters */
  const [ay, setAy] = useState('All');
  const [campus, setCampus] = useState('All');
  const [college, setCollege] = useState('All');
  const [program, setProgram] = useState('All');
  const [grantFilter, setGrantFilter] = useState('All');

  const programOpts = useMemo(() => {
    if (college === 'All') return ['All', ...Object.values(PROGRAMS).flat()];
    return ['All', ...(PROGRAMS[college] ?? [])];
  }, [college]);

  /* Visible charts per view */
  const currentChartDefs = CHARTS_BY_VIEW[activeView] ?? [];
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(new Set(Object.values(CHARTS_BY_VIEW).flat().map(c => c.id)));
  function toggleChart(id: string, checked: boolean) {
    setVisibleCharts(prev => { const n = new Set(prev); checked ? n.add(id) : n.delete(id); return n; });
  }

  /* Chart modal */
  const [chartModal, setChartModal] = useState<{ title: string; description: string; chart: React.ReactNode; legend?: { label: string; color: string }[]; insights?: string[] } | null>(null);

  const s = useMemo(() => getScale(ay, campus), [ay, campus]);

  /* Scaled data */
  const overviewData = useMemo(() => {
    let data = scaleRows(BASE_OVERVIEW_DATA, ['QCYDO', 'UNIFAST', 'CHED', 'Private'] as any, s);
    if (college !== 'All') data = data.filter(d => d.name === college);
    return data;
  }, [s, college]);
  const incomeData = useMemo(() => scaleRows(BASE_INCOME as any, ['value'] as any, s), [s]);
  const parentalData = useMemo(() => scaleRows(BASE_PARENTAL, ['value'], s), [s]);
  const grantCollegeData = useMemo(() => {
    let data = scaleRows(BASE_GRANT_COLLEGE, ['QCYDO', 'UNIFAST', 'CHED', 'Academic', 'Athletic'] as any, s);
    if (college !== 'All') data = data.filter(d => d.name === college);
    return data;
  }, [s, college]);
  const gpaData = useMemo(() => scaleRows(GPA_DATA, ['scholars'], s), [s]);
  const retentionData = useMemo(() => scaleRows(RETENTION_BASE, ['value'], s), [s]);
  const firstgenData = useMemo(() => {
    let data = scaleRows(FIRSTGEN_BASE, ['FirstGen', 'NonFirstGen'] as any, s);
    if (college !== 'All') data = data.filter(d => d.name === college);
    return data;
  }, [s, college]);
  const disburseData = useMemo(() => scaleRows(DISBURSE_DATA, ['Released', 'Pending'] as any, s), [s]);

  function doExport(label: string) {
    showToast({ type: 'success', title: 'Exported', body: `${label} data exported.` });
  }
  function exportAll() {
    showModal({
      title: 'Export Analytics Data',
      message: 'Export all analytics charts and summaries for the active sub-view and filter selection?',
      confirmLabel: 'Export PDF',
      cancelLabel: 'Export XLSX',
      onConfirm: () => showToast({ type: 'success', title: 'PDF Exported', body: 'Analytics report generated.' }),
      onCancel: () => showToast({ type: 'success', title: 'XLSX Exported', body: 'Analytics workbook generated.' }),
    });
  }

  function openLargeChart(title: string, description: string, chart: React.ReactNode, legend?: { label: string; color: string }[], insights?: string[]) {
    setChartModal({ title, description, chart, legend, insights });
  }

  function selectView(view: (typeof SUB_VIEWS)[number]) {
    setActiveView(view.id);
    navigate(view.screen);
  }

  return (
    <div className="space-y-5">
      {/* ── Sub-view tabs ── */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-3 flex flex-wrap gap-2 items-center">
        {SUB_VIEWS.map(v => (
          <button key={v.id} onClick={() => selectView(v)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold transition-all ${activeView === v.id ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-lilac/10 hover:text-primary'}`}>
            <span className="text-xs" style={{ fontSize: 12 }}>{v.label}</span>
          </button>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex items-center gap-2 shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-lilac"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="text-[9px] font-bold uppercase tracking-widest text-lilac">Live Filters</span>
          </div>
          <FilterSelect label="Academic Year" value={ay} onChange={setAy} options={['All', '2024–2025', '2025–2026', '2026–2027']} />
          <FilterSelect label="Campus" value={campus} onChange={setCampus} options={['All', 'San Bartolome (Main)', 'San Francisco', 'Batasan Campus']} />
          <FilterSelect label="College" value={college} onChange={v => { setCollege(v); setProgram('All'); }} options={['All', 'CCS', 'COA', 'COB', 'COE', 'COED']} />
          <FilterSelect label="Program" value={program} onChange={setProgram} options={programOpts} />
          <FilterSelect label="Grant Type" value={grantFilter} onChange={setGrantFilter} options={['All', 'QCYDO', 'UNIFAST/TES', 'CHED', 'Academic', 'LGU/Private']} />
          {(ay !== 'All' || campus !== 'All' || college !== 'All' || grantFilter !== 'All') && (
            <button onClick={() => { setAy('All'); setCampus('All'); setCollege('All'); setProgram('All'); setGrantFilter('All'); }}
              className="rounded-xl px-3 py-1.5 text-xs text-muted hover:text-primary hover:bg-lilac/10 transition-colors flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Reset
            </button>
          )}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <ChartSelection charts={currentChartDefs} visible={visibleCharts} onChange={toggleChart} />
            <button onClick={exportAll}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────── SUB-VIEWS ─────────────────────────────── */}

      {/* Scholar Overview */}
      {activeView === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiBadge label="Total Scholars" value={Math.round(6800 * s)} accent="#200D2D" />
            <KpiBadge label="Scholar Coverage Rate" value={`${(68 * s).toFixed(1)}%`} accent="#BB96E4" />
            <KpiBadge label="Active Grant Programs" value={12} accent="#FFD066" />
          </div>
          {visibleCharts.has('overview-dist') && (
            <ChartCard title="Scholar Distribution by College & Grant Provider"
              onView={() => openLargeChart('Scholar Distribution by College & Grant Provider',
                'Stacked breakdown of scholarship recipients across colleges, segmented by grant provider type. Helps identify funding dependency patterns per college.',
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={overviewData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7B6891' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#7B6891' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="QCYDO" stackId="a" fill="#BB96E4" />
                    <Bar dataKey="UNIFAST" stackId="a" fill="#FFD066" />
                    <Bar dataKey="CHED" stackId="a" fill="#200D2D" />
                    <Bar dataKey="Private" stackId="a" fill="#FFDBED" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>,
                [{ label: 'QCYDO', color: '#BB96E4' }, { label: 'UNIFAST/TES', color: '#FFD066' }, { label: 'CHED', color: '#200D2D' }, { label: 'Private/Other', color: '#FFDBED' }],
                ['CCS accounts for the largest scholarship concentration due to highest enrollment.', 'QCYDO dominates funding across all colleges.']
              )}
              onExport={() => doExport('Scholar Distribution')}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={overviewData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7B6891' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="QCYDO" stackId="a" fill="#BB96E4" />
                  <Bar dataKey="UNIFAST" stackId="a" fill="#FFD066" />
                  <Bar dataKey="CHED" stackId="a" fill="#200D2D" />
                  <Bar dataKey="Private" stackId="a" fill="#FFDBED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}

      {/* Socioeconomic */}
      {activeView === 'socioeconomic' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {visibleCharts.has('income-donut') && (
            <ChartCard title="Income Bracket Distribution"
              onView={() => openLargeChart('Income Bracket Distribution',
                'Household monthly income breakdown across all scholarship beneficiaries. 62% come from low-income families earning below ₱15,000/month.',
                <div className="flex gap-6 items-center">
                  <ResponsiveContainer width="60%" height={380}>
                    <PieChart>
                      <Pie data={incomeData} cx="50%" cy="50%" innerRadius={80} outerRadius={160} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${((percent ?? 0) * 100).toFixed(1)}%`} labelLine>
                        {(incomeData as any[]).map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {(incomeData as any[]).map((d: any) => (
                      <div key={d.name} className="rounded-xl border border-lilac/15 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-3 h-3 rounded-full" style={{ background: d.fill }} />
                          <span className="text-xs font-semibold text-primary">{d.name}</span>
                        </div>
                        <p className="text-xl font-bold text-primary">{d.value.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>,
                INCOME_COLORS.map((c, i) => ({ label: (BASE_INCOME[i] ?? {name:''}).name, color: c })),
                ['Low-income scholars (62%) are the primary beneficiary group for QCYDO and UNIFAST/TES grants.']
              )}
              onExport={() => doExport('Income Brackets')}>
              <div className="flex gap-4 items-center">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie data={incomeData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {(incomeData as any[]).map((d: any, i: number) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {(incomeData as any[]).map((d: any) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.fill }} />
                      <span className="text-muted text-[11px]">{d.name}</span>
                      <span className="ml-auto font-bold text-primary">{d.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          )}

          {visibleCharts.has('parental-employment') && (
            <ChartCard title="Parental Employment Breakdown"
              onView={() => openLargeChart('Parental Employment Breakdown',
                'Occupational distribution of scholar parents/guardians. Provides socioeconomic context for scholarship need assessment.',
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={parentalData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#7B6891' }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#7B6891' }} width={110} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#BB96E4" radius={[0, 8, 8, 0]} name="Scholars" />
                  </BarChart>
                </ResponsiveContainer>,
                [{ label: 'Scholar Count', color: '#BB96E4' }],
                ['Private sector employees represent the largest parental employment category.', 'Unemployed households (1,564) highlight the critical necessity of grant support.']
              )}
              onExport={() => doExport('Parental Employment')}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={parentalData} layout="vertical" margin={{ top: 0, right: 8, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#7B6891' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#7B6891' }} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#BB96E4" radius={[0, 6, 6, 0]} name="Scholars" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}

      {/* Grant Breakdown */}
      {activeView === 'grant' && visibleCharts.has('grant-college') && (
        <ChartCard title="Grant Type Distribution Across Colleges"
          onView={() => openLargeChart('Grant Type Distribution Across Colleges',
            'Comparative view of scholarship grant type allocations per college. Reveals cross-college funding balance and dependency on specific grant programs.',
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={grantCollegeData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7B6891' }} />
                <YAxis tick={{ fontSize: 11, fill: '#7B6891' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="QCYDO" fill="#BB96E4" />
                <Bar dataKey="UNIFAST" fill="#FFD066" />
                <Bar dataKey="CHED" fill="#200D2D" />
                <Bar dataKey="Academic" fill="#00875A" />
                <Bar dataKey="Athletic" fill="#0052CC" />
              </BarChart>
            </ResponsiveContainer>,
            [{ label: 'QCYDO', color: '#BB96E4' }, { label: 'UNIFAST', color: '#FFD066' }, { label: 'CHED', color: '#200D2D' }, { label: 'Academic', color: '#00875A' }, { label: 'Athletic', color: '#0052CC' }],
            ['QCYDO is the dominant grant type across all colleges.', 'Academic honor grants are underutilized — recommend expansion.']
          )}
          onExport={() => doExport('Grant Breakdown')}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={grantCollegeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7B6891' }} />
              <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="QCYDO" fill="#BB96E4" />
              <Bar dataKey="UNIFAST" fill="#FFD066" />
              <Bar dataKey="CHED" fill="#200D2D" />
              <Bar dataKey="Academic" fill="#00875A" />
              <Bar dataKey="Athletic" fill="#0052CC" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* GPA Tracking */}
      {activeView === 'gpa' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gpaData.map(d => <KpiBadge key={d.range} label={`GPA ${d.range}`} value={d.scholars.toLocaleString()} accent="#200D2D" />)}
          </div>
          {visibleCharts.has('gpa-dist') && (
            <ChartCard title="GPA Distribution Per Range"
              onView={() => openLargeChart('GPA Distribution Per Range',
                'Distribution of scholars across GPA ranges. The largest cluster (1.51–2.00) represents Good Academic Standing scholars meeting standard retention requirements.',
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={gpaData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                    <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#7B6891' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#7B6891' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="scholars" name="Scholars" radius={[8, 8, 0, 0]}>
                      {gpaData.map(d => <Cell key={d.range} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>,
                gpaData.map(d => ({ label: `GPA ${d.range}`, color: d.fill })),
                ['Majority of scholars (3,800) fall in the 1.51–2.00 GPA range — Good Academic Standing.', 'Scholars with GPA >2.50 (300) are at-risk and require intervention.']
              )}
              onExport={() => doExport('GPA Distribution')}>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={gpaData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#7B6891' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="scholars" name="Scholars" radius={[6, 6, 0, 0]}>
                    {gpaData.map(d => <Cell key={d.range} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}

      {/* Retention Funnel */}
      {activeView === 'retention' && (
        <div className="space-y-5">
          {visibleCharts.has('retention-funnel') && (
            <ChartCard title="Scholar Cohort Retention Funnel (1st–4th Year)"
              onView={() => openLargeChart('Scholar Cohort Retention Funnel',
                'Tracks scholar enrollment continuity from 1st Year through 4th Year. The funnel visualizes cumulative attrition and retention rates per year level.',
                <div className="space-y-6 py-6">
                  {retentionData.map(d => (
                    <div key={d.name} className="flex items-center gap-6">
                      <span className="text-sm font-semibold text-primary w-24">{d.name}</span>
                      <div className="flex-1 relative h-12 rounded-xl overflow-hidden bg-surface">
                        <div className="h-full rounded-xl flex items-center px-5 transition-all duration-700"
                          style={{ width: `${(d.value / 2500) * 100}%`, background: d.fill }}>
                          <span className="text-white text-sm font-bold whitespace-nowrap">{d.value.toLocaleString()} scholars</span>
                        </div>
                      </div>
                      <span className="text-base font-bold w-14 text-right" style={{ color: d.fill }}>{d.pct}</span>
                    </div>
                  ))}
                </div>,
                retentionData.map(d => ({ label: `${d.name} (${d.pct})`, color: d.fill })),
                ['Largest dropout occurs 1st → 2nd Year (20% attrition). Recommend bridge grants for 2nd-year at-risk scholars.', 'Only 34% of entering scholars reach 4th Year — systemic intervention needed.']
              )}
              onExport={() => doExport('Retention Funnel')}>
              <div className="space-y-4 py-4">
                {retentionData.map(d => (
                  <div key={d.name} className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-primary w-20">{d.name}</span>
                    <div className="flex-1 relative h-10 rounded-xl overflow-hidden bg-surface">
                      <div className="h-full rounded-xl flex items-center px-4 transition-all duration-500"
                        style={{ width: `${(d.value / 2500) * 100}%`, background: d.fill }}>
                        <span className="text-white text-xs font-bold whitespace-nowrap">{d.value.toLocaleString()} scholars</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold w-12 text-right" style={{ color: d.fill }}>{d.pct}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}
          <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
            <p className="text-xs text-muted leading-relaxed">
              <strong className="text-primary">Retention Insight:</strong> Of {retentionData[0]?.value.toLocaleString() ?? 2500} entering 1st-year scholars, only {retentionData[3]?.value.toLocaleString() ?? 850} ({retentionData[3]?.pct ?? '34%'}) remain as 4th-year scholars. SPARDS recommends targeted academic mentoring and emergency financial bridge grants for at-risk 2nd-year scholars.
            </p>
          </div>
        </div>
      )}

      {/* First-Gen */}
      {activeView === 'firstgen' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpiBadge label="First-Gen Scholars" value={Math.round(2500 * s)} accent="#4C1413" />
            <KpiBadge label="Non-First-Gen Scholars" value={Math.round(4300 * s)} accent="#BB96E4" />
            <KpiBadge label="First-Gen Coverage" value="36.8%" accent="#FFD066" />
          </div>
          {visibleCharts.has('firstgen-compare') && (
            <ChartCard title="First-Generation vs. Continuing-Generation Scholar Distribution"
              onView={() => openLargeChart('First-Gen vs. Non-First-Gen Scholar Distribution',
                'Compares scholarship coverage between first-generation college students (first in family to attend university) and continuing-generation peers.',
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={firstgenData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7B6891' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#7B6891' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="FirstGen" name="First-Gen Scholars" fill="#4C1413" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="NonFirstGen" name="Non-First-Gen Scholars" fill="#BB96E4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>,
                [{ label: 'First-Gen Scholars', color: '#4C1413' }, { label: 'Non-First-Gen Scholars', color: '#BB96E4' }],
                ['First-gen scholars (36.8%) are underrepresented relative to total enrollment — recommend dedicated first-gen grant category.']
              )}
              onExport={() => doExport('First-Gen Analytics')}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={firstgenData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7B6891' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="FirstGen" name="First-Gen Scholars" fill="#4C1413" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="NonFirstGen" name="Non-First-Gen Scholars" fill="#BB96E4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}

      {/* Disbursement */}
      {activeView === 'disbursement' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KpiBadge label="Total Disbursed (AY26)" value="₱68.0M" accent="#00875A" />
            <KpiBadge label="Avg Completion Rate" value="96.5%" accent="#BB96E4" />
            <KpiBadge label="Pending Releases" value={50} accent="#FFD066" />
            <KpiBadge label="Avg Stipend/Scholar" value="₱10,000" accent="#200D2D" />
          </div>
          {visibleCharts.has('disbursement-line') && (
            <ChartCard title="Quarterly Stipend Release Timeline"
              onView={() => openLargeChart('Quarterly Stipend Release Timeline',
                'Tracks quarterly stipend disbursement completeness across all active grant programs. Shows the trend from pending to fully released status each quarter.',
                <ResponsiveContainer width="100%" height={420}>
                  <LineChart data={disburseData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                    <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#7B6891' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#7B6891' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="Released" stroke="#BB96E4" strokeWidth={3} dot={{ fill: '#BB96E4', r: 5 }} name="Released" />
                    <Line type="monotone" dataKey="Pending" stroke="#FFD066" strokeWidth={3} dot={{ fill: '#FFD066', r: 5 }} name="Pending" />
                  </LineChart>
                </ResponsiveContainer>,
                [{ label: 'Released', color: '#BB96E4' }, { label: 'Pending', color: '#FFD066' }],
                ['Disbursement completion rate consistently above 95% from Q3 2025 onward.', 'Pending counts are rapidly declining — on track for near-complete release by Q2 2026.']
              )}
              onExport={() => doExport('Disbursement Analytics')}>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={disburseData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: '#7B6891' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="Released" stroke="#BB96E4" strokeWidth={2.5} dot={{ fill: '#BB96E4', r: 4 }} name="Released" />
                  <Line type="monotone" dataKey="Pending" stroke="#FFD066" strokeWidth={2.5} dot={{ fill: '#FFD066', r: 4 }} name="Pending" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}

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
