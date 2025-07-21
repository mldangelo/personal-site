import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2020: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2020-12-31">December 31, 2020</time>
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
            <p>As 2020 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of transformation and impact.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Joined SmileID, pandemic</p>
            <p>This year has been defined by leadership and scale. Looking back at my goals from last year, I'm humbled by how much I still have to learn.</p>
            <h2>Professional Growth</h2>
            <p>Leading engineering at SmileID through a global pandemic has been the challenge of a lifetime.</p>
            <p>This year's highlights:</p>
            <ul>
              <li>Scaled team from 6 to 15</li>
              <li>Mastered distributed systems and ML at scale</li>
              <li>Developed leaders across continents</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>Remote work tools</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>Zoom fatigue</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>ML ops</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was Remote work tools, which transformed how I approach problems.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>Even as my career has moved away from space, I remain fascinated: SpaceX Crew Dragon, Mars 2020 launch, Starlink constellation grows. Private space stations are becoming reality.</p>
            <p>Less time for astrophotography these days, but lockdown actually provided some unexpected stargazing opportunities. The Jupiter-Saturn conjunction was spectacular.</p>
            <h3>Photography</h3>
            <p>Photography in the pandemic meant finding beauty locally.</p>
            <p>This year's focus:</p>
            <ul>
              <li>Macro photography in the backyard</li>
              <li>Virtual photo walks with friends</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>cycling</strong>: Bike commuting changed my perspective on cities</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Well, this was the year travel plans went out the window. But even in lockdown, I found adventures:</p>
            <ul>
              <li><strong>Nowhere (pandemic)</strong>: Discovered hiking trails I had driven past for years</li>
              <li><strong>Local Bay Area exploration</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Even limited travel reminded me of the importance of exploration.</p>
            <h2>Predictions for 2021</h2>
            <p>Looking ahead to 2021, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>Web3 will polarize the tech community</li>
              <li>AI will become accessible to everyone</li>
              <li>Supply chain tech will be critical</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master African markets</li>
              <li>Visit Mexico (remote work)</li>
              <li>Deepen crypto</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Scale engineering team</li>
              <li>Build African tech ecosystem connections</li>
              <li>Master distributed systems at scale</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2020:</p>
            <ul>
              <li><strong>Remote work changes everything about team building</strong></li>
              <li><strong>Crises reveal character</strong></li>
              <li><strong>African tech is massively underestimated</strong></li>
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
            <p>2021 is shaping up to be a year of impact at scale. I'm excited about African markets and ready for whatever challenges await.</p>
            <p>Here's to closing out 2020 strong and welcoming 2021 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2020? What are you looking forward to in 2021? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
