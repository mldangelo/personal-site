import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Post } from '@/lib/posts';
import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';
import ArticleSchema from '../ArticleSchema';

const mockPost: Post = {
  slug: 'test-article',
  title: 'Test Article Title',
  date: '2024-01-15',
  description: 'This is a test article description',
  content: 'Article content here',
};

describe('ArticleSchema', () => {
  it('renders a script tag with JSON-LD content', () => {
    const { container } = render(<ArticleSchema post={mockPost} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeInTheDocument();
  });

  it('contains BlogPosting schema type', () => {
    const { container } = render(<ArticleSchema post={mockPost} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const data = JSON.parse(script?.innerHTML || '{}');

    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('BlogPosting');
  });

  it('includes correct article metadata', () => {
    const { container } = render(<ArticleSchema post={mockPost} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const data = JSON.parse(script?.innerHTML || '{}');

    expect(data.headline).toBe(mockPost.title);
    expect(data.description).toBe(mockPost.description);
    expect(data.datePublished).toBe(mockPost.date);
    expect(data.dateModified).toBe(mockPost.date);
  });

  it('uses correct article URL', () => {
    const { container } = render(<ArticleSchema post={mockPost} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const data = JSON.parse(script?.innerHTML || '{}');

    const expectedUrl = `${SITE_URL}/writing/${mockPost.slug}`;
    expect(data.url).toBe(expectedUrl);
    expect(data.mainEntityOfPage['@id']).toBe(expectedUrl);
  });

  it('uses correct author name from constants', () => {
    const { container } = render(<ArticleSchema post={mockPost} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const data = JSON.parse(script?.innerHTML || '{}');

    expect(data.author['@type']).toBe('Person');
    expect(data.author.name).toBe(AUTHOR_NAME);
    expect(data.author.url).toBe(SITE_URL);
  });

  it('uses correct publisher from constants with logo', () => {
    const { container } = render(<ArticleSchema post={mockPost} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const data = JSON.parse(script?.innerHTML || '{}');

    expect(data.publisher['@type']).toBe('Person');
    expect(data.publisher.name).toBe(AUTHOR_NAME);
    expect(data.publisher.url).toBe(SITE_URL);
    expect(data.publisher.logo['@type']).toBe('ImageObject');
    expect(data.publisher.logo.url).toBe(`${SITE_URL}/images/me.jpg`);
  });

  it('includes image for rich search results', () => {
    const { container } = render(<ArticleSchema post={mockPost} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const data = JSON.parse(script?.innerHTML || '{}');

    expect(data.image).toBe(`${SITE_URL}/images/me.jpg`);
  });

  it('includes mainEntityOfPage WebPage reference', () => {
    const { container } = render(<ArticleSchema post={mockPost} />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const data = JSON.parse(script?.innerHTML || '{}');

    expect(data.mainEntityOfPage['@type']).toBe('WebPage');
    expect(data.mainEntityOfPage['@id']).toBeDefined();
  });
});
