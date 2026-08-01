import Link from 'next/link';

import profile from '@/data/profile.json';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-primary">
          <h1 className="hero-title">
            <span className="hero-name">{profile.name}</span>
          </h1>

          <p className="hero-tagline">
            I&apos;m an Electrical Engineering student at{' '}
            <a href="https://www.colorado.edu" className="hero-highlight">
              CU Boulder
            </a>
            , currently a {profile.role} at{' '}
            <a href="https://www.lockheedmartin.com" className="hero-highlight">
              {profile.employer}
            </a>
            , focused on hardware/PCB design and embedded systems. Previously a
            Corporate Strategy Intern at{' '}
            <a href="https://www.lcra.org" className="hero-highlight">
              LCRA
            </a>
            .
          </p>

          <div className="hero-cta">
            <Link href="/about" className="button">
              About Me
            </Link>
            <Link href="/resume" className="hero-resume-link">
              View Resume
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="hero-portrait">
          <ThemePortrait width={320} height={320} priority />
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true" />
    </section>
  );
}
