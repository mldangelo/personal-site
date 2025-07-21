'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface CommentsProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export default function Comments({ repo, repoId, category, categoryId }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    ref.current.appendChild(script);

    return () => {
      if (ref.current && ref.current.hasChildNodes()) {
        ref.current.innerHTML = '';
      }
    };
  }, [repo, repoId, category, categoryId, resolvedTheme]);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('.giscus-frame');
    if (!iframe) return;

    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: resolvedTheme === 'dark' ? 'dark' : 'light' } } },
      'https://giscus.app'
    );
  }, [resolvedTheme]);

  return (
    <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-8">Comments</h2>
      <div ref={ref} />
    </div>
  );
}