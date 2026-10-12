import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { armSmoothScroll, SMOOTH_SCROLL_ATTRIBUTE } from '../smoothScroll';

const root = document.documentElement;

function armed() {
  return root.hasAttribute(SMOOTH_SCROLL_ATTRIBUTE);
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

  it('is in place before the click handler returns', () => {
    expect(armed()).toBe(false);

    armSmoothScroll();

    // The browser reads `scroll-behavior` when it performs the default action,
    // straight after the handlers; anything deferred would be too late.
    expect(armed()).toBe(true);
  });

  it('comes off when the scroll ends', () => {
    armSmoothScroll();
    scroll();
    scrollEnd();

    expect(armed()).toBe(false);
  });

  it('stays on for as long as the page keeps moving', () => {
    armSmoothScroll();

    // Three seconds of frames: longer than any fixed timeout worth choosing,
    // which is why the fallback is a pause in scrolling rather than a duration.
    for (let elapsed = 0; elapsed < 3000; elapsed += 16) {
      scroll();
      vi.advanceTimersByTime(16);
    }

    expect(armed()).toBe(true);
  });

  it('comes off once the page has gone quiet, without scrollend', () => {
    armSmoothScroll();
    scroll();
    scroll();

    vi.advanceTimersByTime(1000);

    expect(armed()).toBe(false);
  });

  it('comes off after a click that had nowhere to scroll', () => {
    armSmoothScroll();

    vi.advanceTimersByTime(1000);

    expect(armed()).toBe(false);
  });

  it('is not released by something else finishing a scroll', () => {
    const row = document.createElement('div');
    document.body.append(row);

    armSmoothScroll();

    // The row of links scrolls itself sideways while the page is still on its
    // way. `scrollend` on an element does not bubble, and must not count.
    row.dispatchEvent(new Event('scrollend'));
    expect(armed()).toBe(true);

    row.remove();
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

  it('stops listening once the jump is over', () => {
    const listen = vi.spyOn(window, 'addEventListener');
    const unlisten = vi.spyOn(window, 'removeEventListener');

    armSmoothScroll();
    scrollEnd();

    expect(listen.mock.calls.map(([type]) => type).sort()).toEqual([
      'scroll',
      'scrollend',
    ]);
    for (const [type, listener] of listen.mock.calls) {
      expect(unlisten).toHaveBeenCalledWith(type, listener);
    }

    // Nothing is left to stamp the attribute back on.
    scroll();
    vi.advanceTimersByTime(1000);
    expect(armed()).toBe(false);
  });

  it('listens for scrolling passively', () => {
    const listen = vi.spyOn(window, 'addEventListener');

    armSmoothScroll();

    expect(listen).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    });
  });
});

/**
 * The attribute only does anything because a stylesheet keys off it, and the
 * name is necessarily typed twice. The second half is the regression itself:
 * smooth scrolling on the document outright is what animated Back and Forward.
 */
describe('the stylesheets armSmoothScroll relies on', () => {
  const STYLES = resolve(process.cwd(), 'app/styles');
  const COMMENT = /\/\*[\s\S]*?\*\//g;

  const sheets = readdirSync(STYLES, { encoding: 'utf8', recursive: true })
    .filter((entry) => entry.endsWith('.css'))
    .map((entry) => ({
      file: entry,
      css: readFileSync(join(STYLES, entry), 'utf8').replace(COMMENT, ''),
    }));

  /** Every selector whose rule declares `scroll-behavior: smooth`. */
  const smooth = sheets.flatMap(({ file, css }) =>
    [...css.matchAll(/([^{}]+)\{[^{}]*scroll-behavior:\s*smooth[^{}]*\}/g)]
      .flatMap((match) => match[1].split(','))
      .map((selector) => ({ file, selector: selector.trim() })),
  );

  it('scrolls the document smoothly only behind the attribute', () => {
    const armedRule = `html[${SMOOTH_SCROLL_ATTRIBUTE}]`;
    const reset = sheets.find(({ file }) => file === join('base', 'reset.css'));

    expect(smooth).toContainEqual({
      file: join('base', 'reset.css'),
      selector: armedRule,
    });

    // And only when motion is welcome.
    expect(reset?.css).toMatch(
      new RegExp(
        `@media \\(prefers-reduced-motion: no-preference\\) \\{\\s*${armedRule.replace(/[[\]]/g, '\\$&')} \\{`,
      ),
    );
  });

  it('never sets smooth scrolling on the document outright', () => {
    // `scroll-behavior` on the root element is the viewport's, and so governs
    // scroll restoration. Anywhere else it is one scroller's own business.
    const onTheDocument = smooth.filter(({ selector }) => {
      const subject = selector.split(/[\s>+~]+/).pop() ?? '';

      return (
        /^(html|:root|\*)/.test(subject) &&
        !subject.includes(`[${SMOOTH_SCROLL_ATTRIBUTE}]`)
      );
    });

    expect(onTheDocument).toEqual([]);
  });
});
