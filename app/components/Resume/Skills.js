import React, {Component, PropTypes} from 'react';

import skills from './data/skills';

// TODO Make sort and filterable, update skill levels. Add more

const colors = {
  green: '#88cd2a',
  blue: '#00a8ff',
  orange: '#f46e23',
};

const getColor = (type) => {
  const dict = {
    'web': colors.green,
    'data': colors.blue,
    'other': colors.orange,
  };
  for (const category in dict) {
    if (category == type) {
      return  dict[type];
    }
  }
  return dict.other;
};

class Skill extends Component {

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

Skill.propTypes = {
  data: PropTypes.object.isRequired,
};

class Skills extends Component {

  getRows() {
    return skills.map((skill) => {
      return <Skill
        data={skill}
        key={skill.title} />;
    });
  }

  render() {
    return (
      <div className="skills">
        <div className="title">
          <h3>Skills</h3>
          <p>Note: I think these sections are silly, but everyone seems to have one.</p>
        </div>
        {this.getRows()}
      </div>
    );
  }
}

export default Skills;
