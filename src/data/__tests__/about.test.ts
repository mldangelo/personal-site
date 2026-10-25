import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('contains the intro section', () => {
    expect(aboutMarkdown).toContain('# Intro');
    expect(aboutMarkdown).toContain('OpenAI');
    expect(aboutMarkdown).toContain('Promptfoo');
  });

  it('contains the history section', () => {
    expect(aboutMarkdown).toContain('# Some history');
    expect(aboutMarkdown).toContain('MS-DOS');
  });

  it('contains the likes section', () => {
    expect(aboutMarkdown).toContain('# I like');
    expect(aboutMarkdown).toContain('Running');
    expect(aboutMarkdown).toContain('Skiing');
  });

  it('contains the travel section', () => {
    expect(aboutMarkdown).toContain('# Travel / geography');
    expect(aboutMarkdown).toContain('Buffalo, New York');
  });

  it('contains the fun facts section', () => {
    expect(aboutMarkdown).toContain('# Fun facts');
  });

  it('contains the dreams section', () => {
    expect(aboutMarkdown).toContain('# I dream of');
    expect(aboutMarkdown).toContain('Staying curious');
  });

  it('contains the admired websites section', () => {
    expect(aboutMarkdown).toContain('# Websites from people I admire');
  });

  it('contains valid markdown links', () => {
    // Check for markdown link format [text](url)
    const linkRegex = /\[.+?\]\(.+?\)/g;
    const links = aboutMarkdown.match(linkRegex);

    expect(links).not.toBeNull();
    expect(links!.length).toBeGreaterThan(10);
  });

  it('contains properly formatted headers', () => {
    // Check for markdown headers
    const headerRegex = /^#+ .+$/gm;
    const headers = aboutMarkdown.match(headerRegex);

    expect(headers).not.toBeNull();
    expect(headers!.length).toBeGreaterThan(5);
  });
});
