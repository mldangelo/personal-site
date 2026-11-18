import { MAIN_CONTENT_ID } from '@/lib/page-ids';

import Footer from './Footer';

interface PageWrapperProps {
  children: React.ReactNode;
  /** `links` keeps only the footer's site links, for a page that shows the rest. */
  footer?: 'full' | 'links';
}

/** Target for the skip link in the root layout. */
export { MAIN_CONTENT_ID };

/** The structure every page shares: its main landmark, then the footer. */
export default function PageWrapper({
  children,
  footer = 'full',
}: PageWrapperProps) {
  return (
    <div className="page-container">
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="page-main">
        {children}
      </main>
      <Footer linksOnly={footer === 'links'} />
    </div>
  );
}
