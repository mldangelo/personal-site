'use client';

import { useMemo, useState } from 'react';
import {
  byCompetency,
  type ICategory,
  type ISkill
} from '@/data/resume/skills';

const ALL = 'All';

interface SkillFilterProps {
  skills: ISkill[];
  categories: ICategory[];
}

const SkillFilter = ({ skills, categories }: SkillFilterProps) => {
  // One selection at a time, so a single value — not a map of booleans in which
  // exactly one is ever true.
  const [active, setActive] = useState(ALL);

  const filters = [ALL, ...categories.map((c) => c.name)];

  const visible = useMemo(
    () =>
      [...skills]
        .sort(byCompetency)
        .filter((skill) => active === ALL || skill.category.includes(active)),
    [skills, active]
  );

  const colorFor = (skill: ISkill) =>
    categories.find((cat) => skill.category.includes(cat.name))?.color ??
    'var(--color-accent)';

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((label) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === label}
            onClick={() => setActive(label)}
            className={`nav-link border px-3 py-1.5 ${
              active === label
                ? 'border-accent bg-accent-subtle text-accent'
                : 'border-rule text-muted hover:border-accent hover:text-fg'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {visible.map((skill) => (
          <div key={skill.title}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[0.92rem]">{skill.title}</span>
              <span className="font-mono text-[0.72rem] text-faint tabular-nums">
                {skill.competency}/5
              </span>
            </div>
            {/* Decorative: the competency is already announced as text above. */}
            <div aria-hidden="true" className="mt-2 h-[3px] bg-panel">
              <div
                className="h-full"
                style={{
                  width: `${Math.min(100, Math.max((skill.competency / 5) * 100, 0))}%`,
                  background: colorFor(skill)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SkillFilter;
