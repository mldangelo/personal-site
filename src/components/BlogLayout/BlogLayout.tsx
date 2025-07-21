import React from 'react';
import ReadingProgress from '@/components/ReadingProgress/ReadingProgress';
import Comments from '@/components/Comments/Comments';

interface BlogLayoutProps {
  children: React.ReactNode;
  showComments?: boolean;
}

export default function BlogLayout({ children, showComments = true }: BlogLayoutProps) {
  // Giscus configuration - replace with your actual values
  const giscusConfig = {
    repo: 'mldangelo/personal-site',
    repoId: 'MDEwOlJlcG9zaXRvcnkzMTIwNTcwNDU=', // Replace with your repo ID
    category: 'Blog Comments',
    categoryId: 'DIC_kwDOEpYQVc4CXqUm', // Replace with your category ID
  };

  return (
    <>
      <ReadingProgress />
      {children}
      {showComments && (
        <Comments
          repo={giscusConfig.repo}
          repoId={giscusConfig.repoId}
          category={giscusConfig.category}
          categoryId={giscusConfig.categoryId}
        />
      )}
    </>
  );
}