import React, { PropTypes } from 'react';
import _includes from 'lodash/includes';

import { categories, colors } from '../data/skills';

// NOTE: Type is an array of categories. getColor finds the first matching color.
const getColor = (type) => {
  for (const idx in categories) {
    if (_includes(type, categories[idx])) return colors[idx];
  }
  return colors[colors.length - 1];
};

const SkillBar = (props) => {
  const titleStyle = {
    background: getColor(props.data.category),
  };
  const barStyle = {
    background: getColor(props.data.category),
    width: `${String(Math.min(100, Math.max((props.data.compentency / 5.0) * 100.0, 0)))}%`,
  };
  return (
    <div className="skillbar clearfix">
      <div className="skillbar-title" style={titleStyle}><span>{props.data.title}</span></div>
      <div className="skillbar-bar" style={barStyle} />
      <div className="skill-bar-percent">{props.data.compentency} / 5</div>
    </div>
  );
};

SkillBar.propTypes = {
  data: PropTypes.shape({
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
    compentency: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default SkillBar;
