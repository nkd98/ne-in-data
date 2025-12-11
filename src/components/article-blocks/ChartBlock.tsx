
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

  useEffect(() => {
    if (!resolvedVisual) return;
    const dataUrl = resolvedVisual.spec?.dataUrl;
    const { x, y, stacks } = resolvedVisual.spec || {};
    if (!dataUrl || !x || (!y && !stacks)) {
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
          filtered = parsed.filter((d: any) => d[x] != null && stacks.every((s: string) => d[s] != null && d[s] !== ''));
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
    const { x, y, stacks, stackLabels, colors, yLabel } = resolvedVisual.spec || {};
    const categories = rows.map(r => String(r[x]));

    const parseNum = (v: any) => {
      if (v == null) return 0;
      const s = String(v).replace(/%/g, '').replace(/,/g, '').trim();
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    };

    if (stacks && Array.isArray(stacks) && resolvedVisual.type === 'bar') {
      const series = (stacks as string[]).map(stack => {
        const data = rows.map((r: Record<string, any>) => {
          const value = parseNum(r[stack]);
          const total = (stacks as string[]).reduce((sum: number, s: string) => sum + parseNum(r[s]), 0) || 1;
          return (value / total) * 100;
        });
        return {
          name: (stackLabels as Record<string, string>)?.[stack] || stack,
          type: 'bar',
          stack: 'total',
          emphasis: { focus: 'series' },
          data,
          itemStyle: { color: (colors as Record<string, string>)?.[stack] }
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
            const rowsText = params.map((p: any) => `${p.seriesName}: ${p.value.toFixed(1)}%`).join('<br/>');
            return `${cat}<br/>${rowsText}`;
          }
        },
        legend: { top: 8, data: (stacks as string[]).map(s => (stackLabels as Record<string, string>)?.[s] || s) },
        grid: { top: 48, right: 24, bottom: 36, left: 56 },
        xAxis: { type: 'category', data: categories, axisLabel: { interval: 0, rotate: 0 } },
        yAxis: { type: 'value', name: yLabel, axisLabel: { formatter: '{value}%' }, max: 100 },
        series
      };
    }

    // default single-series (line or bar)
    const seriesData = rows.map(r => {
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
      toolbox: { right: 16, feature: { saveAsImage: { pixelRatio: 2 }, dataZoom: {} } },
      grid: { top: 48, right: 24, bottom: 56, left: 56 },
      dataZoom: [{ type: 'inside' }, { type: 'slider', height: 24, bottom: 12 }],
      xAxis: { type: 'category', data: categories },
      yAxis: { type: 'value', name: yLabel },
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
        <ReactECharts option={option} notMerge lazyUpdate style={{ width: '100%', height: 420 }} />
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
