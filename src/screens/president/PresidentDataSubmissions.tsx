import { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';

type View = 'import' | 'trail';
type SubmissionStatus = 'Committed (Active)' | 'Superseded by v2';
type Submission = {
  id: string;
  timestamp: string;
  unit: string;
  filename: string;
  rows: number;
  officer: string;
  status: SubmissionStatus;
  pillar: string;
  period: string;
};

const PILLARS = [
  'Pillar 1: Global Standard Curriculum',
  'Pillar 2: Empowered Educators',
  'Pillar 3: Dynamic Student Engagement',
  'Pillar 4: Research Excellence',
  'Pillar 5: Community Synergy',
  'Pillar 6: Supportive Infrastructures',
  'Pillar 7: Governance for Excellence',
];

const UNITS = [
  'Human Resource Management Department (HRMD)',
  'Research, Extension, Planning & Linkages (REPL-Research)',
  'Physical Facilities & General Services Department (PFGSD)',
];

const PERIODS = ['Q3 2026 (July – September)', 'Q2 2026 (April – June)', 'Q1 2026 (January – March)'];

const INITIAL_SUBMISSIONS: Submission[] = [
  { id: 'SUB-2026-1009', timestamp: 'Oct 9, 2026 — 04:15 PM', unit: 'HRMD', filename: 'Faculty_Doctorate_Q3_2026.xlsx', rows: 184, officer: 'Dir. Maria Santos (HRMD Head)', status: 'Committed (Active)', pillar: 'Pillar 2', period: 'Q3 2026' },
  { id: 'SUB-2026-1008', timestamp: 'Oct 8, 2026 — 02:30 PM', unit: 'REPL-Research', filename: 'Scopus_Pubs_Q3_2026.csv', rows: 28, officer: 'Dr. Juan Dela Cruz (Research Coord)', status: 'Committed (Active)', pillar: 'Pillar 4', period: 'Q3 2026' },
  { id: 'SUB-2026-1005', timestamp: 'Oct 5, 2026 — 10:10 AM', unit: 'PFGSD', filename: 'Infrastructure_Audit_Q3.xlsx', rows: 45, officer: 'Engr. Roberto Tan (PFGSD Head)', status: 'Superseded by v2', pillar: 'Pillar 6', period: 'Q3 2026' },
];

const icons = {
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M8.5 12l2.2 2.2 4.8-5" /></>,
  ledger: <><path d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  upload: <><path d="M12 16V3m0 0L7 8m5-5 5 5M4 15v5h16v-5" /></>,
  file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12l2.5 2.5L16 9" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  download: <><path d="M12 3v13m0 0l5-5m-5 5-5-5M4 20h16" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
};

function Icon({ name, size = 18 }: { name: keyof typeof icons; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

function readStoredSubmissions() {
  try {
    const stored = window.localStorage.getItem('qcu-president-submission-ledger');
    return stored ? JSON.parse(stored) as Submission[] : INITIAL_SUBMISSIONS;
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

function shortUnit(unit: string) {
  const match = unit.match(/\(([^)]+)\)/);
  return match?.[1] ?? unit;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1.5">
      <span className="block text-[9px] font-bold uppercase tracking-[.16em] text-muted">{label}</span>
      <span className="relative block">
        <select value={value} onChange={event => onChange(event.target.value)} className="w-full appearance-none rounded-xl border border-lilac/20 bg-surface px-3 py-3 pr-9 text-xs font-semibold text-primary outline-none transition-all hover:border-lilac/50 focus:border-lilac focus:ring-4 focus:ring-lilac/15">
          {options.map(option => <option key={option}>{option}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lilac" width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </span>
    </label>
  );
}

export default function PresidentDataSubmissions({ initialView }: { initialView: View }) {
  const { currentUser, navigate, showModal, showToast } = useApp();
  const [view, setView] = useState<View>(initialView);
  const [pillar, setPillar] = useState(PILLARS[1]);
  const [unit, setUnit] = useState(UNITS[0]);
  const [period, setPeriod] = useState(PERIODS[0]);
  const [file, setFile] = useState({ name: 'Faculty_Doctorate_Q3_2026.xlsx', rows: 184 });
  const [validation, setValidation] = useState<'idle' | 'validating' | 'passed'>('passed');
  const [requestStatus, setRequestStatus] = useState<'Validated' | 'Committed'>('Validated');
  const [dragging, setDragging] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>(readStoredSubmissions);
  const [search, setSearch] = useState('');
  const [unitFilter, setUnitFilter] = useState('All units');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [selected, setSelected] = useState<Submission | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => setView(initialView), [initialView]);

  const canCommit = currentUser?.username === 'doc.atienza' || currentUser?.role === 'admin';
  const templateName = pillar.includes('Pillar 2')
    ? 'Download_Pillar2_HRMD_Standard_Template.xlsx'
    : `Download_${pillar.split(':')[0].replace(' ', '_')}_${shortUnit(unit)}_Standard_Template.xlsx`;
  const filtered = useMemo(() => submissions.filter(row => {
    const query = search.toLowerCase();
    return (!query || [row.filename, row.unit, row.officer, row.id].some(value => value.toLowerCase().includes(query)))
      && (unitFilter === 'All units' || row.unit === unitFilter)
      && (statusFilter === 'All statuses' || row.status === statusFilter);
  }), [search, statusFilter, submissions, unitFilter]);

  function validateUpload(uploaded: File) {
    if (!/\.(xlsx|csv)$/i.test(uploaded.name)) {
      showToast({ type: 'error', title: 'Unsupported file format', body: 'Upload a standardized .xlsx or .csv template.' });
      return;
    }
    setFile({ name: uploaded.name, rows: uploaded.name.toLowerCase().includes('faculty') ? 184 : 128 });
    setRequestStatus('Validated');
    setValidation('validating');
    window.setTimeout(() => {
      setValidation('passed');
      showToast({ type: 'success', title: 'Schema validation passed', body: 'File integrity, required columns, and row values were verified.' });
    }, 900);
  }

  function downloadTemplate() {
    const csv = 'Faculty_ID,Highest_Degree_Earned,Employment_Status\nQCU-0001,Doctorate,Full-time\n';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = templateName;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast({ type: 'success', title: 'Standard template downloaded', body: 'Column headers match the institutional ingestion schema.' });
  }

  function commitSubmission() {
    if (!canCommit || validation !== 'passed') return;
    showModal({
      title: 'Commit verified data to InfoBoard',
      message: `${file.rows} validated rows from ${file.name} will become the active ${shortUnit(unit)} dataset. This action is permanently timestamped in the audit ledger.`,
      confirmLabel: 'Confirm & Commit',
      onConfirm: () => {
        const created: Submission = {
          id: `SUB-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
          timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' —'),
          unit: shortUnit(unit),
          filename: file.name,
          rows: file.rows,
          officer: `${currentUser?.name ?? 'Authorized Officer'} (${currentUser?.title ?? 'Verifier'})`,
          status: 'Committed (Active)',
          pillar: pillar.split(':')[0],
          period: period.split(' (')[0],
        };
        const next = [created, ...submissions.map(row => row.unit === created.unit && row.status === 'Committed (Active)' ? { ...row, status: 'Superseded by v2' as const } : row)];
        setSubmissions(next);
        setRequestStatus('Committed');
        window.localStorage.setItem('qcu-president-submission-ledger', JSON.stringify(next));
        setView('trail');
        navigate('president-audit-trail');
        showToast({ type: 'success', title: 'Dataset committed successfully', body: `${created.id} is active and its immutable ledger entry is now available.` });
      },
    });
  }

  function exportLedger() {
    const headings = ['Timestamp', 'Data Owner Unit', 'Uploaded File Name', 'Records Parsed', 'Verifying Officer / Role', 'Status / Action'];
    const csv = [headings, ...filtered.map(row => [row.timestamp, row.unit, row.filename, `${row.rows} rows`, row.officer, row.status])]
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'QCU-Data-Owner-Submission-Ledger.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    showToast({ type: 'success', title: 'Audit ledger exported', body: `${filtered.length} visible submission records were downloaded.` });
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <span className="absolute inset-y-0 left-0 w-1.5 bg-lilac" />
        <div className="grid gap-5 p-5 pl-7 lg:grid-cols-2">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lilac/15 text-primary"><Icon name="shield" /></span>
            <div><span className="inline-flex rounded-full bg-lilac/15 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-primary">Centralized ingestion</span><p className="mt-2 text-[11px] leading-relaxed text-muted">Departmental data owners use SPARDS-aligned dataset selection cards and a centralized drag-and-drop gateway with automated schema validation before institutional ingestion.</p></div>
          </div>
          <div className="flex gap-4 lg:border-l lg:border-lilac/15 lg:pl-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-golden/25 text-obsidian"><Icon name="ledger" /></span>
            <div><span className="inline-flex rounded-full bg-golden/25 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-obsidian">Immutable audit</span><p className="mt-2 text-[11px] leading-relaxed text-muted">Every upload is permanently recorded in a timestamped version ledger, exposing exact origins, verified officer credentials, and the active dataset version.</p></div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-lilac/20 bg-white px-5 pt-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="flex gap-6">
          {[{ id: 'import' as const, label: 'Import Data', icon: 'upload' as const }, { id: 'trail' as const, label: 'Audit Logs', icon: 'ledger' as const }].map(tab => (
            <button key={tab.id} onClick={() => { setView(tab.id); navigate(tab.id === 'import' ? 'president-import-data' : 'president-audit-trail'); }} className={`flex items-center gap-2 border-b-2 px-1 pb-4 pt-1 text-xs font-bold transition-all ${view === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-primary'}`}><Icon name={tab.icon} size={16} />{tab.label}</button>
          ))}
        </div>
        <div className="mb-3 flex items-center gap-2 rounded-full border border-coa/20 bg-coa/5 px-3 py-1.5 text-[9px] font-bold text-coa"><span className="h-1.5 w-1.5 rounded-full bg-coa" />PRESIDENT · EXECUTIVE OVERSIGHT</div>
      </section>

      {view === 'import' ? (
        <div className="space-y-5">
          <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Dataset selection</p><p className="mt-1 text-base font-bold text-primary">Select Strategic Dataset</p><p className="mt-1 text-[10px] text-muted">Choose the institutional pillar and confirm its reporting owner and period.</p></div><span className="rounded-xl bg-primary px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-wider text-golden">Authorized</span></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {PILLARS.map((option, index) => <button key={option} type="button" onClick={() => setPillar(option)} className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${pillar === option ? 'border-primary bg-primary text-white shadow-lg shadow-primary/10' : 'border-lilac/20 bg-surface text-primary hover:border-lilac'}`}><span className={`text-[8px] font-bold uppercase tracking-widest ${pillar === option ? 'text-golden' : 'text-lilac'}`}>Pillar {index + 1}</span><span className="mt-1.5 block text-[11px] font-bold leading-snug">{option.split(': ')[1]}</span></button>)}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <SelectField label="Responsible unit / data owner" value={unit} options={UNITS} onChange={setUnit} />
              <SelectField label="Reporting period" value={period} options={PERIODS} onChange={setPeriod} />
            </div>
          </section>

          <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
            <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Centralized upload gateway</p><p className="mt-1 text-base font-bold text-primary">Drag & Drop Standardized Dataset</p><p className="mt-1 text-[10px] text-muted">Large-file submission pattern aligned with the existing SPARDS import workflow.</p></div>
            <div onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); const upload = event.dataTransfer.files[0]; if (upload) validateUpload(upload); }} onClick={() => fileRef.current?.click()} className={`mt-5 cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${dragging ? 'scale-[1.01] border-lilac bg-blossom/40' : 'border-lilac/30 bg-surface/60 hover:border-lilac hover:bg-blossom/20'}`}>
              <input ref={fileRef} type="file" accept=".xlsx,.csv" className="hidden" onChange={event => { const upload = event.target.files?.[0]; if (upload) validateUpload(upload); }} />
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lilac/15 text-primary"><Icon name="upload" size={24} /></span>
              <p className="mt-3 text-xs font-bold text-primary">Drag & drop standardized .xlsx or .csv template here</p>
              <p className="mt-1 text-[10px] text-muted">or click to securely browse · maximum 20 MB</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[10px] font-bold text-primary shadow-sm"><Icon name="file" size={14} />{file.name}<span className="text-coa">· {file.rows} rows</span></span>
            </div>
            <button onClick={event => { event.stopPropagation(); downloadTemplate(); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-lilac/20 bg-lilac/5 px-4 py-3 text-[10px] font-bold text-primary transition-colors hover:bg-lilac/15"><Icon name="download" size={15} />{templateName}</button>
          </section>

          <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
            <div className="p-5"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Automated schema validation preview</p><p className="mt-1 text-base font-bold text-primary">Pre-Ingestion Schema Validation Report</p><p className="mt-1 text-[10px] text-muted">Read-only inspection of file integrity, required columns, and parsed row data.</p>
            <div className="mt-5 rounded-2xl border border-lilac/15 bg-surface/60 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lilac shadow-sm"><Icon name="file" /></span><div className="min-w-0"><p className="truncate text-xs font-bold text-primary">{file.name}</p><p className="mt-1 text-[9px] text-muted">Microsoft Excel / CSV · encrypted in transit</p></div></div><span className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[9px] font-extrabold ${validation === 'passed' ? 'bg-coa/10 text-coa' : 'bg-golden/25 text-obsidian'}`}>{validation === 'validating' ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-obsidian/20 border-t-obsidian" /> : <Icon name="check" size={13} />}{validation === 'validating' ? 'VALIDATING' : 'PASSED'}</span></div>
              <div className="my-5 h-px bg-lilac/15" />
              {validation === 'validating' ? <div className="py-10 text-center"><div className="mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-lilac/15"><span className="block h-full w-2/3 animate-pulse rounded-full bg-lilac" /></div><p className="mt-3 text-[10px] font-semibold text-muted">Inspecting schema and parsing row data…</p></div> : <>
                <div className="grid grid-cols-3 gap-2">{[['Rows parsed', file.rows.toString()], ['Required fields', '3 / 3'], ['Schema errors', '0']].map(([label, value]) => <div key={label} className="rounded-xl bg-white p-3 text-center shadow-sm"><p className="text-lg font-extrabold text-primary">{value}</p><p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-muted">{label}</p></div>)}</div>
                <div className="mt-4 overflow-x-auto rounded-xl border border-lilac/15 bg-white"><table className="w-full min-w-[620px] text-left text-[10px]"><thead className="bg-primary/[.035] text-[8px] font-bold uppercase tracking-wider text-muted"><tr>{['Required Column', 'Detected Type', 'Requirement', 'Schema Mapping', 'Status'].map(header => <th key={header} className="px-4 py-3">{header}</th>)}</tr></thead><tbody>{[['Faculty_ID', 'Text / ID', 'Required', 'Faculty master key'], ['Highest_Degree_Earned', 'Text', 'Required', 'Qualification record'], ['Employment_Status', 'Category', 'Required', 'Appointment status']].map(row => <tr key={row[0]} className="border-t border-lilac/10"><td className="px-4 py-3 font-mono font-semibold text-primary">{row[0]}</td><td className="px-4 py-3 text-muted">{row[1]}</td><td className="px-4 py-3 text-muted">{row[2]}</td><td className="px-4 py-3 text-muted">{row[3]}</td><td className="px-4 py-3"><span className="rounded-full bg-coa/10 px-2.5 py-1 text-[8px] font-bold text-coa">VALID</span></td></tr>)}</tbody></table></div>
                <div className="mt-4 rounded-xl border border-coa/15 bg-coa/5 p-4 text-[10px] leading-relaxed text-muted"><p className="flex items-center gap-2 font-bold text-coa"><Icon name="check" size={14} />All validation checks passed</p><p className="mt-2">{file.rows} rows parsed successfully. All required columns matched the institutional ingestion schema.</p></div>
              </>}
            </div>
            <button disabled={!canCommit || validation !== 'passed'} onClick={commitSubmission} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"><Icon name="check" size={16} />Confirm & Commit Data to InfoBoard</button>
            <p className="mt-2 text-center text-[9px] text-muted">Commit authority: President and System Administrators · action is permanently logged</p>
            </div>
          </section>

          <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
            <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Validation queue</p><p className="mt-1 text-base font-bold text-primary">Active Validation Requests</p><p className="mt-1 text-[10px] text-muted">Current departmental requests awaiting ingestion or recently committed.</p></div>
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-lilac/15 bg-surface p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary"><Icon name="file" /></span>
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-primary">REQ-Q3-2026 · {file.name}</p><p className="mt-1 text-[9px] text-muted">{pillar.split(': ')[1]} · {shortUnit(unit)} · {file.rows} rows</p></div>
              <span className={`rounded-full px-3 py-1.5 text-[9px] font-bold ${requestStatus === 'Committed' ? 'bg-coa/10 text-coa' : 'bg-lilac/15 text-primary'}`}>{requestStatus}</span>
              <button type="button" onClick={() => showToast({ type: 'info', title: 'Validation request status', body: `${file.name} passed all required schema checks and is ${requestStatus.toLowerCase()}.` })} className="rounded-xl border border-lilac/20 px-3 py-2 text-[9px] font-bold text-primary hover:bg-lilac/10">View Status</button>
            </div>
          </section>
        </div>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
          <div className="border-b border-lilac/15 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Immutable audit ledger</p><p className="mt-1 text-base font-bold text-primary">System Version Control & Submission History Ledger</p><p className="mt-1 text-[10px] text-muted">Timestamped chain of custody for every institutional dataset submission.</p></div><button onClick={exportLedger} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[10px] font-bold text-white hover:bg-primary/90"><Icon name="download" size={14} />Export visible ledger</button></div>
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <label className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" size={15} /></span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search file, data owner, officer, or submission ID…" className="w-full rounded-xl border border-lilac/20 bg-surface py-2.5 pl-10 pr-3 text-xs text-primary outline-none focus:border-lilac focus:ring-4 focus:ring-lilac/15" /></label>
              <select value={unitFilter} onChange={event => setUnitFilter(event.target.value)} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary outline-none"><option>All units</option>{Array.from(new Set(submissions.map(row => row.unit))).map(value => <option key={value}>{value}</option>)}</select>
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary outline-none"><option>All statuses</option><option>Committed (Active)</option><option>Superseded by v2</option></select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-xs">
              <thead className="bg-primary/[.035] text-[8px] font-bold uppercase tracking-[.12em] text-muted"><tr>{['Timestamp', 'Data Owner Unit', 'Uploaded File Name', 'Records Parsed', 'Verifying Officer / Role', 'Status / Action'].map(label => <th key={label} className="px-4 py-3.5">{label}</th>)}</tr></thead>
              <tbody>{filtered.map((row, index) => <tr key={row.id} className={`border-t border-lilac/10 transition-colors hover:bg-blossom/20 ${index % 2 ? 'bg-surface/35' : ''}`}><td className="whitespace-nowrap px-4 py-4"><p className="font-semibold text-primary">{row.timestamp}</p><p className="mt-1 font-mono text-[8px] text-lilac">{row.id}</p></td><td className="px-4 py-4"><span className="rounded-lg bg-lilac/15 px-2.5 py-1.5 text-[9px] font-extrabold text-primary">{row.unit}</span><p className="mt-2 text-[8px] text-muted">{row.pillar} · {row.period}</p></td><td className="px-4 py-4 font-mono text-[10px] font-semibold text-primary">{row.filename}</td><td className="px-4 py-4 font-bold text-primary">{row.rows.toLocaleString()} rows</td><td className="px-4 py-4"><p className="font-semibold text-primary">{row.officer.split(' (')[0]}</p><p className="mt-1 text-[9px] text-muted">{row.officer.includes(' (') ? `(${row.officer.split(' (')[1]}` : 'Authorized verifier'}</p></td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9px] font-bold ${row.status === 'Committed (Active)' ? 'bg-coa/10 text-coa' : 'bg-golden/25 text-obsidian'}`}><span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Committed (Active)' ? 'bg-coa' : 'bg-golden'}`} />{row.status}</span><button onClick={() => setSelected(row)} className="ml-2 rounded-lg border border-lilac/20 px-2 py-1.5 text-[9px] font-bold text-primary hover:bg-lilac/10">Inspect</button></td></tr>)}</tbody>
            </table>
            {!filtered.length && <div className="p-12 text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-lilac/10 text-lilac"><Icon name="search" /></span><p className="mt-3 text-sm font-bold text-primary">No matching ledger entries</p><button onClick={() => { setSearch(''); setUnitFilter('All units'); setStatusFilter('All statuses'); }} className="mt-3 text-[10px] font-bold text-lilac">Clear all filters</button></div>}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-lilac/15 bg-surface/50 px-5 py-3 text-[9px] text-muted"><span>Showing <strong className="text-primary">{filtered.length}</strong> of {submissions.length} permanent records</span><span className="flex items-center gap-1.5"><Icon name="clock" size={13} />Version history is read-only and timestamp protected</span></div>
        </section>
      )}

      {selected && <div className="fixed inset-0 z-[250] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => event.target === event.currentTarget && setSelected(null)}><section className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Verified chain of custody</p><p className="mt-2 text-lg font-bold text-primary">{selected.id}</p></div><button onClick={() => setSelected(null)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-muted hover:bg-blossom">×</button></div><div className="mt-5 grid grid-cols-2 gap-3">{[['File', selected.filename], ['Data Owner', selected.unit], ['Reporting Scope', `${selected.pillar} · ${selected.period}`], ['Records Parsed', `${selected.rows} rows`], ['Verified By', selected.officer], ['Timestamp', selected.timestamp]].map(([label, value]) => <div key={label} className="rounded-2xl bg-surface p-3"><p className="text-[8px] font-bold uppercase tracking-wider text-muted">{label}</p><p className="mt-1 break-words text-[10px] font-semibold leading-relaxed text-primary">{value}</p></div>)}</div><div className="mt-4 rounded-2xl border border-coa/15 bg-coa/5 p-4 text-[10px] leading-relaxed text-muted"><p className="font-bold text-coa">Integrity verified</p><p className="mt-1">Required schema matched, source provenance retained, and this version-history record is immutable.</p></div><button onClick={() => setSelected(null)} className="mt-5 w-full rounded-xl bg-primary py-3 text-xs font-bold text-white">Close record</button></section></div>}
    </div>
  );
}
