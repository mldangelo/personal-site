import ContactIcons from '../components/Contact/ContactIcons';
import EmailLink from '../components/Contact/EmailLink';
import PageHeader from '../components/Template/PageHeader';
import Main from '../layouts/Main';

const Contact = () => (
  <Main
    title="Contact"
    description="Contact Austin Dase via email @ hi@dase.dev"
  >
    <PageHeader eyebrow="Contact" title="Get in touch">
      <p>
        The fastest way to reach me is email. I read everything, and reply to
        most of it.
      </p>
    </PageHeader>

    <div className="flex flex-col items-start gap-8 border-t border-rule pt-11">
      <EmailLink />
      <ContactIcons />
    </div>
  </Main>
);

export default Contact;
