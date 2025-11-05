'use client';

import { useEffect, useState, useMemo, useId } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { csvParse, tsvParse } from 'd3-dsv';

type Row = Record<string, string | number>;

type Source = { label: string; href?: string };

type Props = {
  csvUrl: string;
  height?: number;
  title?: string;
  description?: string;
  source?: Source;
  updated?: string;
  tolerancePct?: number;
  indexScale?: any;
};

export default function BarStacked({
  csvUrl,
  height = 800,
  title,
  description,
  source,
  updated,
  tolerancePct = 2,
  indexScale,
}: Props) {
  const [raw, setRaw] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(csvUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const firstBreak = text.indexOf('\n');
        const firstLine = text.slice(0, firstBreak === -1 ? undefined : firstBreak);
        const tabCount = firstLine.split('\t').length;
        const commaCount = firstLine.split(',').length;
        const parser = tabCount > commaCount ? tsvParse : csvParse;
        const parsed = parser(text).map((d) => {
          const r: Row = {};
          for (const [key, val] of Object.entries(d)) {
            const normalizedKey = key.replace(/\uFEFF/g, '').trim();
            if (!normalizedKey) continue;
            const cleaned = (val ?? '')
              .toString()
              .replace(/\u00a0/g, '')
              .trim()
              .replace(/%/g, '')
              .replace(/,/g, '')
              .replace(/[^0-9.+-]/g, '');
            const num = Number(cleaned);
            r[normalizedKey] = Number.isFinite(num) && cleaned !== '' ? num : (val as string);
          }
          return r;
        });
        if (!cancelled) {
          setRaw(parsed);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load CSV');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [csvUrl]);

  const { data, idxKey, seriesKeys, diagnostics } = useMemo(() => {
    if (!raw.length) return { data: raw, idxKey: 'district', seriesKeys: [] as string[], diagnostics: { imbalances: [] as string[] } };

    const allKeys = Object.keys(raw[0]);
    const idx =
      allKeys.find((k) => ['district', 'grower type', 'metric'].includes(k.trim().toLowerCase())) ??
      allKeys[0] ??
      'district';

    const fallbackSeries = allKeys.filter((k) => k !== idx);
    const keys = [...fallbackSeries];

    // Guard: if no series keys, keep array empty and log (prevents invisible chart)
    if (!keys.length) {
      // eslint-disable-next-line no-console
      console.warn('[BarStacked] No series keys detected. Available columns:', allKeys);
    }

    // If values look like proportions (<=1), scale to percents
    let maxVal = 0;
    for (const row of raw) for (const k of keys) {
      const v = Number(row[k]);
      if (Number.isFinite(v)) maxVal = Math.max(maxVal, v);
    }
    const scaleToPercent = maxVal > 0 && maxVal <= 1.000001;

    const normalized = raw.map((row) => {
      const out: Row = { ...row };
      for (const k of keys) {
        const v = Number(row[k]);
        if (Number.isFinite(v)) out[k] = scaleToPercent ? v * 100 : v;
      }
      return out;
    });

    const bigKey = keys.find((k) => k.toLowerCase().includes('big')) ?? keys[keys.length - 1] ?? keys[0];
    const checks = normalized.map((row) => {
      const total = keys.reduce((sum, key) => {
        const val = Number(row[key]);
        return Number.isFinite(val) ? sum + val : sum;
      }, 0);
      return { label: String(row[idx] ?? ''), total };
    });

    const imbalanceLabels = checks
      .filter(({ total }) => Number.isFinite(total) && Math.abs(total - 100) > tolerancePct)
      .map(({ label, total }) => `${label || 'Row'} (${total.toFixed(1)}%)`);

    const sorted = [...normalized].sort((a, b) => {
      const bVal = Number(b[bigKey]);
      const aVal = Number(a[bigKey]);
      if (Number.isFinite(bVal) && Number.isFinite(aVal)) return bVal - aVal;
      if (Number.isFinite(bVal)) return -1;
      if (Number.isFinite(aVal)) return 1;
      return 0;
    });

    return {
      data: sorted,
      idxKey: idx,
      seriesKeys: keys,
      diagnostics: { imbalances: imbalanceLabels },
    };
  }, [raw, tolerancePct]);

  const fontSans = 'var(--font-sans, Inter, system-ui, sans-serif)';
  const bigColor = '#2B3C63';
  const smallColor = '#0FA77E';
  const labelColor = 'hsl(var(--primary-foreground))';
  const borderColor = 'hsl(var(--border))';
  const mutedColor = 'hsl(var(--muted-foreground))';
  const legendColor = 'hsl(var(--foreground))';
  const tooltipBg = 'hsl(var(--card))';
  const palette = [bigColor, smallColor, '#F36D52', '#6B7280'];
  const colorMap = new Map<string, string>();
  seriesKeys.forEach((key, idx) => {
    colorMap.set(key, palette[idx % palette.length]);
  });
  const uniqueId = useId();
  const titleId = title ? `${uniqueId}-title` : undefined;
  const descriptionId = description ? `${uniqueId}-description` : undefined;
  const warningId = diagnostics.imbalances.length ? `${uniqueId}-warnings` : undefined;
  const sourceId = source ? `${uniqueId}-source` : undefined;
  const updatedId = updated ? `${uniqueId}-updated` : undefined;
  const describedBy = [descriptionId, warningId, sourceId, updatedId].filter(Boolean).join(' ') || undefined;

  const renderStatus = (message: string, variant: 'muted' | 'error' = 'muted') => (
    <div
      className={[
        'flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-sm',
        variant === 'error' ? 'text-destructive' : 'text-muted-foreground',
      ].join(' ')}
      style={{ height }}
    >
      <span className="text-center">{message}</span>
    </div>
  );

  if (loading) return renderStatus('Loading chart...');
  if (error) return renderStatus(`Error: ${error}`, 'error');
  if (!data.length) return renderStatus('No data available');

  if (!seriesKeys.length) {
    const columns = raw.length ? Object.keys(raw[0]).join(', ') : '—';
    return renderStatus(`No chartable series found. Columns available: ${columns}`);
  }

  return (
    <figure
      className="relative flex h-full flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm"
      style={{ height }}
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      role="group"
    >
      {(title || description || updated) && (
        <header className="flex flex-col gap-3">
          {title && (
            <h2 id={titleId} className="text-xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p id={descriptionId} className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          {updated && (
            <p id={updatedId} className="text-xs uppercase tracking-wide text-muted-foreground">
              Updated {updated}
            </p>
          )}
        </header>
      )}

      {diagnostics.imbalances.length > 0 && (
        <div
          id={warningId}
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
        >
          Some rows do not sum to 100% (tolerance ±{tolerancePct}%). Please verify: {diagnostics.imbalances.join(', ')}.
        </div>
      )}

      <div className="relative mb-4">
        <div className="pointer-events-none absolute bottom-2 right-0 text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/50">
          northeast in data
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveBar
          data={data as any[]}
          keys={seriesKeys}
          indexBy={idxKey}
          layout="horizontal"
          groupMode="stacked"
          indexScale={indexScale ?? { type: 'band', round: false, reverse: true }}
          enableLabel
          label={({ id, value, data }) => {
            const n = Number((data as Record<string, unknown>)?.[id as string] ?? value);
            if (!Number.isFinite(n) || n <= 5) return '';
            return `${Math.round(n)}%`;
          }}
          labelSkipWidth={18}
          labelSkipHeight={12}
          labelTextColor={labelColor}
          labelPosition="end"
          labelOffset={-32}
          margin={{ top: 64, right: 130, bottom: 56, left: 132 }}
          padding={0.05}
          colors={({ id }) => colorMap.get(String(id)) ?? bigColor}
          borderRadius={0}
          layers={['grid', 'axes', 'bars', 'labels', 'markers', 'legends']}
          axisBottom={{ legend: 'Share of Tea Area (%)', legendPosition: 'middle', legendOffset: 40 }}
          axisLeft={{
            legend: '',
            legendPosition: 'middle',
            legendOffset: -110,
            tickTextColor: mutedColor,
            tickPadding: 6,
            renderTick: (props: any) => {
              const { x, y, value, textAnchor, dominantBaseline } = props;
              const isAssam = String(value).toLowerCase().includes('assam');
              const labelX = typeof x === 'number' ? x - 8 : x;
              return (
                <text
                  key={value}
                  x={labelX}
                  y={y}
                  textAnchor={textAnchor}
                  dominantBaseline={dominantBaseline}
                  fontFamily={fontSans}
                  fontSize={12}
                  fontWeight={isAssam ? 700 : 500}
                  fill={mutedColor}
                >
                  {String(value)}
                </text>
              );
            },
          }}
          theme={{
            labels: { text: { fontFamily: fontSans, fontWeight: 600, fill: labelColor } },
            axis: {
              domain: { line: { stroke: borderColor } },
              ticks: { line: { stroke: borderColor }, text: { fill: mutedColor, fontFamily: fontSans, fontSize: 12 } },
              legend: { text: { fill: mutedColor, fontFamily: fontSans, fontSize: 12 } },
            },
            grid: { line: { stroke: borderColor, strokeWidth: 1 } },
            legends: { text: { fill: legendColor, fontFamily: fontSans, fontSize: 13 } },
            tooltip: {
              container: {
                fontFamily: fontSans,
                border: `1px solid ${borderColor}`,
                background: tooltipBg,
                color: legendColor,
              },
            },
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'top-left',
              direction: 'row',
              translateY: -36,
              itemWidth: 140,
              itemHeight: 18,
              itemsSpacing: 8,
              symbolSize: 14,
            },
          ]}
          tooltip={({ id, value, indexValue, data: datum }) => {
            const n = Number((datum as any)?.[id as any] ?? value);
            return (
              <div
                style={{
                  background: tooltipBg,
                  padding: '8px 10px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 6,
                  color: legendColor,
                  fontFamily: fontSans,
                  fontSize: 12,
                }}
              >
                <strong>{String(id)}</strong>: {Number.isFinite(n) ? Math.round(n) : '-'}%<br />
                <small>{String(indexValue)}</small>
              </div>
            );
          }}
          role="img"
          ariaLabel="Stacked horizontal bar chart showing share of tea area by grower type and district"
          ariaLabelledBy={titleId}
          ariaDescribedBy={describedBy}
        />
      </div>
      <div className="pointer-events-none absolute bottom-4 right-6 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/60">
        Northeast in Data
      </div>

      {(source || updated) && (
        <figcaption className="space-y-2 text-xs text-muted-foreground">
          {source && (
            <div id={sourceId}>
              Source:{' '}
              {source.href ? (
                <a
                  href={source.href}
                  className="font-medium text-foreground underline decoration-dotted underline-offset-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.label}
                </a>
              ) : (
                <span className="font-medium text-foreground">{source.label}</span>
              )}
            </div>
          )}
          {updated && !title && (
            <div id={updatedId}>Updated {updated}</div>
          )}
        </figcaption>
      )}
    </figure>
  );
}
