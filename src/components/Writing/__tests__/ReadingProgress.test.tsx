import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ReadingProgress, { calculateReadingProgress } from '../ReadingProgress';

function setReducedMotion(matches: boolean) {
  window.matchMedia = (() => ({ matches })) as unknown as typeof matchMedia;
}

function renderIndicator() {
  const view = render(
    <article className="post-page">
      <ReadingProgress />
    </article>,
  );

  return {
    ...view,
    indicator: view.container.querySelector('.reading-progress-indicator'),
  };
}

describe('calculateReadingProgress', () => {
  it.each([
    ['before the article', 2000, 0, 0],
    ['midway through', 2000, 700, 0.5],
    ['after the article', 2000, 1500, 1],
    ['for an article that fits the viewport', 600, 0, 1],
  ])('reads %s', (_where, articleHeight, scrollY, progress) => {
    expect(
      calculateReadingProgress({
        articleHeight,
        articleTop: 100,
        viewportHeight: 800,
        scrollY,
      }),
    ).toBe(progress);
  });
});

describe('ReadingProgress', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('updates through one frame, and cancels a pending one on unmount', () => {
    let scrollY = 700;
    const frames: FrameRequestCallback[] = [];

    setReducedMotion(false);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
    vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => scrollY);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(
      2000,
    );
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ top: 100 - scrollY }) as DOMRect,
    );
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) =>
      frames.push(callback),
    );
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    const unlisten = vi.spyOn(window, 'removeEventListener');

    const { indicator, unmount } = renderIndicator();
    expect(indicator).toHaveStyle('--reading-progress: 0.5');

    scrollY = 1500;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
      frames.shift()?.(0);
    });
    expect(indicator).toHaveStyle('--reading-progress: 1');

    window.dispatchEvent(new Event('resize'));
    expect(frames).toHaveLength(1);

    unmount();
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(unlisten).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('does no scroll work when the browser reports reduced motion', () => {
    setReducedMotion(true);
    const addEventListener = vi.spyOn(window, 'addEventListener');

    const { indicator } = renderIndicator();

    expect(addEventListener).not.toHaveBeenCalledWith(
      'scroll',
      expect.anything(),
      expect.anything(),
    );
    expect(indicator).toHaveStyle('--reading-progress: 0');
  });
});
