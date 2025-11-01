import { getTopics, getVisuals } from '@/lib/data';
import { ExplorerClient } from './explorer-client';

export default function ExplorerPage() {
  const topics = getTopics();
  const visuals = getVisuals();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl font-display">
          Data Explorer
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Filter, explore, and interact with the datasets behind our stories.
        </p>
      </header>
      <ExplorerClient topics={topics} visuals={visuals} />
    </div>
  );
}
