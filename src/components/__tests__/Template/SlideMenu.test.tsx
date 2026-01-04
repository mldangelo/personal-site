import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SlideMenu from '../../Template/SlideMenu';

describe('SlideMenu', () => {
  const defaultProps = {
    id: 'test-menu',
    isOpen: false,
    onClose: vi.fn(),
    children: (
      <>
        <a href="/link1">Link 1</a>
        <button type="button">Button</button>
        <a href="/link2">Link 2</a>
      </>
    ),
  };

  it('renders children content', () => {
    render(<SlideMenu {...defaultProps} isOpen />);

    expect(screen.getByText('Link 1')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
    expect(screen.getByText('Link 2')).toBeInTheDocument();
  });

  it('applies open class when isOpen is true', () => {
    render(<SlideMenu {...defaultProps} isOpen />);

    const menu = screen.getByRole('dialog');
    expect(menu).toHaveClass('slide-menu--open');
  });

  it('does not apply open class when closed', () => {
    render(<SlideMenu {...defaultProps} isOpen={false} />);

    const menu = screen.getByRole('dialog', { hidden: true });
    expect(menu).not.toHaveClass('slide-menu--open');
  });

  it('applies right position by default', () => {
    render(<SlideMenu {...defaultProps} isOpen />);

    const menu = screen.getByRole('dialog');
    expect(menu).toHaveClass('slide-menu--right');
  });

  it('applies left position when specified', () => {
    render(<SlideMenu {...defaultProps} isOpen position="left" />);

    const menu = screen.getByRole('dialog');
    expect(menu).toHaveClass('slide-menu--left');
  });

  it('sets aria-hidden based on isOpen', () => {
    const { rerender } = render(<SlideMenu {...defaultProps} isOpen={false} />);

    const menu = screen.getByRole('dialog', { hidden: true });
    expect(menu).toHaveAttribute('aria-hidden', 'true');

    rerender(<SlideMenu {...defaultProps} isOpen />);
    expect(menu).toHaveAttribute('aria-hidden', 'false');
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<SlideMenu {...defaultProps} isOpen onClose={onClose} />);

    const overlay = document.querySelector('.slide-menu-overlay');
    fireEvent.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<SlideMenu {...defaultProps} isOpen onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closed', () => {
    const onClose = vi.fn();
    render(<SlideMenu {...defaultProps} isOpen={false} onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll when open', () => {
    render(<SlideMenu {...defaultProps} isOpen />);

    expect(document.body.style.position).toBe('fixed');
  });

  it('unlocks body scroll when closed', () => {
    const { rerender } = render(<SlideMenu {...defaultProps} isOpen />);

    expect(document.body.style.position).toBe('fixed');

    rerender(<SlideMenu {...defaultProps} isOpen={false} />);

    expect(document.body.style.position).toBe('');
  });

  it('focuses first focusable element when opened', () => {
    render(<SlideMenu {...defaultProps} isOpen />);

    const firstLink = screen.getByText('Link 1');
    expect(document.activeElement).toBe(firstLink);
  });

  it('traps focus within the menu', () => {
    render(<SlideMenu {...defaultProps} isOpen />);

    const lastLink = screen.getByText('Link 2');
    const firstLink = screen.getByText('Link 1');

    // Focus the last element and tab forward
    lastLink.focus();
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Tab',
      shiftKey: false,
    });

    expect(document.activeElement).toBe(firstLink);
  });

  it('traps focus in reverse when shift-tabbing', () => {
    render(<SlideMenu {...defaultProps} isOpen />);

    const lastLink = screen.getByText('Link 2');

    // First element is focused on open, shift-tab should go to last
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Tab',
      shiftKey: true,
    });

    expect(document.activeElement).toBe(lastLink);
  });

  it('has correct id attribute', () => {
    render(<SlideMenu {...defaultProps} isOpen id="custom-menu" />);

    const menu = screen.getByRole('dialog');
    expect(menu).toHaveAttribute('id', 'custom-menu');
  });
});
