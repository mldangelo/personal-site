import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import profile from '@/data/profile.json';
import routes from '@/data/routes';
import { AUTHOR_NAME } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="site-footer-new">
      <div className="footer-content">
        <div className="footer-identity">
          <div className="footer-info">
            <span className="footer-name">{AUTHOR_NAME}</span>
            <p className="footer-role">{profile.role}</p>
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} ·{' '}
              <a
                href="https://github.com/pavankalyandosa/personal-site"
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
          {/* Driven from the same route registry as the header. These are
              group labels, not document sections, so they are spans rather
              than headings. */}
          <nav className="footer-links" aria-labelledby="footer-links-heading">
            <span id="footer-links-heading" className="footer-links-label">
              Explore
            </span>
            <div className="footer-links-grid">
              {routes
                .filter((route) => !route.index)
                .map((route) =>
                  route.external ? (
                    <a
                      key={route.path}
                      href={route.path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {route.label}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ) : (
                    <Link key={route.path} href={route.path}>
                      {route.label}
                    </Link>
                  ),
                )}
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
