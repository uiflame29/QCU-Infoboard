import { useRef, useState, type ReactNode } from 'react';
import { useApp } from '../context/AppContext';
import ChartModal from './ChartModal';

interface AnalyticsChartCardProps {
  chartId: string;
  exportPrefix: string;
  eyebrow: string;
  title: string;
  description?: string;
  rows: (string | number)[][];
  insights?: string[];
  action?: ReactNode;
  children: ReactNode;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsChartCard({
  chartId,
  exportPrefix,
  eyebrow,
  title,
  description,
  rows,
  insights,
  action,
  children,
}: AnalyticsChartCardProps) {
  const { filters, showToast } = useApp();
  const [open, setOpen] = useState(false);
  const chartRef = useRef<HTMLElement>(null);
  const dataRows = rows.slice(1);
  const primaryValues = dataRows.map(row => row.find(value => typeof value === 'number')).filter((value): value is number => typeof value === 'number');
  const total = primaryValues.reduce((sum, value) => sum + value, 0);
  const largestIndex = primaryValues.length ? primaryValues.indexOf(Math.max(...primaryValues)) : -1;
  const smallestPositive = primaryValues.filter(value => value > 0).sort((a, b) => a - b)[0] ?? 0;
  const largest = largestIndex >= 0 ? primaryValues[largestIndex] : 0;
  const largestLabel = largestIndex >= 0 ? String(dataRows[largestIndex]?.[0] ?? 'Leading category') : 'Leading category';
  const categoryBreakdown = dataRows
    .slice(0, 6)
    .map((row, index) => {
      const value = primaryValues[index] ?? 0;
      return `${String(row[0])} ${total > 0 ? `${((value / total) * 100).toFixed(1)}%` : value.toLocaleString()}`;
    })
    .join(' · ');
  const generatedInsights = [
    total > 0 ? `The chart represents ${total.toLocaleString()} total units across ${dataRows.length} visible categories.` : `${dataRows.length} categories are shown in the current filtered scope.`,
    categoryBreakdown ? `Category breakdown: ${categoryBreakdown}${dataRows.length > 6 ? ` · +${dataRows.length - 6} more` : ''}.` : 'Category values reflect the current active filters.',
    largest > 0 && total > 0 ? `${largestLabel} is the largest category at ${largest.toLocaleString()} (${((largest / total) * 100).toFixed(1)}% of the plotted total).` : 'The leading allocation updates with the current scope.',
    largest > 0 && smallestPositive > 0 ? `The largest-to-smallest visible allocation is ${(largest / smallestPositive).toFixed(1)}:1.` : 'The allocation ratio updates with the current scope.',
    `${title} supports Registrar planning by making concentration, balance, and allocation differences easier to identify.`,
    ...(insights ?? []),
  ];

  function exportChart() {
    const csv = rows
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    downloadBlob(`${exportPrefix}-${chartId}.csv`, new Blob([csv], { type: 'text/csv;charset=utf-8' }));

    const chart = chartRef.current?.querySelector('svg.recharts-surface');
    if (chart) {
      downloadBlob(
        `${exportPrefix}-${chartId}.svg`,
        new Blob([new XMLSerializer().serializeToString(chart)], { type: 'image/svg+xml;charset=utf-8' }),
      );
    }

    showToast({
      type: 'success',
      title: 'Chart exported',
      body: `${title} was downloaded with its current filtered data.`,
    });
  }

  return (
    <>
      <section ref={chartRef} data-chart-id={chartId} className="rounded-3xl border border-lilac/20 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-lilac">{eyebrow}</p>
            <p className="mt-1 text-sm font-bold text-primary">{title}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {action}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-xl border border-lilac/25 bg-lilac/10 px-3 py-1.5 text-[10px] font-semibold text-primary transition-colors hover:bg-lilac/20">
              View Chart
            </button>
            <button
              type="button"
              onClick={exportChart}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-primary/90">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 16V3m0 0L7 8m5-5l5 5M4 15v5h16v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Export
            </button>
          </div>
        </div>
        {children}
      </section>

      {open && (
        <ChartModal
          title={title}
          description={description ?? `Expanded view of ${title.toLowerCase()} using the current analytics filters.`}
          chart={<div className="[&_.recharts-responsive-container]:!h-[360px]">{children}</div>}
          insights={generatedInsights}
          summary={[
            { label: 'Academic Year', value: filters.academicYear },
            { label: 'Semester', value: filters.semester },
            { label: 'Campus', value: filters.campus },
            { label: 'Scope', value: filters.program !== 'All' ? `${filters.college} · ${filters.program}` : filters.college },
          ]}
          onExport={exportChart}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
