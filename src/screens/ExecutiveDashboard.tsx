import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import {
  getCollegeDonutData, getTotalStudents, getFirstGenData,
  getOverallGenderPct, getGenderData, getFacultyData, getFacultyRankData,
} from '../data/mockData';

function KPICard({ label, value, sub, bg, icon, accent }:
  { label: string; value: string; sub: string; bg: string; icon: React.ReactNode; accent?: boolean }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
      style={{ background: bg, minHeight: 120 }}>
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.18)' }}>{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-bold leading-none" style={{ color: accent ? '#FFD066' : undefined }}>
          {value}
        </p>
        <p className="text-xs mt-1.5 opacity-70">{sub}</p>
      </div>
      {/* decorative circle */}
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, white, transparent)' }} />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl text-xs"
      style={{ background: '#FFFFFF', border: '1px solid rgba(187,150,228,0.3)', boxShadow: '0 8px 24px rgba(32,13,45,0.12)' }}>
      {label && <p className="font-semibold mb-1" style={{ color: '#200D2D' }}>{label}</p>}
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color ?? '#200D2D' }}>
          {p.name}: <strong>{p.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

const DonutTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="px-3 py-2 rounded-xl text-xs"
      style={{ background: '#FFFFFF', border: '1px solid rgba(187,150,228,0.3)', boxShadow: '0 8px 24px rgba(32,13,45,0.12)' }}>
      <p className="font-semibold" style={{ color: '#200D2D' }}>{d.name}</p>
      <p style={{ color: d.payload.color ?? '#BB96E4' }}>{d.value.toLocaleString()} students</p>
    </div>
  );
};

export default function ExecutiveDashboard() {
  const { filters, setFilters, navigate } = useApp();

  const totalStudents = getTotalStudents(filters);
  const { firstGen, pct: fgPct } = getFirstGenData(filters);
  const { femalePct, malePct } = getOverallGenderPct(filters);
  const { fullTime, partTime } = getFacultyData(filters);
  const totalFaculty = fullTime + partTime;
  const collegeDonut = getCollegeDonutData(filters);
  const firstGenPie = [
    { name: 'First-Gen',    value: firstGen,                   color: '#BB96E4' },
    { name: 'Non-First-Gen', value: totalStudents - firstGen,  color: '#FFDBED' },
  ];
  const genderData = getGenderData(filters);
  const facultyRanks = getFacultyRankData(filters);

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Enrolled Students"
          value={totalStudents.toLocaleString()}
          sub="+4.2% from prior term"
          bg="linear-gradient(135deg, #FFD066 0%, #FFBB33 100%)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#200D2D" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="#200D2D" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#200D2D" strokeWidth="1.5" strokeLinecap="round"/></svg>}
        />
        <KPICard
          label="Overall Gender Ratio"
          value={`${femalePct}% / ${malePct}%`}
          sub="Female / Male students"
          bg="linear-gradient(135deg, #BB96E4 0%, #9B6EDC 100%)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
        />
        <KPICard
          label="First-Gen Cohort"
          value={firstGen.toLocaleString()}
          sub={`${fgPct}% of headcount`}
          bg="linear-gradient(135deg, #FFDBED 0%, #F8B8D0 100%)"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#200D2D" strokeWidth="1.5" strokeLinejoin="round"/></svg>}
        />
        <KPICard
          label="Active Faculty"
          value={totalFaculty.toString()}
          sub={`${Math.round((fullTime / (totalFaculty || 1)) * 100)}% Full-Time · ${Math.round((partTime / (totalFaculty || 1)) * 100)}% Part-Time`}
          bg="linear-gradient(135deg, #200D2D 0%, #3D1A55 100%)"
          accent
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="#BB96E4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="#BB96E4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
      </div>

      {/* Charts 2x2 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Enrollees per College – Donut */}
        <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(32,13,45,0.06)' }}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#BB96E4' }}>Enrollment Distribution</p>
              <p className="text-base font-bold mt-0.5" style={{ color: '#200D2D' }}>Enrollees per College</p>
            </div>
            <button onClick={() => navigate('student-analytics')}
              className="text-[10px] font-medium px-3 py-1 rounded-full"
              style={{ background: 'rgba(187,150,228,0.1)', color: '#BB96E4' }}>
              View insight →
            </button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div style={{ height: 200, width: '100%', maxWidth: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={collegeDonut} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                    dataKey="value" nameKey="name" stroke="none"
                    onClick={(entry) => entry?.name !== 'Others' && setFilters(prev => ({ ...prev, college: entry.name ?? 'All', program: 'All' }))}
                    label={false}>
                    {collegeDonut.map((entry, i) => (
                      <Cell key={i} fill={entry.color} style={{ cursor: 'pointer' }} />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {collegeDonut.filter(d => d.value > 0).map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs font-medium" style={{ color: '#7B6891' }}>{d.name}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#200D2D' }}>{d.value.toLocaleString()}</span>
                </div>
              ))}
              <p className="text-[10px] mt-2" style={{ color: '#BB96E4' }}>
                Select a college segment to drill down.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(187,150,228,0.1)' }}>
            <p className="text-xs font-bold" style={{ color: '#200D2D' }}>{totalStudents.toLocaleString()}</p>
            <p className="text-xs" style={{ color: '#7B6891' }}>Total Students</p>
          </div>
        </div>

        {/* First-Gen Milestone – Pie */}
        <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(32,13,45,0.06)' }}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#BB96E4' }}>Social Mobility</p>
              <p className="text-base font-bold mt-0.5" style={{ color: '#200D2D' }}>First-Gen Milestone</p>
            </div>
            <button onClick={() => navigate('admission-analytics')}
              className="text-[10px] font-medium px-3 py-1 rounded-full"
              style={{ background: 'rgba(187,150,228,0.1)', color: '#BB96E4' }}>
              View insight →
            </button>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div style={{ height: 200, width: 200, flexShrink: 0 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={firstGenPie} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                    dataKey="value" nameKey="name" stroke="none">
                    {firstGenPie.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#7B6891' }}>First in the Family</div>
              <div className="text-4xl font-bold" style={{ color: '#200D2D' }}>{fgPct}%</div>
              <div className="text-xs font-medium mt-0.5" style={{ color: '#BB96E4' }}>first-gen</div>
              <div className="text-2xl font-bold mt-2" style={{ color: '#200D2D' }}>{firstGen.toLocaleString()}</div>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#7B6891' }}>
                students advancing toward a university degree
              </p>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: 'rgba(187,150,228,0.15)', color: '#BB96E4' }}>
                  First-Gen {fgPct}%
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: 'rgba(255,219,237,0.4)', color: '#7B6891' }}>
                  Non–First-Gen {(100 - fgPct)}%
                </span>
              </div>
            </div>
          </div>
          {/* Ratio bar */}
          <div className="mt-4 h-2 rounded-full overflow-hidden"
            style={{ background: '#FFDBED' }}>
            <div className="h-full rounded-full" style={{ width: `${fgPct}%`, background: '#BB96E4' }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: '#BB96E4' }}>First gen {fgPct}%</span>
            <span className="text-[10px]" style={{ color: '#7B6891' }}>Non first gen {100 - fgPct}%</span>
          </div>
        </div>

        {/* Gender Breakdown – Grouped Bar */}
        <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(32,13,45,0.06)' }}>
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#BB96E4' }}>Demographics</p>
            <p className="text-base font-bold mt-0.5" style={{ color: '#200D2D' }}>Gender Disaggregated Distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={genderData} barGap={2} barCategoryGap="30%">
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(187,150,228,0.15)" />
              <XAxis dataKey="college" tick={{ fontSize: 11, fill: '#7B6891' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#7B6891' }} />
              <Bar dataKey="male"   name="Male"   fill="#BB96E4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female" name="Female" fill="#FFD066" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Faculty Ranks – Horizontal Bar */}
        <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(32,13,45,0.06)' }}>
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#BB96E4' }}>Faculty Profile</p>
            <p className="text-base font-bold mt-0.5" style={{ color: '#200D2D' }}>Faculty by Academic Rank</p>
          </div>
          <div className="space-y-4">
            {facultyRanks.map((r, i) => {
              const max = facultyRanks[0].count;
              const pct = max > 0 ? (r.count / max) * 100 : 0;
              const colors = ['#200D2D', '#BB96E4', '#FFD066', '#FFDBED'];
              return (
                <div key={r.rank} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: '#7B6891' }}>{r.rank}</span>
                    <span className="text-xs font-bold" style={{ color: '#200D2D' }}>{r.count}</span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(187,150,228,0.1)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: colors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl" style={{ background: 'rgba(187,150,228,0.08)' }}>
              <p className="text-lg font-bold" style={{ color: '#200D2D' }}>{fullTime}</p>
              <p className="text-[10px]" style={{ color: '#7B6891' }}>Full-Time</p>
            </div>
            <div className="p-2 rounded-xl" style={{ background: 'rgba(255,208,102,0.1)' }}>
              <p className="text-lg font-bold" style={{ color: '#200D2D' }}>{partTime}</p>
              <p className="text-[10px]" style={{ color: '#7B6891' }}>Part-Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Need insight banner */}
      <div className="rounded-2xl p-4 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, #200D2D, #3D1A55)', boxShadow: '0 2px 16px rgba(32,13,45,0.12)' }}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(187,150,228,0.2)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#BB96E4" strokeWidth="1.5"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#BB96E4" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#FFD066" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Need an insight?</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Ask the MIS analytics team</p>
        </div>
        <button onClick={() => navigate('report-generation')}
          className="ml-auto px-4 py-2 rounded-xl text-xs font-semibold"
          style={{ background: '#BB96E4', color: '#200D2D' }}>
          Generate Report →
        </button>
      </div>
    </div>
  );
}
