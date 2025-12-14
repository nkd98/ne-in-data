import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'assam-phc-distance',
  title: "Where are Assam's Primary Health Centres located?",
  subtitle: 'A statewide map of PHC locations for geographic context.',
  authorIds: ['niruj'],
  topicIds: ['infrastructure'],
  status: 'published',
  publishedAt: '2025-11-01',
  updatedAt: '2025-11-01',
  readingTime: 3,
  seo: {
    description: 'A map of Primary Health Centre locations across Assam for geographic context.',
  },
  heroImage: {
    id: 'assam-tea-landscape',
    alt: 'Aerial view of tea plantations showing both small holdings and large estates in Assam'
  },
  blocks: [
    {
      type: 'intro',
      content: 'Assam has hundreds of Primary Health Centres (PHCs). Plotting them on a map shows how they span the Brahmaputra valley and hill districts.'
    },
    {
      type: 'image',
      src: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/assam_phc_locations_owid.png',
      alt: 'Map of Primary Health Centre locations across Assam',
      caption: 'Each dot is a Primary Health Centre (PHC); background map provides geographic context.'
    },
    {
      type: 'chart',
      visualId: 'assam-phc-distance-hist'
    },
    {
      type: 'chart',
      visualId: 'assam-phc-distance-bands'
    },
    {
      type: 'sources',
      content: 'Source: Assam PHC location dataset (Supabase).'
    }
  ],
  relatedArticleIds: ['north-east-road-stats', 'assam-employment-trends-2011-2024']
};

export default article;
