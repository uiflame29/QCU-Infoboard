import { useMemo, useState, type FormEvent } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/AnalyticsChartCard';
import AnalyticsDisplayControls from '../components/AnalyticsDisplayControls';
import { useApp } from '../context/AppContext';
import { COLLEGES, PROGRAMS, getTotalStudents } from '../data/mockData';

type Employment = 'Full-Time' | 'Part-Time';
type Attainment = "Bachelor's" | "Master's" | 'Ph.D.';
interface FacultyRecord {
  id: string;
  name: string;
  college: string;
  program: string;
  employment: Employment;
  attainment: Attainment;
  status: 'Active' | 'On Leave';
  dateHired: string;
  load: number;
  academicYear: string;
  semester: '1st Semester' | '2nd Semester' | 'Summer';
}

const NAMES = ['Dr. Alan Turing', 'Prof. Grace Hopper', 'Engr. Claude Shannon', 'Dr. Fe del Mundo', 'Prof. Gregorio Zara', 'Dr. Maria Orosa', 'Prof. Arturo Alcaraz', 'Dr. Angel Alcala'];
const ATTAINMENTS: Attainment[] = ["Bachelor's", "Master's", 'Ph.D.'];
const FACULTY_PROGRAM_COUNTS: Record<string, number> = {
  BSIT: 62,
  BSIS: 28,
  BSCS: 26,
  BSIE: 32,
  BSECE: 18,
  BSCE: 18,
  BSEntrep: 50,
  BSA: 32,
  BSMA: 18,
  BECEd: 58,
};
const tooltipStyle = { borderRadius: 14, border: '1px solid rgba(187,150,228,.3)', boxShadow: '0 10px 30px rgba(32,13,45,.12)', fontSize: 11 };
const FACULTY_CHARTS = [
  { id: 'program', label: 'Faculty by Program' },
  { id: 'gender', label: 'Faculty Gender' },
  { id: 'marital', label: 'Faculty Marital Status' },
  { id: 'employment', label: 'Faculty Employment Status' },
  { id: 'qualifications', label: 'Qualifications by Program' },
  { id: 'workload', label: 'Teaching Load Distribution' },
  { id: 'capacity', label: 'Faculty Capacity by College' },
];

function createFaculty(): FacultyRecord[] {
  const result: FacultyRecord[] = [];
  let index = 0;
  Object.entries(PROGRAMS).forEach(([college, programs]) => programs.forEach(program => {
    const programCount = FACULTY_PROGRAM_COUNTS[program] ?? 18;
    for (let sample = 0; sample < programCount; sample += 1) {
      const qualificationPosition = sample / programCount;
      result.push({
        id: `F-${2016 + (index % 9)}-${String(index + 1).padStart(2, '0')}`,
        name: NAMES[index % NAMES.length],
        college,
        program,
        employment: sample % (program === 'BECEd' || program === 'BSIT' ? 4 : 3) === 0 ? 'Part-Time' : 'Full-Time',
        attainment: qualificationPosition < 0.34 ? "Bachelor's" : qualificationPosition < 0.84 ? "Master's" : 'Ph.D.',
        status: 'Active',
        dateHired: `${String((index % 12) + 1).padStart(2, '0')}/15/${2016 + (index % 9)}`,
        load: [12, 15, 18, 21, 24][(sample + programs.indexOf(program)) % 5],
        academicYear: ['2024–2025', '2025–2026', '2026–2027'][index % 3],
        semester: (['1st Semester', '2nd Semester', 'Summer'] as const)[index % 3],
      });
      index += 1;
    }
  }));
  return result;
}

function ActionIcon({ name }: { name: 'view' | 'edit' | 'archive' | 'add' | 'close' }) {
  const paths = {
    view: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
    edit: <><path d="M4 20l4.5-1 10-10-3.5-3.5-10 10L4 20z" /><path d="M13.5 7l3.5 3.5" /></>,
    archive: <><path d="M4 7h16v13H4zM3 4h18v3H3z" /><path d="M9 11h6" /></>,
    add: <path d="M12 5v14M5 12h14" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
  };
  return <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function ActionButton({ label, icon, onClick, danger = false }: { label: string; icon: Parameters<typeof ActionIcon>[0]['name']; onClick: () => void; danger?: boolean }) {
  return <button type="button" title={label} aria-label={label} onClick={onClick} className={`group relative flex h-8 w-8 items-center justify-center rounded-xl ${danger ? 'bg-obsidian/10 text-obsidian hover:bg-obsidian/20' : 'bg-lilac/10 text-primary hover:bg-lilac/25'}`}><ActionIcon name={icon} /><span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-lg bg-primary px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100">{label}</span></button>;
}

export default function FacultyAnalytics() {
  const { filters, showModal, showToast } = useApp();
  const [faculty, setFaculty] = useState<FacultyRecord[]>(createFaculty);
  const [search, setSearch] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('All');
  const [attainmentFilter, setAttainmentFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [selected, setSelected] = useState<FacultyRecord | null>(null);
  const [editing, setEditing] = useState<FacultyRecord | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(() => new Set(FACULTY_CHARTS.map(chart => chart.id)));

  const scoped = useMemo(() => faculty.filter(record =>
    (filters.college === 'All' || record.college === filters.college)
    && (filters.program === 'All' || record.program === filters.program)
    && (filters.employmentStatus === 'All' || record.employment === filters.employmentStatus)
    && (filters.academicYear === 'All' || record.academicYear === filters.academicYear)
    && (filters.semester === 'All' || record.semester === filters.semester)
  ), [faculty, filters.academicYear, filters.college, filters.employmentStatus, filters.program, filters.semester]);
  const displayed = useMemo(() => scoped.filter(record =>
    (!search || `${record.id} ${record.name}`.toLowerCase().includes(search.toLowerCase()))
    && (employmentFilter === 'All' || record.employment === employmentFilter)
    && (attainmentFilter === 'All' || record.attainment === attainmentFilter)
    && (programFilter === 'All' || record.program === programFilter)
  ), [attainmentFilter, employmentFilter, programFilter, scoped, search]);
  const active = displayed.filter(record => record.status === 'Active');
  const fullTime = active.filter(record => record.employment === 'Full-Time').length;
  const partTime = active.filter(record => record.employment === 'Part-Time').length;
  const totalStudents = getTotalStudents(filters);
  const ratio = Math.round(totalStudents / Math.max(active.length, 1));
  const programs = [...new Set(scoped.map(record => record.program))];
  const qualificationData = programs.map(program => ({
    program,
    bachelors: displayed.filter(record => record.program === program && record.attainment === "Bachelor's").length,
    masters: displayed.filter(record => record.program === program && record.attainment === "Master's").length,
    phd: displayed.filter(record => record.program === program && record.attainment === 'Ph.D.').length,
  }));
  const programData = programs.map(program => ({ program, faculty: active.filter(record => record.program === program).length }));
  const genderData = [
    { gender: 'Female', faculty: Math.round(active.length * 0.58) },
    { gender: 'Male', faculty: active.length - Math.round(active.length * 0.58) },
  ];
  const maritalData = [
    { status: 'Single', faculty: Math.round(active.length * 0.39) },
    { status: 'Married', faculty: active.length - Math.round(active.length * 0.39) },
  ];
  const employmentData = [{ status: 'Full-Time', faculty: fullTime }, { status: 'Part-Time', faculty: partTime }];
  const capacityData = Object.entries(COLLEGES)
    .filter(([college]) => filters.college === 'All' || college === filters.college)
    .map(([college, values]) => ({ college, students: values.students, faculty: values.faculty, ratio: Math.round((values.students / values.faculty) * 10) / 10 }));
  const workloadData = programs.map(program => ({
    program,
    assignments: displayed.filter(record => record.program === program).length,
    teachingLoad: displayed.filter(record => record.program === program).reduce((sum, record) => sum + record.load, 0),
  }));
  const chartRows: Record<string, (string | number)[][]> = {
    program: [['Program', 'Faculty'], ...programData.map(row => [row.program, row.faculty])],
    gender: [['Gender', 'Faculty'], ...genderData.map(row => [row.gender, row.faculty])],
    marital: [['Marital Status', 'Faculty'], ...maritalData.map(row => [row.status, row.faculty])],
    employment: [['Employment Status', 'Faculty'], ...employmentData.map(row => [row.status, row.faculty])],
    qualifications: [["Program", "Bachelor's", "Master's", 'Ph.D.'], ...qualificationData.map(row => [row.program, row.bachelors, row.masters, row.phd])],
    workload: [['Program', 'Faculty Assignments', 'Teaching Load'], ...workloadData.map(row => [row.program, row.assignments, row.teachingLoad])],
    capacity: [['College', 'Students', 'Faculty', 'Ratio'], ...capacityData.map(row => [row.college, row.students, row.faculty, row.ratio])],
  };

  function clearFilters() {
    setSearch(''); setEmploymentFilter('All'); setAttainmentFilter('All'); setProgramFilter('All');
    showToast({ type: 'info', title: 'Faculty filters cleared' });
  }

  function openAdd() {
    const college = filters.college === 'All' ? 'CCS' : filters.college;
    const program = PROGRAMS[college]?.[0] ?? 'BSIT';
    setEditing({ id: `F-2026-${String(faculty.length + 1).padStart(2, '0')}`, name: '', college, program, employment: 'Full-Time', attainment: "Master's", status: 'Active', dateHired: '08/01/2026', load: 18, academicYear: filters.academicYear === 'All' ? '2026–2027' : filters.academicYear, semester: filters.semester === 'All' ? '1st Semester' : filters.semester as FacultyRecord['semester'] });
    setIsAdding(true);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    showModal({
      title: isAdding ? 'Add faculty record' : 'Confirm faculty update',
      message: `${isAdding ? 'Create' : 'Save changes to'} ${editing.name || editing.id}? This action will update faculty analytics immediately.`,
      confirmLabel: isAdding ? 'Add Faculty' : 'Save Changes',
      onConfirm: () => {
        setFaculty(previous => isAdding ? [editing, ...previous] : previous.map(record => record.id === editing.id ? editing : record));
        showToast({ type: 'success', title: isAdding ? 'Faculty member added' : 'Faculty record updated', body: `${editing.id} is now reflected in the directory and analytics.` });
        setEditing(null); setIsAdding(false);
      },
    });
  }

  function archive(record: FacultyRecord) {
    showModal({
      title: 'Archive faculty record',
      message: `Archive ${record.name} (${record.id})? This removes the record from active faculty analytics.`,
      confirmLabel: 'Archive',
      variant: 'danger',
      onConfirm: () => {
        setFaculty(previous => previous.filter(item => item.id !== record.id));
        showToast({ type: 'success', title: 'Faculty record archived', body: `${record.id} was removed from the active directory.` });
      },
    });
  }

  return (
    <div className="space-y-5">
      <AnalyticsDisplayControls
        charts={FACULTY_CHARTS}
        visible={visibleCharts}
        onChange={(id, checked) => setVisibleCharts(previous => {
          const next = new Set(previous);
          if (checked) next.add(id);
          else next.delete(id);
          return next;
        })}
        rows={chartRows}
        metrics={[
          ['Active Faculty', active.length],
          ['Full-Time Faculty', fullTime],
          ['Part-Time Faculty', partTime],
          ['Student-to-Faculty Ratio', `${ratio}:1`],
        ]}
        exportPrefix="faculty-analytics"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          ['Total Faculty Count', active.length.toString(), 'Active faculty in department'],
          ['Full-Time vs. Part-Time Ratio', `${Math.round((fullTime / Math.max(active.length, 1)) * 100)}% / ${Math.round((partTime / Math.max(active.length, 1)) * 100)}%`, `${fullTime} Full-Time · ${partTime} Part-Time`],
          ['Student-to-Faculty Ratio', `${ratio}:1`, 'Average allocation per staff'],
        ].map(([label, value, detail], index) => <div key={label} className={`rounded-3xl border p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5 ${index === 0 ? 'border-primary bg-primary text-white' : index === 1 ? 'border-lilac bg-lilac/70 text-primary' : 'border-golden bg-golden/70 text-primary'}`}><p className={`text-[9px] font-bold uppercase tracking-widest ${index === 0 ? 'text-lilac' : 'text-muted'}`}>{label}</p><p className={`mt-3 text-3xl font-bold ${index === 0 ? 'text-golden' : ''}`}>{value}</p><p className={`mt-1 text-[10px] ${index === 0 ? 'text-white/55' : 'text-muted'}`}>{detail}</p></div>)}
      </div>

      {(visibleCharts.has('program') || visibleCharts.has('gender') || visibleCharts.has('marital') || visibleCharts.has('employment')) && <div className="grid gap-4 lg:grid-cols-2">
        {visibleCharts.has('program') && <Card chartId="program" exportPrefix="faculty-analytics" rows={chartRows.program} eyebrow="Program allocation" title="Faculty by Program">
          <ResponsiveContainer width="100%" height={250}><BarChart data={programData} layout="vertical"><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" tick={{ fontSize: 9 }} /><YAxis dataKey="program" type="category" width={60} tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="faculty" fill="#BB96E4" radius={[0, 7, 7, 0]} onClick={entry => setProgramFilter(String((entry as unknown as { program: string }).program))} cursor="pointer" /></BarChart></ResponsiveContainer>
        </Card>}
        {visibleCharts.has('gender') && <Card chartId="gender" exportPrefix="faculty-analytics" rows={chartRows.gender} eyebrow="Faculty demographics" title="Faculty Gender">
          <ResponsiveContainer width="100%" height={230}><BarChart data={genderData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="gender" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="faculty" fill="#FFD066" radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer>
        </Card>}
        {visibleCharts.has('marital') && <Card chartId="marital" exportPrefix="faculty-analytics" rows={chartRows.marital} eyebrow="Faculty demographics" title="Faculty Marital Status">
          <ResponsiveContainer width="100%" height={230}><BarChart data={maritalData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="status" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="faculty" fill="#BB96E4" radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer>
        </Card>}
        {visibleCharts.has('employment') && <Card chartId="employment" exportPrefix="faculty-analytics" rows={chartRows.employment} eyebrow="Appointment profile" title="Faculty Employment Status" insights={[`${Math.round((fullTime / Math.max(active.length, 1)) * 100)}% of active faculty in the current scope are full-time.`]}>
          <ResponsiveContainer width="100%" height={230}><BarChart data={employmentData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="status" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="faculty" fill="#4C1413" radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer>
        </Card>}
      </div>}

      {(visibleCharts.has('qualifications') || visibleCharts.has('workload')) && <div className="grid gap-4 lg:grid-cols-2">
        {visibleCharts.has('qualifications') && <Card chartId="qualifications" exportPrefix="faculty-analytics" rows={chartRows.qualifications} eyebrow="Faculty readiness" title="Qualifications by Program">
          <ResponsiveContainer width="100%" height={260}><BarChart data={qualificationData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="program" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="bachelors" name="Bachelor's" stackId="degree" fill="rgba(187,150,228,.45)" /><Bar dataKey="masters" name="Master's" stackId="degree" fill="#BB96E4" /><Bar dataKey="phd" name="Ph.D." stackId="degree" fill="#200D2D" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer>
        </Card>}
        {visibleCharts.has('workload') && <Card chartId="workload" exportPrefix="faculty-analytics" rows={chartRows.workload} eyebrow="Faculty workload monitoring" title="Teaching Load Distribution Across Programs">
          <ResponsiveContainer width="100%" height={260}><BarChart data={workloadData} layout="vertical"><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" tick={{ fontSize: 9 }} /><YAxis dataKey="program" type="category" width={55} tick={{ fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="assignments" name="Faculty Assignments" fill="#BB96E4" radius={[0, 7, 7, 0]} onClick={(entry) => setProgramFilter(String((entry as unknown as Record<string, unknown>).program ?? ''))} cursor="pointer" /></BarChart></ResponsiveContainer>
        </Card>}
      </div>}

      {visibleCharts.has('capacity') && <Card chartId="capacity" exportPrefix="faculty-analytics" rows={chartRows.capacity} eyebrow="Capacity planning" title="Faculty Capacity by College">
        <ResponsiveContainer width="100%" height={280}><BarChart data={capacityData} layout="vertical" margin={{ right: 42 }}><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" domain={[0, 50]} tick={{ fontSize: 9 }} label={{ value: 'Students per Faculty', position: 'insideBottom', offset: -2, fontSize: 9, fill: '#7B6891' }} /><YAxis dataKey="college" type="category" width={52} tick={{ fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} formatter={(value, name, item) => [`${Number(value).toFixed(1)}:1 (${item.payload.students.toLocaleString()} students / ${item.payload.faculty} faculty)`, name]} /><Bar dataKey="ratio" name="Student-to-Faculty Ratio" fill="#BB96E4" radius={[0, 7, 7, 0]} label={{ position: 'right', fontSize: 10, fill: '#200D2D', formatter: value => `${Number(value)}:1` }} /></BarChart></ResponsiveContainer>
      </Card>}

      {visibleCharts.size === 0 && <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-12 text-center"><p className="text-sm font-bold text-primary">All faculty analytics charts are hidden</p><p className="mt-1 text-xs text-muted">Use Chart Selection to restore one or more visualizations.</p></section>}

    </div>
  );
}
