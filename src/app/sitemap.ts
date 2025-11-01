import { MetadataRoute } from 'next';
import { getArticles, getTopics } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

  const staticRoutes = [
    '',
    '/about',
    '/articles',
    '/explorer',
    '/team',
    '/topics',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const articleRoutes = getArticles().map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
  }));
  
  const topicRoutes = getTopics().map((topic) => ({
    url: `${siteUrl}/topics/${topic.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...articleRoutes, ...topicRoutes];
}
