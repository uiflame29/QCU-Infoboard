import { useMemo, useState, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartModal from '../../components/ChartModal';
import { useApp } from '../../context/AppContext';
import type { ScreenId } from '../../types';
import ChartDataSummary from '../../components/ChartDataSummary';

const COLLEGE_COLORS: Record<string, string> = {
  CCS: '#333333',
  COE: '#FF6B00',
  COB: '#FFC700',
  COA: '#00875A',
  COED: '#0052CC',
};

const BASE_COLLEGES = [
  { college: 'CCS', students: 3422, male: 1544, female: 1878 },
  { college: 'COE', students: 2743, male: 843, female: 1900 },
  { college: 'COB', students: 3635, male: 1200, female: 2435 },
  { college: 'COA', students: 1740, male: 550, female: 1190 },
  { college: 'COED', students: 982, male: 400, female: 582 },
];

const FACULTY_RANKS = [
  { rank: 'Professor', count: 25 },
  { rank: 'Associate Professor', count: 65 },
  { rank: 'Assistant Professor', count: 150 },
  { rank: 'Instructor', count: 220 },
  { rank: 'Lecturer (Part-time)', count: 80 },
];

const PILLARS: {
  id: ScreenId;
  number: string;
  title: string;
  actual: number;
  target: number;
  status: 'On Track' | 'At Risk' | 'Critical Gap';
  owners: string;
  drivers: string[];
  recommendation: string;
}[] = [
  { id: 'president-global-curriculum', number: '01', title: 'Global Standard Curriculum', actual: 86.8, target: 90, status: 'On Track', owners: 'REPL · VPAA · QACIM · Registrar', drivers: ['3 Level III accredited programs', '56.25% COPC compliance', '88.5% graduate employability'], recommendation: 'Sustain accreditation readiness and close remaining COPC cases.' },
  { id: 'president-empowered-educators', number: '02', title: 'Empowered Educators', actual: 84.2, target: 88, status: 'At Risk', owners: 'HRMD · OVPAA · Deans', drivers: ['276 workforce members', '150 assistant professors', '30% doctorate-share target'], recommendation: 'Accelerate graduate-study support and promotion pipelines.' },
  { id: 'president-student-engagement', number: '03', title: 'Dynamic Student Engagement', actual: 92.1, target: 90, status: 'On Track', owners: 'Registrar · OSAS · Guidance', drivers: ['96% retention', '64% first-generation', '90% BSIT capacity use'], recommendation: 'Maintain retention interventions for high-volume programs.' },
  { id: 'president-research-excellence', number: '04', title: 'Research Excellence', actual: 80, target: 90, status: 'At Risk', owners: 'REPL · ITSO · Research Coordinators', drivers: ['28 publications YTD', 'PHP 14.5M external grants', '8 active utility models'], recommendation: 'Prioritize indexed publication incentives and external grant partnerships.' },
  { id: 'president-community-synergy', number: '05', title: 'Community Synergy', actual: 91.5, target: 90, status: 'On Track', owners: 'REPL-EMO · RMO · OVPAA', drivers: ['3,630 beneficiaries', '4.8 / 5 satisfaction', '1,150 student volunteers'], recommendation: 'Scale documented high-impact extension programs.' },
  { id: 'president-supportive-infrastructures', number: '06', title: 'Supportive Infrastructures', actual: 74.5, target: 85, status: 'Critical Gap', owners: 'PFGSD · MIS · VPAF', drivers: ['42 of 60 smart rooms', '92.3% PWD compliance', '8.4% energy reduction'], recommendation: 'Expedite smart-board procurement for Batasan campus.' },
  { id: 'president-governance-excellence', number: '07', title: 'Governance for Excellence', actual: 96.4, target: 95, status: 'On Track', owners: 'Planning · Finance · HRMD · Records', drivers: ['14 of 14 offices compliant', '4.2-day scholarship turnaround', '100% audit resolution'], recommendation: 'Preserve quarterly accountability and data-owner validation cycles.' },
];

const ALERTS = [
  { level: 'Critical', title: 'Smart classroom adoption below safe trajectory', owner: 'PFGSD / MIS', status: 'Open', action: 'Expedite Batasan smart-board procurement.' },
  { level: 'Warning', title: 'BS Industrial Engineering COPC pending review', owner: 'VPAA / COE Dean', status: 'In Review', action: 'Complete evidence validation before the next CHED window.' },
  { level: 'Warning', title: 'COE licensure pace below 2028 milestone', owner: 'VPAA / COE Dean', status: 'Mitigation', action: 'Implement mandatory Saturday review sessions.' },
];

const tooltipStyle = {
  borderRadius: 16,
  border: '1px solid rgba(187,150,228,.3)',
  boxShadow: '0 12px 32px rgba(32,13,45,.14)',
  fontSize: 11,
};

function valueWithPercentage(value: unknown, total: number) {
  const numericValue = Number(value);
  const percentage = total > 0 ? (numericValue / total) * 100 : 0;
  return `${numericValue.toLocaleString()} (${percentage.toFixed(1)}%)`;
}

function Icon({ type }: { type: 'people' | 'faculty' | 'college' | 'pillar' | 'risk' | 'shield' | 'score' | 'trend' }) {
  const paths = {
    people: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.8 2.8-6.5 6.5-6.5s6.5 2.7 6.5 6.5M17 11a3 3 0 100-6m1 9c2.3.5 3.5 2.1 3.5 4.5" /></>,
    faculty: <><path d="M12 3L3 8l9 5 9-5-9-5zM6 11v5l6 4 6-4v-5" /></>,
    college: <><path d="M3 21h18M5 21V9l7-5 7 5v12M9 13h2m2 0h2m-6 4h2m2 0h2" /></>,
    pillar: <><path d="M4 21h16M6 18V8m4 10V4m4 14V7m4 11V10" /></>,
    risk: <><path d="M12 3l9 17H3L12 3z" /><path d="M12 9v4m0 3h.01" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M8 12l2.5 2.5L16 9" /></>,
    score: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    trend: <><path d="M4 18l5-5 4 3 7-9" /><path d="M15 7h5v5" /></>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

function MetricCard({ label, value, detail, trend, icon, tone = 'lilac', onClick }: {
  label: string;
  value: string;
  detail: string;
  trend: string;
  icon: Parameters<typeof Icon>[0]['type'];
  tone?: 'lilac' | 'gold' | 'rose';
  onClick: () => void;
}) {
  const tones = {
    lilac: 'bg-lilac/10 text-lilac',
    gold: 'bg-golden/20 text-obsidian',
    rose: 'bg-blossom/60 text-obsidian',
  };
  return (
    <button onClick={onClick} className="group rounded-3xl border border-lilac/20 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lilac/50 hover:shadow-xl">
      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}><Icon type={icon} /></span>
      <span className="mt-5 block text-[9px] font-bold uppercase tracking-[.16em] text-muted">{label}</span>
      <span className="mt-2 block text-2xl font-bold text-primary count-animate">{value}</span>
      <span className="mt-1 flex items-center justify-between gap-2 text-[10px] text-muted">
        <span>{detail}</span>
        <span className="font-bold text-coa">{trend}</span>
      </span>
    </button>
  );
}

function ChartCard({ eyebrow, title, description, onView, onExport, summary, children }: {
  eyebrow: string;
  title: string;
  description: string;
  onView: () => void;
  onExport: () => void;
  summary: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">{eyebrow}</p>
          <p className="mt-1 text-sm font-bold text-primary">{title}</p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted">{description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onView} className="rounded-xl border border-lilac/20 px-3 py-2 text-[10px] font-bold text-primary transition-colors hover:bg-lilac/10">View Chart</button>
          <button onClick={onExport} className="rounded-xl bg-primary px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-primary/90">Export</button>
        </div>
      </div>
      <div className="mt-4 h-72">{children}</div>
      {summary}
    </section>
  );
}

function StatusBadge({ status }: { status: 'On Track' | 'At Risk' | 'Critical Gap' }) {
  const className = status === 'On Track'
    ? 'border-coa/20 bg-coa/10 text-coa'
    : status === 'At Risk'
      ? 'border-golden/40 bg-golden/20 text-obsidian'
      : 'border-obsidian/20 bg-obsidian/10 text-obsidian';
  return <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${className}`}>{status}</span>;
}

export default function PresidentDashboard() {
  const { filters, setFilters, navigate, showToast } = useApp();
  const [activeChart, setActiveChart] = useState<'college' | 'firstgen' | 'gender' | 'rank' | null>(null);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);
  const [budgetLift, setBudgetLift] = useState(15);
  const [growthLift, setGrowthLift] = useState(10);

  const yearFactor = ({ '2026–2027': 1, '2027–2028': 1.035, '2028–2029': 1.07, '2030–2031': 1.16 } as Record<string, number>)[filters.academicYear] ?? 1;
  const campusFactor = ({ All: 1, 'San Bartolome (Main)': .62, 'San Francisco': .22, 'Batasan Campus': .16 } as Record<string, number>)[filters.campus] ?? 1;
  const programFactor = filters.program === 'All' ? 1 : .42;
  const scale = yearFactor * campusFactor * programFactor;

  const collegeData = useMemo(() => BASE_COLLEGES
    .filter(row => filters.college === 'All' || row.college === filters.college)
    .map(row => ({
      ...row,
      students: Math.round(row.students * scale),
      male: Math.round(row.male * scale),
      female: Math.round(row.female * scale),
      color: COLLEGE_COLORS[row.college],
    })), [filters.college, scale]);
  const totalStudents = collegeData.reduce((sum, row) => sum + row.students, 0);
  const workforce = Math.round(276 * scale * (filters.college === 'All' ? 1 : .2));
  const firstGenPct = filters.firstGenStatus === 'First-Gen' ? 1 : filters.firstGenStatus === 'Non-First-Gen' ? 0 : .64;
  const firstGenData = [
    { name: 'First-Generation', value: Math.round(totalStudents * firstGenPct), color: '#BB96E4' },
    { name: 'Non-First-Generation', value: Math.round(totalStudents * (1 - firstGenPct)), color: '#200D2D' },
  ].filter(item => item.value > 0);
  const facultyRanks = FACULTY_RANKS.map(row => ({ ...row, count: Math.round(row.count * scale * (filters.college === 'All' ? 1 : .2)) }));
  const firstGenTotal = firstGenData.reduce((sum, row) => sum + row.value, 0);
  const facultyTotal = facultyRanks.reduce((sum, row) => sum + row.count, 0);
  const scopeAdjustment = (yearFactor - 1) * 20 - (filters.college === 'All' ? 0 : 1.2) - (filters.campus === 'All' ? 0 : .6);
  const pillarData = PILLARS.map(pillar => {
    const actual = Math.max(0, Math.min(100, Math.round((pillar.actual + scopeAdjustment) * 10) / 10));
    const variance = actual - pillar.target;
    const status: 'On Track' | 'At Risk' | 'Critical Gap' = variance >= -4 ? 'On Track' : variance >= -9 ? 'At Risk' : 'Critical Gap';
    return { ...pillar, actual, status };
  });
  const riskCount = pillarData.filter(pillar => pillar.status !== 'On Track').length;
  const performanceScore = Math.round(pillarData.reduce((sum, pillar) => sum + pillar.actual, 0) / pillarData.length * 10) / 10;
  const targetAchievementLift = Math.round((budgetLift * .45 + growthLift * .55) * 10) / 10;
  const projected2028 = Math.round((40 + scopeAdjustment + budgetLift * .28 + growthLift * .32) * 10) / 10;
  const projected2031 = Math.round((82 + scopeAdjustment * 1.5 + budgetLift * .55 + growthLift * .75) * 10) / 10;
  const trajectory = [
    { year: '2025', actual: 22, projected: 22, target: 22 },
    { year: '2026', actual: 28, projected: 28, target: 28 },
    { year: '2028', actual: null, projected: projected2028, target: 50 },
    { year: '2031', actual: null, projected: projected2031, target: 120 },
  ];

  function exportRows(filename: string, rows: Record<string, string | number>[]) {
    const headers = Object.keys(rows[0] ?? {});
    const csv = [headers.join(','), ...rows.map(row => headers.map(header => `"${String(row[header] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${filename}-${filters.academicYear}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast({ type: 'success', title: 'Chart exported', body: 'The current filtered dataset was downloaded as CSV.' });
  }

  function chartFor(id: NonNullable<typeof activeChart>, large = false) {
    const heightClass = large ? 'h-[380px]' : 'h-full';
    if (id === 'college') return (
      <div className={heightClass}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={collegeData} dataKey="students" nameKey="college" innerRadius={large ? 90 : 60} outerRadius={large ? 145 : 100} paddingAngle={3} onClick={entry => setFilters(previous => ({ ...previous, college: entry.payload?.college ?? entry.college, program: 'All' }))}>{collegeData.map(row => <Cell key={row.college} fill={row.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [valueWithPercentage(value, totalStudents), name]} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer></div>
    );
    if (id === 'firstgen') return (
      <div className={heightClass}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={firstGenData} dataKey="value" nameKey="name" outerRadius={large ? 145 : 100} onClick={entry => setFilters(previous => ({ ...previous, firstGenStatus: (entry.payload?.name ?? entry.name) === 'First-Generation' ? 'First-Gen' : 'Non-First-Gen' }))}>{firstGenData.map(row => <Cell key={row.name} fill={row.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [valueWithPercentage(value, firstGenTotal), name]} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer></div>
    );
    if (id === 'gender') return (
      <div className={heightClass}><ResponsiveContainer width="100%" height="100%"><BarChart data={collegeData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.16)" /><XAxis dataKey="college" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} formatter={(value, name, item) => [valueWithPercentage(value, Number(item.payload.male) + Number(item.payload.female)), name]} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="male" name="Male" fill="#200D2D" radius={[6, 6, 0, 0]} /><Bar dataKey="female" name="Female" fill="#BB96E4" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
    );
    return (
      <div className={heightClass}><ResponsiveContainer width="100%" height="100%"><BarChart data={facultyRanks} layout="vertical" margin={{ left: 22 }}><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.16)" /><XAxis type="number" tick={{ fontSize: 9 }} /><YAxis dataKey="rank" type="category" width={118} tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [valueWithPercentage(value, facultyTotal), name]} /><Bar dataKey="count" name="Faculty" fill="#BB96E4" radius={[0, 7, 7, 0]} /></BarChart></ResponsiveContainer></div>
    );
  }

  const chartMeta = {
    college: { title: 'Enrollees per College', description: 'Whole-part enrollment distribution using official college colors.', rows: collegeData },
    firstgen: { title: 'First-Generation vs Non-First-Generation', description: 'University-wide sociological milestone distribution.', rows: firstGenData },
    gender: { title: 'Gender Distribution by College', description: 'Side-by-side gender comparison across colleges.', rows: collegeData },
    rank: { title: 'Faculty Academic Rank Distribution', description: 'Executive view of the promotion pipeline and accreditation readiness.', rows: facultyRanks },
  };
  const chartSummaries = {
    college: <ChartDataSummary className="mt-3" data={collegeData} categoryKey="college" totalLabel="Total students" series={[{ key: 'students', label: 'Enrollment', color: '#BB96E4' }]} />,
    firstgen: <ChartDataSummary className="mt-3" data={firstGenData} categoryKey="name" totalLabel="Total students" series={[{ key: 'value', label: 'Students', color: '#BB96E4' }]} />,
    gender: <ChartDataSummary className="mt-3" data={collegeData} categoryKey="college" totalLabel="Total students" series={[{ key: 'male', label: 'Male', color: '#200D2D' }, { key: 'female', label: 'Female', color: '#BB96E4' }]} />,
    rank: <ChartDataSummary className="mt-3" data={facultyRanks} categoryKey="rank" totalLabel="Total faculty" series={[{ key: 'count', label: 'Faculty', color: '#BB96E4' }]} />,
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white shadow-xl">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-golden/10 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.22em] text-lilac">Office of the University President</p>
            <p className="mt-2 text-2xl font-bold">Institutional Intelligence Command</p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/55">Consolidated monitoring across academic performance, workforce capacity, strategic directions, governance, and institutional risk.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold text-white/65">Executive access</span>
              <span className="rounded-full border border-coa/30 bg-coa/15 px-3 py-1 text-[9px] font-semibold text-white"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coa animate-pulse" />Live institutional feed</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-semibold text-white/65">{filters.academicYear} · {filters.campus === 'All' ? 'All Campuses' : filters.campus}</span>
              {filters.firstGenStatus !== 'All' && <button onClick={() => setFilters(previous => ({ ...previous, firstGenStatus: 'All' }))} className="rounded-full border border-golden/30 bg-golden/10 px-3 py-1 text-[9px] font-semibold text-golden">{filters.firstGenStatus} cohort ×</button>}
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-golden font-bold text-primary">TA</span>
            <span><span className="block text-xs font-bold">Dr. Theresita V. Atienza</span><span className="mt-1 block text-[9px] text-white/45">University President · Executive Access</span></span>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total University Headcount" value={(totalStudents + workforce).toLocaleString()} detail="Students + workforce" icon="people" onClick={() => showToast({ type: 'info', title: 'University headcount', body: 'Combined student and workforce population in the active scope.' })} />
        <MetricCard label="Total Students" value={totalStudents.toLocaleString()} detail="Active enrollees" icon="people" onClick={() => setActiveChart('college')} />
        <MetricCard label="Workforce Members" value={workforce.toLocaleString()} detail="Academic and support" icon="faculty" onClick={() => setActiveChart('rank')} />
        <MetricCard label="Total Colleges" value={String(collegeData.length)} detail="Active academic units" trend="Stable" icon="college" onClick={() => setActiveChart('college')} />
        <MetricCard label="Active Strategic Pillars" value="7" detail="IDP 2026–2031" trend="All active" icon="pillar" onClick={() => document.getElementById('strategic-pillars')?.scrollIntoView({ behavior: 'smooth' })} />
        <MetricCard label="Priority Bottlenecks & Action Feed" value={String(riskCount)} detail="Requires attention" trend="2 active" icon="risk" tone="rose" onClick={() => document.getElementById('risk-hub')?.scrollIntoView({ behavior: 'smooth' })} />
        <MetricCard label="Data Ingestion Verification Rate" value="92.6%" detail="Verified submissions" icon="shield" tone="gold" onClick={() => navigate('president-audit-trail')} />
        <MetricCard label="University Performance" value={`${performanceScore}%`} detail="Combined percentage of 7 Pillars" icon="score" tone="gold" onClick={() => document.getElementById('strategic-pillars')?.scrollIntoView({ behavior: 'smooth' })} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard eyebrow="Enrollment composition" title="Enrollees per College" description="Select a segment to cross-filter the complete command center." onView={() => setActiveChart('college')} onExport={() => exportRows('enrollees-per-college', collegeData)} summary={chartSummaries.college}>{chartFor('college')}</ChartCard>
        <ChartCard eyebrow="Access and inclusion" title="First-Generation vs Non-First-Generation" description="Select a cohort to apply a demographic cross-filter." onView={() => setActiveChart('firstgen')} onExport={() => exportRows('first-generation-status', firstGenData)} summary={chartSummaries.firstgen}>{chartFor('firstgen')}</ChartCard>
        <ChartCard eyebrow="Gender and development" title="Gender Distribution by College" description="Official college scope with filter-aware gender totals." onView={() => setActiveChart('gender')} onExport={() => exportRows('gender-by-college', collegeData)} summary={chartSummaries.gender}>{chartFor('gender')}</ChartCard>
        <ChartCard eyebrow="Workforce readiness" title="Faculty Academic Rank Distribution" description="Promotion pipeline and accreditation capacity across the active scope." onView={() => setActiveChart('rank')} onExport={() => exportRows('faculty-academic-rank', facultyRanks)} summary={chartSummaries.rank}>{chartFor('rank')}</ChartCard>
      </div>

      <section id="strategic-pillars" className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">IDP 2026–2031</p><p className="mt-1 text-lg font-bold text-primary">Strategic Directions Performance Center</p><p className="mt-1 text-xs text-muted">Target, variance, ownership, and action intelligence across all seven institutional pillars.</p></div>
          <button onClick={() => exportRows('strategic-directions', pillarData.map(({ title, actual, target, status, owners }) => ({ title, actual, target, variance: actual - target, status, owners })))} className="rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary/90">Export pillar summary</button>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {pillarData.map(pillar => {
            const variance = Math.round((pillar.actual - pillar.target) * 10) / 10;
            const expanded = expandedPillar === pillar.id;
            return (
              <article key={pillar.id} className="group relative rounded-3xl border border-lilac/15 bg-surface/50 p-4 transition-all hover:border-lilac/45 hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary font-bold text-golden">{pillar.number}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-bold text-primary">{pillar.title}</p><p className="mt-1 text-[10px] text-muted">Owners: {pillar.owners}</p></div><StatusBadge status={pillar.status} /></div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-2xl bg-white p-2"><p className="text-[8px] uppercase tracking-wider text-muted">Current</p><p className="mt-1 text-sm font-bold text-primary">{pillar.actual}%</p></div>
                      <div className="rounded-2xl bg-white p-2"><p className="text-[8px] uppercase tracking-wider text-muted">Target</p><p className="mt-1 text-sm font-bold text-primary">{pillar.target}%</p></div>
                      <div className="rounded-2xl bg-white p-2"><p className="text-[8px] uppercase tracking-wider text-muted">Variance</p><p className={`mt-1 text-sm font-bold ${variance >= 0 ? 'text-coa' : 'text-obsidian'}`}>{variance > 0 ? '+' : ''}{variance}%</p></div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-lilac/10"><div className={`h-full rounded-full transition-all duration-700 ${pillar.status === 'Critical Gap' ? 'bg-obsidian' : pillar.status === 'At Risk' ? 'bg-golden' : 'bg-lilac'}`} style={{ width: `${Math.min(pillar.actual, 100)}%` }} /></div>
                    {expanded && <div className="mt-4 rounded-2xl border border-lilac/15 bg-white p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-lilac">Executive breakdown</p>{pillar.drivers.map(driver => <p key={driver} className="mt-2 text-[10px] text-muted">• {driver}</p>)}<p className="mt-3 text-[10px] font-semibold leading-relaxed text-primary">{pillar.recommendation}</p></div>}
                    <div className="mt-4 flex gap-2"><button onClick={() => setExpandedPillar(expanded ? null : pillar.id)} className="flex-1 rounded-xl border border-lilac/20 px-3 py-2 text-[10px] font-bold text-primary hover:bg-lilac/10">{expanded ? 'Close View' : 'Quick View'}</button><button onClick={() => navigate(pillar.id)} className="flex-1 rounded-xl bg-primary px-3 py-2 text-[10px] font-bold text-white hover:bg-primary/90">Open Module</button></div>
                  </div>
                </div>
                {!expanded && <div className="pointer-events-none absolute left-4 right-4 top-[calc(100%-1rem)] z-30 translate-y-2 rounded-2xl border border-lilac/30 bg-primary p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"><p className="text-[9px] font-bold uppercase tracking-wider text-lilac">Executive hover brief</p><p className="mt-2 text-[10px] text-white/70">{pillar.drivers.join(' · ')}</p><p className="mt-2 text-[10px] font-semibold text-white">{pillar.recommendation}</p><p className="mt-2 text-[9px] text-white/45">Responsible offices: {pillar.owners}</p></div>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Predictive intelligence</p><p className="mt-1 text-lg font-bold text-primary">Trend Analysis & Forecasting Center</p><p className="mt-1 text-xs text-muted">Scopus-indexed publication trajectory against 2028 and 2031 milestones.</p></div><button onClick={() => navigate('president-trend-forecasting')} className="rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary/90">Open Forecasting Center</button></div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
          <div className="h-80 rounded-2xl bg-surface/50 p-3"><ResponsiveContainer width="100%" height="100%"><LineChart data={trajectory}><CartesianGrid stroke="rgba(187,150,228,.16)" /><XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} formatter={(value, name, item) => { const pointTotal = ['actual', 'projected', 'target'].reduce((sum, key) => sum + Number(item.payload[key] ?? 0), 0); return [valueWithPercentage(value, pointTotal), name]; }} /><Legend iconType="circle" iconSize={8} /><Line type="monotone" dataKey="actual" name="Historical Actual" stroke="#200D2D" strokeWidth={3} connectNulls={false} /><Line type="monotone" dataKey="projected" name="Projected Velocity" stroke="#FFD066" strokeWidth={3} strokeDasharray="7 5" /><Line type="monotone" dataKey="target" name="Milestone Target" stroke="#BB96E4" strokeWidth={2} strokeDasharray="3 4" /></LineChart></ResponsiveContainer></div>
          <div className="space-y-3">
            {[['Research budget increase', budgetLift, setBudgetLift], ['Growth improvement', growthLift, setGrowthLift]].map(([label, value, setter]) => <label key={String(label)} className="block rounded-2xl border border-lilac/15 p-4"><span className="flex justify-between text-[10px] font-bold text-primary"><span>{String(label)}</span><span>{String(value)}%</span></span><input type="range" min="0" max="30" value={Number(value)} onChange={event => (setter as (value: number) => void)(Number(event.target.value))} className="mt-3 w-full accent-primary" /></label>)}
            <div className="rounded-2xl border border-lilac/20 bg-gradient-to-br from-lilac/15 to-golden/15 p-4">
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-[10px] font-bold text-primary">Target Achievement Lift</span>
                  <span className="mt-1 block text-[9px] leading-relaxed text-muted">Combined impact of the budget and growth assumptions on the projection curve.</span>
                </span>
                <span className="shrink-0 rounded-xl bg-primary px-3 py-2 text-sm font-bold text-golden">+{targetAchievementLift}%</span>
              </span>
              <span className="mt-2 block text-[8px] font-semibold uppercase tracking-wider text-muted">Calculated output · not a manual input</span>
            </div>
            <div className="grid grid-cols-2 gap-2"><div className="rounded-2xl bg-golden/20 p-3"><p className="text-[8px] font-bold uppercase tracking-wider text-muted">Projected 2028</p><p className="mt-1 text-lg font-bold text-primary">{projected2028}</p><p className="text-[9px] text-obsidian">{projected2028 >= 50 ? 'On Track' : 'At Risk'}</p></div><div className="rounded-2xl bg-lilac/15 p-3"><p className="text-[8px] font-bold uppercase tracking-wider text-muted">Projected 2031</p><p className="mt-1 text-lg font-bold text-primary">{projected2031}</p><p className="text-[9px] text-obsidian">{projected2031 >= 120 ? 'On Track' : 'Critical Gap'}</p></div></div>
          </div>
          <ChartDataSummary
            className="xl:col-span-2"
            data={trajectory}
            categoryKey="year"
            totalLabel="2031 projection"
            distribution={false}
            series={[
              { key: 'projected', label: 'Projected', color: '#FFD066', aggregate: 'latest' },
              { key: 'target', label: 'Target', color: '#BB96E4', aggregate: 'latest', includeInGrandTotal: false },
              { key: 'actual', label: 'Latest actual', color: '#200D2D', aggregate: 'latest', includeInGrandTotal: false },
            ]}
          />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <section id="risk-hub" className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-obsidian">Exception monitoring</p><p className="mt-1 text-lg font-bold text-primary">Institutional Priority Bottlenecks & Action Feed</p></div><span className="rounded-full bg-obsidian/10 px-3 py-1 text-[9px] font-bold text-obsidian">{ALERTS.length} active alerts</span></div>
          <div className="mt-4 space-y-2">{ALERTS.map(alert => <button key={alert.title} onClick={() => showToast({ type: alert.level === 'Critical' ? 'error' : 'warning', title: alert.title, body: alert.action })} className="w-full rounded-2xl border border-lilac/15 p-4 text-left transition-colors hover:bg-surface"><span className="flex flex-wrap items-start justify-between gap-2"><span><span className="block text-xs font-bold text-primary">{alert.title}</span><span className="mt-1 block text-[10px] text-muted">Owner: {alert.owner} · {alert.status}</span></span><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold ${alert.level === 'Critical' ? 'bg-obsidian/10 text-obsidian' : 'bg-golden/20 text-obsidian'}`}>{alert.level}</span></span><span className="mt-3 block text-[10px] leading-relaxed text-muted">Recommended action: {alert.action}</span></button>)}</div>
        </section>

        <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Data governance visibility</p><p className="mt-1 text-lg font-bold text-primary">Import & Audit Monitor</p>
          <div className="mt-4 space-y-2">
            {[['HRMD', 'Faculty_Doctorate_Q3_2026.xlsx', '184 rows', 'Committed'], ['REPL-Research', 'Scopus_Pubs_Q3_2026.csv', '28 rows', 'Committed'], ['PFGSD', 'Infrastructure_Audit_Q3.xlsx', '45 rows', 'Superseded']].map(row => <div key={row[1]} className="rounded-2xl bg-surface p-3"><div className="flex items-center justify-between gap-2"><p className="truncate text-[10px] font-bold text-primary">{row[1]}</p><span className={`rounded-full px-2 py-1 text-[8px] font-bold ${row[3] === 'Committed' ? 'bg-coa/10 text-coa' : 'bg-golden/20 text-obsidian'}`}>{row[3]}</span></div><p className="mt-1 text-[9px] text-muted">{row[0]} · {row[2]}</p></div>)}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => navigate('president-import-data')} className="rounded-xl border border-lilac/20 px-3 py-2.5 text-[10px] font-bold text-primary hover:bg-lilac/10">Import Data</button><button onClick={() => navigate('president-audit-trail')} className="rounded-xl bg-primary px-3 py-2.5 text-[10px] font-bold text-white hover:bg-primary/90">Audit Logs</button></div>
        </section>
      </div>

      <section className="grid gap-3 rounded-3xl bg-gradient-to-r from-primary to-obsidian p-5 text-white shadow-xl md:grid-cols-[1fr_auto_auto] md:items-center">
        <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Executive utilities</p><p className="mt-1 text-lg font-bold">Search institutional intelligence or generate a board-ready report.</p><p className="mt-1 text-[10px] text-white/50">Current filters are retained across connected President modules and report outputs.</p></div>
        <button onClick={() => navigate('president-search-filter')} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/15">Open Search Portal</button>
        <button onClick={() => navigate('president-export-reports')} className="rounded-2xl bg-golden px-5 py-3 text-xs font-bold text-primary hover:bg-golden/90">Generate Report</button>
      </section>

      {activeChart && <ChartModal title={chartMeta[activeChart].title} description={chartMeta[activeChart].description} chart={chartFor(activeChart, true)} dataSummary={chartSummaries[activeChart]} onClose={() => setActiveChart(null)} onExport={() => exportRows(chartMeta[activeChart].title.toLowerCase().replaceAll(' ', '-'), chartMeta[activeChart].rows)} insights={['All displayed values reflect the active academic year, campus, college, and program filters.', 'Select chart segments where available to apply cross-filtering without a page refresh.']} />}
    </div>
  );
}
