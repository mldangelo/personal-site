import React, { Component, PropTypes } from 'react';

const data = [
  {
    title: "Nearest Dollar",
    link: "http://www.nearestdollar.com/",
    image: '/images/projects/nearestdollar.png',
    date: 'November, 2015',
  },{
    title: "Harvest",
    link: "http://www.harvesters.club/",
    image: '/images/projects/harvest.png',

  },{
    title: "Space Potato",
    link: "http://www.spacepotato.org",
    image: '/images/projects/spacepotato.png',
  },{
    title: "Cat Detector",
    link: "http://www.catdetector.biz",
    image: '/images/projects/catdetector.png',
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


        <article className="mini-post">
  				<header>
  					<h3><a href="http://www.spacepotato.org">SpacePotato</a></h3>
  					<time className="published" datetime="2015-07-20">July, 2015</time>
  				</header>
  				<a href="http://www.spacepotato.org" className="image"><img src="images/projects/spacepotato.png" alt=""/></a>
  			</article>

        <article className="mini-post">
  				<header>
  					<h3><a href="http://www.spacepotato.org">Harvest</a></h3>
  					<time className="published" datetime="2015-07-20">October, 2015</time>
  				</header>
  				<a href="http://www.spacepotato.org" className="image"><img src="images/projects/harvest.png" alt=""/></a>
  			</article>

        <article className="mini-post">
  				<header>
  					<h3><a href="http://www.spacepotato.org">NearestDollar</a></h3>
  					<time className="published" datetime="2015-07-20">November, 2015</time>
  				</header>
  				<a href="http://www.spacepotato.org" className="image"><img src="images/projects/nearestdollar.png" alt=""/></a>
  			</article>

        <article className="mini-post">
  				<header>
  					<h3><a href="http://www.spacepotato.org">Cat Detector</a></h3>
  					<time className="published" datetime="2015-07-20">June, 2015</time>
  				</header>
  				<a href="http://www.spacepotato.org" className="image"><img src="images/projects/catdetector.jpg" alt=""/></a>
  			</article>

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
