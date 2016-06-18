import React, { Component, PropTypes } from 'react';

const data = [
  {
    title: "Nearest Dollar",
    link: "http://www.nearestdollar.com/"
  },{
    title: "Harvest",
    link: "http://www.harvesters.club/"
  },{
    title: "Space Potato",
    link: "http://www.spacepotato.org"
  },{
    title: "Cat Detector",
    link: "http://www.catdetector.biz"
  }
];

class Cell extends Component {
  render() {
    return (
      <div className="col-sm-3 no-lr">
        <a href={this.props.pair.link}>{this.props.pair.title}</a>
      </div>
    );
  }
}

Cell.propTypes = {
  pair: PropTypes.object.isRequired,
};

class Projects extends Component {

  getRows(){
    return data.map((pair) => {
      return <Cell pair={pair} />
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
        <p>Cat Detector</p>
        <p>Harvest</p>
        <p>Nearest Dollar</p>
        <p>Space Potato</p>
        <footer>
          <ul className="stats">
            <li><a href="#" className="icon fa-heart">28</a></li>
          </ul>
        </footer>
      </article>
    );
  }
}

export default Projects;
