import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROGRAMS } from '../data/mockData';

const MODULES = [
  { id: 'kpi', label: 'Institutional KPI Summary Scorecard', category: 'overview', checked: true },
  { id: 'student', label: 'Student Enrollment Matrix', category: 'student', checked: true },
  { id: 'firstgen', label: 'First-Generation Distribution', category: 'student', checked: true },
  { id: 'capacity', label: 'Program Capacity & Performance', category: 'student', checked: true },
  { id: 'admission', label: 'Admission Funnel & Conversion', category: 'admission', checked: true },
  { id: 'admission-status', label: 'Admission Status Summary', category: 'admission', checked: false },
  { id: 'admission-program', label: 'Applicants by College & Program', category: 'admission', checked: false },
  { id: 'admission-trends', label: 'Admission Trends & Student Type', category: 'admission', checked: false },
  { id: 'admission-equity', label: 'First-Gen, Income & Scholarship Analytics', category: 'admission', checked: false },
  { id: 'retention', label: 'Progression & Retention', category: 'student', checked: false },
  { id: 'demographics', label: 'Student Demographics & Geographic Origin', category: 'student', checked: false },
  { id: 'faculty', label: 'Faculty Qualification Audit', category: 'faculty', checked: false },
  { id: 'faculty-workload', label: 'Teaching Load & Program Allocation', category: 'faculty', checked: false },
  { id: 'faculty-employment', label: 'Employment Status Distribution', category: 'faculty', checked: false },
  { id: 'faculty-rank', label: 'Academic Rank & Workforce Profile', category: 'faculty', checked: false },
  { id: 'workforce-health', label: 'Fiscal & Workforce Health Sheet', category: 'overview', checked: true },
  { id: 'budget-burn', label: 'Operating Budget & Cash-Flow Burn Rate', category: 'overview', checked: true },
  { id: 'audit', label: 'Activity Audit Logs Summary', category: 'governance', checked: false },
];

const CATEGORY_LABELS: Record<string, { title: string; detail: string }> = {
  overview: { title: 'Report Overview', detail: 'Institution-level summary' },
  student: { title: 'Student Data Sub-Modules', detail: 'Enrollment, progression, and demographic datasets' },
  admission: { title: 'Admission Data Sub-Modules', detail: 'Applicant pipeline, conversion, demand, and access-equity datasets' },
  faculty: { title: 'Faculty Data Sub-Modules', detail: 'Qualifications, workload, and workforce datasets' },
  governance: { title: 'Governance Data', detail: 'System administration and audit records' },
};

const QUICK_TEMPLATES = [
  {
    id: 'admission-planning',
    title: 'Admission Planning Package',
    description: 'Applicant demand, admission status, conversion, college/program distribution, trends, and First-Gen access.',
    modules: ['admission', 'admission-status', 'admission-program', 'admission-trends', 'admission-equity'],
  },
  {
    id: 'student-outcomes',
    title: 'Student Outcomes Package',
    description: 'Enrollment, first-generation participation, progression, retention, and demographic indicators.',
    modules: ['student', 'firstgen', 'capacity', 'admission', 'retention', 'demographics'],
  },
  {
    id: 'faculty-readiness',
    title: 'Faculty Readiness Brief',
    description: 'Faculty qualifications, academic rank, employment status, and teaching-load allocation.',
    modules: ['faculty', 'faculty-workload', 'faculty-employment', 'faculty-rank'],
  },
  {
    id: 'college-planning',
    title: 'College Planning Portfolio',
    description: 'A balanced package of executive KPIs, program capacity, student retention, and faculty readiness.',
    modules: ['kpi', 'capacity', 'retention', 'faculty', 'faculty-workload'],
  },
];

const FREQUENT_REPORTS = [
  { id: 'enrollment', title: 'College Enrollment & Capacity Summary', frequency: 'Generated 18 times', lastGenerated: '09/28/2026', modules: ['student', 'capacity'] },
  { id: 'faculty', title: 'Faculty Qualification & Workload Audit', frequency: 'Generated 12 times', lastGenerated: '09/24/2026', modules: ['faculty', 'faculty-workload', 'faculty-rank'] },
  { id: 'retention', title: 'Student Progression & Retention Brief', frequency: 'Generated 9 times', lastGenerated: '09/18/2026', modules: ['firstgen', 'retention', 'demographics'] },
];

const RECENT_EXPORTS = [
  { id: '1', report: 'College Enrollment & Capacity Summary', format: 'PDF', lastGenerated: '09/28/2026 10:22 AM' },
  { id: '2', report: 'Faculty Qualification & Workload Audit', format: 'XLSX', lastGenerated: '09/24/2026 02:15 PM' },
  { id: '3', report: 'Student Progression & Retention Brief', format: 'PDF', lastGenerated: '09/18/2026 09:05 AM' },
  { id: '4', report: 'Program Performance Matrix', format: 'XLSX', lastGenerated: '09/12/2026 03:44 PM' },
];

function ScopeSelect({ label, value, options, disabled, onChange }: {
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={event => onChange(event.target.value)}
        className="w-full rounded-xl border border-lilac/25 bg-white px-3 py-2 text-xs font-semibold text-primary outline-none transition-colors focus:border-lilac focus:ring-2 focus:ring-lilac/15 disabled:cursor-not-allowed disabled:bg-primary/[.03] disabled:text-muted">
        {options.map(option => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function PresidentReportPreview({ modules, college, campus, documentHash, formatLabel }: {
  modules: Array<{ id: string; label: string }>;
  college: string;
  campus: string;
  documentHash: string;
  formatLabel: string;
}) {
  const metadata = [
    ['Credential', 'Dr. Theresita V. Atienza'],
    ['Seal', 'Official QCU'],
    ['Verification', `DOC-HASH ${documentHash}`],
    ['Output', formatLabel],
  ];

  return (
    <section className="grid gap-5 border-b border-lilac/10 bg-surface/40 px-6 py-5 lg:grid-cols-[minmax(0,.8fr)_minmax(24rem,1.2fr)]">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">
          Presidential package parameters
        </p>
        <p className="mt-1 text-sm font-bold text-primary">
          Board & LGU Presentation Bundle
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-muted">
          Packages real-time macro enrollment, gender and First-Gen summaries with fiscal health,
          cash-flow burn rates, faculty workload, and institutional authentication.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {metadata.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-lilac/15 bg-white p-3">
              <p className="text-[8px] font-bold uppercase tracking-widest text-muted">{label}</p>
              <p className="mt-1 text-[10px] font-bold text-primary">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-primary p-3 shadow-xl">
        <p className="mb-2 text-[8px] font-bold uppercase tracking-widest text-lilac">
          Live executive document preview
        </p>
        <div className="min-h-64 rounded-xl bg-white p-5">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary bg-golden text-[10px] font-black text-primary">
                QCU
              </span>
              <span>
                <span className="block text-[8px] font-bold uppercase tracking-widest text-muted">
                  Quezon City University
                </span>
                <span className="block text-sm font-bold text-primary">Executive Institutional Brief</span>
              </span>
            </div>
            <span className="text-right text-[7px] font-bold uppercase text-muted">
              Board-ready
              <br />
              Certified
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <p className="text-[7px] uppercase text-muted">Prepared for</p>
              <p className="text-[9px] font-bold text-primary">Dr. Theresita V. Atienza</p>
            </div>
            <div>
              <p className="text-[7px] uppercase text-muted">Active scope</p>
              <p className="text-[9px] font-bold text-primary">{college} · {campus}</p>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            {modules.slice(0, 4).map((module, index) => (
              <div key={module.id} className="flex items-center gap-2 rounded-lg bg-surface px-2 py-1.5">
                <span className="text-[7px] font-bold text-lilac">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="truncate text-[8px] font-semibold text-primary">{module.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-end rounded-lg bg-primary px-3 py-2">
            <span className="text-[7px] text-white/55">{formatLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function createSimplePdf(lines: string[]) {
  const escaped = lines.slice(0, 45).map(line =>
    line.replace(/[^\x20-\x7E]/g, '-').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
  );
  const stream = `BT\n/F1 10 Tf\n48 790 Td\n13 TL\n${escaped.map(line => `(${line}) Tj\nT*`).join('')}ET`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function createSimpleXlsx(lines: string[]) {
  const encoder = new TextEncoder();
  const xmlEscape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const files = [
    { name: '[Content_Types].xml', content: '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>' },
    { name: '_rels/.rels', content: '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
    { name: 'xl/workbook.xml', content: '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Executive Brief" sheetId="1" r:id="rId1"/></sheets></workbook>' },
    { name: 'xl/_rels/workbook.xml.rels', content: '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>' },
    { name: 'xl/worksheets/sheet1.xml', content: `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${lines.map((line, index) => `<row r="${index + 1}"><c r="A${index + 1}" t="inlineStr"><is><t>${xmlEscape(line)}</t></is></c></row>`).join('')}</sheetData></worksheet>` },
  ].map(file => ({ name: encoder.encode(file.name), data: encoder.encode(file.content) }));
  const crcTable = Array.from({ length: 256 }, (_, index) => {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    return crc >>> 0;
  });
  const crc32 = (data: Uint8Array) => {
    let crc = 0xFFFFFFFF;
    data.forEach(byte => { crc = crcTable[(crc ^ byte) & 0xFF] ^ (crc >>> 8); });
    return (crc ^ 0xFFFFFFFF) >>> 0;
  };
  const u16 = (value: number) => new Uint8Array([value & 0xFF, (value >>> 8) & 0xFF]);
  const u32 = (value: number) => new Uint8Array([value & 0xFF, (value >>> 8) & 0xFF, (value >>> 16) & 0xFF, (value >>> 24) & 0xFF]);
  const concat = (parts: Uint8Array[]) => {
    const output = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
    let offset = 0;
    parts.forEach(part => { output.set(part, offset); offset += part.length; });
    return output;
  };
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let localOffset = 0;
  files.forEach(file => {
    const crc = crc32(file.data);
    const local = concat([u32(0x04034B50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(file.data.length), u32(file.data.length), u16(file.name.length), u16(0), file.name, file.data]);
    localParts.push(local);
    centralParts.push(concat([u32(0x02014B50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(file.data.length), u32(file.data.length), u16(file.name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(localOffset), file.name]));
    localOffset += local.length;
  });
  const central = concat(centralParts);
  return concat([...localParts, central, u32(0x06054B50), u16(0), u16(0), u16(files.length), u16(files.length), u32(central.length), u32(localOffset), u16(0)]);
}

export default function ReportGeneration() {
  const { currentUser, filters, setFilters, resetFilters, showModal, showToast, navigate } = useApp();
  const isRegistrar = currentUser?.role === 'registrar';
  const isPresident = currentUser?.username === 'doc.atienza';
  const documentHash = '8F92-QCU-EIS';
  const availableModules = isPresident
    ? MODULES.filter(module => ['kpi', 'workforce-health', 'budget-burn', 'student', 'firstgen', 'capacity', 'faculty', 'faculty-workload', 'faculty-employment'].includes(module.id))
    : currentUser?.role === 'executive'
    ? MODULES.filter(module => ['kpi', 'student', 'faculty', 'firstgen'].includes(module.id))
      : currentUser?.role === 'registrar'
        ? MODULES.filter(module => module.id !== 'audit')
      : currentUser?.role === 'dean'
      ? MODULES.filter(module => module.id !== 'audit')
      : MODULES;
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(MODULES.map(m => [m.id, m.checked]))
  );
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [generating, setGenerating] = useState(false);
  const [recentExports, setRecentExports] = useState(RECENT_EXPORTS);
  const [activeStep, setActiveStep] = useState(0);
  const formatLabel = format === 'pdf' ? 'PDF' : 'XLSX';

  const selectedModules = availableModules.filter(module => selected[module.id]);
  const anySelected = selectedModules.length > 0;

  function toggle(id: string) {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function goToStep(index: number) {
    setActiveStep(index);
    document.getElementById(`report-step-${index + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function toggleCategory(category: string, checked: boolean) {
    const categoryIds = availableModules.filter(module => module.category === category).map(module => module.id);
    setSelected(previous => ({
      ...previous,
      ...Object.fromEntries(categoryIds.map(id => [id, checked])),
    }));
  }

  function applyTemplate(template: typeof QUICK_TEMPLATES[number] | typeof FREQUENT_REPORTS[number]) {
    setSelected(Object.fromEntries(MODULES.map(module => [module.id, template.modules.includes(module.id)])));
    showToast({
      type: 'info',
      title: `${template.title} selected`,
      body: 'The recommended student and faculty sub-modules are ready for export.',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function downloadRecent(report: typeof RECENT_EXPORTS[number]) {
    const content = [
      'QCU InfoBoard Certified Report Copy',
      `Report: ${report.report}`,
      `College: ${filters.college}`,
      `Original generation: ${report.lastGenerated}`,
      `Downloaded by: ${currentUser?.name ?? 'Authorized user'}`,
    ].join('\n');
    const isPdf = report.format === 'PDF';
    const blob = new Blob(
      [isPdf ? createSimplePdf(content.split('\n')) : `<table>${content.split('\n').map(line => `<tr><td>${line}</td></tr>`).join('')}</table>`],
      { type: isPdf ? 'application/pdf' : 'application/vnd.ms-excel' },
    );
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filters.college}-${report.report.replace(/ /g, '-')}.${isPdf ? 'pdf' : 'xls'}`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast({ type: 'success', title: 'Download started', body: report.report });
  }

  function updateFilter(key: keyof typeof filters, value: string) {
    setFilters(previous => {
      if (currentUser?.role === 'dean' && key === 'college') return previous;
      const next = { ...previous, [key]: value };
      if (key === 'college') next.program = 'All';
      return next;
    });
  }

  function downloadReport() {
    const timestamp = new Date();
    const stamp = timestamp.toISOString().replace(/:/g, '-').slice(0, 19);
    const sections = availableModules.filter(module => selected[module.id]).map(module => module.label);
    const summary = [
      'QCU InfoBoard Certified Report',
      `Generated: ${timestamp.toLocaleString()}`,
      `Account: ${currentUser?.name ?? 'Authorized user'}`,
      `Executive Credential: ${isPresident ? 'Dr. Theresita V. Atienza - University President' : currentUser?.title ?? 'Authorized user'}`,
      `Academic Year: ${filters.academicYear}`,
      `Semester: ${filters.semester}`,
      `College: ${filters.college}`,
      `Program: ${filters.program}`,
      `Year Level: ${filters.yearLevel}`,
      `Campus: ${filters.campus}`,
      `Student Status: ${filters.studentStatus}`,
      `Student Type: ${filters.studentType}`,
      `Age Range: ${filters.ageRange}`,
      `First-Generation Status: ${filters.firstGenStatus}`,
      '',
      'Included Sections:',
      ...sections.map(section => `- ${section}`),
      '',
      'Audit Preview:',
      `${timestamp.toLocaleString()} | ${currentUser?.username ?? 'user'} | CERTIFIED_REPORT_EXPORT | ${formatLabel}`,
      ...(isPresident ? [`QCU Institutional Seal: EMBEDDED`, `DOC-HASH: ${documentHash}`] : []),
    ].join('\n');
    const isPdf = format === 'pdf';
    const content = isPdf ? createSimplePdf(summary.split('\n')) : createSimpleXlsx(summary.split('\n'));
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: isPdf ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    link.download = `QCU-${filters.college}-Report-${stamp}.${isPdf ? 'pdf' : 'xlsx'}`;
    link.click();
    URL.revokeObjectURL(link.href);
    setRecentExports(previous => [{
      id: `generated-${timestamp.getTime()}`,
      report: isRegistrar ? 'Custom Registrar Analytics Report' : 'Custom Institutional Analytics Report',
      format: isPdf ? 'PDF' : 'XLSX',
      lastGenerated: timestamp.toLocaleString(),
    }, ...previous].slice(0, 6));
  }

  function handleGenerate() {
    if (!anySelected) return;
    showModal({
      title: 'Generate Certified Report',
      message: `Export a ${formatLabel} report reflecting the active filter view (AY: ${filters.academicYear}, Campus: ${filters.campus}, College: ${filters.college})?`,
      confirmLabel: 'Generate & Export',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        setGenerating(true);
        setTimeout(() => {
          setGenerating(false);
          downloadReport();
          showToast({
            type: 'success',
            title: 'Report Generated Successfully',
            body: `${formatLabel} report downloaded — ${new Date().toLocaleString()}`
          });
        }, 1800);
      },
    });
  }

  const activeCount = selectedModules.length;
  const programOptions = filters.college === 'All'
    ? ['All', ...Object.values(PROGRAMS).flat()]
    : ['All', ...(PROGRAMS[filters.college] ?? [])];
  const categories = ['overview', 'student', 'faculty', 'admission', 'governance']
    .filter(category => availableModules.some(module => module.category === category));

  return (
    <div className="w-full space-y-5">
      <div className="overflow-hidden rounded-3xl border border-lilac/15 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-5 bg-gradient-to-r from-primary via-[#351442] to-obsidian px-6 py-6 text-white lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-lilac/20 bg-lilac/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#BB96E4" strokeWidth="1.5" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke="#BB96E4" strokeWidth="1.5" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="#FFD066" strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="#FFD066" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">{isRegistrar ? 'Registrar reporting workspace' : 'Certified reporting workspace'}</p>
              <h2 className="mt-1 text-xl font-bold text-white">{isPresident ? 'Export Reports & Certified Briefings' : isRegistrar ? 'Registrar Reports & Export' : currentUser?.role === 'dean' ? `${filters.college} Dean Reports & Export` : 'Institutional Reports & Export'}</h2>
              <p className="mt-1 text-xs text-white/55">{isPresident ? 'Generate board-ready institutional documentation' : 'Build timestamped PDF or Excel reports that preserve the exact active analytics scope.'}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ['Sections', activeCount.toString()],
              ['Format', formatLabel],
              ['Scope', filters.program !== 'All' ? filters.program : filters.college],
            ].map(([label, value]) => (
              <div key={label} className="min-w-24 rounded-2xl border border-white/10 bg-white/[.07] px-3 py-2.5">
                <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">{label}</p>
                <p className="mt-1 truncate text-xs font-bold text-golden">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 border-b border-lilac/10 bg-primary/[.025] px-6 py-3 sm:grid-cols-4">
          {[
            ['01', 'Define Scope'],
            ['02', 'Select Sections'],
            ['03', 'Choose Format'],
            ['04', 'Generate & Export'],
          ].map(([step, label], index) => (
            <button type="button" key={step} onClick={() => goToStep(index)} className={`flex items-center gap-2 rounded-xl p-1.5 text-left transition-colors ${activeStep === index ? 'bg-lilac/10' : 'hover:bg-surface'}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-[9px] font-bold ${activeStep === index ? 'bg-primary text-golden' : index < activeStep ? 'bg-coa text-white' : 'bg-lilac/10 text-primary'}`}>{step}</span>
              <span className={`text-[10px] font-semibold ${activeStep === index ? 'text-primary' : 'text-muted'}`}>{label}</span>
            </button>
          ))}
        </div>

        {isPresident && (
          <PresidentReportPreview
            modules={selectedModules}
            college={filters.college}
            campus={filters.campus}
            documentHash={documentHash}
            formatLabel={formatLabel}
          />
        )}

        {/* Editable filter scope */}
        <div id="report-step-1" className={`scroll-mt-28 border-b bg-white px-6 py-5 transition-colors ${activeStep === 0 ? 'border-lilac/40' : 'border-lilac/10'}`}>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-primary">Active Scope Filter</p>
              <p className="mt-0.5 text-[10px] text-muted">Every selected section and exported data table will use this exact scope.</p>
            </div>
            <button type="button" onClick={resetFilters} className="rounded-xl border border-lilac/20 bg-white px-3 py-1.5 text-[10px] font-semibold text-muted hover:bg-lilac/10 hover:text-primary">Reset filters</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <ScopeSelect label="Academic Year" value={filters.academicYear} options={['All', '2024–2025', '2025–2026', '2026–2027']} onChange={value => updateFilter('academicYear', value)} />
            <ScopeSelect label="Semester" value={filters.semester} options={['All', '1st Semester', '2nd Semester', 'Summer']} onChange={value => updateFilter('semester', value)} />
            <ScopeSelect label="Campus" value={filters.campus} options={['All', 'San Bartolome (Main)', 'San Francisco', 'Batasan Campus']} onChange={value => updateFilter('campus', value)} />
            <ScopeSelect label={currentUser?.role === 'dean' ? 'College · Locked' : 'College'} value={filters.college} options={currentUser?.role === 'dean' ? [currentUser.college ?? 'CCS'] : ['All', 'CCS', 'COE', 'COB', 'COA', 'COED']} disabled={currentUser?.role === 'dean'} onChange={value => updateFilter('college', value)} />
            <ScopeSelect label="Program" value={filters.program} options={programOptions} onChange={value => updateFilter('program', value)} />
            <ScopeSelect label="Year Level" value={filters.yearLevel} options={['All', '1st Year', '2nd Year', '3rd Year', '4th Year']} onChange={value => updateFilter('yearLevel', value)} />
          </div>
        </div>

        {/* Module selection */}
        <div id="report-step-2" className={`scroll-mt-28 border-b bg-surface/40 px-6 py-5 transition-colors ${activeStep === 1 ? 'border-lilac/40' : 'border-lilac/10'}`}>
          <div className="mb-4">
            <p className="text-sm font-bold text-primary">Select Report Sections</p>
            <p className="mt-1 text-[10px] text-muted">Compose a Registrar report from enrollment, faculty, admission, and institutional summary modules.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {categories.map(category => {
              const modules = availableModules.filter(module => module.category === category);
              const allSelected = modules.every(module => selected[module.id]);
              return (
                <section key={category} className={`rounded-2xl border p-4 transition-colors ${modules.some(module => selected[module.id]) ? 'border-lilac/30 bg-white shadow-sm' : 'border-lilac/15 bg-white/60'}`}>
                  <div className="mb-2 flex items-start justify-between gap-3 border-b border-lilac/10 pb-2">
                    <div>
                      <p className="text-xs font-bold text-primary">{CATEGORY_LABELS[category].title}</p>
                      <p className="mt-0.5 text-[9px] leading-relaxed text-muted">{CATEGORY_LABELS[category].detail}</p>
                    </div>
                    <button type="button" onClick={() => toggleCategory(category, !allSelected)} className="shrink-0 text-[9px] font-semibold text-lilac hover:text-primary">{allSelected ? 'Clear' : 'Select all'}</button>
                  </div>
                  <div className="space-y-1.5">
                    {modules.map(module => (
                      <label key={module.id} className="flex cursor-pointer items-start gap-2.5 rounded-xl px-2 py-1 transition-colors hover:bg-white">
                        <input type="checkbox" checked={Boolean(selected[module.id])} onChange={() => toggle(module.id)} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
                        <span className={`text-xs leading-relaxed ${selected[module.id] ? 'font-medium text-primary' : 'text-muted'}`}>{module.label}</span>
                      </label>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        {/* Format selection */}
        <div id="report-step-3" className={`scroll-mt-28 border-b bg-white px-6 py-5 transition-colors ${activeStep === 2 ? 'border-lilac/40' : 'border-lilac/10'}`}>
          <p className="text-sm font-bold text-primary">Export File Format</p>
          <p className="mb-4 mt-1 text-[10px] text-muted">Choose a presentation-ready document or an analysis-ready workbook.</p>
          <div className="grid gap-2.5 md:grid-cols-2">
            {[
              {
                id: 'pdf', label: 'Certified PDF Document',
                sub: isRegistrar ? 'Print-ready Registrar briefing with filter certification' : 'Print-ready institutional briefing',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
              },
              {
                id: 'excel', label: 'XLSX Raw Data Audit Workbook',
                sub: '.XLSX workbook with selected sections and filtered data tables',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.5"/><line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1.5"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="1.5"/></svg>,
              },
            ].map(f => (
              <label key={f.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${format === f.id ? 'border-primary bg-primary text-white shadow-md' : 'border-lilac/15 bg-surface/50 hover:border-lilac/35 hover:bg-white'}`}>
                <div className="relative w-4 h-4 rounded-full flex-shrink-0"
                  style={{ border: `2px solid ${format === f.id ? '#FFD066' : 'rgba(32,13,45,0.2)'}` }}
                  onClick={() => setFormat(f.id as 'pdf' | 'excel')}>
                  {format === f.id && (
                    <div className="absolute inset-1 rounded-full bg-golden" />
                  )}
                </div>
                <div className="flex items-center gap-3 flex-1" onClick={() => setFormat(f.id as 'pdf' | 'excel')}>
                  <span className={format === f.id ? 'text-golden' : 'text-lilac'}>{f.icon}</span>
                  <div>
                    <p className={`text-sm font-semibold ${format === f.id ? 'text-white' : 'text-primary'}`}>{f.label}</p>
                    <p className={`text-xs ${format === f.id ? 'text-white/55' : 'text-muted'}`}>{f.sub}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div id="report-step-4" className={`scroll-mt-28 flex flex-col gap-3 border-t bg-white px-6 py-5 transition-colors sm:flex-row sm:items-center sm:justify-between ${activeStep === 3 ? 'border-lilac/40' : 'border-lilac/10'}`}>
          <button onClick={() => navigate(isPresident ? 'president-dashboard' : currentUser?.role === 'registrar' ? 'registrar-dashboard' : currentUser?.role === 'dean' ? 'dean-dashboard' : 'exec-dashboard')}
            className="rounded-xl px-5 py-2.5 text-sm font-medium"
            style={{ background: 'rgba(32,13,45,0.06)', color: '#200D2D' }}>
            Cancel
          </button>
          <div className="flex flex-wrap items-center gap-3">
            {activeCount > 0 && (
              <span className="text-xs" style={{ color: '#7B6891' }}>
                {activeCount} module{activeCount !== 1 ? 's' : ''} selected
              </span>
            )}
            <button
              onClick={handleGenerate}
              disabled={!anySelected || generating}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm"
              style={{
                background: anySelected ? '#200D2D' : 'rgba(32,13,45,0.3)',
                color: '#FFFFFF',
                cursor: anySelected ? 'pointer' : 'not-allowed',
              }}>
              {generating ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Generate & Export Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-4">
          <p className="text-sm font-bold text-primary">Quick Export Report Templates</p>
          <p className="mt-1 text-xs text-muted">{isRegistrar ? 'Apply a curated Registrar package for recurring enrollment, faculty, admission, or planning reports.' : 'Apply a recommended combination of data sub-modules.'}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {QUICK_TEMPLATES.map(template => (
            <article key={template.id} className="group flex flex-col rounded-3xl border border-lilac/15 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-lilac/30 hover:shadow-md">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blossom text-primary transition-colors group-hover:bg-lilac/20">
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
        <div className="mb-4">
          <p className="text-sm font-bold text-primary">Frequently Generated Reports</p>
          <p className="mt-1 text-xs text-muted">Common reports retained for fast repeat configuration.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {FREQUENT_REPORTS.map(report => (
            <article key={report.id} className="rounded-3xl border border-lilac/15 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-bold text-primary">{report.title}</p>
              <p className="mt-2 text-xs text-muted">{report.frequency}</p>
              <p className="mt-1 text-[10px] text-muted">Last generated: <strong className="text-primary">{report.lastGenerated}</strong></p>
              <button type="button" onClick={() => applyTemplate(report)} className="mt-4 w-full rounded-xl bg-golden/20 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-golden/35">Configure Again</button>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-lilac/15 bg-white shadow-sm">
        <div className="border-b border-lilac/10 px-5 py-4">
          <p className="text-sm font-bold text-primary">Recent Exports</p>
          <p className="mt-1 text-xs text-muted">Download previously generated Registrar reports and review their certified generation date.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-blossom/30"><tr>{['Report', 'Scope', 'Format', 'Generated By', 'Last Generated Date', 'Action'].map(heading => <th key={heading} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-muted">{heading}</th>)}</tr></thead>
            <tbody>
              {recentExports.map(exportItem => (
                <tr key={exportItem.id} className="border-t border-lilac/5 hover:bg-blossom/10">
                  <td className="px-4 py-3 font-medium text-primary">{exportItem.report}</td>
                  <td className="px-4 py-3 text-muted">{filters.college}</td>
                  <td className="px-4 py-3"><span className="rounded-md bg-lilac/10 px-2.5 py-1 text-[10px] font-bold text-primary">{exportItem.format}</span></td>
                  <td className="px-4 py-3 text-muted">{currentUser?.name ?? 'Authorized user'}</td>
                  <td className="px-4 py-3 font-mono text-muted">{exportItem.lastGenerated}</td>
                  <td className="px-4 py-3"><button type="button" onClick={() => downloadRecent(exportItem)} className="rounded-lg bg-primary/5 px-3 py-1.5 font-semibold text-primary hover:bg-primary/10">Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Info banner */}
      <div className="flex gap-3 rounded-3xl p-4"
        style={{ background: 'rgba(187,150,228,0.08)', border: '1px solid rgba(187,150,228,0.2)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#BB96E4', flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className="text-xs leading-relaxed" style={{ color: '#7B6891' }}>
          Generated reports are certified by the QCU Management Information Systems Office and reflect institutional data as of <strong style={{ color: '#200D2D' }}>09/24/2026</strong>. All exports are logged to the Activity Audit Trail for compliance tracking.
        </p>
      </div>
    </div>
  );
}
