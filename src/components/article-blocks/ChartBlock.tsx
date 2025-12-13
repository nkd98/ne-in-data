
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Papa from 'papaparse';
import { getVisualById } from '@/lib/data';
import type { Visual } from '@/lib/types';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type Props = {
  visual?: Visual; // server-resolved visual (preferred)
  visualId?: string; // fallback id lookup
};

export function ChartBlock({ visual, visualId }: Props) {
  const resolvedVisual = visual ?? (visualId ? getVisualById(visualId) : undefined);
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const chartHeight = useMemo(() => {
    if (!resolvedVisual) return 420;
    const spec = resolvedVisual.spec || {};
    const normalize = (v: any) => typeof v === 'string' ? v.trim() : String(v ?? '');
    if (spec.facetField) {
      const facets = Array.isArray(spec.facetOrder) && spec.facetOrder.length > 0
        ? spec.facetOrder.map(normalize)
        : Array.from(new Set(rows.map(r => normalize(r[spec.facetField]))));
      const perFacetHeight = spec.facetHeight ?? 140;
      const gap = (spec.facetGap ?? 36) + 8;
      const baseTop = 48;
      const bottomPad = spec.facetBottomPad ?? 48;
      const totalHeight = baseTop + facets.length * (perFacetHeight + gap) + bottomPad;
      return spec.height ? Math.max(spec.height, totalHeight) : Math.max(360, totalHeight);
    }
    return spec.height ?? 420;
  }, [resolvedVisual, rows]);

  useEffect(() => {
    if (!resolvedVisual) return;
    const dataUrl = resolvedVisual.spec?.dataUrl;
    const { x, y, stacks, stackField, valueField, seriesField, seriesValueFields } = resolvedVisual.spec || {};
    const hasSeriesField = Boolean(seriesField);
    const hasSeriesValueAccessor = Boolean(y) || (hasSeriesField && seriesValueFields && typeof seriesValueFields === 'object');

    if (!dataUrl || !x || (!y && !stacks && !hasSeriesField)) {
      setError('Invalid visual configuration');
      return;
    }
    if (hasSeriesField && !hasSeriesValueAccessor) {
      setError('Invalid visual configuration');
      return;
    }

    let mounted = true;
    fetch(dataUrl)
      .then(r => r.text())
      .then(csv => Papa.parse(csv, { header: true, dynamicTyping: true }).data)
      .then(parsed => {
        if (!mounted) return;
        let filtered: any[] = [];
        if (stacks && Array.isArray(stacks)) {
          if (stackField && valueField) {
            // Pivot long-form data into wide form for stacking
            const pivot = new Map<string, any>();
            parsed.forEach((row: any) => {
              const category = row[x];
              const stackKey = row[stackField];
              const value = row[valueField];
              if (category == null || stackKey == null || value == null) return;
              if (!stacks.includes(String(stackKey))) return;
              const key = String(category);
              const current = pivot.get(key) ?? { [x]: key };
              current[String(stackKey)] = value;
              pivot.set(key, current);
            });
            filtered = Array.from(pivot.values());
          } else {
            filtered = parsed.filter((d: any) => d[x] != null && stacks.every((s: string) => d[s] != null && d[s] !== ''));
          }
        } else if (hasSeriesField) {
          filtered = parsed.filter((d: any) => {
            const category = d[x];
            const seriesValue = d[seriesField as string];
            if (category == null || seriesValue == null) return false;
            const specificValueKey = (seriesValueFields as Record<string, string> | undefined)?.[String(seriesValue)];
            const hasYValue = y && d[y] !== '' && d[y] != null;
            const valueKey = hasYValue ? y : specificValueKey;
            if (!valueKey) return false;
            const value = d[valueKey];
            return value != null && value !== '';
          });
        } else {
          filtered = parsed.filter((d: any) => d[x] != null && d[y] != null);
        }
        setRows(filtered);
      })
      .catch(err => {
        console.error(err);
        if (mounted) setError(String(err));
      });

    return () => {
      mounted = false;
    };
  }, [resolvedVisual]);

  const option = useMemo(() => {
    if (!resolvedVisual) return {};
    const {
      x,
      y,
      stacks,
      stackLabels,
      colors,
      yLabel,
      stacked,
      categoryOrder,
      facetField,
      facetOrder,
      facetLabels,
      facetHeight,
      facetGap,
      highlightCategories,
      highlightColor,
      categoryLabels,
      seriesField,
      seriesValueFields,
      seriesLabels,
      symbolField,
      symbolMap,
      colorField,
      labelField,
      labelFilterField,
      xLabel,
      yCategoryOrder,
      yCategoryLabels,
      pointSize,
      annotateAlwaysField,
      jitterPx,
      jitterYPx,
      symbolSizeMap,
    } = resolvedVisual.spec || {};
    const hasSeriesField = Boolean(seriesField);
    const categoryLabelMap = (categoryLabels as Record<string, string>) || {};
    const normalizeCategory = (v: any) => typeof v === 'string' ? v.trim() : String(v ?? '');

    let orderedRows = rows;
    if (categoryOrder && Array.isArray(categoryOrder) && categoryOrder.length > 0) {
      const orderMap = new Map<string, number>();
      categoryOrder.forEach((cat: string, idx: number) => orderMap.set(normalizeCategory(cat), idx));
      orderedRows = [...rows].sort((a, b) => {
        const aKey = orderMap.get(normalizeCategory(a[x])) ?? Number.MAX_SAFE_INTEGER;
        const bKey = orderMap.get(normalizeCategory(b[x])) ?? Number.MAX_SAFE_INTEGER;
        return aKey - bKey;
      });
    }

    const categories = orderedRows.map(r => normalizeCategory(r[x]));
    const isStacked = stacked !== false; // default true when stacks are present

    const parseNum = (v: any) => {
      if (v == null) return 0;
      const s = String(v).replace(/%/g, '').replace(/,/g, '').trim();
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    };

    if (stacks && Array.isArray(stacks) && resolvedVisual.type === 'bar') {
      const series = (stacks as string[]).map(stack => {
        const data = orderedRows.map((r: Record<string, any>) => {
          const value = parseNum(r[stack]);
          if (!isStacked) return value;
          const total = (stacks as string[]).reduce((sum: number, s: string) => sum + parseNum(r[s]), 0) || 1;
          return (value / total) * 100;
        });
        return {
          name: (stackLabels as Record<string, string>)?.[stack] || stack,
          type: 'bar',
          stack: isStacked ? 'total' : undefined,
          emphasis: { focus: 'series' },
          data,
          itemStyle: { color: (colors as Record<string, string>)?.[stack] },
          barGap: isStacked ? '10%' : '0%',
          barCategoryGap: isStacked ? '20%' : '35%',
        };
      });

      return {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
            const idx = params[0]?.dataIndex ?? 0;
            const cat = categories[idx] ?? '';
            const rowsText = params
              .map((p: any) => `${p.seriesName}: ${isStacked ? p.value.toFixed(1) + '%' : p.value}`)
              .join('<br/>');
            return `${cat}<br/>${rowsText}`;
          }
        },
        legend: { top: 8, data: (stacks as string[]).map(s => (stackLabels as Record<string, string>)?.[s] || s) },
        grid: { top: 48, right: 24, bottom: 120, left: 80 },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: { interval: 0, rotate: 90, align: 'right', verticalAlign: 'middle' }
        },
        yAxis: {
          type: 'value',
          name: yLabel,
          nameLocation: 'middle',
          nameRotate: 90,
          nameGap: 60,
          nameTextStyle: { align: 'center', verticalAlign: 'middle' },
          axisLabel: { formatter: isStacked ? '{value}%' : '{value}' },
          max: isStacked ? 100 : undefined
        },
        series
      };
    }

    if (facetField && resolvedVisual.type === 'bar') {
      const facetValues = Array.isArray(facetOrder) && facetOrder.length > 0
        ? facetOrder.map(normalizeCategory)
        : Array.from(new Set(orderedRows.map(r => normalizeCategory(r[facetField]))));
      const labelMap = (facetLabels as Record<string, string>) || {};
      const highlightSet = new Set(((highlightCategories as string[]) || []).map(normalizeCategory));
      const categoryLabelMap = (categoryLabels as Record<string, string>) || {};
      const baseColor = (colors as Record<string, string>)?.default || '#2B3C63';
      const specialColor = (colors as Record<string, string>)?.highlight || highlightColor || '#d1434b';
      const gridPaddingTop = 32;
      const perFacetHeight = facetHeight ?? 140;
      const gap = (facetGap ?? 32) + 8;
      const titleOffset = 18;
      const longestLabelLength = orderedRows.reduce((max, row) => {
        const cat = normalizeCategory(row[x]);
        const lbl = categoryLabelMap[cat] || cat;
        return Math.max(max, lbl.length);
      }, 0);
      const facetLeft = Math.min(130, Math.max(88, longestLabelLength * 6.5));
      const grids: any[] = [];
      const xAxes: any[] = [];
      const yAxes: any[] = [];
      const series: any[] = [];
      const titles: any[] = [];

      const maxValue = (() => {
        const max = orderedRows.reduce((m, row) => Math.max(m, parseNum(row[y])), 0);
        if (max <= 0) return 0;
        const padded = max * 1.02 + 2;
        return Math.ceil(padded / 10) * 10;
      })();

      facetValues.forEach((facetValue: string, idx: number) => {
        const facetRows = orderedRows.filter(r => normalizeCategory(r[facetField]) === facetValue);
        const sortedRows = [...facetRows].sort((a, b) => parseNum(b[y]) - parseNum(a[y]));
        const cats = sortedRows.map(r => normalizeCategory(r[x]));
        const data = sortedRows.map(r => {
          const cat = normalizeCategory(r[x]);
          const displayLabel = categoryLabelMap[cat] || cat;
          const val = parseNum(r[y]);
          const isHighlight = highlightSet.has(cat);
          const color = (colors as Record<string, string>)?.[cat] || (isHighlight ? specialColor : baseColor);
          return { value: val, name: displayLabel, itemStyle: { color } };
        });
        const displayCats = cats.map(cat => categoryLabelMap[cat] || cat);
        const top = gridPaddingTop + idx * (perFacetHeight + gap) + titleOffset;
        grids.push({ top, height: perFacetHeight, left: facetLeft, right: 24 });
        xAxes.push({
          type: 'value',
          gridIndex: idx,
          name: idx === facetValues.length - 1 ? yLabel : '',
          nameLocation: 'middle',
          nameGap: 28,
          min: 0,
          max: maxValue || undefined,
          axisLine: { show: true },
          axisLabel: { formatter: '{value}' },
        });
        yAxes.push({
          type: 'category',
          gridIndex: idx,
          data: displayCats,
          inverse: true,
          axisLabel: { interval: 0, fontSize: 12 },
        });
        series.push({
          name: labelMap[facetValue] || facetValue,
          type: 'bar',
          xAxisIndex: idx,
          yAxisIndex: idx,
          data,
          barWidth: '55%',
          emphasis: { focus: 'series' },
        });
        titles.push({
          text: labelMap[facetValue] || facetValue,
          left: facetLeft,
          top: Math.max(0, top - titleOffset),
          textStyle: { fontSize: 12, fontWeight: 600, color: '#111' },
        });
      });

      return {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          formatter: (p: any) => `${p.name}: ${p.value}`
        },
        grid: grids,
        xAxis: xAxes,
        yAxis: yAxes,
        series,
        title: titles,
      };
    }

    if (hasSeriesField && resolvedVisual.type === 'line') {
      const seriesNames = Array.isArray(seriesValueFields) ? seriesValueFields : Object.keys(seriesValueFields || {});
      const uniqueSeries = seriesNames.length > 0
        ? seriesNames.map(normalizeCategory)
        : Array.from(new Set(orderedRows.map(r => normalizeCategory(r[seriesField]))));
      const categoriesLine = Array.isArray(categoryOrder) && categoryOrder.length > 0
        ? categoryOrder.map(normalizeCategory)
        : Array.from(new Set(orderedRows.map(r => normalizeCategory(r[x]))));
      const getRow = (cat: string, seriesName: string) =>
        orderedRows.find(r => normalizeCategory(r[x]) === cat && normalizeCategory(r[seriesField]) === seriesName);

      const lineSeries = uniqueSeries.map(seriesName => {
        const valueKeyFromSpec = (seriesValueFields as Record<string, string> | undefined)?.[seriesName];
        const displayName = (seriesLabels as Record<string, string> | undefined)?.[seriesName] || seriesName;
        const data = categoriesLine.map(cat => {
          const row = getRow(cat, seriesName);
          if (!row) return null;
          const hasYVal = y && row[y] !== '' && row[y] != null;
          const key = hasYVal ? y : valueKeyFromSpec;
          const val = key ? parseNum(row[key]) : null;
          return Number.isFinite(val) ? val : null;
        });
        return {
          name: displayName,
          type: 'line',
          smooth: true,
          data,
          itemStyle: { color: (colors as Record<string, string>)?.[seriesName] },
          lineStyle: { width: 3 },
        };
      });

      return {
        backgroundColor: '#fff',
        tooltip: { trigger: 'axis' },
        legend: { top: 8, data: lineSeries.map(s => s.name) },
        grid: { top: 48, right: 24, bottom: 96, left: 80 },
        xAxis: {
          type: 'category',
          data: categoriesLine,
          axisTick: { alignWithLabel: true },
          axisLabel: {
            interval: 0,
            rotate: 45,
            formatter: (val: string) => categoryLabelMap[val] || val,
            margin: 12,
          }
        },
        yAxis: {
          type: 'value',
          name: yLabel,
          nameLocation: 'middle',
          nameRotate: 90,
          nameGap: 60,
          nameTextStyle: { align: 'center', verticalAlign: 'middle' }
        },
        series: lineSeries
      };
    }

    if (resolvedVisual.type === 'scatter') {
      const isNarrow = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
      const yOrder = Array.isArray(yCategoryOrder) && yCategoryOrder.length > 0
        ? yCategoryOrder.map(normalizeCategory)
        : Array.from(new Set(orderedRows.map(r => normalizeCategory(r[y]))));
      const yLabelMap = (yCategoryLabels as Record<string, string>) || (categoryLabels as Record<string, string>) || {};
      const colorMap = (colors as Record<string, string>) || {};
      const colorFieldName = colorField as string | undefined;
      const symbolFieldName = symbolField as string | undefined;
      const symbolLookup = (symbolMap as Record<string, string>) || {};
      const symbolSizeLookup = (symbolSizeMap as Record<string, number>) || {};
      const basePointSize = pointSize ?? 12;
      const jitterAmount = jitterPx ?? 0;
      const jitterYAmount = jitterYPx ? Number(jitterYPx) : 0;
      const normalizeSymbolKey = (v: any) => {
        if (typeof v === 'boolean') return v ? 'true' : 'false';
        const s = String(v).trim().toLowerCase();
        if (['true', '1', 'yes'].includes(s)) return 'true';
        if (['false', '0', 'no'].includes(s)) return 'false';
        return s;
      };

      const grouped = new Map<string, any[]>();
      orderedRows.forEach(row => {
        const groupKey = colorFieldName ? normalizeCategory(row[colorFieldName]) : 'Series';
        grouped.set(groupKey, [...(grouped.get(groupKey) || []), row]);
      });

      const series = Array.from(grouped.entries()).map(([groupName, groupRows]) => {
        const symKey = symbolFieldName
          ? normalizeSymbolKey(groupRows[0]?.[symbolFieldName])
          : normalizeCategory(groupName) === normalizeCategory('All India') ? 'true' : 'false';
        const seriesSymbol = symbolLookup[symKey] || 'circle';
        const seriesSize = symbolSizeLookup[symKey] || basePointSize;
        const seriesColor = colorMap[groupName] || colorMap.default || '#2B3C63';

        const data = groupRows.map(row => {
          const xVal = parseNum(row[x]);
          const rawY = normalizeCategory(row[y]);
          const jitterX = jitterAmount ? (Math.random() * 2 - 1) * jitterAmount : 0;
          const jitterY = jitterYAmount ? (Math.random() * 2 - 1) * jitterYAmount : 0;

          return {
            value: [xVal + jitterX, rawY],
            symbolOffset: [0, jitterY],
            raw: row,
          };
        });

        return {
          name: groupName,
          type: 'scatter',
          symbol: seriesSymbol,
          symbolSize: seriesSize,
          data,
          itemStyle: { color: seriesColor },
          emphasis: { focus: 'series', scale: true },
        };
      });

      const legendItems = Array.from(grouped.keys()).map(groupName => {
        const symKey = symbolFieldName
          ? normalizeSymbolKey(grouped.get(groupName)?.[0]?.[symbolFieldName])
          : normalizeCategory(groupName) === normalizeCategory('All India') ? 'true' : 'false';
        return { name: groupName, icon: symbolLookup[symKey] || 'circle' };
      });

      const maxX = orderedRows.reduce((m, row) => {
        const val = parseNum(row[x]);
        return Number.isFinite(val) ? Math.max(m, val) : m;
      }, 0);
      const paddedMaxX = maxX > 0 ? Math.ceil((maxX * 1.02 + 2) / 10) * 10 : undefined;
      const legendBase = {
        show: true,
        type: 'scroll',
        itemWidth: 12,
        itemHeight: 12,
        selectedMode: false,
        textStyle: { color: '#111', fontSize: isNarrow ? 10 : 12 },
      };
      const mobileLegends = (() => {
        if (!legendItems.length || !isNarrow) return undefined;
        const mid = Math.ceil(legendItems.length / 2);
        const first = legendItems.slice(0, mid);
        const second = legendItems.slice(mid);
        return [
          { ...legendBase, orient: 'horizontal', top: 8, left: 12, right: 12, data: first },
          { ...legendBase, orient: 'horizontal', top: 32, left: 12, right: 12, data: second }
        ];
      })();

      return {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          formatter: (p: any) => {
            const data = p?.data?.raw || {};
            const stageRaw = normalizeCategory(data[y]);
            const stageLabel = yLabelMap[stageRaw] || stageRaw;
            const stateLabel = labelField ? data[labelField] : colorFieldName ? data[colorFieldName] : '';
            const val = parseNum(data[x]);
            return `${stateLabel || 'Value'} — ${stageLabel}<br/>GER: ${val}`;
          }
        },
        grid: isNarrow
          ? { top: legendItems.length ? 72 : 56, right: 12, bottom: 84, left: 86 }
          : { top: 64, right: legendItems.length ? 140 : 28, bottom: 64, left: 128 },
        legend: legendItems.length
          ? isNarrow
            ? mobileLegends
            : { ...legendBase, orient: 'vertical', top: 32, right: 12, data: legendItems }
          : undefined,
        xAxis: {
          type: 'value',
          name: xLabel || yLabel || x,
          nameLocation: 'middle',
          nameGap: 32,
          axisLabel: { formatter: '{value}', fontSize: isNarrow ? 9 : 12, hideOverlap: true },
          min: 0,
          max: paddedMaxX,
          splitLine: { show: true },
        },
        yAxis: {
          type: 'category',
          data: yOrder,
          axisLabel: { formatter: (val: string) => yLabelMap[val] || val, fontSize: isNarrow ? 10 : 12 },
          name: yLabel,
          nameLocation: 'start',
          nameGap: isNarrow ? 8 : 12,
        },
        series
      };
    }

    // default single-series (line or bar)
    const seriesData = orderedRows.map(r => {
      const v = y ? r[y] : null;
      return typeof v === 'number' ? v : parseNum(v);
    });
    const series = [
      {
        name: yLabel || y,
        type: resolvedVisual.type === 'table' ? 'line' : resolvedVisual.type,
        data: seriesData,
        smooth: resolvedVisual.type === 'line'
      }
    ];

    return {
      backgroundColor: '#fff',
      tooltip: { trigger: 'axis' },
      legend: { top: 8 },
      toolbox: { right: 16, feature: { saveAsImage: { pixelRatio: 2 } } },
      grid: { top: 48, right: 24, bottom: 120, left: 80 },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { interval: 0, rotate: 90, align: 'right', verticalAlign: 'middle' }
      },
      yAxis: {
        type: 'value',
        name: yLabel,
        nameLocation: 'middle',
        nameRotate: 45,
        nameGap: 60,
        nameTextStyle: { align: 'center', verticalAlign: 'middle' }
      },
      series
    };
  }, [rows, resolvedVisual]);

  if (!resolvedVisual) return <div>Chart configuration missing — pass a `visual` prop from the server or a valid visualId.</div>;

  return (
    <figure className="not-prose mx-auto my-6 max-w-4xl px-3">
      <figcaption className="mb-2">
        <div className="text-lg font-semibold text-foreground">{resolvedVisual.title}</div>
        {resolvedVisual.caption && <div className="text-sm text-muted-foreground">{resolvedVisual.caption}</div>}
      </figcaption>

      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : rows.length === 0 ? (
        <div>Loading data…</div>
      ) : (
        <ReactECharts option={option} notMerge lazyUpdate style={{ width: '100%', height: chartHeight }} />
      )}

      {resolvedVisual.source && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          <b>Source:</b>{' '}
          {resolvedVisual.source.url ? (
            <a href={resolvedVisual.source.url} target="_blank" rel="noreferrer">
              {resolvedVisual.source.name || resolvedVisual.source.url}
            </a>
          ) : (
            resolvedVisual.source.name
          )}
          {resolvedVisual.spec?.dataUrl && (
             <>
              {' • '}
              <a href={resolvedVisual.spec.dataUrl} download>
                Download CSV
              </a>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}
