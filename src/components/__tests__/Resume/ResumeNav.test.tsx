import { fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { SMOOTH_SCROLL_ATTRIBUTE } from '@/lib/smoothScroll';
import ResumeNav from '../../Resume/ResumeNav';

// Which section is current is `useActiveSection`'s job and is tested there.
describe('ResumeNav', () => {
  afterEach(() => {
    // A click arms smooth scrolling; let it go before the next test.
    fireEvent(window, new Event('scrollend'));
  });

  it('links to every resume section in page order, under a named landmark', () => {
    render(<ResumeNav />);

    const nav = screen.getByRole('navigation', { name: 'Resume sections' });

    const hrefs = [...nav.querySelectorAll('a')].map((link) =>
      link.getAttribute('href'),
    );

    expect(hrefs.join(' ')).toBe('#experience #education #skills #courses');
  });

  it('marks only the first section as current in the static markup', () => {
    const html = renderToStaticMarkup(<ResumeNav />);

    expect(html).toMatch(/href="#experience"[^>]*aria-current="location"/);
    expect(html.match(/aria-current/g)).toHaveLength(1);
  });

  it('arms smooth scrolling for a click', () => {
    render(<ResumeNav />);

    fireEvent.click(screen.getByRole('link', { name: 'Skills' }));

    expect(document.documentElement).toHaveAttribute(SMOOTH_SCROLL_ATTRIBUTE);
  });
});
