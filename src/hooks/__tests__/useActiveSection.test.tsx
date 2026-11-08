import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SMOOTH_SCROLL_ATTRIBUTE } from '@/lib/smoothScroll';
import useActiveSection from '../useActiveSection';

/**
 * jsdom lays nothing out, so the page is described here and read back through
 * the calls the hook makes. The default is the résumé at 1440x900: a 64px
 * header, a 46px bar stuck under it, sections a fragment jump parks 160px down,
 * and a last section the document is too short to bring up to that line.
 */
const RESUME = {
  experience: 500,
  education: 3800,
  skills: 4100,
  courses: 5020,
  references: 5500,
} as const;

const RESUME_IDS = Object.keys(RESUME);

const freshPage = () => ({
  tops: { ...RESUME } as Record<string, number>,
  scrollY: 0,
  innerHeight: 900,
  scrollHeight: 5900,
  barHeight: 46,
  /** How far a scroll lock has pulled `<body>` up, with `scrollY` back at 0. */
  lockedAt: 0,
  /** Where the row's links sit: 16px in, 358px wide, 32px each edge faded. */
  links: {} as Record<string, readonly [left: number, right: number]>,
});

let page = freshPage();
let frames: FrameRequestCallback[];

/** Runs the frames the hook has asked for, as one painted frame would. */
function paint() {
  act(() => {
    for (const frame of frames.splice(0)) {
      // A cancelled frame leaves a hole.
      frame?.(0);
    }
  });
}

function scrollTo(y: number) {
  page.scrollY = y;
  fireEvent.scroll(window);
  paint();
}

const maxScroll = () => page.scrollHeight - page.innerHeight;

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
        <div data-row style={{ scrollPaddingLeft: 32, scrollPaddingRight: 32 }}>
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
const current = () =>
  screen.queryByRole('link', { current: 'location' })?.textContent;

const link = (id: string) => screen.getByRole('link', { name: id });

/** Scrolls from `from` to the bottom, listing each section lit along the way. */
function trail(from: number, step: number) {
  const lit: (string | null | undefined)[] = [];

  for (let y = from; y <= maxScroll(); y += step) {
    scrollTo(y);
    if (lit.at(-1) !== current()) lit.push(current());
  }

  return lit;
}

const rect = (top: number, height: number, left = 0, width = 800) =>
  ({ top, height, left, width, right: left + width }) as DOMRect;

beforeEach(() => {
  page = freshPage();
  frames = [];

  window.history.replaceState({}, '', '/resume/');

  vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => page.scrollY);
  vi.spyOn(window, 'innerHeight', 'get').mockImplementation(
    () => page.innerHeight,
  );
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockImplementation(
    () => page.scrollHeight,
  );
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    frames.push(callback),
  );
  vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
    delete frames[handle - 1];
  });

  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: Element) {
      const edges = page.links[this.textContent ?? ''];

      if (this.hasAttribute('data-bar')) return rect(64, page.barHeight);
      if (this.hasAttribute('data-row')) return rect(64, 44, 16, 358);
      if (this.tagName === 'A' && edges) {
        return rect(64, 44, edges[0], edges[1] - edges[0]);
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
});

describe('useActiveSection', () => {
  it('follows the reader through every section in order', () => {
    render(<Subject />);

    expect(current()).toBe('experience');
    expect(trail(0, 100)).toEqual(RESUME_IDS);
  });

  it('makes a section current where a fragment jump parks it', () => {
    render(<Subject />);

    // `scroll-margin-top` puts `#skills` 50px under the bar. Measuring from the
    // bar alone would leave "education" lit after a click on "skills".
    scrollTo(RESUME.skills - 160);

    expect(current()).toBe('skills');
  });

  it('measures the line from the sticky bar when that is lower', () => {
    page.tops = { first: 2000, second: 4000 };

    render(<Subject ids={['first', 'second']} scrollMargin={0} />);

    // A section 150px down the viewport is clear of a one-row bar...
    scrollTo(4000 - 150);
    expect(current()).toBe('first');

    // ...until the bar wraps to two rows and reaches past it.
    page.barHeight = 90;
    fireEvent(window, new Event('resize'));
    paint();
    expect(current()).toBe('second');
  });

  it('lights the last section at the bottom, which it cannot scroll up to', () => {
    render(<Subject />);

    scrollTo(maxScroll() - 40);
    expect(current()).toBe('courses');

    // Scroll offsets are fractional, so a pixel short still counts.
    scrollTo(maxScroll() - 1.5);
    expect(current()).toBe('references');
  });

  it('gives every section a turn when a tall window strands several', () => {
    // At 1080px high the document cannot bring "courses" to the line either.
    page.innerHeight = 1080;

    render(<Subject />);

    expect(trail(RESUME.skills, 20)).toEqual([
      'skills',
      'courses',
      'references',
    ]);
  });

  it('skips ids with no element, and elements with no box', () => {
    render(
      <Subject
        ids={['summary', ...RESUME_IDS, 'appendix']}
        hidden={['skills']}
      />,
    );

    // Nothing has reached the line, so the first id stands with no element.
    expect(current()).toBe('summary');

    scrollTo(RESUME.skills + 200);
    expect(current()).toBe('education');

    // The bottom belongs to the last section that is actually there.
    scrollTo(maxScroll());
    expect(current()).toBe('references');
  });

  it('reads on mounting part-way down, and holds under a scroll lock', () => {
    page.scrollY = RESUME.skills;

    render(<Subject />);
    expect(current()).toBe('skills');

    // The mobile menu fixes <body> at `top: -scrollY`. Nothing moves on screen,
    // but `scrollY` reads 0 and the document is one screen tall until it closes.
    page.lockedAt = RESUME.skills;
    page.scrollHeight = page.innerHeight;
    scrollTo(0);

    expect(current()).toBe('skills');
  });

  it('stops listening on unmount, and cancels a frame it has pending', () => {
    render(<Subject />).unmount();

    for (const type of ['scroll', 'resize', 'hashchange']) {
      fireEvent(window, new Event(type));
    }
    expect(frames.filter(Boolean)).toHaveLength(0);

    const { unmount } = render(<Subject />);
    fireEvent.scroll(window);
    expect(frames.filter(Boolean)).toHaveLength(1);

    unmount();
    expect(frames.filter(Boolean)).toHaveLength(0);
  });

  describe('when the reader asks for a section by name', () => {
    beforeEach(() => {
      // Tall enough that "courses" and "references" both park at the bottom.
      page.innerHeight = 1080;
    });

    it('lights the section jumped to, until the reader moves on', () => {
      render(<Subject />);

      fireEvent.click(link('courses'));
      scrollTo(maxScroll());
      expect(current()).toBe('courses');

      scrollTo(maxScroll() - 600);
      expect(current()).toBe('skills');

      // The request is used up, so the bottom goes back to the last section.
      scrollTo(maxScroll());
      expect(current()).toBe('references');
    });

    // Already at the bottom, so no scroll event follows either of these.
    it.each([
      ['a click', () => fireEvent.click(link('courses'))],
      [
        'Back or a heading link changing the fragment',
        () => {
          window.history.replaceState({}, '', '/resume/#courses');
          fireEvent(window, new HashChangeEvent('hashchange'));
        },
      ],
    ])(
      'lights the section named by %s, with nowhere to scroll',
      (_how, ask) => {
        page.scrollY = maxScroll();

        render(<Subject />);
        expect(current()).toBe('references');

        ask();
        paint();

        expect(current()).toBe('courses');
      },
    );

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

    it.each([
      ['#courses', 'courses'],
      ['#main-content', 'references'],
    ])('reads the opening fragment %s as %s', (fragment, expected) => {
      window.history.replaceState({}, '', `/resume/${fragment}`);
      page.scrollY = maxScroll();

      render(<Subject />);

      expect(current()).toBe(expected);
    });

    it('arms smooth scrolling on a plain click, leaving the jump to the browser', () => {
      page.scrollY = maxScroll();

      render(<Subject />);

      // A modified click opens another tab; this one has not gone anywhere.
      fireEvent.click(link('courses'), { metaKey: true });
      paint();

      expect(current()).toBe('references');
      expect(document.documentElement).not.toHaveAttribute(
        SMOOTH_SCROLL_ATTRIBUTE,
      );

      const notPrevented = fireEvent.click(link('courses'));

      expect(notPrevented).toBe(true);
      expect(document.documentElement).toHaveAttribute(SMOOTH_SCROLL_ATTRIBUTE);
    });
  });

  describe('the row of links', () => {
    /** The row, rendered as one that overflows and can move sideways. */
    function renderRow(links: typeof page.links) {
      render(<Subject />);
      page.links = links;

      const row = document.querySelector('[data-row]') as HTMLElement;
      vi.spyOn(row, 'scrollWidth', 'get').mockReturnValue(399);
      vi.spyOn(row, 'clientWidth', 'get').mockReturnValue(358);

      return row;
    }

    // The row's own `scrollLeft` is the only thing the hook may move.
    it.each([
      ['past the right fade', 'references', [296, 383], 0, 5000, 0, 41],
      ['off the left edge', 'experience', [-25, 61], 5000, 0, 100, 27],
      ['already in view', 'education', [102, 180], 0, 3800, 12, 12],
    ] as const)(
      'scrolls the row for a current link %s',
      (_when, id, edges, from, to, start, end) => {
        page.scrollY = from;
        const row = renderRow({ [id]: edges });
        row.scrollLeft = start;

        scrollTo(to);

        expect(current()).toBe(id);
        expect(row.scrollLeft).toBe(end);
      },
    );

    it('brings a link focused from the keyboard out from under the fade', () => {
      // Chromium only scrolls a focused link into view when none of it shows.
      const row = renderRow({ references: [296, 383] });

      fireEvent.keyDown(document.body, { key: 'Tab' });
      act(() => link('references').focus());

      expect(row.scrollLeft).toBe(41);
    });

    it('holds the row still under a mouse press, which focuses the link too', () => {
      // Moving the row between press and release would slide the link out from
      // under the pointer, and the click would land on its neighbour.
      const row = renderRow({ references: [296, 383] });

      fireEvent.mouseDown(link('references'));
      act(() => link('references').focus());

      expect(row.scrollLeft).toBe(0);
    });

    it('tells the row how far it has scrolled, for its leading fade', () => {
      const row = renderRow({});

      row.scrollLeft = 41;
      fireEvent.scroll(row);

      expect(row.style.getPropertyValue('--scrolled')).toBe('41px');
    });
  });
});
