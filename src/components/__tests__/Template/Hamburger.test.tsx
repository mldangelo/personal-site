import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

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
    // jsdom matches media queries against a fixed 1024px viewport, so they
    // always take the desktop side. A phone moves the 735/736px breakpoint out
    // of its reach.
    style.textContent =
      width === 'phone'
        ? css.replaceAll(/\((min|max)-width: 73[56]px\)/g, '($1-width: 1e5px)')
        : css;
    style.dataset.test = '';
    document.head.append(style);
  }
}

/** The button's own `display`: `toBeVisible()` would read an ancestor's. */
function display() {
  const button = document.querySelector('.hamburger-button') as Element;
  return window.getComputedStyle(button).display;
}

describe('Hamburger', () => {
  afterEach(() => {
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

      expect(display()).toBe('none');

      document.documentElement.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
      expect(display()).toBe('flex');
    },
  );

  // A gate that restored the button on the attribute, rather than hiding it on
  // its absence, would outrank the desktop hide and put it on every desktop.
  it('stays hidden on a desktop once the bootstrap has run', () => {
    addStyles(['header.css', 'navigation.css'], 'desktop');
    render(<Hamburger />);

    document.documentElement.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
    expect(display()).toBe('none');
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
