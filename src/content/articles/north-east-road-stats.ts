import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'north-east-road-stats',
  title: "How connected in north-east India is by road?",
  subtitle:  "A look at the road connectivity across the north-eastern states of India, examining the extent and quality of the road network.",
  authorIds: ['niruj'],
  topicIds: ['infastructure'],
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
      visualId: 'tea-growers-summary'
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
      visualId: 'tea-growers-distribution'
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
  playgroundContent: {
    hero: {
      kicker: 'Insight',
      deck: "A look at how Assam's tea cultivation is built on thousands of small growers, yet still dominated by large estates.",
      organization: 'Northeast in Data'
    },
    sections: [
      {
        type: 'prose',
        paragraphs: [
          'Tea cultivation in Assam has grown through two very different pathways: the rapid rise of small growers across the state and the long-established presence of large estates in the older plantation districts. Looking at growers alone gives the impression of a sector dominated almost entirely by small growers. But when we place land and production alongside these numbers, the structure of the industry becomes clearer.',
          'Small and large growers are defined by the area they operate. In Assam, anyone cultivating up to 10.12 hectares of tea is classified as a small grower. Those operating more than this are counted as large growers, which include the traditional estate system.',
        ]
      },
      {
        type: 'figure',
        kicker: 'Statewide snapshot',
        title: 'Growers, Land Operated, and Tea Output in Assam',
        description: '',
        chart: {
          csvUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_dist.csv',
          height: 360,
          indexScale: { type: 'band', round: false, reverse: false }
        },
        source: {
          label: 'Source: Statistical Handbook of Assam, 2023-24',
          url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_dist.csv'
        }
      },
      {
        type: 'prose',
        paragraphs: [
          'The first chart shows how these three pieces fit together. Small growers form almost the entire grower base, yet they cultivate just a little over one-third of the tea area. Despite this smaller land share, they now produce nearly half of Assam’s tea. This suggests that small growers have become central to the expansion of cultivation and are contributing significantly to output even within their limited land.', 
          'Large estates, on the other hand, operate most of the land and still produce slightly more than half of the state’s tea. Their dominance in land allows them to maintain high overall production even though they make up only a tiny share of total growers. The sector is therefore shaped by uneven land distribution, with small growers driving participation and estates anchoring the production base.',
        ]
      },
      {
        type: 'figure',
        kicker: 'District level',
        title: 'How Tea Land Is Shared Across Districts',
        description: '',
        chart: {
          csvUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_area_district.csv',
          height: 680
        },
        source: {
          label: 'Source: Statistical Handbook of Assam, 2023-24',
          url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_area_district.csv'
        }
      },
      {
        type: 'prose',
        paragraphs: [
          'The district chart shows how this structure varies across Assam.Districts like Dhemaji, Karbi Anglong, and Bongaigaon have become strong small-grower regions, where most of the area under tea is in small-grower hands. In contrast, the traditional tea belt of Upper Assam including Jorhat, Dibrugarh, Tinsukia, Golaghat remains estate-led, with large estates operating the majority of the land.',

          'These differences reflect how tea expanded: long-established estates in the east, and newer small-grower growth in the central and western districts. Across the state, however, the underlying pattern remains consistent: small growers are many, but estates continue to control most of the land.',
          'Taken together, the charts show a sector that is broad in participation but concentrated in land. Small growers are now essential to Assam’s tea economy, reaching almost every district. Yet the foundation of land and much of the production continues to sit with the estate system. This balance between widespread cultivation and concentrated land is what shapes tea in Assam today.',
        ]
      }
    ]
  },
  relatedArticleIds: ['assam-tea-exports-composition', 'assam-employment-trends-2011-2024']
};

export default article;
