import { useState } from 'react';
import { useApp } from '../context/AppContext';

const COLLEGE_NAMES: Record<string, string> = {
  CCS: 'College of Computer Studies',
  COB: 'College of Business',
  COA: 'College of Accountancy',
  COE: 'College of Engineering',
  COED: 'College of Education',
};

interface FacultyRow {
  id: string;
  name: string;
  type: 'Full-Time' | 'Part-Time';
  rank: string;
  qualification: string;
  load: number;
  status: 'Active' | 'On Leave' | 'Archived';
}

function generateRows(college: string): FacultyRow[] {
  const names = [
    'Dr. Juan Dela Cruz', 'Prof. Maria Santos', 'Dr. Roberto Cruz',
    'Prof. Ana Lim', 'Dr. Paulo Garcia', 'Prof. Carmen Reyes',
    'Dr. Andres Torres', 'Prof. Clara Villanueva', 'Dr. Miguel Bautista',
  ];
  const ranks = ['Instructor I', 'Instructor II', 'Assistant Professor I', 'Assistant Professor II', 'Associate Professor', 'Professor'];
  const quals = ['Bachelor\'s', 'Master\'s', 'Doctorate'];
  const types: FacultyRow['type'][] = ['Full-Time', 'Full-Time', 'Part-Time'];
  const statuses: FacultyRow['status'][] = ['Active', 'Active', 'Active', 'On Leave', 'Archived'];
  return names.map((name, i) => ({
    id: `${college}-F${String(i + 1).padStart(3, '0')}`,
    name,
    type: types[i % types.length],
    rank: ranks[i % ranks.length],
    qualification: quals[i % quals.length],
    load: 12 + (i % 6) * 3,
    status: statuses[i % statuses.length],
  }));
}

const TYPE_STYLES: Record<FacultyRow['type'], string> = {
  'Full-Time': 'bg-lilac/15 text-primary',
  'Part-Time': 'bg-blossom/40 text-muted',
};

const STATUS_STYLES: Record<FacultyRow['status'], string> = {
  Active: 'bg-green-50 text-green-700',
  'On Leave': 'bg-amber-50 text-amber-700',
  Archived: 'bg-gray-100 text-gray-500',
};

export default function DeanFacultyData() {
  const { currentUser } = useApp();
  const college = currentUser?.college ?? 'CCS';
  const rows = generateRows(college);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = rows.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || r.type === filterType;
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const totalFT = rows.filter(r => r.type === 'Full-Time').length;
  const totalPT = rows.filter(r => r.type === 'Part-Time').length;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Access Scope</p>
        <p className="text-sm font-semibold text-primary">{college} — {COLLEGE_NAMES[college]}</p>
        <p className="text-xs text-muted mt-0.5">Faculty records are restricted to your assigned college.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Faculty', value: rows.length },
          { label: 'Full-Time', value: totalFT },
          { label: 'Part-Time', value: totalPT },
        ].map(k => (
          <div key={k.label} className="rounded-2xl bg-white border border-lilac/15 shadow-sm px-5 py-4 flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{k.label}</p>
            <p className="text-2xl font-extrabold text-primary">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-lilac/10 flex flex-wrap items-center gap-3">
          <p className="text-sm font-bold text-primary flex-1">Faculty Directory</p>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID…"
            className="rounded-xl border border-lilac/20 bg-surface px-3 py-2 text-xs text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-lilac/25 w-52" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary focus:outline-none focus:ring-2 focus:ring-lilac/25">
            <option value="All">All Types</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary focus:outline-none focus:ring-2 focus:ring-lilac/25">
            <option value="All">All Statuses</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Archived</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface border-b border-lilac/10">
                <th className="px-4 py-3 text-left font-semibold text-muted">Employee ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Full Name</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Rank</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Qualification</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Teaching Load</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-lilac/5 hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-mono text-muted">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-primary">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${TYPE_STYLES[r.type]}`}>{r.type}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{r.rank}</td>
                  <td className="px-4 py-3 text-muted">{r.qualification}</td>
                  <td className="px-4 py-3 font-mono text-primary">{r.load} hrs</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-xs text-muted">No records match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-lilac/10 flex items-center justify-between">
          <p className="text-xs text-muted">{filtered.length} of {rows.length} faculty members</p>
          <button className="rounded-xl border border-lilac/20 px-4 py-1.5 text-xs font-semibold text-primary hover:bg-lilac/10 transition-colors flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3v13M7 11l5 5 5-5M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
