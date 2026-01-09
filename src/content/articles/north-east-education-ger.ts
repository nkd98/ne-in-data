import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'north-east-education-ger',
  title: "North-east India's education paradox",
  subtitle:  "Looking at the paradox of high literacy rates yet low educational attainment in north-east India.",
  authorIds: ['niruj'],
  topicIds: ['education'],
  status: 'published',
  publishedAt: '2025-11-01',
  updatedAt: '2025-11-01',
  readingTime: 5,
  compactBlocks: true,
  seo: {
    description: "Looking at the paradox of",
  },
  heroImage: {
    id: 'ne-education-ger',
    alt: ''
  },

  blocks: [
    {
      type: 'p',
      content: 'The story of schooling in the Northeast begins with promise: high enrollment, wide access, and near-universal entry into early grades. But as students advance, the pattern shifts. These charts track this shift from the start of school to college.'
    },
    {
      type: 'p',
      content: 'This article uses one measure: the Gross Enrolment Ratio (GER). GER is the number of students enrolled at a given stage divided by the population in the official age group for that stage (×100). Because it counts all enrolled students—also those who are over-age or under-age—GER can cross 100. For example, if the official age-group population for a stage is 10,000, but total enrolment is 11,200 (because some students are older, some start early, and some repeat grades), the GER is 112.'
    },
    { type: 'h2',
      content: 'The education pipeline narrows'
    },
    {
      type: 'chart',
      visualId: 'ne-ger-stage'
    },
    {
      type: 'h3',
      content: 'Where the advantage flips'
    },
    {
      type: 'p',
      content: 'The first chart compares the Northeast average with All-India, across education stages. At the pre-primary level the All-India GER is 40% and the North-east average is double of that at 80%. Enrollment increases in primary level for both cases. It reaches 116% in the NE states and 97% in All India.'
    },
    {
      type: 'p',
      content: 'After primary school, the Northeast drops faster. By secondary and higher education, the Northeast moves close to the national level and then slips slightly below it. This is the core paradox: strong entry into schooling, weaker continuation through later stages.'
    },
    {
      type: 'p',
      content: 'To understand how the different states vary, we take a deeper look in the following chart.'
    },
    {
      type: 'h2',
      content: 'Early advantage is widespread, but states diverge sharply'
    },
    {
      type: 'chart',
      visualId: 'ne-ger-distribution'
    },
    {
      type: 'p',
      content: 'The second chart helps explain what sits behind the Northeast average. It plots each state as a dot at each schooling stage, and marks the All-India GER with an X. '
    },
    {
      type: 'p',
      content: 'In the foundational years (pre-primary to Class 2), every Northeastern state lies to the right of the national marker at 42%. But the spread across states is large. Some states like Assam and Tripura are only modestly above the national level, while others are far ahead. Meghalaya stands out as an extreme case, with a very high GER (112%) at the start of schooling.'
    },
    {
      type: 'p',
      content: 'In Class 3–5, the dispersion becomes even wider. The national marker is at 97%, but the Northeast includes states well above that range. Meghalaya again stands out, reaching roughly 158%. At this stage, the region’s “early advantage” is not coming from one or two states—it is present across the region, but with very different magnitudes.'
    },
    {
      type: 'p',
      content: 'From Class 6–8, the dots move leftward. The cluster tightens. Most states sit near the national level, with fewer extreme values. This is where the pipeline begins to narrow.By Class 9–12, the dots are tightly grouped between roughly the 50–75% range, around the national value at 66%. Differences across states still exist, some hold up better than others, but the big early gaps are mostly gone.'
    },
    {
      type: 'p',
      content: 'In higher education, the entire picture shifts downward. The national marker is at 29% and most states are in a similar low band. A few do better (Sikkim at 39%), while some are much lower (Assam at 17%). But the main feature is the same: participation is low everywhere at this stage'
    },
    {
      type: 'h2',
      content: 'What this tells us'
    },
    {
      type: 'p',
      content: 'The Northeast’s advantage is strongest at the start of schooling, but it fades after primary school as fewer students continue into secondary and then college. Differences across states are large in the early years, but they shrink later because enrolment falls everywhere. By higher education, the region ends up in a low range, with only a few states standing out.'
    },
    {
      type: 'sources',
      content: 'UDISE+ 2022-23; AISHE 2021-22 (compiled in Supabase datasets).'
    }
  ],
  relatedArticleIds: ['assam-tea-exports-composition', 'assam-employment-trends-2011-2024']
};

export default article;
