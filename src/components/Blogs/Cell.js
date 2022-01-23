import React from 'react';
import PropTypes from 'prop-types';
// import dayjs from 'dayjs';

const Cell = ({ data }) => (
  <div>
    {/* <h3>Search Keyword <a href="https://dhruvdoshi.github.io/blog"> here </a></h3> */}
    <p><a href={data.link}>{data.title}</a></p>
    {/* <time className="published">{dayjs(data.date).format('MMMM, YYYY')}</time> */}
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
