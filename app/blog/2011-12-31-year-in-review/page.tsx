import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2011: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2011-12-31">December 31, 2011</time>
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
            <p>As 2011 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of learning and growth.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Junior, CubeSat hardware lead</p>
            <p>This year has been defined by academic growth and hands-on projects. Looking back at my goals from last year, I'm pleased with the progress.</p>
            <h2>Professional Growth</h2>
            <p>As a Junior, CubeSat hardware lead, I've been deeply immersed in space systems. The responsibility of leading hardware development has taught me more than any classroom could.</p>
            <p>Key projects this year:</p>
            <ul>
              <li>Led thermal vacuum testing campaigns</li>
              <li>Managed a team of 5 engineers</li>
              <li>Published preliminary satellite test results</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>Real-time systems</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>Power electronics</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>Git mastery</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was Real-time systems, which opened new possibilities for my projects.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>This year was incredible for space exploration: Last Space Shuttle flight, Juno launched to Jupiter, Dawn arrives at Vesta. Watching the final shuttle launch was bittersweet - end of an era, but exciting new companies emerging.</p>
            <p>I've been capturing star trails and ISS passes. Built an Arduino-powered star tracker.</p>
            <h3>Photography</h3>
            <p>Photography remains my creative outlet. This year focused on documenting our satellite build process.</p>
            <p>Favorite shots from this year:</p>
            <ul>
              <li>Time-lapse of our clean room assembly</li>
              <li>Macro shots of satellite components</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>running</strong>: Completed my first half marathon</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>Boston for conferences</strong>: Memorable experiences and new perspectives</li>
              <li><strong>Adirondacks hiking</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Each trip taught me something new about the world and myself.</p>
            <h2>Predictions for 2012</h2>
            <p>Looking ahead to 2012, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>Big data will be the new oil</li>
              <li>Mobile-first design will become standard</li>
              <li>MOOCs will disrupt traditional education</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master startups</li>
              <li>Visit SF Bay Area for interviews</li>
              <li>Deepen web development</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Land a great job</li>
              <li>Build strong industry connections</li>
              <li>Prepare for industry transition</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2011:</p>
            <ul>
              <li><strong>Leadership is about enabling others to succeed</strong></li>
              <li><strong>Testing in realistic conditions reveals truth</strong></li>
              <li><strong>Simple solutions often beat complex ones</strong></li>
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
            <p>2012 is shaping up to be full of academic challenges. I'm excited about startups and ready for whatever challenges await.</p>
            <p>Here's to closing out 2011 strong and welcoming 2012 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2011? What are you looking forward to in 2012? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
