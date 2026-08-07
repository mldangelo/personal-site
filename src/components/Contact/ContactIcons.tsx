import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from '../../data/contact';

config.autoAddCss = false;

const ContactIcons = () => (
  <ul className="flex flex-wrap items-center gap-2">
    {data.map((s) => (
      <li key={s.label}>
        <a
          href={s.link}
          aria-label={s.label}
          className="grid size-10 place-items-center rounded-md border border-border text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <FontAwesomeIcon icon={s.icon} className="size-4" />
        </a>
      </li>
    ))}
  </ul>
);

export default ContactIcons;
