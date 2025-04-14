'use client';

import React from 'react';
import Link from 'next/link';
import Main from './components/Main';

export default function NotFound() {
  return (
    <Main title="404" description="Page Not Found">
      <article className="post" id="not-found">
        <header>
          <div className="title">
            <h2>Page Not Found</h2>
          </div>
        </header>
        <p>The page you requested does not exist.</p>
        <p>You may want to head back to the <Link href="/">homepage</Link>.</p>
      </article>
    </Main>
  );
}