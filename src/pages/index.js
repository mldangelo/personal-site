import Link from 'next/link';
import { NextSeo } from 'next-seo';

const Index = () => (
  <>
    <NextSeo
      title="Michael D'Angelo"
      description="Welcome to Michael D'Angelo's personal website."
    />
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2>
            <Link href="/">About this site</Link>
          </h2>
          <p>
            A beautiful, responsive,{' '}
            <a href="https://jamstack.org/">JAMstack</a> app written with{' '}
            <a href="https://nextjs.org/">Next.js</a>,{' '}
            <a href="https://reactjs.org/">React</a>, and modern Javascript.
          </p>
        </div>
      </header>
      <p>
        Welcome to my website. Please feel free to read more{' '}
        <Link href="/about">about me</Link>, or you can check out my{' '}
        <Link href="/resume">resume</Link>,{' '}
        <Link href="/projects">projects</Link>, view{' '}
        <Link href="/stats">site statistics</Link>, or{' '}
        <Link href="/contact">contact</Link> me.
      </p>
      <p>
        {' '}
        Source available at{' '}
        <a href="https://github.com/mldangelo/personal-site">
          @mldangelo/personal-site
        </a>
        .
      </p>
    </article>
  </>
);

export default Index;
