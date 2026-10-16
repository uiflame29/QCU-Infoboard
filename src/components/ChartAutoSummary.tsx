import { Children, isValidElement, type ReactNode } from 'react';
import { Area, Bar, Line, Pie } from 'recharts';
import ChartDataSummary, { type ChartSeries } from './ChartDataSummary';

type ElementProps = {
  children?: ReactNode;
  data?: Record<string, unknown>[];
  dataKey?: string | number | ((value: unknown) => unknown);
  name?: string;
  fill?: string;
  stroke?: string;
};

function findData(node: ReactNode): Record<string, unknown>[] | null {
  if (!isValidElement(node)) return null;
  const props = node.props as ElementProps;
  if (Array.isArray(props.data)) return props.data;
  let result: Record<string, unknown>[] | null = null;
  Children.forEach(props.children, child => {
    if (!result) result = findData(child);
  });
  return result;
}

function findSeries(node: ReactNode, aggregate: ChartSeries['aggregate']): ChartSeries[] {
  if (!isValidElement(node)) return [];
  const props = node.props as ElementProps;
  const isSeries = node.type === Line || node.type === Bar || node.type === Pie || node.type === Area;
  const ownSeries = isSeries && typeof props.dataKey === 'string'
    ? [{
        key: props.dataKey,
        label: props.name ?? props.dataKey,
        color: props.stroke ?? props.fill,
        aggregate,
      }]
    : [];
  return [...ownSeries, ...Children.toArray(props.children).flatMap(child => findSeries(child, aggregate))];
}

export default function ChartAutoSummary({
  chart,
  categoryKey = 'period',
  aggregate = 'latest',
  totalLabel = 'Latest represented total',
  distribution = false,
  className = '',
  showTotal = true,
}: {
  chart: ReactNode;
  categoryKey?: string;
  aggregate?: ChartSeries['aggregate'];
  totalLabel?: string;
  distribution?: boolean;
  className?: string;
  showTotal?: boolean;
}) {
  const data = findData(chart);
  const series = findSeries(chart, aggregate);
  if (!data?.length || !series.length) return null;

  return (
    <ChartDataSummary
      className={className}
      data={data}
      categoryKey={categoryKey}
      series={series}
      totalLabel={totalLabel}
      distribution={distribution}
      showTotal={showTotal}
    />
  );
}
