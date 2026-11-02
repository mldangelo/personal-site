import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Project } from '@/data/projects';
import Entry from '../../Projects/Entry';

const base: Project = {
  title: 'Test Platform',
  subtitle: 'Co-founder & CTO',
  link: 'https://example.com',
  date: '2024-07-01',
  desc: 'A description of the shipped work.',
  tech: ['TypeScript', 'AWS Lambda'],
  status: 'shipped',
};

const archived: Project = {
  title: 'Weekend Hack',
  subtitle: 'Hackathon',
  image: '/images/test.jpg',
  date: '2015-11-20',
  desc: 'A student project kept for the record.',
  status: 'archive',
};

/** The one element `Entry` renders: the row itself. */
function row(container: HTMLElement): HTMLElement {
  return container.firstElementChild as HTMLElement;
}

describe('Entry', () => {
  it('renders the whole row as one outbound link', () => {
    const { container } = render(<Entry data={base} />);

    // The name is pinned as a reader hears it, not rebuilt from the
    // component's own constant.
    const link = screen.getByRole('link', {
      name: 'Test Platform (opens in a new tab)',
    });
    expect(link).toBe(row(container));
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toContainElement(screen.getByText(base.desc));
  });

  /** ↗ means "leaves the site in a new tab"; the link name already says so. */
  it('marks a linked title with a decorative arrow', () => {
    render(<Entry data={base} />);

    const heading = screen.getByRole('heading', { level: 3 });
    const arrow = heading.querySelector('.project-entry-external');
    expect(heading).toHaveTextContent('Test Platform↗');
    expect(arrow).toHaveTextContent('↗');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the title, role, description, and tech', () => {
    render(<Entry data={base} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Test Platform' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Co-founder & CTO')).toHaveClass(
      'project-entry-role',
    );
    expect(screen.getByText(base.desc)).toHaveClass('project-entry-desc');
    expect(screen.getByText('TypeScript')).toHaveClass('tech-tag');
    expect(screen.getByText('AWS Lambda')).toHaveClass('tech-tag');
  });

  /**
   * Straight quotes are what the data keeps; a reader gets typographic ones in
   * the title, the role, and the description — and in the link's name, so the
   * name still contains the text that is visible.
   */
  it('sets display strings with typographic quotes', () => {
    render(
      <Entry
        data={{
          ...base,
          title: "Ada's Engine",
          subtitle: 'Winner, "best hack"',
          desc: "It didn't ship.",
        }}
      />,
    );

    expect(
      screen.getByRole('link', { name: 'Ada’s Engine (opens in a new tab)' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Ada’s Engine',
    );
    expect(screen.getByText('Winner, “best hack”')).toBeInTheDocument();
    expect(screen.getByText('It didn’t ship.')).toBeInTheDocument();
  });

  describe('tiers', () => {
    /** Amber is reserved for a value that is live. */
    it('marks live work as present and gives it the size step', () => {
      const { container } = render(<Entry data={{ ...base, ongoing: true }} />);

      const dates = container.querySelector('.project-dates');
      expect(dates).toHaveTextContent('Jul 2024');
      expect(dates?.querySelector('.daterange-present')).toHaveTextContent(
        'Present',
      );
      expect(row(container).className).toBe(
        'project-entry project-entry--live',
      );
    });

    it('renders a closed range and no live styling once work has ended', () => {
      const { container } = render(
        <Entry data={{ ...base, endDate: '2026-03-09' }} />,
      );

      const dates = container.querySelector('.project-dates');
      expect(dates).toHaveTextContent('Jul 2024');
      expect(dates).toHaveTextContent('Mar 2026');
      expect(
        dates?.querySelector('.daterange-present'),
      ).not.toBeInTheDocument();
      expect(row(container).className).toBe('project-entry');
    });

    it('steps an archive entry down', () => {
      const { container } = render(<Entry data={archived} />);

      expect(row(container).className).toBe(
        'project-entry project-entry--archive',
      );
    });

    /**
     * The archive is the quieter part of the register by definition. An entry
     * there that happens to be ongoing still reads `Present`, but it must not
     * take the size step that would lift it past finished selected work.
     */
    it('never promotes an archive entry to the live tier', () => {
      const { container } = render(
        <Entry data={{ ...archived, ongoing: true }} />,
      );

      expect(row(container).className).toBe(
        'project-entry project-entry--archive',
      );
      expect(container.querySelector('.daterange-present')).toBeInTheDocument();
    });
  });

  it('speaks the range rather than running the two dates together', () => {
    render(<Entry data={{ ...base, endDate: '2026-03-09' }} />);

    expect(screen.getByText('to')).toHaveClass('sr-only');
    expect(document.querySelector('.daterange-sep')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  describe('thumbnail', () => {
    /** A row with no screenshot has no picture, and no frame waiting for one. */
    it('renders no image without a screenshot', () => {
      const { container } = render(<Entry data={base} />);

      expect(container.querySelector('img')).not.toBeInTheDocument();
      expect(
        container.querySelector('.project-entry-thumb'),
      ).not.toBeInTheDocument();
    });

    it('treats the screenshot as decoration beside its titled row', () => {
      const { container } = render(<Entry data={archived} />);

      const images = container.querySelectorAll('img');
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveAttribute('src', '/images/test.jpg');
      // Empty, not absent: the heading beside it already names the project.
      expect(images[0]).toHaveAttribute('alt', '');
      expect(images[0]).toHaveAttribute('loading', 'lazy');
    });

    /**
     * The attributes reserve the thumbnail's box before the file arrives, so
     * they have to describe the 16:10 frame the stylesheet crops to rather
     * than whichever screenshot happens to be inside it.
     */
    it('declares the frame it is cropped to, not the file', () => {
      const { container } = render(<Entry data={archived} />);
      const image = container.querySelector('img');

      const width = Number(image?.getAttribute('width'));
      const height = Number(image?.getAttribute('height'));
      expect(width / height).toBe(16 / 10);
    });

    it('keeps the thumbnail inside the link when the row has one', () => {
      const { container } = render(
        <Entry data={{ ...archived, link: 'https://example.com/hack' }} />,
      );

      expect(screen.getByRole('link')).toContainElement(
        container.querySelector('img'),
      );
    });
  });

  describe('an entry with no public link', () => {
    it('is not a link, has no arrow, and is not labelled as missing one', () => {
      const { container } = render(
        <Entry data={{ ...base, link: undefined }} />,
      );

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(row(container).tagName).toBe('DIV');
      expect(container).not.toHaveTextContent('↗');
      expect(container).not.toHaveTextContent(/no public link/i);
      // Still a complete record.
      expect(
        screen.getByRole('heading', { level: 3, name: 'Test Platform' }),
      ).toBeInTheDocument();
      expect(screen.getByText(base.desc)).toBeInTheDocument();
    });

    /**
     * The absence of the link is the only thing an unlinked row says about
     * itself: strip the anchor and its arrow from a linked row and what is
     * left is the unlinked one, class for class.
     */
    it('differs from a linked row only by the link and its arrow', () => {
      const linked = row(
        render(
          <Entry data={{ ...archived, link: 'https://example.com/hack' }} />,
        ).container,
      );
      const unlinked = row(render(<Entry data={archived} />).container);

      expect(linked.tagName).toBe('A');
      expect(unlinked.tagName).toBe('DIV');
      expect(unlinked.className).toBe(linked.className);

      linked.querySelector('.project-entry-external')?.remove();
      expect(unlinked.innerHTML).toBe(linked.innerHTML);
    });
  });
});
