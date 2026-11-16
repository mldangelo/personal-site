import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

/**
 * Analytics for the published site only. Under `next dev` the page may be a
 * draft, whose title and address would otherwise reach the property.
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  if (!gaId || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return <NextGoogleAnalytics gaId={gaId} />;
}
