interface CategoryButtonProps {
  label: string;
  handleClick: (label: string) => void;
  isActive: boolean;
}

export default function CategoryButton({
  handleClick,
  isActive,
  label,
}: CategoryButtonProps) {
  return (
    <button
      className={`skillbutton ${isActive ? 'skillbutton-active' : ''}`}
      type="button"
      onClick={() => handleClick(label)}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}
