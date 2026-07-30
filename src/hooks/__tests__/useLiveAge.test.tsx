import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ageAt, agePlaceholder } from '@/lib/telemetry';
import useLiveAge from '../useLiveAge';

const TEST_PRECISION = 8;

function LiveAge({
  precision = TEST_PRECISION,
  initial,
}: {
  precision?: number;
  initial?: string;
}) {
  const { ref } = useLiveAge<HTMLSpanElement>(precision, initial);

  return (
    <span data-testid="live-age" ref={ref}>
      {initial ?? agePlaceholder(precision)}
    </span>
  );
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

  it('renders the initial reading it was given on the server', () => {
    // What the stats page threads through: the age the build measured, at a
    // precision the build can honestly claim. Effects flush during Testing
    // Library's `render()`, so the server path has to be checked this way.
    const initial = ageAt(Date.now(), 2);
    const html = renderToStaticMarkup(<LiveAge initial={initial} />);

    expect(html).toContain(`>${initial}<`);
    expect(html).not.toContain('--.');
  });

  it('replaces the placeholder with a live reading', () => {
    render(<LiveAge />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByTestId('live-age')).toHaveTextContent(/^\d+\.\d+$/);
  });

  it('upgrades the precision of the reading it was handed', () => {
    const initial = ageAt(Date.now(), 2);

    render(<LiveAge initial={initial} />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByTestId('live-age')).toHaveTextContent(
      new RegExp(`^\\d+\\.\\d{${TEST_PRECISION}}$`),
    );
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

  it('advances the readout without re-rendering React', () => {
    // The whole point of writing to the text node directly. At the precision
    // the stats page uses the timer runs at the 25ms floor, so routing this
    // through state meant 40 React renders a second.
    let renders = 0;

    function Counted() {
      renders += 1;
      const { ref } = useLiveAge<HTMLSpanElement>(TEST_PRECISION);

      return (
        <span data-testid="live-age" ref={ref}>
          {agePlaceholder(TEST_PRECISION)}
        </span>
      );
    }

    render(<Counted />);
    const rendersAfterMount = renders;
    const firstReading = screen.getByTestId('live-age').textContent;

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // The reading moved...
    expect(screen.getByTestId('live-age')).toHaveTextContent(/^\d+\.\d+$/);
    expect(screen.getByTestId('live-age').textContent).not.toBe(firstReading);
    // ...and React never rendered again to make that happen.
    expect(renders).toBe(rendersAfterMount);
  });

  it('costs one extra render to come alive, and no more', () => {
    // `live` exists so a readout can spend the signal colour only once the
    // client is driving it. It flips once, on mount — the budget is the initial
    // render plus that flip, and nothing per tick.
    let renders = 0;

    function Counted() {
      renders += 1;
      const { ref } = useLiveAge<HTMLSpanElement>(TEST_PRECISION);

      return (
        <span data-testid="live-age" ref={ref}>
          {agePlaceholder(TEST_PRECISION)}
        </span>
      );
    }

    render(<Counted />);

    expect(renders).toBe(2);
  });

  it('stops ticking when unmounted', () => {
    const clearInterval = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = render(<LiveAge />);

    unmount();

    expect(clearInterval).toHaveBeenCalled();
  });
});
