'use client';

import { useEffect, useState, useMemo, useId, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { EChartsOption } from 'echarts';
import { csvParse, tsvParse } from 'd3-dsv';
import { downloadChartImage } from '@/lib/chart-export';
import { buildWatermarkGraphic } from '@/lib/chart-watermark';
import { Download } from 'lucide-react';
import { buildSeriesColorMap, chartPalette, pickHighlightIndexByTotals, pickHighlightSeriesIndex } from '@/lib/chart-palette';

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

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

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
  const chartRef = useRef<any>(null);
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

  const { data, idxKey, seriesKeys, diagnostics, scaleToPercent } = useMemo(() => {
    if (!raw.length)
      return {
        data: raw,
        idxKey: 'district',
        seriesKeys: [] as string[],
        diagnostics: { imbalances: [] as string[] },
        scaleToPercent: false,
      };

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
      scaleToPercent,
    };
  }, [raw, tolerancePct]);

  const fontSans = 'var(--font-sans, Inter, system-ui, sans-serif)';
  const borderColor = chartPalette.grid;
  const mutedColor = chartPalette.muted;
  const legendColor = chartPalette.ink;
  const tooltipBg = chartPalette.background;
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
  const longestLabelLength = useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((max, row) => {
      const str = String(row[idxKey] ?? '');
      return Math.max(max, str.length);
    }, 0);
  }, [data, idxKey]);

  const margin = useMemo(() => {
    const approxCharWidth = axisFontSize * 0.5;
    const estimatedLeft = Math.min(80, Math.max(20, longestLabelLength * approxCharWidth + 8));
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
  const axisBottomLegend = chartWidth && chartWidth < 360 ? 'Share (%)' : 'Share of Tea Area (%)';
  const axisBottomLegendOffset = chartWidth && chartWidth < 360 ? 34 : 40;

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
    const baseHeight = typeof height === 'number' ? height : minNeeded;
    return Math.max(baseHeight, minNeeded);
  }, [height, computedContentHeight, margin]);
  const showLabels = availableWidth >= 90;
  const yAxisInverse = typeof indexScale?.reverse === 'boolean' ? indexScale.reverse : true;
  const categories = useMemo(() => data.map((row) => String(row[idxKey] ?? '')), [data, idxKey]);
  const seriesValues = seriesKeys.map((key) =>
    data.map((row) => {
      const val = Number(row[key]);
      return Number.isFinite(val) ? val : 0;
    })
  );
  const highlightIndex = seriesKeys.length <= 3
    ? (pickHighlightSeriesIndex(seriesKeys) ?? pickHighlightIndexByTotals(seriesValues))
    : undefined;
  const seriesColorMap = buildSeriesColorMap(seriesKeys, highlightIndex);
  const chartColors = seriesKeys.map((key) => seriesColorMap[key]);
  const valueSuffix = scaleToPercent ? '%' : '';
  const chartOption = useMemo<EChartsOption>(() => {
    if (!seriesKeys.length) return {} as EChartsOption;
    const makeSeriesData = (key: string) =>
      data.map((row) => {
        const val = Number(row[key]);
        return Number.isFinite(val) ? val : 0;
      });

    const series = seriesKeys.map((key, idx) => ({
      name: key,
      type: 'bar' as const,
      stack: 'total',
      barMaxWidth: 36,
      emphasis: { focus: 'series' as const },
      itemStyle: { color: chartColors[idx] ?? chartPalette.seriesMuted[0] },
      label: {
        show: showLabels,
        color: chartPalette.background,
        fontFamily: fontSans,
        fontSize: labelFontSize,
        fontWeight: 600,
        formatter: (params: any) => {
          const n = Number(params?.value);
          if (!Number.isFinite(n) || n <= 3) return '';
          return `${Math.round(n)}${valueSuffix}`;
        },
      },
      data: makeSeriesData(key),
    }));

    return {
      color: chartColors,
      grid: {
        top: margin.top,
        right: margin.right,
        bottom: margin.bottom,
        left: margin.left,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: tooltipBg,
        borderColor,
        borderWidth: 1,
        padding: 10,
        textStyle: { color: legendColor, fontFamily: fontSans, fontSize: 12 },
        formatter: (params: any) => {
          const list = Array.isArray(params) ? params : [params];
          if (!list.length) return '';
          const idx = list[0]?.dataIndex ?? 0;
          const heading = categories[idx] ?? '';
          const rows = list
            .map((item: any) => {
              const n = Number(item?.value);
              const formatted = Number.isFinite(n) ? `${Math.round(n)}${valueSuffix}` : '-';
              return `<div>${item.marker || ''} ${item.seriesName}: ${formatted}</div>`;
            })
            .join('');
          return `<div style="margin-bottom:4px;font-weight:600;">${heading}</div>${rows}`;
        },
      },
      legend: seriesKeys.length
        ? {
            show: true,
            left: margin.left > 0 ? margin.left : 0,
            top: 0,
            textStyle: { color: legendColor, fontFamily: fontSans, fontSize: legendFontSize },
            itemGap: chartWidth && chartWidth < 540 ? 8 : 16,
            icon: 'roundRect',
          }
        : { show: false },
      xAxis: {
        type: 'value',
        name: axisBottomLegend,
        nameLocation: 'middle',
        nameGap: axisBottomLegendOffset,
        nameRotate: 0,
        nameTextStyle: { color: legendColor, fontFamily: fontSans, fontSize: axisFontSize, fontWeight: 700 },
        max: scaleToPercent ? 100 : undefined,
        axisLabel: {
          color: mutedColor,
          fontFamily: fontSans,
          fontSize: axisFontSize,
          formatter: (value: string | number) => {
            if (!scaleToPercent) return `${value}`;
            const numeric = Number(value);
            return Number.isFinite(numeric) ? `${numeric}%` : `${value}%`;
          },
        },
        axisLine: { lineStyle: { color: borderColor } },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: borderColor, opacity: 0.4 } },
      },
      yAxis: {
        type: 'category',
        inverse: yAxisInverse,
        data: categories,
        axisLabel: {
          show: true,
          color: mutedColor,
          fontFamily: fontSans,
          fontSize: axisFontSize,
          align: 'right',
          margin: 4,
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series,
      graphic: buildWatermarkGraphic(),
    };
  }, [
    seriesKeys,
    data,
    chartColors,
    showLabels,
    fontSans,
    labelFontSize,
    valueSuffix,
    margin.top,
    margin.right,
    margin.bottom,
    margin.left,
    tooltipBg,
    borderColor,
    legendColor,
    categories,
    legendFontSize,
    chartWidth,
    axisBottomLegend,
    axisBottomLegendOffset,
    scaleToPercent,
    mutedColor,
    axisFontSize,
    yAxisInverse,
  ]);

  const renderStatus = (message: string, variant: 'muted' | 'error' = 'muted') => (
    <div
      className={[
        'flex h-full items-center justify-center rounded-xl bg-transparent p-6 text-sm',
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

  const handleDownloadChart = () => {
    const instance = chartRef.current?.getEchartsInstance?.();
    if (!instance) return;
    downloadChartImage({
      instance,
      title: title || 'Chart',
      filename: (title || 'chart').replace(/\s+/g, '-').toLowerCase()
    });
  };

  return (
    <figure
      className="relative flex flex-col gap-6 m-0 w-full"
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
        style={
          chartWidth
            ? {
                marginLeft: margin.left ? `-${margin.left}px` : undefined,
                width: margin.left ? `calc(100% + ${margin.left}px)` : undefined,
              }
            : undefined
        }
      >
        <div
          ref={wrapperRef}
          className={needsScroll ? 'relative -mx-4 overflow-x-auto px-4' : 'relative'}
        >
          <div
            className="relative"
            style={{ height: effectiveHeight, width: needsScroll ? `${Math.round(chartWidth)}px` : '100%' }}
            role="img"
            aria-labelledby={titleId}
            aria-describedby={describedBy}
            aria-label="Stacked horizontal bar chart showing share of tea area by grower type and district"
          >
            <ReactECharts
              ref={chartRef}
              option={chartOption}
              notMerge
              lazyUpdate
              style={{ height: '100%', width: '100%' }}
            />
            <button
              type="button"
              onClick={handleDownloadChart}
              aria-label="Download chart"
              className="absolute bottom-2 right-2 rounded-md border border-border bg-background/95 p-2 text-foreground shadow-sm transition hover:bg-muted"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
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
