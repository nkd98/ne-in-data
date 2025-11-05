import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'nagaland-agricultural-reforms',
  title: "Nagaland's agricultural shift: What the data shows",
  subtitle: 'How modern techniques and crop diversification are transforming agriculture in Nagaland, moving beyond traditional farming.',
  authorIds: ['jane-doe', 'john-smith'],
  topicIds: ['agriculture'],
  status: 'published',
  publishedAt: '2024-04-10',
  updatedAt: '2024-04-12',
  readingTime: 9,
  seo: { description: "A look into Nagaland's agricultural reforms, focusing on crop diversification and the adoption of modern farming technologies." },
  heroImage: { id: 'nagaland-agriculture', alt: 'Terraced fields in Nagaland.' },
  blocks: [
    { type: 'intro', content: 'Agriculture in Nagaland is undergoing a significant transformation. Farmers are moving beyond subsistence farming to embrace commercial crops and sustainable practices.' },
    { type: 'h2', content: 'Dominant Crops' },
    { type: 'p', content: 'While rice remains the staple, there is a growing emphasis on high-value crops. The table below outlines the production of major crops in the state for the year 2023.' },
    { type: 'table', visualId: 'nagaland-crop-production' },
    { type: 'methods', content: 'Production data is collected annually by the Directorate of Agriculture, Nagaland, through field surveys.' },
    { type: 'sources', content: 'Data is from the annual report of the Directorate of Agriculture, Nagaland.' }
  ],
  relatedArticleIds: ['assam-employment-trends-2011-2024', 'mizoram-literacy-push'],
  metric: { value: '530k tons', label: 'rice production', change: 'increase' }
};

export default article;
