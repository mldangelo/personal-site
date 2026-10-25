import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import TableRow from '../../Stats/TableRow';

describe('TableRow', () => {
  it('renders label and value', () => {
    render(
      <table>
        <tbody>
          <TableRow label="Test Label" value="Test Value" />
        </tbody>
      </table>,
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('renders a table row element', () => {
    render(
      <table>
        <tbody>
          <TableRow label="Test" value="Value" />
        </tbody>
      </table>,
    );

    expect(screen.getByRole('row')).toBeInTheDocument();
  });

  it('renders value as link when link prop is provided', () => {
    render(
      <table>
        <tbody>
          <TableRow
            label="Link"
            value="Click here"
            link="https://example.com"
          />
        </tbody>
      </table>,
    );

    const link = screen.getByRole('link', { name: /click here/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('does not render link when link prop is null', () => {
    render(
      <table>
        <tbody>
          <TableRow label="No Link" value="Plain text" link={null} />
        </tbody>
      </table>,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Plain text')).toBeInTheDocument();
  });

  it('renders numeric values correctly', () => {
    render(
      <table>
        <tbody>
          <TableRow label="Count" value={42} />
        </tbody>
      </table>,
    );

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders boolean values as strings', () => {
    render(
      <table>
        <tbody>
          <TableRow label="Active" value={true} />
        </tbody>
      </table>,
    );

    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('renders React elements directly', () => {
    const element = <span data-testid="custom-element">Custom</span>;

    render(
      <table>
        <tbody>
          <TableRow label="Custom" value={element} />
        </tbody>
      </table>,
    );

    expect(screen.getByTestId('custom-element')).toBeInTheDocument();
  });

  it('handles null value', () => {
    render(
      <table>
        <tbody>
          <TableRow label="Null" value={null} />
        </tbody>
      </table>,
    );

    expect(screen.getByText('Null')).toBeInTheDocument();
    // null gets converted to string 'null'
    expect(screen.getByText('null')).toBeInTheDocument();
  });

  it('heads the row with its label and nothing else', () => {
    // The header once carried a source tag under the label, so a screen
    // reader announced "Countries visited Source: Profile" before each value.
    // The source belongs to the table's caption now.
    render(
      <table>
        <tbody>
          <TableRow label="Countries visited" value="53" />
        </tbody>
      </table>,
    );

    const header = screen.getByRole('rowheader');

    expect(header).toHaveTextContent(/^Countries visited$/);
    expect(header).toHaveClass('stat-table-label');
    expect(header.childElementCount).toBe(0);
  });

  it('underlines a linked value rather than colouring it', () => {
    // jsdom loads no stylesheet, so the class is what can be checked here;
    // `readout-styles.test.ts` holds what that class is allowed to do.
    render(
      <table>
        <tbody>
          <TableRow label="Forks" value="979" link="https://example.com" />
        </tbody>
      </table>,
    );

    expect(screen.getByRole('link', { name: '979' })).toHaveClass(
      'stat-table-link',
    );
  });

  it('keeps a linked value and a plain one in the same kind of cell', () => {
    // A link is a property of the value, not a second kind of reading, so the
    // cell that sets the type is the same either way.
    render(
      <table>
        <tbody>
          <TableRow label="Forks" value="979" link="https://example.com" />
          <TableRow label="Number of spoons" value="0" />
        </tbody>
      </table>,
    );

    const [linked, plain] = screen.getAllByRole('cell');

    expect(linked.className).toBe(plain.className);
    expect(plain.querySelector('a')).toBeNull();
  });

  it('lets only a value too long for a phone break', () => {
    // A value is one token, and its column is as wide as the widest of them.
    // A 26-character city ran 60px off a 320px screen in the browser; the
    // values this site publishes stay whole.
    render(
      <table>
        <tbody>
          <TableRow label="Current city" value="New York, NY" />
          <TableRow label="Direct dependencies" value="29 packages" />
          <TableRow label="Current city" value="Rancho Santa Margarita, CA" />
        </tbody>
      </table>,
    );

    const [city, packages, longCity] = screen.getAllByRole('cell');

    expect(city).not.toHaveClass('stat-table-value--long');
    expect(packages).not.toHaveClass('stat-table-value--long');
    expect(longCity).toHaveClass('stat-table-value', 'stat-table-value--long');
  });

  it('draws the line at what fits beside the longest label on a 320px screen', () => {
    render(
      <table>
        <tbody>
          <TableRow label="Fits" value={'8'.repeat(15)} />
          <TableRow label="Does not" value={'8'.repeat(16)} />
        </tbody>
      </table>,
    );

    const [fits, doesNot] = screen.getAllByRole('cell');

    expect(fits).not.toHaveClass('stat-table-value--long');
    expect(doesNot).toHaveClass('stat-table-value--long');
  });

  it('never breaks a value that is an element', () => {
    // The live age reserves its own width; breaking it would move the table
    // every time the readout ticked over.
    render(
      <table>
        <tbody>
          <TableRow
            label="Current age"
            value={<span>36.68132394318 and counting</span>}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByRole('cell')).not.toHaveClass('stat-table-value--long');
  });
});
