import React from 'react';

interface CategoryButtonProps {
  label: string;
  handleClick: (label: string) => void;
  isActive: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  handleClick,
  isActive,
  label,
}) => (
  <button
    className={`skillbutton ${isActive ? 'skillbutton-active' : ''}`}
    type="button"
    onClick={() => handleClick(label)}
    aria-pressed={isActive}
  >
    {label}
  </button>
);

export default CategoryButton;
