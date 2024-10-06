import React from 'react';
import { Link } from 'react-router-dom';
import Main from '../layouts/Main';

const Projects = () => (
  <Main title="Projects" description="Learn about Austin Dase's projects.">
    <article className="post" id="projects">
      <header>
        <div className="title">
          <h2>
            <Link to="/projects">Projects</Link>
          </h2>
          <p>Coming soon</p>
        </div>
      </header>
    </article>
  </Main>
);

export default Projects;
