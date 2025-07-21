'use client';

import React, { useState } from 'react';

interface Book {
  title: string;
  author: string;
  category: 'technical' | 'business' | 'philosophy' | 'science' | 'fiction' | 'biography';
  rating: 1 | 2 | 3 | 4 | 5;
  status: 'reading' | 'completed' | 'want-to-read';
  year?: number;
  notes?: string;
  link?: string;
  favorite?: boolean;
}

const books: Book[] = [
  // Currently Reading
  {
    title: 'The Art of Doing Science and Engineering',
    author: 'Richard Hamming',
    category: 'science',
    rating: 5,
    status: 'reading',
    notes: 'Profound insights on learning to learn',
    favorite: true,
  },
  {
    title: 'Staff Engineer: Leadership Beyond the Management Track',
    author: 'Will Larson',
    category: 'technical',
    rating: 4,
    status: 'reading',
    link: 'https://staffeng.com/book',
  },
  
  // Technical
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'technical',
    rating: 5,
    status: 'completed',
    year: 2023,
    notes: 'The bible for distributed systems. Read it twice.',
    favorite: true,
  },
  {
    title: 'The Rust Programming Language',
    author: 'Steve Klabnik & Carol Nichols',
    category: 'technical',
    rating: 5,
    status: 'completed',
    year: 2023,
    notes: 'Best programming language book I\'ve ever read',
    link: 'https://doc.rust-lang.org/book/',
  },
  {
    title: 'Computer Systems: A Programmer\'s Perspective',
    author: 'Randal Bryant & David O\'Hallaron',
    category: 'technical',
    rating: 5,
    status: 'completed',
    year: 2022,
    notes: 'Essential for understanding how computers actually work',
  },
  {
    title: 'The Algorithm Design Manual',
    author: 'Steven Skiena',
    category: 'technical',
    rating: 4,
    status: 'completed',
    year: 2021,
  },
  {
    title: 'Site Reliability Engineering',
    author: 'Google',
    category: 'technical',
    rating: 4,
    status: 'completed',
    year: 2022,
    link: 'https://sre.google/books/',
  },
  
  // Business & Startups
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'business',
    rating: 5,
    status: 'completed',
    year: 2019,
    notes: 'Contrarian thinking at its finest',
    favorite: true,
  },
  {
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    category: 'business',
    rating: 5,
    status: 'completed',
    year: 2020,
    notes: 'War stories from the trenches. Incredibly practical.',
  },
  {
    title: 'High Output Management',
    author: 'Andy Grove',
    category: 'business',
    rating: 5,
    status: 'completed',
    year: 2021,
    notes: 'The best book on management, bar none',
  },
  {
    title: 'Good to Great',
    author: 'Jim Collins',
    category: 'business',
    rating: 4,
    status: 'completed',
    year: 2020,
  },
  {
    title: 'Crossing the Chasm',
    author: 'Geoffrey Moore',
    category: 'business',
    rating: 4,
    status: 'completed',
    year: 2021,
  },
  
  // Philosophy & Thinking
  {
    title: 'Gödel, Escher, Bach',
    author: 'Douglas Hofstadter',
    category: 'philosophy',
    rating: 5,
    status: 'completed',
    year: 2018,
    notes: 'Mind-bending. Changed how I think about consciousness.',
    favorite: true,
  },
  {
    title: 'Antifragile',
    author: 'Nassim Taleb',
    category: 'philosophy',
    rating: 5,
    status: 'completed',
    year: 2022,
    notes: 'Essential framework for thinking about complex systems',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'philosophy',
    rating: 4,
    status: 'completed',
    year: 2019,
  },
  {
    title: 'The Beginning of Infinity',
    author: 'David Deutsch',
    category: 'philosophy',
    rating: 5,
    status: 'completed',
    year: 2023,
    notes: 'Optimistic rationalism. We can solve any problem.',
  },
  
  // Science
  {
    title: 'The Feynman Lectures on Physics',
    author: 'Richard Feynman',
    category: 'science',
    rating: 5,
    status: 'completed',
    year: 2017,
    notes: 'Physics from first principles. Beautiful.',
    link: 'https://www.feynmanlectures.caltech.edu/',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    category: 'science',
    rating: 4,
    status: 'completed',
    year: 2016,
  },
  {
    title: 'Chaos: Making a New Science',
    author: 'James Gleick',
    category: 'science',
    rating: 4,
    status: 'completed',
    year: 2020,
  },
  
  // Biography
  {
    title: 'Surely You\'re Joking, Mr. Feynman!',
    author: 'Richard Feynman',
    category: 'biography',
    rating: 5,
    status: 'completed',
    year: 2015,
    notes: 'How to stay curious about everything',
    favorite: true,
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    category: 'biography',
    rating: 4,
    status: 'completed',
    year: 2018,
  },
  {
    title: 'Elon Musk',
    author: 'Ashlee Vance',
    category: 'biography',
    rating: 4,
    status: 'completed',
    year: 2019,
  },
  
  // Fiction
  {
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    category: 'fiction',
    rating: 5,
    status: 'completed',
    year: 2022,
    notes: 'Hard sci-fi at its best. Trilogy is incredible.',
  },
  {
    title: 'Neuromancer',
    author: 'William Gibson',
    category: 'fiction',
    rating: 4,
    status: 'completed',
    year: 2021,
  },
  {
    title: 'Snow Crash',
    author: 'Neal Stephenson',
    category: 'fiction',
    rating: 4,
    status: 'completed',
    year: 2020,
  },
  
  // Want to Read
  {
    title: 'The Network State',
    author: 'Balaji Srinivasan',
    category: 'philosophy',
    rating: 1,
    status: 'want-to-read',
    link: 'https://thenetworkstate.com/',
  },
  {
    title: 'Working in Public',
    author: 'Nadia Eghbal',
    category: 'technical',
    rating: 1,
    status: 'want-to-read',
  },
  {
    title: 'The Mom Test',
    author: 'Rob Fitzpatrick',
    category: 'business',
    rating: 1,
    status: 'want-to-read',
  },
];

export default function BookshelfPage() {
  const [filter, setFilter] = useState<'all' | Book['status'] | 'favorites'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Book['category']>('all');

  const filteredBooks = books.filter(book => {
    if (filter === 'favorites' && !book.favorite) return false;
    if (filter !== 'all' && filter !== 'favorites' && book.status !== filter) return false;
    if (categoryFilter !== 'all' && book.category !== categoryFilter) return false;
    return true;
  });

  const categories = [...new Set(books.map(b => b.category))];
  
  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    wantToRead: books.filter(b => b.status === 'want-to-read').length,
    favorites: books.filter(b => b.favorite).length,
  };

  const getCategoryEmoji = (category: Book['category']) => {
    switch (category) {
      case 'technical': return '💻';
      case 'business': return '📈';
      case 'philosophy': return '🤔';
      case 'science': return '🔬';
      case 'fiction': return '🚀';
      case 'biography': return '👤';
      default: return '📖';
    }
  };

  const renderRating = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Bookshelf</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Books that have shaped my thinking. {stats.completed} read, {stats.reading} in progress.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`glass rounded-lg p-4 text-center transition-all ${
              filter === 'all' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
            }`}
          >
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Books</div>
          </button>
          <button
            onClick={() => setFilter('reading')}
            className={`glass rounded-lg p-4 text-center transition-all ${
              filter === 'reading' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
            }`}
          >
            <div className="text-2xl font-bold">{stats.reading}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reading</div>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`glass rounded-lg p-4 text-center transition-all ${
              filter === 'completed' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
            }`}
          >
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </button>
          <button
            onClick={() => setFilter('want-to-read')}
            className={`glass rounded-lg p-4 text-center transition-all ${
              filter === 'want-to-read' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
            }`}
          >
            <div className="text-2xl font-bold">{stats.wantToRead}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Want to Read</div>
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`glass rounded-lg p-4 text-center transition-all ${
              filter === 'favorites' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
            }`}
          >
            <div className="text-2xl font-bold">⭐ {stats.favorites}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Favorites</div>
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              categoryFilter === 'all'
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'glass hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg transition-all ${
                categoryFilter === category
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'glass hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {getCategoryEmoji(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => (
            <div key={index} className="glass rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{getCategoryEmoji(book.category)}</span>
                {book.favorite && <span className="text-2xl">⭐</span>}
              </div>
              
              <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">by {book.author}</p>
              
              <div className="flex items-center gap-4 mb-3 text-sm">
                <span className="text-yellow-500">{renderRating(book.rating)}</span>
                {book.year && <span className="text-gray-500">{book.year}</span>}
              </div>
              
              {book.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3">
                  "{book.notes}"
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${
                  book.status === 'reading' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : book.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {book.status === 'want-to-read' ? 'Want to Read' : book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                </span>
                
                {book.link && (
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Learn more →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">If You Only Read Three...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-lg p-6">
              <h3 className="font-semibold mb-2">For Engineers</h3>
              <p className="text-gray-600 dark:text-gray-400">
                "Designing Data-Intensive Applications" - Essential for building scalable systems.
              </p>
            </div>
            <div className="glass rounded-lg p-6">
              <h3 className="font-semibold mb-2">For Founders</h3>
              <p className="text-gray-600 dark:text-gray-400">
                "Zero to One" - How to build something genuinely new.
              </p>
            </div>
            <div className="glass rounded-lg p-6">
              <h3 className="font-semibold mb-2">For Thinkers</h3>
              <p className="text-gray-600 dark:text-gray-400">
                "Gödel, Escher, Bach" - A journey through consciousness and computation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}