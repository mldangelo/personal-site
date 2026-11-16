import { beforeEach, expect, it, vi } from 'vitest';

import type { Course } from '@/data/resume/courses';
import { buildJsonResume } from '../resumeJson';

const data = vi.hoisted(() => ({ courses: [] as Course[] }));

// Two degrees from one school, the case a school-name join cannot tell apart.
vi.mock('@/data/resume/degrees', () => ({
  default: ['B.S. Physics', 'M.S. Physics'].map((degree, index) => ({
    school: 'Example University',
    degree,
    link: 'https://example.edu/',
    year: 2010 + index * 2,
  })),
}));
vi.mock('@/data/resume/courses', () => ({
  get default() {
    return data.courses;
  },
}));

const course = (number: string, degree?: string): Course => ({
  title: `Course ${number}`,
  number,
  link: 'https://example.edu/course',
  university: 'Example University',
  ...(degree ? { degree } : {}),
});

beforeEach(() => {
  data.courses = [];
});

it('files each course under the one degree it names', () => {
  data.courses = [
    course('PHYS 1', 'B.S. Physics'),
    course('PHYS 200', 'M.S. Physics'),
  ];

  expect(buildJsonResume().education.map((entry) => entry.courses)).toEqual([
    ['PHYS 1 - Course PHYS 1'],
    ['PHYS 200 - Course PHYS 200'],
  ]);
});

it('stops when a course cannot say which of the degrees it belongs to', () => {
  data.courses = [course('PHYS 1')];

  expect(() => buildJsonResume()).toThrow(/needs a "degree"/);
});
