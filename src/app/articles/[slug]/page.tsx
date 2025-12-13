import { getArticleBySlug, getArticles, getAuthorById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { RelatedArticles } from '@/components/article-blocks/RelatedArticles';
import type { Metadata, ResolvingMetadata } from 'next';
import { Author } from '@/lib/types';
import ArticlePlaygroundLayout from '@/components/layouts/ArticlePlaygroundLayout';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

type RouteParams = { slug: string };

type Props = {
  params: Promise<RouteParams>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

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

export default async function ArticlePage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const authors = article.authorIds.map(id => getAuthorById(id)).filter(Boolean) as Author[];
  const heroImage = PlaceHolderImages.find(img => img.id === article.heroImage.id);
  const playground = article.playgroundContent;

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ArticlePlaygroundLayout
        title={article.title}
        subtitle={article.subtitle}
        playground={playground}
        blocks={article.blocks}
        updated={format(new Date(article.updatedAt), 'MMMM yyyy')}
      />
      <RelatedArticles relatedArticleIds={article.relatedArticleIds} currentSlug={article.slug} />
    </>
  );
}
