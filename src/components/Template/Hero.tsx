import Link from 'next/link';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <ThemePortrait width={160} height={160} priority />
        </div>

        <h1 className="hero-title">
          <span className="hero-name">Eliakim Chris Omari</span>
        </h1>

        <p className="hero-tagline">
          Independent developer working across code and design—Python,
          TypeScript, and Adobe Photoshop. This site is my portfolio, resume,
          and writing in one place.
          <br />
          Reach me anytime via the{' '}
          <Link href="/contact" className="hero-highlight">
            contact page
          </Link>
          .
        </p>

        <div className="hero-chips">
          <span className="hero-chip">Python</span>
          <span className="hero-chip">TypeScript</span>
          <span className="hero-chip">Adobe Photoshop</span>
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
}
