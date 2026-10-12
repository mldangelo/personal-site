import localFont from 'next/font/local';

/**
 * Fontsource supplies versioned files through npm; next/font/local adds
 * preload tags and metric-adjusted fallbacks without contacting Google during
 * the build. Keep these paths on the Latin variable files so adding a family
 * does not silently preload every script Fontsource ships.
 */
export const inter = localFont({
  // The `opsz` file carries the optical-size axis beside weight; `wght` alone
  // is the text cut at every size, which is what set the 64px name in letters
  // drawn for 14px. Browsers pick the cut from the font size unprompted.
  src: '../node_modules/@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2',
  variable: '--font-inter',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial'],
  adjustFontFallback: 'Arial',
});

export const newsreader = localFont({
  src: '../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2',
  variable: '--font-newsreader',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman'],
  adjustFontFallback: 'Times New Roman',
});

export const jetbrainsMono = localFont({
  src: '../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-jetbrains',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
  fallback: ['SFMono-Regular', 'Consolas'],
  adjustFontFallback: 'Arial',
});

/**
 * Long-form writing is the only current surface that uses authored italics.
 * Its separate route-level instance avoids preloading a 64 KB face on every
 * page while preserving a real italic rather than browser synthesis.
 */
export const newsreaderItalic = localFont({
  src: '../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2',
  variable: '--font-newsreader-italic',
  weight: '200 800',
  style: 'italic',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'Times New Roman'],
  adjustFontFallback: 'Times New Roman',
});
