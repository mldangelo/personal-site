import React from 'react';
// import { Link } from 'react-router-dom';
import Main from '../layouts/Main';
import Cell from '../components/Blogs/Cell';
import data from '../data/Blogs';

const Projects = () => (
  <Main
    title="Blogs"
    description="Blogs Writteb by Dhruv Doshi"
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

export default Projects;
