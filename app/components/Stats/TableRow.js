import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TableRow extends Component {
  getValue() {
    return this.props.link.length ? (
      <a href={`${this.props.link}`}>{this.props.value}</a>
    ) : this.props.value;
  }

  render() {
    return (
      <tr>
        <td width="70%">{this.props.label}</td>
        <td>{this.getValue()}</td>
      </tr>
    );
  }
}

TableRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  link: PropTypes.string,
};

TableRow.defaultProps = {
  link: '',
};

export default TableRow;
