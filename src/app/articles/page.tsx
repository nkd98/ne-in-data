import { getArticles } from "@/lib/data";
import { InsightCard } from "@/components/insight-card";

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold md:text-5xl">Latest Insights</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Evidence-based stories on the economy, education, and environment of North-East India.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => {
          return (
            <div key={article.slug} className="col-span-1">
              <InsightCard article={article} layout="compact" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
