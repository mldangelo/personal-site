'use client';

import PropTypes from 'prop-types';
import React from 'react';

const TableRow = ({ label, link, value, format }) => {
  // Ensure format is a function before using it
  const safeFormat = typeof format === 'function' ? format : (x) => x;

  // Safely format the value
  const formattedValue = value !== undefined && value !== null ? safeFormat(value) : 'N/A';

  return (
    <tr>
      <td width="70%">{label}</td>
      <td>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {formattedValue}
          </a>
        ) : (
          formattedValue
        )}
      </td>
    </tr>
  );
};

TableRow.propTypes = {
  format: PropTypes.func,
  label: PropTypes.string.isRequired,
  link: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.element, PropTypes.number, PropTypes.string]),
};

TableRow.defaultProps = {
  format: (x) => x,
  link: null,
  value: null,
};

export default TableRow;
