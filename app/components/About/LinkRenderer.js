import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LinkRenderer = (props) => {
  if (props.href.match(/^(https?:)?\/\//)) {
    return (
      <a href={props.href}>
        {props.children}
      </a>
    );
  }
  return (
    <Link to={props.href}>{props.children}</Link>
  );
};

LinkRenderer.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default LinkRenderer;
