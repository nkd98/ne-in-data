import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'mizoram-literacy-push',
  title: 'Why Mizoram leads India in literacy',
  subtitle: 'Exploring the role of community, policy, and innovation in maintaining one of the highest literacy rates in the country.',
  authorIds: ['john-smith'],
  topicIds: ['education'],
  status: 'published',
  publishedAt: '2024-05-20',
  updatedAt: '2024-05-22',
  readingTime: 6,
  seo: { description: "An exploration of the factors contributing to Mizoram's high literacy rate, including community participation and government initiatives." },
  heroImage: { id: 'mizoram-literacy', alt: 'Students in a classroom in Mizoram.' },
  blocks: [
    { type: 'intro', content: "Mizoram's success in education is a story of community effort and effective governance. This article delves into the key drivers behind its impressive literacy statistics." },
    { type: 'h2', content: 'Literacy Rate Comparison' },
    { type: 'chart', visualId: 'mizoram-literacy-rate' },
    { type: 'p', content: 'The state has consistently ranked among the top in India for literacy. The chart above shows the progress made between the 2011 and 2021 censuses.' },
    { type: 'callout', content: 'Community-led initiatives, such as local libraries and reading clubs, have played a pivotal role in fostering a culture of learning.' },
    { type: 'methods', content: 'Literacy rates are derived from decadal census data provided by the National Statistical Office.' },
    { type: 'sources', content: 'Data sourced from the Census of India reports.' }
  ],
  relatedArticleIds: ['assam-employment-trends-2011-2024', 'nagaland-agricultural-reforms'],
  metric: { value: '93.5%', label: 'literacy rate', change: 'increase' }
};

export default article;
