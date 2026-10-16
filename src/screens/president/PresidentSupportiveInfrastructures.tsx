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
import ChartSelection from '../../components/ChartSelection';
import { useApp } from '../../context/AppContext';
import ChartDataSummary from '../../components/ChartDataSummary';

const FACILITIES = ['All', 'Classrooms', 'Laboratories', 'Library', 'Fitness Center', 'Offices'] as const;
const CAMPUSES = ['All', 'San Bartolome', 'Batasan', 'San Francisco'] as const;
const CHARTS = [
  { id: 'adoption', label: 'Smart-Classroom Adoption' },
  { id: 'accessibility', label: 'PWD Accessibility Compliance' },
  { id: 'energy', label: 'Monthly Energy Consumption Reduction' },
];

type Facility = (typeof FACILITIES)[number];
type Campus = (typeof CAMPUSES)[number];
type ChartId = 'adoption' | 'accessibility' | 'energy';
type ExportScope = 'page' | ChartId;

const ACCESSIBILITY = [
  { building: 'Administrative Building', compliance: 100 },
  { building: 'Academic Building A', compliance: 92 },
  { building: 'Gymnasium', compliance: 85 },
];

const ENERGY = [
  { period: '2025 Monthly Average', shortPeriod: '2025 avg.', kwh: 45_000, context: 'Baseline monthly average' },
  { period: 'October 2026', shortPeriod: 'Oct 2026', kwh: 41_200, context: 'Current source value · 8.4% reduction achieved' },
];

const tooltipStyle = {
  borderRadius: 16,
  border: '1px solid rgba(187,150,228,.35)',
  background: '#200D2D',
  color: '#fff',
  boxShadow: '0 12px 32px rgba(32,13,45,.22)',
  fontSize: 11,
};

function Icon({ type }: { type: 'building' | 'classroom' | 'accessibility' | 'energy' | 'filter' | 'export' | 'info' | 'carbon' }) {
  const paths = {
    building: <><path d="M3 21h18M5 21V8l7-5 7 5v13M9 12h2m2 0h2m-6 4h2m2 0h2" /></>,
    classroom: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4M7 9h10m-5-2v4" /></>,
    accessibility: <><circle cx="12" cy="4" r="2" /><path d="M5 8h14m-7 0v5m0 0-4 8m4-8 5 3m-1 5-3-6" /></>,
    energy: <><path d="M13 2L5 14h7l-1 8 8-12h-7l1-8z" /></>,
    filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
    export: <><path d="M12 16V3m0 0L7 8m5-5 5 5M4 15v5h16v-5" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></>,
    carbon: <><path d="M19 4c-7 0-12 3-12 8 0 3 2 5 5 5 5 0 7-6 7-13z" /><path d="M5 21c1-5 4-8 10-11" /></>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

function FilterSelect<T extends string>({ label, value, options, placeholder, onChange }: {
  label: string;
  value: T | '';
  options: readonly T[];
  placeholder: string;
  onChange: (value: T | '') => void;
}) {
  return (
    <label className="flex min-w-52 flex-1 flex-col gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-[.16em] text-muted">{label}</span>
      <span className="relative">
        <select
          aria-label={label}
          value={value}
          onChange={event => onChange(event.target.value as T | '')}
          className={`w-full appearance-none rounded-xl border px-3 py-2.5 pr-9 text-xs font-semibold outline-none transition-all focus:ring-4 focus:ring-lilac/15 ${value ? 'border-lilac/50 bg-lilac/10 text-primary' : 'border-lilac/20 bg-surface text-muted'}`}>
          <option value="">{placeholder}</option>
          {options.map(option => <option key={option}>{option}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lilac" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </span>
    </label>
  );
}

function MetricCard({ icon, label, value, detail, tone = 'lilac', onClick }: {
  icon: Parameters<typeof Icon>[0]['type'];
  label: string;
  value: string;
  detail: string;
  tone?: 'lilac' | 'gold' | 'rose';
  onClick: () => void;
}) {
  const tones = {
    lilac: 'bg-lilac/15 text-primary',
    gold: 'bg-golden/25 text-obsidian',
    rose: 'bg-blossom text-obsidian',
  };
  return (
    <button onClick={onClick} className="group rounded-3xl border border-lilac/20 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lilac/50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-lilac/20">
      <span className="flex items-start justify-between gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}><Icon type={icon} /></span>
        <svg className="text-lilac opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-focus:opacity-100" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
      </span>
      <span className="mt-5 block text-[9px] font-bold uppercase tracking-[.16em] text-muted">{label}</span>
      <span className="mt-2 block text-2xl font-bold tracking-tight text-primary count-animate">{value}</span>
      <span className="mt-1 block text-[10px] leading-relaxed text-muted">{detail}</span>
    </button>
  );
}

function CardHeader({ eyebrow, title, description, onView, onExport }: {
  eyebrow: string;
  title: string;
  description: string;
  onView: () => void;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-lilac/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">{eyebrow}</p>
        <p className="mt-1 text-sm font-bold text-primary">{title}</p>
        <p className="mt-1 max-w-xl text-[10px] leading-relaxed text-muted">{description}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button onClick={onView} className="rounded-xl border border-lilac/25 bg-lilac/5 px-3 py-2 text-[10px] font-bold text-primary transition-colors hover:bg-lilac/15">View Chart</button>
        <button onClick={onExport} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-primary/90"><Icon type="export" />Export</button>
      </div>
    </div>
  );
}

function AdoptionVisual({ large = false }: { large?: boolean }) {
  const size = large ? 'h-80 w-80' : 'h-56 w-56';
  return (
    <div className="flex flex-col items-center justify-center gap-5 md:flex-row">
      <button
        type="button"
        aria-label="Smart-classroom adoption: 42 of 60 rooms, 70 percent current adoption, target 85 percent by 2028"
        title="42 of 60 rooms · 70.0% adoption · 85% target for 2028"
        className={`group relative shrink-0 rounded-full focus:outline-none focus:ring-4 focus:ring-lilac/25 ${size}`}>
        <svg viewBox="0 0 120 120" className="-rotate-90 overflow-visible">
          <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(187,150,228,.14)" strokeWidth="11" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#BB96E4" strokeWidth="11" strokeLinecap="round" pathLength="100" strokeDasharray="70 100" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#FFD066" strokeWidth="3" pathLength="100" strokeDasharray="1.5 98.5" strokeDashoffset="-84.25" />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-primary">70.0%</span>
          <span className="mt-1 text-[10px] font-semibold text-muted">42 / 60 rooms</span>
        </span>
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-56 -translate-x-1/2 translate-y-12 rounded-2xl bg-primary p-3 text-left text-[10px] text-white opacity-0 shadow-2xl transition-all group-hover:translate-y-10 group-hover:opacity-100 group-focus:translate-y-10 group-focus:opacity-100">
          <b className="text-golden">Smart-Classroom Adoption</b><br />42 smart-enabled of 60 total rooms<br />Current: 70.0% · 2028 target: 85%
        </span>
      </button>
      <div className="w-full max-w-xs space-y-3">
        <div className="rounded-2xl bg-lilac/10 p-4">
          <div className="flex items-center justify-between text-[10px] font-bold text-primary"><span>Current adoption</span><span>70.0%</span></div>
          <div className="relative mt-3 h-2 rounded-full bg-white">
            <span className="absolute inset-y-0 left-0 w-[70%] rounded-full bg-lilac" />
            <span className="absolute -top-1 left-[85%] h-4 w-1 rounded-full bg-golden" title="2028 target: 85%" />
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-muted"><span>Current</span><span>85% target</span></div>
        </div>
        <div className="rounded-2xl border border-golden/30 bg-golden/15 p-4 text-[10px] leading-relaxed text-obsidian">
          <b>Calculated helper:</b> 15 percentage points below target. If 60 rooms remains constant, 9 additional smart-enabled rooms are needed to reach 51 rooms.
        </div>
      </div>
    </div>
  );
}

export default function PresidentSupportiveInfrastructures() {
  const { showToast } = useApp();
  const [facility, setFacility] = useState<Facility>('All');
  const [campus, setCampus] = useState<Campus>('All');
  const [visibleCharts, setVisibleCharts] = useState(new Set(CHARTS.map(chart => chart.id)));
  const [activeChart, setActiveChart] = useState<ChartId | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<(typeof ACCESSIBILITY)[number] | null>(null);
  const [exportScope, setExportScope] = useState<ExportScope | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const hasSample = (facility === 'All' || facility === 'Classrooms') && (campus === 'All' || campus === 'San Bartolome');
  const filterContext = `Facility Type: ${facility}; Campus Location: ${campus}`;

  useEffect(() => {
    setRefreshing(true);
    const timeout = window.setTimeout(() => setRefreshing(false), 180);
    return () => window.clearTimeout(timeout);
  }, [facility, campus]);

  function resetFilters(notify = true) {
    setFacility('All');
    setCampus('All');
    if (notify) showToast({ type: 'info', title: 'Infrastructure filters reset', body: 'All facility types and campus locations are restored.' });
  }

  function toggleChart(id: string, checked: boolean) {
    setVisibleCharts(previous => {
      const next = new Set(previous);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function rowsFor(scope: ExportScope): (string | number)[][] {
    const metadata: (string | number)[][] = [
      ['QCU InfoBoard', 'President Supportive Infrastructures · Pillar 6'],
      ['Data status', 'Source-supplied prototype sample data'],
      ['Filters', filterContext],
      ['Exported', new Date().toLocaleString()],
      [],
    ];
    if (!hasSample) return [...metadata, ['Result', 'No sample records are available for this combination.']];
    if (scope === 'adoption') return [...metadata, ['Metric', 'Value'], ['Smart-enabled rooms', 42], ['Total rooms', 60], ['Adoption rate', '70.0%'], ['2028 target', '85%'], ['Assigned data owners', 'PFGSD, MIS, VPAF']];
    if (scope === 'accessibility') return [...metadata, ['Building / Facility', 'PWD Accessibility Compliance'], ...ACCESSIBILITY.map(row => [row.building, `${row.compliance}%`]), ['Overall compliance (supplied)', '92.3%'], ['Assigned data owners', 'PFGSD, PSPMD, GAD Office']];
    if (scope === 'energy') return [...metadata, ['Reference period', 'Energy consumption (kWh)'], ...ENERGY.map(row => [row.period, row.kwh]), ['Reduction achieved', '8.4%'], ['Target reduction', '10%'], ['Carbon footprint', 'Numeric data not provided'], ['Assigned data owners', 'PFGSD, Sustainability Office']];
    return [
      ...metadata,
      ['Visible visualizations', CHARTS.filter(chart => visibleCharts.has(chart.id)).map(chart => chart.label).join('; ') || 'None'],
      ['Smart-enabled rooms', '42 / 60'],
      ['Smart-classroom adoption', '70.0%'],
      ['2028 adoption target', '85%'],
      ['Overall PWD accessibility compliance', '92.3%'],
      ['2025 monthly average baseline', '45,000 kWh'],
      ['October 2026 current value', '41,200 kWh'],
      ['Energy reduction achieved', '8.4%'],
      ['Energy reduction target', '10%'],
      ['Carbon footprint', 'Numeric data not provided'],
      [],
      ['Building / Facility', 'PWD Accessibility Compliance'],
      ...ACCESSIBILITY.map(row => [row.building, `${row.compliance}%`]),
      [],
      ['Metric', 'Assigned data owners'],
      ['Smart-Classroom Adoption', 'PFGSD, MIS, VPAF'],
      ['PWD Accessibility Compliance', 'PFGSD, PSPMD, GAD Office'],
      ['Monthly Energy Consumption Reduction', 'PFGSD, Sustainability Office'],
    ];
  }

  function exportCsv(scope: ExportScope) {
    const csv = rowsFor(scope).map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `qcu-supportive-infrastructures-${scope}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setExportScope(null);
    showToast({ type: 'success', title: 'CSV downloaded', body: 'The file includes the current filters, data status, values, units, periods, and owner attribution.' });
  }

  function printPdfPreview() {
    window.print();
    setExportScope(null);
    showToast({ type: 'info', title: 'Print dialog opened', body: 'Choose “Save as PDF” to create the briefing. No download is claimed until you save it.' });
  }

  const energyChart = (large = false) => (
    <div className={large ? 'h-[390px]' : 'h-72'} aria-label="Energy consumption comparison chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ENERGY} margin={{ top: 28, right: large ? 70 : 34, left: large ? 24 : 4, bottom: large ? 18 : 4 }}>
          <CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" />
          <XAxis dataKey={large ? 'period' : 'shortPeriod'} tick={{ fontSize: large ? 11 : 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
          <YAxis domain={[39_000, 46_000]} tick={{ fontSize: 9, fill: '#7B6891' }} tickFormatter={value => `${value / 1000}k`} label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#7B6891', fontSize: 10 }} axisLine={false} tickLine={false} />
          <ReferenceLine y={40_500} stroke="#FFD066" strokeDasharray="5 4" label={{ value: 'Calculated 10% target: 40,500 kWh', position: 'insideBottomRight', fontSize: 9, fill: '#4C1413' }} />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#FFD066', fontWeight: 700 }}
            labelFormatter={(_label, payload) => payload[0]?.payload.period ?? ''}
            formatter={(value, _name, item) => [`${Number(value).toLocaleString()} kWh · ${item.payload.context}`, 'Energy use']}
          />
          <Line type="linear" dataKey="kwh" name="Energy consumption" stroke="#BB96E4" strokeWidth={4} dot={{ r: 7, fill: '#200D2D', stroke: '#FFD066', strokeWidth: 3 }} activeDot={{ r: 9 }}>
            <LabelList dataKey="kwh" position="top" formatter={(value: unknown) => `${Number(value).toLocaleString()} kWh`} fill="#200D2D" fontSize={10} fontWeight={700} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const accessibilityTable = (expanded = false) => (
    <div className="overflow-x-auto rounded-2xl border border-lilac/15">
      <table className="w-full min-w-[560px] text-left">
        <thead className="bg-primary text-white">
          <tr><th scope="col" className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider">Building / Facility</th><th scope="col" className="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-wider">Compliance</th><th scope="col" className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider">Visual indicator</th></tr>
        </thead>
        <tbody>
          {ACCESSIBILITY.map(row => (
            <tr
              key={row.building}
              tabIndex={0}
              title={`${row.building}: ${row.compliance}% PWD accessibility compliance`}
              onClick={() => setSelectedBuilding(row)}
              onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setSelectedBuilding(row); }}
              className="cursor-pointer border-b border-lilac/10 transition-colors last:border-0 hover:bg-blossom/20 focus:bg-lilac/10 focus:outline-none">
              <th scope="row" className={`px-4 text-xs font-semibold text-primary ${expanded ? 'py-5' : 'py-4'}`}>{row.building}</th>
              <td className="px-4 py-4 text-right text-sm font-extrabold text-primary">{row.compliance}%</td>
              <td className="px-4 py-4"><div className="h-2 min-w-28 rounded-full bg-surface"><div className="h-full rounded-full bg-lilac" style={{ width: `${row.compliance}%` }} /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center justify-between gap-2 bg-golden/15 px-4 py-3"><span className="text-[10px] font-bold text-obsidian">Overall compliance · supplied figure</span><span className="text-lg font-extrabold text-primary">92.3%</span></div>
    </div>
  );

  const modalMeta: Record<ChartId, { title: string; description: string; owner: string; chart: ReactNode; summary: { label: string; value: string }[]; insights: string[] }> = {
    adoption: {
      title: 'Smart-Classroom Adoption',
      description: `Current sample value and 2028 target benchmark. ${filterContext}.`,
      owner: 'PFGSD, MIS, VPAF',
      chart: <AdoptionVisual large />,
      summary: [{ label: 'Smart-enabled rooms', value: '42 / 60 rooms' }, { label: 'Current adoption', value: '70.0%' }, { label: '2028 target', value: '85%' }, { label: 'Data status', value: 'Prototype sample data' }],
      insights: ['Current adoption is 15 percentage points below the 2028 target.', 'Calculated helper: 51 of 60 rooms would meet 85%, requiring 9 additional rooms if the total remains unchanged.'],
    },
    accessibility: {
      title: 'PWD Accessibility Compliance',
      description: `Building-level source values with the supplied overall figure. ${filterContext}.`,
      owner: 'PFGSD, PSPMD, GAD Office',
      chart: accessibilityTable(true),
      summary: [{ label: 'Administrative Building', value: '100%' }, { label: 'Academic Building A', value: '92%' }, { label: 'Gymnasium', value: '85%' }, { label: 'Overall supplied', value: '92.3%' }],
      insights: ['The 92.3% overall value is retained as supplied; no undocumented weighting method is inferred.', 'Select or focus a row to inspect its exact percentage.'],
    },
    energy: {
      title: 'Monthly Energy Consumption Reduction',
      description: `Two supplied reference points only; this is not a complete monthly time series. ${filterContext}.`,
      owner: 'PFGSD, Sustainability Office',
      chart: energyChart(true),
      summary: [{ label: '2025 monthly average', value: '45,000 kWh' }, { label: 'October 2026', value: '41,200 kWh' }, { label: 'Reduction achieved', value: '8.4%' }, { label: 'Target reduction', value: '10%' }],
      insights: ['The reported current value is 700 kWh above the calculated 40,500 kWh level for a 10% reduction.', 'Numeric carbon-footprint data and a verified conversion factor were not provided.'],
    },
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white shadow-xl">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-52 w-52 rounded-full bg-golden/10 blur-3xl" />
        <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-lilac/25 bg-lilac/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-lilac">Pillar 6 · Infrastructure readiness</span>
              <span className="rounded-full border border-golden/25 bg-golden/10 px-3 py-1 text-[9px] font-bold text-golden">Prototype sample data</span>
            </div>
            <p className="mt-5 text-2xl font-bold tracking-tight">Supportive Infrastructures</p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/60">Monitor infrastructure readiness, smart-classroom adoption, accessibility compliance, and energy-reduction progress.</p>
          </div>
          <button onClick={() => setExportScope('page')} className="flex items-center justify-center gap-2 rounded-xl bg-golden px-4 py-2.5 text-xs font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-golden/90"><Icon type="export" />Export All Page Data</button>
        </div>
      </section>

      <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-lilac/10 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lilac/15 text-primary"><Icon type="filter" /></span>
            <div><p className="text-xs font-bold text-primary">Infrastructure Readiness Filters</p><p className="mt-0.5 text-[10px] text-muted">Every KPI, visualization, modal, and export reads this shared state.</p></div>
          </div>
          <ChartSelection charts={CHARTS} visible={visibleCharts} onChange={toggleChart} />
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <FilterSelect label="Facility Type" value={facility} options={FACILITIES} placeholder="Select facility type" onChange={setFacility} />
          <FilterSelect label="Campus Location" value={campus} options={CAMPUSES} placeholder="Select campus location" onChange={setCampus} />
          <button onClick={() => resetFilters()} className="rounded-xl border border-lilac/25 px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-lilac/10">Reset Filters</button>
        </div>
      </section>

      {refreshing ? (
        <section aria-live="polite" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map(item => <div key={item} className="h-44 animate-pulse rounded-3xl border border-lilac/10 bg-white p-5"><div className="h-10 w-10 rounded-2xl bg-lilac/15" /><div className="mt-8 h-3 w-2/3 rounded bg-lilac/10" /><div className="mt-3 h-7 w-1/2 rounded bg-lilac/10" /></div>)}
        </section>
      ) : !hasSample ? (
        <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-14 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blossom text-obsidian"><Icon type="building" /></span>
          <p className="mt-4 text-sm font-bold text-primary">No sample records are available for this combination</p>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted">The source specification maps infrastructure values only to the Classrooms · San Bartolome sample workflow. Values from another campus or facility are not reused or invented.</p>
          <button onClick={() => resetFilters()} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white">Restore sample view</button>
        </section>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard icon="classroom" label="Smart-enabled rooms" value="42 / 60" detail="Source sample · current room count" onClick={() => setActiveChart('adoption')} />
            <MetricCard icon="classroom" label="Smart-classroom adoption" value="70.0%" detail="2028 target: 85%" tone="gold" onClick={() => setActiveChart('adoption')} />
            <MetricCard icon="accessibility" label="Overall PWD compliance" value="92.3%" detail="Supplied overall figure" onClick={() => setActiveChart('accessibility')} />
            <MetricCard icon="energy" label="Energy use" value="41,200 kWh" detail="October 2026 · baseline 45,000 kWh" tone="rose" onClick={() => setActiveChart('energy')} />
            <MetricCard icon="energy" label="Energy reduction achieved" value="8.4%" detail="Target: 10% reduction" tone="gold" onClick={() => setActiveChart('energy')} />
          </div>

          {!visibleCharts.size && (
            <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-sm font-bold text-primary">All visualization cards are hidden</p>
              <p className="mt-2 text-xs text-muted">Your filters remain active. Restore the cards without changing the current data scope.</p>
              <button onClick={() => setVisibleCharts(new Set(CHARTS.map(chart => chart.id)))} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white">Restore all visualizations</button>
            </section>
          )}

          <div className="grid gap-5 xl:grid-cols-5">
            {visibleCharts.has('adoption') && (
              <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm xl:col-span-2">
                <CardHeader eyebrow="Digital learning readiness" title="Smart-Classroom Adoption" description="Current source value compared with the 2028 target benchmark." onView={() => setActiveChart('adoption')} onExport={() => setExportScope('adoption')} />
                <div className="mt-5"><AdoptionVisual /></div>
                <p className="mt-4 rounded-2xl bg-surface px-4 py-3 text-[10px] text-muted"><b className="text-primary">Data owners:</b> PFGSD, MIS, VPAF</p>
              </section>
            )}

            {visibleCharts.has('accessibility') && (
              <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm xl:col-span-3">
                <CardHeader eyebrow="Inclusive campus access" title="PWD Accessibility Compliance" description="Select or focus a building row for its exact source-provided percentage." onView={() => setActiveChart('accessibility')} onExport={() => setExportScope('accessibility')} />
                <div className="mt-5">{accessibilityTable()}</div>
                <p className="mt-4 rounded-2xl bg-surface px-4 py-3 text-[10px] text-muted"><b className="text-primary">Data owners:</b> PFGSD, PSPMD, GAD Office · Overall weighting method not supplied.</p>
              </section>
            )}
          </div>

          {visibleCharts.has('energy') && (
            <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
              <CardHeader eyebrow="Resource efficiency" title="Monthly Energy Consumption Reduction" description="Two supplied comparison points only—not a complete historical monthly sequence." onView={() => setActiveChart('energy')} onExport={() => setExportScope('energy')} />
              <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_18rem]">
                {energyChart()}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-lilac/10 p-4"><p className="text-[9px] font-bold uppercase tracking-widest text-muted">Achieved</p><p className="mt-1 text-xl font-extrabold text-primary">8.4%</p><p className="text-[9px] text-muted">reduction</p></div>
                    <div className="rounded-2xl bg-golden/20 p-4"><p className="text-[9px] font-bold uppercase tracking-widest text-muted">Target</p><p className="mt-1 text-xl font-extrabold text-primary">10%</p><p className="text-[9px] text-muted">reduction</p></div>
                  </div>
                  <div className="rounded-2xl border border-lilac/15 bg-surface p-4 text-[10px] leading-relaxed text-muted"><b className="text-primary">Calculated context:</b> 1.6 percentage points below target. The calculated 10% target level is 40,500 kWh; current use is 700 kWh above it.</div>
                  <div className="flex items-start gap-3 rounded-2xl border border-dashed border-lilac/30 bg-white p-4"><span className="text-lilac"><Icon type="carbon" /></span><div><p className="text-[10px] font-bold text-primary">Carbon footprint data not provided</p><p className="mt-1 text-[9px] leading-relaxed text-muted">A numeric emissions series requires verified consumption-to-carbon conversion data.</p></div></div>
                  <p className="rounded-2xl bg-surface px-4 py-3 text-[10px] text-muted"><b className="text-primary">Data owners:</b> PFGSD, Sustainability Office</p>
                </div>
              </div>
              <ChartDataSummary className="mt-3" data={ENERGY} categoryKey="period" series={[{ key: 'kwh', label: 'Energy use', color: '#BB96E4', unit: 'kWh' }]} distribution={false} showTotal={false} showSeriesAggregates={false} />
            </section>
          )}
        </>
      )}

      {activeChart && hasSample && (
        <ChartModal
          title={modalMeta[activeChart].title}
          description={modalMeta[activeChart].description}
          chart={modalMeta[activeChart].chart}
          dataSummary={activeChart === 'energy' ? <ChartDataSummary data={ENERGY} categoryKey="period" series={[{ key: 'kwh', label: 'Energy use', color: '#BB96E4', unit: 'kWh' }]} distribution={false} showTotal={false} showSeriesAggregates={false} /> : undefined}
          summary={[...modalMeta[activeChart].summary, { label: 'Assigned data owners', value: modalMeta[activeChart].owner }]}
          insights={[...modalMeta[activeChart].insights, 'Prototype sample data · no live university-system integration is claimed.']}
          onExport={() => setExportScope(activeChart)}
          onClose={() => setActiveChart(null)}
        />
      )}

      {selectedBuilding && (
        <div className="modal-backdrop fixed inset-0 z-[310] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) setSelectedBuilding(null); }}>
          <div className="modal-content w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Accessibility detail</p><p className="mt-1 text-lg font-bold text-primary">{selectedBuilding.building}</p></div><button onClick={() => setSelectedBuilding(null)} aria-label="Close accessibility details" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-muted hover:text-primary">×</button></div>
            <div className="mt-6 rounded-3xl bg-lilac/10 p-6 text-center"><p className="text-4xl font-extrabold text-primary">{selectedBuilding.compliance}%</p><p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted">PWD accessibility compliance</p></div>
            <p className="mt-4 rounded-2xl bg-surface p-4 text-[10px] leading-relaxed text-muted">No assessment date, findings, checklist, or corrective actions were supplied. This view intentionally shows only the source-provided building label and percentage.</p>
            <p className="mt-3 text-[10px] text-muted"><b className="text-primary">Data owners:</b> PFGSD, PSPMD, GAD Office</p>
            <button onClick={() => setSelectedBuilding(null)} className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white">Close details</button>
          </div>
        </div>
      )}

      {exportScope && (
        <div className="modal-backdrop fixed inset-0 z-[320] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) setExportScope(null); }}>
          <div className="modal-content w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Export preview</p><p className="mt-1 text-lg font-bold text-primary">{exportScope === 'page' ? 'Export All Page Data' : `Export ${CHARTS.find(chart => chart.id === exportScope)?.label}`}</p></div><button onClick={() => setExportScope(null)} aria-label="Close export preview" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-muted hover:text-primary">×</button></div>
            <div className="mt-4 rounded-2xl border border-lilac/15 bg-surface p-4 text-[10px] leading-relaxed text-muted">
              <p><b className="text-primary">Current filters:</b> {filterContext}</p>
              <p className="mt-1"><b className="text-primary">Data status:</b> {hasSample ? 'Source-supplied prototype sample data' : 'No mapped sample records'}</p>
              <p className="mt-1"><b className="text-primary">Included:</b> Current values, units, periods, visible chart context, table records, and owner attribution.</p>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">CSV creates a real structured file. PDF opens the browser print dialog so you can choose “Save as PDF”; the prototype does not falsely claim a download before you save it.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button onClick={() => exportCsv(exportScope)} className="rounded-2xl border border-lilac/20 bg-lilac/10 p-4 text-left transition-all hover:border-lilac hover:bg-lilac/20"><span className="block text-xs font-bold text-primary">CSV data export</span><span className="mt-1 block text-[10px] text-muted">Download the synchronized data</span></button>
              <button onClick={printPdfPreview} className="rounded-2xl border border-golden/30 bg-golden/15 p-4 text-left transition-all hover:border-golden hover:bg-golden/25"><span className="block text-xs font-bold text-primary">PDF executive briefing</span><span className="mt-1 block text-[10px] text-muted">Open print / Save as PDF</span></button>
            </div>
            <button onClick={() => setExportScope(null)} className="mt-4 w-full rounded-xl bg-surface px-4 py-3 text-xs font-bold text-primary hover:bg-lilac/10">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
