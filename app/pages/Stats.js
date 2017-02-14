import React, { Component } from 'react';
import { Link } from 'react-router';

import axios from 'axios';

import Table from '../components/Stats/Table';
import data from '../data/github';

class Stats extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data,
    };
  }

  componentDidMount() {
    const source = '/api/github';
    this.serverRequest = axios.get(source).then((result) => {
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
      <article className="post" id="stats">
        <header>
          <div className="title">
            <h2><Link to="/stats">Some stats about this site</Link></h2>
            <p>Click <a href="https://github.com/mldangelo/mldangelo/tree/master/scripts">here</a> to see how these are generated.</p>
          </div>
        </header>
        <Table
          data={data}
        />
      </article>
    );
  }
}

export default Stats;
