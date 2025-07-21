import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The Art of Breadboarding: Tips from Trial and Error - Michael D'Angelo",
  description: "Everything I've learned about breadboarding through countless hours of debugging - the tips that textbooks don't teach you.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-10-28-the-art-of-breadboarding-tips-from-trial-and-error">
        <header>
          <h1 className="text-4xl font-bold mb-4">The Art of Breadboarding: Tips from Trial and Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-10-28').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 10 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['electronics', 'tutorial', 'breadboarding', 'tips'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>After spending another three hours debugging a circuit that turned out to have a loose jumper wire, I'm documenting every breadboarding tip I've learned the hard way. Future me (and maybe you) will thank me.</p>
          <h2>The Breadboard Basics Nobody Tells You</h2>
          <h3>Power Rails Aren\'t Always Connected</h3>
          <p>Found this out after an hour of debugging. Many breadboards have a gap in the middle of the power rails. Solution: Always jumper across the gap, even if you think you don't need to.</p>
          <h3>Those Holes Wear Out</h3>
          <p>After about 50 insertions, breadboard holes get loose. Symptoms:</p>
          <ul>
            <li>Intermittent connections</li>
            <li>Components falling out</li>
            <li>Random circuit behavior</li>
          </ul>
          <p>Mark worn sections with a Sharpie and avoid them.</p>
          <h2>My Wire Organization System</h2>
          <p>Threw away those terrible pre-made jumper kits. Here's what works:</p>
          <h3>Color Coding Religion</h3>
          <ul>
            <li><strong>Red</strong>: Positive power only</li>
            <li><strong>Black</strong>: Ground only</li>
            <li><strong>Orange</strong>: Secondary power (like 3.3V)</li>
            <li><strong>Yellow</strong>: Clock signals</li>
            <li><strong>Blue</strong>: Data signals</li>
            <li><strong>Green</strong>: Control signals</li>
            <li><strong>Purple</strong>: Audio/analog signals</li>
            <li><strong>White</strong>: "I ran out of the right color"</li>
          </ul>
          <h3>Wire Lengths Matter</h3>
          <p>Cut wires to exact length needed:</p>
          <ul>
            <li>Too long = rat's nest</li>
            <li>Too short = stress on connections</li>
            <li>Just right = clean, debuggable circuit</li>
          </ul>
          <h2>Component Placement Strategy</h2>
          <h3>The \"IC Valley\" Method</h3>
          <p>1. Place all ICs first, in a line down the middle 2. Leave at least 5 rows between ICs 3. Support components go on sides 4. Power routing on the edges</p>
          <h3>Decoupling Capacitors</h3>
          <p>Put them DIRECTLY across power pins. Not "nearby." Not "pretty close." DIRECTLY.</p>
          <ul>
            <li>0.1μF ceramic for each IC</li>
            <li>Leads as short as possible</li>
            <li>One leg in power rail, one in ground rail</li>
          </ul>
          <h2>Debugging Methodology</h2>
          <h3>The Sacred Order of Debugging</h3>
          <p>1. <strong>Check power</strong>: Seriously, is it plugged in? 2. <strong>Verify ground</strong>: All grounds connected? 3. <strong>Continuity test</strong>: Every. Single. Connection. 4. <strong>Check component orientation</strong>: LEDs, electrolytic caps, ICs 5. <strong>Measure voltages</strong>: At every major node 6. <strong>Swap components</strong>: That 555 timer might be dead</p>
          <h3>The \"Binary Search\" Debug</h3>
          <p>Circuit partially works? Split it in half: 1. Disconnect downstream sections 2. Test upstream section alone 3. Works? Problem is downstream 4. Doesn't work? Problem is upstream 5. Repeat until found</p>
          <h2>Advanced Tips</h2>
          <h3>The Scope Probe Ground Problem</h3>
          <p>Long ground clips = noise and ringing. Solution:</p>
          <ul>
            <li>Remove ground clip</li>
            <li>Wrap bare wire around probe ground</li>
            <li>Touch to nearest ground point</li>
            <li>Massive improvement in signal quality</li>
          </ul>
          <h3>Breadboard Capacitance</h3>
          <p>Breadboards add ~2-10pF between adjacent rows. This matters for:</p>
          <ul>
            <li>High-frequency circuits (>1MHz)</li>
            <li>Sensitive analog circuits</li>
            <li>Crystal oscillators</li>
          </ul>
          <h3>The \"Power Supply First\" Rule</h3>
          <p>Before inserting any ICs: 1. Wire all power and ground connections 2. Apply power 3. Check voltages at every IC socket 4. Only then insert ICs</p>
          <p>Saved me from many magic smoke incidents.</p>
          <h2>My Breadboard Kit</h2>
          <p>What's always on my bench:</p>
          <ul>
            <li><strong>Multimeter</strong> with continuity beeper</li>
            <li><strong>Flush cutters</strong> for precise wire trimming</li>
            <li><strong>Wire strippers</strong> (22-24 AWG range)</li>
            <li><strong>Needle-nose pliers</strong> for tight spaces</li>
            <li><strong>Component lead forming tool</strong> (bent paperclip works)</li>
            <li><strong>Magnifying glass</strong> for reading tiny part numbers</li>
            <li><strong>Good lighting</strong> (seriously, get a lamp)</li>
          </ul>
          <h2>Common Breadboard Mistakes</h2>
          <h3>The \"It Worked Yesterday\" Problem</h3>
          <p>Breadboard circuits are temporary. Connections loosen overnight. Always:</p>
          <ul>
            <li>Photograph working circuits</li>
            <li>Document connections</li>
            <li>Expect to debug again tomorrow</li>
          </ul>
          <h3>Parallel Power Rails Confusion</h3>
          <p>Some breadboards have isolated top/bottom rails. Others are connected. Check with continuity tester or suffer mysterious power issues.</p>
          <h3>The Ground Loop Special</h3>
          <p>Multiple ground paths = weird behavior. Use star grounding:</p>
          <ul>
            <li>One point connects to power supply ground</li>
            <li>All other grounds connect to this point</li>
            <li>Not to each other randomly</li>
          </ul>
          <h2>Organization Hacks</h2>
          <h3>The Component Organizer</h3>
          <p>Old film canisters (ask your parents) or pill bottles:</p>
          <ul>
            <li>Label with value ranges</li>
            <li>Resistors: 1-999Ω, 1k-9.9k, etc.</li>
            <li>Capacitors by type: ceramic, electrolytic, etc.</li>
          </ul>
          <h3>The \"Project Box\"</h3>
          <p>One plastic box per project containing:</p>
          <ul>
            <li>All components</li>
            <li>Schematic printout</li>
            <li>Notes and debugging history</li>
            <li>Spare parts</li>
          </ul>
          <h2>When to Give Up on Breadboards</h2>
          <p>Some circuits just won't work on breadboards:</p>
          <ul>
            <li>RF circuits (>10MHz)</li>
            <li>High current (>1A)</li>
            <li>Precision analog</li>
            <li>Anything with ground plane requirements</li>
          </ul>
          <p>Time to learn PCB design!</p>
          <h2>The Zen of Breadboarding</h2>
          <p>After all these hours, I've learned:</p>
          <ul>
            <li>Neat wiring isn't just aesthetic, it's functional</li>
            <li>Document everything, trust nothing</li>
            <li>When frustrated, walk away and return fresh</li>
            <li>Every debugging session teaches something</li>
          </ul>
          <h2>Final Wisdom</h2>
          <p>That circuit that's driving you crazy? It's probably: 1. A loose connection (50%) 2. Wrong component value (20%) 3. Dead component (15%) 4. Actual design error (15%)</p>
          <p>Check in that order.</p>
          <p>Remember: Every engineer has spent hours debugging something stupid. You're in good company. The breadboard is where we learn humility.</p>
          <p>Happy prototyping!</p>
        </div>
      </article>
    </>
  );
}