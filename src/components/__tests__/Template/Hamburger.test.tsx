import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import routes from '@/data/routes';
import { THEME_CHOICE_ATTRIBUTE } from '@/lib/theme';
import { smartQuotes } from '@/lib/typography';
import Hamburger from '../../Template/Hamburger';

describe('Hamburger', () => {
  // The gate in navigation.css has to beat header.css's `display: flex` whichever
  // `@import` comes first. Asserts the button's own `display`: jsdom drops the
  // `@media (max-width: 735px)`, so `toBeVisible()` sees an ancestor's `none`.
  it.each([
    ['header.css', 'navigation.css'],
    ['navigation.css', 'header.css'],
  ])(
    'stays hidden until the bootstrap proves scripts ran (%s, then %s)',
    (...files) => {
      const root = document.documentElement;
      const styles = files.map((file) => {
        const style = document.createElement('style');
        style.textContent = readFileSync(
          join(process.cwd(), 'app/styles/layout', file),
          'utf8',
        );
        document.head.append(style);
        return style;
      });

      render(<Hamburger />);
      const button = document.querySelector('.hamburger-button') as Element;
      const display = () => window.getComputedStyle(button).display;

      expect(display()).toBe('none');

      root.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');
      expect(display()).toBe('flex');

      root.removeAttribute(THEME_CHOICE_ATTRIBUTE);
      for (const style of styles) style.remove();
    },
  );

  it('opens and closes the menu it controls, and says which it will do', () => {
    render(<Hamburger />);

    const button = screen.getByRole('button', {
      name: 'Open navigation menu',
    });
    const menu = document.getElementById(
      button.getAttribute('aria-controls') ?? '',
    );
    expect(menu).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-label', 'Close navigation menu');
    expect(menu).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-label', 'Open navigation menu');
  });

  // The only nav a phone gets, so every promoted route has to be in it and no
  // demoted one. The count stops a demotion passing unmentioned.
  it('lists every primary route and closes when one is followed', () => {
    render(<Hamburger />);
    const button = screen.getByRole('button');
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
