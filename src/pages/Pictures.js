import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

import Cell from '../components/Pictures/Cell';
import data from '../data/pictures';

const Pictures = () => (
  <Main
    title="Pictures"
    description="Learn about Dhruv Doshi's projects."
  >
    <article className="post" id="projects">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/pictures">Pictures</Link></h2>
          <p>A selection of pictures that I&apos;m not too ashamed of</p>
        </div>
      </header>
      {data.map((pictures) => (
        <Cell
          data={pictures}
          key={pictures.title}
        />
      ))}
    </article>
  </Main>
);

export default Pictures;
