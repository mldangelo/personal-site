import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';

interface ContactSectionProps {
  headingLevel?: 'h1' | 'h2';
}

export default function ContactSection({
  headingLevel: Heading = 'h1',
}: ContactSectionProps) {
  return (
    <section className="contact-page">
      <header className="contact-header">
        <Heading className="page-title">Get in Touch</Heading>
      </header>

      <div className="win-panel win-panel--rose">
        <div className="win-panel-titlebar">CONTACT.MSG</div>
        <div className="win-panel-body">
          <div className="contact-content">
            <div className="contact-email-block">
              <EmailLink />
            </div>

            <div className="contact-divider">
              <span>or find me on</span>
            </div>

            <ContactIcons />
          </div>
        </div>
      </div>
    </section>
  );
}
