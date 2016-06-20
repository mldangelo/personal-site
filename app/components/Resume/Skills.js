import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import CategoryButton from './Skills/CategoryButton';
import SkillBar from './Skills/SkillBar';

import { skills, categories } from './data/skills';

class Skills extends Component {

  constructor(props) {
    super(props);
    this.state = {
     buttons: _.zipObject(categories, false), // Althetic Skills, Office Skills
    };
    this.state.buttons['All'] = true;
  }

  handleChildClick(label) {
    this.state.buttons[label] = !this.state.buttons[label]
    for (let key in this.state.buttons) { // Turn off all the other buttons
      if (label != key) this.state.buttons[key] = false;
    }
    console.log("Button states: " + JSON.stringify(this.state.buttons));

    let allFalse = true; // Turn on all if all other buttons are off
    for (let key in this.state.buttons) {
      if (this.state.buttons[key]) {
        allFalse = false;
        break;
      }
    }
    if (allFalse) this.state.buttons['All'] = true;

    this.forceUpdate(); // TODO Don't do this.
 }

  getButtons(){
    const buttons = []
    const keys = Object.keys(this.state.buttons).sort();
    for (let key of keys) {
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
    const rows = [];

    let activeCategory = 'All';
    for (let key in this.state.buttons) {
      if (this.state.buttons[key]) {
        activeCategory = key;
        break;
      }
    }

    // TODO sort by reverse compentency
    const sorted = _.sortBy(skills, ['compentency','category','title']); // doesn't work for category arrays

    for (let skill of sorted) {
      if (activeCategory == 'All' || _.includes(skill.category, activeCategory)) {
        rows.push(
          <SkillBar
            data={skill}
            key={skill.title}
          />
        );
      }
    }
    return rows;
  }

  render() {
    return (
      <div className="skills">
        <div className="title">
          <h3>Skills</h3>
          <p>Note: I think these sections are silly, but everyone seems to have one.</p>
        </div>

        <div>
          {this.getButtons()}
        </div>

        {this.getRows()}
      </div>
    );
  }
}

export default Skills;
