'use client';

import type { ReactNode } from 'react';

interface PrintButtonProps {
  /** The visible label, which is also the accessible name. */
  children: ReactNode;
  className?: string;
}

function printPage(): void {
  window.print();
}

/**
 * Opens the browser's print dialog, which is also where "Save as PDF" lives.
 *
 * A client leaf so the page that places it stays a server component: the click
 * handler is the only thing here that needs a browser. It ships in the static
 * HTML as a real button, so it holds its own space before hydration instead of
 * appearing after it.
 *
 * That makes it an enabled control that does nothing when scripts never run.
 * The stylesheet that places it has to hide it behind
 * `:root:not([data-theme-choice])`, the gate `navigation.css` puts on the theme
 * toggle, and hide it from print, where a button that prints is noise.
 */
export default function PrintButton({ children, className }: PrintButtonProps) {
  return (
    <button type="button" className={className} onClick={printPage}>
      {children}
    </button>
  );
}
