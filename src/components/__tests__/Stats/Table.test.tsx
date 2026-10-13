import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Table from '../../Stats/Table';

const CAPTION = 'Measured from this build’s checkout';

describe('Table', () => {
  it('renders a table element', () => {
    const data = [{ label: 'Test', value: 'Value' }];

    render(<Table caption={CAPTION} data={data} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    const data = [
      { label: 'Row 1', value: 'Value 1' },
      { label: 'Row 2', value: 'Value 2' },
      { label: 'Row 3', value: 'Value 3' },
    ];

    render(<Table caption={CAPTION} data={data} />);

    expect(screen.getByText('Row 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2')).toBeInTheDocument();
    expect(screen.getByText('Row 3')).toBeInTheDocument();
  });

  it('is named by a real caption', () => {
    render(<Table caption={CAPTION} data={[{ label: 'Lines', value: '1' }]} />);

    const table = screen.getByRole('table', { name: CAPTION });

    // A caption has to open its table to be one.
    expect(table.firstElementChild?.tagName).toBe('CAPTION');
    expect(table.firstElementChild).toHaveTextContent(CAPTION);
  });

  it('says where its readings came from once, and on no row', () => {
    // Every row used to end in a tag naming its source, so a table of two
    // measured readings said "Measured" twice and never as a caption.
    const data = [
      {
        label: 'Counted',
        value: '1,000 packages',
        source: 'measured' as const,
      },
      { label: 'Also counted', value: '23', source: 'measured' as const },
    ];

    render(<Table caption={CAPTION} data={data} source="measured" />);

    expect(screen.getAllByText(/measured/i)).toHaveLength(1);
    expect(
      screen.getAllByRole('rowheader').map((header) => header.textContent),
    ).toEqual(['Counted', 'Also counted']);
  });

  it('tells the stylesheet which source it holds', () => {
    render(<Table caption={CAPTION} data={[]} source="measured" />);

    expect(screen.getByRole('table')).toHaveAttribute(
      'data-source',
      'measured',
    );
  });

  it('claims no source it was not given', () => {
    render(<Table caption="Not measured" data={[]} />);

    expect(screen.getByRole('table')).not.toHaveAttribute('data-source');
  });

  it('passes link to rows', () => {
    const data = [
      {
        label: 'Link Test',
        value: 'Click me',
        link: 'https://example.com',
      },
    ];

    render(<Table caption={CAPTION} data={data} />);

    const link = screen.getByRole('link', { name: /click me/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('handles empty data array', () => {
    render(<Table caption={CAPTION} data={[]} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Should have 1 row for the header (thead)
    const rows = screen.queryAllByRole('row');
    expect(rows.length).toBe(1);
  });
});
