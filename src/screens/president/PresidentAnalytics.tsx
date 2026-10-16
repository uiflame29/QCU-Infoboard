import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../../context/AppContext';
import { getCapacityData, getCollegeDonutData, getGenderData, getIncomeData, getScholarshipData, getTotalStudents } from '../../data/mockData';
import ChartModal from '../../components/ChartModal';
import ChartSelection from '../../components/ChartSelection';
import ChartDataSummary, { type ChartSeries } from '../../components/ChartDataSummary';

type View = 'enrollment' | 'share' | 'demographics';
type ModalChart = { title: string; description: string; chart: React.ReactNode; dataSummary: React.ReactNode; insights: string[] } | null;

const tooltipStyle = { borderRadius: 14, border: '1px solid rgba(66,107,194,.3)', boxShadow: '0 10px 30px rgba(0,0,57,.16)', fontSize: 11 };
const chartHeight = 290;

function Card({ eyebrow, title, onView, onExport, summary, children }: { eyebrow: string; title: string; onView: () => void; onExport: () => void; summary: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">{eyebrow}</p><p className="mt-1 text-sm font-bold text-primary">{title}</p></div>
        <div className="flex gap-2">
          <button type="button" onClick={onView} className="rounded-xl border border-lilac/15 bg-white px-3 py-2 text-[10px] font-bold text-primary hover:bg-lilac/10">View Chart</button>
          <button type="button" onClick={onExport} className="rounded-xl bg-golden/15 px-3 py-2 text-[10px] font-bold text-primary hover:bg-golden/30">Export</button>
        </div>
      </div>
      {children}
      {summary}
    </section>
  );
}

export default function PresidentAnalytics({ view }: { view: View }) {
  const { filters, setFilters, showToast } = useApp();
  const chartIds = view === 'enrollment'
    ? [{ id: 'primary', label: 'Historical Growth & Capacity' }, { id: 'secondary', label: 'Semester Growth' }, { id: 'retention', label: 'Retention & Attrition' }, { id: 'capacity', label: 'Campus Capacity Benchmarks' }]
    : view === 'share'
      ? [{ id: 'primary', label: 'College Enrollment Share' }, { id: 'secondary', label: 'Degree Program Enrollment' }]
      : [{ id: 'primary', label: 'First-Gen by Income Bracket' }, { id: 'secondary', label: 'Comparative Pie Matrix' }, { id: 'gender', label: 'Gender Disaggregation' }, { id: 'scholarship', label: 'Scholarship Recipients' }];
  const [visible, setVisible] = useState(() => new Set(chartIds.map(chart => chart.id)));
  const [modal, setModal] = useState<ModalChart>(null);
  const total = getTotalStudents(filters);
  const scale = total / 12450;
  const collegeData = getCollegeDonutData(filters);
  const income = getIncomeData(filters);
  const gender = getGenderData(filters);
  const scholarship = getScholarshipData(filters);
  const programs = getCapacityData(filters);
  const enrollment = [
    { year: '2022–2023', actual: Math.round(10420 * scale), target: Math.round(10600 * scale), capacity: Math.round(12100 * scale), yoy: 2.8 },
    { year: '2023–2024', actual: Math.round(10980 * scale), target: Math.round(11100 * scale), capacity: Math.round(12300 * scale), yoy: 5.4 },
    { year: '2024–2025', actual: Math.round(11450 * scale), target: Math.round(11600 * scale), capacity: Math.round(12600 * scale), yoy: 4.3 },
    { year: '2025–2026', actual: Math.round(11948 * scale), target: Math.round(12000 * scale), capacity: Math.round(12800 * scale), yoy: 4.3 },
    { year: '2026–2027', actual: Math.round(12450 * scale), target: Math.round(12350 * scale), capacity: Math.round(13000 * scale), yoy: 4.2 },
  ];
  const semesters = [
    { term: 'AY24 1st', students: Math.round(11180 * scale), growth: 2.1 },
    { term: 'AY24 2nd', students: Math.round(11450 * scale), growth: 2.4 },
    { term: 'AY25 1st', students: Math.round(11720 * scale), growth: 2.4 },
    { term: 'AY25 2nd', students: Math.round(11948 * scale), growth: 1.9 },
    { term: 'AY26 1st', students: Math.round(12300 * scale), growth: 2.9 },
    { term: 'Midyear', students: Math.round(3150 * scale), growth: 1.2 },
  ];
  const retention = [
    { year: '2022–2023', retained: 84.2, attrition: 15.8 },
    { year: '2023–2024', retained: 86.5, attrition: 13.5 },
    { year: '2024–2025', retained: 88.1, attrition: 11.9 },
    { year: '2025–2026', retained: 89.4, attrition: 10.6 },
    { year: '2026–2027', retained: 91.0, attrition: 9.0 },
  ];
  const campusCapacity = [
    { campus: 'San Bartolome', enrolled: Math.round(total * .62), capacity: Math.round(8200 * scale) },
    { campus: 'San Francisco', enrolled: Math.round(total * .22), capacity: Math.round(3000 * scale) },
    { campus: 'Batasan', enrolled: Math.round(total * .16), capacity: Math.round(2200 * scale) },
  ];
  const demographics = income.map((row, index) => ({ bracket: row.bracket.replace('Lower Middle ', '').replace('Low Income ', '').replace('Middle ', ''), firstGen: [74, 43, 18][index], general: [26, 57, 82][index] }));
  const firstGenPie = [{ name: 'First-Generation', value: Math.round(total * .38), color: '#426BC2' }, { name: 'General Enrollees', value: Math.round(total * .62), color: '#FFD066' }];
  const summaries: Record<string, { categoryKey: string; series: ChartSeries[]; distribution?: boolean; totalLabel?: string }> = {
    enrollment: {
      categoryKey: 'year',
      distribution: false,
      totalLabel: 'Latest actual',
      series: [
        { key: 'actual', label: 'Actual', color: '#426BC2', aggregate: 'latest' },
        { key: 'target', label: 'Target', color: '#FFD066', aggregate: 'latest', includeInGrandTotal: false },
        { key: 'capacity', label: 'Capacity', color: '#16365F', aggregate: 'latest', includeInGrandTotal: false },
        { key: 'yoy', label: 'YoY growth', color: '#00875A', unit: '%', aggregate: 'latest', includeInGrandTotal: false },
      ],
    },
    semesters: { categoryKey: 'term', totalLabel: 'All term records', series: [{ key: 'students', label: 'Enrollment', color: '#426BC2' }] },
    retention: {
      categoryKey: 'year',
      distribution: false,
      totalLabel: 'Latest retention',
      series: [
        { key: 'retained', label: 'Retained', color: '#426BC2', unit: '%', aggregate: 'latest' },
        { key: 'attrition', label: 'Attrition', color: '#16365F', unit: '%', aggregate: 'latest', includeInGrandTotal: false },
      ],
    },
    capacity: {
      categoryKey: 'campus',
      totalLabel: 'Total enrolled',
      series: [
        { key: 'enrolled', label: 'Enrolled', color: '#426BC2' },
        { key: 'capacity', label: 'Capacity', color: '#FFD066', includeInGrandTotal: false },
      ],
    },
    college: { categoryKey: 'name', totalLabel: 'Total students', series: [{ key: 'value', label: 'Enrollment', color: '#426BC2' }] },
    programs: { categoryKey: 'program', totalLabel: 'Total enrollees', series: [{ key: 'enrolled', label: 'Enrollment', color: '#426BC2' }] },
    demographics: {
      categoryKey: 'bracket',
      distribution: false,
      totalLabel: 'Average first-gen share',
      series: [
        { key: 'firstGen', label: 'First-generation', color: '#426BC2', unit: '%', aggregate: 'average' },
        { key: 'general', label: 'General', color: '#FFD066', unit: '%', aggregate: 'average', includeInGrandTotal: false },
      ],
    },
    firstGen: { categoryKey: 'name', totalLabel: 'Total students', series: [{ key: 'value', label: 'Students', color: '#426BC2' }] },
    gender: {
      categoryKey: 'college',
      totalLabel: 'Total students',
      series: [
        { key: 'female', label: 'Female', color: '#426BC2' },
        { key: 'male', label: 'Male', color: '#000039' },
      ],
    },
    scholarship: {
      categoryKey: 'grant',
      totalLabel: 'Total recipients',
      series: [
        { key: 'firstGen', label: 'First-gen', color: '#426BC2' },
        { key: 'nonGen', label: 'General', color: '#FFD066' },
      ],
    },
  };

  useEffect(() => setVisible(new Set(chartIds.map(chart => chart.id))), [view]);

  function toggle(id: string, checked: boolean) {
    setVisible(previous => {
      const next = new Set(previous);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  }

  function exportChart(name: string, rows: Record<string, unknown>[]) {
    const keys = Object.keys(rows[0] ?? {});
    const csv = [keys.join(','), ...rows.map(row => keys.map(key => `"${String(row[key] ?? '')}"`).join(','))].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = `QCU-President-${name}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast({ type: 'success', title: 'Chart data exported', body: `${name} downloaded with the current filter scope.` });
  }

  const lineChart = (height = chartHeight) => <ResponsiveContainer width="100%" height={height}><LineChart data={enrollment}><CartesianGrid vertical={false} stroke="rgba(66,107,194,.15)" /><XAxis dataKey="year" tick={{ fontSize: 9, fill: '#64748B' }} /><YAxis yAxisId="count" tick={{ fontSize: 9, fill: '#64748B' }} /><YAxis yAxisId="rate" orientation="right" unit="%" domain={[0, 8]} tick={{ fontSize: 9, fill: '#64748B' }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Line yAxisId="count" type="monotone" dataKey="actual" name="Historical Enrollment" stroke="#426BC2" strokeWidth={3} /><Line yAxisId="count" type="monotone" dataKey="target" name="Institutional Target" stroke="#FFD066" strokeWidth={3} strokeDasharray="6 4" /><Line yAxisId="count" type="monotone" dataKey="capacity" name="Physical Capacity Ceiling" stroke="#16365F" strokeWidth={2} strokeDasharray="3 4" /><Line yAxisId="rate" type="monotone" dataKey="yoy" name="YoY Growth %" stroke="#00875A" strokeWidth={2} /></LineChart></ResponsiveContainer>;
  const semesterChart = (height = chartHeight) => <ResponsiveContainer width="100%" height={height}><BarChart data={semesters}><CartesianGrid vertical={false} stroke="rgba(66,107,194,.15)" /><XAxis dataKey="term" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="students" name="Term Enrollment" fill="#426BC2" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>;
  const retentionChart = (height = chartHeight) => <ResponsiveContainer width="100%" height={height}><BarChart data={retention}><CartesianGrid vertical={false} stroke="rgba(66,107,194,.15)" /><XAxis dataKey="year" tick={{ fontSize: 9 }} /><YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="retained" name="Retention" stackId="progress" fill="#426BC2" /><Bar dataKey="attrition" name="Attrition" stackId="progress" fill="#16365F" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>;
  const capacityChart = (height = chartHeight) => <ResponsiveContainer width="100%" height={height}><BarChart data={campusCapacity}><CartesianGrid vertical={false} stroke="rgba(66,107,194,.15)" /><XAxis dataKey="campus" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="enrolled" name="Active Enrollees" fill="#426BC2" radius={[5, 5, 0, 0]} /><Bar dataKey="capacity" name="Classroom Capacity" fill="#FFD066" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer>;
  const shareChart = (height = chartHeight) => <div className="relative"><ResponsiveContainer width="100%" height={height}><PieChart><Pie data={collegeData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} onClick={entry => entry.name && entry.name !== 'Others' && setFilters(previous => ({ ...previous, college: entry.name ?? 'All', program: 'All' }))}>{collegeData.map(row => <Cell key={row.name} fill={row.color} className="cursor-pointer" />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 text-center"><p className="text-2xl font-bold text-primary">{programs.length}</p><p className="text-[8px] font-bold uppercase tracking-wider text-muted">Programs</p></div></div>;
  const programChart = (height = chartHeight) => <ResponsiveContainer width="100%" height={height}><BarChart data={programs} layout="vertical"><CartesianGrid horizontal={false} stroke="rgba(66,107,194,.15)" /><XAxis type="number" tick={{ fontSize: 9 }} /><YAxis dataKey="program" type="category" width={68} tick={{ fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="enrolled" name="Program Enrollees" fill="#426BC2" radius={[0, 7, 7, 0]} onClick={entry => { const row = entry as unknown as { college?: string; program?: string }; if (row.college && row.program) setFilters(previous => ({ ...previous, college: row.college ?? 'All', program: row.program ?? 'All' })); }} className="cursor-pointer" /></BarChart></ResponsiveContainer>;
  const demographicChart = (height = chartHeight) => <ResponsiveContainer width="100%" height={height}><BarChart data={demographics} layout="vertical"><CartesianGrid horizontal={false} stroke="rgba(66,107,194,.15)" /><XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><YAxis dataKey="bracket" type="category" width={110} tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="firstGen" name="First-Generation" stackId="share" fill="#426BC2" /><Bar dataKey="general" name="General Enrollees" stackId="share" fill="#FFD066" radius={[0, 7, 7, 0]} /></BarChart></ResponsiveContainer>;
  const pieMatrix = (height = chartHeight) => <ResponsiveContainer width="100%" height={height}><PieChart><Pie data={firstGenPie} dataKey="value" nameKey="name" innerRadius={58} outerRadius={95}>{firstGenPie.map(row => <Cell key={row.name} fill={row.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer>;
  const genderChart = (height = chartHeight) => <ResponsiveContainer width="100%" height={height}><BarChart data={gender}><CartesianGrid vertical={false} stroke="rgba(66,107,194,.15)" /><XAxis dataKey="college" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="female" name="Female" fill="#426BC2" radius={[5, 5, 0, 0]} /><Bar dataKey="male" name="Male" fill="#000039" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer>;
  const scholarshipChart = (height = chartHeight) => <ResponsiveContainer width="100%" height={height}><BarChart data={scholarship}><CartesianGrid vertical={false} stroke="rgba(66,107,194,.15)" /><XAxis dataKey="grant" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="firstGen" name="First-Gen Recipients" stackId="grant" fill="#426BC2" /><Bar dataKey="nonGen" name="General Recipients" stackId="grant" fill="#FFD066" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer>;

  const copy = view === 'enrollment'
    ? { eyebrow: 'Strategic enrollment planning', title: 'Multi-Series Enrollment Growth & Target Projection', detail: 'Historical verified headcount compared with institutional targets.' }
    : view === 'share'
      ? { eyebrow: 'Academic portfolio', title: 'College & Program Proportional Share', detail: 'Select a college segment to drill down across the active dashboard scope.' }
      : { eyebrow: 'Equity & access', title: 'First-Generation Socioeconomic Matrix', detail: 'Comparative participation across household income brackets.' };

  const chartDefinitions = view === 'enrollment'
    ? [
        { id: 'primary', summary: summaries.enrollment, eyebrow: 'Five-year trajectory', title: 'Historical Growth, Targets & Capacity Ceiling', chart: lineChart(), expanded: lineChart(410), rows: enrollment, insights: ['Five-year active enrollment increased steadily while remaining below the physical capacity ceiling.', 'AY 2026–2027 enrollment is 0.8% above target with 4.2% year-over-year growth.'] },
        { id: 'secondary', summary: summaries.semesters, eyebrow: 'Term comparison', title: 'Semester-over-Semester Growth', chart: semesterChart(), expanded: semesterChart(410), rows: semesters, insights: ['Second-semester enrollment remains stable across the comparison window.', 'Midyear volume is shown separately from regular-term headcount.'] },
        { id: 'retention', summary: summaries.retention, eyebrow: 'Student progression', title: 'Retention & Attrition Tracking', chart: retentionChart(), expanded: retentionChart(410), rows: retention, insights: ['Retention improved from 84.2% to 91.0% over five academic years.', 'Attrition declined to 9.0% in the active year.'] },
        { id: 'capacity', summary: summaries.capacity, eyebrow: 'Physical limits', title: 'Campus Classroom Capacity Benchmarks', chart: capacityChart(), expanded: capacityChart(410), rows: campusCapacity, insights: ['San Bartolome carries the largest share of both enrollment and classroom capacity.', 'All three campuses remain inside modeled physical limits.'] },
      ]
    : view === 'share'
      ? [
          { id: 'primary', summary: summaries.college, eyebrow: 'Academic unit distribution', title: 'College Enrollment Share', chart: shareChart(), expanded: shareChart(410), rows: collegeData, insights: ['Select a segment to drill into its degree programs.', 'The center badge displays the active number of degree programs.'] },
          { id: 'secondary', summary: summaries.programs, eyebrow: 'Program drill-down', title: 'Degree Program Enrollment Counts', chart: programChart(), expanded: programChart(410), rows: programs, insights: ['Program counts cover BS Accountancy, Entrepreneurship, Information Technology, Industrial Engineering, Electronics Engineering, and Early Childhood Education.', 'Select a bar to apply its college and program as the global scope.'] },
        ]
      : [
          { id: 'primary', summary: summaries.demographics, eyebrow: 'Income access', title: 'First-Gen by Household Income Bracket', chart: demographicChart(), expanded: demographicChart(410), rows: demographics, insights: ['First-generation participation is highest in the lowest household income bracket.', 'All brackets respond to active institutional filters.'] },
          { id: 'secondary', summary: summaries.firstGen, eyebrow: 'Milestone volume', title: 'First-Generation Comparative Pie Matrix', chart: pieMatrix(), expanded: pieMatrix(410), rows: firstGenPie, insights: ['First-generation students represent 38% of the active student body.', 'The comparative volume updates with campus, college, and program scope.'] },
          { id: 'gender', summary: summaries.gender, eyebrow: 'Gender tier', title: 'Gender Disaggregation by College', chart: genderChart(), expanded: genderChart(410), rows: gender, insights: ['Female and male headcounts are disaggregated across every active college.', 'Exact headcounts and distributions are listed below the chart.'] },
          { id: 'scholarship', summary: summaries.scholarship, eyebrow: 'Financial access', title: 'Institutional & External Scholarship Recipients', chart: scholarshipChart(), expanded: scholarshipChart(410), rows: scholarship, insights: ['QCYDO, CHED, and UniFAST-TES recipient volumes include First-Gen and general enrollees.', 'Grant distributions respond to the active demographic scope.'] },
        ];

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 rounded-3xl border border-lilac/20 bg-white p-5 text-primary shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">{copy.eyebrow}</p><p className="mt-1 text-lg font-bold">{copy.title}</p><p className="mt-1 text-xs text-muted">{copy.detail}</p></div>
        <ChartSelection charts={chartIds} visible={visible} onChange={toggle} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {chartDefinitions.filter(definition => visible.has(definition.id)).map(definition => {
          const dataSummary = <ChartDataSummary data={definition.rows} {...definition.summary} />;
          return <Card key={definition.id} eyebrow={definition.eyebrow} title={definition.title} onExport={() => exportChart(definition.title.replace(/ /g, '-'), definition.rows)} onView={() => setModal({ title: definition.title, description: `${copy.detail} This view is synchronized with the universal filter engine.`, chart: definition.expanded, dataSummary, insights: definition.insights })} summary={dataSummary}>{definition.chart}</Card>;
        })}
      </div>

      {!visible.size && <section className="rounded-3xl border border-dashed border-lilac/30 bg-white p-12 text-center"><p className="text-sm font-bold text-primary">All charts are hidden</p><p className="mt-1 text-xs text-muted">Use Chart Selection to restore one or more visualizations.</p></section>}
      {modal && <ChartModal title={modal.title} description={modal.description} chart={modal.chart} dataSummary={modal.dataSummary} insights={modal.insights} onClose={() => setModal(null)} onExport={() => showToast({ type: 'success', title: 'Expanded chart prepared', body: 'Use the card-level Export control to download its synchronized data.' })} />}
    </div>
  );
}
