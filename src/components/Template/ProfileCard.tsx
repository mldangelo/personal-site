import Image from 'next/image';
import Link from 'next/link';
import { bio, email, location, name, role } from '../../data/bio';
import ContactIcons from '../Contact/ContactIcons';

const ProfileCard = () => (
  <aside className="rounded-xl border border-border bg-surface/60 p-6">
    <div className="flex items-center gap-4">
      <Image
        priority
        src="/images/me.jpeg"
        alt=""
        width={96}
        height={96}
        className="size-16 rounded-full object-cover"
      />
      <div className="min-w-0">
        <h2 className="text-base font-semibold">{name}</h2>
        <p className="font-mono text-xs text-muted">{role}</p>
        <p className="font-mono text-xs text-muted">{location}</p>
      </div>
    </div>

    <p className="mt-4 text-sm leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
      {bio}
    </p>

    <div className="mt-5 flex flex-wrap items-center gap-4">
      <Link
        href="/resume"
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
      >
        View resume
      </Link>
      <a
        href={`mailto:${email}`}
        className="font-mono text-sm text-muted transition-colors hover:text-accent"
      >
        {email}
      </a>
    </div>

    <div className="mt-5 border-t border-border pt-4">
      <ContactIcons />
    </div>
  </aside>
);

export default ProfileCard;
