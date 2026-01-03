import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// Clean up DOM after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js Image component for tests
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // Filter out Next.js-specific props that cause React warnings on <img>
    const {
      priority: _priority,
      fill: _fill,
      loader: _loader,
      quality: _quality,
      placeholder: _placeholder,
      blurDataURL: _blurDataURL,
      unoptimized: _unoptimized,
      ...imgProps
    } = props;
    // biome-ignore lint/performance/noImgElement: Intentional mock for Next.js Image
    return <img {...imgProps} />;
  },
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
      prefetch: vi.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Global test configuration
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.scrollTo for jsdom
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

// Suppress console errors in tests unless needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
