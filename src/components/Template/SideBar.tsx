'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import profile from '@/data/profile';

import ContactIcons from '../Contact/ContactIcons';
import ThemePortrait from './ThemePortrait';

const SideBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <section className="site-sidebar">
      <section className="site-intro">
        <Link href="/" className="logo">
          <ThemePortrait width={200} height={200} priority />
        </Link>
        <header>
          <h2>{profile.name}</h2>
          <p>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
        </header>
      </section>

      <section className="blurb">
        <h2>About</h2>
        <p dangerouslySetInnerHTML={{ __html: profile.bioHtml }} />
        <ul className="actions">
          <li>
            {pathname && !pathname.includes('/resume') ? (
              <Link href="/resume" className="button">
                Learn More
              </Link>
            ) : (
              <Link href="/about" className="button">
                About Me
              </Link>
            )}
          </li>
        </ul>
      </section>

      <section className="site-footer">
        <ContactIcons />
        <p className="copyright">
          &copy; {profile.name} <Link href="/">mldangelo.com</Link>.
        </p>
      </section>
    </section>
  );
};

export default SideBar;
