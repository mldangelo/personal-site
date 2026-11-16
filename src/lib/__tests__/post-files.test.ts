import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { listPostFiles } from '../post-files.mjs';

const roots: string[] = [];

function directoryWith(entries: Record<string, 'file' | 'folder' | 'link'>) {
  const root = mkdtempSync(join(tmpdir(), 'post-files-'));
  roots.push(root);
  for (const [name, kind] of Object.entries(entries)) {
    const path = join(root, name);
    if (kind === 'folder') mkdirSync(path);
    if (kind === 'file') writeFileSync(path, '');
    if (kind === 'link') symlinkSync(join(root, 'b.md'), path);
  }
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('listPostFiles', () => {
  it('lists posts by slug and skips hidden files', () => {
    const root = directoryWith({
      'b.md': 'file',
      'a-post.md': 'file',
      '.DS_Store': 'file',
    });

    expect(listPostFiles(root)).toEqual([
      { slug: 'a-post', path: join(root, 'a-post.md') },
      { slug: 'b', path: join(root, 'b.md') },
    ]);
  });

  // Each would otherwise vanish from the site, or from one reader of it.
  it.each([
    ['nested', 'folder', /nested\/ is a folder/],
    ['linked.md', 'link', /linked\.md is not a regular file/],
    ['notes.txt', 'file', /notes\.txt is not a post name/],
    ['My Post.md', 'file', /My Post\.md is not a post name/],
  ] as const)('refuses %s', (name, kind, message) => {
    const root = directoryWith({ 'b.md': 'file', [name]: kind });

    expect(() => listPostFiles(root)).toThrow(message);
  });

  it('reads a missing directory as no posts', () => {
    expect(listPostFiles(join(tmpdir(), 'no-such-post-directory'))).toEqual([]);
  });
});
