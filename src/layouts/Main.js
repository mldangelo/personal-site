import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import Analytics from '../components/Template/Analytics';
import Navigation from '../components/Template/Navigation';
import SideBar from '../components/Template/SideBar';
import ScrollToTop from '../components/Template/ScrollToTop';

const Main = (props) => {
  const isHome = useLocation().pathname === '/';
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 960);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <HelmetProvider>
      <Analytics />
      <ScrollToTop />
      <Helmet
        titleTemplate="%s | Kai Zhang"
        defaultTitle="Kai Zhang"
        defer={false}
      >
        {props.title && <title>{props.title}</title>}
        <meta name="description" content={props.description} />
      </Helmet>

      <div id="wrapper">
        <Navigation />
        {!isMobile && <SideBar />}
        {isMobile && isHome && <SideBar showFooter={false} />}
        <div id="main">{props.children}</div>
        {isMobile && !isHome && <SideBar />}
      </div>
    </HelmetProvider>
  );
};

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  // fullPage: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

Main.defaultProps = {
  children: null,
  // fullPage: false,
  title: null,
  description: "Kai Zhang's personal website.",
};

export default Main;
