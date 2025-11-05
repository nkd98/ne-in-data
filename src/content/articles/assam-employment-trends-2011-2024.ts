import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'assam-employment-trends-2011-2024',
  title: "How Assam's job market changed over a decade",
  subtitle: 'An in-depth look at employment trends from 2011 to 2024, highlighting sector-wise growth and impacts.',
  authorIds: ['jane-doe'],
  topicIds: ['employment'],
  status: 'published',
  publishedAt: '2024-06-15',
  updatedAt: '2024-06-18',
  readingTime: 8,
  seo: { description: 'Analysis of Assam employment data from 2011 to 2024, showing trends in job growth and sector-wise distribution.' },
  heroImage: { id: 'assam-employment-trends', alt: 'A chart depicting rising employment in Assam.' },
  blocks: [
    { type: 'intro', content: "Assam has witnessed significant shifts in its employment landscape over the past decade. This article dissects the data to reveal the underlying trends, successes, and persistent challenges." },
    { type: 'h2', content: 'Overall Employment Growth' },
    { type: 'p', content: "From 2011 to 2024, the state's overall employment rate has improved, reflecting economic development and new opportunities. The following chart illustrates this upward trajectory." },
    { type: 'chart', visualId: 'assam-employment-rate' },
    { type: 'h3', content: 'Sectoral Contributions' },
    { type: 'p', content: "The services sector has emerged as the largest contributor to new jobs, while the agricultural sector's share has seen a gradual decline, a common sign of economic transition." },
    { type: 'callout', content: 'The IT and services sectors in Guwahati have absorbed over 50,000 new workers in the last five years alone.' },
    { type: 'methods', content: 'The analysis is based on quarterly reports from the State Labour Department and data from the National Statistical Office (NSO) surveys. Employment rate is calculated as the percentage of the working-age population that is employed.' },
    { type: 'sources', content: 'Data sourced from the official websites of the State Labour Department of Assam and the National Statistical Office (NSO).' }
  ],
  relatedArticleIds: ['mizoram-literacy-push', 'nagaland-agricultural-reforms'],
  metric: { value: '+7.0%', label: 'since 2011', change: 'increase' }
};

export default article;
