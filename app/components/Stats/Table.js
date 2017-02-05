import React, { Component, PropTypes } from 'react';

import TableRow from './TableRow';

class Table extends Component {

  getRows() {
    return this.props.data.map(pair => (
      <TableRow
        key={pair.label}
        label={pair.label}
        value={pair.value}
        link={pair.link}
      />
      ));
  }

  render() {
    return (
      <table style={{ width: '100%' }}>
        <tbody>
          {this.getRows()}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Table;
