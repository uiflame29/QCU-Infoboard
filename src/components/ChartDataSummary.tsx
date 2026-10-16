import { useMemo } from 'react';

type ChartRow = Record<string, unknown>;

export type ChartSeries = {
  key: string;
  label: string;
  color?: string;
  unit?: string;
  aggregate?: 'sum' | 'average' | 'latest';
  includeInGrandTotal?: boolean;
};

type Props = {
  data: ChartRow[];
  categoryKey: string;
  series: ChartSeries[];
  totalLabel?: string;
  totalUnit?: string;
  distribution?: boolean;
  showTotal?: boolean;
  showSeriesAggregates?: boolean;
  className?: string;
};

function numeric(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatValue(value: number, unit = '') {
  const formatted = Number.isInteger(value)
    ? value.toLocaleString()
    : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return unit === '%' ? `${formatted}%` : unit ? `${formatted} ${unit}` : formatted;
}

export default function ChartDataSummary({
  data,
  categoryKey,
  series,
  totalLabel = 'Grand total',
  totalUnit = '',
  distribution = true,
  showTotal = true,
  showSeriesAggregates = true,
  className = '',
}: Props) {
  const aggregates = useMemo(() => series.map(item => {
    const values = data.map(row => numeric(row[item.key])).filter((value): value is number => value !== null);
    const aggregate = item.aggregate === 'latest'
      ? (values.at(-1) ?? 0)
      : item.aggregate === 'average'
        ? (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0)
        : values.reduce((sum, value) => sum + value, 0);
    return { ...item, aggregate };
  }), [data, series]);

  const grandTotal = aggregates
    .filter(item => item.includeInGrandTotal !== false)
    .reduce((sum, item) => sum + item.aggregate, 0);

  if (!data.length || !series.length) return null;

  return (
    <div className={`rounded-2xl border border-lilac/15 bg-surface/60 p-3 ${className}`}>
      {(showTotal || showSeriesAggregates) && <div className="flex flex-wrap items-stretch gap-2">
        {showTotal && <div className="min-w-28 rounded-xl bg-primary px-3 py-2 text-white">
          <p className="text-[8px] font-bold uppercase tracking-wider text-lilac">{totalLabel}</p>
          <p className="mt-1 text-base font-bold">{formatValue(grandTotal, totalUnit)}</p>
        </div>}
        {showSeriesAggregates && aggregates.map(item => {
          const percentage = grandTotal > 0 && item.includeInGrandTotal !== false
            ? item.aggregate / grandTotal * 100
            : null;
          return (
            <div key={item.key} className="min-w-28 flex-1 rounded-xl border border-lilac/10 bg-white px-3 py-2">
              <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-muted">
                {item.color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />}
                {item.label}
              </p>
              <p className="mt-1 text-sm font-bold text-primary">
                {formatValue(item.aggregate, item.unit)}
                {distribution && percentage !== null && <span className="ml-1 text-[9px] font-semibold text-muted">({percentage.toFixed(1)}%)</span>}
              </p>
            </div>
          );
        })}
      </div>}
      <details className="group mt-2">
        <summary className="cursor-pointer list-none text-[9px] font-bold text-primary">
          <span className="group-open:hidden">View all exact values and distributions</span>
          <span className="hidden group-open:inline">Hide exact values</span>
        </summary>
        <div className="mt-2 overflow-x-auto rounded-xl border border-lilac/10 bg-white">
          <table className="w-full min-w-max text-left text-[9px]">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-3 py-2 font-bold">Category</th>
                {series.map(item => <th key={item.key} className="px-3 py-2 font-bold">{item.label}</th>)}
                {distribution && <th className="px-3 py-2 font-bold">Distribution</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const rowValues = series.map(item => numeric(row[item.key]) ?? 0);
                const rowTotal = rowValues.reduce((sum, value, valueIndex) =>
                  series[valueIndex].includeInGrandTotal === false ? sum : sum + value, 0);
                return (
                  <tr key={`${String(row[categoryKey])}-${index}`} className="border-t border-lilac/10">
                    <td className="px-3 py-2 font-semibold text-primary">{String(row[categoryKey] ?? `Row ${index + 1}`)}</td>
                    {series.map((item, seriesIndex) => (
                      <td key={item.key} className="px-3 py-2 text-muted">{formatValue(rowValues[seriesIndex], item.unit)}</td>
                    ))}
                    {distribution && <td className="px-3 py-2 font-semibold text-primary">{grandTotal > 0 ? `${(rowTotal / grandTotal * 100).toFixed(1)}%` : '0.0%'}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
