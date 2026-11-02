import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useLiveAge from '../useLiveAge';

const INITIAL = '36.42';

let renders = 0;

function Subject() {
  renders += 1;
  const { live, ref } = useLiveAge<HTMLSpanElement>(8, INITIAL);

  return (
    <span data-live={live} data-testid="live-age" ref={ref}>
      {INITIAL}
    </span>
  );
}

const age = () => screen.getByTestId('live-age');

function setHidden(hidden: boolean) {
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    value: hidden,
  });
  fireEvent(document, new Event('visibilitychange'));
}

// Reduced motion keeps the snapshot too, and `LiveAge.test.tsx` covers that.
describe('useLiveAge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.matchMedia = (() => ({
      matches: false,
    })) as unknown as typeof matchMedia;
    setHidden(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('upgrades to the requested precision and marks an active timer live', () => {
    render(<Subject />);

    expect(age()).toHaveTextContent(/^\d+\.\d{8}$/);
    expect(age()).toHaveAttribute('data-live', 'true');
  });

  it('restores the snapshot while hidden and resynchronizes on return', () => {
    render(<Subject />);

    setHidden(true);
    expect(age()).toHaveTextContent(INITIAL);
    expect(age()).toHaveAttribute('data-live', 'false');

    setHidden(false);
    expect(age().textContent).not.toBe(INITIAL);
    expect(age()).toHaveAttribute('data-live', 'true');
  });

  // At full precision the timer reaches 40 ticks a second, so routing the value
  // through state would cost as many renders.
  it('advances the text without a React render per tick', () => {
    render(<Subject />);
    const rendersAfterMount = renders;
    const firstReading = age().textContent;

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(age().textContent).not.toBe(firstReading);
    expect(renders).toBe(rendersAfterMount);
  });

  it('restores the snapshot during cleanup', () => {
    const { unmount } = render(<Subject />);
    const node = age();

    unmount();

    expect(node.textContent).toBe(INITIAL);
  });
});
