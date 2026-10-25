import Link from 'next/link';

import profile from '@/data/profile.json';
import { smartQuotes } from '@/lib/typography';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-primary">
          <p className="hero-kicker">Software &amp; security</p>
          <h1 className="hero-title">
            <span className="hero-name">{smartQuotes(profile.name)}</span>
          </h1>
          <p className="hero-tagline">
            I’m a {profile.role} at{' '}
            <a href="https://openai.com" className="hero-highlight">
              {profile.employer}
            </a>
            , working on{' '}
            <a href="https://promptfoo.dev" className="hero-highlight">
              Promptfoo
            </a>{' '}
            and other cyber products.
          </p>

          <p className="hero-summary">
            I help secure AI systems and use AI to find software
            vulnerabilities. I co-founded Promptfoo before it joined OpenAI in
            2026.
          </p>

          {/* Neither link carries an arrow: both stay on the site, and ↗ is
              reserved for a link that leaves it in a new tab. */}
          <div className="hero-cta">
            <Link href="/about" className="button">
              About me
            </Link>
            <Link href="/resume" className="hero-resume-link">
              View resume
            </Link>
          </div>
        </div>

        <figure className="hero-portrait">
          <ThemePortrait width={320} height={320} priority />
          <figcaption>{profile.currentCity}</figcaption>
        </figure>
      </div>
    </section>
  );
}
