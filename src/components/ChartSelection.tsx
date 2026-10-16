import { useState, useRef, useEffect } from 'react';

interface ChartSelectionProps {
  charts: { id: string; label: string }[];
  visible: Set<string>;
  onChange: (id: string, checked: boolean) => void;
}

export default function ChartSelection({ charts, visible, onChange }: ChartSelectionProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visibleCount = charts.filter(c => visible.has(c.id)).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all border ${open ? 'bg-primary text-white border-primary' : 'bg-white border-lilac/20 text-primary hover:border-lilac hover:bg-lilac/5'}`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="15" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg>
        Chart Selection
        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${open ? 'bg-white/20 text-white' : 'bg-lilac/15 text-primary'}`}>{visibleCount}/{charts.length}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 w-72 rounded-2xl bg-white border border-lilac/20 shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-lilac/10 flex items-center justify-between">
            <p className="text-xs font-bold text-primary">Toggle Chart Visibility</p>
            <div className="flex gap-2">
              <button onClick={() => charts.forEach(c => onChange(c.id, true))} className="text-[10px] text-lilac font-semibold hover:underline">Show All</button>
              <span className="text-muted">·</span>
              <button onClick={() => charts.forEach(c => onChange(c.id, false))} className="text-[10px] text-muted hover:text-primary font-semibold">Hide All</button>
            </div>
          </div>
          <div className="p-2 space-y-0.5 max-h-64 overflow-y-auto">
            {charts.map(c => (
              <label key={c.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface cursor-pointer transition-colors group">
                <input type="checkbox" checked={visible.has(c.id)} onChange={e => onChange(c.id, e.target.checked)} className="w-3.5 h-3.5 rounded accent-primary" />
                <span className={`text-xs transition-colors ${visible.has(c.id) ? 'font-semibold text-primary' : 'text-muted'}`}>{c.label}</span>
                {visible.has(c.id) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-coa" />
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
