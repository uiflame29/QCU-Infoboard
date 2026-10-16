import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROGRAMS } from '../data/mockData';

const COLLEGE_NAMES: Record<string, string> = {
  CCS: 'College of Computer Studies',
  COB: 'College of Business',
  COA: 'College of Accountancy',
  COE: 'College of Engineering',
  COED: 'College of Education',
};

interface StudentRow {
  id: string;
  name: string;
  program: string;
  year: number;
  status: 'Enrolled' | 'Irregular' | 'LOA';
  gpa: string;
}

function generateRows(college: string): StudentRow[] {
  const programs = PROGRAMS[college] ?? [];
  const names = [
    'Naya Alia', 'Bryan Ramos', 'Carla Santos', 'Daniel Cruz',
    'Elena Reyes', 'Franz Bautista', 'Grace Lim', 'Harold Tan',
    'Iris Dela Cruz', 'James Villanueva', 'Karen Reyes', 'Luis Garcia',
  ];
  const statuses: StudentRow['status'][] = ['Enrolled', 'Enrolled', 'Enrolled', 'Irregular', 'LOA'];
  return names.map((name, i) => ({
    id: `${college}-${String(i + 1).padStart(3, '0')}`,
    name,
    program: programs[i % programs.length] ?? programs[0],
    year: (i % 4) + 1,
    status: statuses[i % statuses.length],
    gpa: (1.0 + (i * 0.17) % 2.5).toFixed(2),
  }));
}

const STATUS_STYLES: Record<StudentRow['status'], string> = {
  Enrolled: 'bg-green-50 text-green-700',
  Irregular: 'bg-amber-50 text-amber-700',
  LOA: 'bg-red-50 text-red-700',
};

export default function DeanStudentData() {
  const { currentUser } = useApp();
  const college = currentUser?.college ?? 'CCS';
  const rows = generateRows(college);
  const programs = PROGRAMS[college] ?? [];

  const [search, setSearch] = useState('');
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = rows.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchProgram = filterProgram === 'All' || r.program === filterProgram;
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchSearch && matchProgram && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Access Scope</p>
        <p className="text-sm font-semibold text-primary">{college} — {COLLEGE_NAMES[college]}</p>
        <p className="text-xs text-muted mt-0.5">Student records are restricted to your assigned college.</p>
      </div>

      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-lilac/10 flex flex-wrap items-center gap-3">
          <p className="text-sm font-bold text-primary flex-1">Student Directory</p>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID…"
            className="rounded-xl border border-lilac/20 bg-surface px-3 py-2 text-xs text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-lilac/25 w-52" />
          <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)}
            className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary focus:outline-none focus:ring-2 focus:ring-lilac/25">
            <option value="All">All Programs</option>
            {programs.map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary focus:outline-none focus:ring-2 focus:ring-lilac/25">
            <option value="All">All Statuses</option>
            <option>Enrolled</option>
            <option>Irregular</option>
            <option>LOA</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface border-b border-lilac/10">
                <th className="px-4 py-3 text-left font-semibold text-muted">Student ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Full Name</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Program</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Year</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">GPA</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-lilac/5 hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-mono text-muted">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-primary">{r.name}</td>
                  <td className="px-4 py-3 text-primary">{r.program}</td>
                  <td className="px-4 py-3 text-muted">Year {r.year}</td>
                  <td className="px-4 py-3 font-mono text-primary">{r.gpa}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-muted">No records match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-lilac/10 flex items-center justify-between">
          <p className="text-xs text-muted">{filtered.length} of {rows.length} students</p>
          <button className="rounded-xl border border-lilac/20 px-4 py-1.5 text-xs font-semibold text-primary hover:bg-lilac/10 transition-colors flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3v13M7 11l5 5 5-5M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
