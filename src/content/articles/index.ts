import type { Article } from '@/lib/types';

import assamTeaCultivation from './assam-tea-cultivation-landscape';
import assamTeaExportsComposition from './assam-tea-exports-composition';
import assamTeaExportsAnalysis from './assam-tea-exports-analysis';
import assamEmploymentTrends from './assam-employment-trends-2011-2024';
import mizoramLiteracyPush from './mizoram-literacy-push';
import nagalandAgriculturalReforms from './nagaland-agricultural-reforms';

const articles: Article[] = [
  assamTeaCultivation,
  assamTeaExportsComposition,
  assamTeaExportsAnalysis,
  assamEmploymentTrends,
  mizoramLiteracyPush,
  nagalandAgriculturalReforms,
];

export default articles;
