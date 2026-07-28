import { describe, expect, it, vi } from 'vitest';

import contact from '@/data/contact';
import profile from '@/data/profile.json';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { sortPositions } from '@/lib/career';
import {
  buildJsonResume,
  RESUME_JSON_PATH,
  RESUME_JSON_URL,
  serializeJsonResume,
  toPlainText,
} from '@/lib/resumeJson';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils';

/** Root properties JSON Resume v1.0.0 allows; the schema forbids the rest. */
const ROOT_KEYS = [
  '$schema',
  'basics',
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
  'meta',
];

/** The schema's `iso8601` definition: YYYY, YYYY-MM, or YYYY-MM-DD. */
const ISO8601 =
  /^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/;

const resume = buildJsonResume();

/**
 * Every inline `<a href>` in the source résumé prose. The doc comment on
 * `toPlainText` claims the text of each one survives into the artifact and the
 * href does not; these are what hold it to that.
 */
const sourceAnchors = work
  .flatMap((position) => [
    position.summary ?? '',
    ...(position.highlights ?? []),
  ])
  .flatMap((source) => [
    ...source.matchAll(/<a\s[^>]*href='([^']+)'[^>]*>([^<]+)<\/a>/g),
  ])
  .map((match) => ({ href: match[1], text: match[2] }));

/** The plain-text prose of the built document, as one string. */
const resumeProse = resume.work
  .flatMap((position) => [
    position.summary ?? '',
    ...(position.highlights ?? []),
  ])
  .join('\n');

describe('toPlainText', () => {
  it('keeps anchor text and drops the markup', () => {
    expect(
      toPlainText("see <a href='https://example.com'>the docs</a> now"),
    ).toBe('see the docs now');
  });

  it('unwraps markdown links, emphasis, and code', () => {
    expect(
      toPlainText('[docs](https://example.com) are **very** *good* `code`'),
    ).toBe('docs are very good code');
  });

  it('collapses the wrapping and indentation of template literals', () => {
    expect(toPlainText('one\n    two\n\n  three ')).toBe('one two three');
  });

  it('decodes HTML entities', () => {
    expect(toPlainText('Trust &amp; Safety &#38; more')).toBe(
      'Trust & Safety & more',
    );
  });

  it('leaves underscores alone so identifiers survive', () => {
    expect(toPlainText('the snake_case_name field')).toBe(
      'the snake_case_name field',
    );
  });
});

describe('json resume document', () => {
  it('declares the schema it conforms to and adds no keys of its own', () => {
    expect(resume.$schema).toBe(
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    );
    for (const key of Object.keys(resume)) {
      expect(ROOT_KEYS).toContain(key);
    }
  });

  it('builds basics from the shared profile facts', () => {
    expect(resume.basics).toMatchObject({
      name: AUTHOR_NAME,
      label: profile.role,
      email: profile.email,
      image: `${SITE_URL}/images/me.jpg`,
      url: `${SITE_URL}/`,
      summary: SITE_DESCRIPTION,
    });
  });

  it('splits the display city into city and region without asserting a country', () => {
    expect(resume.basics.location).toEqual({ city: 'New York', region: 'NY' });
  });

  it('lists every non-email contact as a profile with its handle', () => {
    const socials = contact.filter((item) => !item.link.startsWith('mailto:'));

    expect(resume.basics.profiles).toHaveLength(socials.length);
    expect(resume.basics.profiles).toContainEqual({
      network: 'GitHub',
      username: 'mldangelo',
      url: 'https://github.com/mldangelo',
    });
    expect(resume.basics.profiles).toContainEqual({
      network: 'LinkedIn',
      username: 'michaelldangelo',
      url: 'https://www.linkedin.com/in/michaelldangelo',
    });
    expect(
      resume.basics.profiles.every((entry) => entry.username.length > 0),
    ).toBe(true);
  });

  it('carries every position in the order /resume renders them', () => {
    // Not `work` in source order: the page renders `sortPositions(work)`, and
    // the two published artifacts must not disagree about the same ten roles.
    const rendered = sortPositions(work);

    expect(resume.work.map((position) => position.name)).toEqual(
      rendered.map((position) => position.name),
    );
    expect(resume.work).toHaveLength(work.length);
    expect(resume.work[0]).toMatchObject({
      name: 'OpenAI',
      position: rendered[0].position,
      url: rendered[0].url,
      startDate: rendered[0].startDate,
    });
  });

  it('omits endDate for the current role rather than inventing one', () => {
    expect(resume.work[0]).not.toHaveProperty('endDate');
    expect(resume.work[1].endDate).toBe('2026-03-09');
  });

  it('reduces summaries carrying inline anchors to plain text', () => {
    expect(resume.work[0].summary).toBe(
      'Building Promptfoo and Codex Security at OpenAI, with a focus on securing AI systems and applying AI to software security.',
    );

    const arthena = resume.work.find((position) => position.name === 'Arthena');
    expect(arthena?.summary).toContain(
      'backed by Anthemis, Foundation Capital, and Y Combinator',
    );
  });

  it('keeps the text of every inline anchor', () => {
    // Six, in three summaries — the count the `toPlainText` comment states.
    expect(sourceAnchors).toHaveLength(6);

    for (const { text } of sourceAnchors) {
      expect(resumeProse).toContain(text);
    }
  });

  it('drops every inline href, and no other field brings one back', () => {
    const serialized = serializeJsonResume();
    const entryUrls = new Set(work.map((position) => position.url));

    for (const { href } of sourceAnchors) {
      expect(serialized).not.toContain(href);
      // These are third-party links — an announcement, three investors, two
      // funds — not the employer's own `url`, so that field does not recover
      // them. This is the assertion that refutes the comment this file used to
      // carry.
      expect(entryUrls.has(href)).toBe(false);
    }
  });

  it('leaves no markup or uncollapsed whitespace anywhere in the prose', () => {
    const prose = resume.work.flatMap((position) => [
      position.summary ?? '',
      ...(position.highlights ?? []),
    ]);

    expect(prose.length).toBeGreaterThan(0);
    for (const text of prose) {
      expect(text).not.toMatch(/[<>]/);
      expect(text).not.toMatch(/\[[^\]]+\]\([^)]*\)/);
      expect(text).not.toMatch(/\s{2,}|[\n\r\t]/);
    }
  });

  it('uses schema-valid dates throughout', () => {
    for (const position of resume.work) {
      expect(position.startDate).toMatch(ISO8601);
      if (position.endDate) expect(position.endDate).toMatch(ISO8601);
    }
    for (const entry of resume.education) {
      expect(entry.endDate).toMatch(ISO8601);
    }
  });

  it('splits the degree string into studyType and area', () => {
    expect(resume.education).toHaveLength(degrees.length);
    expect(resume.education[0]).toMatchObject({
      institution: 'Stanford University',
      url: 'https://stanford.edu',
      studyType: 'M.S.',
      area: 'Computational and Mathematical Engineering (ICME)',
      endDate: '2016',
    });
    expect(resume.education[1]).toMatchObject({
      institution: 'University at Buffalo',
      studyType: 'B.S.',
      area: 'Electrical Engineering, Computer Engineering',
      endDate: '2012',
    });
  });

  it('files coursework under the school it was taken at', () => {
    expect(resume.education[0].courses).toHaveLength(courses.length);
    expect(resume.education[0].courses).toContain(
      'EE 364a - Convex Optimization',
    );
    // Every course in the data is a Stanford course, so Buffalo carries none
    // rather than an empty array.
    expect(resume.education[1]).not.toHaveProperty('courses');
  });

  it('groups skills by category with keywords ordered by competency', () => {
    expect(resume.skills.map((skill) => skill.name)).toEqual(
      categories.map((category) => category.name),
    );

    for (const group of resume.skills) {
      const expected = skills
        .filter((skill) => skill.category.includes(group.name))
        .map((skill) => skill.title);

      expect(group.keywords).toHaveLength(expected.length);
      expect([...group.keywords].sort()).toEqual([...expected].sort());

      const competencies = group.keywords.map(
        (keyword) =>
          skills.find((skill) => skill.title === keyword)?.competency ?? 0,
      );
      expect(competencies).toEqual([...competencies].sort((a, b) => b - a));
    }
  });

  it('keeps the canonical file-like', () => {
    expect(RESUME_JSON_PATH).toBe('/resume.json');
    expect(RESUME_JSON_URL).toBe(`${SITE_URL}/resume.json`);
    expect(resume.meta.canonical).toBe(RESUME_JSON_URL);
    expect(resume.meta.canonical).not.toMatch(/resume\.json\/$/);
  });

  it('publishes no lastModified rather than one that only means the work history', () => {
    // It used to be the newest date in `work.ts`, which does not move when
    // profile, contact, degrees, courses, or every skill changes.
    expect(resume.meta).toEqual({ canonical: RESUME_JSON_URL });
    expect(serializeJsonResume()).not.toContain('lastModified');
  });

  it('reads nothing from the build clock', () => {
    // Stronger than asserting one field is not `Date.now()`: the whole
    // document has to come out byte-identical after the clock moves years, so
    // a rebuild cannot churn the artifact in git.
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
      const first = serializeJsonResume();
      vi.setSystemTime(new Date('2031-06-30T12:34:56Z'));

      expect(serializeJsonResume()).toBe(first);
    } finally {
      vi.useRealTimers();
    }
  });

  it('serializes to stable, pretty-printed bytes', () => {
    const serialized = serializeJsonResume();

    expect(serialized).toBe(serializeJsonResume());
    expect(serialized.endsWith('\n')).toBe(true);
    expect(serialized).toContain('\n  "basics": {');
    expect(JSON.parse(serialized)).toEqual(resume);
  });
});
