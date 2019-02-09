import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

import axios from 'axios';
import Main from '../layouts/Main';

const Music = () => {
  const [bands, setData] = useState([]);

  const fetchData = async () => {
    const { data } = await axios('/api/lastfm');
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            {bands.map(image => (
              <div key={image.name}>
                <a href={image.link}>
                  <img
                    src={image.image}
                    alt={String(image.name)}
                    width="100px"
                  />
                  <h4>
                    {String(image.name)}
                  </h4>
                </a>
              </div>))
              }
          </section>
        </div>
      </article>
    </Main>
  );
};

export default Music;
