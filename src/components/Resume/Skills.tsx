import { useState } from 'react';
import type { ICategory, ISkill } from '../../data/resume/skills';
import CategoryButton from './Skills/CategoryButton';
import SkillBar from './Skills/SkillBar';

export interface ISkillsComponent {
  skills: ISkill[];
  categories: ICategory[];
}

const Skills = (data: ISkillsComponent) => {
  const initialButtons = Object.fromEntries(
    [['All', false]].concat(data.categories.map(({ name }) => [name, false]))
  );

  const [buttons, setButtons] = useState(initialButtons);

  interface INewButtons {
    All: boolean;
    [key: string]: any;
  }

  const handleChildClick = (label: string) => {
    // Toggle button that was clicked. Turn all other buttons off.
    const newButtons: INewButtons = { All: false };
    for (const key of Object.keys(buttons)) {
      newButtons[key] = label === key && !buttons[key];
    }
    // Turn on 'All' button if other buttons are off
    newButtons.All = !Object.keys(buttons).some((key) => newButtons[key]);
    setButtons(newButtons);
  };

  const getRows = () => {
    // search for true active categories
    const actCat = Object.keys(buttons).reduce(
      (cat, key) => (buttons[key] ? key : cat),
      'All'
    );

    const comparator = (a: ISkill, b: ISkill) => {
      let ret = 0;
      if (a.competency > b.competency) ret = -1;
      else if (a.competency < b.competency) ret = 1;
      else if (a.category[0] > b.category[0]) ret = -1;
      else if (a.category[0] < b.category[0]) ret = 1;
      else if (a.title > b.title) ret = 1;
      else if (a.title < b.title) ret = -1;
      return ret;
    };

    return data.skills
      .sort(comparator)
      .filter((skill) => actCat === 'All' || skill.category.includes(actCat))
      .map((skill) => (
        <SkillBar categories={data.categories} data={skill} key={skill.title} />
      ));
  };

  const getButtons = () =>
    Object.keys(buttons).map((key) => (
      <CategoryButton
        label={key}
        key={key}
        active={buttons}
        handleClick={handleChildClick}
      />
    ));

  return (
    <section id="skills">
      <h2 className="mb-2 text-[length:var(--text-section)] font-semibold">
        Skills
      </h2>
      <p className="mb-5 text-muted">
        Some of my primary professional skills. Filter by category.
      </p>
      <div className="mb-6 flex flex-wrap gap-2">{getButtons()}</div>
      <div className="grid gap-4 sm:grid-cols-2">{getRows()}</div>
    </section>
  );
};

export default Skills;
