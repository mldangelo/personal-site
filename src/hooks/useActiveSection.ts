'use client';

import {
  type MouseEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { armSmoothScroll } from '@/lib/smoothScroll';

/**
 * Slack under the line. A fragment jump parks a section exactly on it, at a
 * fractional scroll offset, and that has to count as having arrived.
 */
const LINE_ALLOWANCE = 8;

/** Scroll offsets are fractional, so "at the bottom" needs a couple of pixels. */
const BOTTOM_TOLERANCE = 2;

export interface ActiveSection<Id extends string> {
  /** The section the reader is in; the first one until any has been reached. */
  activeId: Id | undefined;
  /** Goes on the sticky bar that holds the section links. */
  navRef: RefObject<HTMLElement | null>;
  /** `onClick` for each section link. It leaves the native fragment jump alone. */
  onLinkClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Scroll a link's row sideways until the link is clear of the row's edges.
 *
 * It moves the row itself: `scrollIntoView` would scroll the page as well, and
 * that cancels the smooth jump which is usually why the link needs showing.
 * The row's own `scroll-padding` says how much of each edge is spoken for.
 */
function reveal(link: Element | null | undefined): void {
  const row = link?.parentElement;

  if (!link || !row || row.scrollWidth <= row.clientWidth) {
    return;
  }

  const style = getComputedStyle(row);
  const box = row.getBoundingClientRect();
  const { left, right } = link.getBoundingClientRect();
  const start = box.left + (Number.parseFloat(style.scrollPaddingLeft) || 0);
  const end = box.right - (Number.parseFloat(style.scrollPaddingRight) || 0);

  if (left < start) {
    row.scrollLeft -= start - left;
  } else if (right > end) {
    row.scrollLeft += right - end;
  }
}

/**
 * Which section of a long page the reader is in, for a sticky section nav.
 *
 * A section becomes current when its top edge comes up to a line just under
 * the sticky chrome, and stays current until the next one does. The line is
 * measured rather than assumed: the offset the bar sticks at (the header's
 * height) plus the bar's own height, or the section's `scroll-margin-top` when
 * that is lower — a fragment jump parks the section there, and a link that
 * scrolls to a section has to end up lighting it.
 *
 * The résumé nav this replaced watched a band 20–25% down the viewport with an
 * IntersectionObserver. Its last section sits so near the end of the page that
 * nothing could scroll it up to that band, so "References" never lit. And its
 * fallback only saw the entries delivered in the current callback, so an
 * instant jump back to the top left the section that had just left the band
 * lit. Reading every position afresh on each scroll frame has neither problem.
 *
 * Pass the section ids in document order. Ids with no rendered element are
 * skipped, and the array may be a new one on every render.
 */
export default function useActiveSection<Id extends string>(
  ids: readonly Id[],
): ActiveSection<Id> {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<Id | undefined>(ids[0]);
  /** The fragment the reader last asked for by name, until they leave it. */
  const requested = useRef('');
  const remeasure = useRef(() => {});

  // HTML ids cannot contain whitespace, so the joined string identifies the
  // list without making callers memoize it.
  const key = ids.join(' ');

  useEffect(() => {
    const sectionIds = key === '' ? [] : (key.split(' ') as Id[]);

    if (sectionIds.length === 0) {
      setActiveId(undefined);
      return;
    }

    const nav = navRef.current;
    let frame = 0;
    let held = '';

    const measure = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const bottom = maxScroll - BOTTOM_TOLERANCE;

      // A document that cannot scroll has no position to read. That is also
      // what the mobile menu's scroll lock looks like from here: it fixes
      // `<body>`, which zeroes `scrollY` and collapses the document to one
      // screen. The reading from before the lock is the one to keep.
      if (bottom <= 0) {
        return;
      }

      // The bar's bottom edge once it is stuck: where it sticks, plus its height.
      const chrome = nav
        ? (Number.parseFloat(getComputedStyle(nav).top) || 0) +
          nav.getBoundingClientRect().height
        : 0;

      // For every section on the page: `landing`, the scroll offset a jump to
      // it aims for, and `at`, the offset from which it is current.
      const marks: { id: Id; landing: number; at: number }[] = [];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        const box = element?.getBoundingClientRect();

        // An empty box is `display: none`, which can never be scrolled to.
        if (!element || !box || (box.width === 0 && box.height === 0)) {
          continue;
        }

        const margin =
          Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
        const landing = scrollY + box.top - Math.max(chrome, margin);

        marks.push({ id, landing, at: landing - LINE_ALLOWANCE });
      }

      // Where a jump leaves the page, the section it was a jump to is the
      // current one, whatever else is on screen. Position alone cannot say
      // that near the end of a page: every section the document is too short
      // to bring up to the line parks at the same offset, the bottom. The
      // request is used up once the reader scrolls away from it.
      const asked = marks.find((mark) => mark.id === requested.current);

      if (
        asked &&
        Math.abs(scrollY - Math.min(Math.max(asked.landing, 0), maxScroll)) <=
          BOTTOM_TOLERANCE
      ) {
        held = asked.id;
        setActiveId(asked.id);
        return;
      }

      if (held !== '' && held === requested.current) {
        requested.current = '';
      }

      held = '';

      // The sections the page cannot bring up to the line share out what is
      // left of the scroll range in proportion, so each still takes its turn
      // and the last one arrives exactly at the bottom. With one of them that
      // is simply "the last section is current at the bottom of the page"; a
      // tall window strands two or three, and the earlier of those would
      // otherwise never light at all.
      const firstStranded = marks.findIndex((mark) => mark.landing > bottom);

      if (firstStranded !== -1) {
        const stranded = marks.slice(firstStranded);
        const from = firstStranded > 0 ? marks[firstStranded - 1].landing : 0;
        const far = Math.max(...stranded.map((mark) => mark.landing));

        for (const mark of stranded) {
          mark.at =
            bottom - ((far - mark.landing) * (bottom - from)) / (far - from);
        }
      }

      let active = sectionIds[0];

      for (const mark of marks) {
        if (scrollY >= mark.at) {
          active = mark.id;
        }
      }

      setActiveId(active);
    };

    // A scroll can report hundreds of positions a second; one reading per
    // painted frame is all the nav can show.
    const schedule = () => {
      if (frame !== 0) {
        return;
      }

      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    const readFragment = () => {
      requested.current = window.location.hash.slice(1);
      schedule();
    };

    // Chromium leaves a focused link half under the row's edge unless it was
    // wholly out of view. Keyboard focus only: a mouse press focuses too, and
    // moving the row between press and release takes the click off the link.
    const showFocused = (event: FocusEvent) => {
      const link = event.target as Element;

      if (link.matches(':focus-visible')) {
        reveal(link);
      }
    };

    // The row only has something to its left once it has moved, so its leading
    // edge fades by however far that is; the stylesheet caps it. `scroll` does
    // not bubble, which is why the row's is caught on the way down.
    const trackRow = (event: Event) => {
      const row = event.target as HTMLElement;

      row.style.setProperty('--scrolled', `${row.scrollLeft}px`);
    };

    requested.current = window.location.hash.slice(1);
    remeasure.current = schedule;
    measure();

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', readFragment);
    nav?.addEventListener('focusin', showFocused);
    nav?.addEventListener('scroll', trackRow, { capture: true, passive: true });

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', readFragment);
      nav?.removeEventListener('focusin', showFocused);
      nav?.removeEventListener('scroll', trackRow, { capture: true });
      cancelAnimationFrame(frame);
      remeasure.current = () => {};
    };
  }, [key]);

  // Under 736px the links sit in one row that scrolls sideways, and the
  // current one can be off its edge. `activeId` is only the trigger; the link
  // is read back from the markup it has just re-rendered.
  useEffect(() => {
    reveal(navRef.current?.querySelector('[aria-current]'));
  }, [activeId]);

  const onLinkClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    // A modified click opens the section somewhere else; this page stays put.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    armSmoothScroll();
    requested.current = event.currentTarget.hash.slice(1);
    // The jump may have nowhere to scroll, and then no scroll event follows.
    remeasure.current();
  }, []);

  return { activeId, navRef, onLinkClick };
}
