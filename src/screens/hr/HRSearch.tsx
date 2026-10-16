import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ScreenId } from '../../types';

type ResultType = 'faculty' | 'department' | 'document' | 'report';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  badge: string;
  badgeTone: string;
  meta: string;
  college?: string;
  department?: string;
  employmentType?: string;
  rank?: string;
  status?: string;
  destination: ScreenId;
}

const RESULTS: SearchResult[] = [
  { id: '1', type: 'faculty', title: 'Juan Dela Cruz', subtitle: 'EMP-23-0001 · CCS · IT-DEPT · Instructor I', badge: 'Active', badgeTone: '#00875A', meta: 'Full-Time', college: 'CCS', department: 'IT-DEPT', employmentType: 'Full-Time', rank: 'Instructor I', status: 'Active', destination: 'hr-faculty-records' },
  { id: '2', type: 'faculty', title: 'Maria Santos', subtitle: 'EMP-23-0002 · COE · EE-DEPT · Instructor II', badge: 'Active', badgeTone: '#00875A', meta: 'Part-Time', college: 'COE', department: 'EE-DEPT', employmentType: 'Part-Time', rank: 'Instructor II', status: 'Active', destination: 'hr-faculty-records' },
  { id: '3', type: 'faculty', title: 'Roberto Cruz', subtitle: 'EMP-23-0003 · COA · ACCT-DEPT · Assistant Professor I', badge: 'On Leave', badgeTone: '#FFC700', meta: 'Full-Time', college: 'COA', department: 'ACCT-DEPT', employmentType: 'Full-Time', rank: 'Assistant Professor I', status: 'On Leave', destination: 'hr-faculty-records' },
  { id: '4', type: 'faculty', title: 'Ana Lim', subtitle: 'EMP-23-0004 · COB · BUS-DEPT · Associate Professor II', badge: 'Active', badgeTone: '#00875A', meta: 'Full-Time', college: 'COB', department: 'BUS-DEPT', employmentType: 'Full-Time', rank: 'Associate Professor II', status: 'Active', destination: 'hr-faculty-records' },
  { id: '5', type: 'faculty', title: 'Andres Torres', subtitle: 'EMP-23-0007 · COE · IE-DEPT · Full Professor', badge: 'Active', badgeTone: '#00875A', meta: 'Full-Time', college: 'COE', department: 'IE-DEPT', employmentType: 'Full-Time', rank: 'Full Professor', status: 'Active', destination: 'hr-faculty-records' },
  { id: '6', type: 'department', title: 'Information Technology Department', subtitle: 'CCS · IT-DEPT · 48 active faculty members', badge: 'Active', badgeTone: '#00875A', meta: 'CCS', college: 'CCS', department: 'IT-DEPT', status: 'Active', destination: 'hr-college-ccs' },
  { id: '7', type: 'department', title: 'Electrical Engineering Department', subtitle: 'COE · EE-DEPT · 36 active faculty members', badge: 'Active', badgeTone: '#00875A', meta: 'COE', college: 'COE', department: 'EE-DEPT', status: 'Active', destination: 'hr-college-coe' },
  { id: '8', type: 'department', title: 'Accountancy Department', subtitle: 'COA · ACCT-DEPT · 31 active faculty members', badge: 'Active', badgeTone: '#00875A', meta: 'COA', college: 'COA', department: 'ACCT-DEPT', status: 'Active', destination: 'hr-college-coa' },
  { id: '9', type: 'document', title: 'Faculty_Registry_S1.xlsx', subtitle: 'Master faculty registry · AY 2026–2027 · Human Resources', badge: 'Verified', badgeTone: '#00875A', meta: 'XLSX · 2.4 MB', status: 'Active', destination: 'hr-erecords-vault' },
  { id: '10', type: 'document', title: 'CHED_Qualification_Evidence.pdf', subtitle: 'Qualification evidence archive · 240 faculty records', badge: 'Certified', badgeTone: '#BB96E4', meta: 'PDF · 8.1 MB', status: 'Active', destination: 'hr-erecords-vault' },
  { id: '11', type: 'report', title: 'Faculty Profile Summary', subtitle: 'Workforce headcount, demographics, appointment, and rank summary', badge: 'Certified', badgeTone: '#BB96E4', meta: '09/28/2026', status: 'Active', destination: 'hr-reports' },
  { id: '12', type: 'report', title: 'CHED Qualification Compliance Report', subtitle: 'Qualification compliance gaps and academic rank analysis', badge: 'Certified', badgeTone: '#BB96E4', meta: '09/20/2026', status: 'Active', destination: 'hr-reports' },
  { id: '13', type: 'report', title: 'Departmental Teaching Load Audit', subtitle: 'Faculty utilization, overload, and underload analysis', badge: 'Certified', badgeTone: '#BB96E4', meta: '09/15/2026', status: 'Active', destination: 'hr-reports' },
];

const TYPE_LABELS: Record<ResultType, string> = {
  faculty: 'Faculty',
  department: 'Department',
  document: 'Document',
  report: 'Report',
};

const TYPE_COLORS: Record<ResultType, string> = {
  faculty: '#BB96E4',
  department: '#FFD066',
  document: '#4C1413',
  report: '#200D2D',
};

const TYPE_ICONS: Record<ResultType, React.ReactNode> = {
  faculty: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7m1-10a3.5 3.5 0 010-7m1 10c2.7.5 4 2.4 4 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  department: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 12h2m2 0h2m-6 4h2m2 0h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  document: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.6"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6"/></svg>,
  report: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
};

const COLLEGES = ['All', 'CCS', 'COA', 'COB', 'COE', 'COED'];
const DEPARTMENTS = ['All', 'IT-DEPT', 'CS-DEPT', 'IS-DEPT', 'ACCT-DEPT', 'BUS-DEPT', 'EE-DEPT', 'IE-DEPT'];
const EMPLOYMENT_TYPES = ['All', 'Full-Time', 'Part-Time', 'Contractual'];
const RANKS = ['All', 'Instructor I', 'Instructor II', 'Assistant Professor I', 'Associate Professor II', 'Full Professor'];
const STATUSES = ['All', 'Active', 'On Leave', 'Resigned'];
const PAGE_SIZE = 5;

export default function HRSearch() {
  const { navigate, setFilters, showToast } = useApp();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ResultType | 'all'>('all');
  const [college, setCollege] = useState('All');
  const [department, setDepartment] = useState('All');
  const [employmentType, setEmploymentType] = useState('All');
  const [rank, setRank] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return RESULTS.filter((record) => {
      const searchable = `${record.title} ${record.subtitle} ${record.badge} ${record.meta}`.toLowerCase();
      return (type === 'all' || record.type === type)
        && (college === 'All' || record.college === college)
        && (department === 'All' || record.department === department)
        && (employmentType === 'All' || record.employmentType === employmentType)
        && (rank === 'All' || record.rank === rank)
        && (status === 'All' || record.status === status)
        && terms.every((term) => searchable.includes(term));
    });
  }, [college, department, employmentType, query, rank, status, type]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pagedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function clearAll() {
    setQuery('');
    setType('all');
    setCollege('All');
    setDepartment('All');
    setEmploymentType('All');
    setRank('All');
    setStatus('All');
    setPage(1);
  }

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  function viewRecord(record: SearchResult) {
    setFilters((previous) => ({
      ...previous,
      college: record.college ?? previous.college,
      employmentStatus: record.employmentType ?? 'All',
    }));
    navigate(record.destination);
    showToast({ type: 'success', title: `${TYPE_LABELS[record.type]} opened`, body: `${record.title} is now in view.` });
  }

  const filtered = query || type !== 'all' || college !== 'All' || department !== 'All' || employmentType !== 'All' || rank !== 'All' || status !== 'All';

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-primary p-6 text-white shadow-xl">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-lilac">Cross-module discovery</p>
        <p className="mt-2 text-2xl font-bold">Find HR workforce information</p>
        <p className="mt-1 text-sm text-white/60">Search authorized faculty, department, document, and certified report records from one interface.</p>
        <form onSubmit={(event) => { event.preventDefault(); setPage(1); showToast({ type: 'info', title: 'Search complete', body: `${results.length} authorized HR records found.` }); }} className="mt-5 flex flex-col gap-2 sm:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 focus-within:border-lilac">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-lilac"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search a name, employee ID, department, document, or report…" className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/40" />
            {query && <button type="button" onClick={() => { setQuery(''); setPage(1); }} className="text-xs text-white/50 hover:text-white">Clear</button>}
          </label>
          <button type="submit" className="rounded-2xl bg-lilac px-6 py-3 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5">Search</button>
        </form>
      </section>

      <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="mb-4"><p className="text-sm font-bold text-primary">Refine Results</p><p className="mt-1 text-xs text-muted">Narrow authorized records using workforce and institutional criteria.</p></div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Record type</span>
            <select value={type} onChange={(event) => { setType(event.target.value as ResultType | 'all'); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary outline-none">
              <option value="all">All Types</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          {[
            { label: 'College', value: college, setter: setCollege, options: COLLEGES },
            { label: 'Department', value: department, setter: setDepartment, options: DEPARTMENTS },
            { label: 'Employment type', value: employmentType, setter: setEmploymentType, options: EMPLOYMENT_TYPES },
            { label: 'Academic rank', value: rank, setter: setRank, options: RANKS },
            { label: 'Status', value: status, setter: setStatus, options: STATUSES },
          ].map((filter) => (
            <label key={filter.label} className="flex flex-col gap-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted">{filter.label}</span>
              <select value={filter.value} onChange={(event) => updateFilter(filter.setter, event.target.value)} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary outline-none">
                {filter.options.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          ))}
          <button type="button" onClick={clearAll} className="rounded-xl border border-lilac/20 px-4 py-2.5 text-xs font-semibold text-muted transition-colors hover:bg-lilac/10 hover:text-primary">Clear All</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-lilac/15 p-5">
          <div><p className="font-bold text-primary">Authorized Results</p><p className="mt-1 text-xs text-muted">Showing {results.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, results.length)} of {results.length} authorized records.</p></div>
          {filtered && <span className="rounded-full bg-lilac/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-lilac">Filtered</span>}
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center"><p className="text-sm font-semibold text-primary">No authorized records found</p><p className="mt-1 text-xs text-muted">Try a broader search term or reset one of the filters.</p><button type="button" onClick={clearAll} className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white">Reset Search</button></div>
        ) : (
          <div>
            <div className="hidden grid-cols-[6rem_minmax(0,1fr)_8rem_7rem] gap-4 bg-primary/[0.03] px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-muted md:grid">
              <span>Type</span><span>Record</span><span>Details</span><span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-lilac/10">
              {pagedResults.map((record) => (
                <div key={record.id} className="group grid gap-3 px-5 py-4 transition-colors hover:bg-blossom/20 md:grid-cols-[6rem_minmax(0,1fr)_8rem_7rem] md:items-center md:gap-4">
                  <span className="flex w-fit items-center gap-2 rounded-xl px-2.5 py-1 text-[10px] font-bold" style={{ background: `${TYPE_COLORS[record.type]}12`, color: TYPE_COLORS[record.type] }}>{TYPE_ICONS[record.type]}{TYPE_LABELS[record.type]}</span>
                  <span className="min-w-0"><span className="flex items-center gap-2"><span className="truncate text-sm font-semibold text-primary">{record.title}</span><span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: `${record.badgeTone}15`, color: record.badgeTone }}>{record.badge}</span></span><span className="mt-1 block truncate text-xs text-muted">{record.subtitle}</span></span>
                  <span className="text-[10px] font-semibold text-muted">{record.meta}</span>
                  <button type="button" onClick={() => viewRecord(record)} className="flex items-center justify-center gap-1.5 rounded-xl bg-lilac/10 px-3 py-2 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white">View <span aria-hidden="true">→</span></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length > PAGE_SIZE && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-lilac/15 px-5 py-4">
            <p className="text-xs text-muted">Page <strong className="text-primary">{page}</strong> of <strong className="text-primary">{totalPages}</strong></p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="rounded-xl border border-lilac/20 px-4 py-2 text-xs font-semibold text-muted hover:bg-blossom/20 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button type="button" key={pageNumber} onClick={() => setPage(pageNumber)} className={`h-9 w-9 rounded-xl text-xs font-semibold ${pageNumber === page ? 'bg-primary text-white' : 'border border-lilac/20 text-muted hover:bg-blossom/20'}`}>{pageNumber}</button>)}
              <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="rounded-xl border border-lilac/20 px-4 py-2 text-xs font-semibold text-muted hover:bg-blossom/20 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
