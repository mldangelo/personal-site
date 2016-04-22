import React, { Component, PropTypes } from 'react';


// To be provided by an API
const data = [
  {
    label: 'Hours spent on Netflix',
    value: 'Too many',
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
}];

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


class Stats extends Component {

  getRows() {
    return (
      <TableRow
        label={data[0].label}
        value={data[0].value} />
    );
  }

  render() {
    return (
      <div className="container stats">
          <h4>Some stats about me</h4>
            <table class="table table-hover">
            <h5>
            <thead>
              <tr>
                <th>Firstname</th>
                <th>Email</th>
              </tr>
              {this.getRows()}
            </thead>
            </h5>
            <p>
            <tbody>
              <tr>
                <td>Hours spent on Netflix</td>
                <td>Too Many</td>
              </tr>
            </tbody>
            </p>
          </table>
      </div>
    );
  }
}

export default Stats;
