import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2012: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2012-12-31">December 31, 2012</time>
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
            <p>As 2012 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of learning and growth.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Senior year, interviewing</p>
            <p>This year has been defined by academic growth and hands-on projects. Looking back at my goals from last year, I'm pleased with the progress.</p>
            <h2>Professional Growth</h2>
            <p>As a Senior year, interviewing, I've been deeply immersed in startups. The preparation for industry has taught me more than any classroom could.</p>
            <p>Key projects this year:</p>
            <ul>
              <li>Completed senior design project</li>
              <li>Interviewed at top tech companies</li>
              <li>Graduated summa cum laude</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>Node.js</strong>: JavaScript on the server still feels weird but powerful</li>
              <li><strong>JavaScript frameworks</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>Cloud computing</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was Node.js, which opened new possibilities for my projects.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>This year was incredible for space exploration: Curiosity lands on Mars, SpaceX Dragon to ISS, Transit of Venus. Curiosity landing on Mars while we work on our own spacecraft is surreal.</p>
            <p>I've been capturing star trails and ISS passes. Photographed the transit of Venus - once in a lifetime event.</p>
            <h3>Photography</h3>
            <p>Photography remains my creative outlet. This year focused on creating a portfolio for the next chapter.</p>
            <p>Favorite shots from this year:</p>
            <ul>
              <li>Graduation day golden hour portraits</li>
              <li>Architecture series of campus buildings</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>photography</strong>: New hobby that brought balance to life</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>SF Bay Area for interviews</strong>: Memorable experiences and new perspectives</li>
              <li><strong>Graduation trip planning</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Each trip taught me something new about the world and myself.</p>
            <h2>Predictions for 2013</h2>
            <p>Looking ahead to 2013, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>Wearable computing will go mainstream</li>
              <li>Bitcoin will either die or change finance</li>
              <li>Docker will make deployment trivial</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master web performance</li>
              <li>Visit Yosemite</li>
              <li>Deepen photography</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Make meaningful impact at Facebook</li>
              <li>Build Silicon Valley network</li>
              <li>Learn from the best engineers</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2012:</p>
            <ul>
              <li><strong>Career pivots require courage but open doors</strong></li>
              <li><strong>Network effects apply to relationships too</strong></li>
              <li><strong>Finishing strong matters more than starting perfectly</strong></li>
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
            <p>2013 is shaping up to be a career-defining period. I'm excited about web performance and ready for whatever challenges await.</p>
            <p>Here's to closing out 2012 strong and welcoming 2013 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2012? What are you looking forward to in 2013? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
