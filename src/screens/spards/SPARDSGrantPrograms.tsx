import { useState } from 'react';
import { useApp } from '../../context/AppContext';

type GrantStatus = 'Active' | 'Suspended' | 'Review';

interface GrantProgram {
  id: string;
  code: string;
  name: string;
  provider: string;
  type: string;
  scholars: number;
  budget: string;
  stipend: string;
  gpaReq: number;
  status: GrantStatus;
  renewalDate: string;
}

const GRANTS: GrantProgram[] = [
  { id: '1', code: 'QCYDO-LGU', name: 'QCYDO Municipal Scholarship', provider: 'Quezon City Youth Development Office', type: 'LGU Municipal Grant', scholars: 4000, budget: '₱40.0M', stipend: '₱10,000/sem', gpaReq: 2.25, status: 'Active', renewalDate: '03/31/2027' },
  { id: '2', code: 'UNIFAST-TES', name: 'UNIFAST Tertiary Education Subsidy', provider: 'CHED / UNIFAST', type: 'National State Grant', scholars: 2000, budget: '₱30.0M', stipend: '₱15,000/sem', gpaReq: 2.00, status: 'Active', renewalDate: '06/30/2027' },
  { id: '3', code: 'CHED-SCH', name: 'CHED Merit Scholarship', provider: 'Commission on Higher Education', type: 'Merit-Based State Grant', scholars: 500, budget: '₱10.0M', stipend: '₱20,000/sem', gpaReq: 1.75, status: 'Active', renewalDate: '12/31/2026' },
  { id: '4', code: 'ACADEMIC-HONORS', name: 'Academic Excellence Award', provider: 'QCU Internal', type: "Dean's Lister Incentive", scholars: 280, budget: '₱1.4M', stipend: '₱5,000/sem', gpaReq: 1.50, status: 'Active', renewalDate: '12/31/2026' },
  { id: '5', code: 'LGU-PRIVATE', name: 'LGU/Corporate Partner Grants', provider: 'Various Sponsors', type: 'Private/Institutional', scholars: 300, budget: '₱3.0M', stipend: '₱10,000/sem', gpaReq: 2.50, status: 'Review', renewalDate: '01/31/2027' },
  { id: '6', code: 'ATHLETIC-CULT', name: 'Sports & Cultural Excellence Grant', provider: 'QCU Internal / CHED', type: 'Non-Academic Merit', scholars: 120, budget: '₱0.6M', stipend: '₱5,000/sem', gpaReq: 2.75, status: 'Active', renewalDate: '06/30/2027' },
];

const STATUS_STYLES: Record<GrantStatus, string> = {
  Active: 'bg-coa/10 text-coa',
  Suspended: 'bg-obsidian/10 text-obsidian',
  Review: 'bg-golden/20 text-amber-700',
};

export default function SPARDSGrantPrograms() {
  const { showToast, showModal } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = GRANTS.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = !q || g.name.toLowerCase().includes(q) || g.code.toLowerCase().includes(q) || g.provider.toLowerCase().includes(q);
    const matchStatus = status === 'All' || g.status === status;
    return matchSearch && matchStatus;
  });

  const totalScholars = GRANTS.reduce((sum, g) => sum + g.scholars, 0);

  function handleView(g: GrantProgram) {
    showModal({
      title: g.name,
      message: `Provider: ${g.provider}\nType: ${g.type}\nTotal Scholars: ${g.scholars.toLocaleString()}\nBudget Allocation: ${g.budget}\nStipend Amount: ${g.stipend}\nMinimum GPA Requirement: ${g.gpaReq.toFixed(2)}\nRenewal Date: ${g.renewalDate}\nStatus: ${g.status}`,
      confirmLabel: 'Close',
      onConfirm: () => {},
    });
  }

  function handleSuspend(g: GrantProgram) {
    showModal({
      title: `Suspend ${g.code} Grant Program`,
      message: `This will suspend the ${g.name} for ${g.scholars.toLocaleString()} active scholars. Disbursements will be paused until reinstatement. Continue?`,
      confirmLabel: 'Suspend',
      variant: 'danger',
      onConfirm: () => showToast({ type: 'warning', title: 'Grant Suspended', body: `${g.name} has been suspended.` }),
    });
  }

  return (
    <div className="space-y-5">
      {/* KPI summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Total Programs</p>
          <p className="text-3xl font-extrabold text-primary mt-1">{GRANTS.length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Active Programs</p>
          <p className="text-3xl font-extrabold text-coa mt-1">{GRANTS.filter(g => g.status === 'Active').length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Total Beneficiaries</p>
          <p className="text-3xl font-extrabold text-primary mt-1">{totalScholars.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Under Review</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-1">{GRANTS.filter(g => g.status === 'Review').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-1 min-w-44 flex-col gap-1">
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Search programs</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search grant programs…"
              className="w-full rounded-xl border border-lilac/20 bg-surface pl-8 pr-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-lilac/30" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Program status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="rounded-xl border border-lilac/20 bg-white px-3 py-2 text-xs font-medium text-primary focus:outline-none focus:ring-2 focus:ring-lilac/30">
            {['All', 'Active', 'Suspended', 'Review'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <button onClick={() => showToast({ type: 'info', title: 'Add Grant Program', body: 'Form would open here.' })} className="ml-auto rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">+ Add Program</button>
      </div>

      {/* Grant program cards */}
      <div className="space-y-3">
        {filtered.map(g => (
          <div key={g.id} className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap gap-4 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="rounded-full bg-primary/8 text-primary px-3 py-0.5 text-[10px] font-bold font-mono">{g.code}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLES[g.status]}`}>{g.status}</span>
                </div>
                <p className="text-sm font-bold text-primary">{g.name}</p>
                <p className="text-xs text-muted mt-0.5">{g.provider} · {g.type}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-muted">Scholars</p>
                  <p className="text-lg font-bold text-primary">{g.scholars.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted">Budget</p>
                  <p className="text-lg font-bold text-coa">{g.budget}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted">Stipend</p>
                  <p className="text-sm font-bold text-primary">{g.stipend}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted">Min GPA</p>
                  <p className="text-lg font-bold text-primary">{g.gpaReq.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => handleView(g)} className="rounded-xl px-3 py-2 text-[11px] font-semibold bg-lilac/10 text-primary hover:bg-lilac/20 transition-colors">View</button>
                <button onClick={() => showToast({ type: 'info', title: 'Edit Grant', body: `Editing ${g.code}` })} className="rounded-xl px-3 py-2 text-[11px] font-semibold bg-golden/15 text-primary hover:bg-golden/25 transition-colors">Edit</button>
                {g.status === 'Active' && <button onClick={() => handleSuspend(g)} className="rounded-xl px-3 py-2 text-[11px] font-semibold bg-obsidian/10 text-obsidian hover:bg-obsidian/20 transition-colors">Suspend</button>}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-lilac/10 flex items-center gap-4 text-[10px] text-muted">
              <span>Renewal Date: <strong className="text-primary">{g.renewalDate}</strong></span>
              <span>Min GPA Requirement: <strong className="text-primary">{g.gpaReq.toFixed(2)}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
