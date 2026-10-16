import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getCollegeDonutData, getFacultyData, getTotalStudents } from '../data/mockData';
import AnalyticsChartCard from '../components/AnalyticsChartCard';
import AnalyticsDisplayControls from '../components/AnalyticsDisplayControls';
import { useState } from 'react';

const tooltipStyle = {
  borderRadius: 14,
  border: '1px solid rgba(187,150,228,.3)',
  boxShadow: '0 12px 32px rgba(32,13,45,.14)',
  fontSize: 11,
};

function Icon({ type }: { type: 'student' | 'faculty' | 'applicant' | 'rate' }) {
  const paths = {
    student: <><path d="M4 19c0-3.2 2.8-5.5 6-5.5s6 2.3 6 5.5" /><circle cx="10" cy="7.5" r="3.5" /><path d="M17 11a3 3 0 000-6M18 14c2.4.7 3.5 2.4 3.5 5" /></>,
    faculty: <><path d="M3 9l9-5 9 5-9 5-9-5zM6 12v5c3.5 2.8 8.5 2.8 12 0v-5M21 10v6" /></>,
    applicant: <><path d="M6 3h9l4 4v14H6zM15 3v5h4M9 13h7M9 17h5" /></>,
    rate: <><circle cx="12" cy="12" r="9" /><path d="M8 15l3-3 2 2 4-5" /></>,
  };
  return <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

function KpiCard({ label, value, detail, tone, icon }: {
  label: string; value: string; detail: string; tone: 'dark' | 'gold' | 'lilac' | 'light'; icon: React.ReactNode;
}) {
  const tones = {
    dark: 'border-primary bg-primary text-white',
    gold: 'border-golden bg-gradient-to-br from-golden to-[#ffc04a] text-primary',
    lilac: 'border-lilac bg-gradient-to-br from-lilac to-[#a476d7] text-primary',
    light: 'border-lilac/20 bg-white text-primary',
  };
  return (
    <button className={`group relative overflow-hidden rounded-3xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${tones[tone]}`}>
      <span className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-2xl ${tone === 'dark' ? 'bg-white/10 text-lilac' : 'bg-white/35 text-primary'}`}>{icon}</span>
      <p className={`pr-10 text-[9px] font-bold uppercase tracking-widest ${tone === 'dark' ? 'text-white/55' : 'text-primary/55'}`}>{label}</p>
      <p className={`mt-4 text-2xl font-bold ${tone === 'dark' ? 'text-golden' : ''}`}>{value}</p>
      <p className={`mt-1 text-[10px] ${tone === 'dark' ? 'text-white/50' : 'text-primary/55'}`}>{detail}</p>
    </button>
  );
}

const DASHBOARD_CHARTS = [
  { id: 'college', label: 'Enrollment by College' },
  { id: 'year-level', label: 'Students by Year Level' },
  { id: 'enrollment-trend', label: 'Current vs Previous Enrollment' },
  { id: 'admission-funnel', label: 'Applicant-to-Enrollment Funnel' },
];

export default function RegistrarDashboard() {
  const { filters, setFilters, navigate } = useApp();
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(() => new Set(DASHBOARD_CHARTS.map(chart => chart.id)));
  const dashboardFilters = {
    ...filters,
    yearLevel: 'All',
    studentStatus: 'All',
    studentType: 'All',
    ageRange: 'All',
    firstGenStatus: 'All',
    employmentStatus: 'All',
    scholarship: 'All',
    incomeBracket: 'All',
  };
  const students = getTotalStudents(dashboardFilters);
  const facultyData = getFacultyData(dashboardFilters);
  const faculty = facultyData.fullTime + facultyData.partTime;
  const ratio = (students / Math.max(faculty, 1)).toFixed(1);
  const scale = students / 12450;
  const applicants = Math.round(5600 * scale);
  const enrolled = Math.round(3420 * scale);
  const retentionByCollege: Record<string, number> = { All: 89.4, CCS: 91.2, COE: 88, COB: 87.5, COA: 89.3, COED: 92 };
  const progressionByCollege: Record<string, number> = { All: 84.7, CCS: 87.1, COE: 84.2, COB: 82.9, COA: 85, COED: 88.4 };
  const gwaByCollege: Record<string, number> = { All: 2.24, CCS: 2.12, COE: 2.28, COB: 2.31, COA: 2.19, COED: 2.05 };
  const retention = retentionByCollege[filters.college] ?? 89.4;
  const progression = progressionByCollege[filters.college] ?? 84.7;
  const gwa = gwaByCollege[filters.college] ?? 2.24;
  const colleges = getCollegeDonutData(dashboardFilters).filter(item => item.value > 0);
  const yearData = [
    { year: '1st', students: Math.round(3350 * scale) },
    { year: '2nd', students: Math.round(3150 * scale) },
    { year: '3rd', students: Math.round(3050 * scale) },
    { year: '4th', students: Math.round(2900 * scale) },
  ];
  const trendData = [
    { period: 'AY25 S1', current: Math.round(5980 * scale), previous: Math.round(5640 * scale) },
    { period: 'AY25 S2', current: Math.round(6470 * scale), previous: Math.round(5980 * scale) },
    { period: 'AY26 S1', current: Math.round(6020 * scale), previous: Math.round(5810 * scale) },
    { period: 'AY26 S2', current: Math.round(6430 * scale), previous: Math.round(6120 * scale) },
  ];
  const funnel = [
    { stage: 'Applicants', value: applicants, color: '#200D2D' },
    { stage: 'Qualified', value: Math.round(4600 * scale), color: '#6f458f' },
    { stage: 'Accepted', value: Math.round(4050 * scale), color: '#BB96E4' },
    { stage: 'Confirmed', value: Math.round(3750 * scale), color: '#FFD066' },
    { stage: 'Enrolled', value: enrolled, color: '#4C1413' },
  ];
  const chartRows: Record<string, (string | number)[][]> = {
    college: [['College', 'Students'], ...colleges.map(item => [item.name, item.value])],
    'year-level': [['Year Level', 'Students'], ...yearData.map(item => [item.year, item.students])],
    'enrollment-trend': [['Period', 'Current', 'Previous'], ...trendData.map(item => [item.period, item.current, item.previous])],
    'admission-funnel': [['Stage', 'Applicants'], ...funnel.map(item => [item.stage, item.value])],
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-primary via-[#351442] to-obsidian p-5 text-white shadow-lg md:flex-row md:items-center">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">Live institutional pulse</p>
          <p className="mt-2 text-xl font-bold">Academic Operations at a Glance</p>
          <p className="mt-1 text-xs text-white/55">All metrics share the active filter scope and update immediately.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('global-search')} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/15">Search records</button>
          <button onClick={() => navigate('report-generation')} className="rounded-xl bg-lilac px-4 py-2 text-xs font-bold text-primary hover:bg-blossom">Generate report</button>
        </div>
      </div>

      <section className="space-y-3">
        <div>
          <p className="text-sm font-bold text-primary">Registrar / University Overview</p>
          <p className="mt-1 text-[10px] text-muted">Enrollment health, academic outcomes, and institutional capacity in the active scope.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <KpiCard label="Total Students" value={students.toLocaleString()} detail="Selected academic population" tone="dark" icon={<Icon type="student" />} />
          <KpiCard label="Total Faculty" value={faculty.toLocaleString()} detail={`${facultyData.fullTime} full-time · ${facultyData.partTime} part-time`} tone="lilac" icon={<Icon type="faculty" />} />
          <KpiCard label="Retention Rate" value={`${retention.toFixed(1)}%`} detail="Recalculated for active scope" tone="light" icon={<Icon type="rate" />} />
          <KpiCard label="Progression Rate" value={`${progression.toFixed(1)}%`} detail="Advancing to next year level" tone="light" icon={<Icon type="rate" />} />
          <KpiCard label="Average Academic Performance" value={`${gwa.toFixed(2)} GWA`} detail="Filtered student population" tone="light" icon={<Icon type="rate" />} />
          <KpiCard label="Student-to-Faculty Ratio" value={`${ratio} : 1`} detail="Calculated from active scope" tone="light" icon={<Icon type="faculty" />} />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <p className="text-sm font-bold text-primary">Admission Overview</p>
          <p className="mt-1 text-[10px] text-muted">A concise view of current applicant demand and conversion into enrolled students.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <KpiCard label="Total Applicants" value={applicants.toLocaleString()} detail="Current admission period" tone="gold" icon={<Icon type="applicant" />} />
          <KpiCard label="Total Enrolled" value={enrolled.toLocaleString()} detail="Applicants converted to students" tone="light" icon={<Icon type="student" />} />
          <KpiCard label="Admission Conversion" value={`${((enrolled / Math.max(applicants, 1)) * 100).toFixed(1)}%`} detail="Enrolled ÷ total applicants" tone="light" icon={<Icon type="rate" />} />
        </div>
      </section>

      <AnalyticsDisplayControls
        charts={DASHBOARD_CHARTS}
        visible={visibleCharts}
        onChange={(id, checked) => setVisibleCharts(previous => {
          const next = new Set(previous);
          if (checked) next.add(id);
          else next.delete(id);
          return next;
        })}
        rows={chartRows}
        metrics={[
          ['Total Students', students],
          ['Active Faculty', faculty],
          ['Total Applicants', applicants],
          ['Applicants Enrolled', enrolled],
          ['Retention Rate', `${retention.toFixed(1)}%`],
          ['Progression Rate', `${progression.toFixed(1)}%`],
          ['Average GWA', gwa.toFixed(2)],
          ['Student-to-Faculty Ratio', `${ratio}:1`],
        ]}
        exportPrefix="registrar-dashboard"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {visibleCharts.has('college') && <AnalyticsChartCard chartId="college" exportPrefix="registrar-dashboard" rows={chartRows.college} eyebrow="Enrollment overview" title="Enrollment by College" insights={['Select a college segment to preserve it as the active drill-down scope.']} action={<button onClick={() => navigate('student-analytics')} className="rounded-xl bg-lilac/15 px-3 py-1.5 text-[10px] font-semibold text-primary">Explore</button>}>
          <div className="grid grid-cols-[minmax(0,1fr)_9rem] items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart><Pie data={colleges} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} onClick={entry => setFilters(previous => ({ ...previous, college: String(entry.name), program: 'All' }))}>{colleges.map(item => <Cell key={item.name} fill={item.color} cursor="pointer" />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">{colleges.map(item => <button key={item.name} onClick={() => setFilters(previous => ({ ...previous, college: item.name, program: 'All' }))} className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-xs hover:bg-surface"><span className="flex items-center gap-2 text-muted"><span className="h-2 w-2 rounded-full" style={{ background: item.color }} />{item.name}</span><strong className="text-primary">{item.value.toLocaleString()}</strong></button>)}</div>
          </div>
        </AnalyticsChartCard>}
        {visibleCharts.has('year-level') && <AnalyticsChartCard chartId="year-level" exportPrefix="registrar-dashboard" rows={chartRows['year-level']} eyebrow="Cohort composition" title="Students by Year Level">
          <ResponsiveContainer width="100%" height={240}><BarChart data={yearData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.16)" /><XAxis dataKey="year" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="students" fill="#BB96E4" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
        </AnalyticsChartCard>}
        {visibleCharts.has('enrollment-trend') && <AnalyticsChartCard chartId="enrollment-trend" exportPrefix="registrar-dashboard" rows={chartRows['enrollment-trend']} eyebrow="Academic trend" title="Current vs Previous Enrollment">
          <ResponsiveContainer width="100%" height={240}><LineChart data={trendData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.16)" /><XAxis dataKey="period" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Line type="monotone" dataKey="current" stroke="#200D2D" strokeWidth={3} dot={{ r: 3 }} /><Line type="monotone" dataKey="previous" stroke="#BB96E4" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer>
        </AnalyticsChartCard>}
        {visibleCharts.has('admission-funnel') && <AnalyticsChartCard chartId="admission-funnel" exportPrefix="registrar-dashboard" rows={chartRows['admission-funnel']} eyebrow="Admission pipeline" title="Applicant-to-Enrollment Funnel" insights={[`Overall conversion is ${((enrolled / Math.max(applicants, 1)) * 100).toFixed(1)}% of applicants.`]} action={<button onClick={() => navigate('admission-analytics')} className="rounded-xl bg-golden/30 px-3 py-1.5 text-[10px] font-semibold text-primary">Pipeline</button>}>
          <div className="space-y-3 pt-2">{funnel.map((item, index) => <button key={item.stage} onClick={() => navigate('admission-analytics')} className="flex w-full items-center gap-3 text-left"><span className="w-20 text-[10px] font-semibold text-muted">{item.stage}</span><span className="h-8 rounded-lg transition-all hover:brightness-110" style={{ width: `${Math.max(26, 78 - index * 10)}%`, background: item.color }} /><strong className="ml-auto text-xs text-primary">{item.value.toLocaleString()}</strong></button>)}</div>
          <p className="mt-4 text-[10px] text-muted">Overall conversion: <strong className="text-primary">{((enrolled / Math.max(applicants, 1)) * 100).toFixed(1)}%</strong> of total applicants.</p>
        </AnalyticsChartCard>}
      </div>
    </div>
  );
}
