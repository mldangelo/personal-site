import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CategoryButton from './Skills/CategoryButton';
import SkillBar from './Skills/SkillBar';

const makeCategories = (skills) => {
  // this is a list of colors that I like. The length should be == to the
  // number of categories. Re-arrange this list until you find a pattern you like.
  const colors = [
    '#6968b3',
    '#37b1f5',
    '#40494e',
    '#515dd4',
    '#e47272',
    '#cc7b94',
    '#3896e2',
    '#c3423f',
    '#d75858',
    '#747fff',
    '#64cb7b',
  ];
  return [
    ...new Set(skills.reduce((acc, { keywords }) => acc.concat(keywords), [])),
  ]
    .sort()
    .map((keywords, index) => ({
      name: keywords,
      color: colors[index],
    }));
};

const handleProps = ({ skills }) => ({
  buttons: makeCategories(skills).map((cat) => cat.name).reduce((obj, key) => ({
    ...obj,
    [key]: false,
  }), { All: true }),
});
// TODO: Add Athletic Skills, Office Skills,
// Data Engineering, Data Science, ML Engineering, ... ?

class Skills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...handleProps({ skills: props.skills }),
      categories: makeCategories(props.skills),
    };
  }

  getRows() {
    // search for true active categories
    const actCat = Object.keys(this.state.buttons).reduce((cat, key) => (
      this.state.buttons[key] ? key : cat
    ), 'All');

    return this.props.skills.sort((a, b) => {
      let ret = 0;
      if (a.level > b.level) ret = -1;
      else if (a.level < b.level) ret = 1;
      else if (a.keywords[0] > b.keywords[0]) ret = -1;
      else if (a.keywords[0] < b.keywords[0]) ret = 1;
      else if (a.name > b.name) ret = 1;
      else if (a.name < b.name) ret = -1;
      return ret;
    }).filter((skill) => (actCat === 'All' || skill.keywords.includes(actCat)))
      .map((skill) => (
        <SkillBar
          categories={this.state.categories}
          data={skill}
          key={skill.name}
        />
      ));
  }

  getButtons() {
    return Object.keys(this.state.buttons).map((key) => (
      <CategoryButton
        label={key}
        key={key}
        active={this.state.buttons}
        handleClick={this.handleChildClick}
      />
    ));
  }

  handleChildClick = (label) => {
    this.setState((prevState) => {
      // Toggle button that was clicked. Turn all other buttons off.
      const buttons = Object.keys(prevState.buttons).reduce((obj, key) => ({
        ...obj,
        [key]: (label === key) && !prevState.buttons[key],
      }), {});
      // Turn on 'All' button if other buttons are off
      buttons.All = !Object.keys(prevState.buttons).some((key) => buttons[key]);
      return { buttons };
    });
  }

  render() {
    return (
      <div className="skills">
        <div className="link-to" id="skills" />
        <div className="title">
          <h3>Skills</h3>
          <p>Note: I think these sections are silly, but everyone seems to have one.
            Here is a *mostly* honest overview of my skills.
          </p>
        </div>
        <div className="skill-button-container">
          {this.getButtons()}
        </div>
        <div className="skill-row-container">
          {this.getRows()}
        </div>
      </div>
    );
  }
}

Skills.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    level: PropTypes.number,
    keywords: PropTypes.arrayOf(PropTypes.string),
  })),
};

Skills.defaultProps = {
  skills: [],
};

export default Skills;
