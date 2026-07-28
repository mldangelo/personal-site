import { describe, expect, it } from 'vitest';

import { buildJsonResume } from '@/lib/resumeJson';

import { dynamic, GET } from '../route';

describe('resume.json route', () => {
  it('is force-static so it survives output: export', () => {
    expect(dynamic).toBe('force-static');
  });

  it('serves JSON with the content type GitHub Pages will echo', async () => {
    const response = await GET();

    expect(response.headers.get('Content-Type')).toBe(
      'application/json; charset=utf-8',
    );
  });

  it('serves exactly the assembled document', async () => {
    const response = await GET();

    expect(JSON.parse(await response.text())).toEqual(buildJsonResume());
  });
});
