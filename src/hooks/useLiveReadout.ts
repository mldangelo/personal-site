'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

import usePrefersReducedMotion from './usePrefersReducedMotion';

export interface LiveReadout<T> {
  /** Attach to the element that shows the reading. */
  ref: RefObject<T | null>;
  /**
   * Whether the client is currently driving the value.
   *
   * `false` through the server render and until the first reading lands, which
   * is what lets a readout render its build-time value in ordinary ink and
   * spend `--color-signal` only once the reading is genuinely live.
   */
  live: boolean;
}

/**
 * A reading written straight to the DOM, on a timer.
 *
 * Render `initial` as the element's content and attach `ref` to it. `initial`
 * is what the server rendered, so it must be a value the server can produce and
 * the client can reproduce exactly — pass it through as a prop rather than
 * recomputing it, or React will find a hydration mismatch and swap the text.
 *
 * The ticked value is assigned to `textContent` rather than held in state. At
 * the stats page's age precision the timer runs at a 25ms floor and every tick
 * genuinely changes the string — through `useState` that was 40 React renders a
 * second for as long as `/stats` was the visible tab. Writing one text node
 * costs the same whether it happens 40 times a second or once, and nothing else
 * on the page depends on the value, so there is nothing for React to reconcile.
 *
 * Because the content React renders never changes between renders, React leaves
 * the text node alone on re-render and the live value survives. That is what
 * makes the one state update here safe: `live` flips once, on mount, and the
 * re-render it causes reconciles `initial` against `initial` and touches
 * nothing. This is the same arrangement `ReadingProgress` uses for scroll
 * position.
 *
 * Two other things keep this from being wasteful or unpleasant:
 *
 * - Under reduced motion the reading is taken once and left to stand. Digits
 *   changing several times a second is precisely the motion that setting asks
 *   us to avoid.
 * - Ticking pauses while the tab is hidden, and resyncs on return.
 *
 * `read` must be stable across renders — wrap it in `useCallback` — because a
 * new identity restarts the timer and returns the element to `initial`.
 */
export default function useLiveReadout<T extends HTMLElement = HTMLSpanElement>(
  read: (now: number) => string,
  interval: number,
  initial: string,
): LiveReadout<T> {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const tick = () => {
      node.textContent = read(Date.now());
    };
    let timer: ReturnType<typeof setInterval> | undefined;

    const sync = () => {
      clearInterval(timer);
      timer = undefined;

      // A visibility change to hidden should only stop work. Taking one last
      // reading here creates a race at the display precision boundary and
      // contradicts the promise that the value holds still while hidden.
      if (document.hidden) {
        return;
      }

      tick();
      // Only once a reading is actually on screen. A tab that mounts hidden
      // keeps showing the server's value, and says so.
      setLive(true);

      if (prefersReducedMotion) {
        return;
      }

      timer = setInterval(tick, interval);
    };

    sync();
    document.addEventListener('visibilitychange', sync);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', sync);
      // Hand the element back in the state React thinks it is in, so a later
      // remount does not inherit a stale reading.
      node.textContent = initial;
      setLive(false);
    };
  }, [initial, interval, prefersReducedMotion, read]);

  return { ref, live };
}
