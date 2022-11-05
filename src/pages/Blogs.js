import React from 'react';
// import { Link } from 'react-router-dom';
import Main from '../layouts/Main';
// import Cell from '../components/Blogs/Cell';
// import data from '../data/Blogs';

const Blog = () => (
  <Main
    title="Blog"
    description="Blog work by Dhruv Doshi"
  >
    <article className="post" id="stats">
      <header>
        <div className="title">
          <h2 data-testid="heading"><a href="https://blog.doshidhruv.com">Blogs</a></h2>
          <h3><b>Click <a style={{ color: 'blue' }} href="https://blog.doshidhruv.com" target="_blank" rel="noopener noreferrer">HERE</a> for searchable page</b></h3>
          <p style={{ lineHeight: 1.6, textAlign: 'justify' }}>The page is depreciated hence plese use the given link to access or visit https://blog.doshidhruv.com</p>
        </div>
      </header>
    </article>
  </Main>
);

export default Blog;
