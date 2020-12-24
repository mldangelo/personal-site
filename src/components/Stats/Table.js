import React from 'react';
import PropTypes from 'prop-types';

import TableRow from './TableRow';

const Table = ({ data }) => (
  <table>
    <tbody>
      {data.map(({
        format, label, link, value, key,
      }) => (
        <TableRow
          key={key || label}
          label={label}
          value={value}
          link={link}
          format={format}
        />
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
      key: PropTypes.string,
    }),
  ).isRequired,
};

export default Table;
