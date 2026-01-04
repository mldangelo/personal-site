import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import data from '@/data/contact';

export default function ContactIcons() {
  return (
    <ul className="icons">
      {data.map((s) => (
        <li key={s.label}>
          <a href={s.link} aria-label={s.label}>
            <FontAwesomeIcon icon={s.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
