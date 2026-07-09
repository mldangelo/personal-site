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
          <span className="hero-name">Gabriel Dias</span>
        </h1>

        <p className="hero-tagline">
          Software Engineer at <span className="hero-highlight">DrakkarOS</span>
          , based in Oslo, Norway.
          <br />
          Specialized in Node.js and TypeScript, with experience across Python,
          Java, Kotlin, and React Native.
        </p>

        <div className="hero-chips">
          <span className="hero-chip">Node.js</span>
          <span className="hero-chip">TypeScript</span>
          <span className="hero-chip">React</span>
        </div>

        <div className="hero-cta">
          <Link href="/about" className="button">
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
