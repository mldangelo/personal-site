import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CategoryButton extends Component {
  handleClick = () => {
    this.props.handleClick(this.props.label);
  }

  render() {
    return (
      <button
        className={`skillbutton ${this.props.active[this.props.label] ? 'skillbutton-active' : ''}`}
        type="button"
        onClick={this.handleClick}
      >
        {this.props.label}
      </button>
    );
  }
}

CategoryButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  active: PropTypes.objectOf(PropTypes.bool.isRequired).isRequired,
};

export default CategoryButton;
