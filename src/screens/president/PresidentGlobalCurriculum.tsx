import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartModal from '../../components/ChartModal';
import SynergyFilterPanel, { SynergyFilterSelect } from '../../components/SynergyFilterPanel';
import { useApp } from '../../context/AppContext';
import { PROGRAMS as OFFICIAL_PROGRAMS } from '../../data/mockData';
import ChartDataSummary from '../../components/ChartDataSummary';

type ModuleFilters = {
  academicYear: string;
  college: string;
  program: string;
  accreditation: string;
};

type ProgramRecord = {
  program: string;
  shortProgram: string;
  college: 'CCS' | 'COE' | 'COA' | 'COB';
  accreditation: 'Level 1' | 'Level 2' | 'Level 3';
  level: string;
  copc: 'Issued' | 'Pending Review';
  licensure: string;
  owner: string;
  status: 'On Track' | 'Warning';
};

const DEFAULT_FILTERS: ModuleFilters = {
  academicYear: 'AY 2026–2027',
  college: 'All',
  program: 'All',
  accreditation: 'All',
};

const PROGRAM_RECORDS: ProgramRecord[] = [
  {
    program: 'BS Information Technology',
    shortProgram: 'BSIT',
    college: 'CCS',
    accreditation: 'Level 3',
    level: 'Level III Accredited',
    copc: 'Issued',
    licensure: 'N/A (Non-Board)',
    owner: 'Deans / QACIM',
    status: 'On Track',
  },
  {
    program: 'BS Industrial Engineering',
    shortProgram: 'BSIE',
    college: 'COE',
    accreditation: 'Level 3',
    level: 'Level III Accredited',
    copc: 'Issued',
    licensure: 'N/A (Non-Board)',
    owner: 'VPAA / Registrar',
    status: 'On Track',
  },
  {
    program: 'BS Entrepreneurship',
    shortProgram: 'BSEntr',
    college: 'COB',
    accreditation: 'Level 3',
    level: 'Level III Accredited',
    copc: 'Issued',
    licensure: 'N/A (Non-Board)',
    owner: 'Deans / QACIM',
    status: 'On Track',
  },
  {
    program: 'BS Electrical Engineering',
    shortProgram: 'BSEE',
    college: 'COE',
    accreditation: 'Level 2',
    level: 'Level II Accredited',
    copc: 'Issued',
    licensure: 'N/A (Non-Board)',
    owner: 'VPAA / Registrar',
    status: 'On Track',
  },
];

const EMPLOYABILITY = [
  { year: '2024', actual: 82.0, target: null },
  { year: '2025', actual: 85.5, target: null },
  { year: '2026', actual: 86.5, target: 88.0 },
];

const COLLEGE_COLORS: Record<string, string> = {
  CCS: '#333333',
  COE: '#FF6B00',
  COB: '#FFC700',
  COA: '#00875A',
  COED: '#0052CC',
};

const tooltipStyle = {
  borderRadius: 16,
  border: '1px solid rgba(187,150,228,.3)',
  boxShadow: '0 12px 32px rgba(32,13,45,.14)',
  background: '#FFFFFF',
  color: '#200D2D',
  fontSize: 11,
  maxWidth: 320,
  whiteSpace: 'normal' as const,
};

function Icon({ type }: { type: 'award' | 'document' | 'trend' | 'filter' | 'download' | 'owner' }) {
  const paths = {
    award: <><circle cx="12" cy="9" r="6" /><path d="M8.5 14l-1 7 4.5-2 4.5 2-1-7M9.5 9l1.6 1.6L15 7" /></>,
    document: <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7l-4-4z" /><path d="M14 3v5h5M8 13h8M8 17h6" /></>,
    trend: <><path d="M4 18l5-5 4 3 7-9" /><path d="M15 7h5v5" /></>,
    filter: <><path d="M4 5h16l-6 7v6l-4 2v-8L4 5z" /></>,
    download: <><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></>,
    owner: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M17 11h4m-2-2v4" /></>,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone,
  onClick,
}: {
  icon: 'award' | 'document' | 'trend';
  label: string;
  value: string;
  detail: string;
  tone: 'lilac' | 'gold' | 'rose';
  onClick: () => void;
}) {
  const tones = {
    lilac: 'bg-lilac/15 text-primary',
    gold: 'bg-golden/25 text-obsidian',
    rose: 'bg-blossom/65 text-obsidian',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-3xl border border-lilac/20 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lilac/50 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-lilac/20">
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}><Icon type={icon} /></span>
      <span className="mt-5 block text-[9px] font-bold uppercase tracking-[.17em] text-muted">{label}</span>
      <span className="mt-2 block text-2xl font-bold text-primary">{value}</span>
      <span className="mt-1 block text-[10px] font-medium text-muted">{detail}</span>
      <span className="mt-4 block border-t border-lilac/10 pt-3 text-[9px] text-lilac">Institutional overview benchmark</span>
    </button>
  );
}

function StatusBadge({ status }: { status: ProgramRecord['status'] }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${
      status === 'On Track' ? 'border-coa/20 bg-coa/10 text-coa' : 'border-golden/50 bg-golden/20 text-obsidian'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'On Track' ? 'bg-coa' : 'bg-golden'}`} />
      {status}
    </span>
  );
}

function DetailModal({ record, onClose }: { record: ProgramRecord; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const details = [
    ['College', record.college],
    ['ALCUCOA Level', record.level],
    ['COPC Status', record.copc],
    ['Licensure Result', record.licensure],
    ['Data Owner', record.owner],
  ];

  return (
    <div className="modal-backdrop fixed inset-0 z-[300] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal-content w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-primary to-obsidian p-6 text-white">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">Program compliance record</p>
            <p className="mt-2 text-lg font-bold">{record.program}</p>
            <p className="mt-1 text-[10px] text-white/55">Supplied demonstration record · AY 2026–2027</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close program detail" className="rounded-xl bg-white/10 p-2 text-white/65 transition-colors hover:bg-white/20 hover:text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-surface p-4">
            <span className="text-xs font-bold text-primary">Current program status</span>
            <StatusBadge status={record.status} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-lilac/15 p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted">{label}</p>
                <p className="mt-1.5 text-xs font-semibold leading-relaxed text-primary">{value}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={onClose} className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-primary/90">Return to analysis</button>
        </div>
      </section>
    </div>
  );
}

function ChartCard({
  onView,
  onExport,
  children,
}: {
  onView: () => void;
  onExport: () => void;
  children: ReactNode;
}) {
  return (
    <section id="employability-chart" className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Graduate outcomes</p>
          <p className="mt-1 text-base font-bold text-primary">Graduate Employability Curve</p>
          <p className="mt-1 max-w-xl text-[10px] leading-relaxed text-muted">Employment within six months after graduation compared with the supplied 2026 institutional target.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onView} className="rounded-xl border border-lilac/20 px-3 py-2 text-[10px] font-bold text-primary transition-colors hover:bg-lilac/10">View Chart</button>
          <button type="button" onClick={onExport} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-primary/90"><Icon type="download" /> Export Chart</button>
        </div>
      </div>
      <div className="mt-4 h-80">{children}</div>
      <ChartDataSummary
        className="mt-3"
        data={EMPLOYABILITY}
        categoryKey="year"
        totalLabel="Latest actual"
        distribution={false}
        series={[
          { key: 'actual', label: 'Actual', color: '#BB96E4', unit: '%', aggregate: 'latest' },
          { key: 'target', label: 'Target', color: '#FFD066', unit: '%', aggregate: 'latest', includeInGrandTotal: false },
        ]}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-lilac/10 pt-3 text-[9px] text-muted">
        <span>Data owners: <strong className="text-primary">Program Chairs, VPAA, SPARD</strong></span>
        <span className="rounded-full bg-lilac/10 px-2.5 py-1 text-primary">Institutional series · supplied sample</span>
      </div>
    </section>
  );
}

export default function PresidentGlobalCurriculum() {
  const { showToast } = useApp();
  const [filters, setFilters] = useState<ModuleFilters>(DEFAULT_FILTERS);
  const [visibleCharts, setVisibleCharts] = useState(new Set(['employability']));
  const [chartOpen, setChartOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramRecord | null>(null);

  const programOptions = useMemo(() => {
    const official = filters.college === 'All'
      ? Object.values(OFFICIAL_PROGRAMS).flat()
      : OFFICIAL_PROGRAMS[filters.college] ?? [];
    const supplied = PROGRAM_RECORDS.filter(record => filters.college === 'All' || record.college === filters.college).map(record => record.shortProgram);
    return ['All', ...new Set([...official, ...supplied, ...(filters.college === 'All' ? ['BSCpE'] : [])])];
  }, [filters.college]);

  const filteredPrograms = useMemo(() => PROGRAM_RECORDS.filter(record =>
    filters.academicYear === 'AY 2026–2027'
    && (filters.college === 'All' || record.college === filters.college)
    && (filters.program === 'All' || record.shortProgram === filters.program)
    && (filters.accreditation === 'All' || record.accreditation === filters.accreditation)
  ), [filters]);

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => value !== 'All' && !(key === 'academicYear' && value === DEFAULT_FILTERS.academicYear)).length;
  const scope = [
    filters.academicYear,
    filters.college === 'All' ? 'All Colleges' : filters.college,
    filters.program === 'All' ? 'All Programs' : filters.program,
    filters.accreditation === 'All' ? 'All Levels' : filters.accreditation,
  ].join(' · ');

  function updateFilter(key: keyof ModuleFilters, value: string) {
    setFilters(previous => ({
      ...previous,
      [key]: value,
      ...(key === 'college' ? { program: 'All' } : {}),
    }));
  }

  function toggleChart(id: string, checked: boolean) {
    setVisibleCharts(previous => {
      const next = new Set(previous);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    showToast({ type: 'info', title: 'Curriculum filters reset', body: 'All supplied AY 2026–2027 program records are visible.' });
  }

  function exportCsv(filename: string, rows: Record<string, string | number | null>[], title: string) {
    const headers = Object.keys(rows[0] ?? {});
    const csv = [headers.join(','), ...rows.map(row => headers.map(header => `"${String(row[header] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast({ type: 'success', title, body: 'A CSV file containing the displayed demonstration data was downloaded.' });
  }

  function exportChart() {
    exportCsv(
      'QCU-Global-Curriculum-Employability.csv',
      [
        { Year: '2024', Series: 'Actual', Rate: '82.0%' },
        { Year: '2025', Series: 'Actual', Rate: '85.5%' },
        { Year: '2026', Series: 'Target', Rate: '88.0%' },
        { Year: '2026', Series: 'Actual', Rate: '86.5%' },
      ],
      'Employability chart exported',
    );
  }

  function exportPage() {
    const rows: Record<string, string | number | null>[] = [
      { Section: 'Active Filter', Item: 'Scope', Value: scope, Context: 'Current prototype view' },
      { Section: 'Summary', Item: 'Accredited Programs', Value: '4 / 12 Programs', Context: '33.3% accredited' },
      { Section: 'Summary', Item: 'COPC Issuance Rate', Value: '92.0%', Context: 'Target: 95.0%' },
      { Section: 'Summary', Item: 'Board Exam Passing Rate', Value: '84.2%', Context: 'National Average: 68.0%' },
      { Section: 'Official Program Mapping', Item: 'Accredited Programs', Value: 'BSIT (Level 3), BSIE (Level 3), BSEntr (Level 3), BSEE (Level 2)', Context: '4 accredited programs out of 12 total programs' },
      ...EMPLOYABILITY.flatMap(row => [
        ...(row.actual === null ? [] : [{ Section: 'Employability', Item: `${row.year} Actual`, Value: `${row.actual.toFixed(1)}%`, Context: 'Within six months' }]),
        ...(row.target === null ? [] : [{ Section: 'Employability', Item: `${row.year} Target`, Value: `${row.target.toFixed(1)}%`, Context: 'Institutional target' }]),
      ]),
      ...filteredPrograms.map(record => ({
        Section: 'Program Compliance',
        Item: record.program,
        Value: record.status,
        Context: `${record.college} | ${record.level} | ${record.copc} | ${record.licensure} | ${record.owner}`,
      })),
    ];
    exportCsv('QCU-Global-Standard-Curriculum-Page-Data.csv', rows, 'Page data exported');
  }

  function employabilityChart(height: number | string = '100%') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={EMPLOYABILITY} margin={{ top: 12, right: 18, bottom: 6, left: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" />
          <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
          <YAxis domain={[75, 92]} unit="%" tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ stroke: '#BB96E4', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={tooltipStyle}
            itemStyle={{ color: '#200D2D', fontWeight: 600 }}
            labelStyle={{ color: '#7B6891', fontWeight: 700, marginBottom: 6 }}
            wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
            allowEscapeViewBox={{ x: true, y: true }}
            formatter={(value, name) => [`${Number(value).toFixed(1)}% employment rate`, `${name} · Within 6 months`]}
            labelFormatter={year => `Year ${year} · ${scope}`}
          />
          <Legend iconType="circle" iconSize={8} />
          <Line type="monotone" dataKey="actual" name="Actual" stroke="#BB96E4" strokeWidth={4} connectNulls={false} dot={{ r: 5, fill: '#200D2D', stroke: '#FFFFFF', strokeWidth: 2 }} activeDot={{ r: 7 }} />
          <Line type="monotone" dataKey="target" name="Target" stroke="#FFD066" strokeWidth={3} strokeDasharray="7 5" connectNulls={false} dot={{ r: 6, fill: '#FFD066', stroke: '#4C1413', strokeWidth: 2 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-obsidian p-6 text-white shadow-xl">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-36 w-36 rounded-full bg-golden/10 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.22em] text-lilac">Strategic Directions — Pillar 1</p>
            <p className="mt-2 text-2xl font-bold">Global Standard Curriculum</p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/60">Monitor program accreditation, COPC issuance, licensure outcomes, and graduate employability through one connected executive view.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold text-white/65">President · Read-oriented analytics</span>
              <span className="rounded-full border border-golden/25 bg-golden/10 px-3 py-1 text-[9px] font-semibold text-golden">Demonstration data</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold text-white/65">{scope}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportPage} className="flex items-center gap-2 rounded-xl bg-golden px-4 py-2.5 text-xs font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-golden/90">
              <Icon type="download" /> Export All Page Data
            </button>
          </div>
        </div>
      </section>

      <SynergyFilterPanel
        title="Global Curriculum Filters"
        description={`${filteredPrograms.length} matching record${filteredPrograms.length === 1 ? '' : 's'} refresh from one shared program-compliance scope.`}
        activeFilterCount={activeFilterCount}
        charts={[{ id: 'employability', label: 'Graduate Employability Curve' }]}
        visibleCharts={visibleCharts}
        onChartChange={toggleChart}
        onReset={resetFilters}
        resetDisabled={!activeFilterCount}>
        <SynergyFilterSelect label="Academic Year" value={filters.academicYear} options={['AY 2026–2027']} onChange={value => updateFilter('academicYear', value)} />
        <SynergyFilterSelect label="College" value={filters.college} options={['All', 'CCS', 'COE', 'COB', 'COA', 'COED']} onChange={value => updateFilter('college', value)} />
        <SynergyFilterSelect label="Program" value={filters.program} options={programOptions} onChange={value => updateFilter('program', value)} />
        <SynergyFilterSelect label="Accreditation Level" value={filters.accreditation} options={['All', 'Level 1', 'Level 2', 'Level 3', 'Level 4']} onChange={value => updateFilter('accreditation', value)} />
      </SynergyFilterPanel>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard icon="award" label="Accredited Programs" value="4 / 12 Programs" detail="33.3% accredited" tone="lilac" onClick={() => showToast({ type: 'info', title: 'Institutional accreditation benchmark', body: 'Four accredited programs are listed in Program Quality & Compliance: BSIT (Level 3), BSIE (Level 3), BSEntr (Level 3), and BSEE (Level 2), out of 12 total programs.' })} />
        <MetricCard icon="document" label="COPC Issuance Rate" value="92.0%" detail="Target: 95.0%" tone="rose" onClick={() => document.getElementById('compliance-table')?.scrollIntoView({ behavior: 'smooth' })} />
        <MetricCard icon="trend" label="Board Exam Passing Rate" value="84.2%" detail="National Average: 68.0%" tone="gold" onClick={() => document.getElementById('compliance-table')?.scrollIntoView({ behavior: 'smooth' })} />
      </div>

      {visibleCharts.has('employability') ? (
        <ChartCard onView={() => setChartOpen(true)} onExport={exportChart}>{employabilityChart()}</ChartCard>
      ) : (
        <section className="rounded-3xl border border-dashed border-lilac/30 bg-white p-10 text-center">
          <p className="text-sm font-bold text-primary">Graduate Employability Curve is hidden</p>
          <p className="mt-1 text-xs text-muted">Use Chart Selection to restore the visualization.</p>
          <button type="button" onClick={() => toggleChart('employability', true)} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white">Restore chart</button>
        </section>
      )}

      <section id="compliance-table" className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-lilac/10 p-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Program-level accountability</p>
            <p className="mt-1 text-lg font-bold text-primary">Program Quality & Compliance</p>
            <p className="mt-1 text-[10px] text-muted">Select a row to inspect its supplied compliance details and accountable data owner.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-coa/10 px-2.5 py-1 text-[9px] font-bold text-coa">{filteredPrograms.filter(record => record.status === 'On Track').length} On Track</span>
            <span className="rounded-full bg-golden/20 px-2.5 py-1 text-[9px] font-bold text-obsidian">{filteredPrograms.filter(record => record.status === 'Warning').length} Warning</span>
          </div>
        </div>
        {filteredPrograms.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead className="sticky top-0 bg-surface">
                <tr>
                  {['Program Name', 'College', 'ALCUCOA Level', 'COPC Status', 'Licensure Pass Rate', 'Data Owner', 'Status'].map(column => (
                    <th key={column} className="border-b border-lilac/10 px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-muted">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map(record => (
                  <tr
                    key={record.program}
                    tabIndex={0}
                    onClick={() => setSelectedProgram(record)}
                    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setSelectedProgram(record); }}
                    className="cursor-pointer border-b border-lilac/10 transition-colors last:border-0 hover:bg-blossom/20 focus:bg-lilac/10 focus:outline-none">
                    <td className="px-5 py-4"><p className="text-xs font-bold text-primary">{record.program}</p><p className="mt-1 text-[9px] text-muted">{record.shortProgram} · AY 2026–2027</p></td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-2 text-xs font-bold text-primary"><span className="h-2 w-2 rounded-full" style={{ background: COLLEGE_COLORS[record.college] }} />{record.college}</span></td>
                    <td className="px-5 py-4 text-xs font-medium text-primary">{record.level}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${record.copc === 'Issued' ? 'bg-coa/10 text-coa' : 'bg-golden/20 text-obsidian'}`}>{record.copc}</span></td>
                    <td className="px-5 py-4 text-xs font-semibold text-primary">{record.licensure}</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted"><Icon type="owner" />{record.owner}</span></td>
                    <td className="px-5 py-4"><StatusBadge status={record.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lilac/10 text-lilac"><Icon type="filter" /></span>
            <p className="mt-4 text-sm font-bold text-primary">No data available for this selection</p>
            <p className="mt-1 text-xs text-muted">No supplied program record matches {scope}. Try another scope or return to the default view.</p>
            <button type="button" onClick={() => setFilters(DEFAULT_FILTERS)} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary/90">Reset to all supplied records</button>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-lilac/10 bg-surface/60 px-5 py-3 text-[9px] text-muted">
          <span><strong className="text-primary">Accredited programs:</strong> BSIT (Level 3) · BSIE (Level 3) · BSEntr (Level 3) · BSEE (Level 2)</span>
          <span>Accreditation summary: 4 of 12 programs accredited (33.3%).</span>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl bg-gradient-to-r from-primary to-obsidian p-5 text-white shadow-xl lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Data stewardship</p>
          <p className="mt-1 text-base font-bold">Executive visibility with accountable ownership</p>
          <p className="mt-1 text-[10px] text-white/50">Program records remain read-oriented for the President. Source owners are retained exactly as supplied and exports reflect demonstration data only.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Deans / QACIM', 'VPAA / Registrar', 'Deans / Board Coord'].map(owner => <span key={owner} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-semibold text-white/70">{owner}</span>)}
        </div>
      </section>

      {chartOpen && (
        <ChartModal
          title="Graduate Employability Curve"
          description={`Employment within six months after graduation. Active module scope: ${scope}. The supplied institutional series is not recalculated from program filters.`}
          chart={employabilityChart(410)}
          dataSummary={<ChartDataSummary data={EMPLOYABILITY} categoryKey="year" totalLabel="Latest actual" distribution={false} series={[{ key: 'actual', label: 'Actual', color: '#BB96E4', unit: '%', aggregate: 'latest' }, { key: 'target', label: 'Target', color: '#FFD066', unit: '%', aggregate: 'latest', includeInGrandTotal: false }]} />}
          onClose={() => setChartOpen(false)}
          onExport={exportChart}
          legend={[{ label: 'Actual', color: '#BB96E4' }, { label: '2026 Target', color: '#FFD066' }]}
          summary={[
            { label: '2024 Actual', value: '82.0%' },
            { label: '2025 Actual', value: '85.5%' },
            { label: '2026 Actual', value: '86.5%' },
            { label: '2026 Target', value: '88.0%' },
          ]}
          insights={[
            'Actual employability increased by 4.5 percentage points from 2024 to 2026.',
            'The supplied 2026 actual is 1.5 percentage points below the supplied target.',
            'Data owners: Program Chairs, VPAA, SPARD.',
          ]}
        />
      )}
      {selectedProgram && <DetailModal record={selectedProgram} onClose={() => setSelectedProgram(null)} />}
    </div>
  );
}