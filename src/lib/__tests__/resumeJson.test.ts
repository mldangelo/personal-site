import { describe, expect, it, vi } from 'vitest';

import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import work from '@/data/resume/work';
import { buildJsonResume, toPlainText } from '@/lib/resumeJson';

const resume = buildJsonResume();

describe('toPlainText', () => {
  it.each([
    ['one\n    two\n\n  three ', 'one two three'],
    // A raw anchor whose title holds a `>` that a tag pattern reads as the
    // tag's end.
    ['see <a href="https://example.com" title="a > b">B</a>', 'see B'],
    ['a note<!-- not for readers --> ends', 'a note ends'],
    ['typed as vector<int> here', 'typed as vector<int> here'],
    // Markup goes; the prose around it stays as written.
    ['See [docs](https://example.com).', 'See docs.'],
    ['first  \nsecond', 'first second'],
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
  // The page says which role runs alongside the main one, and so does this.
  it('marks the part-time role as one', () => {
    expect(
      resume.work
        .filter((position) => position.commitment === 'part-time')
        .map((position) => position.name),
    ).toEqual(
      work
        .filter((position) => position.commitment === 'part-time')
        .map((position) => position.name),
    );
    expect(
      resume.work.some((position) => position.commitment === 'part-time'),
    ).toBe(true);
  });

  it('splits the degree string into studyType and area', () => {
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
      // A school with no courses carries none, rather than an empty array.
      expect(education.at(-1)).not.toHaveProperty('courses');
    } finally {
      vi.doUnmock('@/data/resume/degrees');
      vi.resetModules();
    }
  });
});
