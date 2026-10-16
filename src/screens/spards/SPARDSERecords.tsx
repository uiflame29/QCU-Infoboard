import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

type DocStatus = 'VERIFIED' | 'PENDING' | 'RENEWAL';
type DocCategory = 'Academic Grade Slip' | 'Indigency Certificate' | 'Enrollment Verification' | 'Oath of Undertaking';

interface Document {
  id: string;
  scholarName: string;
  studentId: string;
  title: string;
  category: DocCategory;
  format: string;
  size: string;
  dateUploaded: string;
  status: DocStatus;
}

const DOCS: Document[] = [
  { id: '1', scholarName: 'Naya Alia', studentId: '23-2652', title: 'QCYDO_GradeSlip_2026.pdf', category: 'Academic Grade Slip', format: 'PDF', size: '1.8 MB', dateUploaded: '09/01/2026', status: 'VERIFIED' },
  { id: '2', scholarName: 'Anastasha', studentId: '20-2121', title: 'Cert_Indigency_2026.pdf', category: 'Indigency Certificate', format: 'PDF', size: '1.2 MB', dateUploaded: '09/03/2026', status: 'RENEWAL' },
  { id: '3', scholarName: 'Bryan Ramos', studentId: '22-1089', title: 'EnrollVerif_2026.pdf', category: 'Enrollment Verification', format: 'PDF', size: '0.9 MB', dateUploaded: '09/05/2026', status: 'VERIFIED' },
  { id: '4', scholarName: 'Carla Santos', studentId: '21-3340', title: 'Oath_Undertaking_2026.pdf', category: 'Oath of Undertaking', format: 'PDF', size: '0.5 MB', dateUploaded: '09/06/2026', status: 'VERIFIED' },
  { id: '5', scholarName: 'Daniel Cruz', studentId: '23-0789', title: 'GradeSlip_Q1_2026.pdf', category: 'Academic Grade Slip', format: 'PDF', size: '2.1 MB', dateUploaded: '09/08/2026', status: 'PENDING' },
  { id: '6', scholarName: 'Elena Reyes', studentId: '22-5512', title: 'Cert_Indigency_COED.pdf', category: 'Indigency Certificate', format: 'PDF', size: '1.0 MB', dateUploaded: '09/10/2026', status: 'VERIFIED' },
  { id: '7', scholarName: 'Franz Bautista', studentId: '20-4421', title: 'EnrollVerif_CCS.pdf', category: 'Enrollment Verification', format: 'PDF', size: '0.8 MB', dateUploaded: '09/12/2026', status: 'PENDING' },
  { id: '8', scholarName: 'Grace Lim', studentId: '23-9900', title: 'QCYDO_Oath_2026.pdf', category: 'Oath of Undertaking', format: 'PDF', size: '0.4 MB', dateUploaded: '09/14/2026', status: 'VERIFIED' },
  { id: '9', scholarName: 'Harold Torres', studentId: '22-3301', title: 'COA_GradeSlip_2026.pdf', category: 'Academic Grade Slip', format: 'PDF', size: '1.6 MB', dateUploaded: '09/15/2026', status: 'VERIFIED' },
  { id: '10', scholarName: 'Isabel Aquino', studentId: '21-7765', title: 'Indigency_CCS_2026.pdf', category: 'Indigency Certificate', format: 'PDF', size: '1.3 MB', dateUploaded: '09/16/2026', status: 'RENEWAL' },
];

const CATEGORY_OPTS: string[] = ['All', 'Academic Grade Slip', 'Indigency Certificate', 'Enrollment Verification', 'Oath of Undertaking'];

const STATUS_STYLES: Record<DocStatus, string> = {
  VERIFIED: 'bg-coa/10 text-coa',
  PENDING: 'bg-lilac/15 text-primary',
  RENEWAL: 'bg-golden/20 text-amber-700',
};

const CAT_ICONS: Record<DocCategory, React.ReactNode> = {
  'Academic Grade Slip': <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 8l9 5 9-5-9-5z" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 11.5V16L12 20l6.5-4v-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  'Indigency Certificate': <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5"/></svg>,
  'Enrollment Verification': <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  'Oath of Undertaking': <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

export default function SPARDSERecords() {
  const { showToast, showModal } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => DOCS.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.scholarName.toLowerCase().includes(q) || d.studentId.includes(q) || d.title.toLowerCase().includes(q);
    const matchCat = category === 'All' || d.category === category;
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  }), [search, category, statusFilter]);

  const totalFiles = 13600;
  const verified = 12240;
  const pending = 1360;
  const badges = 6800;

  function handleView(doc: Document) {
    showModal({
      title: doc.title,
      message: `Scholar: ${doc.scholarName} (${doc.studentId})\nCategory: ${doc.category}\nFormat: ${doc.format} · ${doc.size}\nUploaded: ${doc.dateUploaded}\nVerification Status: ${doc.status}\n\nIn production, the PDF document viewer would open here displaying the full verified file.`,
      confirmLabel: 'Close',
      onConfirm: () => {},
    });
  }

  function handleVerify(doc: Document) {
    showModal({
      title: 'Verify Document',
      message: `Mark "${doc.title}" as VERIFIED for scholar ${doc.scholarName}? This action will be logged in the audit trail.`,
      confirmLabel: 'Verify Document',
      onConfirm: () => showToast({ type: 'success', title: 'Document Verified', body: `${doc.title} has been marked as verified.` }),
    });
  }

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Digitized E-Files', value: totalFiles.toLocaleString(), accent: '#200D2D' },
          { label: 'Verified Documents', value: verified.toLocaleString(), accent: '#00875A' },
          { label: 'Pending Verification', value: pending.toLocaleString(), accent: '#FFD066' },
          { label: 'Active Scholar Badges', value: badges.toLocaleString(), accent: '#BB96E4' },
        ].map(k => (
          <div key={k.label} className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5 hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{k.label}</p>
            <p className="text-3xl font-extrabold mt-1" style={{ color: k.accent }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search scholar name, student ID, document title…"
            className="w-full rounded-xl border border-lilac/20 bg-surface pl-8 pr-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-lilac/30" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary focus:outline-none focus:ring-2 focus:ring-lilac/30">
          {CATEGORY_OPTS.map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary focus:outline-none focus:ring-2 focus:ring-lilac/30">
          {['All', 'VERIFIED', 'PENDING', 'RENEWAL'].map(o => <option key={o}>{o}</option>)}
        </select>
        <button onClick={() => showToast({ type: 'success', title: 'Exported', body: 'E-Records vault data exported.' })} className="ml-auto rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">Export Vault</button>
      </div>

      {/* Documents table */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-lilac/10 flex items-center gap-3">
          <p className="text-sm font-bold text-primary">Scholar E-Records Vault</p>
          <span className="rounded-full bg-lilac/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">{filtered.length} documents</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface border-b border-lilac/10">
                <th className="px-4 py-3 text-left font-semibold text-muted">Scholar Name</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Student ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Document Title</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Format & Size</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Date Uploaded</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} className="border-b border-lilac/5 hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-semibold text-primary">{doc.scholarName}</td>
                  <td className="px-4 py-3 font-mono text-muted">{doc.studentId}</td>
                  <td className="px-4 py-3 text-primary max-w-44 truncate" title={doc.title}>{doc.title}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className="text-muted">{CAT_ICONS[doc.category]}</span>
                      <span className="truncate max-w-32">{doc.category}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{doc.format} · {doc.size}</td>
                  <td className="px-4 py-3 text-muted">{doc.dateUploaded}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLES[doc.status]}`}>{doc.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => handleView(doc)} className="rounded-lg px-2.5 py-1 text-[10px] font-bold bg-lilac/10 text-primary hover:bg-lilac/20 transition-colors">View</button>
                      {doc.status === 'PENDING' && (
                        <button onClick={() => handleVerify(doc)} className="rounded-lg px-2.5 py-1 text-[10px] font-bold bg-coa/10 text-coa hover:bg-coa/20 transition-colors">Verify</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted text-xs">No documents match the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
