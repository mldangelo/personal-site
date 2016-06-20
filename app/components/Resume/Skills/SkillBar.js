import React, {Component, PropTypes} from 'react';

import { categories } from '../data/skills';

import _includes from 'lodash/includes';

const colors = ['#515dd4', '#3896e2', '#747FFF', '#64cb7b', '#6968b3', '#e47272', '#C3423F', '#40494e', '#CC7B94'];

const getColor = (type) => {
  for (const idx in categories) {
    if (_includes(type, categories[idx])) return colors[idx];
  }
  return colors[colors.length - 1];
};

class SkillBar extends Component {

  render() {
    const titleStyle = {
      background: getColor(this.props.data.category),
    };
    const barStyle = {
      background: getColor(this.props.data.category),
      width: `${String(Math.min(100, Math.max(this.props.data.compentency / 5.0 * 100.0, 0)))}%`,
    };
    return (
      <div className="skillbar clearfix">
      	<div className="skillbar-title" style={titleStyle}><span>{this.props.data.title}</span></div>
      	<div className="skillbar-bar" style={barStyle}></div>
      	<div className="skill-bar-percent">{this.props.data.compentency} / 5</div>
      </div>
    );
  }
}

SkillBar.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SkillBar;
