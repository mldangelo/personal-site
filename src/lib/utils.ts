/**
 * Shared utility functions and constants
 */

// Site configuration
export const SITE_URL = 'https://eliachrist.com';
export const AUTHOR_NAME = 'Eliakim Chris Omari';
/** Public contact email (shown on /contact and in schema). */
export const CONTACT_EMAIL = 'code.eliachrist@gmail.com';
/** X/Twitter handle for metadata (no @ in card text is fine; site/creator expect @handle). */
export const TWITTER_HANDLE = '@eliachrist';

// Image dimension constants
export const AVATAR_SIZE = {
  hero: 120,
  footer: 80,
  sidebar: 200,
} as const;

export const PROJECT_IMAGE = {
  width: 600,
  height: 400,
} as const;

// Skill competency
export const MAX_COMPETENCY = 5;

/**
 * Formats a date string to a human-readable format.
 * Parses as UTC to avoid timezone shifts.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  // Parse as UTC to avoid timezone shifts
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
