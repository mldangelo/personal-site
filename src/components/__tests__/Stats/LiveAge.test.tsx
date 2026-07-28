import { act, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AGE_PRECISION_FULL, agePlaceholder } from '@/lib/telemetry';

import LiveAge from '../../Stats/LiveAge';

const INITIAL = '36.42';
const NOTE = 'as of 2026-07-28';

function subject() {
  return (
    <LiveAge initial={INITIAL} note={NOTE} precision={AGE_PRECISION_FULL} />
  );
}

describe('LiveAge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
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

  it('reads as a real age with the power off', () => {
    // The regression this exists for: `out/stats/index.html` shipped
    // `--.-----------` as the site's most distinctive value to every crawler,
    // every reader with JavaScript off, and every printed copy.
    const html = renderToStaticMarkup(subject());

    expect(html).toContain(`>${INITIAL}<`);
    expect(html).not.toContain('--.');
    expect(html).toMatch(/\d+\.\d{2}/);
  });

  it('says when the unpowered reading was taken', () => {
    // Without the note the build-time value reads as the current age, and it
    // goes visibly stale between deploys.
    const html = renderToStaticMarkup(subject());

    expect(html).toContain(NOTE);
    expect(html).toContain('stat-readout-note');
  });

  it('does not paint the build-time reading as a live one', () => {
    // Amber means live. The server's value is an ordinary measurement.
    const html = renderToStaticMarkup(subject());

    expect(html).toContain('data-live="false"');
  });

  it('upgrades the reading to full precision on mount', () => {
    render(subject());

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const value = document.querySelector('.stat-readout-value');
    expect(value?.textContent).toMatch(
      new RegExp(`^\\d+\\.\\d{${AGE_PRECISION_FULL}}$`),
    );
    expect(value).toHaveAttribute('data-live', 'true');
  });

  it('drops the staleness note once the reading is live', () => {
    render(subject());

    expect(screen.queryByText(NOTE)).not.toBeInTheDocument();
  });

  it('reserves the width the upgrade will need', () => {
    // Two decimals become eleven. Without the reservation the swap can resize
    // the cell the readout sits in.
    render(subject());

    const value = document.querySelector('.stat-readout-value');
    const width = agePlaceholder(AGE_PRECISION_FULL).length;

    expect(value?.getAttribute('style')).toContain(
      `--readout-width: ${width}ch`,
    );
    expect(width).toBeGreaterThan(INITIAL.length);
  });
});
