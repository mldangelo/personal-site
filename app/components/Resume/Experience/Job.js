import React, { Component, PropTypes } from 'react';

class Job extends Component {

  getPoints() {
    return this.props.data.points.map(point => (
      <li
        key={point}
      > {point} </li>
      ));
  }

  render() {
    return (
      <article>
        <header>
          <h4><a href={this.props.data.link}>{this.props.data.company}</a> - {this.props.data.position}</h4>
          <p className="daterange"> {this.props.data.daterange}</p>
        </header>
        <ul>
          {this.getPoints()}
        </ul>
      </article>
    );
  }
}

Job.propTypes = {
  data: PropTypes.shape({
    link: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    daterange: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default Job;
