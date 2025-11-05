import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'assam-tea-exports-analysis',
  title: "Assam's Tea Industry: Export Trends and Market Impact",
  subtitle: 'A comprehensive analysis of tea export patterns from Assam, revealing key trends and market dynamics',
  authorIds: ['jane-doe', 'john-smith'],
  topicIds: ['agriculture'],
  status: 'published',
  publishedAt: '2025-11-01',
  updatedAt: '2025-11-01',
  readingTime: 7,
  seo: {
    description: "In-depth analysis of Assam tea exports, examining historical trends, market challenges, and future prospects for the industry.",
    canonical: null
  },
  heroImage: { id: 'assam-tea-plantation', alt: 'Lush tea plantations in Assam with workers plucking tea leaves' },
  blocks: [
    {
      type: 'intro',
      content: "Assam tea, known for its rich flavor and distinctive character, has long been a cornerstone of India's agricultural exports. This analysis examines the export trends and their implications for the region's economy."
    },
    {
      type: 'h2',
      content: 'Historical Export Trends'
    },
    {
      type: 'p',
      content: "The following chart illustrates the evolution of tea exports from Assam over the years. The data reveals interesting patterns that reflect both local production capabilities and global market demands."
    },
    {
      type: 'chart',
      visualId: 'assam-tea-exports'
    },
    {
      type: 'h3',
      content: 'Key Observations'
    },
    {
      type: 'p',
      content: 'The export volumes show significant year-to-year variations, influenced by factors such as weather conditions, global market prices, and international trade dynamics.'
    },
    {
      type: 'callout',
      content: "Assam produces approximately 52% of India's tea and contributes significantly to the global tea market."
    },
    {
      type: 'methods',
      content: 'The analysis uses official export data from the Tea Board of India. Export volumes are measured in million kilograms and represent the total annual exports from Assam to various international markets.'
    },
    {
      type: 'sources',
      content: "Data sourced from the Tea Board of India's annual reports and export statistics database."
    }
  ],
  relatedArticleIds: ['nagaland-agricultural-reforms'],
  metric: { value: '52%', label: "of India's tea production", change: 'stable' }
};

export default article;
