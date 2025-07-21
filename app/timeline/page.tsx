'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TimelineEvent {
  year: number;
  month?: number;
  title: string;
  description: string;
  type: 'work' | 'education' | 'project' | 'life' | 'achievement';
  details?: string[];
  link?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 2024,
    month: 11,
    title: 'Promptfoo Reaches 125k Users',
    description: 'Our open-source LLM security tool hits major adoption milestone',
    type: 'achievement',
    details: ['4.2k GitHub stars', '$2.3M ARR', 'Featured in major security conferences'],
  },
  {
    year: 2023,
    month: 3,
    title: 'Founded Promptfoo',
    description: 'Started building open-source tools for LLM security testing',
    type: 'work',
    link: 'https://promptfoo.dev',
  },
  {
    year: 2022,
    month: 8,
    title: 'Advisor at Foundation Capital',
    description: 'Advising portfolio companies on AI/ML and technical scaling',
    type: 'work',
  },
  {
    year: 2021,
    month: 6,
    title: 'SmileID Acquisition',
    description: 'SmileID acquired after reaching 170M users across Africa',
    type: 'achievement',
    details: ['Built from 0 to 10k QPS', 'Expanded to 8 countries', 'Team grew to 45 engineers'],
  },
  {
    year: 2018,
    month: 9,
    title: 'CTO at SmileID',
    description: 'Led engineering for Africa\'s largest identity verification platform',
    type: 'work',
    details: ['Scaled to 170M users', 'Built ML infrastructure for biometric matching', '99.99% uptime'],
  },
  {
    year: 2018,
    month: 4,
    title: 'EQUiSat Launches to Space',
    description: 'Our nanosatellite launches on SpaceX CRS-14 to the ISS',
    type: 'achievement',
    details: ['2+ years operational lifetime', 'First Brown University satellite', 'Survived -100°C to +60°C'],
    link: 'http://brownspace.org',
  },
  {
    year: 2017,
    month: 2,
    title: 'Joined Arthena',
    description: 'Built ML systems for fine art valuation and investment',
    type: 'work',
    details: ['Computer vision for art authentication', 'Quantitative models for $1.5B valuations'],
  },
  {
    year: 2016,
    month: 6,
    title: 'YCombinator S16',
    description: 'Participated in YC with Arthena, raised $4.5M',
    type: 'achievement',
  },
  {
    year: 2015,
    month: 5,
    title: 'Graduated Brown University',
    description: 'ScB in Computational Neuroscience, Honors in Computer Science',
    type: 'education',
    details: ['Phi Beta Kappa', 'Magna Cum Laude', 'Published 3 research papers'],
  },
  {
    year: 2014,
    month: 8,
    title: 'Co-Founded Space Balloon Project',
    description: 'Launched high-altitude balloons for atmospheric research',
    type: 'project',
    details: ['Reached 100,000 ft altitude', 'Live-streamed from stratosphere', 'Featured in Popular Science'],
  },
  {
    year: 2013,
    month: 6,
    title: 'Intern at SpaceX',
    description: 'Worked on Falcon 9 avionics testing systems',
    type: 'work',
    details: ['Built hardware-in-the-loop test systems', 'Python automation for launch operations'],
  },
  {
    year: 2011,
    month: 9,
    title: 'Started at Brown University',
    description: 'Began journey in neuroscience and computer science',
    type: 'education',
  },
  {
    year: 2008,
    month: 7,
    title: 'Built First Tesla Coil',
    description: 'Designed and built a 1 million volt musical Tesla coil',
    type: 'project',
    details: ['First audio-modulated coil in New England', 'Performed at Maker Faires', 'Age 15'],
  },
  {
    year: 2005,
    month: 3,
    title: 'Started Programming',
    description: 'Wrote first lines of code in BASIC on a TI-83 calculator',
    type: 'life',
    details: ['Built text-based RPG games', 'Learned C++ the next year', 'Never looked back'],
  },
];

export default function TimelinePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      
      const element = timelineRef.current;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      setScrollProgress(progress);

      // Find active year based on scroll position
      const eventElements = element.querySelectorAll('[data-year]');
      let currentYear = null;
      
      eventElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top - element.getBoundingClientRect().top;
        
        if (elementTop <= 200) {
          currentYear = parseInt(el.getAttribute('data-year') || '0');
        }
      });
      
      setActiveYear(currentYear);
    };

    const element = timelineRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const getTypeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'work':
        return 'bg-blue-500';
      case 'education':
        return 'bg-green-500';
      case 'project':
        return 'bg-purple-500';
      case 'life':
        return 'bg-yellow-500';
      case 'achievement':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'work':
        return '💼';
      case 'education':
        return '🎓';
      case 'project':
        return '🚀';
      case 'life':
        return '🌟';
      case 'achievement':
        return '🏆';
      default:
        return '📌';
    }
  };

  const years = [...new Set(timelineEvents.map(e => e.year))].sort((a, b) => b - a);

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16 h-screen flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        <h1 className="text-3xl font-semibold mb-4">Timeline</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          A journey through code, space, and entrepreneurship.
        </p>

        <div className="flex-1 flex gap-8 overflow-hidden">
          {/* Year navigation */}
          <div className="hidden lg:block w-32 space-y-2">
            <div className="sticky top-0">
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => {
                    const element = document.querySelector(`[data-year="${year}"]`);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`block w-full text-left px-3 py-2 rounded transition-all ${
                    activeYear === year
                      ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline content */}
          <div className="flex-1 relative">
            {/* Progress bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700">
              <div
                className="absolute left-0 top-0 w-full bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-150"
                style={{ height: `${scrollProgress}%` }}
              />
            </div>

            {/* Events */}
            <div
              ref={timelineRef}
              className="h-full overflow-y-auto pl-8 pr-4 space-y-8 scrollbar-thin"
            >
              {timelineEvents.map((event, index) => (
                <div
                  key={index}
                  data-year={event.year}
                  className="relative"
                >
                  {/* Dot on timeline */}
                  <div
                    className={`absolute -left-10 top-2 w-4 h-4 rounded-full ${getTypeColor(event.type)} ring-4 ring-white dark:ring-gray-900`}
                  />

                  {/* Event card */}
                  <div className="glass rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{getTypeIcon(event.type)}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.month ? `${new Date(event.year, event.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : event.year}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{event.description}</p>
                    
                    {event.details && (
                      <ul className="space-y-1 mb-3">
                        {event.details.map((detail, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-gray-400 dark:text-gray-600">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                      >
                        Learn more
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Spacer at bottom */}
              <div className="h-32" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Education</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Project</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Achievement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Life</span>
          </div>
        </div>
      </div>
    </main>
  );
}
