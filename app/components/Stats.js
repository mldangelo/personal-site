import React, { Component } from 'react';
import { Link } from 'react-router';

import axios from 'axios';
import moment from 'moment';

import Table from './Stats/Table';
import data from './Stats/data/github';

class Stats extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: data,
    };
  }

  componentDidMount() {
    const source = '/api/github';
    this.serverRequest = axios.get(source).then((result) => {
      const update = result.data;
      console.log(update);
      for (const field of data) {
        if (field.key) field.value = (field.key === 'pushed_at') ? moment(update[field.key]).format('MMMM DD, YYYY') : String(update[field.key]);
      }
      this.setState({
        data: data,
      });
    }).catch((error) => {
      if (error.response) {
        // The request was made, but the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
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
