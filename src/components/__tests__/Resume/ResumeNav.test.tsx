import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ResumeNav from '../../Resume/ResumeNav';

// The nav's behaviour belongs to `SectionNav` and `useActiveSection`, which the
// About page's tests and the hook's own exercise.
describe('ResumeNav', () => {
  it('links to every resume section in page order, under a named landmark', () => {
    render(<ResumeNav />);

    const nav = screen.getByRole('navigation', { name: 'Resume sections' });

    const hrefs = [...nav.querySelectorAll('a')].map((link) =>
      link.getAttribute('href'),
    );

    expect(hrefs.join(' ')).toBe('#experience #education #skills #courses');
  });
});
