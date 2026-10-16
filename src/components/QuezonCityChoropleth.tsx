import { useMemo, useState, type FocusEvent, type MouseEvent } from 'react';
import quezonCityDistrictSvg from '../assets/quezon-city-districts.svg?raw';

interface GeographicRow {
  district: string;
  students: number;
}

interface DistrictProfile {
  code: string;
  area: string;
  femaleShare: number;
  program: string;
  scholarShare: number;
}

interface ActiveDistrict {
  district: string;
  x: number;
  y: number;
}

const DISTRICT_PATHS: Record<string, string> = {
  path5575: 'District 1',
  path5606: 'District 2',
  path4148: 'District 3',
  path4153: 'District 4',
  path4158: 'District 5',
  path4976: 'District 6',
};

const DISTRICT_PROFILES: Record<string, DistrictProfile> = {
  'District 1': { code: 'QC-D01', area: 'West Triangle / Project 6', femaleShare: 0.54, program: 'BS Information Technology', scholarShare: 0.58 },
  'District 2': { code: 'QC-D02', area: 'Batasan / Novaliches East', femaleShare: 0.525, program: 'BS Information Technology', scholarShare: 0.61 },
  'District 3': { code: 'QC-D03', area: 'Quirino / Libis', femaleShare: 0.56, program: 'BS Entrepreneurship', scholarShare: 0.47 },
  'District 4': { code: 'QC-D04', area: 'Cubao / Central', femaleShare: 0.51, program: 'BS Industrial Engineering', scholarShare: 0.44 },
  'District 5': { code: 'QC-D05', area: 'Fairview / Novaliches North', femaleShare: 0.55, program: 'BS Information Systems', scholarShare: 0.63 },
  'District 6': { code: 'QC-D06', area: 'Tandang Sora / Sauyo', femaleShare: 0.53, program: 'BS Electronics Engineering', scholarShare: 0.52 },
  'Non-QC / Other': { code: 'OUT-QC', area: 'Outside Quezon City', femaleShare: 0.52, program: 'BS Information Technology', scholarShare: 0.36 },
};

function buildInteractiveSvg(intensityByDistrict: Record<string, number>) {
  let svg = quezonCityDistrictSvg
    .replace('<svg', '<svg class="qc-map-svg" role="img" aria-label="Quezon City legislative districts choropleth map"')
    .replace(/width="560\.77551mm"/, '')
    .replace(/height="783\.18433mm"/, '');

  Object.entries(DISTRICT_PATHS).forEach(([pathId, district]) => {
    svg = svg.replace(
      `id="${pathId}"`,
      `id="${pathId}" class="qc-district qc-fill-${intensityByDistrict[district] ?? 1}" data-district="${district}" tabindex="0" role="button" aria-label="${district} enrollment details"`,
    );
  });

  return svg;
}

export default function QuezonCityChoropleth({ data }: { data: GeographicRow[] }) {
  const [active, setActive] = useState<ActiveDistrict | null>(null);
  const maximum = Math.max(...data.map(row => row.students), 1);
  const total = data.reduce((sum, row) => sum + row.students, 0);
  const intensityByDistrict = Object.fromEntries(
    data.map(row => [row.district, Math.max(1, Math.ceil((row.students / maximum) * 5))]),
  );
  const interactiveSvg = useMemo(
    () => buildInteractiveSvg(intensityByDistrict),
    // The serialized map only needs to change when a filtered district count changes.
    [JSON.stringify(intensityByDistrict)],
  );
  const rowsByDistrict = Object.fromEntries(data.map(row => [row.district, row]));

  function districtFromTarget(target: EventTarget | null) {
    return (target as Element | null)?.closest<SVGPathElement>('[data-district]')?.dataset.district ?? null;
  }

  function showFromPointer(event: MouseEvent<HTMLDivElement>) {
    const district = districtFromTarget(event.target);
    if (!district) {
      setActive(null);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    setActive({ district, x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  }

  function showFromFocus(event: FocusEvent<HTMLDivElement>) {
    const path = (event.target as Element | null)?.closest<SVGGraphicsElement>('[data-district]');
    const district = path?.dataset.district;
    if (!path || !district) return;
    const pathBounds = path.getBoundingClientRect();
    const bounds = event.currentTarget.getBoundingClientRect();
    setActive({
      district,
      x: pathBounds.left + pathBounds.width / 2 - bounds.left,
      y: pathBounds.top + pathBounds.height / 2 - bounds.top,
    });
  }

  const activeRow = active ? rowsByDistrict[active.district] : null;
  const activeProfile = active ? DISTRICT_PROFILES[active.district] : null;
  const female = activeRow && activeProfile ? Math.round(activeRow.students * activeProfile.femaleShare) : 0;
  const male = activeRow ? activeRow.students - female : 0;

  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div
        className="relative min-h-[34rem] overflow-hidden rounded-2xl border border-lilac/15 bg-surface/70"
        onMouseMove={showFromPointer}
        onMouseLeave={() => setActive(null)}
        onFocus={showFromFocus}
        onBlur={event => !event.currentTarget.contains(event.relatedTarget) && setActive(null)}>
        <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl border border-lilac/15 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
          <p className="text-[9px] font-bold uppercase tracking-widest text-lilac">Geographic concentration</p>
          <p className="mt-0.5 text-[10px] text-muted">Hover or focus a district for enrollment detail</p>
        </div>
        <div className="h-full w-full p-5 pt-16" dangerouslySetInnerHTML={{ __html: interactiveSvg }} />

        {active && activeRow && activeProfile && (
          <div
            className="pointer-events-none absolute z-30 w-64 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] overflow-hidden rounded-2xl border border-white/10 bg-primary/95 text-white shadow-2xl backdrop-blur-md"
            style={{ left: active.x, top: active.y }}>
            <div className="border-b border-white/10 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{active.district}</p>
                  <p className="mt-0.5 text-[9px] text-white/55">{activeProfile.area}</p>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-1 font-mono text-[8px] text-golden">{activeProfile.code}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/10">
              <TooltipMetric label="Enrollment" value={activeRow.students.toLocaleString()} />
              <TooltipMetric label="Population share" value={`${((activeRow.students / Math.max(total, 1)) * 100).toFixed(1)}%`} />
              <TooltipMetric label="Female students" value={female.toLocaleString()} />
              <TooltipMetric label="Male students" value={male.toLocaleString()} />
            </div>
            <div className="space-y-2.5 px-4 py-3">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-white/40">Top academic program</p>
                <p className="mt-0.5 text-[10px] font-semibold text-white/90">{activeProfile.program}</p>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                <p className="text-[8px] font-bold uppercase tracking-wider text-white/40">Scholarship beneficiaries</p>
                <p className="text-xs font-bold text-golden">{Math.round(activeRow.students * activeProfile.scholarShare).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col rounded-2xl border border-lilac/15 bg-surface/70 p-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-lilac">District distribution</p>
          <p className="mt-1 text-lg font-bold text-primary">{total.toLocaleString()}</p>
          <p className="text-[10px] text-muted">enrolled students in current scope</p>
        </div>
        <div className="mt-4 space-y-2">
          {data.filter(row => row.district !== 'Non-QC / Other').map(row => (
            <div key={row.district} className="flex items-center gap-2.5 rounded-xl border border-lilac/10 bg-white px-3 py-2">
              <span className={`qc-legend-swatch qc-fill-${intensityByDistrict[row.district]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-primary">{row.district}</p>
                <p className="text-[8px] text-muted">{((row.students / Math.max(total, 1)) * 100).toFixed(1)}% of population</p>
              </div>
              <p className="font-mono text-[10px] font-semibold text-primary">{row.students.toLocaleString()}</p>
            </div>
          ))}
        </div>
        {rowsByDistrict['Non-QC / Other'] && (
          <div
            className="mt-auto rounded-xl border border-dashed border-lilac/30 bg-white p-3"
            onMouseEnter={event => {
              const mapBounds = event.currentTarget.parentElement?.parentElement?.firstElementChild?.getBoundingClientRect();
              if (mapBounds) setActive({ district: 'Non-QC / Other', x: mapBounds.width - 150, y: mapBounds.height - 40 });
            }}
            onMouseLeave={() => setActive(null)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-primary">Outside Quezon City</p>
                <p className="text-[8px] text-muted">Non-QC / other residences</p>
              </div>
              <p className="font-mono text-xs font-bold text-primary">{rowsByDistrict['Non-QC / Other'].students.toLocaleString()}</p>
            </div>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between text-[8px] font-medium uppercase tracking-wider text-muted">
          <span>Lower</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(level => <span key={level} className={`qc-legend-swatch qc-fill-${level}`} />)}
          </div>
          <span>Higher</span>
        </div>
      </div>
    </div>
  );
}

function TooltipMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-primary/70 px-4 py-2.5">
      <p className="text-[8px] font-bold uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-0.5 font-mono text-xs font-semibold text-white">{value}</p>
    </div>
  );
}
