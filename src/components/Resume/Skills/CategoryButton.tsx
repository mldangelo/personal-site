import React from 'react';

interface CategoryButtonProps {
  label: string;
  handleClick: (label: string) => void;
  active: Record<string, boolean>;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ handleClick, active, label }) => (
  <button
    className={`skillbutton ${active[label] ? 'skillbutton-active' : ''}`}
    type="button"
    onClick={() => handleClick(label)}
  >
    {label}
  </button>
);

export default CategoryButton;
