import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import profile from '@/data/profile.json';
import EmailLink from '../../Contact/EmailLink';

const localPart = profile.email.split('@')[0];

function shownPrefix(): string | null {
  return (
    document.querySelector(
      '.contact-email-link > .contact-email-text .contact-email-prefix',
    )?.textContent ?? null
  );
}

function advance(ms: number): void {
  act(() => vi.advanceTimersByTime(ms));
}

function stubMotion(reduced: boolean) {
  const listeners = new Set<() => void>();
  let matches = reduced;
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return matches;
    },
    addEventListener: (_event: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_event: string, listener: () => void) =>
      listeners.delete(listener),
  }));
  return (next: boolean) =>
    act(() => {
      matches = next;
      for (const listener of listeners) listener();
    });
}

describe('EmailLink', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubMotion(false);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('opens with the real address in static HTML and offers one mail link', () => {
    expect(renderToStaticMarkup(<EmailLink />)).toContain(
      `mailto:${profile.email}`,
    );
    render(<EmailLink />);
    expect(shownPrefix()).toBe(localPart);
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('plays the original gag, keeps a usable destination, then settles on the real address', () => {
    render(<EmailLink />);
    const seen = new Set<string | null>();
    for (let time = 0; time < 60_000; time += 50) {
      advance(50);
      seen.add(shownPrefix());
    }
    expect(seen).toContain('hello');
    expect(seen).toContain('you-can-email-me-at-literally-anything! Really');
    expect(seen).toContain('but not this :(  ');
    expect(seen).toContain('thanks');
    expect(seen).not.toContain('');
    expect(shownPrefix()).toBe(localPart);
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute(
      'href',
      `mailto:${profile.email}`,
    );
    expect(vi.getTimerCount()).toBe(0);

    fireEvent.mouseEnter(screen.getByRole('link'));
    fireEvent.mouseLeave(screen.getByRole('link'));
    advance(5_000);
    expect(shownPrefix()).toBe(localPart);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('can repeat the sequence when explicitly requested', () => {
    render(<EmailLink loopMessage />);
    advance(60_000);
    expect(shownPrefix()).not.toBe(localPart);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('reveals the real address while hovered or focused, then resumes the paused frame', () => {
    render(<EmailLink />);
    advance(2_600);
    const typed = shownPrefix();
    expect(typed).not.toBe(localPart);
    const link = screen.getByRole('link');

    fireEvent.mouseEnter(link);
    expect(shownPrefix()).toBe(localPart);
    advance(2_000);
    fireEvent.focus(link);
    fireEvent.mouseLeave(link);
    expect(shownPrefix()).toBe(localPart);
    advance(2_000);
    fireEvent.blur(link);
    expect(shownPrefix()).toBe(typed);
    advance(100);
    expect(shownPrefix()).not.toBe(typed);
  });

  it('shows the real address for reduced motion and follows preference changes', () => {
    const changeMotion = stubMotion(true);
    render(<EmailLink />);
    advance(10_000);
    expect(shownPrefix()).toBe(localPart);
    expect(vi.getTimerCount()).toBe(0);

    changeMotion(false);
    advance(2_600);
    expect(shownPrefix()).not.toBe(localPart);
    changeMotion(true);
    expect(shownPrefix()).toBe(localPart);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('stops the animation when navigating away', () => {
    const { unmount } = render(<EmailLink />);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
