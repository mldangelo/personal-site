import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SlideMenu from '../../Template/SlideMenu';

function menu(isOpen: boolean, onClose = vi.fn()) {
  return (
    <SlideMenu id="test-menu" isOpen={isOpen} onClose={onClose}>
      <a href="/link1">Link 1</a>
      <button type="button">Button</button>
      <a href="/link2">Link 2</a>
    </SlideMenu>
  );
}

describe('SlideMenu', () => {
  it('closes on an overlay click', () => {
    const onClose = vi.fn();
    render(menu(true, onClose));

    fireEvent.click(document.querySelector('.slide-menu-overlay') as Element);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape, only while open', () => {
    const onClose = vi.fn();
    const { rerender } = render(menu(false, onClose));

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();

    rerender(menu(true, onClose));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open, and on close unlocks and scrolls back', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120);
    const { rerender } = render(menu(true));
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.top).toBe('-120px');

    rerender(menu(false));
    expect(document.body.style.position).toBe('');
    expect(window.scrollTo).toHaveBeenCalledWith(0, 120);
    vi.restoreAllMocks();
  });

  it('moves focus into the menu on open and restores it on close', () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();

    const { rerender } = render(menu(false));

    rerender(menu(true));
    expect(screen.getByText('Link 1')).toHaveFocus();

    rerender(menu(false));
    expect(trigger).toHaveFocus();

    trigger.remove();
  });

  it.each([
    ['Tab from the last element', 'Link 2', false, 'Link 1'],
    ['Shift+Tab from the first element', 'Link 1', true, 'Link 2'],
  ])('traps %s', (_keys, from, shiftKey, to) => {
    render(menu(true));
    screen.getByText(from).focus();

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab', shiftKey });

    expect(screen.getByText(to)).toHaveFocus();
  });
});
