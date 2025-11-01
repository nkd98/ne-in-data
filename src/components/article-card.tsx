import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { getTopics } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export function ArticleCard({ article }: { article: Article }) {
  const topic = getTopics().find(t => article.topicIds.includes(t.id));
  const heroImage = PlaceHolderImages.find(img => img.id === article.heroImage.id);

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden rounded-2xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
        {heroImage && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={heroImage.imageUrl}
              alt={article.heroImage.alt}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={heroImage.imageHint}
            />
          </div>
        )}
        <CardHeader>
          {topic && (
            <Badge variant="secondary" className="mb-2 w-fit" style={{ 
                backgroundColor: topic.color ? `hsl(var(--${topic.color}-muted))` : 'hsl(var(--secondary))',
                color: topic.color ? `hsl(var(--${topic.color}-foreground))` : 'hsl(var(--secondary-foreground))'
            }}>{topic.name}</Badge>
          )}
          <CardTitle className="text-xl font-display leading-tight group-hover:text-primary">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col">
          <p className="flex-grow text-sm text-muted-foreground">{article.subtitle}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
             <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min read</span>
            </div>
          </div>
        </CardContent>
         <div className="p-6 pt-0">
             <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Read insight <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
      </Card>
    </Link>
  );
}
