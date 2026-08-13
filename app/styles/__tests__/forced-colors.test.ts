import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const entrypoint = readFileSync(
  join(process.cwd(), 'app', 'tailwind.css'),
  'utf8',
);

/**
 * Import order is the one property of this stylesheet a test can hold: jsdom
 * has no forced-colors mode, so the rules themselves need a real browser.
 */
describe('forced-colors stylesheet', () => {
  it('loads after theme overrides and before print overrides', () => {
    const dark = entrypoint.indexOf("@import './styles/dark-mode.css'");
    const forced = entrypoint.indexOf("@import './styles/forced-colors.css'");
    const print = entrypoint.indexOf("@import './styles/print.css'");

    expect(dark).toBeGreaterThanOrEqual(0);
    expect(forced).toBeGreaterThan(dark);
    expect(print).toBeGreaterThan(forced);
  });
});
