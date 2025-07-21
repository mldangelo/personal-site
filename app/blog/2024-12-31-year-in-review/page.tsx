import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2024: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2024-12-31">December 31, 2024</time>
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
            <p>As 2024 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of transformation and impact.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Promptfoo founder</p>
            <p>This year has been defined by leadership and scale. Looking back at my goals from last year, I'm pleased with the progress.</p>
            <h2>Professional Growth</h2>
            <p>Leading Promptfoo through the AI revolution has been the challenge of a lifetime.</p>
            <p>This year's highlights:</p>
            <ul>
              <li>Built security tools used by 125k developers</li>
              <li>Pioneered LLM security testing</li>
              <li>Created an open source community</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>LLM security</strong>: The attack surface is massive and poorly understood</li>
              <li><strong>Open source</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>AI regulation</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was LLM security, which transformed how I approach problems.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>Even as my career has moved away from space, I remain fascinated: Total solar eclipse, Europa Clipper launch, Private space stations. Private space stations are becoming reality.</p>
            <p>Less time for astrophotography these days, but I make time for major astronomical events. Photographing the total solar eclipse was a bucket list item.</p>
            <h3>Photography</h3>
            <p>Photography in the age of AI is fascinating - computational photography keeps improving.</p>
            <p>This year's focus:</p>
            <ul>
              <li>Experimenting with AI-assisted editing</li>
              <li>Teaching photography to junior team members</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>photography</strong>: New hobby that brought balance to life</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>Bali</strong>: Digital nomad paradise is real</li>
              <li><strong>European conference circuit</strong>: Memorable experiences and new perspectives</li>
              <li><strong>Patagonia</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Even limited travel reminded me of the importance of exploration.</p>
            <h2>Predictions for 2025</h2>
            <p>Looking ahead to 2025, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>AGI will remain 5 years away</li>
              <li>Climate tech will show real results</li>
              <li>Space economy will exceed $1 trillion</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Keep learning</li>
              <li>Stay curious</li>
              <li>Build meaningful things</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Take on new challenges</li>
              <li>Learn from failures</li>
              <li>Make meaningful impact</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2024:</p>
            <ul>
              <li><strong>Security is everyones responsibility</strong></li>
              <li><strong>Community building is slow but compounds</strong></li>
              <li><strong>The best time to start was yesterday, second best is now</strong></li>
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
            <p>2025 is shaping up to be a year of impact at scale. I'm excited about the future and ready for whatever challenges await.</p>
            <p>Here's to closing out 2024 strong and welcoming 2025 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2024? What are you looking forward to in 2025? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
