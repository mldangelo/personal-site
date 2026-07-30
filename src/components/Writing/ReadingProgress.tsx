'use client';

import { useEffect, useRef } from 'react';

import usePrefersReducedMotion, {
  REDUCED_MOTION_QUERY,
} from '@/hooks/usePrefersReducedMotion';

interface ReadingProgressInput {
  articleHeight: number;
  articleTop: number;
  scrollY: number;
  viewportHeight: number;
}

export function calculateReadingProgress({
  articleHeight,
  articleTop,
  scrollY,
  viewportHeight,
}: ReadingProgressInput): number {
  const readingDistance = articleHeight - viewportHeight;

  if (readingDistance <= 0) {
    return 1;
  }

  return Math.min(1, Math.max(0, (scrollY - articleTop) / readingDistance));
}

/**
 * A one-pixel article progress reading directly beneath the fixed header.
 *
 * The transform is written to the element instead of React state so scrolling
 * does not rerender the article. Under reduced motion the bar stays absent and
 * scroll work is skipped or removed as soon as the preference resolves.
 */
export default function ReadingProgress() {
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const indicator = indicatorRef.current;
    const article = indicator?.closest<HTMLElement>('.post-page');
    const shouldReduceMotion =
      prefersReducedMotion ||
      Boolean(window.matchMedia?.(REDUCED_MOTION_QUERY).matches);

    if (!indicator || !article || shouldReduceMotion) {
      indicator?.style.setProperty('--reading-progress', '0');
      return;
    }

    let animationFrame: number | null = null;

    const update = () => {
      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const progress = calculateReadingProgress({
        articleHeight: article.offsetHeight,
        articleTop,
        scrollY: window.scrollY,
        viewportHeight: window.innerHeight,
      });

      indicator.style.setProperty('--reading-progress', String(progress));
    };

    const scheduleUpdate = () => {
      if (animationFrame !== null) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        update();
      });
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div className="reading-progress" aria-hidden="true">
      <span ref={indicatorRef} className="reading-progress-indicator" />
    </div>
  );
}
