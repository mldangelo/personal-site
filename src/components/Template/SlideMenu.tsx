'use client';

import {
  type MouseEvent,
  type ReactNode,
  useLayoutEffect,
  useRef,
} from 'react';

interface SlideMenuProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * The mobile navigation drawer, a native modal `<dialog>`.
 *
 * `showModal()` puts it in the top layer, makes the page behind it inert,
 * moves focus to its first control, closes it on Escape or a platform back
 * gesture, and returns focus to the trigger when it closes. None of that is
 * reimplemented here.
 */
export default function SlideMenu({
  id,
  isOpen,
  onClose,
  children,
}: SlideMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // A layout effect, so a caller that closes the menu and then moves focus
  // (`Hamburger`, when its trigger disappears) can flush the close first:
  // nothing outside a modal dialog can take focus.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // The sheet fills the dialog, so a click that lands on the dialog itself
  // landed on its backdrop.
  const closeFromBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-label="Navigation menu"
      className="slide-menu"
      onClose={onClose}
      onClick={closeFromBackdrop}
    >
      <div className="slide-menu-sheet">{children}</div>
    </dialog>
  );
}
