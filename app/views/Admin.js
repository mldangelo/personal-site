import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import moment from 'moment';

import axios from 'axios';
import Main from '../layouts/Main';


class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    axios.get('/api/admin').then((payload) => {
      this.setState({
        data: payload.data.users,
      });
    }).catch((error) => {
      console.error('admin-api-fetch-error', error);
    });
  }

  render() {
    return (
      <Main fullPage>
        <Helmet title="Admin" />
        <article className="post" id="admin">
          <header>
            <div className="title">
              <h2><Link to="/admin">Admin Dashboard</Link></h2>
            </div>
          </header>
          <div>
            <section id="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Last Online</th>
                    <th>Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.map(user => (
                    <tr>
                      <td>{`${user.name || ''}`}</td>
                      <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                      <td>{moment(user.createdAt).format('MM/DD/YY')}</td>
                      <td>{moment(user.lastOnline).format('MM/DD/YY h:mm:ss a')}</td>
                      <td>{user.visits}</td>
                    </tr>
                ),
             )
            }
                </tbody>
              </table>
            </section>
          </div>
        </article>
      </Main>
    );
  }
}

export default Admin;
