import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Graduating Summa Cum Laude: Lessons from Four Years of Engineering</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2012-05-10">May 9, 2012</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">personal</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">graduation</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">reflection</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">career</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Today I graduate from University at Buffalo with a BS in Electrical and Computer Engineering, summa cum laude. As I sit here in my cap and gown, waiting for the ceremony to start, I'm reflecting on what these four years taught me - both in and out of the classroom.</p>
            <h2>The Numbers Game</h2>
            <p>Let's get the stats out of the way:</p>
            <ul>
              <li>GPA: 3.96/4.0</li>
            </ul>
            <p>            - Credit hours: 142 (required: 128)</p>
            <p>            - All-nighters: Lost count after 50</p>
            <p>            - Cups of coffee: Approaching 4 figures</p>
            <p>            - Resistors burned: At least a dozen</p>
            <p>            - Satellites built: 1 (almost ready to fly!)</p>
            <p>            But numbers don't tell the real story.</p>
            <h2>What Actually Mattered</h2>
            <h3>1. Projects &gt; Grades</h3>
            <p>My most valuable learning came from projects, not perfect test scores. The CubeSat taught me more about engineering than any class. Building real things with real constraints forces you to truly understand concepts.</p>
            <p>Nobody will ask about my Signals & Systems grade. But "I built satellite power systems" opens doors.</p>
            <h3>2. Breadth Beats Depth (At First)</h3>
            <p>I took classes outside my requirements:</p>
            <ul>
              <li>Computer graphics</li>
            </ul>
            <p>            - Machine learning (before it was cool)</p>
            <p>            - Entrepreneurship</p>
            <p>            - Technical writing</p>
            <p>            Each broadened my perspective. Specialization can come later; undergrad is for exploring.</p>
            <h3>3. Professors Are People</h3>
            <p>Office hours were goldmines. Professors shared:</p>
            <ul>
              <li>Industry war stories</li>
            </ul>
            <p>            - Research opportunities</p>
            <p>            - Career advice</p>
            <p>            - Life wisdom</p>
            <p>            The best mentorship happened in conversations, not lectures.</p>
            <h3>4. Failure Is Educational</h3>
            <p>My biggest failures taught the most:</p>
            <ul>
              <li>First PCB design: Completely wrong footprints</li>
            </ul>
            <p>            - Robotics competition: Robot caught fire (literally)</p>
            <p>            - First internship interview: Bombed spectacularly</p>
            <p>            - Power supply project: Blew up expensive components</p>
            <p>            Each failure taught lessons no textbook could.</p>
            <h2>The Non-Technical Education</h2>
            <p>Engineering school taught more than equations:</p>
            <h3>Time Management</h3>
            <p>Juggling classes, projects, leadership roles, and (occasionally) sleep forced extreme prioritization. I learned:</p>
            <ul>
              <li>Perfect is the enemy of done</li>
            </ul>
            <p>            - Pareto principle is real (80/20 rule)</p>
            <p>            - Sometimes B+ work on time beats A+ work late</p>
            <p>            ### Communication</p>
            <p>Engineers who can't communicate their ideas are severely limited. I forced myself to:</p>
            <ul>
              <li>Present at conferences</li>
            </ul>
            <p>            - Write documentation</p>
            <p>            - Explain technical concepts to non-engineers</p>
            <p>            - Lead team meetings</p>
            <p>            These skills matter as much as technical knowledge.</p>
            <h3>Collaboration</h3>
            <p>The lone genius myth is toxic. Real engineering happens in teams:</p>
            <ul>
              <li>CubeSat: 20+ people across disciplines</li>
            </ul>
            <p>            - Group projects: Learning to work with different styles</p>
            <p>            - Open source: Contributing to larger communities</p>
            <p>            Learning to work with others multiplies your impact.</p>
            <h2>Regrets and Mistakes</h2>
            <p>I'd be dishonest not to mention regrets:</p>
            <h3>1. Not Enough Balance</h3>
            <p>I optimized for achievement over experience. Missed parties, skipped social events, lived in the lab. Some of that was necessary, but not all.</p>
            <h3>2. Imposter Syndrome</h3>
            <p>Spent too much energy proving I belonged instead of learning. Everyone feels inadequate sometimes - that's normal.</p>
            <h3>3. Not Enough Risk</h3>
            <p>Played it safe with some course selections. Should have taken more graduate courses or explored further outside engineering.</p>
            <h3>4. Health Neglect</h3>
            <p>All-nighters and energy drinks aren't sustainable. Your brain works better with sleep and exercise - learned this the hard way.</p>
            <h2>Surprises Along the Way</h2>
            <h3>Hardware to Software</h3>
            <p>Started convinced I'd design circuits forever. Ending up taking a software job. Paths aren't linear.</p>
            <h3>Theory Matters Eventually</h3>
            <p>Cursed through differential equations and linear algebra. Now use concepts from both regularly. Foundation matters even if applications aren't obvious.</p>
            <h3>Network Effects</h3>
            <p>The random freshman I helped with homework became a great friend and project partner. Kindness compounds.</p>
            <h3>Passion Projects Win</h3>
            <p>My "fun" projects (contributing to Arduino libraries, building a weather station) came up in every interview. Genuine enthusiasm is obvious.</p>
            <h2>Advice for Future Engineers</h2>
            <p>If I could tell freshman me anything:</p>
            <ul>
              <li>**Start projects early** - Don\'t wait for senior year</li>
            </ul>
            <ul>
              <li>**Document everything** - Future you will thank present you</li>
            </ul>
            <ul>
              <li>**Join communities** - Online and offline</li>
            </ul>
            <ul>
              <li>**Teach others** - Best way to solidify knowledge</li>
            </ul>
            <ul>
              <li>**Take breaks** - Burnout is real and counterproductive</li>
            </ul>
            <ul>
              <li>**Be kind** - Engineering is a small world</li>
            </ul>
            <ul>
              <li>**Stay curious** - The learning never stops</li>
            </ul>
            <h2>What\'s Next</h2>
            <p>Starting at [REDACTED] in July doing software engineering. Also planning to:</p>
            <ul>
              <li>Continue with open source</li>
            </ul>
            <p>            - Maybe start a master's part-time</p>
            <p>            - Keep building things</p>
            <p>            - Watch GLADOS launch (fingers crossed for 2013!)</p>
            <p>            ## The Real Achievement</p>
            <p>Summa cum laude is nice, but the real achievements are:</p>
            <ul>
              <li>Friendships that will last decades</li>
            </ul>
            <p>            - Mentors who changed my trajectory  </p>
            <p>            - Confidence to tackle hard problems</p>
            <p>            - Knowledge that I can learn anything</p>
            <p>            - A network of brilliant people</p>
            <p>            - Stories that start with "Remember when we..."</p>
            <p>            ## Final Thoughts</p>
            <p>Four years ago, I was a nervous freshman who had never used an oscilloscope. Today, I'm... still nervous, but about different things. That's growth.</p>
            <p>Engineering school is transformative not because it teaches you everything, but because it teaches you how to learn anything. The degree is just paper. The education is what happens between the classes.</p>
            <p>To my classmates: We survived thermodynamics, signals & systems, and group projects from hell. We're ready for anything.</p>
            <p>To my professors: Thank you for your patience with our questions and your passion for the subjects.</p>
            <p>To my family: Thanks for pretending to understand when I excitedly explained my projects.</p>
            <p>To future engineers: The journey is hard but worth it. Build things. Break things. Learn things. repeat.</p>
            <p>Now, time to walk across that stage and officially become an engineer. Then probably take a very long nap.</p>
            <p>*Here's to the next chapter! 🎓*</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
