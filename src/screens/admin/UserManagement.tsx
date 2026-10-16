import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { AppUser } from '../../types';
import { MOCK_USERS } from '../../data/mockData';

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'badge-active', FROZEN: 'badge-frozen', DEACTIVATED: 'badge-deact',
};
const ROLE_LABEL: Record<string, string> = {
  executive: 'University Executive', admin: 'System Administrator',
};

export default function UserManagement() {
  const { showModal, showToast } = useApp();
  const [users, setUsers] = useState<AppUser[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | AppUser['status']>('ALL');

  const filtered = users.filter(u => (statusFilter === 'ALL' || u.status === statusFilter) && (
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  ));

  function handleUnlock(u: AppUser) {
    showModal({
      title: 'Unlock Account',
      message: `Unlock account for ${u.name} (${u.username})? The failed attempt counter will be reset and a password reset link will be sent to ${u.email}.`,
      confirmLabel: 'Unlock Account',
      onConfirm: () => {
        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: 'ACTIVE', failedAttempts: 0 } : x));
        showToast({ type: 'success', title: 'Account Unlocked', body: `${u.name} can now sign in. Password reset email sent.` });
      },
    });
  }

  function handleFreeze(u: AppUser) {
    showModal({
      title: 'Freeze Account',
      message: `Freeze account for ${u.name}? They will be unable to log in until unlocked.`,
      confirmLabel: 'Freeze Account',
      variant: 'danger',
      onConfirm: () => {
        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: 'FROZEN' } : x));
        showToast({ type: 'warning', title: 'Account Frozen', body: `${u.name}'s access has been suspended.` });
      },
    });
  }

  function handleDeactivate(u: AppUser) {
    showModal({
      title: 'Deactivate Account',
      message: `Permanently deactivate ${u.name}? This removes their system access. This action can be reversed.`,
      confirmLabel: 'Deactivate',
      variant: 'danger',
      onConfirm: () => {
        setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: 'DEACTIVATED' } : x));
        showToast({ type: 'error', title: 'Account Deactivated', body: `${u.name} has been deactivated.` });
      },
    });
  }

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#7B6891' }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: '#FFFFFF', border: '1.5px solid rgba(187,150,228,0.2)', color: '#200D2D' }}
            placeholder="Search user name, email, or role…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: '#200D2D', color: '#FFFFFF' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Add User
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', key: 'ALL' as const, count: users.length, color: '#200D2D' },
          { label: 'Active', key: 'ACTIVE' as const, count: users.filter(u => u.status === 'ACTIVE').length, color: '#00875A' },
          { label: 'Frozen', key: 'FROZEN' as const, count: users.filter(u => u.status === 'FROZEN').length, color: '#C0392B' },
          { label: 'Deactivated / Inactive', key: 'DEACTIVATED' as const, count: users.filter(u => u.status === 'DEACTIVATED').length, color: '#7B6891' },
        ].map(s => (
          <button key={s.label} onClick={() => setStatusFilter(s.key)}
            className="p-4 rounded-2xl text-xs bg-white text-left"
            style={{ boxShadow: '0 1px 8px rgba(32,13,45,0.05)', border: `1.5px solid ${statusFilter === s.key ? s.color : 'rgba(187,150,228,0.15)'}` }}>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: s.color }} /><span style={{ color: '#7B6891' }}>{s.label}</span></span>
            <span className="block mt-2 text-2xl font-bold" style={{ color: '#200D2D' }}>{s.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: '0 2px 16px rgba(32,13,45,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead style={{ background: 'rgba(32,13,45,0.03)' }}>
              <tr style={{ borderBottom: '1.5px solid rgba(187,150,228,0.15)' }}>
                {['#', 'Role', 'Full Name', 'Username', 'Email', 'Status', 'Date Created', 'Last Log In', 'Attempts', 'Actions'].map(h => (
                  <th key={h} className="py-3 px-4 text-left font-semibold" style={{ color: '#7B6891' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, index) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(187,150,228,0.08)' }}
                  className="hover:bg-[rgba(187,150,228,0.03)]">
                  <td className="py-3.5 px-4 font-mono" style={{ color: '#7B6891' }}>{String(index + 1).padStart(2, '0')}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
                      style={{ background: u.role === 'admin' ? 'rgba(255,208,102,0.15)' : 'rgba(187,150,228,0.15)', color: u.role === 'admin' ? '#B07800' : '#7B3FCC' }}>
                      {ROLE_LABEL[u.role]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: '#BB96E4', color: '#200D2D' }}>
                        {u.initials}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: '#200D2D' }}>{u.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium" style={{ color: '#200D2D' }}>
                    {u.username}
                  </td>
                  <td className="py-3.5 px-4" style={{ color: '#7B6891' }}>{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[u.status]}`}>
                      {u.status === 'FROZEN' ? `FROZEN (${u.failedAttempts}x)` : u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono whitespace-nowrap" style={{ color: '#7B6891' }}>08/{String(10 + Number(u.id)).padStart(2, '0')}/2026</td>
                  <td className="py-3.5 px-4 font-mono whitespace-nowrap" style={{ color: '#7B6891' }}>{u.status === 'DEACTIVATED' ? '09/02/2026 14:22:10' : '09/26/2026 08:14:02'}</td>
                  <td className="py-3.5 px-4 font-mono" style={{ color: u.failedAttempts > 0 ? '#C0392B' : '#7B6891' }}>
                    {u.failedAttempts}/3
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {u.status === 'FROZEN' ? (
                        <button onClick={() => handleUnlock(u)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                          style={{ background: 'rgba(0,135,90,0.1)', color: '#00875A', border: '1px solid rgba(0,135,90,0.3)' }}>
                          UNLOCK USER
                        </button>
                      ) : u.status === 'ACTIVE' ? (
                        <>
                          <button className="px-2.5 py-1 rounded-lg text-[10px] font-medium"
                            style={{ background: 'rgba(187,150,228,0.1)', color: '#7B3FCC' }}
                            onClick={() => showToast({ type: 'info', title: 'Edit Profile', body: `Opening editor for ${u.name}` })}>
                            Edit
                          </button>
                          <button onClick={() => handleFreeze(u)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-medium"
                            style={{ background: 'rgba(76,20,19,0.08)', color: '#C0392B' }}>
                            Freeze
                          </button>
                          <button onClick={() => handleDeactivate(u)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-medium"
                            style={{ background: 'rgba(32,13,45,0.06)', color: '#7B6891' }}>
                            Deactivate
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleUnlock(u)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-medium"
                          style={{ background: 'rgba(0,135,90,0.08)', color: '#00875A' }}>
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs" style={{ color: '#7B6891', borderTop: '1px solid rgba(187,150,228,0.1)' }}>
          Showing {filtered.length}/{users.length} of users
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-backdrop fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ background: 'rgba(32,13,45,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowAddModal(false)}>
          <div className="modal-content w-full max-w-md rounded-3xl p-6 bg-white"
            style={{ boxShadow: '0 24px 80px rgba(32,13,45,0.25)' }}
            onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-base mb-4" style={{ color: '#200D2D' }}>Add New User Account</h3>
            <div className="space-y-3">
              {[
                { label: 'Full Name', ph: 'e.g., Dr. Maria Santos' },
                { label: 'QCU Email', ph: 'e.g., msantos@qcu.edu.ph' },
                { label: 'Username', ph: 'e.g., msantos' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold" style={{ color: '#7B6891' }}>{f.label}</label>
                  <input className="w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(32,13,45,0.04)', border: '1.5px solid rgba(32,13,45,0.12)', color: '#200D2D' }}
                    placeholder={f.ph} />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold" style={{ color: '#7B6891' }}>Assigned Role</label>
                <select className="w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none appearance-none"
                  style={{ background: 'rgba(32,13,45,0.04)', border: '1.5px solid rgba(32,13,45,0.12)', color: '#200D2D' }}>
                  <option>University Executive</option>
                  <option>System Administrator</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-2xl text-sm font-medium"
                style={{ background: 'rgba(32,13,45,0.06)', color: '#200D2D' }}>
                Cancel
              </button>
              <button onClick={() => {
                setShowAddModal(false);
                showModal({
                  title: 'Confirm New User Account',
                  message: 'Create this account with the selected RBAC role and send a secure credential setup link to their QCU email?',
                  confirmLabel: 'Create Account',
                  onConfirm: () => showToast({ type: 'success', title: 'User Account Created', body: 'Credentials sent to the user\'s QCU email.' }),
                });
              }}
                className="flex-1 py-2.5 rounded-2xl text-sm font-semibold"
                style={{ background: '#200D2D', color: '#FFFFFF' }}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
