import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">First Week at Facebook: From 20 to 1 Billion Users</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2013-06-15">June 14, 2013</time>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">facebook</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">internship</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">career</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">web-performance</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Just finished my first week as a software engineering intern at Facebook, and my mind is thoroughly blown. The scale difference between my university projects and Facebook's systems is like comparing a paper airplane to a Boeing 747.</p>
            <h2>The Numbers That Broke My Brain</h2>
            <p>During orientation, they shared some statistics:</p>
            <ul>
              <li>1.1 billion monthly active users</li>
            </ul>
            <p>            - 665 million daily active users</p>
            <p>            - 751 million mobile users</p>
            <p>            - Photos uploaded daily: 350 million</p>
            <p>            - Likes and comments daily: 4.5 billion</p>
            <p>            When your code ships here, it immediately impacts more people than live in most countries. No pressure, right?</p>
            <h2>My Team: Web Performance</h2>
            <p>I'm on the Web Performance team, which is perfect given my hardware background. We're responsible for making Facebook fast globally. This means:</p>
            <ul>
              <li>Optimizing JavaScript bundles</li>
            </ul>
            <p>            - Reducing server response times</p>
            <p>            - Improving client-side rendering</p>
            <p>            - Minimizing network requests</p>
            <p>            - Fighting latency at every level</p>
            <p>            My manager said something that stuck: "If we save 1ms of load time, that's 1.1 billion milliseconds saved daily - about 13 days of human time. Per day."</p>
            <h2>Culture Shock</h2>
            <p>Coming from university, the culture here is intense:</p>
            <h3>Move Fast and Break Things</h3>
            <p>This isn't just a poster - it's how work happens. My code could be in production by week 2. In university, we spent weeks planning. Here, we ship and iterate.</p>
            <h3>The Bootcamp</h3>
            <p>Every engineer goes through 6 weeks of bootcamp. You work on real tasks for different teams before choosing your permanent team. It's like speed dating for code.</p>
            <h3>Code Reviews Are Intense</h3>
            <p>Submitted my first diff (Facebook's term for pull request). Got 47 comments. In university, peer reviews were "looks good to me!" Here, people care about every line.</p>
            <h3>The Tools</h3>
            <p>The internal tools are insane:</p>
            <ul>
              <li>**Phabricator**: Code review on steroids</li>
            </ul>
            <p>            - <strong>Hip Hop Virtual Machine (HHVM)</strong>: Custom PHP runtime that's incredibly fast</p>
            <p>            - <strong>Scuba</strong>: Real-time data analysis of literally everything</p>
            <p>            - <strong>Mercurial</strong>: Because Git doesn't scale to Facebook's repo size</p>
            <p>            ## My First Task</p>
            <p>They don't ease you in. My first task: optimize the JavaScript loading for Photos. Current state: 2.3MB of JS. Goal: Under 1.5MB without losing functionality.</p>
            <p>Approaches I'm exploring:</p>
            <ul>
              <li>Code splitting (load only what\'s needed)</li>
            </ul>
            <p>            - Dead code elimination</p>
            <p>            - Better minification</p>
            <p>            - Lazy loading non-critical features</p>
            <p>            - Moving to more efficient data structures</p>
            <p>            The tricky part? Can't break anything for 1.1 billion users. No big deal.</p>
            <h2>Technical Revelations</h2>
            <h3>Scale Changes Everything</h3>
            <p>Algorithms that work for thousands of users fail spectacularly at billions. O(n log n) vs O(n²) matters when n is huge.</p>
            <p>Example: Someone suggested iterating through friends-of-friends for a feature. Sounds reasonable until you realize some users have 5000 friends. That's potentially 25 million checks per user.</p>
            <h3>Microseconds Matter</h3>
            <p>In university, we worried about milliseconds. Here, we profile microseconds. Why? Because when you serve billions of requests, microseconds add up to real money and user impact.</p>
            <h3>Complexity Has Costs</h3>
            <p>Every feature has:</p>
            <ul>
              <li>Performance cost (CPU, memory, network)</li>
            </ul>
            <p>            - Maintenance cost (who fixes it when it breaks?)</p>
            <p>            - Complexity cost (how does it interact with everything else?)</p>
            <p>            Features that seemed obvious in my projects are contentious here because of these hidden costs.</p>
            <h2>The Hardware Connection</h2>
            <p>My EE background is surprisingly relevant:</p>
            <ul>
              <li>Understanding CPU caches helps optimize hot code paths</li>
            </ul>
            <p>            - Knowledge of network protocols aids in reducing latency</p>
            <p>            - Power efficiency (from embedded work) translates to server efficiency</p>
            <p>            - Hardware debugging skills transfer to distributed system debugging</p>
            <p>            ## Imposter Syndrome Is Real</p>
            <p>Everyone here seems impossibly smart:</p>
            <ul>
              <li>The intern next to me has published ML papers</li>
            </ul>
            <p>            - My mentor contributed to Linux kernel</p>
            <p>            - Lunch conversation included debate about distributed consensus algorithms</p>
            <p>            - Someone casually mentioned their compiler optimization patent</p>
            <p>            But here's what I'm learning: everyone feels this way. Even senior engineers admit to feeling out of their depth sometimes. The key is channeling that feeling into learning rather than paralysis.</p>
            <h2>Life at MPK (Menlo Park)</h2>
            <p>The campus is exactly what you'd expect:</p>
            <ul>
              <li>Free food everywhere (the rumors are true)</li>
            </ul>
            <p>            - Bikes to get between buildings</p>
            <p>            - Posters with Facebook values everywhere</p>
            <p>            - Hackathons every few weeks</p>
            <p>            - Zuck sightings (saw him twice already)</p>
            <p>            But the best part is the energy. Everyone genuinely believes they're changing the world. Whether that's naive or inspiring depends on your perspective.</p>
            <h2>Initial Observations</h2>
            <h3>The Good</h3>
            <ul>
              <li>Smart, motivated people everywhere</li>
            </ul>
            <p>            - Resources to build anything</p>
            <p>            - Impact is immediate and massive</p>
            <p>            - Learning opportunities are endless</p>
            <p>            - The technical challenges are fascinating</p>
            <p>            ### The Challenging</p>
            <ul>
              <li>Pace is relentless</li>
            </ul>
            <p>            - Code base is massive and complex</p>
            <p>            - Stakes feel very high</p>
            <p>            - Work-life balance... what's that?</p>
            <p>            - Everything is acronyms (still learning the language)</p>
            <p>            ## What I'm Learning</p>
            <p>Beyond the technical stuff:</p>
            <ul>
              <li>**Communication is crucial** - Over-communicate everything</li>
            </ul>
            <ul>
              <li>**Ask questions** - Better to look ignorant than be ignorant</li>
            </ul>
            <ul>
              <li>**Take notes** - Information firehose is real</li>
            </ul>
            <ul>
              <li>**Find mentors** - People are surprisingly willing to help</li>
            </ul>
            <ul>
              <li>**Ship early** - Perfect code that doesn\'t ship has zero impact</li>
            </ul>
            <h2>Goals for This Summer</h2>
            <ul>
              <li>Ship meaningful performance improvements</li>
            </ul>
            <ul>
              <li>Understand distributed systems at scale</li>
            </ul>
            <ul>
              <li>Contribute to open source projects (React maybe?)</li>
            </ul>
            <ul>
              <li>Build relationships with brilliant engineers</li>
            </ul>
            <ul>
              <li>Decide if big tech is my path forward</li>
            </ul>
            <h2>Reflections</h2>
            <p>One week in, and I'm exhausted but exhilarated. The jump from academic projects to production systems is huge. In university, we optimized for correctness and grades. Here, we optimize for impact and iteration speed.</p>
            <p>The scale still doesn't feel real. When I fix a bug or improve performance, hundreds of millions of people benefit. When I mess up... well, let's not think about that.</p>
            <p>Is this where I want to be long-term? Too early to tell. But for now, I'm learning more per day than I did per month in school. And that's exactly what internships are for.</p>
            <p>Time to review some more diffs and figure out what "bootleggers" means in Facebook context. (Apparently it's not about illegal alcohol - it's an internal deployment tool. This place has its own language!)</p>
            <p>*Week 1: Survived. 11 more to go!*</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
