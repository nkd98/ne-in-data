import type { Article } from '@/lib/types';

import assamTeaCultivation from './assam-tea-cultivation-landscape';
import assamTeaExportsComposition from './assam-tea-exports-composition';
import assamEmploymentTrends from './assam-employment-trends-2011-2024';
import mizoramLiteracyPush from './mizoram-literacy-push';
import nagalandAgriculturalReforms from './nagaland-agricultural-reforms';
import northEastRoadStats from './north-east-road-stats'; 
import northEastEducationGer from './north-east-education-ger'; 



const articles: Article[] = [
  assamTeaCultivation,
  assamTeaExportsComposition,
  assamEmploymentTrends,
  mizoramLiteracyPush,
  nagalandAgriculturalReforms,
  northEastRoadStats,
  northEastEducationGer,
];

export default articles;
