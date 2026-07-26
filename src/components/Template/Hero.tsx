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
            . I help secure AI systems and use AI to find software
            vulnerabilities. I co-founded Promptfoo before it joined OpenAI in
            2026.
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
