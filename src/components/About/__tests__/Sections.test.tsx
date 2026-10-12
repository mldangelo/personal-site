import { render, screen, waitFor, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import { createHeadingId } from '@/lib/anchors';
import AboutContent from '../Sections';

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

# Some history

- Built a thing.`}
      />,
    );

    expect(screen.getByText('Hello from the intro.')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Intro' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Some history' }),
    ).toBeInTheDocument();
  });

  it('assigns section variants for compact and links sections', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# I like

- Running

# Websites from people I admire

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

# Some history

- Built a thing.

# Travel / geography

- Went somewhere.`}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Some history' }),
    ).toHaveAttribute('id', 'some-history');
    expect(
      screen.getByRole('heading', { name: 'Travel / geography' }),
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
    for (const index of [0, 1, 2]) {
      expect(entries[index].querySelector('.log-entry-marker')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    }

    // A leading marker is lifted out instead, leaving a sentence behind.
    expect(entries[3].querySelector('.log-entry-body')?.textContent).toMatch(
      /^I discovered the mini-games/,
    );
    expect(entries[3].querySelector('.log-entry-marker')).not.toHaveAttribute(
      'aria-hidden',
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

  it('supports same-page hash navigation from section links', async () => {
    window.history.replaceState({}, '', '/about/');

    render(<AboutContent markdown={aboutMarkdown} />);

    const nav = screen.getByRole('navigation', { name: 'About sections' });
    const navLink = within(nav).getByRole('link', {
      name: 'Travel / geography',
    });

    navLink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#travel-geography');
    });
    expect(document.querySelector(window.location.hash)).toHaveTextContent(
      'Travel / geography',
    );

    const heading = screen.getByRole('heading', { name: 'Fun facts' });
    const permalink = within(heading).getByRole('link', {
      name: 'Fun facts',
    });

    permalink.click();

    await waitFor(() => {
      expect(window.location.hash).toBe('#fun-facts');
    });
    expect(document.querySelector(window.location.hash)).toHaveTextContent(
      'Fun facts',
    );
  });

  it('matches every real section to its layout, by its title as authored', () => {
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);

    // A heading renamed in the data without its `sectionVariants` key shows
    // up here as a bare `about-section`. The ids are the public deep links.
    expect(
      Array.from(container.querySelectorAll('.about-section'), (section) => [
        section.querySelector('h2')?.id,
        section.className,
      ]),
    ).toEqual([
      ['some-history', 'about-section about-section--log'],
      ['i-like', 'about-section about-section--compact'],
      ['travel-geography', 'about-section about-section--log'],
      ['fun-facts', 'about-section about-section--compact'],
      ['i-dream-of', 'about-section about-section--compact'],
      ['websites-from-people-i-admire', 'about-section about-section--links'],
    ]);
  });

  it('leaves a section whose title names no layout as a plain list', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# I Like

- Running`}
      />,
    );

    // Matching is exact, so the title-case form of a known heading is unknown.
    expect(container.querySelector('.about-section')?.className).toBe(
      'about-section',
    );
  });

  it('opens every section with the shared section header', () => {
    const titles = getActualSectionTitles(aboutMarkdown);
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);
    const sections = Array.from(container.querySelectorAll('.about-section'));

    expect(sections).toHaveLength(titles.length);

    for (const [index, section] of sections.entries()) {
      const header = section.firstElementChild;
      const heading = header?.firstElementChild;
      const link = heading?.firstElementChild;

      expect(header).toHaveClass('section-header');
      expect(heading).toBe(
        screen.getByRole('heading', { level: 2, name: titles[index] }),
      );
      expect(heading).toHaveClass('section-heading');
      // The fragment lands on the heading itself, not on the header around it:
      // the heading is the element the stylesheet gives a scroll margin.
      expect(document.getElementById(heading?.id ?? '')).toBe(heading);

      // The mark follows the title with no space between them, which is what
      // keeps it from wrapping onto a line of its own.
      expect(link?.firstChild?.textContent).toBe(titles[index]);
      expect(link?.textContent).toBe(`${titles[index]}#`);
    }
  });
});
