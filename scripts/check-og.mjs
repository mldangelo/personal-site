#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ogProfileSnapshot } from './og-profile.mjs';

const root = process.cwd();
const EXPECTED_SIZE = { width: 1200, height: 630 };
const [image, metadata, profile, generatorSource] = await Promise.all([
  readFile(join(root, 'public', 'og.png')),
  readFile(join(root, 'public', 'og.meta.json'), 'utf8').then(JSON.parse),
  readFile(join(root, 'src', 'data', 'profile.json'), 'utf8').then(JSON.parse),
  readFile(join(root, 'scripts', 'generate-og.mjs'), 'utf8'),
]);

if (
  image.length < 24 ||
  image.readUInt32BE(0) !== 0x89504e47 ||
  image.toString('ascii', 12, 16) !== 'IHDR'
) {
  throw new Error('public/og.png is not a valid PNG with an IHDR header');
}

const actualSize = {
  width: image.readUInt32BE(16),
  height: image.readUInt32BE(20),
};
const expectedProfile = ogProfileSnapshot(profile);
const expectedGeneratorDigest = createHash('sha256')
  .update(generatorSource)
  .update('\0')
  .update(JSON.stringify(expectedProfile))
  .digest('hex');
const expectedImageDigest = createHash('sha256').update(image).digest('hex');

if (
  JSON.stringify(actualSize) !== JSON.stringify(metadata.size) ||
  JSON.stringify(actualSize) !== JSON.stringify(EXPECTED_SIZE)
) {
  throw new Error(
    `og.png must be ${EXPECTED_SIZE.width}x${EXPECTED_SIZE.height}; found ` +
      `${actualSize.width}x${actualSize.height}, while metadata expects ` +
      `${metadata.size?.width}x${metadata.size?.height}.`,
  );
}

if (JSON.stringify(expectedProfile) !== JSON.stringify(metadata.profile)) {
  throw new Error(
    'The share-card profile facts are stale. Run `npm run og` and commit ' +
      'public/og.png plus public/og.meta.json.',
  );
}

if (metadata.generatorDigest !== expectedGeneratorDigest) {
  throw new Error(
    'The share-card generator changed without a regenerated image. Run ' +
      '`npm run og` and commit public/og.png plus public/og.meta.json.',
  );
}

if (metadata.imageDigest !== expectedImageDigest) {
  throw new Error(
    'public/og.png does not match public/og.meta.json. Run `npm run og` and ' +
      'commit both generated files.',
  );
}

console.log(
  `og:check: ${actualSize.width}x${actualSize.height}, image, profile, and generator current`,
);
