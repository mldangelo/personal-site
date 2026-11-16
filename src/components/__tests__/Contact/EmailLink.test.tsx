import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import profile from '../../../data/profile.json';
import EmailLink from '../../Contact/EmailLink';

const [localPart] = profile.email.split('@');

/** An address as a `mailto:` URL carries it. */
const mailto = (address: string) => {
  const [local, domain] = address.split('@');
  return `${encodeURIComponent(local)}@${domain}`;
};

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
      expect(link).toHaveAttribute('href', `mailto:${mailto(profile.email)}`);
    }
  });

  // RFC 6068: unencoded, a `#` would start a fragment and a `?` the headers.
  it('keeps reserved characters in the address it opens', async () => {
    vi.resetModules();
    vi.doMock('@/data/profile.json', () => ({
      default: { ...profile, email: 'hi#notes?x@example.com' },
    }));
    const { default: ForkLink } = await import('../../Contact/EmailLink');

    render(<ForkLink />);

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'mailto:hi%23notes%3Fx@example.com',
    );
    vi.doUnmock('@/data/profile.json');
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

  // The visible name of a focused link is the address it opens, and the
  // pointer leaving does not restart the animation under keyboard focus.
  it('shows and holds the real address while the link has focus', () => {
    const { container } = render(<EmailLink />);
    const wrapper = container.firstElementChild as HTMLElement;
    const link = screen.getByRole('link');
    advance(MID_ALIAS_MS);
    expect(prefix()).not.toBe(localPart);

    act(() => link.focus());
    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseLeave(wrapper);
    advance(2000);
    expect(prefix()).toBe(localPart);

    act(() => link.blur());
    advance(500);
    expect(prefix()).not.toBe(localPart);
  });

  it('copies the real address whatever alias is showing', () => {
    render(<EmailLink />);
    advance(MID_ALIAS_MS);
    const link = screen.getByRole('link');
    window.getSelection()?.selectAllChildren(link);

    const clipboardData = { setData: vi.fn() };
    fireEvent.copy(link, { clipboardData });

    expect(clipboardData.setData).toHaveBeenCalledWith(
      'text/plain',
      profile.email,
    );
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
