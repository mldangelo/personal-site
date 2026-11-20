import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SchemaGraph } from '../index';

describe('SchemaGraph', () => {
  it('escapes < so a value cannot close the script tag', () => {
    const headline = 'Test </script><script>alert("xss")</script>';
    const { container } = render(
      <SchemaGraph nodes={[{ '@type': 'Article', headline }]} />,
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );

    expect(script?.innerHTML).not.toContain('</script>');
    expect(JSON.parse(script?.innerHTML ?? '')['@graph'][0].headline).toBe(
      headline,
    );
  });
});
