import React from 'react';
import PropTypes from 'prop-types';
// import dayjs from 'dayjs';

import PaperCell from './PaperCell';

const Cell = ({ data, papers }) => (
  <div className="cell-container">
    <article className="mini-post">
      <header>
        <h2>
          <a href={data.link}>{data.title}</a>
        </h2>
        {/* <time className="published">
          {dayjs(data.date).format('MMMM, YYYY')}
        </time> */}
      </header>
      <a href={data.link} className="image">
        <img src={`${process.env.PUBLIC_URL}${data.image}`} alt={data.title} />
        {data.desc && (
          <div className="description">
            <p>{data.desc}</p>
          </div>
        )}
      </a>
      <footer className="footer">
        {papers && papers.map((paper) => (
          <PaperCell data={paper} />
        ))}
      </footer>
    </article>
  </div>
);

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    image: PropTypes.string.isRequired,
    desc: PropTypes.string,
  }).isRequired,
  papers: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      authors: PropTypes.string.isRequired,
      journal: PropTypes.string,
      year: PropTypes.string,
      remark: PropTypes.string,
      status: PropTypes.string,
      links: PropTypes.arrayOf(
        PropTypes.shape({
          link: PropTypes.string.isRequired,
          text: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
};

export default Cell;
