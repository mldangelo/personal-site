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
        <h2 data-testid="heading"><a href="https://dhruvdoshi.github.io/blogs">Search</a></h2>
        <p>Click <a href="https://dhruvdoshi.github.io/blogs">blog</a> to search blog for specific keyword</p>
      </div>
    </header>
      {data.map((blog) => (
        <Cell
          data={blog}
          key={blog.title}
        />
      ))}
    </article>
  </Main>
);

export default Blog;
