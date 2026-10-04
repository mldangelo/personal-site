import Link from 'next/link';

import RetroBadges from '@/components/Contact/RetroBadges';
import { AUTHOR_NAME } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="site-footer-new">
      <div className="footer-content">
        <div className="footer-right">
          <nav className="footer-links" aria-labelledby="footer-links-heading">
            <h4 id="footer-links-heading" className="footer-links-label">
              Explore
            </h4>
            <div className="footer-links-grid">
              <Link href="/#about">About</Link>
              <Link href="/#resume">Resume</Link>
              <Link href="/#projects">Projects</Link>
              <Link href="/#contact">Contact</Link>
            </div>
          </nav>

          <div
            className="footer-social"
            aria-labelledby="footer-social-heading"
          >
            <h4 id="footer-social-heading" className="footer-social-label">
              Connect
            </h4>
            <RetroBadges />
          </div>
        </div>
      </div>

      <p className="footer-copyright">
        <span className="kaomoji">{'( ＾◡＾)っ'}</span>
        &copy; {new Date().getFullYear()} {AUTHOR_NAME}. Built with{' '}
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
          Next.js
        </a>
        ,{' '}
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          React
        </a>
        ,{' '}
        <a
          href="https://www.typescriptlang.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          TypeScript
        </a>
        , and{' '}
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tailwind CSS
        </a>
        . Statically exported and deployed to{' '}
        <a
          href="https://pages.github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Pages
        </a>
        .
      </p>
    </footer>
  );
}
