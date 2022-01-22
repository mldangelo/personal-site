import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Cell = ({ data }) => (
  <div>
    <h5><a href={data.link}>{data.title}</a></h5>
    <time className="published">{dayjs(data.date).format('MMMM, YYYY')}</time>
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
