/**
 * Skills data
 * Re-exports from consolidated resume.json
 */

import type { Category, Skill } from './index';
import { categories as categoriesData, skills as skillsData } from './index';

export type { Category, Skill };

const skills: Skill[] = skillsData;
const categories: Category[] = categoriesData;

export { categories, skills };
