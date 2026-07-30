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
   *
   * The source data is already ordered editorially, and that order is the only
   * hierarchy the section has, so nothing here sorts. A group with no skills is
   * dropped rather than rendered as an empty heading.
   */
  const groupedSkills = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        skills: skills.filter((skill) => skill.category === category.name),
      }))
      .filter((group) => group.skills.length > 0);
  }, [skills, categories]);

  /**
   * Counted from the groups that are actually rendered, never stated, so the
   * announcement cannot drift from what is on screen. Summing group lengths is
   * exact because a skill declares one category, so it renders in one group —
   * this used to de-duplicate by title, which was load-bearing when a skill
   * could appear under several.
   */
  const totalSkillCount = useMemo(
    () =>
      groupedSkills.reduce(
        (total, { skills: group }) => total + group.length,
        0,
      ),
    [groupedSkills],
  );

  const visibleSkillCount = useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return totalSkillCount;

    return (
      groupedSkills.find(({ category }) => category.name === activeCategory)
        ?.skills.length ?? 0
    );
  }, [activeCategory, groupedSkills, totalSkillCount]);

  /**
   * `aria-pressed` on the buttons reports the state of the control; it says
   * nothing about the result of pressing it, and the result here is that most
   * of the section silently disappears. This states the outcome instead.
   *
   * It stays `.sr-only`: printing un-hides every group regardless of the filter,
   * so a visible count would contradict the page it is printed on.
   */
  const noun = totalSkillCount === 1 ? 'skill' : 'skills';
  const filterStatus =
    activeCategory === ALL_CATEGORY
      ? `Showing all ${totalSkillCount} ${noun}.`
      : `Showing ${visibleSkillCount} of ${totalSkillCount} ${noun} in ${activeCategory}.`;

  return (
    <div className="skills">
      <div className="title">
        <h2>Skills</h2>
      </div>
      <div className="skill-button-container">{buttonElements}</div>
      <p className="sr-only" role="status" aria-live="polite">
        {filterStatus}
      </p>
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
                  <SkillTag key={skill.title} data={skill} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
