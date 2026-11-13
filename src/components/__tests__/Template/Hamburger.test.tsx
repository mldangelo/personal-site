import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import routes from '@/data/routes';
import { THEME_CHOICE_ATTRIBUTE } from '@/lib/theme';
import { smartQuotes } from '@/lib/typography';
import Hamburger from '../../Template/Hamburger';

/** Adds the header stylesheets in `files` order, as `app/tailwind.css` would. */
function addStyles(files: readonly string[], width: 'phone' | 'desktop') {
  for (const file of files) {
    const css = readFileSync(
      join(process.cwd(), 'app/styles/layout', file),
      'utf8',
    );
    const style = document.createElement('style');
    // jsdom has no container layout and a fixed 1024px media-query viewport.
    // Supply the layout decision here to exercise the real cascade; actual
    // sizing and enlarged-text reflow need a browser.
    const layoutCss = css.replace(
      /@container site-header\s*\([^)]*\)/g,
      `@media (min-width: ${width === 'desktop' ? '0' : '1e5'}px)`,
    );
    style.textContent =
      width === 'phone'
        ? layoutCss.replaceAll(
            /\((min|max)-width: 73[56]px\)/g,
            '($1-width: 1e5px)',
          )
        : layoutCss;
    style.dataset.test = '';
    document.head.append(style);
  }
}

function menuButton() {
  return document.querySelector('.hamburger-button') as HTMLElement;
}

describe('Hamburger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute(THEME_CHOICE_ATTRIBUTE);
    for (const style of document.querySelectorAll('style[data-test]')) {
      style.remove();
    }
  });

  // The gate in navigation.css has to beat header.css's `display: flex` whichever
  // `@import` comes first.
  it.each([
    ['header.css', 'navigation.css'],
    ['navigation.css', 'header.css'],
  ])(
    'stays hidden on a phone until the bootstrap proves scripts ran (%s, then %s)',
    (...files) => {
      addStyles(files, 'phone');
      render(<Hamburger />);

      expect(menuButton()).not.toBeVisible();

      document.documentElement.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
      expect(menuButton()).toBeVisible();
    },
  );

  it('stays hidden when the desktop links fit, even after the bootstrap runs', () => {
    addStyles(['header.css', 'navigation.css'], 'desktop');
    render(<Hamburger />);

    document.documentElement.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
    expect(menuButton()).not.toBeVisible();
  });

  it('opens and closes the menu it controls, and says which it will do', () => {
    render(<Hamburger />);

    const button = screen.getByRole('button', {
      name: 'Open navigation menu',
    });
    const menu = document.getElementById(
      button.getAttribute('aria-controls') ?? '',
    );
    expect(menu).toHaveAttribute('inert');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-label', 'Close navigation menu');
    expect(menu).not.toHaveAttribute('inert');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-label', 'Open navigation menu');
  });

  it('closes and unlocks scrolling when CSS hides the trigger, and can reopen', () => {
    let notifyResize = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class implements ResizeObserver {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = disconnect;
        constructor(callback: ResizeObserverCallback) {
          notifyResize = () => callback([], this);
        }
      },
    );
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(240);
    const { unmount } = render(<Hamburger />);
    const button = screen.getByRole('button', { name: 'Open navigation menu' });
    // jsdom has no layout. A rendered button has a box; display:none has none.
    const boxes = vi
      .spyOn(button, 'getClientRects')
      .mockReturnValue({ length: 1 } as DOMRectList);

    fireEvent.click(button);
    act(() => notifyResize());
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(document.body.style.position).toBe('fixed');

    boxes.mockReturnValue({ length: 0 } as DOMRectList);
    act(() => notifyResize());
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('mobile-nav-menu')).toHaveAttribute('inert');
    expect(document.body.style.position).toBe('');
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 240);
    expect(disconnect).toHaveBeenCalledTimes(1);

    boxes.mockReturnValue({ length: 1 } as DOMRectList);
    fireEvent.click(button);
    act(() => notifyResize());
    expect(button).toHaveAttribute('aria-expanded', 'true');
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(2);
    expect(document.body.style.position).toBe('');
  });

  // The only nav a phone gets, so every promoted route has to be in it and no
  // demoted one. The count stops a demotion passing unmentioned.
  it('lists every primary route and closes when one is followed', () => {
    render(<Hamburger />);
    const button = screen.getByRole('button', {
      name: 'Open navigation menu',
    });
    fireEvent.click(button);

    const primary = routes.filter((route) => route.primary !== false);
    expect(screen.getAllByRole('link')).toHaveLength(primary.length);
    for (const route of primary) {
      expect(
        screen.getByRole('link', { name: smartQuotes(route.label) }),
      ).toBeVisible();
    }

    fireEvent.click(
      screen.getByRole('link', { name: smartQuotes(primary[0].label) }),
    );
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
