'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import ContactIcons from '../Contact/ContactIcons';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer-new">
      <div className="footer-content">
        <div className="footer-bio">
          <Link href="/" className="footer-avatar">
            <Image
              src="/images/me.jpg"
              alt="Michael D'Angelo"
              width={80}
              height={80}
              priority
            />
          </Link>
          <div className="footer-info">
            <h3>Michael D&apos;Angelo</h3>
            <p>
              <a href="mailto:michael@mldangelo.com" className="footer-email">
                michael@mldangelo.com
              </a>
            </p>
          </div>
        </div>

        <nav className="footer-links">
          <span className="footer-links-label">Explore</span>
          <div className="footer-links-list">
            <Link href="/about">About</Link>
            <Link href="/resume">Resume</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>

        <div className="footer-social">
          <span className="footer-social-label">Connect</span>
          <ContactIcons />
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {new Date().getFullYear()} Michael D&apos;Angelo
        </p>
      </div>
    </footer>
  );
};

export default Footer;
