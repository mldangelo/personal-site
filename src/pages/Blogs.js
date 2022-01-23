import React from 'react';
// import { Link } from 'react-router-dom';
import Main from '../layouts/Main';
import Cell from '../components/Blogs/Cell';
import data from '../data/Blogs';

const Blog = () => (
  <Main
    title="Blogs"
    description="Blogs Writteb by Dhruv Doshi"
  >
    <article className="post" id="stats">
      <header>
        <div className="title">
          <h2 data-testid="heading"><a href="https://dhruvdoshi.github.io/blog">Search</a></h2>
          <p>Click <a href="https://dhruvdoshi.github.io/blog">blog</a> to search blog for specific keyword</p>
        </div>
      </header>
    </article>
    {data.map((blog) => (
      <Cell
        data={blog}
        key={blog.title}
      />
    ))}
  </Main>
);

export default Blog;
