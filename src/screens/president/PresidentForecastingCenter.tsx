import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import ChartAutoSummary from '../../components/ChartAutoSummary';

type Horizon = '2028' | '2031';
type PillarId = 'curriculum' | 'educators' | 'engagement' | 'research' | 'community' | 'infrastructures' | 'governance';
type RiskLevel = 'On Track' | 'At Risk' | 'Critical Gap';

type RiskRow = {
  pillar: string;
  metric: string;
  actual: string;
  target: string;
  pace: string;
  variance: string;
  status: RiskLevel;
  action: string;
  owner: string;
};

const PILLARS: { id: PillarId; label: string; short: string }[] = [
  { id: 'curriculum', label: 'Global Standard Curriculum', short: 'Curriculum' },
  { id: 'educators', label: 'Empowered Educators', short: 'Educators' },
  { id: 'engagement', label: 'Dynamic Student Engagement', short: 'Student Mobility' },
  { id: 'research', label: 'Research Excellence', short: 'Research' },
  { id: 'community', label: 'Community Synergy', short: 'Community' },
  { id: 'infrastructures', label: 'Supportive Infrastructures', short: 'Infrastructure' },
  { id: 'governance', label: 'Governance for Excellence', short: 'Governance' },
];

const TOOLTIP_STYLE = {
  borderRadius: 16,
  border: '1px solid rgba(187,150,228,.28)',
  boxShadow: '0 16px 42px rgba(32,13,45,.16)',
  fontSize: 11,
};

const BASE_RISKS: RiskRow[] = [
  { pillar: 'Global Standard Curriculum', metric: 'BSIT Level III Readiness', actual: '78.0%', target: '90.0%', pace: '94.0%', variance: '+4.0%', status: 'On Track', action: 'Proceed to mock audit scheduling.', owner: 'CCIS Dean' },
  { pillar: 'Global Standard Curriculum', metric: 'COE Licensure Passing Rate', actual: '78.4%', target: '85.0%', pace: '80.2%', variance: '-4.8%', status: 'At Risk', action: 'Implement mandatory review sessions.', owner: 'VPAA / COE Dean' },
  { pillar: 'Empowered Educators', metric: 'Faculty Ph.D. Completion', actual: '32.0%', target: '50.0%', pace: '45.2%', variance: '-4.8%', status: 'At Risk', action: 'Expand institutional study grant funding.', owner: 'VPAA / HRD' },
  { pillar: 'Research Excellence', metric: 'Scopus Research Publications', actual: '28 papers', target: '50 papers', pace: '40 papers', variance: '-10 papers', status: 'At Risk', action: 'Increase seed grants per indexed paper.', owner: 'Research Office' },
  { pillar: 'Dynamic Student Engagement', metric: 'Multinational Corporate Placement', actual: '18.5%', target: '35.0%', pace: '22.0%', variance: '-13.0%', status: 'Critical Gap', action: 'Activate global corporate advisory board.', owner: 'Career Placement Office' },
  { pillar: 'Supportive Infrastructures', metric: 'Smart Classroom Adoption', actual: '70.0%', target: '85.0%', pace: '74.5%', variance: '-10.5%', status: 'Critical Gap', action: 'Fast-track smart board procurement.', owner: 'MIS / Infrastructure Office' },
];

function Icon({ type }: { type: 'spark' | 'alert' | 'download' | 'simulation' | 'arrow' | 'info' }) {
  const paths = {
    spark: <><path d="M12 3l1.3 4.1L17 9l-3.7 1.9L12 15l-1.3-4.1L7 9l3.7-1.9L12 3z" /><path d="M5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15zM19 4l.6 1.9L21.5 7l-1.9.6L19 9.5l-.6-1.9L16.5 7l1.9-1.1L19 4z" /></>,
    alert: <><path d="M13 2L5 13h6l-1 9 8-12h-6l1-8z" /></>,
    download: <><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 20h16" /></>,
    simulation: <><path d="M20 7h-5V2M4 17h5v5" /><path d="M18.5 14a7 7 0 01-11.8 4.1L4 17m2-7a7 7 0 0111.3-4L20 7" /></>,
    arrow: <><path d="M5 12h14m-5-5l5 5-5 5" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8v.1" /></>,
  };
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

function StatusBadge({ status, variance }: { status: RiskLevel; variance: string }) {
  const styles = status === 'On Track'
    ? 'border-coa/20 bg-coa/10 text-coa'
    : status === 'At Risk'
      ? 'border-golden/50 bg-golden/20 text-obsidian'
      : 'border-obsidian/20 bg-obsidian/10 text-obsidian';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'On Track' ? 'bg-coa' : status === 'At Risk' ? 'bg-golden' : 'bg-obsidian'}`} />
      {status} ({variance})
    </span>
  );
}

function downloadReport(content: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function PresidentForecastingCenter() {
  const { currentUser, showToast } = useApp();
  const [horizon, setHorizon] = useState<Horizon>('2028');
  const [pillar, setPillar] = useState<PillarId>('curriculum');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [researchBudget, setResearchBudget] = useState(0);
  const [studyLeave, setStudyLeave] = useState(0);
  const [appliedScenario, setAppliedScenario] = useState({ researchBudget: 0, studyLeave: 0, version: 0 });
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');

  const phdProjection = Number((45.2 + appliedScenario.researchBudget * 0.12 + appliedScenario.studyLeave * 0.216).toFixed(1));
  const publicationProjection = Math.round(40 + appliedScenario.researchBudget * 0.9333);
  const scenarioActive = appliedScenario.researchBudget > 0 || appliedScenario.studyLeave > 0;

  const risks = useMemo(() => BASE_RISKS.map(row => {
    if (row.metric === 'Faculty Ph.D. Completion' && scenarioActive) {
      const variance = Number((phdProjection - 50).toFixed(1));
      return { ...row, pace: `${phdProjection}%`, variance: `${variance >= 0 ? '+' : ''}${variance}%`, status: phdProjection >= 50 ? 'On Track' as const : 'At Risk' as const, action: phdProjection >= 50 ? 'Target achieved by Q3 2028; sustain funded study leave.' : row.action };
    }
    if (row.metric === 'Scopus Research Publications' && scenarioActive) {
      const variance = publicationProjection - 50;
      return { ...row, pace: `${publicationProjection} papers`, variance: `${variance >= 0 ? '+' : ''}${variance} papers`, status: publicationProjection >= 50 ? 'On Track' as const : 'At Risk' as const, action: publicationProjection >= 50 ? 'Target exceeded; prepare indexed-paper pipeline.' : row.action };
    }
    return row;
  }), [phdProjection, publicationProjection, scenarioActive]);

  const filteredRisks = riskFilter === 'All' ? risks : risks.filter(row => row.status === riskFilter);
  const counts = {
    track: risks.filter(row => row.status === 'On Track').length,
    risk: risks.filter(row => row.status === 'At Risk').length,
    critical: risks.filter(row => row.status === 'Critical Gap').length,
  };

  const chartContent = useMemo(() => {
    if (pillar === 'curriculum') {
      const trajectory = horizon === '2028'
        ? [
            { period: '2022', actual: 38, projection: null, target: null },
            { period: '2023', actual: 47, projection: null, target: null },
            { period: '2024', actual: 55, projection: null, target: null },
            { period: '2025', actual: 62, projection: null, target: null },
            { period: '2026 YTD', actual: 78, projection: 78, target: null },
            { period: 'Q4 2027', actual: null, projection: 94, target: 90 },
            { period: '2028', actual: null, projection: 98, target: 90 },
          ]
        : [
            { period: '2022', actual: 38, projection: null, target: null },
            { period: '2024', actual: 55, projection: null, target: null },
            { period: '2026 YTD', actual: 78, projection: 78, target: null },
            { period: '2028', actual: null, projection: 94, target: 90 },
            { period: '2029', actual: null, projection: 97, target: null },
            { period: '2030', actual: null, projection: 99, target: null },
            { period: '2031', actual: null, projection: 100, target: 100 },
          ];
      return {
        title: 'ALCUCOA Area 3 Readiness & Accreditation Horizon',
        subtitle: 'Historical actuals vs. algorithmic OBE alignment projection',
        annotation: horizon === '2028' ? 'Level III target realized at 94% by Q4 2027 — two quarters early' : '100% globally benchmarked and dual-degree compliant by 2031',
        primary: <ResponsiveContainer width="100%" height="100%"><LineChart data={trajectory} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" strokeDasharray="4 5" /><XAxis dataKey="period" tick={{ fontSize: 9, fill: '#7B6891' }} /><YAxis domain={[20, 105]} unit="%" tick={{ fontSize: 9, fill: '#7B6891' }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value, name) => [`${value}%`, name]} /><Legend iconType="circle" iconSize={8} /><ReferenceLine y={90} stroke="#4C1413" strokeDasharray="4 3" label={{ value: 'Level III · 90%', position: 'insideTopLeft', fill: '#4C1413', fontSize: 9 }} /><Line type="monotone" dataKey="actual" name="Verified actual" stroke="#200D2D" strokeWidth={3} connectNulls={false} dot={{ r: 4, fill: '#200D2D' }} ><LabelList dataKey="actual" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line><Line type="monotone" dataKey="projection" name="Algorithmic projection" stroke="#BB96E4" strokeWidth={3} strokeDasharray="7 5" connectNulls={false} dot={{ r: 4, fill: '#FFD066', stroke: '#200D2D' }} ><LabelList dataKey="projection" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line><Line type="monotone" dataKey="target" name="Milestone target" stroke="#FFD066" strokeWidth={2} connectNulls ><LabelList dataKey="target" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line></LineChart></ResponsiveContainer>,
        secondaryTitle: 'Curriculum Evolution Mix',
        secondarySubtitle: '1994 tech-voc legacy cleansing model',
        secondary: <ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={[
          { period: '2022 baseline', legacy: 45, local: 50, global: 5 },
          { period: '2026 YTD', legacy: 10, local: 75, global: 15 },
          { period: '2028 forecast', legacy: 0, local: 60, global: 40 },
        ]} margin={{ top: 12, right: 8, left: 14, bottom: 4 }}><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><YAxis type="category" dataKey="period" width={84} tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value}%`]} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="legacy" stackId="mix" name="Legacy Tech-Voc" fill="#7B6891" radius={[6, 0, 0, 6]} ><LabelList dataKey="legacy" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="local" stackId="mix" name="Local Degree" fill="#BB96E4" ><LabelList dataKey="local" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="global" stackId="mix" name="Global / Dual Degree" fill="#FFD066" radius={[0, 6, 6, 0]} ><LabelList dataKey="global" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar></BarChart></ResponsiveContainer>,
        info: 'Pre-2019 legacy records are isolated from global projections.',
      };
    }

    if (pillar === 'educators') {
      const trajectory = horizon === '2028'
        ? [
            { period: '2025', phd: 24, masters: 66, licensed: 61 },
            { period: '2026 YTD', phd: 32, masters: 74, licensed: 68 },
            { period: '2027', phd: Number(((32 + phdProjection) / 2).toFixed(1)), masters: 83, licensed: 77 },
            { period: '2028', phd: phdProjection, masters: 92, licensed: 85 },
          ]
        : [
            { period: '2025', phd: 24, masters: 66, licensed: 61 },
            { period: '2026 YTD', phd: 32, masters: 74, licensed: 68 },
            { period: '2028', phd: phdProjection, masters: 92, licensed: 85 },
            { period: '2029', phd: phdProjection + 4, masters: 95, licensed: 89 },
            { period: '2030', phd: phdProjection + 8, masters: 97, licensed: 92 },
            { period: '2031', phd: phdProjection + 12, masters: 100, licensed: 95 },
          ];
      return {
        title: 'Faculty Qualification Velocity',
        subtitle: 'ALCUCOA Areas 2 & 7 qualification horizon',
        annotation: phdProjection >= 50 ? `Scenario reaches ${phdProjection}% Ph.D. coverage by Q3 2028` : `Ph.D. coverage projects ${phdProjection}% against the 50% threshold`,
        primary: <ResponsiveContainer width="100%" height="100%"><LineChart data={trajectory} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" strokeDasharray="4 5" /><XAxis dataKey="period" tick={{ fontSize: 9 }} /><YAxis domain={[0, 105]} unit="%" tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value}%`]} /><Legend iconType="circle" iconSize={8} /><ReferenceLine y={50} stroke="#4C1413" strokeDasharray="4 3" label={{ value: 'Ph.D. threshold', fill: '#4C1413', fontSize: 9 }} /><Line type="monotone" dataKey="licensed" name="Industry licensed" stroke="#FFD066" strokeWidth={2.5} ><LabelList dataKey="licensed" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line><Line type="monotone" dataKey="masters" name="Master’s holders" stroke="#BB96E4" strokeWidth={2.5} ><LabelList dataKey="masters" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line><Line type="monotone" dataKey="phd" name="Ph.D. holders" stroke="#200D2D" strokeWidth={3} strokeDasharray={scenarioActive ? undefined : '7 5'} ><LabelList dataKey="phd" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line></LineChart></ResponsiveContainer>,
        secondaryTitle: 'Research & Citation Velocity',
        secondarySubtitle: 'Indexed output against global ranking entry level',
        secondary: <ResponsiveContainer width="100%" height="100%"><BarChart data={[
          { period: '2025', papers: 22, citations: 34 },
          { period: '2026 YTD', papers: 28, citations: 49 },
          { period: '2028 forecast', papers: publicationProjection, citations: scenarioActive ? 108 : 98 },
        ]} margin={{ top: 12, right: 8, left: -10, bottom: 4 }}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" /><XAxis dataKey="period" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} /><Legend iconType="circle" iconSize={8} /><ReferenceLine y={50} stroke="#4C1413" strokeDasharray="4 3" label={{ value: '50-paper target', fill: '#4C1413', fontSize: 9 }} /><Bar dataKey="papers" name="Scopus / WoS papers" fill="#BB96E4" radius={[6, 6, 0, 0]} ><LabelList dataKey="papers" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="citations" name="Citation velocity index" fill="#FFD066" radius={[6, 6, 0, 0]} ><LabelList dataKey="citations" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar></BarChart></ResponsiveContainer>,
        info: 'Citation velocity intersects regional ranking entry levels by Q3 2028.',
      };
    }

    if (pillar === 'research') {
      const trajectory = [
        { period: '2022', actual: 22, projection: null },
        { period: '2026 YTD', actual: 28, projection: 28 },
        { period: '2028', actual: null, projection: 40 },
        ...(horizon === '2031' ? [{ period: '2031', actual: null, projection: null }] : []),
      ];
      return {
        title: 'Publication & Citation Velocity Curve',
        subtitle: 'Scopus/Web of Science indexed outputs vs. external grant fund inflows',
        annotation: 'Current velocity (+6 papers/yr) projects 40 publications by 2028 (At Risk: -10 papers gap).',
        primary: <ResponsiveContainer width="100%" height="100%"><LineChart data={trajectory} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" strokeDasharray="4 5" /><XAxis dataKey="period" tick={{ fontSize: 9 }} /><YAxis domain={[0, 60]} tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value} papers`]} /><Legend iconType="circle" iconSize={8} /><ReferenceLine y={50} stroke="#EF4444" strokeDasharray="4 3" label={{ value: 'Global Ranking Entry · 50 papers', fill: '#4C1413', fontSize: 9 }} /><Line type="monotone" dataKey="actual" name="Verified publications" stroke="#0284C7" strokeWidth={3} connectNulls={false} ><LabelList dataKey="actual" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line><Line type="monotone" dataKey="projection" name="Projected publications" stroke="#F59E0B" strokeWidth={3} strokeDasharray="7 5" connectNulls={false} ><LabelList dataKey="projection" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line></LineChart></ResponsiveContainer>,
        secondaryTitle: 'Research Translation & Utilization Index',
        secondarySubtitle: 'Shift from basic academic papers to commercialized & community solutions',
        secondary: <ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={[
          { period: '2022', basic: 80, applied: 15, patented: 5 },
          { period: '2026 YTD', basic: 60, applied: 30, patented: 10 },
          { period: '2028 forecast', basic: 30, applied: 45, patented: 25 },
        ]} margin={{ top: 12, right: 8, left: 14, bottom: 4 }}><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><YAxis type="category" dataKey="period" width={84} tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value}%`]} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="basic" stackId="mix" name="Basic Papers" fill="#BB96E4" radius={[6, 0, 0, 6]} ><LabelList dataKey="basic" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="applied" stackId="mix" name="Applied Studies" fill="#0284C7" ><LabelList dataKey="applied" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="patented" stackId="mix" name="Commercialized / Patented" fill="#FFD066" radius={[0, 6, 6, 0]} ><LabelList dataKey="patented" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar></BarChart></ResponsiveContainer>,
        info: 'External research grant inflows modeled at PHP 20.0M baseline by 2028.',
      };
    }

    if (pillar === 'community') {
      const trajectory = [
        { period: '2022', actual: 35, projection: null },
        { period: '2026 YTD', actual: 42, projection: 42 },
        { period: '2028', actual: null, projection: 58 },
        ...(horizon === '2031' ? [{ period: '2031', actual: null, projection: null }] : []),
      ];
      return {
        title: 'Longitudinal Community Impact Index',
        subtitle: 'Socioeconomic lift and livelihood stability in adopted barangays',
        annotation: 'Tracking projects 58% livelihood lift by 2028 (At Risk due to delayed impact reporting).',
        primary: <ResponsiveContainer width="100%" height="100%"><LineChart data={trajectory} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" strokeDasharray="4 5" /><XAxis dataKey="period" tick={{ fontSize: 9 }} /><YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value}% livelihood lift`]} /><Legend iconType="circle" iconSize={8} /><ReferenceLine y={70} stroke="#10B981" strokeDasharray="4 3" label={{ value: 'Sustainable Lift · 70%', fill: '#00875A', fontSize: 9 }} /><Line type="monotone" dataKey="actual" name="Verified livelihood lift" stroke="#0284C7" strokeWidth={3} connectNulls={false} ><LabelList dataKey="actual" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line><Line type="monotone" dataKey="projection" name="Projected livelihood lift" stroke="#F59E0B" strokeWidth={3} strokeDasharray="7 5" connectNulls={false} ><LabelList dataKey="projection" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line></LineChart></ResponsiveContainer>,
        secondaryTitle: 'Extension Program Modernization Mix',
        secondarySubtitle: 'Migration from short-term relief drives to technology transfer systems',
        secondary: <ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={[
          { period: '2022', charity: 70, workshops: 20, transfer: 10 },
          { period: '2026 YTD', charity: 50, workshops: 35, transfer: 15 },
          { period: '2028 forecast', charity: 10, workshops: 40, transfer: 50 },
        ]} margin={{ top: 12, right: 8, left: 14, bottom: 4 }}><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><YAxis type="category" dataKey="period" width={84} tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value}%`]} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="charity" stackId="mix" name="Charity Drives" fill="#7B6891" radius={[6, 0, 0, 6]} ><LabelList dataKey="charity" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="workshops" stackId="mix" name="Skills Workshops" fill="#0284C7" ><LabelList dataKey="workshops" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="transfer" stackId="mix" name="Tech Transfer" fill="#FFD066" radius={[0, 6, 6, 0]} ><LabelList dataKey="transfer" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar></BarChart></ResponsiveContainer>,
        info: 'One-time relief programs are isolated from long-term sustainability projections.',
      };
    }

    if (pillar === 'infrastructures') {
      const trajectory = [
        { period: '2022', actual: 50, projection: null },
        { period: '2026 YTD', actual: 70, projection: 70 },
        { period: 'Q2 2027', actual: null, projection: 72 },
        { period: '2028', actual: null, projection: 74.5 },
        ...(horizon === '2031' ? [{ period: '2031', actual: null, projection: null }] : []),
      ];
      return {
        title: 'Smart Classroom & Digital Asset Adoption',
        subtitle: 'IoT hardware deployment and daily facility utilization rates across campuses',
        annotation: 'Current procurement projects 74.5% adoption by 2028 (Critical Gap: -10.5% below target).',
        primary: <ResponsiveContainer width="100%" height="100%"><LineChart data={trajectory} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" strokeDasharray="4 5" /><XAxis dataKey="period" tick={{ fontSize: 9 }} /><YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value}% adoption`]} /><Legend iconType="circle" iconSize={8} /><ReferenceLine y={85} stroke="#EF4444" strokeDasharray="4 3" label={{ value: 'Smart Deployment · 85%', fill: '#4C1413', fontSize: 9 }} /><Line type="monotone" dataKey="actual" name="Verified adoption" stroke="#0284C7" strokeWidth={3} connectNulls={false} ><LabelList dataKey="actual" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line><Line type="monotone" dataKey="projection" name="Projected adoption" stroke="#EF4444" strokeWidth={3} strokeDasharray="7 5" connectNulls={false} ><LabelList dataKey="projection" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line></LineChart></ResponsiveContainer>,
        secondaryTitle: 'Facility Maintenance & Safety Compliance',
        secondarySubtitle: 'Preventive maintenance turnaround time and energy sustainability mix',
        secondary: <ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={[
          { period: '2022', response: 72, microgrid: 30 },
          { period: '2026 YTD', response: 48, microgrid: 50 },
          { period: '2028 forecast', response: 24, microgrid: 85 },
        ]} margin={{ top: 12, right: 8, left: 14, bottom: 4 }}><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} /><YAxis type="category" dataKey="period" width={84} tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value, name) => [name === 'Repair Response' ? `${value} hours` : `${value}%`, name]} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="response" name="Repair Response" fill="#BB96E4" radius={[0, 6, 6, 0]} ><LabelList dataKey="response" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="microgrid" name="Microgrid Ready" fill="#FFD066" radius={[0, 6, 6, 0]} ><LabelList dataKey="microgrid" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar></BarChart></ResponsiveContainer>,
        info: 'Batasan campus hardware deployment schedules are weighted separately.',
      };
    }

    if (pillar === 'governance') {
      const trajectory = [
        { period: '2022', actual: 65, projection: null },
        { period: '2026 YTD', actual: 82, projection: 82 },
        { period: 'Q1 2028', actual: null, projection: 91 },
        ...(horizon === '2031' ? [{ period: '2031', actual: null, projection: null }] : []),
      ];
      return {
        title: 'Executive Data Integration & Audit Velocity',
        subtitle: 'Administrative paperless workflow adoption and audit clearance speed',
        annotation: 'Digital transformation velocity projects 91% paperless administrative efficiency by 2028 (On Track).',
        primary: <ResponsiveContainer width="100%" height="100%"><LineChart data={trajectory} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" strokeDasharray="4 5" /><XAxis dataKey="period" tick={{ fontSize: 9 }} /><YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value}% paperless`]} /><Legend iconType="circle" iconSize={8} /><ReferenceLine y={95} stroke="#10B981" strokeDasharray="4 3" label={{ value: 'Paperless Benchmark · 95%', fill: '#00875A', fontSize: 9 }} /><Line type="monotone" dataKey="actual" name="Verified paperless adoption" stroke="#0284C7" strokeWidth={3} connectNulls={false} ><LabelList dataKey="actual" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line><Line type="monotone" dataKey="projection" name="Projected paperless adoption" stroke="#10B981" strokeWidth={3} strokeDasharray="7 5" connectNulls={false} ><LabelList dataKey="projection" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line></LineChart></ResponsiveContainer>,
        secondaryTitle: 'Evidence-Based Executive Decision Mix',
        secondarySubtitle: 'Proportion of institutional decisions backed by automated InfoBoard analytics',
        secondary: <ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={[
          { period: '2022', manual: 70, dataDriven: 30 },
          { period: '2026 YTD', manual: 40, dataDriven: 60 },
          { period: '2028 forecast', manual: 5, dataDriven: 95 },
        ]} margin={{ top: 12, right: 8, left: 14, bottom: 4 }}><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><YAxis type="category" dataKey="period" width={84} tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value}%`]} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="manual" stackId="mix" name="Manual Memos" fill="#7B6891" radius={[6, 0, 0, 6]} ><LabelList dataKey="manual" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="dataDriven" stackId="mix" name="Automated Data Reports" fill="#0284C7" radius={[0, 6, 6, 0]} ><LabelList dataKey="dataDriven" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar></BarChart></ResponsiveContainer>,
        info: 'Real-time executive dashboard synchronization is enabled across all university units.',
      };
    }

    const trajectory = horizon === '2028'
      ? [
          { period: '2025', local: 76.2, global: 24 },
          { period: '2026 YTD', local: 78.4, global: 45 },
          { period: '2027', local: 79.3, global: 82 },
          { period: '2028', local: 80.2, global: 120 },
        ]
      : [
          { period: '2025', local: 76.2, global: 24 },
          { period: '2026 YTD', local: 78.4, global: 45 },
          { period: '2028', local: 80.2, global: 120 },
          { period: '2029', local: 82, global: 148 },
          { period: '2030', local: 84, global: 176 },
          { period: '2031', local: 86, global: 205 },
        ];
    return {
      title: 'Local-to-Global Engagement Pipeline',
      subtitle: 'Licensure outcomes and international academic mobility',
      annotation: 'International participation reaches 120 students by 2028; licensure remains 4.8 points below target',
      primary: <ResponsiveContainer width="100%" height="100%"><LineChart data={trajectory} margin={{ top: 12, right: 12, left: -12, bottom: 4 }}><CartesianGrid vertical={false} stroke="rgba(187,150,228,.18)" strokeDasharray="4 5" /><XAxis dataKey="period" tick={{ fontSize: 9 }} /><YAxis yAxisId="percent" domain={[60, 90]} unit="%" tick={{ fontSize: 9 }} /><YAxis yAxisId="students" orientation="right" tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} /><Legend iconType="circle" iconSize={8} /><ReferenceLine yAxisId="percent" y={85} stroke="#4C1413" strokeDasharray="4 3" /><Line yAxisId="percent" type="monotone" dataKey="local" name="Licensure passing rate %" stroke="#200D2D" strokeWidth={3} ><LabelList dataKey="local" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line><Line yAxisId="students" type="monotone" dataKey="global" name="Global mobility students" stroke="#BB96E4" strokeWidth={3} strokeDasharray="7 5" ><LabelList dataKey="global" position="top" fill="#200D2D" fontSize={8} fontWeight={700} /></Line></LineChart></ResponsiveContainer>,
      secondaryTitle: 'Premium Employability Trajectory',
      secondarySubtitle: 'Placement quality within six months of graduation',
      secondary: <ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={[
        { period: '2026 actual', local: 65, premium: 18.5, untracked: 16.5 },
        { period: '2028 forecast', local: 40, premium: 22, untracked: 38 },
        { period: '2028 target', local: 40, premium: 35, untracked: 25 },
      ]} margin={{ top: 12, right: 8, left: 14, bottom: 4 }}><CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" /><XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 9 }} /><YAxis type="category" dataKey="period" width={84} tick={{ fontSize: 9 }} /><Tooltip contentStyle={TOOLTIP_STYLE} formatter={value => [`${value}%`]} /><Legend iconType="circle" iconSize={8} /><Bar dataKey="local" stackId="mix" name="Local SME / LGU" fill="#7B6891" radius={[6, 0, 0, 6]} ><LabelList dataKey="local" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="premium" stackId="mix" name="Top 100 / Multinational" fill="#FFD066" ><LabelList dataKey="premium" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar><Bar dataKey="untracked" stackId="mix" name="Other / In transition" fill="#FFDBED" radius={[0, 6, 6, 0]} ><LabelList dataKey="untracked" position="center" fill="#200D2D" fontSize={8} fontWeight={700} /></Bar></BarChart></ResponsiveContainer>,
      info: 'Premium placement has a 13-point execution gap requiring immediate partnership activation.',
    };
  }, [horizon, pillar, phdProjection, publicationProjection, scenarioActive]);

  function runSimulation() {
    setAppliedScenario(previous => ({ researchBudget, studyLeave, version: previous.version + 1 }));
    setPillar('educators');
    const nextPhd = Number((45.2 + researchBudget * 0.12 + studyLeave * 0.216).toFixed(1));
    const nextPapers = Math.round(40 + researchBudget * 0.9333);
    showToast({
      type: nextPhd >= 50 && nextPapers >= 50 ? 'success' : 'warning',
      title: 'Predictive recalculation complete',
      body: `Ph.D. coverage is now ${nextPhd}% and indexed output is ${nextPapers} papers by 2028.`,
    });
  }

  function selectPillar(nextPillar: PillarId) {
    setPillar(nextPillar);
  }

  function exportPredictiveReport() {
    const selectedPillar = PILLARS.find(item => item.id === pillar)?.label;
    const content = [
      'QCU INFOBOARD — PRESIDENT EXECUTIVE FORECASTING CENTER',
      `Predictive horizon: ${horizon}`,
      `Strategic scope: ${selectedPillar}`,
      `Generated by: ${currentUser?.name ?? 'University President'}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      'STRATEGIC INTELLIGENCE',
      '- BSIT and Business Administration forecast 94% ALCUCOA Level III readiness by Q4 2027.',
      '- Faculty Ph.D. acquisition is trending 8% ahead of the 2026 IDP baseline.',
      '- International citation velocity is projected to double by 2028.',
      '- Multinational placement retains a 13.0% execution gap.',
      '',
      'RISK & EXCEPTION MATRIX',
      ...risks.map(row => `${row.pillar} | ${row.metric} | ${row.actual} | ${row.target} | ${row.pace} | ${row.status} (${row.variance}) | ${row.owner} | ${row.action}`),
      '',
      'SCENARIO ASSUMPTIONS',
      `Research allocation: +${appliedScenario.researchBudget}%`,
      `Study leave subsidies: +${appliedScenario.studyLeave}%`,
      `Projected Ph.D. coverage: ${phdProjection}%`,
      `Projected indexed papers: ${publicationProjection}`,
    ].join('\n');
    downloadReport(content, `QCU-Predictive-Report-${horizon}.txt`);
    showToast({ type: 'success', title: 'Predictive report exported', body: `${selectedPillar} intelligence and the complete risk matrix were downloaded.` });
  }

  return (
    <div className="space-y-5 pb-24">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-obsidian p-6 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-48 rounded-full bg-golden/10 blur-2xl" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-lilac/20 bg-lilac/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.18em] text-lilac"><Icon type="spark" /> President’s predictive intelligence</span>
              <p className="mt-4 max-w-2xl text-2xl font-bold tracking-tight">See the trajectory. Test the policy. Act before the gap widens.</p>
              <p className="mt-2 max-w-3xl text-xs leading-relaxed text-white/55">Executive planning intelligence across accreditation, faculty capability, research velocity, student mobility, employability, and institutional readiness.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3 text-right backdrop-blur-sm">
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Model status</p>
              <p className="mt-1 flex items-center gap-2 text-xs font-bold text-white"><span className="h-2 w-2 animate-pulse rounded-full bg-golden" /> Live · IDP 2026 baseline</p>
              <p className="mt-1 text-[9px] text-white/35">Last synchronized 2 minutes ago</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <button type="button" onClick={() => setPillar('curriculum')} className="group rounded-2xl border border-white/10 bg-white/[.07] p-4 text-left backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/[.11]">
              <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-lilac"><Icon type="spark" /> Predictive horizon</span>
              <span className="mt-2 block text-xs font-semibold leading-relaxed text-white/80">BSEE are forecast to reach <strong className="text-golden">94% Level III readiness by Q4 2027</strong>, with pre-2019 legacy records isolated for clean model accuracy.</span>
            </button>
            <button type="button" onClick={() => setPillar('educators')} className="group rounded-2xl border border-golden/15 bg-golden/[.07] p-4 text-left backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-golden/[.11]">
              <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-golden"><Icon type="alert" /> Strategic alert</span>
              <span className="mt-2 block text-xs font-semibold leading-relaxed text-white/80">Ph.D. acquisition is <strong className="text-golden">8% ahead of baseline</strong>; citation velocity may double by 2028 while multinational placement remains <strong className="text-blossom">13 points behind target</strong>.</span>
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-lilac/20 bg-white p-4 shadow-sm xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[.16em] text-muted">Planning horizon</p>
          <div className="flex rounded-2xl bg-surface p-1">
            {(['2028', '2031'] as Horizon[]).map(option => <button key={option} type="button" onClick={() => setHorizon(option)} className={`rounded-xl px-4 py-2.5 text-[10px] font-bold transition-all ${horizon === option ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-primary'}`}>{option === '2028' ? '2028 Mid-Term Milestones' : '2031 Terminal Targets'}</button>)}
          </div>
        </div>
        <label className="min-w-72 flex-1 xl:max-w-md">
          <span className="mb-2 block text-[9px] font-bold uppercase tracking-[.16em] text-muted">Strategic pillar</span>
          <span className="relative block">
            <select value={pillar} onChange={event => selectPillar(event.target.value as PillarId)} className="w-full appearance-none rounded-2xl border border-lilac/25 bg-surface px-4 py-3 pr-10 text-xs font-bold text-primary outline-none transition-all focus:border-lilac focus:ring-4 focus:ring-lilac/15">
              {PILLARS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lilac" width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </span>
        </label>
        <button type="button" onClick={exportPredictiveReport} className="flex items-center justify-center gap-2 rounded-2xl border border-lilac/25 px-4 py-3 text-xs font-bold text-primary transition-all hover:-translate-y-0.5 hover:border-lilac hover:bg-lilac/10"><Icon type="download" /> Export Predictive Report</button>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-lilac">{PILLARS.find(item => item.id === pillar)?.short} trajectory · {horizon}</p><p className="mt-1 text-base font-bold text-primary">{chartContent.title}</p><p className="mt-1 text-[10px] text-muted">{chartContent.subtitle}</p></div>
            <span className="rounded-full bg-primary/[.05] px-3 py-1.5 text-[9px] font-bold text-primary">Actual + forecast</span>
          </div>
          <div className="mt-5 h-80">{chartContent.primary}</div>
          <ChartAutoSummary className="mt-3" chart={chartContent.primary} showTotal={false} />
          <button type="button" onClick={() => showToast({ type: pillar === 'infrastructures' ? 'warning' : 'info', title: pillar === 'infrastructures' ? 'Strategic alert' : 'Forecast interpretation', body: chartContent.annotation })} className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-lilac/15 bg-gradient-to-r from-lilac/10 to-blossom/20 p-3 text-left transition-colors hover:border-lilac/35">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-lilac shadow-sm"><Icon type={pillar === 'infrastructures' ? 'alert' : 'spark'} /></span>
            <span><span className="block text-[8px] font-bold uppercase tracking-widest text-muted">{pillar === 'infrastructures' ? 'Strategic alert' : 'Model signal'}</span><span className="mt-0.5 block text-[10px] font-semibold text-primary">{chartContent.annotation}</span></span>
          </button>
        </section>

        <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg">
          <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-golden">Composition & velocity model</p><p className="mt-1 text-base font-bold text-primary">{chartContent.secondaryTitle}</p><p className="mt-1 text-[10px] text-muted">{chartContent.secondarySubtitle}</p></div>
          <div className="mt-5 h-80">{chartContent.secondary}</div>
          <ChartAutoSummary
            className="mt-3"
            chart={chartContent.secondary}
            totalLabel="Latest composition total"
            distribution={pillar !== 'educators' && pillar !== 'infrastructures'}
            showTotal={pillar !== 'educators' && pillar !== 'infrastructures'}
          />
          <button type="button" onClick={() => showToast({ type: 'info', title: 'Model note', body: chartContent.info })} className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-golden/15 px-3 py-2.5 text-left text-[9px] font-medium text-obsidian transition-colors hover:bg-golden/25"><Icon type="info" /> {chartContent.info}</button>
        </section>
      </div>

      <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-lilac/15 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-obsidian">Automated exception monitoring</p><p className="mt-1 text-lg font-bold text-primary">Departmental Risk & Action Matrix</p><p className="mt-1 text-[10px] text-muted">Critical gaps across strategic pillars with system-assigned action owners.</p></div>
          <div className="flex flex-wrap gap-2">
            {(['All', 'On Track', 'At Risk', 'Critical Gap'] as const).map(option => <button type="button" key={option} onClick={() => setRiskFilter(option)} className={`rounded-full px-3 py-1.5 text-[9px] font-bold transition-all ${riskFilter === option ? 'bg-primary text-white' : 'border border-lilac/20 text-muted hover:border-lilac hover:text-primary'}`}>{option}{option === 'On Track' ? ` · ${counts.track}` : option === 'At Risk' ? ` · ${counts.risk}` : option === 'Critical Gap' ? ` · ${counts.critical}` : ` · ${risks.length}`}</button>)}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-primary/[.035] text-[8px] font-bold uppercase tracking-[.12em] text-muted"><tr>{['Strategic Focus / Pillar', '2026 Actual', '2028 MilestoneTarget', 'Projected Pace', 'Status', 'Automated Action & Owner', ''].map(header => <th key={header} className="px-4 py-3">{header}</th>)}</tr></thead>
            <tbody>
              {filteredRisks.map((row, index) => (
                <tr key={row.metric} className={`border-t border-lilac/10 transition-colors hover:bg-blossom/20 ${index % 2 ? 'bg-surface/35' : ''}`}>
                  <td className="px-4 py-4"><span className="block text-[8px] font-bold uppercase tracking-wider text-lilac">{row.pillar}</span><span className="mt-1 block text-[11px] font-bold text-primary">{row.metric}</span></td>
                  <td className="px-4 py-4 text-[11px] font-semibold text-primary">{row.actual}</td>
                  <td className="px-4 py-4 text-[11px] font-semibold text-primary">{row.target}</td>
                  <td className="px-4 py-4 text-[11px] font-bold text-primary">{row.pace}</td>
                  <td className="px-4 py-4"><StatusBadge status={row.status} variance={row.variance} /></td>
                  <td className="max-w-xs px-4 py-4"><span className="block text-[10px] font-medium leading-relaxed text-primary">{row.action}</span><button type="button" onClick={() => showToast({ type: 'info', title: row.owner, body: `${row.action} This owner assignment is recorded in the executive action queue.` })} className="mt-2 rounded-lg bg-lilac/10 px-2 py-1 text-[8px] font-bold text-lilac hover:bg-lilac/20">Owner · {row.owner}</button></td>
                  <td className="px-4 py-4"><button type="button" onClick={() => showToast({ type: 'success', title: 'Action brief opened', body: `${row.owner} has been notified of the ${row.metric} exception.` })} aria-label={`Open action for ${row.metric}`} className="flex h-8 w-8 items-center justify-center rounded-xl border border-lilac/20 text-primary transition-all hover:border-lilac hover:bg-lilac/10"><Icon type="arrow" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`fixed bottom-0 z-20 transition-all duration-300 ${drawerOpen ? 'left-0 right-0 lg:left-72' : 'left-4 right-4 lg:left-[19rem]'}`}>
        <div className={`mx-auto max-w-6xl overflow-hidden rounded-t-3xl border border-b-0 border-lilac/25 bg-white shadow-[0_-18px_55px_rgba(32,13,45,.18)] transition-all duration-300 ${drawerOpen ? 'max-h-[34rem]' : 'max-h-[4.5rem]'}`}>
          <button type="button" onClick={() => setDrawerOpen(value => !value)} className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-surface">
            <span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-golden"><Icon type="simulation" /></span><span><span className="block text-xs font-bold text-primary">What-If Policy Simulation</span><span className="mt-0.5 block text-[9px] text-muted">{scenarioActive ? `Active model: +${appliedScenario.researchBudget}% research · +${appliedScenario.studyLeave}% study leave` : 'Test policy investment against 2028 outcomes'}</span></span></span>
            <span className={`rounded-xl bg-lilac/10 p-2 text-lilac transition-transform ${drawerOpen ? 'rotate-180' : ''}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></span>
          </button>
          <div className="border-t border-lilac/15 p-5">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_.8fr]">
              <label className="rounded-2xl border border-lilac/15 bg-surface/60 p-4">
                <span className="flex items-center justify-between text-[10px] font-bold text-primary"><span>Faculty Research Allocation</span><strong className="rounded-lg bg-lilac/15 px-2 py-1 text-lilac">+{researchBudget}%</strong></span>
                <input type="range" min="0" max="30" step="1" value={researchBudget} onChange={event => setResearchBudget(Number(event.target.value))} className="mt-4 w-full accent-primary" />
                <span className="mt-2 flex justify-between text-[8px] text-muted"><span>Baseline</span><span>+15% tested policy</span><span>+30%</span></span>
              </label>
              <label className="rounded-2xl border border-lilac/15 bg-surface/60 p-4">
                <span className="flex items-center justify-between text-[10px] font-bold text-primary"><span>Faculty Study Leave Subsidies</span><strong className="rounded-lg bg-golden/20 px-2 py-1 text-obsidian">+{studyLeave}%</strong></span>
                <input type="range" min="0" max="40" step="1" value={studyLeave} onChange={event => setStudyLeave(Number(event.target.value))} className="mt-4 w-full accent-obsidian" />
                <span className="mt-2 flex justify-between text-[8px] text-muted"><span>Baseline</span><span>+25% tested policy</span><span>+40%</span></span>
              </label>
              <div className="flex flex-col justify-between gap-3 rounded-2xl bg-gradient-to-br from-primary to-obsidian p-4 text-white">
                <div><p className="text-[8px] font-bold uppercase tracking-widest text-lilac">Modeled output</p><div className="mt-3 grid grid-cols-2 gap-2"><div><p className="text-lg font-bold">{Number((45.2 + researchBudget * 0.12 + studyLeave * 0.216).toFixed(1))}%</p><p className="text-[8px] text-white/45">Ph.D. coverage</p></div><div><p className="text-lg font-bold">{Math.round(40 + researchBudget * 0.9333)}</p><p className="text-[8px] text-white/45">Indexed papers</p></div></div></div>
                <button type="button" onClick={runSimulation} className="flex items-center justify-center gap-2 rounded-xl bg-golden px-4 py-2.5 text-[10px] font-bold text-primary transition-transform hover:-translate-y-0.5"><Icon type="simulation" /> Run Predictive Recalculation</button>
              </div>
            </div>
            <p className="mt-3 text-center text-[8px] text-muted">Policy assumptions begin Q1 2027. Recalculation updates Faculty & Research charts and exception statuses in real time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
