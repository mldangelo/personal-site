import React from 'react';

import { PaperData } from './types';

interface PaperCellProps {
  data: PaperData;
}

const PaperCell: React.FC<PaperCellProps> = ({ data }) => (
  <div className="papers cell-container">
    <article className="paper-item">
      <h3>
        {data.title}
        {data.status ? <span className="paper-status">[{data.status.toUpperCase()}] </span> : ''}
      </h3>
      <div className="paper-details">{data.authors}</div>
      <div className="paper-details">
        <em>{data.journal}</em>
        {data.year ? `, ${data.year}` : ''}
      </div>
      <div className="paper-remark">{data.remark ? `${data.remark}` : ''}</div>
      <div className="paper-links">
        {data.links &&
          data.links.map((item, index) => (
            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
              {item.text || item.link}
            </a>
          ))}
      </div>
    </article>
  </div>
);

export default PaperCell;
