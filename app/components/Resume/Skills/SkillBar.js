import React, {Component, PropTypes} from 'react';

const getColor = (type) => {

  const colors = {
    green: '#88cd2a',
    blue: '#00a8ff',
    orange: '#f46e23',
  };

  const dict = {
    'web': colors.blue,
    'data': colors.orange,
    'other': colors.green,
  };

  for (const category in dict) {
    if (category == type) {
      return  dict[type];
    }
  }
  return dict.other;
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
