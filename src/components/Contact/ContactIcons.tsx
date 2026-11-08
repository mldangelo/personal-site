import data from '@/data/contact';

interface ContactIconsProps {
  includeEmail?: boolean;
}

export default function ContactIcons({
  includeEmail = true,
}: ContactIconsProps) {
  return (
    <ul className="icons">
      {data
        .filter((item) => includeEmail || !item.link.startsWith('mailto:'))
        .map((s) => {
          // A mailto: hands off to a mail client, so it neither opens a tab nor
          // needs the warning.
          const isMailto = s.link.startsWith('mailto:');

          return (
            <li key={s.label}>
              <a
                href={s.link}
                aria-label={
                  isMailto ? s.label : `${s.label} (opens in new tab)`
                }
                {...(isMailto
                  ? {}
                  : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <svg
                  viewBox={s.icon.viewBox}
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  className="size-5"
                >
                  <path d={s.icon.path} />
                </svg>
              </a>
            </li>
          );
        })}
    </ul>
  );
}
