/**
 * Work experience data
 * Re-exports from consolidated resume.json
 * @see https://jsonresume.org/schema/
 */

import type { ExtendedWork } from '@/types/resume-extended';

import { work as workData } from './index';

export type Position = ExtendedWork;

const work: Position[] = workData;

export default work;
