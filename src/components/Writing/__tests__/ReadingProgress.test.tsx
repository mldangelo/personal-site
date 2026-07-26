import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';
import ReadingProgress, { calculateReadingProgress } from '../ReadingProgress';

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  REDUCED_MOTION_QUERY: '(prefers-reduced-motion: reduce)',
  default: vi.fn(),
}));

const mockedUsePrefersReducedMotion = vi.mocked(usePrefersReducedMotion);

describe('calculateReadingProgress', () => {
  it('clamps readings before, midway through, and after the article', () => {
    const dimensions = {
      articleHeight: 2000,
      articleTop: 100,
      viewportHeight: 800,
    };

    expect(calculateReadingProgress({ ...dimensions, scrollY: 0 })).toBe(0);
    expect(calculateReadingProgress({ ...dimensions, scrollY: 700 })).toBe(0.5);
    expect(calculateReadingProgress({ ...dimensions, scrollY: 1500 })).toBe(1);
  });

  it('is complete when the entire article fits in the viewport', () => {
    expect(
      calculateReadingProgress({
        articleHeight: 600,
        articleTop: 100,
        scrollY: 0,
        viewportHeight: 800,
      }),
    ).toBe(1);
  });
});

describe('ReadingProgress', () => {
  beforeEach(() => {
    mockedUsePrefersReducedMotion.mockReturnValue(false);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('updates on scroll through one animation frame', () => {
    let scrollY = 700;
    const frameCallbacks: FrameRequestCallback[] = [];

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => scrollY,
    });
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(
      2000,
    );
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          bottom: 2100 - scrollY,
          height: 2000,
          left: 0,
          right: 640,
          top: 100 - scrollY,
          width: 640,
          x: 0,
          y: 100 - scrollY,
          toJSON: () => ({}),
        }) as DOMRect,
    );
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frameCallbacks.push(callback);
      return frameCallbacks.length;
    });

    const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    const { container, unmount } = render(
      <article className="post-page">
        <ReadingProgress />
      </article>,
    );
    const indicator = container.querySelector<HTMLElement>(
      '.reading-progress-indicator',
    );

    expect(indicator).toHaveStyle('--reading-progress: 0.5');

    scrollY = 1500;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
      frameCallbacks.shift()?.(0);
    });

    expect(indicator).toHaveStyle('--reading-progress: 1');

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    const pendingFrame = frameCallbacks.length;
    unmount();

    expect(pendingFrame).toBeGreaterThan(0);
    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(
      removeEventListener.mock.calls.some(([event]) => event === 'scroll'),
    ).toBe(true);
  });

  it('does not attach scroll work when the browser reports reduced motion', () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const { container } = render(
      <article className="post-page">
        <ReadingProgress />
      </article>,
    );

    expect(
      addEventListener.mock.calls.some(([event]) => event === 'scroll'),
    ).toBe(false);
    expect(container.querySelector('.reading-progress-indicator')).toHaveStyle(
      '--reading-progress: 0',
    );
  });
});
