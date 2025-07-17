'use client';

import React, { useState } from 'react';

import type { Category, Skill } from '@/data/resume/skills';

import CategoryButton from './Skills/CategoryButton';
import SkillBar from './Skills/SkillBar';

interface SkillsProps {
  skills: Skill[];
  categories: Category[];
}

const Skills: React.FC<SkillsProps> = ({ skills, categories }) => {
  const initialButtons = Object.fromEntries(
    [['All', false]].concat(categories.map(({ name }) => [name, false])),
  );

  const [buttons, setButtons] = useState(initialButtons);

  const handleChildClick = (label: string) => {
    // Toggle button that was clicked. Turn all other buttons off.
    const newButtons = Object.keys(buttons).reduce(
      (obj, key) => ({
        ...obj,
        [key]: label === key && !buttons[key],
      }),
      {} as Record<string, boolean>,
    );
    // Turn on 'All' button if other buttons are off
    newButtons.All = !Object.keys(buttons).some((key) => newButtons[key]);
    setButtons(newButtons);
  };

  const getButtons = () =>
    Object.keys(buttons).map((key) => (
      <CategoryButton label={key} key={key} active={buttons} handleClick={handleChildClick} />
    ));

  const getRows = () => {
    // search for true active categories
    const actCat = Object.keys(buttons).reduce((cat, key) => (buttons[key] ? key : cat), 'All');

    const comparator = (a: Skill, b: Skill) => {
      let ret = 0;
      if (a.competency > b.competency) ret = -1;
      else if (a.competency < b.competency) ret = 1;
      else if (a.category[0] > b.category[0]) ret = -1;
      else if (a.category[0] < b.category[0]) ret = 1;
      else if (a.title > b.title) ret = 1;
      else if (a.title < b.title) ret = -1;
      return ret;
    };

    return skills
      .sort(comparator)
      .filter((skill) => actCat === 'All' || skill.category.includes(actCat))
      .map((skill) => <SkillBar categories={categories} data={skill} key={skill.title} />);
  };

  return (
    <div className="skills">
      <div className="link-to" id="skills" />
      <div className="title">
        <h3>Skills</h3>
        <p>
          Note: I think these sections are silly, but everyone seems to have one. Here is a *mostly*
          honest overview of my skills.
        </p>
      </div>
      <div className="skill-button-container">{getButtons()}</div>
      <div className="skill-row-container">{getRows()}</div>
    </div>
  );
};

export default Skills;
