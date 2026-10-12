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
 *
 * A Back press while the jump is still running ends it where it began. The
 * browser does restore the earlier position, but the animation it was already
 * playing carries on to the section and leaves the page there, under an
 * address that no longer names it: a second after a mistaken click, Back put
 * the visitor at the foot of the page.
 */
export function armSmoothScroll(): void {
  release?.();

  const root = document.documentElement;
  // Both read before the browser moves. This is the address of the history
  // entry the click is about to leave, and the position the browser files
  // against it — so it is where Back returns to.
  const leaving = window.location.href;
  const from = { left: window.scrollX, top: window.scrollY };
  let idle: ReturnType<typeof setTimeout> | undefined;

  const done = () => {
    clearTimeout(idle);
    window.removeEventListener('scroll', wait);
    window.removeEventListener('scrollend', done);
    window.removeEventListener('hashchange', returned);
    root.removeAttribute(SMOOTH_SCROLL_ATTRIBUTE);
    release = undefined;
  };

  const wait = () => {
    clearTimeout(idle);
    idle = setTimeout(done, SCROLL_IDLE_MS);
  };

  // `hashchange`, not `popstate`: a fragment navigation fires `popstate` for
  // itself, so listening for that ended every jump as it began. The click's
  // own `hashchange` arrives at the fragment; only a traversal arrives back
  // at the address the click left.
  const returned = (event: HashChangeEvent) => {
    if (event.newURL !== leaving) {
      return;
    }

    done();
    // An explicit scroll is what stops the animation; `instant` so that it
    // cannot become one itself. Then once more on the next frame: the
    // animation had a last step already under way, which lands after the
    // first and left the page up to 57px past where it started.
    const settle = () => window.scrollTo({ ...from, behavior: 'instant' });
    settle();
    window.requestAnimationFrame(settle);
  };

  root.setAttribute(SMOOTH_SCROLL_ATTRIBUTE, '');
  window.addEventListener('scroll', wait, { passive: true });
  window.addEventListener('scrollend', done);
  window.addEventListener('hashchange', returned);
  release = done;
  wait();
}
