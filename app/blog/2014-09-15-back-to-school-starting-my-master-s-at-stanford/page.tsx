import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Back to School: Starting My Master's at Stanford</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2014-09-15">September 14, 2014</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">stanford</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">graduate-school</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">machine-learning</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">education</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>After a year in industry, I'm back in academia - this time at Stanford for a Master's in Computational and Mathematical Engineering (CME). The transition from Facebook's fast-paced environment to graduate school is jarring but exciting.</p>
            <h2>Why Grad School? Why Now?</h2>
            <p>After my Facebook internship and a year working, I realized something: the most interesting problems I encountered required deeper mathematical foundations. Whether it was optimizing distributed systems, understanding machine learning algorithms, or modeling complex systems, I kept hitting the limits of my undergraduate knowledge.</p>
            <p>Stanford's CME program is perfect because it's:</p>
            <ul>
              <li>Interdisciplinary (math + CS + engineering)</li>
            </ul>
            <p>            - Flexible (can tailor coursework to interests)</p>
            <p>            - Industry-connected (Silicon Valley location)</p>
            <p>            - Research-oriented but professionally focused</p>
            <p>            ## The Course Load</p>
            <p>First quarter lineup:</p>
            <ul>
              <li>**CS 229: Machine Learning** (Andrew Ng!)</li>
            </ul>
            <p>            - <strong>CME 302: Numerical Linear Algebra</strong></p>
            <p>            - <strong>CS 246: Mining Massive Datasets</strong></p>
            <p>            This is... intense. Each course alone could be a full-time job. The pace makes undergrad look leisurely.</p>
            <h2>First Impressions</h2>
            <h3>The Caliber of Peers</h3>
            <p>My classmates include:</p>
            <ul>
              <li>Former Google/Facebook engineers</li>
            </ul>
            <p>            - Published researchers</p>
            <p>            - International Math Olympiad medalists</p>
            <p>            - Startup founders</p>
            <p>            Imposter syndrome from Facebook? Multiply by 10. But also incredibly inspiring.</p>
            <h3>The Teaching Quality</h3>
            <p>Having Andrew Ng explain machine learning is like having Gordon Ramsay teach you to cook. The clarity and insight are on another level. In one lecture, he clarified concepts I'd struggled with for months.</p>
            <h3>The Resources</h3>
            <ul>
              <li>GPU clusters for deep learning experiments</li>
            </ul>
            <p>            - Access to industry partnerships</p>
            <p>            - Funding for conference attendance</p>
            <p>            - Proximity to every major tech company</p>
            <p>            ## Culture Shock: Academia vs Industry</p>
            <h3>Pace Difference</h3>
            <ul>
              <li>Industry: Ship fast, iterate based on data</li>
            </ul>
            <p>            - Academia: Think deeply, prove correctness, publish</p>
            <p>            Both have merits, but the adjustment is real.</p>
            <h3>Metrics of Success</h3>
            <ul>
              <li>Industry: Impact, deployment, user metrics</li>
            </ul>
            <p>            - Academia: Publications, citations, novel contributions</p>
            <p>            Still figuring out how to balance both mindsets.</p>
            <h3>Collaboration Style</h3>
            <p>Facebook was intensely collaborative - pair programming, constant code reviews. Here, work is more independent with periodic collaboration. Miss the immediate feedback loops.</p>
            <h2>Early Projects</h2>
            <h3>Machine Learning: Spam Classifier</h3>
            <p>Building a spam classifier from scratch - no sklearn, just numpy. Implementing gradient descent by hand gives you appreciation for what libraries abstract away.</p>
            <p>Key insight: The math is beautiful when you understand it. Gradient descent isn't just "optimization" - it's following the steepest path downhill in high-dimensional space.</p>
            <h3>Linear Algebra: PageRank Implementation</h3>
            <p>Implementing PageRank using power iteration method. Connecting linear algebra (eigenvectors) to real-world applications (web search) is mind-blowing.</p>
            <p>The elegance: PageRank is just finding the dominant eigenvector of the web's adjacency matrix. One equation revolutionized the internet.</p>
            <h3>Big Data: Analyzing Wikipedia</h3>
            <p>Using Spark to analyze Wikipedia's link structure. The scale is Facebook-esque but the freedom to explore is refreshing.</p>
            <h2>Work-Life Balance?</h2>
            <p>Grad school schedule is weird:</p>
            <ul>
              <li>No fixed hours but always something to do</li>
            </ul>
            <p>            - Deadlines cluster (why are all assignments due Tuesday?)</p>
            <p>            - Research has no clear "done" state</p>
            <p>            - Social life happens in study groups</p>
            <p>            Different from industry's structured days, but the flexibility is nice.</p>
            <h2>Stanford Specific Observations</h2>
            <h3>The Bubble is Real</h3>
            <p>Stanford feels disconnected from reality sometimes:</p>
            <ul>
              <li>Perfect weather always</li>
            </ul>
            <p>            - Incredible resources everywhere</p>
            <p>            - Everyone working on "world-changing" ideas</p>
            <p>            - Easy to forget the privilege</p>
            <p>            ### Interdisciplinary is Everything</p>
            <p>Best insights come from field intersections:</p>
            <ul>
              <li>Biology + CS = Computational genomics</li>
            </ul>
            <p>            - Physics + ML = Quantum machine learning</p>
            <p>            - Economics + Math = Market modeling</p>
            <p>            CME sits at these intersections perfectly.</p>
            <h3>The Entrepreneurship Bug</h3>
            <p>Everyone has a startup idea. Literally everyone. Dorm conversations sound like pitch meetings. It's infectious but also exhausting.</p>
            <h2>Challenges So Far</h2>
            <h3>Mathematical Rigor</h3>
            <p>Industry valued "good enough" solutions. Academia demands proofs. Relearning to be rigorous after a year of "ship it" mentality is tough.</p>
            <h3>Time Management</h3>
            <p>Without structured work hours, it's easy to either:</p>
            <ul>
              <li>Work constantly (burnout path)</li>
            </ul>
            <p>            - Procrastinate everything (panic path)</p>
            <p>            Still finding balance.</p>
            <h3>Depth vs Breadth</h3>
            <p>So many interesting courses, limited time. Do I go deep in ML or explore quantum computing? Optimization theory or computer vision? FOMO is real.</p>
            <h2>What I Miss About Industry</h2>
            <ul>
              <li>Clear metrics of success</li>
            </ul>
            <p>            - Immediate impact of work</p>
            <p>            - Structure and deadlines</p>
            <p>            - The salary (ramen budget is real)</p>
            <p>            - Deploying to millions of users</p>
            <p>            ## What I Love About Academia</p>
            <ul>
              <li>Freedom to explore</li>
            </ul>
            <p>            - Surrounded by brilliant people</p>
            <p>            - Access to cutting-edge research</p>
            <p>            - Time to think deeply</p>
            <p>            - No on-call duties!</p>
            <p>            ## Goals for the Program</p>
            <ul>
              <li>**Deep ML expertise** - Not just using TensorFlow, but understanding the theory</li>
            </ul>
            <ul>
              <li>**Mathematical foundations** - Fill gaps from undergrad</li>
            </ul>
            <ul>
              <li>**Research experience** - Publish at least one paper</li>
            </ul>
            <ul>
              <li>**Industry connections** - Leverage Silicon Valley location</li>
            </ul>
            <ul>
              <li>**Technical breadth** - Explore fields outside comfort zone</li>
            </ul>
            <h2>Looking Forward</h2>
            <p>Two years feels both too long and too short. Long because the intensity is high and income is negative. Short because there's so much to learn.</p>
            <p>The combination of Stanford's resources, Silicon Valley's proximity, and the caliber of people here creates unique opportunities. Whether I return to industry or pursue a PhD, this experience is transformative.</p>
            <p>For now, back to implementing backpropagation from scratch. Andrew Ng made it sound so simple in lecture...</p>
            <p>*Note to future self: Remember this feeling of being a beginner. It's uncomfortable but necessary for growth.*</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
