import { useState } from 'react';
import { useApp } from '../../context/AppContext';

type VaultStatus = 'VERIFIED' | 'RENEWAL' | 'PENDING';

interface VaultDoc {
  id: string;
  faculty: string;
  title: string;
  category: string;
  format: string;
  size: string;
  uploaded: string;
  status: VaultStatus;
}

const DOCS: VaultDoc[] = [
  { id: '1', faculty: 'Juan Dela Cruz', title: 'Service Record 2025', category: 'Employment', format: 'PDF', size: '1.2 MB', uploaded: '09/01/2026', status: 'VERIFIED' },
  { id: '2', faculty: 'Maria Santos', title: 'Master\'s Degree Diploma', category: 'Credentials', format: 'PDF', size: '3.4 MB', uploaded: '08/15/2026', status: 'VERIFIED' },
  { id: '3', faculty: 'Roberto Cruz', title: 'PRC License 2025', category: 'Licensure', format: 'PDF', size: '0.8 MB', uploaded: '07/30/2026', status: 'RENEWAL' },
  { id: '4', faculty: 'Ana Lim', title: 'Performance Rating AY2025', category: 'Evaluation', format: 'XLSX', size: '0.5 MB', uploaded: '09/10/2026', status: 'VERIFIED' },
  { id: '5', faculty: 'Paulo Garcia', title: 'Doctoral Certificate', category: 'Credentials', format: 'PDF', size: '2.8 MB', uploaded: '06/20/2026', status: 'PENDING' },
  { id: '6', faculty: 'Carmen Reyes', title: 'Leave of Absence Form', category: 'HR Forms', format: 'PDF', size: '0.3 MB', uploaded: '09/25/2026', status: 'PENDING' },
  { id: '7', faculty: 'Andres Torres', title: 'Appointment Letter', category: 'Employment', format: 'PDF', size: '0.6 MB', uploaded: '01/15/2026', status: 'VERIFIED' },
  { id: '8', faculty: 'Clara Villanueva', title: 'CHED Scholarship Certificate', category: 'Credentials', format: 'PDF', size: '1.1 MB', uploaded: '08/05/2026', status: 'RENEWAL' },
];

const STATUS_STYLE: Record<VaultStatus, string> = {
  VERIFIED: 'bg-green-100 text-green-700 border-green-200',
  RENEWAL: 'bg-orange-100 text-orange-700 border-orange-200',
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export default function HRFacultyERecords() {
  const { showToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | VaultStatus>('All');

  const filtered = DOCS.filter(d => {
    const matchSearch = !search || `${d.faculty} ${d.title}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Files', value: '1,250', color: '#200D2D' },
          { label: 'Verified', value: '1,100', color: '#16a34a' },
          { label: 'Pending', value: '120', color: '#ca8a04' },
          { label: 'Active RFID Badges', value: '240', color: '#BB96E4' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5 flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">{label}</p>
            <p className="text-3xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-lilac" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faculty name, document title, or status…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-lilac/20 text-sm text-primary bg-surface focus:outline-none focus:border-lilac" />
        </div>
        <div className="flex gap-2">
          {(['All', 'VERIFIED', 'RENEWAL', 'PENDING'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'border border-lilac/15 text-muted hover:bg-blossom/30'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Document Table */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-blossom/30">
              <tr>
                {['Faculty Name', 'Document Title', 'Category', 'Format & Size', 'Date Uploaded', 'Status', 'Action'].map(h => (
                  <th key={h} className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-muted">No documents found.</td></tr>
              ) : filtered.map(doc => (
                <tr key={doc.id} className="border-t border-lilac/5 hover:bg-blossom/10 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary">{doc.faculty}</td>
                  <td className="py-3 px-4 text-primary">{doc.title}</td>
                  <td className="py-3 px-4"><span className="rounded-md px-2 py-0.5 bg-lilac/10 text-primary text-[10px] font-semibold">{doc.category}</span></td>
                  <td className="py-3 px-4 font-mono text-muted">{doc.format} · {doc.size}</td>
                  <td className="py-3 px-4 font-mono text-muted">{doc.uploaded}</td>
                  <td className="py-3 px-4"><span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLE[doc.status]}`}>{doc.status}</span></td>
                  <td className="py-3 px-4">
                    <button onClick={() => showToast({ type: 'info', title: `Opening ${doc.title}…` })} className="rounded-lg px-3 py-1.5 text-[11px] font-semibold bg-lilac/15 text-primary hover:bg-lilac/25 transition-colors">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-lilac/10 flex items-center justify-between">
          <p className="text-xs text-muted">Showing {filtered.length} of 1,250 files</p>
          <div className="flex gap-1">
            <button className="rounded-lg px-3 py-1.5 text-xs border border-lilac/15 text-muted hover:bg-blossom/20">Previous</button>
            <button className="rounded-lg px-3 py-1.5 text-xs bg-primary text-white">1</button>
            <button className="rounded-lg px-3 py-1.5 text-xs border border-lilac/15 text-muted hover:bg-blossom/20">2</button>
            <button className="rounded-lg px-3 py-1.5 text-xs border border-lilac/15 text-muted hover:bg-blossom/20">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
