import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Cell = ({ data }) => (
  <div>
    <h6>
      <a style={{ float: 'left' }} href={data.link}>{data.title}</a><br />
      <time style={{ float: 'right' }} className="published">{dayjs(data.date).format('MMMM, YYYY')}</time>
    </h6>
  </div>
);

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    // image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    // desc: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cell;
