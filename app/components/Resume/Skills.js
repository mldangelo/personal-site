import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import SkillBar from './Skills/SkillBar';

import skills from './data/skills';

// TODO Make sort and filterable, update skill levels. Add more

class CategoryButton extends Component {

  handleClick() {
    this.props.handleClick(this.props.label);
  }

  render() {
    return (
      <button
        className={`skillbutton ${this.props.active[this.props.label] ? 'skillbutton-active' : ''}` }
        type="button"
        onClick={this.handleClick.bind(this)}
        >
          {this.props.label}
      </button>
    );
  }
}

CategoryButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  active: PropTypes.object.isRequired,
};

class Skills extends Component {

  constructor(props) {
    super(props);
    this.state = {
     buttons: {
       'All': true,
       'Languages': false,
       'Tools': false,
       'Machine Learning': false,
       'Data Science': false,
       'Web Development': false,
       'Aerospace': false,
       'Design': false,
     }, // Althetic Skills, Office Skills
    };
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
    for (let key in this.state.buttons) {
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
    const sorted = _.sortBy(skills, ['compentency','title']);

    for (let skill of sorted) {
      if (skill.category == activeCategory || _.includes(skill.category, activeCategory)) {
        rows.push(
          <SkillBar
            data={skill}
            key={skill.title}
          />
        );
      }
      console.log(skill);
    }
    /*
    return skills.map((skill) => {
      return <Skill
        data={skill}
        key={skill.title} />;
    }); */
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
