import React from 'react';

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'Page not found',
};

export default function NotFound() {
  return (
    <div id="wrapper">
      <div id="main">
        <article className="post" id="contact">
          <header>
            <div className="title">
              <h2>Page Not Found</h2>
            </div>
          </header>
          <Link href="/">Return Home</Link>
        </article>
      </div>
    </div>
  );
}
