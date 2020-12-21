import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faBars from '@fortawesome/free-solid-svg-icons/faBars';

import routes from '../../data/routes';

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header id="header">
        <h1 className="index-link">
          {routes
            .filter((l) => l.index)
            .map((l) => (
              <Link key={l.label} href={l.path}>
                {l.label}
              </Link>
            ))}
        </h1>
        <nav className="links">
          <ul>
            {routes
              .filter((l) => !l.index)
              .map((l) => (
                <li key={l.label}>
                  <Link href={l.path}>{l.label}</Link>
                </li>
              ))}
          </ul>
        </nav>
        <nav className="main">
          <ul>
            <li className="menu">
              <a>
                ASDASDASdADS
                <FontAwesomeIcon icon={faBars} onClick={() => setOpen(!open)} />
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className={open ? 'is-menu-visible' : undefined}>
        <section id="menu">
          <section>
            <ul className="links">
              {routes.map((l) => (
                <li key={l.label}>
                  <Link href={l.path} onClick={() => setOpen(!open)}>
                    <a>
                      <h3 className={l.index && 'index-li'}>{l.label}</h3>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </>
  );
};

export default Header;
