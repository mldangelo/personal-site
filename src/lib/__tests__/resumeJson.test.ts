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
  serializeJsonResume,
  toPlainText,
} from '@/lib/resumeJson';

/** The schema's `iso8601` definition: YYYY, YYYY-MM, or YYYY-MM-DD. */
const ISO8601 =
  /^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/;

const resume = buildJsonResume();

describe('toPlainText', () => {
  it.each([
    ["see <a href='https://example.com'>the docs</a>", 'see the docs'],
    ['one\n    two\n\n  three ', 'one two three'],
  ])('flattens %s', (input, expected) => {
    expect(toPlainText(input)).toBe(expected);
  });

  it('leaves comparisons and generics alone', () => {
    // The same literal is the positive case in
    // `scripts/__tests__/verify-export.test.ts`: what this conversion keeps, the
    // export gate has to accept.
    const text = 'latency < 50ms and throughput > 1k with Map<string, number>';

    expect(toPlainText(text)).toBe(text);
  });
});

describe('json resume document', () => {
  it('declares the schema it conforms to', () => {
    expect(resume.$schema).toBe(
      'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    );
  });

  it('builds basics from the shared profile facts', () => {
    expect(resume.basics).toMatchObject({
      label: profile.role,
      email: profile.email,
      // The display city, without asserting a country.
      location: { city: 'San Francisco' },
    });
  });

  it('lists every non-email contact as a profile with its handle', () => {
    expect(resume.basics.profiles).toHaveLength(
      contact.filter((item) => !item.link.startsWith('mailto:')).length,
    );
    expect(resume.basics.profiles).toContainEqual({
      network: 'GitHub',
      username: 'mldangelo',
      url: 'https://github.com/mldangelo',
    });
  });

  it('carries every position in résumé order, with no invented end date', () => {
    expect(resume.work.map((position) => position.name)).toEqual(
      sortPositions(work).map((position) => position.name),
    );
    expect(resume.work[0]).not.toHaveProperty('endDate');
  });

  // Summaries are Markdown with inline anchors, so this reads the real prose.
  it('keeps the anchor text of the real prose', () => {
    const prose = resume.work.flatMap((position) => [
      position.summary ?? '',
      ...(position.highlights ?? []),
    ]);

    expect(prose.join(' ')).toContain(
      'backed by Anthemis, Foundation Capital, and Y Combinator',
    );
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
      studyType: 'M.S.',
      area: 'Computational and Mathematical Engineering (ICME)',
      endDate: '2016',
    });
  });

  // Cardinality across the whole document: per-entry assertions never look at a
  // duplicate. A school whose name contains another's is the case the real data
  // cannot express, and joining by containment would double every course.
  it('files each course under exactly one degree', async () => {
    expect(resume.education[0].courses).toContain(
      'EE 364a - Convex Optimization',
    );
    expect(
      resume.education.flatMap((entry) => entry.courses ?? []),
    ).toHaveLength(courses.length);
    // A school with no courses carries none, rather than an empty array.
    expect(resume.education[1]).not.toHaveProperty('courses');

    vi.resetModules();
    vi.doMock('@/data/resume/degrees', () => ({
      default: [
        ...degrees,
        {
          school: 'Stanford University Graduate School of Business',
          degree: 'M.B.A.',
          link: 'https://gsb.stanford.edu',
          year: 2018,
        },
      ],
    }));

    try {
      const { buildJsonResume: buildWithSecondSchool } = await import(
        '@/lib/resumeJson'
      );
      const { education } = buildWithSecondSchool();

      expect(education).toHaveLength(degrees.length + 1);
      expect(education.flatMap((entry) => entry.courses ?? [])).toHaveLength(
        courses.length,
      );
      expect(education.at(-1)).not.toHaveProperty('courses');
    } finally {
      vi.doUnmock('@/data/resume/degrees');
      vi.resetModules();
    }
  });

  it('groups skills by category with keywords ordered by competency', () => {
    expect(resume.skills.map((skill) => skill.name)).toEqual(
      categories.map((category) => category.name),
    );

    for (const group of resume.skills) {
      const expected = skills
        .filter((skill) => skill.category.includes(group.name))
        .map((skill) => skill.title);
      const competencies = group.keywords.map(
        (keyword) =>
          skills.find((skill) => skill.title === keyword)?.competency ?? 0,
      );

      expect([...group.keywords].sort()).toEqual([...expected].sort());
      expect(competencies).toEqual([...competencies].sort((a, b) => b - a));
    }
  });

  it('serializes to pretty-printed bytes that parse back', () => {
    const serialized = serializeJsonResume();

    expect(serialized).toMatch(/\n {2}"basics": \{[\s\S]*\n$/);
    expect(JSON.parse(serialized)).toEqual(resume);
  });
});
