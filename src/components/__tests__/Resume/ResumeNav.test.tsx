import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SMOOTH_SCROLL_ATTRIBUTE } from '@/lib/smoothScroll';
import ResumeNav from '../../Resume/ResumeNav';

const SECTIONS = ['Experience', 'Education', 'Skills', 'Courses', 'References'];

/** The link the nav marks as the reader's place, by its label. */
function current() {
  return screen.getByRole('link', { current: 'location' }).textContent;
}

/**
 * Stand the résumé's five sections up as a 5900px document in a 900px window,
 * each section where a 1440x900 browser measured it. jsdom lays nothing out,
 * so the nav reads these the way it reads a real page.
 */
function layOutResume() {
  const tops: Record<string, number> = {
    experience: 500,
    education: 3800,
    skills: 4100,
    courses: 5020,
    references: 5500,
  };
  const page = { scrollY: 0 };

  for (const id of Object.keys(tops)) {
    const section = document.createElement('section');
    section.id = id;
    section.style.scrollMarginTop = '160px';
    document.body.append(section);
  }

  vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => page.scrollY);
  vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(900);
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(
    5900,
  );
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: Element) {
      const top = this.id in tops ? tops[this.id] - page.scrollY : 0;
      const height = this.id in tops ? 300 : 0;

      return {
        top,
        bottom: top + height,
        left: 0,
        right: 800,
        width: height === 0 ? 0 : 800,
        height,
        x: 0,
        y: top,
        toJSON: () => ({}),
      };
    },
  );

  return {
    scrollTo(y: number) {
      page.scrollY = y;
      fireEvent.scroll(window);
    },
    bottom: 5900 - 900,
  };
}

afterEach(() => {
  // A click arms smooth scrolling; let it go before the next test.
  fireEvent(window, new Event('scrollend'));
  vi.restoreAllMocks();

  for (const section of document.querySelectorAll('body > section')) {
    section.remove();
  }
});

describe('ResumeNav', () => {
  it('renders a navigation landmark named for what it indexes', () => {
    render(<ResumeNav />);

    expect(
      screen.getByRole('navigation', { name: 'Resume sections' }),
    ).toHaveClass('resume-nav');
  });

  it('links to every resume section, in page order', () => {
    render(<ResumeNav />);

    expect(
      screen
        .getAllByRole('link')
        .map((link) => [link.textContent, link.getAttribute('href')]),
    ).toEqual(SECTIONS.map((name) => [name, `#${name.toLowerCase()}`]));
  });

  it('marks the first section as the current one before any scrolling', () => {
    render(<ResumeNav />);

    const experience = screen.getByRole('link', { name: 'Experience' });

    expect(experience).toHaveAttribute('aria-current', 'location');
    expect(experience).toHaveClass('resume-nav-link', 'active');
    expect(document.querySelectorAll('.resume-nav-link.active')).toHaveLength(
      1,
    );
  });

  it('ships that mark in the static markup', () => {
    const html = renderToStaticMarkup(<ResumeNav />);

    expect(html).toContain(
      '<a href="#experience" class="resume-nav-link active" aria-current="location">Experience</a>',
    );
    expect(html.match(/aria-current/g)).toHaveLength(1);
  });

  it('holds the links in a row of their own inside the bar', () => {
    render(<ResumeNav />);

    const bar = screen.getByRole('navigation');
    const rows = new Set(
      screen.getAllByRole('link').map((link) => link.parentElement),
    );

    // The bar is opaque and sticky; the row is what scrolls and fades. On one
    // element, the fade would let the page show through the bar.
    expect(rows.size).toBe(1);
    expect([...rows][0]).toHaveClass('resume-nav-row');
    expect([...rows][0]?.parentElement).toBe(bar);
  });

  it('tells the row how far it has scrolled, for its leading fade', () => {
    render(<ResumeNav />);

    const row = screen.getByRole('link', { name: 'Skills' }).parentElement;

    if (!row) {
      throw new Error('The links have no row');
    }

    // The bar has to be the one the hook is listening on for this to arrive.
    row.scrollLeft = 41;
    fireEvent.scroll(row);

    expect(row.style.getPropertyValue('--scrolled')).toBe('41px');
  });

  it('follows the reader down the page', async () => {
    const page = layOutResume();

    render(<ResumeNav />);
    expect(current()).toBe('Experience');

    page.scrollTo(4100);
    await waitFor(() => expect(current()).toBe('Skills'));

    page.scrollTo(4900);
    await waitFor(() => expect(current()).toBe('Courses'));
  });

  it('reaches "References", which the page cannot scroll up to the line', async () => {
    const page = layOutResume();

    render(<ResumeNav />);

    // The section sits 500px down the last screen. Watching a band near the
    // top of the viewport, the nav used to end the page still on "Courses".
    page.scrollTo(page.bottom);
    await waitFor(() => expect(current()).toBe('References'));
  });

  it('goes back to "Experience" after an instant jump to the top', async () => {
    const page = layOutResume();

    render(<ResumeNav />);

    page.scrollTo(page.bottom);
    await waitFor(() => expect(current()).toBe('References'));

    page.scrollTo(0);
    await waitFor(() => expect(current()).toBe('Experience'));
  });

  it('arms smooth scrolling for a click and leaves the jump to the browser', async () => {
    window.history.replaceState({}, '', '/resume/');
    render(<ResumeNav />);

    const notPrevented = fireEvent.click(
      screen.getByRole('link', { name: 'Skills' }),
    );

    // Not prevented: the fragment jump keeps its history entry and focus.
    expect(notPrevented).toBe(true);
    expect(document.documentElement).toHaveAttribute(SMOOTH_SCROLL_ATTRIBUTE);
    await waitFor(() => expect(window.location.hash).toBe('#skills'));
  });
});
