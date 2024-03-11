'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import ContactIcons from '../Contact/ContactIcons';

const PUBLIC_URL = process.env.NEXT_PUBLIC_BASE_PATH || ''; // Use NEXT_PUBLIC_ prefix for env vars to be exposed to the browser

const SideBar = () => {
  const router = useRouter();

  return (
    <section id="sidebar">
      <section id="intro">
        <Link href="/" passHref>
          <Image src={`${PUBLIC_URL}/images/me.jpg`} alt="" width={100} height={100} /> {/* Adjust width and height as needed */}
        </Link>
        <header>
          <h2>Michael D&apos;Angelo</h2>
          <p><a href="mailto:michael@mldangelo.com">michael@mldangelo.com</a></p>
        </header>
      </section>

      <section className="blurb">
        <h2>About</h2>
        <p>Hi, I&apos;m Michael. I am a <a href="https://icme.stanford.edu/">Stanford ICME</a> graduate, YC Alumni,
          and the VP of Engineering at <a href="https://smileidentity.com">Smile Identity</a>. Previously,
          I was the co-founder and CTO of <a href="https://arthena.com">Arthena</a>
          , co-founder of <a href="https://matroid.com">Matroid</a>, and worked at
          {' '}<a href="https://planet.com">Planet</a> and <a href="https://facebook.com">Facebook</a>.
        </p>
        <ul className="actions">
          <li>
            {router.pathname?.includes('/resume') ? (
              <Link href="/about">About Me</Link>
            ) : (
              <Link href="/resume">Learn More</Link>
            )}
          </li>
        </ul>
      </section>

      <section id="footer">
        <ContactIcons />
        <p className="copyright">&copy; Michael D&apos;Angelo <Link href="/">mldangelo.com</Link>.</p>
      </section>
    </section>
  );
};

export default SideBar;
