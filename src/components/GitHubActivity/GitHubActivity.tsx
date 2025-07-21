'use client';

import React, { useEffect, useState } from 'react';

interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: any;
  created_at: string;
}

export default function GitHubActivity({ username = 'mldangelo' }: { username?: string }) {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/events/public`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.slice(0, 10)); // Show last 10 events
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load GitHub activity');
        setLoading(false);
      });
  }, [username]);

  const formatEventType = (type: string): string => {
    const typeMap: Record<string, string> = {
      PushEvent: '📤 Pushed to',
      PullRequestEvent: '🔀 Pull request',
      IssuesEvent: '📝 Issue',
      WatchEvent: '⭐ Starred',
      ForkEvent: '🍴 Forked',
      CreateEvent: '✨ Created',
      DeleteEvent: '🗑️ Deleted',
      PullRequestReviewEvent: '👀 Reviewed PR',
      IssueCommentEvent: '💬 Commented on',
      ReleaseEvent: '🚀 Released',
    };
    return typeMap[type] || type;
  };

  const formatEventDescription = (event: GitHubEvent): string => {
    switch (event.type) {
      case 'PushEvent':
        const commits = event.payload.commits?.length || 0;
        return `${commits} commit${commits !== 1 ? 's' : ''} to ${event.payload.ref?.replace('refs/heads/', '')}`;
      case 'PullRequestEvent':
        return `${event.payload.action} PR #${event.payload.pull_request?.number}: ${event.payload.pull_request?.title}`;
      case 'IssuesEvent':
        return `${event.payload.action} issue #${event.payload.issue?.number}: ${event.payload.issue?.title}`;
      case 'WatchEvent':
        return 'repository';
      case 'ForkEvent':
        return 'repository';
      case 'CreateEvent':
        return `${event.payload.ref_type} ${event.payload.ref || ''}`;
      case 'IssueCommentEvent':
        return `issue #${event.payload.issue?.number}`;
      case 'ReleaseEvent':
        return `${event.payload.release?.tag_name}`;
      default:
        return '';
    }
  };

  const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 p-3 glass rounded-lg">
            <div className="w-8 h-8 rounded-full skeleton" />
            <div className="flex-1">
              <div className="h-4 w-3/4 skeleton rounded mb-2" />
              <div className="h-3 w-1/2 skeleton rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="flex items-start gap-3 p-3 glass rounded-lg hover:shadow-md transition-shadow">
          <img
            src={event.actor.avatar_url}
            alt={event.actor.login}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-medium">{formatEventType(event.type)}</span>
              <a
                href={`https://github.com/${event.repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {event.repo.name}
              </a>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {formatEventDescription(event)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {timeAgo(event.created_at)}
            </p>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-4">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          View all activity on GitHub →
        </a>
      </div>
    </div>
  );
}