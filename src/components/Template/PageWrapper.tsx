import Footer from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  mainClassName?: string;
}

/** Target for the skip link in the root layout. */
export const MAIN_CONTENT_ID = 'main-content';

/** The structure every page shares: its main landmark, then the footer. */
export default function PageWrapper({
  children,
  hideFooter = false,
  mainClassName,
}: PageWrapperProps) {
  return (
    <div className="page-container">
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className={['page-main', mainClassName].filter(Boolean).join(' ')}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
