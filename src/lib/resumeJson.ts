/**
 * The machine-readable résumé served at `/resume.json`.
 *
 * `src/data/resume/work.ts` has opened with `Conforms to
 * https://jsonresume.org/schema/` since it was written, and nothing emitted or
 * validated that. This module is what makes the claim true. Every value is
 * assembled from the same data files the rendered `/resume` page reads, so the
 * document and the page cannot drift.
 *
 * Deliberately a subset of the schema: sections this résumé has no data for
 * (`volunteer`, `awards`, `certificates`, `publications`, `languages`,
 * `interests`, `projects`, `references`) are omitted rather than stubbed. The
 * printed page says references are available on request, which is not a
 * `references` entry — the schema wants a name and a quote.
 */

import contact from '@/data/contact';
import profile from '@/data/profile.json';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { sortPositions } from '@/lib/career';
import {
  AUTHOR_NAME,
  SITE_DESCRIPTION,
  SITE_IMAGE_PATH,
  SITE_URL,
} from '@/lib/utils';

/**
 * File-like, so it keeps no trailing slash under `trailingSlash: true` — the
 * same treatment as `/feed.xml` and `/sitemap.xml`.
 */
export const RESUME_JSON_PATH = '/resume.json';

export const RESUME_JSON_URL = `${SITE_URL}${RESUME_JSON_PATH}`;

/**
 * The published schema this document declares itself against. `$schema` is a
 * root property of JSON Resume v1.0.0, not an extension to it.
 */
export const RESUME_SCHEMA_URL =
  'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json';

interface ResumeProfile {
  network: string;
  username: string;
  url: string;
}

interface ResumeLocation {
  city: string;
  region?: string;
}

interface ResumeBasics {
  name: string;
  label: string;
  image: string;
  email: string;
  url: string;
  summary: string;
  location: ResumeLocation;
  profiles: ResumeProfile[];
}

interface ResumeWork {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

interface ResumeEducation {
  institution: string;
  url: string;
  studyType?: string;
  area?: string;
  endDate: string;
  courses?: string[];
}

interface ResumeSkill {
  name: string;
  keywords: string[];
}

export interface JsonResume {
  $schema: string;
  basics: ResumeBasics;
  work: ResumeWork[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  meta: {
    canonical: string;
  };
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

/** The largest code point Unicode defines. */
const MAX_CODE_POINT = 0x10ffff;

/** The UTF-16 surrogate block — code points, but not characters. */
const FIRST_SURROGATE = 0xd800;
const LAST_SURROGATE = 0xdfff;

/**
 * Whether `String.fromCodePoint` can be handed this and produce a character.
 *
 * Two ways a numeric entity fails to name one, and they fail differently.
 * Above `MAX_CODE_POINT`, `String.fromCodePoint` throws a `RangeError` — a
 * single mistyped `&#99999999;` in a `src/data/resume/work.ts` summary would
 * take down `npm run build` rather than degrade, because nothing between here
 * and the `/resume.json` route handler catches it. Inside the surrogate block
 * it throws nothing and returns an unpaired code unit instead, which travels
 * into the artifact as a `\ud800` escape and leaves the published document
 * holding a string no consumer can decode to text.
 *
 * Both are refused by leaving the source text exactly where it is, which is
 * already what this function does for an unknown named entity: a visible
 * `&#99999999;` in the published résumé is a bug someone can read, where a
 * failed build is a bug nobody can publish around and a lone surrogate is a bug
 * nobody can see.
 *
 * The `NaN` a non-numeric run like `&#abc;` parses to needs no clause of its
 * own: every comparison against `NaN` is false, so it fails both of these the
 * way it failed the `Number.isNaN` check this replaced. That check was dead
 * code — deleting it left the suite green, which is how it was found.
 */
function isDecodableCodePoint(codePoint: number): boolean {
  return (
    codePoint <= MAX_CODE_POINT &&
    (codePoint < FIRST_SURROGATE || codePoint > LAST_SURROGATE)
  );
}

function decodeEntity(entity: string): string {
  const literal = `&${entity};`;
  const numeric = entity.match(/^#(x)?([0-9a-f]+)$/i);
  if (numeric) {
    const codePoint = Number.parseInt(numeric[2], numeric[1] ? 16 : 10);
    return isDecodableCodePoint(codePoint)
      ? String.fromCodePoint(codePoint)
      : literal;
  }
  return NAMED_ENTITIES[entity.toLowerCase()] ?? literal;
}

/**
 * Reduces résumé prose to the plain text JSON Resume expects.
 *
 * The `summary` strings in `src/data/resume/work.ts` are Markdown with inline
 * HTML — `JobSummary` renders them through `markdown-to-jsx`, and three of them
 * carry real `<a href>` anchors. The rendered page depends on that markup, so
 * this strips it for the artifact rather than flattening the source data and
 * costing the page its links.
 *
 * The anchor text survives and the href does not, and nothing else in the
 * document recovers it. All six are third-party links — the Codex Security
 * announcement, Anthemis, Foundation Capital, Y Combinator, NEA, Accel — not
 * the employer's own `url`, which is a separate field on the work entry and
 * points somewhere else. That is the accepted cost: JSON Resume prose is plain
 * text, and the schema has nowhere to hang a link inside a summary. The test
 * file pins both halves, so this paragraph fails rather than rots when a
 * summary changes.
 *
 * Underscore emphasis is intentionally left alone: `_x_` would eat the
 * underscores out of an identifier like `snake_case_name`.
 */
export function toPlainText(value: string): string {
  return (
    value
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [text](url)
      .replace(/<[^>]*>/g, '') // inline HTML
      .replace(/\*\*([^*]+)\*\*/g, '$1') // **strong**
      .replace(/\*([^*]+)\*/g, '$1') // *emphasis*
      .replace(/`([^`]+)`/g, '$1') // `code`
      .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_match, entity: string) =>
        decodeEntity(entity),
      )
      // Template literals in the data files wrap across lines and indent.
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * `profile.currentCity` is a single display string ("New York, NY"). It is
 * split rather than duplicated, and `countryCode` is left off because the data
 * does not state a country — a hardcoded `US` here would silently outlive a
 * move abroad.
 */
function buildLocation(): ResumeLocation {
  const [city, region] = profile.currentCity
    .split(',')
    .map((part) => part.trim());
  return { city, ...(region ? { region } : {}) };
}

/** The trailing path segment of a profile URL is the handle on every network here. */
function usernameFrom(link: string): string {
  const { pathname } = new URL(link);
  return pathname.split('/').filter(Boolean).pop() ?? '';
}

function buildBasics(): ResumeBasics {
  return {
    name: AUTHOR_NAME,
    label: profile.role,
    // The portrait, not the share card: JSON Resume renderers show this as a
    // photograph of the person.
    image: `${SITE_URL}${SITE_IMAGE_PATH}`,
    email: profile.email,
    url: `${SITE_URL}/`,
    summary: SITE_DESCRIPTION,
    location: buildLocation(),
    profiles: contact
      .filter((item) => !item.link.startsWith('mailto:'))
      .map((item) => ({
        network: item.label,
        username: usernameFrom(item.link),
        url: item.link,
      })),
  };
}

function buildWork(): ResumeWork[] {
  // Sorted, not raw array order: `/resume` renders `sortPositions(work)`, and
  // the two published artifacts describe the same ten roles. Source order in
  // `work.ts` is not chronological and is not load-bearing.
  return sortPositions(work).map((position) => ({
    name: position.name,
    position: position.position,
    url: position.url,
    startDate: position.startDate,
    ...(position.endDate ? { endDate: position.endDate } : {}),
    ...(position.summary ? { summary: toPlainText(position.summary) } : {}),
    ...(position.highlights
      ? { highlights: position.highlights.map(toPlainText) }
      : {}),
  }));
}

/**
 * `Degree.degree` packs the qualification and the field into one display
 * string ("M.S. Computational and Mathematical Engineering (ICME)"). JSON
 * Resume keeps them apart, so the leading abbreviation is split off. Anything
 * that does not start with one becomes `area` alone rather than being guessed
 * at.
 */
function splitDegree(
  degree: string,
): Pick<ResumeEducation, 'studyType' | 'area'> {
  const match = degree.match(/^((?:[A-Z]\.){2,3})\s+(.+)$/);
  return match ? { studyType: match[1], area: match[2] } : { area: degree };
}

function buildEducation(): ResumeEducation[] {
  return degrees.map((degree) => {
    // Every course carries the university it was taken at; attach it to the
    // degree from that school instead of listing courses in a section the
    // schema has no room for.
    const schoolCourses = courses
      .filter((course) => degree.school.includes(course.university))
      .map((course) => `${course.number} - ${course.title}`);

    return {
      institution: degree.school,
      url: degree.link,
      ...splitDegree(degree.degree),
      endDate: String(degree.year),
      ...(schoolCourses.length > 0 ? { courses: schoolCourses } : {}),
    };
  });
}

/**
 * One entry per category, keywords ordered by competency. The 1–5 competency
 * scale has no counterpart in the schema's free-text `level`, so it shapes the
 * ordering rather than being translated into a word the data never claimed.
 */
function buildSkills(): ResumeSkill[] {
  return categories.map((category) => ({
    name: category.name,
    keywords: skills
      .filter((skill) => skill.category.includes(category.name))
      .sort(
        (a, b) => b.competency - a.competency || a.title.localeCompare(b.title),
      )
      .map((skill) => skill.title),
  }));
}

/**
 * Assembles the document. `meta.lastModified` is deliberately absent.
 *
 * It was emitted as the newest `startDate`/`endDate` in
 * `src/data/resume/work.ts`, which is a date about the work history rather than
 * about the document. Editing `profile.json`, `contact.ts`, `degrees.ts`,
 * `courses.ts`, or every skill in `skills.ts` left it untouched — the one field
 * that named itself "last modified" was the field least able to notice a
 * modification.
 *
 * Nothing in the data replaces it honestly. Only `work` and `degrees` carry
 * dates at all, and the newest across both is the same work-history date the
 * old implementation already published, so widening the search would broaden
 * the claim without broadening what it can actually see. The build clock is not
 * an option either: a timestamp read from the clock rewrites the artifact on
 * every rebuild, churns it in git, and cannot be pinned by a test — the same
 * discipline `feed.xml` applies to `lastBuildDate`. `meta.lastModified` is
 * optional in JSON Resume, so the field is omitted rather than published
 * meaning something narrower than its name. `work[0].startDate` already states
 * the recency of the work history, under a name that is true.
 */
export function buildJsonResume(): JsonResume {
  return {
    $schema: RESUME_SCHEMA_URL,
    basics: buildBasics(),
    work: buildWork(),
    education: buildEducation(),
    skills: buildSkills(),
    meta: {
      canonical: RESUME_JSON_URL,
    },
  };
}

/** The exact bytes served at `/resume.json`. Pretty-printed: people read it. */
export function serializeJsonResume(): string {
  return `${JSON.stringify(buildJsonResume(), null, 2)}\n`;
}
