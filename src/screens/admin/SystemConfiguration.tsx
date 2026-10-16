import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const CONFIGS = [
  ['General Settings', 'System identity, university branding, locale, and global preferences.'],
  ['Academic Settings', 'Academic year calendar windows, semester rules, and term defaults.'],
  ['User & Role Settings', 'Permission matrix, role scope, session policy, and access controls.'],
  ['Notification Settings', 'Email alerts, lockout warnings, validation, and ingestion notices.'],
  ['Data & Validation Rules', 'Schema formats, required fields, reference codes, and parsing logic.'],
  ['System Maintenance', 'Database backup, diagnostics, archive retention, and log purging.'],
];

export default function SystemConfiguration() {
  const { showModal, showToast } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  function saveConfig() {
    showModal({
      title: `Save ${selected}`,
      message: 'Apply these configuration changes system-wide? This administrative action is written to the immutable activity log.',
      confirmLabel: 'Save Changes',
      onConfirm: () => {
        setSelected(null);
        showToast({ type: 'success', title: 'Configuration updated', body: `${selected} changes are now active.` });
      },
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[['9', 'System Modules Configured', 'All core services enabled'], ['10', 'Active User Accounts', '2 privileged administrators'], ['Online', 'System Status', 'All services operational'], ['09/26/2026 02:00:00', 'Last Backup', 'Verified automated snapshot']].map(([value, label, sub], i) => (
          <div key={label} className={`rounded-3xl p-5 ${i === 2 ? 'bg-primary text-white' : 'bg-white border border-lilac/20'}`}>
            <p className={`text-[10px] uppercase tracking-widest font-bold ${i === 2 ? 'text-lilac' : 'text-muted'}`}>{label}</p>
            <p className={`mt-3 font-bold ${value.length > 12 ? 'text-base font-mono' : 'text-2xl'} ${i === 2 ? 'text-golden' : 'text-primary'}`}>{value}</p>
            <p className={`text-xs mt-1 ${i === 2 ? 'text-white/60' : 'text-muted'}`}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_24rem] gap-5">
        <section>
          <div className="mb-3"><p className="font-bold text-primary">Configuration categories</p><p className="text-xs text-muted mt-1">Select a category to manage governed system parameters.</p></div>
          <div className="grid md:grid-cols-2 gap-4">
            {CONFIGS.map(([title, desc], i) => (
              <button key={title} onClick={() => setSelected(title)} className="rounded-3xl bg-white border border-lilac/20 p-5 text-left hover:border-lilac hover:-translate-y-0.5 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${i % 3 === 0 ? 'bg-lilac/20 text-primary' : i % 3 === 1 ? 'bg-golden/25 text-obsidian' : 'bg-blossom text-primary'}`}>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 .6 1.7 1.7 0 00-.4 1.1V21h-4v-.09A1.7 1.7 0 008.6 19.4a1.7 1.7 0 00-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-.6-1 1.7 1.7 0 00-1.1-.4H3v-4h.09A1.7 1.7 0 004.6 8.6a1.7 1.7 0 00-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-.6 1.7 1.7 0 00.4-1.1V3h4v.09A1.7 1.7 0 0015.4 4.6a1.7 1.7 0 001.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0019.4 9c.1.4.3.75.6 1 .3.25.7.4 1.1.4H21v4h-.09A1.7 1.7 0 0019.4 15z" stroke="currentColor" strokeWidth="1.2"/></svg>
                  </span>
                  <span className="text-lilac">→</span>
                </div>
                <p className="font-bold text-primary mt-4">{title}</p><p className="text-xs leading-relaxed text-muted mt-1">{desc}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-3xl bg-primary text-white p-5">
            <div className="flex justify-between items-center"><div><p className="font-bold">System overview</p><p className="text-xs text-white/50 mt-1">Live operational telemetry</p></div><span className="rounded-full bg-coa/20 text-golden px-2 py-1 text-[9px] font-bold">HEALTHY</span></div>
            <div className="space-y-3 mt-5">
              {[['Database', 'MySQL 8.0 CE · ONLINE'], ['Web Server', 'NGINX · ONLINE'], ['File Storage', '128 GB / 1 TB'], ['Last Backup', '09/26/2026 02:00:00'], ['System Uptime', '99.98%']].map(([label, value]) => <div key={label} className="flex justify-between gap-3 border-b border-white/10 pb-3"><span className="text-xs text-white/50">{label}</span><span className="text-xs font-semibold text-right">{value}</span></div>)}
            </div>
            <button onClick={() => showToast({ type: 'success', title: 'Diagnostics complete', body: 'Database, web server, storage, and mail services are healthy.' })} className="w-full mt-4 rounded-xl py-2.5 bg-lilac text-primary text-xs font-bold">Run health diagnostics</button>
          </section>
          <section className="rounded-3xl bg-white border border-lilac/20 p-5">
            <div className="flex justify-between"><p className="font-bold text-primary">Recent config activity</p><button onClick={() => showToast({ type: 'info', title: 'Configuration activity', body: 'Showing the complete immutable configuration history.' })} className="text-xs font-semibold text-lilac">View all</button></div>
            <div className="mt-4 space-y-4">{[['Academic Settings', '2 hours ago · admin_mis'], ['Notification Rules', 'Yesterday · admin_ruel'], ['System backup', 'Sep 24 · Automated']].map(([name, meta]) => <div key={name} className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-lilac" /><div><p className="text-xs font-semibold text-primary">{name}</p><p className="text-[10px] text-muted mt-0.5">{meta}</p></div></div>)}</div>
          </section>
        </div>
      </div>

      {selected && (
        <div className="modal-backdrop fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="modal-content w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <p className="text-lg font-bold text-primary">{selected}</p><p className="text-xs text-muted mt-1">Changes are versioned and logged to the audit trail.</p>
            <div className="space-y-4 mt-5">
              <label className="block"><span className="text-xs font-semibold text-primary">Configuration name</span><input defaultValue={selected} className="mt-1.5 w-full rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-sm text-primary outline-none" /></label>
              <label className="block"><span className="text-xs font-semibold text-primary">Operational mode</span><select className="mt-1.5 w-full rounded-xl border border-lilac/20 bg-surface px-3 py-2.5 text-sm text-primary outline-none"><option>Enabled · Enforced</option><option>Enabled · Monitor only</option><option>Disabled</option></select></label>
              <label className="flex items-center justify-between rounded-2xl bg-lilac/10 p-3"><span><span className="block text-xs font-semibold text-primary">Administrator notifications</span><span className="block text-[10px] text-muted">Email MIS leads when this configuration changes.</span></span><input type="checkbox" defaultChecked className="accent-primary" /></label>
            </div>
            <div className="flex gap-3 mt-6"><button onClick={() => setSelected(null)} className="flex-1 rounded-xl py-2.5 bg-primary/5 text-primary text-sm font-semibold">Cancel</button><button onClick={saveConfig} className="flex-1 rounded-xl py-2.5 bg-primary text-white text-sm font-semibold">Review & Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
