import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const ACADEMIC_YEARS = ['2024–2025', '2025–2026', '2026–2027'];
const COLLEGES = ['All Colleges', 'CCS', 'COA', 'COB', 'COE', 'COED'];
const DEPARTMENTS = ['All Departments', 'IT-DEPT', 'CS-DEPT', 'IS-DEPT', 'ACCT-DEPT', 'BUS-DEPT', 'EE-DEPT'];

const HR_MODULES = [
  { id: 'faculty-profile', label: 'Faculty Profile & Demographics' },
  { id: 'qualifications', label: 'Academic Rank & Qualification Compliance' },
  { id: 'teaching-load', label: 'Teaching Load & Faculty Utilization' },
  { id: 'employment', label: 'Employment Status & Appointment Records' },
  { id: 'performance', label: 'Faculty Performance & Evaluation Summary' },
  { id: 'retention', label: 'Retention, Turnover & Tenure Analytics' },
];

const QUICK_TEMPLATES = [
  {
    id: 'workforce',
    title: 'Faculty Workforce Summary',
    description: 'Current headcount, appointment type, college assignment, rank, and demographic profile.',
    modules: ['faculty-profile', 'qualifications', 'employment'],
  },
  {
    id: 'ched',
    title: 'CHED Qualification Compliance',
    description: 'Qualification gaps, academic ranks, teaching assignments, and compliance indicators by college.',
    modules: ['qualifications', 'teaching-load'],
  },
  {
    id: 'performance',
    title: 'Performance & Retention Brief',
    description: 'Evaluation outcomes, turnover trends, tenure retention, and workforce risk indicators.',
    modules: ['performance', 'retention'],
  },
];

const FREQUENT_REPORTS = [
  { id: 'faculty-profile', title: 'Faculty Profile Summary', frequency: 'Generated 14 times', lastGenerated: '09/28/2026' },
  { id: 'ched-compliance', title: 'CHED Qualification Compliance Report', frequency: 'Generated 9 times', lastGenerated: '09/20/2026' },
  { id: 'teaching-load', title: 'Departmental Teaching Load Audit', frequency: 'Generated 7 times', lastGenerated: '09/15/2026' },
];

const RECENT_EXPORTS = [
  { id: '1', report: 'Faculty Profile Summary', format: 'PDF', generatedBy: 'Ms. Rowena Alcantara', lastGenerated: '09/28/2026 10:22 AM' },
  { id: '2', report: 'CHED Qualification Compliance Report', format: 'XLSX', generatedBy: 'Ms. Rowena Alcantara', lastGenerated: '09/20/2026 02:15 PM' },
  { id: '3', report: 'Departmental Teaching Load Audit', format: 'PDF', generatedBy: 'Ms. Rowena Alcantara', lastGenerated: '09/15/2026 09:05 AM' },
  { id: '4', report: 'Faculty Performance & Retention Brief', format: 'XLSX', generatedBy: 'Ms. Rowena Alcantara', lastGenerated: '09/10/2026 03:44 PM' },
];

export default function HRReports() {
  const { showModal, showToast } = useApp();
  const [academicYear, setAcademicYear] = useState('2026–2027');
  const [college, setCollege] = useState('All Colleges');
  const [department, setDepartment] = useState('All Departments');
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set(['faculty-profile', 'qualifications', 'employment']));
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
    showToast({ type: 'info', title: `${template.title} selected`, body: 'The recommended HR sub-modules are ready for export.' });
  }

  function generateReport(title = 'Custom HR Export') {
    if (selectedModules.size === 0) {
      showToast({ type: 'warning', title: 'Select at least one HR sub-module', body: 'The export package cannot be empty.' });
      return;
    }
    showModal({
      title: 'Generate & Export Report',
      message: `${title} will include ${selectedModules.size} HR sub-module${selectedModules.size === 1 ? '' : 's'} for ${academicYear} in ${format} format. Continue?`,
      confirmLabel: `Generate ${format}`,
      onConfirm: () => {
        setGenerating(true);
        setTimeout(() => {
          setGenerating(false);
          showToast({ type: 'success', title: 'Certified HR report generated', body: `${format} export is ready for download.` });
        }, 1200);
      },
    });
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <div className="border-b border-lilac/15 bg-primary px-6 py-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-lilac">Report configuration</p>
          <p className="mt-1 text-lg font-bold">Active Scope Filter</p>
          <p className="mt-1 text-xs text-white/55">Define the reporting period, institutional scope, and HR sub-modules included in this certified export.</p>
        </div>
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
          <div>
            <p className="mb-3 text-xs font-bold text-primary">Institutional scope</p>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                { label: 'Academic Year', value: academicYear, set: setAcademicYear, options: ACADEMIC_YEARS },
                { label: 'College', value: college, set: setCollege, options: COLLEGES },
                { label: 'Department', value: department, set: setDepartment, options: DEPARTMENTS },
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
              <div><p className="text-xs font-bold text-primary">HR sub-modules</p><p className="mt-1 text-[10px] text-muted">Select the data sections to compile into the report package.</p></div>
              <div className="flex gap-2 text-[10px] font-semibold">
                <button type="button" onClick={() => setSelectedModules(new Set(HR_MODULES.map((module) => module.id)))} className="text-lilac hover:underline">Select all</button>
                <span className="text-muted">·</span>
                <button type="button" onClick={() => setSelectedModules(new Set())} className="text-muted hover:text-primary">Clear</button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {HR_MODULES.map((module) => (
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
        <div className="mb-4"><p className="text-sm font-bold text-primary">Export File Format</p><p className="mt-1 text-xs text-muted">Choose the format used for the certified report package.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { id: 'PDF' as const, title: 'Certified PDF', detail: 'Presentation-ready document with fixed formatting and certification footer.' },
            { id: 'XLSX' as const, title: 'Excel Workbook', detail: 'Analysis-ready workbook with separate sheets for every selected HR sub-module.' },
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
          <div><p className="text-sm font-bold text-primary">Frequently Generated Reports</p><p className="mt-1 text-xs text-muted">Common HR reports retained for fast repeat generation.</p></div>
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
        <p className="text-xs leading-relaxed text-muted">Generated reports are certified by the QCU Management Information Systems Office and reflect institutional data as of <strong className="text-primary">10/11/2026</strong>. All exports are logged to the Activity Audit Trail for compliance tracking.</p>
      </aside>
    </div>
  );
}
