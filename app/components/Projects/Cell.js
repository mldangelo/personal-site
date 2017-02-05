import React, { Component, PropTypes } from 'react';

class Cell extends Component {
  render() {
    return (
      <article className="mini-post">
        <header>
          <h3><a href={this.props.data.link}>{this.props.data.title}</a></h3>
          <time className="published" dateTime={this.props.data.datetime}>{this.props.data.date}</time>
        </header>
        <a href={this.props.data.link} className="image"><img src={this.props.data.image} alt="" /></a>
      </article>
    );
  }
}

Cell.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Cell;
