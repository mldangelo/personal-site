'use client';

import { type RefObject, useEffect, useRef } from 'react';

import { ageAt, ageIntervalFor, agePlaceholder } from '@/lib/telemetry';

import usePrefersReducedMotion from './usePrefersReducedMotion';

/**
 * A live age readout, written straight to the DOM.
 *
 * Returns a ref to attach to the element that shows the reading. Render
 * `agePlaceholder(precision)` as that element's content: it is fixed-width and
 * digit-free, so server and client markup agree and the readout does not reflow
 * when the first real value lands.
 *
 * The ticked value is assigned to `textContent` rather than held in state. At
 * `AGE_PRECISION_FULL` the last digit turns over roughly every 0.32ms, so the
 * timer runs at the `AGE_MIN_INTERVAL` floor and every tick genuinely changes
 * the string — through `useState` that was 40 React renders a second for as
 * long as `/stats` was the visible tab. Writing one text node costs the same
 * whether it happens 40 times a second or once, and nothing else on the page
 * depends on the value, so there is nothing for React to reconcile.
 *
 * Because the placeholder React renders never changes between renders, React
 * leaves the text node alone on re-render and the live value survives. This is
 * the same arrangement `ReadingProgress` uses for scroll position.
 *
 * Two other things keep this from being wasteful or unpleasant:
 *
 * - Under reduced motion the reading is taken once and left to stand. Digits
 *   changing several times a second is precisely the motion that setting asks
 *   us to avoid.
 * - Ticking pauses while the tab is hidden, and resyncs on return.
 */
export default function useLiveAge<T extends HTMLElement = HTMLSpanElement>(
  precision: number,
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const tick = () => {
      node.textContent = ageAt(Date.now(), precision);
    };
    const interval = ageIntervalFor(precision);
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
      node.textContent = agePlaceholder(precision);
    };
  }, [precision, prefersReducedMotion]);

  return ref;
}
