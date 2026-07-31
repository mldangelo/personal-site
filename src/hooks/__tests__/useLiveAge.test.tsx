import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ageAt, agePlaceholder } from '@/lib/telemetry';
import useLiveAge from '../useLiveAge';

const TEST_PRECISION = 8;
const INITIAL = '36.42';

function Subject({
  precision = TEST_PRECISION,
  initial = INITIAL,
}: {
  precision?: number;
  initial?: string;
}) {
  const { live, ref } = useLiveAge<HTMLSpanElement>(precision, initial);

  return (
    <span data-live={live} data-testid="live-age" ref={ref}>
      {initial}
    </span>
  );
}

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

  it('preserves the exact server snapshot', () => {
    const html = renderToStaticMarkup(<Subject />);

    expect(html).toContain(`>${INITIAL}<`);
    expect(html).toContain('data-live="false"');
  });

  it('uses a digit-free placeholder only when no snapshot is supplied', () => {
    function Placeholder() {
      const { ref } = useLiveAge<HTMLSpanElement>(TEST_PRECISION);
      return <span ref={ref}>{agePlaceholder(TEST_PRECISION)}</span>;
    }

    const html = renderToStaticMarkup(<Placeholder />);

    expect(html).not.toMatch(/\d/);
  });

  it('upgrades to the requested precision and marks an active timer live', () => {
    render(<Subject />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const age = screen.getByTestId('live-age');
    expect(age).toHaveTextContent(
      new RegExp(`^\\d+\\.\\d{${TEST_PRECISION}}$`),
    );
    expect(age).toHaveAttribute('data-live', 'true');
  });

  it('keeps the dated snapshot under reduced motion', () => {
    setReducedMotion(true);
    render(<Subject />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const age = screen.getByTestId('live-age');
    expect(age).toHaveTextContent(INITIAL);
    expect(age).toHaveAttribute('data-live', 'false');
  });

  it('restores the snapshot while hidden and resynchronizes on return', () => {
    render(<Subject />);

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByTestId('live-age')).toHaveAttribute('data-live', 'true');

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    fireEvent(document, new Event('visibilitychange'));

    expect(screen.getByTestId('live-age')).toHaveTextContent(INITIAL);
    expect(screen.getByTestId('live-age')).toHaveAttribute(
      'data-live',
      'false',
    );

    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    fireEvent(document, new Event('visibilitychange'));

    expect(screen.getByTestId('live-age').textContent).not.toBe(INITIAL);
    expect(screen.getByTestId('live-age')).toHaveAttribute('data-live', 'true');
  });

  it('advances the text without a React render per tick', () => {
    let renders = 0;

    function Counted() {
      renders += 1;
      const { live, ref } = useLiveAge<HTMLSpanElement>(
        TEST_PRECISION,
        INITIAL,
      );

      return (
        <span data-live={live} data-testid="live-age" ref={ref}>
          {INITIAL}
        </span>
      );
    }

    render(<Counted />);
    const rendersAfterMount = renders;
    const firstReading = screen.getByTestId('live-age').textContent;

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('live-age').textContent).not.toBe(firstReading);
    expect(renders).toBe(rendersAfterMount);
  });

  it('restores the snapshot during cleanup', () => {
    const { container, unmount } = render(<Subject />);
    const node = container.querySelector('span');

    expect(node?.textContent).not.toBe(INITIAL);
    unmount();
    expect(node?.textContent).toBe(INITIAL);
  });

  it('computes a deterministic reading for the timer callback', () => {
    const now = Date.now();
    expect(ageAt(now, TEST_PRECISION)).toMatch(/^\d+\.\d{8}$/);
  });
});
