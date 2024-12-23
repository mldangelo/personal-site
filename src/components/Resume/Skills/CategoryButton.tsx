import type React from 'react';
import type { CategoryButtonProps } from '../../../types';

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
