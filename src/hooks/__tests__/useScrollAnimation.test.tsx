import { act, render } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  useScrollAnimation,
  useStaggeredAnimation,
} from '../useScrollAnimation';

// Mock IntersectionObserver
let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();

beforeEach(() => {
  window.IntersectionObserver = vi.fn().mockImplementation((callback) => {
    intersectionCallback = callback;
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: vi.fn(),
    };
  });

  // Mock matchMedia - defaults to not preferring reduced motion
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    media: '',
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

// Test component that uses the hook
const TestScrollComponent: React.FC<{
  onRender?: (isVisible: boolean) => void;
}> = ({ onRender }) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  onRender?.(isVisible);
  return (
    <div ref={ref} data-testid="scroll-element" data-visible={isVisible} />
  );
};

const TestStaggeredComponent: React.FC<{
  count: number;
  onRender?: (visibleItems: boolean[]) => void;
}> = ({ count, onRender }) => {
  const { containerRef, visibleItems } = useStaggeredAnimation(count);
  onRender?.(visibleItems);
  return <div ref={containerRef} data-testid="stagger-container" />;
};

describe('useScrollAnimation', () => {
  it('returns ref and isVisible state', () => {
    let capturedVisible = false;
    render(<TestScrollComponent onRender={(v) => (capturedVisible = v)} />);

    expect(
      document.querySelector('[data-testid="scroll-element"]'),
    ).toBeInTheDocument();
    expect(capturedVisible).toBe(false);
  });

  it('starts with isVisible false', () => {
    render(<TestScrollComponent />);

    const element = document.querySelector('[data-testid="scroll-element"]');
    expect(element).toHaveAttribute('data-visible', 'false');
  });

  it('creates an IntersectionObserver', () => {
    render(<TestScrollComponent />);

    expect(window.IntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalled();
  });

  it('sets isVisible true when element intersects', () => {
    render(<TestScrollComponent />);

    // Simulate intersection - wrap in act since it triggers state update
    act(() => {
      intersectionCallback([
        { isIntersecting: true } as IntersectionObserverEntry,
      ]);
    });

    const element = document.querySelector('[data-testid="scroll-element"]');
    expect(element).toHaveAttribute('data-visible', 'true');
  });

  it('sets isVisible true immediately when user prefers reduced motion', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
    }));

    render(<TestScrollComponent />);

    const element = document.querySelector('[data-testid="scroll-element"]');
    expect(element).toHaveAttribute('data-visible', 'true');
  });
});

describe('useStaggeredAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns containerRef and visibleItems array', () => {
    let capturedItems: boolean[] = [];
    render(
      <TestStaggeredComponent
        count={3}
        onRender={(v) => (capturedItems = v)}
      />,
    );

    expect(capturedItems).toHaveLength(3);
  });

  it('starts with all items not visible', () => {
    let capturedItems: boolean[] = [];
    render(
      <TestStaggeredComponent
        count={5}
        onRender={(v) => (capturedItems = v)}
      />,
    );

    expect(capturedItems).toEqual([false, false, false, false, false]);
  });

  it('creates correct length array based on itemCount', () => {
    let capturedItems: boolean[] = [];
    render(
      <TestStaggeredComponent
        count={10}
        onRender={(v) => (capturedItems = v)}
      />,
    );

    expect(capturedItems).toHaveLength(10);
  });

  it('sets all items visible when user prefers reduced motion', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
    }));

    let capturedItems: boolean[] = [];
    render(
      <TestStaggeredComponent
        count={3}
        onRender={(v) => (capturedItems = v)}
      />,
    );

    expect(capturedItems).toEqual([true, true, true]);
  });
});
