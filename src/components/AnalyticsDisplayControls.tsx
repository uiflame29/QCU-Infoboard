import ChartSelection from './ChartSelection';
import { useApp } from '../context/AppContext';

interface AnalyticsDisplayControlsProps {
  charts: { id: string; label: string }[];
  visible: Set<string>;
  onChange: (id: string, checked: boolean) => void;
  rows: Record<string, (string | number)[][]>;
  metrics: (string | number)[][];
  exportPrefix: string;
}

export default function AnalyticsDisplayControls({
  charts,
  visible,
  onChange,
  rows,
  metrics,
  exportPrefix,
}: AnalyticsDisplayControlsProps) {
  const { showToast } = useApp();

  function exportAll() {
    const visibleCharts = charts.filter(chart => visible.has(chart.id));
    const packageRows: (string | number)[][] = [
      ['CERTIFIED ANALYTICS PACKAGE'],
      ['Generated', new Date().toLocaleString()],
      [],
      ['METRICS'],
      ...metrics,
      ...visibleCharts.flatMap(chart => [
        [],
        [chart.label.toUpperCase()],
        ...(rows[chart.id] ?? []),
      ]),
    ];
    const csv = packageRows
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${exportPrefix}-visible-charts.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast({
      type: 'success',
      title: 'Certified package exported',
      body: `${visibleCharts.length} visible chart${visibleCharts.length === 1 ? '' : 's'} and the current metrics were downloaded.`,
    });
  }

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-lilac/20 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-bold text-primary">Analytics display controls</p>
        <p className="mt-1 text-[10px] text-muted">Choose the charts included in your live workspace and certified export.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ChartSelection charts={charts} visible={visible} onChange={onChange} />
        <button
          type="button"
          onClick={exportAll}
          disabled={visible.size === 0}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Export All
        </button>
      </div>
    </section>
  );
}
