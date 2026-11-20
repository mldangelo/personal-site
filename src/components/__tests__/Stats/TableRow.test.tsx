import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';

import TableRow from '../../Stats/TableRow';

function renderRows(...rows: ComponentProps<typeof TableRow>[]) {
  render(
    <table>
      <tbody>
        {rows.map((row) => (
          <TableRow key={row.label} {...row} />
        ))}
      </tbody>
    </table>,
  );
}

describe('TableRow', () => {
  // A screen reader announces the row header before each value.
  it('heads the row with its label and nothing else', () => {
    renderRows({ label: 'Countries visited', value: '53' });

    expect(screen.getByRole('rowheader').textContent).toBe('Countries visited');
    expect(screen.getByRole('cell').textContent).toBe('53');
  });

  // Read out of its row, as in a list of links, the value alone names
  // nothing, so the link says what it counts and where it goes.
  it('names a linked value by its row and destination', () => {
    renderRows({
      label: 'Forks',
      value: '979',
      link: 'https://example.com',
      linkLabel: 'on GitHub',
    });

    expect(
      screen.getByRole('link', { name: /^979\s*, Forks: on GitHub$/ }),
    ).toHaveAttribute('href', 'https://example.com');
  });

  // A value is one token, and its column is as wide as the widest of them. An
  // element reserves its own width, so breaking one would move the table every
  // time a live readout ticked.
  it.each([
    ['fits beside the longest label on 320px', '8'.repeat(17), false],
    ['does not fit', '8'.repeat(18), true],
  ])('sets the long-value break when a value %s', (_, value, long) => {
    renderRows({ label: 'Reading', value });

    expect(
      screen.getByRole('cell').classList.contains('stat-table-value--long'),
    ).toBe(long);
  });
});
