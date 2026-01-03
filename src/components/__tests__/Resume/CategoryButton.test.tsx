import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import CategoryButton from '../../Resume/Skills/CategoryButton';

describe('CategoryButton', () => {
  it('renders button with label', () => {
    const handleClick = vi.fn();
    const active = { Languages: false };

    render(
      <CategoryButton
        label="Languages"
        handleClick={handleClick}
        active={active}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Languages' }),
    ).toBeInTheDocument();
  });

  it('calls handleClick with label when clicked', () => {
    const handleClick = vi.fn();
    const active = { Languages: false };

    render(
      <CategoryButton
        label="Languages"
        handleClick={handleClick}
        active={active}
      />,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith('Languages');
  });

  it('applies active class when active', () => {
    const handleClick = vi.fn();
    const active = { Languages: true };

    render(
      <CategoryButton
        label="Languages"
        handleClick={handleClick}
        active={active}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('skillbutton-active');
  });

  it('does not apply active class when inactive', () => {
    const handleClick = vi.fn();
    const active = { Languages: false };

    render(
      <CategoryButton
        label="Languages"
        handleClick={handleClick}
        active={active}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).not.toHaveClass('skillbutton-active');
  });

  it('has correct aria-pressed attribute', () => {
    const handleClick = vi.fn();

    const { rerender } = render(
      <CategoryButton
        label="Languages"
        handleClick={handleClick}
        active={{ Languages: false }}
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <CategoryButton
        label="Languages"
        handleClick={handleClick}
        active={{ Languages: true }}
      />,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });
});
