import Image from 'next/image';
import Link from 'next/link';
import ContactIcons from '@/components/ui/contact-icons';
import { bio, email, location, name, role } from '@/data/bio';

const ProfileCard = () => (
  <aside className="border-t border-rule pt-11">
    <div className="flex items-center gap-5">
      <Image
        priority
        src="/images/me.jpeg"
        alt=""
        width={96}
        height={96}
        className="size-16 object-cover"
      />
      <div className="min-w-0">
        <h2 className="font-serif text-lg">{name}</h2>
        <p className="mt-1 font-mono text-[0.76rem] text-faint">{role}</p>
        <p className="font-mono text-[0.76rem] text-faint">{location}</p>
      </div>
    </div>

    <p className="mt-6 max-w-2xl text-[0.92rem] leading-[1.75] text-muted">
      {bio[0].body}
    </p>

    <div className="mt-7 flex flex-wrap items-center gap-4">
      <Link href="/resume" className="btn btn-primary">
        View resume
      </Link>
      <a href={`mailto:${email}`} className="btn">
        {email}
      </a>
    </div>

    <div className="mt-7 border-t border-rule pt-6">
      <ContactIcons />
    </div>
  </aside>
);

export default ProfileCard;
