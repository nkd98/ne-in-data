import { getArticleBySlug } from '@/lib/data';
import { ArticleCard } from '@/components/article-card';

export function RelatedArticles({ relatedArticleIds, currentSlug }: { relatedArticleIds: string[], currentSlug: string }) {
  const relatedArticles = relatedArticleIds
    .map(slug => getArticleBySlug(slug))
    .filter(article => article && article.slug !== currentSlug)
    .slice(0, 3);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 bg-secondary py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map(article => article && (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
