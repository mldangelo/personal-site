import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LinkRenderer = ({ href, children }) => {
  if (href.match(/^(https?:)?\/\//)) {
    return (
      <a href={href}>
        {children}
      </a>
    );
  }
  return (
    <Link to={`${BASE_PATH}${href}`}>{children}</Link>
  );
};

LinkRenderer.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default LinkRenderer;
