import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../../context/AppContext';

const TABS = ['Students', 'College', 'Programs', 'Department', 'Faculty', 'Employee', 'Academic Year'] as const;
type Tab = typeof TABS[number];
type StudentStatus = 'Unenrolled' | 'Enrolled' | 'Graduating' | 'Drop-out';
type Gender = 'Female' | 'Male';

interface Student {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  campus: string;
  college: string;
  program: string;
  yearLevel: string;
  status: StudentStatus;
  academicYear: string;
  semester: string;
  gender: Gender;
  archived: boolean;
}

type StudentDraft = Omit<Student, 'archived'>;

const ACADEMIC_YEARS = ['2024-2025', '2025-2026', '2026-2027'];
const SEMESTERS = ['1st Semester', '2nd Semester'];
const CAMPUSES = ['San Bartolome', 'San Francisco', 'Batasan'];
const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const STATUSES: StudentStatus[] = ['Unenrolled', 'Enrolled', 'Graduating', 'Drop-out'];
const GENDERS: Gender[] = ['Female', 'Male'];
const PROGRAMS = [
  { name: 'BS Information Technology (BSIT)', code: 'BSIT', college: 'CCS' },
  { name: 'BS Information Systems (BSIS)', code: 'BSIS', college: 'CCS' },
  { name: 'BS Computer Science (BSCS)', code: 'BSCS', college: 'CCS' },
  { name: 'BS Entrepreneurship (BSE)', code: 'BSE', college: 'COB' },
  { name: 'Master of Science in Entrepreneurship (MSENT)', code: 'MSENT', college: 'COB' },
  { name: 'Bachelor of Science in Accountancy', code: 'BSA', college: 'COA' },
  { name: 'Bachelor of Science in Management Accounting', code: 'BSMA', college: 'COA' },
  { name: 'BS Electrical Engineering (BSEE)', code: 'BSEE', college: 'COE' },
  { name: 'BS Industrial Engineering (BSIE)', code: 'BSIE', college: 'COE' },
  { name: 'BECED – Bachelor of Early Childhood Education', code: 'BECED', college: 'COED' },
] as const;
const COLLEGES = ['CCS', 'COB', 'COA', 'COE', 'COED'] as const;
const COLLEGE_LABELS: Record<(typeof COLLEGES)[number], string> = {
  CCS: 'CCS (College of Computer Studies)',
  COB: 'COB (College of Business)',
  COA: 'COA (College of Accountancy)',
  COE: 'COE (College of Engineering)',
  COED: 'COED (College of Education)',
};

const FIRST_NAMES = ['Angela', 'Marco', 'Mika', 'Janelle', 'Paolo', 'Sofia', 'Nathan', 'Bea', 'Luis', 'Camille', 'Joshua', 'Alyssa'];
const LAST_NAMES = ['Santos', 'Reyes', 'Dela Cruz', 'Garcia', 'Mendoza', 'Bautista', 'Navarro', 'Ramos', 'Aquino', 'Castillo', 'Flores', 'Torres'];
const MIDDLE_NAMES = ['M.', 'L.', 'P.', 'A.', 'R.', 'S.', 'D.', 'C.'];
const COLLEGE_COLORS = ['#333333', '#FF6B00', '#FFC700', '#00875A', '#0052CC'];
const tooltipStyle = { borderRadius: 12, border: '1px solid rgba(187,150,228,.25)', fontSize: 11 };

function createStudents(): Student[] {
  const records: Student[] = [];
  let index = 0;
  for (const academicYear of ACADEMIC_YEARS) {
    for (const semester of SEMESTERS) {
      for (const campus of CAMPUSES) {
        for (const program of PROGRAMS) {
          for (const yearLevel of YEAR_LEVELS) {
            for (const status of STATUSES) {
              for (const gender of GENDERS) {
                const yearPrefix = String(Number(academicYear.slice(2, 4)) - YEAR_LEVELS.indexOf(yearLevel));
                records.push({
                  id: `${yearPrefix}-${String(10001 + index).padStart(5, '0')}`,
                  firstName: FIRST_NAMES[(index * 5 + (gender === 'Female' ? 0 : 1)) % FIRST_NAMES.length],
                  lastName: LAST_NAMES[(index * 7) % LAST_NAMES.length],
                  middleName: MIDDLE_NAMES[index % MIDDLE_NAMES.length],
                  campus,
                  college: program.college,
                  program: program.name,
                  yearLevel,
                  status,
                  academicYear,
                  semester,
                  gender,
                  archived: false,
                });
                index += 1;
              }
            }
          }
        }
      }
    }
  }
  return records;
}

const collegeData = [
  { code: 'CCS', name: 'College of Computer Studies', programs: 3, students: 3500 },
  { code: 'COE', name: 'College of Engineering', programs: 2, students: 2500 },
  { code: 'COB', name: 'College of Business', programs: 2, students: 2000 },
  { code: 'COA', name: 'College of Accountancy', programs: 1, students: 1200 },
  { code: 'COED', name: 'College of Education', programs: 1, students: 800 },
];
const programs = PROGRAMS.map(program => [program.code, program.name, program.college, 'Active']);
const departments = [
  ['Office of the President', 'Dr. Lourdes Decena', 'Executive', '18'],
  ['Human Resource Management', 'Ms. Teresa Lim', 'Administrative', '24'],
  ['Information & Communications Technology Office', 'Prof. Roan Fernandez', 'Administrative', '32'],
  ['Student Affairs Office', 'Dr. Alicia Ramos', 'Student Services', '28'],
];

const EMPTY_DRAFT: StudentDraft = {
  id: '',
  lastName: '',
  firstName: '',
  middleName: '',
  campus: CAMPUSES[0],
  college: PROGRAMS[0].college,
  program: PROGRAMS[0].name,
  yearLevel: YEAR_LEVELS[0],
  status: 'Enrolled',
  academicYear: '2026-2027',
  semester: SEMESTERS[0],
  gender: 'Female',
};

export default function InstitutionalData({ initialTab = 'Students' }: { initialTab?: Tab }) {
  const { showToast, setFilters, navigate } = useApp();
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => setTab(initialTab), [initialTab]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white border border-lilac/20 p-2 flex gap-1 overflow-x-auto">
        {TABS.map(item => (
          <button key={item} onClick={() => setTab(item)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${tab === item ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-lilac/10'}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === 'Students' ? <StudentsModule /> : (
        <GenericModule
          tab={tab}
          onCollege={(college) => {
            setFilters(previous => ({ ...previous, college }));
            navigate('student-analytics');
          }}
          onToast={(title, body) => showToast({ type: 'success', title, body })}
        />
      )}
    </div>
  );
}

function StudentsModule() {
  const { showModal, showToast } = useApp();
  const [students, setStudents] = useState<Student[]>(createStudents);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    academicYear: '2026-2027',
    semester: 'All Semesters',
    campus: 'All Campuses',
    college: 'All Colleges',
    program: 'All Programs',
    yearLevel: 'All Year Levels',
    status: 'All Statuses',
    gender: 'All Genders',
  });
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Student | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const pageSize = 15;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter(student => {
      const matchesQuery = !query || [
        student.id, student.firstName, student.lastName, student.middleName,
        student.campus, student.program, student.college,
      ].some(value => value.toLowerCase().includes(query));
      return student.archived === showArchived
        && matchesQuery
        && (filters.academicYear === 'All Academic Years' || student.academicYear === filters.academicYear)
        && (filters.semester === 'All Semesters' || student.semester === filters.semester)
        && (filters.campus === 'All Campuses' || student.campus === filters.campus)
        && (filters.college === 'All Colleges' || student.college === filters.college)
        && (filters.program === 'All Programs' || student.program === filters.program)
        && (filters.yearLevel === 'All Year Levels' || student.yearLevel === filters.yearLevel)
        && (filters.status === 'All Statuses' || student.status === filters.status)
        && (filters.gender === 'All Genders' || student.gender === filters.gender);
    });
  }, [filters, search, showArchived, students]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleStudents = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const activeRecords = students.filter(student => !student.archived);

  const genderData = useMemo(() => CAMPUSES.map(campus => ({
    campus: campus === 'San Bartolome' ? 'SB' : campus === 'San Francisco' ? 'SF' : 'BT',
    male: filtered.filter(student => student.campus === campus && student.gender === 'Male').length,
    female: filtered.filter(student => student.campus === campus && student.gender === 'Female').length,
  })), [filtered]);
  const statusData = useMemo(() => STATUSES.map(status => ({
    name: status,
    value: filtered.filter(student => student.status === status).length,
  })), [filtered]);

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters(previous => {
      if (key === 'college') {
        const programBelongsToCollege = PROGRAMS.some(program => program.name === previous.program && program.college === value);
        return {
          ...previous,
          college: value,
          program: value === 'All Colleges' || programBelongsToCollege ? previous.program : 'All Programs',
        };
      }
      if (key === 'program') {
        const selectedProgram = PROGRAMS.find(program => program.name === value);
        return {
          ...previous,
          program: value,
          college: selectedProgram?.college ?? previous.college,
        };
      }
      return { ...previous, [key]: value };
    });
    setPage(1);
  }

  function reset() {
    setSearch('');
    setFilters({
      academicYear: 'All Academic Years',
      semester: 'All Semesters',
      campus: 'All Campuses',
      college: 'All Colleges',
      program: 'All Programs',
      yearLevel: 'All Year Levels',
      status: 'All Statuses',
      gender: 'All Genders',
    });
    setPage(1);
    showToast({ type: 'info', title: 'Filters reset', body: 'The complete student dataset is now displayed.' });
  }

  function saveStudent(draft: StudentDraft) {
    const selectedProgram = PROGRAMS.find(program => program.name === draft.program) ?? PROGRAMS[0];
    if (editing) {
      setStudents(previous => previous.map(student => student.id === editing.id
        ? { ...student, ...draft, college: selectedProgram.college }
        : student));
      showToast({ type: 'success', title: 'Student updated', body: `${draft.firstName} ${draft.lastName}'s record is now current.` });
    } else {
      const nextId = draft.id.trim() || `27-${String(10001 + students.length).padStart(5, '0')}`;
      setStudents(previous => [{ ...draft, id: nextId, college: selectedProgram.college, archived: false }, ...previous]);
      showToast({ type: 'success', title: 'Student added', body: `${draft.firstName} ${draft.lastName} was added to the institutional masterlist.` });
    }
    setEditing(null);
    setFormOpen(false);
  }

  function archive(student: Student) {
    showModal({
      title: 'Archive student record',
      message: `Archive ${student.firstName} ${student.lastName} (${student.id})? The record can be restored later.`,
      confirmLabel: 'Archive',
      variant: 'danger',
      onConfirm: () => {
        setStudents(previous => previous.map(item => item.id === student.id ? { ...item, archived: true } : item));
        showToast({ type: 'success', title: 'Student archived', body: `${student.id} was moved to archived records.` });
      },
    });
  }

  function restore(student: Student) {
    setStudents(previous => previous.map(item => item.id === student.id ? { ...item, archived: false } : item));
    showToast({ type: 'success', title: 'Student restored', body: `${student.id} is active again.` });
  }

  function remove(student: Student) {
    showModal({
      title: 'Permanently delete record',
      message: `Delete ${student.firstName} ${student.lastName} (${student.id})? This action cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: () => {
        setStudents(previous => previous.filter(item => item.id !== student.id));
        showToast({ type: 'success', title: 'Student deleted', body: `${student.id} was permanently removed.` });
      },
    });
  }

  function exportRecords() {
    const headers = ['Student ID', 'Last Name', 'First Name', 'Middle Name', 'Campus', 'College', 'Program', 'Year Level', 'Status', 'Academic Year', 'Semester', 'Gender'];
    const rows = filtered.map(student => [
      student.id, student.lastName, student.firstName, student.middleName, student.campus, student.college,
      student.program, student.yearLevel, student.status, student.academicYear, student.semester, student.gender,
    ]);
    const csv = [headers, ...rows].map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = `institutional-students-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast({ type: 'success', title: 'Student data exported', body: `${filtered.length.toLocaleString()} filtered records were prepared as CSV.` });
  }

  const kpis = [
    [filtered.length.toLocaleString(), showArchived ? 'Archived records' : 'Filtered students'],
    [filtered.filter(student => student.status === 'Enrolled').length.toLocaleString(), 'Enrolled'],
    [filtered.filter(student => student.status === 'Graduating').length.toLocaleString(), 'Graduating'],
    [filtered.filter(student => student.gender === 'Female').length.toLocaleString(), 'Female'],
    [filtered.filter(student => student.gender === 'Male').length.toLocaleString(), 'Male'],
    [activeRecords.length.toLocaleString(), 'Active masterlist'],
  ];
  const availablePrograms = filters.college === 'All Colleges'
    ? PROGRAMS
    : PROGRAMS.filter(program => program.college === filters.college);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white border border-lilac/20 p-4 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-end gap-3">
          <label className="flex-1 min-w-56">
            <span className="text-[9px] uppercase tracking-widest font-bold text-muted">Search students</span>
            <span className="mt-1 flex items-center gap-2 rounded-xl bg-surface border border-lilac/20 px-3 focus-within:border-lilac focus-within:ring-2 focus-within:ring-lilac/15">
              <Icon name="search" />
              <input value={search} onChange={event => { setSearch(event.target.value); setPage(1); }}
                placeholder="Search ID, name, campus, college, or program…"
                className="w-full bg-transparent py-2.5 text-xs text-primary outline-none" />
            </span>
          </label>
          <div className="flex items-center gap-2">
            <IconButton label={showArchived ? 'View active records' : 'View archived records'} icon="archive"
              active={showArchived} onClick={() => { setShowArchived(value => !value); setPage(1); }} />
            <IconButton label="Reset filters" icon="reset" onClick={reset} />
            <IconButton label="Export filtered records" icon="export" onClick={exportRecords} />
            <IconButton label="Add student record" icon="add" emphasis onClick={() => { setEditing(null); setFormOpen(true); }} />
          </div>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          <Filter label="Academic Year" value={filters.academicYear} options={['All Academic Years', ...ACADEMIC_YEARS]} onChange={value => updateFilter('academicYear', value)} />
          <Filter label="Semester" value={filters.semester} options={['All Semesters', ...SEMESTERS]} onChange={value => updateFilter('semester', value)} />
          <Filter label="Campus" value={filters.campus} options={['All Campuses', ...CAMPUSES]} onChange={value => updateFilter('campus', value)} />
          <Filter label="College" value={filters.college} options={['All Colleges', ...COLLEGES.map(college => COLLEGE_LABELS[college])]} optionValues={['All Colleges', ...COLLEGES]} onChange={value => updateFilter('college', value)} />
          <Filter label="Program" value={filters.program} options={['All Programs', ...availablePrograms.map(program => program.name)]} onChange={value => updateFilter('program', value)} />
          <Filter label="Year Level" value={filters.yearLevel} options={['All Year Levels', ...YEAR_LEVELS]} onChange={value => updateFilter('yearLevel', value)} />
          <Filter label="Status" value={filters.status} options={['All Statuses', ...STATUSES]} onChange={value => updateFilter('status', value)} />
          <Filter label="Gender" value={filters.gender} options={['All Genders', ...GENDERS]} onChange={value => updateFilter('gender', value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(([value, label], index) => (
          <div key={label} className={`rounded-2xl p-4 ${index === 0 ? 'bg-primary text-white' : 'bg-white border border-lilac/20'}`}>
            <p className={`text-xl font-bold ${index === 0 ? 'text-golden' : 'text-primary'}`}>{value}</p>
            <p className={`text-[10px] mt-1 ${index === 0 ? 'text-white/60' : 'text-muted'}`}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Gender distribution by campus">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={genderData}>
              <CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" />
              <XAxis dataKey="campus" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="male" fill="#BB96E4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female" fill="#FFD066" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Enrollment status">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76}>
                {statusData.map((_, index) => <Cell key={STATUSES[index]} fill={['#7B6891', '#00875A', '#BB96E4', '#4C1413'][index]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="rounded-3xl bg-white border border-lilac/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-primary/[0.03] text-muted">
              <tr>
                {['Student ID', 'Student', 'Campus', 'College', 'Program', 'Year Level', 'Status', 'Academic Year', 'Semester', 'Gender', 'Actions'].map(header => (
                  <th key={header} className="p-3 text-left whitespace-nowrap font-semibold">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map(student => (
                <tr key={student.id} className="border-t border-lilac/10 hover:bg-blossom/20">
                  <td className="p-3 whitespace-nowrap font-semibold text-primary">{student.id}</td>
                  <td className="p-3 whitespace-nowrap">
                    <p className="font-semibold text-primary">{student.lastName}, {student.firstName}</p>
                    <p className="text-[10px] text-muted">{student.middleName}</p>
                  </td>
                  <td className="p-3 whitespace-nowrap text-muted">{student.campus}</td>
                  <td className="p-3 whitespace-nowrap text-primary font-semibold">{student.college}</td>
                  <td className="p-3 min-w-64 text-muted">{student.program}</td>
                  <td className="p-3 whitespace-nowrap text-muted">{student.yearLevel}</td>
                  <td className="p-3 whitespace-nowrap"><StatusPill status={student.status} /></td>
                  <td className="p-3 whitespace-nowrap text-muted">{student.academicYear}</td>
                  <td className="p-3 whitespace-nowrap text-muted">{student.semester}</td>
                  <td className="p-3 whitespace-nowrap text-muted">{student.gender}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {showArchived ? (
                        <>
                          <IconButton label="Restore" icon="restore" compact onClick={() => restore(student)} />
                          <IconButton label="Delete" icon="delete" compact danger onClick={() => remove(student)} />
                        </>
                      ) : (
                        <>
                          <IconButton label="Edit" icon="edit" compact onClick={() => { setEditing(student); setFormOpen(true); }} />
                          <IconButton label="Archive" icon="archive" compact danger onClick={() => archive(student)} />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleStudents.length && (
                <tr><td colSpan={11} className="p-10 text-center text-muted">No student records match the selected criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-lilac/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted">
          <span>
            Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length.toLocaleString()} records
          </span>
          <div className="flex items-center gap-2">
            <IconButton label="Previous page" icon="previous" compact disabled={safePage === 1} onClick={() => setPage(value => Math.max(1, value - 1))} />
            <span className="font-semibold text-primary">Page {safePage} of {pageCount}</span>
            <IconButton label="Next page" icon="next" compact disabled={safePage === pageCount} onClick={() => setPage(value => Math.min(pageCount, value + 1))} />
          </div>
        </div>
      </div>

      {formOpen && (
        <StudentForm
          initial={editing ? { ...editing } : { ...EMPTY_DRAFT }}
          title={editing ? 'Edit student record' : 'Add student record'}
          onClose={() => { setEditing(null); setFormOpen(false); }}
          onSave={saveStudent}
        />
      )}
    </div>
  );
}

function StudentForm({ initial, title, onClose, onSave }: {
  initial: StudentDraft;
  title: string;
  onClose: () => void;
  onSave: (draft: StudentDraft) => void;
}) {
  const [draft, setDraft] = useState<StudentDraft>(initial);
  const update = (key: keyof StudentDraft, value: string) => {
    setDraft(previous => {
      if (key === 'program') {
        const selected = PROGRAMS.find(program => program.name === value) ?? PROGRAMS[0];
        return { ...previous, program: value, college: selected.college };
      }
      return { ...previous, [key]: value };
    });
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave(draft);
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-[190] flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <form onSubmit={submit} className="modal-content w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 bg-white border-b border-lilac/15 p-5 flex items-center justify-between">
          <div>
            <p className="font-bold text-lg text-primary">{title}</p>
            <p className="text-xs text-muted mt-1">Changes update the masterlist and student insights immediately.</p>
          </div>
          <IconButton label="Close" icon="close" compact onClick={onClose} />
        </div>
        <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField label="Student ID" value={draft.id} placeholder="Auto-generated if blank" onChange={value => update('id', value)} />
          <TextField label="First Name" value={draft.firstName} required onChange={value => update('firstName', value)} />
          <TextField label="Last Name" value={draft.lastName} required onChange={value => update('lastName', value)} />
          <TextField label="Middle Name" value={draft.middleName} required onChange={value => update('middleName', value)} />
          <Filter label="Campus" value={draft.campus} options={CAMPUSES} onChange={value => update('campus', value)} />
          <Filter label="Program" value={draft.program} options={PROGRAMS.map(program => program.name)} onChange={value => update('program', value)} />
          <TextField label="College" value={draft.college} disabled onChange={() => undefined} />
          <Filter label="Academic Year" value={draft.academicYear} options={ACADEMIC_YEARS} onChange={value => update('academicYear', value)} />
          <Filter label="Semester" value={draft.semester} options={SEMESTERS} onChange={value => update('semester', value)} />
          <Filter label="Year Level" value={draft.yearLevel} options={YEAR_LEVELS} onChange={value => update('yearLevel', value)} />
          <Filter label="Status" value={draft.status} options={STATUSES} onChange={value => update('status', value)} />
          <Filter label="Gender" value={draft.gender} options={GENDERS} onChange={value => update('gender', value)} />
        </div>
        <div className="sticky bottom-0 bg-white border-t border-lilac/15 p-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl bg-primary/5 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/10">Cancel</button>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary/90">Save record</button>
        </div>
      </form>
    </div>
  );
}

function GenericModule({ tab, onCollege, onToast }: {
  tab: Exclude<Tab, 'Students'>;
  onCollege: (college: string) => void;
  onToast: (title: string, body: string) => void;
}) {
  const [search, setSearch] = useState('');
  const content: Record<Exclude<Tab, 'Students' | 'College'>, { headers: string[]; rows: string[][] }> = {
    Programs: { headers: ['Program Code', 'Program Name', 'College', 'Status'], rows: programs },
    Department: { headers: ['Department Name', 'Department Head', 'Department Type', 'Personnel Count'], rows: departments },
    Faculty: { headers: ['Faculty ID', 'Full Name', 'College', 'Appointment', 'Rank', 'Status'], rows: [['F-0018', 'Dr. Maria Santos', 'CCS', 'Full-Time', 'Professor', 'Active'], ['F-0042', 'Engr. Paolo Cruz', 'COE', 'Part-Time', 'Instructor III', 'Active']] },
    Employee: { headers: ['Employee ID', 'Full Name', 'Department', 'Position', 'Employment', 'Status'], rows: [['E-0108', 'Teresa Lim', 'Human Resources', 'HR Officer IV', 'Regular', 'Active'], ['E-0112', 'Roan Fernandez', 'ICTO', 'MIS Lead Officer', 'Regular', 'Active']] },
    'Academic Year': { headers: ['Academic Year', 'Semester', 'Enrollment Opens', 'Classes Begin', 'Term Ends', 'Status'], rows: [['2026-2027', '1st Semester', '06/01/2026', '08/03/2026', '12/18/2026', 'ACTIVE'], ['2025-2026', '2nd Semester', '11/15/2025', '01/12/2026', '05/29/2026', 'CLOSED']] },
  };
  if (tab === 'College') {
    return <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {collegeData.map((college, index) => (
        <div key={college.code} className="rounded-3xl bg-white border border-lilac/20 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-3 h-10 rounded-full" style={{ background: COLLEGE_COLORS[index] }} />
            <div><p className="text-[10px] font-bold tracking-widest text-muted">{college.code}</p><p className="font-bold text-primary">{college.name}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-5"><Metric value={String(college.programs)} label="Programs" /><Metric value={college.students.toLocaleString()} label="Enrolled" /></div>
          <button onClick={() => onCollege(college.code)} className="w-full mt-4 rounded-xl py-2 text-xs font-semibold bg-primary text-white">View college analytics</button>
        </div>
      ))}
    </div>;
  }
  const table = content[tab];
  const rows = table.rows.filter(row => row.some(cell => cell.toLowerCase().includes(search.toLowerCase())));
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-lilac/20 p-4 flex gap-3">
        <label className="flex-1">
          <span className="text-[9px] uppercase tracking-widest font-bold text-muted">Search {tab}</span>
          <input value={search} onChange={event => setSearch(event.target.value)} className="mt-1 w-full rounded-xl bg-surface border border-lilac/20 px-3 py-2 text-xs text-primary outline-none focus:border-lilac" />
        </label>
        <div className="self-end"><IconButton label={`Add ${tab} record`} icon="add" emphasis onClick={() => onToast('Draft record created', `A new ${tab.toLowerCase()} record is ready for completion.`)} /></div>
      </div>
      <DataTable headers={[...table.headers, 'Actions']} rows={rows} onEdit={() => onToast('Record ready to edit', 'Changes will be saved to the institutional masterlist.')} />
    </div>
  );
}

function Filter({ label, value, options, optionValues, onChange }: {
  label: string;
  value: string;
  options: readonly string[];
  optionValues?: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="min-w-0">
      <span className="text-[9px] uppercase tracking-widest font-bold text-muted">{label}</span>
      <span className="relative mt-1 block">
        <select value={value} onChange={event => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl bg-surface border border-lilac/20 pl-3 pr-8 py-2.5 text-xs font-medium text-primary outline-none cursor-pointer hover:border-lilac/50 focus:border-lilac focus:ring-2 focus:ring-lilac/15">
          {options.map((option, index) => <option key={option} value={optionValues?.[index] ?? option}>{option}</option>)}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lilac"><Icon name="chevron" /></span>
      </span>
    </label>
  );
}

function TextField({ label, value, placeholder, required, disabled, onChange }: {
  label: string; value: string; placeholder?: string; required?: boolean; disabled?: boolean; onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-[9px] uppercase tracking-widest font-bold text-muted">{label}</span>
      <input value={value} required={required} disabled={disabled} placeholder={placeholder} onChange={event => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl bg-surface border border-lilac/20 px-3 py-2.5 text-xs text-primary outline-none hover:border-lilac/50 focus:border-lilac focus:ring-2 focus:ring-lilac/15 disabled:opacity-60" />
    </label>
  );
}

function IconButton({ label, icon, onClick, compact, emphasis, active, danger, disabled }: {
  label: string; icon: IconName; onClick: () => void; compact?: boolean; emphasis?: boolean; active?: boolean; danger?: boolean; disabled?: boolean;
}) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled}
      className={`group relative inline-flex items-center justify-center rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${compact ? 'w-8 h-8' : 'w-10 h-10'} ${emphasis ? 'bg-primary text-white hover:bg-primary/90' : danger ? 'bg-obsidian/5 text-obsidian hover:bg-obsidian/10' : active ? 'bg-lilac/25 text-primary ring-1 ring-lilac/40' : 'bg-primary/5 text-primary hover:bg-lilac/20'}`}>
      <Icon name={icon} />
      <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-lg bg-primary px-2 py-1 text-[10px] font-medium text-white whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{label}</span>
    </button>
  );
}

type IconName = 'add' | 'archive' | 'chevron' | 'close' | 'delete' | 'edit' | 'export' | 'next' | 'previous' | 'reset' | 'restore' | 'search';
function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    add: <path d="M12 5v14M5 12h14" />,
    archive: <><path d="M4 7h16v13H4zM3 4h18v3H3z" /><path d="M9 11h6" /></>,
    chevron: <path d="M7 10l5 5 5-5" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    delete: <><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7" /><path d="M10 11v5m4-5v5" /></>,
    edit: <><path d="M4 20l4.5-1 10-10-3.5-3.5-10 10L4 20z" /><path d="M13.5 7l3.5 3.5" /></>,
    export: <><path d="M12 3v12m0-12L7 8m5-5 5 5" /><path d="M5 14v6h14v-6" /></>,
    next: <path d="M9 6l6 6-6 6" />,
    previous: <path d="M15 6l-6 6 6 6" />,
    reset: <><path d="M4 12a8 8 0 101.8-5.1" /><path d="M4 4v5h5" /></>,
    restore: <><path d="M4 12a8 8 0 101.8-5.1" /><path d="M4 4v5h5M12 8v5l3 2" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  };
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function StatusPill({ status }: { status: StudentStatus }) {
  const style = {
    Unenrolled: 'bg-muted/10 text-muted',
    Enrolled: 'bg-coa/10 text-coa',
    Graduating: 'bg-lilac/20 text-primary',
    'Drop-out': 'bg-obsidian/10 text-obsidian',
  }[status];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${style}`}>{status}</span>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-xl bg-surface p-3"><p className="text-lg font-bold text-primary">{value}</p><p className="text-[10px] text-muted">{label}</p></div>;
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return <div className="rounded-3xl bg-white border border-lilac/20 p-4"><p className="font-bold text-sm text-primary mb-3">{title}</p>{children}</div>;
}

function DataTable({ headers, rows, onEdit }: { headers: string[]; rows: string[][]; onEdit: () => void }) {
  return (
    <div className="rounded-3xl bg-white border border-lilac/20 overflow-x-auto shadow-sm">
      <table className="w-full text-xs">
        <thead className="bg-primary/[0.03] text-muted"><tr>{headers.map(header => <th key={header} className="p-3 text-left whitespace-nowrap">{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => (
          <tr key={index} className="border-t border-lilac/10 hover:bg-blossom/20">
            {row.map((cell, cellIndex) => <td key={cellIndex} className={`p-3 whitespace-nowrap ${cellIndex === 0 ? 'font-semibold text-primary' : 'text-muted'}`}>{cell}</td>)}
            <td className="p-3"><IconButton label="Edit" icon="edit" compact onClick={onEdit} /></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
