import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  useScrollAnimation,
  useStaggeredAnimation,
} from '../useScrollAnimation';

// Mock IntersectionObserver
let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback as (
      entries: IntersectionObserverEntry[],
    ) => void;
  }

  observe = mockObserve;
  unobserve = mockUnobserve;
  disconnect = mockDisconnect;
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeEach(() => {
  window.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;

  // Mock matchMedia - defaults to not preferring reduced motion
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    media: '',
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

interface TestScrollComponentProps {
  onRender?: (isVisible: boolean) => void;
}

function TestScrollComponent({ onRender }: TestScrollComponentProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  onRender?.(isVisible);
  return (
    <div ref={ref} data-testid="scroll-element" data-visible={isVisible} />
  );
}

interface TestStaggeredComponentProps {
  count: number;
  onRender?: (visibleItems: boolean[]) => void;
}

function TestStaggeredComponent({
  count,
  onRender,
}: TestStaggeredComponentProps) {
  const { containerRef, visibleItems } = useStaggeredAnimation(count);
  onRender?.(visibleItems);
  return <div ref={containerRef} data-testid="stagger-container" />;
}

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

    // Verify the observer was created and observe was called
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
