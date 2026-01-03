/**
 * Projects data
 * Re-exports from consolidated resume.json
 */

import type { ExtendedResume } from '@/types/resume-extended';

import resumeData from './resume.json';

const resume = resumeData as unknown as ExtendedResume;

export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  image: string;
  date: string;
  desc: string;
  tech?: string[];
  featured?: boolean;
}

const data: Project[] = resume.projects.map((p) => ({
  title: p.name,
  subtitle: p.highlights?.[0],
  link: p.url,
  image: p._image,
  date: p.startDate || '',
  desc: p.description,
  tech: p.keywords,
  featured: p._featured,
}));

export default data;
