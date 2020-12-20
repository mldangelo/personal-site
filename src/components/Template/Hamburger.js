import React, { useState } from 'react';
import Link from 'next/link';

import routes from '../../data/routes';

const Hamburger = () => {
  const [open, setOpen] = useState(false);

  return (
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
  );
};

export default Hamburger;
