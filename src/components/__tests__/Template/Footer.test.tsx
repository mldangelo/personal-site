import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import contact from '@/data/contact';
import profile from '@/data/profile.json';
import routes from '@/data/routes';

import Footer from '../../Template/Footer';

const NEW_TAB = '(opens in a new tab)';

/** The links of one labelled group, in the order a reader meets them. */
function linksIn(group: HTMLElement): HTMLAnchorElement[] {
  return within(group).getAllByRole<HTMLAnchorElement>('link');
}

/** What is printed for a link: its text without the screen-reader-only note. */
function printed(link: HTMLElement): string {
  const copy = link.cloneNode(true) as HTMLElement;
  for (const note of copy.querySelectorAll('.sr-only')) {
    note.remove();
  }

  return (copy.textContent ?? '').trim();
}

describe('Footer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the footer with correct structure', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the name, set with a typographic apostrophe, and the role', () => {
    render(<Footer />);

    expect(screen.getByText('Michael D’Angelo')).toBeInTheDocument();
    expect(screen.queryByText("Michael D'Angelo")).not.toBeInTheDocument();
    expect(
      screen.getByText('Member of the Technical Staff at OpenAI'),
    ).toBeInTheDocument();
  });

  it('does not introduce unrelated headings into the page outline', () => {
    render(<Footer />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  // A frozen clock, so the assertion is the year a reader would see rather
  // than a second call to the expression that produced it.
  it('dates the copyright with the year it is built in', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2031-06-15T12:00:00Z'));

    render(<Footer />);

    expect(screen.getByText(/© 2031/)).toBeInTheDocument();
  });

  describe('Explore', () => {
    it('links every page in the route registry but the homepage', () => {
      render(<Footer />);

      const links = linksIn(
        screen.getByRole('navigation', { name: 'Explore' }),
      );
      const pages = routes.filter((route) => !route.index);

      expect(links.map((link) => link.textContent)).toEqual(
        pages.map((route) => route.label),
      );
      expect(links.map((link) => link.getAttribute('href'))).toEqual(
        pages.map((route) => route.path),
      );
    });

    // `/stats` is kept out of the header and the mobile menu, so this list is
    // the only way to reach it.
    it('is the way to the page the header leaves out', () => {
      render(<Footer />);

      const explore = screen.getByRole('navigation', { name: 'Explore' });

      expect(
        within(explore).getByRole('link', { name: 'Stats' }),
      ).toHaveAttribute('href', '/stats');
    });

    it('stays on the site, so no link carries the new-tab mark or opens one', () => {
      render(<Footer />);

      for (const link of linksIn(
        screen.getByRole('navigation', { name: 'Explore' }),
      )) {
        expect(link).not.toHaveAttribute('target');
        expect(link.textContent).not.toContain('↗');
        expect(link.textContent).not.toContain(NEW_TAB);
      }
    });
  });

  describe('Connect', () => {
    it('names its list, so the label is announced with the links', () => {
      render(<Footer />);

      expect(screen.getByRole('list', { name: 'Connect' })).toBeInTheDocument();
    });

    it('lists every contact destination by name, the four most used first', () => {
      render(<Footer />);

      const names = linksIn(screen.getByRole('list', { name: 'Connect' })).map(
        (link) => printed(link).replace('↗', ''),
      );

      expect(names.slice(0, 4)).toEqual(['GitHub', 'LinkedIn', 'X', 'Email']);
      expect(names).toEqual(contact.map((item) => item.label));
    });

    it('points each link at the destination in the contact data', () => {
      render(<Footer />);

      const links = linksIn(screen.getByRole('list', { name: 'Connect' }));

      expect(links.map((link) => link.getAttribute('href'))).toEqual(
        contact.map((item) => item.link),
      );
    });

    it('opens every destination off the site in a new tab, and says so', () => {
      render(<Footer />);

      const connect = screen.getByRole('list', { name: 'Connect' });
      const offSite = contact.filter(
        (item) => !item.link.startsWith('mailto:'),
      );

      expect(offSite.length).toBeGreaterThan(0);

      for (const item of offSite) {
        const link = within(connect).getByRole('link', {
          name: `${item.label} ${NEW_TAB}`,
        });

        expect(link).toHaveAttribute('target', '_blank');
        expect(link.getAttribute('rel')?.split(' ')).toEqual(
          expect.arrayContaining(['noopener', 'noreferrer']),
        );
        // The arrow is for the eye only; the words carry it for a screen reader.
        expect(printed(link)).toBe(`${item.label}↗`);
        expect(link.querySelector('[aria-hidden="true"]')).toHaveTextContent(
          '↗',
        );
      }
    });

    // A mailto: hands off to a mail client. It opens no tab, so it carries
    // neither the mark nor the warning.
    it('links the email address as a plain mailto', () => {
      render(<Footer />);

      const email = within(
        screen.getByRole('list', { name: 'Connect' }),
      ).getByRole('link', { name: 'Email' });

      expect(email).toHaveAttribute('href', `mailto:${profile.email}`);
      expect(email).not.toHaveAttribute('target');
      expect(email).not.toHaveAttribute('rel');
      expect(email.textContent).toBe('Email');
    });
  });

  it('draws no icons and no portrait: every destination is a word', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');

    expect(footer.querySelector('svg')).not.toBeInTheDocument();
    expect(footer.querySelector('img')).not.toBeInTheDocument();
  });

  it('links the source, which leaves the site like any other destination', () => {
    render(<Footer />);

    const source = screen.getByRole('link', { name: `Source ${NEW_TAB}` });

    expect(source).toHaveAttribute(
      'href',
      'https://github.com/mldangelo/personal-site',
    );
    expect(source).toHaveAttribute('target', '_blank');
    expect(source.getAttribute('rel')).toContain('noopener');
  });

  // The 44px target and the focus indicator both come from this class. A link
  // added without it would be 20px tall on a phone.
  it('gives every link the footer link treatment', () => {
    render(<Footer />);

    const links = within(screen.getByRole('contentinfo')).getAllByRole('link');

    expect(links).toHaveLength(routes.length - 1 + contact.length + 1);
    for (const link of links) {
      expect(link).toHaveClass('footer-link');
    }
  });
});
