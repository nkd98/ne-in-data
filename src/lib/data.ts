import type { Article, Author, Topic, Visual } from './types';

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
      id: 'tea-growers-distribution',
      title: 'Tea Cultivation Distribution by District',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_ex.csv',
        x: 'District',
        stacks: ['small share pct', 'big growers pct'],
        stackLabels: {
          'small share pct': 'Small Tea Growers',
          'big growers pct': 'Large Tea Estates'
        },
        colors: {
          'small share pct': '#91cc75',
          'big growers pct': '#5470c6'
        },
        yLabel: 'Area Distribution (%)'
      },
      caption: 'Proportion of tea cultivation area between small tea growers and large estates across districts.',
      units: '%',
      coverage: 'Districts of Assam',
      source: { 
        name: 'Tea Board of India', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_ex.csv' 
      },
      lastUpdated: '2025-10-30',
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

const articles: any[] = [
  {
    slug: 'assam-tea-cultivation-landscape',
    title: "Assam's Tea Growing Landscape: Small Growers vs Large Estates",
    subtitle: 'Analysis of land distribution between small tea growers and established estates reveals changing dynamics in tea cultivation',
    authorIds: ['jane-doe', 'john-smith'],
    topicIds: ['agriculture'],
    status: 'published',
    publishedAt: '2025-11-01',
    updatedAt: '2025-11-01',
    readingTime: 5,
    seo: { 
      description: 'An in-depth look at how tea cultivation area is distributed between small-scale growers and large estates across different districts of Assam.'
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
        type: 'h2', 
        content: 'District-wise Distribution' 
      },
      { 
        type: 'p', 
        content: 'The following chart shows how tea cultivation area is distributed between small growers and large estates across different districts of Assam. This distribution pattern reveals interesting regional variations and the evolving nature of tea cultivation in the state.'
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
        content: 'The data reveals significant variations in the distribution pattern across districts. Some areas show a strong presence of small tea growers, while others remain dominated by traditional large estates. These differences often reflect historical land use patterns, local economic conditions, and the success of small grower initiatives.'
      },
      { 
        type: 'callout', 
        content: 'Small tea growers have emerged as a vital force in Assam\'s tea industry, contributing significantly to the total cultivation area and demonstrating the sector\'s evolving inclusivity.' 
      },
      { 
        type: 'methods', 
        content: 'Analysis is based on land holding data from the Tea Board of India. Small tea growers are defined as those with tea cultivation areas up to 10.12 hectares (25 acres).' 
      },
      { 
        type: 'sources', 
        content: 'Data sourced from the Tea Board of India\'s land holding records and district-wise cultivation statistics.' 
      }
    ],
    relatedArticleIds: ['assam-tea-exports-composition', 'assam-employment-trends-2011-2024'],
    metric: { 
      value: '45%', 
      label: 'average small grower share', 
      change: 'increase' 
    }
  },
  {
    slug: 'assam-tea-exports-composition',
    title: "Evolution of Assam's Tea Export Portfolio",
    subtitle: 'A detailed breakdown of tea varieties in Assam\'s export market reveals shifting consumer preferences',
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
        content: 'The composition of Assam\'s tea exports has evolved significantly, reflecting both changing global preferences and adaptations in local production methods. This analysis examines how different tea varieties have contributed to the export market over time.'
      },
      { 
        type: 'h2', 
        content: 'Shifting Patterns in Tea Varieties' 
      },
      { 
        type: 'p', 
        content: 'The following chart illustrates how the proportion of different tea varieties in Assam\'s exports has changed. This visualization helps us understand the dynamic nature of tea production and market demands.'
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
        content: 'The rise in green tea proportion signals a growing international demand for healthier tea options and Assam\'s capability to adapt its production methods.' 
      },
      { 
        type: 'methods', 
        content: 'Data analysis is based on official export records from the Tea Board of India. The proportions are calculated as percentages of total annual exports for each variety.' 
      },
      { 
        type: 'sources', 
        content: 'Export composition data sourced from the Tea Board of India\'s annual reports and export statistics database.' 
      }
    ],
    relatedArticleIds: ['assam-employment-trends-2011-2024', 'nagaland-agricultural-reforms'],
    metric: { 
      value: '15%', 
      label: 'increase in specialty tea exports', 
      change: 'increase' 
    }
  },
  {
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
      description: 'In-depth analysis of Assam tea exports, examining historical trends, market challenges, and future prospects for the industry.',
      canonical: null
    },
    heroImage: { id: 'assam-tea-plantation', alt: 'Lush tea plantations in Assam with workers plucking tea leaves' },
    blocks: [
      { 
        type: 'intro', 
        content: 'Assam tea, known for its rich flavor and distinctive character, has long been a cornerstone of India\'s agricultural exports. This analysis examines the export trends and their implications for the region\'s economy.'
      },
      { 
        type: 'h2', 
        content: 'Historical Export Trends' 
      },
      { 
        type: 'p', 
        content: 'The following chart illustrates the evolution of tea exports from Assam over the years. The data reveals interesting patterns that reflect both local production capabilities and global market demands.'
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
        content: 'Assam produces approximately 52% of India\'s tea and contributes significantly to the global tea market.' 
      },
      { 
        type: 'methods', 
        content: 'The analysis uses official export data from the Tea Board of India. Export volumes are measured in million kilograms and represent the total annual exports from Assam to various international markets.' 
      },
      { 
        type: 'sources', 
        content: 'Data sourced from the Tea Board of India\'s annual reports and export statistics database.' 
      }
    ],
    relatedArticleIds: ['nagaland-agricultural-reforms'],
    metric: { value: '52%', label: 'of India\'s tea production', change: 'stable' }
  },
  {
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
      { type: 'intro', content: 'Assam has witnessed significant shifts in its employment landscape over the past decade. This article dissects the data to reveal the underlying trends, successes, and persistent challenges.' },
      { type: 'h2', content: 'Overall Employment Growth' },
      { type: 'p', content: 'From 2011 to 2024, the state\'s overall employment rate has improved, reflecting economic development and new opportunities. The following chart illustrates this upward trajectory.' },
      { type: 'chart', visualId: 'assam-employment-rate' },
      { type: 'h3', content: 'Sectoral Contributions' },
      { type: 'p', content: 'The services sector has emerged as the largest contributor to new jobs, while the agricultural sector\'s share has seen a gradual decline, a common sign of economic transition.' },
      { type: 'callout', content: 'The IT and services sectors in Guwahati have absorbed over 50,000 new workers in the last five years alone.' },
      { type: 'methods', content: 'The analysis is based on quarterly reports from the State Labour Department and data from the National Statistical Office (NSO) surveys. Employment rate is calculated as the percentage of the working-age population that is employed.' },
      { type: 'sources', content: 'Data sourced from the official websites of the State Labour Department of Assam and the National Statistical Office (NSO).' },
    ],
    relatedArticleIds: ['mizoram-literacy-push', 'nagaland-agricultural-reforms'],
    metric: { value: '+7.0%', label: 'since 2011', change: 'increase' }
  },
  {
    slug: 'mizoram-literacy-push',
    title: 'Why Mizoram leads India in literacy',
    subtitle: 'Exploring the role of community, policy, and innovation in maintaining one of the highest literacy rates in the country.',
    authorIds: ['john-smith'],
    topicIds: ['education'],
    status: 'published',
    publishedAt: '2024-05-20',
    updatedAt: '2024-05-22',
    readingTime: 6,
    seo: { description: 'An exploration of the factors contributing to Mizoram\'s high literacy rate, including community participation and government initiatives.' },
    heroImage: { id: 'mizoram-literacy', alt: 'Students in a classroom in Mizoram.' },
    blocks: [
      { type: 'intro', content: 'Mizoram\'s success in education is a story of community effort and effective governance. This article delves into the key drivers behind its impressive literacy statistics.' },
      { type: 'h2', content: 'Literacy Rate Comparison' },
      { type: 'chart', visualId: 'mizoram-literacy-rate' },
      { type: 'p', content: 'The state has consistently ranked among the top in India for literacy. The chart above shows the progress made between the 2011 and 2021 censuses.' },
      { type: 'callout', content: 'Community-led initiatives, such as local libraries and reading clubs, have played a pivotal role in fostering a culture of learning.' },
      { type: 'methods', content: 'Literacy rates are derived from decadal census data provided by the National Statistical Office.' },
      { type: 'sources', content: 'Data sourced from the Census of India reports.' },
    ],
    relatedArticleIds: ['assam-employment-trends-2011-2024', 'nagaland-agricultural-reforms'],
    metric: { value: '93.5%', label: 'literacy rate', change: 'increase' }
  },
  {
    slug: 'nagaland-agricultural-reforms',
    title: "Nagaland's agricultural shift: What the data shows",
    subtitle: 'How modern techniques and crop diversification are transforming agriculture in Nagaland, moving beyond traditional farming.',
    authorIds: ['jane-doe', 'john-smith'],
    topicIds: ['agriculture'],
    status: 'published',
    publishedAt: '2024-04-10',
    updatedAt: '2024-04-12',
    readingTime: 9,
    seo: { description: 'A look into Nagaland\'s agricultural reforms, focusing on crop diversification and the adoption of modern farming technologies.' },
    heroImage: { id: 'nagaland-agriculture', alt: 'Terraced fields in Nagaland.' },
    blocks: [
      { type: 'intro', content: 'Agriculture in Nagaland is undergoing a significant transformation. Farmers are moving beyond subsistence farming to embrace commercial crops and sustainable practices.' },
      { type: 'h2', content: 'Dominant Crops' },
      { type: 'p', content: 'While rice remains the staple, there is a growing emphasis on high-value crops. The table below outlines the production of major crops in the state for the year 2023.' },
      { type: 'table', visualId: 'nagaland-crop-production' },
      { type: 'methods', content: 'Production data is collected annually by the Directorate of Agriculture, Nagaland, through field surveys.' },
      { type: 'sources', content: 'Data is from the annual report of the Directorate of Agriculture, Nagaland.' },
    ],
    relatedArticleIds: ['assam-employment-trends-2011-2024', 'mizoram-literacy-push'],
    metric: { value: '530k tons', label: 'rice production', change: 'increase' }
  },
];

// Helper functions to simulate data fetching
export const getArticles = () => articles as any as Article[];
export const getArticleBySlug = (slug: string) => articles.find(a => a.slug === slug) as any as Article;
export const getAuthors = () => authors;
export const getAuthorById = (id: string) => authors.find(a => a.id === id);
export const getTopics = () => topics;
export const getTopicBySlug = (slug: string) => topics.find(t => t.slug === slug);
export const getVisuals = () => visuals;
export const getVisualById = (id: string) => visuals.find(v => v.id === id);
