import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Table from '../../Stats/Table';

describe('Table', () => {
  it('renders a table element', () => {
    const data = [{ label: 'Test', value: 'Value' }];

    render(<Table data={data} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    const data = [
      { label: 'Row 1', value: 'Value 1' },
      { label: 'Row 2', value: 'Value 2' },
      { label: 'Row 3', value: 'Value 3' },
    ];

    render(<Table data={data} />);

    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2')).toBeInTheDocument();
    expect(screen.getByText('Row 3')).toBeInTheDocument();
  });

  it('passes provenance to rows', () => {
    // Formatting used to be passed down as a `format` function; it now happens
    // in `resolveReadings` before a row reaches the table, because functions
    // cannot cross the RSC boundary the site table renders on.
    const data = [
      {
        label: 'Counted',
        value: '1,000 packages',
        source: 'measured' as const,
      },
      { label: 'Fetched', value: '23', source: 'github' as const },
    ];

    render(<Table data={data} />);

    const marks = document.querySelectorAll('.stat-provenance');
    expect(
      Array.from(marks, (mark) => mark.getAttribute('data-source')),
    ).toEqual(['measured', 'github']);
  });

  it('passes link to rows', () => {
    const data = [
      {
        label: 'Link Test',
        value: 'Click me',
        link: 'https://example.com',
      },
    ];

    render(<Table data={data} />);

    const link = screen.getByRole('link', { name: /click me/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('handles empty data array', () => {
    render(<Table data={[]} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Should have 1 row for the header (thead)
    const rows = screen.queryAllByRole('row');
    expect(rows.length).toBe(1);
  });
});
