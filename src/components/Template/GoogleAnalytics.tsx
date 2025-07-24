import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

const GoogleAnalytics: React.FC = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  if (!gaId) {
    return null;
  }

  return <NextGoogleAnalytics gaId={gaId} />;
};

export default GoogleAnalytics;
