import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import profile from '../../../data/profile.json';
import EmailLink from '../../Contact/EmailLink';

const [localPart] = profile.email.split('@');

/** Far enough in to be typing out a long alias, past the opening holds. */
const MID_ALIAS_MS = 9000;
/** Longer than one full cycle of every message. */
const FULL_CYCLE_MS = 120_000;

function prefix() {
  return document.querySelector('.contact-email-prefix')?.textContent;
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('EmailLink', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Some joke aliases are not valid local-parts, and the alias changes twenty
  // times a second, so the destination and the name stay fixed underneath it.
  it('keeps a working link, named for its real address, through the animation', () => {
    render(<EmailLink />);

    for (let elapsed = 0; elapsed < 60_000; elapsed += 250) {
      advance(250);

      const link = screen.getByRole('link', {
        name: `Email ${profile.email}`,
      });
      expect(link).toHaveAttribute('href', `mailto:${profile.email}`);
    }
  });

  // An empty message for a single tick would snap the prefix back to the real
  // address at every message boundary, a visible flicker.
  it('opens on the real address, then never blanks or snaps back to it', () => {
    render(<EmailLink />);
    expect(prefix()).toBe(localPart);

    let previous = prefix();

    for (let elapsed = 0; elapsed < FULL_CYCLE_MS; elapsed += 50) {
      advance(50);

      const shown = prefix();
      expect(shown).not.toBe('');

      // The flash is a jump to the complete address from some other alias
      // already several characters long.
      if (previous !== localPart && (previous?.length ?? 0) > 1) {
        expect(shown).not.toBe(localPart);
      }

      previous = shown;
    }
  });

  it('pauses while hovered and picks up again afterwards', () => {
    const { container } = render(<EmailLink />);
    const wrapper = container.firstElementChild as HTMLElement;
    advance(MID_ALIAS_MS);
    const paused = prefix();

    fireEvent.mouseEnter(wrapper);
    advance(500);
    expect(prefix()).toBe(paused);

    fireEvent.mouseLeave(wrapper);
    advance(500);
    expect(prefix()).not.toBe(paused);
  });

  it('stays settled once the animation completes, even after a hover', () => {
    const { container } = render(<EmailLink />);
    const wrapper = container.firstElementChild as HTMLElement;
    advance(FULL_CYCLE_MS);

    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseLeave(wrapper);

    // Leaving must not re-arm the interval on a finished animation.
    expect(vi.getTimerCount()).toBe(0);
  });
});
