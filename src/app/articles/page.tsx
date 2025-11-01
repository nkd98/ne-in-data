import { getArticles, getTopics } from "@/lib/data";
import { InsightCard } from "@/components/insight-card";
import type { Article } from "@/lib/types";

export default function ArticlesPage() {
  const articles = getArticles();
  
  const getLayout = (index: number) => {
    const patternIndex = index % 3;
    if (patternIndex === 0) return 'featured';
    return 'compact';
  }

  const featuredArticle = articles[0];
  const compactArticles1 = articles.slice(1, 3);
  const remainingArticles = articles.slice(3);


  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold md:text-5xl">Latest Insights</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Evidence-based stories on the economy, education, and environment of North-East India.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => {
            const layout = getLayout(index);
            const span = layout === 'featured' ? 'lg:col-span-2' : 'lg:col-span-1';
            
            // On md screens, every card takes full width or half, let's make featured full and compact half
            const mdSpan = layout === 'featured' ? 'md:col-span-2' : 'md:col-span-1';

            return (
              <div key={article.slug} className={`col-span-1 ${mdSpan} ${span}`}>
                <InsightCard article={article} layout={layout} />
              </div>
            );
        })}
      </div>
    </div>
  );
}
