/**
 * Contact/social profile data
 * Re-exports from consolidated resume.json with icon mapping
 */

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import type { ExtendedResume } from '@/types/resume-extended';
import { getIcon } from '@/utils/iconMapping';

import resumeData from './resume.json';

const resume = resumeData as unknown as ExtendedResume;

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
}

const data: ContactItem[] = resume.basics.profiles.map((profile) => ({
  link: profile.url,
  label: profile.network,
  icon: getIcon(profile._icon),
}));

export default data;
