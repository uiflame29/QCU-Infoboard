import { useApp } from '../context/AppContext';
import { COLLEGES, PROGRAMS } from '../data/mockData';

const PROGRAM_NAMES: Record<string, string> = {
  BSA: 'Bachelor of Science in Accountancy',
  BSMA: 'Bachelor of Science in Management Accounting',
  BSEntrep: 'Bachelor of Science in Entrepreneurship',
  BSIT: 'Bachelor of Science in Information Technology',
  BSIS: 'Bachelor of Science in Information Systems',
  BSCS: 'Bachelor of Science in Computer Science',
  BSCE: 'Bachelor of Science in Computer Engineering',
  BSECE: 'Bachelor of Science in Electronics Engineering',
  BSIE: 'Bachelor of Science in Industrial Engineering',
  BECEd: 'Bachelor of Early Childhood Education',
};

export default function RegistrarCollegeData() {
  const { setFilters, navigate } = useApp();

  function openCollege(college: string, destination: 'student-analytics' | 'faculty-analytics') {
    setFilters(previous => ({ ...previous, college, program: 'All' }));
    navigate(destination);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-gradient-to-r from-primary to-obsidian p-6 text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-lilac">Official institutional hierarchy</p>
        <p className="mt-2 text-2xl font-bold">Colleges & Academic Programs</p>
        <p className="mt-1 max-w-2xl text-sm text-white/55">Review the five colleges covered by the Registrar workspace. Select an analytics action to preserve the chosen college as the active scope.</p>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {Object.entries(COLLEGES).map(([code, college]) => (
          <article key={code} className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start gap-4 border-b border-lilac/10 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold text-white" style={{ background: college.color }}>{code}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-primary">{college.name}</p>
                <p className="mt-1 text-xs text-muted">{college.students.toLocaleString()} students · {college.faculty} active faculty · {(college.students / college.faculty).toFixed(1)}:1 ratio</p>
              </div>
              <span className="rounded-full bg-coa/10 px-2.5 py-1 text-[9px] font-bold text-coa">ACTIVE</span>
            </div>
            <div className="p-5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Official Programs</p>
              <div className="mt-3 space-y-2">
                {(PROGRAMS[code] ?? []).map(program => (
                  <button
                    type="button"
                    key={program}
                    onClick={() => {
                      setFilters(previous => ({ ...previous, college: code, program }));
                      navigate('student-analytics');
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl border border-lilac/10 bg-surface px-3 py-2.5 text-left transition-colors hover:border-lilac/30 hover:bg-white">
                    <span className="rounded-lg bg-lilac/10 px-2 py-1 text-[9px] font-bold text-primary">{program}</span>
                    <span className="flex-1 text-xs font-medium text-primary">{PROGRAM_NAMES[program] ?? program}</span>
                    <span className="text-lilac">→</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => openCollege(code, 'student-analytics')} className="flex-1 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-white">Enrollment Analytics</button>
                <button type="button" onClick={() => openCollege(code, 'faculty-analytics')} className="flex-1 rounded-xl bg-lilac/15 px-3 py-2.5 text-xs font-semibold text-primary">Faculty Analytics</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
