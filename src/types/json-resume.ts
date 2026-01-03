/**
 * JSON Resume Schema Types
 * Based on https://jsonresume.org/schema (v1.0.0)
 */

export interface JsonResumeLocation {
  address?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface JsonResumeProfile {
  network: string;
  username: string;
  url: string;
}

export interface JsonResumeBasics {
  name: string;
  label: string;
  image?: string;
  email: string;
  phone?: string;
  url?: string;
  summary: string;
  location?: JsonResumeLocation;
  profiles: JsonResumeProfile[];
}

export interface JsonResumeWork {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface JsonResumeEducation {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score?: string;
  courses: string[];
}

export interface JsonResumeSkill {
  name: string;
  level: string;
  keywords: string[];
}

export interface JsonResumeProject {
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
}

export interface JsonResumeMeta {
  canonical?: string;
  version?: string;
  lastModified?: string;
}

export interface JsonResume {
  $schema?: string;
  basics: JsonResumeBasics;
  work: JsonResumeWork[];
  education: JsonResumeEducation[];
  skills: JsonResumeSkill[];
  projects: JsonResumeProject[];
  volunteer?: unknown[];
  awards?: unknown[];
  certificates?: unknown[];
  publications?: unknown[];
  languages?: unknown[];
  interests?: unknown[];
  references?: unknown[];
  meta?: JsonResumeMeta;
}
