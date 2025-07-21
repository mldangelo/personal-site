import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2022: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2022-12-31">December 31, 2022</time>
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
            <p>As 2022 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of transformation and impact.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: SmileID VP Engineering</p>
            <p>This year has been defined by leadership and scale. Looking back at my goals from last year, I'm pleased with the progress.</p>
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
              <li><strong>AI ethics</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>Distributed teams</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>Platform engineering</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was AI ethics, which transformed how I approach problems.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>Even as my career has moved away from space, I remain fascinated: JWST first images, Artemis I, DART asteroid impact. JWST images exceeded all expectations.</p>
            <p>Less time for astrophotography these days, but I make time for major astronomical events. Every clear night is a reminder to look up.</p>
            <h3>Photography</h3>
            <p>Photography in the age of AI is fascinating - computational photography keeps improving.</p>
            <p>This year's focus:</p>
            <ul>
              <li>Portraits of the team across continents</li>
              <li>Building a proper home studio setup</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>trail running</strong>: Found peace in the mountains</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>Kenya</strong>: The warmth of the people exceeded the beauty of the landscape</li>
              <li><strong>South Africa</strong>: Memorable experiences and new perspectives</li>
              <li><strong>Portugal</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Even limited travel reminded me of the importance of exploration.</p>
            <h2>Predictions for 2023</h2>
            <p>Looking ahead to 2023, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>AI regulation will struggle to keep pace</li>
              <li>Open source AI will challenge big tech</li>
              <li>Space manufacturing will begin</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master LLM security</li>
              <li>Visit Japan</li>
              <li>Deepen sailing</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Prepare for next chapter</li>
              <li>Explore AI/ML opportunities</li>
              <li>Position for next big challenge</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2022:</p>
            <ul>
              <li><strong>Leadership is mostly listening</strong></li>
              <li><strong>Documentation is a gift to your future team</strong></li>
              <li><strong>Burnout is real - prevent it proactively</strong></li>
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
            <p>2023 is shaping up to be a year of impact at scale. I'm excited about LLM security and ready for whatever challenges await.</p>
            <p>Here's to closing out 2022 strong and welcoming 2023 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2022? What are you looking forward to in 2023? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
