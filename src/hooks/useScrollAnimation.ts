'use client';

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to trigger animations when elements scroll into view
 * Uses Intersection Observer for performant scroll detection
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {},
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

/**
 * Hook to animate multiple children with staggered delays
 */
export function useStaggeredAnimation(itemCount: number, baseDelay = 100) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutIds = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) {
      setVisibleItems(new Array(itemCount).fill(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the animations
          for (let i = 0; i < itemCount; i++) {
            const timeoutId = setTimeout(() => {
              setVisibleItems((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * baseDelay);
            timeoutIds.current.push(timeoutId);
          }
          observer.unobserve(container);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    observer.observe(container);

    return () => {
      observer.unobserve(container);
      // Clear all pending timeouts to prevent state updates after unmount
      timeoutIds.current.forEach((id) => clearTimeout(id));
      timeoutIds.current = [];
    };
  }, [itemCount, baseDelay]);

  return { containerRef, visibleItems };
}

export default useScrollAnimation;
