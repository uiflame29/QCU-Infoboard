import { useApp } from '../context/AppContext';

export default function Modal() {
  const { modal, closeModal } = useApp();
  if (!modal) return null;
  const isDanger = modal.variant === 'danger';

  return (
    <div className="modal-backdrop fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'rgba(32,13,45,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) { modal.onCancel?.(); closeModal(); } }}>
      <div className="modal-content w-full max-w-sm rounded-3xl p-6"
        style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(32,13,45,0.25)' }}>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: isDanger ? 'rgba(76,20,19,0.1)' : 'rgba(187,150,228,0.12)' }}>
            {isDanger
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: '#C0392B' }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: '#BB96E4' }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            }
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: '#200D2D' }}>{modal.title}</h3>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: '#7B6891' }}>{modal.message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { modal.onCancel?.(); closeModal(); }}
            className="flex-1 py-2.5 rounded-2xl text-sm font-medium"
            style={{ background: 'rgba(32,13,45,0.06)', color: '#200D2D' }}>
            {modal.cancelLabel ?? 'Cancel'}
          </button>
          <button
            onClick={() => { modal.onConfirm(); closeModal(); }}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold"
            style={{ background: isDanger ? '#4C1413' : '#200D2D', color: '#FFFFFF' }}>
            {modal.confirmLabel ?? 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
