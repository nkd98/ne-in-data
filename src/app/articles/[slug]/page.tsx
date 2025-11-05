import { getArticleBySlug, getArticles, getAuthorById, getVisualById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { BlockRenderer } from '@/components/article-blocks/BlockRenderer';
import { RelatedArticles } from '@/components/article-blocks/RelatedArticles';
import { Calendar, Clock } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import { Author } from '@/lib/types';
import TeaGrowersPlayground from '@/components/articles/TeaGrowersPlayground';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
    }
  }
  
  const heroImage = PlaceHolderImages.find(img => img.id === article.heroImage.id);
  const imageUrl = heroImage ? new URL(heroImage.imageUrl, siteUrl).toString() : new URL('/og-fallback.png', siteUrl).toString();

  const canonicalUrl = `${siteUrl}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.seo.description,
    alternates: {
      canonical: article.seo.canonical || canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.seo.description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: new Date(article.publishedAt).toISOString(),
      modifiedTime: new Date(article.updatedAt).toISOString(),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.heroImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.seo.description,
      images: [imageUrl],
    },
  }
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const authors = article.authorIds.map(id => getAuthorById(id)).filter(Boolean) as Author[];
  const heroImage = PlaceHolderImages.find(img => img.id === article.heroImage.id);
  const isPlaygroundLayout = article.layout === 'tea-playground';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${article.slug}`,
    },
    headline: article.title,
    description: article.seo.description,
    image: heroImage ? new URL(heroImage.imageUrl, siteUrl).toString() : undefined,
    author: authors.map(author => ({
      '@type': 'Person',
      name: author.name,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'Northeast in Data',
      logo: {
        '@type': 'ImageObject',
        url: new URL('/logo.png', siteUrl).toString(),
      },
    },
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${siteUrl}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
      },
    ],
  };

  if (isPlaygroundLayout) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <TeaGrowersPlayground updated={format(new Date(article.updatedAt), 'MMMM yyyy')} />
      </>
    );
  }

  return (
    <article className="py-8 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <header className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          {article.title}
        </h1>
        
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              {authors.map(author => author && (
                <Avatar key={author.id} className="inline-block h-8 w-8 ring-2 ring-background">
                  <AvatarImage src={author.avatarUrl} alt={author.name} />
                  <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-sm font-medium text-foreground">
              {authors.map(a => a?.name).join(', ')}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{article.readingTime} min read</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-lg text-muted-foreground md:text-xl">
          {article.subtitle}
        </p>

      </header>

      {heroImage && (
        <div className="container mx-auto mt-8 max-w-6xl px-4 md:mt-12">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                    src={heroImage.imageUrl}
                    alt={article.heroImage.alt}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage.imageHint}
                />
            </div>
        </div>
      )}

      <div className="prose prose-lg mx-auto mt-8 max-w-4xl px-4 dark:prose-invert md:mt-12 lg:prose-xl prose-h2:font-headline prose-h3:font-headline prose-p:font-body prose-a:text-primary hover:prose-a:text-primary/80">
        {/* Resolve visuals server-side and attach to chart/table blocks so client ChartBlock/TableBlock get the config immediately */}
        {(() => {
          const blocksWithVisuals = article.blocks.map((b: any) => {
            if (b?.type === 'chart' || b?.type === 'table') {
              return { ...b, visual: b.visualId ? getVisualById(b.visualId) : undefined };
            }
            return b;
          });
          return <BlockRenderer blocks={blocksWithVisuals} />;
        })()}
      </div>

      <RelatedArticles relatedArticleIds={article.relatedArticleIds} currentSlug={article.slug} />

    </article>
  );
}
