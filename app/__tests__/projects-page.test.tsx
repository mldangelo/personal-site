import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import projects, { archive, type Project, shipped } from '@/data/projects';
import routes from '@/data/routes';
import { smartQuotes } from '@/lib/typography';
import ProjectsPage from '../projects/page';

const SECTIONS: [name: string, group: Project[]][] = [
  ['Selected work', shipped],
  ['Archive', archive],
];

/** The rows of one part of the register, in the order the page draws them. */
function rowsIn(name: string): HTMLElement[] {
  const section = screen.getByRole('region', { name });

  return within(section)
    .getAllByRole('listitem')
    .map((item) => {
      // One row per list item, and nothing else beside it.
      expect(item.children).toHaveLength(1);
      return item.firstElementChild as HTMLElement;
    });
}

/** Each project in the data paired with the row the page drew for it. */
function projectRows(): [project: Project, row: HTMLElement][] {
  const rows = SECTIONS.flatMap(([name]) => rowsIn(name));

  expect(rows).toHaveLength(projects.length);
  return projects.map((project, index) => [project, rows[index]]);
}

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

  /** One header for a section on every page: a heading, then its annotation. */
  it('opens each group with the shared section header', () => {
    render(<ProjectsPage />);

    for (const [name] of SECTIONS) {
      const heading = screen.getByRole('heading', { level: 2, name });

      expect(heading).toHaveClass('section-heading');
      expect(heading.parentElement).toHaveClass('section-header');
    }
  });

  it('counts each group rather than stating a number', () => {
    const { container } = render(<ProjectsPage />);
    const counts = [...container.querySelectorAll('.section-header-meta')].map(
      (node) => node.textContent,
    );

    expect(counts).toEqual([
      `${shipped.length} projects`,
      `${archive.length} projects`,
    ]);
  });

  it.each(SECTIONS)('lists %s in the order the data gives', (name, group) => {
    render(<ProjectsPage />);
    const titles = rowsIn(name).map((row) =>
      within(row)
        .getByRole('heading', { level: 3 })
        .textContent?.replace('↗', ''),
    );

    // Compared in display form: the row sets its title with typographic
    // quotes, which `Entry`'s own tests pin against literals.
    expect(titles).toEqual(group.map((project) => smartQuotes(project.title)));
  });

  /**
   * The archive used to be picture cards under a list of plain rows, so five
   * student projects out-weighed the work above them. It is the same list and
   * the same row now, a size step down.
   */
  it('draws the archive with the same row as the work above it', () => {
    const { container } = render(<ProjectsPage />);

    for (const [name] of SECTIONS) {
      const section = screen.getByRole('region', { name });

      expect(within(section).getByRole('list')).toHaveClass(
        'projects-register',
      );
    }
    for (const row of rowsIn('Selected work')) {
      expect(row).toHaveClass('project-entry');
      expect(row).not.toHaveClass('project-entry--archive');
    }
    for (const row of rowsIn('Archive')) {
      expect(row).toHaveClass('project-entry', 'project-entry--archive');
    }
    // The cards are gone, not restyled.
    expect(
      container.querySelector('[class*="project-card"], .projects-grid'),
    ).not.toBeInTheDocument();
  });

  /**
   * No artwork is invented: a row shows a thumbnail only when its entry has a
   * committed screenshot, and then exactly that file.
   */
  it('renders an image only where one exists', () => {
    render(<ProjectsPage />);

    for (const [project, row] of projectRows()) {
      const images = row.querySelectorAll('img');

      expect(images, project.title).toHaveLength(project.image ? 1 : 0);
      if (project.image) {
        expect(images[0]).toHaveAttribute('src', project.image);
        expect(images[0]).toHaveAttribute('alt', '');
      }
    }
  });

  /**
   * An entry with nowhere to go is a plain record. It is told apart from a
   * linked one by what is missing — the link and its arrow — and by nothing
   * added: the "No public link" label three archive cards used to carry is
   * not there to apologise for it.
   */
  it('links a row only where the project has a destination', () => {
    const { container } = render(<ProjectsPage />);

    for (const [project, row] of projectRows()) {
      const arrow = row.querySelector('.project-entry-external');

      if (project.link) {
        expect(row.tagName, project.title).toBe('A');
        expect(row).toHaveAttribute('href', project.link);
        expect(row).toHaveAttribute('target', '_blank');
        expect(row.getAttribute('aria-label')).toMatch(
          /\(opens in a new tab\)$/,
        );
        expect(arrow).toHaveTextContent('↗');
      } else {
        expect(row.tagName, project.title).toBe('DIV');
        expect(row.querySelector('a')).not.toBeInTheDocument();
        expect(arrow).not.toBeInTheDocument();
      }
    }
    expect(container).not.toHaveTextContent(/no public link/i);
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
