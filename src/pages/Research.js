import React from 'react';
// import { Link } from 'react-router-dom';
import Cell from '../components/Research/Cell';
import data from '../data/research';

import Main from '../layouts/Main';

const Research = () => (
  <Main
    title="Research"
    description="Research work by Dhruv Doshi"
  >
    <article className="post" id="stats">
      {data.map((research) => (
        <Cell
          data={research}
          key={research.title}
        />
      ))}
    </article>
  </Main>
);

export default Research;
