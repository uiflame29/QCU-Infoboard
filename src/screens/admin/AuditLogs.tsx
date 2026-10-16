import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AUDIT_LOGS } from '../../data/mockData';

const ACTION_COLORS: Record<string, { bg: string; text: string }> = {
  COMMIT_DATA_INGESTION: { bg: 'rgba(0,135,90,0.1)', text: '#00875A' },
  EXPORT_PDF_REPORT:     { bg: 'rgba(187,150,228,0.12)', text: '#7B3FCC' },
  EXPORT_EXCEL_REPORT:   { bg: 'rgba(187,150,228,0.12)', text: '#7B3FCC' },
  ACCOUNT_LOCKED_3X:     { bg: 'rgba(76,20,19,0.1)', text: '#C0392B' },
  LOGIN_SUCCESS:         { bg: 'rgba(255,208,102,0.12)', text: '#B07800' },
  LOGIN_FAILED:          { bg: 'rgba(192,57,43,0.1)', text: '#C0392B' },
  USER_PROFILE_EDITED:   { bg: 'rgba(32,13,45,0.06)', text: '#200D2D' },
  DATA_FILTER_APPLIED:   { bg: 'rgba(187,150,228,0.08)', text: '#7B6891' },
};

const KPI_FILTERS = [
  { label: 'Total Logins Today', value: '42', key: 'LOGIN',   color: '#FFD066' },
  { label: 'Failed OTP Alerts',  value: '3',  key: 'LOCKED',  color: '#C0392B' },
  { label: 'Data Ingestions',    value: '2',  key: 'INGESTION', color: '#00875A' },
  { label: 'Certified Exports',  value: '14', key: 'EXPORT',  color: '#BB96E4' },
];

export default function AuditLogs() {
  const { showToast } = useApp();
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('09/01/2026');
  const [dateTo,   setDateTo]   = useState('09/24/2026');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState('All Modules');

  function filterLogs() {
    return AUDIT_LOGS.filter(log => {
      const matchSearch = !search ||
        log.actor.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.entity.toLowerCase().includes(search.toLowerCase()) ||
        log.ip.includes(search);
      const matchFilter = !activeFilter ||
        (activeFilter === 'LOGIN'     && log.action.includes('LOGIN')) ||
        (activeFilter === 'LOCKED'    && log.action.includes('LOCKED')) ||
        (activeFilter === 'INGESTION' && log.action.includes('INGEST')) ||
        (activeFilter === 'EXPORT'    && log.action.includes('EXPORT'));
      const module = log.action.includes('LOGIN') || log.action.includes('LOCKED') ? 'Authentication'
        : log.action.includes('INGEST') ? 'Data Validation'
        : log.action.includes('EXPORT') ? 'Reports'
        : log.action.includes('USER') ? 'User Management' : 'Analytics';
      return matchSearch && matchFilter && (moduleFilter === 'All Modules' || moduleFilter === module);
    });
  }

  const logs = filterLogs();

  return (
    <div className="space-y-5">
      {/* Date range + search */}
      <div className="bg-white rounded-2xl p-4 flex flex-wrap items-end gap-4"
        style={{ boxShadow: '0 2px 12px rgba(32,13,45,0.05)', border: '1px solid rgba(187,150,228,0.15)' }}>
        <div className="flex items-center gap-3">
          {[
            { label: 'From', value: dateFrom, setter: setDateFrom },
            { label: 'To',   value: dateTo,   setter: setDateTo },
          ].map(f => (
            <div key={f.label} className="flex flex-col gap-0.5">
              <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#7B6891' }}>
                Date {f.label}
              </label>
              <input
                className="px-3 py-1.5 rounded-lg text-xs font-mono outline-none"
                style={{ background: 'rgba(32,13,45,0.04)', border: '1.5px solid rgba(32,13,45,0.1)', color: '#200D2D', width: 120 }}
                value={f.value}
                onChange={e => f.setter(e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-0.5">
          <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#7B6891' }}>Module</label>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs outline-none"
            style={{ background: 'rgba(32,13,45,0.04)', border: '1.5px solid rgba(32,13,45,0.1)', color: '#200D2D' }}>
            {['All Modules', 'Authentication', 'Data Validation', 'Reports', 'User Management', 'Analytics'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ color: '#7B6891' }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs outline-none"
            style={{ background: 'rgba(32,13,45,0.04)', border: '1.5px solid rgba(32,13,45,0.1)', color: '#200D2D' }}
            placeholder="Filter logs by actor, action, IP address…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => showToast({ type: 'success', title: 'Audit Logs Exported', body: 'CSV file downloaded.' })}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
          style={{ background: '#200D2D', color: '#FFFFFF' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Export CSV
        </button>
      </div>

      {/* KPI filter cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_FILTERS.map(k => (
          <button key={k.key}
            onClick={() => setActiveFilter(activeFilter === k.key ? null : k.key)}
            className="rounded-2xl p-4 text-left bg-white"
            style={{
              boxShadow: '0 2px 12px rgba(32,13,45,0.05)',
              border: `1.5px solid ${activeFilter === k.key ? k.color : 'rgba(187,150,228,0.15)'}`,
              background: activeFilter === k.key ? `${k.color}08` : '#FFFFFF',
            }}>
            <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: k.color }}>{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: '#200D2D' }}>{k.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#7B6891' }}>
              {k.key === 'LOGIN' ? 'Login events' : k.key === 'LOCKED' ? 'Locked accounts' : k.key === 'INGESTION' ? 'Files committed' : 'PDF reports'}
            </p>
          </button>
        ))}
      </div>

      {/* Audit trail table */}
      <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: '0 2px 16px rgba(32,13,45,0.06)' }}>
        <div className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1.5px solid rgba(187,150,228,0.12)' }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#200D2D' }}>Chronological System Audit Trail</p>
            <p className="text-xs mt-0.5" style={{ color: '#7B6891' }}>
              {logs.length} event{logs.length !== 1 ? 's' : ''} {activeFilter ? `· filtered by "${activeFilter}"` : ''}
            </p>
          </div>
          {activeFilter && (
            <button onClick={() => setActiveFilter(null)}
              className="text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(187,150,228,0.1)', color: '#BB96E4' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Clear filter
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead style={{ background: 'rgba(32,13,45,0.02)' }}>
              <tr style={{ borderBottom: '1px solid rgba(187,150,228,0.12)' }}>
                {['#', 'Exact Timestamp', 'User Email', 'Account Actor', 'Role', 'Module Impacted', 'Event Action & Description', 'Source IP'].map(h => (
                  <th key={h} className="py-3 px-4 text-left font-semibold" style={{ color: '#7B6891' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => {
                const actionStyle = ACTION_COLORS[log.action] ?? { bg: 'rgba(32,13,45,0.05)', text: '#200D2D' };
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(187,150,228,0.06)' }}
                    className="hover:bg-[rgba(187,150,228,0.03)]">
                    <td className="py-3 px-4 font-mono" style={{ color: '#7B6891' }}>{String(i + 1).padStart(2, '0')}</td>
                    <td className="py-3 px-4 font-mono whitespace-nowrap" style={{ color: '#7B6891' }}>
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4" style={{ color: '#7B6891' }}>{log.actor.includes('admin') ? `${log.actor}@qcu.edu.ph` : `${log.actor.replace('exec_', '')}@qcu.edu.ph`}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold" style={{ color: '#200D2D' }}>{log.actor}</span>
                    </td>
                    <td className="py-3 px-4" style={{ color: '#7B6891' }}>{log.actor.includes('admin') ? 'SysAdmin' : 'Executive'}</td>
                    <td className="py-3 px-4" style={{ color: '#7B6891' }}>{log.action.includes('LOGIN') || log.action.includes('LOCKED') ? 'Authentication' : log.action.includes('INGEST') ? 'Data Validation' : log.action.includes('EXPORT') ? 'Reports' : log.action.includes('USER') ? 'User Management' : 'Analytics'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono whitespace-nowrap"
                        style={{ background: actionStyle.bg, color: actionStyle.text }}>
                        {log.action}
                      </span>
                      <span className="block mt-1" style={{ color: '#7B6891' }}>{log.entity}</span>
                    </td>
                    <td className="py-3 px-4 font-mono" style={{ color: '#7B6891' }}>{log.ip}</td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs" style={{ color: '#7B6891' }}>
                    No log entries match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutability notice */}
      <div className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'rgba(32,13,45,0.03)', border: '1px solid rgba(187,150,228,0.15)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#BB96E4', flexShrink: 0 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <p className="text-xs" style={{ color: '#7B6891' }}>
          Audit records are <strong style={{ color: '#200D2D' }}>immutable</strong> and tamper-proof. All system events are logged chronologically in compliance with Data Privacy Act regulations.
        </p>
      </div>
    </div>
  );
}
