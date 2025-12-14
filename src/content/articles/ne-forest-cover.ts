import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'ne-forest-cover',
  title: 'Forest cover loss in the North-East',
  subtitle: 'Annual tree cover loss across North-Eastern states, tracking the long slide since 2001.',
  authorIds: ['niruj'],
  topicIds: ['infrastructure'],
  status: 'published',
  publishedAt: '2025-11-01',
  updatedAt: '2025-11-01',
  readingTime: 3,
  seo: {
    description: 'Annual tree cover loss across the North-East using satellite-derived estimates since 2001.',
  },
  heroImage: {
    id: 'assam-tea-landscape',
    alt: 'Aerial view of tea plantations showing both small holdings and large estates in Assam'
  },
  blocks: [
    {
      type: 'intro',
      content: 'Tree cover in the North-East has been eroding for two decades. The annual loss series shows the pace and spikes since 2001.'
    },
    {
      type: 'chart',
      visualId: 'ne-forest-loss-area'
    },
    {
      type: 'chart',
      visualId: 'ne-forest-loss-state-lines'
    },
    {
      type: 'chart',
      visualId: 'ne-forest-loss-vs-gain'
    },
    {
      type: 'methods',
      content: 'Annual loss is summed across North-Eastern states using satellite-based tree cover loss estimates (ha).'
    },
    {
      type: 'sources',
      content: 'Source: Supabase dataset compiled from satellite-derived tree cover loss (2001–2023).'
    }
  ],
  relatedArticleIds: ['north-east-education-ger', 'assam-employment-trends-2011-2024']
};

export default article;
