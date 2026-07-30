import Link from 'next/link';

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
            I&apos;m an {profile.role.toLowerCase()} and Systems Engineering
            Intern at{' '}
            <a href="https://www.lockheedmartin.com" className="hero-highlight">
              {profile.employer}
            </a>
            . I design and build embedded hardware and software, from multilayer
            PCBs and analog circuits to microcontroller firmware and closed-loop
            robotic systems.
          </p>

          <div className="hero-cta">
            <Link href="/projects" className="button">
              View Projects
            </Link>
            <Link href="/resume" className="hero-resume-link">
              View Resume
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true" />
    </section>
  );
}
