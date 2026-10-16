import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import type { ScreenId } from '../../types';

type ResultType = 'scholar' | 'grant' | 'document' | 'college';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  meta: string;
}

const ALL_RESULTS: SearchResult[] = [
  { id: '1', type: 'scholar', title: 'Naya Alia', subtitle: '23-2652 · CCS – BSIT · QCYDO Grant', badge: "Dean's List", badgeColor: '#00875A', meta: 'GPA: 1.25' },
  { id: '2', type: 'scholar', title: 'Anastasha', subtitle: '20-2121 · CCS – BSCS · UNIFAST/TES', badge: 'Good Standing', badgeColor: '#BB96E4', meta: 'GPA: 1.78' },
  { id: '3', type: 'scholar', title: 'Bryan Ramos', subtitle: '22-1089 · COE – BSEE · QCYDO Grant', badge: "Dean's List", badgeColor: '#00875A', meta: 'GPA: 1.65' },
  { id: '4', type: 'scholar', title: 'Carla Santos', subtitle: '21-3340 · COA – BSA · CHED', badge: "Dean's List", badgeColor: '#00875A', meta: 'GPA: 1.50' },
  { id: '5', type: 'scholar', title: 'Daniel Cruz', subtitle: '23-0789 · COB – BSBA · QCYDO', badge: 'At-Risk', badgeColor: '#FF6B00', meta: 'GPA: 2.35' },
  { id: '6', type: 'grant', title: 'QCYDO Municipal Scholarship', subtitle: 'Quezon City Youth Development Office', badge: 'Active', badgeColor: '#00875A', meta: '4,000 scholars' },
  { id: '7', type: 'grant', title: 'UNIFAST Tertiary Education Subsidy', subtitle: 'CHED / UNIFAST', badge: 'Active', badgeColor: '#00875A', meta: '2,000 scholars' },
  { id: '8', type: 'grant', title: 'CHED Merit Scholarship', subtitle: 'Commission on Higher Education', badge: 'Active', badgeColor: '#00875A', meta: '500 scholars' },
  { id: '9', type: 'document', title: 'QCYDO_GradeSlip_2026.pdf', subtitle: 'Naya Alia · 23-2652 · Academic Grade Slip', badge: 'VERIFIED', badgeColor: '#00875A', meta: 'PDF · 1.8 MB' },
  { id: '10', type: 'document', title: 'Cert_Indigency_2026.pdf', subtitle: 'Anastasha · 20-2121 · Indigency Certificate', badge: 'RENEWAL', badgeColor: '#FFC700', meta: 'PDF · 1.2 MB' },
  { id: '11', type: 'college', title: 'CCS — College of Computer Studies', subtitle: '2,380 scholars · 68.0% coverage', badge: '3 Depts', badgeColor: '#333333', meta: 'Avg GPA: 1.62' },
  { id: '12', type: 'college', title: 'COE — College of Engineering', subtitle: '1,700 scholars · 68.0% coverage', badge: '2 Depts', badgeColor: '#FF6B00', meta: 'Avg GPA: 1.69' },
  { id: '13', type: 'college', title: 'COA — College of Accountancy', subtitle: '816 scholars · 68.0% coverage', badge: '1 Dept', badgeColor: '#00875A', meta: 'Avg GPA: 1.62' },
];

const TYPE_ICONS: Record<ResultType, React.ReactNode> = {
  scholar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  grant: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 7 .9-5 4.8 1.2 6.8L12 17.4l-6.2 3.1L7 13.7 2 8.9 9 8l3-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  document: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.6"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6"/></svg>,
  college: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V8l7-5 7 5v13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
};

const TYPE_LABELS: Record<ResultType, string> = {
  scholar: 'Scholar',
  grant: 'Grant Program',
  document: 'Document',
  college: 'College',
};

const TYPE_COLORS: Record<ResultType, string> = {
  scholar: '#BB96E4',
  grant: '#FFD066',
  document: '#4C1413',
  college: '#200D2D',
};

const COLLEGE_OPTS = ['All', 'CCS', 'COA', 'COB', 'COE', 'COED'];
const GRANT_OPTS = ['All', 'QCYDO', 'UNIFAST/TES', 'CHED', 'Academic', 'LGU/Private'];
const STANDING_OPTS = ['All', "Dean's List", 'Good Standing', 'At-Risk'];
const PAGE_SIZE = 5;

export default function SPARDSSearch() {
  const { showToast, navigate, setFilters } = useApp();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ResultType | 'all'>('all');
  const [college, setCollege] = useState('All');
  const [grant, setGrant] = useState('All');
  const [standing, setStanding] = useState('All');
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    if (!searched && !query) return [];
    return ALL_RESULTS.filter(r => {
      const q = query.toLowerCase();
      const matchQuery = !q || `${r.title} ${r.subtitle} ${r.badge} ${r.meta}`.toLowerCase().includes(q);
      const matchType = typeFilter === 'all' || r.type === typeFilter;
      const matchCollege = college === 'All' || r.subtitle.includes(college) || r.title.startsWith(college);
      const matchGrant = grant === 'All' || r.title.includes(grant) || r.subtitle.includes(grant);
      const matchStanding = standing === 'All' || r.badge === standing;
      return matchQuery && matchType && matchCollege && matchGrant && matchStanding;
    });
  }, [college, grant, query, searched, standing, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pagedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
    setPage(1);
    showToast({ type: 'info', title: 'Search complete', body: 'Authorized SPARDS records have been refreshed.' });
  }

  function clearAll() {
    setQuery('');
    setTypeFilter('all');
    setCollege('All');
    setGrant('All');
    setStanding('All');
    setSearched(false);
    setPage(1);
  }

  function viewRecord(record: SearchResult) {
    const collegeCode = COLLEGE_OPTS.slice(1).find((option) => record.title.startsWith(option) || record.subtitle.includes(option));
    if (collegeCode) setFilters((previous) => ({ ...previous, college: collegeCode }));

    const destination: ScreenId = record.type === 'scholar'
      ? 'spards-scholar-records'
      : record.type === 'grant'
        ? 'spards-grant-programs'
        : record.type === 'document'
          ? 'spards-erecords'
          : (`spards-college-${collegeCode?.toLowerCase() ?? 'ccs'}` as ScreenId);

    navigate(destination);
    showToast({ type: 'success', title: `${TYPE_LABELS[record.type]} opened`, body: `${record.title} is now in view.` });
  }

  const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <label className="flex flex-col gap-1">
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-lilac/30">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="rounded-3xl bg-primary p-6 text-white shadow-xl">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-lilac">Cross-module discovery</p>
        <p className="mt-2 text-2xl font-bold">Find scholarship information</p>
        <p className="mt-1 text-sm text-white/60">Search scholar profiles, grant programs, verified documents, and college scholarship coverage.</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <input value={query} onChange={e => { setQuery(e.target.value); setSearched(false); setPage(1); }} placeholder="Search scholars, grants, documents, colleges…"
              className="w-full rounded-2xl border-0 bg-white py-3 pl-11 pr-4 text-sm text-primary shadow-lg outline-none ring-lilac/40 focus:ring-2" />
          </div>
          <button type="submit" className="rounded-2xl bg-golden px-6 py-3 text-sm font-bold text-primary shadow-lg transition-transform hover:-translate-y-0.5">Search</button>
        </div>
      </form>

      <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="mb-4"><p className="text-sm font-bold text-primary">Refine results</p><p className="mt-1 text-xs text-muted">Filter by record type, institutional scope, grant program, or academic standing.</p></div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Record type</span>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'scholar', 'grant', 'document', 'college'] as const).map(t => (
              <button key={t} type="button" onClick={() => { setTypeFilter(t); setSearched(true); setPage(1); }}
                className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all ${typeFilter === t ? 'bg-primary text-white' : 'border border-lilac/20 text-muted hover:border-lilac hover:text-primary'}`}>
                {t === 'all' ? 'All Types' : TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          </div>
          <FilterSelect label="College" value={college} onChange={(value) => { setCollege(value); setSearched(true); setPage(1); }} options={COLLEGE_OPTS} />
          <FilterSelect label="Grant program" value={grant} onChange={(value) => { setGrant(value); setSearched(true); setPage(1); }} options={GRANT_OPTS} />
          <FilterSelect label="Academic standing" value={standing} onChange={(value) => { setStanding(value); setSearched(true); setPage(1); }} options={STANDING_OPTS} />
          <button type="button" onClick={clearAll}
            className="rounded-xl border border-lilac/20 px-4 py-2.5 text-xs font-semibold text-muted transition-colors hover:bg-lilac/10 hover:text-primary">Clear all</button>
        </div>
      </section>

      {/* Results */}
      {searched && (
        <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-lilac/15 p-5">
            <div>
              <p className="font-bold text-primary">Authorized Results</p>
              <p className="mt-1 text-xs text-muted">Showing {results.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, results.length)} of {results.length} authorized records.</p>
            </div>
            {(query || typeFilter !== 'all' || college !== 'All' || grant !== 'All' || standing !== 'All') && <span className="rounded-full bg-lilac/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-lilac">Filtered</span>}
          </div>
          {results.length === 0 ? (
            <div className="p-10 text-center">
              <svg className="mx-auto mb-3 text-muted" width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <p className="text-sm font-semibold text-muted">No results found</p>
              <p className="text-xs text-muted mt-1">Try adjusting your search query or filters.</p>
            </div>
          ) : (
            <div>
              <div className="hidden grid-cols-[5rem_minmax(0,1fr)_8rem_7rem] gap-4 bg-primary/[0.03] px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-muted md:grid">
                <span>Type</span><span>Record</span><span>Details</span><span className="text-right">Action</span>
              </div>
              <div className="divide-y divide-lilac/10">
                {pagedResults.map((record) => (
                  <div key={record.id} className="group grid gap-3 px-5 py-4 transition-colors hover:bg-blossom/20 md:grid-cols-[5rem_minmax(0,1fr)_8rem_7rem] md:items-center md:gap-4">
                    <span className="flex w-fit items-center gap-2 rounded-xl px-2.5 py-1 text-[10px] font-bold" style={{ background: `${TYPE_COLORS[record.type]}12`, color: TYPE_COLORS[record.type] }}>{TYPE_ICONS[record.type]}{TYPE_LABELS[record.type]}</span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2"><span className="truncate text-sm font-semibold text-primary">{record.title}</span><span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: `${record.badgeColor}15`, color: record.badgeColor }}>{record.badge}</span></span>
                      <span className="mt-1 block truncate text-xs text-muted">{record.subtitle}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-muted">{record.meta}</span>
                    <button type="button" onClick={() => viewRecord(record)} className="flex items-center justify-center gap-1.5 rounded-xl bg-lilac/10 px-3 py-2 text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
                      View <span aria-hidden="true">→</span>
                    </button>
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
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button type="button" key={pageNumber} onClick={() => setPage(pageNumber)} className={`h-9 w-9 rounded-xl text-xs font-semibold ${pageNumber === page ? 'bg-primary text-white' : 'border border-lilac/20 text-muted hover:bg-blossom/20'}`}>{pageNumber}</button>
                ))}
                <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="rounded-xl border border-lilac/20 px-4 py-2 text-xs font-semibold text-muted hover:bg-blossom/20 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </section>
      )}

      {!searched && (
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-8 text-center">
          <svg className="mx-auto mb-4 text-lilac" width="48" height="48" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <p className="text-sm font-semibold text-primary">Search the SPARDS Database</p>
          <p className="text-xs text-muted mt-1">Enter a scholar name, student ID, grant program, document title, or college to search across all records.</p>
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {['Naya Alia', 'QCYDO', 'CCS Scholars', 'Grade Slip', 'At-Risk'].map(s => (
              <button key={s} onClick={() => { setQuery(s); setSearched(true); }}
                className="rounded-full border border-lilac/20 px-3 py-1.5 text-xs text-muted hover:border-lilac hover:text-primary transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
