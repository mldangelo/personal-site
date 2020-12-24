import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import faBars from '@fortawesome/free-solid-svg-icons/faBars';
import faEnvelope from '@fortawesome/fontawesome-free-regular/faEnvelope';

import routes from '../../data/routes';

const faStyle = {
  listStyle: 'none',
  font: 'inherit',
  color: 'inherit',
  boxSizing: 'inherit',
  display: 'inline-block',
  fontSize: 'inherit',
  height: '1em',
  verticalAlign: '-0.125em',
  width: '1em',
  overflow: 'visible',
};

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
          <ul className="icons">
            <li className="menu">
              {/* <FontAwesomeIcon icon={faEnvelope} style={faStyle}/> */}
              <FontAwesomeIcon
                icon={faEnvelope}
                style={faStyle}
                onClick={() => setOpen(!open)}
              />
            </li>
          </ul>
        </nav>
      </header>
      {open && (
        <div className="is-menu-visible">
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
      )}
    </>
  );
};

export default Header;
