import React from 'react';
import PropTypes from 'prop-types';
// import dayjs from 'dayjs';

const Cell = ({ data }) => (
  <div>
    <h3>
      <a href={data.link}>{data.title}</a><br />
    </h3>
  </div>
);

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    // image: PropTypes.string.isRequired,
    // date: PropTypes.string.isRequired,
    // desc: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cell;
