# **App Name**: NorthEast in Data

## Core Features:

- Article Storage: Store narrative and visualization metadata in Firestore, including slug, title, subtitle, authorIds[], topicIds[], status (draft|review|published), publishedAt, updatedAt, readingTime, seo{description,canonical}, heroImage{url,alt}, blocks[], relatedArticleIds[].
- Dynamic Routing: Enable dynamic routing for articles based on their slugs (e.g., /articles/assam-employment-trends-2011-2024) and topics (e.g., /topics/employment).
- Structured Content Blocks: Render blocks[] in order, supporting types: intro | h2 | h3 | chart | table | callout | methods | sources. Chart/table blocks reference a visualId.
- Data Explorer: Provide a page with filters (Topic, State/District, Year range, Measure) that loads visuals by tags and updates chart specs dynamically. Includes buttons for Download data (CSV/Parquet), Copy spec (JSON), and Share link.
- Topic Exploration: Create topic hubs with intro, featured articles, and related visuals.
- Article Recommendations: Provide content-based article recommendations using cosine similarity on title + topicIds + tags + seo.description. Store relatedArticleIds[] on write. Cold start = latest 5 in same topic.
- Provenance & Methods: Ensure every figure has caption, units, coverage, source link, last-updated. Every article has Data Sources and Methods sections.

## Style Guidelines:

- Primary color: Muted blue #6495ED (brand).
- Accent color: Soft green #90EE90.
- Background color: White #FFFFFF.
- Text color: Near-black #0E1111; Muted surfaces #F6F8FA.
- Headline font: 'Playfair' serif for titles.
- Body font: 'Inter' sans-serif for body.
- Implement a responsive grid layout with 2–3 columns for desktop and a single column for mobile; max article width 760–820px.
- Use simple line icons for topics and navigation.
- Use smooth scroll animations and light transitions; respect “reduced motion”.