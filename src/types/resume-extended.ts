/**
 * Extended JSON Resume Schema Types with custom underscore-prefixed fields
 * Based on https://jsonresume.org/schema (v1.0.0)
 * Custom fields use underscore prefix per JSON Resume convention
 */

export interface ExtendedLocation {
  address?: string;
  postalCode?: string;
  city: string;
  countryCode: string;
  region: string;
}

export interface ExtendedProfile {
  network: string;
  username: string;
  url: string;
  /** FontAwesome icon name for UI rendering */
  _icon: string;
}

export interface ExtendedBasics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone?: string;
  url: string;
  summary: string;
  location: ExtendedLocation;
  profiles: ExtendedProfile[];
  /** Hero tagline lines */
  _tagline: string[];
  /** Hero credential chips */
  _chips: string[];
  /** Plain text bio */
  _bio: string;
  /** HTML bio with embedded links */
  _bioHtml: string;
  /** Current company info for Hero */
  _company: {
    name: string;
    url: string;
    role: string;
  };
  /** Email domain for display purposes */
  _emailDomain: string;
}

export interface ExtendedWork {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface ExtendedEducation {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score?: string;
  courses: string[];
}

export interface ExtendedSkill {
  name: string;
  level: string;
  keywords: ExtendedSkillKeyword[];
}

export interface ExtendedSkillKeyword {
  name: string;
  /** Competency level 1-5 for UI visualization */
  _competency: number;
  /** Categories this skill belongs to */
  _categories: string[];
}

export interface ExtendedProject {
  name: string;
  description: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  roles?: string[];
  entity?: string;
  type?: string;
  /** Image path for project card */
  _image: string;
  /** Featured flag for homepage */
  _featured?: boolean;
}

export interface ExtendedDegree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

export interface ExtendedCourse {
  title: string;
  number: string;
  link: string;
  university: string;
}

export interface ExtendedMeta {
  canonical: string;
  version: string;
  lastModified: string;
}

export interface ExtendedCategory {
  name: string;
  color: string;
}

export interface ExtendedResume {
  $schema: string;
  basics: ExtendedBasics;
  work: ExtendedWork[];
  education: ExtendedEducation[];
  skills: ExtendedSkill[];
  projects: ExtendedProject[];
  /** Raw degrees for custom UI rendering */
  _degrees: ExtendedDegree[];
  /** Raw courses for custom UI rendering */
  _courses: ExtendedCourse[];
  /** Skill category colors for visualization */
  _categories: ExtendedCategory[];
  volunteer?: unknown[];
  awards?: unknown[];
  certificates?: unknown[];
  publications?: unknown[];
  languages?: unknown[];
  interests?: unknown[];
  references?: unknown[];
  meta: ExtendedMeta;
}
