import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

import axios from 'axios';
import Main from '../layouts/Main';

class Music extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    axios.get('/api/lastfm').then((result) => {
      this.setState({
        data: result.data,
      });
    }).catch((error) => {
      console.error('github-api-fetch-error', error);
    });
  }

  render() {
    return (
      <Main fullPage>
        <Helmet title="Music" />
        <article className="post" id="music">
          <header>
            <div className="title">
              <h2><Link to="/music">Some bands that I like</Link></h2>
              <p>Bands that I&apos;ve been listening to over the past year</p>
            </div>
          </header>
          <div>
            <section id="band-tile">
              {this.state.data.map(image => (
                <div key={image.name}>
                  <a href={image.link}>
                    <img
                      src={image.image}
                      alt={String(image.name)}
                      width={'100px'}
                    />
                    <h4>
                      {String(image.name)}
                    </h4>
                  </a>
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

export default Music;
