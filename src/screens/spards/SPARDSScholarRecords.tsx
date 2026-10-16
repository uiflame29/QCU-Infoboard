import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

type GrantType = 'QCYDO' | 'UNIFAST/TES' | 'CHED' | 'Academic' | 'LGU/Private';
type GrantStatus = 'Active' | 'Suspended' | 'Probation';
type Standing = "Dean's List" | 'Good Standing' | 'At-Risk';

interface Scholar {
  id: string;
  studentId: string;
  lastName: string;
  firstName: string;
  middleName: string;
  college: string;
  program: string;
  grant: GrantType;
  gpa: number;
  standing: Standing;
  status: GrantStatus;
  archived?: boolean;
}

const BASE_SCHOLARS: Scholar[] = [
  { id: '1', studentId: '23-2652', lastName: 'Alia', firstName: 'Naya', middleName: 'M.', college: 'CCS', program: 'BSIT', grant: 'QCYDO', gpa: 1.25, standing: "Dean's List", status: 'Active' },
  { id: '2', studentId: '20-2121', lastName: 'Martin', firstName: 'Anastasha', middleName: 'B.', college: 'CCS', program: 'BSCS', grant: 'UNIFAST/TES', gpa: 1.78, standing: 'Good Standing', status: 'Active' },
  { id: '3', studentId: '22-1089', lastName: 'Ramos', firstName: 'Bryan', middleName: 'D.', college: 'COE', program: 'BSEE', grant: 'QCYDO', gpa: 1.65, standing: "Dean's List", status: 'Active' },
  { id: '4', studentId: '21-3340', lastName: 'Santos', firstName: 'Carla', middleName: 'R.', college: 'COA', program: 'BSA', grant: 'CHED', gpa: 1.50, standing: "Dean's List", status: 'Active' },
  { id: '5', studentId: '23-0789', lastName: 'Cruz', firstName: 'Daniel', middleName: 'P.', college: 'COB', program: 'BSE', grant: 'QCYDO', gpa: 2.35, standing: 'At-Risk', status: 'Probation' },
  { id: '6', studentId: '22-5512', lastName: 'Reyes', firstName: 'Elena', middleName: 'S.', college: 'COED', program: 'BECED', grant: 'LGU/Private', gpa: 1.95, standing: 'Good Standing', status: 'Active' },
  { id: '7', studentId: '20-4421', lastName: 'Bautista', firstName: 'Franz', middleName: 'L.', college: 'CCS', program: 'BSIS', grant: 'UNIFAST/TES', gpa: 2.10, standing: 'Good Standing', status: 'Active' },
  { id: '8', studentId: '23-9900', lastName: 'Lim', firstName: 'Grace', middleName: 'T.', college: 'COE', program: 'BSIE', grant: 'QCYDO', gpa: 1.10, standing: "Dean's List", status: 'Active' },
  { id: '9', studentId: '22-3301', lastName: 'Torres', firstName: 'Harold', middleName: 'C.', college: 'COA', program: 'BSA', grant: 'QCYDO', gpa: 1.80, standing: 'Good Standing', status: 'Active' },
  { id: '10', studentId: '21-7765', lastName: 'Aquino', firstName: 'Isabel', middleName: 'M.', college: 'CCS', program: 'BSIT', grant: 'CHED', gpa: 2.50, standing: 'At-Risk', status: 'Suspended' },
];

const COLLEGE_OPTS = ['All', 'CCS', 'COA', 'COB', 'COE', 'COED'];
const PROGRAMS_MAP: Record<string, string[]> = {
  CCS: ['BSIT', 'BSIS', 'BSCS'],
  COA: ['BSA', 'BSMA'],
  COB: ['BSE', 'MSENT'],
  COE: ['BSEE', 'BSIE'],
  COED: ['BECED'],
};
const ALL_PROGRAMS = Object.values(PROGRAMS_MAP).flat();
const GRANT_OPTS = ['All', 'QCYDO', 'UNIFAST/TES', 'CHED', 'Academic', 'LGU/Private'];
const AY_OPTS = ['All', '2024–2025', '2025–2026', '2026–2027'];

/* SVG icon helpers with tooltip */
function ActionBtn({ title, onClick, children, variant = 'default' }: { title: string; onClick: () => void; children: React.ReactNode; variant?: 'default' | 'danger' | 'warning' | 'success' }) {
  const colors = {
    default: 'bg-lilac/10 text-primary hover:bg-lilac/20',
    warning: 'bg-golden/15 text-primary hover:bg-golden/25',
    danger: 'bg-obsidian/10 text-obsidian hover:bg-obsidian/20',
    success: 'bg-coa/10 text-coa hover:bg-coa/20',
  };
  return (
    <button title={title} onClick={onClick}
      className={`relative group rounded-lg w-7 h-7 flex items-center justify-center transition-colors ${colors[variant]}`}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center rounded-lg bg-primary text-white text-[9px] font-semibold px-2 py-1 whitespace-nowrap shadow-lg z-50">
        {title}
      </span>
    </button>
  );
}

const STANDING_STYLES: Record<Standing, string> = {
  "Dean's List": 'bg-coa/10 text-coa',
  'Good Standing': 'bg-lilac/15 text-primary',
  'At-Risk': 'bg-golden/20 text-amber-700',
};

const STATUS_STYLES: Record<GrantStatus, string> = {
  Active: 'bg-coa/10 text-coa',
  Suspended: 'bg-obsidian/10 text-obsidian',
  Probation: 'bg-golden/20 text-amber-700',
};

export default function SPARDSScholarRecords() {
  const { showToast, showModal } = useApp();
  const [search, setSearch] = useState('');
  const [ay, setAy] = useState('All');
  const [college, setCollege] = useState('All');
  const [program, setProgram] = useState('All');
  const [grant, setGrant] = useState('All');

  const programOpts = useMemo(() => {
    if (college === 'All') return ['All', ...ALL_PROGRAMS];
    return ['All', ...(PROGRAMS_MAP[college] ?? [])];
  }, [college]);
  const [showArchive, setShowArchive] = useState(false);
  const [scholars, setScholars] = useState<Scholar[]>(BASE_SCHOLARS);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const active = scholars.filter(s => !s.archived);
  const archived = scholars.filter(s => s.archived);

  const filtered = useMemo(() => {
    const pool = showArchive ? archived : active;
    return pool.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q) || s.studentId.includes(q);
      const matchCollege = college === 'All' || s.college === college;
      const matchProgram = program === 'All' || s.program === program;
      const matchGrant = grant === 'All' || s.grant === grant;
      return matchSearch && matchCollege && matchProgram && matchGrant;
    });
  }, [scholars, showArchive, search, college, program, grant, active, archived]);

  function toggleSelect(id: string) {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  function handleArchive(id: string, name: string) {
    showModal({
      title: 'Archive Scholar Profile',
      message: `Archive ${name}'s profile? The record will be moved to the Archive Vault and can be restored at any time.`,
      confirmLabel: 'Archive',
      variant: 'danger',
      onConfirm: () => {
        setScholars(prev => prev.map(s => s.id === id ? { ...s, archived: true } : s));
        showToast({ type: 'success', title: 'Scholar Archived', body: `${name}'s profile moved to Archive Vault.` });
      },
    });
  }

  function handleRestore(id: string, name: string) {
    showModal({
      title: 'Restore Scholar Profile',
      message: `Restore ${name}'s profile to active records?`,
      confirmLabel: 'Restore',
      onConfirm: () => {
        setScholars(prev => prev.map(s => s.id === id ? { ...s, archived: false } : s));
        showToast({ type: 'success', title: 'Scholar Restored', body: `${name}'s profile is back in active records.` });
      },
    });
  }

  function handleAddScholar() {
    showModal({
      title: 'Add New Scholar',
      message: 'New scholar profile creation form would appear here in the production system. All fields are validated before submission.',
      confirmLabel: 'Close',
      onConfirm: () => showToast({ type: 'info', title: 'Form would open here', body: 'Scholar creation form.' }),
    });
  }

  function handleGenerateReport() {
    showToast({ type: 'success', title: 'Generating Report', body: 'Scholar records report is being compiled.' });
  }

  const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary hover:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac/30">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-1 min-w-44 flex-col gap-1">
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Search scholars</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or student ID…"
              className="w-full rounded-xl border border-lilac/20 bg-surface pl-8 pr-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-lilac/30" />
          </div>
        </div>
        <FilterSelect label="Academic year" value={ay} onChange={setAy} options={AY_OPTS} />
        <FilterSelect label="College" value={college} onChange={v => { setCollege(v); setProgram('All'); }} options={COLLEGE_OPTS} />
        <FilterSelect label="Program" value={program} onChange={setProgram} options={programOpts} />
        <FilterSelect label="Grant program" value={grant} onChange={setGrant} options={GRANT_OPTS} />
        <button onClick={() => { setSearch(''); setAy('All'); setCollege('All'); setProgram('All'); setGrant('All'); }}
          className="rounded-xl px-3 py-2 text-xs text-muted hover:text-primary hover:bg-lilac/10 transition-colors">Reset</button>
        <button onClick={() => setShowArchive(!showArchive)}
          className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${showArchive ? 'bg-obsidian/10 text-obsidian' : 'border border-lilac/20 text-muted hover:border-lilac'}`}>
          {showArchive ? '← Active Records' : 'Archive Vault'}
        </button>
        <button onClick={handleGenerateReport} className="rounded-xl px-4 py-2 text-xs font-semibold border border-lilac/20 text-primary hover:bg-lilac/10 transition-colors">Generate Report</button>
        {!showArchive && <button onClick={handleAddScholar} className="rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">+ Add Scholar</button>}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-lilac/10 flex items-center gap-3">
          <p className="text-sm font-bold text-primary">{showArchive ? 'Archive Vault' : 'Scholar Roster'}</p>
          <span className="rounded-full bg-lilac/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">{filtered.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface border-b border-lilac/10">
                <th className="px-3 py-3 w-8"><input type="checkbox" className="rounded" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(s => s.id)) : new Set())} /></th>
                <th className="px-3 py-3 text-left font-semibold text-muted">Student ID</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">Last Name</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">First Name</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">M.I.</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">College</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">Program</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">Grant</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">GPA</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">Standing</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">Status</th>
                <th className="px-3 py-3 text-left font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className={`border-b border-lilac/5 hover:bg-surface transition-colors ${selected.has(s.id) ? 'bg-lilac/5' : ''}`}>
                  <td className="px-3 py-3"><input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} className="rounded" /></td>
                  <td className="px-3 py-3 font-mono text-primary">{s.studentId}</td>
                  <td className="px-3 py-3 font-semibold text-primary">{s.lastName}</td>
                  <td className="px-3 py-3 text-primary">{s.firstName}</td>
                  <td className="px-3 py-3 text-muted">{s.middleName}</td>
                  <td className="px-3 py-3"><span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: '#20203010', color: '#200D2D' }}>{s.college}</span></td>
                  <td className="px-3 py-3 text-muted">{s.program}</td>
                  <td className="px-3 py-3 text-primary font-medium">{s.grant}</td>
                  <td className="px-3 py-3 font-mono font-bold text-primary">{s.gpa.toFixed(2)}</td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STANDING_STYLES[s.standing]}`}>{s.standing}</span></td>
                  <td className="px-3 py-3"><span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLES[s.status]}`}>{s.status}</span></td>
                  <td className="px-3 py-3">
                    {showArchive ? (
                      <ActionBtn title="Restore Scholar" onClick={() => handleRestore(s.id, `${s.firstName} ${s.lastName}`)} variant="success">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </ActionBtn>
                    ) : (
                      <div className="flex gap-1.5">
                        <ActionBtn title="View Profile" onClick={() => showToast({ type: 'info', title: 'View Profile', body: `Viewing ${s.firstName} ${s.lastName}` })} variant="default">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/></svg>
                        </ActionBtn>
                        <ActionBtn title="Edit Record" onClick={() => showToast({ type: 'info', title: 'Edit Mode', body: `Editing ${s.firstName} ${s.lastName}` })} variant="warning">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </ActionBtn>
                        <ActionBtn title="Archive Record" onClick={() => handleArchive(s.id, `${s.firstName} ${s.lastName}`)} variant="danger">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="21 8 21 21 3 21 3 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="3" width="22" height="5" rx="1" stroke="currentColor" strokeWidth="1.6"/><line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                        </ActionBtn>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="px-4 py-10 text-center text-muted text-xs">No records match the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
