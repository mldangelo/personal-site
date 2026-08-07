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
const TWITTER_HANDLE = '@adase01';
const OG_IMAGE_PATH = '/images/social/og-default.jpg';

interface SocialMeta {
  card?: 'summary' | 'summary_large_image';
  description?: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  title?: string;
  type?: 'article' | 'website';
}

const ROUTE_SOCIAL: Record<string, SocialMeta> = {
  '/': {
    imageAlt: 'Portrait of Austin Dase',
    title: 'Austin Dase | Director of Engineering'
  },
  '/about': {
    imageAlt: 'Portrait of Austin Dase'
  },
  '/contact': {
    imageAlt: 'Austin Dase contact details and social links'
  },
  '/projects': {
    imageAlt: 'Preview card for Austin Dase projects and papers'
  },
  '/resume': {
    imageAlt: 'Preview card for Austin Dase resume and experience'
  },
  '/stats': {
    imageAlt: 'Preview card for Austin Dase website and personal stats'
  },
  '/404': {
    card: 'summary',
    noindex: true,
    title: '404 | Austin Dase'
  }
};

const toAbsoluteUrl = (value: string) =>
  /^https?:\/\//i.test(value)
    ? value
    : `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;

interface MainProps {
  children?: React.ReactNode | React.ReactNode[];
  fullPage?: boolean;
  title?: string;
  description?: string;
  social?: SocialMeta;
}

const Main: React.FC<MainProps> = ({
  children = null,
  fullPage = false,
  title = null,
  description = "Austin Dase's personal website.",
  social = {}
}) => {
  const { pathname } = useRouter();
  // Page files are PascalCase, so Next routes are /About, /Index, etc. post-export.cjs
  // lowercases the emitted HTML, and Index.html is served at the site root.
  const lower = pathname.toLowerCase();
  const path = lower === '/index' || lower === '/' ? '' : lower;
  const canonical = `${SITE_URL}${path}`;
  const routeSocial = ROUTE_SOCIAL[lower] ?? {};
  const mergedSocial = { ...routeSocial, ...social };
  const socialTitle =
    mergedSocial.title ?? (title ? `${title} | ${SITE_NAME}` : SITE_NAME);
  const socialDescription = mergedSocial.description ?? description;
  const socialImage = toAbsoluteUrl(mergedSocial.image ?? OG_IMAGE_PATH);
  const socialImageAlt =
    mergedSocial.imageAlt ?? `${SITE_NAME} website social preview`;
  const socialCard = mergedSocial.card ?? 'summary_large_image';
  const socialType = mergedSocial.type ?? 'website';
  const robots = mergedSocial.noindex ? 'noindex,nofollow' : 'index,follow';
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

        <meta property="og:type" content={socialType} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={socialTitle} />
        <meta property="og:description" content={socialDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="og:image:alt" content={socialImageAlt} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content={socialCard} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="twitter:title" content={socialTitle} />
        <meta name="twitter:description" content={socialDescription} />
        <meta name="twitter:image" content={socialImage} />
        <meta name="twitter:image:alt" content={socialImageAlt} />
        <meta name="robots" content={robots} />
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
        <meta name="description" content={socialDescription} />
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
