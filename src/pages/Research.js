import React from 'react';
// import { Link } from 'react-router-dom';
import Cell from '../components/Research/Cell';
import data from '../data/research';

import Main from '../layouts/Main';

const Stats = () => (
  <Main
    title="Research"
    description="Research work by Dhruv Doshi"
  >
    <article className="post" id="stats">
      {data.map((project) => (
        <Cell
          data={project}
          key={project.title}
        />
      ))}
    </article>
  </Main>
);

export default Stats;
