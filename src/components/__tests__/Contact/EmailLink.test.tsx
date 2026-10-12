import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { REDUCED_MOTION_QUERY } from '@/hooks/usePrefersReducedMotion';
import profile from '../../../data/profile.json';
import EmailLink from '../../Contact/EmailLink';

const ADDRESS = profile.email;
const [, DOMAIN] = ADDRESS.split('@');

/** One animation tick. */
const TICK_MS = 50;
/** Comfortably longer than one pass through every alias (about 49 seconds). */
const WHOLE_CYCLE_MS = 60_000;

/** A `matchMedia` stand-in whose reduced-motion answer can be flipped. */
function stubReducedMotion(prefersReduced: boolean) {
  const listeners = new Set<() => void>();
  let matches = prefersReduced;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      get matches() {
        return query === REDUCED_MOTION_QUERY && matches;
      },
      media: query,
      addEventListener: (_type: string, listener: () => void) => {
        listeners.add(listener);
      },
      removeEventListener: (_type: string, listener: () => void) => {
        listeners.delete(listener);
      },
    }),
  });

  return {
    /** What switching the operating-system setting mid-visit looks like. */
    flipTo(next: boolean) {
      matches = next;
      act(() => {
        for (const listener of listeners) listener();
      });
    },
  };
}

function addressLink() {
  return screen.getByRole('link');
}

function block() {
  return document.querySelector('.contact-email-container') as HTMLElement;
}

/** The decorative line, or `null` while nothing is typed on it. */
function aliasLine() {
  return document.querySelector('.contact-email-alias');
}

/**
 * What the line reads, exactly. `toHaveTextContent` matches substrings, which
 * is the wrong tool on a page whose bug was extra text beside the address.
 */
function shownAlias(): string | null {
  return aliasLine()?.textContent ?? null;
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

interface Frame {
  alias: string | null;
  linkText: string | null;
  linkHref: string | null;
}

/** Steps the clock one tick at a time, recording what is on screen at each. */
function watch(durationMs: number): Frame[] {
  const frames: Frame[] = [];

  for (let elapsed = 0; elapsed < durationMs; elapsed += TICK_MS) {
    advance(TICK_MS);
    frames.push({
      alias: shownAlias(),
      linkText: addressLink().textContent,
      linkHref: addressLink().getAttribute('href'),
    });
  }

  return frames;
}

/** Every distinct alias a run typed, in the order it first appeared. */
function typedIn(frames: Frame[]): string[] {
  return [
    ...new Set(
      frames.map((frame) => frame.alias).filter((alias) => alias !== null),
    ),
  ];
}

/** Runs until an alias is part-way typed, and returns what is showing. */
function runUntilTyping(): string {
  for (let elapsed = 0; elapsed < WHOLE_CYCLE_MS; elapsed += TICK_MS) {
    advance(TICK_MS);
    if (aliasLine()) {
      // One more tick, so a frozen line is distinguishable from its first frame.
      advance(TICK_MS);
      return shownAlias() ?? '';
    }
  }

  throw new Error('no alias was ever typed');
}

describe('EmailLink', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('the address', () => {
    it('is the link, in full, pointing at itself', () => {
      render(<EmailLink />);

      expect(addressLink().textContent).toBe(ADDRESS);
      expect(addressLink()).toHaveAccessibleName(ADDRESS);
      expect(addressLink()).toHaveAttribute('href', `mailto:${ADDRESS}`);
    });

    /**
     * The aliases used to be typed into the link. The real address was on
     * screen for 2.5 seconds, a selection copied whichever alias was showing,
     * and the cycle ended on `thanks@…` for good.
     */
    it.each([
      ['once', false],
      ['looping', true],
    ])('never changes while the aliases cycle %s', (_label, loopMessage) => {
      render(<EmailLink loopMessage={loopMessage} />);

      const frames = watch(WHOLE_CYCLE_MS);

      // At every tick, not only once the cycle has settled.
      expect(new Set(frames.map((frame) => frame.linkText))).toEqual(
        new Set([ADDRESS]),
      );
      expect(new Set(frames.map((frame) => frame.linkHref))).toEqual(
        new Set([`mailto:${ADDRESS}`]),
      );
      expect(addressLink()).toHaveAccessibleName(ADDRESS);
      expect(addressLink()).not.toHaveAttribute('aria-disabled');
      // The cycle really ran underneath it, all the way to its last alias.
      expect(typedIn(frames)).toContain(`thanks@${DOMAIN}`);
    });

    it('is in the server markup with nothing typed under it', () => {
      const html = renderToStaticMarkup(<EmailLink />);

      expect(html).toContain(`>${ADDRESS}</a>`);
      expect(html).not.toContain('contact-email-alias');
    });
  });

  describe('the alias line', () => {
    it('opens empty, then types the first alias after a pause', () => {
      render(<EmailLink />);

      expect(aliasLine()).toBeNull();

      advance(2_000);
      expect(aliasLine()).toBeNull();

      advance(1_000);
      expect(shownAlias()).toBe(`hello@${DOMAIN}`);
    });

    it('types a character at a time, with the domain riding along', () => {
      render(<EmailLink />);

      expect(typedIn(watch(5_000))).toEqual([
        `h@${DOMAIN}`,
        `he@${DOMAIN}`,
        `hel@${DOMAIN}`,
        `hell@${DOMAIN}`,
        `hello@${DOMAIN}`,
      ]);
    });

    it('is decoration: hidden from assistive technology and outside the link', () => {
      render(<EmailLink />);
      runUntilTyping();

      expect(aliasLine()).toHaveAttribute('aria-hidden', 'true');
      expect(addressLink()).not.toContainElement(aliasLine() as HTMLElement);
    });

    /**
     * Rendering `{alias}@{domain}` looks the same and is three text nodes. The
     * domain then has a position of its own for every keystroke to push, and
     * Chrome reports each push as a layout shift: 45 entries typing one alias,
     * measured against none for a single node.
     */
    it('is a single text node, so typing moves nothing that was already there', () => {
      render(<EmailLink />);
      runUntilTyping();

      expect(aliasLine()?.childNodes).toHaveLength(1);
      expect(aliasLine()?.firstChild?.nodeType).toBe(Node.TEXT_NODE);
    });

    /**
     * Advancing used to reset to zero characters, leaving the message empty
     * for a tick. An empty message draws no line, so the line would blink out
     * at every one of the boundaries between aliases.
     */
    it('stays up from the first alias to the last, then clears', () => {
      render(<EmailLink />);

      const frames = watch(WHOLE_CYCLE_MS);
      const presence = frames
        .map((frame) => (frame.alias === null ? '-' : 'x'))
        .join('');

      // Empty, then continuously present, then empty: no gap in the middle.
      expect(presence).toMatch(/^-+x+-+$/);

      const typed = typedIn(frames);

      // Never a bare `@domain`, which is what an empty message would type.
      expect(typed.filter((alias) => alias.startsWith('@'))).toEqual([]);
      expect(typed.at(-1)).toBe(`thanks@${DOMAIN}`);
    });

    it('stays cleared once the cycle has finished', () => {
      render(<EmailLink />);
      advance(WHOLE_CYCLE_MS);

      expect(aliasLine()).toBeNull();

      // A finished animation recorded completion only in `isActive`, so
      // RESUME's `idx < maxIdx` check passed and every mouse-out or blur
      // re-armed the interval.
      fireEvent.mouseEnter(addressLink());
      fireEvent.mouseLeave(addressLink());
      fireEvent.focus(addressLink());
      fireEvent.blur(addressLink());

      expect(typedIn(watch(5_000))).toEqual([]);
    });

    it('starts over after a rest when it loops', () => {
      render(<EmailLink loopMessage />);

      const frames = watch(WHOLE_CYCLE_MS).map((frame) => frame.alias);
      const firstAlias = `hello@${DOMAIN}`;
      const timesTyped = frames.filter(
        (alias, index) => alias === firstAlias && frames[index - 1] !== alias,
      ).length;

      expect(timesTyped).toBe(2);
    });

    it.each([
      ['the address', addressLink],
      ['the line itself', aliasLine],
    ])(
      'holds its frame while the pointer is on %s, and resumes after',
      (_label, target) => {
        render(<EmailLink />);
        const before = runUntilTyping();

        fireEvent.mouseEnter(target() as HTMLElement);
        advance(500);
        expect(shownAlias()).toBe(before);

        fireEvent.mouseLeave(target() as HTMLElement);
        advance(500);
        expect(shownAlias()).not.toBe(before);
      },
    );

    // The block is a grid as wide as the page. With the handlers on the block,
    // a pointer resting anywhere in that band froze the line for no visible
    // reason.
    it('keeps typing while the pointer is only in the space beside the address', () => {
      render(<EmailLink />);
      const before = runUntilTyping();

      fireEvent.mouseEnter(block());
      advance(500);

      expect(shownAlias()).not.toBe(before);
    });

    it('holds its frame while the address has keyboard focus', () => {
      render(<EmailLink />);
      const before = runUntilTyping();

      fireEvent.focus(addressLink());
      advance(500);
      expect(shownAlias()).toBe(before);

      fireEvent.blur(addressLink());
      advance(500);
      expect(shownAlias()).not.toBe(before);
    });
  });

  describe('reduced motion', () => {
    it('never renders the alias line, and leaves the rest alone', () => {
      stubReducedMotion(true);
      render(<EmailLink />);

      expect(typedIn(watch(WHOLE_CYCLE_MS))).toEqual([]);
      expect(addressLink().textContent).toBe(ADDRESS);
    });

    it('takes the line down when the preference turns on mid-visit', () => {
      const motion = stubReducedMotion(false);
      render(<EmailLink />);
      runUntilTyping();

      motion.flipTo(true);

      expect(aliasLine()).toBeNull();
      expect(typedIn(watch(5_000))).toEqual([]);
    });

    // Hiding the line is not the same as stopping it. A cycle left ticking
    // unseen would surface part-way through if the preference were lifted.
    it('does not run the cycle unseen: lifting the preference starts it from the top', () => {
      const motion = stubReducedMotion(true);
      render(<EmailLink />);
      advance(10_000);

      motion.flipTo(false);

      expect(typedIn(watch(5_000))).toEqual([
        `h@${DOMAIN}`,
        `he@${DOMAIN}`,
        `hel@${DOMAIN}`,
        `hell@${DOMAIN}`,
        `hello@${DOMAIN}`,
      ]);
    });
  });
});
