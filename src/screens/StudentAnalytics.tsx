import { useMemo, useState, type FormEvent } from 'react';
import {
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
import ChartCard from '../components/AnalyticsChartCard';
import AnalyticsDisplayControls from '../components/AnalyticsDisplayControls';
import QuezonCityChoropleth from '../components/QuezonCityChoropleth';
import { useApp } from '../context/AppContext';
import { PROGRAMS, getAgeData, getCapacityData, getGeoData } from '../data/mockData';

type EnrollmentStatus = 'Enrolled' | 'On Leave' | 'Dropped' | 'Graduated';
interface StudentRecord {
  id: string;
  name: string;
  college: string;
  program: string;
  yearLevel: string;
  gender: 'Female' | 'Male';
  academicYear: string;
  semester: '1st Semester' | '2nd Semester' | 'Summer';
  campus: string;
  status: EnrollmentStatus;
  firstGen: boolean;
  studentType: 'New' | 'Continuing' | 'Returning' | 'Transferee';
  age: number;
  grantType: 'QCYDO' | 'UNIFAST/TES' | 'CHED' | 'Academic' | 'LGU/Private';
  incomeBracket: '<₱15k' | '₱15k–₱30k' | '>₱30k';
}

const FIRST_NAMES = ['Maria', 'Juan', 'Angela', 'Marco', 'Sofia', 'Nathan', 'Camille', 'Joshua', 'Alyssa', 'Paolo', 'Bea', 'Luis'];
const LAST_NAMES = ['Santos', 'Dela Cruz', 'Reyes', 'Garcia', 'Mendoza', 'Bautista', 'Navarro', 'Ramos', 'Aquino', 'Torres'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const STATUSES: EnrollmentStatus[] = ['Enrolled', 'On Leave', 'Dropped', 'Graduated'];
const ACADEMIC_YEARS = ['2024–2025', '2025–2026', '2026–2027'];
const CAMPUSES = ['San Bartolome (Main)', 'San Francisco', 'Batasan Campus'];
const GRANT_TYPES = ['QCYDO', 'UNIFAST/TES', 'CHED', 'Academic', 'LGU/Private'] as const;
const INCOME_BRACKETS = ['<₱15k', '₱15k–₱30k', '>₱30k'] as const;
const COLORS = ['#200D2D', '#BB96E4', '#FFD066', '#4C1413', '#00875A', '#5B4B8A', '#E07A5F', '#3D8D9B', '#D96C9D', '#7E6B52'];
const PROGRAM_LABELS: Record<string, string> = {
  BSA: 'BS Accountancy',
  BSEntrep: 'BS Entrepreneurship',
  BSIT: 'BS Information Technology',
  BSIS: 'BS Information Systems',
  BSCS: 'BS Computer Science',
  BSECE: 'BS Electronics Engineering',
  BSIE: 'BS Industrial Engineering',
  BSMA: 'BS Management Accounting',
  BECEd: 'Early Childhood Education',
};
const tooltipStyle = { borderRadius: 14, border: '1px solid rgba(187,150,228,.3)', boxShadow: '0 10px 30px rgba(32,13,45,.12)', fontSize: 11 };
const STUDENT_CHARTS = [
  { id: 'gender', label: 'Gender Distribution' },
  { id: 'program', label: 'Program Share' },
  { id: 'year', label: 'Year-Level Distribution' },
  { id: 'status', label: 'Enrollment Status' },
  { id: 'student-type', label: 'Student Type Distribution' },
  { id: 'geography', label: 'Student Geographic Origin' },
  { id: 'age', label: 'Age Range & Civil Status' },
  { id: 'capacity', label: 'Program Capacity Utilization' },
  { id: 'performance', label: 'Academic Performance by Year Level' },
  { id: 'progression', label: 'Progression by Year Level' },
  { id: 'first-generation', label: 'First-Generation Monitoring' },
  { id: 'retention', label: 'First-Gen Retention Progression' },
];

function createStudents(): StudentRecord[] {
  const result: StudentRecord[] = [];
  let index = 0;
  Object.entries(PROGRAMS).forEach(([college, programs]) => {
    programs.forEach(program => {
      YEARS.forEach((yearLevel, yearIndex) => {
        for (let sample = 0; sample < 6; sample += 1) {
          result.push({
            id: `${26 - yearIndex}-${String(1001 + index).padStart(4, '0')}`,
            name: `${FIRST_NAMES[(index * 3) % FIRST_NAMES.length]} ${LAST_NAMES[(index * 7) % LAST_NAMES.length]}`,
            college,
            program,
            yearLevel,
            gender: index % 2 === 0 ? 'Female' : 'Male',
            academicYear: ACADEMIC_YEARS[index % ACADEMIC_YEARS.length],
            semester: (['1st Semester', '2nd Semester', 'Summer'] as const)[index % 3],
            campus: CAMPUSES[index % CAMPUSES.length],
            status: yearLevel === '4th Year' && sample === 0 ? 'Graduated' : STATUSES[index % STATUSES.length],
            firstGen: index % 5 < 2,
            studentType: (['New', 'Continuing', 'Returning', 'Transferee'] as const)[index % 4],
            age: 18 + (index % 12),
            grantType: GRANT_TYPES[index % GRANT_TYPES.length],
            incomeBracket: INCOME_BRACKETS[index % INCOME_BRACKETS.length],
          });
          index += 1;
        }
      });
    });
  });
  return result;
}

function Icon({ name }: { name: 'view' | 'edit' | 'status' | 'export' | 'report' | 'search' | 'close' }) {
  const paths = {
    view: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
    edit: <><path d="M4 20l4.5-1 10-10-3.5-3.5-10 10L4 20z" /><path d="M13.5 7l3.5 3.5" /></>,
    status: <><path d="M4 12a8 8 0 101.8-5.1" /><path d="M4 4v5h5" /></>,
    export: <><path d="M12 3v12m0 0-4-4m4 4 4-4" /><path d="M5 18v3h14v-3" /></>,
    report: <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7z" /><path d="M14 3v4h4M8 12h8M8 16h6" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
    close: <path d="M6 6l12 12M18 6L6 18" />,
  };
  return <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function IconButton({ label, icon, onClick, danger = false }: { label: string; icon: Parameters<typeof Icon>[0]['name']; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick}
      className={`group relative flex h-8 w-8 items-center justify-center rounded-xl ${danger ? 'bg-obsidian/8 text-obsidian hover:bg-obsidian/15' : 'bg-lilac/10 text-primary hover:bg-lilac/25'}`}>
      <Icon name={icon} />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 rounded-lg bg-primary px-2 py-1 text-[9px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{label}</span>
    </button>
  );
}

export default function StudentAnalytics() {
  const { filters, navigate, showModal, showToast } = useApp();
  const [students, setStudents] = useState<StudentRecord[]>(createStudents);
  const [search, setSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [firstGenOnly, setFirstGenOnly] = useState(false);
  const [selected, setSelected] = useState<StudentRecord | null>(null);
  const [editing, setEditing] = useState<StudentRecord | null>(null);
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(() => new Set(STUDENT_CHARTS.map(chart => chart.id)));

  const scoped = useMemo(() => students.filter(student =>
    (filters.college === 'All' || student.college === filters.college)
    && (filters.program === 'All' || student.program === filters.program)
    && (filters.yearLevel === 'All' || student.yearLevel === filters.yearLevel)
    && (filters.academicYear === 'All' || student.academicYear === filters.academicYear)
    && (filters.semester === 'All' || student.semester === filters.semester)
    && (filters.campus === 'All' || student.campus === filters.campus)
    && (filters.firstGenStatus === 'All' || (filters.firstGenStatus === 'First-Gen' ? student.firstGen : !student.firstGen))
    && (filters.studentType === 'All' || student.studentType === filters.studentType)
    && (filters.scholarship === 'All' || student.grantType === filters.scholarship)
    && ((filters.incomeBracket ?? 'All') === 'All' || student.incomeBracket === filters.incomeBracket)
    && (filters.ageRange === 'All'
      || (filters.ageRange === '17–20' && student.age <= 20)
      || (filters.ageRange === '21–24' && student.age >= 21 && student.age <= 24)
      || (filters.ageRange === '25+' && student.age >= 25))
    && (filters.studentStatus === 'All'
      || (filters.studentStatus === 'Graduating' && student.yearLevel === '4th Year')
      || (filters.studentStatus === 'Leave' && student.status === 'On Leave')
      || (filters.studentStatus === 'Withdrawn' && student.status === 'Dropped')
      || (['Regular', 'Irregular'].includes(filters.studentStatus) && student.status === 'Enrolled'))
  ), [filters, students]);

  const displayed = useMemo(() => scoped.filter(student =>
    (!search || `${student.id} ${student.name}`.toLowerCase().includes(search.toLowerCase()))
    && (programFilter === 'All' || student.program === programFilter)
    && (yearFilter === 'All' || student.yearLevel === yearFilter)
    && (statusFilter === 'All' || student.status === statusFilter)
    && (!firstGenOnly || student.firstGen)
  ), [firstGenOnly, programFilter, scoped, search, statusFilter, yearFilter]);

  const countBy = (key: keyof StudentRecord, value: string) => displayed.filter(student => student[key] === value).length;
  const genderData = ['Female', 'Male'].map(name => ({ name, value: countBy('gender', name) }));
  const programOptions = [...new Set(scoped.map(student => student.program))];
  const capacitySource = getCapacityData(filters);
  const programTotal = capacitySource.reduce((sum, row) => sum + row.enrolled, 0);
  const programData = capacitySource.map((row, index) => ({
    name: row.program,
    label: PROGRAM_LABELS[row.program] ?? row.program,
    value: row.enrolled,
    percentage: Math.round((row.enrolled / Math.max(programTotal, 1)) * 1000) / 10,
    color: COLORS[index % COLORS.length],
  }));
  const yearData = YEARS.map(name => ({ name, students: countBy('yearLevel', name) }));
  const statusData = STATUSES.map(name => ({ name, value: countBy('status', name) }));
  const studentTypeData = (['New', 'Continuing', 'Returning', 'Transferee'] as const).map(name => ({ name, value: countBy('studentType', name) }));
  const firstGenCount = displayed.filter(student => student.firstGen).length;
  const firstGenData = [{ name: 'First-Gen', value: firstGenCount }, { name: 'Non-First-Gen', value: displayed.length - firstGenCount }];
  const retentionData = YEARS.map((level, index) => ({ level, students: Math.round(displayed.length * [0.4, 0.3, 0.2, 0.13][index]) }));
  const geoData = getGeoData(filters);
  const ageData = getAgeData(filters);
  const capacityData = capacitySource.map(row => ({ ...row, utilization: Math.round((row.enrolled / Math.max(row.capacity, 1)) * 1000) / 10 }));
  const performanceData = YEARS.map((level, index) => ({ level, gwa: [2.34, 2.28, 2.21, 2.10][index] }));
  const progressionData = YEARS.slice(0, 3).map((level, index) => ({ level: `${level} → ${YEARS[index + 1]}`, progressed: [83, 82.9, 84.9][index], delayed: [17, 17.1, 15.1][index] }));
  const chartRows: Record<string, (string | number)[][]> = {
    gender: [['Gender', 'Students'], ...genderData.map(row => [row.name, row.value])],
    program: [['Program Code', 'Program Name', 'Students', 'Share'], ...programData.map(row => [row.name, row.label, row.value, `${row.percentage}%`])],
    year: [['Year Level', 'Students'], ...yearData.map(row => [row.name, row.students])],
    status: [['Enrollment Status', 'Students'], ...statusData.map(row => [row.name, row.value])],
    'student-type': [['Student Type', 'Students'], ...studentTypeData.map(row => [row.name, row.value])],
    geography: [['District', 'Students'], ...geoData.map(row => [row.district, row.students])],
    age: [['Age Range', 'Single', 'Married'], ...ageData.map(row => [row.age, row.single, row.married])],
    capacity: [['College', 'Program', 'Enrolled', 'Capacity', 'Utilization'], ...capacityData.map(row => [row.college, row.program, row.enrolled, row.capacity, `${row.utilization}%`])],
    performance: [['Year Level', 'Average GWA'], ...performanceData.map(row => [row.level, row.gwa])],
    progression: [['Transition', 'Progressed %', 'Delayed %'], ...progressionData.map(row => [row.level, row.progressed, row.delayed])],
    'first-generation': [['Student Group', 'Students'], ...firstGenData.map(row => [row.name, row.value])],
    retention: [['Year Level', 'Students'], ...retentionData.map(row => [row.level, row.students])],
  };

  function clearFilters() {
    setSearch('');
    setProgramFilter('All');
    setYearFilter('All');
    setStatusFilter('All');
    setFirstGenOnly(false);
    showToast({ type: 'info', title: 'Directory filters cleared' });
  }

  function exportData(format: 'PDF' | 'Excel') {
    if (format === 'PDF') {
      showToast({ type: 'success', title: 'PDF preview prepared', body: `${displayed.length} filtered student records are ready to print.` });
      window.print();
      return;
    }
    const rows = [['Student ID', 'Name', 'College', 'Program', 'Year Level', 'Gender', 'Academic Year', 'Status', 'Student Type', 'Age'], ...displayed.map(student => [student.id, student.name, student.college, student.program, student.yearLevel, student.gender, student.academicYear, student.status, student.studentType, student.age])];
    const csv = rows.map(row => row.map(value => `"${value}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'student-analytics-export.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast({ type: 'success', title: 'Excel-compatible export downloaded', body: `${displayed.length} filtered records exported.` });
  }

  function updateStatus(student: StudentRecord) {
    const nextStatus = STATUSES[(STATUSES.indexOf(student.status) + 1) % STATUSES.length];
    showModal({
      title: 'Update enrollment status',
      message: `Change ${student.name} from ${student.status} to ${nextStatus}?`,
      confirmLabel: 'Update Status',
      onConfirm: () => {
        setStudents(previous => previous.map(record => record.id === student.id ? { ...record, status: nextStatus } : record));
        showToast({ type: 'success', title: 'Enrollment status updated', body: `${student.id} is now ${nextStatus}.` });
      },
    });
  }

  function saveStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setStudents(previous => previous.map(student => student.id === editing.id ? editing : student));
    showToast({ type: 'success', title: 'Student record updated', body: `${editing.id} was saved successfully.` });
    setEditing(null);
  }

  return (
    <div className="space-y-5">
      <AnalyticsDisplayControls
        charts={STUDENT_CHARTS}
        visible={visibleCharts}
        onChange={(id, checked) => setVisibleCharts(previous => {
          const next = new Set(previous);
          if (checked) next.add(id);
          else next.delete(id);
          return next;
        })}
        rows={chartRows}
        metrics={[
          ['Students in Scope', displayed.length],
          ['First-Generation Students', firstGenCount],
          ['Active Enrollment', countBy('status', 'Enrolled')],
          ['Retention Health', '91%'],
        ]}
        exportPrefix="student-analytics"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ['Students in Scope', displayed.length.toLocaleString(), 'Current synchronized filter view'],
          ['First-Generation', firstGenCount.toLocaleString(), `${Math.round((firstGenCount / Math.max(displayed.length, 1)) * 100)}% of visible students`],
          ['Active Enrollment', countBy('status', 'Enrolled').toLocaleString(), 'Currently enrolled'],
          ['Retention Health', '91%', '+4 points since 2024–2025'],
        ].map(([label, value, detail], index) => (
          <button key={label} onClick={() => index === 1 && setFirstGenOnly(true)}
            className={`rounded-3xl border p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5 ${index === 0 ? 'border-primary bg-primary text-white' : index === 3 ? 'border-golden bg-golden/70 text-primary' : 'border-lilac/20 bg-white text-primary'}`}>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${index === 0 ? 'text-lilac' : 'text-muted'}`}>{label}</p>
            <p className={`mt-3 text-3xl font-bold ${index === 0 ? 'text-golden' : ''}`}>{value}</p>
            <p className={`mt-1 text-[10px] ${index === 0 ? 'text-white/55' : 'text-muted'}`}>{detail}</p>
          </button>
        ))}
      </div>

      {(visibleCharts.has('gender') || visibleCharts.has('age')) && <div className="grid gap-4 lg:grid-cols-2">
        {visibleCharts.has('gender') && <ChartCard chartId="gender" exportPrefix="student-analytics" rows={chartRows.gender} eyebrow="Demographics" title="Gender Distribution">
          <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={genderData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86} paddingAngle={2} labelLine={{ stroke: '#BB96E4', strokeWidth: 1 }} label={({ name, value, percent }) => `${name}: ${Number(value).toLocaleString()} (${((percent ?? 0) * 100).toFixed(0)}%)`}>{genderData.map((entry, index) => <Cell key={entry.name} fill={[COLORS[1], COLORS[0]][index]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer>
        </ChartCard>}
        {visibleCharts.has('age') && <ChartCard chartId="age" exportPrefix="student-analytics" rows={chartRows.age} eyebrow="Demographic context" title="Age Range & Civil Status">
          <ResponsiveContainer width="100%" height={260}><BarChart data={ageData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="age" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="single" name="Single" stackId="civil" fill="#BB96E4" /><Bar dataKey="married" name="Married" stackId="civil" fill="#FFD066" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>}
      </div>}

      {(visibleCharts.has('program') || visibleCharts.has('year')) && <div className="grid items-stretch gap-4 lg:grid-cols-2">
        {visibleCharts.has('program') && <ChartCard chartId="program" exportPrefix="student-analytics" rows={chartRows.program} eyebrow="Academic portfolio" title="Program Share" description="Enrollment count and percentage share for every program in the active college and filter scope." insights={[`${programData[0]?.label ?? 'The leading program'} has the largest enrollment allocation in the active scope.`]}>
          <ResponsiveContainer width="100%" height={Math.max(300, programData.length * 38)}><BarChart data={programData} layout="vertical" margin={{ left: 12, right: 48 }}><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" tick={{ fontSize: 9 }} /><YAxis dataKey="label" type="category" width={150} tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} formatter={(value, name, item) => [`${Number(value).toLocaleString()} (${item.payload.percentage}%)`, name]} /><Bar dataKey="value" name="Enrollment" radius={[0, 7, 7, 0]} label={{ position: 'right', fontSize: 9, fill: '#200D2D' }} onClick={(entry) => setProgramFilter(String((entry as unknown as Record<string, unknown>).name ?? ''))} cursor="pointer">{programData.map(entry => <Cell key={entry.name} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer>
        </ChartCard>}
        {visibleCharts.has('year') && <ChartCard chartId="year" exportPrefix="student-analytics" rows={chartRows.year} eyebrow="Cohort composition" title="Year-Level Distribution">
          <ResponsiveContainer width="100%" height={300}><BarChart data={yearData} layout="vertical"><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" tick={{ fontSize: 9 }} /><YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="students" fill="#BB96E4" radius={[0, 7, 7, 0]} onClick={(entry) => setYearFilter(String((entry as unknown as Record<string, unknown>).name ?? ''))} cursor="pointer" /></BarChart></ResponsiveContainer>
        </ChartCard>}
      </div>}

      {(visibleCharts.has('status') || visibleCharts.has('student-type')) && <div className="grid gap-4 lg:grid-cols-2">
        {visibleCharts.has('status') && <ChartCard chartId="status" exportPrefix="student-analytics" rows={chartRows.status} eyebrow="Registrar pulse" title="Enrollment Status">
          <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" outerRadius={82} onClick={(entry) => setStatusFilter(String((entry as unknown as Record<string, unknown>).name ?? ''))}>{statusData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index]} cursor="pointer" />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer>
        </ChartCard>}
        {visibleCharts.has('student-type') && <ChartCard chartId="student-type" exportPrefix="student-analytics" rows={chartRows['student-type']} eyebrow="Enrollment composition" title="Student Type Distribution">
          <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={studentTypeData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80}>{studentTypeData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer>
        </ChartCard>}
      </div>}

      {(visibleCharts.has('performance') || visibleCharts.has('progression')) && <div className="grid gap-4 lg:grid-cols-2">
        {visibleCharts.has('performance') && <ChartCard chartId="performance" exportPrefix="student-analytics" rows={chartRows.performance} eyebrow="Academic outcomes" title="Academic Performance by Year Level" insights={['Lower GWA values indicate stronger academic performance.']}>
          <ResponsiveContainer width="100%" height={250}><BarChart data={performanceData} margin={{ top: 18 }}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="level" tick={{ fontSize: 10 }} /><YAxis domain={[0, 3]} tickCount={7} tick={{ fontSize: 9 }} label={{ value: 'Average GWA', angle: -90, position: 'insideLeft', fontSize: 9, fill: '#7B6891' }} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [Number(value).toFixed(2), 'Average GWA']} /><Bar dataKey="gwa" name="Average GWA" fill="#200D2D" radius={[7, 7, 0, 0]} label={{ position: 'top', fontSize: 10, fill: '#200D2D' }} /></BarChart></ResponsiveContainer>
        </ChartCard>}
        {visibleCharts.has('progression') && <ChartCard chartId="progression" exportPrefix="student-analytics" rows={chartRows.progression} eyebrow="Cohort movement" title="Progression by Year Level">
          <ResponsiveContainer width="100%" height={250}><BarChart data={progressionData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="level" tick={{ fontSize: 9 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="progressed" stackId="progress" fill="#BB96E4" /><Bar dataKey="delayed" stackId="progress" fill="#FFDBED" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>}
      </div>}

      {visibleCharts.has('geography') && <div className="mx-auto w-full">
        <ChartCard
          chartId="geography"
          exportPrefix="student-analytics"
          rows={chartRows.geography}
          eyebrow="Residency intelligence"
          title="Student Geographic Origin"
          description="Quezon City district enrollment concentration using the official legislative district boundary geometry.">
          <QuezonCityChoropleth data={geoData} />
        </ChartCard>
      </div>}

      {visibleCharts.has('capacity') && <ChartCard chartId="capacity" exportPrefix="student-analytics" rows={chartRows.capacity} eyebrow="Capacity planning" title="Program Capacity Utilization">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {capacityData.map(row => (
            <button key={row.program} onClick={() => setProgramFilter(row.program)} className="rounded-2xl border border-lilac/15 bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:border-lilac/40 hover:bg-white">
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold text-primary">{row.program}</p><p className="text-[9px] text-muted">{row.college} · {row.enrolled.toLocaleString()} / {row.capacity.toLocaleString()}</p></div><strong className={`text-sm ${row.utilization >= 95 ? 'text-obsidian' : 'text-primary'}`}>{row.utilization}%</strong></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-lilac/10"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(row.utilization, 100)}%`, background: row.utilization >= 95 ? '#4C1413' : row.color }} /></div>
            </button>
          ))}
        </div>
      </ChartCard>}

      {(visibleCharts.has('first-generation') || visibleCharts.has('retention')) && <div className="grid gap-4 lg:grid-cols-2">
        {visibleCharts.has('first-generation') && <ChartCard
          chartId="first-generation"
          exportPrefix="student-analytics"
          rows={chartRows['first-generation']}
          eyebrow="Social mobility"
          title="First-Generation Monitoring"
          insights={[`${firstGenCount.toLocaleString()} students in the current scope are first-generation.`]}>
          <div className="grid grid-cols-2 items-center">
            <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={firstGenData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78}><Cell fill="#BB96E4" /><Cell fill="#FFDBED" /></Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer>
            <div><p className="text-4xl font-bold text-primary">{Math.round((firstGenCount / Math.max(displayed.length, 1)) * 100)}%</p><p className="text-xs font-semibold text-lilac">First-generation</p><p className="mt-4 text-xl font-bold text-primary">{firstGenCount.toLocaleString()}</p><p className="text-[10px] text-muted">students in active scope</p></div>
          </div>
        </ChartCard>}
        {visibleCharts.has('retention') && <ChartCard chartId="retention" exportPrefix="student-analytics" rows={chartRows.retention} eyebrow="Retention pipeline" title="First-Gen Year-Level Retention Progression">
          <ResponsiveContainer width="100%" height={220}><BarChart data={retentionData} layout="vertical"><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" tick={{ fontSize: 9 }} /><YAxis dataKey="level" type="category" width={70} tick={{ fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="students" fill="#200D2D" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>}
      </div>}

      {visibleCharts.size === 0 && <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-12 text-center"><p className="text-sm font-bold text-primary">All student analytics charts are hidden</p><p className="mt-1 text-xs text-muted">Use Chart Selection to restore one or more visualizations.</p></section>}

    </div>
  );
}
