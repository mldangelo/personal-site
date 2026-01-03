'use client';

import Link from 'next/link';
import React from 'react';

import profile from '@/data/profile';

import ContactIcons from '../Contact/ContactIcons';
import ThemePortrait from './ThemePortrait';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer-new">
      <div className="footer-content">
        <div className="footer-identity">
          <Link href="/" className="footer-avatar">
            <ThemePortrait width={80} height={80} />
          </Link>
          <div className="footer-info">
            <h3>{profile.name}</h3>
            <p className="footer-role">{profile.company.role}</p>
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} ·{' '}
              <a
                href="https://github.com/mldangelo/personal-site"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </p>
          </div>
        </div>

        <div className="footer-right">
          <nav className="footer-links">
            <span className="footer-links-label">Explore</span>
            <div className="footer-links-grid">
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
      </div>
    </footer>
  );
};

export default Footer;
