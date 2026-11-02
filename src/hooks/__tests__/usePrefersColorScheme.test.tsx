import { act, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { DARK_SCHEME_QUERY } from '@/lib/theme';
import usePrefersColorScheme from '../usePrefersColorScheme';

function Scheme() {
  return (
    <span data-testid="scheme">{usePrefersColorScheme() ?? 'unknown'}</span>
  );
}

const scheme = () => screen.getByTestId('scheme');

/** A `matchMedia` stand-in whose preference can be flipped mid-test. */
function stubColorScheme(prefersDark: boolean) {
  const listeners = new Set<() => void>();
  const media = {
    matches: prefersDark,
    addEventListener: (_: string, listener: () => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_: string, listener: () => void) => {
      listeners.delete(listener);
    },
  };

  window.matchMedia = ((query: string) =>
    query === DARK_SCHEME_QUERY ? media : null) as typeof matchMedia;

  return {
    listeners,
    flipTo(next: boolean) {
      media.matches = next;
      act(() => {
        for (const listener of listeners) listener();
      });
    },
  };
}

describe('usePrefersColorScheme', () => {
  it('reports nothing on the server, even where a device could be asked', () => {
    stubColorScheme(true);

    expect(renderToStaticMarkup(<Scheme />)).toContain('unknown');
  });

  it('reads the device on mount and follows it, then unsubscribes', () => {
    const media = stubColorScheme(true);
    const { unmount } = render(<Scheme />);
    expect(scheme()).toHaveTextContent('dark');

    media.flipTo(false);
    expect(scheme()).toHaveTextContent('light');

    media.flipTo(true);
    expect(scheme()).toHaveTextContent('dark');

    unmount();
    expect(media.listeners.size).toBe(0);
  });
});
