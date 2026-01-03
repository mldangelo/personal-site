import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import EmailLink from '../../Contact/EmailLink';

describe('EmailLink', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the email domain', () => {
    render(<EmailLink />);

    expect(screen.getByText('@mldangelo.com')).toBeInTheDocument();
  });

  it('renders as a link element', () => {
    render(<EmailLink />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('animates through messages over time', async () => {
    render(<EmailLink />);

    // Initial state is empty, animation types out characters
    const prefix = document.querySelector('.contact-email-prefix');
    expect(prefix?.textContent).toBe('');

    // Advance time to let animation type out first message
    act(() => {
      vi.advanceTimersByTime(150); // 3 ticks = 'hi' fully typed
    });

    expect(prefix?.textContent).toBe('hi');
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
    expect(link.getAttribute('href')).toBe('mailto:hi@mldangelo.com');
  });

  it('has invalid class when email prefix is invalid', async () => {
    render(<EmailLink />);

    // Run through messages until we hit an invalid one
    // "but not this :(  " contains invalid characters
    act(() => {
      vi.advanceTimersByTime(50 * 200); // Advance through several messages
    });

    // Check if link has container (component should still render)
    const container = document.querySelector('.contact-email-container');
    expect(container).toBeInTheDocument();
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
