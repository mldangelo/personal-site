import React from 'react';
import PropTypes from 'prop-types';
// import dayjs from 'dayjs';

const PaperCell = ({ data }) => (
  <div className="papers cell-container">
    <article className="paper-item">
      <h3>
        {data.title}
        {data.status ? (
          <span className="paper-status">[{data.status.toUpperCase()}] </span>
        ) : ''}
      </h3>
      <div className="paper-details">{data.authors}</div>
      <div className="paper-details">
        <em>{data.journal}</em>{data.year ? `, ${data.year}` : ''}
      </div>
      <div className="paper-remark">
        {data.remark ? `${data.remark}` : ''}
      </div>
      <div className="paper-links">
        {data.links && data.links.map((item) => (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.text || item.link}
          </a>
        ))}
      </div>
    </article>
  </div>
);

PaperCell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    authors: PropTypes.string.isRequired,
    journal: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    remark: PropTypes.string,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        link: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
    status: PropTypes.string,
  }).isRequired,
};

export default PaperCell;
