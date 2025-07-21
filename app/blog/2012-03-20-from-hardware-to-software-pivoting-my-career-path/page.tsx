import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">From Hardware to Software: Pivoting My Career Path</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2012-03-20">March 19, 2012</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">career</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">personal</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">software</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">hardware</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>With graduation approaching in May, I've made a decision that surprises even me - I'm primarily interviewing for software engineering roles. After three years of circuits, satellites, and embedded systems, why the pivot?</p>
            <h2>The Realization</h2>
            <p>It hit me during our last CubeSat design review. We spent two hours debugging a power distribution issue. The hardware fix? Change a resistor value. Time to implement: 2 days (redesign PCB, order boards, assemble, test).</p>
            <p>Meanwhile, our software team pushed three feature updates in the same period.</p>
            <p>This isn't a criticism of hardware - it's just different. But it made me think about the kind of impact I want to have and the pace at which I want to work.</p>
            <h2>What I\'ve Learned From Hardware</h2>
            <p>My EE background isn't wasted. Hardware taught me things that many pure CS grads miss:</p>
            <h3>1. Constraints Matter</h3>
            <p>When you have 2KB of RAM and 16MHz to work with, you learn to write efficient code. No framework bloat, no abstraction for abstraction's sake.</p>
            <h3>2. Debugging Discipline</h3>
            <p>Hardware debugging is methodical - check power, check ground, verify signals. This systematic approach transfers directly to software debugging.</p>
            <h3>3. Systems Thinking</h3>
            <p>Understanding the full stack from electrons to applications gives perspective. I know why race conditions happen at the transistor level.</p>
            <h3>4. Reliability Engineering</h3>
            <p>When your code runs on a satellite, "it works on my machine" isn't good enough. Hardware taught me to think about edge cases and failure modes.</p>
            <h2>Why Software Appeals to Me</h2>
            <p>Beyond the practical considerations (more jobs, often better pay), software offers things that excite me:</p>
            <h3>Iteration Speed</h3>
            <p>Deploy multiple times per day vs. waiting weeks for new boards. The feedback loop in software is intoxicating.</p>
            <h3>Scale</h3>
            <p>Code I write can be used by millions instantly. Hardware requires manufacturing, distribution, logistics.</p>
            <h3>Flexibility</h3>
            <p>Software can be updated after deployment. Hardware mistakes are often permanent (ask me about the resistor we had to hand-solder on 50 boards).</p>
            <h3>Lower Barriers</h3>
            <p>Starting a software project requires a laptop. Starting a hardware project requires labs, equipment, components, and capital.</p>
            <h2>The Interview Process</h2>
            <p>Interviewing for software roles with an EE degree is interesting:</p>
            <h3>What Helps</h3>
            <ul>
              <li>Strong math background (algorithms come naturally)</li>
            </ul>
            <p>            - C/C++ experience from embedded work</p>
            <p>            - Understanding of computer architecture</p>
            <p>            - Unique perspective on problems</p>
            <p>            ### What's Challenging</p>
            <ul>
              <li>Less web development experience</li>
            </ul>
            <p>            - Fewer large-scale software projects</p>
            <p>            - Need to prove coding ability more</p>
            <p>            - Some recruiters are confused by my background</p>
            <p>            ## Preparing the Pivot</p>
            <p>I'm not going in unprepared:</p>
            <h3>Building Software Portfolio</h3>
            <ul>
              <li>Contributing to open source projects</li>
            </ul>
            <p>            - Built a web dashboard for our satellite telemetry</p>
            <p>            - Personal projects in Python and JavaScript</p>
            <p>            - Learning modern frameworks (currently diving into Node.js)</p>
            <p>            ### Leveraging Unique Experience</p>
            <ul>
              <li>Emphasizing embedded software work</li>
            </ul>
            <p>            - Highlighting resource-constrained optimization</p>
            <p>            - Discussing reliability and testing practices</p>
            <p>            - Connecting hardware knowledge to software problems</p>
            <p>            ### Target Roles</p>
            <p>I'm focusing on positions where hardware background helps:</p>
            <ul>
              <li>Backend systems (closer to the metal)</li>
            </ul>
            <p>            - Performance engineering</p>
            <p>            - Developer tools</p>
            <p>            - IoT/embedded software</p>
            <p>            - Infrastructure/DevOps</p>
            <p>            ## Interview Experiences So Far</p>
            <p>Had a few interesting interviews:</p>
            <h3>Facebook (returning intern conversion)</h3>
            <p>My internship on the Web Performance team helps here. They value my understanding of how software interacts with hardware for performance optimization.</p>
            <h3>Google (Software Engineer, University Grad)</h3>
            <p>Standard algorithm interviews. EE background helped with bit manipulation and system design questions.</p>
            <h3>Small Startup (Full Stack)</h3>
            <p>They were intrigued by my satellite work. Ended up discussing how embedded systems principles apply to building reliable web services.</p>
            <h2>Concerns and Doubts</h2>
            <p>I'd be lying if I said I had no doubts:</p>
            <ul>
              <li>Am I abandoning hardware just as IoT is exploding?</li>
            </ul>
            <p>            - Will I regret not using my specialized knowledge?</p>
            <p>            - Am I choosing the "easy" path?</p>
            <p>            But I think the future is increasingly about hardware-software integration. Understanding both sides will be valuable.</p>
            <h2>The Bigger Picture</h2>
            <p>This isn't really hardware vs. software. It's about finding where I can have the most impact. Right now, that feels like software. But my hardware background isn't going away - it's a differentiator.</p>
            <p>Maybe I'll build dev tools for hardware engineers. Maybe I'll work on software for autonomous vehicles. Maybe I'll join a company like SpaceX where software meets rockets.</p>
            <p>The point is: skills compound. Everything I learned building satellites makes me a better software engineer.</p>
            <h2>Advice for Others</h2>
            <p>If you're considering a similar pivot:</p>
            <ul>
              <li>**Start early** - Build software projects alongside hardware work</li>
            </ul>
            <ul>
              <li>**Find the intersection** - Look for roles that value both skillsets</li>
            </ul>
            <ul>
              <li>**Tell your story** - Explain why your background is an asset</li>
            </ul>
            <ul>
              <li>**Stay curious** - The best engineers understand multiple domains</li>
            </ul>
            <ul>
              <li>**Don\'t apologize** - Different perspective is valuable</li>
            </ul>
            <h2>Looking Forward</h2>
            <p>In 10 years, I doubt the distinction between hardware and software engineers will be as clear. Products increasingly require both. Tesla needs software engineers who understand motors. Apple needs hardware engineers who can code.</p>
            <p>I'm not abandoning hardware - I'm adding software to my toolkit. The future belongs to engineers who can work across the stack.</p>
            <p>Now if you'll excuse me, I have some LeetCode problems to practice. Turns out inverting a binary tree is easier than designing a power supply, but recruiters seem to care more about the former!</p>
            <p>*Update: Accepted an offer from [REDACTED] starting in July. Excited to start this new chapter!*</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
