import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Cell = props => (
  <div className="cell-container">
    <article className="mini-post">
      <header>
        <h3><a href={props.data.link}>{props.data.title}</a></h3>
        <time className="published">{moment(props.data.date).format('MMMM, YYYY')}</time>
      </header>
      <a href={props.data.link} className="image"><img src={props.data.image} alt="" /></a>
      <div className="description">
        <p>{props.data.desc}</p>
      </div>
    </article>
  </div>
);

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cell;
