import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ageAt } from '@/lib/telemetry';
import useLiveAge from '../useLiveAge';

const TEST_PRECISION = 8;

function LiveAge({ precision = TEST_PRECISION }: { precision?: number }) {
  return <span data-testid="live-age">{useLiveAge(precision)}</span>;
}

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

describe('useLiveAge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setReducedMotion(false);
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a fixed-width placeholder on the server', () => {
    const html = renderToStaticMarkup(<LiveAge />);
    const live = html.match(/data-testid="live-age">([^<]*)</)?.[1];

    expect(live).toBeDefined();
    expect(live).not.toMatch(/\d/);
    expect(live).toHaveLength(ageAt(Date.now(), TEST_PRECISION).length);
  });

  it('replaces the placeholder with a live reading', () => {
    render(<LiveAge />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByTestId('live-age')).toHaveTextContent(/^\d+\.\d+$/);
  });

  it('respects the requested precision', () => {
    render(<LiveAge precision={5} />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByTestId('live-age')).toHaveTextContent(/^\d+\.\d{5}$/);
  });

  it('takes one reading under reduced motion instead of animating', () => {
    setReducedMotion(true);
    render(<LiveAge />);
    const settled = screen.getByTestId('live-age').textContent;

    expect(settled).toMatch(/^\d+\.\d+$/);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('live-age')).toHaveTextContent(settled ?? '');
  });

  it('pauses while hidden and resynchronizes when the page returns', () => {
    render(<LiveAge />);

    act(() => {
      vi.advanceTimersByTime(400);
    });
    const beforeHide = screen.getByTestId('live-age').textContent;

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    fireEvent(document, new Event('visibilitychange'));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId('live-age')).toHaveTextContent(beforeHide ?? '');

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    fireEvent(document, new Event('visibilitychange'));
    expect(screen.getByTestId('live-age').textContent).not.toBe(beforeHide);
  });

  it('stops ticking when unmounted', () => {
    const clearInterval = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = render(<LiveAge />);

    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });
});
