import type { Article } from '@/lib/types';

import assamTeaCultivation from './assam-tea-cultivation-landscape';
import northEastRoadStats from './north-east-road-stats'; 
import northEastEducationGer from './north-east-education-ger'; 
import northEastForestCover from './ne-forest-cover';
import assamPhcDistance from './assam-phc-distance';
import northEastYouthEmployment from './north-east-youth-employment';



const articles: Article[] = [
  assamTeaCultivation,
  northEastRoadStats,
  northEastEducationGer,
  northEastForestCover,
  assamPhcDistance,
  northEastYouthEmployment,
];

export default articles;
