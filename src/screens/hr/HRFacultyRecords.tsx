import { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface FacultyRecord {
  id: string;
  empId: string;
  lastName: string;
  firstName: string;
  middleName: string;
  department: string;
  empType: string;
  position: string;
  status: 'Active' | 'On Leave' | 'Resigned';
  dateHired: string;
  archived?: boolean;
}

const INITIAL_RECORDS: FacultyRecord[] = [
  { id: '1', empId: 'EMP-23-0001', lastName: 'Dela Cruz', firstName: 'Juan', middleName: 'Reyes', department: 'CCS', empType: 'Full-Time', position: 'Instructor I', status: 'Active', dateHired: '08/01/2021' },
  { id: '2', empId: 'EMP-23-0002', lastName: 'Santos', firstName: 'Maria', middleName: 'Garcia', department: 'COE', empType: 'Part-Time', position: 'Instructor II', status: 'Active', dateHired: '06/15/2022' },
  { id: '3', empId: 'EMP-23-0003', lastName: 'Cruz', firstName: 'Roberto', middleName: 'Lim', department: 'COA', empType: 'Full-Time', position: 'Assistant Professor I', status: 'On Leave', dateHired: '01/10/2019' },
  { id: '4', empId: 'EMP-23-0004', lastName: 'Lim', firstName: 'Ana', middleName: 'Torres', department: 'COB', empType: 'Full-Time', position: 'Associate Professor II', status: 'Active', dateHired: '03/20/2015' },
  { id: '5', empId: 'EMP-23-0005', lastName: 'Garcia', firstName: 'Paulo', middleName: 'Bautista', department: 'COED', empType: 'Full-Time', position: 'Assistant Professor II', status: 'Active', dateHired: '07/01/2020' },
  { id: '6', empId: 'EMP-23-0006', lastName: 'Reyes', firstName: 'Carmen', middleName: 'Aquino', department: 'CCS', empType: 'Part-Time', position: 'Instructor III', status: 'Active', dateHired: '09/01/2023' },
  { id: '7', empId: 'EMP-23-0007', lastName: 'Torres', firstName: 'Andres', middleName: 'Dela Rosa', department: 'COE', empType: 'Full-Time', position: 'Full Professor', status: 'Active', dateHired: '05/12/2008' },
  { id: '8', empId: 'EMP-23-0008', lastName: 'Villanueva', firstName: 'Clara', middleName: 'Santiago', department: 'COB', empType: 'Contractual', position: 'Instructor I', status: 'Resigned', dateHired: '01/05/2024' },
];

const STATUS_STYLE: Record<string, string> = {
  'Active': 'bg-green-100 text-green-700',
  'On Leave': 'bg-yellow-100 text-yellow-700',
  'Resigned': 'bg-red-100 text-red-700',
};

const DEPTS = ['All', 'CCS', 'COA', 'COB', 'COE', 'COED'];
const EMP_TYPES = ['All', 'Full-Time', 'Part-Time', 'Contractual'];

export default function HRFacultyRecords() {
  const { showToast, showModal } = useApp();
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [empType, setEmpType] = useState('All');
  const [showArchived, setShowArchived] = useState(false);

  const filtered = records.filter(r => {
    const active = showArchived ? r.archived : !r.archived;
    const matchSearch = !search || `${r.firstName} ${r.lastName} ${r.empId}`.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || r.department === dept;
    const matchType = empType === 'All' || r.empType === empType;
    return active && matchSearch && matchDept && matchType;
  });

  function handleArchive(rec: FacultyRecord) {
    showModal({
      title: 'Archive Faculty Record',
      message: `Archive the record of ${rec.firstName} ${rec.lastName} (${rec.empId})?`,
      confirmLabel: 'Archive',
      variant: 'danger',
      onConfirm: () => {
        setRecords(prev => prev.map(r => r.id === rec.id ? { ...r, archived: true } : r));
        showToast({ type: 'success', title: 'Record archived.', body: `${rec.firstName} ${rec.lastName} moved to archived records.` });
      },
    });
  }

  function handleRestore(rec: FacultyRecord) {
    setRecords(prev => prev.map(r => r.id === rec.id ? { ...r, archived: false } : r));
    showToast({ type: 'success', title: 'Record restored.' });
  }

  function handleReset() {
    setSearch(''); setDept('All'); setEmpType('All');
  }

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-1 min-w-48 flex-col gap-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Search faculty</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-lilac" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or Employee ID…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-lilac/20 text-sm text-primary bg-surface focus:outline-none focus:border-lilac" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Department</label>
            <select value={dept} onChange={e => setDept(e.target.value)} className="rounded-xl border border-lilac/20 px-3 py-2.5 text-sm text-primary bg-surface focus:outline-none focus:border-lilac">
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Employment type</label>
            <select value={empType} onChange={e => setEmpType(e.target.value)} className="rounded-xl border border-lilac/20 px-3 py-2.5 text-sm text-primary bg-surface focus:outline-none focus:border-lilac">
              {EMP_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={handleReset} className="rounded-xl px-4 py-2.5 text-sm font-semibold border border-lilac/20 text-primary hover:bg-blossom/30 transition-colors">Reset Filters</button>
          <button onClick={() => showToast({ type: 'success', title: 'Report generated.' })} className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-lilac/15 text-primary hover:bg-lilac/25 transition-colors">Generate Report</button>
          <button onClick={() => showToast({ type: 'info', title: '+ Add Faculty form opening…' })} className="rounded-xl px-4 py-2.5 text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors">+ Add Faculty</button>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2">
        <button onClick={() => setShowArchived(false)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${!showArchived ? 'bg-primary text-white' : 'bg-white border border-lilac/15 text-muted hover:text-primary'}`}>Active Records</button>
        <button onClick={() => setShowArchived(true)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${showArchived ? 'bg-primary text-white' : 'bg-white border border-lilac/15 text-muted hover:text-primary'}`}>Archived Records</button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-blossom/30">
              <tr>
                <th className="py-3 px-4 text-left"><input type="checkbox" className="accent-primary" /></th>
                {['Employee ID', 'Last Name', 'First Name', 'Middle Name', 'Dept.', 'Employment', 'Position', 'Status', 'Date Hired', 'Actions'].map(h => (
                  <th key={h} className="py-3 px-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} className="py-12 text-center text-sm text-muted">No records found.</td></tr>
              ) : filtered.map(rec => (
                <tr key={rec.id} className="border-t border-lilac/5 hover:bg-blossom/10 transition-colors">
                  <td className="py-3 px-4"><input type="checkbox" className="accent-primary" /></td>
                  <td className="py-3 px-3 font-mono text-primary">{rec.empId}</td>
                  <td className="py-3 px-3 font-medium text-primary">{rec.lastName}</td>
                  <td className="py-3 px-3 text-primary">{rec.firstName}</td>
                  <td className="py-3 px-3 text-muted">{rec.middleName}</td>
                  <td className="py-3 px-3"><span className="rounded-md px-2 py-0.5 bg-lilac/10 text-primary font-semibold">{rec.department}</span></td>
                  <td className="py-3 px-3 text-muted">{rec.empType}</td>
                  <td className="py-3 px-3 text-muted">{rec.position}</td>
                  <td className="py-3 px-3"><span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLE[rec.status]}`}>{rec.status}</span></td>
                  <td className="py-3 px-3 text-muted font-mono">{rec.dateHired}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {showArchived ? (
                        <button onClick={() => handleRestore(rec)} className="rounded-lg px-2.5 py-1 text-[10px] font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-colors">Restore</button>
                      ) : (
                        <>
                          <button onClick={() => showToast({ type: 'info', title: `Viewing ${rec.firstName} ${rec.lastName}…` })} title="View" className="rounded-lg p-1.5 bg-blossom text-primary hover:bg-blossom/70 transition-colors">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                          </button>
                          <button onClick={() => showToast({ type: 'info', title: `Editing ${rec.firstName} ${rec.lastName}…` })} title="Edit" className="rounded-lg p-1.5 bg-lilac/15 text-primary hover:bg-lilac/30 transition-colors">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          </button>
                          <button onClick={() => handleArchive(rec)} title="Archive" className="rounded-lg p-1.5 bg-golden/15 text-primary hover:bg-golden/30 transition-colors">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-lilac/10 flex items-center justify-between">
          <p className="text-xs text-muted">Showing {filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
          <div className="flex gap-1">
            <button className="rounded-lg px-3 py-1.5 text-xs border border-lilac/15 text-muted hover:bg-blossom/20">Previous</button>
            <button className="rounded-lg px-3 py-1.5 text-xs bg-primary text-white">1</button>
            <button className="rounded-lg px-3 py-1.5 text-xs border border-lilac/15 text-muted hover:bg-blossom/20">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
