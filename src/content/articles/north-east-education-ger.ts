import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'north-east-education-ger',
  title: "North-east India's education paradox",
  subtitle: "Looking at the paradox of high literacy rates yet low educational attainment in north-east India.",
  authorIds: ['niruj'],
  topicIds: ['education'],
  status: 'published',
  publishedAt: '2026-01-10',
  updatedAt: '2026-01-10',
  readingTime: 5,
  compactBlocks: true,
  seo: {
    description: "Looking at the paradox of high literacy rates yet low educational attainment in north-east India.",
  },
  heroImage: {
    id: 'ne-education-ger',
    alt: ''
  },

  blocks: [
    {
      type: 'intro',
      content: 'The story of schooling in the Northeast begins with promise: high enrollment, wide access, and near-universal entry into early grades. But as students advance, the pattern shifts. These charts track this shift from the start of school to college.'
    },
    {
      type: 'p',
      content: 'This article uses one measure: the Gross Enrolment Ratio (GER). GER is the number of students enrolled at a given stage divided by the population in the official age group for that stage (×100). Because it counts all enrolled students—also those who are over-age or under-age—GER can cross 100. For example, if the official age-group population for a stage is 10,000, but total enrolment is 11,200 (because some students are older, some start early, and some repeat grades), the GER is 112.'
    },
    {
      type: 'h2',
      content: 'The education pipeline narrows'
    },
    {
      type: 'p',
      content: 'The first chart compares the Northeast average with All-India, across education stages. At the Foundational stage (pre-primary to Class 2), the All-India GER is about 42% and the Northeast average is about 81%—roughly double. Enrollment increases in the Preparatory stage (Class 3–5) for both cases, reaching 116% in the NE states and 97% in All India.'
    },
    {
      type: 'chart',
      visualId: 'ne-ger-stage'
    },
    {
      type: 'p',
      content: '[<em>Note: Foundational covers pre-primary to Class 2; Preparatory covers Class 3 to 5; Middle covers Class 6 to 8; Secondary covers Class 9 to 12. Higher education refers to ages 18 to 23.</em>]'
    },
    {
      type: 'p',
      content: 'After the preparatory stage, the Northeast drops faster. By secondary and higher education, the Northeast sits at or slightly below the national level. This is the core paradox: strong entry into schooling, weaker continuation through later stages.'
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
      type: 'p',
      content: 'The second chart helps explain what sits behind the Northeast average. It plots each state as a line across stages, with the All-India series highlighted for comparison.'
    },
    {
      type: 'chart',
      visualId: 'ne-ger-distribution'
    },
    {
      type: 'p',
      content: '[<em>Note: Foundational covers pre-primary to Class 2; Preparatory covers Class 3 to 5; Middle covers Class 6 to 8; Secondary covers Class 9 to 12. Higher education refers to ages 18 to 23.</em>]'
    },
    {
      type: 'p',
      content: 'In the foundational years (pre-primary to Class 2), every Northeastern state line sits above the All-India line at about 42%. But the spread across states is large. Some states like Assam and Tripura are only modestly above the national level, while others are far ahead. Meghalaya stands out as an extreme case, with a very high GER (about 123%) at the start of schooling.'
    },
    {
      type: 'p',
      content: 'In Class 3–5, the spread between state lines remains wide. The All-India line sits at 97%, but the Northeast includes states well above that range. Meghalaya again stands out, reaching roughly 158%. At this stage, the region’s “early advantage” is not coming from one or two states—it is present across the region, but with very different magnitudes.'
    },
    {
      type: 'p',
      content: 'From Class 6–8, the state lines dip and begin to converge. The cluster tightens. Most states sit near the national level, with fewer extreme values. This is where the pipeline begins to narrow. By Class 9–12, the lines are tightly grouped between roughly the 50–75% range, around the national value at 66%. Differences across states still exist, some hold up better than others, but the big early gaps are mostly gone.'
    },
    {
      type: 'p',
      content: 'In higher education, the entire picture shifts downward. The All-India line is at 29% and most states are in a similar low band. A few do better (Sikkim at 39%), while some are much lower (Assam at 17%). But the main feature is the same: participation is low everywhere at this stage.'
    },

    {
      type: 'h2',
      content: 'What this tells us'
    },
    {
      type: 'p',
      content: 'The Northeast’s advantage is strongest at the start of schooling, but it fades after class 5. The pipeline narrows as fewer students continue into secondary and then college. Differences across states are large in the early years, but they shrink later because enrolment falls everywhere. By higher education, the region ends up in a low range, with only a few states standing out.'
    }
  ],
  relatedArticleIds: ['assam-tea-exports-composition', 'assam-employment-trends-2011-2024']
};

export default article;
