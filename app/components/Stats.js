import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import axios from 'axios';
import moment from 'moment';

// TODO To be provided by an API
const data = [
  {
    label: 'Stars this repository has on github',
    key: 'stargazers_count',
    value: '0',
    link: 'https://github.com/mldangelo/mldangelo/stargazers',
  },{
    label: 'Number of people watching this repository',
    key: 'subscribers_count',
    value: '1',
    link: 'https://github.com/mldangelo/mldangelo/stargazers',
  },{
    label: 'Number of forks',
    key: 'forks',
    value: '0',
    link: 'https://github.com/mldangelo/mldangelo/network',
  }, {
    label: 'Number of spoons',
    value: '0',
  }, {
    label: 'Number of linter warnings',
    value: '15', //TODO Update from travis / circle
  }, {
    label: 'Open github issues',
    key: 'open_issues_count',
    value: '0',
    link: 'https://github.com/mldangelo/mldangelo/issues'
  }, {
    label: 'Last updated at',
    key: 'pushed_at',
    value: moment().format('MMMM Do YYYY'),
    link: 'https://github.com/mldangelo/mldangelo/commits',
  }
];

/* // TODO Add these fields later
{
 label: 'number of lines of code powering this website',
 value: '9762',
 link: 'https://github.com/mldangelo/mldangelo/graphs/contributors',
},
{
 label: 'languages used',
 value: '6',
}, {
 label: 'number of contributors',
 value: '1',
 link: 'https://github.com/mldangelo/mldangelo/graphs/contributors',
},
*/


class TableRow extends Component {

  getValue() {
    return this.props.link ? (
      <a href={`${this.props.link}`}>{this.props.value}</a>
    ) : this.props.value;
  }

  render() {
    return (
      <tr>
        <td>{this.props.label}</td>
        <td>{this.getValue()}</td>
      </tr>
    );
  }
}

TableRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  link: PropTypes.string,
};


const tableStyle = {
  width: '100%',
};

class Table extends Component {

  getRows() {
    return this.props.data.map((pair) => {
      return (
        <TableRow
          key={pair.label}
          label={pair.label}
          value={pair.value}
          link={pair.link} />
      );
    });
  }

  render() {
    return (
      <table style={tableStyle}>
        <tbody>
          {this.getRows()}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array.isRequired,
};

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
      for (let field of data){
        if (field.key) field.value = (field.key == 'pushed_at') ? moment(update[field.key]).format('MMMM DD, YYYY') : String(update[field.key]);
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
    }); //.bind(this);
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
