import type { Article, Author, Topic, Visual } from './types';
import articles from '@/content/articles';

const authors: Author[] = [
  { id: 'jane-doe', name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=jane', role: 'Lead Researcher' },
  { id: 'john-smith', name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=john', role: 'Data Scientist' },
];

const topics: Topic[] = [
  { id: 'employment', slug: 'employment', name: 'Employment', description: 'Trends and analysis of employment data across the North-Eastern states.', imageId: 'topic-employment', color: 'topic-teal' },
  { id: 'agriculture', slug: 'agriculture', name: 'Agriculture', description: 'Tea, farming systems, and rural livelihoods across the North-East.', imageId: 'topic-agriculture', color: 'topic-teal' },
  { id: 'education', slug: 'education', name: 'Education', description: 'Insights into literacy rates, schooling, and educational infrastructure.', imageId: 'topic-education', color: 'topic-orange' },
  { id: 'environment', slug: 'environment', name: 'Environment', description: 'Forest cover, climate, and ecological change across the North-East.', imageId: 'topic-environment', color: 'topic-green' },
  { id: 'infrastructure', slug: 'infrastructure', name: 'Infrastructure', description: 'Development of infrastructure like roads, bridges, and power.', imageId: 'topic-infrastructure', color: 'topic-indigo' },
];


const visuals: Visual[] = [
    {
      id: 'ne-ger-states',
      title: 'Gross Enrolment Ratio by Stage and State (North-East)',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_ger_states.csv',
        x: 'states',
        y: 'ger',
        facetField: 'stage',
        facetOrder: [
          'pre_primary_class2_t',
          'class3_class5_t',
          'class5_class8_t',
          'class9_class12_t',
          'high_education_t'
        ],
        highlightCategories: ['All India'],
        colors: {
          default: '#111111',
          highlight: '#D32F2F'
        },
        categoryLabels: {
          'Arunachal Pradesh': 'Arunachal P.'
        },
        facetHeight: 130,
        facetGap: 28,
        yLabel: 'Gross Enrolment Ratio (GER)',
        height: 720
      },
      caption: 'North-East states lead early-grade enrolment, but by higher education GER levels drop across the region.',
      units: 'Gross Enrolment Ratio',
      coverage: 'North-East India vs All India',
      source: { 
        name: 'UDISE+ 2023-24 and AISHE 2021-22', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_ger_states.csv' 
      },
      lastUpdated: '2025-11-01',
      tags: ['education', 'ger', 'north-east', 'states']
    },
    {
      id: 'ne-ger-stage',
      title: 'Gross Enrolment Ratio by Stage (North-East vs India)',
      type: 'line',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_ger_comp_ind_vs_ne.csv',
        x: 'stage',
        y: 'ger',
        seriesField: 'region',
        seriesValueFields: {
          'All India': 'All India',
          'Northeast': 'ger',
        },
        seriesLabels: {
          'All India': 'All India',
          'Northeast': 'North-East',
        },
        categoryOrder: [
          'pre_primary_class2_t',
          'class3_class5_t',
          'class5_class8_t',
          'class9_class12_t',
          'high_education_t',
        ],
        categoryLabels: {
          pre_primary_class2_t: 'Foundational',
          class3_class5_t: 'Preparatory',
          class5_class8_t: 'Middle',
          class9_class12_t: 'Secondary',
          high_education_t: 'Higher education',
        },
        xLabelRotate: 60,
        colors: {
          'All India': '#111111',
          'Northeast': '#D32F2F',
        },
        xLabel: 'Education stage',
        yLabel: 'Gross Enrolment Ratio',
      },
      caption: 'North-East India outperforms the all-India average in early grades but falls behind by higher education.',
      units: '%',
      coverage: 'North-East vs All India',
      source: { 
        name: 'UDISE+ 2023-24 and AISHE 2021-22', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_ger_comp_ind_vs_ne.csv' 
      },
      lastUpdated: '2025-11-01',
      tags: ['education', 'ger', 'north-east', 'india']
    },
    {
      id: 'ne-forest-loss-area',
      title: 'Annual tree cover loss, North-East India',
      type: 'line',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_forest_loss_annual_total.csv',
        x: 'year',
        y: 'loss_ha',
        xLabel: 'Year',
        yLabel: 'Tree cover loss (hectares)',
        area: true,
        colors: {
          default: '#111111'
        },
        gridLeft: 66,
        xLabelInterval: 1
      },
      caption: 'Annual tree cover loss across North-Eastern states shows recurrent spikes over the last two decades.',
      units: 'Hectares',
      coverage: 'North-East India',
      source: { 
        name: 'Satellite-derived tree cover loss (via World Resources Institute)', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_forest_loss_annual_total.csv' 
      },
      lastUpdated: '2025-11-01',
      tags: ['forest', 'environment', 'north-east']
    },
    {
      id: 'ne-forest-loss-state-lines',
      title: 'Tree cover loss by state',
      type: 'line',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_forest_loss_by_state_smoothed_7yr.csv',
        x: 'year',
        y: 'loss_ha_smoothed',
        seriesField: 'state',
        colorMode: 'multi',
        xLabel: 'Year',
        yLabel: 'Tree cover loss (hectares)',
        colors: {
          Arunachal: '#E41A1C',
          'Arunachal Pradesh': '#E41A1C',
          Assam: '#377EB8',
          Manipur: '#4DAF4A',
          Meghalaya: '#984EA3',
          Mizoram: '#FF7F00',
          Nagaland: '#FFFF33',
          Sikkim: '#A65628',
          Tripura: '#F781BF'
        },
        gridTop: 84,
        gridLeft: 70,
        yAxisNameGap: 58,
        highlightSymbolSize: 3,
        mutedSymbolSize: 2
      },
      caption: 'Smoothed annual tree cover loss by North-Eastern state highlights Assam and Nagaland as consistent hotspots.',
      units: 'Hectares',
      coverage: 'North-East India by state',
      source: { 
        name: 'Satellite-derived tree cover loss (via World Resources Institute)', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_forest_loss_by_state_smoothed_7yr.csv' 
      },
      lastUpdated: '2025-11-01',
      tags: ['forest', 'environment', 'north-east', 'states']
    },
    {
      id: 'ne-forest-loss-vs-gain',
      title: 'Forest loss vs gain by state',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_forest_loss_vs_gain_by_state.csv',
        x: 'state',
        stacks: ['Gain (2000–2020)', 'Loss (2001–2023)'],
        stackField: 'metric',
        valueField: 'hectares',
        stacked: false,
        stackLabels: {
          'Gain (2000–2020)': 'Gain (2000–2020)',
          'Loss (2001–2023)': 'Loss (2001–2023)'
        },
        colors: {
          'Gain (2000–2020)': '#111111',
          'Loss (2001–2023)': '#D32F2F'
        },
        xLabel: 'State',
        yLabel: 'Hectares',
        categoryOrder: [
          'Arunachal Pradesh',
          'Assam',
          'Manipur',
          'Meghalaya',
          'Mizoram',
          'Nagaland',
          'Sikkim',
          'Tripura'
        ],
        height: 480
      },
      caption: 'Loss outweighs gain across most North-Eastern states; Assam and Nagaland show the largest net loss.',
      units: 'Hectares',
      coverage: 'North-East India by state',
      source: { 
        name: 'Satellite-derived tree cover loss (via World Resources Institute)', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_forest_loss_vs_gain_by_state.csv' 
      },
      lastUpdated: '2025-11-01',
      tags: ['forest', 'environment', 'north-east', 'states']
    },
    {
      id: 'assam-phc-distance-hist',
      title: 'How far are villages from the nearest PHC?',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/assam_phc_distance_histogram.csv',
        x: 'bin_label',
        y: 'village_count',
        xLabel: 'Distance to nearest PHC (km)',
        yLabel: 'Number of villages',
        meanField: 'mean_distance_km',
        binStartField: 'bin_start_km',
        binEndField: 'bin_end_km',
        colors: { default: '#111111' },
        barGap: '0%',
        barCategoryGap: '0%',
        barBorder: { color: '#111', width: 0.4 },
        height: 420
      },
      caption: 'Most villages are within 6 km of a PHC; the mean distance sits inside the 4–6 km bin.',
      units: 'Villages',
      coverage: 'Assam',
      source: { 
        name: 'Census 2011 village locations (via SHRUG); PMGSY facility list 2024', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/assam_phc_distance_histogram.csv' 
      },
      lastUpdated: '2025-11-01',
      tags: ['health', 'assam', 'phc']
    },
    {
      id: 'assam-phc-distance-bands',
      title: 'Distance to nearest PHC by district (share of villages)',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/assam_district_phc_distance_bands_tidy.csv',
        x: 'district',
        stacks: ['0–3 km', '3–5 km', '5–7 km', '7–10 km', '10+ km'],
        stackField: 'band',
        valueField: 'share',
        stacked: true,
        stackLabels: {
          '0–3 km': '0–3 km',
          '3–5 km': '3–5 km',
          '5–7 km': '5–7 km',
          '7–10 km': '7–10 km',
          '10+ km': '10+ km'
        },
        colors: {
          '0–3 km': '#67000D',
          '3–5 km': '#A50F15',
          '5–7 km': '#CB181D',
          '7–10 km': '#EF3B2C',
          '10+ km': '#FB6A4A'
        },
        yLabel: 'Share of villages (%)',
        categoryOrder: [],
        height: 720,
        horizontal: true
      },
      caption: 'District-wise split of how far villages are from their nearest PHC; bars are proportional (0–100%).',
      units: '% of villages',
      coverage: 'Districts of Assam',
      source: { 
        name: 'Census 2011 village locations (via SHRUG); PMGSY facility list 2024', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/assam_district_phc_distance_bands_tidy.csv' 
      },
      lastUpdated: '2025-11-01',
      tags: ['health', 'assam', 'phc', 'districts']
    },
    {
      id: 'ne-ger-distribution',
      title: 'GER distribution across states by education stage',
      type: 'line',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_ger_dist_states.csv',
        x: 'stage_key',
        y: 'ger',
        seriesField: 'states',
        colorMode: 'multi',
        categoryOrder: [
          'pre_primary_class2_t',
          'class3_class5_t',
          'class5_class8_t',
          'class9_class12_t',
          'high_education_t'
        ],
        categoryLabels: {
          high_education_t: 'Higher education',
          class9_class12_t: 'Secondary',
          class5_class8_t: 'Middle',
          class3_class5_t: 'Preparatory',
          pre_primary_class2_t: 'Foundational'
        },
        highlightSeries: ['All India', 'Meghalaya', 'Assam'],
        highlightSeriesColors: {
          'All India': '#111111',
          Meghalaya: '#984EA3',
          Assam: '#E41A1C'
        },
        colors: {
          'All India': '#111111',
          'Arunachal Pradesh': '#377EB8',
          Arunachal: '#377EB8',
          Assam: '#E41A1C',
          Manipur: '#4DAF4A',
          Meghalaya: '#984EA3',
          Mizoram: '#FF7F00',
          Nagaland: '#FFFF33',
          Sikkim: '#A65628',
          Tripura: '#F781BF'
        },
        muteNonHighlighted: false,
        mutedSeriesColor: '#CFCFCF',
        mutedSeriesOpacity: 0.18,
        mutedSeriesWidth: 1.2,
        highlightSeriesWidth: 3.2,
        mutedSymbolSize: 2,
        highlightSymbolSize: 5,
        legendOnlyHighlighted: true,
        legendLeft: 'center',
        legendTop: 8,
        gridTop: 110,
        gridLeft: 60,
        watermarkTop: 72,
        xLabel: 'Education stage',
        yLabel: 'Gross Enrolment Ratio (GER)',
        height: 560
      },
      caption: 'Each line is a state; the All-India series is included for comparison.',
      units: 'Gross Enrolment Ratio',
      coverage: 'North-East states vs All India',
      source: { 
        name: 'UDISE+ 2023-24 and AISHE 2021-22', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_ger_dist_states.csv' 
      },
      lastUpdated: '2025-11-01',
      tags: ['education', 'ger', 'north-east', 'states']
    },
    {
      // Tea Growers Visuals
      id: 'tea-growers-summary',
      title: 'Statewide Comparison of Small vs Big Tea Growers',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/tea_dist.csv',
        x: 'Metric',
        stacks: ['Big Growers', 'Small Growers'],
        horizontal: true,
        showValueLabels: true,
        valueLabelMin: 8,
        valueLabelPosition: 'inside',
        valueLabelColor: '#FFFFFF',
        stackLabels: {
          'Big Growers': 'Large Tea Estates',
          'Small Growers': 'Small Tea Growers'
        },
        colors: {
          'Big Growers': '#111111',
          'Small Growers': '#D32F2F'
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
        horizontal: true,
        showValueLabels: true,
        valueLabelMin: 8,
        valueLabelPosition: 'inside',
        valueLabelColor: '#FFFFFF',
        gridLeft: 88,
        stackLabels: {
          'Small Growers': 'Small Tea Growers',
          'Big Growers': 'Large Tea Estates'
        },
        colors: {
          'Small Growers': '#D32F2F',
          'Big Growers': '#111111'
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
          orthodox: '#111111',
          ctc: '#D32F2F',
          green: '#B71C1C',
          others: '#6B6B6B'
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
      // Road Stats Visuals
      id: 'road-density-ne',
      title: 'Road Density in North-East India',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_road_density_clean.csv',
        x: 'state',
        stacks: ['Urban', 'Rural'],
        stackField: 'area',
        valueField: 'road_density',
        stacked: false,
        categoryOrder: [
          'Arunachal Pradesh',
          'Assam',
          'Manipur',
          'Meghalaya',
          'Mizoram',
          'Nagaland',
          'Sikkim',
          'Tripura',
          'INDIA'
        ],
        stackLabels: {
          'Urban': 'Urban Roads',
          'Rural': 'Rural Roads'
        },
        colors: {
          'Urban': '#111111',
          'Rural': '#D32F2F'
        },
        yLabel: 'Road density (km per 1000 sq km)'
      },
      caption: 'Side-by-side comparison of urban and rural road density across North-East states.',
      units: 'km per 1000 sq km',
      coverage: 'North-East India',
      source: { 
        name: 'Basic Road Statistics of India, 2019-20', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_road_density_clean.csv' 
      },
      lastUpdated: '2024-04-01',
      tags: ['infrastructure', 'roads', 'ne', 'summary']
    },
    {// Road Stats Visuals
      id: 'road-len-ne',
      title: 'Road Length per 1,000 People',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_road_length_per_1000pop_clean.csv',
        x: 'state',
        stacks: ['Urban', 'Rural'],
        stackField: 'area',
        valueField: 'road_length_per_1000_pop',
        stacked: false,
        categoryOrder: [
          'Arunachal Pradesh',
          'Assam',
          'Manipur',
          'Meghalaya',
          'Mizoram',
          'Nagaland',
          'Sikkim',
          'Tripura',
          'INDIA'
        ],
        stackLabels: {
          'Urban': 'Urban Roads',
          'Rural': 'Rural Roads'
        },
        colors: {
          'Urban': '#111111',
          'Rural': '#D32F2F'
        },
        yLabel: 'Road length (km per 1,000 people)'
      },
      caption: 'Side-by-side comparison of urban and rural road length per 1,000 people across North-East states.',
      units: 'km per 1,000 people',
      coverage: 'North-East India',
      source: { 
        name: 'Basic Road Statistics of India, 2019-20', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_road_length_per_1000pop_clean.csv' 
      },
      lastUpdated: '2024-04-01',
      tags: ['infrastructure', 'roads', 'ne', 'summary']
    },
    {// Road Stats Visuals
      id: 'road-surfaced-len-ne',
      title: 'Surfaced vs Total Road Length',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_total_vs_surfaced_road_length_clean.csv',
        x: 'state',
        stacks: ['Total', 'Surfaced'],
        stackField: 'road_type',
        valueField: 'road_length_km',
        stacked: false,
        categoryOrder: [
          'Arunachal Pradesh',
          'Assam',
          'Manipur',
          'Meghalaya',
          'Mizoram',
          'Nagaland',
          'Sikkim',
          'Tripura',
          'INDIA'
        ],
        stackLabels: {
          'Total': 'Total',
          'Surfaced': 'Surfaced'
        },
        colors: {
          'Total': '#111111',
          'Surfaced': '#D32F2F'
        },
        yLabel: 'Road length (km)'
      },
      caption: 'Side-by-side comparison of total vs surfaced road length across North-East states.',
      units: 'km',
      coverage: 'North-East India',
      source: { 
        name: 'Basic Road Statistics of India, 2019-20', 
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_total_vs_surfaced_road_length_clean.csv' 
      },
      lastUpdated: '2024-04-01',
      tags: ['infrastructure', 'roads', 'ne', 'summary']
    },

    {
      // Youth Employment Visuals
      id: 'ne-youth-lfpr',
      title: 'Youth Labour Force Participation Rate (LFPR), Ages 15-29',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/lfpr_15_29_ne.csv',
        x: 'state',
        y: 'person_total',
        categoryOrder: [
          'Arunachal Pradesh',
          'Assam',
          'Manipur',
          'Meghalaya',
          'Mizoram',
          'Nagaland',
          'Sikkim',
          'Tripura'
        ],
        colors: {
          default: '#111111'
        },
        barCategoryGap: '35%',
        barGap: '10%',
        yLabel: 'LFPR (%)'
      },
      caption: 'Youth labour force participation (ages 15–29) varies widely across North-Eastern states.',
      units: '%',
      coverage: 'North-East India (ages 15–29)',
      source: {
        name: 'Periodic Labour Force Survey (PLFS) 2023-24',
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/lfpr_15_29_ne.csv'
      },
      lastUpdated: '2026-01-27',
      tags: ['employment', 'youth', 'lfpr', 'north-east']
    },
    {
      id: 'ne-youth-unemployment',
      title: 'Youth Unemployment Rate, Ages 15-29',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/unemployed_15_29_ne.csv',
        x: 'state',
        y: 'person_total',
        categoryOrder: [
          'Arunachal Pradesh',
          'Assam',
          'Manipur',
          'Meghalaya',
          'Mizoram',
          'Nagaland',
          'Sikkim',
          'Tripura',
          'all India'
        ],
        colors: {
          default: '#111111'
        },
        barCategoryGap: '35%',
        barGap: '10%',
        yLabel: 'Unemployment rate (%)'
      },
      caption: 'Youth unemployment (ages 15–29) differs sharply across North-Eastern states.',
      units: '%',
      coverage: 'North-East India (ages 15–29)',
      source: {
        name: 'Periodic Labour Force Survey (PLFS) 2023-24',
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/unemployed_15_29_ne.csv'
      },
      lastUpdated: '2026-01-27',
      tags: ['employment', 'youth', 'unemployment', 'north-east']
    },
    {
      id: 'ne-youth-job-types',
      title: 'Job Types Among Employed Youth, Ages 15-29',
      type: 'bar',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/jobs_15_29_ne.csv',
        x: 'state',
        stacks: ['se_employed', 'salaried', 'casual'],
        stacked: true,
        categoryOrder: [
          'Arunachal Pradesh',
          'Assam',
          'Manipur',
          'Meghalaya',
          'Mizoram',
          'Nagaland',
          'Sikkim',
          'Tripura',
          'all India'
        ],
        stackLabels: {
          se_employed: 'Self-employed',
          salaried: 'Regular wage',
          casual: 'Casual labour'
        },
        colors: {
          se_employed: '#111111',
          salaried: '#D32F2F',
          casual: '#F57C00'
        },
        yLabel: 'Share of employed youth (%)'
      },
      caption: 'The mix of self-employment, regular wage work, and casual labour differs sharply across North-Eastern states.',
      units: '%',
      coverage: 'North-East India vs India',
      source: {
        name: 'Periodic Labour Force Survey (PLFS) 2023-24',
        url: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/jobs_15_29_ne.csv'
      },
      lastUpdated: '2026-01-27',
      tags: ['employment', 'youth', 'job-types', 'north-east']
    },

    {
      id: 'education-ger-trend',
      title: 'Gross Enrolment Ratio, North-East (Year range)',
      type: 'line',
      spec: {
        dataUrl: 'https://tngxrcncslblrarjqtwn.supabase.co/storage/v1/object/public/datasets/ne_ger_comp_ind_vs_ne.csv', // or inline data array
        x: 'year',
        y: 'ger',
        yLabel: 'GER (%)'
      },
      caption: 'GER over time in the North-East.',
      units: '%',
      coverage: 'North-East India',
      source: { name: 'Source name', url: 'https://…/your.csv' },
      lastUpdated: '2024-12-01',
      tags: ['education', 'ger', 'ne']
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
