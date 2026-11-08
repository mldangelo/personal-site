/**
 * The exact font files satori renders the icons and share cards with.
 *
 * Satori cannot read the self-hosted WOFF2 files the site uses, so the
 * generators fetch TTFs. Google Fonts' family CSS is mutable: resolving
 * "Inter 500" on two different days can return different bytes under the same
 * generator source. Versioned URLs and their digests make a changed response a
 * hard failure instead of silently redrawing every committed image: the network
 * is transport, not an unrecorded generator input.
 */
import { createHash } from 'node:crypto';

/** The display face, shared by the icon monogram and the share cards. */
export const DISPLAY_FONT = Object.freeze({
  name: 'Display',
  family: 'Inter',
  weight: 500,
  style: 'normal',
  url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf',
  sha256: '8c883f63b2c4157d997319f2c8bc6995ed4357ef371940d31ca159004a4aae63',
});

export function assertFontDigest(font, data) {
  const actual = createHash('sha256').update(data).digest('hex');
  if (actual !== font.sha256) {
    throw new Error(
      `${font.family} ${font.weight} from ${font.url} has SHA-256 ${actual}; ` +
        `expected ${font.sha256}. Refusing to generate images from changed font bytes.`,
    );
  }
}

/**
 * Fetches one exact TTF as a satori font entry, and refuses any response whose
 * bytes have changed.
 */
export async function loadFont(source) {
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    let data;
    try {
      const response = await fetch(source.url, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data = Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      continue;
    }

    // A digest mismatch is not a transient network failure: do not retry it
    // and obscure the exact changed-byte error.
    assertFontDigest(source, data);

    return {
      name: source.name,
      data,
      weight: source.weight,
      style: source.style,
    };
  }

  throw new Error(
    `Failed to download ${source.family} ${source.weight} after two 15-second attempts`,
    { cause: lastError },
  );
}
