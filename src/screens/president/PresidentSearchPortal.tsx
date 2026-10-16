import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import ChartDataSummary from '../../components/ChartDataSummary';

type EntityType =
  | 'Student Records'
  | 'Faculty Profiles'
  | 'Research Papers'
  | 'Infrastructure Assets'
  | 'Audit Logs';
type StatusFlag = 'Active' | 'Pending Review' | 'Archived' | 'Flagged / At-Risk';

interface PortalRecord {
  id: string;
  name: string;
  type: EntityType;
  department: string;
  status: StatusFlag;
  metric: string;
  period: string;
  action: 'View Profile' | 'View Paper' | 'View Asset' | 'View Log';
  updated: string;
  owner: string;
  details: Array<[string, string]>;
  audit: string;
}

const PAGE_SIZE = 6;
const ENTITY_OPTIONS = ['All Entities', 'Student Records', 'Faculty Profiles', 'Research Papers', 'Infrastructure Assets', 'Audit Logs'] as const;
const STATUS_OPTIONS = ['All Statuses', 'Active', 'Pending Review', 'Archived', 'Flagged / At-Risk'] as const;
const PERIOD_OPTIONS = ['All Periods', 'AY 2026–2027', 'AY 2025–2026', 'Q3 2026', 'Q2 2026', 'Q1 2026'] as const;

const RECORDS: PortalRecord[] = [
  {
    id: 'STU-2024-0892',
    name: 'Balang, Charlotte A.',
    type: 'Student Records',
    department: 'College of Computer Studies (CCS)',
    status: 'Active',
    metric: 'Enrolled (4th Year SBIT-4N)',
    period: 'AY 2026–2027',
    action: 'View Profile',
    updated: 'October 10, 2026 · 09:20 AM',
    owner: 'Office of the University Registrar',
    details: [
      ['Student Program', 'Bachelor of Science in Information Technology'],
      ['Academic Standing', 'Regular · 4th Year · Section SBIT-4N'],
      ['Enrollment Status', 'Officially enrolled for AY 2026–2027'],
      ['Student Support', 'General enrollee · No active risk flag'],
    ],
    audit: 'Enrollment record verified by the Office of the University Registrar on October 10, 2026.',
  },
  {
    id: 'FAC-2019-0142',
    name: 'Dr. Roberto S. Tan',
    type: 'Faculty Profiles',
    department: 'College of Engineering (COE)',
    status: 'Active',
    metric: 'Active (Ph.D. Earned / Professor)',
    period: 'Q3 2026',
    action: 'View Profile',
    updated: 'October 9, 2026 · 04:15 PM',
    owner: 'Human Resource Management Department (HRMD)',
    details: [
      ['Full Name', 'Dr. Roberto S. Tan'],
      ['Department', 'College of Engineering (COE)'],
      ['Pillar 2 Qualification Status', 'Ph.D. in Mechanical Engineering (CHED Compliant)'],
      ['Teaching Load & Performance', '18 units assigned · Student Evaluation Score: 4.85 / 5.0'],
    ],
    audit: 'Verified by HRMD on October 9, 2026.',
  },
  {
    id: 'RES-2026-004',
    name: 'AI-Driven Enterprise EIS',
    type: 'Research Papers',
    department: 'Research & Extension (REPL)',
    status: 'Active',
    metric: 'Scopus Indexed (Completed)',
    period: 'Q3 2026',
    action: 'View Paper',
    updated: 'October 8, 2026 · 02:30 PM',
    owner: 'Research, Extension, Planning & Linkages',
    details: [
      ['Research Category', 'Interdisciplinary · Faculty-Led'],
      ['Indexing Status', 'Scopus indexed · Completed'],
      ['Lead Unit', 'REPL-Research / MIS'],
      ['Strategic Alignment', 'Pillar 4 · Research Excellence'],
    ],
    audit: 'Publication metadata and indexing status verified by REPL-Research on October 8, 2026.',
  },
  {
    id: 'INF-2026-031',
    name: 'Smart Lab Cluster 3',
    type: 'Infrastructure Assets',
    department: 'PFGSD / MIS',
    status: 'Active',
    metric: '100% Operational / Smart-Enabled',
    period: 'Q3 2026',
    action: 'View Asset',
    updated: 'October 5, 2026 · 10:10 AM',
    owner: 'Physical Facilities & General Services Department',
    details: [
      ['Asset Classification', 'Smart-enabled laboratory cluster'],
      ['Operational Status', '100% operational'],
      ['Location', 'San Bartolome Campus · Engineering Wing'],
      ['Strategic Alignment', 'Pillar 6 · Supportive Infrastructures'],
    ],
    audit: 'Infrastructure readiness inspection recorded by PFGSD on October 5, 2026.',
  },
  {
    id: 'AUD-2026-1098',
    name: 'Faculty Qualification Dataset Verification',
    type: 'Audit Logs',
    department: 'HRMD / MIS',
    status: 'Active',
    metric: '184 rows committed · 0 schema errors',
    period: 'Q3 2026',
    action: 'View Log',
    updated: 'October 9, 2026 · 04:18 PM',
    owner: 'Management Information Systems Office',
    details: [
      ['Event', 'COMMIT_DATA_INGESTION'],
      ['Dataset', 'Faculty_Doctorate_Q3_2026.xlsx'],
      ['Records Parsed', '184 rows · 3 required fields'],
      ['Integrity Result', 'Schema validation passed'],
    ],
    audit: 'Immutable audit entry created immediately after authorized HRMD dataset commitment.',
  },
  {
    id: 'STU-2025-0421',
    name: 'Reyes, Marco D.',
    type: 'Student Records',
    department: 'College of Engineering (COE)',
    status: 'Flagged / At-Risk',
    metric: 'Retention intervention required',
    period: 'AY 2026–2027',
    action: 'View Profile',
    updated: 'October 7, 2026 · 01:12 PM',
    owner: 'Office of Student Affairs and Services',
    details: [
      ['Student Program', 'Bachelor of Science in Electronics Engineering'],
      ['Academic Standing', 'Irregular · 3rd Year'],
      ['Risk Indicator', 'Two consecutive terms below retention threshold'],
      ['Intervention Status', 'Advising conference scheduled'],
    ],
    audit: 'At-risk flag was reviewed by the college guidance coordinator on October 7, 2026.',
  },
  {
    id: 'FAC-2021-0088',
    name: 'Prof. Andrea M. Cruz',
    type: 'Faculty Profiles',
    department: 'College of Computer Studies (CCS)',
    status: 'Pending Review',
    metric: 'Master’s degree credential review',
    period: 'Q3 2026',
    action: 'View Profile',
    updated: 'October 6, 2026 · 11:40 AM',
    owner: 'Human Resource Management Department (HRMD)',
    details: [
      ['Appointment', 'Assistant Professor · Full-Time'],
      ['Highest Qualification', 'Master of Information Technology'],
      ['Teaching Load', '21 units assigned'],
      ['Review Item', 'Updated transcript awaiting final verification'],
    ],
    audit: 'Credential review assigned to the HRMD qualifications desk on October 6, 2026.',
  },
  {
    id: 'RES-2026-011',
    name: 'Urban Resilience Analytics for Quezon City',
    type: 'Research Papers',
    department: 'REPL / College of Engineering',
    status: 'Pending Review',
    metric: 'For external journal submission',
    period: 'Q3 2026',
    action: 'View Paper',
    updated: 'September 29, 2026 · 03:05 PM',
    owner: 'Research, Extension, Planning & Linkages',
    details: [
      ['Research Category', 'Interdisciplinary'],
      ['Review Stage', 'Internal technical and ethics review'],
      ['SDG Alignment', 'SDG 11 · Sustainable Cities and Communities'],
      ['Funding', 'Institutionally funded'],
    ],
    audit: 'Internal review package submitted to REPL on September 29, 2026.',
  },
  {
    id: 'INF-2026-018',
    name: 'Library RFID Access Upgrade',
    type: 'Infrastructure Assets',
    department: 'University Library / MIS',
    status: 'Pending Review',
    metric: '92% deployment · Acceptance testing',
    period: 'Q3 2026',
    action: 'View Asset',
    updated: 'September 27, 2026 · 10:30 AM',
    owner: 'University Library and MIS',
    details: [
      ['Asset Classification', 'Digital access and inventory system'],
      ['Deployment Progress', '92% complete'],
      ['Current Phase', 'User acceptance testing'],
      ['Next Milestone', 'Production turnover · October 2026'],
    ],
    audit: 'Deployment status confirmed jointly by the University Library and MIS.',
  },
  {
    id: 'AUD-2026-1044',
    name: 'Scholarship Masterlist Export',
    type: 'Audit Logs',
    department: 'SPARDS',
    status: 'Archived',
    metric: 'Certified XLSX · 6,500 records',
    period: 'Q2 2026',
    action: 'View Log',
    updated: 'June 30, 2026 · 04:45 PM',
    owner: 'SPARDS Department',
    details: [
      ['Event', 'EXPORT_EXCEL_REPORT'],
      ['Export Package', 'Q2 Scholarship Masterlist'],
      ['Records Included', '6,500 authorized scholar records'],
      ['Retention State', 'Archived compliance copy'],
    ],
    audit: 'Export event retained under the institutional records retention schedule.',
  },
  {
    id: 'STU-2023-0176',
    name: 'Santos, Angela M.',
    type: 'Student Records',
    department: 'College of Accountancy (COA)',
    status: 'Active',
    metric: 'Enrolled · Dean’s List · QCYDO Scholar',
    period: 'AY 2026–2027',
    action: 'View Profile',
    updated: 'October 4, 2026 · 08:55 AM',
    owner: 'Office of the University Registrar',
    details: [
      ['Student Program', 'Bachelor of Science in Accountancy'],
      ['Academic Standing', 'Dean’s List · GPA 1.42'],
      ['Scholarship', 'QCYDO Municipal Scholarship'],
      ['Enrollment Status', 'Officially enrolled'],
    ],
    audit: 'Student enrollment and scholarship association synchronized on October 4, 2026.',
  },
  {
    id: 'FAC-2017-0031',
    name: 'Dr. Maria L. Santos',
    type: 'Faculty Profiles',
    department: 'College of Computer Studies (CCS)',
    status: 'Active',
    metric: 'Doctorate · Full Professor · 15 units',
    period: 'Q2 2026',
    action: 'View Profile',
    updated: 'June 28, 2026 · 02:10 PM',
    owner: 'Human Resource Management Department (HRMD)',
    details: [
      ['Highest Qualification', 'Doctor of Information Technology'],
      ['Academic Rank', 'Full Professor'],
      ['Teaching Load', '15 units assigned'],
      ['Performance', 'Student Evaluation Score: 4.76 / 5.0'],
    ],
    audit: 'Faculty profile verified by HRMD for the Q2 institutional report.',
  },
  {
    id: 'RES-2025-029',
    name: 'First-Generation Student Retention Study',
    type: 'Research Papers',
    department: 'REPL / Student Affairs',
    status: 'Archived',
    metric: 'Completed · Institutional repository',
    period: 'AY 2025–2026',
    action: 'View Paper',
    updated: 'May 14, 2026 · 09:00 AM',
    owner: 'Research, Extension, Planning & Linkages',
    details: [
      ['Research Category', 'Institutional research'],
      ['Completion Status', 'Completed and archived'],
      ['Subject', 'First-generation retention outcomes'],
      ['Repository', 'QCU Institutional Research Archive'],
    ],
    audit: 'Final manuscript archived by REPL on May 14, 2026.',
  },
  {
    id: 'INF-2026-007',
    name: 'Batasan Campus Network Core',
    type: 'Infrastructure Assets',
    department: 'MIS / Batasan Campus',
    status: 'Flagged / At-Risk',
    metric: '78% capacity · Upgrade required',
    period: 'Q2 2026',
    action: 'View Asset',
    updated: 'June 21, 2026 · 01:40 PM',
    owner: 'Management Information Systems Office',
    details: [
      ['Asset Classification', 'Campus network infrastructure'],
      ['Capacity Utilization', '78% sustained peak load'],
      ['Risk Indicator', 'Redundancy upgrade required'],
      ['Remediation', 'Procurement request under review'],
    ],
    audit: 'Capacity risk was escalated by MIS following the Q2 infrastructure audit.',
  },
];

const icons = {
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  structure: <><path d="M4 5h16M4 12h10M4 19h7" /><circle cx="18" cy="12" r="2" /><circle cx="15" cy="19" r="2" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M8.5 12l2.2 2.2 4.8-5" /></>,
  filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  close: <><path d="M6 6l12 12M18 6L6 18" /></>,
  arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
  person: <><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3-7 7-7s7 3 7 7m8-10a3.5 3.5 0 010-7m1 10c2.7.5 4 2.4 4 5" /></>,
  paper: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
  asset: <><path d="M3 21h18M5 21V8l7-5 7 5v13M9 12h2m2 0h2m-6 4h2m2 0h2" /></>,
};

function Icon({ name, size = 18 }: { name: keyof typeof icons; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

function SelectField({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-44 flex-1 flex-col gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-[.16em] text-muted">{label}</span>
      <span className="relative">
        <select value={value} onChange={event => onChange(event.target.value)} className={`w-full appearance-none rounded-xl border px-3 py-3 pr-9 text-xs font-semibold outline-none transition-all focus:ring-4 focus:ring-lilac/15 ${value.startsWith('All ') ? 'border-lilac/20 bg-surface text-muted' : 'border-lilac/50 bg-lilac/10 text-primary'}`}>
          {options.map(option => <option key={option}>{option}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lilac" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </span>
    </label>
  );
}

function entityIcon(type: EntityType): keyof typeof icons {
  if (type === 'Student Records' || type === 'Faculty Profiles') return 'person';
  if (type === 'Research Papers' || type === 'Audit Logs') return 'paper';
  return 'asset';
}

export default function PresidentSearchPortal() {
  const { currentUser, showToast } = useApp();
  const [query, setQuery] = useState('');
  const [entity, setEntity] = useState<(typeof ENTITY_OPTIONS)[number]>('All Entities');
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('All Statuses');
  const [period, setPeriod] = useState<(typeof PERIOD_OPTIONS)[number]>('All Periods');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PortalRecord | null>(null);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return RECORDS.filter(record => {
      const searchable = [
        record.id,
        record.name,
        record.type,
        record.department,
        record.status,
        record.metric,
        record.period,
        record.owner,
        ...record.details.flat(),
        record.audit,
      ].join(' ').toLowerCase();
      return (entity === 'All Entities' || record.type === entity)
        && (status === 'All Statuses' || record.status === status)
        && (period === 'All Periods' || record.period === period)
        && terms.every(term => searchable.includes(term));
    });
  }, [entity, period, query, status]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeFilterCount = [entity !== 'All Entities', status !== 'All Statuses', period !== 'All Periods'].filter(Boolean).length + (query ? 1 : 0);
  const composition = ENTITY_OPTIONS.slice(1).map(type => ({
    type,
    count: results.filter(record => record.type === type).length,
  }));
  const maxComposition = Math.max(1, ...composition.map(item => item.count));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  function clearAll() {
    setQuery('');
    setEntity('All Entities');
    setStatus('All Statuses');
    setPeriod('All Periods');
    setPage(1);
    showToast({ type: 'info', title: 'Search scope reset', body: 'All authorized cross-module records are visible again.' });
  }

  function openRecord(record: PortalRecord) {
    setSelected(record);
    showToast({ type: 'info', title: `${record.action} ready`, body: `${record.id} loaded in the authorized record drawer.` });
  }

  const statusTone: Record<StatusFlag, string> = {
    Active: 'bg-coa/10 text-coa',
    'Pending Review': 'bg-golden/25 text-obsidian',
    Archived: 'bg-surface text-muted',
    'Flagged / At-Risk': 'bg-obsidian/10 text-obsidian',
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <span className="absolute inset-y-0 left-0 w-1.5 bg-lilac" />
        <div className="grid gap-5 p-5 pl-7 lg:grid-cols-2">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lilac/15 text-primary"><Icon name="search" /></span>
            <div>
              <span className="inline-flex rounded-full bg-lilac/15 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-primary">Cross-module discovery</span>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">Perform centralized searches across all authorized SPARDS-related records, institutional databases, faculty profiles, departmental metrics, and governance trails from a single interface.</p>
            </div>
          </div>
          <div className="flex gap-4 lg:border-l lg:border-lilac/15 lg:pl-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-golden/25 text-obsidian"><Icon name="structure" /></span>
            <div>
              <span className="inline-flex rounded-full bg-golden/25 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-obsidian">Structured results</span>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">Narrow authorized results with advanced criteria, standardized record actions, and SPARDS-aligned pagination while preserving a verified source and audit trail logs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white shadow-xl">
        <span className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" />
        <span className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-blossom/10 blur-3xl" />
        <div className="relative">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-lilac/30 bg-lilac/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-lilac">President’s insights · Universal discovery</span>
                <span className="flex items-center gap-1.5 rounded-full border border-coa/30 bg-coa/10 px-3 py-1 text-[9px] font-bold text-white"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coa" />Authorized session</span>
              </div>
              <p className="mt-5 text-2xl font-bold tracking-tight">Search the institutional intelligence network</p>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/60">Search by student or faculty name and ID, department code, research title, document ID, asset, or audit event. Results update instantly as criteria change.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] text-white/55">
              <p className="font-bold text-white">{currentUser?.name}</p>
              <p className="mt-1">{currentUser?.title} · View authorized institutional records</p>
            </div>
          </div>
          <label className="mt-6 flex items-center gap-3 rounded-2xl border border-white/15 bg-white px-4 shadow-xl transition-all focus-within:border-lilac focus-within:ring-4 focus-within:ring-lilac/15">
            <span className="text-lilac"><Icon name="search" size={19} /></span>
            <input autoFocus value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Search records, faculty, students, research, assets, or documents…" className="w-full bg-transparent py-4 text-sm font-medium text-primary outline-none placeholder:text-muted/70" />
            {query && <button type="button" onClick={() => { setQuery(''); setPage(1); }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface text-muted hover:bg-blossom hover:text-primary" aria-label="Clear keyword search"><Icon name="close" size={14} /></button>}
            <span className="hidden rounded-lg bg-surface px-2 py-1 font-mono text-[9px] text-muted sm:inline">LIVE</span>
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px] text-white/45">
            <span className="font-semibold text-white/70">Try:</span>
            {['Balang', 'CCS', 'FAC-2019-0142', 'Smart Lab'].map(suggestion => <button key={suggestion} type="button" onClick={() => { setQuery(suggestion); setPage(1); }} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:border-lilac/50 hover:text-white">{suggestion}</button>)}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-lilac/10 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lilac/15 text-primary"><Icon name="filter" /></span>
            <div><p className="text-sm font-bold text-primary">Refine Results</p><p className="mt-0.5 text-[10px] text-muted">Apply multiple parameters to the authorized cross-module result set.</p></div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1.5 text-[9px] font-bold ${activeFilterCount ? 'bg-golden/25 text-obsidian' : 'bg-surface text-muted'}`}>{activeFilterCount} active criterion{activeFilterCount === 1 ? '' : 's'}</span>
            <button type="button" onClick={clearAll} disabled={!activeFilterCount} className="rounded-xl border border-lilac/25 px-3 py-2 text-[10px] font-bold text-primary transition-colors hover:bg-lilac/10 disabled:cursor-not-allowed disabled:opacity-40">Clear All</button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <SelectField label="Entity Type" value={entity} options={ENTITY_OPTIONS} onChange={value => updateFilter(value => setEntity(value as typeof entity), value)} />
          <SelectField label="Status Flag" value={status} options={STATUS_OPTIONS} onChange={value => updateFilter(value => setStatus(value as typeof status), value)} />
          <SelectField label="Date Range / Reporting Period" value={period} options={PERIOD_OPTIONS} onChange={value => updateFilter(value => setPeriod(value as typeof period), value)} />
        </div>
        {activeFilterCount > 0 && <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-lilac/10 pt-4">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Active scope</span>
          {query && <button onClick={() => setQuery('')} className="rounded-full bg-lilac/15 px-3 py-1.5 text-[10px] font-semibold text-primary hover:bg-lilac/25">Keyword: “{query}” ×</button>}
          {entity !== 'All Entities' && <button onClick={() => setEntity('All Entities')} className="rounded-full bg-lilac/15 px-3 py-1.5 text-[10px] font-semibold text-primary hover:bg-lilac/25">{entity} ×</button>}
          {status !== 'All Statuses' && <button onClick={() => setStatus('All Statuses')} className="rounded-full bg-lilac/15 px-3 py-1.5 text-[10px] font-semibold text-primary hover:bg-lilac/25">{status} ×</button>}
          {period !== 'All Periods' && <button onClick={() => setPeriod('All Periods')} className="rounded-full bg-lilac/15 px-3 py-1.5 text-[10px] font-semibold text-primary hover:bg-lilac/25">{period} ×</button>}
          <span className="ml-auto text-[9px] font-medium text-muted">Results refresh in real time</span>
        </div>}
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['Authorized matches', results.length.toString(), 'Current keyword and parameter scope', 'shield' as const],
          ['Entity coverage', `${composition.filter(item => item.count).length} / 5`, 'Institutional record categories represented', 'structure' as const],
          ['Latest synchronization', 'Oct 10', 'Verified source refresh · 09:20 AM', 'clock' as const],
        ].map(([label, value, detail, icon]) => (
          <article key={label} className="rounded-2xl border border-lilac/15 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-lilac/40 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-muted">{label}</p><p className="mt-2 text-2xl font-bold text-primary count-animate">{value}</p><p className="mt-1 text-[10px] text-muted">{detail}</p></div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lilac/15 text-primary"><Icon name={icon} size={16} /></span>
            </div>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-lilac/15 p-5 lg:flex-row lg:items-end">
          <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Quick-lookup view</p><p className="mt-1 text-base font-bold text-primary">Authorized Results Display</p><p className="mt-1 text-[10px] text-muted">Showing {results.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, results.length)} of {results.length} authorized records.</p></div>
          <div className="flex max-w-md flex-1 items-end gap-2">
            {composition.map(item => (
              <div key={item.type} className="group relative flex-1" title={`${item.type}: ${item.count} matching records`}>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface"><span className="block h-full rounded-full bg-lilac transition-all duration-500" style={{ width: `${item.count ? Math.max(18, item.count / maxComposition * 100) : 0}%` }} /></div>
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary px-2.5 py-1.5 text-[9px] font-semibold text-white shadow-xl group-hover:block">{item.type} · {item.count}</div>
              </div>
            ))}
          </div>
        </div>
        <ChartDataSummary
          className="mx-5 mt-4"
          data={composition}
          categoryKey="type"
          totalLabel="Authorized matches"
          series={[{ key: 'count', label: 'Records', color: '#BB96E4' }]}
        />
        {pageResults.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead className="bg-primary text-white">
                <tr>{['Entity ID / Code', 'Name / Title', 'Category / Entity Type', 'Associated Department / Unit', 'Current Status / Metric', 'Quick Action'].map(label => <th key={label} className="px-4 py-3.5 text-[8px] font-bold uppercase tracking-[.12em]">{label}</th>)}</tr>
              </thead>
              <tbody>
                {pageResults.map((record, index) => (
                  <tr key={record.id} className={`border-b border-lilac/10 transition-colors last:border-0 hover:bg-blossom/20 ${index % 2 ? 'bg-surface/35' : ''}`}>
                    <td className="px-4 py-4"><span className="font-mono text-[10px] font-bold text-primary">{record.id}</span><span className="mt-1 block text-[8px] text-muted">{record.period}</span></td>
                    <td className="px-4 py-4"><p className="max-w-56 text-xs font-bold leading-snug text-primary">{record.name}</p><p className="mt-1 text-[9px] text-muted">Updated {record.updated.split(' · ')[0]}</p></td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-2 rounded-xl bg-lilac/12 px-2.5 py-1.5 text-[9px] font-bold text-primary"><Icon name={entityIcon(record.type)} size={13} />{record.type}</span></td>
                    <td className="px-4 py-4 text-[10px] font-medium leading-relaxed text-muted">{record.department}</td>
                    <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-[8px] font-bold ${statusTone[record.status]}`}>{record.status}</span><p className="mt-2 max-w-52 text-[10px] font-semibold leading-relaxed text-primary">{record.metric}</p></td>
                    <td className="px-4 py-4"><button type="button" onClick={() => openRecord(record)} className="flex items-center gap-1.5 rounded-xl bg-lilac/12 px-3 py-2 text-[10px] font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white">{record.action}<Icon name="arrow" size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blossom text-obsidian"><Icon name="search" /></span>
            <p className="mt-4 text-sm font-bold text-primary">No authorized records match this scope</p>
            <p className="mt-1 text-xs text-muted">Try a broader keyword, remove one parameter, or restore the complete authorized view.</p>
            <button onClick={clearAll} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white">Clear All Filters</button>
          </div>
        )}
        <div className="flex flex-col justify-between gap-3 border-t border-lilac/15 bg-surface/45 px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-[10px] text-muted">Page <strong className="text-primary">{page}</strong> of <strong className="text-primary">{totalPages}</strong> · Permission-filtered institutional results</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage(value => Math.max(1, value - 1))} disabled={page === 1} className="rounded-xl border border-lilac/20 px-3 py-2 text-[10px] font-bold text-muted hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => <button type="button" key={pageNumber} onClick={() => setPage(pageNumber)} className={`h-8 w-8 rounded-xl text-[10px] font-bold ${pageNumber === page ? 'bg-primary text-white shadow-md' : 'border border-lilac/20 bg-white text-muted hover:border-lilac hover:text-primary'}`}>{pageNumber}</button>)}
            <button type="button" onClick={() => setPage(value => Math.min(totalPages, value + 1))} disabled={page === totalPages} className="rounded-xl border border-lilac/20 px-3 py-2 text-[10px] font-bold text-muted hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>

      <aside className="flex flex-col justify-between gap-3 rounded-3xl border border-lilac/20 bg-gradient-to-r from-lilac/10 via-white to-blossom/30 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm"><Icon name="shield" size={17} /></span>
          <div><p className="text-xs font-bold text-primary">Permission-aware institutional discovery</p><p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-muted">The President, System Administrators, and authorized data officers may discover only records permitted by their assigned institutional role. Detailed views preserve responsible-unit attribution and verification history.</p></div>
        </div>
        <span className="shrink-0 rounded-full border border-coa/20 bg-coa/5 px-3 py-1.5 text-[9px] font-bold text-coa">AUTHORIZED · READ ONLY</span>
      </aside>

      {selected && (
        <div className="modal-backdrop fixed inset-0 z-[310] flex justify-end bg-primary/65 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
          <aside className="modal-content h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-lilac/15 bg-white/95 px-6 py-5 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-lilac/15 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-widest text-primary">{selected.type}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[8px] font-bold ${statusTone[selected.status]}`}>{selected.status}</span>
                  </div>
                  <p className="mt-3 font-mono text-[10px] font-bold text-lilac">{selected.id}</p>
                  <p className="mt-1 text-xl font-bold tracking-tight text-primary">{selected.name}</p>
                  <p className="mt-1 text-xs text-muted">{selected.department}</p>
                </div>
                <button onClick={() => setSelected(null)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-muted transition-colors hover:bg-blossom hover:text-primary" aria-label="Close detailed record drawer"><Icon name="close" size={16} /></button>
              </div>
            </div>
            <div className="p-6">
              <section className="rounded-3xl bg-primary p-5 text-white">
                <p className="text-[8px] font-bold uppercase tracking-[.16em] text-lilac">Current status / metric</p>
                <p className="mt-2 text-base font-bold">{selected.metric}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-[9px] text-white/55">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{selected.period}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Updated {selected.updated}</span>
                </div>
              </section>
              <div className="mt-6">
                <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Comprehensive authorized record</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {selected.details.map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-lilac/15 bg-surface p-4">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-muted">{label}</p>
                      <p className="mt-2 text-xs font-semibold leading-relaxed text-primary">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <section className="mt-6 rounded-2xl border border-coa/15 bg-coa/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-coa shadow-sm"><Icon name="shield" size={16} /></span>
                  <div><p className="text-[9px] font-bold uppercase tracking-widest text-coa">Associated audit trail logs</p><p className="mt-2 text-[11px] leading-relaxed text-muted">{selected.audit}</p><p className="mt-2 text-[9px] font-semibold text-primary">Responsible data owner: {selected.owner}</p></div>
                </div>
              </section>
              <section className="mt-4 rounded-2xl border border-golden/30 bg-golden/10 p-4 text-[10px] leading-relaxed text-obsidian">
                This executive quick-look view is read-only. Source data remains governed by the responsible institutional unit and every detailed lookup is permission-scoped.
              </section>
              <button onClick={() => setSelected(null)} className="mt-6 w-full rounded-2xl bg-primary px-5 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary/90">Close Record</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
