import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import data from '@/data/contact';

interface ContactIconsProps {
  includeEmail?: boolean;
}

/**
 * The destinations in `src/data/contact.ts` that have a mark of their own, as
 * icons, for `/contact`. The footer lists every destination by name instead.
 * One with no mark is linked there and not here — and `/contact` has no
 * footer, so that page does not link it at all.
 */
export default function ContactIcons({
  includeEmail = true,
}: ContactIconsProps) {
  return (
    <ul className="icons">
      {data
        .filter((item) => includeEmail || !item.link.startsWith('mailto:'))
        .map((s) => {
          // No mark, no icon: rendered here the entry would be a target with
          // nothing in it. The footer still links it by name.
          if (!s.icon) {
            return null;
          }

          // A mailto: hands off to a mail client, so it neither opens a tab nor
          // needs the warning — announcing one was simply wrong.
          const isMailto = s.link.startsWith('mailto:');

          return (
            <li key={s.label}>
              <a
                href={s.link}
                aria-label={
                  isMailto ? s.label : `${s.label} (opens in a new tab)`
                }
                {...(isMailto
                  ? {}
                  : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <FontAwesomeIcon icon={s.icon} className="size-5" />
              </a>
            </li>
          );
        })}
    </ul>
  );
}
