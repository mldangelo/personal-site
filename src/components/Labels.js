import React from 'react';
import PropTypes from 'prop-types';

const Labels = ({ labels, categories }) => {
  const getLabelStyle = (category) => ({
    background: categories
      .find((cat) => cat.name === category)?.color,
    padding: '0.3em 0.8em',
    margin: '0.3em',
    borderRadius: '3px',
    color: 'white',
    display: 'inline-block',
    fontSize: '0.8em',
  });

  return (
    <div className="labels" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em' }}>
      {labels.map((label) => (
        <span key={label.title} style={getLabelStyle(label.category[0])}>
          {label.title}
        </span>
      ))}
    </div>
  );
};

Labels.propTypes = {
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
    }),
  ),
};

Labels.defaultProps = {
  categories: [],
};

export default Labels;
