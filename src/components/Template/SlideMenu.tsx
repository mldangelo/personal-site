'use client';

import { type ReactNode, useCallback, useEffect, useRef } from 'react';

// Selector for focusable elements within the menu
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface SlideMenuProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right';
}

/**
 * Accessible slide-out menu panel.
 * Features: focus trapping, focus restoration, escape-to-close,
 * body scroll lock (iOS-safe), reduced-motion support via CSS.
 */
export default function SlideMenu({
  id,
  isOpen,
  onClose,
  children,
  position = 'right',
}: SlideMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Save scroll position and lock body scroll (iOS-safe)
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { body } = document;

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';

    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management: trap focus and restore on close
  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus first focusable element in menu
      const focusableElements =
        menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusableElements?.length) {
        focusableElements[0].focus();
      }
    } else if (previousActiveElement.current) {
      // Restore focus when closing
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Focus trapping
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements =
      menuRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, []);

  return (
    <>
      {/* Overlay - click to close */}
      <div
        className={`slide-menu-overlay${isOpen ? ' slide-menu-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Menu panel */}
      <div
        ref={menuRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`slide-menu slide-menu--${position}${isOpen ? ' slide-menu--open' : ''}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </>
  );
}
