import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { archive, shipped } from '@/data/projects';
import routes from '@/data/routes';
import ProjectsPage from '../projects/page';

describe('projects page', () => {
  it('presents selected work and the archive as separate, labelled groups', () => {
    render(<ProjectsPage />);

    const shippedSection = screen.getByRole('region', {
      name: 'Selected work',
    });
    const archiveSection = screen.getByRole('region', { name: 'Archive' });

    expect(
      within(shippedSection).getAllByRole('heading', { level: 3 }),
    ).toHaveLength(shipped.length);
    expect(within(shippedSection).getByRole('list')).toBeInTheDocument();
    expect(within(shippedSection).getAllByRole('listitem')).toHaveLength(
      shipped.length,
    );
    expect(
      within(archiveSection).getAllByRole('heading', { level: 3 }),
    ).toHaveLength(archive.length);
    expect(within(archiveSection).getByRole('list')).toBeInTheDocument();
    expect(within(archiveSection).getAllByRole('listitem')).toHaveLength(
      archive.length,
    );
  });

  it('counts each group rather than stating a number', () => {
    const { container } = render(<ProjectsPage />);
    const counts = [
      ...container.querySelectorAll('.projects-section-count'),
    ].map((node) => node.textContent);

    expect(counts).toEqual([
      `${shipped.length} projects`,
      `${archive.length} projects`,
    ]);
  });

  it('leads with the newest shipped work', () => {
    const { container } = render(<ProjectsPage />);
    const titles = [...container.querySelectorAll('.project-entry-title')].map(
      (node) => node.textContent?.replace('↗', ''),
    );

    expect(titles).toEqual(shipped.map((project) => project.title));
  });

  /**
   * The register has no artwork, and inventing some would be worse than going
   * without: only archive entries that actually have a committed screenshot
   * may render an image.
   */
  it('renders an image only where one exists', () => {
    const { container } = render(<ProjectsPage />);

    expect(container.querySelectorAll('.project-entry img')).toHaveLength(0);
    expect(container.querySelectorAll('.project-card img')).toHaveLength(
      archive.filter((project) => project.image).length,
    );
  });

  it('never renders a card that looks clickable but is not', () => {
    const { container } = render(<ProjectsPage />);

    for (const card of container.querySelectorAll(
      '.project-card, .project-entry',
    )) {
      const linked = card.matches('a') || card.querySelector('a') !== null;

      expect(card.classList.contains('project-card--linked')).toBe(
        linked && card.classList.contains('project-card'),
      );
      expect(
        card.querySelector('.project-note') !== null,
        `${card.querySelector('h3')?.textContent}: inert cards must say so`,
      ).toBe(!linked);
    }
  });

  /**
   * The page used to be reachable only through the footer, and `/contact`
   * hides the footer — so from there it was reachable from nowhere at all.
   */
  it('is a primary navigation destination', () => {
    const route = routes.find((entry) => entry.path === '/projects');

    expect(route?.label).toBe('Projects');
    expect(route?.primary).not.toBe(false);
  });
});
