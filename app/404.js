"use client";

import React from 'react';
import Link from 'next/link';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const PageNotFound = () => (
  <HelmetProvider>
    <div className="not-found">
      <Helmet title="404 Not Found">
        <meta name="description" content="The content you are looking for cannot be found." />
      </Helmet>
      <h1>Page Not Found</h1>
      <p>Return <Link href="/">home</Link>.</p>
    </div>
  </HelmetProvider>
);

export default PageNotFound;
