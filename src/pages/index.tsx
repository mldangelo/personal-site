import Link from 'next/link';
import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={
      "Austin Dase's personal website. DC based Software Engineer, " +
      'Lead Software Engineer at Fundrise.'
    }
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2>
            <Link href="/" passHref>
              About this site
            </Link>
          </h2>
          <p>
            A responsive, statically-generated, react application written with
            modern Javascript.
          </p>
        </div>
      </header>
      <p>
        Welcome to my website. Please feel free to read more{' '}
        <Link href="/about" passHref>
          about me
        </Link>
        , or you can check out my{' '}
        <Link href="/resume" passHref>
          resume
        </Link>
        ,{' '}
        <Link href="/projects" passHref>
          projects
        </Link>
        , view{' '}
        <Link href="/stats" passHref>
          site statistics
        </Link>
        , or{' '}
        <Link href="/contact" passHref>
          contact
        </Link>{' '}
        me.
      </p>
      <p>
        Source available{' '}
        <a href="https://github.com/adase11/personal-site">here</a>.
      </p>
    </article>
  </Main>
);

export default Index;
