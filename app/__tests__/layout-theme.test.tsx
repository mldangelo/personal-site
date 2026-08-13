import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import {
  THEME_COLOR_TOKEN,
  type ThemeColors,
  themeInitScript,
} from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';
import RootLayout from '../layout';

vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'mock-font' }),
}));

/**
 * The same read `app/layout.tsx` makes, so this compares the shipped body
 * against the generator's output rather than against a second palette.
 */
const CHROME_COLORS: ThemeColors = {
  light: readColorToken(THEME_COLOR_TOKEN, 'light'),
  dark: readColorToken(THEME_COLOR_TOKEN, 'dark'),
};

describe('RootLayout theme bootstrap', () => {
  it('ships the initializer as a parser-executed head script', () => {
    // `next/script` only emits the App Router's deferred `self.__next_s` queue
    // under a `HeadManagerContext` with `appDir`. Without the provider a
    // `beforeInteractive` `<Script>` renders to nothing and the second
    // assertion below cannot fail. See `app/__tests__/theme-color.test.ts`.
    const html = renderToStaticMarkup(
      <HeadManagerContext.Provider value={{ appDir: true }}>
        <RootLayout>
          <main>Content</main>
        </RootLayout>
      </HeadManagerContext.Provider>,
    );
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
    const script = head?.match(/<script id="theme-init">([\s\S]*?)<\/script>/);

    expect(script?.[1]).toBe(themeInitScript(CHROME_COLORS));
    expect(script?.[1]).not.toContain('self.__next_s');
  });
});
