import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  if (!gaId) {
    return null;
  }

  return <NextGoogleAnalytics gaId={gaId} />;
}
