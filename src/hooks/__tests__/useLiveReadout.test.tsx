import { act, render, screen } from '@testing-library/react';
import { useCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useLiveReadout from '../useLiveReadout';

const INITIAL = '2026-07-28';
const INTERVAL = 1000;

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

function Readout({ initial = INITIAL }: { initial?: string }) {
  const read = useCallback((now: number) => `t+${now}`, []);
  const { ref, live } = useLiveReadout<HTMLSpanElement>(
    read,
    INTERVAL,
    initial,
  );

  return (
    <span data-live={live} data-testid="readout" ref={ref}>
      {initial}
    </span>
  );
}

describe('useLiveReadout', () => {
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

  it('renders the server value and reports itself not live', () => {
    // Effects flush during Testing Library's `render()`, so the unpowered
    // markup — what a crawler, a no-JS reader, and a printed page get — has to
    // be checked through the server renderer.
    const html = renderToStaticMarkup(<Readout />);

    expect(html).toContain(`>${INITIAL}<`);
    expect(html).toContain('data-live="false"');
  });

  it('takes over the text node and says so', () => {
    render(<Readout />);

    const node = screen.getByTestId('readout');
    expect(node.textContent).toMatch(/^t\+\d+$/);
    expect(node).toHaveAttribute('data-live', 'true');
  });

  it('restores the value the server rendered when it lets go', () => {
    // Not a placeholder: whatever the element was handed. A remount must not
    // inherit a stale reading, and it must not lose the honest one either.
    const { unmount, container } = render(<Readout />);
    const node = container.querySelector('span');

    expect(node?.textContent).not.toBe(INITIAL);

    unmount();

    expect(node?.textContent).toBe(INITIAL);
  });

  it('keeps the server value while the tab is hidden at mount', () => {
    // Nothing has been read yet, so nothing may claim to be live.
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });

    render(<Readout />);

    const node = screen.getByTestId('readout');
    expect(node.textContent).toBe(INITIAL);
    expect(node).toHaveAttribute('data-live', 'false');
  });

  it('advances on the interval it was given', () => {
    render(<Readout />);
    const first = screen.getByTestId('readout').textContent;

    act(() => {
      vi.advanceTimersByTime(INTERVAL);
    });

    expect(screen.getByTestId('readout').textContent).not.toBe(first);
  });

  it('takes one reading under reduced motion instead of ticking', () => {
    setReducedMotion(true);
    render(<Readout />);
    const settled = screen.getByTestId('readout').textContent;

    act(() => {
      vi.advanceTimersByTime(10 * INTERVAL);
    });

    expect(screen.getByTestId('readout').textContent).toBe(settled);
  });
});
