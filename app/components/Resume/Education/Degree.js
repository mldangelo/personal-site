import React, {Component, PropTypes} from 'react';

class Degree extends Component {

  render() {
    return (
      <article>
        <header>
          <p className="degree">{this.props.data.degree}</p>
          <p className="school"><a href={this.props.data.link}>{this.props.data.school}</a>, {this.props.data.year}</p>
        </header>
      </article>
    );
  }
}

Degree.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Degree;
