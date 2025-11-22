import dayjs from 'dayjs';

import Image from 'next/image';
import React from 'react';

import type { Project } from '@/data/projects';

interface CellProps {
  data: Project;
}

const Cell: React.FC<CellProps> = ({ data }) => (
  <div className="cell-container">
    <article className="mini-post">
      <header>
        <h3>
          <a href={data.link}>{data.title}</a>
        </h3>
        <time className="published" dateTime={data.date}>
          {dayjs(data.date).format('MMMM, YYYY')}
        </time>
      </header>
      <a
        href={data.link}
        className="image"
        aria-label={`View ${data.title} project`}
      >
        <Image
          src={data.image}
          alt={`${data.title} project screenshot`}
          width={600}
          height={400}
        />
      </a>
      <div className="description">
        <p>{data.desc}</p>
      </div>
    </article>
  </div>
);

export default Cell;
