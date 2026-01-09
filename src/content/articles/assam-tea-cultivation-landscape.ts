import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'assam-tea-cultivation-landscape',
  title: "Who grows Assam's tea, and who controls the tea land?",
  subtitle: 'A look at how Assam tea cultivation is built on thousands of small growers, yet still dominated by large estates.',
  authorIds: ['niruj'],
  topicIds: ['agriculture'],
  status: 'published',
  publishedAt: '2025-11-01',
  updatedAt: '2025-11-01',
  readingTime: 5,
  compactBlocks: true,
  seo: {
    description: 'A look at how Assam tea cultivation is built on thousands of small growers, yet still dominated by large estates.',
  },
  heroImage: {
    id: 'assam-tea-landscape',
    alt: 'Aerial view of tea plantations showing both small holdings and large estates in Assam'
  },
  blocks: [
    {
      type: 'intro',
      content: 'The landscape of tea cultivation in Assam is experiencing a significant transformation, with small tea growers playing an increasingly important role alongside traditional large estates. This analysis examines the distribution of tea cultivation area across different districts, highlighting the emerging dual structure of the industry.'
    },
    {
      type: 'p',
      content: 'Small and large growers are defined by the area they operate. In Assam, anyone cultivating up to 10.12 hectares of tea is classified as a small grower. Those operating more than this are counted as large growers, which include the traditional estate system.'
    },
    {
      type: 'h2',
      content: 'Statewide snapshot'
    },
    {
      type: 'p',
      content: 'State-level data shows that while small growers make up nearly all registered producers, large estates still command a larger share of tea land and harvest about half of the output. The chart below contrasts registrations, area, and production share across the two groups.'
    },
    {
      type: 'chart',
      visualId: 'tea-growers-summary'
    },
    {
      type: 'h2',
      content: 'District-wise distribution'
    },
    {
      type: 'p',
      content: 'The following chart looks across districts to reveal how those statewide averages mask striking variation. Some districts are clearly dominated by small growers, whereas others remain strongholds of large estates.'
    },
    {
      type: 'chart',
      visualId: 'tea-growers-distribution'
    },
    {
      type: 'h2',
      content: 'Regional variations'
    },
    {
      type: 'p',
      content: 'District-level splits differ sharply: Dhemaji and Karbi Anglong are now overwhelmingly small-grower territory, while districts such as Morigaon and Golaghat remain dominated by large estates. Local land history and institutional support are key drivers of these differences.'
    },
    {
      type: 'p',
      content: "Small tea growers have emerged as a vital force in Assam's tea industry, commanding entire districts in some cases, even while large estates still anchor overall production."
    },
    {
      type: 'p',
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
