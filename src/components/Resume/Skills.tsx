'use client';

import React, { useMemo, useReducer } from 'react';

import type { Category, Skill } from '@/data/resume/skills';

import CategoryButton from './Skills/CategoryButton';
import SkillTag from './Skills/SkillTag';

interface SkillsProps {
  skills: Skill[];
  categories: Category[];
}

// React 19: Using useReducer for complex filter state management
type ButtonState = Record<string, boolean>;

type ButtonAction = {
  type: 'TOGGLE_CATEGORY';
  label: string;
};

const buttonReducer = (
  state: ButtonState,
  action: ButtonAction,
): ButtonState => {
  switch (action.type) {
    case 'TOGGLE_CATEGORY': {
      // Toggle button that was clicked. Turn all other buttons off.
      const newButtons = Object.keys(state).reduce(
        (obj, key) => ({
          ...obj,
          [key]: action.label === key && !state[key],
        }),
        {} as ButtonState,
      );
      // Turn on 'All' button if other buttons are off
      newButtons.All = !Object.keys(state).some((key) => newButtons[key]);
      return newButtons;
    }
    default:
      return state;
  }
};

const Skills: React.FC<SkillsProps> = ({ skills, categories }) => {
  const initialButtons = Object.fromEntries(
    [['All', false]].concat(categories.map(({ name }) => [name, false])),
  );

  const [buttons, dispatch] = useReducer(buttonReducer, initialButtons);

  const handleChildClick = (label: string) => {
    dispatch({ type: 'TOGGLE_CATEGORY', label });
  };

  const getButtons = () =>
    Object.keys(buttons).map((key) => (
      <CategoryButton
        label={key}
        key={key}
        isActive={buttons[key]}
        handleClick={handleChildClick}
      />
    ));

  // Get active category
  const activeCategory = Object.keys(buttons).reduce(
    (cat, key) => (buttons[key] ? key : cat),
    'All',
  );

  // Memoize sorting, filtering, and grouping to avoid recalculating on every render
  const groupedSkills = useMemo(() => {
    // Sort skills by competency (highest first), then alphabetically
    const sortedSkills = [...skills].sort((a, b) => {
      if (a.competency !== b.competency) return b.competency - a.competency;
      return a.title.localeCompare(b.title);
    });

    // Filter skills based on active category
    const filteredSkills = sortedSkills.filter(
      (skill) =>
        activeCategory === 'All' || skill.category.includes(activeCategory),
    );

    // Group skills by their primary category for grouped view
    if (activeCategory === 'All') {
      return categories.reduce(
        (groups, category) => {
          const categorySkills = filteredSkills.filter((skill) =>
            skill.category.includes(category.name),
          );
          if (categorySkills.length > 0) {
            groups[category.name] = categorySkills;
          }
          return groups;
        },
        {} as Record<string, Skill[]>,
      );
    }
    return { [activeCategory]: filteredSkills };
  }, [skills, categories, activeCategory]);

  return (
    <div className="skills">
      <div className="link-to" id="skills" />
      <div className="title">
        <h3>Skills</h3>
      </div>
      <div className="skill-button-container">{getButtons()}</div>
      <div className="skill-groups">
        {Object.entries(groupedSkills).map(([categoryName, categorySkills]) => {
          const category = categories.find((c) => c.name === categoryName);
          return (
            <div key={categoryName} className="skill-group">
              <h4
                className="skill-group-title"
                style={{ color: category?.color }}
              >
                {categoryName}
              </h4>
              <div className="skill-tags">
                {categorySkills.map((skill) => (
                  <SkillTag
                    key={skill.title}
                    data={skill}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;
