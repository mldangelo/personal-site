import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import data from '@/data/contact';

export default function ContactIcons() {
  return (
    <ul className="icons">
      {data.map((s) => (
        <li key={s.label}>
          <a
            href={s.link}
            aria-label={`${s.label} (opens in new tab)`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={s.icon} className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
