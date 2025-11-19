import TeaGrowersPlayground from '@/components/articles/TeaGrowersPlayground';
import { getArticleBySlug } from '@/lib/data';
import { format } from 'date-fns';

export default function Playground() {
  const article = getArticleBySlug('assam-tea-cultivation-landscape');

  if (!article || !article.playgroundContent) {
    return (
      <main className="container mx-auto max-w-3xl px-6 py-16 text-center text-muted-foreground">
        <p>The playground demo is unavailable because the tea article data is missing.</p>
      </main>
    );
  }

  return (
    <TeaGrowersPlayground
      title={article.title}
      subtitle={article.subtitle}
      updated={format(new Date(article.updatedAt), 'MMMM yyyy')}
      playground={article.playgroundContent}
    />
  );
}
