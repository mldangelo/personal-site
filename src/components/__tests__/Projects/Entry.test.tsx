import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Project } from '@/data/projects';
import { withBasePath } from '@/lib/utils';
import Entry from '../../Projects/Entry';

const base: Project = {
  title: 'Test Platform',
  subtitle: 'Co-founder & CTO',
  link: 'https://example.com',
  date: '2024-07-01',
  desc: 'A description of the shipped work.',
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
  it('renders the whole row as one outbound link with a decorative arrow', () => {
    const { container } = render(<Entry data={base} />);

    const link = screen.getByRole('link', {
      name: 'Test Platform (opens in a new tab)',
    });

    expect(link).toBe(row(container));
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('↗')).toHaveAttribute('aria-hidden', 'true');
  });

  // The link's name has to keep containing the text that is visible.
  it('sets display strings with typographic quotes, including the link name', () => {
    render(<Entry data={{ ...base, title: "Ada's", desc: "It didn't." }} />);

    expect(
      screen.getByRole('link', { name: 'Ada’s (opens in a new tab)' }),
    ).toBeInTheDocument();
    expect(screen.getByText('It didn’t.')).toBeInTheDocument();
  });

  // Amber is reserved for live values, and the archive sits below selected work
  // whatever its dates say, so an ongoing archive entry still takes no size step.
  it.each([
    ['live work', { ...base, ongoing: true }, ' project-entry--live', true],
    ['finished work', { ...base, endDate: '2026-03-09' }, '', false],
    [
      'an ongoing archive entry',
      { ...archived, ongoing: true },
      ' project-entry--archive',
      true,
    ],
  ])('places %s in its tier', (_, data, tier, present) => {
    const { container } = render(<Entry data={data} />);

    expect(row(container).className).toBe(`project-entry${tier}`);
    expect(screen.queryByText('Present') !== null).toBe(present);
  });

  // The heading beside it names the project.
  it('treats a screenshot as decoration under the base path', () => {
    const { container } = render(<Entry data={archived} />);

    const image = container.querySelector('img');

    // A row with no screenshot reserves no frame for one.
    expect(
      render(<Entry data={base} />).container.querySelector('img'),
    ).toBeNull();
    expect(image).toHaveAttribute('src', withBasePath('/images/test.jpg'));
    expect(image).toHaveAttribute('alt', '');
  });

  // The absence of the link is the only thing an unlinked row says about itself.
  it('differs without a link only by the anchor and its arrow', () => {
    const linked = row(
      render(<Entry data={{ ...archived, link: 'https://example.com/hack' }} />)
        .container,
    );
    const unlinked = row(render(<Entry data={archived} />).container);

    expect(linked.tagName).toBe('A');
    expect(unlinked.tagName).toBe('DIV');
    expect(unlinked.className).toBe(linked.className);
    expect(unlinked).not.toHaveTextContent('↗');

    linked.querySelector('.project-entry-external')?.remove();
    expect(unlinked.innerHTML).toBe(linked.innerHTML);
  });
});
