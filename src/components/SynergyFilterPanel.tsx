import type { ReactNode } from 'react';
import ChartSelection from './ChartSelection';

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function SynergyFilterSelect({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="min-w-44 flex-1">
      <span className="mb-2 block text-[9px] font-bold uppercase tracking-[.18em] text-muted">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={event => onChange(event.target.value)}
          className="w-full appearance-none rounded-2xl border border-lilac/20 bg-surface px-4 py-3 pr-10 text-xs font-semibold text-primary outline-none transition-all hover:border-lilac/55 focus:border-lilac focus:ring-4 focus:ring-lilac/15">
          {options.map(option => <option key={option}>{option}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lilac" width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    </label>
  );
}

export default function SynergyFilterPanel({
  title,
  description,
  activeFilterCount,
  charts,
  visibleCharts,
  onChartChange,
  onReset,
  resetDisabled,
  children,
}: {
  title: string;
  description: string;
  activeFilterCount: number;
  charts: { id: string; label: string }[];
  visibleCharts: Set<string>;
  onChartChange: (id: string, checked: boolean) => void;
  onReset: () => void;
  resetDisabled: boolean;
  children: ReactNode;
}) {
  return (
    <section className="overflow-visible rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-lilac/10 pb-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lilac/10 text-primary"><FilterIcon /></span>
          <div>
            <p className="text-sm font-bold text-primary">{title}</p>
            <p className="mt-0.5 text-[10px] text-muted">{description}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span className={`rounded-full px-3 py-1.5 text-[9px] font-bold ${activeFilterCount ? 'bg-lilac/15 text-primary' : 'bg-surface text-muted'}`}>
            {activeFilterCount} active filter{activeFilterCount === 1 ? '' : 's'}
          </span>
          <ChartSelection charts={charts} visible={visibleCharts} onChange={onChartChange} />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-end gap-3">
        {children}
        <button type="button" onClick={onReset} disabled={resetDisabled} className="min-h-11 rounded-2xl border border-lilac/20 bg-white px-5 py-3 text-xs font-bold text-primary transition-colors hover:bg-lilac/10 disabled:cursor-not-allowed disabled:text-muted disabled:opacity-45 sm:ml-auto">
          Reset Filters
        </button>
      </div>
    </section>
  );
}
