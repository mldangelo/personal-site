import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Cell = ({ data }) => (
  <div>
    <h6>
      <span style={{float: 'left'}}>
        <a href={data.link}>{data.title}</a><br />
      </span>
      <span style={{float: 'left'}}>
        <time className="published">{dayjs(data.date).format('MMMM, YYYY')}</time>
      </span>
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
