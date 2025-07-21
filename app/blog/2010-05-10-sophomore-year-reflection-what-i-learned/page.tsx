import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sophomore Year Reflection: What I Learned - Michael D'Angelo",
  description: "Sophomore year is ending. From joining CubeSat to surviving Signals & Systems, here's what I learned in my second year of EE.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-05-10-sophomore-year-reflection-what-i-learned">
        <header>
          <h1 className="text-4xl font-bold mb-4">Sophomore Year Reflection: What I Learned</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-05-10').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 10 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['reflection', 'personal', 'academic', 'growth'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Sitting in my emptied dorm room, boxes packed, waiting for parents to pick me up. Sophomore year is over. It feels like yesterday I was a clueless freshman breadboarding my first circuit. Now I'm designing satellite power systems. Time to reflect on what changed.</p>
          <h2>Academic Evolution</h2>
          <h3>Fall 2009 vs Spring 2010</h3>
          <p><strong>Then:</strong></p>
          <ul>
            <li>Struggled with basic calculus</li>
            <li>Feared breadboards</li>
            <li>Thought Arduino was advanced</li>
            <li>Circuits were mysterious</li>
          </ul>
          <p><strong>Now:</strong></p>
          <ul>
            <li>Solving differential equations</li>
            <li>Designing PCBs</li>
            <li>Programming bare metal</li>
            <li>Teaching circuits to freshmen</li>
          </ul>
          <p>The knowledge compounds exponentially.</p>
          <h3>The Classes That Changed Me</h3>
          <p><strong>Digital Systems</strong>: Finally understand how computers work. From transistors to processors, the magic is gone, replaced by deep understanding.</p>
          <p><strong>Signals & Systems</strong>: Nearly broke me, but opened new worlds. Everything is frequencies now. Can't listen to music without thinking about Fourier transforms.</p>
          <p><strong>Circuits II</strong>: AC analysis, frequency response, filters. The mathematical beauty of impedance. Changed how I see all electronics.</p>
          <p><strong>Orbital Mechanics</strong>: Because CubeSat. Hardest class I've taken. But now I understand how satellites stay up!</p>
          <h3>GPA Reality</h3>
          <p>Fall: 3.7 (riding freshman enthusiasm) Spring: 3.4 (reality hit hard) Cumulative: 3.55</p>
          <p>Not stellar, but respectable. More importantly: actually learned the material.</p>
          <h2>Technical Growth</h2>
          <h3>Projects Completed</h3>
          <p><strong>Major:</strong></p>
          <ul>
            <li>CubeSat power system design</li>
            <li>GPS data logger</li>
            <li>Logic analyzer</li>
            <li>Function generator</li>
            <li>Dual-rail power supply</li>
          </ul>
          <p><strong>Minor:</strong></p>
          <ul>
            <li>Countless Arduino experiments</li>
            <li>PCB designs (5 fabricated!)</li>
            <li>LED cubes, robots, sensors</li>
            <li>Clean room construction</li>
          </ul>
          <p>From breadboard mess to manufactured PCBs. That's progress.</p>
          <h3>Skills Acquired</h3>
          <p><strong>Hard Skills:</strong></p>
          <ul>
            <li>PCB design (Eagle)</li>
            <li>Embedded C programming</li>
            <li>MATLAB/Simulink</li>
            <li>Oscilloscope mastery</li>
            <li>Soldering (finally good at it!)</li>
            <li>Basic machining</li>
          </ul>
          <p><strong>Soft Skills:</strong></p>
          <ul>
            <li>Technical documentation</li>
            <li>Team collaboration (CubeSat)</li>
            <li>Time management (barely)</li>
            <li>Teaching/mentoring</li>
            <li>Presenting technical content</li>
          </ul>
          <h3>Tools I Now Own</h3>
          <p>Freshman year: Multimeter and hope Now: Oscilloscope, function generator, power supply, logic analyzer, soldering station, 3D printer access</p>
          <p>Built half of them myself!</p>
          <h2>CubeSat Impact</h2>
          <p>Joining the team transformed my experience:</p>
          <p><strong>Technical growth:</strong></p>
          <ul>
            <li>Real engineering constraints</li>
            <li>Space systems knowledge</li>
            <li>Professional documentation</li>
            <li>Design reviews</li>
          </ul>
          <p><strong>Personal growth:</strong></p>
          <ul>
            <li>Leadership (power subsystem lead)</li>
            <li>Responsibility (satellite depending on my work)</li>
            <li>Confidence (presenting to NASA reviewers)</li>
            <li>Network (met industry professionals)</li>
          </ul>
          <p>Best decision of college so far.</p>
          <h2>Social Evolution</h2>
          <h3>Finding My People</h3>
          <p>Freshman year: Tried to fit in everywhere Sophomore year: Found the engineering tribe</p>
          <p>IEEE chapter became second home. Thursday nights building projects with people who get excited about op-amps? Perfect.</p>
          <h3>Mentorship</h3>
          <p><strong>Being mentored:</strong></p>
          <ul>
            <li>Junior CubeSat members taught practical skills</li>
            <li>Professors became accessible humans</li>
            <li>TA sessions turned into career advice</li>
          </ul>
          <p><strong>Mentoring others:</strong></p>
          <ul>
            <li>Taught freshmen basic circuits</li>
            <li>Led Arduino workshops</li>
            <li>Helped interview internship candidates</li>
          </ul>
          <p>Teaching solidifies understanding.</p>
          <h2>Failures and Lessons</h2>
          <h3>The Spectrum Analyzer Disaster</h3>
          <p>Spent 3 weeks building analog spectrum analyzer. Never worked properly. Learned: Sometimes you fail. Document why, move on.</p>
          <h3>The Missed Opportunity</h3>
          <p>Didn't apply for NASA internship thinking "I'm not good enough." Friend with similar qualifications got it. Learned: Let them reject you. Don't self-reject.</p>
          <h3>The All-Nighter Addiction</h3>
          <p>Pulled too many. Grades suffered. Health suffered. Learned: Sleep is not optional. Plan better.</p>
          <h3>The Social Balance</h3>
          <p>Spent too much time in lab, not enough with non-engineers. Learned: Need balance for sanity.</p>
          <h2>Surprises</h2>
          <h3>Math Became a Tool</h3>
          <p>No longer abstract torture. Now it's the language of engineering. Beautiful moment when calculus helped design a filter.</p>
          <h3>Building &gt; Theory</h3>
          <p>Professors who emphasize theory only are missing the point. Building makes theory concrete.</p>
          <h3>Industry Is Approachable  </h3>
          <p>Through CubeSat, met real engineers. They're just older versions of us, still excited about building cool stuff.</p>
          <h3>Imposter Syndrome Is Universal</h3>
          <p>Everyone feels inadequate sometimes. Even the seniors. Even the professors. Normal part of growth.</p>
          <h2>What I Wish I\'d Known</h2>
          <p>1. <strong>Join technical teams immediately</strong>: Waiting until sophomore year was mistake 2. <strong>Document everything</strong>: Future you needs those notes 3. <strong>Professors are human</strong>: Office hours are goldmines 4. <strong>Build constantly</strong>: Theory without practice is useless 5. <strong>Network naturally</strong>: Friends become future colleagues</p>
          <h2>Summer Plans</h2>
          <p>Internship at aerospace company:</p>
          <ul>
            <li>12 weeks</li>
            <li>Avionics testing</li>
            <li>Real engineering experience</li>
            <li>Adulting practice</li>
          </ul>
          <p>Goals:</p>
          <ul>
            <li>Learn industry practices</li>
            <li>Build professional network</li>
            <li>Save money for junior year</li>
            <li>Don't embarrass myself</li>
          </ul>
          <h2>Looking Ahead: Junior Year</h2>
          <p><strong>Academic goals:</strong></p>
          <ul>
            <li>Control systems</li>
            <li>Electromagnetics</li>
            <li>Embedded systems</li>
            <li>Maybe machine learning?</li>
          </ul>
          <p><strong>Project goals:</strong></p>
          <ul>
            <li>CubeSat integration/testing</li>
            <li>Personal website/portfolio</li>
            <li>More complex PCB designs</li>
            <li>Start thinking about senior project</li>
          </ul>
          <p><strong>Career goals:</strong></p>
          <ul>
            <li>Better internship for next summer</li>
            <li>Clarify: Industry or grad school?</li>
            <li>Build specialized expertise</li>
            <li>Publish something?</li>
          </ul>
          <h2>The Transformation</h2>
          <p>Two years ago: "I like building things" Now: "I'm an electrical engineer (in training)"</p>
          <p>The identity shift is real. When family asks what I do, I have real answers. When things break, I can fix them. When I see technology, I understand it.</p>
          <h2>Advice for Rising Sophomores</h2>
          <p>1. <strong>Say yes to opportunities</strong>: Even if scared 2. <strong>Build things constantly</strong>: Theory + practice = engineering 3. <strong>Find your tribe</strong>: Engineering is team sport 4. <strong>Document journey</strong>: You'll forget details 5. <strong>Embrace confusion</strong>: It precedes understanding</p>
          <h2>Gratitude</h2>
          <p>To everyone who helped:</p>
          <ul>
            <li>Parents funding this journey</li>
            <li>Professors who stayed late explaining</li>
            <li>TAs who answered dumb questions</li>
            <li>Classmates who became friends</li>
            <li>CubeSat team for accepting newbie</li>
          </ul>
          <p>Engineering school is hard alone. With support, it's just hard.</p>
          <h2>The Bottom Line</h2>
          <p>Sophomore year: Where you decide if engineering is really for you.</p>
          <p>My answer: Absolutely yes.</p>
          <p>The late nights debugging, the math struggles, the failed projects - all worth it for the moment when something you designed works.</p>
          <p>Two years down, two to go. Bring on junior year.</p>
          <p><em>Next post will be from industry! Internship starts in 2 weeks. Currently oscillating between excitement and terror. Probably need better emotional regulation circuits...</em></p>
        </div>
      </article>
    </>
  );
}