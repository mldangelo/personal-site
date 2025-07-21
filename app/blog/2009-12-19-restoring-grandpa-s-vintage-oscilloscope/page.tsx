import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Restoring Grandpa's Vintage Oscilloscope - Michael D'Angelo",
  description: "Found a 1960s Tektronix scope in Grandpa's basement. Time to bring this beautiful piece of engineering history back to life.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-12-19-restoring-grandpa-s-vintage-oscilloscope">
        <header>
          <h1 className="text-4xl font-bold mb-4">Restoring Grandpa\'s Vintage Oscilloscope</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-12-19').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 12 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['electronics', 'restoration', 'vintage', 'family'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Grandpa led me to his basement workshop, pulled off a dusty sheet, and revealed a Tektronix 545A oscilloscope from 1963. "Bought this when I worked at Bell Labs," he said. "Think you can make it work again?" Challenge accepted.</p>
          <h2>First Impressions</h2>
          <p>This thing is MASSIVE:</p>
          <ul>
            <li>Weighs about 65 pounds</li>
            <li>Over 100 vacuum tubes inside</li>
            <li>Built like a tank</li>
            <li>That distinct old electronics smell</li>
          </ul>
          <p>The front panel is a work of art - Bakelite knobs, engraved labels, toggle switches that <em>click</em> with authority. They don't make them like this anymore.</p>
          <h2>Initial Assessment</h2>
          <p>Power-up test (with Grandpa standing by with fire extinguisher):</p>
          <ul>
            <li>Pilot light: Glowing</li>
            <li>Tube heaters: Warming up</li>
            <li>CRT: No trace</li>
            <li>Smell: Concerning but not burning</li>
            <li>Verdict: It tries to live!</li>
          </ul>
          <h2>The Investigation</h2>
          <p>Opened the side panel. Engineering porn:</p>
          <ul>
            <li>Point-to-point wiring on ceramic terminal strips</li>
            <li>Carbon composition resistors everywhere</li>
            <li>Paper and oil capacitors (likely suspects)</li>
            <li>Tubes in sockets, easily replaceable</li>
            <li>A schematic diagram INSIDE THE CASE</li>
          </ul>
          <p>Modern electronics could learn from this serviceability.</p>
          <h2>Grandpa\'s Stories</h2>
          <p>While I worked, Grandpa shared stories:</p>
          <ul>
            <li>Used this exact scope to debug early transistor circuits</li>
            <li>Cost him two months' salary in 1963</li>
            <li>"Transistors were going to change everything," he said</li>
            <li>Showed me his lab notebooks from Bell Labs</li>
          </ul>
          <p>I'm literally holding engineering history.</p>
          <h2>The Troubleshooting Process</h2>
          <h3>Step 1: Visual Inspection</h3>
          <ul>
            <li>Several tubes not glowing (dead heaters)</li>
            <li>Capacitor showing white residue (leaked electrolyte)</li>
            <li>Resistors with color bands burned beyond recognition</li>
            <li>But structurally sound!</li>
          </ul>
          <h3>Step 2: The Hunt for Tubes</h3>
          <p>Grandpa: "Check the bottom drawer." Found a box labeled "SPARE TUBES" with 20+ tubes in original boxes. This man was prepared.</p>
          <h3>Step 3: Voltage Checks</h3>
          <p>Using my modern DMM to troubleshoot 46-year-old technology:</p>
          <ul>
            <li>B+ supply: 200V instead of 300V</li>
            <li>Negative rail: -100V looks good</li>
            <li>Heater voltage: 6.3V perfect</li>
            <li>Problem: Power supply capacitors</li>
          </ul>
          <h2>The Repair Journey</h2>
          <h3>Replacing Capacitors</h3>
          <p>Those old paper caps had to go: 1. Mapped out which ones to replace (all of them) 2. Trip to RadioShack (they still had capacitors!) 3. Modern caps are 1/10 the size 4. Kept the old ones for Grandpa's "museum box"</p>
          <h3>Tube Rolling</h3>
          <p>Tested each tube with Grandpa's tube tester (another vintage treasure):</p>
          <ul>
            <li>12 tubes dead</li>
            <li>Found replacements in his stash</li>
            <li>Each tube carefully inserted</li>
            <li>That satisfying <em>click</em> when seated properly</li>
          </ul>
          <h3>The Smoke Test</h3>
          <p>With repairs complete, powered up:</p>
          <ul>
            <li>Tubes glowing warmly</li>
            <li>No magic smoke</li>
            <li>Voltages checking good</li>
            <li>Still no trace...</li>
          </ul>
          <h2>The \"Aha!\" Moment</h2>
          <p>Grandpa: "Did you check the intensity knob?" Me: <em>turns knob</em> <em>BRIGHT GREEN LINE APPEARS</em></p>
          <p>IT LIVES!</p>
          <h2>Calibration and Testing</h2>
          <p>Spent hours getting it properly calibrated:</p>
          <ul>
            <li>Adjusted vertical and horizontal gain</li>
            <li>Centered the trace</li>
            <li>Set timebase accuracy</li>
            <li>Cleaned all potentiometers</li>
          </ul>
          <p>Fed it a 1kHz sine wave from my function generator. Perfect waveform on that round green screen. Absolutely beautiful.</p>
          <h2>Comparing Old vs New</h2>
          <p>My modern digital scope:</p>
          <ul>
            <li>100MHz bandwidth</li>
            <li>Weighs 5 pounds</li>
            <li>Does FFT, stores waveforms</li>
            <li>Cost: $400</li>
          </ul>
          <p>Grandpa's Tektronix:</p>
          <ul>
            <li>15MHz bandwidth</li>
            <li>Weighs 65 pounds</li>
            <li>Does one thing perfectly</li>
            <li>Cost in 1963: $3000 ($25,000 today!)</li>
          </ul>
          <p>But honestly? The Tek's trace looks better. There's something about analog.</p>
          <h2>What I Learned</h2>
          <h3>Technical Lessons</h3>
          <p>1. <strong>Old equipment was built to last</strong>: Modern gear won't work in 50 years 2. <strong>Serviceability matters</strong>: Every component accessible and replaceable 3. <strong>Analog has charm</strong>: That live, real-time trace is mesmerizing 4. <strong>Documentation was better</strong>: Full schematics included!</p>
          <h3>Personal Lessons</h3>
          <p>1. <strong>Engineering is timeless</strong>: The principles haven't changed 2. <strong>Respect for history</strong>: This scope helped develop modern tech 3. <strong>Generational connection</strong>: Grandpa and I speak the same language 4. <strong>Quality costs</strong>: But it's worth it</p>
          <h2>The Working Session</h2>
          <p>Once repaired, Grandpa and I used it together:</p>
          <ul>
            <li>He showed me how to trigger on complex waveforms</li>
            <li>We looked at audio signals from his old radio</li>
            <li>Compared transistor vs tube amplifier outputs</li>
            <li>He taught me tricks not in any textbook</li>
          </ul>
          <p>Four hours flew by.</p>
          <h2>Grandpa\'s Gift</h2>
          <p>"It's yours now," he said. "Take it to college. Show your professors that old equipment still works."</p>
          <p>I almost cried. This isn't just an oscilloscope - it's:</p>
          <ul>
            <li>A piece of history</li>
            <li>A family heirloom</li>
            <li>A working tool</li>
            <li>A connection to engineering's past</li>
          </ul>
          <h2>Getting It to College</h2>
          <p>Challenge: Flying with 65 pounds of vintage electronics.</p>
          <p>Solution: Shipping it freight with enough bubble wrap to protect a moon lander.</p>
          <h2>The Bigger Picture</h2>
          <p>This project connected me to:</p>
          <ul>
            <li>Engineering history</li>
            <li>My grandfather's career</li>
            <li>The evolution of technology</li>
            <li>The importance of preservation</li>
          </ul>
          <p>Not bad for a winter break project.</p>
          <h2>Epilogue</h2>
          <p>Back at school, I brought the Tek to IEEE lab. Professors were amazed:</p>
          <ul>
            <li>"Is that a real 545A?"</li>
            <li>"Does it work?"</li>
            <li>"Can we use it for the analog lab?"</li>
          </ul>
          <p>Now it sits in our lab, functional and proud. We use it for special demonstrations, showing students how engineers worked before digital everything.</p>
          <h2>To Future Engineers</h2>
          <p>If you find old equipment: 1. Don't throw it away 2. Try to fix it 3. Learn from it 4. Respect the engineering</p>
          <p>These machines were built by engineers who couldn't simulate, couldn't Google, couldn't order parts online. They had slide rules and ingenuity.</p>
          <p>And they built things that still work 50 years later.</p>
          <h2>Final Thought</h2>
          <p>Every time I use this scope, I think of:</p>
          <ul>
            <li>Grandpa debugging circuits at Bell Labs</li>
            <li>Engineers who designed it without CAD</li>
            <li>The craftsmanship in every solder joint</li>
            <li>The knowledge passed down through generations</li>
          </ul>
          <p>This oscilloscope is more than a tool. It's a bridge between past and future engineering.</p>
          <p>Thanks, Grandpa. I'll take good care of it.</p>
          <p><em>P.S. - Already used it to debug my digital logic project. The irony of using 1960s analog equipment to troubleshoot 2009 digital circuits isn't lost on me. But it worked perfectly.</em></p>
        </div>
      </article>
    </>
  );
}