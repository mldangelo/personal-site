import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SMOOTH_SCROLL_ATTRIBUTE } from '@/lib/smoothScroll';
import useActiveSection from '../useActiveSection';

/**
 * jsdom lays nothing out, so the page is described here and read back through
 * the same calls the hook makes: `getBoundingClientRect`, `scrollY`,
 * `innerHeight`, and the document's `scrollHeight`.
 *
 * The default page is the résumé's shape at 1440x900: a 64px header, a 46px
 * bar stuck under it, sections that a fragment jump parks 160px down, and a
 * last section the document is too short to bring up to that line.
 */
const RESUME = {
  experience: 500,
  education: 3800,
  skills: 4100,
  courses: 5020,
  references: 5500,
} as const;

const RESUME_IDS = Object.keys(RESUME);

interface Page {
  /** Document offset of each section's top edge. */
  tops: Record<string, number>;
  scrollY: number;
  innerHeight: number;
  scrollHeight: number;
  barHeight: number;
  /** How far a scroll lock has pulled `<body>` up, with `scrollY` back at 0. */
  lockedAt: number;
}

let page: Page;
let frames: FrameRequestCallback[];

/** Run the frames the hook has asked for, as one painted frame would. */
function paint() {
  act(() => {
    for (const frame of frames.splice(0)) {
      // A cancelled frame leaves a hole.
      frame?.(0);
    }
  });
}

/** Scroll the page the way a browser reports it: events first, then a frame. */
function scrollTo(y: number, events = 1) {
  page.scrollY = y;

  for (let i = 0; i < events; i += 1) {
    fireEvent.scroll(window);
  }

  paint();
}

function maxScroll() {
  return page.scrollHeight - page.innerHeight;
}

function Subject({
  ids = RESUME_IDS,
  scrollMargin = 160,
  hidden = [],
}: {
  ids?: readonly string[];
  scrollMargin?: number;
  hidden?: readonly string[];
}) {
  const { activeId, navRef, onLinkClick } = useActiveSection(ids);

  return (
    <>
      <nav ref={navRef} data-bar style={{ top: 64 }}>
        <div data-row>
          {ids.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeId === id ? 'location' : undefined}
              onClick={onLinkClick}
            >
              {id}
            </a>
          ))}
        </div>
      </nav>
      {Object.keys(page.tops).map((id) => (
        <section
          key={id}
          id={id}
          data-hidden={hidden.includes(id) || undefined}
          style={{ scrollMarginTop: scrollMargin }}
        />
      ))}
    </>
  );
}

/** What the nav marks as the reader's place. */
function current() {
  return screen.queryByRole('link', { current: 'location' })?.textContent;
}

function link(id: string) {
  return screen.getByRole('link', { name: id });
}

function rect(top: number, height: number, left = 0, width = 800): DOMRect {
  return {
    top,
    bottom: top + height,
    left,
    right: left + width,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  };
}

const original = {
  scrollY: Object.getOwnPropertyDescriptor(window, 'scrollY'),
  innerHeight: Object.getOwnPropertyDescriptor(window, 'innerHeight'),
};

beforeEach(() => {
  page = {
    tops: { ...RESUME },
    scrollY: 0,
    innerHeight: 900,
    scrollHeight: 5900,
    barHeight: 46,
    lockedAt: 0,
  };
  frames = [];

  window.history.replaceState({}, '', '/resume/');

  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    get: () => page.scrollY,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    get: () => page.innerHeight,
  });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    get: () => page.scrollHeight,
  });

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => frames.push(callback)),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((handle: number) => {
      delete frames[handle - 1];
    }),
  );

  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: Element) {
      if (this.hasAttribute('data-bar')) {
        return rect(64, page.barHeight);
      }

      if (this.id in page.tops && !this.hasAttribute('data-hidden')) {
        return rect(page.tops[this.id] - page.scrollY - page.lockedAt, 300);
      }

      // Everything else, like an element under `display: none`, has no box.
      return rect(0, 0, 0, 0);
    },
  );
});

afterEach(() => {
  // A click in a test arms smooth scrolling; let it go before the next one.
  fireEvent(window, new Event('scrollend'));

  vi.restoreAllMocks();
  vi.unstubAllGlobals();

  if (original.scrollY) {
    Object.defineProperty(window, 'scrollY', original.scrollY);
  }
  if (original.innerHeight) {
    Object.defineProperty(window, 'innerHeight', original.innerHeight);
  }
  Reflect.deleteProperty(document.documentElement, 'scrollHeight');
});

describe('useActiveSection', () => {
  it('marks the first section in the server markup', () => {
    const html = renderToStaticMarkup(<Subject />);

    expect(html).toContain('<a href="#experience" aria-current="location">');
    expect(html.match(/aria-current/g)).toHaveLength(1);
  });

  it('keeps the first section current until another reaches the line', () => {
    render(<Subject />);

    expect(current()).toBe('experience');

    // Education is 200px below where a jump would park it.
    scrollTo(3440);
    expect(current()).toBe('experience');
  });

  it('follows the reader through every section in order', () => {
    render(<Subject />);

    const trail: (string | null | undefined)[] = [];

    for (let y = 0; y <= maxScroll(); y += 100) {
      scrollTo(y);

      if (trail.at(-1) !== current()) {
        trail.push(current());
      }
    }

    expect(trail).toEqual(RESUME_IDS);
  });

  it('makes a section current where a fragment jump parks it', () => {
    render(<Subject />);

    // `scroll-margin-top` is 160px, so `#skills` lands with its top there —
    // 50px under the bar. Measuring from the bar alone would leave "education"
    // lit after a click on "skills".
    scrollTo(RESUME.skills - 160);

    expect(current()).toBe('skills');
  });

  it('measures the line from the sticky bar when that is lower', () => {
    page.tops = { first: 2000, second: 4000 };

    render(<Subject ids={['first', 'second']} scrollMargin={0} />);

    // The bar sticks at 64px and is 46px tall. A section 150px down the
    // viewport is still clear of it...
    scrollTo(4000 - 150);
    expect(current()).toBe('first');

    // ...until the bar is two rows tall and reaches past it.
    page.barHeight = 90;
    fireEvent(window, new Event('resize'));
    paint();
    expect(current()).toBe('second');
  });

  it('makes the last section current at the bottom of the document', () => {
    render(<Subject />);

    // The page ends with "references" 500px down the viewport. It can never
    // be scrolled up to the line, which is why it never lit.
    scrollTo(maxScroll() - 40);
    expect(current()).toBe('courses');

    scrollTo(maxScroll());
    expect(current()).toBe('references');
  });

  it('counts a fractional offset a pixel short as the bottom', () => {
    render(<Subject />);

    scrollTo(maxScroll() - 1.5);

    expect(current()).toBe('references');
  });

  it('follows an instant jump, in either direction', () => {
    render(<Subject />);

    scrollTo(maxScroll());
    expect(current()).toBe('references');

    // The observer this replaced only saw what crossed its band, so a jump
    // straight back to the top left the previous section lit.
    scrollTo(0);
    expect(current()).toBe('experience');

    scrollTo(RESUME.skills);
    expect(current()).toBe('skills');
  });

  it('is right as soon as it mounts part-way down the page', () => {
    page.scrollY = RESUME.education;

    render(<Subject />);

    expect(current()).toBe('education');
    expect(frames).toHaveLength(0);
  });

  it('skips ids with no element, and elements with no box', () => {
    render(
      <Subject
        ids={['summary', ...RESUME_IDS, 'appendix']}
        hidden={['skills']}
      />,
    );

    // Nothing has reached the line, so the first id stands even though no
    // element carries it.
    expect(current()).toBe('summary');

    scrollTo(RESUME.education);
    expect(current()).toBe('education');

    // "skills" is in the document but not rendered: it cannot be scrolled to.
    scrollTo(RESUME.skills + 200);
    expect(current()).toBe('education');

    // And the bottom belongs to the last section that is actually there.
    scrollTo(maxScroll());
    expect(current()).toBe('references');
  });

  it('gives every section a turn when a tall window strands several', () => {
    // At 1080px high the document can no longer bring "courses" to the line
    // either. With only a bottom rule it would never light: the nav would go
    // from "skills" straight to "references".
    page.innerHeight = 1080;

    render(<Subject />);

    const trail: (string | null | undefined)[] = [];

    for (let y = RESUME.skills; y <= maxScroll(); y += 20) {
      scrollTo(y);

      if (trail.at(-1) !== current()) {
        trail.push(current());
      }
    }

    expect(trail).toEqual(['skills', 'courses', 'references']);

    scrollTo(maxScroll() - 40);
    expect(current()).toBe('courses');
  });

  describe('when the reader asks for a section by name', () => {
    beforeEach(() => {
      // Tall enough that "courses" and "references" both park at the bottom.
      page.innerHeight = 1080;
    });

    it('lights the section a link jumped to, not the last one', () => {
      render(<Subject />);

      fireEvent.click(link('courses'));
      scrollTo(maxScroll());

      expect(current()).toBe('courses');
    });

    it('lights it even when the jump had nowhere to scroll', () => {
      page.scrollY = maxScroll();

      render(<Subject />);
      expect(current()).toBe('references');

      // Already at the bottom: no scroll event will follow this click.
      fireEvent.click(link('courses'));
      paint();

      expect(current()).toBe('courses');
    });

    it('gives the bottom back to the last section once the reader moves on', () => {
      render(<Subject />);

      fireEvent.click(link('courses'));
      scrollTo(maxScroll());
      expect(current()).toBe('courses');

      scrollTo(maxScroll() - 600);
      expect(current()).toBe('skills');

      scrollTo(maxScroll());
      expect(current()).toBe('references');
    });

    it('does not drop a new request while the page is still travelling', () => {
      render(<Subject />);

      fireEvent.click(link('education'));
      scrollTo(RESUME.education - 160);
      expect(current()).toBe('education');

      // Asked for while the page still rests on the previous request. The
      // frames on the way down are not where either jump parks.
      fireEvent.click(link('courses'));
      scrollTo(4300);
      scrollTo(4700);
      scrollTo(maxScroll());

      expect(current()).toBe('courses');
    });

    it('reads the fragment the page was opened with', () => {
      window.history.replaceState({}, '', '/resume/#courses');
      page.scrollY = maxScroll();

      render(<Subject />);

      expect(current()).toBe('courses');
    });

    it('follows the fragment when Back or a heading link changes it', () => {
      page.scrollY = maxScroll();

      render(<Subject />);
      expect(current()).toBe('references');

      window.history.replaceState({}, '', '/resume/#courses');
      fireEvent(window, new HashChangeEvent('hashchange'));
      paint();

      expect(current()).toBe('courses');
    });

    it('ignores a fragment that names something else', () => {
      window.history.replaceState({}, '', '/resume/#main-content');
      page.scrollY = maxScroll();

      render(<Subject />);

      expect(current()).toBe('references');
    });

    it('leaves the page alone on a modified click', () => {
      page.scrollY = maxScroll();

      render(<Subject />);

      // Opens the section in another tab; this one has not gone anywhere.
      fireEvent.click(link('courses'), { metaKey: true });
      paint();

      expect(current()).toBe('references');
      expect(document.documentElement).not.toHaveAttribute(
        SMOOTH_SCROLL_ATTRIBUTE,
      );
    });
  });

  it('has nothing to track without sections', () => {
    const listen = vi.spyOn(window, 'addEventListener');

    render(<Subject ids={[]} />);

    expect(current()).toBeUndefined();
    expect(listen).not.toHaveBeenCalled();
  });

  it('arms smooth scrolling on a click and leaves the jump to the browser', () => {
    render(<Subject />);

    const notPrevented = fireEvent.click(link('skills'));

    expect(notPrevented).toBe(true);
    expect(document.documentElement).toHaveAttribute(SMOOTH_SCROLL_ATTRIBUTE);
  });

  it('keeps its reading while the mobile menu locks scrolling', () => {
    page.scrollY = RESUME.skills;

    render(<Subject />);
    expect(current()).toBe('skills');

    // The menu fixes <body> at `top: -scrollY`. Nothing moves on screen, but
    // `scrollY` reads 0 and the document is one screen tall until it closes.
    const { scrollHeight, scrollY } = page;
    page.lockedAt = scrollY;
    page.scrollHeight = page.innerHeight;
    scrollTo(0);
    expect(current()).toBe('skills');

    page.lockedAt = 0;
    page.scrollHeight = scrollHeight;
    scrollTo(scrollY);
    expect(current()).toBe('skills');
  });

  it('reads the page once per frame however many scroll events arrive', () => {
    render(<Subject />);

    const measured = vi.mocked(Element.prototype.getBoundingClientRect);
    measured.mockClear();

    page.scrollY = RESUME.education;
    for (let i = 0; i < 20; i += 1) {
      fireEvent.scroll(window);
    }

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(measured).not.toHaveBeenCalled();
    expect(current()).toBe('experience');

    paint();

    // The bar and the five sections, once each.
    expect(measured).toHaveBeenCalledTimes(1 + RESUME_IDS.length);
    expect(current()).toBe('education');
  });

  it('listens for scrolling passively', () => {
    const listen = vi.spyOn(window, 'addEventListener');

    render(<Subject />);

    expect(listen).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    });
  });

  it('does not start over when given a new array of the same ids', () => {
    const listen = vi.spyOn(window, 'addEventListener');
    const { rerender } = render(<Subject ids={[...RESUME_IDS]} />);
    const subscriptions = listen.mock.calls.length;

    scrollTo(RESUME.skills);
    rerender(<Subject ids={[...RESUME_IDS]} />);

    expect(listen.mock.calls).toHaveLength(subscriptions);
    expect(current()).toBe('skills');
  });

  it('removes every listener and cancels a pending frame on unmount', () => {
    const listen = vi.spyOn(window, 'addEventListener');
    const unlisten = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Subject />);
    const added = listen.mock.calls.map(([type, listener]) => [type, listener]);

    fireEvent.scroll(window);
    expect(frames.filter(Boolean)).toHaveLength(1);

    unmount();

    expect(added.map(([type]) => type).sort()).toEqual([
      'hashchange',
      'resize',
      'scroll',
    ]);
    for (const [type, listener] of added) {
      expect(unlisten).toHaveBeenCalledWith(type, listener);
    }
    expect(frames.filter(Boolean)).toHaveLength(0);

    fireEvent.scroll(window);
    expect(frames.filter(Boolean)).toHaveLength(0);
  });

  describe('the row of links', () => {
    /**
     * A 358px row, 32px of each edge spoken for by its fades, holding links
     * that run to 399px. `scrollLeft` is the only thing the hook may move.
     */
    function layOutRow(links: Record<string, [left: number, right: number]>) {
      const row = document.querySelector<HTMLElement>('[data-row]');

      if (!row) {
        throw new Error('The row has not been rendered');
      }

      row.style.scrollPaddingLeft = '32px';
      row.style.scrollPaddingRight = '32px';
      Object.defineProperty(row, 'scrollWidth', {
        configurable: true,
        value: 399,
      });
      Object.defineProperty(row, 'clientWidth', {
        configurable: true,
        value: 358,
      });

      const measure = vi.mocked(Element.prototype.getBoundingClientRect);
      const sections = measure.getMockImplementation();

      measure.mockImplementation(function (this: Element) {
        if (this === row) {
          return rect(64, 44, 16, 358);
        }

        const edges = links[this.textContent ?? ''];

        if (this.tagName === 'A' && edges) {
          return rect(64, 44, edges[0], edges[1] - edges[0]);
        }

        return sections?.call(this) ?? rect(0, 0, 0, 0);
      });

      return row;
    }

    it('scrolls sideways to bring the current link clear of the right fade', () => {
      render(<Subject />);

      // "references" runs 41px past the point the fade begins.
      const row = layOutRow({ references: [296, 383] });

      scrollTo(maxScroll());

      expect(current()).toBe('references');
      expect(row.scrollLeft).toBe(41);
    });

    it('scrolls back when the current link is off the left edge', () => {
      page.scrollY = maxScroll();

      render(<Subject />);

      const row = layOutRow({ experience: [-25, 61] });
      row.scrollLeft = 100;

      scrollTo(0);

      expect(current()).toBe('experience');
      expect(row.scrollLeft).toBe(27);
    });

    it('leaves the row alone while the current link is in view', () => {
      render(<Subject />);

      const row = layOutRow({ education: [102, 180] });
      row.scrollLeft = 12;

      scrollTo(RESUME.education);

      expect(current()).toBe('education');
      expect(row.scrollLeft).toBe(12);
    });

    it('does nothing to a row that fits', () => {
      render(<Subject />);

      const row = layOutRow({ references: [296, 383] });
      Object.defineProperty(row, 'scrollWidth', {
        configurable: true,
        value: 358,
      });

      scrollTo(maxScroll());

      expect(row.scrollLeft).toBe(0);
    });

    it('brings a link focused from the keyboard out from under the fade', () => {
      render(<Subject />);

      // Chromium only scrolls a focused link into view when none of it shows.
      const row = layOutRow({ references: [296, 383] });

      fireEvent.keyDown(document.body, { key: 'Tab' });
      act(() => link('references').focus());

      expect(row.scrollLeft).toBe(41);
    });

    it('holds the row still under a mouse press, which focuses the link too', () => {
      render(<Subject />);

      // Moving the row between press and release would slide the link out
      // from under the pointer, and the click would land on its neighbour.
      const row = layOutRow({ references: [296, 383] });

      fireEvent.mouseDown(link('references'));
      act(() => link('references').focus());

      expect(row.scrollLeft).toBe(0);
    });

    it('reports how far the row has scrolled, for its leading fade', () => {
      render(<Subject />);

      const row = layOutRow({});

      row.scrollLeft = 12;
      fireEvent.scroll(row);
      expect(row.style.getPropertyValue('--scrolled')).toBe('12px');

      row.scrollLeft = 0;
      fireEvent.scroll(row);
      expect(row.style.getPropertyValue('--scrolled')).toBe('0px');
    });
  });
});
