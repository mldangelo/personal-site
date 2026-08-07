export interface ICategoryButton {
  handleClick: (label: string) => void;
  active: Record<string, boolean>;
  label: string;
}

const CategoryButton = ({ handleClick, active, label }: ICategoryButton) => (
  <button
    type="button"
    aria-pressed={active[label]}
    onClick={() => handleClick(label)}
    className={`border px-3 py-1.5 font-mono text-[0.72rem] tracking-nav uppercase transition-colors ${
      active[label]
        ? 'border-accent bg-accent-subtle text-accent'
        : 'border-rule text-muted hover:border-accent hover:text-fg'
    }`}
  >
    {label}
  </button>
);

export default CategoryButton;
