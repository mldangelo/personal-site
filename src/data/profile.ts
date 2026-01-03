/**
 * Centralized profile data - single source of truth for identity information
 * Re-exports from consolidated resume.json
 * Used by Hero, Footer, SideBar, resume page, and JSON Resume export
 */

import type { ExtendedResume } from '@/types/resume-extended';

import resumeData from './resume.json';

const resume = resumeData as unknown as ExtendedResume;

export interface ProfileLocation {
  city: string;
  region: string;
  countryCode: string;
}

export interface ProfileCompany {
  name: string;
  url: string;
  role: string;
}

export interface Profile {
  name: string;
  label: string;
  email: string;
  emailDomain: string;
  url: string;
  image: string;
  summary: string;
  tagline: string[];
  chips: string[];
  bio: string;
  bioHtml: string;
  location: ProfileLocation;
  company: ProfileCompany;
}

const profile: Profile = {
  name: resume.basics.name,
  label: resume.basics.label,
  email: resume.basics.email,
  emailDomain: resume.basics._emailDomain,
  url: resume.basics.url,
  image: resume.basics.image,
  summary: resume.basics.summary,
  tagline: resume.basics._tagline,
  chips: resume.basics._chips,
  bio: resume.basics._bio,
  bioHtml: resume.basics._bioHtml,
  location: resume.basics.location,
  company: resume.basics._company,
};

export default profile;
