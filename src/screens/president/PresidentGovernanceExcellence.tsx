import { useEffect, useState, type ReactNode } from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartModal from '../../components/ChartModal';
import { useApp } from '../../context/AppContext';
import ChartDataSummary from '../../components/ChartDataSummary';

const UNITS = ['Planning Office', 'Registrar & Admissions'] as const;

type Unit = (typeof UNITS)[number];
type ChartId = 'qars' | 'unifast';
type ExportScope = 'page' | ChartId;

const tooltipStyle = {
  borderRadius: 16,
  border: '1px solid rgba(187,150,228,.35)',
  background: '#200D2D',
  color: '#fff',
  boxShadow: '0 12px 32px rgba(32,13,45,.22)',
  fontSize: 11,
};

const TURNAROUND = [
  { period: '2025 baseline', short: '2025', days: 8.5, context: 'Source-provided baseline' },
  { period: 'Current average', short: 'Current', days: 4.2, context: 'Source-provided current average' },
];

function Icon({ type }: { type: 'governance' | 'clock' | 'filter' | 'export' }) {
  const paths = {
    governance: <><path d="M3 21h18M5 18h14M7 18V9m5 9V9m5 9V9M4 9h16L12 3 4 9z" /><path d="M9 13l2 2 4-4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
    export: <><path d="M12 16V3m0 0L7 8m5-5 5 5M4 15v5h16v-5" /></>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

function UnitSelect({ value, onChange }: { value: Unit; onChange: (value: Unit) => void }) {
  return (
    <label className="flex min-w-56 flex-1 flex-col gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-[.16em] text-muted">Administrative Unit</span>
      <span className="relative">
        <select aria-label="Administrative Unit" value={value} onChange={event => onChange(event.target.value as Unit)} className="w-full appearance-none rounded-xl border border-lilac/50 bg-lilac/10 px-3 py-2.5 pr-9 text-xs font-semibold text-primary outline-none transition-all focus:ring-4 focus:ring-lilac/15">
          {UNITS.map(unit => <option key={unit}>{unit}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lilac" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </span>
    </label>
  );
}

function MetricCard({ icon, label, value, detail, badge, unit, tone = 'lilac', onClick }: {
  icon: Parameters<typeof Icon>[0]['type'];
  label: string;
  value: string;
  detail: string;
  badge: string;
  unit: string;
  tone?: 'lilac' | 'gold' | 'rose';
  onClick: () => void;
}) {
  const tones = { lilac: 'bg-lilac/15 text-primary', gold: 'bg-golden/25 text-obsidian', rose: 'bg-blossom text-obsidian' };
  return (
    <button onClick={onClick} title={`${label}: ${value}. ${detail}`} className="group rounded-3xl border border-lilac/20 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lilac/50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-lilac/20">
      <span className="flex items-start justify-between gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}><Icon type={icon} /></span><span className="rounded-full bg-lilac/10 px-2 py-1 text-[8px] font-bold text-primary">{badge}</span></span>
      <span className="mt-5 block text-[9px] font-bold uppercase tracking-[.16em] text-muted">{label}</span>
      <span className="mt-2 block text-2xl font-bold tracking-tight text-primary count-animate">{value}</span>
      <span className="mt-1 block text-[10px] leading-relaxed text-muted">{detail}</span>
      <span className="mt-4 block border-t border-lilac/10 pt-3 text-[9px] font-semibold text-muted">{unit}</span>
    </button>
  );
}

function CardHeader({ eyebrow, title, description, badge, unit, onView, onExport }: {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  unit: string;
  onView: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-lilac/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">{eyebrow}</p><p className="mt-1 text-sm font-bold text-primary">{title}</p><p className="mt-1 max-w-xl text-[10px] leading-relaxed text-muted">{description}</p></div>
      <div className="flex shrink-0 flex-wrap justify-end gap-2">
        <span className="rounded-full bg-surface px-2.5 py-2 text-[9px] font-bold text-muted">{unit}</span>
        <span className="rounded-full bg-lilac/10 px-2.5 py-2 text-[9px] font-bold text-primary">{badge}</span>
        <button onClick={onView} className="rounded-xl border border-lilac/25 bg-lilac/5 px-3 py-2 text-[10px] font-bold text-primary hover:bg-lilac/15">View Chart</button>
        <button onClick={onExport} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-bold text-white hover:bg-primary/90"><Icon type="export" />Export</button>
      </div>
    </div>
  );
}

export default function PresidentGovernanceExcellence() {
  const { currentUser, showToast } = useApp();
  const [unit, setUnit] = useState<Unit>('Planning Office');
  const [activeChart, setActiveChart] = useState<ChartId | null>(null);
  const [exportScope, setExportScope] = useState<ExportScope | null>(null);
  const [detail, setDetail] = useState<'qars' | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const availability = {
    qars: unit === 'Planning Office',
    unifast: unit === 'Registrar & Admissions',
  };
  const filterContext = `Administrative Unit: ${unit}`;

  useEffect(() => {
    setRefreshing(true);
    const timeout = window.setTimeout(() => setRefreshing(false), 180);
    return () => window.clearTimeout(timeout);
  }, [unit]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDetail(null);
        setExportScope(null);
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);

  function rowsFor(scope: ExportScope): (string | number)[][] {
    const metadata: (string | number)[][] = [
      ['QCU InfoBoard', 'President Governance for Excellence · Pillar 7'],
      ['Authenticated user', `${currentUser?.name ?? 'Authorized user'} · ${currentUser?.title ?? 'Executive access'}`],
      ['Data status', 'Source-provided prototype sample data'],
      ['Filters', filterContext],
      ['Exported', new Date().toLocaleString()],
      [],
    ];
    if (scope === 'qars') return [...metadata, ['Metric', 'Value'], ['Institutional submissions', '14 / 14 offices'], ['Compliance rate', '100%'], ['Reporting period', 'Q3 2026'], ['Data owners', 'Planning Office, Records, All Offices']];
    if (scope === 'unifast') return [...metadata, ['Metric', 'Value'], ['Current average', '4.2 business days'], ['Target threshold', '≤ 5 business days'], ['2025 baseline', '8.5 business days'], ['Calculated difference', '4.3 business days faster'], ['Calculated reduction', '50.6%'], ['Data owners', 'Registrar & Admissions Division (RAD), VPAF']];
    return [
      ...metadata,
      ['QARS compliance', availability.qars ? '14 / 14 offices · 100% · Q3 2026' : 'Not available in active scope'],
      ['UNIFAST turnaround', availability.unifast ? '4.2 business days · target ≤5 · baseline 8.5' : 'Not available in active scope'],
    ];
  }

  function exportCsv(scope: ExportScope) {
    const csv = rowsFor(scope).map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `qcu-governance-excellence-${scope}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setExportScope(null);
    showToast({ type: 'success', title: 'CSV downloaded', body: 'The file includes visible source metrics, active filters, reporting periods, ownership, and account context.' });
  }

  function printPdfPreview() {
    window.print();
    setExportScope(null);
    showToast({ type: 'info', title: 'Print dialog opened', body: 'Choose “Save as PDF” to create the briefing. No server-side export is claimed.' });
  }

  const turnaroundChart = (large = false) => (
    <div className={large ? 'h-[390px]' : 'h-72'} aria-label="UNIFAST turnaround comparison chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={TURNAROUND} margin={{ top: 30, right: 42, left: 8, bottom: 8 }}>
          <CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" />
          <XAxis dataKey={large ? 'period' : 'short'} tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 9, fill: '#7B6891' }} label={{ value: 'Business days', angle: -90, position: 'insideLeft', fill: '#7B6891', fontSize: 10 }} axisLine={false} tickLine={false} />
          <ReferenceLine y={5} stroke="#FFD066" strokeWidth={2} strokeDasharray="5 4" label={{ value: 'Target ≤ 5 days', position: 'insideTopRight', fontSize: 9, fill: '#4C1413' }} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#FFD066', fontWeight: 700 }} labelFormatter={(_label, payload) => payload[0]?.payload.period ?? ''} formatter={(value, _name, item) => [`${value} business days · ${item.payload.context} · Target ≤ 5 days`, 'Processing duration']} />
          <Line type="linear" dataKey="days" name="Processing duration" stroke="#BB96E4" strokeWidth={4} dot={{ r: 7, fill: '#200D2D', stroke: '#FFD066', strokeWidth: 3 }} activeDot={{ r: 9 }}>
            <LabelList dataKey="days" position="top" formatter={(value: unknown) => `${value} days`} fill="#200D2D" fontSize={10} fontWeight={700} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const qarsVisual = (large = false) => (
    <div className="space-y-5">
      <button type="button" onClick={() => setDetail('qars')} aria-label="QARS compliance: 14 of 14 offices, 100 percent, Q3 2026" className="group relative block w-full rounded-3xl bg-gradient-to-r from-primary to-obsidian p-5 text-left text-white focus:outline-none focus:ring-4 focus:ring-lilac/25">
        <span className="flex flex-wrap items-end justify-between gap-4"><span><span className="block text-[9px] font-bold uppercase tracking-widest text-lilac">Q3 2026 institutional submissions</span><span className={`mt-2 block font-extrabold ${large ? 'text-5xl' : 'text-4xl'}`}>14 / 14</span><span className="mt-1 block text-[10px] text-white/55">offices compliant</span></span><span className="rounded-2xl bg-golden px-4 py-3 text-xl font-extrabold text-primary">100%</span></span>
        <span className="pointer-events-none absolute bottom-4 left-1/2 z-10 w-72 -translate-x-1/2 translate-y-4 rounded-2xl border border-lilac/20 bg-primary p-3 text-[10px] leading-relaxed text-white opacity-0 shadow-2xl transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100"><b className="text-golden">14 of 14 offices · 100%</b><br />Q3 2026<br />Owners: Planning Office, Records, All Offices</span>
      </button>
      <div className={`grid gap-2 ${large ? 'grid-cols-7' : 'grid-cols-7'}`} aria-label="Illustrative status grid">
        {Array.from({ length: 14 }, (_, index) => <button key={index} type="button" onClick={() => showToast({ type: 'info', title: `Illustrative compliant tile ${index + 1}`, body: 'No office identity or office-level evidence was supplied; this tile demonstrates the aggregate 14 / 14 status only.' })} title={`Illustrative compliant tile ${index + 1} of 14 — no office identity supplied`} className="aspect-square rounded-xl border border-coa/20 bg-coa/10 text-coa transition-all hover:-translate-y-0.5 hover:bg-coa/20 focus:ring-4 focus:ring-coa/15"><svg className="mx-auto" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>)}
      </div>
      <p className="rounded-2xl border border-dashed border-lilac/25 bg-surface p-3 text-[9px] leading-relaxed text-muted"><b className="text-primary">Status legend:</b> check = compliant. Tiles are illustrative prototype placeholders only; the source does not provide office names or office-level records.</p>
    </div>
  );

  const modalMeta: Record<ChartId, { title: string; description: string; owner: string; chart: ReactNode; summary: { label: string; value: string }[]; insights: string[] }> = {
    qars: { title: 'QARS Compliance Reporting Status', description: `Aggregate institutional status only. ${filterContext}.`, owner: 'Planning Office, Records, All Offices', chart: qarsVisual(true), summary: [{ label: 'Submissions', value: '14 / 14 offices' }, { label: 'Compliance', value: '100%' }, { label: 'Reporting period', value: 'Q3 2026' }, { label: 'Source type', value: 'Source-provided sample' }], insights: ['Individual office names and office-level evidence were not supplied.', 'The status grid is explicitly illustrative; the 14 / 14 aggregate is source-provided.'] },
    unifast: { title: 'UNIFAST Scholarship Processing Turnaround', description: `Two source-provided comparison points and target reference only. ${filterContext}.`, owner: 'Registrar & Admissions Division (RAD), VPAF', chart: turnaroundChart(true), summary: [{ label: 'Current average', value: '4.2 business days' }, { label: 'Target', value: '≤ 5 business days' }, { label: '2025 baseline', value: '8.5 business days' }, { label: 'Calculated difference', value: '4.3 days faster' }], insights: ['Lower processing duration is better; the current 4.2-day average is within target.', 'Calculated reduction: (8.5 − 4.2) ÷ 8.5 = 50.6%. No intermediate time-series values were supplied.'] },
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white shadow-xl">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" /><div className="absolute -bottom-24 right-1/3 h-52 w-52 rounded-full bg-golden/10 blur-3xl" />
        <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-lilac/25 bg-lilac/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-lilac">Pillar 7 · Executive governance</span><span className="rounded-full border border-golden/25 bg-golden/10 px-3 py-1 text-[9px] font-bold text-golden">Source-provided prototype data</span></div>
            <p className="mt-5 text-2xl font-bold tracking-tight">Governance for Excellence</p><p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/60">Focused executive monitoring for institutional compliance and scholarship-processing performance.</p>
          </div>
          <button onClick={() => setExportScope('page')} className="flex items-center justify-center gap-2 rounded-xl bg-golden px-4 py-2.5 text-xs font-bold text-primary hover:-translate-y-0.5 hover:bg-golden/90"><Icon type="export" />Export All Page Data</button>
        </div>
      </section>

      <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 border-b border-lilac/10 pb-4"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lilac/15 text-primary"><Icon type="filter" /></span><div><p className="text-xs font-bold text-primary">Administrative Unit</p><p className="mt-0.5 text-[10px] text-muted">Choose one of the two authorized governance views; connected displays refresh automatically.</p></div></div>
        <div className="mt-4 flex justify-center"><UnitSelect value={unit} onChange={setUnit} /></div>
      </section>

      {refreshing ? <section className="mx-auto grid w-full max-w-2xl gap-4">{Array.from({ length: unit === 'Planning Office' ? 2 : 1 }, (_, item) => <div key={item} className="h-44 animate-pulse rounded-3xl border border-lilac/10 bg-white p-5"><div className="h-10 w-10 rounded-2xl bg-lilac/15" /><div className="mt-8 h-3 w-2/3 rounded bg-lilac/10" /><div className="mt-3 h-7 w-1/2 rounded bg-lilac/10" /></div>)}</section> : <>
        <div className="mx-auto grid w-full max-w-2xl gap-4">
          {availability.qars && <MetricCard icon="governance" label="Q3 2026 Institutional Submissions" value="14 / 14 offices" detail="100% compliant" badge="QARS Compliance" unit="Planning Office" onClick={() => setActiveChart('qars')} />}
          {availability.unifast && <MetricCard icon="clock" label="UNIFAST Average Processing" value="4.2 business days" detail="Target ≤ 5 days · improved from 8.5 days in 2025" badge="Scholarship Processing" unit="Registrar & Admissions" tone="gold" onClick={() => setActiveChart('unifast')} />}
        </div>

        <div className="mx-auto grid w-full max-w-5xl gap-5">
          {availability.qars && <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm"><CardHeader eyebrow="Institutional reporting" title="QARS Compliance Reporting Status" description="Aggregate submission status with clearly labeled illustrative tiles." badge="QARS Compliance" unit="Planning Office" onView={() => setActiveChart('qars')} onExport={() => setExportScope('qars')} /><div className="mt-5">{qarsVisual()}</div><p className="mt-4 rounded-2xl bg-surface px-4 py-3 text-[10px] text-muted"><b className="text-primary">Data owners:</b> Planning Office, Records, All Offices</p></section>}
        </div>
      </>}

      {activeChart && availability[activeChart] && <ChartModal title={modalMeta[activeChart].title} description={modalMeta[activeChart].description} chart={modalMeta[activeChart].chart} dataSummary={activeChart === 'unifast' ? <ChartDataSummary data={TURNAROUND} categoryKey="period" series={[{ key: 'days', label: 'Processing duration', color: '#BB96E4', unit: 'days' }]} distribution={false} showTotal={false} showSeriesAggregates={false} /> : undefined} summary={[...modalMeta[activeChart].summary, { label: 'Assigned data owners', value: modalMeta[activeChart].owner }]} insights={[...modalMeta[activeChart].insights, 'Prototype sample data · no live university-system integration is claimed.']} onExport={() => setExportScope(activeChart)} onClose={() => setActiveChart(null)} />}

      {detail && <div className="modal-backdrop fixed inset-0 z-[310] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) setDetail(null); }}><div className="modal-content w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Aggregate record detail</p><p className="mt-1 text-lg font-bold text-primary">QARS Compliance Reporting Status</p></div><button onClick={() => setDetail(null)} aria-label="Close record details" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-muted hover:text-primary">×</button></div>
        <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-lilac/10 p-4"><p className="text-[9px] uppercase tracking-wider text-muted">Compliant</p><p className="mt-1 text-xl font-extrabold text-primary">14 / 14</p></div><div className="rounded-2xl bg-golden/20 p-4"><p className="text-[9px] uppercase tracking-wider text-muted">Period</p><p className="mt-1 text-sm font-extrabold text-primary">Q3 2026</p></div></div>
        <p className="mt-4 rounded-2xl bg-surface p-4 text-[10px] leading-relaxed text-muted">Individual office names and office-level submission evidence: Not available in supplied sample data.</p><p className="mt-3 text-[10px] text-muted"><b className="text-primary">Data owners:</b> Planning Office, Records, All Offices</p><button onClick={() => setDetail(null)} className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white">Close details</button></div></div>}

      {exportScope && <div className="modal-backdrop fixed inset-0 z-[320] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) setExportScope(null); }}><div className="modal-content w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Export preview</p><p className="mt-1 text-lg font-bold text-primary">{exportScope === 'page' ? 'Export All Page Data' : `Export ${exportScope === 'qars' ? 'QARS Compliance Status' : 'UNIFAST Turnaround'}`}</p></div><button onClick={() => setExportScope(null)} aria-label="Close export preview" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-muted hover:text-primary">×</button></div>
        <div className="mt-4 rounded-2xl border border-lilac/15 bg-surface p-4 text-[10px] leading-relaxed text-muted"><p><b className="text-primary">Current filter:</b> {filterContext}</p><p className="mt-1"><b className="text-primary">Authenticated context:</b> {currentUser?.name} · {currentUser?.title}</p><p className="mt-1"><b className="text-primary">Included:</b> The selected unit’s source metrics, periods, target/baseline context, and owner attribution.</p></div>
        <p className="mt-4 text-xs leading-relaxed text-muted">CSV creates a real structured file. PDF opens the browser print dialog so you can choose “Save as PDF”; this prototype does not claim a backend export.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><button onClick={() => exportCsv(exportScope)} className="rounded-2xl border border-lilac/20 bg-lilac/10 p-4 text-left hover:border-lilac hover:bg-lilac/20"><span className="block text-xs font-bold text-primary">CSV data export</span><span className="mt-1 block text-[10px] text-muted">Download synchronized data</span></button><button onClick={printPdfPreview} className="rounded-2xl border border-golden/30 bg-golden/15 p-4 text-left hover:border-golden hover:bg-golden/25"><span className="block text-xs font-bold text-primary">PDF executive briefing</span><span className="mt-1 block text-[10px] text-muted">Open print / Save as PDF</span></button></div><button onClick={() => setExportScope(null)} className="mt-4 w-full rounded-xl bg-surface px-4 py-3 text-xs font-bold text-primary hover:bg-lilac/10">Cancel</button></div></div>}
    </div>
  );
}
