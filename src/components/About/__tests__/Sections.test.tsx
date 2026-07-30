import { render, screen, waitFor, within } from '@testing-library/react';
import type { ComponentPropsWithoutRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import { createHeadingId } from '@/lib/anchors';
import AboutContent from '../Sections';

// `<Link>` renders a plain `<a>`, so nothing in the DOM distinguishes a
// client-routed link from one that reloads the document. The mock marks it.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: ComponentPropsWithoutRef<'a'>) => (
    <a data-router-link="true" href={href} {...rest}>
      {children}
    </a>
  ),
}));

function getActualSectionTitles(markdown: string) {
  return Array.from(markdown.matchAll(/^# (.+)$/gm))
    .map((match) => match[1])
    .filter((title) => title !== 'Intro');
}

describe('AboutContent', () => {
  it('renders intro copy without an Intro heading', () => {
    render(
      <AboutContent
        markdown={`# Intro

Hello from the intro.

# Some History

- Built a thing.`}
      />,
    );

    expect(screen.getByText('Hello from the intro.')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Intro' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Some History' }),
    ).toBeInTheDocument();
  });

  it('assigns section variants for compact and links sections', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# I Like

- Running

# Websites from People I Admire

- [Example](https://example.com)`}
      />,
    );

    const sections = container.querySelectorAll('.about-section');

    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveClass('about-section--compact');
    expect(sections[1]).toHaveClass('about-section--links');
  });

  it('adds stable heading ids for deep links', () => {
    render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# Some History

- Built a thing.

# Travel / Geography

- Went somewhere.`}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Some History' }),
    ).toHaveAttribute('id', 'some-history');
    expect(
      screen.getByRole('heading', { name: 'Travel / Geography' }),
    ).toHaveAttribute('id', 'travel-geography');
  });

  it('renders section navigation and self-links for the real about markdown', () => {
    const sectionTitles = getActualSectionTitles(aboutMarkdown);
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);
    const nav = screen.getByRole('navigation', { name: 'About sections' });

    expect(within(nav).getAllByRole('link')).toHaveLength(sectionTitles.length);

    for (const title of sectionTitles) {
      const headingId = createHeadingId(title);
      const heading = screen.getByRole('heading', { name: title });

      expect(heading).toHaveAttribute('id', headingId);
      expect(within(nav).getByRole('link', { name: title })).toHaveAttribute(
        'href',
        `#${headingId}`,
      );
      expect(
        container.querySelector(`h2#${headingId} > a[href="#${headingId}"]`),
      ).toBeTruthy();
    }
  });

  it('renders matching hash links and heading ids into static markup', () => {
    const html = renderToStaticMarkup(
      <AboutContent markdown={aboutMarkdown} />,
    );

    expect(html).toContain('href="#some-history"');
    expect(html).toContain('id="some-history"');
    expect(html).toContain('href="#travel-geography"');
    expect(html).toContain('id="travel-geography"');
  });

  it('renders only the history markers stated by the prose', () => {
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);
    const history = container.querySelector('.about-section--log');
    const entries = Array.from(
      history?.querySelectorAll('.log-entry') ?? [],
    ) as HTMLElement[];

    expect(entries).toHaveLength(15);
    expect(
      entries.map((entry) => ({
        year: entry.querySelector('.log-entry-year')?.textContent ?? null,
        age: entry.querySelector('.log-entry-age')?.textContent ?? null,
      })),
    ).toEqual([
      { year: '1993', age: 'Age 3' },
      { year: '1995', age: null },
      { year: '1996', age: null },
      { year: null, age: 'Age 7' },
      { year: null, age: 'Age 8' },
      { year: null, age: 'Age 10' },
      { year: null, age: 'Age 11' },
      { year: null, age: 'Age 12' },
      { year: null, age: 'Age 13' },
      { year: null, age: 'Age 14' },
      { year: null, age: 'Age 14–17' },
      { year: null, age: 'Age 16' },
      { year: null, age: 'Age 18' },
      { year: null, age: 'Age 19' },
      { year: null, age: 'Age 20' },
    ]);

    // Embedded markers remain in the prose, including meaningful qualifiers.
    expect(entries[0].querySelector('.log-entry-body')?.textContent).toContain(
      'a computer in my bedroom in 1993',
    );
    expect(entries[2].querySelector('.log-entry-body')?.textContent).toContain(
      'In the summer of 1996',
    );

    // A leading marker is lifted out instead, leaving a sentence behind.
    expect(entries[3].querySelector('.log-entry-body')?.textContent).toMatch(
      /^I discovered the mini-games/,
    );
  });

  it('leaves an undated entry an empty gutter rather than a broken marker', () => {
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);
    const markers = Array.from(
      container.querySelectorAll('.about-section--log .log-entry-marker'),
    );
    const empty = markers.filter((marker) => marker.textContent === '');

    expect(markers).toHaveLength(26);
    expect(empty).toHaveLength(3);

    for (const marker of empty) {
      expect(marker.querySelector('.log-entry-year')).toBeNull();
    }
  });

  it('routes the internal link the real prose carries, and leaves the rest native', () => {
    render(<AboutContent markdown={aboutMarkdown} />);

    // `- [Good design](/).` in `src/data/about.ts`, which shipped as a native
    // anchor and reloaded the document from a fully client-routed page.
    const internal = screen.getByRole('link', { name: 'Good design' });

    expect(internal).toHaveAttribute('data-router-link', 'true');
    expect(internal).toHaveAttribute('href', '/');
    // No opt-out class: `.about-content a` is what underlines a prose link.
    expect(internal).not.toHaveAttribute('class');

    const external = screen.getByRole('link', { name: 'OpenAI' });

    expect(external).not.toHaveAttribute('data-router-link');
    expect(external).toHaveAttribute('href', 'https://openai.com');
  });

  it('routes internal links from the intro, a log section, and a plain section', () => {
    render(
      <AboutContent
        markdown={`# Intro

Start at the [home page](/).

# Some History

- At 10, I built a [terrible site](/projects) with FrontPage.

# I Like

- [Good design](/).
- [Books](https://www.goodreads.com/mdangelo).`}
      />,
    );

    const routed: [string, string][] = [
      ['home page', '/'],
      ['terrible site', '/projects/'],
      ['Good design', '/'],
    ];

    for (const [name, href] of routed) {
      const link = screen.getByRole('link', { name });

      expect(link, name).toHaveAttribute('data-router-link', 'true');
      expect(link, name).toHaveAttribute('href', href);
    }

    expect(screen.getByRole('link', { name: 'Books' })).not.toHaveAttribute(
      'data-router-link',
    );
  });

  it('supports same-page hash navigation from section links', async () => {
    window.history.replaceState({}, '', '/about/');

    render(<AboutContent markdown={aboutMarkdown} />);

    const nav = screen.getByRole('navigation', { name: 'About sections' });
    const navLink = within(nav).getByRole('link', {
      name: 'Travel / Geography',
    });

    navLink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#travel-geography');
    });
    expect(document.querySelector(window.location.hash)).toHaveTextContent(
      'Travel / Geography',
    );

    const heading = screen.getByRole('heading', { name: 'Fun Facts' });
    const permalink = within(heading).getByRole('link', {
      name: 'Fun Facts',
    });

    permalink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#fun-facts');
    });
    expect(document.querySelector(window.location.hash)).toHaveTextContent(
      'Fun Facts',
    );
  });
});
