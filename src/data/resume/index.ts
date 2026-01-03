/**
 * JSON Resume aggregator
 * Combines all resume data into JSON Resume schema format
 * https://jsonresume.org/schema
 */

import type {
  JsonResume,
  JsonResumeEducation,
  JsonResumeProfile,
  JsonResumeProject,
  JsonResumeSkill,
} from '@/types/json-resume';

import contact from '../contact';
import profile from '../profile';
import projects from '../projects';
import courses from './courses';
import degrees from './degrees';
import { skills } from './skills';
import work from './work';

/**
 * Map competency score (1-5) to JSON Resume level string
 */
function competencyToLevel(competency: number): string {
  switch (competency) {
    case 5:
      return 'Master';
    case 4:
      return 'Advanced';
    case 3:
      return 'Intermediate';
    case 2:
      return 'Beginner';
    default:
      return 'Beginner';
  }
}

/**
 * Extract username from profile URL
 */
function extractUsername(url: string, network: string): string {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    return pathParts[pathParts.length - 1] || network.toLowerCase();
  } catch {
    return network.toLowerCase();
  }
}

/**
 * Normalize network names to standard formats
 */
function normalizeNetwork(label: string): string {
  const networkMap: Record<string, string> = {
    Github: 'GitHub',
    X: 'Twitter',
    'Angel List': 'AngelList',
  };
  return networkMap[label] || label;
}

/**
 * Build profiles array from contact data (excluding email)
 */
function buildProfiles(): JsonResumeProfile[] {
  return contact
    .filter((c) => !c.link.startsWith('mailto:'))
    .map((c) => ({
      network: normalizeNetwork(c.label),
      username: extractUsername(c.link, c.label),
      url: c.link,
    }));
}

/**
 * Build education entries with embedded courses
 */
function buildEducation(): JsonResumeEducation[] {
  return degrees.map((deg) => {
    // Parse degree string: "M.S. Computational and Mathematical Engineering (ICME)"
    // or "B.S. Electrical Engineering, Computer Engineering"
    const degreeMatch = deg.degree.match(
      /^(M\.S\.|B\.S\.|Ph\.D\.|M\.A\.|B\.A\.)\s+(.+)$/,
    );
    const studyType = degreeMatch
      ? degreeMatch[1].replace(/\./g, '')
      : 'Degree';
    const area = degreeMatch ? degreeMatch[2] : deg.degree;

    // Get courses for this school (match first word of school name)
    const schoolPrefix = deg.school.split(' ')[0];
    const schoolCourses = courses
      .filter((c) => c.university === schoolPrefix)
      .map((c) => `${c.number}: ${c.title}`);

    // Estimate start date (4 years before for BS, 2 for MS)
    const yearsToComplete = studyType === 'BS' ? 4 : 2;

    return {
      institution: deg.school,
      url: deg.link,
      area,
      studyType,
      startDate: `${deg.year - yearsToComplete}-09-01`,
      endDate: `${deg.year}-06-01`,
      courses: schoolCourses,
    };
  });
}

/**
 * Build skills grouped by category
 * Each category becomes a skill entry with keywords
 */
function buildSkills(): JsonResumeSkill[] {
  const categoryMap = new Map<
    string,
    { keywords: string[]; maxLevel: number }
  >();

  for (const skill of skills) {
    for (const cat of skill.category) {
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, { keywords: [], maxLevel: 0 });
      }
      const entry = categoryMap.get(cat)!;
      entry.keywords.push(skill.title);
      entry.maxLevel = Math.max(entry.maxLevel, skill.competency);
    }
  }

  return Array.from(categoryMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, { keywords, maxLevel }]) => ({
      name,
      level: competencyToLevel(maxLevel),
      keywords: keywords.sort(),
    }));
}

/**
 * Build projects array
 */
function buildProjects(): JsonResumeProject[] {
  return projects.map((p) => ({
    name: p.title,
    description: p.desc,
    highlights: p.subtitle ? [p.subtitle] : undefined,
    keywords: p.tech,
    startDate: p.date,
    url: p.link,
  }));
}

/**
 * Build complete JSON Resume object
 */
export function buildJsonResume(): JsonResume {
  return {
    $schema:
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: profile.name,
      label: profile.label,
      image: profile.image,
      email: profile.email,
      url: profile.url,
      summary: profile.summary,
      location: profile.location,
      profiles: buildProfiles(),
    },
    work,
    education: buildEducation(),
    skills: buildSkills(),
    projects: buildProjects(),
    meta: {
      canonical: 'https://mldangelo.com/resume.json',
      version: 'v1.0.0',
      lastModified: new Date().toISOString().split('T')[0],
    },
  };
}

// Export pre-built resume for static generation
export const jsonResume = buildJsonResume();

export default jsonResume;
