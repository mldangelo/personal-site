import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2010: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2010-12-31">December 31, 2010</time>
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
            <p>As 2010 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of learning and growth.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Sophomore, joined CubeSat program</p>
            <p>This year has been defined by academic growth and hands-on projects. Looking back at my goals from last year, I'm pleased with the progress.</p>
            <h2>Professional Growth</h2>
            <p>As a Sophomore, joined CubeSat program, I've been deeply immersed in satellite design. The CubeSat program has been transformative has taught me more than any classroom could.</p>
            <p>Key projects this year:</p>
            <ul>
              <li>Designed power systems for our satellite</li>
              <li>Implemented MPPT algorithms</li>
              <li>Presented at regional conferences</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>Android development</strong>: Built my first app - a satellite tracker</li>
              <li><strong>FPGA programming</strong>: Parallel thinking is a different paradigm entirely</li>
              <li><strong>PCB design</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was Android development, which opened new possibilities for my projects.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>This year was incredible for space exploration: SpaceX Falcon 9 first flight, Hayabusa returns from asteroid, Discovery of potentially habitable exoplanets. Working on our CubeSat while SpaceX achieved their first successes was inspiring.</p>
            <p>I've been learning astrophotography with my DSLR. Finally got a decent shot of Saturn through a borrowed telescope.</p>
            <h3>Photography</h3>
            <p>Photography remains my creative outlet. This year focused on landscape and night photography.</p>
            <p>Favorite shots from this year:</p>
            <ul>
              <li>Star trails over the engineering building</li>
              <li>ISS transit across the moon</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>robotics</strong>: Built a self-balancing robot that actually balances</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>NYC visits</strong>: The energy is infectious</li>
              <li><strong>Rochester tech meetups</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Each trip taught me something new about the world and myself.</p>
            <h2>Predictions for 2011</h2>
            <p>Looking ahead to 2011, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>Tablets will replace laptops for content consumption</li>
              <li>JavaScript will become a serious language</li>
              <li>Private space companies will challenge NASA</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master space systems</li>
              <li>Visit Boston for conferences</li>
              <li>Deepen photography</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Lead successful satellite testing</li>
              <li>Publish research findings</li>
              <li>Master new technical skills</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2010:</p>
            <ul>
              <li><strong>Real projects teach more than perfect grades</strong></li>
              <li><strong>Team dynamics matter as much as technical skills</strong></li>
              <li><strong>Hardware failures teach humility and preparation</strong></li>
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
            <p>2011 is shaping up to be full of academic challenges. I'm excited about space systems and ready for whatever challenges await.</p>
            <p>Here's to closing out 2010 strong and welcoming 2011 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2010? What are you looking forward to in 2011? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
