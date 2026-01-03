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

  it('passes format function to rows', () => {
    const data = [
      {
        label: 'Count',
        value: 1000,
        format: (v: unknown) => `${v} items`,
      },
    ];

    render(<Table data={data} />);

    expect(screen.getByText('1000 items')).toBeInTheDocument();
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
