import Link from 'next/link';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from '../../data/contact';

const Nav = () => {
  // TODO figure out why this doesn't work
  const { pathname } = useRouter() || {};
  return (
    <section id="sidebar">
      <section id="intro">
        <Link href="/">
          <a className="logo">
            <img src="/images/me_icon.jpg" alt="" />
          </a>
        </Link>
        <header>
          <h2>Michael D'Angelo</h2>
          <p>
            <a href="mailto:michael.l.dangelo@gmail.com">
              michael.l.dangelo@gmail.com
            </a>
          </p>
        </header>
      </section>

      <section className="blurb">
        <h2>About</h2>
        <p>
          Hi, I&apos;m Michael. I like building things. I am a{' '}
          <a href="https://icme.stanford.edu">Stanford ICME</a> graduate, YC
          Alumni, and the co-founder and CTO of{' '}
          <a href="https://arthena.com">Arthena</a>. Before Arthena I was at{' '}
          <a href="https://matroid.com">Matroid</a>,{' '}
          <a href="https://planet.com">Planet</a>,{' '}
          <a href="https://planetaryresources.com">Planetary Resources</a>,{' '}
          <a href="https://facebook.com">Facebook</a>, and{' '}
          <a href="https://seds.org">SEDS</a>.
        </p>
        <ul className="actions">
          <li>
            {pathname !== `/resume` ? (
              <Link href="/resume">
                <a className="button">Learn More</a>
              </Link>
            ) : (
              <Link href="/about">
                <a className="button">About Me</a>
              </Link>
            )}
          </li>
        </ul>
      </section>

      <section id="footer">
        <ul className="icons">
          {data.map((s) => (
            <li key={s.label}>
              <Link href={s.link}>
                <a>
                  <FontAwesomeIcon icon={s.icon} />
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <p className="copyright">
          &copy; Michael D&apos;Angelo{' '}
          <Link href="/">
            <a>mldangelo.com</a>
          </Link>
          .
        </p>
      </section>
    </section>
  );
};
export default Nav;
