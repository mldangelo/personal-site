'use client';

import React, { useState } from 'react';

import { faChartBar, faCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ScrollAnimation } from '@/components/common/ScrollAnimation';
import type { Category, Skill } from '@/data/resume/skills';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

import CategoryButton from './Skills/CategoryButton';
import ModernSkillBar from './Skills/ModernSkillBar';
import SkillBar from './Skills/SkillBar';
import SkillBubble from './Skills/SkillBubble';

interface SkillsProps {
  skills: Skill[];
  categories: Category[];
}

const Skills: React.FC<SkillsProps> = ({ skills, categories }) => {
  const initialButtons = Object.fromEntries(
    [['All', false]].concat(categories.map(({ name }) => [name, false])),
  );

  const [buttons, setButtons] = useState(initialButtons);
  const [viewMode, setViewMode] = useState<'classic' | 'modern' | 'bubble'>('modern');
  const { isMobile } = useMobileDetection();

  const cycleViewMode = (direction: 'next' | 'prev') => {
    const modes = ['classic', 'modern', 'bubble'] as const;
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % modes.length
        : (currentIndex - 1 + modes.length) % modes.length;
    setViewMode(modes[nextIndex]);
  };

  const swipeRef = useSwipeGesture<HTMLDivElement>({
    onSwipeLeft: () => isMobile && cycleViewMode('next'),
    onSwipeRight: () => isMobile && cycleViewMode('prev'),
  });

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

    const filteredSkills = skills
      .sort(comparator)
      .filter((skill) => actCat === 'All' || skill.category.includes(actCat));

    if (viewMode === 'bubble') {
      return filteredSkills.map((skill) => (
        <SkillBubble categories={categories} data={skill} key={skill.title} />
      ));
    }

    return filteredSkills.map((skill) =>
      viewMode === 'modern' ? (
        <ModernSkillBar categories={categories} data={skill} key={skill.title} />
      ) : (
        <SkillBar categories={categories} data={skill} key={skill.title} />
      ),
    );
  };

  return (
    <div className="w-full" ref={swipeRef}>
      <div className="link-to" id="skills" />
      <ScrollAnimation animation="slideUp">
        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-4xl font-heading font-bold text-foreground-bold mb-2">Skills</h3>
              <div className="h-1 w-20 bg-gradient-to-r from-accent to-accent/50 rounded-full mb-4" />
            </div>
            {/* View toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => cycleViewMode('next')}
                className="text-sm px-3 py-1 rounded-md border border-border hover:border-accent hover:bg-accent/5 transition-all duration-200"
                title="Switch view mode"
              >
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon
                    icon={
                      viewMode === 'classic'
                        ? faChartBar
                        : viewMode === 'modern'
                          ? faStar
                          : faCircle
                    }
                    className="w-3 h-3"
                  />
                  {viewMode === 'classic' ? 'Classic' : viewMode === 'modern' ? 'Modern' : 'Bubble'}
                </span>
              </button>
            </div>
          </div>
          {isMobile && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Swipe left/right to change view
            </p>
          )}
          <p className="text-base text-foreground leading-relaxed max-w-3xl">
            Note: I think these sections are silly, but everyone seems to have one. Here is a
            *mostly* honest overview of my skills.
          </p>
        </div>
      </ScrollAnimation>
      <ScrollAnimation animation="slideUp" delay={200}>
        <div className="flex flex-wrap justify-center gap-2 mb-8">{getButtons()}</div>
      </ScrollAnimation>
      <ScrollAnimation
        animation="stagger"
        delay={300}
        className={
          viewMode === 'bubble'
            ? 'flex flex-wrap gap-4 justify-center items-center py-8'
            : viewMode === 'modern'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
              : 'space-y-2'
        }
      >
        {getRows()}
      </ScrollAnimation>
    </div>
  );
};

export default Skills;
