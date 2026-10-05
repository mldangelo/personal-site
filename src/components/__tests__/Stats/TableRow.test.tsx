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

  it('renders a provenance mark for the row source', () => {
    render(
      <table>
        <tbody>
          <TableRow label="Lines" value="5,411" source="measured" />
        </tbody>
      </table>,
    );

    const mark = document.querySelector('.stat-provenance');
    expect(mark).toHaveAttribute('data-source', 'measured');
    expect(mark).toHaveTextContent('Measured');
  });

  it('names the mark for screen readers without labelling the value', () => {
    render(
      <table>
        <tbody>
          <TableRow label="Stars" value="1,663" source="github" />
        </tbody>
      </table>,
    );

    expect(document.querySelector('.stat-provenance')).toHaveTextContent(
      'Source: GitHub',
    );
  });

  it('keeps the label text queryable beside the mark', () => {
    // The mark lives in the row header, so without its own element the label
    // text would merge into the header's text content and every `getByText`
    // for a label on this page would stop matching.
    render(
      <table>
        <tbody>
          <TableRow label="Countries visited" value="53" source="profile" />
        </tbody>
      </table>,
    );

    expect(screen.getByText('Countries visited')).toHaveClass(
      'stat-table-label-text',
    );
  });

  it('omits the mark entirely when a row has no source', () => {
    render(
      <table>
        <tbody>
          <TableRow label="Number of spoons" value="0" />
        </tbody>
      </table>,
    );

    expect(document.querySelector('.stat-provenance')).toBeNull();
  });
});
