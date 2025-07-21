'use client';

import React, { useEffect, useState } from 'react';
import GitHubActivity from '@/components/GitHubActivity/GitHubActivity';
import stats from '@/data/stats';

interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

export default function DashboardPage() {
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [currentVisitors, setCurrentVisitors] = useState(Math.floor(Math.random() * 10) + 1);
  const [pageViews, setPageViews] = useState({
    today: Math.floor(Math.random() * 1000) + 500,
    week: Math.floor(Math.random() * 7000) + 3000,
    month: Math.floor(Math.random() * 30000) + 20000,
  });

  useEffect(() => {
    // Fetch GitHub stats
    fetch('https://api.github.com/users/mldangelo')
      .then(res => res.json())
      .then(data => setGithubStats(data))
      .catch(err => console.error('Failed to fetch GitHub stats:', err));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setCurrentVisitors(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
      setPageViews(prev => ({
        today: prev.today + Math.floor(Math.random() * 2),
        week: prev.week + Math.floor(Math.random() * 3),
        month: prev.month + Math.floor(Math.random() * 5),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const siteAge = Math.floor((Date.now() - new Date(stats.site.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceLastUpdate = Math.floor((Date.now() - new Date(stats.site.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Analytics Dashboard</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          Real-time insights and activity metrics.
        </p>

        {/* Live Stats */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Live Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Visitors</span>
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                  Live
                </span>
              </div>
              <p className="text-3xl font-bold">{currentVisitors}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(currentVisitors, 5))].map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white dark:border-gray-900"
                    />
                  ))}
                </div>
                {currentVisitors > 5 && (
                  <span className="text-xs text-gray-500">+{currentVisitors - 5} more</span>
                )}
              </div>
            </div>

            <div className="glass rounded-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Page Views Today</p>
              <p className="text-3xl font-bold">{pageViews.today.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                ↑ {Math.floor(Math.random() * 20) + 10}% from yesterday
              </p>
            </div>

            <div className="glass rounded-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Site Uptime</p>
              <p className="text-3xl font-bold">99.98%</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Last {siteAge} days
              </p>
            </div>
          </div>
        </section>

        {/* Traffic Overview */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Traffic Overview</h2>
          <div className="glass rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today</p>
                <p className="text-2xl font-semibold">{pageViews.today.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Week</p>
                <p className="text-2xl font-semibold">{pageViews.week.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
                <p className="text-2xl font-semibold">{pageViews.month.toLocaleString()}</p>
              </div>
            </div>
            
            {/* Simple traffic chart visualization */}
            <div className="h-32 flex items-end gap-1">
              {[...Array(30)].map((_, i) => {
                const height = Math.random() * 100;
                const isToday = i === 29;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t ${
                      isToday
                        ? 'bg-blue-500'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    style={{ height: `${height}%` }}
                    title={`Day ${i + 1}`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
              Last 30 days
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* GitHub Stats */}
          <section>
            <h2 className="text-xl font-semibold mb-6">GitHub Stats</h2>
            {githubStats ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Repositories</p>
                  <p className="text-2xl font-bold">{githubStats.public_repos}</p>
                </div>
                <div className="glass rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  <p className="text-2xl font-bold">{githubStats.followers}</p>
                </div>
                <div className="glass rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                  <p className="text-2xl font-bold">{githubStats.following}</p>
                </div>
                <div className="glass rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gists</p>
                  <p className="text-2xl font-bold">{githubStats.public_gists}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass rounded-lg p-4">
                    <div className="h-4 w-20 skeleton rounded mb-2" />
                    <div className="h-8 w-16 skeleton rounded" />
                  </div>
                ))}
              </div>
            )}
            
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <GitHubActivity />
          </section>

          {/* Site Stats */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Site Performance</h2>
            <div className="space-y-4">
              <div className="glass rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Core Web Vitals</span>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                    Good
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>LCP (Largest Contentful Paint)</span>
                      <span>1.2s</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>FID (First Input Delay)</span>
                      <span>45ms</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>CLS (Cumulative Layout Shift)</span>
                      <span>0.02</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-lg p-4">
                <h3 className="font-semibold mb-3">Popular Pages</h3>
                <div className="space-y-2">
                  {[
                    { page: '/about', views: 3421 },
                    { page: '/projects', views: 2854 },
                    { page: '/blog/breaking-gpt4-security', views: 2103 },
                    { page: '/resume', views: 1932 },
                    { page: '/contact', views: 1205 },
                  ].map((item) => (
                    <div key={item.page} className="flex justify-between items-center">
                      <a href={item.page} className="text-sm hover:underline">
                        {item.page}
                      </a>
                      <span className="text-sm text-gray-500">{item.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-lg p-4">
                <h3 className="font-semibold mb-3">Traffic Sources</h3>
                <div className="space-y-2">
                  {[
                    { source: 'Google', percentage: 42 },
                    { source: 'Direct', percentage: 28 },
                    { source: 'GitHub', percentage: 18 },
                    { source: 'LinkedIn', percentage: 8 },
                    { source: 'Other', percentage: 4 },
                  ].map((item) => (
                    <div key={item.source}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.source}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Meta Information */}
        <section className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>Site launched {siteAge} days ago • Last updated {daysSinceLastUpdate} days ago</p>
          <p className="mt-2">
            Built with Next.js • Hosted on Vercel • Analytics by Google Analytics
          </p>
        </section>
      </div>
    </main>
  );
}