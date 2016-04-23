import React, { Component, PropTypes } from 'react';


// TODO To be provided by an API
const data = [
  {
    label: 'Hours spent on Netflix',
    value: 'Too many',
  },{
    label: 'Hours spent on Reddit',
    value: '11%',
  },{
    label: 'Instagram photos posted',
    value: '3',
  },{
    label: 'Pictures Taken',
    value: '31534',
  },{
    label: 'API integrations used in making this table',
    value: '11',
  },{
    label: 'Burritos Eaten',
    value: '11',
  },{
    label: 'Trips to the grocery store',
    value: '5',
  },{
    label: 'Dollars spent on Gasoline',
    value: '58.23',
  },{
    label: 'Miles walked',
    value: '31.7',
  },{
    label: 'Number of flights of stairs climbed',
    value: '171',
  },{
    label: 'Days skied',
    value: '15',
  },{
    label: 'Days away from home',
    value: '62',
  },{
    label: 'Flights taken',
    value: '7',
  },{
    label: 'Stars on Github',
    value: '0',
  }
];


class TableRow extends Component {
  render(){
    return (
      <tr>
        <th>{this.props.label}</th>
        <th>{this.props.value}</th>
      </tr>
    );
  }
}

TableRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

class Table extends Component {

  getRows() {
    return this.props.data.map((pair) => {
      return (
        <TableRow
          label={pair.label}
          value={pair.value} />
      );
    });
  }

  render() {
    return (
      <div>
          <h4>{this.props.label}</h4>
          <table class="table table-hover">
            <tbody>
              {this.getRows()}
            </tbody>
          </table>
      </div>
    );
  }
}

Table.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};



class Stats extends Component {

  render() {
    return (
      <div className="container stats">
        <h2>Some stats/facts about me</h2>
        <Table
          label="Since Beginning of Time"
          data={data} />
        <Table
          label="Last Year"
          data={data} />
        <Table
          label="Last Month"
          data={data} />
      </div>
    );
  }
}

export default Stats;
