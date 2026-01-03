/**
 * Courses data
 * Re-exports from consolidated resume.json
 */

import type { ExtendedCourse } from '@/types/resume-extended';

import { courses as coursesData } from './index';

export type Course = ExtendedCourse;

const courses: Course[] = coursesData;

export default courses;
