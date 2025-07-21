import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2019: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2019-12-31">December 31, 2019</time>
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
            <p>As 2019 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of building and scaling.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Arthena established</p>
            <p>This year has been defined by entrepreneurial challenges. Looking back at my goals from last year, I'm humbled by how much I still have to learn.</p>
            <h2>Professional Growth</h2>
            <p>Leading Arthena through rapid growth has been the challenge of a lifetime.</p>
            <p>This year's highlights:</p>
            <ul>
              <li>Grew to millions in revenue</li>
              <li>Learned about art markets and quantitative finance</li>
              <li>Built an incredible team and culture</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>JAMstack</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>WebAssembly</strong>: Bringing systems programming to the web</li>
              <li><strong>Privacy tech</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was JAMstack, which transformed how I approach problems.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>Even as my career has moved away from space, I remain fascinated: First black hole image, Starship prototype, Chandrayaan-2 Moon mission. The commercialization of space is accelerating faster than I predicted.</p>
            <p>Less time for astrophotography these days, but I still catch major events. Every clear night is a reminder to look up.</p>
            <h3>Photography</h3>
            <p>Travel photography dominated this year with visits to Maldives. Switched to mirrorless for the weight savings.</p>
            <p>Photography highlights:</p>
            <ul>
              <li>African wildlife required learning patience</li>
              <li>Started selling prints for charity</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>photography</strong>: New hobby that brought balance to life</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>Maldives</strong>: Memorable experiences and new perspectives</li>
              <li><strong>New Zealand</strong>: Memorable experiences and new perspectives</li>
              <li><strong>Alaska</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Each trip taught me something new about the world and myself.</p>
            <h2>Predictions for 2020</h2>
            <p>Looking ahead to 2020, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>Video conferencing will become primary communication</li>
              <li>E-commerce will accelerate 10 years in 1</li>
              <li>Biotech will have its moment</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master African tech</li>
              <li>Visit Nowhere (pandemic)</li>
              <li>Deepen home cooking</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Successfully transition to SmileID</li>
              <li>Build African tech ecosystem connections</li>
              <li>Master distributed systems at scale</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2019:</p>
            <ul>
              <li><strong>Market timing matters more than perfect execution</strong></li>
              <li><strong>Work-life balance is a daily choice</strong></li>
              <li><strong>Success brings its own challenges</strong></li>
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
            <p>2020 is shaping up to be a year of impact at scale. I'm excited about African tech and ready for whatever challenges await.</p>
            <p>Here's to closing out 2019 strong and welcoming 2020 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2019? What are you looking forward to in 2020? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
