import React from 'react';
import Link from 'next/link';
import Main from '@/layouts/Main';

const resources = {
  development: {
    title: 'Development Tools',
    items: [
      {
        name: 'Visual Studio Code',
        description: 'Lightweight but powerful source code editor',
        url: 'https://code.visualstudio.com/',
        tags: ['Editor', 'IDE'],
      },
      {
        name: 'GitHub Copilot',
        description: 'AI pair programmer that helps you write code faster',
        url: 'https://github.com/features/copilot',
        tags: ['AI', 'Productivity'],
      },
      {
        name: 'Docker',
        description: 'Platform for developing, shipping, and running applications',
        url: 'https://www.docker.com/',
        tags: ['Containers', 'DevOps'],
      },
      {
        name: 'Vercel',
        description: 'Platform for frontend frameworks and static sites',
        url: 'https://vercel.com/',
        tags: ['Hosting', 'Deployment'],
      },
    ],
  },
  learning: {
    title: 'Learning Resources',
    items: [
      {
        name: 'Fast.ai',
        description: 'Making neural nets uncool again',
        url: 'https://www.fast.ai/',
        tags: ['Machine Learning', 'Course'],
      },
      {
        name: 'Papers With Code',
        description: 'Machine learning papers with code implementations',
        url: 'https://paperswithcode.com/',
        tags: ['Research', 'ML'],
      },
      {
        name: 'The Rust Programming Language',
        description: 'The official book on Rust',
        url: 'https://doc.rust-lang.org/book/',
        tags: ['Rust', 'Book'],
      },
      {
        name: 'Patterns.dev',
        description: 'Modern web app design patterns',
        url: 'https://www.patterns.dev/',
        tags: ['Design Patterns', 'Web'],
      },
    ],
  },
  productivity: {
    title: 'Productivity',
    items: [
      {
        name: 'Obsidian',
        description: 'Private and flexible writing app',
        url: 'https://obsidian.md/',
        tags: ['Notes', 'Knowledge Management'],
      },
      {
        name: 'Linear',
        description: 'Streamline issues, sprints, and product roadmaps',
        url: 'https://linear.app/',
        tags: ['Project Management', 'Issue Tracking'],
      },
      {
        name: 'Cal.com',
        description: 'Open source scheduling infrastructure',
        url: 'https://cal.com/',
        tags: ['Scheduling', 'Open Source'],
      },
      {
        name: 'Raycast',
        description: 'Blazingly fast, totally extendable launcher',
        url: 'https://www.raycast.com/',
        tags: ['Productivity', 'macOS'],
      },
    ],
  },
  design: {
    title: 'Design Resources',
    items: [
      {
        name: 'Figma',
        description: 'Collaborative interface design tool',
        url: 'https://www.figma.com/',
        tags: ['Design', 'Collaboration'],
      },
      {
        name: 'Tailwind UI',
        description: 'Beautiful UI components by the creators of Tailwind CSS',
        url: 'https://tailwindui.com/',
        tags: ['Components', 'Tailwind'],
      },
      {
        name: 'Heroicons',
        description: 'Beautiful hand-crafted SVG icons',
        url: 'https://heroicons.com/',
        tags: ['Icons', 'SVG'],
      },
      {
        name: 'unDraw',
        description: 'Open-source illustrations for any idea',
        url: 'https://undraw.co/',
        tags: ['Illustrations', 'Open Source'],
      },
    ],
  },
};

const ResourceCard = ({ name, description, url, tags }: {
  name: string;
  description: string;
  url: string;
  tags: string[];
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-lg group"
  >
    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
      {name}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
      {description}
    </p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
        >
          {tag}
        </span>
      ))}
    </div>
  </a>
);

export default function ResourcesPage() {
  return (
    <Main>
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Resources</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A curated collection of tools, libraries, and learning materials I've found valuable.
          </p>
        </header>

        <div className="space-y-12">
          {Object.entries(resources).map(([key, category]) => (
            <section key={key}>
              <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {category.items.map((item) => (
                  <ResourceCard key={item.name} {...item} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Contributing</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Have a resource you think should be included? I'm always looking for new tools and learning materials.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            Suggest a resource →
          </Link>
        </section>
      </article>
    </Main>
  );
}