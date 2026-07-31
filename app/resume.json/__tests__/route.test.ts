import { describe, expect, it } from 'vitest';

import { buildJsonResume } from '@/lib/resumeJson';

import { dynamic, GET } from '../route';

describe('resume.json route', () => {
  it('is force-static so it survives output: export', () => {
    expect(dynamic).toBe('force-static');
  });

  it('returns JSON with an explicit UTF-8 content type before export', async () => {
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
