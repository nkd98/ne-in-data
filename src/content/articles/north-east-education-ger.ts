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
  seo: {
    description: "Looking at the paradox of high literacy rates yet low educational attainment in north-east India.",
  },
  heroImage: {
    id: 'assam-tea-landscape',
    alt: 'Aerial view of tea plantations showing both small holdings and large estates in Assam'
  },

  blocks: [
    {
      type: 'intro',
      content: 'North-east India posts some of the country’s highest literacy rates, yet enrolment drops sharply as students progress. Gross enrolment ratio (GER) by stage shows where the slide begins.'
    },
    {
      type: 'chart',
      visualId: 'ne-ger-stage'
    },
    {
      type: 'h2',
      content: 'Where the advantage flips'
    },
    {
      type: 'p',
      content: 'North-east states lead the all-India average through Class 5. By Classes 9–12, GER converges; in higher education the region slips just below the national rate.'
    },
    {
      type: 'chart',
      visualId: 'ne-ger-states'
    },
    {
      type: 'chart',
      visualId: 'ne-ger-distribution'
    },
    {
      type: 'callout',
      content: 'The GER gap reverses after primary school: the North-East leads early years, but trails all-India by higher education.'
    },
    {
      type: 'methods',
      content: 'Gross enrolment ratio (GER) measures enrolment as a share of population in the corresponding age group. Stage codes mirror the source file (pre_primary_class2_t through high_education_t).'
    },
    {
      type: 'sources',
      content: 'UDISE+ 2022-23; AISHE 2021-22 (compiled in Supabase datasets).'
    }
  ],
  relatedArticleIds: ['assam-tea-exports-composition', 'assam-employment-trends-2011-2024']
};

export default article;
