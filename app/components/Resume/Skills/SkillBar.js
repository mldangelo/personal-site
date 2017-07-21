import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SkillBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      categories: props.categories,
    };
  }

  // TODO: Consider averaging colors
  getColor() {
    return this.state.categories
      .filter(cat => this.state.data.category.includes(cat.name))
      .map(cat => cat.color)[0];
  }

  render() {
    const titleStyle = {
      background: this.getColor(),
    };
    const barStyle = {
      ...titleStyle,
      width: `${String(Math.min(100, Math.max((this.state.data.compentency / 5.0) * 100.0, 0)))}%`,
    };
    return (
      <div className="skillbar clearfix">
        <div className="skillbar-title" style={titleStyle}><span>{this.state.data.title}</span></div>
        <div className="skillbar-bar" style={barStyle} />
        <div className="skill-bar-percent">{this.state.data.compentency} / 5</div>
      </div>
    );
  }
}

SkillBar.propTypes = {
  data: PropTypes.shape({
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
    compentency: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    color: PropTypes.string,
  })),
};

SkillBar.defaultProps = {
  categories: [],
};

export default SkillBar;
