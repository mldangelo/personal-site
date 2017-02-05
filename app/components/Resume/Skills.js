import React, { Component } from 'react';

import _includes from 'lodash/includes';
import _orderBy from 'lodash/orderBy';

import CategoryButton from './Skills/CategoryButton';
import SkillBar from './Skills/SkillBar';

import { skills, categories } from './data/skills';

class Skills extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttons: Object.keys(categories).sort().reduce((obj, key) => ({
        ...obj,
        [key]: false,
      }), { All: true }),
    };
  }

  getRows() {
    // search for true active categorys
    const actCat = Object.keys(this.state.buttons).reduce((cat, key) => (
      this.state.buttons[key] ? key : cat
    ), 'All');

    const sorted = _orderBy(skills,
      ['compentency', 'category', 'title'],
      ['desc', 'desc', 'asc']); // doesn't work for category arrays

    return sorted
      .filter(skill => (actCat === 'All' || _includes(skill.category, actCat)))
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
      <div className="skills">
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
