import { useMemo, useState, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartModal from '../../components/ChartModal';
import ChartSelection from '../../components/ChartSelection';
import { useApp } from '../../context/AppContext';
import ChartDataSummary from '../../components/ChartDataSummary';

type ProjectType = 'All' | 'Capacity Building' | 'Livelihood Training' | 'Digital Literacy' | 'Health & Wellness';
type ExtensionTeam = 'All' | 'CCS Extension' | 'COE Extension';
type SdgTag = 'All' | 'SDG 1' | 'SDG 4' | 'SDG 8';
type ChartId = 'reach' | 'satisfaction' | 'impact' | 'participation';
type ExportScope = 'page' | ChartId;

interface CommunityRecord {
  community: string;
  projectType: Exclude<ProjectType, 'All'>;
  team: Exclude<ExtensionTeam, 'All'>;
  sdg: Exclude<SdgTag, 'All'>;
  beneficiaries: number;
  satisfaction: number;
  documented: number;
  projects: number;
  facultyRate: number;
  volunteers: number;
  color: string;
}

const DEFAULT_FILTERS = {
  projectType: 'All' as ProjectType,
  team: 'All' as ExtensionTeam,
  sdg: 'All' as SdgTag,
};

// Community totals are source supplied. The team-level mapping exists only to demonstrate client-side filtering.
const COMMUNITY_DATA: CommunityRecord[] = [
  { community: 'Barangay Bagbag', projectType: 'Capacity Building', team: 'CCS Extension', sdg: 'SDG 8', beneficiaries: 1250, satisfaction: 4.7, documented: 4, projects: 5, facultyRate: 60, volunteers: 390, color: '#BB96E4' },
  { community: 'Barangay San Bartolome', projectType: 'Capacity Building', team: 'COE Extension', sdg: 'SDG 8', beneficiaries: 980, satisfaction: 4.8, documented: 3, projects: 4, facultyRate: 58, volunteers: 310, color: '#FFD066' },
  { community: 'Barangay Holy Spirit', projectType: 'Capacity Building', team: 'CCS Extension', sdg: 'SDG 8', beneficiaries: 1400, satisfaction: 4.9, documented: 5, projects: 6, facultyRate: 66, volunteers: 450, color: '#4C1413' },
];

const CHARTS = [
  { id: 'reach', label: 'Beneficiary Headcounts' },
  { id: 'satisfaction', label: 'Program Satisfaction' },
  { id: 'impact', label: 'Impact Documentation' },
  { id: 'participation', label: 'Stakeholder Participation' },
];

const tooltipStyle = {
  borderRadius: 16,
  border: '1px solid rgba(187,150,228,.3)',
  background: '#200D2D',
  color: '#fff',
  boxShadow: '0 12px 32px rgba(32,13,45,.22)',
  fontSize: 11,
};

function Icon({ type }: { type: 'community' | 'heart' | 'document' | 'faculty' | 'student' | 'filter' | 'export' | 'info' }) {
  const paths = {
    community: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2.5 20c0-4 2.2-6.5 5.5-6.5s5.5 2.5 5.5 6.5M14 14.5c3.5-.7 6 1.3 6.5 4.5" /></>,
    heart: <path d="M20.8 5.8c-2-2.1-5.3-2.1-7.3 0L12 7.3l-1.5-1.5c-2-2.1-5.3-2.1-7.3 0s-2 5.4 0 7.5L12 22l8.8-8.7c2-2.1 2-5.4 0-7.5z" />,
    document: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v5h4M9 13h7M9 17h5" /></>,
    faculty: <><path d="M12 3L3 8l9 5 9-5-9-5zM6 11v5l6 4 6-4v-5" /></>,
    student: <><circle cx="12" cy="7.5" r="3.5" /><path d="M5 21c0-4.3 2.8-7 7-7s7 2.7 7 7" /></>,
    filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
    export: <><path d="M12 16V3m0 0L7 8m5-5 5 5M4 15v5h16v-5" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" /></>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

function FilterSelect<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="min-w-44 flex-1">
      <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[.16em] text-muted">{label}</span>
      <span className="relative block">
        <select value={value} onChange={event => onChange(event.target.value as T)} className="w-full appearance-none rounded-xl border border-lilac/35 bg-lilac/10 px-3 py-2.5 pr-9 text-xs font-semibold text-primary outline-none transition-all hover:border-lilac focus:ring-4 focus:ring-lilac/15">
          {options.map(option => <option key={option}>{option}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lilac" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </span>
    </label>
  );
}

function MetricCard({ icon, label, value, detail, tone = 'lilac', onClick, anchor = false }: {
  icon: Parameters<typeof Icon>[0]['type'];
  label: string;
  value: string;
  detail: string;
  tone?: 'lilac' | 'gold' | 'rose';
  onClick: () => void;
  anchor?: boolean;
}) {
  const tones = {
    lilac: 'bg-lilac/15 text-primary',
    gold: 'bg-golden/25 text-obsidian',
    rose: 'bg-blossom text-obsidian',
  };
  return (
    <button type="button" onClick={onClick} className={`group rounded-3xl border p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-lilac/20 ${anchor ? 'border-primary/20 bg-gradient-to-br from-primary to-obsidian text-white sm:col-span-2 xl:col-span-1' : 'border-lilac/20 bg-white'}`}>
      <span className="flex items-start justify-between gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${anchor ? 'bg-golden text-primary' : tones[tone]}`}><Icon type={icon} /></span>
        <svg className={`${anchor ? 'text-golden' : 'text-lilac'} opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100`} width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
      </span>
      <span className={`mt-5 block text-[9px] font-bold uppercase tracking-[.16em] ${anchor ? 'text-white/50' : 'text-muted'}`}>{label}</span>
      <span className={`mt-2 block text-2xl font-bold tracking-tight count-animate ${anchor ? 'text-golden' : 'text-primary'}`}>{value}</span>
      <span className={`mt-1 block text-[10px] leading-relaxed ${anchor ? 'text-white/55' : 'text-muted'}`}>{detail}</span>
    </button>
  );
}

function Card({ id, eyebrow, title, description, owner, onView, onExport, summary, children, className = '' }: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  owner: string;
  onView: () => void;
  onExport: () => void;
  summary?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex flex-col gap-3 border-b border-lilac/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">{eyebrow}</p>
          <p className="mt-1 text-sm font-bold text-primary">{title}</p>
          <p className="mt-1 max-w-xl text-[10px] leading-relaxed text-muted">{description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={onView} className="rounded-xl border border-lilac/25 bg-lilac/5 px-3 py-2 text-[10px] font-bold text-primary transition-colors hover:bg-lilac/15">View Chart</button>
          <button type="button" onClick={onExport} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-bold text-white transition-colors hover:bg-primary/90"><Icon type="export" />Export</button>
        </div>
      </div>
      {children}
      {summary}
      <div className="mt-4 flex items-center gap-2 border-t border-lilac/10 pt-3 text-[10px] text-muted"><Icon type="info" /><span><strong className="text-primary">Data owner:</strong> {owner}</span></div>
    </section>
  );
}

function ExportDialog({ scope, onClose, onCsv, onPrint }: {
  scope: ExportScope;
  onClose: () => void;
  onCsv: () => void;
  onPrint: () => void;
}) {
  return (
    <div className="modal-backdrop fixed inset-0 z-[320] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal-content w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-primary to-obsidian p-6 text-white">
          <p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">Active filtered view</p>
          <p className="mt-2 text-lg font-bold">Export {scope === 'page' ? 'all page data' : CHARTS.find(chart => chart.id === scope)?.label}</p>
          <p className="mt-1 text-[10px] text-white/55">Choose a functional format. Filter context and metric units are included.</p>
        </div>
        <div className="grid gap-3 p-6">
          <button type="button" onClick={onCsv} className="flex items-center justify-between rounded-2xl border border-lilac/20 p-4 text-left transition-colors hover:bg-lilac/10">
            <span><span className="block text-xs font-bold text-primary">CSV workbook data</span><span className="mt-1 block text-[10px] text-muted">Downloads the current values as a spreadsheet-ready file.</span></span><Icon type="export" />
          </button>
          <button type="button" onClick={onPrint} className="flex items-center justify-between rounded-2xl border border-lilac/20 p-4 text-left transition-colors hover:bg-blossom/30">
            <span><span className="block text-xs font-bold text-primary">Print-ready PDF</span><span className="mt-1 block text-[10px] text-muted">Opens the browser print dialog; select Save as PDF.</span></span><Icon type="document" />
          </button>
          <button type="button" onClick={onClose} className="rounded-xl bg-surface px-4 py-3 text-xs font-bold text-primary hover:bg-lilac/15">Cancel</button>
        </div>
      </section>
    </div>
  );
}

export default function PresidentCommunitySynergy() {
  const { showToast } = useApp();
  const [projectType, setProjectType] = useState<ProjectType>(DEFAULT_FILTERS.projectType);
  const [team, setTeam] = useState<ExtensionTeam>(DEFAULT_FILTERS.team);
  const [sdg, setSdg] = useState<SdgTag>(DEFAULT_FILTERS.sdg);
  const [visibleCharts, setVisibleCharts] = useState(new Set(CHARTS.map(chart => chart.id)));
  const [activeChart, setActiveChart] = useState<ChartId | null>(null);
  const [exportScope, setExportScope] = useState<ExportScope | null>(null);

  const records = useMemo(() => COMMUNITY_DATA.filter(record =>
    (projectType === 'All' || record.projectType === projectType)
    && (team === 'All' || record.team === team)
    && (sdg === 'All' || record.sdg === sdg)
  ), [projectType, team, sdg]);

  const isSourceBaseline = projectType === DEFAULT_FILTERS.projectType && team === DEFAULT_FILTERS.team && sdg === DEFAULT_FILTERS.sdg;
  const metrics = useMemo(() => {
    const reach = records.reduce((sum, record) => sum + record.beneficiaries, 0);
    const projects = records.reduce((sum, record) => sum + record.projects, 0);
    const documented = records.reduce((sum, record) => sum + record.documented, 0);
    const volunteers = records.reduce((sum, record) => sum + record.volunteers, 0);
    const satisfaction = records.length ? records.reduce((sum, record) => sum + record.satisfaction, 0) / records.length : 0;
    const facultyRate = reach ? records.reduce((sum, record) => sum + record.facultyRate * record.beneficiaries, 0) / reach : 0;
    return {
      reach,
      projects,
      documented,
      remaining: projects - documented,
      assessmentRate: projects ? documented / projects * 100 : 0,
      volunteers,
      satisfaction,
      facultyRate,
    };
  }, [records]);

  const filterContext = `Project Type: ${projectType}; College Extension Team: ${team}; SDG Tag: ${sdg}`;
  const sourceStatus = isSourceBaseline ? 'Prototype sample data' : 'Sample prototype data · deterministic demonstration mapping';

  function resetFilters() {
    setProjectType(DEFAULT_FILTERS.projectType);
    setTeam(DEFAULT_FILTERS.team);
    setSdg(DEFAULT_FILTERS.sdg);
    showToast({ type: 'info', title: 'Community filters reset', body: 'All project types, extension teams, and SDG tags are restored.' });
  }

  function toggleChart(id: string, checked: boolean) {
    setVisibleCharts(previous => {
      const next = new Set(previous);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  }

  function downloadCsv(scope: ExportScope) {
    const rows: (string | number)[][] = [
      ['QCU InfoBoard', 'President Community Synergy'],
      ['Data status', sourceStatus],
      ['Filters', filterContext],
      ['Metric units', 'beneficiaries; score out of 5.0; projects; percentage; students'],
      [],
    ];
    if (scope === 'page' || scope === 'reach') {
      rows.push(['Community', 'Beneficiaries', 'Data Owner'], ...records.map(record => [record.community, record.beneficiaries, 'REPL-EMO']), ['Filtered Total Reach', metrics.reach, 'REPL-EMO']);
    }
    if (scope === 'page' || scope === 'satisfaction') rows.push(['Program Satisfaction', metrics.satisfaction.toFixed(1), 'REPL-EMO, College Extension Teams']);
    if (scope === 'page' || scope === 'impact') rows.push(['Fully Documented', metrics.documented, 'REPL-EMO, College Extension Teams'], ['Active Projects', metrics.projects, 'REPL-EMO, College Extension Teams'], ['Documentation Rate', `${metrics.assessmentRate.toFixed(0)}%`, 'REPL-EMO, College Extension Teams'], ['Calculated Remaining', metrics.remaining, 'Calculated']);
    if (scope === 'page' || scope === 'participation') rows.push(['Faculty Participation Rate', `${metrics.facultyRate.toFixed(0)}%`, 'REPL-EMO, RMO, OVPAA'], ['Student Volunteer Turnout', metrics.volunteers, 'REPL-EMO, RMO, OVPAA']);
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `QCU-Community-Synergy-${scope}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportScope(null);
    showToast({ type: 'success', title: 'CSV downloaded', body: 'The active filtered view and its data-owner context were exported.' });
  }

  function printView() {
    window.print();
    setExportScope(null);
    showToast({ type: 'info', title: 'Print dialog opened', body: 'Choose “Save as PDF” to create the file. No download is claimed until you save it.' });
  }

  const reachChart = (large = false) => (
    <div className={large ? 'h-[390px]' : 'h-72'} aria-label={`Beneficiary headcounts. Filtered total ${metrics.reach.toLocaleString()} beneficiaries.`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={records} margin={{ top: 28, right: 12, left: -8, bottom: large ? 18 : 8 }}>
          <CartesianGrid vertical={false} stroke="rgba(187,150,228,.16)" />
          <XAxis dataKey="community" tick={{ fontSize: large ? 11 : 9, fill: '#7B6891' }} axisLine={false} tickLine={false} interval={0} />
          <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: 'rgba(187,150,228,.08)' }} contentStyle={tooltipStyle} labelStyle={{ color: '#FFD066', fontWeight: 700 }} formatter={value => [`${Number(value).toLocaleString()} beneficiaries`, 'Community reach']} />
          <Bar dataKey="beneficiaries" name="Beneficiaries" radius={[10, 10, 2, 2]} maxBarSize={large ? 110 : 78}>
            {records.map(record => <Cell key={record.community} fill={record.color} />)}
            <LabelList dataKey="beneficiaries" position="top" formatter={(value: unknown) => Number(value).toLocaleString()} fill="#200D2D" fontSize={11} fontWeight={700} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const gauge = (large = false) => {
    const circumference = 2 * Math.PI * 70;
    const offset = circumference * (1 - metrics.satisfaction / 5);
    return (
      <button type="button" title={`${metrics.satisfaction.toFixed(1)} out of 5.0 · Overall program satisfaction`} onClick={() => setActiveChart('satisfaction')} className={`group mx-auto flex w-full flex-col items-center justify-center rounded-2xl outline-none focus:ring-4 focus:ring-lilac/20 ${large ? 'min-h-96' : 'min-h-72'}`} aria-label={`Overall program satisfaction ${metrics.satisfaction.toFixed(1)} out of 5.0`}>
        <span className="relative block h-48 w-48">
          <svg className="-rotate-90" width="192" height="192" viewBox="0 0 192 192">
            <circle cx="96" cy="96" r="70" fill="none" stroke="rgba(187,150,228,.14)" strokeWidth="18" />
            <circle cx="96" cy="96" r="70" fill="none" stroke="#BB96E4" strokeWidth="18" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700" />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-primary">{metrics.satisfaction.toFixed(1)}</span>
            <span className="mt-1 text-[10px] font-semibold text-muted">out of 5.0</span>
          </span>
        </span>
        <span className="mt-1 rounded-full bg-lilac/10 px-3 py-1 text-[9px] font-bold text-primary">Overall program satisfaction</span>
        <span className="mt-2 text-[9px] text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">Exact score: {metrics.satisfaction.toFixed(1)} / 5.0</span>
      </button>
    );
  };

  const impactVisual = (large = false) => (
    <div className={`flex flex-col justify-center ${large ? 'min-h-96' : 'min-h-72'}`}>
      <div className="grid grid-cols-3 gap-2">
        {[['Fully documented', metrics.documented], ['Active projects', metrics.projects], ['Calculated remaining', metrics.remaining]].map(([label, value]) => (
          <button type="button" key={String(label)} title={`${label}: ${value}`} className="rounded-2xl border border-lilac/15 bg-surface p-3 text-center outline-none transition-colors hover:bg-lilac/10 focus:ring-4 focus:ring-lilac/20">
            <span className="block text-xl font-bold text-primary">{value}</span><span className="mt-1 block text-[9px] leading-snug text-muted">{label}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-lilac/15 p-4" tabIndex={0} title={`${metrics.documented} of ${metrics.projects} projects · ${metrics.assessmentRate.toFixed(0)}% documented`}>
        <div className="flex items-end justify-between gap-3"><span><span className="block text-[9px] font-bold uppercase tracking-wider text-muted">Documentation progress</span><span className="mt-1 block text-lg font-bold text-primary">{metrics.documented} / {metrics.projects}</span></span><span className="text-2xl font-bold text-lilac">{metrics.assessmentRate.toFixed(0)}%</span></div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-lilac/10"><div className="h-full rounded-full bg-gradient-to-r from-primary to-lilac transition-all duration-700" style={{ width: `${metrics.assessmentRate}%` }} /></div>
      </div>
    </div>
  );

  const participationVisual = (large = false) => (
    <div className={`grid gap-3 sm:grid-cols-2 ${large ? 'min-h-96 content-center' : 'min-h-72 content-center'}`}>
      <button type="button" title={`${metrics.facultyRate.toFixed(0)}% faculty participation rate`} onClick={() => setActiveChart('participation')} className="rounded-3xl bg-gradient-to-br from-lilac/20 to-blossom/40 p-5 text-left outline-none transition-transform hover:-translate-y-1 focus:ring-4 focus:ring-lilac/20">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm"><Icon type="faculty" /></span>
        <span className="mt-5 block text-3xl font-bold text-primary">{metrics.facultyRate.toFixed(0)}%</span>
        <span className="mt-1 block text-[10px] font-bold text-primary">Faculty participation rate</span>
        <span className="mt-2 block text-[9px] leading-relaxed text-muted">Percentage only; no unsupported faculty headcount inferred.</span>
      </button>
      <button type="button" title={`${metrics.volunteers.toLocaleString()} student volunteers`} onClick={() => setActiveChart('participation')} className="rounded-3xl bg-gradient-to-br from-golden/30 to-blossom/45 p-5 text-left outline-none transition-transform hover:-translate-y-1 focus:ring-4 focus:ring-lilac/20">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-obsidian shadow-sm"><Icon type="student" /></span>
        <span className="mt-5 block text-3xl font-bold text-primary">{metrics.volunteers.toLocaleString()}</span>
        <span className="mt-1 block text-[10px] font-bold text-primary">Student volunteer turnout</span>
        <span className="mt-2 block text-[9px] leading-relaxed text-muted">Students participating in the current sample scope.</span>
      </button>
    </div>
  );

  const chartContent = (id: ChartId, large = false) => id === 'reach' ? reachChart(large) : id === 'satisfaction' ? gauge(large) : id === 'impact' ? impactVisual(large) : participationVisual(large);
  const chartMeta: Record<ChartId, { title: string; description: string; owner: string; unit: string }> = {
    reach: { title: 'Beneficiary Headcounts by QC Community', description: 'Exact community beneficiary counts in the active filter scope.', owner: 'REPL-EMO', unit: 'Beneficiaries' },
    satisfaction: { title: 'Overall Program Satisfaction', description: 'Average beneficiary satisfaction on a visible 0–5 scale.', owner: 'REPL-EMO, College Extension Teams', unit: 'Score out of 5.0' },
    impact: { title: 'Impact Assessment Documentation', description: 'Aggregate documented assessments, active projects, rate, and calculated remainder.', owner: 'REPL-EMO, College Extension Teams', unit: 'Projects and percentage' },
    participation: { title: 'Stakeholder Participation', description: 'Faculty participation percentage and student volunteer headcount with their correct units.', owner: 'REPL-EMO, RMO, OVPAA', unit: 'Percentage and students' },
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-obsidian p-6 text-white shadow-xl">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute -bottom-16 right-1/3 h-48 w-48 rounded-full bg-blossom/10 blur-3xl" />
        <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-lilac/25 bg-lilac/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-lilac">Strategic Directions · Pillar 5</span>
              <span className="rounded-full border border-golden/25 bg-golden/10 px-3 py-1 text-[9px] font-bold text-golden">Prototype sample data</span>
            </div>
            <p className="mt-5 text-2xl font-bold tracking-tight">Community Synergy</p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/60">Review community reach, extension-project satisfaction, impact-assessment progress, and stakeholder participation.</p>
          </div>
          <button type="button" onClick={() => setExportScope('page')} className="flex items-center justify-center gap-2 rounded-xl bg-golden px-4 py-2.5 text-xs font-bold text-primary transition-all hover:-translate-y-0.5 hover:bg-golden/90"><Icon type="export" />Export All Page Data</button>
        </div>
      </section>

      <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-lilac/10 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lilac/15 text-primary"><Icon type="filter" /></span>
            <div><p className="text-xs font-bold text-primary">Community Impact Filters</p><p className="mt-0.5 text-[10px] text-muted">Every metric refreshes immediately from one shared state.</p></div>
          </div>
          <ChartSelection charts={CHARTS} visible={visibleCharts} onChange={toggleChart} />
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <FilterSelect label="Extension Project Type" value={projectType} options={['All', 'Capacity Building', 'Livelihood Training', 'Digital Literacy', 'Health & Wellness'] as const} onChange={setProjectType} />
          <FilterSelect label="College Extension Team" value={team} options={['All', 'CCS Extension', 'COE Extension'] as const} onChange={setTeam} />
          <FilterSelect label="SDG Tag" value={sdg} options={['All', 'SDG 1', 'SDG 4', 'SDG 8'] as const} onChange={setSdg} />
          <button type="button" onClick={resetFilters} disabled={isSourceBaseline} className="rounded-xl border border-lilac/25 px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-lilac/10 disabled:cursor-not-allowed disabled:opacity-40">Reset Filters</button>
        </div>
      </section>

      {!records.length ? (
        <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-14 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blossom text-obsidian"><Icon type="community" /></span>
          <p className="mt-4 text-sm font-bold text-primary">No source records match this combination</p>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted">The supplied source contains no project-level mapping for {projectType} · {team} · {sdg}. No zero totals or unsupported institutional records are inferred.</p>
          <button type="button" onClick={resetFilters} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90">Restore all filters</button>
        </section>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard icon="community" label="Total Community Reach" value={metrics.reach.toLocaleString()} detail={`${isSourceBaseline ? 'Source total' : 'Filtered demo subtotal'} · beneficiaries`} anchor onClick={() => setActiveChart('reach')} />
            <MetricCard icon="heart" label="Program Satisfaction" value={`${metrics.satisfaction.toFixed(1)} / 5.0`} detail="Overall program average" onClick={() => setActiveChart('satisfaction')} />
            <MetricCard icon="document" label="Impact Assessments" value={`${metrics.documented} / ${metrics.projects}`} detail={`${metrics.assessmentRate.toFixed(0)}% documented · ${metrics.remaining} remaining (calculated)`} tone="gold" onClick={() => setActiveChart('impact')} />
            <MetricCard icon="faculty" label="Faculty Participation" value={`${metrics.facultyRate.toFixed(0)}%`} detail="Rate · no headcount inferred" tone="rose" onClick={() => setActiveChart('participation')} />
            <MetricCard icon="student" label="Student Volunteer Turnout" value={metrics.volunteers.toLocaleString()} detail="Students in current scope" onClick={() => setActiveChart('participation')} />
          </div>

          {visibleCharts.size === 0 && (
            <section className="rounded-3xl border border-dashed border-lilac/40 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-sm font-bold text-primary">All visualization cards are hidden</p>
              <p className="mt-2 text-xs text-muted">Your filters remain active. Restore cards without changing the current data scope.</p>
              <button type="button" onClick={() => setVisibleCharts(new Set(CHARTS.map(chart => chart.id)))} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white">Restore all visualizations</button>
            </section>
          )}

          <div className="grid gap-5 xl:grid-cols-2">
            {visibleCharts.has('reach') && <Card id="community-reach" eyebrow="Community reach" title="Beneficiary Headcounts by QC Community" description="Exact community totals and calculated share of the active filtered reach." owner="REPL-EMO" onView={() => setActiveChart('reach')} onExport={() => setExportScope('reach')} summary={<ChartDataSummary className="mt-3" data={records} categoryKey="community" totalLabel="Total community reach" series={[{ key: 'beneficiaries', label: 'Beneficiaries', color: '#BB96E4' }]} />}>{reachChart()}</Card>}
            {visibleCharts.has('satisfaction') && <Card id="community-satisfaction" eyebrow="Beneficiary experience" title="Overall Program Satisfaction" description="Accessible 0–5 gauge showing the exact overall satisfaction average." owner="REPL-EMO, College Extension Teams" onView={() => setActiveChart('satisfaction')} onExport={() => setExportScope('satisfaction')}>{gauge()}</Card>}
            {visibleCharts.has('impact') && <Card id="community-impact" eyebrow="Evidence & accountability" title="Impact Assessment Documentation" description="Aggregate documentation status only; no unsupported project names are introduced." owner="REPL-EMO, College Extension Teams" onView={() => setActiveChart('impact')} onExport={() => setExportScope('impact')}>{impactVisual()}</Card>}
            {visibleCharts.has('participation') && <Card id="community-participation" eyebrow="Stakeholder participation" title="Faculty & Student Engagement" description="Exact percentage and headcount values with their distinct units." owner="REPL-EMO, RMO, OVPAA" onView={() => setActiveChart('participation')} onExport={() => setExportScope('participation')}>{participationVisual()}</Card>}
          </div>

        </>
      )}

      {activeChart && records.length > 0 && (
        <ChartModal
          title={chartMeta[activeChart].title}
          description={`${chartMeta[activeChart].description} Current filters: ${filterContext}`}
          chart={chartContent(activeChart, true)}
          dataSummary={activeChart === 'reach' ? <ChartDataSummary data={records} categoryKey="community" totalLabel="Total community reach" series={[{ key: 'beneficiaries', label: 'Beneficiaries', color: '#BB96E4' }]} /> : undefined}
          onClose={() => setActiveChart(null)}
          onExport={() => setExportScope(activeChart)}
          summary={[
            { label: 'Current filters', value: `${projectType} · ${team} · ${sdg}` },
            { label: 'Units', value: chartMeta[activeChart].unit },
            { label: 'Data owner', value: chartMeta[activeChart].owner },
            { label: 'Data status', value: sourceStatus },
          ]}
          insights={[
            'The enlarged view uses the same shared filter state as every KPI and card on the page.',
            isSourceBaseline ? 'These aggregate figures are preserved exactly from the supplied Community Synergy source.' : 'This filtered breakdown is explicitly labeled as deterministic sample prototype data.',
          ]}
        />
      )}
      {exportScope && <ExportDialog scope={exportScope} onClose={() => setExportScope(null)} onCsv={() => downloadCsv(exportScope)} onPrint={printView} />}
    </div>
  );
}
