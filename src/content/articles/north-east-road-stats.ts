import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'north-east-road-stats',
  title: "How Connected Is the Northeast? A Data-Driven Look at Road Networks",
  subtitle: "Road density, per-capita availability, and surfaced roads show why connectivity across Northeast India remains uneven.",
  authorIds: ['niruj'],
  topicIds: ['infrastructure'],
  status: 'published',
  publishedAt: '2026-01-10',
  updatedAt: '2026-01-10',
  readingTime: 5,
  compactBlocks: true,
  seo: {
    description: "Road density, per-capita availability, and surfaced roads show why connectivity across Northeast India remains uneven.",
  },
  heroImage: {
    id: 'assam-tea-landscape',
    alt: 'Aerial view of tea plantations showing both small holdings and large estates in Assam'
  },

  blocks: [
    {
      type: 'intro',
      content: 'Road connectivity is central to day-to-day life in any region. It shapes whether people can access schools, hospitals, markets and government services. In a region defined by difficult terrain, heavy monsoons and frequent natural disasters, the usefulness of a road network depends both on how much of it exists and on how reliably it can be used.'
    },
    {
      type: 'p',
      content: 'To understand road connectivity in Northeast India more meaningfully, we look at three indicators that describe different aspects of access: the density of roads across land area, the amount of road available per person and the share of roads that are surfaced. Taken together, these indicators illustrate why connectivity in the Northeast is uneven and why the quality of roads is as crucial as their quantity.'
    },
    {
      type: 'h2',
      content: 'Road density across land area'
    },
    {
      type: 'p',
      content: 'Road density measures how many kilometres of road exist for every unit of land area, helping us understand how much of a state is physically reachable by road.'
    },
    {
      type: 'p',
      content: 'The first chart shows road density across states, separating rural and urban areas. Assam stands out. Its flat plains support a dense rural network, with values far above the national average and other states in the Northeast. Towns and villages are both well connected, and roads spread relatively easily across the Brahmaputra valley. In contrast, the hill states display a different pattern. Nagaland, Meghalaya and Sikkim have relatively high urban density, reflecting the compact nature of their towns, but rural road density remains much lower. These differences reflect how strongly geography shapes where roads can be built and maintained.'
    },
    {
      type: 'chart',
      visualId: 'road-density-ne'
    },
    {
      type: 'h2',
      content: 'Road length per 1,000 people'
    },
    {
      type: 'p',
      content: "Road length per 1,000 people indicates how much road is available for each resident, offering a sense of how access is shared across a state's population."
    },
    {
      type: 'p',
      content: 'Looking at road availability per person shifts the picture. Rural road length per 1,000 population is high in several hill states compared to the national average. This mainly reflects low population density. A modest network covers large areas with very few people, so each kilometre of road is shared by fewer residents. Assam and Tripura, which have far larger populations, appear lower on this measure even though Assam has the largest total road network in the Northeast. Urban values across states lie closer together because towns everywhere have more people sharing the same stretches of road. This indicator shows how population patterns can make networks feel more or less accessible despite similar physical lengths.'
    },
    {
      type: 'chart',
      visualId: 'road-len-ne'
    },
    {
      type: 'h2',
      content: 'Surfaced roads and year-round reliability'
    },
    {
      type: 'p',
      content: 'The share of surfaced roads shows how much of a network remains usable throughout the year, especially during periods of heavy rainfall.'
    },
    {
      type: 'p',
      content: "Surfacing adds another layer to the picture. In the Northeast, where monsoon rain is heavy and roads frequently run along slopes, unsurfaced roads are often usable for only part of the year. Comparing total and surfaced road length shows clear differences between states. Assam's large network shrinks substantially once only surfaced segments are considered; roughly three-quarters of its roads remain unsurfaced. Arunachal Pradesh shows a similar gap. In contrast, Tripura and Sikkim have smaller networks but a much higher proportion of surfaced roads, meaning they remain more consistently usable. Mizoram, shaped by some of the most challenging terrain in India, shows constraints both in the size of the network and in how much of it is paved. This highlights that connectivity depends not just on reach, but on the reliability of the roads that exist."
    },
    {
      type: 'chart',
      visualId: 'road-surfaced-len-ne'
    },
    {
      type: 'h2',
      content: 'What this adds up to'
    },
    {
      type: 'p',
      content: "Taken together, these three indicators reveal a region that is connected in uneven ways. Assam's plains support a dense network that reaches both towns and villages, but the limited share of surfaced roads affects reliability. Nagaland, Meghalaya and Manipur show strong urban connectivity but weaker rural access, and hill states continue to face the physical constraints of their terrain."
    },
    {
      type: 'p',
      content: 'Understanding these patterns helps explain why travel across the Northeast can vary so sharply from one place to another. It also shows that improving connectivity is not only about expanding road length, but about ensuring that existing roads remain accessible, durable and safe throughout the year.'
    },
  ],
  relatedArticleIds: ['assam-tea-exports-composition', 'assam-employment-trends-2011-2024']
};

export default article;
