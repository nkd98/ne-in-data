
'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import Papa from 'papaparse';
import { getVisualById } from '@/lib/data';
import type { Visual } from '@/lib/types';
import { downloadChartImage } from '@/lib/chart-export';
import { buildWatermarkGraphic } from '@/lib/chart-watermark';
import { Download } from 'lucide-react';
import { buildSeriesColorMap, chartPalette, pickHighlightIndexByTotals, pickHighlightSeriesIndex } from '@/lib/chart-palette';
import {
  buildAxisLabelStyle,
  buildAxisTitleStyle,
  buildLegendTextStyle,
  buildTooltipStyle,
  chartAxisLineStyle,
  chartFontFamily,
  chartSplitLineStyle,
  chartTextStyle,
} from '@/lib/chart-theme';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

type Props = {
  visual?: Visual; // server-resolved visual (preferred)
  visualId?: string; // fallback id lookup
};

export function ChartBlock({ visual, visualId }: Props) {
  const resolvedVisual = visual ?? (visualId ? getVisualById(visualId) : undefined);
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<any>(null);
  const watermarkPad = 0;
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
      const bottomPad = (spec.facetBottomPad ?? 48) + watermarkPad;
      const totalHeight = baseTop + facets.length * (perFacetHeight + gap) + bottomPad;
      return spec.height ? Math.max(spec.height, totalHeight) : Math.max(360, totalHeight);
    }
    return spec.height ?? 420;
  }, [resolvedVisual, rows, watermarkPad]);

  useEffect(() => {
    if (!resolvedVisual) return;
    setError(null);
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
    const fetchCsvText = async () => {
      try {
        const directResponse = await fetch(dataUrl);
        if (directResponse.ok) {
          return directResponse.text();
        }
      } catch (err) {
        console.warn('Direct chart data fetch failed, falling back to proxy.', err);
      }
      const proxyUrl = `/api/visual-data?url=${encodeURIComponent(dataUrl)}`;
      const proxyResponse = await fetch(proxyUrl);
      if (!proxyResponse.ok) {
        throw new Error(`Failed to fetch data (${proxyResponse.status})`);
      }
      return proxyResponse.text();
    };

    fetchCsvText()
      .then(csv => Papa.parse(csv, { header: true, dynamicTyping: true }).data)
      .then(parsed => {
        if (!mounted) return;
        const normalizeKey = (key: string) => key.replace(/\uFEFF/g, '').trim();
        const normalizeField = (key: string) =>
          normalizeKey(key).toLowerCase().replace(/[^a-z0-9]+/g, '');
        const normalized = (parsed as Record<string, any>[]).map((row) => {
          const next: Record<string, any> = {};
          Object.entries(row || {}).forEach(([key, value]) => {
            const cleanedKey = normalizeKey(key);
            if (!cleanedKey) return;
            next[cleanedKey] = value;
          });
          return next;
        });
        const availableKeys = normalized[0] ? Object.keys(normalized[0]) : [];
        const resolveKey = (target?: string) => {
          if (!target) return undefined;
          const normalizedTarget = normalizeField(target);
          const matched = availableKeys.find((key) => normalizeField(key) === normalizedTarget);
          return matched || target;
        };
        const desiredKeys = new Set<string>();
        const spec = resolvedVisual.spec || {};
        [
          spec.x,
          spec.y,
          spec.stackField,
          spec.valueField,
          spec.seriesField,
          spec.symbolField,
          spec.colorField,
          spec.labelField,
          spec.labelFilterField,
          spec.facetField,
          spec.meanField,
          spec.binStartField,
          spec.binEndField,
        ].forEach((key) => {
          if (typeof key === 'string' && key) desiredKeys.add(key);
        });
        if (Array.isArray(spec.stacks)) {
          spec.stacks.forEach((key: string) => desiredKeys.add(key));
        }
        const seriesValueFieldMap = spec.seriesValueFields as Record<string, string> | undefined;
        if (seriesValueFieldMap && typeof seriesValueFieldMap === 'object') {
          Object.values(seriesValueFieldMap).forEach((key) => desiredKeys.add(key));
        }
        const keyMap = new Map<string, string>();
        desiredKeys.forEach((key) => {
          const resolvedKey = resolveKey(key);
          if (resolvedKey) keyMap.set(key, resolvedKey);
        });
        const alignedRows = normalized.map((row) => {
          const next = { ...row };
          keyMap.forEach((resolvedKey, desiredKey) => {
            if (!(desiredKey in next) && resolvedKey in next) {
              next[desiredKey] = next[resolvedKey];
            }
          });
          return next;
        });
        let filtered: any[] = [];
        if (stacks && Array.isArray(stacks)) {
          if (stackField && valueField) {
            // Pivot long-form data into wide form for stacking
            const pivot = new Map<string, any>();
            alignedRows.forEach((row: any) => {
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
            filtered = alignedRows.filter((d: any) => d[x] != null && stacks.every((s: string) => d[s] != null && d[s] !== ''));
          }
        } else if (hasSeriesField) {
          filtered = alignedRows.filter((d: any) => {
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
          filtered = alignedRows.filter((d: any) => d[x] != null && d[y] != null);
        }
        setRows(filtered);
      })
      .catch(err => {
        console.error(err);
        if (mounted) setError('Failed to fetch data');
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
      yLabel,
      stacked,
      categoryOrder,
      facetField,
      facetOrder,
      facetLabels,
      facetHeight,
      facetGap,
      highlightCategories,
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
      xCategoryOrder,
      xCategoryLabels,
      pointSize,
      xLabelRotate,
      xLabelInterval,
      legendTop,
      legendLeft,
      gridTop,
      gridBottom,
      watermarkTop,
      watermarkRight,
      annotateAlwaysField,
      jitterPx,
      jitterYPx,
      symbolSizeMap,
      area,
      meanField,
      binStartField,
      binEndField,
      barGap,
      barCategoryGap,
      barBorder,
      colorMode,
      swapAxes,
      gridLeft,
      showValueLabels,
      valueLabelPosition,
      valueLabelMin,
      valueLabelPrecision,
      valueLabelColor,
      valueLabelFontSize,
      highlightSeries,
      highlightSeriesColors,
      mutedSeriesColor,
      mutedSeriesOpacity,
      highlightSeriesWidth,
      mutedSeriesWidth,
      muteNonHighlighted,
      highlightSymbolSize,
      mutedSymbolSize,
      legendOnlyHighlighted,
    } = resolvedVisual.spec || {};
    const formatFieldLabel = (value?: string) => {
      if (!value) return '';
      return value
        .replace(/[_-]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase());
    };
    const withUnits = (label?: string, units?: string) => {
      if (!label) return units || '';
      if (!units) return label;
      const lowerLabel = label.toLowerCase();
      const lowerUnits = units.toLowerCase();
      if (lowerLabel.includes(lowerUnits)) return label;
      if (label.includes('(') || label.includes('[')) return label;
      return `${label} (${units})`;
    };
    const xAxisTitle = xLabel || formatFieldLabel(x);
    const yAxisTitle = withUnits(yLabel || formatFieldLabel(y), resolvedVisual.units);
    const useMultiColor = colorMode === 'multi';
    const seriesPalette = useMultiColor ? chartPalette.seriesMulti : chartPalette.seriesMuted;
    const isNarrow = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
    const axisTitleStyle = buildAxisTitleStyle();
    const axisLabelStyle = buildAxisLabelStyle(isNarrow ? 10 : 12);
    const legendTextStyle = buildLegendTextStyle(isNarrow ? 10 : 12);
    const tooltipStyle = buildTooltipStyle(isNarrow ? 10 : 12);
    const axisLineStyle = chartAxisLineStyle;
    const splitLineStyle = chartSplitLineStyle;
    const baseWatermark = buildWatermarkGraphic({ top: isNarrow ? 48 : 32 });
    const baseOption = { backgroundColor: chartPalette.background, textStyle: chartTextStyle };
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
    const categoryLabelFormatter = (value: any) => {
      const key = normalizeCategory(value);
      return categoryLabelMap[key] || value;
    };

    const parseNum = (v: any) => {
      if (v == null) return 0;
      const s = String(v).replace(/%/g, '').replace(/,/g, '').trim();
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    };

    if (stacks && Array.isArray(stacks) && resolvedVisual.type === 'bar') {
      const horizontal = Boolean((resolvedVisual.spec || {}).horizontal);
      const labelMin = typeof valueLabelMin === 'number' ? valueLabelMin : undefined;
      const labelPrecision = typeof valueLabelPrecision === 'number'
        ? valueLabelPrecision
        : isStacked
          ? 0
          : 0;
      const labelColor = typeof valueLabelColor === 'string' ? valueLabelColor : chartPalette.ink;
      const labelFontSize = typeof valueLabelFontSize === 'number' ? valueLabelFontSize : (isNarrow ? 9 : 10);
      const legendItems = (stacks as string[]).map(
        (s) => (stackLabels as Record<string, string>)?.[s] || s
      );
      const barLegendTop = 8;
      const barWatermarkTop = isNarrow ? 40 : 32;
      const barGridTop = isNarrow ? 72 : 48;
      const barGridLeft = typeof gridLeft === 'number' ? gridLeft : 80;
      const barWatermark = buildWatermarkGraphic({ top: barWatermarkTop });
      const valueLabelConfig = showValueLabels
        ? {
            show: true,
            position: valueLabelPosition || (horizontal ? 'insideRight' : 'insideTop'),
            formatter: (params: any) => {
              const val = Number(params?.value);
              if (!Number.isFinite(val)) return '';
              if (labelMin != null && val < labelMin) return '';
              const rounded = labelPrecision > 0 ? val.toFixed(labelPrecision) : String(Math.round(val));
              return isStacked ? `${rounded}%` : rounded;
            },
            color: labelColor,
            fontSize: labelFontSize,
            fontWeight: 600,
            fontFamily: chartFontFamily,
          }
        : undefined;
      const stackKeys = stacks as string[];
      const stackValues = stackKeys.map((stack) =>
        orderedRows.map((row: Record<string, any>) => parseNum(row[stack]))
      );
      const stackHighlightIndex = stackKeys.length <= 3
        ? (pickHighlightSeriesIndex(stackKeys) ?? pickHighlightIndexByTotals(stackValues))
        : undefined;
      const colorOverrides = (resolvedVisual.spec?.colors as Record<string, string>) || {};
      const stackColorMap = buildSeriesColorMap(stackKeys, stackHighlightIndex, seriesPalette);
      const series = stackKeys.map(stack => {
        const data = orderedRows.map((r: Record<string, any>) => {
          const value = parseNum(r[stack]);
          if (!isStacked) return value;
          const total = stackKeys.reduce((sum: number, s: string) => sum + parseNum(r[s]), 0) || 1;
          return (value / total) * 100;
        });
        return {
          name: (stackLabels as Record<string, string>)?.[stack] || stack,
          type: 'bar',
          stack: isStacked ? 'total' : undefined,
          emphasis: { focus: 'series' },
          data,
          itemStyle: { color: colorOverrides[stack] || stackColorMap[stack] },
          label: valueLabelConfig,
          barGap: isStacked ? '10%' : '0%',
          barCategoryGap: isStacked ? '20%' : '35%',
        };
      });

      return {
        ...baseOption,
        tooltip: {
          ...tooltipStyle,
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
        legend: { top: barLegendTop, data: legendItems, textStyle: legendTextStyle },
        grid: horizontal
          ? { top: barGridTop, right: 24 + watermarkPad, bottom: 48 + watermarkPad, left: barGridLeft }
          : { top: barGridTop, right: 24 + watermarkPad, bottom: 120 + watermarkPad, left: barGridLeft },
        xAxis: horizontal
          ? {
              type: 'value',
              name: yAxisTitle,
              nameLocation: 'middle',
              nameGap: 50,
              nameRotate: 0,
              nameTextStyle: axisTitleStyle,
              axisLabel: { formatter: isStacked ? '{value}%' : '{value}', ...axisLabelStyle },
              axisLine: axisLineStyle,
              splitLine: splitLineStyle,
              max: isStacked ? 100 : undefined,
            }
          : {
              type: 'category',
              data: categories,
              name: xAxisTitle,
              nameLocation: 'middle',
              nameGap: 72,
              nameRotate: 0,
              nameTextStyle: axisTitleStyle,
              axisLabel: {
                interval: 0,
                rotate: 90,
                align: 'right',
                verticalAlign: 'middle',
                formatter: categoryLabelFormatter,
                ...axisLabelStyle
              },
              axisLine: axisLineStyle,
            },
        yAxis: horizontal
          ? {
              type: 'category',
              data: categories,
              axisLabel: { interval: 0, formatter: categoryLabelFormatter, ...axisLabelStyle },
              axisLine: axisLineStyle,
            }
          : {
              type: 'value',
              name: yAxisTitle,
              nameLocation: 'middle',
              nameRotate: 90,
              nameGap: 60,
              nameTextStyle: { ...axisTitleStyle, align: 'center', verticalAlign: 'middle' },
              axisLabel: { formatter: isStacked ? '{value}%' : '{value}', ...axisLabelStyle },
              axisLine: axisLineStyle,
              splitLine: splitLineStyle,
              max: isStacked ? 100 : undefined,
            },
        series,
        graphic: barWatermark
      };
    }

    if (facetField && resolvedVisual.type === 'bar') {
      const facetValues = Array.isArray(facetOrder) && facetOrder.length > 0
        ? facetOrder.map(normalizeCategory)
        : Array.from(new Set(orderedRows.map(r => normalizeCategory(r[facetField]))));
      const labelMap = (facetLabels as Record<string, string>) || {};
      const highlightSet = new Set(((highlightCategories as string[]) || []).map(normalizeCategory));
      const categoryLabelMap = (categoryLabels as Record<string, string>) || {};
      const baseColor = chartPalette.seriesMuted[1] || chartPalette.ink;
      const specialColor = chartPalette.accent;
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
          const color = isHighlight ? specialColor : baseColor;
          return { value: val, name: displayLabel, itemStyle: { color } };
        });
        const displayCats = cats.map(cat => categoryLabelMap[cat] || cat);
        const top = gridPaddingTop + idx * (perFacetHeight + gap) + titleOffset;
        grids.push({ top, height: perFacetHeight, left: facetLeft, right: 24 + watermarkPad });
        xAxes.push({
          type: 'value',
          gridIndex: idx,
          name: idx === facetValues.length - 1 ? yAxisTitle : '',
          nameLocation: 'middle',
          nameGap: 28,
          nameRotate: 0,
          nameTextStyle: axisTitleStyle,
          min: 0,
          max: maxValue || undefined,
          axisLine: axisLineStyle,
          axisLabel: { formatter: '{value}', ...axisLabelStyle },
          splitLine: splitLineStyle,
        });
        yAxes.push({
          type: 'category',
          gridIndex: idx,
          data: displayCats,
          inverse: true,
          axisLabel: { interval: 0, ...axisLabelStyle },
          axisLine: axisLineStyle,
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
          textStyle: { fontSize: 12, fontWeight: 600, color: chartPalette.ink, fontFamily: chartFontFamily },
        });
      });

      return {
        ...baseOption,
        tooltip: {
          ...tooltipStyle,
          trigger: 'item',
          formatter: (p: any) => `${p.name}: ${p.value}`
        },
        grid: grids,
        xAxis: xAxes,
        yAxis: yAxes,
        series,
        title: titles,
        graphic: baseWatermark
      };
    }

    if (hasSeriesField && resolvedVisual.type === 'line') {
      const areaEnabled = Boolean(area);
      const seriesNames = Array.isArray(seriesValueFields) ? seriesValueFields : Object.keys(seriesValueFields || {});
      const uniqueSeries = seriesNames.length > 0
        ? seriesNames.map(normalizeCategory)
        : Array.from(new Set(orderedRows.map(r => normalizeCategory(r[seriesField]))));
      const categoriesLine = Array.isArray(categoryOrder) && categoryOrder.length > 0
        ? categoryOrder.map(normalizeCategory)
        : Array.from(new Set(orderedRows.map(r => normalizeCategory(r[x]))));
      const displayCategoriesLine = categoriesLine.map(cat => categoryLabelMap[cat] || cat);
      const maxLabelLength = displayCategoriesLine.reduce((max, label) => Math.max(max, label.length), 0);
      const forcedRotation = typeof xLabelRotate === 'number' ? xLabelRotate : null;
      const xLabelRotation = forcedRotation ?? (maxLabelLength > 14 ? 35 : maxLabelLength > 10 ? 20 : 0);
      const lineGridBottom = typeof gridBottom === 'number'
        ? gridBottom
        : (forcedRotation != null ? 120 : (xLabelRotation ? 96 : 64));
      const lineGridTop = typeof gridTop === 'number' ? gridTop : 48;
      const lineLegendTop = typeof legendTop === 'number' ? legendTop : 8;
      const lineLegendLeft = typeof legendLeft === 'number' || typeof legendLeft === 'string'
        ? legendLeft
        : undefined;
      const yAxisGap = typeof (resolvedVisual.spec || {}).yAxisNameGap === 'number'
        ? (resolvedVisual.spec as any).yAxisNameGap
        : 44;
      const getRow = (cat: string, seriesName: string) =>
        orderedRows.find(r => normalizeCategory(r[x]) === cat && normalizeCategory(r[seriesField]) === seriesName);

      const lineSeriesData = uniqueSeries.map(seriesName => {
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
        return { seriesName, displayName, data };
      });

      const seriesValues = lineSeriesData.map(({ data }) =>
        data.map((val) => (Number.isFinite(val as number) ? (val as number) : 0))
      );
      const highlightSeriesList = Array.isArray(highlightSeries) ? highlightSeries : [];
      const highlightSet = new Set(highlightSeriesList.map(normalizeCategory));
      const highlightColorMap = Object.fromEntries(
        Object.entries((highlightSeriesColors as Record<string, string>) || {}).map(([key, value]) => [
          normalizeCategory(key),
          value
        ])
      );
      const colorOverrides = (resolvedVisual.spec?.colors as Record<string, string>) || {};
      const normalizedColorOverrides = Object.fromEntries(
        Object.entries(colorOverrides).map(([key, value]) => [normalizeCategory(key), value])
      );
      const mutedColor = typeof mutedSeriesColor === 'string' ? mutedSeriesColor : chartPalette.light;
      const mutedOpacity = typeof mutedSeriesOpacity === 'number' ? mutedSeriesOpacity : 0.3;
      const mutedWidth = typeof mutedSeriesWidth === 'number' ? mutedSeriesWidth : 1.6;
      const highlightWidth = typeof highlightSeriesWidth === 'number' ? highlightSeriesWidth : 3;
      const mutedSymbol = typeof mutedSymbolSize === 'number' ? mutedSymbolSize : 4;
      const highlightSymbol = typeof highlightSymbolSize === 'number' ? highlightSymbolSize : 7;
      const allowMuting = muteNonHighlighted !== false;
      const mutedSeries = new Set<string>();
      let seriesColorMap: Record<string, string>;
      if (highlightSet.size > 0 && allowMuting) {
        seriesColorMap = {};
        let highlightIdx = 0;
        uniqueSeries.forEach(seriesName => {
          const normalized = normalizeCategory(seriesName);
          if (highlightSet.has(normalized)) {
            const overrideColor = highlightColorMap[normalized];
            const paletteColor = seriesPalette[highlightIdx % seriesPalette.length];
            seriesColorMap[seriesName] = overrideColor || paletteColor;
            highlightIdx += 1;
          } else {
            seriesColorMap[seriesName] = mutedColor;
            mutedSeries.add(seriesName);
          }
        });
      } else if (highlightSet.size > 0) {
        seriesColorMap = buildSeriesColorMap(uniqueSeries, undefined, seriesPalette);
        uniqueSeries.forEach(seriesName => {
          const normalized = normalizeCategory(seriesName);
          const overrideColor = highlightColorMap[normalized];
          if (overrideColor) {
            seriesColorMap[seriesName] = overrideColor;
          }
        });
      } else {
        const highlightIndex = uniqueSeries.length === 1
          ? 0
          : uniqueSeries.length <= 3
            ? (pickHighlightSeriesIndex(uniqueSeries) ?? pickHighlightIndexByTotals(seriesValues))
            : undefined;
        seriesColorMap = buildSeriesColorMap(uniqueSeries, highlightIndex, seriesPalette);
      }
      if (Object.keys(normalizedColorOverrides).length > 0) {
        const overrideAll = highlightSet.size === 0 || !allowMuting;
        uniqueSeries.forEach((seriesName) => {
          const normalized = normalizeCategory(seriesName);
          const override = normalizedColorOverrides[normalized];
          if (!override) return;
          if (overrideAll || highlightSet.has(normalized)) {
            seriesColorMap[seriesName] = override;
          }
        });
      }
      const lineSeries = lineSeriesData.map(({ seriesName, displayName, data }) => {
        const normalized = normalizeCategory(seriesName);
        const isHighlighted = highlightSet.has(normalized);
        const isMuted = allowMuting && highlightSet.size > 0 && !isHighlighted;
        const baseWidth = highlightSet.size > 0 ? mutedWidth : highlightWidth;
        const baseSymbol = highlightSet.size > 0 ? mutedSymbol : highlightSymbol;
        return {
          name: displayName,
          type: 'line',
          smooth: true,
          data,
          showSymbol: !isMuted,
          symbolSize: isHighlighted ? highlightSymbol : baseSymbol,
          itemStyle: {
            color: seriesColorMap[seriesName],
            opacity: isMuted ? mutedOpacity : 1
          },
          lineStyle: {
            width: isHighlighted ? highlightWidth : baseWidth,
            color: seriesColorMap[seriesName],
            opacity: isMuted ? mutedOpacity : 1
          },
          areaStyle: areaEnabled
            ? {
                opacity: isMuted ? 0.05 : 0.12,
                color: seriesColorMap[seriesName]
              }
            : undefined,
        };
      });
      const legendData = lineSeriesData
        .filter(({ seriesName }) => !(legendOnlyHighlighted && highlightSet.size && mutedSeries.has(seriesName)))
        .map(({ displayName }) => displayName);

      const lineWatermark = buildWatermarkGraphic({
        top: typeof watermarkTop === 'number' ? watermarkTop : (isNarrow ? 60 : 40),
        right: typeof watermarkRight === 'number' ? watermarkRight : undefined
      });
      return {
        ...baseOption,
        tooltip: { ...tooltipStyle, trigger: 'axis' },
        legend: {
          top: lineLegendTop,
          data: legendData,
          textStyle: legendTextStyle,
          ...(lineLegendLeft != null ? { left: lineLegendLeft } : {})
        },
        grid: {
          top: lineGridTop,
          right: 24 + watermarkPad,
          bottom: lineGridBottom + watermarkPad,
          left: typeof gridLeft === 'number' ? gridLeft : 56
        },
        xAxis: {
          type: 'category',
          data: categoriesLine,
          name: xAxisTitle,
          nameLocation: 'middle',
          nameGap: 100,
          nameRotate: 0,
          nameTextStyle: axisTitleStyle,
          axisTick: { alignWithLabel: true },
          axisLine: axisLineStyle,
          axisLabel: {
            interval: typeof xLabelInterval === 'number' ? xLabelInterval : 0,
            rotate: xLabelRotation,
            formatter: (val: string) => categoryLabelMap[val] || val,
            margin: 12,
            hideOverlap: true,
            ...axisLabelStyle,
          }
        },
        yAxis: {
          type: 'value',
          name: yAxisTitle,
          nameLocation: 'middle',
          nameRotate: 90,
          nameGap: yAxisGap,
          nameTextStyle: { ...axisTitleStyle, align: 'center', verticalAlign: 'middle' },
          axisLabel: axisLabelStyle,
          axisLine: axisLineStyle,
          splitLine: splitLineStyle,
        },
        series: lineSeries,
        graphic: lineWatermark
      };
    }

    if (resolvedVisual.type === 'scatter') {
      const isSwapped = Boolean(swapAxes);
      const categoryField = (isSwapped ? x : y) as string;
      const valueField = (isSwapped ? y : x) as string;
      const categoryOrderSource = isSwapped ? xCategoryOrder : yCategoryOrder;
      const categoryOrder = Array.isArray(categoryOrderSource) && categoryOrderSource.length > 0
        ? categoryOrderSource.map(normalizeCategory)
        : Array.from(new Set(orderedRows.map(r => normalizeCategory(r[categoryField]))));
      const categoryLabelMap =
        (isSwapped
          ? (xCategoryLabels as Record<string, string>) || (yCategoryLabels as Record<string, string>)
          : (yCategoryLabels as Record<string, string>)) ||
        (categoryLabels as Record<string, string>) ||
        {};
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

      const groupedEntries = Array.from(grouped.entries()).map(([groupName, groupRows]) => {
        const symKey = symbolFieldName
          ? normalizeSymbolKey(groupRows[0]?.[symbolFieldName])
          : normalizeCategory(groupName) === normalizeCategory('All India') ? 'true' : 'false';
        return { groupName, groupRows, symKey };
      });
      const highlightIndex = groupedEntries.findIndex(
        ({ groupName, symKey }) => symKey === 'true' || /all india/i.test(groupName)
      );
      const groupNames = groupedEntries.map(({ groupName }) => groupName);
      const groupColorMap = buildSeriesColorMap(
        groupNames,
        highlightIndex >= 0 ? highlightIndex : undefined,
        seriesPalette
      );

      const series = groupedEntries.map(({ groupName, groupRows, symKey }) => {
        const seriesSymbol = symbolLookup[symKey] || 'circle';
        const seriesSize = symbolSizeLookup[symKey] || basePointSize;
        const seriesColor = groupColorMap[groupName];

        const data = groupRows.map(row => {
          const value = parseNum(row[valueField]);
          const rawCategory = normalizeCategory(row[categoryField]);
          const jitterValue = jitterAmount ? (Math.random() * 2 - 1) * jitterAmount : 0;
          const jitterCategory = jitterYAmount ? (Math.random() * 2 - 1) * jitterYAmount : 0;

          if (isSwapped) {
            return {
              value: [rawCategory, value + jitterValue],
              symbolOffset: [jitterCategory, 0],
              raw: row,
            };
          }

          return {
            value: [value + jitterValue, rawCategory],
            symbolOffset: [0, jitterCategory],
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

      const legendItems = groupedEntries.map(({ groupName, symKey }) => ({
        name: groupName,
        icon: symbolLookup[symKey] || 'circle',
      }));
      const scatterRight = !isNarrow && legendItems.length ? 160 : 8;
      const scatterWatermark = buildWatermarkGraphic({ top: isNarrow ? 60 : 8, right: scatterRight });

      const maxValue = orderedRows.reduce((m, row) => {
        const val = parseNum(row[valueField]);
        return Number.isFinite(val) ? Math.max(m, val) : m;
      }, 0);
      const paddedMaxValue = maxValue > 0 ? Math.ceil((maxValue * 1.02 + 2) / 10) * 10 : undefined;
      const legendBase = {
        show: true,
        type: 'scroll',
        itemWidth: 12,
        itemHeight: 12,
        selectedMode: false,
        textStyle: legendTextStyle,
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
      const categoryAxisLabel = {
        formatter: (val: string) => categoryLabelMap[val] || val,
        fontSize: isNarrow ? 10 : 12,
        ...axisLabelStyle,
      } as Record<string, any>;
      if (isSwapped) {
        categoryAxisLabel.interval = 0;
        categoryAxisLabel.rotate = typeof xLabelRotate === 'number' ? xLabelRotate : (isNarrow ? 22 : 0);
        categoryAxisLabel.margin = 12;
      }
      const valueAxisTitle = isSwapped ? yAxisTitle : xAxisTitle;
      const categoryAxisTitle = isSwapped ? xAxisTitle : yAxisTitle;
      const valueAxis = {
        type: 'value',
        name: valueAxisTitle,
        nameLocation: 'middle',
        nameRotate: isSwapped ? 90 : 0,
        nameGap: isSwapped ? 44 : 32,
        nameTextStyle: isSwapped
          ? { ...axisTitleStyle, align: 'center', verticalAlign: 'middle' }
          : axisTitleStyle,
        axisLabel: { formatter: '{value}', fontSize: isNarrow ? 9 : 12, hideOverlap: true, ...axisLabelStyle },
        min: 0,
        max: paddedMaxValue,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle,
      };
      const categoryAxis = {
        type: 'category',
        data: categoryOrder,
        axisLabel: categoryAxisLabel,
        name: categoryAxisTitle,
        nameLocation: 'middle',
        nameRotate: isSwapped ? 0 : 90,
        nameGap: isSwapped ? 32 : (isNarrow ? 18 : 24),
        nameTextStyle: axisTitleStyle,
        axisLine: axisLineStyle,
      };

      return {
        ...baseOption,
        tooltip: {
          ...tooltipStyle,
          trigger: 'item',
          formatter: (p: any) => {
            const data = p?.data?.raw || {};
            const stageRaw = normalizeCategory(data[categoryField]);
            const stageLabel = categoryLabelMap[stageRaw] || stageRaw;
            const stateLabel = labelField ? data[labelField] : colorFieldName ? data[colorFieldName] : '';
            const val = parseNum(data[valueField]);
            return `${stateLabel || 'Value'} — ${stageLabel}<br/>GER: ${val}`;
          }
        },
        grid: isNarrow
          ? {
              top: legendItems.length ? 72 : 56,
              right: 12 + watermarkPad,
              bottom: 84 + watermarkPad,
              left: 86
            }
          : {
              top: 64,
              right: (legendItems.length ? 140 : 28) + watermarkPad,
              bottom: 64 + watermarkPad,
              left: 128
            },
        legend: legendItems.length
          ? isNarrow
            ? mobileLegends
            : { ...legendBase, orient: 'vertical', top: 32, right: 12, data: legendItems }
          : undefined,
        xAxis: isSwapped ? categoryAxis : valueAxis,
        yAxis: isSwapped ? valueAxis : categoryAxis,
        series,
        graphic: scatterWatermark
      };
    }

    // default single-series (line or bar)
    const seriesData = orderedRows.map(r => {
      const v = y ? r[y] : null;
      return typeof v === 'number' ? v : parseNum(v);
    });
    let meanCategoryLabel: string | undefined;
    if (meanField && binStartField && binEndField && orderedRows.length > 0) {
      const meanVal = parseNum(orderedRows[0][meanField]);
      if (Number.isFinite(meanVal)) {
        const match = orderedRows.find(r => {
          const start = parseNum(r[binStartField]);
          const end = parseNum(r[binEndField]);
          return Number.isFinite(start) && Number.isFinite(end) && meanVal >= start && meanVal <= end;
        });
        if (match) meanCategoryLabel = normalizeCategory(match[x]);
      }
    }
    const areaEnabled = Boolean(area);
    const barItemStyle = resolvedVisual.type === 'bar'
      ? {
          color: chartPalette.accent,
          ...(barBorder ? {
            borderColor: (barBorder as any).color ?? chartPalette.ink,
            borderWidth: (barBorder as any).width ?? 0.5,
          } : {}),
        }
      : { color: chartPalette.accent };
    const series = [
      {
        name: yLabel || y,
        type: resolvedVisual.type === 'table' ? 'line' : resolvedVisual.type,
        data: seriesData,
        smooth: resolvedVisual.type === 'line',
        areaStyle: resolvedVisual.type === 'line' && areaEnabled ? { opacity: 0.18, color: chartPalette.accent } : undefined,
        markLine: meanCategoryLabel ? {
          symbol: 'none',
          label: { formatter: 'Mean distance', color: chartPalette.ink, fontFamily: chartFontFamily },
          data: [{ xAxis: meanCategoryLabel }]
        } : undefined,
        itemStyle: barItemStyle,
        lineStyle: resolvedVisual.type === 'line' ? { color: chartPalette.accent, width: 3 } : undefined,
        ...(resolvedVisual.type === 'bar'
          ? {
              barGap: barGap ?? '0%',
              barCategoryGap: barCategoryGap ?? '0%',
            }
          : {})
      }
    ];

    return {
      ...baseOption,
      tooltip: { ...tooltipStyle, trigger: 'axis' },
      legend: { top: 8, textStyle: legendTextStyle },
      grid: {
        top: 48,
        right: 24 + watermarkPad,
        bottom: 120 + watermarkPad,
        left: typeof gridLeft === 'number' ? gridLeft : 80
      },
      xAxis: {
        type: 'category',
        data: categories,
        name: xAxisTitle,
        nameLocation: 'middle',
        nameGap: 72,
        nameRotate: 0,
        nameTextStyle: axisTitleStyle,
        axisLabel: {
          interval: typeof xLabelInterval === 'number' ? xLabelInterval : 0,
          rotate: 90,
          align: 'right',
          verticalAlign: 'middle',
          formatter: categoryLabelFormatter,
          ...axisLabelStyle
        },
        axisLine: axisLineStyle,
      },
      yAxis: {
        type: 'value',
        name: yAxisTitle,
        nameLocation: 'middle',
        nameRotate: 90,
        nameGap: 60,
        nameTextStyle: { ...axisTitleStyle, align: 'center', verticalAlign: 'middle' },
        axisLabel: axisLabelStyle,
        axisLine: axisLineStyle,
        splitLine: splitLineStyle,
      },
      series,
      graphic: baseWatermark
    };
  }, [rows, resolvedVisual]);

  if (!resolvedVisual) return <div>Chart configuration missing — pass a `visual` prop from the server or a valid visualId.</div>;
  const canDownload = rows.length > 0 && !error;
  const filenameBase = resolvedVisual.id || resolvedVisual.title || 'chart';
  const handleDownload = () => {
    const instance = chartRef.current?.getEchartsInstance?.();
    if (!instance) return;
    downloadChartImage({
      instance,
      title: resolvedVisual.title,
      filename: filenameBase.replace(/\s+/g, '-').toLowerCase()
    });
  };
  const sourceUrl = resolvedVisual.source?.url;
  const isDownloadSource = Boolean(sourceUrl && /\.(csv|tsv)(\?|$)/i.test(sourceUrl));

  return (
    <figure className="not-prose mx-auto my-6 max-w-4xl px-3">
      <div className="mb-2 text-lg font-semibold text-foreground">{resolvedVisual.title}</div>

      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : rows.length === 0 ? (
        <div>Loading data…</div>
      ) : (
        <div className="relative pb-8">
          <ReactECharts
            ref={chartRef}
            option={option}
            notMerge
            lazyUpdate
            style={{ width: '100%', height: chartHeight }}
          />
          <button
            type="button"
            onClick={handleDownload}
            disabled={!canDownload}
            aria-label="Download chart"
            className="absolute bottom-0 right-2 rounded-md border border-border bg-background/95 p-2 text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      )}

      {resolvedVisual.source && (
        <div className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Source:</span>{' '}
          {resolvedVisual.source.url && !isDownloadSource ? (
            <a href={resolvedVisual.source.url} target="_blank" rel="noreferrer">
              {resolvedVisual.source.name || resolvedVisual.source.url}
            </a>
          ) : (
            resolvedVisual.source.name
          )}
        </div>
      )}
    </figure>
  );
}
