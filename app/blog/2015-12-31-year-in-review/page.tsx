import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">2015: Year in Review</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2015-12-31">December 31, 2015</time>
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
            <p>As 2015 comes to a close, it\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of learning and growth.</p>
            <h2>The Year in Summary</h2>
            <p><strong>Status</strong>: Stanford MS second year</p>
            <p>This year has been defined by transitioning from student to professional. Looking back at my goals from last year, I'm pleased with the progress.</p>
            <h2>Professional Growth</h2>
            <p>The transition from industry to graduate school has been intellectually stimulating. Working on ML research has shown me the cutting edge of technology.</p>
            <p>Major accomplishments:</p>
            <ul>
              <li>Completed advanced ML coursework</li>
              <li>Built deep learning models from scratch</li>
              <li>Prepared to start my own company</li>
            </ul>
            <h2>Technical Learning</h2>
            <p>This year's technical exploration focused on:</p>
            <ul>
              <li><strong>TensorFlow</strong>: Democratizing ML, but the API could be better</li>
              <li><strong>GPU programming</strong>: Game-changing technology that shaped my work this year</li>
              <li><strong>Container orchestration</strong>: Game-changing technology that shaped my work this year</li>
            </ul>
            <p>The most impactful learning was TensorFlow, which opened new possibilities for my projects.</p>
            <h2>Personal Interests & Hobbies</h2>
            <h3>Space & Astronomy</h3>
            <p>Space exploration continues to inspire: Pluto flyby, Water on Mars confirmed, SpaceX landing attempts. The Pluto flyby images were breathtaking - we are exploring the entire solar system.</p>
            <p>Still doing astrophotography when I can escape the Stanford workload. Iceland northern lights were a photographer dream.</p>
            <h3>Photography</h3>
            <p>Travel photography dominated this year with visits to Japan (Tokyo, Kyoto). Still shooting with my trusty Canon DSLR.</p>
            <p>Photography highlights:</p>
            <ul>
              <li>Northern lights in Iceland</li>
              <li>Experimenting with long exposures</li>
            </ul>
            <h3>Other Pursuits</h3>
            <ul>
              <li><strong>trail running</strong>: Found peace in the mountains</li>
            </ul>
            <h2>Travel & Experiences</h2>
            <p>Travel continues to be a source of inspiration and perspective:</p>
            <ul>
              <li><strong>Japan (Tokyo, Kyoto)</strong>: The perfect blend of future and tradition</li>
              <li><strong>Iceland northern lights</strong>: Photographing aurora while standing on a glacier</li>
              <li><strong>Burning Man</strong>: Memorable experiences and new perspectives</li>
            </ul>
            <p>Each trip taught me something new about the world and myself.</p>
            <h2>Predictions for 2016</h2>
            <p>Looking ahead to 2016, here are my predictions:</p>
            <h3>Technology Trends</h3>
            <ul>
              <li>AI assistants will be everywhere</li>
              <li>Augmented reality will beat VR for daily use</li>
              <li>Serverless will change how we build apps</li>
            </ul>
            <h3>Personal Goals</h3>
            <ul>
              <li>Master art markets</li>
              <li>Visit Art Basel</li>
              <li>Deepen quantitative finance</li>
            </ul>
            <h3>Professional Aspirations</h3>
            <ul>
              <li>Get Arthena to product-market fit</li>
              <li>Build world-class team and culture</li>
              <li>Establish Arthena as category leader</li>
            </ul>
            <h2>Lessons Learned</h2>
            <p>The biggest lessons from 2015:</p>
            <ul>
              <li><strong>Deep expertise beats shallow knowledge</strong></li>
              <li><strong>Research requires patience and persistence</strong></li>
              <li><strong>Travel broadens technical perspective</strong></li>
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
            <p>2016 is shaping up to be an entrepreneurial adventure. I'm excited about art markets and ready for whatever challenges await.</p>
            <p>Here's to closing out 2015 strong and welcoming 2016 with open arms. See you next year!</p>
            <p><em>What were your highlights from 2015? What are you looking forward to in 2016? I would love to hear your thoughts.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
