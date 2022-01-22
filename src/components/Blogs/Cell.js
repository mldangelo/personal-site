import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Cell = ({ data }) => (
  <div>
    <ul>
      <h6>
        <li style={{ float: 'left' }}><a href={data.link}>{data.title}</a><br /></li>
        <li style={{ float: 'right' }}><time className="published">{dayjs(data.date).format('MMMM, YYYY')}</time></li>
      </h6>
    </ul>
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
