import type { Article, Author, Topic, Visual } from './types';
import articles from '@/content/articles';

const authors: Author[] = [
  { id: 'jane-doe', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=jane', role: 'Lead Researcher' },
  { id: 'john-smith', name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=john', role: 'Data Scientist' },
];

const topics: Topic[] = [
  { id: 'employment', slug: 'employment', name: 'Employment', description: 'Trends and analysis of employment data across the North-Eastern states.', imageId: 'topic-employment', color: 'topic-teal' },
  { id: 'education', slug: 'education', name: 'Education', description: 'Insights into literacy rates, schooling, and educational infrastructure.', imageId: 'topic-education', color: 'topic-orange' },
  { id: 'agriculture', slug: 'agriculture', name: 'Agriculture', description: 'Data on crop production, farming practices, and agricultural economy.', imageId: 'topic-agriculture', color: 'topic-green' },
  { id: 'infrastructure', slug: 'infrastructure', name: 'Infrastructure', description: 'Development of infrastructure like roads, bridges, and power.', imageId: 'topic-infrastructure', color: 'topic-indigo' },
];

const visuals: Visual[] = [
    {
      id: 'tea-growers-summary',
      title: 'Statewide Comparison of Small vs Big Tea Growers',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_dist.csv',
        x: 'Metric',
        stacks: ['Big Growers', 'Small Growers'],
        stackLabels: {
          'Big Growers': 'Large Tea Estates',
          'Small Growers': 'Small Tea Growers'
        },
        colors: {
          'Big Growers': '#2B3C63',
          'Small Growers': '#0FA77E'
        },
        yLabel: 'Share (%)'
      },
      caption: 'Registrations, cultivated area, and production split between small and large tea growers across Assam.',
      units: '%',
      coverage: 'Assam (statewide)',
      source: { 
        name: 'Statistical Handbook of Assam, 2023-24', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_dist.csv' 
      },
      lastUpdated: '2024-04-01',
      tags: ['agriculture', 'tea', 'assam', 'summary']
    },
    {
      id: 'tea-growers-distribution',
      title: 'Tea Cultivation Distribution by District',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_area_district.csv',
        x: 'District',
        stacks: ['Small Growers', 'Big Growers'],
        stackLabels: {
          'Small Growers': 'Small Tea Growers',
          'Big Growers': 'Large Tea Estates'
        },
        colors: {
          'Small Growers': '#0FA77E',
          'Big Growers': '#2B3C63'
        },
        yLabel: 'Area Distribution (%)'
      },
      caption: 'Proportion of tea cultivation area between small tea growers and large estates across districts.',
      units: '%',
      coverage: 'Districts of Assam',
      source: { 
        name: 'Statistical Handbook of Assam, 2023-24', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_area_district.csv' 
      },
      lastUpdated: '2024-04-01',
      tags: ['agriculture', 'tea', 'assam', 'land-distribution']
    },
    {
      id: 'assam-tea-exports-stacked',
      title: 'Tea Export Distribution by Type',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_ex.csv',
        x: 'year',
        stacks: ['orthodox', 'ctc', 'green', 'others'],
        stackLabels: {
          orthodox: 'Orthodox',
          ctc: 'CTC',
          green: 'Green Tea',
          others: 'Other Types'
        },
        colors: {
          orthodox: '#91cc75',
          ctc: '#fac858',
          green: '#5470c6',
          others: '#ee6666'
        },
        yLabel: 'Proportion of Tea Exports'
      },
      caption: 'Distribution of different tea types in Assam\'s exports over the years.',
      units: '%',
      coverage: 'State of Assam',
      source: { name: 'Tea Board of India', url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_ex.csv' },
      lastUpdated: '2025-10-30',
      tags: ['agriculture', 'exports', 'tea', 'assam']
    },
    {
      id: 'assam-tea-exports',
      title: 'Tea Exports from Assam',
      type: 'line',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_ex.csv',
        x: 'year',
        y: 'exports',
        yLabel: 'Tea Exports (in Million Kg)'
      },
      caption: 'Historical trends in tea exports from Assam showing annual fluctuations and overall growth.',
      units: 'Million Kg',
      coverage: 'State of Assam',
      source: { name: 'Tea Board of India', url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_ex.csv' },
      lastUpdated: '2025-10-30',
      tags: ['agriculture', 'exports', 'tea', 'assam']
    },
    {
      id: 'assam-employment-rate',
      title: 'Employment Rate in Assam (2011-2024)',
      type: 'line',
      spec: {
        data: [
          { year: '2011', rate: 58 }, { year: '2014', rate: 60 }, { year: '2017', rate: 62 },
          { year: '2020', rate: 61 }, { year: '2024', rate: 65 },
        ],
        x: 'year',
        y: 'rate',
        yLabel: 'Employment Rate (%)'
      },
      caption: 'The employment rate in Assam has seen a steady increase, with a slight dip in 2020.',
      units: '%',
      coverage: 'State of Assam',
      source: { name: 'State Labour Department', url: '#' },
      lastUpdated: '2024-05-01',
      tags: ['employment', 'assam', '2011-2024']
    },
    {
      id: 'mizoram-literacy-rate',
      title: 'Literacy Rate in Mizoram (2011 vs 2021)',
      type: 'bar',
      spec: {
        data: [
            { year: '2011', rate: 91.3 },
            { year: '2021', rate: 93.5 },
        ],
        x: 'year',
        y: 'rate',
        yLabel: 'Literacy Rate (%)'
      },
      caption: 'Mizoram continues to be one of the states with the highest literacy rates in India.',
      units: '%',
      coverage: 'State of Mizoram',
      source: { name: 'National Statistical Office', url: '#' },
      lastUpdated: '2023-11-15',
      tags: ['education', 'mizoram', '2011-2021']
    },
    {
      id: 'nagaland-crop-production',
      title: 'Major Crop Production in Nagaland (2023)',
      type: 'table',
      spec: {
        headers: ['Crop', 'Production (in \'000 Tonnes)'],
        rows: [
            ['Rice', 530],
            ['Maize', 120],
            ['Pulses', 45],
            ['Oilseeds', 30],
        ]
      },
      caption: 'Rice remains the dominant crop in Nagaland\'s agricultural output.',
      units: 'Thousand Tonnes',
      coverage: 'State of Nagaland',
      source: { name: 'Directorate of Agriculture, Nagaland', url: '#' },
      lastUpdated: '2024-02-20',
      tags: ['agriculture', 'nagaland', '2023']
    }
];

// Articles are loaded from src/content/articles

// Helper functions to simulate data fetching
export const getArticles = (): Article[] => articles;
export const getArticleBySlug = (slug: string): Article | undefined => articles.find(a => a.slug === slug);
export const getAuthors = () => authors;
export const getAuthorById = (id: string) => authors.find(a => a.id === id);
export const getTopics = () => topics;
export const getTopicBySlug = (slug: string) => topics.find(t => t.slug === slug);
export const getVisuals = () => visuals;
export const getVisualById = (id: string) => visuals.find(v => v.id === id);
