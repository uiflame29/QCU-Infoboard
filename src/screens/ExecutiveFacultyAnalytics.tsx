import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../context/AppContext';
import { getFacultyData, getFacultyDonutData, getFacultyGenderData, getQualificationData, getTotalStudents } from '../data/mockData';

const tooltipStyle = {
  borderRadius: 14,
  border: '1px solid rgba(187,150,228,.3)',
  boxShadow: '0 10px 30px rgba(32,13,45,.12)',
  fontSize: 11,
};

function ChartCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm"><p className="text-[9px] font-bold uppercase tracking-widest text-lilac">{eyebrow}</p><p className="mt-1 text-sm font-bold text-primary">{title}</p><div className="mt-4">{children}</div></section>;
}

export default function ExecutiveFacultyAnalytics() {
  const { filters, setFilters } = useApp();
  const { fullTime, partTime } = getFacultyData(filters);
  const facultyTotal = fullTime + partTime;
  const ratio = Math.round((getTotalStudents(filters) / Math.max(facultyTotal, 1)) * 10) / 10;
  const facultyDistribution = getFacultyDonutData(filters);
  const demographicRows = getFacultyGenderData(filters);
  const demographicData = [
    { status: 'Single', male: demographicRows.find(row => row.status === 'Single Male')?.count ?? 0, female: demographicRows.find(row => row.status === 'Single Female')?.count ?? 0 },
    { status: 'Married', male: demographicRows.find(row => row.status === 'Married Male')?.count ?? 0, female: demographicRows.find(row => row.status === 'Married Female')?.count ?? 0 },
  ];
  const qualifications = getQualificationData(filters);
  const qualified = qualifications.reduce((sum, row) => sum + row.masters + row.phd, 0);
  const allQualifications = qualifications.reduce((sum, row) => sum + row.bachelors + row.masters + row.phd, 0);
  const qualificationRate = Math.round((qualified / Math.max(allQualifications, 1)) * 1000) / 10;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Overall Student-to-Faculty Ratio', `${ratio} : 1`, 'Students per active faculty member', 'border-primary bg-primary text-white'],
          ["Master's / Ph.D. Qualification Rate", `${qualificationRate}%`, 'Faculty with graduate qualifications', 'border-lilac bg-lilac/70 text-primary'],
          ['Full-Time vs. Part-Time Split', `${fullTime} / ${partTime}`, `${Math.round(fullTime / Math.max(facultyTotal, 1) * 100)}% Full-Time`, 'border-golden bg-golden/70 text-primary'],
        ].map(([label, value, detail, classes], index) => (
          <div key={label} className={`rounded-3xl border p-5 shadow-sm transition-transform hover:-translate-y-0.5 ${classes}`}>
            <p className={`text-[9px] font-bold uppercase tracking-widest ${index === 0 ? 'text-lilac' : 'text-muted'}`}>{label}</p>
            <p className={`mt-3 text-3xl font-bold ${index === 0 ? 'text-golden' : ''}`}>{value}</p>
            <p className={`mt-1 text-[10px] ${index === 0 ? 'text-white/55' : 'text-muted'}`}>{detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard eyebrow="Workforce allocation" title="Faculty Distribution by Department">
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie data={facultyDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} onClick={entry => setFilters(previous => ({ ...previous, college: entry.name ?? 'All', program: 'All' }))}>
                {facultyDistribution.map(row => <Cell key={row.name} fill={row.color} className="cursor-pointer" />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard eyebrow="Workforce demographics" title="Gender & Marital Status Breakdown">
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={demographicData}>
              <CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" />
              <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="male" name="Male" fill="#BB96E4" radius={[5, 5, 0, 0]} />
              <Bar dataKey="female" name="Female" fill="#FFD066" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard eyebrow="Professional background" title="Academic Qualifications & Attainment">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={qualifications}>
            <CartesianGrid vertical={false} stroke="rgba(187,150,228,.15)" />
            <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#7B6891' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#7B6891' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" iconSize={8} />
            <Bar dataKey="bachelors" name="Bachelor's" stackId="degree" fill="#FFDBED" />
            <Bar dataKey="masters" name="Master's" stackId="degree" fill="#BB96E4" />
            <Bar dataKey="phd" name="Ph.D." stackId="degree" fill="#200D2D" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
