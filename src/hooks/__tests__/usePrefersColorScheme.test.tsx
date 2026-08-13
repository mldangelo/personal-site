import { act, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { DARK_SCHEME_QUERY } from '@/lib/theme';
import usePrefersColorScheme from '../usePrefersColorScheme';

function Scheme() {
  const scheme = usePrefersColorScheme();

  return <span data-testid="scheme">{scheme ?? 'unknown'}</span>;
}

/** A `matchMedia` stand-in whose preference can be flipped mid-test. */
function stubColorScheme(prefersDark: boolean) {
  const listeners = new Set<() => void>();
  let matches = prefersDark;
  let removeEventListenerCalls = 0;

  const media = {
    get matches() {
      return matches;
    },
    media: DARK_SCHEME_QUERY,
    addEventListener: (_type: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: () => void) => {
      removeEventListenerCalls += 1;
      listeners.delete(listener);
    },
  };

  const matchMedia = vi.fn(() => media);
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMedia,
  });

  return {
    matchMedia,
    /** What a device switching to dark at sunset looks like. */
    flipTo(next: boolean) {
      matches = next;
      act(() => {
        for (const listener of listeners) listener();
      });
    },
    listenerCount: () => listeners.size,
    removeEventListenerCalls: () => removeEventListenerCalls,
  };
}

function withoutMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: undefined,
  });
}

describe('usePrefersColorScheme', () => {
  it('reports nothing on the server, where there is no device to ask', () => {
    withoutMatchMedia();

    expect(renderToStaticMarkup(<Scheme />)).toContain('unknown');
  });

  it('reads the device preference on mount', () => {
    stubColorScheme(true);
    render(<Scheme />);

    expect(screen.getByTestId('scheme')).toHaveTextContent('dark');
  });

  it('reads a light device preference', () => {
    stubColorScheme(false);
    render(<Scheme />);

    expect(screen.getByTestId('scheme')).toHaveTextContent('light');
  });

  it('asks for the dark-scheme query', () => {
    const media = stubColorScheme(false);
    render(<Scheme />);

    expect(media.matchMedia).toHaveBeenCalledWith(DARK_SCHEME_QUERY);
  });

  it('follows the device when it changes, without a remount', () => {
    // The read this replaced sampled once at mount, so a visitor who arrived
    // in the morning stayed light when their device flipped at sunset.
    const media = stubColorScheme(false);
    render(<Scheme />);

    expect(screen.getByTestId('scheme')).toHaveTextContent('light');

    media.flipTo(true);
    expect(screen.getByTestId('scheme')).toHaveTextContent('dark');

    media.flipTo(false);
    expect(screen.getByTestId('scheme')).toHaveTextContent('light');
  });

  it('unsubscribes on unmount', () => {
    const media = stubColorScheme(false);
    const { unmount } = render(<Scheme />);

    expect(media.listenerCount()).toBe(1);

    unmount();

    expect(media.removeEventListenerCalls()).toBe(1);
    expect(media.listenerCount()).toBe(0);
  });

  it('reports nothing when matchMedia is unavailable', () => {
    withoutMatchMedia();

    expect(() => render(<Scheme />)).not.toThrow();
    expect(screen.getByTestId('scheme')).toHaveTextContent('unknown');
  });
});
