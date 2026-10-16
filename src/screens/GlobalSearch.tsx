import { useMemo, useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_USERS, PROGRAMS } from '../data/mockData';
import type { ScreenId, UserRole } from '../types';

interface SearchRecord {
  id: string;
  type: 'Student' | 'Faculty' | 'Program' | 'Applicant' | 'Dataset' | 'Report' | 'Policy' | 'User';
  title: string;
  meta: string;
  screen: ScreenId;
  roles: UserRole[];
  college?: string;
  program?: string;
  status?: string;
  campus?: string;
  milestone?: string;
  scholarship?: string;
  gender?: string;
  qualification?: string;
  rank?: string;
  hash?: string;
}

const STUDENT_NAMES = ['Angela Santos', 'Marco Reyes', 'Sofia Garcia', 'Nathan Cruz'];
const FACULTY_NAMES = ['Dr. Maria Santos', 'Prof. Alan Reyes'];
const DISCOVERY_ROLES: UserRole[] = ['admin', 'executive', 'registrar', 'dean'];
const PAGE_SIZE = 6;

const RECORDS: SearchRecord[] = [
  { id: 'pres-student-001', type: 'Student', title: 'Angela M. Santos · 24-10021', meta: 'BSIT · CCS · First-Generation · QCYDO Scholar', screen: 'president-demographics', roles: ['executive'], college: 'CCS', program: 'BSIT', campus: 'San Bartolome (Main)', milestone: 'First-Generation', scholarship: 'QCYDO', gender: 'Female', status: 'Enrolled' },
  { id: 'pres-student-002', type: 'Student', title: 'Marco D. Reyes · 23-08412', meta: 'BSECE · COE · General Enrollee · UniFAST-TES', screen: 'president-demographics', roles: ['executive'], college: 'COE', program: 'BSECE', campus: 'Batasan Campus', milestone: 'General Enrollee', scholarship: 'UNIFAST/TES', gender: 'Male', status: 'Enrolled' },
  { id: 'pres-faculty-001', type: 'Faculty', title: 'Dr. Maria L. Santos · F-CCS-018', meta: 'Doctorate · Full Professor · CCS · San Bartolome', screen: 'faculty-analytics', roles: ['executive'], college: 'CCS', program: 'BSIT', campus: 'San Bartolome (Main)', qualification: 'Doctorate', rank: 'Full Professor', status: 'Full-Time' },
  { id: 'pres-faculty-002', type: 'Faculty', title: 'Prof. Alan P. Reyes · F-COE-027', meta: "Master's · Assistant Professor · COE · Batasan", screen: 'faculty-analytics', roles: ['executive'], college: 'COE', program: 'BSIE', campus: 'Batasan Campus', qualification: "Master's", rank: 'Assistant Professor', status: 'Full-Time' },
  { id: 'policy-pm-2026-041', type: 'Policy', title: 'Data Privacy Compliance Memorandum · PM-2026-041', meta: 'Presidential Memorandum · Confidential · Active', screen: 'president-announcements', roles: ['executive'], status: 'Active', hash: 'DOC-HASH: 3D41-QCU-EIS' },
  { id: 'policy-eo-2026-009', type: 'Policy', title: 'Accreditation Readiness Executive Order · EO-2026-009', meta: 'Executive Order · Urgent · 94.8% acknowledged', screen: 'president-announcements', roles: ['executive'], status: 'Active', hash: 'DOC-HASH: 7A18-QCU-POL' },
  ...Object.entries(PROGRAMS).flatMap(([college, programs]) =>
    programs.flatMap((program, programIndex) => [
      {
        id: `program-${college}-${program}`,
        type: 'Program' as const,
        title: `${program} Academic Program`,
        meta: `${college} · Active program · AY 2026–2027`,
        screen: 'student-analytics' as ScreenId,
        roles: DISCOVERY_ROLES,
        college,
        program,
        status: 'Active',
      },
      ...STUDENT_NAMES.map((name, index) => ({
        id: `student-${college}-${program}-${index}`,
        type: 'Student' as const,
        title: `${name} · ${26 - index}-${String(1001 + programIndex * 20 + index).padStart(4, '0')}`,
        meta: `${program} · ${college} · ${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Year · ${index === 3 ? 'On Leave' : 'Enrolled'}`,
        screen: 'student-analytics' as ScreenId,
        roles: DISCOVERY_ROLES,
        college,
        program,
        status: index === 3 ? 'On Leave' : 'Enrolled',
      })),
      ...FACULTY_NAMES.map((name, index) => ({
        id: `faculty-${college}-${program}-${index}`,
        type: 'Faculty' as const,
        title: `${name} · F-${college}-${String(programIndex * 10 + index + 1).padStart(3, '0')}`,
        meta: `${program} · ${college} · ${index === 0 ? 'Full-Time' : 'Part-Time'} · ${index === 0 ? 'Professor' : 'Instructor II'}`,
        screen: 'faculty-analytics' as ScreenId,
        roles: DISCOVERY_ROLES,
        college,
        program,
        status: index === 0 ? 'Full-Time' : 'Part-Time',
      })),
    ]),
  ),
  ...Object.keys(PROGRAMS).map(college => ({
    id: `report-${college}`,
    type: 'Report' as const,
    title: `${college} Certified Academic Briefing · September 2026`,
    meta: `${college} · Certified PDF · AY 2026–2027`,
    screen: 'report-generation' as ScreenId,
    roles: DISCOVERY_ROLES,
    college,
    status: 'Certified',
  })),
  {
    id: 'applicant-260842',
    type: 'Applicant',
    title: 'APP-260842 · Accepted Applicant',
    meta: 'BSIT · CCS · First-time applicant',
    screen: 'admission-analytics',
    roles: ['admin', 'registrar'],
    college: 'CCS',
    program: 'BSIT',
    status: 'Accepted',
  },
  {
    id: 'dataset-enrollees',
    type: 'Dataset',
    title: 'Enrollees_AY2026_Masterlist.csv',
    meta: 'VAL-2609-014 · Registrar · 3 validation errors',
    screen: 'data-validation',
    roles: ['admin'],
    status: 'Needs Review',
  },
  ...MOCK_USERS.map(user => ({
    id: `user-${user.id}`,
    type: 'User' as const,
    title: `${user.name} · ${user.username}`,
    meta: `${user.title} · ${user.status}`,
    screen: 'user-management' as ScreenId,
    roles: ['admin' as UserRole],
    college: user.college,
    status: user.status,
  })),
];

export default function GlobalSearch() {
  const { currentUser, navigate, setFilters, showToast } = useApp();
  const isPresident = currentUser?.username === 'doc.atienza';
  const deanCollege = currentUser?.role === 'dean' ? currentUser.college ?? 'CCS' : 'All';
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [college, setCollege] = useState(deanCollege);
  const [program, setProgram] = useState('All');
  const [status, setStatus] = useState('All');
  const [campus, setCampus] = useState('All');
  const [milestone, setMilestone] = useState('All');
  const [scholarship, setScholarship] = useState('All');
  const [qualification, setQualification] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [rankFilter, setRankFilter] = useState('All');
  const [preview, setPreview] = useState<SearchRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);

  const authorizedRecords = useMemo(() => RECORDS.filter(record =>
    currentUser
    && record.roles.includes(currentUser.role)
    && (record.type !== 'Policy' || currentUser.username === 'doc.atienza')
    && (!record.id.startsWith('pres-') || currentUser.username === 'doc.atienza')
    && (currentUser.role !== 'dean' || !record.college || record.college === currentUser.college)
  ), [currentUser]);

  const programOptions = college === 'All'
    ? [...new Set(authorizedRecords.map(record => record.program).filter(Boolean))] as string[]
    : PROGRAMS[college] ?? [];
  const statusOptions = [...new Set(authorizedRecords.map(record => record.status).filter(Boolean))] as string[];
  const typeOptions = [...new Set(authorizedRecords.map(record => record.type))];

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return authorizedRecords.filter(record => {
      const searchable = `${record.title} ${record.meta} ${record.type} ${record.college ?? ''} ${record.program ?? ''} ${record.status ?? ''} ${record.campus ?? ''} ${record.milestone ?? ''} ${record.scholarship ?? ''} ${record.gender ?? ''} ${record.qualification ?? ''} ${record.rank ?? ''} ${record.hash ?? ''}`.toLowerCase();
      return (type === 'All' || record.type === type)
        && (college === 'All' || record.college === college)
        && (program === 'All' || record.program === program)
        && (status === 'All' || record.status === status)
        && (campus === 'All' || record.campus === campus)
        && (milestone === 'All' || record.milestone === milestone)
        && (scholarship === 'All' || record.scholarship === scholarship)
        && (qualification === 'All' || record.qualification === qualification)
        && (genderFilter === 'All' || record.gender === genderFilter)
        && (rankFilter === 'All' || record.rank === rankFilter)
        && terms.every(term => searchable.includes(term));
    });
  }, [authorizedRecords, campus, college, genderFilter, milestone, program, qualification, query, rankFilter, scholarship, status, type]);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pagedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setSearched(true);
    setPage(1);
    showToast({
      type: 'info',
      title: 'Search complete',
      body: `${results.length} authorized record${results.length === 1 ? '' : 's'} found.`,
    });
  }

  function clearSearch() {
    setQuery('');
    setType('All');
    setCollege(deanCollege);
    setProgram('All');
    setStatus('All');
    setCampus('All');
    setMilestone('All');
    setScholarship('All');
    setQualification('All');
    setGenderFilter('All');
    setRankFilter('All');
    setPreview(null);
    setSearched(false);
    setPage(1);
  }

  function openResult(record: SearchRecord) {
    if (isPresident) {
      setPreview(record);
      showToast({ type: 'info', title: 'Executive profile preview ready', body: `${record.type} details loaded without leaving Search & Lookup.` });
      return;
    }
    setFilters(previous => ({
      ...previous,
      college: currentUser?.role === 'dean' ? currentUser.college ?? previous.college : record.college ?? previous.college,
      program: record.program ?? 'All',
      employmentStatus: record.type === 'Faculty' && ['Full-Time', 'Part-Time'].includes(record.status ?? '') ? record.status! : 'All',
    }));
    navigate(record.screen);
    showToast({ type: 'success', title: `${record.type} opened`, body: 'The matching record scope was applied to the destination module.' });
  }

  return (
    <div className="w-full space-y-5">
      <section className="rounded-3xl bg-primary p-6 text-white shadow-xl">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-lilac">Cross-module discovery</p>
        <p className="mt-2 text-2xl font-bold">Find institutional information</p>
        <p className="mt-1 text-sm text-white/60">Search is automatically restricted to your role and assigned college scope.</p>
        <form onSubmit={submitSearch} className="mt-5 flex flex-col gap-2 sm:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 focus-within:border-lilac">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-lilac"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
            <input autoFocus value={query} onChange={event => { setQuery(event.target.value); setSearched(false); setPage(1); }} placeholder="Search a name, ID, program, report, or status…" className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/40" />
            {query && <button type="button" onClick={() => setQuery('')} className="text-xs text-white/50 hover:text-white">Clear</button>}
          </label>
          <button type="submit" className="rounded-2xl bg-lilac px-6 py-3 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5">Search</button>
        </form>
      </section>

      <section className="rounded-3xl border border-lilac/20 bg-white p-4 shadow-sm">
        <div className="mb-4"><p className="text-sm font-bold text-primary">Refine Results</p><p className="mt-1 text-xs text-muted">Narrow authorized records by type, assigned college, program, or status.</p></div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">Record Type</span><div className="flex flex-wrap gap-2">{['All', ...typeOptions].map(option => <button type="button" key={option} onClick={() => { setType(option); setSearched(true); setPage(1); }} className={`rounded-xl px-3 py-2 text-[11px] font-semibold ${type === option ? 'bg-primary text-white' : 'border border-lilac/20 text-muted hover:border-lilac hover:text-primary'}`}>{option === 'All' ? 'All Types' : option}</button>)}</div></div>
          <label className="flex min-w-32 flex-1 flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">College</span><select value={college} disabled={currentUser?.role === 'dean'} onChange={event => { setCollege(event.target.value); setProgram('All'); setSearched(true); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary outline-none disabled:cursor-not-allowed disabled:opacity-70"><option>All</option>{Object.keys(PROGRAMS).map(option => <option key={option}>{option}</option>)}</select></label>
          <label className="flex min-w-32 flex-1 flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">Program</span><select value={program} onChange={event => { setProgram(event.target.value); setSearched(true); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary outline-none"><option>All</option>{programOptions.map(option => <option key={option}>{option}</option>)}</select></label>
          <label className="flex min-w-32 flex-1 flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">Status</span><select value={status} onChange={event => { setStatus(event.target.value); setSearched(true); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary outline-none"><option>All</option>{statusOptions.map(option => <option key={option}>{option}</option>)}</select></label>
          <button type="button" onClick={clearSearch} className="rounded-xl border border-lilac/20 px-4 py-2.5 text-xs font-semibold text-muted hover:bg-lilac/10 hover:text-primary">Clear All</button>
        </div>
        {isPresident && <div className="mt-4 grid gap-3 border-t border-lilac/10 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">Campus Workforce / Student Scope</span><select value={campus} onChange={event => { setCampus(event.target.value); setSearched(true); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary"><option>All</option><option>San Bartolome (Main)</option><option>San Francisco</option><option>Batasan Campus</option></select></label>
          <label className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">First-Gen Milestone</span><select value={milestone} onChange={event => { setMilestone(event.target.value); setSearched(true); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary"><option>All</option><option>First-Generation</option><option>General Enrollee</option></select></label>
          <label className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">Scholarship Tier</span><select value={scholarship} onChange={event => { setScholarship(event.target.value); setSearched(true); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary"><option>All</option><option>QCYDO</option><option>CHED</option><option>UNIFAST/TES</option></select></label>
          <label className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">Faculty Qualification</span><select value={qualification} onChange={event => { setQualification(event.target.value); setSearched(true); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary"><option>All</option><option>Doctorate</option><option>Master's</option><option>Bachelor's</option></select></label>
          <label className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">Gender Group</span><select value={genderFilter} onChange={event => { setGenderFilter(event.target.value); setSearched(true); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary"><option>All</option><option>Female</option><option>Male</option></select></label>
          <label className="flex flex-col gap-1"><span className="text-[9px] font-bold uppercase tracking-widest text-muted">Academic Rank</span><select value={rankFilter} onChange={event => { setRankFilter(event.target.value); setSearched(true); setPage(1); }} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary"><option>All</option><option>Full Professor</option><option>Assistant Professor</option></select></label>
        </div>}
      </section>

      {isPresident && preview && <section className="rounded-3xl border border-lilac/25 bg-white p-5 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">Executive profile preview · {preview.type}</p><p className="mt-2 text-lg font-bold text-primary">{preview.title}</p><p className="mt-1 text-xs text-muted">{preview.meta}</p></div><button type="button" onClick={() => { setPreview(null); navigate(preview.screen); }} className="rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white">Open Source Module</button></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
          ['Campus', preview.campus ?? 'University-wide'],
          ['College / Program', [preview.college, preview.program].filter(Boolean).join(' · ') || 'Institutional'],
          ['Milestone / Qualification', preview.milestone ?? preview.qualification ?? preview.rank ?? 'Governance Record'],
          ['Scholarship / Hash', preview.scholarship ?? preview.hash ?? preview.status ?? 'Verified'],
        ].map(([label, value]) => <div key={label} className="rounded-2xl bg-surface p-3"><p className="text-[8px] font-bold uppercase tracking-widest text-muted">{label}</p><p className="mt-1 text-xs font-semibold text-primary">{value}</p></div>)}</div>
      </section>}

      {searched ? <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-lilac/15 p-5">
          <div><p className="font-bold text-primary">Authorized Results</p><p className="mt-1 text-xs text-muted">Showing {results.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, results.length)} of {results.length} authorized records.</p></div>
          {(query || type !== 'All' || program !== 'All' || status !== 'All' || college !== deanCollege || campus !== 'All' || milestone !== 'All' || scholarship !== 'All' || qualification !== 'All' || genderFilter !== 'All' || rankFilter !== 'All') && <span className="rounded-full bg-lilac/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-lilac">Filtered</span>}
        </div>
        {results.length > 0 && <div className="hidden grid-cols-[6rem_minmax(0,1fr)_8rem_7rem] gap-4 bg-primary/[.03] px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-muted md:grid"><span>Type</span><span>Record</span><span>Details</span><span className="text-right">Action</span></div>}
        <div className="divide-y divide-lilac/10">
          {pagedResults.map(result => (
            <div key={result.id} className="grid gap-3 px-5 py-4 transition-colors hover:bg-blossom/20 md:grid-cols-[6rem_minmax(0,1fr)_8rem_7rem] md:items-center md:gap-4">
              <span className="w-fit rounded-xl bg-lilac/15 px-2.5 py-1 text-[10px] font-bold text-primary">{result.type}</span>
              <span className="min-w-0"><span className="block truncate text-sm font-semibold text-primary">{result.title}</span><span className="mt-1 block truncate text-xs text-muted">{result.meta}</span></span>
              <span className="text-[10px] font-semibold text-muted">{result.program ?? result.college ?? result.status ?? 'Authorized'}</span>
              <button type="button" onClick={() => openResult(result)} className="flex items-center justify-center gap-1.5 rounded-xl bg-lilac/10 px-3 py-2 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white">View <span aria-hidden="true">→</span></button>
            </div>
          ))}
          {results.length === 0 && <div className="p-12 text-center"><p className="text-sm font-semibold text-primary">No authorized records found</p><p className="mt-1 text-xs text-muted">Try a broader search term or clear the active filters.</p></div>}
        </div>
        {results.length > PAGE_SIZE && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-lilac/15 px-5 py-4"><p className="text-xs text-muted">Page <strong className="text-primary">{page}</strong> of <strong className="text-primary">{totalPages}</strong></p><div className="flex items-center gap-2"><button type="button" onClick={() => setPage(value => Math.max(1, value - 1))} disabled={page === 1} className="rounded-xl border border-lilac/20 px-4 py-2 text-xs font-semibold text-muted disabled:opacity-40">Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => <button type="button" key={pageNumber} onClick={() => setPage(pageNumber)} className={`h-9 w-9 rounded-xl text-xs font-semibold ${pageNumber === page ? 'bg-primary text-white' : 'border border-lilac/20 text-muted'}`}>{pageNumber}</button>)}<button type="button" onClick={() => setPage(value => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="rounded-xl border border-lilac/20 px-4 py-2 text-xs font-semibold text-muted disabled:opacity-40">Next</button></div></div>}
      </section> : <section className="rounded-3xl border border-lilac/15 bg-white p-10 text-center shadow-sm"><svg className="mx-auto mb-3 text-lilac" width="42" height="42" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg><p className="text-sm font-semibold text-primary">Search your authorized college records</p><p className="mt-1 text-xs text-muted">Enter a name, ID, program, report, or choose a filter to begin.</p></section>}
    </div>
  );
}
