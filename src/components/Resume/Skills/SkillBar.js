import React from 'react';
import PropTypes from 'prop-types';

const SkillBar = ({ data, categories }) => {
  const { keywords, level, name } = data;

  // TODO: Consider averaging colors
  const nameStyle = {
    background: categories
      .filter((cat) => keywords.includes(cat.name))
      .map((cat) => cat.color)[0],
  };

  const barStyle = {
    ...nameStyle,
    width: `${String(Math.min(100, Math.max((level / 5.0) * 100.0, 0)))}%`,
  };

  return (
    <div className="skillbar clearfix">
      <div className="skillbar-title" style={nameStyle}><span>{name}</span></div>
      <div className="skillbar-bar" style={barStyle} />
      <div className="skill-bar-percent">{level} / 5</div>
    </div>
  );
};

SkillBar.propTypes = {
  data: PropTypes.shape({
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
    level: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
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
