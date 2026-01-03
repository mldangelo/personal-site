'use client';

import Link from 'next/link';
import React from 'react';

import profile from '@/data/profile';

import ThemePortrait from './ThemePortrait';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <ThemePortrait width={120} height={120} priority />
        </div>

        <h1 className="hero-title">
          <span className="hero-name">{profile.name}</span>
        </h1>

        <p className="hero-tagline">
          {profile.company.role} at{' '}
          <a href={profile.company.url} className="hero-highlight">
            {profile.company.name}
          </a>
          , {profile.tagline[0]}
          <br />
          {profile.tagline[1]}
        </p>

        <div className="hero-chips">
          {profile.chips.map((chip) => (
            <span key={chip} className="hero-chip">
              {chip}
            </span>
          ))}
        </div>

        <div className="hero-cta">
          <Link href="/about" className="button button-primary">
            About Me
          </Link>
          <Link href="/resume" className="button button-secondary">
            View Resume
          </Link>
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-gradient" />
      </div>
    </section>
  );
};

export default Hero;
