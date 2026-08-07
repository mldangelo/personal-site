import { email, location, name } from '@/data/bio';
import contact from '@/data/contact';
import { SOURCE_REPO } from '@/lib/site';

const links = [...contact, { label: 'Source', link: SOURCE_REPO }];

/**
 * The colophon: who wrote this and where to find them. Reads the same contact
 * list the icon row uses, rendered here as plain uppercase links.
 */
const Footer = () => (
  <footer className="mx-auto w-full max-w-measure px-[22px] pb-16 sm:px-10">
    <div className="flex flex-wrap items-end justify-between gap-6 border-t border-rule pt-11">
      <div className="text-sm leading-relaxed text-faint">
        <p className="font-serif text-base font-semibold text-fg">{name}</p>
        <p className="mt-1 font-mono text-[0.78rem]">
          {location} · {email}
        </p>
      </div>

      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map((s) => (
          <li key={s.label}>
            <a
              href={s.link}
              className="nav-link border-b border-transparent pb-[3px] text-muted hover:border-accent hover:text-accent"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>

    <p className="mt-8 font-mono text-[0.72rem] text-faint">
      &copy; {new Date().getFullYear()} {name}
    </p>
  </footer>
);

export default Footer;
