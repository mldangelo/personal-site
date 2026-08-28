import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

describe('about data', () => {
  it('describes Pavan’s IAM practice', () => {
    expect(aboutMarkdown).toContain('# Intro');
    expect(aboutMarkdown).toContain('SailPoint IdentityIQ');
    expect(aboutMarkdown).toContain('Identity Security Cloud');
    expect(aboutMarkdown).toContain('lifecycle management');
    expect(aboutMarkdown).toContain('access governance');
    expect(aboutMarkdown).toContain('integration');
    expect(aboutMarkdown).toContain('automation');
    expect(aboutMarkdown).toContain('compliance');
    expect(aboutMarkdown).toContain('collaboration');
  });

  it('contains no inherited biography', () => {
    expect(aboutMarkdown).not.toMatch(/OpenAI|Promptfoo|Michael D'Angelo/);
  });
});
