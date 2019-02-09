import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import dayjs from 'dayjs';

import axios from 'axios';
import Main from '../layouts/Main';

const Admin = () => {
  const [users, setData] = useState([]);

  const fetchData = async () => {
    const { data } = await axios('/api/admin');
    setData(data.users);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
                {users.map(user => (
                  <tr>
                    <td>{`${user.name || ''}`}</td>
                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                    <td>{dayjs(user.createdAt).format('MM/DD/YY')}</td>
                    <td>{dayjs(user.lastOnline).format('MM/DD/YY h:mm:ss a')}</td>
                    <td>{user.visits}</td>
                  </tr>
                ))
                  }
              </tbody>
            </table>
          </section>
        </div>
      </article>
    </Main>
  );
};

export default Admin;
