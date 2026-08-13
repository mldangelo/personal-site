import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import projects, { archive, type Project, shipped } from '../projects';
import work from '../resume/work';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Complete register order: live first, then activity date, then title. */
function compareActivity(a: Project, b: Project): number {
  const liveOrder = Number(Boolean(b.ongoing)) - Number(Boolean(a.ongoing));
  if (liveOrder !== 0) return liveOrder;

  const dateOrder =
    Date.parse(b.endDate ?? b.date) - Date.parse(a.endDate ?? a.date);
  return dateOrder || a.title.localeCompare(b.title);
}

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function numericClaims(value: string): string[] {
  return (value.match(/\d[\d,]*(?:\.\d+)?(?:[KMB]\+?|%|-[A-Z])?\+?/gi) ?? [])
    .map((claim) => claim.replaceAll(',', '').replace(/\+$/, '').toUpperCase())
    .filter(Boolean);
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

      if (project.status === 'shipped') {
        expect(typeof project.sourceWork, project.title).toBe('string');
        expect(
          project.sourceWork?.trim().length,
          project.title,
        ).toBeGreaterThan(0);
      } else {
        expect(project.sourceWork, project.title).toBeUndefined();
      }
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
      expect(isValidIsoDate(project.date), `${project.title}: date`).toBe(true);

      if (project.endDate) {
        expect(
          isValidIsoDate(project.endDate),
          `${project.title}: endDate`,
        ).toBe(true);
        expect(Date.parse(project.endDate)).toBeGreaterThan(
          Date.parse(project.date),
        );
      }
    }
  });

  it('rejects normalized and non-ISO calendar dates', () => {
    expect(isValidIsoDate('2026-02-31')).toBe(false);
    expect(isValidIsoDate('March 9, 2026')).toBe(false);
  });

  /** `ongoing` is what earns the amber "Present"; a finished thing cannot. */
  it('never marks an entry both ongoing and finished', () => {
    for (const project of projects) {
      if (project.ongoing) expect(project.endDate).toBeUndefined();
    }
  });

  it('links are valid URLs when present', () => {
    for (const project of projects) {
      if (project.link) {
        const url = new URL(project.link);

        expect(url.protocol, project.title).toBe('https:');
        expect(url.username, project.title).toBe('');
        expect(url.password, project.title).toBe('');
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
    const sourced = shipped.map((project) => ({
      project,
      position: byName.get(project.sourceWork ?? ''),
    }));

    it('maps every shipped entry to an existing résumé role', () => {
      for (const { project, position } of sourced) {
        expect(
          position,
          `${project.title}: ${project.sourceWork}`,
        ).toBeDefined();
      }
    });

    it('starts and ends when the résumé says it did', () => {
      for (const { project, position } of sourced) {
        expect(project.date, project.title).toBe(position?.startDate);
        if (project.endDate) {
          expect(project.endDate, project.title).toBe(position?.endDate);
        }
      }
    });

    it('keeps same-name project and résumé destinations aligned', () => {
      for (const { project, position } of sourced) {
        // Codex Security is backed by the OpenAI role but intentionally links
        // to the product announcement rather than OpenAI's home page.
        if (project.title !== project.sourceWork) continue;
        expect(project.link, project.title).toBe(position?.url);
      }
    });

    /**
     * Every figure in the shipped register has to already exist in the
     * associated résumé role. This guards against a plausible-looking metric
     * that is absent from the repository's internal record.
     */
    it('quotes no figure the résumé does not already carry', () => {
      for (const { project, position } of sourced) {
        const record = new Set(numericClaims(JSON.stringify(position)));
        const figures = numericClaims(project.desc);

        for (const figure of figures) {
          expect(
            record.has(figure),
            `${project.title}: "${figure}" is not in src/data/resume/work.ts`,
          ).toBe(true);
        }
      }
    });

    it('compares numeric claims as complete tokens', () => {
      const record = new Set(numericClaims('2026 1M+ 30+ 25% 1-N'));

      expect(record).toEqual(new Set(['2026', '1M', '30', '25%', '1-N']));
      expect(record.has('20')).toBe(false);
      expect(record.has('1%')).toBe(false);
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

  it('keeps reviewed destination and chronology corrections in place', () => {
    const arthena = projects.find((project) => project.title === 'Arthena');
    const spacePotato = projects.find(
      (project) => project.title === 'Space Potato',
    );
    const catDetector = projects.find(
      (project) => project.title === 'Cat Detector',
    );

    expect(arthena?.link).toBe('https://www.ycombinator.com/companies/arthena');
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
