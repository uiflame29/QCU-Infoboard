import { useMemo, useState, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartModal from '../../components/ChartModal';
import SynergyFilterPanel, { SynergyFilterSelect } from '../../components/SynergyFilterPanel';
import { useApp } from '../../context/AppContext';
import ChartDataSummary from '../../components/ChartDataSummary';

type ModuleFilters = {
  employment: string;
  college: string;
  rank: string;
};

type ChartId = 'distribution' | 'demographics' | 'qualifications';

const createDefaultFilters = (): ModuleFilters => ({
  employment: 'All',
  college: 'All',
  rank: 'All',
});

const CHARTS: { id: ChartId; label: string }[] = [
  { id: 'distribution', label: 'Faculty Distribution by Department' },
  { id: 'demographics', label: 'Gender & Marital Status Breakdown' },
  { id: 'qualifications', label: 'Academic Qualifications & Attainment by College' },
];

const QUALIFICATION_COLLEGE_ORDER = ['COA', 'COB', 'CCS', 'COE', 'COED'];

// Qualification values restored from the supplied Academic Qualifications & Attainment chart.
// These are demonstration values and total 240 represented faculty.
const QUALIFICATION_ATTAINMENT = [
  { college: 'COA', bachelors: 10, masters: 20, doctorate: 5 },
  { college: 'COB', bachelors: 22, masters: 18, doctorate: 5 },
  { college: 'CCS', bachelors: 30, masters: 35, doctorate: 10 },
  { college: 'COE', bachelors: 20, masters: 25, doctorate: 10 },
  { college: 'COED', bachelors: 12, masters: 15, doctorate: 3 },
];

const FACULTY_DISTRIBUTION = [
  { college: 'CCS', name: 'College of Computer Studies', count: 50, share: 11.59, color: '#333333' },
  { college: 'COE', name: 'College of Engineering', count: 42, share: 19.93, color: '#FF6B00' },
  { college: 'COB', name: 'College of Business', count: 55, share: 15.22, color: '#FFC700' },
  { college: 'COA', name: 'College of Accountancy', count: 32, share: 18.12, color: '#00875A' },
  { college: 'COEd', name: 'College of Education', count: 97, share: 35.14, color: '#0052CC' },
];

const DEMOGRAPHICS = [
  { gender: 'Male', Single: 85, Married: 180, Widowed: 12, Separated: 8 },
  { gender: 'Female', Single: 70, Married: 165, Widowed: 14, Separated: 6 },
];

const tooltipStyle = {
  borderRadius: 16,
  border: '1px solid rgba(187,150,228,.3)',
  boxShadow: '0 12px 32px rgba(32,13,45,.16)',
  background: '#FFFFFF',
  color: '#200D2D',
  fontSize: 11,
  maxWidth: 300,
  whiteSpace: 'normal' as const,
};

function Icon({ type }: { type: 'filter' | 'download' | 'users' | 'owner' | 'target' | 'spark' }) {
  const paths = {
    filter: <path d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />,
    download: <><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></>,
    users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M17 11a3 3 0 100-6m1 9c2.3.5 3.5 2.1 3.5 4.5" /></>,
    owner: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6M17 11h4m-2-2v4" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M15 9l6-6m0 0v5m0-5h-5" /></>,
    spark: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></>,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
}

function EmptyChart({ reason, onReset }: { reason: string; onReset: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-lilac/30 bg-surface/60 px-6 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lilac/10 text-lilac"><Icon type="filter" /></span>
      <p className="mt-3 text-sm font-bold text-primary">No data available for this selection</p>
      <p className="mt-1 max-w-sm text-[10px] leading-relaxed text-muted">{reason}</p>
      <button type="button" onClick={onReset} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-lilac/25">Reset filters</button>
    </div>
  );
}

function ChartCard({
  eyebrow,
  title,
  description,
  owner,
  onView,
  onExport,
  summary,
  children,
  className = '',
}: {
  eyebrow: string;
  title: string;
  description: string;
  owner: string;
  onView: () => void;
  onExport: () => void;
  summary: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">{eyebrow}</p>
          <p className="mt-1 text-base font-bold text-primary">{title}</p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted">{description}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onView} className="rounded-xl border border-lilac/20 px-3 py-2 text-[10px] font-bold text-primary transition-colors hover:bg-lilac/10 focus:outline-none focus:ring-4 focus:ring-lilac/20">View Chart</button>
          <button type="button" onClick={onExport} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-lilac/25"><Icon type="download" /> Export Chart</button>
        </div>
      </div>
      <div className="mt-4 h-80">{children}</div>
      {summary}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-lilac/10 pt-3 text-[9px] text-muted">
        <span className="inline-flex items-center gap-1.5"><Icon type="owner" /> Data owner{owner.includes(',') ? 's' : ''}: <strong className="text-primary">{owner}</strong></span>
        <span className="rounded-full bg-lilac/10 px-2.5 py-1 font-semibold text-primary">Supplied demonstration data</span>
      </div>
    </section>
  );
}

export default function PresidentEmpoweredEducators() {
  const { showToast } = useApp();
  const [filters, setFilters] = useState<ModuleFilters>(createDefaultFilters);
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(new Set(CHARTS.map(chart => chart.id)));
  const [activeChart, setActiveChart] = useState<ChartId | null>(null);

  const supportedEmployment = filters.employment === 'All' || filters.employment === 'Full-Time';
  const supportedRank = filters.rank === 'All';
  const distributionAvailable = supportedEmployment && supportedRank;
  const demographicsAvailable = distributionAvailable && filters.college === 'All';
  const qualificationEmploymentSupported = ['All', 'Full-Time', 'Part-Time'].includes(filters.employment);
  const qualificationAvailable = supportedRank && qualificationEmploymentSupported;
  const activeFilterCount = Object.values(filters).filter(value => value !== 'All').length;
  const selectedCollege = filters.college === 'All' ? null : FACULTY_DISTRIBUTION.find(row => row.college.toUpperCase() === filters.college.toUpperCase());
  const scope = `${filters.employment === 'All' ? 'All supported appointments' : filters.employment} · ${filters.college === 'All' ? 'All Colleges' : filters.college} · ${filters.rank === 'All' ? 'All Ranks' : filters.rank}`;
  const qualificationData = qualificationAvailable
    ? QUALIFICATION_ATTAINMENT
        .filter(row => filters.college === 'All' || row.college.toUpperCase() === filters.college.toUpperCase())
        .map(row => ({
          ...row,
          total: row.bachelors + row.masters + row.doctorate,
        }))
        .sort((left, right) => QUALIFICATION_COLLEGE_ORDER.indexOf(left.college) - QUALIFICATION_COLLEGE_ORDER.indexOf(right.college))
    : [];
  const qualificationTotals = qualificationData.reduce((totals, row) => ({
    bachelors: totals.bachelors + row.bachelors,
    masters: totals.masters + row.masters,
    doctorate: totals.doctorate + row.doctorate,
    total: totals.total + row.total,
  }), { bachelors: 0, masters: 0, doctorate: 0, total: 0 });
  const doctorateShare = qualificationTotals.total ? qualificationTotals.doctorate / qualificationTotals.total * 100 : 0;
  const graduateShare = qualificationTotals.total ? (qualificationTotals.masters + qualificationTotals.doctorate) / qualificationTotals.total * 100 : 0;
  const qualificationScopeLabel = filters.college === 'All' ? 'Overall faculty population' : `${filters.college} faculty`;

  const distributionCenter = selectedCollege
    ? { value: selectedCollege.count, label: `${selectedCollege.college} faculty` }
    : { value: 276, label: 'Total faculty' };

  const exportRows = useMemo(() => ({
    distribution: FACULTY_DISTRIBUTION.map(row => ({
      College: row.college,
      'Faculty Headcount': row.count,
      'Supplied Share': `${row.share.toFixed(1)}%`,
      'Data Owner': 'HRMD',
      'Active Scope': scope,
    })),
    demographics: demographicsAvailable ? DEMOGRAPHICS.flatMap(row => [
      { Scope: 'University-wide', Gender: row.gender, 'Marital Status': 'Single', Count: row.Single, 'Data Owner': 'HRMD', 'Active Scope': scope },
      { Scope: 'University-wide', Gender: row.gender, 'Marital Status': 'Married', Count: row.Married, 'Data Owner': 'HRMD', 'Active Scope': scope },
      { Scope: 'University-wide', Gender: row.gender, 'Marital Status': 'Widowed', Count: row.Widowed, 'Data Owner': 'HRMD', 'Active Scope': scope },
      { Scope: 'University-wide', Gender: row.gender, 'Marital Status': 'Separated', Count: row.Separated, 'Data Owner': 'HRMD', 'Active Scope': scope },
    ]) : [],
    qualifications: qualificationData.flatMap(row => [
      { Department: row.college, Qualification: 'Bachelor’s Degree Only', Count: row.bachelors, Share: `${(row.bachelors / row.total * 100).toFixed(1)}%`, 'Data Owners': 'HRMD, OVPAA, Deans', 'Active Scope': scope },
      { Department: row.college, Qualification: 'Master’s Degree', Count: row.masters, Share: `${(row.masters / row.total * 100).toFixed(1)}%`, 'Data Owners': 'HRMD, OVPAA, Deans', 'Active Scope': scope },
      { Department: row.college, Qualification: 'Ph.D. Earned', Count: row.doctorate, Share: `${(row.doctorate / row.total * 100).toFixed(1)}%`, 'Data Owners': 'HRMD, OVPAA, Deans', 'Active Scope': scope },
    ]),
  }), [demographicsAvailable, qualificationData, scope]);

  function updateFilter(key: keyof ModuleFilters, value: string) {
    setFilters(previous => ({ ...previous, [key]: value }));
  }

  function resetFilters() {
    setFilters(createDefaultFilters());
  }

  function toggleChart(id: string, checked: boolean) {
    setVisibleCharts(previous => {
      const next = new Set(previous);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  }

  function downloadCsv(filename: string, rows: Record<string, string | number>[], title: string) {
    if (!rows.length) {
      showToast({ type: 'warning', title: 'Nothing to export', body: 'No supplied records match the active filter selection.' });
      return;
    }
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.map(header => `"${header}"`).join(','),
      ...rows.map(row => headers.map(header => `"${String(row[header] ?? '').replaceAll('"', '""')}"`).join(',')),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast({ type: 'success', title, body: 'A CSV containing the displayed supplied data and active filter scope was downloaded.' });
  }

  function exportChart(id: ChartId) {
    downloadCsv(`QCU-Empowered-Educators-${id}.csv`, exportRows[id], 'Chart data exported');
  }

  function exportPage() {
    const rows = CHARTS
      .filter(chart => visibleCharts.has(chart.id))
      .flatMap(chart => exportRows[chart.id].map(row => ({ Visualization: chart.label, ...row })));
    downloadCsv('QCU-Empowered-Educators-Page-Data.csv', rows, 'Page data exported');
  }

  function distributionChart(height: number | string = '100%') {
    if (!distributionAvailable) return <EmptyChart reason="The supplied faculty distribution is not segmented by the selected employment status or faculty rank." onReset={resetFilters} />;
    return (
      <div className="relative h-full">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={FACULTY_DISTRIBUTION} dataKey="count" nameKey="college" innerRadius={70} outerRadius={112} paddingAngle={3}>
              {FACULTY_DISTRIBUTION.map(row => (
                <Cell key={row.college} fill={row.color} opacity={!selectedCollege || selectedCollege.college === row.college ? 1 : 0.22} stroke={selectedCollege?.college === row.college ? '#200D2D' : '#FFFFFF'} strokeWidth={selectedCollege?.college === row.college ? 3 : 1} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: '#200D2D', fontWeight: 600 }}
              labelStyle={{ color: '#7B6891', fontWeight: 700, marginBottom: 6 }}
              wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
              allowEscapeViewBox={{ x: true, y: true }}
              formatter={(value, _name, entry) => [`${Number(value)} faculty · ${Number(entry.payload.share).toFixed(1)}%`, entry.payload.college]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value, entry) => {
                const row = entry.payload as unknown as (typeof FACULTY_DISTRIBUTION)[number];
                return `${value} · ${row.count} · ${row.share.toFixed(1)}%`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute left-1/2 top-[39%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-2xl font-bold text-primary">{distributionCenter.value}</p>
          <p className="mt-0.5 text-[8px] font-bold uppercase tracking-wider text-muted">{distributionCenter.label}</p>
        </div>
      </div>
    );
  }

  function demographicsChart(height: number | string = '100%') {
    if (!demographicsAvailable) return <EmptyChart reason="The supplied university-wide gender and marital-status totals are available for the all-colleges scope and are not segmented by college or faculty rank." onReset={resetFilters} />;
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={DEMOGRAPHICS} margin={{ top: 14, right: 12, left: 0, bottom: 2 }}>
          <CartesianGrid vertical={false} stroke="rgba(187,150,228,.16)" />
          <XAxis dataKey="gender" tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            shared={false}
            contentStyle={tooltipStyle}
            itemStyle={{ color: '#200D2D', fontWeight: 600 }}
            labelStyle={{ color: '#7B6891', fontWeight: 700, marginBottom: 6 }}
            cursor={{ fill: 'rgba(187,150,228,.08)' }}
            wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
            allowEscapeViewBox={{ x: true, y: true }}
            formatter={(value, name, entry) => {
              const total = Number(entry.payload.Single) + Number(entry.payload.Married) + Number(entry.payload.Widowed) + Number(entry.payload.Separated);
              return [`${Number(value)} faculty · ${(Number(value) / total * 100).toFixed(1)}% of ${entry.payload.gender}`, String(name)];
            }}
            labelFormatter={label => `${label} faculty`}
          />
          <Legend iconType="circle" iconSize={8} />
          <Bar dataKey="Single" name="Single" fill="#BB96E4" radius={[7, 7, 0, 0]}>
            <LabelList dataKey="Single" position="top" fill="#200D2D" fontSize={10} fontWeight={700} />
          </Bar>
          <Bar dataKey="Married" name="Married" fill="#200D2D" radius={[7, 7, 0, 0]}>
            <LabelList dataKey="Married" position="top" fill="#200D2D" fontSize={10} fontWeight={700} />
          </Bar>
          <Bar dataKey="Widowed" name="Widowed" fill="#FFD066" radius={[7, 7, 0, 0]}>
            <LabelList dataKey="Widowed" position="top" fill="#200D2D" fontSize={10} fontWeight={700} />
          </Bar>
          <Bar dataKey="Separated" name="Separated" fill="#426BC2" radius={[7, 7, 0, 0]}>
            <LabelList dataKey="Separated" position="top" fill="#200D2D" fontSize={10} fontWeight={700} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  function qualificationsChart(height: number | string = '100%') {
    if (!qualificationAvailable || !qualificationData.length) return <EmptyChart reason="The available college qualification dataset supports All, Full-Time, and Part-Time appointment scopes and is not segmented by faculty rank, Tenured, or Contractual status." onReset={resetFilters} />;
    return (
      <div className="grid h-full gap-3 sm:grid-cols-[1fr_11rem]">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={qualificationData} margin={{ top: 18, right: 8, left: 0, bottom: 2 }}>
            <CartesianGrid vertical={false} stroke="rgba(187,150,228,.16)" />
            <XAxis dataKey="college" tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              shared={false}
              contentStyle={tooltipStyle}
              itemStyle={{ color: '#200D2D', fontWeight: 600 }}
              labelStyle={{ color: '#7B6891', fontWeight: 700, marginBottom: 6 }}
              wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
              allowEscapeViewBox={{ x: true, y: true }}
              formatter={(value, name, entry) => {
                const labels: Record<string, string> = { doctorate: 'Ph.D. Earned', masters: 'Master’s Degree', bachelors: 'Bachelor’s Degree Only' };
                return [`${Number(value)} faculty · ${(Number(value) / Number(entry.payload.total) * 100).toFixed(1)}% of ${entry.payload.college}`, labels[String(name)]];
              }}
              labelFormatter={college => `${college} qualification distribution`}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={value => ({ doctorate: 'Ph.D. Earned', masters: 'Master’s Degree', bachelors: 'Bachelor’s Degree Only' }[String(value)] ?? value)}
            />
            <Bar dataKey="bachelors" name="Bachelor’s Degree Only" stackId="qualification" fill="#4C1413">
              <LabelList dataKey="bachelors" position="center" fill="#FFFFFF" fontSize={10} fontWeight={700} />
            </Bar>
            <Bar dataKey="masters" name="Master’s Degree" stackId="qualification" fill="#BB96E4">
              <LabelList dataKey="masters" position="center" fill="#200D2D" fontSize={10} fontWeight={700} />
            </Bar>
            <Bar dataKey="doctorate" name="Ph.D. Earned" stackId="qualification" fill="#FFD066" radius={[7, 7, 0, 0]}>
              <LabelList dataKey="doctorate" position="center" fill="#200D2D" fontSize={10} fontWeight={700} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-golden/25 to-blossom/40 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-obsidian"><Icon type="target" /></span>
          <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-muted">{qualificationScopeLabel}</p>
          <p className="mt-1 text-2xl font-bold text-primary">{doctorateShare.toFixed(1)}%</p>
          <p className="mt-1 text-[9px] leading-relaxed text-muted">{qualificationTotals.doctorate} Ph.D. holders of {qualificationTotals.total} represented faculty</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70"><div className="h-full rounded-full bg-golden transition-all duration-500" style={{ width: `${Math.min(doctorateShare / 30 * 100, 100)}%` }} /></div>
          <p className="mt-2 text-[9px] font-bold text-obsidian">{Math.abs(30 - doctorateShare).toFixed(1)} pts {doctorateShare >= 30 ? 'above' : 'below'} 30% target</p>
          <p className="mt-1 text-[8px] text-muted">Graduate-qualified: {graduateShare.toFixed(1)}% · 2028 benchmark</p>
        </div>
      </div>
    );
  }

  const dataSummaries: Record<ChartId, ReactNode> = {
    distribution: <ChartDataSummary className="mt-3" data={FACULTY_DISTRIBUTION} categoryKey="college" totalLabel="Total faculty" series={[{ key: 'count', label: 'Faculty', color: '#BB96E4' }]} />,
    demographics: <ChartDataSummary className="mt-3" data={demographicsAvailable ? DEMOGRAPHICS : []} categoryKey="gender" totalLabel="Total faculty" series={[{ key: 'Single', label: 'Single', color: '#BB96E4' }, { key: 'Married', label: 'Married', color: '#200D2D' }, { key: 'Widowed', label: 'Widowed', color: '#FFD066' }, { key: 'Separated', label: 'Separated', color: '#426BC2' }]} />,
    qualifications: <ChartDataSummary className="mt-3" data={qualificationData} categoryKey="college" totalLabel="Total represented faculty" series={[{ key: 'bachelors', label: 'Bachelor’s only', color: '#4C1413' }, { key: 'masters', label: 'Master’s', color: '#BB96E4' }, { key: 'doctorate', label: 'Ph.D.', color: '#FFD066' }]} />,
  };

  const chartMeta = {
    distribution: {
      title: 'Faculty Distribution by Department',
      description: `All five supplied college totals and rounded shares. Active scope: ${scope}. Employment and rank filters do not recalculate this unsegmented source.`,
      chart: distributionChart(410),
      owner: 'HRMD',
      summary: [
        { label: 'Represented Faculty', value: '540 faculty' },
        { label: 'Largest College', value: 'COEd · 130 · 24.1%' },
        { label: 'Colleges Shown', value: '5 supplied colleges' },
        { label: 'Data Owner', value: 'HRMD' },
      ],
      insights: ['Total supplied faculty headcount: 540.', 'College colors and one-decimal shares are preserved exactly as supplied.', `Data owner: HRMD.`],
    },
    demographics: {
      title: 'Gender & Marital Status Breakdown',
      description: `University-wide faculty demographic profile. Active scope: ${scope}.`,
      chart: demographicsChart(410),
      owner: 'HRMD',
      summary: [
        { label: 'Single', value: '155 faculty · 28.7%' },
        { label: 'Married', value: '345 faculty · 63.9%' },
        { label: 'Widowed', value: '26 faculty · 4.8%' },
        { label: 'Separated', value: '14 faculty · 2.6%' },
      ],
      insights: ['The supplied university-wide profile represents 285 male and 255 female faculty.', 'All four civil-status categories total 540 faculty.', 'Data owner: HRMD.'],
    },
    qualifications: {
      title: 'Academic Qualifications & Attainment by College',
      description: `Bachelor’s, Master’s, and Ph.D. attainment across the available QCU college qualification dataset. Active scope: ${scope}.`,
      chart: qualificationsChart(410),
      owner: 'HRMD, OVPAA, Deans',
      summary: [
        { label: qualificationScopeLabel, value: `${qualificationTotals.total} faculty represented` },
        { label: 'Bachelor’s Degree Only', value: `${qualificationTotals.bachelors} · ${qualificationTotals.total ? (qualificationTotals.bachelors / qualificationTotals.total * 100).toFixed(1) : '0.0'}%` },
        { label: 'Master’s Degree', value: `${qualificationTotals.masters} · ${qualificationTotals.total ? (qualificationTotals.masters / qualificationTotals.total * 100).toFixed(1) : '0.0'}%` },
        { label: 'Ph.D. Earned', value: `${qualificationTotals.doctorate} · ${doctorateShare.toFixed(1)}%` },
      ],
      insights: [`The selected scope represents ${qualificationTotals.total} faculty across ${qualificationData.length} college${qualificationData.length === 1 ? '' : 's'}.`, `Graduate-qualified faculty represent ${graduateShare.toFixed(1)}% of the selected qualification population.`, 'Data owners: HRMD, OVPAA, Deans.'],
    },
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-obsidian p-6 text-white shadow-xl">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-36 w-36 rounded-full bg-golden/10 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.22em] text-lilac">Strategic Directions — Pillar 2</p>
            <p className="mt-2 text-2xl font-bold">Empowered Educators</p>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-white/60">Monitor faculty distribution, demographic profiles, and academic qualifications to support institutional planning and accreditation compliance.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold text-white/65">President · Read-oriented analytics</span>
              <span className="rounded-full border border-golden/25 bg-golden/10 px-3 py-1 text-[9px] font-semibold text-golden">Supplied demonstration data</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold text-white/65">{scope}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportPage} className="flex items-center gap-2 rounded-xl bg-golden px-4 py-2.5 text-xs font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-golden/90 focus:outline-none focus:ring-4 focus:ring-white/15"><Icon type="download" /> Export All Page Data</button>
          </div>
        </div>
      </section>

      <SynergyFilterPanel
        title="Empowered Educators Filters"
        description="All dependent faculty visualizations refresh from one shared state; unsupported source combinations return a transparent empty state."
        activeFilterCount={activeFilterCount}
        charts={CHARTS}
        visibleCharts={visibleCharts}
        onChartChange={toggleChart}
        onReset={resetFilters}
        resetDisabled={!activeFilterCount}>
        <SynergyFilterSelect label="Employment Status" value={filters.employment} options={['All', 'Full-Time', 'Part-Time', 'Tenured', 'Contractual']} onChange={value => updateFilter('employment', value)} />
        <SynergyFilterSelect label="College / Department" value={filters.college} options={['All', 'CCS', 'COE', 'COB', 'COA', 'COEd']} onChange={value => updateFilter('college', value)} />
        <SynergyFilterSelect label="Faculty Rank" value={filters.rank} options={['All', 'Instructor', 'Assistant Professor', 'Associate Professor', 'Professor']} onChange={value => updateFilter('rank', value)} />
      </SynergyFilterPanel>
      <section className="sr-only" aria-live="polite">
        {activeFilterCount > 0 && (
          <p>{activeFilterCount} faculty filters are active: {Object.values(filters).filter(value => value !== 'All').join(', ')}.</p>
        )}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {visibleCharts.has('distribution') && (
          <ChartCard
            eyebrow="Institutional workforce"
            title="Faculty Distribution by Department"
            description="Exact supplied headcount share across five colleges. Selecting a college highlights its segment without inventing a new percentage."
            owner="HRMD"
            onView={() => setActiveChart('distribution')}
            onExport={() => exportChart('distribution')}
            summary={dataSummaries.distribution}>
            {distributionChart()}
          </ChartCard>
        )}
        {visibleCharts.has('demographics') && (
          <ChartCard
            eyebrow="University-wide demographic profile"
            title="Gender & Marital Status Breakdown"
            description="Grouped comparison of Single, Married, Widowed, and Separated faculty by gender; all values reconcile to 540 faculty."
            owner="HRMD"
            onView={() => setActiveChart('demographics')}
            onExport={() => exportChart('demographics')}
            summary={dataSummaries.demographics}>
            {demographicsChart()}
          </ChartCard>
        )}
        {visibleCharts.has('qualifications') && (
          <ChartCard
            className="xl:col-span-2"
            eyebrow="Accreditation readiness"
            title="Academic Qualifications & Attainment by College"
            description="Stacked qualification composition for COA, COB, CCS, COE, and COED, with a filter-aware summary of the selected college or overall faculty population."
            owner="HRMD, OVPAA, Deans"
            onView={() => setActiveChart('qualifications')}
            onExport={() => exportChart('qualifications')}
            summary={dataSummaries.qualifications}>
            {qualificationsChart()}
          </ChartCard>
        )}
      </div>

      {!visibleCharts.size && (
        <section className="rounded-3xl border border-dashed border-lilac/30 bg-white p-12 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lilac/10 text-lilac"><Icon type="users" /></span>
          <p className="mt-4 text-sm font-bold text-primary">All charts are hidden</p>
          <p className="mt-1 text-xs text-muted">Chart visibility does not affect filters or underlying data.</p>
          <button type="button" onClick={() => setVisibleCharts(new Set(CHARTS.map(chart => chart.id)))} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary/90">Restore all charts</button>
        </section>
      )}

      <section className="grid gap-4 rounded-3xl bg-gradient-to-r from-primary to-obsidian p-5 text-white shadow-xl lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Data stewardship</p>
          <p className="mt-1 text-base font-bold">Executive inspection with accountable source ownership</p>
          <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-white/50">The President receives a read-oriented analytical view. Data-owner labels indicate accountability and do not grant editing, import, archive, or faculty-record management permissions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['HRMD', 'OVPAA', 'Deans'].map(owner => <span key={owner} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-semibold text-white/70">{owner}</span>)}
        </div>
      </section>

      {activeChart && (
        <ChartModal
          title={chartMeta[activeChart].title}
          description={chartMeta[activeChart].description}
          chart={chartMeta[activeChart].chart}
          dataSummary={dataSummaries[activeChart]}
          onClose={() => setActiveChart(null)}
          onExport={() => exportChart(activeChart)}
          summary={chartMeta[activeChart].summary}
          insights={chartMeta[activeChart].insights}
        />
      )}
    </div>
  );
}
