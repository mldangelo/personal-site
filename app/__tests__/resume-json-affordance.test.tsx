import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RESUME_JSON_PATH } from '@/lib/resumeJson';
import ResumePage from '../resume/page';

/**
 * The machine-readable résumé is only useful if the page it describes points at
 * it, the way `/writing` points at the RSS feed.
 */
describe('resume JSON affordance', () => {
  it('links the machine-readable résumé from the title row', () => {
    const { container } = render(<ResumePage />);
    const link = screen.getByRole('link', { name: 'JSON Resume' });

    expect(link).toHaveAttribute('href', RESUME_JSON_PATH);
    expect(link).toHaveTextContent('JSON');
    // File-like route: no trailing slash, even under `trailingSlash: true`.
    expect(link.getAttribute('href')).not.toMatch(/\/$/);

    const row = container.querySelector('.resume-header-row');
    expect(row).not.toBeNull();
    expect(row?.querySelector('h1')).toHaveTextContent('Resume');
    expect(row?.contains(link)).toBe(true);
  });
});
