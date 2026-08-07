import Link from 'next/link';
import ContactIcons from '../components/Contact/ContactIcons';
import { bio, email, location, name, role } from '../data/bio';
import Main from '../layouts/Main';

const shortcuts = [
  { href: '/about', label: 'About', desc: 'Background and how I got here' },
  { href: '/resume', label: 'Resume', desc: 'Experience, education, skills' },
  { href: '/projects', label: 'Projects', desc: 'Talks and published papers' },
  { href: '/stats', label: 'Stats', desc: 'Live numbers about this site' }
];

const Index = () => (
  <Main
    description={
      "Austin Dase's personal website. DC based software engineer, " +
      'Director of Engineering at Fundrise.'
    }
  >
    <section>
      <p className="font-mono text-sm tracking-widest text-accent uppercase">
        {location}
      </p>
      <h1 className="mt-3 text-[length:var(--text-hero)] leading-[1.05] font-semibold">
        {name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{role}</p>
      <p className="mt-6 max-w-2xl leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
        {bio}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/resume"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          View resume
        </Link>
        <a
          href={`mailto:${email}`}
          className="rounded-md border border-border px-5 py-2.5 font-mono text-sm transition-colors hover:border-accent hover:text-accent"
        >
          {email}
        </a>
      </div>

      <div className="mt-8">
        <ContactIcons />
      </div>
    </section>

    <nav aria-label="Site sections" className="mt-16">
      <ul className="grid gap-3 sm:grid-cols-2">
        {shortcuts.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group block rounded-xl border border-border p-5 transition-colors hover:border-accent hover:bg-surface/60"
            >
              <span className="flex items-center justify-between font-medium">
                {s.label}
                <span
                  aria-hidden="true"
                  className="font-mono text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                >
                  →
                </span>
              </span>
              <span className="mt-1 block text-sm text-muted">{s.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </Main>
);

export default Index;
