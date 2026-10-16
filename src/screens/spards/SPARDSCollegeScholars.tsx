import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import ChartModal from '../../components/ChartModal';

const COLLEGE_INFO: Record<string, { name: string; color: string; depts: Dept[] }> = {
  CCS: {
    name: 'College of Computer Studies',
    color: '#333333',
    depts: [
      { code: 'IT-DEPT', name: 'Information Technology', chair: 'Prof. M. Santos', scholars: 1224, coverage: 68.0, avgGpa: 1.62, status: 'Active' },
      { code: 'CS-DEPT', name: 'Computer Science', chair: 'Dr. R. Reyes', scholars: 680, coverage: 68.0, avgGpa: 1.55, status: 'Active' },
      { code: 'IS-DEPT', name: 'Information Systems', chair: 'Prof. A. Cruz', scholars: 476, coverage: 68.0, avgGpa: 1.70, status: 'Active' },
    ],
  },
  COE: {
    name: 'College of Engineering',
    color: '#FF6B00',
    depts: [
      { code: 'EE-DEPT', name: 'Electrical Engineering', chair: 'Engr. P. Lagman', scholars: 884, coverage: 68.0, avgGpa: 1.71, status: 'Active' },
      { code: 'IE-DEPT', name: 'Industrial Engineering', chair: 'Engr. M. Dela Rosa', scholars: 816, coverage: 68.0, avgGpa: 1.68, status: 'Active' },
    ],
  },
  COB: {
    name: 'College of Business',
    color: '#FFC700',
    depts: [
      { code: 'BA-DEPT', name: 'Business Administration', chair: 'Dr. C. Torres', scholars: 952, coverage: 68.0, avgGpa: 1.80, status: 'Active' },
      { code: 'ENT-DEPT', name: 'Entrepreneurship', chair: 'Prof. L. Bernardo', scholars: 408, coverage: 68.0, avgGpa: 1.85, status: 'Under Review' },
    ],
  },
  COA: {
    name: 'College of Accountancy',
    color: '#00875A',
    depts: [
      { code: 'ACC-DEPT', name: 'Accountancy', chair: 'Dr. P. Lim', scholars: 816, coverage: 68.0, avgGpa: 1.62, status: 'Active' },
    ],
  },
  COED: {
    name: 'College of Education',
    color: '#0052CC',
    depts: [
      { code: 'ECED-DEPT', name: 'Early Childhood Education', chair: 'Dr. L. Ramos', scholars: 340, coverage: 68.0, avgGpa: 1.76, status: 'Active' },
      { code: 'SEC-DEPT', name: 'Secondary Education', chair: 'Prof. R. Magno', scholars: 204, coverage: 68.0, avgGpa: 1.82, status: 'Active' },
    ],
  },
};

interface Dept {
  code: string;
  name: string;
  chair: string;
  scholars: number;
  coverage: number;
  avgGpa: number;
  status: 'Active' | 'Under Review';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-lilac/20 rounded-xl px-4 py-3 shadow-xl text-xs">
      {label && <p className="font-bold text-primary mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill ?? '#200D2D' }}>{p.name}: <strong>{p.value.toLocaleString()}</strong></p>
      ))}
    </div>
  );
};

const PROGRAMS_MAP: Record<string, string[]> = {
  CCS: ['BSIT', 'BSIS', 'BSCS'], COA: ['BSA', 'BSMA'],
  COB: ['BSE', 'MSENT'], COE: ['BSEE', 'BSIE'], COED: ['BECED'],
};

export default function SPARDSCollegeScholars({ college }: { college: string }) {
  const { showToast, showModal } = useApp();
  const info = COLLEGE_INFO[college];
  const [search, setSearch] = useState('');
  const [ay, setAy] = useState('All');
  const [program, setProgram] = useState('All');
  const [grantFilter, setGrantFilter] = useState('All');
  const [chartModal, setChartModal] = useState<{ title: string; description: string; chart: React.ReactNode; legend?: { label: string; color: string }[]; insights?: string[] } | null>(null);

  const programOpts = useMemo(() => ['All', ...(PROGRAMS_MAP[college] ?? [])], [college]);

  if (!info) return <div className="text-muted p-8 text-center">College data not found.</div>;

  const filtered = info.depts.filter(d => {
    const q = search.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.chair.toLowerCase().includes(q);
  });

  const totalScholars = info.depts.reduce((s, d) => s + d.scholars, 0);
  const avgGpa = (info.depts.reduce((s, d) => s + d.avgGpa, 0) / info.depts.length).toFixed(2);

  function handleViewRoster(d: Dept) {
    showModal({
      title: `${d.name} Scholar Roster`,
      message: `Department: ${d.name}\nDept Chair: ${d.chair}\nTotal Scholars: ${d.scholars.toLocaleString()}\nCoverage: ${d.coverage}%\nAverage GPA: ${d.avgGpa.toFixed(2)}\nStatus: ${d.status}\n\nIn production, this would filter the Scholar Records table to show only ${d.code} scholars.`,
      confirmLabel: 'View Records',
      onConfirm: () => showToast({ type: 'info', title: `${d.code} Roster`, body: `Filtering to ${d.scholars.toLocaleString()} scholars.` }),
    });
  }

  const chartData = info.depts.map(d => ({ name: d.code, scholars: d.scholars }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl p-5 flex items-center gap-5" style={{ background: `${info.color}10`, border: `1px solid ${info.color}30` }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ background: info.color }}>
          {college}
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-primary">{info.name}</p>
          <p className="text-xs text-muted mt-0.5">Scholarship Coverage & Department Summary Matrix</p>
        </div>
        <button onClick={() => showToast({ type: 'success', title: 'Report Exported', body: `${college} scholarship data exported.` })}
          className="rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">Export</button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Total Scholars</p>
          <p className="text-3xl font-extrabold text-primary mt-1">{totalScholars.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Departments</p>
          <p className="text-3xl font-extrabold mt-1" style={{ color: info.color }}>{info.depts.length}</p>
        </div>
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Avg Coverage</p>
          <p className="text-3xl font-extrabold text-primary mt-1">68.0%</p>
        </div>
        <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">College Avg GPA</p>
          <p className="text-3xl font-extrabold text-coa mt-1">{avgGpa}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-4 flex flex-wrap gap-4 items-end">
        <div className="flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-lilac"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span className="text-[9px] font-bold uppercase tracking-widest text-lilac">Filters</span>
        </div>
        {[
          { label: 'Academic Year', value: ay, options: ['All', '2024–2025', '2025–2026', '2026–2027'], onChange: setAy },
          { label: 'Program', value: program, options: programOpts, onChange: setProgram },
          { label: 'Grant Type', value: grantFilter, options: ['All', 'QCYDO', 'UNIFAST/TES', 'CHED', 'Academic', 'LGU/Private'], onChange: setGrantFilter },
        ].map(f => (
          <div key={f.label} className="flex flex-col gap-0.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted">{f.label}</label>
            <select value={f.value} onChange={e => f.onChange(e.target.value)}
              className="rounded-xl border border-lilac/20 bg-white px-3 py-1.5 text-xs font-medium text-primary hover:border-lilac focus:outline-none cursor-pointer" style={{ minWidth: 90 }}>
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <button onClick={() => showToast({ type: 'success', title: 'Exported', body: `${college} scholarship data exported.` })}
          className="ml-auto flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Export All
        </button>
      </div>

      {/* Chart */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <p className="text-sm font-bold text-primary">Scholar Distribution by Department</p>
          <div className="flex gap-2">
            <button onClick={() => setChartModal({
              title: `${college} Scholar Distribution by Department`,
              description: `Detailed view of scholarship headcounts across ${info.name} departments. Use the filter bar to adjust by Academic Year, Program, or Grant Type.`,
              chart: (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#7B6891' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#7B6891' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="scholars" name="Scholars" radius={[8, 8, 0, 0]} fill={info.color} />
                  </BarChart>
                </ResponsiveContainer>
              ),
              legend: info.depts.map(d => ({ label: d.name, color: info.color })),
              insights: info.depts.map(d => `${d.code} (${d.name}): ${d.scholars.toLocaleString()} scholars, Avg GPA ${d.avgGpa.toFixed(2)}, Coverage ${d.coverage}%`),
            })}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold bg-lilac/10 text-primary hover:bg-lilac/20 transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/></svg>
              View Chart
            </button>
            <button onClick={() => showToast({ type: 'success', title: 'Chart Exported', body: `${college} distribution chart exported.` })}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold bg-golden/15 text-primary hover:bg-golden/30 transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Export
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2D9EF" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7B6891' }} />
            <YAxis tick={{ fontSize: 10, fill: '#7B6891' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="scholars" name="Scholars" radius={[6, 6, 0, 0]} fill={info.color} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Department summary matrix */}
      <div className="rounded-2xl bg-white border border-lilac/15 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-lilac/10 flex items-center gap-4 flex-wrap">
          <p className="text-sm font-bold text-primary">Departmental Scholarship Summary Matrix</p>
          <div className="relative ml-auto">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search department…"
              className="rounded-xl border border-lilac/20 bg-surface pl-8 pr-3 py-2 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-lilac/30 w-48" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface border-b border-lilac/10">
                <th className="px-4 py-3 text-left font-semibold text-muted">Dept Code</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Department</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Dept Chair</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Scholars</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Coverage %</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Avg GPA</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.code} className="border-b border-lilac/5 hover:bg-surface transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary">{d.code}</td>
                  <td className="px-4 py-3 font-medium text-primary">{d.name}</td>
                  <td className="px-4 py-3 text-muted">{d.chair}</td>
                  <td className="px-4 py-3 font-bold text-primary">{d.scholars.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden w-16">
                        <div className="h-full rounded-full" style={{ width: `${d.coverage}%`, background: info.color }} />
                      </div>
                      <span className="font-semibold text-primary">{d.coverage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-coa">{d.avgGpa.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${d.status === 'Active' ? 'bg-coa/10 text-coa' : 'bg-golden/20 text-amber-700'}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button title="View Roster" onClick={() => handleViewRoster(d)}
                      className="relative group rounded-xl px-3 py-1.5 text-[11px] font-semibold bg-lilac/10 text-primary hover:bg-lilac/20 transition-colors flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/></svg>
                      View Roster
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Expanded Chart Modal ── */}
      {chartModal && (
        <ChartModal
          title={chartModal.title}
          description={chartModal.description}
          chart={chartModal.chart}
          legend={chartModal.legend}
          insights={chartModal.insights}
          onClose={() => setChartModal(null)}
          onExport={() => { showToast({ type: 'success', title: 'Chart Exported', body: `${chartModal.title} exported.` }); setChartModal(null); }}
        />
      )}
    </div>
  );
}
