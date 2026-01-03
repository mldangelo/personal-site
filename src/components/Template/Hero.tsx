'use client';

import Link from 'next/link';
import React from 'react';

import ThemePortrait from './ThemePortrait';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <ThemePortrait width={120} height={120} priority />
        </div>

        <h1 className="hero-title">
          <span className="hero-name">Michael D&apos;Angelo</span>
        </h1>

        <p className="hero-tagline">
          Co-founder & CTO at{' '}
          <a href="https://promptfoo.dev" className="hero-highlight">
            Promptfoo
          </a>
          , the most widely adopted open-source LLM security platform.
          <br />
          Previously VP Engineering & Head of AI at Smile ID.
        </p>

        <div className="hero-chips">
          <span className="hero-chip">YC Alum</span>
          <span className="hero-chip">Stanford ICME</span>
          <span className="hero-chip">Co-founded Arthena & Matroid</span>
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
