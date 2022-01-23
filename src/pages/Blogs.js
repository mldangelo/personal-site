import React from 'react';
// import { Link } from 'react-router-dom';
import Main from '../layouts/Main';
import Cell from '../components/Blogs/Cell';
import data from '../data/Blogs';

const Blog = () => (
  <Main
    title="Blog"
    description="Blog work by Dhruv Doshi"
  >
    <article className="post" id="stats">
      <header>
        <div className="title">
          <h2 data-testid="heading"><a href="https://dhruvdoshi.github.io/blog/">Blogs</a></h2>
          <p>Click <a style={{ color: 'purple' }} href="https://dhruvdoshi.github.io/blog/" target="_blank">blogs</a> for searchable page</p>
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
