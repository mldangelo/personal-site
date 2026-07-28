import { act, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import BuildClock from '../../Stats/BuildClock';

const BUILT_AT = Date.UTC(2026, 6, 28, 12, 0, 0);
const INITIAL = '2026-07-28';

function subject() {
  return <BuildClock builtAt={BUILT_AT} initial={INITIAL} />;
}

describe('BuildClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(BUILT_AT + 4 * 86400000 + 3 * 3600000 + 12 * 60000);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the build date rather than a duration with the power off', () => {
    // Elapsed time at build is `00:00:00`, which would tell every reader the
    // deploy had just happened. The date is the reading the server can prove.
    const html = renderToStaticMarkup(subject());

    expect(html).toContain(`>${INITIAL}<`);
    expect(html).toContain('>UTC<');
    expect(html).not.toContain('00:00:00');
  });

  it('leaves the static date in ordinary ink', () => {
    // A date is not a live value, so it does not get the signal colour.
    expect(renderToStaticMarkup(subject())).toContain('data-live="false"');
  });

  it('counts up from the build once the client is driving', () => {
    render(subject());

    const value = document.querySelector('.stat-readout-value');
    expect(value?.textContent).toBe('4d 03:12:00');
    expect(value).toHaveAttribute('data-live', 'true');
    expect(document.querySelector('.stat-readout-note')?.textContent).toBe(
      'ago',
    );
  });

  it('advances once a second, not at the age readout cadence', () => {
    render(subject());

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(document.querySelector('.stat-readout-value')?.textContent).toBe(
      '4d 03:12:01',
    );
  });

  it('reserves room for the widest form the clock takes', () => {
    render(subject());

    expect(
      document.querySelector('.stat-readout-value')?.getAttribute('style'),
    ).toContain('--readout-width: 12ch');
  });
});
