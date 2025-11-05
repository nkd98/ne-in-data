'use client';

import dynamic from 'next/dynamic';

const BarStacked = dynamic(() => import('@/components/charts/BarStacked'), { ssr: false });

type Props = {
  updated?: string;
};

export default function TeaGrowersPlayground({ updated = 'April 2024' }: Props) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/40">
        <div className="container mx-auto flex max-w-6xl flex-col gap-3 px-6 py-12 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Insight
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Small vs Big Tea Growers in Assam
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Comparative views of how small tea growers stack up against large estates in Assam—first at the statewide scale, then across every district.
            </p>
          </div>
          <div className="text-sm text-muted-foreground md:text-right">
            Updated {updated}
            <br />
            Northeast India Data
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl space-y-16 px-6 py-12">
        <section>
          <article className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-6 p-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Statewide Snapshot</h2>
                <p className="text-sm text-muted-foreground">
                  Small growers dominate registrations, yet land and output remain tilted toward larger estates. Each bar shows how the two groups split producers, area, and production.
                </p>
              </div>
              <div className="text-sm text-muted-foreground md:text-right">
                Source:{' '}
                <a
                  className="font-medium text-foreground underline decoration-dotted underline-offset-2"
                  href="https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_dist.csv"
                  target="_blank"
                  rel="noreferrer"
                >
                  Statistical Handbook of Assam, 2023-24
                </a>
              </div>
            </div>
            <div className="border-t border-border px-4 pb-8 pt-6 md:px-8">
              <BarStacked
                csvUrl="https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_dist.csv"
                height={360}
                indexScale={{ type: 'band', round: false, reverse: false }}
              />
            </div>
          </article>
        </section>

        <section>
          <article className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-6 p-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">District Comparisons</h2>
                <p className="text-sm text-muted-foreground">
                  A district-by-district view of cultivation area. Hover or tap to see the percentage split for each district; labels surface the dominant share where space allows.
                </p>
              </div>
              <div className="text-sm text-muted-foreground md:text-right">
                Source:{' '}
                <a
                  className="font-medium text-foreground underline decoration-dotted underline-offset-2"
                  href="https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_area_district.csv"
                  target="_blank"
                  rel="noreferrer"
                >
                  Statistical Handbook of Assam, 2023-24
                </a>
              </div>
            </div>
            <div className="border-t border-border px-4 pb-8 pt-6 md:px-8">
              <BarStacked
                csvUrl="https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_area_district.csv"
                height={700}
              />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
