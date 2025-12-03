import { getArticles, getTopicBySlug, getTopics, getVisuals } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/article-card';
import { VisualCard } from '@/components/visual-card';

export async function generateStaticParams() {
  const topics = getTopics();
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const topicArticles = getArticles().filter(article => article.topicIds.includes(topic.id));
  const topicVisuals = getVisuals().filter(visual => visual.tags.includes(topic.slug));

  return (
    <div className="flex flex-col gap-12 py-8 md:gap-16 md:py-16">
      <header className="container mx-auto px-4 text-center">
        <p className="text-lg font-semibold text-primary">Topic</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          {topic.name}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
          {topic.description}
        </p>
      </header>

      {topicArticles.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">
            Articles on {topic.name}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {topicArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {topicVisuals.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">
            Related Visuals
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {topicVisuals.map((visual) => (
              <VisualCard key={visual.id} visual={visual} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
