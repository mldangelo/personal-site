import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('contains the intro section', () => {
    expect(aboutMarkdown).toContain('# Intro');
    expect(aboutMarkdown).toContain('Nutanix');
    expect(aboutMarkdown).toContain('Core Data Path');
  });

  it('contains the history section', () => {
    expect(aboutMarkdown).toContain('# Some History');
    expect(aboutMarkdown).toContain('IIT Hyderabad');
  });

  it('contains the likes section', () => {
    expect(aboutMarkdown).toContain('# I Like');
    expect(aboutMarkdown).toContain('Distributed systems');
  });

  it('contains the travel section', () => {
    expect(aboutMarkdown).toContain('# Travel / Geography');
    expect(aboutMarkdown).toContain('San Jose');
  });

  it('contains the fun facts section', () => {
    expect(aboutMarkdown).toContain('# Fun Facts');
  });

  it('contains the dreams section', () => {
    expect(aboutMarkdown).toContain('# I Dream Of');
    expect(aboutMarkdown).toContain('Staying curious');
  });

  it('contains the admired websites section', () => {
    expect(aboutMarkdown).toContain('# Websites from People I Admire');
  });

  it('contains valid markdown links', () => {
    const linkRegex = /\[.+?\]\(.+?\)/g;
    const links = aboutMarkdown.match(linkRegex);

    expect(links).not.toBeNull();
    expect(links!.length).toBeGreaterThan(10);
  });

  it('contains properly formatted headers', () => {
    const headerRegex = /^#+ .+$/gm;
    const headers = aboutMarkdown.match(headerRegex);

    expect(headers).not.toBeNull();
    expect(headers!.length).toBeGreaterThan(5);
  });
});
