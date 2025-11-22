'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import ContactIcons from '../Contact/ContactIcons';

const SideBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <section id="sidebar">
      <section id="intro">
        <Link href="/" className="logo">
          <Image
            src="/images/me.jpg"
            alt="Michael D'Angelo"
            width={200}
            height={200}
            priority
          />
        </Link>
        <header>
          <h2>Michael D&apos;Angelo</h2>
          <p>
            <a href="mailto:michael@mldangelo.com">michael@mldangelo.com</a>
          </p>
        </header>
      </section>

      <section className="blurb">
        <h2>About</h2>
        <p>
          Hi, I&apos;m Michael. I am a{' '}
          <a href="https://icme.stanford.edu/">Stanford ICME</a> graduate, YC
          alumnus, and the co-founder and CTO of{' '}
          <a href="https://promptfoo.dev">Promptfoo</a>. Previously, I was VP of
          Engineering at <a href="https://usesmileid.com">SmileID</a>,
          co-founder and CTO of <a href="https://arthena.com">Arthena</a>, and
          co-founded <a href="https://matroid.com">Matroid</a>.
        </p>
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

      <section id="footer">
        <ContactIcons />
        <p className="copyright">
          &copy; Michael D&apos;Angelo <Link href="/">mldangelo.com</Link>.
        </p>
      </section>
    </section>
  );
};

export default SideBar;
