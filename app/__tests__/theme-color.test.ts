import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import {
  RESOLVED_THEME_COLOR_ATTRIBUTE,
  THEME_COLOR_TOKEN,
} from '@/lib/theme-color';
import { readColorToken } from '@/lib/tokens';
import RootLayout from '../layout';

// `next/font/local` only exists as a build-time transform, so importing the
// root layout needs it stubbed. `vi.mock` is hoisted above the static import.
vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'font-mock', className: 'font-mock', style: {} }),
}));

const LIGHT = readColorToken(THEME_COLOR_TOKEN, 'light');
const DARK = readColorToken(THEME_COLOR_TOKEN, 'dark');

function renderedHead(): string {
  return (
    /<head>([\s\S]*?)<\/head>/.exec(
      renderToStaticMarkup(createElement(RootLayout, { children: null })),
    )?.[1] ?? ''
  );
}

describe('theme-color', () => {
  it('uses two different page-background colours', () => {
    expect(LIGHT).not.toBe(DARK);
    expect(LIGHT).not.toBe(readColorToken('--color-bg', 'light'));
    expect(DARK).not.toBe(readColorToken('--color-bg', 'dark'));
  });

  it('ships the only no-JavaScript theme, light, as its fallback', () => {
    const head = renderedHead();

    expect(head).toContain(
      `<noscript><meta name="theme-color" content="${LIGHT}"></noscript>`,
    );
    expect(head).not.toContain('media="(prefers-color-scheme:');
  });

  it('runs the resolved-theme bootstrap before first paint', () => {
    const head = renderedHead();

    expect(head).toMatch(/<script id="theme-init">\(function\(\)\{/);
    expect(head).not.toContain('__next_s');
    expect(head).toContain(JSON.stringify(LIGHT));
    expect(head).toContain(JSON.stringify(DARK));
    expect(head).toContain(RESOLVED_THEME_COLOR_ATTRIBUTE);
  });
});
