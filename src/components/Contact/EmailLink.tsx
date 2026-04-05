'use client';

import { CONTACT_EMAIL } from '@/lib/utils';

const [emailLocal, emailDomain] = CONTACT_EMAIL.split('@');

export default function EmailLink() {
  return (
    <div className="contact-email-container">
      <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email-link">
        <span className="contact-email-prefix">{emailLocal}</span>
        <span className="contact-email-domain">@{emailDomain}</span>
      </a>
    </div>
  );
}
