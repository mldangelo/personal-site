'use client';

import { useCallback, useMemo, useState } from 'react';

import type { Category, Skill } from '@/data/resume/skills';

import CategoryButton from './Skills/CategoryButton';
import SkillTag from './Skills/SkillTag';

interface SkillsProps {
  skills: Skill[];
  categories: Category[];
}

export const ALL_CATEGORY = 'All';

/**
 * One selected category at a time, held as a string.
 *
 * This replaced a `Record<string, boolean>` reducer that recomputed its own
 * `All` flag from the map it was building, so clicking "All" always left it
 * `aria-pressed="false"` — and on first paint every filter reported unpressed
 * while all skills were showing.
 */
export default function Skills({ skills, categories }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);

  // Selecting the category that is already active returns to All, which keeps
  // the toggle affordance the buttons' pressed state implies.
  const handleChildClick = useCallback((label: string) => {
    setActiveCategory((current) => (current === label ? ALL_CATEGORY : label));
  }, []);

  const buttonElements = useMemo(
    () =>
      [ALL_CATEGORY, ...categories.map(({ name }) => name)].map((name) => (
        <CategoryButton
          label={name}
          key={name}
          isActive={activeCategory === name}
          handleClick={handleChildClick}
        />
      )),
    [categories, activeCategory, handleChildClick],
  );

  /**
   * Every category is always rendered; the inactive ones are hidden with CSS.
   *
   * Filtering by removing groups from the DOM meant a printed page reflected
   * whatever filter happened to be set, silently omitting skills. Keeping the
   * markup lets `print.css` show everything regardless.
   */
  const groupedSkills = useMemo(() => {
    const sortedSkills = [...skills].sort((a, b) => {
      if (a.competency !== b.competency) return b.competency - a.competency;
      return a.title.localeCompare(b.title);
    });

    return categories
      .map((category) => ({
        category,
        skills: sortedSkills.filter((skill) =>
          skill.category.includes(category.name),
        ),
      }))
      .filter((group) => group.skills.length > 0);
  }, [skills, categories]);

  return (
    <div className="skills">
      <div className="title">
        <h2>Skills</h2>
      </div>
      <div className="skill-button-container">{buttonElements}</div>
      <div className="skill-groups">
        {groupedSkills.map(({ category, skills: categorySkills }) => {
          const isVisible =
            activeCategory === ALL_CATEGORY || activeCategory === category.name;

          return (
            <div
              key={category.name}
              className="skill-group"
              hidden={!isVisible}
            >
              <h3 className="skill-group-title">{category.name}</h3>
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
}
