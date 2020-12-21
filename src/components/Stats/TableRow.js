import PropTypes from 'prop-types';

const TableRow = ({ label, link, value, format }) => (
  <tr>
    <td width="70%">{label}</td>
    <td>{link ? <a href={link}>{format(value)}</a> : format(value)}</td>
  </tr>
);

TableRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]).isRequired,
  link: PropTypes.string,
  format: PropTypes.func,
};

TableRow.defaultProps = {
  format: (x) => x,
};

export default TableRow;
