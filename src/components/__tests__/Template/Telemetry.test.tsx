import { act, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AGE_PRECISION_HERO,
  ageAt,
  COMPUTING_SINCE,
  COUNTRIES_VISITED,
  CURRENT_CITY,
} from '../../../lib/telemetry';
import Telemetry from '../../Template/Telemetry';

/** Stubs matchMedia so the hook can read a reduced-motion preference. */
function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

describe('Telemetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('labels every reading', () => {
    render(<Telemetry />);

    for (const label of [
      'Age',
      'Countries visited',
      'Computing since',
      'Based in',
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('reads its static values from the shared telemetry source', () => {
    render(<Telemetry />);

    expect(screen.getByText(String(COUNTRIES_VISITED))).toBeInTheDocument();
    expect(screen.getByText(String(COMPUTING_SINCE))).toBeInTheDocument();
    expect(screen.getByText(CURRENT_CITY)).toBeInTheDocument();
  });

  it('renders a fixed-width placeholder on the server so hydration cannot shift the layout', () => {
    const html = renderToStaticMarkup(<Telemetry />);
    const live = html.match(
      /telemetry-value--live[^>]*>.*?telemetry-number">([^<]*)</,
    )?.[1];

    expect(live).toBeDefined();
    expect(live).not.toMatch(/\d/);
    expect(live).toHaveLength(ageAt(Date.now(), AGE_PRECISION_HERO).length);
  });

  it('replaces the placeholder with a live reading once the clock runs', () => {
    const { container } = render(<Telemetry />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(
      container.querySelector('.telemetry-value--live')?.textContent,
    ).toMatch(/^\d+\.\d+$/);
  });

  it('takes a single reading under prefers-reduced-motion instead of animating', () => {
    setReducedMotion(true);
    const { container } = render(<Telemetry />);
    const live = () =>
      container.querySelector('.telemetry-value--live')?.textContent;

    // The reading is still real and still accurate — it just holds still.
    expect(live()).toMatch(/^\d+\.\d+$/);
    const settled = live();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(live()).toBe(settled);
  });

  it('marks only the age as live, so the signal colour stays meaningful', () => {
    const { container } = render(<Telemetry />);

    expect(container.querySelectorAll('.telemetry-value--live')).toHaveLength(
      1,
    );
    expect(container.querySelectorAll('.telemetry-cell')).toHaveLength(4);
  });

  it('stops ticking when unmounted', () => {
    const clearInterval = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = render(<Telemetry />);

    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });
});
