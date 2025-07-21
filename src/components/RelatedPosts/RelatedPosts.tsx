import React from 'react';
import Link from 'next/link';

interface RelatedPost {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  category: string;
  date: string;
}

interface RelatedPostsProps {
  currentSlug: string;
  currentCategory: string;
  posts: RelatedPost[];
}

export default function RelatedPosts({ currentSlug, currentCategory, posts }: RelatedPostsProps) {
  // Filter out current post and get related posts
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .map(post => ({
      ...post,
      score: post.category === currentCategory ? 2 : 1,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-lg"
          >
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {post.category}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mx-2">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {post.readTime}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {post.summary}
            </p>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              {post.date}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}