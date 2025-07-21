import { MetadataRoute } from 'next';
import { allPosts as posts } from '@/data/writing';
import projects from '@/data/projects';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mldangelo.com';
  const currentDate = new Date();
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/resume',
    '/resume-interactive',
    '/projects', 
    '/writing',
    '/contact',
    '/search',
    '/bookshelf',
    '/timeline',
    '/lab',
    '/tools',
    '/uses',
    '/now',
    '/portfolio',
    '/talks',
    '/photography',
    '/stats',
    '/terminal',
    '/quest',
    '/press',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '/stats' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : route.includes('resume') || route === '/about' || route === '/projects' ? 0.8 : 0.6,
  }));

  // Blog posts
  const blogPosts = posts
    .filter(post => post.link && !post.link.startsWith('http'))
    .map(post => ({
      url: `${baseUrl}${post.link}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }));

  return [...staticPages, ...blogPosts];
}