import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "New Year, New Projects: 2010 Technical Goals - Michael D'Angelo",
  description: "Setting ambitious technical goals for sophomore year - from joining the CubeSat team to mastering PCB design.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-01-10-new-year-new-projects-2010-technical-goals">
        <header>
          <h1 className="text-4xl font-bold mb-4">New Year, New Projects: 2010 Technical Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-01-10').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 8 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['goals', 'personal', 'planning', 'new-year'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>New year, new decade, new challenges. As I start my second semester at UB, I'm setting some ambitious technical goals for 2010. Here's what I want to accomplish and why.</p>
          <h2>Reflecting on 2009</h2>
          <p>Last semester was about survival - learning the basics, finding my footing, building confidence. I went from barely knowing Ohm's Law to building digital clocks and power supplies. Good start, but now it's time to level up.</p>
          <h2>Technical Goals for 2010</h2>
          <h3>1. Join the UB Nanosatellite Team</h3>
          <p>The university has a CubeSat program building actual satellites. ACTUAL SATELLITES. That go to SPACE. I need to be part of this.</p>
          <p>Requirements to join:</p>
          <ul>
            <li>GPA above 3.0 (check!)</li>
            <li>Complete application project</li>
            <li>Interview with current team</li>
            <li>Commit 10+ hours/week</li>
          </ul>
          <p>I'm starting the application project this week - a power distribution board for their test platform.</p>
          <h3>2. Master PCB Design</h3>
          <p>Breadboards are great for prototypes, but real engineering happens on PCBs. Goals:</p>
          <ul>
            <li>Learn Eagle CAD (industry standard)</li>
            <li>Design and fabricate 5 PCBs</li>
            <li>Move from through-hole to surface mount</li>
            <li>Understand design for manufacturability</li>
          </ul>
          <p>First project: A proper Arduino shield instead of breadboard mess.</p>
          <h3>3. Get Amateur Radio License</h3>
          <p>Why?</p>
          <ul>
            <li>CubeSat team requires it (satellite communications)</li>
            <li>Access to more spectrum for projects</li>
            <li>Join the amateur radio community</li>
            <li>Emergency preparedness</li>
          </ul>
          <p>Studying for Technician class exam in February.</p>
          <h3>4. Build Serious Test Equipment</h3>
          <p>Can't always rely on school lab. Want to build:</p>
          <ul>
            <li>Function generator (analog + digital)</li>
            <li>Logic analyzer (FPGA-based)</li>
            <li>LCR meter</li>
            <li>Improved power supply (dual rail, current limiting)</li>
          </ul>
          <p>These are complex projects that'll push my skills.</p>
          <h3>5. Learn a Real Programming Language</h3>
          <p>Arduino is training wheels. Time to learn:</p>
          <ul>
            <li>C (properly, not Arduino C++)</li>
            <li>Python (for data analysis)</li>
            <li>MATLAB (required for signals class anyway)</li>
            <li>Maybe Verilog (FPGAs are the future)</li>
          </ul>
          <h3>6. Complete One Major Project Per Month</h3>
          <p>January: GPS data logger February: Spectrum analyzer March: SDR receiver April: CubeSat subsystem May: Wireless sensor network June-August: Summer internship projects September: Advanced microcontroller project October: RF transmitter (legal!) November: FPGA development board December: Year-end mega project</p>
          <h3>7. Document Everything Better</h3>
          <p>This blog is good, but I need:</p>
          <ul>
            <li>Proper lab notebook</li>
            <li>GitHub for code (just learned about version control!)</li>
            <li>Video documentation</li>
            <li>Technical write-ups for portfolio</li>
          </ul>
          <h2>Academic Goals</h2>
          <h3>Course Load</h3>
          <p>Spring 2010:</p>
          <ul>
            <li>EE 202: Circuit Analysis II (AC circuits, here we come)</li>
            <li>EE 205: Signals and Systems</li>
            <li>CSE 241: Digital Systems</li>
            <li>MTH 306: Differential Equations</li>
            <li>PHY 207: General Physics III</li>
          </ul>
          <p>This is where it gets real. No more "intro" classes.</p>
          <h3>Target: Dean\'s List</h3>
          <p>3.5+ GPA. Ambitious but achievable if I:</p>
          <ul>
            <li>Start assignments early</li>
            <li>Form study groups day 1</li>
            <li>Attend every office hour</li>
            <li>Actually read textbooks BEFORE lecture</li>
          </ul>
          <h2>Skill Development</h2>
          <h3>Hard Skills</h3>
          <ul>
            <li>SMD soldering (those 0603 components aren't soldering themselves)</li>
            <li>Oscilloscope mastery (all those knobs have purposes)</li>
            <li>Network analysis (S-parameters, Smith charts)</li>
            <li>Power analysis (battery life calculations)</li>
            <li>EMC basics (stop creating interference)</li>
          </ul>
          <h3>Soft Skills</h3>
          <ul>
            <li>Technical presentation (conference talks?)</li>
            <li>Team leadership (aiming for IEEE officer position)</li>
            <li>Project management (Gantt charts, here I come)</li>
            <li>Technical writing (papers, not just blogs)</li>
          </ul>
          <h2>Resources and Budget</h2>
          <h3>Financial Reality</h3>
          <p>College student budget: ~$100/month for projects</p>
          <p>Strategy:</p>
          <ul>
            <li>Salvage everything possible</li>
            <li>Group buys with IEEE chapter</li>
            <li>Apply for project grants</li>
            <li>Summer internship savings</li>
          </ul>
          <h3>Time Management</h3>
          <p>Credit hours: 17 CubeSat: 10 hrs/week IEEE: 5 hrs/week Projects: 10 hrs/week Sleep: ...what's that?</p>
          <p>It's aggressive, but sophomore year is for pushing limits.</p>
          <h2>Why These Goals?</h2>
          <p>Industry is moving fast. By graduation (2012), I need:</p>
          <ul>
            <li>Real project experience</li>
            <li>Technical depth</li>
            <li>Leadership experience</li>
            <li>Professional network</li>
            <li>Portfolio of work</li>
          </ul>
          <p>These goals position me for competitive internships and eventually full-time positions.</p>
          <h2>Accountability</h2>
          <p>Publishing these goals publicly for accountability. Will post monthly updates on progress.</p>
          <p>Failed goals are learning experiences. Achieved goals are stepping stones.</p>
          <h2>The Bigger Picture</h2>
          <p>2010 is about transformation:</p>
          <ul>
            <li>From student to engineer</li>
            <li>From follower to leader</li>
            <li>From consumer to creator</li>
            <li>From local to global thinking</li>
          </ul>
          <p>Space hardware? Radio communications? Advanced test equipment? Sophomore me is dreaming big.</p>
          <p>But that's the point. Dream big, work hard, build cool stuff.</p>
          <p>Here's to 2010 - the year I level up from electronics hobbyist to serious engineer.</p>
          <p><em>First goal: Submit CubeSat application by January 31st. If you're reading this after that date, check later posts to see if I made it!</em></p>
        </div>
      </article>
    </>
  );
}