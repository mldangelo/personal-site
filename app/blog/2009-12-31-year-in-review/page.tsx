import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2009: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-12-31">December 31, 2009</time>
              <span>•</span>
              <span>8 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">year-in-review</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">personal</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">reflection</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">predictions</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>As 2009 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of learning and growth.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Freshman at UB</p>
            <p>This year has been defined by academic growth and hands-on projects. Looking back at my goals from last year, I'm pleased with the progress.</p>
            <h2>Professional Growth</h2>
            <p>As a Freshman at UB, I've been deeply immersed in astronomy. The preparation for industry has taught me more than any classroom could.</p>
            <p>Key projects this year:</p>
            <ul>
              <li>Built my first microcontroller projects</li>
              <li>Learned PCB design fundamentals</li>
              <li>Started contributing to Arduino forums</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>Arduino</strong>: Started with blinking LEDs, ended with complex sensor networks</li>
              <li><strong>Linux</strong>: Finally comfortable with the command line - goodbye Windows</li>
              <li><strong>embedded systems</strong>: Understanding interrupts and DMA changed how I think about code</li>
            </ul>
            <p>The most impactful learning was Arduino, which opened new possibilities for my projects.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>This year was incredible for space exploration: 40th anniversary of Apollo 11, Kepler space telescope launch, ISS fully crewed. The 40th anniversary of Apollo 11 reminded me why I got into engineering.</p>
            <p>I've been learning astrophotography with my DSLR. My first Milky Way photo was terrible but magical.</p>
            <h3>Photography</h3>
            <p>Photography remains my creative outlet. This year focused on learning the basics - composition, exposure triangle.</p>
            <p>Favorite shots from this year:</p>
            <ul>
              <li>Lightning strike over Lake Erie during a summer storm</li>
              <li>First successful Milky Way capture</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>electronics</strong>: New hobby that brought balance to life</li>
              <li><strong>photography</strong>: New hobby that brought balance to life</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>Niagara Falls trips</strong>: Still awe-inspiring every time</li>
              <li><strong>Buffalo exploration</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Each trip taught me something new about the world and myself.</p>
            <h2>Predictions for 2010</h2>
            <p>Looking ahead to 2010, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>Mobile apps will dominate software development</li>
              <li>Cloud computing will make hardware less important</li>
              <li>Social networks will change how we communicate</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master satellite design</li>
              <li>Visit NYC visits</li>
              <li>Deepen astrophotography</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Excel in the CubeSat program</li>
              <li>Publish research findings</li>
              <li>Master new technical skills</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2009:</p>
            <ul>
              <li><strong>Foundation matters - the basics you learn early compound</strong></li>
              <li><strong>Asking for help is a strength, not weakness</strong></li>
              <li><strong>Document everything - future you will thank present you</strong></li>
            </ul>
            <h2>Gratitude</h2>
            <p>As always, I'm grateful for:</p>
            <ul>
              <li>The mentors who've guided me</li>
              <li>The team members who've challenged me</li>
              <li>The friends who've supported me</li>
              <li>The opportunities to learn and grow</li>
            </ul>
            <h2>Looking Forward</h2>
            <p>2010 is shaping up to be full of academic challenges. I'm excited about satellite design and ready for whatever challenges await.</p>
            <p>Here's to closing out 2009 strong and welcoming 2010 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2009? What are you looking forward to in 2010? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
