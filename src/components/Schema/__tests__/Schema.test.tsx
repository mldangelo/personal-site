import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PERSON_ID, WEBSITE_ID } from '@/lib/schema';
import { SchemaGraph, SiteSchema } from '../index';

function parseScript(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).toBeInTheDocument();
  return JSON.parse(script?.innerHTML || '{}');
}

describe('SchemaGraph', () => {
  it('wraps provided nodes in a single @graph document', () => {
    const { container } = render(
      <SchemaGraph nodes={[{ '@type': 'Thing', '@id': 'x' }]} />,
    );
    const data = parseScript(container);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@graph']).toHaveLength(1);
    expect(data['@graph'][0]['@id']).toBe('x');
  });

  it('escapes < so a value cannot close the script tag', () => {
    const headline = 'Test </script><script>alert("xss")</script>';
    const { container } = render(
      <SchemaGraph nodes={[{ '@type': 'Article', headline }]} />,
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script?.innerHTML).not.toContain('</script>');
    expect(script?.innerHTML).toContain('\\u003c');
    expect(parseScript(container)['@graph'][0].headline).toBe(headline);
  });
});

describe('SiteSchema', () => {
  it('emits the canonical WebSite and Person nodes', () => {
    const { container } = render(<SiteSchema />);
    const data = parseScript(container);
    const ids = data['@graph'].map((node: { '@id': string }) => node['@id']);
    expect(ids).toContain(WEBSITE_ID);
    expect(ids).toContain(PERSON_ID);
  });
});
