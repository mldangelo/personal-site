import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2023: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2023-12-31">December 31, 2023</time>
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
            <p>As 2023 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of transformation and impact.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: SmileID to Promptfoo transition</p>
            <p>This year has been defined by leadership and scale. Looking back at my goals from last year, I'm humbled by how much I still have to learn.</p>
            <h2>Professional Growth</h2>
            <p>Leading engineering at SmileID through the AI revolution has been the challenge of a lifetime.</p>
            <p>This year's highlights:</p>
            <ul>
              <li>Scaled to 170M users</li>
              <li>Mastered distributed systems and ML at scale</li>
              <li>Developed leaders across continents</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>ChatGPT explosion</strong>: Everything changed overnight</li>
              <li><strong>AI safety</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>Prompt engineering</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was ChatGPT explosion, which transformed how I approach problems.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>Even as my career has moved away from space, I remain fascinated: India Moon landing, Starship test flights, Euclid space telescope. Multiple countries landing on the Moon shows how global space has become.</p>
            <p>Less time for astrophotography these days, but I make time for major astronomical events. Every clear night is a reminder to look up.</p>
            <h3>Photography</h3>
            <p>Photography in the age of AI is fascinating - computational photography keeps improving.</p>
            <p>This year's focus:</p>
            <ul>
              <li>Film photography renaissance</li>
              <li>Teaching photography to junior team members</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>wine</strong>: Discovered natural wines and never looked back</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>Japan</strong>: Memorable experiences and new perspectives</li>
              <li><strong>Chile wine regions</strong>: Memorable experiences and new perspectives</li>
              <li><strong>Greek islands</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Even limited travel reminded me of the importance of exploration.</p>
            <h2>Predictions for 2024</h2>
            <p>Looking ahead to 2024, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>AI agents will handle complex tasks</li>
              <li>Quantum computing will solve real problems</li>
              <li>Brain-computer interfaces will show promise</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master AI safety</li>
              <li>Visit Bali</li>
              <li>Deepen kitesurfing</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Establish Promptfoo as the standard for LLM security</li>
              <li>Build sustainable open source business model</li>
              <li>Create lasting impact on AI safety</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2023:</p>
            <ul>
              <li><strong>AI changes faster than organizations can adapt</strong></li>
              <li><strong>Open source creates more value than it captures</strong></li>
              <li><strong>Career transitions get easier with experience</strong></li>
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
            <p>2024 is shaping up to be a year of impact at scale. I'm excited about AI safety and ready for whatever challenges await.</p>
            <p>Here's to closing out 2023 strong and welcoming 2024 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2023? What are you looking forward to in 2024? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
