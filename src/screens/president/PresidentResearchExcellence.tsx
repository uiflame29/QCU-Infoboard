import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartModal from '../../components/ChartModal';
import ChartSelection from '../../components/ChartSelection';
import { useApp } from '../../context/AppContext';
import ChartDataSummary from '../../components/ChartDataSummary';

type Category = 'All' | 'Faculty-Led' | 'Student-Led' | 'Interdisciplinary';
type Indexing = 'All' | 'Scopus' | 'Web of Science' | 'AGPCI' | 'Non-Indexed';
type Funding = 'All' | 'Institutionally Funded' | 'Externally Funded';
type SortKey = 'indicator' | 'status' | 'count' | 'notes' | 'owner';
type ExportScope = 'page' | 'publications' | 'grants' | 'ip';

interface DemoRecord {
  category: Exclude<Category, 'All'>;
  indexing: Exclude<Indexing, 'All'>;
  funding: Exclude<Funding, 'All'>;
  publications: number;
  grants: number;
  utilityModels: number;
  patents: number;
  sdgProjects: number;
}

interface IpRow {
  indicator: string;
  status: string;
  count: number | null;
  notes: string;
  owner: string;
}

const DEMO_RECORDS: DemoRecord[] = [
  { category: 'Faculty-Led', indexing: 'Scopus', funding: 'Externally Funded', publications: 6, grants: 4_200_000, utilityModels: 2, patents: 1, sdgProjects: 3 },
  { category: 'Faculty-Led', indexing: 'Web of Science', funding: 'Institutionally Funded', publications: 4, grants: 0, utilityModels: 1, patents: 0, sdgProjects: 2 },
  { category: 'Student-Led', indexing: 'AGPCI', funding: 'Institutionally Funded', publications: 3, grants: 0, utilityModels: 1, patents: 0, sdgProjects: 2 },
  { category: 'Interdisciplinary', indexing: 'Scopus', funding: 'Externally Funded', publications: 5, grants: 3_400_000, utilityModels: 1, patents: 1, sdgProjects: 2 },
  { category: 'Faculty-Led', indexing: 'AGPCI', funding: 'Externally Funded', publications: 3, grants: 2_100_000, utilityModels: 1, patents: 0, sdgProjects: 2 },
  { category: 'Student-Led', indexing: 'Non-Indexed', funding: 'Institutionally Funded', publications: 2, grants: 0, utilityModels: 1, patents: 0, sdgProjects: 1 },
  { category: 'Interdisciplinary', indexing: 'Web of Science', funding: 'Externally Funded', publications: 3, grants: 2_800_000, utilityModels: 1, patents: 0, sdgProjects: 1 },
  { category: 'Student-Led', indexing: 'Scopus', funding: 'Externally Funded', publications: 2, grants: 2_000_000, utilityModels: 0, patents: 0, sdgProjects: 1 },
];

const CHARTS = [
  { id: 'publications', label: 'Publication Productivity' },
  { id: 'grants', label: 'External Research Grants' },
  { id: 'ip', label: 'IP Filings & SDG Alignment' },
];

const tooltipStyle = {
  borderRadius: 16,
  border: '1px solid rgba(187,150,228,.3)',
  background: '#200D2D',
  color: '#fff',
  boxShadow: '0 12px 32px rgba(32,13,45,.2)',
  fontSize: 11,
};

function formatPhp(value: number) {
  return `PHP ${Math.round(value).toLocaleString('en-US')}`;
}

function compactPhp(value: number) {
  return `₱${(value / 1_000_000).toFixed(1)}M`;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Icon({ type }: { type: 'publication' | 'target' | 'grant' | 'milestone' | 'search' | 'filter' | 'export' | 'info' }) {
  const paths = {
    publication: <><path d="M5 3h11l3 3v15H5z" /><path d="M8 10h8M8 14h8M8 18h5M15 3v4h4" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    grant: <><path d="M3 8h18M5 8v11m4-11v11m6-11v11m4-11v11M3 21h18M12 3l9 5H3z" /></>,
    milestone: <><path d="M4 20V5m0 1h11l-2 3 2 3H4M2 20h7" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M16 16l5 5" /></>,
    filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
    export: <><path d="M12 16V3m0 0L7 8m5-5 5 5M4 15v5h16v-5" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></>,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
}

function FilterSelect<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="flex min-w-44 flex-1 flex-col gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-[.16em] text-muted">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={event => onChange(event.target.value as T)}
          className={`w-full appearance-none rounded-xl border px-3 py-2.5 pr-9 text-xs font-semibold outline-none transition-all focus:ring-4 focus:ring-lilac/15 ${value === 'All' ? 'border-lilac/20 bg-surface text-muted' : 'border-lilac/50 bg-lilac/10 text-primary'}`}>
          {options.map(option => <option key={option}>{option}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lilac" width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </label>
  );
}

function MetricCard({ icon, label, value, detail, progress, tone = 'lilac', onClick }: {
  icon: Parameters<typeof Icon>[0]['type'];
  label: string;
  value: string;
  detail: string;
  progress?: number;
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
        <svg className="text-lilac opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
      </span>
      <span className="mt-5 block text-[9px] font-bold uppercase tracking-[.16em] text-muted">{label}</span>
      <span className="mt-2 block text-2xl font-bold tracking-tight text-primary count-animate">{value}</span>
      <span className="mt-1 block text-[10px] leading-relaxed text-muted">{detail}</span>
      {progress !== undefined && (
        <span className="mt-4 block">
          <span className="mb-1.5 flex justify-between text-[9px] font-semibold text-muted"><span>Calculated progress</span><span>{progress.toFixed(1)}%</span></span>
          <span className="block h-1.5 overflow-hidden rounded-full bg-surface"><span className="block h-full rounded-full bg-lilac transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} /></span>
        </span>
      )}
    </button>
  );
}

function CardHeader({ eyebrow, title, description, onView, onExport }: {
  eyebrow: string;
  title: string;
  description: string;
  onView?: () => void;
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
        {onView && <button onClick={onView} className="rounded-xl border border-lilac/25 bg-lilac/5 px-3 py-2 text-[10px] font-bold text-primary transition-colors hover:bg-lilac/15">View Chart</button>}
        <button onClick={onExport} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-primary/90"><Icon type="export" />Export</button>
      </div>
    </div>
  );
}

export default function PresidentResearchExcellence() {
  const { showToast } = useApp();
  const [category, setCategory] = useState<Category>('All');
  const [indexing, setIndexing] = useState<Indexing>('All');
  const [funding, setFunding] = useState<Funding>('All');
  const [visibleCharts, setVisibleCharts] = useState(new Set(CHARTS.map(chart => chart.id)));
  const [activeChart, setActiveChart] = useState<'publications' | 'grants' | null>(null);
  const [tableSearch, setTableSearch] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'indicator', direction: 'asc' });
  const [selectedRow, setSelectedRow] = useState<IpRow | null>(null);
  const [exportScope, setExportScope] = useState<ExportScope | null>(null);

  useEffect(() => {
    if (!selectedRow) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedRow(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selectedRow]);

  const activeFilterCount = [category, indexing, funding].filter(value => value !== 'All').length;
  const isBaseline = activeFilterCount === 0;
  const records = useMemo(() => DEMO_RECORDS.filter(record =>
    (category === 'All' || record.category === category) &&
    (indexing === 'All' || record.indexing === indexing) &&
    (funding === 'All' || record.funding === funding)
  ), [category, indexing, funding]);

  const metrics = useMemo(() => {
    const publications = records.reduce((sum, record) => sum + record.publications, 0);
    const grants = records.reduce((sum, record) => sum + record.grants, 0);
    const utilityModels = records.reduce((sum, record) => sum + record.utilityModels, 0);
    const patents = records.reduce((sum, record) => sum + record.patents, 0);
    const sdgProjects = records.reduce((sum, record) => sum + record.sdgProjects, 0);
    return {
      publications,
      publication2025: isBaseline ? 22 : Math.round(publications * (22 / 28)),
      publicationTarget: isBaseline ? 35 : Math.ceil(publications / .8),
      grants,
      grantTarget: isBaseline ? 20_000_000 : grants > 0 ? Math.round(grants / .725) : 0,
      utilityModels,
      patents,
      sdgProjects,
    };
  }, [isBaseline, records]);

  const publicationProgress = metrics.publicationTarget ? metrics.publications / metrics.publicationTarget * 100 : 0;
  const grantProgress = metrics.grantTarget ? metrics.grants / metrics.grantTarget * 100 : 0;
  const publicationData = [
    { metric: '2025 Actual', value: metrics.publication2025, fill: '#4C1413', context: 'Previous-year peer-reviewed output' },
    { metric: '2027 Target', value: metrics.publicationTarget, fill: '#FFD066', context: 'Publication target' },
    { metric: '2026 Actual YTD', value: metrics.publications, fill: '#BB96E4', context: 'Year-to-date peer-reviewed output' },
  ];
  const grantData = [
    { metric: 'Secured', value: metrics.grants, fill: '#BB96E4', context: 'External research grants secured' },
    { metric: '2028 Milestone', value: metrics.grantTarget, fill: '#FFD066', context: 'Target milestone' },
  ];
  const ipRows: IpRow[] = [
    { indicator: 'Utility Model Filings', status: 'Active', count: metrics.utilityModels, notes: 'ITSO-managed IP record', owner: 'ITSO / REPL' },
    { indicator: 'Patents Granted', status: 'Granted', count: metrics.patents, notes: 'IP outcome', owner: 'ITSO / REPL' },
    { indicator: 'Industrial Designs', status: 'Count not provided', count: null, notes: 'Tracked IP category', owner: 'ITSO / REPL' },
    { indicator: 'SDG 4 Research-Tagged Projects', status: 'Tagged', count: metrics.sdgProjects, notes: 'Quality Education', owner: 'REPL / ITSO coordination' },
  ];
  const visibleRows = ipRows
    .filter(row => Object.values(row).join(' ').toLowerCase().includes(tableSearch.toLowerCase()))
    .sort((a, b) => {
      const left = a[sort.key] ?? Number.POSITIVE_INFINITY;
      const right = b[sort.key] ?? Number.POSITIVE_INFINITY;
      return String(left).localeCompare(String(right), undefined, { numeric: true }) * (sort.direction === 'asc' ? 1 : -1);
    });

  const filterContext = `Category: ${category}; Indexing: ${indexing}; Funding: ${funding}`;
  const sourceNote = isBaseline ? 'Source-supplied prototype sample figures' : 'Synthetic prototype demonstration breakdown';

  function resetFilters(showMessage = true) {
    setCategory('All');
    setIndexing('All');
    setFunding('All');
    if (showMessage) showToast({ type: 'info', title: 'Research filters reset', body: 'The source-supplied baseline figures are restored.' });
  }

  function toggleChart(id: string, checked: boolean) {
    setVisibleCharts(previous => {
      const next = new Set(previous);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function sortBy(key: SortKey) {
    setSort(previous => ({ key, direction: previous.key === key && previous.direction === 'asc' ? 'desc' : 'asc' }));
  }

  function rowsFor(scope: ExportScope): (string | number)[][] {
    const metadata = [
      ['QCU InfoBoard', 'President Research Excellence'],
      ['Data status', sourceNote],
      ['Filters', filterContext],
      ['Exported', new Date().toLocaleString()],
      [],
    ];
    if (scope === 'publications') return [...metadata, ['Metric', 'Publications'], ...publicationData.map(row => [row.metric, row.value])];
    if (scope === 'grants') return [...metadata, ['Metric', 'Amount (PHP)'], ...grantData.map(row => [row.metric, row.value]), ['Top Grant Agency', 'DOST-PCIEERD']];
    if (scope === 'ip') return [...metadata, ['Indicator', 'Status', 'Count', 'Notes', 'Data Owner'], ...visibleRows.map(row => [row.indicator, row.status, row.count ?? 'Not provided', row.notes, row.owner])];
    const selected = CHARTS.filter(chart => visibleCharts.has(chart.id)).map(chart => chart.label).join('; ') || 'None';
    return [
      ...metadata,
      ['Selected visualizations', selected],
      ['2026 Publications YTD', metrics.publications],
      ['2025 Publication Target', metrics.publicationTarget],
      ['External Grants Secured (PHP)', metrics.grants],
      ['2028 Grant Target Milestone (PHP)', metrics.grantTarget],
      ['Top Grant Agency', 'DOST-PCIEERD'],
      ['Utility Model Filings', metrics.utilityModels],
      ['Patents Granted', metrics.patents],
      ['Industrial Designs', 'Not provided'],
      ['SDG 4 Research-Tagged Projects', metrics.sdgProjects],
      ['2028/2031 publication target values', 'Not supplied'],
    ];
  }

  function exportCsv(scope: ExportScope) {
    downloadCsv(`qcu-research-excellence-${scope}.csv`, rowsFor(scope));
    setExportScope(null);
    showToast({ type: 'success', title: 'CSV downloaded', body: `The ${scope === 'page' ? 'current page' : scope} data was exported with active filter context.` });
  }

  function requestExport(scope: ExportScope) {
    setExportScope(scope);
  }

  function simulatePdf() {
    window.print();
    setExportScope(null);
    showToast({ type: 'info', title: 'Print dialog opened', body: 'Choose “Save as PDF” to create an executive briefing. No download is claimed until you save it.' });
  }

  const publicationChart = (large = false) => (
    <div className={large ? 'h-[390px]' : 'h-72'}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={publicationData} margin={{ top: 28, right: 12, left: -12, bottom: large ? 12 : 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(187,150,228,.16)" />
          <XAxis dataKey="metric" tick={{ fontSize: large ? 11 : 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(187,150,228,.08)' }}
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#FFD066', fontWeight: 700 }}
            formatter={(value, _name, item) => [`${Number(value).toLocaleString()} publications · ${item.payload.context}`, 'Metric']}
          />
          <Bar dataKey="value" name="Publications" radius={[10, 10, 2, 2]} maxBarSize={large ? 100 : 72}>
            {publicationData.map(row => <Cell key={row.metric} fill={row.fill} />)}
            <LabelList dataKey="value" position="top" fill="#200D2D" fontSize={11} fontWeight={700} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const grantChart = (large = false) => (
    <div className={large ? 'h-[390px]' : 'h-72'}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={grantData} layout="vertical" margin={{ top: 12, right: large ? 70 : 42, left: large ? 30 : 0, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="rgba(187,150,228,.16)" />
          <XAxis type="number" tick={{ fontSize: 9, fill: '#7B6891' }} tickFormatter={value => `₱${value / 1_000_000}M`} axisLine={false} tickLine={false} />
          <YAxis dataKey="metric" type="category" width={large ? 120 : 94} tick={{ fontSize: large ? 11 : 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(187,150,228,.08)' }}
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#FFD066', fontWeight: 700 }}
            formatter={(value, _name, item) => [`${formatPhp(Number(value))} · ${item.payload.context}`, 'Amount']}
          />
          <Bar dataKey="value" name="Grant amount" radius={[0, 10, 10, 0]} maxBarSize={large ? 64 : 52}>
            {grantData.map(row => <Cell key={row.metric} fill={row.fill} />)}
            <LabelList dataKey="value" position="right" formatter={(value: unknown) => compactPhp(Number(value))} fill="#200D2D" fontSize={10} fontWeight={700} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white shadow-xl">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-blossom/10 blur-3xl" />
        <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-lilac/25 bg-lilac/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-lilac">Pillar 4 · Institutional Research</span>
              <span className="rounded-full border border-golden/25 bg-golden/10 px-3 py-1 text-[9px] font-bold text-golden">Prototype sample data</span>
            </div>
            <p className="mt-5 text-2xl font-bold tracking-tight">Research Excellence</p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/60">Monitor publication productivity, research funding, intellectual property activity, and SDG-aligned projects.</p>
          </div>
          <button type="button" onClick={() => requestExport('page')} className="flex items-center justify-center gap-2 rounded-xl bg-golden px-4 py-2.5 text-xs font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-golden/90"><Icon type="export" />Export All Page Data</button>
        </div>
      </section>

      <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-lilac/10 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lilac/15 text-primary"><Icon type="filter" /></span>
            <div><p className="text-xs font-bold text-primary">Research Excellence Filters</p><p className="mt-0.5 text-[10px] text-muted">All dependent metrics refresh from one shared state.</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${activeFilterCount ? 'bg-golden/25 text-obsidian' : 'bg-surface text-muted'}`}>{activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}</span>
            <ChartSelection charts={CHARTS} visible={visibleCharts} onChange={toggleChart} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <FilterSelect label="Research Category" value={category} options={['All', 'Faculty-Led', 'Student-Led', 'Interdisciplinary'] as const} onChange={setCategory} />
          <FilterSelect label="Indexing Status" value={indexing} options={['All', 'Scopus', 'Web of Science', 'AGPCI', 'Non-Indexed'] as const} onChange={setIndexing} />
          <FilterSelect label="Funding Source" value={funding} options={['All', 'Institutionally Funded', 'Externally Funded'] as const} onChange={setFunding} />
          <button onClick={() => resetFilters()} disabled={!activeFilterCount} className="rounded-xl border border-lilac/25 px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-lilac/10 disabled:cursor-not-allowed disabled:opacity-40">Reset Filters</button>
        </div>
        {activeFilterCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-lilac/10 pt-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Active scope</span>
            {category !== 'All' && <button onClick={() => setCategory('All')} className="rounded-full bg-lilac/15 px-3 py-1.5 text-[10px] font-semibold text-primary hover:bg-lilac/25">{category} ×</button>}
            {indexing !== 'All' && <button onClick={() => setIndexing('All')} className="rounded-full bg-lilac/15 px-3 py-1.5 text-[10px] font-semibold text-primary hover:bg-lilac/25">{indexing} ×</button>}
            {funding !== 'All' && <button onClick={() => setFunding('All')} className="rounded-full bg-lilac/15 px-3 py-1.5 text-[10px] font-semibold text-primary hover:bg-lilac/25">{funding} ×</button>}
            <span className="ml-auto text-[9px] font-medium text-muted">Filtered values are synthetic prototype demonstration data.</span>
          </div>
        )}
      </section>

      {records.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-14 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blossom text-obsidian"><Icon type="search" /></span>
          <p className="mt-4 text-sm font-bold text-primary">No demonstration records match this combination</p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">Try removing one filter or restore the source-supplied baseline view. No official zero value is inferred.</p>
          <button onClick={() => resetFilters()} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white">Restore baseline</button>
        </section>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon="publication" label="2026 Publications (YTD)" value={String(metrics.publications)} detail={`${isBaseline ? 'Source-supplied figure' : 'Filtered demo value'} · 2025 reference: ${metrics.publication2025}`} progress={publicationProgress} onClick={() => { setVisibleCharts(previous => new Set(previous).add('publications')); setActiveChart('publications'); }} />
            <MetricCard icon="target" label="2025 Publication Target" value={String(metrics.publicationTarget)} detail={`${metrics.publications} / ${metrics.publicationTarget} publications · ${publicationProgress.toFixed(0)}%`} tone="gold" onClick={() => setActiveChart('publications')} />
            <MetricCard icon="grant" label="External Grants Secured" value={compactPhp(metrics.grants)} detail={`Top agency: DOST-PCIEERD · ${formatPhp(metrics.grants)}`} progress={grantProgress} onClick={() => { setVisibleCharts(previous => new Set(previous).add('grants')); setActiveChart('grants'); }} />
            <MetricCard icon="milestone" label="2028 Grant Target Milestone" value={compactPhp(metrics.grantTarget)} detail={`${formatPhp(Math.max(0, metrics.grantTarget - metrics.grants))} remaining · calculated`} tone="rose" onClick={() => setActiveChart('grants')} />
          </div>

          {visibleCharts.size === 0 && (
            <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-sm font-bold text-primary">All visualization cards are hidden</p>
              <p className="mt-2 text-xs text-muted">Your filters remain active. Restore the cards without changing the current data scope.</p>
              <button onClick={() => setVisibleCharts(new Set(CHARTS.map(chart => chart.id)))} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white">Restore all visualizations</button>
            </section>
          )}

          <div className="grid gap-5 xl:grid-cols-5">
            {visibleCharts.has('publications') && (
              <section id="research-publications" className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm xl:col-span-3">
                <CardHeader eyebrow="Peer-reviewed journal outputs" title="Publication Productivity Metrics" description="2025 actual, 2027 target, and 2026 YTD output. Hover a column for exact context." onView={() => setActiveChart('publications')} onExport={() => requestExport('publications')} />
                <div className="mt-4">{publicationChart()}</div>
                <ChartDataSummary className="mt-3" data={publicationData} categoryKey="metric" series={[{ key: 'value', label: 'Publications', color: '#BB96E4' }]} distribution={false} showTotal={false} showSeriesAggregates={false} />
                <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] text-muted"><span className="font-bold text-primary">Data owner:</span> REPL · Research Coordinators · Publication Unit</p>
                  <p className="text-[9px] font-semibold text-obsidian">2028/2031 IDP publication target values not supplied.</p>
                </div>
              </section>
            )}

            {visibleCharts.has('grants') && (
              <section id="research-grants" className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm xl:col-span-2">
                <CardHeader eyebrow="Research funding" title="External Research Grants" description="Secured funding compared with the stated 2028 milestone." onView={() => setActiveChart('grants')} onExport={() => requestExport('grants')} />
                <div className="mt-4">{grantChart()}</div>
                <ChartDataSummary className="mt-3" data={grantData} categoryKey="metric" series={[{ key: 'value', label: 'Amount', color: '#BB96E4', unit: 'PHP' }]} distribution={false} showTotal={false} showSeriesAggregates={false} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl bg-lilac/10 p-3"><p className="text-[9px] font-bold uppercase tracking-widest text-muted">Milestone progress</p><p className="mt-1 text-sm font-bold text-primary">{grantProgress.toFixed(1)}%</p></div>
                  <div className="rounded-2xl bg-golden/20 p-3"><p className="text-[9px] font-bold uppercase tracking-widest text-muted">Top Grant Agency</p><p className="mt-1 text-sm font-bold text-primary">DOST-PCIEERD</p></div>
                </div>
                <p className="mt-3 text-[10px] text-muted"><span className="font-bold text-primary">Data owner:</span> REPL · Research Coordinators</p>
              </section>
            )}
          </div>

          {visibleCharts.has('ip') && (
            <section id="research-ip" className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
              <div className="p-5">
                <CardHeader eyebrow="ITSO & SDG monitoring" title="IP Filings & SDG Alignment" description="Patents, utility models, industrial designs, and SDG-tagged research indicators." onExport={() => requestExport('ip')} />
                <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-muted focus-within:border-lilac">
                    <Icon type="search" />
                    <input value={tableSearch} onChange={event => setTableSearch(event.target.value)} placeholder="Search visible table rows…" className="w-full bg-transparent text-xs outline-none placeholder:text-muted/70" />
                    {tableSearch && <button onClick={() => setTableSearch('')} className="text-xs font-bold hover:text-primary" aria-label="Clear table search">×</button>}
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-muted"><Icon type="info" /><span>{visibleRows.length} of {ipRows.length} indicators · Select a row for provenance</span></div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-primary text-white">
                    <tr>
                      {([
                        ['indicator', 'Research / IP Indicator'],
                        ['status', 'Current Status'],
                        ['count', 'Count'],
                        ['notes', 'Alignment / Notes'],
                        ['owner', 'Data Owner'],
                      ] as [SortKey, string][]).map(([key, label]) => (
                        <th key={key} className="px-5 py-3 text-[9px] font-bold uppercase tracking-wider">
                          <button onClick={() => sortBy(key)} className="flex items-center gap-1.5 hover:text-golden">{label}<span className="text-white/35">{sort.key === key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span></button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map(row => (
                      <tr key={row.indicator} tabIndex={0} onClick={() => setSelectedRow(row)} onKeyDown={event => { if (event.key === 'Enter') setSelectedRow(row); }} className="cursor-pointer border-b border-lilac/10 transition-colors last:border-0 hover:bg-blossom/20 focus:bg-lilac/10 focus:outline-none">
                        <td className="px-5 py-4 text-xs font-semibold text-primary">{row.indicator}</td>
                        <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${row.count === null ? 'bg-surface text-muted' : 'bg-lilac/15 text-primary'}`}>{row.status}</span></td>
                        <td className="px-5 py-4 text-xs font-bold text-primary">{row.count ?? 'Not provided'}</td>
                        <td className="px-5 py-4 text-xs text-muted">{row.notes}</td>
                        <td className="px-5 py-4 text-[10px] font-semibold text-muted">{row.owner}</td>
                      </tr>
                    ))}
                    {visibleRows.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-xs text-muted">No table rows match “{tableSearch}”.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-lilac/10 bg-surface/60 px-5 py-3 text-[10px] text-muted">
                <span><b className="text-primary">Data owner:</b> ITSO · REPL</span>
                <span>Industrial designs remain in scope; no count was supplied.</span>
              </div>
            </section>
          )}
        </>
      )}

      {activeChart && (
        <ChartModal
          title={activeChart === 'publications' ? 'Publication Productivity Metrics' : 'External Research Grant Amounts'}
          description={activeChart === 'publications' ? 'Expanded peer-reviewed journal output view using the current Research Excellence filters.' : 'Expanded secured-funding view compared with the 2028 target milestone.'}
          chart={activeChart === 'publications' ? publicationChart(true) : grantChart(true)}
          dataSummary={activeChart === 'publications'
            ? <ChartDataSummary data={publicationData} categoryKey="metric" series={[{ key: 'value', label: 'Publications', color: '#BB96E4' }]} distribution={false} showTotal={false} showSeriesAggregates={false} />
            : <ChartDataSummary data={grantData} categoryKey="metric" series={[{ key: 'value', label: 'Amount', color: '#BB96E4', unit: 'PHP' }]} distribution={false} showTotal={false} showSeriesAggregates={false} />}
          summary={activeChart === 'publications'
            ? [
                { label: '2025 Actual', value: `${metrics.publication2025} publications` },
                { label: '2027 Target', value: `${metrics.publicationTarget} publications` },
                { label: '2026 Actual YTD', value: `${metrics.publications} publications` },
                { label: 'Progress', value: `${publicationProgress.toFixed(1)}% calculated` },
              ]
            : [
                { label: 'Secured', value: formatPhp(metrics.grants) },
                { label: '2028 Milestone', value: formatPhp(metrics.grantTarget) },
                { label: 'Remaining', value: formatPhp(Math.max(0, metrics.grantTarget - metrics.grants)) },
                { label: 'Top Agency', value: 'DOST-PCIEERD' },
              ]}
          insights={activeChart === 'publications'
            ? [`Current progress is ${publicationProgress.toFixed(1)}% of the displayed 2027 target.`, '2028 and 2031 numeric publication targets were not supplied and are intentionally not shown.', sourceNote]
            : [`Current secured funding is ${grantProgress.toFixed(1)}% of the displayed milestone.`, `${formatPhp(Math.max(0, metrics.grantTarget - metrics.grants))} remains to the displayed milestone.`, 'No unsupported per-agency amounts are inferred.']}
          onExport={() => requestExport(activeChart)}
          onClose={() => setActiveChart(null)}
        />
      )}

      {selectedRow && (
        <div className="modal-backdrop fixed inset-0 z-[310] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) setSelectedRow(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="research-indicator-title" className="modal-content max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-obsidian p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">ITSO & SDG monitoring record</p><p id="research-indicator-title" className="mt-1 text-lg font-bold">{selectedRow.indicator}</p><p className="mt-1 text-[10px] text-white/55">Research Excellence · Current filtered view</p></div>
                <button onClick={() => setSelectedRow(null)} aria-label="Close indicator details" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white">×</button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-4">
                <p className="text-xs font-bold text-primary">Current indicator status</p>
                <span className={`rounded-full px-3 py-1.5 text-[9px] font-bold ${selectedRow.count === null ? 'bg-white text-muted' : 'bg-coa/10 text-coa'}`}>{selectedRow.status}</span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  ['Count', selectedRow.count ?? 'Not provided'],
                  ['Alignment / notes', selectedRow.notes],
                  ['Assigned data owner', selectedRow.owner],
                  ['Active filter context', filterContext],
                  ['Data status', sourceNote],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-lilac/15 bg-white p-4 last:sm:col-span-2"><p className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</p><p className="mt-1 text-xs font-semibold leading-relaxed text-primary">{value}</p></div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-blossom/50 p-4 text-[10px] leading-relaxed text-obsidian">This detail view contains only source-supplied indicator information and filter-derived demonstration totals. No project titles, inventors, filing dates, or unsupported records are inferred.</div>
              <button onClick={() => setSelectedRow(null)} className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-primary/90">Return to analysis</button>
            </div>
          </div>
        </div>
      )}

      {exportScope && (
        <div className="modal-backdrop fixed inset-0 z-[320] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) setExportScope(null); }}>
          <div className="modal-content w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Export options</p><p className="mt-1 text-lg font-bold text-primary">{exportScope === 'page' ? 'Export All Page Data' : `Export ${exportScope}`}</p></div>
              <button onClick={() => setExportScope(null)} aria-label="Close export options" className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-muted hover:text-primary">×</button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">The export includes active filters, data-status notes, current values, and the export date. CSV creates a real file; PDF uses your browser’s print dialog.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button onClick={() => exportCsv(exportScope)} className="rounded-2xl border border-lilac/20 bg-lilac/10 p-4 text-left transition-all hover:border-lilac hover:bg-lilac/20"><span className="block text-xs font-bold text-primary">CSV workbook data</span><span className="mt-1 block text-[10px] text-muted">Download a structured .csv file</span></button>
              <button onClick={simulatePdf} className="rounded-2xl border border-golden/30 bg-golden/15 p-4 text-left transition-all hover:border-golden hover:bg-golden/25"><span className="block text-xs font-bold text-primary">PDF executive briefing</span><span className="mt-1 block text-[10px] text-muted">Open print / Save as PDF</span></button>
            </div>
            <button onClick={() => setExportScope(null)} className="mt-4 w-full rounded-xl bg-surface px-4 py-3 text-xs font-bold text-primary hover:bg-lilac/10">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
