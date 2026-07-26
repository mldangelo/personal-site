import Link from 'next/link';

import profile from '@/data/profile.json';

import Telemetry from './Telemetry';
import ThemePortrait from './ThemePortrait';

const CREDENTIALS = [
  'YC Alum',
  'Stanford ICME',
  'Co-founded Arthena & Matroid',
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-primary">
          <h1 className="hero-title">
            <span className="hero-name">{profile.name}</span>
          </h1>

          <ul className="hero-chips">
            {CREDENTIALS.map((credential) => (
              <li className="hero-chip" key={credential}>
                {credential}
              </li>
            ))}
          </ul>

          <p className="hero-tagline">
            {profile.role} at{' '}
            <a href="https://openai.com" className="hero-highlight">
              {profile.employer}
            </a>
            , where I work on{' '}
            <a href="https://promptfoo.dev" className="hero-highlight">
              Promptfoo
            </a>{' '}
            and agent security. Previously co-founded, scaled, and sold
            Promptfoo to OpenAI.
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

      <Telemetry />

      <div className="hero-bg" aria-hidden="true" />
    </section>
  );
}
