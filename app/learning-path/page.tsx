'use client';

import React, { useState } from 'react';
import Main from '@/layouts/Main';
import { CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: { name: string; url: string; type: 'video' | 'article' | 'course' | 'book' }[];
  completed?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalDuration: string;
  steps: LearningStep[];
}

const learningPaths: LearningPath[] = [
  {
    id: 'ml-fundamentals',
    title: 'Machine Learning Fundamentals',
    description: 'Start your journey into machine learning with a solid foundation in theory and practice.',
    difficulty: 'beginner',
    totalDuration: '3-4 months',
    steps: [
      {
        id: 'ml-1',
        title: 'Mathematics for ML',
        description: 'Linear algebra, calculus, and statistics essentials',
        duration: '3-4 weeks',
        resources: [
          { name: '3Blue1Brown Linear Algebra', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', type: 'video' },
          { name: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course' },
        ],
      },
      {
        id: 'ml-2',
        title: 'Python for Data Science',
        description: 'NumPy, Pandas, and data manipulation',
        duration: '2-3 weeks',
        resources: [
          { name: 'Python Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'book' },
          { name: 'Kaggle Learn Python', url: 'https://www.kaggle.com/learn/python', type: 'course' },
        ],
      },
      {
        id: 'ml-3',
        title: 'ML Algorithms',
        description: 'Supervised and unsupervised learning algorithms',
        duration: '4-5 weeks',
        resources: [
          { name: 'Andrew Ng ML Course', url: 'https://www.coursera.org/learn/machine-learning', type: 'course' },
          { name: 'Hands-On ML Book', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/', type: 'book' },
        ],
      },
      {
        id: 'ml-4',
        title: 'Deep Learning Basics',
        description: 'Neural networks and backpropagation',
        duration: '3-4 weeks',
        resources: [
          { name: 'Fast.ai Course', url: 'https://course.fast.ai/', type: 'course' },
          { name: 'Deep Learning Book', url: 'https://www.deeplearningbook.org/', type: 'book' },
        ],
      },
    ],
  },
  {
    id: 'fullstack-dev',
    title: 'Modern Full-Stack Development',
    description: 'Build production-ready web applications with modern tools and frameworks.',
    difficulty: 'intermediate',
    totalDuration: '4-6 months',
    steps: [
      {
        id: 'fs-1',
        title: 'Advanced JavaScript/TypeScript',
        description: 'ES6+, async patterns, and TypeScript',
        duration: '3-4 weeks',
        resources: [
          { name: 'JavaScript.info', url: 'https://javascript.info/', type: 'article' },
          { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/', type: 'article' },
        ],
      },
      {
        id: 'fs-2',
        title: 'React & Next.js',
        description: 'Modern React patterns and Next.js framework',
        duration: '4-5 weeks',
        resources: [
          { name: 'React Beta Docs', url: 'https://react.dev/', type: 'article' },
          { name: 'Next.js Learn', url: 'https://nextjs.org/learn', type: 'course' },
        ],
      },
      {
        id: 'fs-3',
        title: 'Backend Development',
        description: 'Node.js, databases, and API design',
        duration: '4-5 weeks',
        resources: [
          { name: 'Node.js Best Practices', url: 'https://github.com/goldbergyoni/nodebestpractices', type: 'article' },
          { name: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', type: 'course' },
        ],
      },
      {
        id: 'fs-4',
        title: 'DevOps & Deployment',
        description: 'Docker, CI/CD, and cloud deployment',
        duration: '3-4 weeks',
        resources: [
          { name: 'Docker Getting Started', url: 'https://docs.docker.com/get-started/', type: 'article' },
          { name: 'GitHub Actions', url: 'https://docs.github.com/en/actions', type: 'article' },
        ],
      },
    ],
  },
  {
    id: 'systems-programming',
    title: 'Systems Programming with Rust',
    description: 'Learn low-level programming and build high-performance systems.',
    difficulty: 'advanced',
    totalDuration: '4-5 months',
    steps: [
      {
        id: 'rust-1',
        title: 'Rust Fundamentals',
        description: 'Ownership, borrowing, and lifetimes',
        duration: '4-5 weeks',
        resources: [
          { name: 'The Rust Book', url: 'https://doc.rust-lang.org/book/', type: 'book' },
          { name: 'Rustlings', url: 'https://github.com/rust-lang/rustlings', type: 'course' },
        ],
      },
      {
        id: 'rust-2',
        title: 'Advanced Rust',
        description: 'Traits, generics, and async programming',
        duration: '3-4 weeks',
        resources: [
          { name: 'Rust by Example', url: 'https://doc.rust-lang.org/rust-by-example/', type: 'article' },
          { name: 'Async Rust Book', url: 'https://rust-lang.github.io/async-book/', type: 'book' },
        ],
      },
      {
        id: 'rust-3',
        title: 'Systems Design',
        description: 'Memory management and performance optimization',
        duration: '4-5 weeks',
        resources: [
          { name: 'Writing an OS in Rust', url: 'https://os.phil-opp.com/', type: 'course' },
          { name: 'Rust Performance Book', url: 'https://nnethercote.github.io/perf-book/', type: 'book' },
        ],
      },
      {
        id: 'rust-4',
        title: 'Real-World Projects',
        description: 'Build CLI tools, web servers, and more',
        duration: '4-5 weeks',
        resources: [
          { name: 'Zero to Production', url: 'https://www.zero2prod.com/', type: 'book' },
          { name: 'Awesome Rust', url: 'https://github.com/rust-unofficial/awesome-rust', type: 'article' },
        ],
      },
    ],
  },
];

const PathStep = ({ step, index, isLast }: { step: LearningStep; index: number; isLast: boolean }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
      )}
      
      <div className="flex items-start">
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
          ${step.completed 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
        `}>
          {step.completed ? (
            <CheckCircleIcon className="w-6 h-6" />
          ) : (
            <span className="font-semibold">{index + 1}</span>
          )}
        </div>
        
        <div className="ml-6 flex-1 pb-8">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-left w-full group"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {step.title}
              </h3>
              <ChevronRightIcon 
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expanded ? 'transform rotate-90' : ''
                }`}
              />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Duration: {step.duration}
            </p>
          </button>
          
          {expanded && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">Resources:</h4>
              {step.resources.map((resource) => (
                <a
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span className="mr-2">
                    {resource.type === 'video' && '🎥'}
                    {resource.type === 'article' && '📄'}
                    {resource.type === 'course' && '🎓'}
                    {resource.type === 'book' && '📚'}
                  </span>
                  {resource.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LearningPathPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const selectedLearningPath = learningPaths.find(p => p.id === selectedPath);

  return (
    <Main>
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Learning Paths</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Structured learning paths to help you master new technologies and concepts.
          </p>
        </header>

        {!selectedPath ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {learningPaths.map((path) => (
              <button
                key={path.id}
                onClick={() => setSelectedPath(path.id)}
                className="text-left p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    text-xs font-medium px-2 py-1 rounded
                    ${path.difficulty === 'beginner' && 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}
                    ${path.difficulty === 'intermediate' && 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}
                    ${path.difficulty === 'advanced' && 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}
                  `}>
                    {path.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">
                    {path.totalDuration}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{path.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {path.description}
                </p>
                <div className="text-sm text-gray-500">
                  {path.steps.length} steps
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedPath(null)}
              className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              ← Back to all paths
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{selectedLearningPath!.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedLearningPath!.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className={`
                  font-medium px-2 py-1 rounded
                  ${selectedLearningPath!.difficulty === 'beginner' && 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'}
                  ${selectedLearningPath!.difficulty === 'intermediate' && 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}
                  ${selectedLearningPath!.difficulty === 'advanced' && 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}
                `}>
                  {selectedLearningPath!.difficulty}
                </span>
                <span className="text-gray-500">
                  Total duration: {selectedLearningPath!.totalDuration}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {selectedLearningPath!.steps.map((step, index) => (
                <PathStep
                  key={step.id}
                  step={step}
                  index={index}
                  isLast={index === selectedLearningPath!.steps.length - 1}
                />
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Ready to start?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Track your progress by creating an account or using local storage.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Learning
              </button>
            </div>
          </div>
        )}
      </article>
    </Main>
  );
}