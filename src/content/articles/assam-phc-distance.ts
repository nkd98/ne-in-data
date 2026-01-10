import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'assam-phc-distance',
  title: 'How far are rural villages from primary healthcare in Assam?',
  subtitle: 'Mapping village-to-PHC distances shows where access is close and where gaps persist.',
  authorIds: ['niruj'],
  topicIds: ['infrastructure'],
  status: 'published',
  publishedAt: '2026-01-10',
  updatedAt: '2026-01-10',
  readingTime: 3,
  compactBlocks: true,
  seo: {
    description: 'Mapping village-to-PHC distances shows where access is close and where gaps persist.',
  },
  heroImage: {
    id: 'assam-tea-landscape',
    alt: 'Aerial view of tea plantations showing both small holdings and large estates in Assam'
  },
  blocks: [
    {
      type: 'intro',
      content: 'A primary health center (PHC) in India is the first point of contact between an individual and public health care system. In rural areas, it is often the starting point for basic health care. To understand how accessible these facilities are in Assam, we mapped every village in the state to its nearest PHC.'
    },
    {
      type: 'p',
      content: 'We use two official datasets: the locations of 26,154 villages from Census 2011 (via SHRUG) and GPS coordinates of 678 PHCs from 2024 PMGSY facility list. Placing them on a map lets us see where these facilities are located and how far these are from villages.'
    },
    {
      type: 'h2',
      content: 'Where PHCs are located'
    },
    {
      type: 'p',
      content: 'The map shows where PHCs are situated across Assam. Each point marks a PHC facility from the PMGSY list. Clusters appear in the plains and more populated districts, while hill regions, char areas and some newly formed districts show sparser coverage. This provides the visual backdrop for understanding how far people live from basic healthcare.'
    },
    {
      type: 'image',
      src: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/assam_phc_locations_owid.png',
      alt: 'Map of Primary Health Centre locations across Assam',
      caption: 'Each dot is a Primary Health Centre (PHC); background map provides geographic context.'
    },
    {
      type: 'h2',
      content: 'How far villages are from a PHC'
    },
    {
      type: 'p',
      content: 'The first chart presents the distribution of village-to-PHC distances. Most villages are relatively close to a PHC. The median distance is around 5 km, and the average distance is 5.9 km. But the distribution has a long tail. About one in seven villages, 3,691 in total, lie more than 10 km away from their nearest PHC. This simple pattern shows why a single average can be misleading: the majority of villages are near a facility, but a sizable minority is not.'
    },
    {
      type: 'chart',
      visualId: 'assam-phc-distance-hist'
    },
    {
      type: 'h2',
      content: 'Gaps vary sharply by district'
    },
    {
      type: 'p',
      content: 'The district comparison highlights how access varies across Assam. Hojai has the largest share of villages more than 10 km from a PHC. In Dhemaji and Hailakandi, a sizable share of villages also falls in the 10+ km band. Districts with dispersed settlements, hilly terrain or char areas tend to show a higher proportion of villages in the longer-distance band. This chart makes these differences clear by showing the entire distance distribution within each district rather than a single summary number.'
    },
    {
      type: 'chart',
      visualId: 'assam-phc-distance-bands'
    },
    {
      type: 'p',
      content: 'Taken together, the visuals show a simple picture. Assam\'s average distance to primary healthcare is moderate, but access is uneven. The largest gaps are concentrated in specific districts and clusters, particularly where settlements are more spread out or harder to reach. Mapping these patterns helps identify where villages remain far from basic healthcare and where improvements could make the greatest difference.'
    }
  ],
  relatedArticleIds: ['north-east-road-stats', 'assam-employment-trends-2011-2024']
};

export default article;
