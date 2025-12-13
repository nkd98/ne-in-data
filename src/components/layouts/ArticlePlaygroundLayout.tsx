'use client';

import dynamic from 'next/dynamic';
import type { Block, TeaPlaygroundContent, TeaPlaygroundSection } from '@/lib/types';
import { BlockRenderer } from '@/components/article-blocks/BlockRenderer';

const BarStacked = dynamic(() => import('@/components/charts/BarStacked'), { ssr: false });

type Props = {
  title: string;
  subtitle?: string;
  updated: string;
  playground?: TeaPlaygroundContent;
  blocks?: Block[];
  kicker?: string;
  organization?: string;
  deck?: string;
};

export default function ArticlePlaygroundLayout({
  title,
  subtitle,
  updated,
  playground,
  blocks = [],
  kicker = 'Insight',
  organization = 'Northeast in Data',
  deck,
}: Props) {
  const hero = playground?.hero ?? {
    kicker,
    deck: deck || subtitle || '',
    organization,
  };

  const renderSection = (section: TeaPlaygroundSection, index: number) => {
    if (section.type === 'prose') {
      return (
        <section
          key={`prose-${index}`}
          className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {section.paragraphs.map((paragraph, idx) => (
            <p key={`${index}-${idx}`}>{paragraph}</p>
          ))}
        </section>
      );
    }

    return (
      <figure
        key={`figure-${index}`}
        className="space-y-6"
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{section.kicker}</p>
          <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
          <p className="text-base text-muted-foreground">{section.description}</p>
        </div>
        <BarStacked
          csvUrl={section.chart.csvUrl}
          height={section.chart.height}
          indexScale={section.chart.indexScale}
        />
        <figcaption className="text-right text-sm text-muted-foreground">
          <a
            className="font-medium text-foreground underline decoration-dotted underline-offset-2"
            href={section.source.url}
            target="_blank"
            rel="noreferrer"
          >
            {section.source.label}
          </a>
        </figcaption>
      </figure>
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex max-w-5xl flex-col gap-4 px-6 py-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {hero.kicker}
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-headline font-extrabold tracking-tight leading-tight md:text-5xl">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                {hero.deck || subtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span>{hero.organization}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1">
                Updated {updated}
              </span>
            </div>
          </div>
        </div>
      </header>

      {playground ? (
        <article className="container mx-auto max-w-5xl space-y-14 px-6 py-12 md:space-y-20 md:py-16">
          {playground.sections.map((section, index) => renderSection(section, index))}
        </article>
      ) : (
        <article className="container mx-auto max-w-4xl space-y-10 px-6 py-12 md:space-y-14 md:py-16">
          {blocks.length > 0 ? <BlockRenderer blocks={blocks} /> : <p className="text-muted-foreground">No content available.</p>}
        </article>
      )}
    </main>
  );
}
