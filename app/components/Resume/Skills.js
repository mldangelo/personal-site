import React, { Component } from 'react';

import CategoryButton from './Skills/CategoryButton';
import SkillBar from './Skills/SkillBar';

import { skills, categories } from '../../data/skills';

class Skills extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttons: Object.keys(categories).sort().reduce((obj, key) => ({
        ...obj,
        [key]: false,
      }), { All: true }),
      skills: skills.map(skill =>
        Object.assign(skill, { category: skill.category.sort() }),
      ),
    };
  }

  getRows() {
    // search for true active categorys
    const actCat = Object.keys(this.state.buttons).reduce((cat, key) => (
      this.state.buttons[key] ? key : cat
    ), 'All');

    return this.state.skills.sort((a, b) => {
      let ret = 0;
      if (a.compentency > b.compentency) ret = -1;
      else if (a.compentency < b.compentency) ret = 1;
      else if (a.category[0] > b.category[0]) ret = -1;
      else if (a.category[0] < b.category[0]) ret = 1;
      else if (a.title > b.title) ret = 1;
      else if (a.title < b.title) ret = -1;
      return ret;
    }).filter(skill => (actCat === 'All' || skill.category.includes(actCat)))
      .map(skill => (
        <SkillBar
          data={skill}
          key={skill.title}
        />
        ));
  }

  getButtons() {
    return Object.keys(this.state.buttons).map(key => (
      <CategoryButton
        label={key}
        key={key}
        active={this.state.buttons}
        handleClick={this.handleChildClick}
      />
    ));
  }

  handleChildClick = (label) => {
    // Toggle button that was clicked. Turn all other buttons off.
    const buttons = Object.keys(this.state.buttons).reduce((obj, key) => ({
      ...obj,
      [key]: (label === key) && !this.state.buttons[key],
    }), {});
    // Turn on 'All' button if other buttons are off
    buttons.All = !Object.keys(this.state.buttons).some(key => buttons[key]);
    this.setState({ buttons });
  }

  render() {
    return (
      <div className="skills" id="skills">
        <div className="title">
          <h3>Skills</h3>
          <p>Note: I think these sections are silly, but everyone seems to have one.</p>
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

export default Skills;
