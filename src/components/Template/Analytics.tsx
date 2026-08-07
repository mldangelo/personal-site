import { useRouter } from 'next/router';
import { Analytics as VercelAnalytics } from "@vercel/analytics/next"
import Script from 'next/script';
import { useEffect } from 'react';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
const isProduction = process.env.NODE_ENV === 'production';
const enabled = false &&isProduction && Boolean(GA_TRACKING_ID);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const Analytics = () => {
  const { pathname } = useRouter();

  useEffect(() => {
    if (enabled) {
      window.gtag?.('config', GA_TRACKING_ID, { page_path: pathname });
    }
  }, [pathname]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <VercelAnalytics />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  );
};

export default Analytics;
