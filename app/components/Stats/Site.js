import React, { Component } from 'react';

import axios from 'axios';

import Table from './Table';
import data from '../../data/github';

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = { data };
  }

  componentDidMount() {
    axios.get('/api/github').then((result) => {
      const update = data.map((field) => {
        const value = field.key ? { value: String(result.data[field.key]) } : {};
        return Object.assign(field, value);
      });
      this.setState({
        data: update,
      });
    }).catch((error) => {
      console.error('github-api-fetch-error', error);
    });
  }

  render() {
    return (
      <div>
        <h3>Some stats about this site</h3>
        <Table
          data={this.state.data}
        />
      </div>
    );
  }
}

export default Stats;
