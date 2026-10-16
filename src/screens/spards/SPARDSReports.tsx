import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const ACADEMIC_YEARS = ['2024–2025', '2025–2026', '2026–2027'];
const GRANT_TYPES = ['All Grant Types', 'QCYDO', 'UNIFAST/TES', 'CHED', 'Academic', 'LGU/Private'];
const CAMPUSES = ['All Campuses', 'San Bartolome (Main)', 'San Francisco', 'Batasan Campus'];
const COLLEGES = ['All Colleges', 'CCS', 'COA', 'COB', 'COE', 'COED'];

const SPARDS_MODULES = [
  { id: 'grant-distribution', label: 'Scholarship Distribution & Grant Coverage' },
  { id: 'socioeconomic', label: 'Socioeconomic & First-Generation Summary' },
  { id: 'gpa-retention', label: 'Scholar GPA & Academic Retention Audit' },
  { id: 'disbursement', label: 'Allowance Disbursement Status' },
  { id: 'college-coverage', label: 'College & Department Coverage Matrix' },
  { id: 'erecords', label: 'Document Verification & E-Records Status' },
];

const QUICK_TEMPLATES = [
  {
    id: 'compliance',
    title: 'Scholarship Compliance Package',
    description: 'Grant coverage, scholar eligibility, GPA retention, and verified-document status for compliance review.',
    modules: ['grant-distribution', 'gpa-retention', 'erecords'],
  },
  {
    id: 'financial',
    title: 'Financial Assistance Brief',
    description: 'Grant distribution, socioeconomic reach, allowance releases, and pending disbursement indicators.',
    modules: ['grant-distribution', 'socioeconomic', 'disbursement'],
  },
  {
    id: 'coverage',
    title: 'Scholar Coverage & Outcomes',
    description: 'College coverage, scholar performance, retention trends, and first-generation impact metrics.',
    modules: ['college-coverage', 'gpa-retention', 'socioeconomic'],
  },
];

const FREQUENT_REPORTS = [
  { id: 'qcydo', title: 'QCYDO Municipal Scholar Masterlist', frequency: 'Generated 18 times', lastGenerated: '09/28/2026' },
  { id: 'unifast', title: 'UNIFAST/TES Compliance Summary', frequency: 'Generated 12 times', lastGenerated: '09/24/2026' },
  { id: 'retention', title: 'Scholar Academic Retention Audit', frequency: 'Generated 9 times', lastGenerated: '09/18/2026' },
];

const RECENT_EXPORTS = [
  { id: '1', report: 'QCYDO Municipal Scholar Masterlist', format: 'PDF', generatedBy: 'Ms. Rowena Alcantara', lastGenerated: '09/28/2026 10:22 AM' },
  { id: '2', report: 'UNIFAST/TES Compliance Summary', format: 'XLSX', generatedBy: 'Ms. Rowena Alcantara', lastGenerated: '09/24/2026 02:15 PM' },
  { id: '3', report: 'Scholar Academic Retention Audit', format: 'PDF', generatedBy: 'Ms. Rowena Alcantara', lastGenerated: '09/18/2026 09:05 AM' },
  { id: '4', report: 'College-Level Scholarship Coverage Matrix', format: 'XLSX', generatedBy: 'Ms. Rowena Alcantara', lastGenerated: '09/12/2026 03:44 PM' },
];

export default function SPARDSReports({ exportMode = false }: { exportMode?: boolean }) {
  const { showModal, showToast } = useApp();
  const [academicYear, setAcademicYear] = useState('2026–2027');
  const [grantType, setGrantType] = useState('All Grant Types');
  const [campus, setCampus] = useState('All Campuses');
  const [college, setCollege] = useState('All Colleges');
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set(['grant-distribution', 'socioeconomic', 'disbursement']));
  const [format, setFormat] = useState<'PDF' | 'XLSX'>('PDF');
  const [generating, setGenerating] = useState(false);

  function toggleModule(id: string) {
    setSelectedModules((previous) => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function applyTemplate(template: typeof QUICK_TEMPLATES[number]) {
    setSelectedModules(new Set(template.modules));
    showToast({ type: 'info', title: `${template.title} selected`, body: 'The recommended SPARDS sub-modules are ready for export.' });
  }

  function generateReport(title = 'Custom SPARDS Export') {
    if (selectedModules.size === 0) {
      showToast({ type: 'warning', title: 'Select at least one SPARDS sub-module', body: 'The export package cannot be empty.' });
      return;
    }
    showModal({
      title: 'Generate & Export Report',
      message: `${title} will include ${selectedModules.size} SPARDS sub-module${selectedModules.size === 1 ? '' : 's'} for ${academicYear} in ${format} format. Continue?`,
      confirmLabel: `Generate ${format}`,
      onConfirm: () => {
        setGenerating(true);
        setTimeout(() => {
          setGenerating(false);
          showToast({ type: 'success', title: 'Certified SPARDS report generated', body: `${format} export is ready for download.` });
        }, 1200);
      },
    });
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <div className="border-b border-lilac/15 bg-primary px-6 py-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-lilac">{exportMode ? 'Export workspace' : 'Report configuration'}</p>
          <p className="mt-1 text-lg font-bold">Active Scope Filter</p>
          <p className="mt-1 text-xs text-white/55">Define the reporting period, scholarship scope, and SPARDS sub-modules included in this certified export.</p>
        </div>
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
          <div>
            <p className="mb-3 text-xs font-bold text-primary">Institutional scope</p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {[
                { label: 'Academic Year', value: academicYear, set: setAcademicYear, options: ACADEMIC_YEARS },
                { label: 'Grant Type', value: grantType, set: setGrantType, options: GRANT_TYPES },
                { label: 'Campus', value: campus, set: setCampus, options: CAMPUSES },
                { label: 'College', value: college, set: setCollege, options: COLLEGES },
              ].map(({ label, value, set, options }) => (
                <label key={label} className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</span>
                  <select value={value} onChange={(event) => set(event.target.value)} className="rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-xs font-semibold text-primary outline-none focus:border-lilac">
                    {options.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div><p className="text-xs font-bold text-primary">SPARDS sub-modules</p><p className="mt-1 text-[10px] text-muted">Select the data sections to compile into the report package.</p></div>
              <div className="flex gap-2 text-[10px] font-semibold">
                <button type="button" onClick={() => setSelectedModules(new Set(SPARDS_MODULES.map((module) => module.id)))} className="text-lilac hover:underline">Select all</button>
                <span className="text-muted">·</span>
                <button type="button" onClick={() => setSelectedModules(new Set())} className="text-muted hover:text-primary">Clear</button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {SPARDS_MODULES.map((module) => (
                <label key={module.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${selectedModules.has(module.id) ? 'border-lilac bg-lilac/10' : 'border-lilac/15 hover:bg-surface'}`}>
                  <input type="checkbox" checked={selectedModules.has(module.id)} onChange={() => toggleModule(module.id)} className="h-4 w-4 accent-primary" />
                  <span className="text-xs font-semibold text-primary">{module.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="mb-4"><p className="text-sm font-bold text-primary">Export File Format</p><p className="mt-1 text-xs text-muted">Choose the format used for the certified scholarship report package.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: 'PDF' as const, title: 'Certified PDF', detail: 'Presentation-ready document with fixed formatting and certification footer.' },
            { id: 'XLSX' as const, title: 'Excel Workbook', detail: 'Analysis-ready workbook with separate sheets for every selected SPARDS sub-module.' },
          ].map((option) => (
            <button type="button" key={option.id} onClick={() => setFormat(option.id)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${format === option.id ? 'border-primary bg-primary text-white shadow-md' : 'border-lilac/20 hover:border-lilac'}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-extrabold ${format === option.id ? 'bg-white/15 text-golden' : 'bg-lilac/10 text-primary'}`}>{option.id}</span>
              <span><span className={`block text-sm font-bold ${format === option.id ? 'text-white' : 'text-primary'}`}>{option.title}</span><span className={`mt-1 block text-xs ${format === option.id ? 'text-white/60' : 'text-muted'}`}>{option.detail}</span></span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3"><p className="text-sm font-bold text-primary">Quick Export Report Templates</p><p className="mt-1 text-xs text-muted">Apply a recommended module selection, then generate the export in your chosen format.</p></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {QUICK_TEMPLATES.map((template) => (
            <article key={template.id} className="flex flex-col rounded-2xl border border-lilac/15 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blossom text-primary">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5"/><path d="M14 2v6h6M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </span>
              <p className="text-sm font-bold text-primary">{template.title}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{template.description}</p>
              <button type="button" onClick={() => applyTemplate(template)} className="mt-4 rounded-xl bg-lilac/10 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-lilac/20">Use Template</button>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div><p className="text-sm font-bold text-primary">Frequently Generated Reports</p><p className="mt-1 text-xs text-muted">Common SPARDS reports retained for fast repeat generation.</p></div>
          <button type="button" onClick={() => generateReport()} disabled={generating} className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm disabled:opacity-50">{generating ? 'Generating…' : `Generate ${format}`}</button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {FREQUENT_REPORTS.map((report) => (
            <article key={report.id} className="rounded-2xl border border-lilac/15 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-primary">{report.title}</p>
              <p className="mt-2 text-xs text-muted">{report.frequency}</p>
              <p className="mt-1 text-[10px] text-muted">Last generated: <strong className="text-primary">{report.lastGenerated}</strong></p>
              <button type="button" onClick={() => generateReport(report.title)} className="mt-4 w-full rounded-xl bg-golden/20 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-golden/35">Generate Again</button>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-lilac/15 bg-white shadow-sm">
        <div className="border-b border-lilac/10 px-5 py-4">
          <p className="text-sm font-bold text-primary">Recent Exports</p>
          <p className="mt-1 text-xs text-muted">Download previously generated reports and review their last generated date.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-blossom/30">
              <tr>{['Report', 'Format', 'Generated By', 'Last Generated Date', 'Action'].map((heading) => <th key={heading} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted">{heading}</th>)}</tr>
            </thead>
            <tbody>
              {RECENT_EXPORTS.map((exportItem) => (
                <tr key={exportItem.id} className="border-t border-lilac/5 hover:bg-blossom/10">
                  <td className="px-4 py-3 font-medium text-primary">{exportItem.report}</td>
                  <td className="px-4 py-3"><span className="rounded-md bg-lilac/10 px-2.5 py-1 text-[10px] font-bold text-primary">{exportItem.format}</span></td>
                  <td className="px-4 py-3 text-muted">{exportItem.generatedBy}</td>
                  <td className="px-4 py-3 font-mono text-muted">{exportItem.lastGenerated}</td>
                  <td className="px-4 py-3"><button type="button" onClick={() => showToast({ type: 'success', title: 'Download started', body: exportItem.report })} className="rounded-lg bg-primary/5 px-3 py-1.5 font-semibold text-primary hover:bg-primary/10">Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="flex gap-3 rounded-2xl border border-lilac/20 bg-lilac/8 p-4">
        <svg className="mt-0.5 shrink-0 text-lilac" width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        <p className="text-xs leading-relaxed text-muted">Generated reports are certified by the QCU Management Information Systems Office and reflect institutional data as of <strong className="text-primary">09/24/2026</strong>. All exports are logged to the Activity Audit Trail for compliance tracking.</p>
      </aside>
    </div>
  );
}
