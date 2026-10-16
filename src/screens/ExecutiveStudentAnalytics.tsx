import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../context/AppContext';
import { getAgeData, getCapacityData, getGeoData, getTotalStudents } from '../data/mockData';

const tooltipStyle = {
  borderRadius: 14,
  border: '1px solid rgba(187,150,228,.3)',
  boxShadow: '0 10px 30px rgba(32,13,45,.12)',
  fontSize: 11,
};

function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: 'dark' | 'lilac' | 'gold' }) {
  const colors = {
    dark: 'border-primary bg-primary text-white',
    lilac: 'border-lilac bg-lilac/70 text-primary',
    gold: 'border-golden bg-golden/70 text-primary',
  };
  return (
    <div className={`rounded-3xl border p-5 shadow-sm transition-transform hover:-translate-y-0.5 ${colors[tone]}`}>
      <p className={`text-[9px] font-bold uppercase tracking-widest ${tone === 'dark' ? 'text-lilac' : 'text-muted'}`}>{label}</p>
      <p className={`mt-3 text-3xl font-bold ${tone === 'dark' ? 'text-golden' : ''}`}>{value}</p>
      <p className={`mt-1 text-[10px] ${tone === 'dark' ? 'text-white/55' : 'text-muted'}`}>{detail}</p>
    </div>
  );
}

function ChartCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
      <p className="text-[9px] font-bold uppercase tracking-widest text-lilac">{eyebrow}</p>
      <p className="mt-1 text-sm font-bold text-primary">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ExecutiveStudentAnalytics() {
  const { filters, setFilters, showToast } = useApp();
  const total = getTotalStudents(filters);
  const geoData = getGeoData(filters);
  const ageData = getAgeData(filters);
  const capacityData = getCapacityData(filters);
  const largestProgram = capacityData.reduce((largest, row) => row.enrolled > largest.enrolled ? row : largest, capacityData[0]);
  const utilization = capacityData.length
    ? Math.round((capacityData.reduce((sum, row) => sum + row.enrolled, 0) / capacityData.reduce((sum, row) => sum + row.capacity, 0)) * 1000) / 10
    : 0;

  function inspectProgram(program: string, college: string) {
    setFilters(previous => ({ ...previous, college, program }));
    showToast({ type: 'info', title: `${program} detail view applied`, body: 'All executive analytics now reflect this program scope.' });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Largest Academic Program" value={largestProgram?.program ?? '—'} detail={`${(largestProgram?.enrolled ?? 0).toLocaleString()} enrollees in current scope`} tone="dark" />
        <MetricCard label="Top Female-Majority Program" value="BECEd" detail="75.0% female enrollment" tone="lilac" />
        <MetricCard label="Classroom Capacity Utilization" value={`${utilization}%`} detail={`${total.toLocaleString()} students in active scope`} tone="gold" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard eyebrow="Geographic profile" title="Student Geographic Origin">
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={geoData} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} stroke="rgba(187,150,228,.15)" />
              <XAxis type="number" tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="district" type="category" width={92} tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="students" name="Students" fill="#BB96E4" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard eyebrow="Demographic profile" title="Age Range & Civil Status">
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={ageData}>
              <CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" />
              <XAxis dataKey="age" tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="single" name="Single" stackId="civil" fill="#BB96E4" />
              <Bar dataKey="married" name="Married" stackId="civil" fill="#FFD066" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="overflow-hidden rounded-3xl border border-lilac/20 bg-white shadow-sm">
        <div className="border-b border-lilac/15 p-5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Academic portfolio</p>
          <p className="mt-1 text-sm font-bold text-primary">Program Enrollees & Capacity Utilization</p>
          <p className="mt-1 text-[10px] text-muted">Select a program row to apply it as the active executive scope.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-primary/[.03] text-muted">
              <tr>{['Program', 'College', 'Enrolled', 'Capacity', 'Utilization'].map(header => <th key={header} className="p-3 text-left font-semibold">{header}</th>)}</tr>
            </thead>
            <tbody>
              {capacityData.map(row => {
                const percent = Math.round((row.enrolled / row.capacity) * 100);
                return (
                  <tr key={row.program} onClick={() => inspectProgram(row.program, row.college)} className="cursor-pointer border-t border-lilac/10 hover:bg-blossom/20">
                    <td className="p-3 font-bold text-primary">{row.program}</td>
                    <td className="p-3 text-muted">{row.college}</td>
                    <td className="p-3 text-primary">{row.enrolled.toLocaleString()}</td>
                    <td className="p-3 text-muted">{row.capacity.toLocaleString()}</td>
                    <td className="min-w-48 p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-lilac/10">
                          <div className="h-full rounded-full bg-lilac transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-9 font-bold text-primary">{percent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!capacityData.length && <div className="p-10 text-center text-sm text-muted">No programs match the active scope.</div>}
      </section>
    </div>
  );
}
