import React from 'react';
import PropTypes from 'prop-types';

import TableRow from './TableRow';

const Table = ({ data }) => (
  <table>
    <tbody>
      {data.map(({ format = (x) => x, label, link, value }) => (
        <TableRow key={label} label={label} value={format(value)} link={link} />
      ))}
    </tbody>
  </table>
);

Table.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      link: PropTypes.string,
      format: PropTypes.func,
    })
  ).isRequired,
};

export default Table;
