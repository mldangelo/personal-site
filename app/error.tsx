'use client';

import { useEffect } from 'react';

import { MAIN_CONTENT_ID } from '@/components/Template/PageWrapper';
import { claimReload, isMissingScript } from '@/lib/staleScript';
import { withBasePath } from '@/lib/utils';

/**
 * A page that failed while rendering in the browser. The usual cause on a
 * static host is a deploy: GitHub Pages cannot send the headers Next uses to
 * detect a new release, so a page opened before it follows a prefetched link
 * into scripts that no longer exist. One full reload picks up the new release.
 */
export default function ErrorPage({ error }: { error: Error }) {
  useEffect(() => {
    if (isMissingScript(error) && claimReload(window.location.href)) {
      window.location.reload();
    }
  }, [error]);

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1} className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-title">This page didn’t load</h1>
        <p className="not-found-message">
          The site may have just been updated. Loading the page again usually
          fixes it.
        </p>
        <div className="not-found-actions">
          <button
            type="button"
            className="button"
            onClick={() => window.location.reload()}
          >
            Load it again
          </button>
          <a href={withBasePath('/')} className="button button-secondary">
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
