import profile from '@/data/profile.json';

const CONTACT_ADDRESS = profile.email;

export default function EmailLink() {
  const at = CONTACT_ADDRESS.lastIndexOf('@');
  const localPart = CONTACT_ADDRESS.slice(0, at);
  const domain = CONTACT_ADDRESS.slice(at);

  return (
    <div className="contact-email-container">
      <a href={`mailto:${CONTACT_ADDRESS}`} className="contact-email-link">
        <span className="sr-only">Email {CONTACT_ADDRESS}</span>
        <span className="contact-email-prefix" aria-hidden="true">
          {localPart}
        </span>
        <span className="contact-email-domain" aria-hidden="true">
          {domain}
        </span>
      </a>
    </div>
  );
}
