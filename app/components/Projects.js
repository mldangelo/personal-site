import React, { Component, PropTypes } from 'react';

// TODO Put projects side by side (2x2) instead of (1x4)

// TODO Add a couple lines about each project
const data = [
  {
    title: 'Nearest Dollar',
    link: 'http://www.nearestdollar.com/',
    image: '/images/projects/nearestdollar.png',
    date: 'November, 2015', // TODO - Derive this from datetime field
    datetime: '11-20-2015',
  }, {
    title: 'Harvest',
    link: 'http://www.harvesters.club/',
    image: '/images/projects/harvest.png',
    date: 'September, 2015',
    datetime: '09-20-2015',
  }, {
    title: 'Space Potato',
    link: 'http://www.spacepotato.org',
    image: '/images/projects/spacepotato.png',
    date: 'June, 2015',
    datetime: '06-28-2015',
  }, {
    title: 'Cat Detector',
    link: 'http://www.catdetector.biz',
    image: '/images/projects/catdetector.jpg',
    date: 'May, 2015',
    datetime: '05-15-2015',
  }
];

class Cell extends Component {
  render() {
    return (
      <article className="mini-post">
        <header>
          <h3><a href={this.props.data.link}>{this.props.data.title}</a></h3>
          <time className="published" dateTime={this.props.data.datetime}>{this.props.data.date}</time>
        </header>
        <a href={this.props.data.link} className="image"><img src={this.props.data.image} alt=""/></a>
      </article>
    );
  }
}

Cell.propTypes = {
  data: PropTypes.object.isRequired,
};

class Projects extends Component {

  getRows() {
    return data.map((project) => {
      return <Cell data={project} />;
    });
  }

  render() {
    return (
      <article className="post" id="projects">
        <header>
          <div className="title">
            <h2><a href="#projects">Projects</a></h2>
            <p>A selection of projects that I'm not too ashamed of</p>
          </div>
        </header>
        {this.getRows()}
      </article>
    );
  }
}

export default Projects;
