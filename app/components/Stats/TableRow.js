import React, { Component, PropTypes } from 'react';

class TableRow extends Component {

  getValue() {
    return this.props.link ? (
      <a href={`${this.props.link}`}>{this.props.value}</a>
    ) : this.props.value;
  }

  render() {
    return (
      <tr>
        <td>{this.props.label}</td>
        <td>{this.getValue()}</td>
      </tr>
    );
  }
}

TableRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  link: PropTypes.string,
};

export default TableRow;
