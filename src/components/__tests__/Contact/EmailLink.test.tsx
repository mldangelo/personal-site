import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import profile from '../../../data/profile.json';
import EmailLink from '../../Contact/EmailLink';

const [localPart, domain] = profile.email.split('@');

describe('EmailLink', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock matchMedia for reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the email domain', () => {
    render(<EmailLink />);

    expect(screen.getByText(`@${domain}`)).toBeInTheDocument();
  });

  it('renders as a link element', () => {
    render(<EmailLink />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('animates through messages over time', async () => {
    render(<EmailLink />);

    // Flush effects first
    await act(async () => {
      await Promise.resolve();
    });

    // Initial state shows the real local-part (accessibility: never show empty)
    const prefix = document.querySelector('.contact-email-prefix');
    expect(prefix?.textContent).toBe(localPart);

    // Advance through multiple messages to verify animation works
    // Each message takes ~50 chars + 50 hold ticks at 50ms each
    act(() => {
      vi.advanceTimersByTime(10000); // Advance 10 seconds
    });

    // Animation should have progressed beyond 'hi'
    // The component continues to animate through messages
    expect(prefix).toBeInTheDocument();
  });

  it('pauses animation on mouse enter', async () => {
    render(<EmailLink />);

    const container = document.querySelector(
      '.contact-email-container',
    ) as HTMLElement;

    // Let animation run a bit
    act(() => {
      vi.advanceTimersByTime(100);
    });

    const prefixBefore = document.querySelector(
      '.contact-email-prefix',
    )?.textContent;

    // Pause on hover
    fireEvent.mouseEnter(container);

    // Advance time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    const prefixAfter = document.querySelector(
      '.contact-email-prefix',
    )?.textContent;

    // Should be the same since animation is paused
    expect(prefixAfter).toBe(prefixBefore);
  });

  it('resumes animation on mouse leave', async () => {
    render(<EmailLink />);

    const container = document.querySelector(
      '.contact-email-container',
    ) as HTMLElement;

    // Pause
    fireEvent.mouseEnter(container);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Resume
    fireEvent.mouseLeave(container);

    // Animation should be running again (no error)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(container).toBeInTheDocument();
  });

  it('generates valid mailto href for valid email prefixes', () => {
    render(<EmailLink />);

    // Advance time to get a valid email prefix
    act(() => {
      vi.advanceTimersByTime(150); // Type out 'hi'
    });

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe(`mailto:${profile.email}`);
  });

  /**
   * Three of the joke aliases are not valid email local-parts, including
   * "but not this :(  ". Those used to replace the anchor with an
   * aria-disabled, unfocusable span, leaving the contact page with no way to
   * reach anyone for roughly a fifth of the animation cycle.
   */
  it('keeps a working email link through the entire animation cycle', () => {
    render(<EmailLink loopMessage />);

    for (let elapsed = 0; elapsed < 60_000; elapsed += 250) {
      act(() => {
        vi.advanceTimersByTime(250);
      });

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `mailto:${profile.email}`);
      expect(link).not.toHaveAttribute('aria-disabled');
    }
  });

  it('names the link by its real destination, not the animated alias', () => {
    render(<EmailLink />);

    act(() => {
      vi.advanceTimersByTime(50 * 200);
    });

    // The alias changes ~20x/second; an accessible name that mutated with it
    // would be unusable, so the visible text is decorative.
    expect(
      screen.getByRole('link', { name: `Email ${profile.email}` }),
    ).toBeInTheDocument();
    expect(document.querySelector('.contact-email-prefix')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('loops messages when loopMessage is true', async () => {
    render(<EmailLink loopMessage={true} />);

    // Advance through all messages
    act(() => {
      vi.advanceTimersByTime(50 * 1000);
    });

    // Component should still be active and rendering
    const container = document.querySelector('.contact-email-container');
    expect(container).toBeInTheDocument();
  });
});
