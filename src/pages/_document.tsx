import { Head, Html, Main, NextScript } from 'next/document';

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
  <Html lang="en">
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
