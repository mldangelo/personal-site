// JSON Resume Schema v1.0.0
// https://jsonresume.org/schema/

export interface JsonResume {
  $schema?: string;
  basics?: Basics;
  work?: Work[];
  volunteer?: Volunteer[];
  education?: Education[];
  awards?: Award[];
  certificates?: Certificate[];
  publications?: Publication[];
  skills?: Skill[];
  languages?: Language[];
  interests?: Interest[];
  references?: Reference[];
  projects?: Project[];
  meta?: Meta;
}

export interface Basics {
  name?: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: Location;
  profiles?: Profile[];
}

export interface Location {
  address?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface Profile {
  network?: string;
  username?: string;
  url?: string;
}

export interface Work {
  name?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface Volunteer {
  organization?: string;
  position?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface Education {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface Award {
  title?: string;
  date?: string;
  awarder?: string;
  summary?: string;
}

export interface Certificate {
  name?: string;
  date?: string;
  issuer?: string;
  url?: string;
}

export interface Publication {
  name?: string;
  publisher?: string;
  releaseDate?: string;
  url?: string;
  summary?: string;
}

export interface Skill {
  name?: string;
  level?: string;
  keywords?: string[];
}

export interface Language {
  language?: string;
  fluency?: string;
}

export interface Interest {
  name?: string;
  keywords?: string[];
}

export interface Reference {
  name?: string;
  reference?: string;
}

export interface Project {
  name?: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  roles?: string[];
  entity?: string;
  type?: string;
}

export interface Meta {
  canonical?: string;
  version?: string;
  lastModified?: string;
}

// Import the JSON resume data
import resumeData from '../resume.json';

// Type-safe access to resume data
export const jsonResume: JsonResume = resumeData;

// Utility functions to convert between formats
export function getContactInfo() {
  const { basics } = jsonResume;
  if (!basics) return [];
  
  return [
    ...(basics.email ? [{ type: 'email', value: basics.email, url: `mailto:${basics.email}` }] : []),
    ...(basics.phone ? [{ type: 'phone', value: basics.phone, url: `tel:${basics.phone}` }] : []),
    ...(basics.url ? [{ type: 'website', value: basics.url, url: basics.url }] : []),
    ...(basics.profiles || []).map(profile => ({
      type: profile.network?.toLowerCase() || 'social',
      value: profile.username || profile.url || '',
      url: profile.url || ''
    }))
  ];
}

export function getSkillsByCategory() {
  const skillCategories: Record<string, string[]> = {};
  
  (jsonResume.skills || []).forEach(skill => {
    if (skill.name && skill.keywords) {
      skillCategories[skill.name] = skill.keywords;
    }
  });
  
  return skillCategories;
}

export function getWorkExperience() {
  return (jsonResume.work || []).map(job => ({
    company: job.name || '',
    position: job.position || '',
    link: job.url || '',
    daterange: `${formatDate(job.startDate)} - ${job.endDate ? formatDate(job.endDate) : 'Present'}`,
    points: job.highlights || [],
    summary: job.summary
  }));
}

export function getEducation() {
  return (jsonResume.education || []).map(edu => ({
    school: edu.institution || '',
    degree: `${edu.studyType || ''} - ${edu.area || ''}`.trim(),
    link: edu.url || '',
    year: edu.endDate ? new Date(edu.endDate).getFullYear() : undefined,
    courses: edu.courses || []
  }));
}

function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}