import dayjs from 'dayjs';
import React from 'react';
import { IProject } from '../../data/projects';
import PdfViewer from './Pdf';

export interface ICell {
  data: IProject;
}

const Cell: React.FC<ICell> = ({ data }) => (
  <div className="cell-container">
    <article className="mini-post">
      <header>
        <h3>
          <a href={data.link}>{data.title}</a>
        </h3>
        {data.date ? (
          <time className="published">
            {dayjs(data.date).format('MMMM, YYYY')}
          </time>
        ) : (
          <div></div>
        )}
      </header>
      {data.image ? (
        <a href={data.link} className="image">
          <img
            src={`${process.env.PUBLIC_URL}${data.image}`}
            alt={data.title}
          />
        </a>
      ) : (
        <div></div>
      )}
      {data.pdf ? PdfViewer(data.pdf) : <div></div>}
      <div className="description">
        <p>{data.desc}</p>
      </div>
    </article>
  </div>
);

export default Cell;
