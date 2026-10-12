import Link from 'next/link';

import contact from '@/data/contact';
import work from '@/data/resume/work';
import routes from '@/data/routes';
import { currentPosition } from '@/lib/career';
import { smartQuotes } from '@/lib/typography';
import { AUTHOR_NAME } from '@/lib/utils';

const SOURCE_URL = 'https://github.com/mldangelo/personal-site';

interface FooterLinkProps {
  href: string;
  children: string;
}

/**
 * One footer link, dressed by where it goes. A page on this site is a plain
 * `Link`. A destination off it opens in a new tab and says so twice: `↗` for a
 * reader, which is decorative, and the words for a screen reader. A `mailto:`
 * hands off to a mail client instead of opening a tab, so it gets neither.
 *
 * The space before those words is a text node of its own, so the link's name
 * reads "GitHub (opens in a new tab)" wherever it is computed. It trails the
 * line the label is set on, so it takes up no room.
 */
function FooterLink({ href, children }: FooterLinkProps) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className="footer-link">
        {children}
      </Link>
    );
  }

  if (href.startsWith('mailto:')) {
    return (
      <a href={href} className="footer-link">
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="footer-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="footer-link-mark" aria-hidden="true">
        ↗
      </span>{' '}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export default function Footer() {
  const current = currentPosition(work);

  return (
    <footer className="site-footer-new">
      <div className="footer-content">
        {/* The name is the identity here. A 48px portrait used to sit beside
            it, repeating the one in the homepage hero directly above. */}
        <div className="footer-identity">
          <p className="footer-name">{smartQuotes(AUTHOR_NAME)}</p>
          {current ? (
            <p className="footer-role">
              {smartQuotes(`${current.position} at ${current.name}`)}
            </p>
          ) : null}
        </div>

        <div className="footer-right">
          {/* Driven from the same route registry as the header, which had
              drifted: the footer was missing Writing and Stats entirely.
              These are group labels, not document sections, so they are
              spans rather than headings. */}
          <nav className="footer-links" aria-labelledby="footer-links-heading">
            <span id="footer-links-heading" className="footer-label">
              Explore
            </span>
            <ul className="footer-list">
              {routes
                .filter((route) => !route.index)
                .map((route) => (
                  <li key={route.path}>
                    <FooterLink href={route.path}>{route.label}</FooterLink>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Every destination in `src/data/contact.ts`, by name and in that
              file's order. The label names the list itself: on the wrapping
              element it named nothing, because a `div` has no role that takes
              a name. The role is spelled out for Safari, which stops exposing
              a `ul` as a list once its markers are styled away, and would
              drop the name along with it. */}
          <div className="footer-social">
            <span id="footer-social-heading" className="footer-label">
              Connect
            </span>
            <ul
              className="footer-list"
              role="list"
              aria-labelledby="footer-social-heading"
            >
              {contact.map((item) => (
                <li key={item.id}>
                  <FooterLink href={item.link}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Not a paragraph: the base and dark-theme `p a` rules dress links in
            running prose, and would draw the accent rule under this one. */}
        <small className="footer-copyright">
          &copy; {new Date().getFullYear()} ·{' '}
          <FooterLink href={SOURCE_URL}>Source</FooterLink>
        </small>
      </div>
    </footer>
  );
}
