import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/*
Component preprends BASE_PATH to all links. This overrides the default
behavior of React Router links
*/

const LinkRenderer = ({ to, className, children }) => {
  if (to.match(/^(https?:)?\/\//)) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={`${BASE_PATH}${to}`} className={className}>{children}</Link>
  );
};

LinkRenderer.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
};


LinkRenderer.defaultProps = {
  className: '',
};

export default LinkRenderer;
