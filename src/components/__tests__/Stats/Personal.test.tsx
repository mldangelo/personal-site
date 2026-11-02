import { act, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AGE_PRECISION_FULL } from '@/lib/telemetry';

import Personal from '../../Stats/Personal';

describe('Personal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  // Effects flush during Testing Library's `render()`, so the unpowered markup
  // in `out/stats/index.html` has to be rendered this way.
  it('ships a real age to readers with no JavaScript', () => {
    const html = renderToStaticMarkup(<Personal />);

    expect(html).toMatch(/>\d+\.\d{2}</);
    expect(html).toMatch(/as of \d{4}-\d{2}-\d{2}/);
  });

  it('upgrades the age to full precision in the browser', () => {
    render(<Personal />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.querySelector('.stat-readout-value')?.textContent).toMatch(
      new RegExp(`^\\d+\\.\\d{${AGE_PRECISION_FULL}}$`),
    );
  });
});
