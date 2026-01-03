/**
 * JSON Resume aggregator
 * Imports consolidated resume data and exports in various formats
 * https://jsonresume.org/schema
 */

import type {
  JsonResume,
  JsonResumeEducation,
  JsonResumeProfile,
  JsonResumeProject,
  JsonResumeSkill,
} from '@/types/json-resume';
import type { ExtendedResume } from '@/types/resume-extended';

import resumeData from '../resume.json';

// Type assertion for the extended resume data
const resume = resumeData as unknown as ExtendedResume;

// Re-export work data
export const work = resume.work;
export type { ExtendedWork as Position } from '@/types/resume-extended';

// Re-export degrees from _degrees
export const degrees = resume._degrees;

// Re-export courses from _courses
export const courses = resume._courses;

// Re-export skills as flat list (matching original format)
export interface Skill {
  title: string;
  competency: number;
  category: string[];
}

export const skills: Skill[] = resume.skills.flatMap((skillGroup) =>
  skillGroup.keywords.map((keyword) => ({
    title: keyword.name,
    competency: keyword._competency,
    category: keyword._categories.sort(),
  })),
);

// Re-export categories
export interface Category {
  name: string;
  color: string;
}

export const categories: Category[] = resume._categories;

/**
 * Build profiles array for JSON Resume format (excluding email)
 */
function buildProfiles(): JsonResumeProfile[] {
  return resume.basics.profiles
    .filter((p) => !p.url.startsWith('mailto:'))
    .map((p) => ({
      network: p.network,
      username: p.username,
      url: p.url,
    }));
}

/**
 * Build education entries for JSON Resume format
 */
function buildEducation(): JsonResumeEducation[] {
  return resume.education;
}

/**
 * Build skills grouped by category for JSON Resume format
 */
function buildSkills(): JsonResumeSkill[] {
  return resume.skills.map((s) => ({
    name: s.name,
    level: s.level,
    keywords: s.keywords.map((k) => k.name),
  }));
}

/**
 * Build projects array for JSON Resume format
 */
function buildProjects(): JsonResumeProject[] {
  return resume.projects.map((p) => ({
    name: p.name,
    description: p.description,
    highlights: p.highlights,
    keywords: p.keywords,
    startDate: p.startDate,
    url: p.url,
  }));
}

/**
 * Build complete JSON Resume object (standard format without custom fields)
 */
export function buildJsonResume(): JsonResume {
  return {
    $schema:
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: resume.basics.name,
      label: resume.basics.label,
      image: resume.basics.image,
      email: resume.basics.email,
      url: resume.basics.url,
      summary: resume.basics.summary,
      location: resume.basics.location,
      profiles: buildProfiles(),
    },
    work: resume.work,
    education: buildEducation(),
    skills: buildSkills(),
    projects: buildProjects(),
    meta: {
      canonical: resume.meta.canonical,
      version: resume.meta.version,
      lastModified: new Date().toISOString().split('T')[0],
    },
  };
}

// Export pre-built resume for static generation
export const jsonResume = buildJsonResume();

// Export raw extended resume for components needing custom fields
export { resume as extendedResume };

export default jsonResume;
