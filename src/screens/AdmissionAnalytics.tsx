import { useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { COLLEGES, getIncomeData, getScholarshipData, getTotalStudents } from '../data/mockData';
import AnalyticsChartCard from '../components/AnalyticsChartCard';
import AnalyticsDisplayControls from '../components/AnalyticsDisplayControls';

const tooltipStyle = { borderRadius: 14, border: '1px solid rgba(187,150,228,.3)', boxShadow: '0 10px 30px rgba(32,13,45,.12)', fontSize: 11 };
const stages = [
  { stage: 'Applicants', base: 5600, color: '#200D2D' },
  { stage: 'Qualified', base: 4600, color: '#6f458f' },
  { stage: 'Accepted', base: 4050, color: '#BB96E4' },
  { stage: 'Confirmed', base: 3750, color: '#FFD066' },
  { stage: 'Enrolled', base: 3420, color: '#4C1413' },
];
const collegeApplicants: Record<string, number> = { CCS: 2250, COE: 1250, COB: 900, COA: 750, COED: 450 };
const programApplicants: Record<string, number> = {
  BSIT: 1100, BSIS: 620, BSCS: 530, BSIE: 540, BSECE: 400,
  BSEntrep: 900, BSBA: 560, BSA: 520, BECEd: 450,
};
const PIPELINE_CHARTS = [
  { id: 'funnel', label: 'Admission Funnel' },
  { id: 'college', label: 'Applicants by College' },
  { id: 'status', label: 'Admission Status' },
  { id: 'program', label: 'Applicants by Program' },
  { id: 'trend', label: 'Admission Trend' },
  { id: 'student-type', label: 'Admission by Student Type' },
  { id: 'comparison', label: 'Admission-to-Enrollment Comparison' },
];
const EQUITY_CHARTS = [
  { id: 'first-generation', label: 'First-Generation Analytics' },
  { id: 'income', label: 'Household Income Brackets' },
  { id: 'scholarship', label: 'Scholarship Grant Distribution' },
  { id: 'first-gen-retention', label: 'First-Gen Retention / Progression' },
];

function Card({ chartId, eyebrow, title, description, rows, insights, children }: {
  chartId: string;
  eyebrow: string;
  title: string;
  description?: string;
  rows: (string | number)[][];
  insights?: string[];
  children: React.ReactNode;
}) {
  return <AnalyticsChartCard chartId={chartId} exportPrefix="admission-analytics" eyebrow={eyebrow} title={title} description={description} rows={rows} insights={insights}><div className="mt-4">{children}</div></AnalyticsChartCard>;
}

export default function AdmissionAnalytics() {
  const { filters, setFilters, navigate, showToast } = useApp();
  const [view, setView] = useState<'pipeline' | 'equity'>('pipeline');
  const [visibleCharts, setVisibleCharts] = useState<Set<string>>(() => new Set([...PIPELINE_CHARTS, ...EQUITY_CHARTS].map(chart => chart.id)));
  const demographicScale = getTotalStudents({ ...filters, college: 'All', program: 'All' }) / 12450;
  const scopeApplicants = filters.program !== 'All'
    ? (programApplicants[filters.program] ?? 5600)
    : filters.college !== 'All'
      ? (collegeApplicants[filters.college] ?? 5600)
      : 5600;
  const scale = demographicScale * (scopeApplicants / 5600);
  const funnel = stages.map(item => ({ ...item, value: Math.round(item.base * scale) }));
  const applicants = funnel[0].value;
  const qualified = funnel[1].value;
  const accepted = funnel[2].value;
  const enrolled = funnel[4].value;
  const collegeData = Object.entries(collegeApplicants)
    .filter(([college]) => filters.college === 'All' || filters.college === college)
    .map(([college, value]) => ({ college, applicants: Math.round(value * demographicScale), color: COLLEGES[college as keyof typeof COLLEGES].color }));
  const statusData = funnel.map(item => ({ name: item.stage, value: item.value, color: item.color }));
  const trendData = [
    { period: 'AY 23–24', applicants: Math.round(4700 * scale), enrolled: Math.round(2810 * scale) },
    { period: 'AY 24–25', applicants: Math.round(4950 * scale), enrolled: Math.round(2980 * scale) },
    { period: 'AY 25–26', applicants: Math.round(5100 * scale), enrolled: Math.round(3150 * scale) },
    { period: 'AY 26–27', applicants, enrolled },
  ];
  const incomeData = getIncomeData(filters);
  const scholarshipData = getScholarshipData(filters).filter(item => filters.scholarship === 'All' || item.grant === filters.scholarship);
  const firstGen = Math.round(4350 * demographicScale * (scopeApplicants / 5600));
  const programRows = useMemo(() => {
    const rows = [
      ['BSIT', 'CCS', 1100], ['BSIS', 'CCS', 620], ['BSCS', 'CCS', 530],
      ['BSIE', 'COE', 540], ['BSECE', 'COE', 400],
      ['BSEntrep', 'COB', 900], ['BSBA', 'COB', 560], ['BSA', 'COA', 520], ['BECEd', 'COED', 450],
    ] as const;
    return rows.filter(([, college]) => filters.college === 'All' || college === filters.college)
      .map(([program, college, value]) => ({ program, college, applicants: Math.round(value * demographicScale) }));
  }, [demographicScale, filters.college]);
  const studentTypeData = [
    { type: 'First-time', applicants: Math.round(3950 * scale) },
    { type: 'Transferee', applicants: Math.round(950 * scale) },
    { type: 'Returning', applicants: Math.round(500 * scale) },
    { type: 'Other', applicants: Math.round(200 * scale) },
  ];
  const comparisonData = collegeData.map(item => ({
    college: item.college,
    applicants: item.applicants,
    qualified: Math.round(item.applicants * 0.821),
    accepted: Math.round(item.applicants * 0.723),
    enrolled: Math.round(item.applicants * 0.611),
  }));
  const firstGenerationData = [
    { group: 'First-Gen', students: firstGen },
    { group: 'Non-First-Gen', students: Math.max(0, Math.round(getTotalStudents(filters) - firstGen)) },
  ];

  const rateCards = [
    ['Qualification Rate', `${((qualified / Math.max(applicants, 1)) * 100).toFixed(1)}%`, 'Qualified ÷ Applicants'],
    ['Acceptance Rate', `${((accepted / Math.max(qualified, 1)) * 100).toFixed(1)}%`, 'Accepted ÷ Qualified'],
    ['Enrollment Conversion', `${((enrolled / Math.max(accepted, 1)) * 100).toFixed(1)}%`, 'Enrolled ÷ Accepted'],
  ];
  const retentionRows = [['Year Level', 'First-Gen Students'], ['1st Year', 1550], ['2nd Year', 1240], ['3rd Year', 1020], ['4th Year', 820]] as (string | number)[][];
  const chartRows: Record<string, (string | number)[][]> = {
    funnel: [['Stage', 'Applicants'], ...funnel.map(item => [item.stage, item.value])],
    college: [['College', 'Applicants'], ...collegeData.map(item => [item.college, item.applicants])],
    status: [['Admission Status', 'Applicants'], ...statusData.map(item => [item.name, item.value])],
    program: [['Program', 'College', 'Applicants'], ...programRows.map(item => [item.program, item.college, item.applicants])],
    trend: [['Period', 'Applicants', 'Enrolled'], ...trendData.map(item => [item.period, item.applicants, item.enrolled])],
    'student-type': [['Student Type', 'Applicants'], ...studentTypeData.map(item => [item.type, item.applicants])],
    comparison: [['College', 'Applicants', 'Qualified', 'Accepted', 'Enrolled'], ...comparisonData.map(item => [item.college, item.applicants, item.qualified, item.accepted, item.enrolled])],
    'first-generation': [['Student Group', 'Students'], ...firstGenerationData.map(item => [item.group, item.students])],
    income: [['Income Bracket', 'Students'], ...incomeData.map(item => [item.bracket, item.value])],
    scholarship: [['Grant', 'First-Gen', 'Non-First-Gen'], ...scholarshipData.map(item => [item.grant, item.firstGen, item.nonGen])],
    'first-gen-retention': retentionRows,
  };
  const activeCharts = view === 'pipeline' ? PIPELINE_CHARTS : EQUITY_CHARTS;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-primary to-obsidian p-5 text-white md:flex-row md:items-center">
        <div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-lilac">Admissions command center</p><p className="mt-2 text-xl font-bold">Applicant Journey & Access Equity</p><p className="mt-1 text-xs text-white/55">Every rate identifies its denominator and follows the active filter scope.</p></div>
        <div className="flex rounded-2xl bg-white/10 p-1">
          {([['pipeline', 'Pipeline'], ['equity', 'First-Gen & Equity']] as const).map(([id, label]) => <button key={id} onClick={() => setView(id)} className={`rounded-xl px-4 py-2 text-xs font-semibold ${view === id ? 'bg-lilac text-primary' : 'text-white/65 hover:text-white'}`}>{label}</button>)}
        </div>
      </div>

      <AnalyticsDisplayControls
        charts={activeCharts}
        visible={visibleCharts}
        onChange={(id, checked) => setVisibleCharts(previous => {
          const next = new Set(previous);
          if (checked) next.add(id);
          else next.delete(id);
          return next;
        })}
        rows={chartRows}
        metrics={[
          ['Total Applicants', applicants],
          ['Qualified', qualified],
          ['Accepted', accepted],
          ['Enrolled', enrolled],
          ['First-Gen Cohort', firstGen],
        ]}
        exportPrefix={`admission-${view}`}
      />

      {view === 'pipeline' ? <>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['Total Applicants', applicants.toLocaleString(), '100% pipeline baseline'],
            ['Qualified', qualified.toLocaleString(), `${((qualified / Math.max(applicants, 1)) * 100).toFixed(1)}% of applicants`],
            ['Accepted', accepted.toLocaleString(), `${((accepted / Math.max(qualified, 1)) * 100).toFixed(1)}% of qualified`],
            ['Enrolled', enrolled.toLocaleString(), `${((enrolled / Math.max(applicants, 1)) * 100).toFixed(1)}% overall conversion`],
          ].map(([label, value, detail], index) => <button key={label} className={`rounded-3xl border p-5 text-left shadow-sm transition-transform hover:-translate-y-0.5 ${index === 0 ? 'border-primary bg-primary text-white' : index === 3 ? 'border-golden bg-golden/65 text-primary' : 'border-lilac/20 bg-white text-primary'}`}><p className={`text-[9px] font-bold uppercase tracking-widest ${index === 0 ? 'text-lilac' : 'text-muted'}`}>{label}</p><p className={`mt-3 text-3xl font-bold ${index === 0 ? 'text-golden' : ''}`}>{value}</p><p className={`mt-1 text-[10px] ${index === 0 ? 'text-white/55' : 'text-muted'}`}>{detail}</p></button>)}
        </div>

        {visibleCharts.has('funnel') && <Card chartId="funnel" rows={chartRows.funnel} insights={[`${((enrolled / Math.max(applicants, 1)) * 100).toFixed(1)}% of applicants reached enrolled status in the active scope.`]} eyebrow="Conversion engine" title="Admission Funnel" description="Applicants → Qualified → Accepted → Confirmed → Enrolled">
          <div className="space-y-3">{funnel.map((item, index) => <div key={item.stage} className="flex items-center gap-3"><span className="w-20 text-[10px] font-semibold text-muted">{item.stage}</span><button onClick={() => showToast({ type: 'info', title: `${item.stage}: ${item.value.toLocaleString()}`, body: 'This stage reflects every active filter.' })} className="flex h-10 items-center rounded-xl px-4 text-left text-xs font-bold text-white transition-all hover:brightness-110" style={{ width: `${Math.max(33, 88 - index * 12)}%`, background: item.color }}>{item.value.toLocaleString()}</button><span className="ml-auto text-[10px] text-muted">{index === 0 ? 'Baseline' : `${((item.value / Math.max(funnel[index - 1].value, 1)) * 100).toFixed(1)}%`}</span></div>)}</div>
        </Card>}

        <div className="grid gap-4 lg:grid-cols-2">
          {visibleCharts.has('college') && <Card chartId="college" rows={chartRows.college} insights={[`${collegeData[0]?.college ?? 'The leading college'} has the highest visible applicant count in the current filtered scope.`]} eyebrow="Demand distribution" title="Applicants by College" description="Select a bar to drill down while preserving other filters.">
            <ResponsiveContainer width="100%" height={240}><BarChart data={collegeData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="college" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="applicants" radius={[7, 7, 0, 0]} onClick={entry => setFilters(previous => ({ ...previous, college: String((entry as unknown as { college: string }).college), program: 'All' }))}>{collegeData.map(item => <Cell key={item.college} fill={item.color} cursor="pointer" />)}</Bar></BarChart></ResponsiveContainer>
          </Card>}
          {visibleCharts.has('status') && <Card chartId="status" rows={chartRows.status} eyebrow="Status composition" title="Admission Status">
            <ResponsiveContainer width="100%" height={240}><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82}>{statusData.map(item => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer>
          </Card>}
          {visibleCharts.has('program') && <Card chartId="program" rows={chartRows.program} eyebrow="Program preference" title="Applicants by Program">
            <ResponsiveContainer width="100%" height={260}><BarChart data={programRows} layout="vertical"><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" tick={{ fontSize: 9 }} /><YAxis dataKey="program" type="category" width={65} tick={{ fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="applicants" fill="#BB96E4" radius={[0, 7, 7, 0]} onClick={entry => setFilters(previous => ({ ...previous, program: String((entry as unknown as { program: string }).program) }))} cursor="pointer" /></BarChart></ResponsiveContainer>
          </Card>}
          {visibleCharts.has('trend') && <Card chartId="trend" rows={chartRows.trend} eyebrow="Four-year movement" title="Admission Trend">
            <ResponsiveContainer width="100%" height={260}><LineChart data={trendData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="period" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Line type="monotone" dataKey="applicants" stroke="#200D2D" strokeWidth={3} /><Line type="monotone" dataKey="enrolled" stroke="#BB96E4" strokeWidth={3} /></LineChart></ResponsiveContainer>
          </Card>}
          {visibleCharts.has('student-type') && <Card chartId="student-type" rows={chartRows['student-type']} eyebrow="Applicant demographics" title="Admission by Student Type">
            <ResponsiveContainer width="100%" height={260}><BarChart data={studentTypeData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="type" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="applicants" fill="#FFD066" radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer>
          </Card>}
          {visibleCharts.has('comparison') && <Card chartId="comparison" rows={chartRows.comparison} eyebrow="College conversion" title="Admission-to-Enrollment Comparison">
            <ResponsiveContainer width="100%" height={260}><BarChart data={comparisonData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="college" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="applicants" fill="#200D2D" /><Bar dataKey="qualified" fill="#6f458f" /><Bar dataKey="accepted" fill="#BB96E4" /><Bar dataKey="enrolled" fill="#FFD066" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer>
          </Card>}
          <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Operational action</p>
            <p className="mt-1 text-sm font-bold text-primary">Filtered Admission Report</p>
            <div className="rounded-2xl bg-surface p-4"><p className="text-sm font-semibold text-primary">Current pipeline scope is report-ready</p><p className="mt-2 text-xs leading-relaxed text-muted">Export the current applicants, qualification, acceptance, confirmation, enrollment, college, program, and trend sections with the exact active filter scope.</p><button onClick={() => navigate('report-generation')} className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white">Generate admission report</button></div>
          </section>
        </div>

        <div className="grid gap-3 md:grid-cols-3">{rateCards.map(([label, value, denominator]) => <div key={label} className="rounded-3xl border border-lilac/20 bg-white p-5"><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">{label}</p><p className="mt-2 text-3xl font-bold text-primary">{value}</p><p className="mt-1 text-[10px] text-muted">Denominator: {denominator}</p></div>)}</div>
      </> : <>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['First-Gen Applicants', firstGen.toLocaleString(), `${((firstGen / Math.max(getTotalStudents(filters), 1)) * 100).toFixed(1)}% of selected cohort`],
            ['Government Scholars', Math.round(6800 * demographicScale * (scopeApplicants / 5600)).toLocaleString(), 'QCYDO, TES/UniFAST, CHED'],
            ['First-Gen 4th Year', Math.round(820 * demographicScale * (scopeApplicants / 5600)).toLocaleString(), 'Longitudinal progression cohort'],
          ].map(([label, value, detail], index) => <button key={label} className={`rounded-3xl border p-5 text-left ${index === 0 ? 'border-primary bg-primary text-white' : 'border-lilac/20 bg-white text-primary'}`}><p className={`text-[9px] font-bold uppercase tracking-widest ${index === 0 ? 'text-lilac' : 'text-muted'}`}>{label}</p><p className={`mt-3 text-3xl font-bold ${index === 0 ? 'text-golden' : ''}`}>{value}</p><p className={`mt-1 text-[10px] ${index === 0 ? 'text-white/50' : 'text-muted'}`}>{detail}</p></button>)}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleCharts.has('first-generation') && <Card chartId="first-generation" rows={chartRows['first-generation']} eyebrow="Access and participation" title="First-Generation Analytics">
            <ResponsiveContainer width="100%" height={240}><PieChart><Pie data={firstGenerationData} dataKey="students" nameKey="group" innerRadius={55} outerRadius={84}><Cell fill="#BB96E4" /><Cell fill="#FFDBED" /></Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer>
          </Card>}
          {visibleCharts.has('income') && <Card chartId="income" rows={chartRows.income} eyebrow="Socioeconomic profile" title="Household Income Brackets" description="Authorized institutional field; denominator is the selected student cohort.">
            <ResponsiveContainer width="100%" height={240}><PieChart><Pie data={incomeData} dataKey="value" nameKey="bracket" innerRadius={55} outerRadius={84}>{incomeData.map(item => <Cell key={item.bracket} fill={item.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer>
          </Card>}
          {visibleCharts.has('scholarship') && <Card chartId="scholarship" rows={chartRows.scholarship} eyebrow="Financial aid" title="Scholarship Grant Distribution" description="Select a grant to isolate its First-Gen and non-First-Gen recipients.">
            <ResponsiveContainer width="100%" height={240}><BarChart data={scholarshipData}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="grant" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="firstGen" name="First-Gen" fill="#BB96E4" radius={[5, 5, 0, 0]} onClick={entry => setFilters(previous => ({ ...previous, scholarship: String((entry as unknown as { grant: string }).grant) }))} cursor="pointer" /><Bar dataKey="nonGen" name="Non-First-Gen" fill="#FFD066" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer>
          </Card>}
          {visibleCharts.has('first-gen-retention') && <Card chartId="first-gen-retention" rows={chartRows['first-gen-retention']} insights={['The active filters are preserved across all four year-level stages.']} eyebrow="Longitudinal cohort" title="First-Gen Retention / Progression" description="Cohort entering first year compared through fourth year.">
            <div className="space-y-3">{[['1st Year', 1550], ['2nd Year', 1240], ['3rd Year', 1020], ['4th Year', 820]].map(([year, value], index) => <div key={year} className="flex items-center gap-3"><span className="w-16 text-[10px] font-semibold text-muted">{year}</span><span className="h-9 rounded-xl bg-gradient-to-r from-primary to-lilac" style={{ width: `${100 - index * 14}%` }} /><strong className="ml-auto text-xs text-primary">{Math.round(Number(value) * demographicScale * (scopeApplicants / 5600)).toLocaleString()}</strong></div>)}</div>
          </Card>}
          <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Access assurance</p>
            <p className="mt-1 text-sm font-bold text-primary">Authorized-data notice</p>
            <div className="rounded-2xl bg-surface p-4"><p className="text-sm font-semibold text-primary">Conditional institutional fields</p><p className="mt-2 text-xs leading-relaxed text-muted">First-generation status, household income, and scholarship participation are displayed only when authorized source data is available. Missing fields must show an unavailable state rather than fabricated values.</p><button onClick={() => navigate('report-generation')} className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white">Build equity report</button></div>
          </section>
        </div>
      </>}
    </div>
  );
}
