/**
 * Smooth scrolling for one jump at a time.
 *
 * `html { scroll-behavior: smooth }` reads as a nicety for in-page links, but
 * the property also governs the browser's own scroll restoration. With it set
 * globally, pressing Back into a long article started at the top and scrolled
 * itself through some 140 positions for 1.2 seconds before arriving. Next's
 * `data-scroll-behavior="smooth"` opt-in only covers the scroll Next performs
 * on a forward navigation, so it does not help.
 *
 * Nothing is smooth by default any more. A section nav asks for it per click
 * by stamping this attribute on `<html>`, which `app/styles/base/reset.css`
 * keys the property off — and only when the visitor has not asked for reduced
 * motion, so nothing here needs to read that preference.
 */
export const SMOOTH_SCROLL_ATTRIBUTE = 'data-smooth-scroll';

/**
 * How long the page has to hold still before a jump counts as over. A smooth
 * scroll reports a position every frame, so this is several missed frames,
 * not a guess at how long the animation runs.
 */
const SCROLL_IDLE_MS = 150;

let release: (() => void) | undefined;

/**
 * Make the scroll the browser is about to perform a smooth one.
 *
 * Call it from a fragment link's click handler and leave the event alone: the
 * handler runs before the default action, so the attribute is already in place
 * when the browser navigates to the fragment, and the jump keeps its history
 * entry and focus behaviour.
 *
 * The attribute comes off on `scrollend`. Browsers without that event, and
 * clicks that had nowhere to scroll, fall back to a timer that every `scroll`
 * event restarts — a fixed timeout would have to outlast the longest possible
 * animation, and for that whole time a Back press would animate again.
 */
export function armSmoothScroll(): void {
  release?.();

  const root = document.documentElement;
  let idle: ReturnType<typeof setTimeout> | undefined;

  const done = () => {
    clearTimeout(idle);
    window.removeEventListener('scroll', wait);
    window.removeEventListener('scrollend', done);
    root.removeAttribute(SMOOTH_SCROLL_ATTRIBUTE);
    release = undefined;
  };

  const wait = () => {
    clearTimeout(idle);
    idle = setTimeout(done, SCROLL_IDLE_MS);
  };

  root.setAttribute(SMOOTH_SCROLL_ATTRIBUTE, '');
  window.addEventListener('scroll', wait, { passive: true });
  window.addEventListener('scrollend', done);
  release = done;
  wait();
}
