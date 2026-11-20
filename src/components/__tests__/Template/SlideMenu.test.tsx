import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SlideMenu from '../../Template/SlideMenu';

function menu(isOpen: boolean, onClose = vi.fn()) {
  return (
    <SlideMenu id="test-menu" isOpen={isOpen} onClose={onClose}>
      <a href="/link1">Link 1</a>
    </SlideMenu>
  );
}

const dialog = () => document.getElementById('test-menu') as HTMLDialogElement;

// The browser owns focus, inertness, and Escape for a modal dialog. These
// cover what the component adds to it.
describe('SlideMenu', () => {
  it('opens as a modal dialog and closes when told to', () => {
    const { rerender } = render(menu(false));
    expect(dialog()).not.toHaveAttribute('open');

    rerender(menu(true));
    expect(dialog()).toHaveAttribute('open');

    rerender(menu(false));
    expect(dialog()).not.toHaveAttribute('open');
  });

  it('reports a close the browser makes, as on Escape', () => {
    const onClose = vi.fn();
    render(menu(true, onClose));

    dialog().close();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on a backdrop click, not on a click or drag from the sheet', () => {
    const onClose = vi.fn();
    render(menu(true, onClose));
    const link = screen.getByText('Link 1');

    // Pressed in the sheet and released over the backdrop: the click lands on
    // their common ancestor, the dialog.
    fireEvent.pointerDown(link);
    fireEvent.click(dialog());
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(dialog());
    fireEvent.click(dialog());
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
