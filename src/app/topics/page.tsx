import { getArticles, getTopics } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function TopicsPage() {
  const topicIdsWithArticles = new Set(
    getArticles().flatMap((article) => article.topicIds)
  );
  const topics = getTopics().filter((topic) => topicIdsWithArticles.has(topic.id));

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-display font-bold md:text-5xl">
          Explore Topics
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Dive into the data stories shaping the Northeast, from education
          to environmental change.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const image = PlaceHolderImages.find((img) => img.id === topic.imageId);
          return (
            <Link
              href={`/topics/${topic.slug}`}
              key={topic.slug}
              className="group block"
            >
              <Card className="h-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-video w-full overflow-hidden">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={topic.name}
                      fill
                      className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: `hsl(var(--${topic.color ?? 'primary'}))`,
                      opacity: 0.2,
                    }}
                  />
                </div>
                <CardContent className="p-6">
                  <h2
                    className="text-2xl font-bold font-display"
                    style={{ color: `hsl(var(--${topic.color ?? 'primary'}))` }}
                  >
                    {topic.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Explore topic{' '}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
