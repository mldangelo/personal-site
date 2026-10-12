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

  describe('section nav', () => {
    const titles = getActualSectionTitles(aboutMarkdown);
    const SMOOTH = 'data-smooth-scroll';

    function sectionNav() {
      return screen.getByRole('navigation', { name: 'About sections' });
    }

    /** The label the nav marks as the reader's place. */
    function current() {
      return within(sectionNav()).getByRole('link', { current: 'location' })
        .textContent;
    }

    /**
     * jsdom lays nothing out, so stand the headings up 1000px apart in an
     * 800px window. The document ends 400px after the last one, which leaves
     * that heading half-way down the final screen: it can never be scrolled to
     * the top, exactly like the real page's last section.
     */
    function layOutHeadings() {
      const tops = new Map(
        titles.map((title, index) => [
          createHeadingId(title),
          (index + 1) * 1000,
        ]),
      );
      const page = { scrollY: 0 };
      const measure = Element.prototype.getBoundingClientRect;
      const windowScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');
      const windowHeight = Object.getOwnPropertyDescriptor(
        window,
        'innerHeight',
      );
      const scrollHeight = titles.length * 1000 + 400;

      Element.prototype.getBoundingClientRect = function (this: Element) {
        const top = (tops.get(this.id) ?? 0) - page.scrollY;
        const height = tops.has(this.id) ? 40 : 0;

        return {
          top,
          bottom: top + height,
          left: 0,
          right: 640,
          width: height === 0 ? 0 : 640,
          height,
          x: 0,
          y: top,
          toJSON: () => ({}),
        };
      };
      Object.defineProperty(window, 'scrollY', {
        configurable: true,
        get: () => page.scrollY,
      });
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: 800,
      });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        configurable: true,
        value: scrollHeight,
      });

      return {
        bottom: scrollHeight - 800,
        scrollTo(y: number) {
          page.scrollY = y;
          window.dispatchEvent(new Event('scroll'));
        },
        restore() {
          Element.prototype.getBoundingClientRect = measure;
          Reflect.deleteProperty(document.documentElement, 'scrollHeight');
          if (windowScrollY) {
            Object.defineProperty(window, 'scrollY', windowScrollY);
          }
          if (windowHeight) {
            Object.defineProperty(window, 'innerHeight', windowHeight);
          }
        },
      };
    }

    it('marks the first section as the current one before any scrolling', () => {
      render(<AboutContent markdown={aboutMarkdown} />);

      const links = within(sectionNav()).getAllByRole('link');

      expect(current()).toBe(titles[0]);
      expect(links[0]).toHaveClass('about-section-nav-link', 'active');
      expect(
        links.filter((link) => link.hasAttribute('aria-current')),
      ).toHaveLength(1);
      expect(
        links.filter((link) => link.classList.contains('active')),
      ).toHaveLength(1);
    });

    it('moves the mark as the reader scrolls, down to the last section', async () => {
      const page = layOutHeadings();

      try {
        render(<AboutContent markdown={aboutMarkdown} />);

        page.scrollTo(3000);
        await waitFor(() => expect(current()).toBe(titles[2]));

        // The last heading is still 400px down the screen here.
        page.scrollTo(page.bottom);
        await waitFor(() => expect(current()).toBe(titles.at(-1)));

        page.scrollTo(0);
        await waitFor(() => expect(current()).toBe(titles[0]));
      } finally {
        page.restore();
      }
    });

    it('holds the links in a row of their own inside the bar', () => {
      render(<AboutContent markdown={aboutMarkdown} />);

      const rows = new Set(
        within(sectionNav())
          .getAllByRole('link')
          .map((link) => link.parentElement),
      );

      // The bar is opaque and sticky; the row is what scrolls and fades.
      expect(rows.size).toBe(1);
      expect([...rows][0]).toHaveClass('about-section-nav-row');
      expect([...rows][0]?.parentElement).toBe(sectionNav());
    });

    it('scrolls smoothly from the nav, and not from a heading link', () => {
      window.history.replaceState({}, '', '/about/');
      // Let go of anything an earlier click in this file left armed.
      window.dispatchEvent(new Event('scrollend'));

      render(<AboutContent markdown={aboutMarkdown} />);

      // A heading's own link is for copying its address. Only the nav asks
      // for the animated jump.
      within(screen.getByRole('heading', { name: titles[1] }))
        .getByRole('link')
        .click();
      expect(document.documentElement).not.toHaveAttribute(SMOOTH);

      within(sectionNav()).getByRole('link', { name: titles[1] }).click();
      expect(document.documentElement).toHaveAttribute(SMOOTH);

      window.dispatchEvent(new Event('scrollend'));
      expect(document.documentElement).not.toHaveAttribute(SMOOTH);
    });
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
