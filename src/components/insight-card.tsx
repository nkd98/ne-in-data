
'use client';
import type { Article } from '@/lib/types';
import { getTopics } from '@/lib/data';
import { format } from 'date-fns';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const chartData = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 600 },
  { name: 'D', value: 200 },
  { name: 'E', value: 800 },
  { name: 'F', value: 500 },
];

function DataPreview({ topicColor, type }: { topicColor: string, type: 'line' | 'bar' }) {
    const renderChart = () => {
        if (type === 'line') {
            return (
                <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Line type="monotone" dataKey="value" stroke={topicColor} strokeWidth={2} dot={false} />
                </LineChart>
            );
        }
        return (
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Bar dataKey="value" fill={topicColor} />
            </BarChart>
        );
    };

  return (
    <div className="aspect-video w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

export function InsightCard({ article, layout = 'compact' }: { article: Article; layout?: 'featured' | 'compact' }) {
  const topic = getTopics().find(t => article.topicIds.includes(t.id));
  const topicColor = topic?.color ? `hsl(var(--${topic.color}))` : 'hsl(var(--primary))';
  
  const MetricIcon = article.metric?.change === 'increase' ? TrendingUp : TrendingDown;

  const content = (
    <>
      <div className={cn(
        "relative overflow-hidden bg-secondary/30 transition-all duration-300 ease-in-out group-hover:brightness-105",
        layout === 'featured' ? "aspect-video rounded-t-lg" : "aspect-square rounded-l-lg",
        layout === 'compact' && 'md:aspect-video'
      )}>
        <DataPreview topicColor={topicColor} type={layout === 'featured' ? 'line' : 'bar'} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className={cn(
          "flex flex-col flex-grow p-4 md:p-6",
          layout === 'compact' && 'md:justify-center'
        )}>
        
        {topic && (
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-4" style={{ backgroundColor: topicColor }}></div>
            <div className="flex items-center gap-4">
               <span className="text-sm font-medium lowercase text-muted-foreground">{topic.name}</span>
               {article.metric && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground has-[svg]:text-[hsl(var(--primary))]">
                        <MetricIcon className="h-3.5 w-3.5" />
                        <span className="font-semibold">{article.metric.value}</span>
                        <span className="hidden md:inline">{article.metric.label}</span>
                    </div>
                )}
            </div>
          </div>
        )}

        <h3 className="text-lg md:text-xl font-display leading-snug mb-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground flex-grow mb-4">
          {article.subtitle}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
          <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')} &bull; {article.readingTime} min read</span>
          <div className="inline-flex items-center gap-1 font-semibold text-primary/80 group-hover:text-primary">
            Read
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link href={`/articles/${article.slug}`} className={cn(
        "group block h-full overflow-hidden rounded-lg bg-card transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5",
        layout === 'compact' ? 'md:flex' : 'flex flex-col'
    )}>
        {content}
    </Link>
  );
}
