import { useEffect, type ReactNode } from 'react';

interface ChartModalProps {
  title: string;
  description: string;
  chart: ReactNode;
  onClose: () => void;
  onExport?: () => void;
  legend?: { label: string; color: string }[];
  insights?: string[];
  summary?: { label: string; value: string }[];
  dataSummary?: ReactNode;
}

export default function ChartModal({ title, description, chart, onClose, onExport, legend, insights, summary, dataSummary }: ChartModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(32,13,45,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="modal-content w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl flex flex-col"
        style={{ background: '#FFFFFF', boxShadow: '0 32px 100px rgba(32,13,45,0.35)' }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-lilac/10 sticky top-0 bg-white rounded-t-3xl z-10">
          <div>
            <h2 className="text-base font-bold text-primary">{title}</h2>
            <p className="text-xs text-muted mt-0.5 leading-relaxed max-w-xl">{description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onExport && (
              <button onClick={onExport}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold bg-golden/20 text-primary hover:bg-golden/35 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Export
              </button>
            )}
            <button onClick={onClose} aria-label="Close"
              className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-muted hover:text-primary hover:bg-lilac/15 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* Chart area */}
        <div className="px-6 pt-5 pb-2" style={{ minHeight: 380 }}>
          {chart}
        </div>

        {/* Legend */}
        {legend && legend.length > 0 && (
          <div className="px-6 py-4 flex flex-wrap gap-4 border-t border-lilac/8">
            {legend.map(l => (
              <div key={l.label} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: l.color }} />
                <span className="text-muted">{l.label}</span>
              </div>
            ))}
          </div>
        )}

        {dataSummary && (
          <div className="border-t border-lilac/10 px-6 py-4">
            {dataSummary}
          </div>
        )}

        {summary && summary.length > 0 && (
          <div className="grid gap-2 border-t border-lilac/10 px-6 py-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map(item => (
              <div key={item.label} className="rounded-2xl bg-surface p-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted">{item.label}</p>
                <p className="mt-1 text-xs font-semibold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Insights */}
        {insights && insights.length > 0 && (
          <div className="border-t border-lilac/10 px-6 py-5">
            <div className="rounded-2xl border border-lilac/15 bg-lilac/[.06] p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Key Insights</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {insights.map((ins, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-lilac shrink-0 mt-1.5" />
                    <span>{ins}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-lilac/8 flex justify-end">
          <button onClick={onClose} className="rounded-xl px-5 py-2 text-sm font-semibold bg-surface text-primary hover:bg-lilac/15 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
