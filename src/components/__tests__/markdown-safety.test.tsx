import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AboutContent from '../About/Sections';
import JobSummary from '../Resume/Experience/JobSummary';

const renderers = [
  {
    name: 'About content',
    render: (markdown: string) => (
      <AboutContent markdown={`# Intro\n\n${markdown}`} />
    ),
  },
  {
    name: 'resume summary',
    render: (markdown: string) => <JobSummary summary={markdown} />,
  },
];

describe.each(renderers)('$name Markdown safety', ({ render }) => {
  it.each([
    '<script>alert(1)</script>',
    '<img src="x" onerror="alert(1)">',
    '<a href="javascript:alert(1)">unsafe link</a>',
    '<a href="java&#x73;cript:alert(1)">encoded unsafe link</a>',
    '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  ])('does not export executable markup from %s', (markdown) => {
    const html = renderToStaticMarkup(render(markdown));
    const document = new DOMParser().parseFromString(html, 'text/html');

    expect(document.querySelector('script, iframe')).toBeNull();
    for (const element of document.querySelectorAll('*')) {
      for (const attribute of element.attributes) {
        expect(attribute.name).not.toMatch(/^on/i);
        if (['href', 'src'].includes(attribute.name)) {
          expect(attribute.value).not.toMatch(/^\s*javascript:/i);
        }
      }
    }
  });

  it('preserves ordinary Markdown and authored HTML links', () => {
    const html = renderToStaticMarkup(
      render(
        '**Work** with [Markdown](https://example.com/md) and <a href="https://example.com/html">HTML</a>.',
      ),
    );
    const document = new DOMParser().parseFromString(html, 'text/html');

    expect(document.querySelector('strong')?.textContent).toBe('Work');
    expect(
      document.querySelector('a[href="https://example.com/md"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[href="https://example.com/html"]'),
    ).not.toBeNull();
  });
});
