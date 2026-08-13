import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: false,
    // Run in a non-UTC zone so date guards can actually fail. Every CI runner
    // is UTC, where a UTC-pinned formatter and a host-local one produce the
    // same string — which made the guard in
    // `src/data/__tests__/stats/site.test.ts` unable to catch a regression on
    // the machines that publish the site.
    env: { TZ: 'America/Los_Angeles' },
    setupFiles: ['./vitest.setup.tsx'],
    include: ['**/__tests__/**/*.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'build', 'out'],
    sequence: {
      shuffle: true,
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/__tests__/**',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
      ],
    },
    css: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
