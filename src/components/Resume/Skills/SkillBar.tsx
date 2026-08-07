import type { ICategory, ISkill } from '../../../data/resume/skills';

export interface ISkillBar {
  data: ISkill;
  categories: ICategory[];
}

const SkillBar = ({ data, categories }: ISkillBar) => {
  const { category, competency, title } = data;
  const color = categories.find((cat) => category.includes(cat.name))?.color;
  const pct = Math.min(100, Math.max((competency / 5) * 100, 0));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.92rem]">{title}</span>
        <span className="font-mono text-[0.72rem] text-faint tabular-nums">
          {competency}/5
        </span>
      </div>
      {/* Decorative: the competency is already announced as text above. */}
      <div aria-hidden="true" className="mt-2 h-[3px] bg-panel">
        <div
          className="h-full"
          style={{
            width: `${pct}%`,
            background: color ?? 'var(--color-accent)'
          }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
