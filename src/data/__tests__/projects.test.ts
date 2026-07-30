import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import projects, { archive, type Project, shipped } from '../projects';
import work from '../resume/work';

/** Complete register order: live first, then activity date, then title. */
function compareActivity(a: Project, b: Project): number {
  const liveOrder = Number(Boolean(b.ongoing)) - Number(Boolean(a.ongoing));
  if (liveOrder !== 0) return liveOrder;

  const dateOrder =
    Date.parse(b.endDate ?? b.date) - Date.parse(a.endDate ?? a.date);
  return dateOrder || a.title.localeCompare(b.title);
}

describe('projects data', () => {
  it('exports an array of projects', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it('each project has required properties', () => {
    for (const project of projects) {
      expect(typeof project.title).toBe('string');
      expect(typeof project.date).toBe('string');
      expect(typeof project.desc).toBe('string');
      expect(['shipped', 'archive']).toContain(project.status);
    }
  });

  it('project titles are non-empty', () => {
    for (const project of projects) {
      expect(project.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('project descriptions are non-empty', () => {
    for (const project of projects) {
      expect(project.desc.trim().length).toBeGreaterThan(0);
    }
  });

  /**
   * The image is optional so that a new entry does not need art invented for
   * it, but a path that is declared has to resolve — a card that renders a
   * missing file is worse than a card with no picture.
   */
  it('image paths resolve to a committed file', () => {
    for (const project of projects) {
      if (project.image === undefined) continue;

      expect(project.image.startsWith('/')).toBe(true);
      expect(
        existsSync(join(process.cwd(), 'public', project.image)),
        `${project.title}: ${project.image} is not in public/`,
      ).toBe(true);
    }
  });

  it('dates are valid date strings', () => {
    for (const project of projects) {
      expect(Number.isNaN(Date.parse(project.date))).toBe(false);

      if (project.endDate) {
        expect(Number.isNaN(Date.parse(project.endDate))).toBe(false);
        expect(Date.parse(project.endDate)).toBeGreaterThan(
          Date.parse(project.date),
        );
      }
    }
  });

  /** `ongoing` is what earns the amber "Present"; a finished thing cannot. */
  it('never marks an entry both ongoing and finished', () => {
    for (const project of projects) {
      if (project.ongoing) expect(project.endDate).toBeUndefined();
    }
  });

  it('links are valid URLs when present', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const project of projects) {
      if (project.link) {
        expect(project.link).toMatch(urlRegex);
      }
    }
  });

  it('tech is a non-empty array when present', () => {
    for (const project of projects) {
      if (project.tech) {
        expect(Array.isArray(project.tech)).toBe(true);
        expect(project.tech.length).toBeGreaterThan(0);
      }
    }
  });

  it('has unique project titles', () => {
    const titles = projects.map((p) => p.title);

    expect(new Set(titles).size).toBe(titles.length);
  });

  it('splits into a shipped register and an archive, and keeps both', () => {
    expect(shipped.length).toBeGreaterThan(0);
    expect(archive.length).toBeGreaterThan(0);
    // Groups stay contiguous in the file, so reading it top to bottom reads
    // the same way the page does.
    expect(projects).toEqual([...shipped, ...archive]);
  });

  it.each([
    ['shipped', shipped],
    ['archive', archive],
  ])('orders %s by most recent activity first', (_, group) => {
    expect(group).toEqual([...group].sort(compareActivity));
  });

  /**
   * A shipped entry that names a résumé role must agree with that internal
   * record. This is a consistency gate, not proof of external truth or link
   * health. A project may outlive the job — Promptfoo is still being built at
   * OpenAI — so only a declared project end date is compared.
   */
  describe('agreement with the résumé', () => {
    const byName = new Map(work.map((position) => [position.name, position]));
    const crossReferenced = projects.filter((project) =>
      byName.has(project.title),
    );

    it('cross-references the résumé at all', () => {
      expect(crossReferenced.length).toBeGreaterThan(0);
    });

    it('starts and ends when the résumé says it did', () => {
      for (const project of crossReferenced) {
        const position = byName.get(project.title);

        expect(project.date, project.title).toBe(position?.startDate);
        if (project.endDate) {
          expect(project.endDate, project.title).toBe(position?.endDate);
        }
      }
    });

    it('points shipped work at the destination the résumé points at', () => {
      // Archive entries deliberately link to the project itself rather than to
      // the organisation, so only the shipped register is held to this.
      for (const project of crossReferenced) {
        if (project.status !== 'shipped') continue;

        expect(project.link, project.title).toBe(
          byName.get(project.title)?.url,
        );
      }
    });

    /**
     * Every figure in the shipped register has to already exist in the
     * résumé. This is the guard against the worst failure mode on this page:
     * a plausible-looking metric nobody can source.
     */
    it('quotes no figure the résumé does not already carry', () => {
      const record = JSON.stringify(work);

      for (const project of shipped) {
        // Grouped digits, with sentence punctuation trimmed back off the end.
        const figures = (project.desc.match(/\d[\d,.]*/g) ?? []).map((figure) =>
          figure.replace(/[.,]+$/, ''),
        );

        for (const figure of figures) {
          expect(
            record.includes(figure),
            `${project.title}: "${figure}" is not in src/data/resume/work.ts`,
          ).toBe(true);
        }
      }
    });
  });

  it('distinguishes Promptfoo project continuity from the founding role', () => {
    const promptfoo = projects.find((project) => project.title === 'Promptfoo');
    const role = work.find((position) => position.name === 'Promptfoo');

    expect(promptfoo?.ongoing).toBe(true);
    expect(promptfoo?.subtitle).toMatch(/through acquisition/i);
    expect(promptfoo?.subtitle).toMatch(/continued at OpenAI/i);
    expect(role?.endDate).toBe('2026-03-09');
  });

  it('does not publish dead destinations or historically unsupported technology claims', () => {
    const arthena = projects.find((project) => project.title === 'Arthena');
    const spacePotato = projects.find(
      (project) => project.title === 'Space Potato',
    );
    const catDetector = projects.find(
      (project) => project.title === 'Cat Detector',
    );

    expect(arthena?.link).toBe('https://www.arthena.co/');
    expect(spacePotato?.link).toBeUndefined();
    expect(catDetector?.tech).not.toContain('TensorFlow');
  });

  it('uses established brand and technology capitalization', () => {
    const harvest = projects.find((project) => project.title === 'Harvest');
    const arthena = projects.find((project) => project.title === 'Arthena');

    expect(harvest?.subtitle).toContain('TechCrunch');
    expect(harvest?.tech).toContain('Computer vision');
    expect(arthena?.tech).toContain('Microservices');
  });
});
