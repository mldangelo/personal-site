import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2013: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2013-12-31">December 31, 2013</time>
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
            <p>As 2013 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of learning and growth.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Facebook internship</p>
            <p>This year has been defined by transitioning from student to professional. Looking back at my goals from last year, I'm humbled by how much I still have to learn.</p>
            <h2>Professional Growth</h2>
            <p>The transition from student to industry has been eye-opening. Working on web performance has shown me what scale really means.</p>
            <p>Major accomplishments:</p>
            <ul>
              <li>Shipped code affecting 1B+ users</li>
              <li>Learned from world-class engineers</li>
              <li>Discovered my passion for performance</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>React development</strong>: Component-based thinking finally clicked</li>
              <li><strong>Big data</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>A/B testing</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was React development, which opened new possibilities for my projects.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>Space exploration continues to inspire: Chris Hadfield ISS videos go viral, Voyager 1 enters interstellar space, India launches Mars mission. Chris Hadfield made space accessible to millions through social media.</p>
            <p>Still doing astrophotography when I can escape the Bay Area light pollution. Found some dark sky sites in the Santa Cruz mountains.</p>
            <h3>Photography</h3>
            <p>Travel photography dominated this year with visits to Yosemite. Still shooting with my trusty Canon DSLR.</p>
            <p>Photography highlights:</p>
            <ul>
              <li>Yosemite firefall phenomenon</li>
              <li>Experimenting with long exposures</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>Bay Area hiking</strong>: New hobby that brought balance to life</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>Yosemite</strong>: El Capitan at sunrise - no words</li>
              <li><strong>Pacific Coast Highway</strong>: Big Sur is the most beautiful drive in America</li>
              <li><strong>Lake Tahoe</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Each trip taught me something new about the world and myself.</p>
            <h2>Predictions for 2014</h2>
            <p>Looking ahead to 2014, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>Machine learning will move from research to production</li>
              <li>Virtual reality will finally have its moment</li>
              <li>Messaging apps will become platforms</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master machine learning</li>
              <li>Visit Patagonia trek</li>
              <li>Deepen satellite imagery</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Excel in graduate coursework</li>
              <li>Build Silicon Valley network</li>
              <li>Learn from the best engineers</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2013:</p>
            <ul>
              <li><strong>Scale thinking changes everything</strong></li>
              <li><strong>Performance optimization is never done</strong></li>
              <li><strong>Learning from experts accelerates growth</strong></li>
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
            <p>2014 is shaping up to be a career-defining period. I'm excited about machine learning and ready for whatever challenges await.</p>
            <p>Here's to closing out 2013 strong and welcoming 2014 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2013? What are you looking forward to in 2014? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
