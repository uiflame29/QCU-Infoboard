import { useApp } from '../context/AppContext';

const ICONS: Record<string, string> = { success: '✓', error: '✕', warning: '⚠', info: 'ⓘ' };
const COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  success: { bg: 'rgba(0,135,90,0.08)',  border: 'rgba(0,135,90,0.25)',  icon: '#00875A' },
  error:   { bg: 'rgba(76,20,19,0.08)',  border: 'rgba(76,20,19,0.25)',  icon: '#C0392B' },
  warning: { bg: 'rgba(255,208,102,0.12)', border: 'rgba(255,208,102,0.4)', icon: '#B07800' },
  info:    { bg: 'rgba(187,150,228,0.1)', border: 'rgba(187,150,228,0.3)', icon: '#BB96E4' },
};

export default function Toast() {
  const { toasts } = useApp();
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map(t => {
        const c = COLORS[t.type] ?? COLORS.info;
        return (
          <div key={t.id} className="toast-enter flex items-start gap-3 px-4 py-3 rounded-2xl min-w-60 max-w-sm"
            style={{ background: '#FFFFFF', border: `1px solid ${c.border}`, boxShadow: '0 8px 32px rgba(32,13,45,0.14)' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ background: c.bg, color: c.icon }}>
              {ICONS[t.type]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold" style={{ color: '#200D2D' }}>{t.title}</p>
              {t.body && <p className="text-xs mt-0.5" style={{ color: '#7B6891' }}>{t.body}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
