import { useApp } from '../../context/AppContext';

const KPIS = [
  ['12', 'Total System Users', '10 active · 1 frozen · 1 inactive'],
  ['10,000', 'Total Students', 'AY 2026–2027 · active enrollment'],
  ['320', 'Total Employees', 'Faculty and non-teaching personnel'],
  ['240', 'Total Faculty', '156 full-time · 84 part-time'],
  ['88.5%', 'Enrollment Rate', 'Admitted applicants who registered'],
  ['10', 'Academic Programs', 'Across 5 academic colleges'],
];
const PENDING = [
  ['VAL-2609-014', 'Enrollees_AY2026_Masterlist.csv', 'Registrar', '10,000'],
  ['VAL-2609-013', 'Faculty_Registry_S1.xlsx', 'Human Resources', '240'],
  ['VAL-2609-012', 'Admissions_Survey_2026.csv', 'Admissions', '8,420'],
];
const ACTIVITY = [
  ['10:14:02', 'admin_ruel', 'Validated student masterlist', 'DATA'],
  ['09:30:11', 'exec_vpaa', 'Exported certified KPI report', 'EXPORT'],
  ['08:12:05', 'mbarra', 'Account frozen after 3 OTP attempts', 'SECURITY'],
  ['07:45:22', 'admin_mis', 'Unlocked executive account', 'ACCOUNT'],
];

export default function AdminDashboard() {
  const { currentUser, navigate } = useApp();

  function handleQuickAction(action: string) {
    const destinations = {
      'Add User': 'user-management',
      'Add Student': 'institutional-data-students',
      'Add Employee': 'institutional-data-employees',
      'Validate Data': 'data-validation',
    } as const;
    navigate(destinations[action as keyof typeof destinations]);
  }

  return <div className="space-y-5">
    <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-obsidian p-6 text-white overflow-hidden relative">
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-lilac/10" />
      <div className="relative flex flex-wrap items-center gap-5">
        <span className="w-14 h-14 rounded-2xl bg-lilac text-primary flex items-center justify-center text-lg font-bold">{currentUser?.initials}</span>
        <div><p className="text-[10px] uppercase tracking-[.2em] font-bold text-lilac">Administrative command center</p><h2 className="text-xl font-bold mt-1">Good day, {currentUser?.name}</h2><p className="text-xs text-white/50 mt-1">Monitor institutional governance and resolve priority work.</p></div>
        <div className="sm:ml-auto"><p className="text-[10px] uppercase tracking-widest text-white/40">Last secure sign-in</p><p className="text-sm font-mono text-golden mt-1">09/26/2026 10:14:02</p><p className="text-[10px] font-mono text-white/30 mt-1">192.168.1.45 · Quezon City</p></div>
      </div>
      <div className="relative flex flex-wrap gap-2 mt-6">
        {['Add User', 'Add Student', 'Add Employee', 'Validate Data'].map(action => <button key={action} onClick={() => handleQuickAction(action)} className={`rounded-xl px-3 py-2 text-xs font-semibold ${action === 'Validate Data' ? 'bg-golden text-primary' : 'bg-white/10 text-white border border-white/10 hover:bg-white/15'}`}>{action === 'Validate Data' ? 'Review validation queue' : `+ ${action}`}</button>)}
      </div>
    </section>

    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {KPIS.map(([value, label, sub], i) => <div key={label} className={`rounded-2xl p-4 border ${i === 1 ? 'bg-golden border-golden' : i === 4 ? 'bg-lilac/20 border-lilac/30' : 'bg-white border-lilac/20'}`}><p className="text-[9px] uppercase tracking-widest font-bold text-muted">{label}</p><p className="text-2xl font-bold text-primary mt-2">{value}</p><p className="text-[10px] text-muted mt-1 leading-relaxed">{sub}</p></div>)}
    </div>

    <div className="grid xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,.65fr)] gap-5">
      <section className="rounded-3xl bg-white border border-lilac/20 shadow-sm overflow-hidden">
        <div className="p-5 flex justify-between items-center border-b border-lilac/15"><div><p className="font-bold text-primary">Pending data ingestions</p><p className="text-xs text-muted mt-1">Department uploads awaiting governance review.</p></div><span className="rounded-full px-2.5 py-1 bg-golden/25 text-obsidian text-[10px] font-bold">3 PENDING</span></div>
        <div className="overflow-x-auto"><table className="w-full text-xs"><thead className="bg-primary/[.03] text-muted"><tr>{['#', 'Dataset name', 'Originating department', 'Records', 'Action'].map(h => <th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{PENDING.map(row => <tr key={row[0]} className="border-t border-lilac/10 hover:bg-blossom/20"><td className="p-3 font-mono text-muted">{row[0]}</td><td className="p-3 font-semibold text-primary">{row[1]}</td><td className="p-3 text-muted">{row[2]}</td><td className="p-3 font-mono text-primary">{row[3]}</td><td className="p-3"><button onClick={() => navigate('data-validation')} className="rounded-lg px-3 py-1.5 bg-primary text-white font-semibold">Review</button></td></tr>)}</tbody></table></div>
        <button onClick={() => navigate('data-validation')} className="m-4 mt-2 text-xs font-semibold text-lilac">Open full validation queue →</button>
      </section>

      <section className="rounded-3xl bg-white border border-lilac/20 shadow-sm p-5">
        <div className="flex justify-between items-center"><div><p className="font-bold text-primary">Recent activity</p><p className="text-xs text-muted mt-1">Live administrative event stream</p></div><button onClick={() => navigate('audit-logs')} className="text-xs font-semibold text-lilac">View all</button></div>
        <div className="mt-5 space-y-4">{ACTIVITY.map(([time, actor, action, tag]) => <div key={time} className="flex gap-3"><div className="w-9 shrink-0 font-mono text-[10px] text-muted pt-0.5">{time}</div><span className="w-2 h-2 rounded-full bg-lilac mt-1.5 shrink-0" /><div className="min-w-0"><p className="text-xs text-primary"><strong>{actor}</strong> · {action}</p><span className="inline-block mt-1 rounded-full bg-lilac/10 px-2 py-0.5 text-[8px] font-bold text-muted">{tag}</span></div></div>)}</div>
      </section>
    </div>

  </div>;
}
