import React, { PropTypes } from 'react';

const Cell = props => (
  <article className="mini-post">
    <header>
      <h3><a href={props.data.link}>{props.data.title}</a></h3>
      <time className="published" dateTime={props.data.datetime}>{props.data.date}</time>
    </header>
    <a href={props.data.link} className="image"><img src={props.data.image} alt="" /></a>
  </article>
);

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    datetime: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cell;
