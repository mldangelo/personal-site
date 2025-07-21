import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2014: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2014-12-31">December 31, 2014</time>
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
            <p>As 2014 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of learning and growth.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Started Stanford MS, Planet Labs</p>
            <p>This year has been defined by transitioning from student to professional. Looking back at my goals from last year, I'm pleased with the progress.</p>
            <h2>Professional Growth</h2>
            <p>The transition from industry to graduate school has been intellectually stimulating. Working on machine learning has shown me the cutting edge of technology.</p>
            <p>Major accomplishments:</p>
            <ul>
              <li>Started MS at Stanford</li>
              <li>Worked on real satellites at Planet</li>
              <li>Found the intersection of space and ML</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>Deep learning</strong>: The math is beautiful when you understand it</li>
              <li><strong>Computer vision</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>Distributed systems</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was Deep learning, which opened new possibilities for my projects.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>Space exploration continues to inspire: Rosetta arrives at comet, Orion test flight, Planet Labs Flock-1 launch. Working at Planet Labs puts me directly in the NewSpace movement.</p>
            <p>Still doing astrophotography when I can escape the Stanford workload. The Perseid meteor shower from Yosemite was unforgettable.</p>
            <h3>Photography</h3>
            <p>Travel photography dominated this year with visits to Patagonia trek. Still shooting with my trusty Canon DSLR.</p>
            <p>Photography highlights:</p>
            <ul>
              <li>Patagonian landscapes pushed my skills</li>
              <li>Experimenting with long exposures</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>cycling</strong>: Bike commuting changed my perspective on cities</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>Patagonia trek</strong>: Torres del Paine challenged every limit</li>
              <li><strong>Seattle/Portland</strong>: Memorable experiences and new perspectives</li>
              <li><strong>Hawaii</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Each trip taught me something new about the world and myself.</p>
            <h2>Predictions for 2015</h2>
            <p>Looking ahead to 2015, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>Deep learning will solve previously impossible problems</li>
              <li>Blockchain will find uses beyond cryptocurrency</li>
              <li>Edge computing will become necessary</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master ML research</li>
              <li>Visit Japan (Tokyo, Kyoto)</li>
              <li>Deepen landscape photography</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Complete MS thesis</li>
              <li>Raise funding successfully</li>
              <li>Build a great team</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2014:</p>
            <ul>
              <li><strong>Academic knowledge plus industry experience is powerful</strong></li>
              <li><strong>Side projects keep creativity alive</strong></li>
              <li><strong>Geographic location still matters in tech</strong></li>
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
            <p>2015 is shaping up to be a career-defining period. I'm excited about ML research and ready for whatever challenges await.</p>
            <p>Here's to closing out 2014 strong and welcoming 2015 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2014? What are you looking forward to in 2015? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
