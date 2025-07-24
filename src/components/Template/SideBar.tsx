'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { categories, labels } from '@/data/labels';

import ContactIcons from '../Contact/ContactIcons';
import Labels from './Labels';

interface SideBarProps {
  showFooter?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ showFooter = true }) => {
  return (
    <section id="sidebar">
      <section id="intro">
        <Link href="/" className="logo">
          <Image src="/images/me.jpg" alt="Kai Zhang" width={240} height={240} priority />
        </Link>
        <header>
          <h2>Kai Zhang</h2>
          <p>
            <a href="mailto:zhangkai@ethz.ch">zhangkai@ethz.ch</a>
          </p>
          {!showFooter && <ContactIcons />}
        </header>
      </section>

      <section className="blurb">
        <h2>Key Words</h2>
        <div className="link-container" style={{ marginBottom: '1.5em' }}>
          <Labels labels={labels} categories={categories} />
        </div>
      </section>

      {showFooter && (
        <section id="footer">
          <ContactIcons />
          <p className="copyright">&copy; 2025 Kai Zhang (NO. 131085e).</p>
        </section>
      )}
    </section>
  );
};

export default SideBar;
