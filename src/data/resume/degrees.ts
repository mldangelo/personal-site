/**
 * Education degrees data
 * Re-exports from consolidated resume.json
 */

import type { ExtendedDegree } from '@/types/resume-extended';

import { degrees as degreesData } from './index';

export type Degree = ExtendedDegree;

const degrees: Degree[] = degreesData;

export default degrees;
