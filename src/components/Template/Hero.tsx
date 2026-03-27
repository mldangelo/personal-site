import Link from 'next/link';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <ThemePortrait width={112} height={112} priority />
        </div>

        <h1 className="hero-title">
          <span className="hero-name">Michael D&apos;Angelo</span>
        </h1>

        <p className="hero-tagline">
          Member of the Technical Staff at{' '}
          <a href="https://openai.com" className="hero-highlight">
            OpenAI
          </a>
          , where I work on{' '}
          <a href="https://promptfoo.dev" className="hero-highlight">
            Promptfoo
          </a>{' '}
          and agent security.
          <br />
          Previously co-founded, scaled, and sold Promptfoo to OpenAI.
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
    </section>
  );
}
