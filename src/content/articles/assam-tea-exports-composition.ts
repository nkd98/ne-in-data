import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'assam-tea-exports-composition',
  title: "Evolution of Assam's Tea Export Portfolio",
  subtitle: "A detailed breakdown of tea varieties in Assam's export market reveals shifting consumer preferences",
  authorIds: ['jane-doe', 'john-smith'],
  topicIds: ['agriculture'],
  status: 'published',
  publishedAt: '2025-11-01',
  updatedAt: '2025-11-01',
  readingTime: 6,
  seo: {
    description: 'Analysis of Assam tea export composition, showing the changing distribution of tea varieties and their market impact over time.'
  },
  heroImage: {
    id: 'assam-tea-varieties',
    alt: 'Different varieties of Assam tea leaves arranged to show their distinct characteristics'
  },
  blocks: [
    {
      type: 'intro',
      content: "The composition of Assam's tea exports has evolved significantly, reflecting both changing global preferences and adaptations in local production methods. This analysis examines how different tea varieties have contributed to the export market over time."
    },
    {
      type: 'h2',
      content: 'Shifting Patterns in Tea Varieties'
    },
    {
      type: 'p',
      content: "The following chart illustrates how the proportion of different tea varieties in Assam's exports has changed. This visualization helps us understand the dynamic nature of tea production and market demands."
    },
    {
      type: 'chart',
      visualId: 'assam-tea-exports-stacked'
    },
    {
      type: 'h3',
      content: 'Key Insights'
    },
    {
      type: 'p',
      content: 'The data reveals several interesting trends in tea variety distribution. Traditional CTC (Crush, Tear, Curl) and Orthodox teas continue to dominate, while specialty varieties like green tea have shown steady growth, indicating evolving consumer preferences.'
    },
    {
      type: 'callout',
      content: "The rise in green tea proportion signals a growing international demand for healthier tea options and Assam's capability to adapt its production methods."
    },
    {
      type: 'methods',
      content: 'Data analysis is based on official export records from the Tea Board of India. The proportions are calculated as percentages of total annual exports for each variety.'
    },
    {
      type: 'sources',
      content: "Export composition data sourced from the Tea Board of India's annual reports and export statistics database."
    }
  ],
  relatedArticleIds: ['assam-employment-trends-2011-2024', 'nagaland-agricultural-reforms'],
  metric: {
    value: '15%',
    label: 'increase in specialty tea exports',
    change: 'increase'
  }
};

export default article;
