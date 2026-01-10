import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'ne-forest-cover',
  title: 'Forest Loss in Northeast India: What the Data Shows',
  subtitle: 'Tracking forest loss over time, differences across states, and how loss compares with gain.',
  authorIds: ['niruj'],
  topicIds: ['environment'],
  status: 'published',
  publishedAt: '2026-01-10',
  updatedAt: '2026-01-10',
  readingTime: 3,
  compactBlocks: true,
  seo: {
    description: 'Tracking forest loss over time, differences across states, and how loss compares with gain.',
  },
  heroImage: {
    id: 'assam-tea-landscape',
    alt: 'Aerial view of tea plantations showing both small holdings and large estates in Assam'
  },
  blocks: [
    {
      type: 'intro',
      content: 'The Northeast is often described as one of India\'s greenest regions. Large parts of the landscape are still forested, but forest cover alone does not tell us how fast forests are changing.'
    },
    {
      type: 'p',
      content: 'These charts track forest loss over time in Northeast India, how it differs across states, and how it compares with forest gain. Forest loss here means tree cover that disappeared in a given year, whether or not trees grew back later.'
    },
    {
      type: 'h2',
      content: 'Forest loss stayed low for years, then jumped'
    },
    {
      type: 'p',
      content: 'The first chart shows annual forest loss in the Northeast from 2001 to 2023.'
    },
    {
      type: 'chart',
      visualId: 'ne-forest-loss-area'
    },
    {
      type: 'p',
      content: 'For more than a decade, forest loss moved within a relatively narrow range. In the early 2000s and into the early 2010s, the region was losing roughly 30,000 to 60,000 hectares of forest each year. Some years were worse than others, but the overall level was fairly stable.'
    },
    {
      type: 'p',
      content: 'That changed after 2013. Forest loss rises quickly, reaching a peak around 2017, when close to 157,000 hectares were lost in a single year. Losses fall after that peak, but they do not return to earlier levels. Since then, annual forest loss has remained much higher than before, usually around 95,000 to 113,000 hectares per year.'
    },
    {
      type: 'p',
      content: 'So the story is not just about one bad year. It is about a shift to a higher level of forest loss that has persisted.'
    },

    {
      type: 'h2',
      content: 'The increase is not evenly spread across states'
    },
    {
      type: 'p',
      content: 'The regional trend hides big differences across states, which become clear in the second chart.'
    },
    {
      type: 'chart',
      visualId: 'ne-forest-loss-state-lines'
    },
    {
      type: 'p',
      content: 'Mizoram stands out most clearly. Forest loss there stays relatively low for years and then rises sharply in the mid-2010s, approaching 30,000 hectares per year at its peak. Losses fall afterward, but remain well above earlier levels.'
    },
    {
      type: 'p',
      content: 'Assam shows a different pattern. There is no single dramatic spike, but forest loss increases gradually and stays high. In recent years, Assam has been losing around 15,000 to 20,000 hectares of forest each year, making it one of the largest contributors to total loss in the region.'
    },
    {
      type: 'p',
      content: 'Other states, Arunachal Pradesh, Nagaland, Manipur, and Meghalaya, also see higher forest loss after the early 2010s, but at lower levels and with less extreme swings.'
    },
    {
      type: 'p',
      content: 'Sikkim looks very different from the rest. Forest loss remains minimal throughout the period.'
    },
 
    {
      type: 'h2',
      content: 'Forest gain exists, but it does not make up for the loss'
    },
    {
      type: 'p',
      content: 'The third chart compares how much forest was lost with how much was gained.'
    },
    {
      type: 'chart',
      visualId: 'ne-forest-loss-vs-gain'
    },
    {
      type: 'p',
      content: 'In almost every state, total forest loss is much larger than forest gain. Assam and Mizoram have lost the most forest overall, while gains remain far smaller. The same pattern holds for Arunachal Pradesh, Nagaland, Manipur, and Meghalaya: some areas have gained tree cover, but not enough to offset what has been lost.'
    },
    {
      type: 'p',
      content: 'Sikkim is again the exception, with very small losses and modest gains, leaving it with a net gain overall.'
    },
  
    {
      type: 'h2',
      content: 'What this adds up to'
    },
    {
      type: 'p',
      content: 'Taken together, the charts show a clear pattern. Forest loss in Northeast India was relatively moderate for many years, then rose sharply in the mid-2010s and has stayed high since. A few states account for a large share of this loss, while others contribute less. Across most of the region, forest gain has not kept pace with forest loss.'
    }
  ],
  relatedArticleIds: ['north-east-education-ger', 'assam-employment-trends-2011-2024']
};

export default article;
