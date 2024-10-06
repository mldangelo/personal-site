import { useEffect } from 'react';
import { initialize, pageview, set } from 'react-ga';
import { useLocation } from 'react-router-dom';

const { NODE_ENV, REACT_APP_GA_TRACKING_ID } = process.env;

if (NODE_ENV === 'production') {
  initialize(REACT_APP_GA_TRACKING_ID!);
}

const Analytics = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (NODE_ENV === 'production') {
      set({
        page: pathname,
      });
      pageview(pathname);
    }
  }, [pathname]);

  return null;
};

export default Analytics;
