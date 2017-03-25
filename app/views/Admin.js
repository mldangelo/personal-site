import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

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
    axios.get('/api/admin').then(({data}) => {
      console.log(data.users);
      this.setState({
        data: data.users,
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
              {this.state.data.map(user => (
                <div key={user._id}>
                  <p>{JSON.stringify(user)}</p>
                </div>),
             )
            }
            </section>
          </div>
        </article>
      </Main>
    );
  }
}

export default Admin;
