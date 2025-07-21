import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Finals Week: Surviving the Engineering Gauntlet - Michael D'Angelo",
  description: "It's finals week at UB. Five exams, three all-nighters, and enough coffee to fill Lake Erie. This is my survival log.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-12-11-finals-week-surviving-the-engineering-gauntlet">
        <header>
          <h1 className="text-4xl font-bold mb-4">Finals Week: Surviving the Engineering Gauntlet</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-12-11').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 11 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['university', 'finals', 'study-tips', 'personal'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Day 5 of finals week. I can see through time. Coffee has replaced my blood. My calculator is an extension of my hand. This is engineering finals week, and I'm documenting it for posterity (and to stay sane).</p>
          <h2>The Schedule from Hell</h2>
          <ul>
            <li>Monday 8 AM: Calculus II (3 hours)</li>
            <li>Tuesday 10 AM: Digital Logic (2 hours)</li>
            <li>Wednesday 3 PM: Physics E&M (3 hours)</li>
            <li>Thursday 8 AM: Circuit Analysis (3 hours)</li>
            <li>Friday 1 PM: Chemistry (2 hours)</li>
          </ul>
          <p>13 hours of exams. 5 days. 1 very tired freshman.</p>
          <h2>Sunday Night: The Calm Before the Storm</h2>
          <p>Spent the day in the engineering library. Our study group has claimed a corner table - it's basically our home now.</p>
          <p>Supply inventory:</p>
          <ul>
            <li>Coffee maker (borrowed from IEEE lab)</li>
            <li>Enough energy drinks to power a small city</li>
            <li>Whiteboards (3 portable ones)</li>
            <li>Every textbook and notebook from the semester</li>
            <li>Emergency snacks (brain food = lots of chocolate)</li>
          </ul>
          <p>The plan: Systematic review, focus on weak areas, don't panic.</p>
          <h2>Monday: Calculus II</h2>
          <h3>3 AM Study Session</h3>
          <p>Integration by parts is my nemesis. Finally clicked at 3:47 AM.</p>
          <p>The moment of clarity: ∫x·cos(x)dx = x·sin(x) - ∫sin(x)dx = x·sin(x) + cos(x) + C</p>
          <p>I may have yelled "YES!" and woken up half the floor.</p>
          <h3>The Exam</h3>
          <ul>
            <li>Series convergence tests: Nailed it</li>
            <li>Taylor series: Pretty confident</li>
            <li>That surface integral: What even was that?</li>
            <li>Overall: Survived</li>
          </ul>
          <p>Post-exam: Celebrated with actual meal (not ramen!), then immediately started Digital Logic review.</p>
          <h2>Tuesday: Digital Logic</h2>
          <h3>The All-Nighter</h3>
          <p>Didn't sleep. Powered through with study group. Topics covered:</p>
          <ul>
            <li>Karnaugh maps until they appeared on closed eyelids</li>
            <li>State machines (Moore vs Mealy)</li>
            <li>Flip-flop timing diagrams</li>
            <li>Boolean algebra simplification</li>
          </ul>
          <p>Dave's clutch realization at 5 AM: "JK flip-flops are just SR flip-flops with extra steps!" Everything clicked.</p>
          <h3>The Exam</h3>
          <p>Blessing: Design-heavy, not theory-heavy.</p>
          <ul>
            <li>Design a 4-bit counter: Easy</li>
            <li>Minimize this 5-variable function: K-maps FTW</li>
            <li>Timing analysis: Tricky but manageable</li>
          </ul>
          <p>Walked out feeling good. Then remembered Physics is tomorrow.</p>
          <h2>Wednesday: Physics E&M</h2>
          <h3>The Study Marathon</h3>
          <p>E&M is abstract and brutal. Our approach: 1. Draw EVERYTHING 2. Maxwell's equations are gospel 3. Right-hand rule tattoo (temporary)</p>
          <p>Group breakthrough: Visualizing fields as actual field lines helped immensely. We drew so many field diagrams.</p>
          <h3>The Exam</h3>
          <p>Professor wasn't messing around:</p>
          <ul>
            <li>Derive electric field inside a uniformly charged sphere</li>
            <li>Solenoid with 500 turns, find everything</li>
            <li>RC circuit with switch madness</li>
            <li>Electromagnetic wave propagation</li>
          </ul>
          <p>Used every second of those 3 hours. Hand cramped from writing.</p>
          <h2>Thursday: Circuit Analysis</h2>
          <h3>4 AM - The Delirium Sets In</h3>
          <p>Sarah: "What if resistors are just conductors having an existential crisis?" Me: "Capacitors are just time-traveling resistors." Mike: "Inductors are capacitors' evil twin."</p>
          <p>We've lost it. But somehow, Thévenin equivalents make perfect sense now.</p>
          <h3>The Exam</h3>
          <p>My strongest subject, thank god:</p>
          <ul>
            <li>Nodal analysis of death (7 nodes)</li>
            <li>Find Thévenin equivalent</li>
            <li>Transient analysis of RLC circuit</li>
            <li>Operational amplifier circuit design</li>
          </ul>
          <p>Finished with 30 minutes to spare. Used time to triple-check. Found two sign errors!</p>
          <h2>Friday: Chemistry</h2>
          <h3>The Final Push</h3>
          <p>Last exam. Running on fumes. Group morale at all-time low.</p>
          <p>Mike's motivational speech: "One more exam. Then sleep. Real sleep. In a bed. For days."</p>
          <p>Focused on:</p>
          <ul>
            <li>Balancing redox reactions</li>
            <li>Thermodynamics calculations</li>
            <li>Electron configurations</li>
            <li>Gas laws</li>
          </ul>
          <h3>The Exam</h3>
          <p>Honestly? Blur. Remember balancing complex equation. Remember calculating entropy. Remember walking out.</p>
          <p>Remember freedom.</p>
          <h2>The Aftermath</h2>
          <h3>Total Consumption</h3>
          <ul>
            <li>Coffee: 37 cups</li>
            <li>Energy drinks: 15</li>
            <li>Hours of sleep: 11 (over 5 days)</li>
            <li>Practice problems solved: 300+</li>
            <li>Whiteboards filled: Countless</li>
          </ul>
          <h3>What Worked</h3>
          <p>1. <strong>Study groups</strong>: Different perspectives saved us 2. <strong>Teaching others</strong>: Best way to confirm understanding 3. <strong>Practice problems > Reading</strong>: Active learning wins 4. <strong>Regular breaks</strong>: 50 min study, 10 min break 5. <strong>Staying positive</strong>: Humor helps (even bad physics puns)</p>
          <h3>What Didn\'t</h3>
          <p>1. <strong>All-nighters</strong>: Diminishing returns after 2 AM 2. <strong>Cramming new material</strong>: If you don't know it by finals week... 3. <strong>Skipping meals</strong>: Brain needs real food 4. <strong>Isolation</strong>: Don't go it alone</p>
          <h2>Lessons for Next Semester</h2>
          <p>1. <strong>Start review earlier</strong>: Week before isn't enough 2. <strong>Make formula sheets throughout semester</strong>: Not night before 3. <strong>Form study groups early</strong>: Not during finals week 4. <strong>Sleep is not optional</strong>: Performance drops without it 5. <strong>Exercise</strong>: Even 10 minute walks help clear head</p>
          <h2>The Engineering Bond</h2>
          <p>Something happens when you survive finals week together. The four of us - we're bonded now. We've seen each other at our worst (3 AM derivatives) and our best (solving impossible problems).</p>
          <p>This shared suffering creates friendships that last. We literally learned a language together - the language of engineering.</p>
          <h2>Reflecting on First Semester</h2>
          <p>Four months ago, I was intimidated by everyone and everything. Now:</p>
          <ul>
            <li>I can analyze circuits in my sleep</li>
            <li>Calculus is a tool, not a monster</li>
            <li>I understand how computers work at gate level</li>
            <li>I've built things that actually function</li>
            <li>I found my people</li>
          </ul>
          <h2>The Victory Lap</h2>
          <p>It's 3 PM Friday. Last exam submitted. Walking out of the chemistry building, the winter sun hits my face. I haven't seen daylight in days.</p>
          <p>The group celebrates at the dining hall. Real food. Sitting down. Conversation about anything BUT engineering.</p>
          <p>Then Mike says: "So what projects are we building over break?"</p>
          <p>We're hopeless. And I wouldn't have it any other way.</p>
          <h2>To Future Engineering Students</h2>
          <p>You'll survive finals week. It'll push you to limits you didn't know existed. You'll question everything. You'll want to quit.</p>
          <p>Don't.</p>
          <p>Because afterward, you'll realize: If I can survive this, I can handle anything engineering throws at me.</p>
          <p>Now if you'll excuse me, I have a date with my bed. For about 16 hours.</p>
          <p><em>Update: Slept for 14 hours straight. Dreamed in circuit diagrams. Is this normal? Don't care. Semester one: Complete.</em></p>
        </div>
      </article>
    </>
  );
}