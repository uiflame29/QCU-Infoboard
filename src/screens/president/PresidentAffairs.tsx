import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';

type Announcement = { id: string; title: string; documentType: 'Presidential Memorandum' | 'Executive Order' | 'Policy Circular' | 'Campus Advisory'; priority: 'Routine' | 'Urgent' | 'Confidential'; owner: string; target: 'All Personnel' | 'Deans Only' | 'Student Body'; reach: number; response: string; issued: string; acknowledged: boolean };
type ApprovalStatus = 'Pending Review' | 'Under Legal/Fiscal Verification' | 'Requires Revision' | 'Approved';
type Approval = { id: string; title: string; type: 'Budget Re-allocation' | 'MOU' | 'Infrastructure' | 'Procurement' | 'Policy Exception'; owner: string; amount?: string; submitted: string; risk: string; status: ApprovalStatus };

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'PM-2026-041', title: 'University-wide data privacy compliance directive', documentType: 'Presidential Memorandum', priority: 'Confidential', owner: 'Office of the President', target: 'All Personnel', reach: 98.4, response: '18 min avg.', issued: 'Sep 28, 2026', acknowledged: false },
  { id: 'EO-2026-009', title: 'Institutional Accreditation Phase 2 readiness week', documentType: 'Executive Order', priority: 'Urgent', owner: 'Quality Assurance Office', target: 'Deans Only', reach: 94.8, response: '26 min avg.', issued: 'Sep 26, 2026', acknowledged: false },
  { id: 'PC-2026-039', title: 'Updated sustainable campus operations protocol', documentType: 'Policy Circular', priority: 'Urgent', owner: 'Administrative Affairs', target: 'All Personnel', reach: 91.2, response: '42 min avg.', issued: 'Sep 22, 2026', acknowledged: true },
  { id: 'CA-2026-113', title: 'University research and innovation summit', documentType: 'Campus Advisory', priority: 'Routine', owner: 'Research Extension Office', target: 'Student Body', reach: 87.6, response: '1.4 hr avg.', issued: 'Sep 18, 2026', acknowledged: true },
];

const INITIAL_APPROVALS: Approval[] = [
  { id: 'POL-26-018', title: 'Revised Flexible Learning Policy Exception', type: 'Policy Exception', owner: 'VP Academic Affairs', submitted: 'Sep 27, 2026 · 09:42 AM', risk: 'Medium — CHED alignment review required.', status: 'Pending Review' },
  { id: 'BUD-26-074', title: 'Engineering Laboratory Fund Re-allocation', type: 'Budget Re-allocation', owner: 'VP Administration', amount: 'PHP 18.4M', submitted: 'Sep 26, 2026 · 02:18 PM', risk: 'High — moves 14% of equipment reserve.', status: 'Pending Review' },
  { id: 'MOU-26-015', title: 'Quezon City Industry Linkage Agreement', type: 'MOU', owner: 'External Affairs Office', submitted: 'Sep 24, 2026 · 11:06 AM', risk: 'Low — standard data-sharing clauses verified.', status: 'Under Legal/Fiscal Verification' },
  { id: 'INF-26-069', title: 'Campus Connectivity Expansion', type: 'Infrastructure', owner: 'MIS Office', amount: 'PHP 9.8M', submitted: 'Sep 21, 2026 · 03:40 PM', risk: 'Medium — phased procurement recommended.', status: 'Under Legal/Fiscal Verification' },
  { id: 'PRC-26-032', title: 'Library Database Emergency Procurement', type: 'Procurement', owner: 'University Library', amount: 'PHP 2.6M', submitted: 'Sep 19, 2026 · 08:15 AM', risk: 'High — sole-source justification incomplete.', status: 'Requires Revision' },
  { id: 'POL-26-011', title: 'First-Generation Student Support Charter', type: 'Policy Exception', owner: 'Student Affairs', submitted: 'Sep 16, 2026 · 10:20 AM', risk: 'Low — compliance review completed.', status: 'Approved' },
];

function Icon({ type }: { type: 'broadcast' | 'approval' }) {
  return type === 'broadcast'
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 11v2m4-6a7 7 0 000 10m4-14a11 11 0 000 18M21 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.6"/><path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}

export default function PresidentAffairs({ view }: { view: 'announcements' | 'approvals' }) {
  const { showModal, showToast } = useApp();
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [priority, setPriority] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const filteredAnnouncements = useMemo(() => announcements.filter(item => priority === 'All' || item.priority === priority), [announcements, priority]);

  function acknowledge(item: Announcement) {
    setAnnouncements(previous => previous.map(row => row.id === item.id ? { ...row, acknowledged: true, reach: 100 } : row));
    showToast({ type: 'success', title: 'Directive acknowledged', body: `${item.id} was added to the President's acknowledgment log.` });
    setSelectedAnnouncement(null);
  }

  function updateApproval(item: Approval, status: 'Approved' | 'Requires Revision') {
    showModal({
      title: status === 'Approved' ? 'Approve executive item' : 'Require revision',
      message: `${status === 'Approved' ? 'Approve' : 'Return'} ${item.id} — ${item.title}? This decision will be timestamped in the institutional audit trail logs.`,
      confirmLabel: status === 'Approved' ? 'Approve' : 'Request Revision',
      variant: status === 'Approved' ? 'default' : 'danger',
      onConfirm: () => {
        setApprovals(previous => previous.map(row => row.id === item.id ? { ...row, status } : row));
        showToast({ type: status === 'Approved' ? 'success' : 'warning', title: status === 'Approved' ? 'Item approved' : 'Revision requested', body: `${item.id} is now ${status}.` });
      },
    });
  }

  if (view === 'announcements') {
    return (
      <div className="space-y-5">
        <section className="flex flex-col gap-4 rounded-3xl border border-lilac/20 bg-white p-5 text-primary shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lilac/15 text-lilac"><Icon type="broadcast" /></span><span><span className="block text-lg font-bold">Executive Communications Register</span><span className="mt-1 block text-xs text-muted">Priority-coded delivery reach and departmental acknowledgment logs.</span></span></div>
          <button type="button" onClick={() => showToast({ type: 'success', title: 'Directive draft created', body: 'A new executive communication workspace is ready.' })} className="rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5">Create Directive</button>
        </section>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[['Issued Documents', announcements.length.toString()], ['Average Reach', '93.0%'], ['Acknowledged', `${announcements.filter(item => item.acknowledged).length}/${announcements.length}`], ['Urgent Pending', announcements.filter(item => item.priority === 'Urgent' && !item.acknowledged).length.toString()]].map(([label, value], index) => <button key={label} type="button" onClick={() => index === 3 && setPriority('Urgent')} className="rounded-2xl border border-lilac/20 bg-white p-4 text-left text-primary shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</span><span className={`mt-2 block text-2xl font-bold ${index === 1 ? 'text-lilac' : index === 3 ? 'text-obsidian' : 'text-primary'}`}>{value}</span></button>)}
        </div>

        <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-lilac/15 p-5">
            <div><p className="text-sm font-bold text-primary">Announcements & Directives</p><p className="mt-1 text-[10px] text-muted">Select a row to inspect its acknowledgment profile.</p></div>
            <div className="flex gap-2">{['All', 'Routine', 'Urgent', 'Confidential'].map(option => <button type="button" key={option} onClick={() => setPriority(option)} className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${priority === option ? 'bg-primary text-white' : 'border border-lilac/20 text-muted hover:border-lilac'}`}>{option}</button>)}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-primary/[.04] text-muted"><tr>{['Reference', 'Document', 'Priority / Audience', 'Issued', 'Read & Acknowledgment', 'Response'].map(header => <th key={header} className="p-3 text-left text-[9px] font-bold uppercase tracking-wider">{header}</th>)}</tr></thead>
              <tbody>{filteredAnnouncements.map((item, index) => <tr key={item.id} onClick={() => setSelectedAnnouncement(item)} className={`cursor-pointer border-t border-lilac/10 text-primary transition-colors hover:bg-blossom/25 ${index % 2 ? 'bg-surface/45' : 'bg-white'}`}><td className="p-3 font-mono text-[10px] text-lilac">{item.id}</td><td className="min-w-64 p-3"><p className="font-semibold">{item.title}</p><p className="mt-1 text-[9px] text-muted">{item.documentType} · {item.owner}</p></td><td className="p-3"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${item.priority === 'Confidential' ? 'bg-obsidian text-white' : item.priority === 'Urgent' ? 'bg-golden text-primary' : 'bg-lilac/20 text-lilac'}`}>{item.priority}</span><p className="mt-1.5 text-[9px] text-muted">{item.target}</p></td><td className="p-3 text-muted">{item.issued}</td><td className="min-w-40 p-3"><div className="flex items-center gap-2"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-lilac/10"><span className="block h-full rounded-full bg-lilac" style={{ width: `${item.reach}%` }} /></span><strong className="text-primary">{item.reach}%</strong></div><p className="mt-1 text-[9px] text-muted">{item.acknowledged ? 'Acknowledged' : 'Awaiting response'}</p></td><td className="p-3 font-semibold text-primary">{item.response}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {selectedAnnouncement && <div className="fixed inset-0 z-[250] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => event.target === event.currentTarget && setSelectedAnnouncement(null)}><section className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">{selectedAnnouncement.id} · {selectedAnnouncement.documentType}</p><p className="mt-2 text-lg font-bold text-primary">{selectedAnnouncement.title}</p></div><button type="button" onClick={() => setSelectedAnnouncement(null)} className="h-9 w-9 rounded-xl bg-surface text-muted">×</button></div><div className="mt-5 grid grid-cols-2 gap-3">{[['Issuing Office', selectedAnnouncement.owner], ['Priority', selectedAnnouncement.priority], ['Target Recipients', selectedAnnouncement.target], ['Date Issued', selectedAnnouncement.issued], ['Acknowledgment Reach', `${selectedAnnouncement.reach}%`], ['Average Response', selectedAnnouncement.response]].map(([label, value]) => <div key={label} className="rounded-2xl bg-surface p-3"><p className="text-[9px] uppercase text-muted">{label}</p><p className="mt-1 text-xs font-bold text-primary">{value}</p></div>)}</div>{!selectedAnnouncement.acknowledged && <button type="button" onClick={() => acknowledge(selectedAnnouncement)} className="mt-5 w-full rounded-2xl bg-primary py-3 text-xs font-bold text-white">Acknowledge Directive</button>}</section></div>}
      </div>
    );
  }

  const columns: ApprovalStatus[] = ['Pending Review', 'Under Legal/Fiscal Verification', 'Requires Revision', 'Approved'];
  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-3xl border border-lilac/20 bg-white p-5 text-primary shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lilac/15 text-lilac"><Icon type="approval" /></span><span><span className="block text-lg font-bold">Executive Approvals Queue</span><span className="mt-1 block text-xs text-muted">Policy changes and budget sign-offs requiring presidential action.</span></span></div><span className="rounded-full border border-golden/40 bg-golden/20 px-3 py-1.5 text-[10px] font-bold text-primary">{approvals.filter(item => !['Approved', 'Requires Revision'].includes(item.status)).length} decisions pending</span></section>
      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map(column => <section key={column} className="min-h-96 rounded-3xl border border-lilac/20 bg-white p-4 shadow-sm"><div className="mb-4 flex items-center justify-between"><p className="text-xs font-bold text-primary">{column}</p><span className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-lilac/15 px-1.5 text-[9px] font-bold text-primary">{approvals.filter(item => item.status === column).length}</span></div><div className="space-y-3">{approvals.filter(item => item.status === column).map(item => <article key={item.id} className="rounded-2xl border border-lilac/15 bg-surface/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"><div className="flex justify-between gap-2"><span className="rounded-lg bg-primary px-2 py-1 text-[8px] font-bold text-white">{item.type}</span><span className="font-mono text-[8px] text-muted">{item.id}</span></div><p className="mt-3 text-xs font-bold leading-relaxed text-primary">{item.title}</p><p className="mt-2 text-[9px] text-muted">{item.owner}</p><p className="mt-1 text-[8px] text-muted">{item.submitted}</p>{item.amount && <p className="mt-2 text-sm font-bold text-coa">{item.amount}</p>}<div className={`mt-3 rounded-xl p-2 text-[9px] leading-relaxed ${item.risk.startsWith('High') ? 'bg-obsidian/10 text-obsidian' : item.risk.startsWith('Medium') ? 'bg-golden/20 text-primary' : 'bg-coa/10 text-coa'}`}><strong>Automated risk:</strong> {item.risk}</div>{!['Approved', 'Requires Revision'].includes(column) && <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => updateApproval(item, 'Requires Revision')} className="rounded-xl border border-obsidian/20 px-2 py-2 text-[9px] font-bold text-obsidian hover:bg-obsidian/10">Require Revision</button><button type="button" onClick={() => updateApproval(item, 'Approved')} className="rounded-xl bg-lilac px-2 py-2 text-[9px] font-bold text-primary hover:bg-golden">Approve</button></div>}</article>)}</div></section>)}
      </div>
    </div>
  );
}
