import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'north-east-road-stats',
  title: "How connected in north-east India is by road?",
  subtitle:  "A look at the road connectivity across the north-eastern states of India, examining the extent and quality of the road network.",
  authorIds: ['niruj'],
  topicIds: ['infrastructure'],
  status: 'published',
  publishedAt: '2025-11-01',
  updatedAt: '2025-11-01',
  readingTime: 5,
  seo: {
    description: "A look at the road connectivity across the north-eastern states of India, examining the extent and quality of the road network.",
  },
  heroImage: {
    id: 'assam-tea-landscape',
    alt: 'Aerial view of tea plantations showing both small holdings and large estates in Assam'
  },
  layout: 'tea-playground',
  blocks: [
    {
      type: 'intro',
      content: 'The landscape of tea cultivation in Assam is experiencing a significant transformation, with small tea growers playing an increasingly important role alongside traditional large estates. This analysis examines the distribution of tea cultivation area across different districts, highlighting the emerging dual structure of the industry.'
    },
    {
      type: 'h2',
      content: 'Statewide Snapshot'
    },
    {
      type: 'p',
      content: 'State-level data shows that while small growers make up nearly all registered producers, large estates still command a larger share of tea land and harvest about half of the output. The chart below contrasts registrations, area, and production share across the two groups.'
    },
    {
      type: 'chart',
      visualId: 'road-density-ne'
    },
    {
      type: 'h2',
      content: 'District-wise Distribution'
    },
    {
      type: 'p',
      content: 'The following chart looks across districts to reveal how those statewide averages mask striking variation. Some districts are clearly dominated by small growers, whereas others remain strongholds of large estates.'
    },
    {
      type: 'chart',
      visualId: 'road-len-ne'
    },
    {
      type: 'h3',
      content: 'Regional Variations'
    },
    {
      type: 'p',
      content: 'District-level splits differ sharply: Dhemji and Karbi Anglong are now overwhelmingly small-grower territory, while districts such as Morigaon and Golaghat remain dominated by large estates. Local land history and institutional support are key drivers of these differences.'
    },
    {
      type: 'chart',
      visualId: 'road-surfaced-len-ne'
    },
    {
      type: 'callout',
      content: "Small tea growers have emerged as a vital force in Assam's tea industry—commanding entire districts in some cases—even while large estates still anchor overall production."
    },
    {
      type: 'methods',
      content: 'Analysis relies on the Statistical Handbook of Assam (2023-24). Small growers are defined as those with holdings up to 10.12 hectares (25 acres); statewide share values are taken directly from handbook tables and district values from the accompanying CSV extract.'
    },
    {
      type: 'sources',
      content: 'Statistical Handbook of Assam, 2023-24; district-level cultivation statistics compiled by the Tea Board of India.'
    }
  ],
  relatedArticleIds: ['assam-tea-exports-composition', 'assam-employment-trends-2011-2024']
};

export default article;
