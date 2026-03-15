import Footer from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

/**
 * Server component wrapper for page layout.
 * Provides consistent page structure with optional footer.
 * Relies on Next.js built-in scroll restoration for navigation.
 */
export default function PageWrapper({
  children,
  hideFooter = false,
}: PageWrapperProps) {
  return (
    <div className="page-container">
      <main className="page-main">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
