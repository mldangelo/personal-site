import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import JsonLd from '../JsonLd';

describe('JsonLd', () => {
  it('renders a script tag with type application/ld+json', () => {
    const data = { '@type': 'Thing', name: 'Test' };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeInTheDocument();
  });

  it('contains the correct JSON data', () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Test Person',
    };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script?.innerHTML).toBe(JSON.stringify(data));
  });

  it('handles complex nested data', () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Test Article',
      author: {
        '@type': 'Person',
        name: 'Author Name',
      },
    };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const parsedContent = JSON.parse(script?.innerHTML || '{}');
    expect(parsedContent['@type']).toBe('BlogPosting');
    expect(parsedContent.author.name).toBe('Author Name');
  });

  it('escapes < characters to prevent XSS', () => {
    const data = {
      '@type': 'Article',
      headline: 'Test </script><script>alert("xss")</script>',
    };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    // Should not contain raw < characters
    expect(script?.innerHTML).not.toContain('</script>');
    // Should contain escaped version
    expect(script?.innerHTML).toContain('\\u003c');
    // Should still be valid JSON when unescaped
    const unescaped = script?.innerHTML.replace(/\\u003c/g, '<') || '{}';
    const parsedContent = JSON.parse(unescaped);
    expect(parsedContent.headline).toBe(
      'Test </script><script>alert("xss")</script>',
    );
  });
});
