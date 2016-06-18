import React, {Component, PropTypes} from 'react';

// TODO Make sort and filterable, update skill levels. Add more

const skills = [
  {
    title: 'Javascript',
    compentency: 4,
    category: 'web',
  },
  {
    title: 'Node.JS',
    compentency: 4,
    category: 'web',
  },
  {
    title: 'React',
    compentency: 4,
    category: 'web',
  },
  {
    title: 'Backbone',
    compentency: 3,
    category: 'web',
  },
  {
    title: 'Bash',
    compentency: 3,
  },
  {
    title: 'Amazon Web Services',
    compentency: 3,
  },
  {
    title: 'MongoDB',
    compentency: 3,
    category: 'web',
  },
  {
    title: 'ElasticSearch',
    compentency: 3,
    category: 'web',
  },
  {
    title: 'PostgreSQL',
    compentency: 3,
    category: 'web',
  },
  {
    title: 'Matlab',
    compentency: 3,
    category: 'data',
  },
  {
    title: 'Machine Learning',
    compentency: 4,
    category: 'data',
  },
  {
    title: 'Data Mining',
    compentency: 3,
    category: 'data',
  },
  {
    title: 'Express.JS',
    compentency: 4,
    category: 'web',
  },
  {
    title: 'Webpack',
    compentency: 4,
    category: 'web',
  },
  {
    title: 'Flask',
    compentency: 4,
    category: 'web',
  },
  {
    title: 'Product Development',
    compentency: 3,
  },
  {
    title: 'Meteor',
    compentency: 3,
    category: 'web',
  },
  {
    title: 'Sails.js',
    compentency: 3,
    category: 'web',
  },
  {
    title: 'MEAN Stack',
    compentency: 3,
    category: 'web',
  },
  {
    title: 'Data Analysis',
    compentency: 3,
    category: 'data',
  },
  {
    title: 'Mercurial',
    compentency: 3,
  },
  {
    title: 'Git',
    compentency: 3,
  },
  {
    title: 'Arc',
    compentency: 3,
  },
  {
    title: 'Numpy',
    compentency: 3,
    category: 'data',
  },
  {
    title: 'Caffe',
    compentency: 4,
    category: 'data',
  },
  {
    title: 'Tensorflow',
    compentency: 4,
    category: 'data',
  },
  {
    title: 'Typescript',
    compentency: 3,
    category: 'web',
  },
  {
    title: 'Data Science',
    compentency: 3,
    category: 'data',
  },
  {
    title: 'HTML',
    compentency: 5,
    category: 'web',
  },
  {
    title: 'CSS',
    compentency: 5,
    category: 'web',
  },
  {
    title: 'Python',
    compentency: 5,
  },
  {
    title: 'C++',
    compentency: 3,
  },
];

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
