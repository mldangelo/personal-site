import data from '@/data/contact';

const ContactIcons = () => (
  <ul className="flex flex-wrap items-center gap-2">
    {data.map(({ label, link, icon: Icon }) => (
      <li key={label}>
        <a href={link} aria-label={label} className="icon-btn size-10">
          <Icon aria-hidden="true" className="size-4" />
        </a>
      </li>
    ))}
  </ul>
);

export default ContactIcons;
