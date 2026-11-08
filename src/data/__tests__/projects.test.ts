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

/** Throws on non-ISO strings; differs on dates such as `2026-02-31` that normalize. */
function normalized(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10);
}

function numericClaims(value: string): string[] {
  return (value.match(/\d[\d,]*(?:\.\d+)?(?:[KMB]\+?|%|-[A-Z])?\+?/gi) ?? [])
    .map((claim) => claim.replaceAll(',', '').replace(/\+$/, '').toUpperCase())
    .filter(Boolean);
}

describe('projects data', () => {
  it('has unique titles', () => {
    expect(new Set(projects.map((p) => p.title)).size).toBe(projects.length);
  });

  it('uses valid dates, with an end after the start', () => {
    for (const { title, date, endDate } of projects) {
      expect(normalized(date), title).toBe(date);

      if (endDate) {
        expect(normalized(endDate), title).toBe(endDate);
        expect(Date.parse(endDate), title).toBeGreaterThan(Date.parse(date));
      }
    }
  });

  // `ongoing` is what earns the amber "Present"; a finished thing cannot.
  it('never marks an entry both ongoing and finished', () => {
    for (const project of projects) {
      if (project.ongoing) expect(project.endDate).toBeUndefined();
    }
  });

  it('links over https with no embedded credentials', () => {
    for (const { link, title } of projects) {
      if (!link) continue;

      expect(new URL(link), title).toMatchObject({
        protocol: 'https:',
        username: '',
        password: '',
      });
    }
  });

  it.each([
    ['shipped', shipped],
    ['archive', archive],
  ])('orders %s by most recent activity first', (_, group) => {
    expect(group).toEqual([...group].sort(compareActivity));
  });

  /**
   * A shipped entry must agree with the résumé role it names. This is a
   * consistency gate, not proof of external truth or link health. A project may
   * outlive the job, so only a declared project end date is compared.
   */
  describe('agreement with the résumé', () => {
    const byName = new Map(work.map((position) => [position.name, position]));
    const sourced = shipped.map((project) => ({
      project,
      position: byName.get(project.sourceWork ?? ''),
    }));

    it('names a source role for every shipped entry and no archived one', () => {
      for (const { project, position } of sourced) {
        expect(position, project.title).toBeDefined();
      }
      for (const project of archive) {
        expect(project.sourceWork, project.title).toBeUndefined();
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
        // A differently named entry may link to its own announcement.
        if (project.title !== project.sourceWork) continue;
        expect(project.link, project.title).toBe(position?.url);
      }
    });

    it('quotes no figure the résumé does not already carry', () => {
      for (const { project, position } of sourced) {
        const record = new Set(numericClaims(JSON.stringify(position)));

        for (const figure of numericClaims(project.desc)) {
          expect(record, `${project.title}: "${figure}"`).toContain(figure);
        }
      }
    });

    it('compares numeric claims as complete tokens', () => {
      const record = new Set(numericClaims('2026 1M+ 30+ 25% 1-N'));

      expect(record).toEqual(new Set(['2026', '1M', '30', '25%', '1-N']));
    });

    it('makes a historical role explicit on a project that outlived it', () => {
      const promptfoo = projects.find((p) => p.title === 'Promptfoo');

      expect(promptfoo?.ongoing).toBe(true);
      expect(promptfoo?.subtitle).toMatch(/through acquisition/i);
      expect(promptfoo?.subtitle).toMatch(/continued at OpenAI/i);
      expect(byName.get('Promptfoo')?.endDate).toBe('2026-03-09');
    });
  });
});
