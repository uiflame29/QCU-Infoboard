import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useApp } from '../../context/AppContext';

type ExportFormat = 'PDF' | 'XLSX';
type GeneratedReport = {
  name: string;
  title: string;
  format: ExportFormat;
  size: string;
  pages: number;
  timestamp: string;
  scope: string;
};

const IDP_PERIOD = '2026–2031';
const REPORT_CATEGORY = `Comprehensive Institutional IDP Progress Report (${IDP_PERIOD})`;
const COLLEGES = ['All Colleges', 'CCS', 'COB', 'COA', 'COE', 'COED'];
const COLLEGE_DATA: Record<string, { students: number; firstGen: number; faculty: number; research: number; infrastructure: number; performance: number; compliance: number; risks: number; share: number }> = {
  'All Colleges': { students: 14850, firstGen: 64, faculty: 540, research: 28, infrastructure: 74.5, performance: 86.5, compliance: 92.6, risks: 3, share: 1 },
  CCS: { students: 4200, firstGen: 68, faculty: 138, research: 9, infrastructure: 82.4, performance: 88.4, compliance: 94.1, risks: 1, share: .283 },
  COB: { students: 3500, firstGen: 66, faculty: 119, research: 5, infrastructure: 76.8, performance: 87.1, compliance: 93.5, risks: 1, share: .236 },
  COA: { students: 1850, firstGen: 61, faculty: 72, research: 4, infrastructure: 78.2, performance: 89.2, compliance: 96.2, risks: 0, share: .125 },
  COE: { students: 3100, firstGen: 62, faculty: 116, research: 7, infrastructure: 69.3, performance: 82.8, compliance: 88.7, risks: 2, share: .209 },
  COED: { students: 2200, firstGen: 63, faculty: 95, research: 3, infrastructure: 73.6, performance: 86.9, compliance: 94.8, risks: 1, share: .148 },
};

const MODULES = [
  { id: 'kpi', label: 'Executive KPI Scorecard Summary', pageWeight: 2 },
  { id: 'pillars', label: '7-Pillar Target vs Actual Performance Breakdown', pageWeight: 4 },
  { id: 'enrollment', label: 'Enrollment & Demographic Matrices', pageWeight: 3 },
  { id: 'faculty', label: 'Faculty Qualification & CHED Compliance Audit', pageWeight: 3 },
  { id: 'forecast', label: 'Trend & Forecast Analysis', pageWeight: 2 },
  { id: 'risk', label: 'Risk & Exception Monitoring Matrix', pageWeight: 2 },
  { id: 'research', label: 'Research Productivity Analytics', pageWeight: 2 },
  { id: 'infrastructure', label: 'Infrastructure Readiness Metrics', pageWeight: 2 },
  { id: 'governance', label: 'Governance & Excellence Indicators', pageWeight: 2 },
  { id: 'audit', label: 'Audit Log Summary', pageWeight: 1 },
];

const TEMPLATES = [
  { id: 'institutional', title: 'Institutional Performance Configuration', description: 'KPI summary, seven strategic pillars, and executive recommendations.', modules: ['kpi', 'pillars', 'forecast', 'risk'], accent: 'bg-lilac/15' },
  { id: 'board', title: 'Board of Regents Configuration', description: 'Institutional metrics, strategic performance, governance, and risk alerts.', modules: ['kpi', 'pillars', 'risk', 'governance'], accent: 'bg-golden/25' },
  { id: 'enrollment', title: 'Enrollment & Demographic Configuration', description: 'Enrollment statistics, first-generation distribution, and geographic origin analytics.', modules: ['kpi', 'enrollment', 'forecast'], accent: 'bg-blossom/60' },
  { id: 'faculty', title: 'Faculty Compliance Configuration', description: 'Qualification analysis, CHED compliance, academic ranks, and audit evidence.', modules: ['faculty', 'governance', 'audit'], accent: 'bg-lilac/15' },
  { id: 'research', title: 'Research and Innovation Configuration', description: 'Publications, grants, intellectual property, and productivity trends.', modules: ['research', 'forecast', 'kpi'], accent: 'bg-golden/25' },
  { id: 'infrastructure', title: 'Infrastructure Readiness Configuration', description: 'Facility utilization, smart campus metrics, and accessibility compliance.', modules: ['infrastructure', 'risk', 'governance'], accent: 'bg-blossom/60' },
];

const FREQUENT = [
  { title: 'Comprehensive IDP Progress Report · Quarterly Edition', count: 124, date: '10/09/2026', format: 'PDF' as ExportFormat, modules: ['kpi', 'pillars', 'risk', 'forecast'] },
  { title: 'Comprehensive IDP Progress Report · Governance Edition', count: 96, date: '10/02/2026', format: 'PDF' as ExportFormat, modules: ['kpi', 'pillars', 'governance'] },
  { title: 'Comprehensive IDP Progress Report · Analytical Workbook', count: 82, date: '09/28/2026', format: 'XLSX' as ExportFormat, modules: ['enrollment', 'faculty', 'research', 'forecast'] },
];

const INITIAL_EXPORTS = [
  { id: '1', report: 'QCU_InfoBoard_IDP_Progress_2026.pdf', title: REPORT_CATEGORY, by: 'Dr. Theresita V. Atienza', format: 'PDF' as ExportFormat, scope: 'All Colleges (Institution-wide)', generated: 'October 9, 2026 · 11:40 PM', last: 'October 9, 2026', size: '4.2 MB', pages: 18 },
  { id: '2', report: 'QCU_InfoBoard_IDP_Progress_CCS_2026.pdf', title: REPORT_CATEGORY, by: 'Office of the President', format: 'PDF' as ExportFormat, scope: 'CCS', generated: 'October 7, 2026 · 4:15 PM', last: 'October 7, 2026', size: '3.8 MB', pages: 16 },
  { id: '3', report: 'QCU_InfoBoard_IDP_Progress_COB_2026.xlsx', title: REPORT_CATEGORY, by: 'Planning Office', format: 'XLSX' as ExportFormat, scope: 'COB', generated: 'October 4, 2026 · 9:05 AM', last: 'October 4, 2026', size: '2.7 MB', pages: 12 },
  { id: '4', report: 'QCU_InfoBoard_IDP_Progress_COA_2026.pdf', title: REPORT_CATEGORY, by: 'Planning Office', format: 'PDF' as ExportFormat, scope: 'COA', generated: 'September 30, 2026 · 2:20 PM', last: 'September 30, 2026', size: '3.4 MB', pages: 15 },
  { id: '5', report: 'QCU_InfoBoard_IDP_Progress_COE_2026.pdf', title: REPORT_CATEGORY, by: 'Office of the President', format: 'PDF' as ExportFormat, scope: 'COE', generated: 'September 28, 2026 · 10:10 AM', last: 'September 28, 2026', size: '3.9 MB', pages: 17 },
  { id: '6', report: 'QCU_InfoBoard_IDP_Progress_COED_2026.xlsx', title: REPORT_CATEGORY, by: 'Planning Office', format: 'XLSX' as ExportFormat, scope: 'COED', generated: 'September 24, 2026 · 8:30 AM', last: 'September 24, 2026', size: '2.5 MB', pages: 11 },
];

const GENERATION_STEPS = ['Collecting Data', 'Validating Metrics', 'Building Visualizations', 'Formatting Output', 'Preparing Export'];

function Icon({ type, className = '' }: { type: 'report' | 'calendar' | 'file' | 'category' | 'clock' | 'download' | 'check' | 'shield' | 'eye'; className?: string }) {
  const paths = {
    report: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h4M8 12h8M8 16h6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4m8-4v4M3 10h18" /></>,
    file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    category: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    download: <><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" /></>,
    check: <path d="M5 12l4 4L19 6" />,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M8 12l2.5 2.5L16 9" /></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></>,
  };
  return <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

function SectionHeading({ eyebrow, title, detail, action }: { eyebrow?: string; title: string; detail: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">{eyebrow}</p>}
        <p className="mt-1 text-base font-bold text-primary">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
      </div>
      {action}
    </div>
  );
}

export default function PresidentExportReports() {
  const { currentUser, showModal, showToast } = useApp();
  const [college, setCollege] = useState(COLLEGES[0]);
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set(MODULES.slice(0, 6).map(module => module.id)));
  const [format, setFormat] = useState<ExportFormat>('PDF');
  const [previewPage, setPreviewPage] = useState('Report Content');
  const [generationStep, setGenerationStep] = useState<number | null>(null);
  const [generationSnapshot, setGenerationSnapshot] = useState<{ title: string; format: ExportFormat } | null>(null);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [recentExports, setRecentExports] = useState(INITIAL_EXPORTS);

  const selectedDetails = MODULES.filter(module => selectedModules.has(module.id));
  const predictedPages = Math.max(4, 4 + selectedDetails.reduce((sum, module) => sum + module.pageWeight, 0));
  const predictedSize = (predictedPages * (format === 'PDF' ? 0.23 : 0.15) + selectedModules.size * 0.08).toFixed(1);
  const complexity = selectedModules.size >= 8 ? 'Advanced' : selectedModules.size >= 5 ? 'Moderate' : 'Standard';
  const scopeLabel = college === 'All Colleges' ? 'All Colleges (Institution-wide)' : college;
  const scopeMetrics = COLLEGE_DATA[college];
  const scopeFactor = scopeMetrics.share;
  const totalReports = Math.max(28, Math.round(458 * scopeFactor));
  const monthlyExports = Math.max(7, Math.round(63 * scopeFactor));
  const scopedRecentExports = recentExports.filter(item => item.scope === scopeLabel);
  const lastGenerated = scopedRecentExports[0]?.last ?? 'No matching exports';

  const recommendedTemplates = useMemo(() => {
    if (college !== 'All Colleges') return [...TEMPLATES].sort(template => template.id === 'enrollment' || template.id === 'faculty' ? -1 : 1);
    return TEMPLATES;
  }, [college]);

  useEffect(() => {
    if (generationStep === null || !generationSnapshot) return;
    const timer = window.setTimeout(() => {
      if (generationStep < GENERATION_STEPS.length - 1) {
        setGenerationStep(step => step === null ? null : step + 1);
        return;
      }
      const now = new Date();
      const extension = generationSnapshot.format.toLowerCase();
      const report: GeneratedReport = {
        name: `QCU_InfoBoard_IDP_Progress_${college === 'All Colleges' ? 'Institutional' : college}_2026.${extension}`,
        title: REPORT_CATEGORY,
        format: generationSnapshot.format,
        size: `${predictedSize} MB`,
        pages: predictedPages,
        timestamp: now.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        scope: scopeLabel,
      };
      setGeneratedReport(report);
      setRecentExports(previous => [{
        id: String(Date.now()), report: report.name, title: report.title, by: currentUser?.name ?? 'University President',
        format: report.format, scope: report.scope, generated: report.timestamp, last: 'Just now', size: report.size, pages: report.pages,
      }, ...previous]);
      setGenerationStep(null);
      setGenerationSnapshot(null);
      showToast({ type: 'success', title: 'Executive report generated', body: 'The file is ready and an Activity Audit Logs record was created.' });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [generationStep, generationSnapshot, predictedPages, predictedSize, scopeLabel, college, currentUser?.name, showToast]);

  function toggleModule(id: string) {
    setSelectedModules(previous => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function applyTemplate(template: typeof TEMPLATES[number]) {
    setSelectedModules(new Set(template.modules));
    setPreviewPage('Report Content');
    document.getElementById('report-engine')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast({ type: 'info', title: `${template.title} applied`, body: `Included modules, ${scopeLabel} statistics, page estimate, and IDP preview were updated.` });
  }

  function requestGeneration(modules?: string[], preferredFormat?: ExportFormat) {
    const moduleCount = modules?.length ?? selectedModules.size;
    if (moduleCount === 0) {
      showToast({ type: 'warning', title: 'Select at least one report section', body: 'The executive report package cannot be empty.' });
      return;
    }
    const outputFormat = preferredFormat ?? format;
    showModal({
      title: 'Generate Executive Report',
      message: `${REPORT_CATEGORY} will compile ${moduleCount} section${moduleCount === 1 ? '' : 's'} for ${scopeLabel} in ${outputFormat} format. Generation will be recorded in the Activity Audit Trail.`,
      confirmLabel: 'Start Generation',
      onConfirm: () => {
        if (modules) setSelectedModules(new Set(modules));
        if (preferredFormat) setFormat(preferredFormat);
        setGeneratedReport(null);
        setGenerationSnapshot({ title: REPORT_CATEGORY, format: outputFormat });
        setGenerationStep(0);
      },
    });
  }

  function download(formatToDownload: ExportFormat, report = generatedReport) {
    const title = report?.title ?? REPORT_CATEGORY;
    const extension = formatToDownload.toLowerCase();
    const content = [
      'QCU INFOBOARD — CERTIFIED EXECUTIVE REPORT',
      `Report: ${title}`,
      `College: ${college}`,
      `Scope: ${scopeLabel}`,
      `Students: ${scopeMetrics.students.toLocaleString()}`,
      `Faculty: ${scopeMetrics.faculty.toLocaleString()}`,
      `Research Outputs: ${scopeMetrics.research}`,
      `Infrastructure Readiness: ${scopeMetrics.infrastructure}%`,
      `Generated By: ${currentUser?.name ?? 'University President'}`,
      `Format: ${formatToDownload}`,
      '',
      'Included Sections:',
      ...selectedDetails.map(section => `- ${section.label}`),
      '',
      'Certified by the QCU Management Information Systems Office.',
    ].join('\n');
    const blob = new Blob([content], { type: formatToDownload === 'PDF' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `QCU_InfoBoard_IDP_Progress_${college === 'All Colleges' ? 'Institutional' : college}_2026.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast({ type: 'success', title: `${formatToDownload} download started`, body: 'The certified export remains available in Recent Exports.' });
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-obsidian p-6 text-white shadow-xl">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-golden/10 blur-2xl" />
        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.22em] text-lilac">Centralized executive reporting hub</p>
            <p className="mt-2 text-2xl font-bold">Board-ready intelligence, generated in minutes.</p>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/60">Compile certified institutional progress reports, strategic scorecards, compliance briefs, and raw analytical workbooks from connected InfoBoard modules.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-lilac/25 bg-lilac/10 px-3 py-1 text-[9px] font-bold text-lilac">AUTHORIZED EXECUTIVE ACCESS</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] text-white/65">IDP {IDP_PERIOD} · {scopeLabel}</span>
              <span className="rounded-full border border-coa/25 bg-coa/10 px-3 py-1 text-[9px] text-white"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-coa animate-pulse" />Live institutional data</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-golden text-sm font-bold text-primary">{currentUser?.initials ?? 'VA'}</span>
            <span><span className="block text-xs font-bold">{currentUser?.name ?? 'Dr. Theresita V. Atienza'}</span><span className="mt-1 block text-[9px] text-white/45">{currentUser?.title ?? 'University President'} · Export Authorized</span></span>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total Reports Generated', value: totalReports.toLocaleString(), detail: 'Certified exports on record', icon: 'report' as const, tooltip: `${totalReports} reports match the active institutional scope.` },
          { label: 'This Month Exports', value: monthlyExports.toLocaleString(), detail: '+12.5% from September', icon: 'calendar' as const, tooltip: `${monthlyExports} exports were generated in October for this scope.` },
          { label: 'Most Used Format', value: 'PDF', detail: '78% of all exports', icon: 'file' as const, tooltip: 'PDF is preferred for board meetings and institutional reviews.' },
          { label: 'Report Category', value: 'IDP Progress', detail: '2026–2031 comprehensive', icon: 'category' as const, tooltip: `${REPORT_CATEGORY} is the sole certified report category.` },
          { label: 'Last Generated Report', value: lastGenerated === 'No exports' ? '—' : lastGenerated.split(',')[0], detail: lastGenerated, icon: 'clock' as const, tooltip: `Most recent export: ${lastGenerated}.` },
        ].map(card => (
          <button key={card.label} type="button" title={card.tooltip} onClick={() => showToast({ type: 'info', title: card.label, body: card.tooltip })} className="group rounded-3xl border border-lilac/20 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lilac/50 hover:shadow-xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-lilac/10 text-lilac"><Icon type={card.icon} /></span>
            <span className="mt-4 block text-[8px] font-bold uppercase tracking-[.15em] text-muted">{card.label}</span>
            <span className="mt-2 block truncate text-xl font-bold text-primary">{card.value}</span>
            <span className="mt-1 block truncate text-[9px] text-muted">{card.detail}</span>
          </button>
        ))}
      </div>

      <section id="report-engine" className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <div className="bg-primary px-6 py-5 text-white">
          <p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">Executive report generation engine</p>
          <p className="mt-1 text-lg font-bold">Active Scope Filter & Included Modules</p>
          <p className="mt-1 text-xs text-white/55">The College filter recalculates institutional statistics, previews, templates, KPI metrics, and matching export history in real time.</p>
        </div>
        <div className="grid gap-6 p-5 xl:grid-cols-[.8fr_1.2fr]">
          <div className="flex flex-col justify-center">
            <div className="rounded-3xl border border-lilac/20 bg-gradient-to-br from-surface to-blossom/25 p-5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Report Category</p>
              <div className="mt-3 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-golden"><Icon type="report" /></span>
                <div><p className="text-sm font-bold leading-snug text-primary">{REPORT_CATEGORY}</p><p className="mt-1 text-[10px] leading-relaxed text-muted">Fixed university reporting category for all previews, templates, generated files, and metadata.</p></div>
              </div>
            </div>
            <label className="mx-auto mt-4 block w-full max-w-md rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
              <span className="block text-center text-[9px] font-bold uppercase tracking-[.18em] text-lilac">Active College Filter</span>
              <select value={college} onChange={event => setCollege(event.target.value)} className="mt-3 w-full rounded-2xl border border-lilac/25 bg-surface px-4 py-3 text-center text-sm font-bold text-primary outline-none transition-all focus:border-lilac focus:ring-4 focus:ring-lilac/10">
                {COLLEGES.map(option => <option key={option}>{option}</option>)}
              </select>
              <p className="mt-3 text-center text-[10px] leading-relaxed text-muted">{college === 'All Colleges' ? 'Institution-wide data from all five colleges is included.' : `All report content is now filtered exclusively to ${college}.`}</p>
            </label>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                ['Enrollment', scopeMetrics.students.toLocaleString()],
                ['First-generation', `${scopeMetrics.firstGen}%`],
                ['Faculty', scopeMetrics.faculty.toLocaleString()],
                ['Research outputs', scopeMetrics.research.toLocaleString()],
                ['Infrastructure', `${scopeMetrics.infrastructure}%`],
              ].map(([label, value]) => <div key={label} title={`${label} for ${scopeLabel}: ${value}`} className="rounded-2xl bg-surface p-3 text-center transition-transform hover:scale-[1.03]"><p className="text-[8px] font-bold uppercase tracking-wider text-muted">{label}</p><p className="mt-1 text-sm font-bold text-primary">{value}</p></div>)}
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><p className="text-xs font-bold text-primary">Included report sections</p><p className="mt-1 text-[10px] text-muted">Selections update preview contents, predicted pages, size, and generation complexity.</p></div>
              <div className="flex items-center gap-2 text-[10px] font-bold"><button type="button" onClick={() => setSelectedModules(new Set(MODULES.map(module => module.id)))} className="text-lilac hover:underline">Select all</button><span className="text-muted">·</span><button type="button" onClick={() => setSelectedModules(new Set())} className="text-muted hover:text-primary">Clear</button></div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {MODULES.map(module => {
                const selected = selectedModules.has(module.id);
                return (
                  <label key={module.id} className={`group flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-all hover:-translate-y-0.5 ${selected ? 'border-lilac bg-lilac/10 shadow-sm' : 'border-lilac/15 hover:border-lilac/40 hover:bg-surface'}`}>
                    <input type="checkbox" checked={selected} onChange={() => toggleModule(module.id)} className="mt-0.5 h-4 w-4 accent-primary" />
                    <span className="min-w-0"><span className="block text-xs font-semibold leading-snug text-primary">{module.label}</span><span className="mt-1 block text-[9px] text-muted">Approx. {module.pageWeight} pages</span></span>
                  </label>
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[['Predicted pages', `${predictedPages}`], ['Estimated size', `${predictedSize} MB`], ['Complexity', complexity]].map(([label, value]) => <div key={label} className="rounded-2xl bg-surface p-3 text-center"><p className="text-[8px] font-bold uppercase tracking-wider text-muted">{label}</p><p className="mt-1 text-sm font-bold text-primary">{value}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[.72fr_1.28fr]">
        <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
          <SectionHeading eyebrow="Output configuration" title="Export File Format" detail="Choose a board-ready document or an analysis-ready workbook." />
          <div className="mt-4 space-y-3">
            {[
              { id: 'PDF' as const, title: 'Certified PDF', badge: 'Presentation Ready', detail: 'Board meetings, executive reporting, accreditation presentations, and institutional reviews.', sample: `${predictedPages} pages · ${predictedSize} MB`, compatibility: 'All PDF readers' },
              { id: 'XLSX' as const, title: 'Excel Workbook (.XLSX)', badge: 'Raw Data Included', detail: 'Data analysis, research, statistical processing, and Planning Office activities.', sample: `${selectedModules.size + 2} worksheets · ${predictedSize} MB`, compatibility: 'Excel · Sheets · Power BI' },
            ].map(option => (
              <button type="button" key={option.id} onClick={() => setFormat(option.id)} className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${format === option.id ? 'border-primary bg-primary text-white shadow-lg' : 'border-lilac/20 hover:border-lilac'}`}>
                <span className="flex items-start gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-extrabold ${format === option.id ? 'bg-white/10 text-golden' : 'bg-lilac/10 text-primary'}`}>{option.id}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-bold">{option.title}</span><span className={`rounded-full px-2.5 py-1 text-[8px] font-bold ${format === option.id ? 'bg-golden text-primary' : 'bg-golden/25 text-obsidian'}`}>{option.badge}</span></span>
                    <span className={`mt-1 block text-[10px] leading-relaxed ${format === option.id ? 'text-white/60' : 'text-muted'}`}>{option.detail}</span>
                    <span className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[9px] ${format === option.id ? 'text-white/45' : 'text-muted'}`}><span>{option.sample}</span><span>{option.compatibility}</span></span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
          <div className="border-b border-lilac/15 px-5 py-4">
            <SectionHeading eyebrow="Live document simulation" title="Executive Report Preview" detail="Preview pages and metadata update immediately as configuration changes." action={<span className="rounded-full bg-coa/10 px-3 py-1 text-[9px] font-bold text-coa">LIVE PREVIEW</span>} />
          </div>
          <div className="grid min-h-[28rem] md:grid-cols-[10rem_1fr]">
            <div className="border-b border-lilac/10 bg-surface p-3 md:border-b-0 md:border-r">
              {['Cover Page', 'Table of Contents', 'Report Content', 'Executive Summary'].map(page => <button type="button" key={page} onClick={() => setPreviewPage(page)} className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left text-[10px] font-semibold transition-colors ${previewPage === page ? 'bg-primary text-white' : 'text-muted hover:bg-lilac/10 hover:text-primary'}`}>{page}</button>)}
            </div>
            <div className="p-4">
              <div className="h-full rounded-2xl border border-lilac/15 bg-white p-5 shadow-[0_12px_35px_rgba(32,13,45,.08)]">
                <div className="flex items-start justify-between gap-4 border-b border-lilac/10 pb-4">
                  <div><p className="text-[8px] font-bold uppercase tracking-[.2em] text-lilac">Quezon City University</p><p className="mt-1 max-w-lg text-base font-bold text-primary">{REPORT_CATEGORY}</p><p className="mt-1 text-[9px] text-muted">{scopeLabel} · IDP {IDP_PERIOD} · {format}</p></div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-golden"><Icon type="shield" /></span>
                </div>
                {previewPage === 'Cover Page' && <div className="flex h-72 flex-col items-center justify-center text-center"><span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-obsidian text-golden shadow-lg"><Icon type="report" /></span><p className="mt-5 max-w-md text-xl font-bold text-primary">{REPORT_CATEGORY}</p><p className="mt-2 text-xs text-muted">{scopeLabel} · Institutional Development Plan</p><span className="mt-5 rounded-full bg-golden/20 px-4 py-2 text-[9px] font-bold text-obsidian">OFFICIAL EXECUTIVE COPY</span></div>}
                {previewPage === 'Table of Contents' && <div className="mt-4 space-y-2">{selectedDetails.length ? selectedDetails.map((module, index) => <button key={module.id} type="button" onClick={() => setPreviewPage('Report Content')} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lilac/10 text-[9px] font-bold text-primary">{String(index + 1).padStart(2, '0')}</span><span className="flex-1 text-[10px] font-semibold text-primary">{module.label}</span><span className="text-[9px] text-muted">{module.pageWeight} pp.</span></button>) : <p className="py-16 text-center text-xs text-muted">Select report sections to build the table of contents.</p>}</div>}
                {previewPage === 'Report Content' && (
                  <div className="mt-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-surface px-4 py-3">
                      <div><p className="text-[10px] font-bold text-primary">Selected Report Sections</p><p className="mt-0.5 text-[9px] text-muted">{scopeLabel} · {selectedDetails.length} section{selectedDetails.length === 1 ? '' : 's'} included</p></div>
                      <span className="rounded-full bg-lilac/15 px-3 py-1 text-[8px] font-bold text-primary">SCROLLABLE CONTENT</span>
                    </div>
                    <div className="max-h-80 space-y-3 overflow-y-auto pr-2">
                      {selectedDetails.length ? selectedDetails.map((module, index) => (
                        <article key={module.id} id={`preview-section-${module.id}`} className="rounded-2xl border border-lilac/15 bg-white p-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-[9px] font-bold text-golden">{String(index + 1).padStart(2, '0')}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div><p className="text-xs font-bold text-primary">{module.label}</p><p className="mt-1 text-[9px] text-muted">Report section {index + 1} · Approximately {module.pageWeight} pages</p></div>
                                <span className="rounded-full bg-coa/10 px-2.5 py-1 text-[8px] font-bold text-coa">INCLUDED</span>
                              </div>
                              <div className="mt-3 rounded-xl border border-lilac/15 bg-lilac/5 p-4">
                                <p className="text-[10px] leading-relaxed text-muted">All available KPI Overviews and Charts/Graphs from the selected report sections are being displayed.</p>
                              </div>
                            </div>
                          </div>
                        </article>
                      )) : (
                        <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-lilac/25 bg-surface text-center">
                          <Icon type="file" className="text-lilac" />
                          <p className="mt-3 text-xs font-bold text-primary">No report sections selected</p>
                          <p className="mt-1 max-w-xs text-[10px] leading-relaxed text-muted">Choose one or more sections in the report configuration to populate Report Content.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {previewPage === 'Executive Summary' && <div className="mt-5 space-y-3"><p className="text-xs font-bold text-primary">Executive summary · {scopeLabel}</p><p className="text-[10px] leading-6 text-muted">This executive summary consolidates the findings, institutional observations, and recommended actions from the report sections selected for the comprehensive IDP progress report.</p><div className="rounded-2xl border border-golden/30 bg-golden/15 p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-obsidian">Report coverage</p><p className="mt-2 text-[10px] leading-relaxed text-primary">{selectedDetails.length} selected section{selectedDetails.length === 1 ? '' : 's'} are included for {scopeLabel}. Detailed content is available on the synchronized Report Content page.</p></div><p className="text-[9px] text-muted">Generated by {currentUser?.name} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div>}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section>
        <SectionHeading eyebrow="One-click configuration" title="Quick Export Report Templates" detail={`Recommendations are prioritized for ${scopeLabel} and update whenever your active scope changes.`} />
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recommendedTemplates.map((template, index) => (
            <article key={template.id} className="group flex flex-col rounded-3xl border border-lilac/15 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-lilac/40 hover:shadow-xl">
              <div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-primary ${template.accent}`}><Icon type="file" /></span>{index === 0 && <span className="rounded-full bg-golden/25 px-2.5 py-1 text-[8px] font-bold text-obsidian">RECOMMENDED</span>}</div>
              <p className="mt-4 text-sm font-bold text-primary">{template.title}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{template.description}</p>
              <p className="mt-3 text-[8px] font-bold uppercase tracking-wider text-muted">{REPORT_CATEGORY}</p>
              <p className="mt-2 text-[9px] font-semibold text-lilac">{template.modules.length} curated IDP sections · {scopeLabel}</p>
              <button type="button" onClick={() => applyTemplate(template)} className="mt-4 rounded-xl bg-lilac/10 px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-lilac/20">Use Template</button>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Executive shortcuts" title="Frequently Generated Reports" detail="Repeat high-use reports with the active scope and live institutional data." action={<button type="button" onClick={() => requestGeneration()} className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">Generate Executive Report</button>} />
        <div className="mt-3 grid gap-4 lg:grid-cols-3">
          {FREQUENT.map(report => (
            <article key={report.title} className="rounded-3xl border border-lilac/15 bg-white p-5 shadow-sm transition-all hover:border-lilac/40 hover:shadow-md">
              <div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blossom/60 text-primary"><Icon type="report" /></span><span className="rounded-full bg-lilac/10 px-2.5 py-1 text-[8px] font-bold text-primary">{report.format}</span></div>
              <p className="mt-4 text-sm font-bold text-primary">{report.title}</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-muted"><span>Generated {Math.max(3, Math.round(report.count * scopeFactor))} times</span><span>Last: {report.date}</span></div>
              <button type="button" onClick={() => requestGeneration(report.modules, report.format)} className="mt-4 w-full rounded-xl bg-golden/20 px-4 py-2.5 text-xs font-bold text-primary hover:bg-golden/35">Quick Generate IDP Report</button>
            </article>
          ))}
        </div>
      </section>

      {generatedReport && (
        <section className="overflow-hidden rounded-3xl border border-coa/20 bg-white shadow-xl">
          <div className="flex flex-col gap-5 bg-gradient-to-r from-primary to-obsidian p-6 text-white md:flex-row md:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-coa text-white shadow-lg"><Icon type="check" /></span>
            <div className="min-w-0 flex-1"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-golden">Generation complete · Audit log recorded</p><p className="mt-1 truncate text-lg font-bold">{generatedReport.name}</p><p className="mt-1 text-[10px] text-white/55">{generatedReport.scope} · {generatedReport.size} · {generatedReport.pages} pages · {generatedReport.timestamp} · Generated by {currentUser?.name}</p></div>
            <button type="button" onClick={() => setPreviewPage('Cover Page')} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold hover:bg-white/15"><Icon type="eye" />Preview</button>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            <button type="button" onClick={() => download('PDF')} className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-xs font-bold text-white hover:bg-primary/90"><Icon type="download" />Download PDF</button>
            <button type="button" onClick={() => download('XLSX')} className="flex items-center justify-center gap-2 rounded-2xl border border-lilac/25 px-4 py-3 text-xs font-bold text-primary hover:bg-lilac/10"><Icon type="download" />Download XLSX</button>
            <button type="button" onClick={() => { download('PDF'); window.setTimeout(() => download('XLSX'), 250); }} className="flex items-center justify-center gap-2 rounded-2xl bg-golden px-4 py-3 text-xs font-bold text-primary hover:bg-golden/90"><Icon type="download" />Download Both Files</button>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-3xl border border-lilac/15 bg-white shadow-sm">
        <div className="border-b border-lilac/10 px-5 py-4">
          <SectionHeading eyebrow="Certified file history" title="Recent Exports" detail={`Showing ${scopedRecentExports.length} matching export${scopedRecentExports.length === 1 ? '' : 's'} with generation and last-generated dates for ${scopeLabel}.`} action={<button type="button" onClick={() => setRecentExports(recentExports.length ? [] : INITIAL_EXPORTS)} className="rounded-xl border border-lilac/20 px-3 py-2 text-[10px] font-bold text-primary hover:bg-lilac/10">{recentExports.length ? 'Clear Demo History' : 'Restore History'}</button>} />
        </div>
        {scopedRecentExports.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blossom text-primary"><Icon type="report" /></span>
            <p className="mt-5 text-base font-bold text-primary">No Reports Generated Yet</p>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted">Create the first comprehensive IDP progress report for {scopeLabel} by clicking Generate Report.</p>
            <button type="button" onClick={() => requestGeneration()} className="mt-5 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white">Generate Report</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] text-xs">
              <thead className="bg-blossom/30"><tr>{['Report', 'Generated By', 'Format', 'Export Scope', 'Generation Date', 'Last Generated Date', 'Output', 'Action'].map(heading => <th key={heading} className="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-widest text-muted">{heading}</th>)}</tr></thead>
              <tbody>{scopedRecentExports.map(item => <tr key={item.id} className="border-t border-lilac/5 transition-colors hover:bg-blossom/10">
                <td className="max-w-64 px-4 py-3"><p className="truncate font-semibold text-primary" title={item.report}>{item.report}</p><p className="mt-1 truncate text-[9px] text-muted">{item.title}</p></td>
                <td className="px-4 py-3 text-muted">{item.by}</td>
                <td className="px-4 py-3"><span className="rounded-md bg-lilac/10 px-2.5 py-1 text-[9px] font-bold text-primary">{item.format}</span></td>
                <td className="px-4 py-3 text-muted">{item.scope}</td>
                <td className="px-4 py-3 font-mono text-[9px] text-muted">{item.generated}</td>
                <td className="px-4 py-3 font-semibold text-primary">{item.last}</td>
                <td className="px-4 py-3 text-[9px] text-muted">{item.size} · {item.pages} {item.format === 'PDF' ? 'pages' : 'sheets'}</td>
                <td className="px-4 py-3"><button type="button" onClick={() => download(item.format, { name: item.report, title: item.title, format: item.format, size: item.size, pages: item.pages, timestamp: item.generated, scope: item.scope })} className="flex items-center gap-1.5 rounded-lg bg-primary/5 px-3 py-2 text-[10px] font-bold text-primary hover:bg-primary/10"><Icon type="download" className="h-3.5 w-3.5" />Download</button></td>
              </tr>)}</tbody>
            </table>
          </div>
        )}
      </section>

      <aside className="flex gap-3 rounded-2xl border border-golden/35 bg-golden/10 p-4">
        <span className="mt-0.5 shrink-0 text-obsidian"><Icon type="shield" /></span>
        <p className="text-xs leading-relaxed text-muted">Generated reports are certified by the QCU Management Information Systems Office and reflect institutional data as of <strong className="text-primary">10/11/2026</strong>. All exports are logged to the Activity Audit Logs for compliance tracking.</p>
      </aside>

      {generationStep !== null && (
        <div className="modal-backdrop fixed inset-0 z-[210] flex items-center justify-center bg-primary/70 px-4 backdrop-blur-md">
          <div className="modal-content w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-obsidian p-6 text-white"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">Secure report generation</p><p className="mt-2 text-lg font-bold">Building your executive report</p><p className="mt-1 text-xs text-white/50">{generationSnapshot?.title}</p></div>
            <div className="p-6">
              <div className="mb-5 h-2 overflow-hidden rounded-full bg-lilac/10"><div className="h-full rounded-full bg-lilac transition-all duration-500" style={{ width: `${((generationStep + 1) / GENERATION_STEPS.length) * 100}%` }} /></div>
              <div className="space-y-3">{GENERATION_STEPS.map((step, index) => <div key={step} className={`flex items-center gap-3 rounded-2xl p-3 transition-colors ${index === generationStep ? 'bg-lilac/10' : ''}`}><span className={`flex h-8 w-8 items-center justify-center rounded-xl ${index < generationStep ? 'bg-coa text-white' : index === generationStep ? 'bg-primary text-golden' : 'bg-surface text-muted'}`}>{index < generationStep ? <Icon type="check" /> : <span className={index === generationStep ? 'animate-pulse' : ''}>{index + 1}</span>}</span><span className={`text-xs font-semibold ${index <= generationStep ? 'text-primary' : 'text-muted'}`}>{step}</span>{index === generationStep && <span className="ml-auto text-[9px] font-bold text-lilac">PROCESSING</span>}</div>)}</div>
              <p className="mt-5 text-center text-[10px] text-muted">Validating live institutional records. Please keep this window open.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
