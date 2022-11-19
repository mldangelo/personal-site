import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const { NODE_ENV, REACT_APP_GA_MEASUREMENT_ID } = process.env;

if (NODE_ENV === 'production') {
  ReactGA.initialize(REACT_APP_GA_MEASUREMENT_ID);
}

const Analytics = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (NODE_ENV === 'production') {
      ReactGA.send({ hitType: 'pageview', page: pathname });
    }
  });

  return null;
};

export default Analytics;
