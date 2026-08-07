import { Head, Html, Main, NextScript } from 'next/document';
import { geistMono, geistSans, newsreader } from '../styles/fonts';

// The font variables must land on <html>, not on a wrapper element: theme.css
// declares --font-sans/serif/mono at :root, and a var() that cannot resolve
// where it is declared poisons the whole declaration for every descendant.
const fontVariables = `${geistSans.variable} ${geistMono.variable} ${newsreader.variable}`;

// Runs before first paint so the correct theme is applied without a flash.
// Must stay in sync with the persisted shape of src/store/theme-store.ts.
const themeInitScript = `
(function () {
  try {
    var raw = localStorage.getItem('theme-store');
    var pref = 'system';
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.state && parsed.state.preference) {
        pref = parsed.state.preference;
      }
    }
    var dark = pref === 'dark' || (pref === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

const Document = () => (
  <Html lang="en" className={fontVariables}>
    <Head>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
