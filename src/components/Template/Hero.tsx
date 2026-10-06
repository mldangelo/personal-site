import Link from 'next/link';

import profile from '@/data/profile.json';

import ThemePortrait from './ThemePortrait';

// A static plotter-like study: generated at build time, with no canvas or client JS.
const parallelCurves = `M0 5q90 24 180 0${'m-180 3.5q90 24 180 0'.repeat(7)}`;

export default function Hero() {
  return (
    <section className="hero">
      <p className="hero-kicker">Software &amp; security</p>
      <h1 className="hero-title">
        <span className="hero-name">{profile.name}</span>
      </h1>
      <div className="hero-grid">
        <div className="hero-primary">
          <p className="hero-tagline">
            I&apos;m a {profile.role} at{' '}
            <a href="https://openai.com" className="hero-highlight">
              {profile.employer}
            </a>
            , working on{' '}
            <a href="https://promptfoo.dev" className="hero-highlight">
              Promptfoo
            </a>{' '}
            and{' '}
            <a
              href="https://openai.com/index/codex-security-now-in-research-preview/"
              className="hero-highlight"
            >
              Codex Security
            </a>
            .
          </p>

          <p className="hero-summary">
            I help secure AI systems and use AI to find software
            vulnerabilities. I co-founded Promptfoo before it joined OpenAI in
            2026.
          </p>

          <div className="hero-cta">
            <Link href="/about" className="button">
              About me <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/resume" className="hero-resume-link">
              View resume
            </Link>
          </div>
        </div>

        <figure className="hero-portrait">
          <div className="hero-portrait-frame">
            <ThemePortrait width={320} height={320} priority />
          </div>
          <figcaption>{profile.currentCity}</figcaption>
          <svg
            className="hero-line-study"
            viewBox="0 0 180 45"
            fill="none"
            aria-hidden="true"
          >
            <path d={parallelCurves} stroke="currentColor" strokeWidth="0.7" />
          </svg>
        </figure>
      </div>
    </section>
  );
}
