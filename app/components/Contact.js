import React, { Component, PropTypes } from 'react';

const data = [
  {
    label: "Email",
    value: "mailto:michael.l.dangelo@gmail.com"
  },{
    label: "Facebook",
    value: "https://facebook.com/d"
  },{
    label: "LinkedIn",
    value: "https://www.linkedin.com/in/michaelldangelo"
  },{
    label: "Instagram",
    value: "https://www.instagram.com/dangelosaurus"
  },{
    label: "Angel List",
    value: "https://angel.co/michael-d-angelo"
  }
];

class Row extends Component {
  render() {
    return (
      <span>
        <a href={this.props.pair.value}>{this.props.pair.label}</a>
        <br/>
      </span>
    );
  }
}

Row.propTypes = {
  pair: PropTypes.object.isRequired,
};


class Contact extends Component {

  getRows(){
    return data.map((pair) => {
      return <Row pair={pair} />
    });
  }
  render() {
    return (
      <div className="row no-margin-lr">
        <div className="col-sm-12 contact">
            <div>
                <header>
                    <h3>Contact Me</h3>
                </header>
                <p>
                  {this.getRows()}
                </p>
            </div>
        </div>
      </div>
    );
  }
}

export default Contact;
