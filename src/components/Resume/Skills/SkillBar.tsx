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
        <span className="text-sm">{title}</span>
        <span className="font-mono text-xs text-muted tabular-nums">
          {competency}/5
        </span>
      </div>
      {/* Decorative: the competency is already announced as text above. */}
      <div
        aria-hidden="true"
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface"
      >
        <div
          className="h-full rounded-full"
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
