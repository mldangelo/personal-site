import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Cell from './Projects/Cell'
import data from './Projects/data/projects.js'

// TODO Put projects side by side (2x2) instead of (1x4)

class Projects extends Component {

  getRows() {
    return data.map((project) => {
      return (
        <Cell
          data={project}
          key={project.title} />
      );
    });
  }

  render() {
    return (
      <article className="post" id="projects">
        <header>
          <div className="title">
            <h2><Link to="/projects">Projects</Link></h2>
            <p>A selection of projects that I'm not too ashamed of</p>
          </div>
        </header>
        {this.getRows()}
      </article>
    );
  }
}

export default Projects;
