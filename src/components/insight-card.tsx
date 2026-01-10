
'use client';

import { useMemo, useEffect, useState, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import type { EChartsOption } from 'echarts';
import Papa from 'papaparse';
import type { Article, Visual } from '@/lib/types';
import { getTopics, getVisualById } from '@/lib/data';
import { format } from 'date-fns';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { chartPalette } from '@/lib/chart-palette';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const chartData = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 600 },
  { name: 'D', value: 200 },
  { name: 'E', value: 800 },
  { name: 'F', value: 500 },
];

const MAX_PREVIEW_POINTS = 9;

const normalizeValue = (value: unknown) => {
  if (typeof value === 'string') return value.trim();
  return String(value ?? '');
};

const parseNumber = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '').replace(/%/g, '').trim();
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
};

const uniqueValues = (values: string[]) => {
  const seen = new Set<string>();
  const result: string[] = [];
  values.forEach((value) => {
    if (seen.has(value)) return;
    seen.add(value);
    result.push(value);
  });
  return result;
};

const sampleIndexes = (length: number, max: number) => {
  if (length <= max) return Array.from({ length }, (_, idx) => idx);
  const indexes = new Set<number>([0, length - 1]);
  const steps = max - 1;
  for (let i = 1; i < steps; i += 1) {
    indexes.add(Math.round((i * (length - 1)) / steps));
  }
  return Array.from(indexes).sort((a, b) => a - b);
};

const alignRowsToSpec = (rows: Record<string, unknown>[], spec: Record<string, any>) => {
  const normalizeKey = (key: string) => key.replace(/\uFEFF/g, '').trim();
  const normalizeField = (key: string) =>
    normalizeKey(key).toLowerCase().replace(/[^a-z0-9]+/g, '');
  const normalized = rows.map((row) => {
    const next: Record<string, unknown> = {};
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
  [
    spec.x,
    spec.y,
    spec.stackField,
    spec.valueField,
    spec.seriesField,
  ].forEach((key) => {
    if (typeof key === 'string' && key) desiredKeys.add(key);
  });
  if (Array.isArray(spec.stacks)) {
    spec.stacks.forEach((key: string) => desiredKeys.add(key));
  }
  if (spec.seriesValueFields && typeof spec.seriesValueFields === 'object') {
    Object.values(spec.seriesValueFields as Record<string, string>).forEach((key) => desiredKeys.add(key));
  }
  const keyMap = new Map<string, string>();
  desiredKeys.forEach((key) => {
    const resolvedKey = resolveKey(key);
    if (resolvedKey) keyMap.set(key, resolvedKey);
  });
  return normalized.map((row) => {
    const next = { ...row };
    keyMap.forEach((resolvedKey, desiredKey) => {
      if (!(desiredKey in next) && resolvedKey in next) {
        next[desiredKey] = next[resolvedKey];
      }
    });
    return next;
  });
};

const buildFallbackOption = (accentColor: string, baseColor: string, type: 'line' | 'bar'): EChartsOption => {
  const categories = chartData.map((d) => d.name);
  const values = chartData.map((d) => d.value);
  const highlightIndex = values.indexOf(Math.max(...values));
  const xAxis = {
    type: 'category' as const,
    data: categories,
    show: false,
  };
  const yAxis = {
    type: 'value' as const,
    show: false,
  };

  if (type === 'line') {
    return {
      tooltip: { show: false },
      grid: { left: 0, right: 0, top: 10, bottom: 10 },
      xAxis,
      yAxis,
      series: [
        {
          type: 'line',
          data: values,
          smooth: true,
          showSymbol: false,
          lineStyle: { color: accentColor, width: 2 },
          areaStyle: { color: accentColor, opacity: 0.12 },
        },
      ],
    };
  }

  return {
    tooltip: { show: false },
    grid: { left: 0, right: 0, top: 10, bottom: 10 },
    xAxis,
    yAxis,
    series: [
      {
        type: 'bar',
        data: values.map((value, index) => ({
          value,
          itemStyle: {
            color: index === highlightIndex ? accentColor : baseColor,
            opacity: index === highlightIndex ? 0.9 : 0.6,
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: '50%',
      },
    ],
  };
};

const buildPreviewOption = (
  visual: Visual,
  rows: Record<string, unknown>[],
  accentColor: string
): EChartsOption | null => {
  if (!rows.length) return null;
  const spec = visual.spec || {};
  const x = spec.x;
  const y = spec.y;
  if (!x) return null;

  const categoryOrder = spec.categoryOrder || spec.xCategoryOrder || spec.yCategoryOrder;
  const allCategories = uniqueValues(rows.map((row) => normalizeValue(row[x] as string)));
  if (!allCategories.length) return null;

  const orderedCategories = Array.isArray(categoryOrder) && categoryOrder.length > 0
    ? [...allCategories].sort((a, b) => {
        const orderMap = new Map(categoryOrder.map((cat: string, idx: number) => [normalizeValue(cat), idx]));
        return (orderMap.get(a) ?? Number.MAX_SAFE_INTEGER) - (orderMap.get(b) ?? Number.MAX_SAFE_INTEGER);
      })
    : allCategories;

  const sampledIndexes = sampleIndexes(orderedCategories.length, MAX_PREVIEW_POINTS);
  const categories = sampledIndexes.map((idx) => orderedCategories[idx]);
  const categorySet = new Set(categories);
  const filteredRows = rows.filter((row) => categorySet.has(normalizeValue(row[x] as string)));
  const colorMap = (typeof spec.colors === 'object' && spec.colors) ? spec.colors : {};

  if (visual.type === 'line') {
    const seriesField = spec.seriesField;
    const seriesValueFields = (spec.seriesValueFields || {}) as Record<string, string>;
    const hasSeries = Boolean(seriesField);
    const areaEnabled = Boolean(spec.area);

    if (hasSeries) {
      const seriesNames = Object.keys(seriesValueFields).length > 0
        ? Object.keys(seriesValueFields)
        : uniqueValues(filteredRows.map((row) => normalizeValue(row[seriesField] as string)));
      const rowMap = new Map<string, Record<string, unknown>>();
      filteredRows.forEach((row) => {
        const key = `${normalizeValue(row[x] as string)}__${normalizeValue(row[seriesField] as string)}`;
        rowMap.set(key, row);
      });
      const palette = chartPalette.seriesMulti;
      const series = seriesNames.map((seriesName, idx) => {
        const values = categories.map((cat) => {
          const row = rowMap.get(`${normalizeValue(cat)}__${normalizeValue(seriesName)}`);
          if (!row) return null;
          const valueKey = (y && row[y] != null) ? y : seriesValueFields[seriesName];
          if (!valueKey) return null;
          const val = parseNumber(row[valueKey]);
          return Number.isFinite(val) ? val : null;
        });
        const color = colorMap[seriesName] || colorMap.default || palette[idx % palette.length] || accentColor;
        return {
          name: seriesName,
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: values,
          lineStyle: { color, width: 2 },
          itemStyle: { color },
          areaStyle: areaEnabled ? { color, opacity: 0.12 } : undefined,
        };
      });
      return {
        tooltip: { show: false },
        grid: { left: 6, right: 6, top: 8, bottom: 8 },
        xAxis: { type: 'category', data: categories, show: false },
        yAxis: { type: 'value', show: false },
        series,
      };
    }

    if (!y) return null;
    const values = categories.map((cat) => {
      const row = filteredRows.find((r) => normalizeValue(r[x] as string) === normalizeValue(cat));
      return row ? parseNumber(row[y]) : 0;
    });
    return {
      tooltip: { show: false },
      grid: { left: 6, right: 6, top: 8, bottom: 8 },
      xAxis: { type: 'category', data: categories, show: false },
      yAxis: { type: 'value', show: false },
      series: [
        {
          type: 'line',
          data: values,
          smooth: true,
          showSymbol: false,
          lineStyle: { color: colorMap.default || accentColor, width: 2 },
          areaStyle: { color: colorMap.default || accentColor, opacity: 0.12 },
        },
      ],
    };
  }

  if (visual.type === 'bar') {
    const stacks = Array.isArray(spec.stacks) ? spec.stacks : null;
    const isHorizontal = Boolean(spec.horizontal);
    if (stacks && stacks.length > 0) {
      const stackField = spec.stackField;
      const valueField = spec.valueField;
      const stackKeyMap = new Map(
        stacks.map((stack: string) => [normalizeValue(stack), stack])
      );
      const pivot = new Map<string, Record<string, unknown>>();
      filteredRows.forEach((row) => {
        const category = normalizeValue(row[x] as string);
        if (!categorySet.has(category)) return;
        const rawStack = stackField ? normalizeValue(row[stackField]) : '';
        const stackKey = stackField ? stackKeyMap.get(rawStack) : undefined;
        if (stackField && !stackKey) return;
        const targetStack = stackField ? stackKey : undefined;
        const entry = pivot.get(category) ?? { [x]: category };
        if (targetStack && valueField) {
          entry[targetStack] = parseNumber(row[valueField]);
        } else if (!stackField) {
          stacks.forEach((stack: string) => {
            entry[stack] = parseNumber(row[stack]);
          });
        }
        pivot.set(category, entry);
      });
      const pivotRows = Array.from(pivot.values());
      const categoryLookup = new Map<string, Record<string, unknown>>();
      pivotRows.forEach((row) => {
        categoryLookup.set(normalizeValue(row[x] as string), row);
      });
      const series = stacks.map((stack: string, idx: number) => {
        const color = colorMap[stack] || colorMap.default || chartPalette.seriesMulti[idx % chartPalette.seriesMulti.length] || accentColor;
        const data = categories.map((cat) => {
          const row = categoryLookup.get(normalizeValue(cat));
          return row ? parseNumber(row[stack]) : 0;
        });
        return {
          name: stack,
          type: 'bar',
          stack: 'total',
          data,
          itemStyle: { color },
        };
      });
      return {
        tooltip: { show: false },
        grid: { left: 6, right: 6, top: 8, bottom: 8 },
        xAxis: { type: isHorizontal ? 'value' : 'category', data: isHorizontal ? undefined : categories, show: false },
        yAxis: { type: isHorizontal ? 'category' : 'value', data: isHorizontal ? categories : undefined, show: false },
        series,
      };
    }

    if (!y) return null;
    const categoryLookup = new Map<string, Record<string, unknown>>();
    filteredRows.forEach((row) => {
      categoryLookup.set(normalizeValue(row[x] as string), row);
    });
    const values = categories.map((cat) => {
      const row = categoryLookup.get(normalizeValue(cat));
      return row ? parseNumber(row[y]) : 0;
    });
    return {
      tooltip: { show: false },
      grid: { left: 6, right: 6, top: 8, bottom: 8 },
      xAxis: { type: isHorizontal ? 'value' : 'category', data: isHorizontal ? undefined : categories, show: false },
      yAxis: { type: isHorizontal ? 'category' : 'value', data: isHorizontal ? categories : undefined, show: false },
      series: [
        {
          type: 'bar',
          data: values,
          barWidth: '60%',
          itemStyle: { color: colorMap.default || accentColor },
        },
      ],
    };
  }

  return null;
};

function ChartPreview({
  visual,
  accentColor,
  baseColor,
  fallbackType,
}: {
  visual?: Visual;
  accentColor: string;
  baseColor: string;
  fallbackType: 'line' | 'bar';
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!visual) {
      setRows([]);
      return;
    }
    const spec = visual.spec || {};
    if (Array.isArray(spec.data)) {
      setRows(alignRowsToSpec(spec.data, spec));
      return;
    }
    const dataUrl = spec.dataUrl;
    if (!dataUrl) {
      setRows([]);
      return;
    }
    let active = true;
    const controller = new AbortController();
    fetch(dataUrl, { signal: controller.signal })
      .then((response) => response.text())
      .then((csv) => Papa.parse(csv, { header: true, dynamicTyping: true }).data as Record<string, unknown>[])
      .then((parsed) => {
        if (!active) return;
        setRows(alignRowsToSpec(parsed, spec));
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        if (!active) return;
        setRows([]);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [visual?.id, visual?.spec?.dataUrl]);

  const option = useMemo<EChartsOption>(() => {
    if (visual) {
      const preview = buildPreviewOption(visual, rows, accentColor);
      if (preview) return preview;
    }
    return buildFallbackOption(accentColor, baseColor, fallbackType);
  }, [visual, rows, fallbackType, accentColor, baseColor]);

  return (
    <div className="relative z-10 h-full w-full transition-transform duration-300 group-hover:scale-[1.02]">
      <ReactECharts option={option} notMerge lazyUpdate style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

type InsightCardProps = {
  article: Article;
  layout?: 'featured' | 'compact';
  titleClassName?: string;
};

export function InsightCard({ article, layout = 'compact', titleClassName }: InsightCardProps) {
  const topic = getTopics().find(t => article.topicIds.includes(t.id));
  const topicColorVar = topic?.color ? `var(--${topic.color})` : 'var(--primary)';
  const topicColor = `hsl(${topicColorVar})`;
  const accentColor = `hsl(${topicColorVar})`;
  const baseColor = 'hsl(var(--muted-foreground))';
  const previewType = layout === 'featured'
    ? 'line'
    : (topic?.id?.length ?? 0) % 2 === 0
      ? 'bar'
      : 'line';
  const chartBlock = article.blocks.find((block) => block.type === 'chart');
  const previewVisual = chartBlock ? getVisualById(chartBlock.visualId) : undefined;
  
  const MetricIcon = article.metric?.change === 'increase' ? TrendingUp : TrendingDown;
  const metricTone = article.metric?.change === 'increase'
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-600 dark:text-rose-400';
  const cardGlowStyle: CSSProperties = {
    backgroundImage: `radial-gradient(120% 120% at -10% -20%, hsl(${topicColorVar} / 0.22) 0%, transparent 60%), radial-gradient(120% 120% at 110% 120%, hsl(var(--primary) / 0.18) 0%, transparent 60%)`,
  };
  const previewGlowStyle: CSSProperties = {
    backgroundImage: `linear-gradient(135deg, hsl(${topicColorVar} / 0.2) 0%, transparent 55%), radial-gradient(80% 80% at 90% 10%, hsl(var(--primary) / 0.18) 0%, transparent 65%)`,
  };

  const content = (
    <>
      <div className={cn(
        "relative overflow-hidden bg-secondary/40 transition-all duration-300 ease-in-out group-hover:brightness-110",
        layout === 'featured' ? "aspect-[16/10] rounded-t-lg" : "aspect-square rounded-l-lg",
        layout === 'compact' && 'md:aspect-video'
      )}>
        <div className="pointer-events-none absolute inset-0 z-0" style={previewGlowStyle} />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-black/[0.08] via-transparent to-black/[0.16]" />
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.18]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.18) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />
        <ChartPreview visual={previewVisual} accentColor={accentColor} baseColor={baseColor} fallbackType={previewType} />
      </div>
      
      <div className={cn(
          "flex flex-col flex-grow p-4 md:p-6",
          layout === 'compact' && 'md:justify-center'
        )}>
        
        {topic && (
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{
                borderColor: `hsl(${topicColorVar} / 0.4)`,
                color: `hsl(${topicColorVar})`,
                backgroundColor: `hsl(${topicColorVar} / 0.08)`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: topicColor }} />
              {topic.name}
            </div>
            {article.metric && (
              <div className="flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-semibold text-foreground">
                <MetricIcon className={cn("h-3.5 w-3.5", metricTone)} />
                <span className={cn(metricTone)}>{article.metric.value}</span>
                <span className="hidden md:inline text-muted-foreground">{article.metric.label}</span>
              </div>
            )}
          </div>
        )}

        <h3
          className={cn(
            "text-lg md:text-xl font-display leading-snug mb-2 text-foreground",
            titleClassName
          )}
        >
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground flex-grow mb-4">
          {article.subtitle}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
            {format(new Date(article.publishedAt), 'MMM d, yyyy')}
            <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
            {article.readingTime} min read
          </span>
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70 transition-colors group-hover:text-primary">
            Read
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link href={`/articles/${article.slug}`} className={cn(
        "group relative block h-full overflow-hidden rounded-lg border border-border/60 bg-card/80 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_18px_45px_-30px_rgba(0,0,0,0.7)]"
    )}>
        <span className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={cardGlowStyle} />
        <span className="pointer-events-none absolute inset-0 z-0 rounded-lg ring-1 ring-inset ring-border/40" />
        <div className={cn(
          "relative z-10 h-full",
          layout === 'compact' ? 'flex flex-col md:flex-row' : 'flex flex-col'
        )}>
          {content}
        </div>
    </Link>
  );
}
