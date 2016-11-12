import React, { Component } from 'react';

import _includes from 'lodash/includes';
import _zipObject from 'lodash/zipObject';
import _orderBy from 'lodash/orderBy';

import CategoryButton from './Skills/CategoryButton';
import SkillBar from './Skills/SkillBar';

import { skills, categories } from './data/skills';

class Skills extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttons: _zipObject(categories, false), // Althetic Skills, Office Skills
    };
    this.state.buttons['All'] = true;
  }

  handleChildClick(label) {
    this.state.buttons[label] = !this.state.buttons[label]; // toggle button
    for (const key in this.state.buttons) { // Turn off all the other buttons
      if (label !== key) this.state.buttons[key] = false;
    }

    // Turn on all button if other buttons are off
    const oneTrue = Object.keys(this.state.buttons).some(key => this.state.buttons[key]);
    if (!oneTrue) this.state.buttons['All'] = true;

    this.forceUpdate(); // TODO Don't do this.
  }

  getButtons() {
    const buttons = [];
    const keys = Object.keys(this.state.buttons).sort(); // Sort keys alphabetically
    for (const key of keys) {
      buttons.push(
        <CategoryButton
          label={key}
          key={key}
          active={this.state.buttons}
          handleClick={this.handleChildClick.bind(this)}
        />
      );
    }
    return buttons;
  }

  getRows() {
    let actCat = 'All'; // default active category
    for (const key in this.state.buttons) { // search for true active categorys
      if (this.state.buttons[key]) {
        actCat = key;
        break;
      }
    }

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
