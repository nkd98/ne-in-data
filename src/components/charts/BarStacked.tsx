'use client';

import { useEffect, useState, useMemo, useId, useRef } from 'react';
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

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
  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const assignWidth = (width: number) => {
      const fallback = typeof window !== 'undefined' ? window.innerWidth || desiredMinWidth : desiredMinWidth;
      const nextWidth = width && width > 0 ? width : fallback;
      setContainerWidth((prev) => {
        if (!prev) return nextWidth;
        return Math.abs(prev - nextWidth) > 0.5 ? nextWidth : prev;
      });
    };

    const measure = () => {
      const node = wrapperRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      assignWidth(rect.width);
    };

    measure();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const width = entry.contentRect?.width ?? 0;
          assignWidth(width);
        });
      });
      observer.observe(element);
    } else if (typeof window !== 'undefined') {
      window.addEventListener('resize', measure);
    }

    return () => {
      if (observer) observer.disconnect();
      else if (typeof window !== 'undefined') window.removeEventListener('resize', measure);
    };
  }, [data.length]);
  const viewportWidth = containerWidth || 0;
  const MIN_CHART_WIDTH = 320;
  const desiredMinWidth = MIN_CHART_WIDTH;
  const hasMeasurement = viewportWidth > 0;
  const needsScroll = Boolean(hasMeasurement && viewportWidth + 0.5 < desiredMinWidth);
  const chartWidth = hasMeasurement ? (needsScroll ? desiredMinWidth : viewportWidth) : desiredMinWidth;

  const axisFontSize = chartWidth && chartWidth < 320 ? 10 : chartWidth && chartWidth < 420 ? 11 : 12;
  const legendFontSize = chartWidth && chartWidth < 540 ? 12 : 13;
  const labelFontSize = chartWidth && chartWidth < 360 ? 11 : 12;
  const barCount = data.length;
  const barPadding = chartWidth && chartWidth < 520 ? 0.04 : 0.08;
  const longestLabelLength = useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((max, row) => {
      const str = String(row[idxKey] ?? '');
      return Math.max(max, str.length);
    }, 0);
  }, [data, idxKey]);

  const margin = useMemo(() => {
    // Enough room for long district labels, but avoid oversized gutters on mobile
    const estimatedLeft = Math.min(180, Math.max(72, longestLabelLength * (axisFontSize * 0.6) + 26));
    const right = chartWidth && chartWidth < 520 ? 18 : 28;
    if (!chartWidth) {
      return { top: 56, right, bottom: 52, left: estimatedLeft };
    }
    if (chartWidth < 360) {
      return { top: 40, right, bottom: 44, left: estimatedLeft };
    }
    if (chartWidth < 520) {
      return { top: 48, right, bottom: 46, left: estimatedLeft };
    }
    if (chartWidth < 760) {
      return { top: 54, right: 30, bottom: 50, left: estimatedLeft };
    }
    return { top: 56, right: 32, bottom: 52, left: estimatedLeft };
  }, [chartWidth, longestLabelLength, axisFontSize]);
  const availableWidth = useMemo(() => {
    if (!chartWidth) return 0;
    const usable = chartWidth - margin.left - margin.right;
    return usable > 0 ? usable : 0;
  }, [chartWidth, margin]);
  const legendConfig = useMemo(() => {
    if (!seriesKeys.length) return [];
    const baseLegend = {
      dataFrom: 'keys' as const,
      itemWidth: 96,
      itemHeight: 16,
      symbolSize: 12,
    };
    return [
      {
        ...baseLegend,
        anchor: 'top-left' as const,
        direction: 'row' as const,
        translateY: -30,
        itemsSpacing: chartWidth && chartWidth < 540 ? 6 : 10,
      },
    ];
  }, [chartWidth, seriesKeys.length]);
  const useInlineLegend = false;
  const axisBottomLegend = chartWidth && chartWidth < 360 ? 'Share (%)' : 'Share of Tea Area (%)';
  const axisBottomLegendOffset = chartWidth && chartWidth < 360 ? 34 : 40;

  const barLayers = ['grid', 'axes', 'bars', 'markers', 'legends'];

  const rowHeight = chartWidth
    ? chartWidth < 360
      ? 44
      : chartWidth < 520
        ? 38
        : chartWidth < 760
          ? 34
          : 30
    : 32;
  const computedContentHeight = rowHeight * Math.max(1, barCount);
  const effectiveHeight = useMemo(() => {
    const minNeeded = Math.max(280, computedContentHeight + margin.top + margin.bottom);
    if (typeof height === 'number') {
      if (chartWidth && chartWidth < 520) {
        return Math.max(height, minNeeded);
      }
      return height;
    }
    return minNeeded;
  }, [height, computedContentHeight, margin, chartWidth]);
  const showLabels = availableWidth >= 90;

  const renderStatus = (message: string, variant: 'muted' | 'error' = 'muted') => (
    <div
      className={[
        'flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-sm',
        variant === 'error' ? 'text-destructive' : 'text-muted-foreground',
      ].join(' ')}
      style={{ minHeight: effectiveHeight }}
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
      className="relative flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm"
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

      <div
        ref={wrapperRef}
        className={needsScroll ? 'relative -mx-4 overflow-x-auto px-4' : 'relative'}
      >
        <div
          className="relative"
          style={{ height: effectiveHeight, width: needsScroll ? `${Math.round(chartWidth)}px` : '100%' }}
        >
          <ResponsiveBar
            data={data as any[]}
            keys={seriesKeys}
            indexBy={idxKey}
            layout="horizontal"
           groupMode="stacked"
            indexScale={indexScale ?? { type: 'band', round: false, reverse: true }}
            enableLabel
            label={({ value }) => {
              const n = Number(value);
              if (!Number.isFinite(n) || n <= 3) return '';
              return `${Math.round(n)}%`;
            }}
            labelSkipWidth={16}
            labelSkipHeight={12}
            labelTextColor={labelColor}
            labelPosition="inside"
            labelOffset={0}
            margin={margin}
            padding={barPadding}
            colors={({ id }) => colorMap.get(String(id)) ?? bigColor}
            borderRadius={0}
            layers={barLayers}
            axisBottom={{ legend: axisBottomLegend, legendPosition: 'middle', legendOffset: axisBottomLegendOffset }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 12,
              tickValues: 'every 1',
            }}
            theme={{
              labels: { text: { fontFamily: fontSans, fontWeight: 600, fontSize: labelFontSize, fill: labelColor } },
              axis: {
                domain: { line: { stroke: borderColor } },
                ticks: { line: { stroke: borderColor }, text: { fill: mutedColor, fontFamily: fontSans, fontSize: axisFontSize } },
                legend: { text: { fill: mutedColor, fontFamily: fontSans, fontSize: axisFontSize } },
              },
              grid: { line: { stroke: borderColor, strokeWidth: 1 } },
              legends: { text: { fill: legendColor, fontFamily: fontSans, fontSize: legendFontSize } },
              tooltip: {
                container: {
                  fontFamily: fontSans,
                  border: `1px solid ${borderColor}`,
                  background: tooltipBg,
                  color: legendColor,
                },
              },
            }}
            legends={useInlineLegend ? [] : legendConfig}
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
      </div>
      {useInlineLegend && seriesKeys.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
          {seriesKeys.map((key) => (
            <span key={key} className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: colorMap.get(key) }} aria-hidden="true" />
              <span>{key}</span>
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex justify-end text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/60">
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
