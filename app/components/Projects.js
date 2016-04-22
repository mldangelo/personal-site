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
      <div className="row no-margin-lr">
        <div className="col-sm-12 projects">
            <div>
                <header>
                    <h3>Projects</h3>
                </header>
                {this.getRows()}
            </div>
        </div>
      </div>
    );
  }
}

export default Projects;
