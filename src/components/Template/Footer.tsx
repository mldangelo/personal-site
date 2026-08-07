import Link from 'next/link';
import { name } from '../../data/bio';

const Footer = () => (
  <footer className="border-t border-border">
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-8 font-mono text-xs text-muted">
      <p>
        &copy; {new Date().getFullYear()} {name}
      </p>
      <p>
        <Link href="/" className="transition-colors hover:text-accent">
          dase.dev
        </Link>
        {' · '}
        <a
          href="https://github.com/adase11/personal-site"
          className="transition-colors hover:text-accent"
        >
          source
        </a>
      </p>
    </div>
  </footer>
);

export default Footer;
