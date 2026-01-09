

export type ArticleStatus = 'draft' | 'review' | 'published';

export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  role?: string;
}

export interface Topic {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageId: string;
  color?: string;
}

export type Block = 
  | { type: 'intro'; content: string }
  | { type: 'h2'; content: string }
  | { type: 'h3'; content: string }
  | { type: 'p'; content: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'chart'; visualId: string }
  | { type: 'table'; visualId: string }
  | { type: 'callout'; content: string }
  | { type: 'methods'; content: string }
  | { type: 'sources'; content: string };

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  authorIds: string[];
  topicIds: string[];
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  seo: {
    description: string;
    canonical?: string;
  };
  heroImage: {
    id: string;
    alt: string;
  };
  blocks: Block[];
  relatedArticleIds: string[];
  compactBlocks?: boolean;
  metric?: {
    value: string;
    label: string;
    change: 'increase' | 'decrease';
  };
  playgroundContent?: TeaPlaygroundContent;
}

export type VisualType = 'bar' | 'line' | 'table' | 'scatter';

export interface Visual {
  id: string;
  title: string;
  type: VisualType;
  spec: any; // Simplified for now, can be a vega-lite spec
  caption: string;
  units: string;
  coverage: string;
  source: {
    name: string;
    url: string;
  };
  lastUpdated: string;
  tags: string[]; // e.g., ['employment', 'assam', '2024']
}

export interface SiteConfig {
    brandName: string;
    tagline: string;
    supportUrl: string;
    contactEmail: string;
    newsletterProvider?: string;
    social?: {
        twitter?: string;
        github?: string;
    };
}

export type TeaPlaygroundSection =
  | {
      type: 'prose';
      paragraphs: string[];
    }
  | {
      type: 'figure';
      kicker: string;
      title: string;
      description: string;
      chart: {
        csvUrl: string;
        height?: number;
        indexScale?: any;
      };
      source: {
        label: string;
        url: string;
      };
    };

export interface TeaPlaygroundContent {
  hero: {
    kicker: string;
    deck: string;
    organization: string;
  };
  sections: TeaPlaygroundSection[];
}
