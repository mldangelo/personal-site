import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Discovering the UB IEEE Student Chapter - Michael D'Angelo",
  description: "Finding my tribe - joining the IEEE student chapter and discovering a whole community of hardware nerds.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-10-10-discovering-the-ub-ieee-student-chapter">
        <header>
          <h1 className="text-4xl font-bold mb-4">Discovering the UB IEEE Student Chapter</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-10-10').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 8 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['ieee', 'community', 'university', 'networking'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Found my people! After a month of feeling like the only person excited about resistor color codes, I discovered the UB IEEE Student Chapter. Here's why every EE student needs to find their community.</p>
          <h2>The Discovery</h2>
          <p>Walking past the engineering building, I saw a poster: "IEEE Student Night - Free Pizza and Op-Amp Competitions"</p>
          <p>Op-amp competitions? That's a thing? I was sold.</p>
          <h2>First Meeting Impressions</h2>
          <p>Walked into a room with:</p>
          <ul>
            <li>30+ engineering students</li>
            <li>Oscilloscopes showing Lissajous patterns (for fun!)</li>
            <li>Breadboards everywhere</li>
            <li>The promised pizza (engineering fuel)</li>
            <li>Actual enthusiasm for electronics</li>
          </ul>
          <h2>The Op-Amp Challenge</h2>
          <p>The competition: Design the highest-gain amplifier with:</p>
          <ul>
            <li>One LM741 op-amp</li>
            <li>Resistor budget: 5 resistors max</li>
            <li>Stable output (no oscillation)</li>
            <li>Bonus points for creativity</li>
          </ul>
          <p>My design: Classic non-inverting config with gain of 1001. Didn't win, but learned about stability and frequency compensation from the winners.</p>
          <h2>Why IEEE Matters for Students</h2>
          <p>Beyond the pizza (though that's important), here's what I discovered:</p>
          <p>1. <strong>Industry Connections</strong>: Older members have internships at Texas Instruments, Intel, Analog Devices 2. <strong>Real Projects</strong>: They're building an RFID door system for the lab 3. <strong>Resources</strong>: Access to IEEE papers and standards (normally $$$ expensive) 4. <strong>Mentorship</strong>: Seniors actually willing to help confused freshmen</p>
          <h2>The Lab Tour</h2>
          <p>They have their own lab! Complete with:</p>
          <ul>
            <li>PCB etching station</li>
            <li>Reflow oven (for SMD work)</li>
            <li>Logic analyzers</li>
            <li>Component library (thousands of parts)</li>
            <li>3D printer (for enclosures)</li>
          </ul>
          <p>As a freshman, I can use all of this. Mind = blown.</p>
          <h2>Current Projects</h2>
          <p>What members are working on:</p>
          <ul>
            <li>Solar-powered weather station for campus</li>
            <li>FPGA-based arcade machine</li>
            <li>Software-defined radio</li>
            <li>Tesla coil (because why not?)</li>
          </ul>
          <h2>The Best Part: Community</h2>
          <p>In my regular classes, admitting you spent Saturday night debugging a circuit gets you weird looks. Here? That's normal Tuesday conversation.</p>
          <p>Sample overheard conversations:</p>
          <ul>
            <li>"Anyone have a 10μF tantalum I can borrow?"</li>
            <li>"My oscillator won't stop oscillating... wait, that's good!"</li>
            <li>"Who left their flux on the hot plate again?"</li>
          </ul>
          <h2>Getting Involved</h2>
          <p>For any freshmen reading this: 1. <strong>Just show up</strong>: Don't worry about not knowing enough 2. <strong>Ask questions</strong>: Everyone loves sharing knowledge 3. <strong>Volunteer for projects</strong>: Best way to learn 4. <strong>Use the resources</strong>: That lab access is gold</p>
          <h2>My First IEEE Project</h2>
          <p>I volunteered to help with the RFID system. My job: Design the power supply section. Real project, real constraints, real learning.</p>
          <p>Requirements:</p>
          <ul>
            <li>5V @ 500mA for logic</li>
            <li>12V @ 200mA for door strike</li>
            <li>Battery backup</li>
            <li>Clean power (minimal ripple)</li>
          </ul>
          <p>Time to put that Circuit Analysis knowledge to use!</p>
          <h2>Upcoming Events</h2>
          <p>What's planned:</p>
          <ul>
            <li>Trip to local power plant</li>
            <li>Soldering workshop (finally, proper technique!)</li>
            <li>Guest speaker from AMD</li>
            <li>Regional IEEE competition</li>
          </ul>
          <h2>The Transformation</h2>
          <p>One month ago: Struggling alone with homework Now: Part of a community that gets excited about the same nerdy stuff</p>
          <h2>Advice for Shy Engineers</h2>
          <p>I get it - walking into a room of strangers is hard. But remember:</p>
          <ul>
            <li>Everyone was new once</li>
            <li>Engineers are generally helpful people</li>
            <li>Shared interests break ice fast</li>
            <li>Free pizza is a universal conversation starter</li>
          </ul>
          <h2>Looking Forward</h2>
          <p>This changes everything. College isn't just about classes - it's about finding your tribe. For EE students at UB (or anywhere), find your IEEE chapter. For other majors, find your equivalent.</p>
          <p>The journey is better with fellow travelers.</p>
          <p>Next week: Starting that power supply design. Will document the process!</p>
          <p>P.S. - They have an oscilloscope from the 1960s that still works. Vacuum tubes and everything. How cool is that?</p>
        </div>
      </article>
    </>
  );
}