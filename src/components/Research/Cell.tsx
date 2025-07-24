import React from 'react';

import PaperCell from './PaperCell';
import { CellData } from './types';

interface CellProps {
  data: CellData;
}

const Cell: React.FC<CellProps> = ({ data }) => (
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
        <picture>
          {/* Show mobile image on phones if provided, else fall back */}
          <source media="(max-width: 600px)" srcSet={`${data.imageMobile || data.image}`} />
          {/* Default / desktop image */}
          <img src={`${data.image}`} alt={data.title} />
        </picture>
        {data.desc && (
          <div className="description">
            <p>{data.desc}</p>
          </div>
        )}
      </a>
      <footer className="footer">
        {data.papers && data.papers.map((paper, index) => <PaperCell key={index} data={paper} />)}
      </footer>
    </article>
  </div>
);

export default Cell;
