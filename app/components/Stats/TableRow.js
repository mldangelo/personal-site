'use client';

import React from 'react';
import PropTypes from 'prop-types';

const TableRow = ({
  label, link, value, format,
}) => {
  // Safely format the value
  const formattedValue = value !== undefined && value !== null 
    ? format(value) 
    : 'N/A';
    
  return (
    <tr>
      <td width="70%">{label}</td>
      <td>
        {link 
          ? <a href={link} target="_blank" rel="noopener noreferrer">{formattedValue}</a> 
          : formattedValue}
      </td>
    </tr>
  );
};

TableRow.propTypes = {
  format: PropTypes.func,
  label: PropTypes.string.isRequired,
  link: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.number,
    PropTypes.string,
  ]),
};

TableRow.defaultProps = {
  format: (x) => x,
  link: null,
  value: null,
};

export default TableRow; 