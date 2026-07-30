import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import work from '@/data/resume/work';
import routes from '@/data/routes';
import { AUTHOR_NAME } from '@/lib/utils';

export default function Footer() {
  const currentRole = `${work[0].position} at ${work[0].name}`;

  return (
    <footer className="site-footer-new">
      <div className="footer-content">
        <div className="footer-identity">
          <div className="footer-info">
            <span className="footer-name">{AUTHOR_NAME}</span>
            <p className="footer-role">{currentRole}</p>
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} ·{' '}
              <a
                href="https://github.com/henrymatar/henrymatar.github.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </p>
          </div>
        </div>

        <div className="footer-right">
          {/* Driven from the same route registry as the header, which had
              drifted: the footer was missing Writing and Stats entirely.
              These are group labels, not document sections, so they are
              spans rather than headings. */}
          <nav className="footer-links" aria-labelledby="footer-links-heading">
            <span id="footer-links-heading" className="footer-links-label">
              Explore
            </span>
            <div className="footer-links-grid">
              {routes
                .filter((route) => !route.index)
                .map((route) => (
                  <Link key={route.path} href={route.path}>
                    {route.label}
                  </Link>
                ))}
            </div>
          </nav>

          <div
            className="footer-social"
            aria-labelledby="footer-social-heading"
          >
            <span id="footer-social-heading" className="footer-social-label">
              Connect
            </span>
            <ContactIcons />
          </div>
        </div>
      </div>
    </footer>
  );
}
