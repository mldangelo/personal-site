import { useRouter } from 'next/router';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Analytics from '../components/Template/Analytics';
import Footer from '../components/Template/Footer';
import Navigation from '../components/Template/Navigation';
import ProfileCard from '../components/Template/ProfileCard';
import ScrollToTop from '../components/Template/ScrollToTop';

// Pages where the profile card adds context rather than competing with content.
// Index and Contact are excluded: they already surface this material themselves.
const PROFILE_ROUTES = new Set(['/about']);

const SITE_URL = 'https://dase.dev';
const SITE_NAME = 'Austin Dase';
const OG_IMAGE = `${SITE_URL}/images/favicon/web-app-manifest-512x512.png`;

interface MainProps {
  children?: React.ReactNode | React.ReactNode[];
  fullPage?: boolean;
  title?: string;
  description?: string;
}

const Main: React.FC<MainProps> = ({
  children = null,
  fullPage = false,
  title = null,
  description = "Austin Dase's personal website."
}) => {
  const { pathname } = useRouter();
  // Page files are PascalCase, so Next routes are /About, /Index, etc. post-export.cjs
  // lowercases the emitted HTML, and Index.html is served at the site root.
  const lower = pathname.toLowerCase();
  const path = lower === '/index' || lower === '/' ? '' : lower;
  const canonical = `${SITE_URL}${path}`;
  const socialTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const showProfile = !fullPage && PROFILE_ROUTES.has(lower);

  return (
    <HelmetProvider>
      <Analytics />
      <ScrollToTop />
      <Helmet
        titleTemplate={`%s | ${SITE_NAME}`}
        defaultTitle={SITE_NAME}
        defer={false}
      >
        <meta http-equiv="content-type" content="text/html;charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta
          id="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={socialTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={socialTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <link rel="canonical" href={canonical} />

        <link
          rel="icon"
          type="image/png"
          href="/images/favicon/favicon-48x48.png"
          sizes="48x48"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/images/favicon/favicon.svg"
        />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Dase.dev" />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
        {title && <title>{title}</title>}
        <meta name="description" content={description} />
      </Helmet>
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <main className="mx-auto w-full max-w-measure flex-1 px-[22px] pb-16 sm:px-10">
          {children}
          {showProfile && (
            <div className="mt-14">
              <ProfileCard />
            </div>
          )}
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Main;
