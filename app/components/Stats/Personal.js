import React, { Component } from 'react';

import Table from './Table';
import data from '../../data/stats';

class PersonalStats extends Component {

  constructor(props) {
    super(props);
    this.state = { data };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.tick(), 100);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    const divisor = 1000 * 60 * 60 * 24 * 365.2421897; // ms in an average year
    const birthTime = new Date('1990-02-05T09:24:00');
    this.setState({
      data: Object.assign({}, this.state.data, {
        age: {
          label: 'Current age',
          value: ((Date.now() - birthTime) / divisor).toFixed(9),
        },
      }),
    });
  }

  render() {
    return (
      <div>
        <h3>Some stats about me</h3>
        <Table
          data={Object.keys(this.state.data).map(key => this.state.data[key])}
        />
      </div>
    );
  }
}

export default PersonalStats;
