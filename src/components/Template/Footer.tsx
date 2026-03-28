import ContactIcons from '@/components/Contact/ContactIcons';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Michael D&apos;Angelo &middot;{' '}
          <a
            href="https://github.com/mldangelo/personal-site"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
        <ContactIcons />
      </div>
    </footer>
  );
}
