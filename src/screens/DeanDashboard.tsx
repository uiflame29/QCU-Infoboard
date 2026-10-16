import { useState, type ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartModal from '../components/ChartModal';
import ChartSelection from '../components/ChartSelection';
import { useApp } from '../context/AppContext';
import { COLLEGES, PROGRAMS, getFacultyData, getFirstGenData, getTotalStudents } from '../data/mockData';

const PROGRAM_PROFILE: Record<string, { enrolled: number; capacity: number; retention: number; graduates: number }> = {
  BSIT: { enrolled: 1800, capacity: 2000, retention: 91, graduates: 382 },
  BSIS: { enrolled: 900, capacity: 1050, retention: 88, graduates: 174 },
  BSCS: { enrolled: 800, capacity: 900, retention: 93, graduates: 168 },
  BSIE: { enrolled: 1200, capacity: 1350, retention: 90, graduates: 214 },
  BSECE: { enrolled: 820, capacity: 950, retention: 89, graduates: 148 },
  BSEntrep: { enrolled: 2000, capacity: 2300, retention: 89, graduates: 368 },
  BSA: { enrolled: 1200, capacity: 1400, retention: 92, graduates: 236 },
  BECEd: { enrolled: 1010, capacity: 1200, retention: 94, graduates: 194 },
};

const CAMPUS_COLORS = ['#200D2D', '#BB96E4', '#FFD066'];
const QUALIFICATION_COLORS = ['rgba(187,150,228,.45)', '#BB96E4', '#200D2D'];

type ChartId = 'capacity' | 'faculty' | 'retention' | 'first-gen';

const DASHBOARD_CHARTS: { id: ChartId; label: string }[] = [
  { id: 'capacity', label: 'Enrollment & Available Capacity' },
  { id: 'faculty', label: 'Full-Time vs. Part-Time Faculty' },
  { id: 'retention', label: 'First-Gen Retention Progression' },
  { id: 'first-gen', label: 'First-Gen Student Representation' },
];

const tooltipStyle = {
  borderRadius: 14,
  border: '1px solid rgba(187,150,228,.3)',
  boxShadow: '0 10px 30px rgba(32,13,45,.12)',
  fontSize: 11,
};

function DashboardIcon({ name }: { name: 'people' | 'faculty' | 'capacity' | 'retention' | 'report' | 'arrow' }) {
  const paths = {
    people: <><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3-7 7-7s7 3 7 7m1-10a3.5 3.5 0 010-7m1 10c2.7.5 4 2.4 4 5" /></>,
    faculty: <><path d="M3 9l9-5 9 5-9 5-9-5zM6 12v5c3 3 9 3 12 0v-5" /><path d="M21 9v6" /></>,
    capacity: <><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" /></>,
    retention: <><path d="M4 14l5-5 4 4 7-8" /><path d="M15 5h5v5" /></>,
    report: <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7z" /><path d="M14 3v4h4M8 12h8M8 16h6" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  };
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function KpiCard({ label, value, detail, icon, tone = 'light', onClick }: {
  label: string;
  value: string;
  detail: string;
  icon: 'people' | 'faculty' | 'capacity' | 'retention';
  tone?: 'light' | 'lilac' | 'gold' | 'dark';
  onClick: () => void;
}) {
  const styles = {
    light: 'bg-white border-lilac/20 text-primary',
    lilac: 'bg-gradient-to-br from-lilac to-lilac/70 border-lilac text-primary',
    gold: 'bg-gradient-to-br from-golden to-golden/70 border-golden text-primary',
    dark: 'bg-gradient-to-br from-primary to-obsidian border-primary text-white',
  };
  return (
    <button onClick={onClick} className={`relative overflow-hidden rounded-3xl border p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5 ${styles[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${tone === 'dark' ? 'text-white/55' : 'opacity-55'}`}>{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${tone === 'dark' ? 'bg-white/10 text-lilac' : 'bg-white/55 text-primary'}`}><DashboardIcon name={icon} /></span>
      </div>
      <p className={`mt-4 text-3xl font-bold tracking-tight ${tone === 'dark' ? 'text-golden' : ''}`}>{value}</p>
      <p className={`mt-1 text-[11px] ${tone === 'dark' ? 'text-white/55' : 'opacity-60'}`}>{detail}</p>
      <span className="pointer-events-none absolute -bottom-10 -right-8 h-28 w-28 rounded-full bg-white/10" />
    </button>
  );
}

function ChartCard({ chartId, eyebrow, title, action, children }: {
  chartId: ChartId;
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section data-chart-id={chartId} className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.16em] text-lilac">{eyebrow}</p>
          <p className="mt-1 text-base font-bold text-primary">{title}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ChartActions({ onView, onExport }: { onView: () => void; onExport: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button onClick={onView} className="rounded-xl border border-lilac/25 bg-lilac/10 px-3 py-1.5 text-[10px] font-semibold text-primary transition-colors hover:bg-lilac/20">
        View Chart
      </button>
      <button onClick={onExport} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-primary/90">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Export
      </button>
    </div>
  );
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

export default function DeanDashboard() {
  const { currentUser, filters, setFilters, navigate, showToast } = useApp();
  const collegeCode = currentUser?.college ?? 'CCS';
  const college = COLLEGES[collegeCode];
  const collegePrograms = PROGRAMS[collegeCode] ?? [];
  const visiblePrograms = filters.program === 'All' ? collegePrograms : collegePrograms.filter(program => program === filters.program);
  const scopedTotal = getTotalStudents({ ...filters, college: collegeCode, program: 'All' });
  const scale = scopedTotal / Math.max(college.students, 1);
  const programData = visiblePrograms.flatMap(program => {
    const profile = PROGRAM_PROFILE[program];
    if (!profile) return [];
    const enrolled = Math.round(profile.enrolled * scale);
    const capacity = Math.round(profile.capacity * Math.max(scale, 0.7));
    return [{
      program,
      enrolled,
      capacity,
      available: Math.max(capacity - enrolled, 0),
      utilization: Math.round((enrolled / Math.max(capacity, 1)) * 100),
      retention: profile.retention,
      graduates: Math.round(profile.graduates * scale),
    }];
  });
  const totalStudents = programData.reduce((sum, program) => sum + program.enrolled, 0);
  const totalCapacity = programData.reduce((sum, program) => sum + program.capacity, 0);
  const capacityRate = Math.round((totalStudents / Math.max(totalCapacity, 1)) * 100);
  const retentionRate = Math.round(programData.reduce((sum, program) => sum + program.retention * program.enrolled, 0) / Math.max(totalStudents, 1));
  const { fullTime, partTime } = getFacultyData({ ...filters, college: collegeCode });
  const totalFaculty = fullTime + partTime;
  const studentFacultyRatio = Math.round(totalStudents / Math.max(totalFaculty, 1));
  const firstGen = getFirstGenData({ ...filters, college: collegeCode });

  const campusBase = [
    { campus: 'San Bartolome', share: 0.62 },
    { campus: 'San Francisco', share: 0.22 },
    { campus: 'Batasan', share: 0.16 },
  ];
  const campusData = campusBase
    .filter(item => filters.campus === 'All' || filters.campus.startsWith(item.campus))
    .map(item => ({ name: item.campus, value: Math.round(totalStudents * (filters.campus === 'All' ? item.share : 1)) }));
  const progression = [
    { level: '1st Year', students: Math.round(totalStudents * 0.32) },
    { level: '2nd Year', students: Math.round(totalStudents * 0.27) },
    { level: '3rd Year', students: Math.round(totalStudents * 0.23) },
    { level: '4th Year', students: Math.round(totalStudents * 0.18) },
  ];
  const qualifications = visiblePrograms.map((program, index) => ({
    program,
    bachelors: Math.max(3, Math.round(totalFaculty * (0.14 + index * 0.015))),
    masters: Math.max(5, Math.round(totalFaculty * (0.22 + index * 0.01))),
    phd: Math.max(2, Math.round(totalFaculty * (0.08 + index * 0.01))),
  }));
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(() => new Set(DASHBOARD_CHARTS.map(chart => chart.id)));
  const [activeChart, setActiveChart] = useState<ChartId | null>(null);

  const chartRows: Record<ChartId, (string | number)[][]> = {
    capacity: [
      ['Program', 'Enrolled', 'Available Seats', 'Capacity', 'Utilization'],
      ...programData.map(item => [item.program, item.enrolled, item.available, item.capacity, `${item.utilization}%`]),
    ],
    faculty: [
      ['Employment Type', 'Faculty Members', 'Percentage'],
      ['Full-Time', fullTime, `${Math.round(fullTime / Math.max(totalFaculty, 1) * 100)}%`],
      ['Part-Time', partTime, `${Math.round(partTime / Math.max(totalFaculty, 1) * 100)}%`],
    ],
    retention: [
      ['Year Level', 'Students', 'Share'],
      ...progression.map(item => [item.level, item.students, `${Math.round(item.students / Math.max(totalStudents, 1) * 100)}%`]),
    ],
    'first-gen': [
      ['Student Group', 'Students', 'Percentage'],
      ['First-Generation', firstGen.firstGen, `${firstGen.pct}%`],
      ['Non-First-Generation', firstGen.nonFirstGen, `${100 - firstGen.pct}%`],
    ],
  };

  function exportCharts(ids: ChartId[]) {
    const rows = ids.flatMap((id, index) => [
      ...(index ? [[]] : []),
      [DASHBOARD_CHARTS.find(chart => chart.id === id)?.label ?? id],
      ...chartRows[id],
    ]);
    downloadCsv(`${collegeCode}-dean-dashboard-${ids.length === 1 ? ids[0] : 'all-visible'}.csv`, rows);
    if (ids.length === 1) {
      const chart = document.querySelector(`[data-chart-id="${ids[0]}"] svg.recharts-surface`);
      if (chart) {
        const image = new Blob(
          [new XMLSerializer().serializeToString(chart)],
          { type: 'image/svg+xml;charset=utf-8' },
        );
        const imageUrl = URL.createObjectURL(image);
        const imageAnchor = document.createElement('a');
        imageAnchor.href = imageUrl;
        imageAnchor.download = `${collegeCode}-dean-dashboard-${ids[0]}.svg`;
        imageAnchor.click();
        URL.revokeObjectURL(imageUrl);
      }
    }
    showToast({
      type: 'success',
      title: ids.length === 1 ? 'Chart exported' : 'Visible charts exported',
      body: `${ids.length} chart${ids.length === 1 ? '' : 's'} downloaded with the current filter scope.`,
    });
  }

  function chartActions(id: ChartId) {
    return <ChartActions onView={() => setActiveChart(id)} onExport={() => exportCharts([id])} />;
  }

  const facultyFullTimePct = Math.round(fullTime / Math.max(totalFaculty, 1) * 100);
  const modalCharts: Record<ChartId, {
    title: string;
    description: string;
    chart: ReactNode;
    legend: { label: string; color: string }[];
    insights: string[];
  }> = {
    capacity: {
      title: 'Enrollment & Available Capacity',
      description: `Program capacity distribution for ${collegeCode} under the active academic and campus filters.`,
      chart: (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={programData} margin={{ top: 15, right: 20, left: 5, bottom: 10 }}>
            <CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" />
            <XAxis dataKey="program" tick={{ fontSize: 11, fill: '#7B6891' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="enrolled" name="Enrolled" stackId="capacity" fill="#200D2D" />
            <Bar dataKey="available" name="Available seats" stackId="capacity" fill="#BB96E4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
      legend: [{ label: 'Enrolled', color: '#200D2D' }, { label: 'Available seats', color: '#BB96E4' }],
      insights: [
        `${totalStudents.toLocaleString()} students occupy ${capacityRate}% of the available program capacity.`,
        `${Math.max(totalCapacity - totalStudents, 0).toLocaleString()} seats remain across ${visiblePrograms.length} visible programs.`,
        `${programData.filter(item => item.utilization >= 90).length} program(s) require capacity monitoring at 90% utilization or above.`,
      ],
    },
    faculty: {
      title: 'Full-Time vs. Part-Time Faculty',
      description: `Employment status distribution for the ${collegeCode} teaching workforce.`,
      chart: (
        <div className="grid items-center gap-5 md:grid-cols-5">
          <div className="md:col-span-3">
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie data={[{ name: 'Full-Time', value: fullTime }, { name: 'Part-Time', value: partTime }]} dataKey="value" nameKey="name" innerRadius={82} outerRadius={125} paddingAngle={3}>
                  <Cell fill="#200D2D" /><Cell fill="#BB96E4" />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 md:col-span-2">
            <div className="rounded-2xl bg-primary/5 p-4"><p className="text-xs text-muted">Full-Time</p><p className="mt-1 text-2xl font-bold text-primary">{facultyFullTimePct}%</p><p className="text-[10px] text-muted">{fullTime} faculty members</p></div>
            <div className="rounded-2xl bg-lilac/10 p-4"><p className="text-xs text-muted">Part-Time</p><p className="mt-1 text-2xl font-bold text-primary">{100 - facultyFullTimePct}%</p><p className="text-[10px] text-muted">{partTime} faculty members</p></div>
          </div>
        </div>
      ),
      legend: [{ label: 'Full-Time', color: '#200D2D' }, { label: 'Part-Time', color: '#BB96E4' }],
      insights: [
        `${fullTime} of ${totalFaculty} faculty members are employed full-time.`,
        `Part-time faculty account for ${100 - facultyFullTimePct}% of the teaching workforce.`,
        `The current student-to-faculty allocation is ${studentFacultyRatio}:1.`,
      ],
    },
    retention: {
      title: 'First-Gen Year-Level Retention Progression',
      description: 'Current first-generation cohort volume by year level, showing progression through the academic pipeline.',
      chart: (
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={progression} margin={{ top: 15, right: 20, left: 5, bottom: 10 }}>
            <defs><linearGradient id="deanProgressionModal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#BB96E4" stopOpacity={0.75} /><stop offset="95%" stopColor="#BB96E4" stopOpacity={0.05} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" />
            <XAxis dataKey="level" tick={{ fontSize: 11, fill: '#7B6891' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="students" name="Students" stroke="#200D2D" strokeWidth={3} fill="url(#deanProgressionModal)" />
          </AreaChart>
        </ResponsiveContainer>
      ),
      legend: [{ label: 'Students in cohort', color: '#BB96E4' }],
      insights: [
        `${progression[0].students.toLocaleString()} students are represented at first-year level.`,
        `${progression[3].students.toLocaleString()} students are currently in the fourth-year completion stage.`,
        `The modeled retention rate across active programs is ${retentionRate}%.`,
      ],
    },
    'first-gen': {
      title: 'First-Gen Student Representation',
      description: `Share of first-generation and non-first-generation students within the active ${collegeCode} scope.`,
      chart: (
        <div className="grid items-center gap-5 md:grid-cols-5">
          <div className="md:col-span-3">
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie data={[{ name: 'First-Generation', value: firstGen.firstGen }, { name: 'Non-First-Generation', value: firstGen.nonFirstGen }]} dataKey="value" nameKey="name" innerRadius={82} outerRadius={125} paddingAngle={3}>
                  <Cell fill="#BB96E4" /><Cell fill="#FFDBED" />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 md:col-span-2">
            <div className="rounded-2xl bg-lilac/10 p-4"><p className="text-xs text-muted">First-Generation</p><p className="mt-1 text-2xl font-bold text-primary">{firstGen.pct}%</p><p className="text-[10px] text-muted">{firstGen.firstGen.toLocaleString()} students</p></div>
            <div className="rounded-2xl bg-blossom/40 p-4"><p className="text-xs text-muted">Non-First-Generation</p><p className="mt-1 text-2xl font-bold text-primary">{100 - firstGen.pct}%</p><p className="text-[10px] text-muted">{firstGen.nonFirstGen.toLocaleString()} students</p></div>
          </div>
        </div>
      ),
      legend: [{ label: 'First-Generation', color: '#BB96E4' }, { label: 'Non-First-Generation', color: '#FFDBED' }],
      insights: [
        `${firstGen.firstGen.toLocaleString()} first-generation students are included in the current scope.`,
        `First-generation students account for ${firstGen.pct}% of scoped enrollment.`,
        `${firstGen.nonFirstGen.toLocaleString()} students identify as non-first-generation.`,
      ],
    },
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-3xl border border-lilac/20 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-primary">Dashboard display controls</p>
          <p className="mt-1 text-[10px] text-muted">Choose the charts included in your live workspace and certified export.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ChartSelection
            charts={DASHBOARD_CHARTS}
            visible={visibleCharts}
            onChange={(id, checked) => setVisibleCharts(previous => {
              const next = new Set(previous);
              if (checked) next.add(id);
              else next.delete(id);
              return next;
            })}
          />
          <button
            onClick={() => exportCharts(DASHBOARD_CHARTS.filter(chart => visibleCharts.has(chart.id)).map(chart => chart.id))}
            disabled={visibleCharts.size === 0}
            className="flex items-center gap-2 rounded-xl bg-golden px-4 py-2 text-xs font-semibold text-primary transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
            <DashboardIcon name="report" />
            Export All
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Total Enrollees" value={totalStudents.toLocaleString()} detail={`${visiblePrograms.length} active program${visiblePrograms.length === 1 ? '' : 's'} in current scope`} icon="people" tone="gold" onClick={() => navigate('student-analytics')} />
        <KpiCard label="Active Faculty Members" value={totalFaculty.toLocaleString()} detail={`${fullTime} full-time · ${partTime} part-time`} icon="faculty" tone="light" onClick={() => navigate('faculty-analytics')} />
        <KpiCard label="Student–Faculty Ratio" value={`${studentFacultyRatio}:1`} detail="Average allocation per faculty member" icon="retention" tone="lilac" onClick={() => navigate('faculty-analytics')} />
        <KpiCard label="Program Capacity Utilization" value={`${capacityRate}%`} detail={`${Math.max(totalCapacity - totalStudents, 0).toLocaleString()} remaining seats`} icon="capacity" tone="dark" onClick={() => navigate('student-analytics')} />
      </div>

      {(visibleCharts.has('capacity') || visibleCharts.has('faculty')) && <div className="grid gap-4 xl:grid-cols-5">
        {visibleCharts.has('capacity') && <div className={visibleCharts.has('faculty') ? 'xl:col-span-3' : 'xl:col-span-5'}>
          <ChartCard
            chartId="capacity"
            eyebrow="Program portfolio"
            title="Enrollment & Available Capacity"
            action={chartActions('capacity')}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={programData} barGap={3} onClick={event => {
                const program = event?.activeLabel;
                if (typeof program === 'string') {
                  setFilters(previous => ({ ...previous, program }));
                  navigate('student-analytics');
                }
              }}>
                <CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" />
                <XAxis dataKey="program" tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} width={42} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(187,150,228,.06)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="enrolled" name="Enrolled" stackId="capacity" fill="#200D2D" radius={[0, 0, 4, 4]} cursor="pointer" />
                <Bar dataKey="available" name="Available seats" stackId="capacity" fill="#BB96E4" radius={[5, 5, 0, 0]} cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-[10px] text-muted">Select a program bar to synchronize the global program filter and all analytics.</p>
          </ChartCard>
        </div>}
        {visibleCharts.has('faculty') && <div className={visibleCharts.has('capacity') ? 'xl:col-span-2' : 'xl:col-span-5'}>
          <ChartCard chartId="faculty" eyebrow="Faculty analytics" title="Full-Time vs. Part-Time Faculty"
            action={chartActions('faculty')}>
            <div className="grid grid-cols-2 items-center gap-2">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie data={[{ name: 'Full-Time', value: fullTime }, { name: 'Part-Time', value: partTime }]} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76} paddingAngle={3} onClick={() => navigate('faculty-analytics')} cursor="pointer">
                    <Cell fill="#200D2D" /><Cell fill="#BB96E4" />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                <div className="rounded-2xl bg-primary/5 p-3"><p className="text-[10px] text-muted">Full-Time</p><p className="text-xl font-bold text-primary">{fullTime}</p></div>
                <div className="rounded-2xl bg-lilac/10 p-3"><p className="text-[10px] text-muted">Part-Time</p><p className="text-xl font-bold text-primary">{partTime}</p></div>
                <div className="rounded-2xl bg-golden/20 p-3"><p className="text-[10px] text-muted">Student–Faculty</p><p className="text-xl font-bold text-primary">{studentFacultyRatio}:1</p></div>
              </div>
            </div>
          </ChartCard>
        </div>}
      </div>}

      {(visibleCharts.has('retention') || visibleCharts.has('first-gen')) && <div className="grid gap-4 xl:grid-cols-2">
        {visibleCharts.has('retention') && <ChartCard chartId="retention" eyebrow="Cohort pipeline" title="First-Gen Year-Level Retention Progression"
          action={chartActions('retention')}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={progression} onClick={() => navigate('admission-analytics')} style={{ cursor: 'pointer' }}>
              <defs>
                <linearGradient id="deanProgression" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BB96E4" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#BB96E4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" />
              <XAxis dataKey="level" tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="students" name="Students" stroke="#200D2D" strokeWidth={3} fill="url(#deanProgression)" activeDot={{ r: 5, fill: '#FFD066', stroke: '#200D2D' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>}

        {visibleCharts.has('first-gen') && <ChartCard chartId="first-gen" eyebrow="First-generation analytics" title="First-Gen Student Representation"
          action={chartActions('first-gen')}>
          <div className="grid grid-cols-2 items-center">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={[{ name: 'First-Gen', value: firstGen.firstGen }, { name: 'Non-First-Gen', value: firstGen.nonFirstGen }]} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} onClick={() => navigate('admission-analytics')} cursor="pointer">
                  <Cell fill="#BB96E4" /><Cell fill="#FFDBED" />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div>
              <p className="text-4xl font-bold text-primary">{firstGen.pct}%</p>
              <p className="mt-1 text-xs font-semibold text-lilac">First-generation</p>
              <p className="mt-4 text-2xl font-bold text-primary">{firstGen.firstGen.toLocaleString()}</p>
              <p className="text-[10px] text-muted">of {totalStudents.toLocaleString()} scoped students</p>
            </div>
          </div>
        </ChartCard>}
      </div>}

      {visibleCharts.size === 0 && (
        <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-12 text-center">
          <p className="text-sm font-bold text-primary">All dashboard charts are hidden</p>
          <p className="mt-1 text-xs text-muted">Use Chart Selection above to restore one or more visualizations.</p>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {programData.map(program => (
          <button key={program.program} onClick={() => {
            setFilters(previous => ({ ...previous, program: program.program }));
            navigate('student-analytics');
          }}
            className="group rounded-3xl border border-lilac/20 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-lilac/45">
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-primary px-2.5 py-1 text-[10px] font-bold text-golden">{program.program}</span>
              <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${program.utilization >= 90 ? 'bg-obsidian/10 text-obsidian' : 'bg-coa/10 text-coa'}`}>{program.utilization >= 90 ? 'Capacity watch' : 'On track'}</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div><p className="text-lg font-bold text-primary">{program.enrolled.toLocaleString()}</p><p className="text-[9px] text-muted">Enrolled</p></div>
              <div><p className="text-lg font-bold text-primary">{program.retention}%</p><p className="text-[9px] text-muted">Retention</p></div>
              <div><p className="text-lg font-bold text-primary">{program.graduates}</p><p className="text-[9px] text-muted">Graduates</p></div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-lilac/10"><div className="h-full rounded-full bg-lilac transition-all" style={{ width: `${Math.min(program.utilization, 100)}%` }} /></div>
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-4 rounded-3xl border border-lilac/20 bg-gradient-to-r from-blossom/50 to-white p-5 sm:flex-row sm:items-center">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-golden"><DashboardIcon name="report" /></span>
        <div>
          <p className="text-sm font-bold text-primary">College planning brief is ready</p>
          <p className="mt-1 text-xs text-muted">Export a timestamped PDF or Excel report using the current academic year, campus, and program scope.</p>
        </div>
        <button onClick={() => {
          showToast({ type: 'info', title: 'Report scope prepared', body: `${collegeCode} filters were sent to the certified report engine.` });
          navigate('report-generation');
        }} className="sm:ml-auto rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5">
          Configure report
        </button>
      </section>

      {activeChart && (
        <ChartModal
          title={modalCharts[activeChart].title}
          description={modalCharts[activeChart].description}
          chart={modalCharts[activeChart].chart}
          legend={modalCharts[activeChart].legend}
          insights={modalCharts[activeChart].insights}
          onExport={() => exportCharts([activeChart])}
          onClose={() => setActiveChart(null)}
        />
      )}
    </div>
  );
}
