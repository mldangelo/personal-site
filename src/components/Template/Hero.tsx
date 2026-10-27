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
            I&apos;m a {profile.role} as{' '}
            <a href="https://www.linkedin.com/in/saransh-vaidya-448789290/" className="hero-highlight">
              {profile.employer}
            </a>
            , I studied at{' '}
            <a href="https://www.wcem.in/" className="hero-highlight">
              WCEM
            </a>{' '}
            and learned coding through{' '}
            <a
              href="https://www.ccbp.in/"
              className="hero-highlight"
            >
              NXTWave Academy
            </a>
            . I am pursuing a degree in Artificial Intelligence and Data Science from Wainganga College of Engineering and Management, graduating in 2027. I also contribute to GSoC 2026.
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
