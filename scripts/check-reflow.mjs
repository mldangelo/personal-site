#!/usr/bin/env node
/**
 * Loads every page of the static export in headless Chrome and fails when one
 * is wider than its viewport.
 *
 * jsdom has no layout, so no component test can see a page that scrolls
 * sideways, and it happens where nobody looks: a 320px phone with the
 * reader's text at 200%, where one long word or unbreakable value is wider
 * than the column. On a phone that also widens the layout viewport, which
 * carries the fixed header's menu button off the screen.
 *
 * Text size is the browser's default font size, the setting a reader changes.
 * Page zoom is not separate work: it narrows the CSS viewport, which the 320px
 * view already is. Motion is reduced, so the live age and the contact
 * animation hold still.
 *
 * Needs Chrome or Chromium; set `CHROME_PATH` if it is not where the platform
 * installs it. Run after `npm run build`:
 *   npm run check-reflow
 */
import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, relative, resolve } from 'node:path';

import { findChrome, openPage } from './lib/chrome.mjs';
import {
  exportLayout,
  readSiteConfig,
  toUrlPath,
  walkFiles,
} from './lib/site.mjs';

const ROOT = process.cwd();
const OUT = resolve(ROOT, 'out');
const LABEL = 'check-reflow';

/** Every page must fit each of these. */
const VIEWS = [
  { width: 320, textScale: 1 },
  { width: 320, textScale: 2 },
  { width: 1280, textScale: 1 },
];

/** Chrome's own defaults, which a reader's text-size setting scales. */
const DEFAULT_FONT_SIZES = { standard: 16, fixed: 13 };

const PAGE_LOAD_TIMEOUT_MS = 30_000;

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
};

const die = (message) => {
  console.error(`${LABEL}: ${message}`);
  process.exit(1);
};

const describeView = ({ width, textScale }) =>
  textScale === 1 ? `${width}px` : `${width}px, ${textScale * 100}% text`;

/**
 * Runs in the page once it has loaded. The page fits when the root scrolls
 * no wider than the viewport. When it does not, names what reaches past the
 * right edge: text by its element and opening words, an empty box (an image,
 * a spacer) by its element.
 * Anything inside a box that clips or scrolls is skipped, since it cannot
 * widen the page, and so is anything fixed, which the viewport carries.
 */
const MEASURE = `(async () => {
  await document.fonts.ready;
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));

  const root = document.documentElement;
  const limit = root.clientWidth;
  if (root.scrollWidth <= limit) return { fits: true };

  // Text is held in by its own element; a box only by an ancestor.
  const contained = (element, clipsItself) => {
    for (let node = element; node && node !== root; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.position === 'fixed') return true;
      if ((clipsItself || node !== element) && style.overflowX !== 'visible') return true;
    }
    return false;
  };
  const name = (element) =>
    element.tagName.toLowerCase() +
    [...element.classList].slice(0, 2).map((cls) => '.' + cls).join('');

  const culprits = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let text = walker.nextNode(); text; text = walker.nextNode()) {
    const content = text.textContent.trim();
    const parent = text.parentElement;
    if (!content || contained(parent, true) || parent.closest('script, style')) continue;
    const range = document.createRange();
    range.selectNodeContents(text);
    const right = Math.max(...[...range.getClientRects()].map((rect) => rect.right), 0);
    if (right > limit + 0.5) {
      const label = name(parent) + ' "' + content.slice(0, 40) + (content.length > 40 ? '…' : '') + '"';
      culprits.set(label, Math.max(culprits.get(label) ?? 0, right));
    }
  }
  for (const element of document.body.querySelectorAll('*')) {
    if (element.children.length || element.textContent.trim()) continue;
    const right = element.getBoundingClientRect().right;
    if (right > limit + 0.5 && !contained(element, false)) culprits.set(name(element), right);
  }

  return {
    fits: false,
    width: root.scrollWidth,
    culprits: [...culprits]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, right]) => label + ' reaches ' + Math.round(right) + 'px'),
  };
})()`;

/** Serves the export the way GitHub Pages does, below its base path. */
function serve(layout) {
  const server = createServer((request, response) => {
    const { pathname } = new URL(request.url, 'http://localhost');
    const file = layout.exportFileFor(
      pathname.endsWith('/') ? `${pathname}index.html` : pathname,
    );
    if (!file) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, {
      'Content-Type':
        CONTENT_TYPES[extname(file).toLowerCase()] ??
        'application/octet-stream',
    });
    createReadStream(file).pipe(response);
  });

  return new Promise((ready) => {
    server.listen(0, '127.0.0.1', () => ready(server));
  });
}

async function measure({ page, next }, url) {
  const loaded = next('Page.loadEventFired');
  const { errorText } = await page('Page.navigate', { url });
  if (errorText) throw new Error(`${url}: ${errorText}`);

  let timer;
  await Promise.race([
    loaded,
    new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`${url} did not finish loading`)),
        PAGE_LOAD_TIMEOUT_MS,
      );
    }),
  ]).finally(() => clearTimeout(timer));

  const { result, exceptionDetails } = await page('Runtime.evaluate', {
    expression: MEASURE,
    awaitPromise: true,
    returnByValue: true,
  });
  if (exceptionDetails) {
    throw new Error(`${url}: ${exceptionDetails.exception?.description}`);
  }
  return result.value;
}

async function main() {
  if (!existsSync(OUT)) die('no out/ directory; run `npm run build` first');

  const executable = findChrome();
  if (!executable) {
    die('cannot find Chrome or Chromium; set CHROME_PATH to its executable');
  }

  const { origin, basePath } = readSiteConfig(ROOT, LABEL);
  const layout = exportLayout({ outDir: OUT, origin, basePath });
  const routes = walkFiles(OUT)
    .map((file) => toUrlPath(relative(OUT, file)))
    .filter((path) => path.endsWith('.html') && !path.startsWith('_next/'))
    .map(layout.routeForHtml)
    .sort();
  if (routes.length === 0) die('out/ contains no HTML pages');

  const server = await serve(layout);
  const { port } = server.address();
  const browser = await openPage(executable);
  const failures = [];

  try {
    await browser.page('Page.enable');
    await browser.page('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });

    for (const view of VIEWS) {
      await browser.page('Page.setFontSizes', {
        fontSizes: {
          standard: DEFAULT_FONT_SIZES.standard * view.textScale,
          fixed: DEFAULT_FONT_SIZES.fixed * view.textScale,
        },
      });
      await browser.page('Emulation.setDeviceMetricsOverride', {
        width: view.width,
        height: 800,
        deviceScaleFactor: 1,
        mobile: view.width < 600,
      });

      for (const route of routes) {
        const url = `http://127.0.0.1:${port}${layout.publicPathForRoute(route)}`;
        const { fits, width, culprits } = await measure(browser, url);
        if (!fits) {
          failures.push(
            [
              `  ${route} at ${describeView(view)} is ${width}px wide`,
              ...culprits.map((culprit) => `    ${culprit}`),
            ].join('\n'),
          );
        }
      }
    }
  } finally {
    server.close();
    await browser.close();
  }

  const views = VIEWS.map(describeView).join('; ');
  if (failures.length > 0) {
    die(
      `${failures.length} page view(s) wider than the viewport (${views}):\n${failures.join('\n')}`,
    );
  }
  console.log(`${LABEL}: ${routes.length} pages fit at ${views}`);
}

main().catch((error) => die(error.message));
