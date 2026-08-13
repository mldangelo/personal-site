import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { themeInitScript } from '@/lib/theme';
import RootLayout from '../layout';

vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'mock-font' }),
}));

describe('RootLayout theme bootstrap', () => {
  it('ships the initializer as a parser-executed head script', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>Content</main>
      </RootLayout>,
    );
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
    const script = head?.match(/<script id="theme-init">([\s\S]*?)<\/script>/);

    expect(script?.[1]).toBe(themeInitScript());
    expect(script?.[1]).not.toContain('self.__next_s');
  });
});
