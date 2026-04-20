import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PostContent from '@/components/Writing/PostContent';

describe('PostContent', () => {
  it('renders markdown headings, links, and images', () => {
    render(
      <PostContent
        content={`## Heading

Here is a [link](https://example.com).

![Example image](/images/example.png)`}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Heading' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
    expect(screen.getByAltText('Example image')).toHaveAttribute(
      'src',
      '/images/example.png',
    );
  });
});
