import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { armSmoothScroll, SMOOTH_SCROLL_ATTRIBUTE } from '../smoothScroll';

function armed() {
  return document.documentElement.hasAttribute(SMOOTH_SCROLL_ATTRIBUTE);
}

/** The page reporting a new position, as it does on every frame of a scroll. */
function scroll() {
  window.dispatchEvent(new Event('scroll'));
}

function scrollEnd() {
  window.dispatchEvent(new Event('scrollend'));
}

describe('armSmoothScroll', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    scrollEnd();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('is in place before the click handler returns, and off at scrollend', () => {
    armSmoothScroll();

    // The browser reads `scroll-behavior` when it performs the default action,
    // straight after the handlers; anything deferred would be too late.
    expect(armed()).toBe(true);

    scrollEnd();
    expect(armed()).toBe(false);
  });

  it('without scrollend, comes off once the page has been quiet a while', () => {
    // A click that had nowhere to scroll never reports a position at all.
    armSmoothScroll();
    vi.advanceTimersByTime(1000);
    expect(armed()).toBe(false);

    armSmoothScroll();

    // Longer than any fixed timeout worth choosing, which is why the fallback
    // is a pause in scrolling rather than a duration.
    for (let elapsed = 0; elapsed < 3000; elapsed += 16) {
      scroll();
      vi.advanceTimersByTime(16);
    }
    expect(armed()).toBe(true);

    vi.advanceTimersByTime(1000);
    expect(armed()).toBe(false);
  });

  it('hands over cleanly when a second click interrupts the first', () => {
    armSmoothScroll();
    vi.advanceTimersByTime(100);

    armSmoothScroll();
    vi.advanceTimersByTime(100);

    // The first click's timer would have fired by now.
    expect(armed()).toBe(true);

    scrollEnd();
    expect(armed()).toBe(false);
  });

  /**
   * Back, pressed while the jump is still running. The browser restores the
   * position it saved, and the animation it was already playing then carries
   * the page on to the section, under an address with no fragment.
   */
  describe('when Back interrupts the jump', () => {
    const here = window.location.href;
    const there = `${here}#references`;

    let frames: FrameRequestCallback[];
    let scrollTo: ReturnType<typeof vi.fn<() => void>>;

    function at(top: number) {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(top);
    }

    /** The address changing by its fragment alone, as a click or Back does. */
    function hashChange(oldURL: string, newURL: string) {
      window.dispatchEvent(
        new HashChangeEvent('hashchange', { oldURL, newURL }),
      );
    }

    function nextFrame() {
      for (const frame of frames.splice(0)) {
        frame(0);
      }
    }

    beforeEach(() => {
      frames = [];
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) =>
        frames.push(callback),
      );
      scrollTo = vi.fn();
      vi.spyOn(window, 'scrollTo').mockImplementation(scrollTo);
    });

    it('ends the jump where it began, at once and again a frame later', () => {
      const origin = { left: 0, top: 600, behavior: 'instant' };
      let armedDuringMove: boolean | undefined;
      scrollTo.mockImplementation(() => {
        armedDuringMove = armed();
      });

      at(600);
      armSmoothScroll();
      hashChange(here, there);
      // The page is well on its way by the time Back arrives.
      at(2400);
      scroll();
      hashChange(there, here);

      expect(scrollTo).toHaveBeenCalledTimes(1);
      expect(scrollTo).toHaveBeenLastCalledWith(origin);
      // Disarmed first, so the move cannot itself animate.
      expect(armedDuringMove).toBe(false);
      expect(armed()).toBe(false);

      // The animation's last step lands after that first scroll.
      at(657);
      nextFrame();
      expect(scrollTo).toHaveBeenCalledTimes(2);
      expect(scrollTo).toHaveBeenLastCalledWith(origin);

      // And then the page is the visitor's.
      nextFrame();
      expect(scrollTo).toHaveBeenCalledTimes(2);
    });

    // A fragment navigation fires `popstate` for itself, so that event cannot
    // signal a return. jsdom navigates nowhere, so only this test can tell.
    it('does not mistake the click arriving at its section for a return', () => {
      armSmoothScroll();
      window.dispatchEvent(new PopStateEvent('popstate'));
      hashChange(here, there);
      nextFrame();

      expect(scrollTo).not.toHaveBeenCalled();
      expect(armed()).toBe(true);
    });

    it('leaves a Back press alone once the jump is over', () => {
      armSmoothScroll();
      hashChange(here, there);
      scrollEnd();
      hashChange(there, here);
      nextFrame();

      // Restoring the position is the browser's job, and it does it.
      expect(scrollTo).not.toHaveBeenCalled();
    });
  });
});

/**
 * The attribute only does anything because a stylesheet keys off it, and the
 * name is necessarily typed twice. `scroll-behavior` on the root element is the
 * viewport's and so governs scroll restoration: set outright, it animates Back
 * and Forward. On any other selector it is one scroller's own business.
 */
it('scrolls the document smoothly only behind the attribute, when motion is welcome', () => {
  const styles = resolve(process.cwd(), 'app/styles');
  const css = readdirSync(styles, { encoding: 'utf8', recursive: true })
    .filter((entry) => entry.endsWith('.css'))
    .map((entry) => readFileSync(join(styles, entry), 'utf8'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  const onTheDocument = [
    ...css.matchAll(/([^{}]+)\{[^{}]*scroll-behavior:\s*smooth[^{}]*\}/g),
  ]
    .flatMap((match) => match[1].split(','))
    .map((selector) => selector.trim())
    .filter((selector) =>
      /^(html|:root|\*)/.test(selector.split(/[\s>+~]+/).pop() ?? ''),
    );

  const armedRule = `html[${SMOOTH_SCROLL_ATTRIBUTE}]`;

  expect(onTheDocument).toEqual([armedRule]);
  expect(css).toMatch(
    new RegExp(
      `@media \\(prefers-reduced-motion: no-preference\\) \\{\\s*${armedRule.replace(/[[\]]/g, '\\$&')} \\{`,
    ),
  );
});
