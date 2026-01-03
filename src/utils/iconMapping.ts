/**
 * Maps icon name strings from resume.json to FontAwesome icon definitions
 * Allows icons to be referenced by name in JSON while using actual icons at runtime
 */

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAngellist } from '@fortawesome/free-brands-svg-icons/faAngellist';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

const iconMap: Record<string, IconDefinition> = {
  faLinkedinIn,
  faGithub,
  faTwitter,
  faAngellist,
  faInstagram,
  faFacebookF,
  faEnvelope,
};

/**
 * Get an icon definition from its string name
 */
export function getIcon(name: string): IconDefinition {
  const icon = iconMap[name];
  if (!icon) {
    throw new Error(`Unknown icon: ${name}`);
  }
  return icon;
}

/**
 * Check if an icon exists by name
 */
export function hasIcon(name: string): boolean {
  return name in iconMap;
}

export default iconMap;
