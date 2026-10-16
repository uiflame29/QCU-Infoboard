import { useApp } from '../context/AppContext';
import { PROGRAMS as COLLEGE_PROGRAMS } from '../data/mockData';

const PROGRAM_NAMES: Record<string, string> = {
  BSIT: 'BS Information Technology',
  BSIS: 'BS Information Systems',
  BSCS: 'BS Computer Science',
  BSIE: 'BS Industrial Engineering',
  BSECE: 'BS Electronics Engineering',
  BSEntrep: 'BS Entrepreneurship',
  BSA: 'BS Accountancy',
  BSMA: 'BS Management Accounting',
  BECEd: 'Bachelor of Early Childhood Education',
};

const COLLEGE_NAMES: Record<string, string> = {
  CCS: 'College of Computer Studies',
  COB: 'College of Business',
  COA: 'College of Accountancy',
  COE: 'College of Engineering',
  COED: 'College of Education',
};

const COLLEGE_STATS: Record<string, { students: number; faculty: number; rooms: number }> = {
  CCS:  { students: 3850, faculty: 42, rooms: 18 },
  COB:  { students: 3200, faculty: 62, rooms: 14 },
  COA:  { students: 1050, faculty: 43, rooms: 9  },
  COE:  { students: 2030, faculty: 58, rooms: 12 },
  COED: { students: 1100, faculty: 15, rooms: 7  },
};

interface ProgramDetail {
  department: string;
  chair: string;
  students: number;
  faculty: number;
  capacity: number;
  duration: string;
  curriculum: string;
  accreditation: string;
}

const PROGRAM_DETAILS: Record<string, ProgramDetail> = {
  BSIT: { department: 'Department of Information Technology', chair: 'Prof. Ana Reyes', students: 1800, faculty: 18, capacity: 2000, duration: '4 years', curriculum: '2023 Curriculum', accreditation: 'AACCUP Level III' },
  BSIS: { department: 'Department of Information Systems', chair: 'Prof. Miguel Torres', students: 1050, faculty: 12, capacity: 1200, duration: '4 years', curriculum: '2023 Curriculum', accreditation: 'AACCUP Level II' },
  BSCS: { department: 'Department of Computer Science', chair: 'Dr. Elena Cruz', students: 1000, faculty: 12, capacity: 1150, duration: '4 years', curriculum: '2023 Curriculum', accreditation: 'AACCUP Level III' },
  BSIE: { department: 'Department of Industrial Engineering', chair: 'Engr. Paulo Garcia', students: 1180, faculty: 31, capacity: 1400, duration: '4 years', curriculum: '2022 Curriculum', accreditation: 'AACCUP Level II' },
  BSECE: { department: 'Department of Electronics Engineering', chair: 'Engr. Carla Mendoza', students: 850, faculty: 27, capacity: 1000, duration: '4 years', curriculum: '2022 Curriculum', accreditation: 'AACCUP Level II' },
  BSEntrep: { department: 'Department of Entrepreneurship', chair: 'Prof. Liza Navarro', students: 2000, faculty: 35, capacity: 2300, duration: '4 years', curriculum: '2023 Curriculum', accreditation: 'AACCUP Level II' },
  BSA: { department: 'Department of Accountancy', chair: 'Dr. Patricia Lim', students: 1050, faculty: 43, capacity: 1250, duration: '4 years', curriculum: '2023 Curriculum', accreditation: 'AACCUP Level III' },
  BECEd: { department: 'Department of Early Childhood Education', chair: 'Dr. Liza Ramos', students: 1100, faculty: 15, capacity: 1250, duration: '4 years', curriculum: '2023 Curriculum', accreditation: 'AACCUP Level II' },
};

export default function DeanCollegeData() {
  const { currentUser } = useApp();
  const college = currentUser?.college ?? 'CCS';
  const programs = (COLLEGE_PROGRAMS[college] ?? []).map(code => ({
    code,
    name: PROGRAM_NAMES[code] ?? code,
    detail: PROGRAM_DETAILS[code],
  }));
  const stats = COLLEGE_STATS[college] ?? { students: 0, faculty: 0, rooms: 0 };
  const departments = Object.values(
    programs.reduce<Record<string, { name: string; chair: string; programs: string[]; students: number; faculty: number }>>((result, program) => {
      const detail = program.detail;
      if (!detail) return result;
      const department = result[detail.department] ?? {
        name: detail.department,
        chair: detail.chair,
        programs: [],
        students: 0,
        faculty: 0,
      };
      department.programs.push(program.code);
      department.students += detail.students;
      department.faculty += detail.faculty;
      result[detail.department] = department;
      return result;
    }, {}),
  );

  return (
    <div className="space-y-5">
      {/* College identity card */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-lilac/15 flex items-center justify-center shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 21h18M5 21V8l7-5 7 5v13M9 12h2m2 0h2m-6 4h2m2 0h2" stroke="#200D2D" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">College Code</p>
            <h2 className="text-2xl font-extrabold text-primary mt-0.5">{college}</h2>
            <p className="text-sm font-semibold text-muted mt-1">{COLLEGE_NAMES[college]}</p>
            <p className="text-xs text-muted mt-1">Quezon City University · Main Campus</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Students', value: stats.students.toLocaleString(), icon: 'M12 12a5 5 0 110-10 5 5 0 010 10zm-7 9a7 7 0 1114 0H5z' },
          { label: 'Faculty Members', value: stats.faculty, icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m9-10a4 4 0 100-8 4 4 0 000 8zm6 0v2m0 0a3 3 0 100 6 3 3 0 000-6z' },
          { label: 'Departments', value: departments.length, icon: 'M3 21h18M5 21V8l7-5 7 5v13M9 12h2m2 0h2m-6 4h2m2 0h2' },
        ].map(k => (
          <div key={k.label} className="rounded-2xl bg-white border border-lilac/15 shadow-sm px-5 py-4 flex flex-col gap-1">
            <div className="flex items-start justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{k.label}</p>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-lilac/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d={k.icon} stroke="#BB96E4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-primary">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Department overview */}
      <section>
        <div className="mb-3">
          <p className="text-sm font-bold text-primary">Departments</p>
          <p className="mt-1 text-xs text-muted">Academic units, department leadership, and current staffing coverage.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {departments.map(department => (
            <article key={department.name} className="rounded-2xl border border-lilac/15 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-golden">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 12h2m2 0h2m-6 4h2m2 0h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </span>
                <span className="rounded-full bg-coa/10 px-2.5 py-1 text-[9px] font-bold text-coa">Active</span>
              </div>
              <p className="mt-4 text-sm font-bold leading-snug text-primary">{department.name}</p>
              <p className="mt-1 text-xs text-muted">Department Chair: <strong className="text-primary">{department.chair}</strong></p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-lilac/10 pt-4">
                <div><p className="text-lg font-bold text-primary">{department.programs.length}</p><p className="text-[9px] text-muted">Programs</p></div>
                <div><p className="text-lg font-bold text-primary">{department.students.toLocaleString()}</p><p className="text-[9px] text-muted">Students</p></div>
                <div><p className="text-lg font-bold text-primary">{department.faculty}</p><p className="text-[9px] text-muted">Faculty</p></div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">{department.programs.map(program => <span key={program} className="rounded-lg bg-lilac/10 px-2 py-1 text-[9px] font-bold text-primary">{program}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
