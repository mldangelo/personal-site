import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

import Cell from '../components/Blogs/Cell';
import data from '../data/Blogs';

const Projects = () => (
  <Main
    title="Blogs"
    description="New Blogs Everyday!"
  >
    <article className="post" id="projects">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/blogs">Blogs</Link></h2>
          <p>Will try to put everyday a blog.</p>
        </div>
      </header>
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
