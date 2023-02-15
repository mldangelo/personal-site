import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Cell = ({ data }) => (
  <div className="cell-container">
    <article className="mini-post">
      <header>
        <h3>
          <a href={data.link}>{data.title}</a>
        </h3>
        <time className="published">
          {dayjs(data.date).format('MMMM, YYYY')}
        </time>
      </header>
      <a href={data.video ? (data.video) : (data.image)} className="image" target="_blank" rel="noreferrer">
        {data.video ? (
          <video width="100%" playsinline="true" autoPlay="autoplay" muted="true" loop="true">
            <source
              src={`${process.env.PUBLIC_URL}${data.video}`}
              type="video/mp4"
            />
          </video>
        ) : (
          <img src={`${process.env.PUBLIC_URL}${data.image}`} alt={data.title} />
        )}
      </a>
      <a href={data.link} className="description" target="_blank" rel="noreferrer">
        <p>{data.desc} Read more...</p>
      </a>
    </article>
  </div>
);

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    video: PropTypes.string,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cell;
