'use client';

import dynamic from 'next/dynamic';
import type { EChartsOption } from 'echarts';
import type { Visual } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Link as LinkIcon, BarChart, LineChart, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table as UiTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const parseValue = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '').replace(/%/g, '').trim();
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
};

const buildCartesianOption = (visual: Visual, type: 'line' | 'bar'): EChartsOption => {
  const spec = visual.spec || {};
  const rows: any[] = Array.isArray(spec.data) ? spec.data : [];
  const categories = rows.map((row) => String(row?.[spec.x] ?? ''));
  const values = rows.map((row) => parseValue(row?.[spec.y]));
  const primaryColor = 'hsl(var(--primary))';
  const axisColor = 'hsl(var(--muted-foreground))';
  const borderColor = 'hsl(var(--border))';

  return {
    tooltip: { trigger: 'axis' },
    grid: { top: 32, right: 16, bottom: 56, left: 64 },
    xAxis: {
      type: 'category' as const,
      data: categories,
      axisLabel: { color: axisColor },
      axisLine: { lineStyle: { color: borderColor } },
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: 'value' as const,
      name: spec.yLabel,
      nameLocation: 'middle',
      nameGap: 46,
      axisLabel: { color: axisColor },
      axisLine: { lineStyle: { color: borderColor } },
      splitLine: { lineStyle: { color: borderColor, opacity: 0.4 } },
    },
    series: [
      {
        name: spec.yLabel || spec.y,
        type,
        data: values,
        smooth: type === 'line',
        symbol: type === 'line' ? 'circle' : 'none',
        symbolSize: 8,
        itemStyle: { color: primaryColor },
        lineStyle: type === 'line' ? { width: 3 } : undefined,
        areaStyle: type === 'line' ? { opacity: 0.08, color: primaryColor } : undefined,
        barMaxWidth: type === 'bar' ? 40 : undefined,
      },
    ],
  };
};

function RenderVisual({ visual }: { visual: Visual }) {
    switch (visual.type) {
        case 'line':
            return (
                <div className="h-[300px] w-full md:h-[400px]">
                    <ReactECharts
                        option={buildCartesianOption(visual, 'line')}
                        notMerge
                        lazyUpdate
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
            );
        case 'bar':
            return (
                <div className="h-[300px] w-full md:h-[400px]">
                    <ReactECharts
                        option={buildCartesianOption(visual, 'bar')}
                        notMerge
                        lazyUpdate
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
            );
        case 'table':
            return (
                <div className="max-h-[400px] overflow-auto rounded-md border">
                    <UiTable>
                        <TableHeader className="sticky top-0 bg-secondary">
                            <TableRow>
                                {visual.spec.headers.map((header: string) => <TableHead key={header} className="font-bold">{header}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visual.spec.rows.map((row: (string|number)[], rowIndex: number) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => <TableCell key={cellIndex}>{cell}</TableCell>)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </UiTable>
                </div>
            );
        default:
            return <div className="text-red-500">Unsupported visual type</div>;
    }
}


function VisualIcon({ type }: { type: Visual['type'] }) {
    switch (type) {
        case 'line': return <LineChart className="h-4 w-4 text-muted-foreground" />;
        case 'bar': return <BarChart className="h-4 w-4 text-muted-foreground" />;
        case 'table': return <Table className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
}


export function VisualCard({ visual }: { visual: Visual }) {
    const { toast } = useToast();

    const handleCopySpec = () => {
        navigator.clipboard.writeText(JSON.stringify(visual.spec, null, 2));
        toast({ title: 'Specification Copied!', description: 'The chart specification has been copied to your clipboard.' });
    };

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/explorer#${visual.id}`;
        navigator.clipboard.writeText(shareUrl);
        toast({ title: 'Link Copied!', description: 'A shareable link has been copied to your clipboard.' });
    };
    
    const handleDownloadData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(visual.spec.data, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", visual.id + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast({ title: 'Data Downloading!', description: 'The raw data for this visual is being downloaded.' });
    };

    return (
        <Card id={visual.id} className="overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-xl">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl font-headline group-hover:text-primary">{visual.title}</CardTitle>
                    <VisualIcon type={visual.type} />
                </div>
                {visual.caption && <CardDescription>{visual.caption}</CardDescription>}
            </CardHeader>
            <CardContent>
                <RenderVisual visual={visual} />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 bg-secondary/50 p-4">
                 <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                    <div>
                        Source: <a href={visual.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{visual.source.name}</a>
                    </div>
                    <div>Last Updated: {visual.lastUpdated}</div>
                </div>
                <div className="flex w-full justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadData}>
                        <Download className="mr-2 h-4 w-4" />
                        Data
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopySpec}>
                        <Copy className="mr-2 h-4 w-4" />
                        Spec
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
