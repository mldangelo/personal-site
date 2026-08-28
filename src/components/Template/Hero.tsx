import profile from '@/data/profile.json';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-primary">
          <h1 className="hero-title">
            <span className="hero-name">{profile.name}</span>
          </h1>

          <p className="hero-tagline">
            I&apos;m an Identity and Access Management professional focused on
            building secure, reliable identity solutions.
          </p>

          <div className="hero-cta">
            <a href="/about" className="button">
              About Me
            </a>
            <a href="/resume" className="hero-resume-link">
              View Resume
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true" />
    </section>
  );
}
