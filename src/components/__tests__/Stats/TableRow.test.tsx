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
});
