import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(
  join(process.cwd(), 'app', 'styles', 'forced-colors.css'),
  'utf8',
);
const entrypoint = readFileSync(
  join(process.cwd(), 'app', 'tailwind.css'),
  'utf8',
);

describe('forced-colors stylesheet', () => {
  it('loads after theme overrides and before print overrides', () => {
    const dark = entrypoint.indexOf("@import './styles/dark-mode.css'");
    const forced = entrypoint.indexOf("@import './styles/forced-colors.css'");
    const print = entrypoint.indexOf("@import './styles/print.css'");

    expect(dark).toBeGreaterThanOrEqual(0);
    expect(forced).toBeGreaterThan(dark);
    expect(print).toBeGreaterThan(forced);
  });

  it('keeps the desktop and resume active-item bars visible', () => {
    expect(css).toMatch(
      /\.nav-link::after,\s*\.resume-nav-link\.active::after\s*{[^}]*background-color:\s*LinkText;/,
    );
  });

  it('gives the active mobile item a non-colour cue', () => {
    expect(css).toMatch(
      /\.hamburger-ul li a\.active span\s*{[^}]*text-decoration:\s*underline;/,
    );
  });

  it('keeps portrait filters disabled in higher-specificity states', () => {
    expect(css).toContain('.hero-portrait:hover img,');
    expect(css).toContain("[data-theme='dark'] .hero-portrait:hover img,");
    expect(css).toContain('.site-footer-new .footer-avatar img {');
  });
});
