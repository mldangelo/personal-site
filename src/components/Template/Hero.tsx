'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <Image
            src="/images/me.jpg"
            alt="Michael D'Angelo"
            width={120}
            height={120}
            priority
          />
        </div>

        <h1 className="hero-title">
          <span className="hero-greeting">Hi, I'm</span>
          <span className="hero-name">Michael D'Angelo</span>
        </h1>

        <p className="hero-tagline">
          Co-founder & CTO building{' '}
          <a href="https://promptfoo.dev" className="hero-highlight">
            LLM security tools
          </a>
          .
          <br />
          <span className="hero-sub">
            Stanford ICME · YC Alum · Previously VP Engineering
          </span>
        </p>

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
