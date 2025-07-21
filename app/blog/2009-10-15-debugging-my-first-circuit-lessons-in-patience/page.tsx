import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Debugging My First Circuit: Lessons in Patience</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-10-15">October 14, 2009</time>
              <span>•</span>
              <span>4 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">electronics</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">debugging</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">learning</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>\"It worked on the breadboard\" will be on my tombstone. Just spent three hours debugging a simple 555 timer circuit that refused to oscillate. The culprit? A breadboard connection that looked fine but wasn\'t.</p>
            <p>Welcome to hardware debugging, where problems are often invisible.</p>
            <h2>The Circuit That Should Have Worked</h2>
            <p>Simple astable 555 timer:</p>
            <ul>
              <li>555 timer IC</li>
              <li>Two resistors (10kΩ and 100kΩ)</li>
              <li>Capacitor (10µF)</li>
              <li>LED with current limiting resistor</li>
              <li>9V battery</li>
            </ul>
            <p>Should blink at about 1 Hz. Did absolutely nothing.</p>
            <h2>The Debugging Process (aka Descent into Madness)</h2>
            <h3>Hour 1: Check the Obvious</h3>
            <ul>
              <li>Battery voltage: 9.2V ✓</li>
              <li>LED works when connected directly (with resistor) ✓</li>
              <li>555 chip pins in right place ✓</li>
              <li>No smoke ✓</li>
            </ul>
            <p>Must be the connections...</p>
            <h3>Hour 2: Voltage Checks Everywhere</h3>
            <p>Multimeter time. Checked voltage at:</p>
            <ul>
              <li>Pin 8 (Vcc): 9.2V ✓</li>
              <li>Pin 1 (GND): 0V ✓</li>
              <li>Pin 3 (Output): 0V (stuck low) ✗</li>
              <li>Pin 2 (Trigger): 9.2V (should oscillate) ✗</li>
              <li>Pin 6 (Threshold): 9.2V (should oscillate) ✗</li>
            </ul>
            <p>The capacitor wasn\'t charging/discharging. But why?</p>
            <h3>Hour 3: Component by Component</h3>
            <p>Started replacing everything:</p>
            <ul>
              <li>New 555 chip (maybe it\'s dead?)</li>
              <li>New capacitor (could be bad?)</li>
              <li>New resistors (unlikely but desperate)</li>
              <li>New battery (getting paranoid)</li>
            </ul>
            <p>Still nothing.</p>
            <h3>The \"Aha\" Moment</h3>
            <p>Decided to rebuild on different section of breadboard. As I pulled out the 100kΩ resistor, it came out with zero resistance. The breadboard contact was corroded or loose.</p>
            <p>Wiggled every component. Found two more loose connections.</p>
            <p>Rebuilt circuit in fresh breadboard section. Beautiful 1 Hz blinking.</p>
            <p>Three. Hours. For. Loose. Connections.</p>
            <h2>What I Learned</h2>
            <h3>1. Breadboards Are Not Your Friend</h3>
            <ul>
              <li>Cheap breadboards have terrible connections</li>
              <li>Connections loosen over time</li>
              <li>Invisible problems are the worst problems</li>
              <li>Always wiggle test everything</li>
            </ul>
            <h3>2. Systematic Debugging Matters</h3>
            <p>Should have been more systematic:</p>
            <ul>
              <li>Visual inspection (missed the subtle connection issue)</li>
              <li>Power rail verification</li>
              <li>Signal path tracing</li>
              <li>Component substitution</li>
              <li>Full rebuild (should have done earlier)</li>
            </ul>
            <h3>3. Tools Make a Difference</h3>
            <p>Realized I need:</p>
            <ul>
              <li>Better breadboard (ordered quality one)</li>
              <li>Oscilloscope (USB one on Christmas list)</li>
              <li>Logic probe (building one this weekend)</li>
              <li>More patience (working on it)</li>
            </ul>
            <h3>4. Document Everything</h3>
            <p>Started a debugging notebook:</p>
            <ul>
              <li>Circuit diagram</li>
              <li>Expected vs actual measurements</li>
              <li>What I tried</li>
              <li>What worked</li>
            </ul>
            <p>Future me will thank present me.</p>
            <h2>The Hidden Problems in Hardware</h2>
            <p>Unlike software, hardware fails in analog ways:</p>
            <ul>
              <li>Connections can be \"mostly\" connected</li>
              <li>Components can be \"partially\" working</li>
              <li>Temperature changes behavior</li>
              <li>Physical movement changes behavior</li>
              <li>Time degrades everything</li>
            </ul>
            <h2>Debugging Strategies That Work</h2>
            <h3>Visual First</h3>
            <ul>
              <li>Check orientation of polarized components</li>
              <li>Look for solder bridges</li>
              <li>Verify chip notch direction</li>
              <li>Count pins twice</li>
            </ul>
            <h3>Power Then Signal</h3>
            <ul>
              <li>Verify power rails first</li>
              <li>Check grounds (all of them)</li>
              <li>Trace signal path step by step</li>
              <li>Measure, don\'t assume</li>
            </ul>
            <h3>Divide and Conquer</h3>
            <ul>
              <li>Isolate subcircuits</li>
              <li>Test each section independently</li>
              <li>Binary search for problems</li>
              <li>Simplify until it works</li>
            </ul>
            <h3>When All Else Fails</h3>
            <ul>
              <li>Rebuild from scratch</li>
              <li>Use different components</li>
              <li>Try different power supply</li>
              <li>Sleep on it (seriously)</li>
            </ul>
            <h2>The Emotional Journey</h2>
            <ul>
              <li><strong>Confidence</strong>: \"This will take 5 minutes\"</li>
              <li><strong>Confusion</strong>: \"Why isn\'t this working?\"</li>
              <li><strong>Frustration</strong>: \"This should work!\"</li>
              <li><strong>Anger</strong>: \"Electronics is stupid\"</li>
              <li><strong>Bargaining</strong>: \"Please just work\"</li>
              <li><strong>Depression</strong>: \"I\'m terrible at this\"</li>
              <li><strong>Acceptance</strong>: \"Let\'s rebuild everything\"</li>
              <li><strong>Joy</strong>: \"IT BLINKS!\"</li>
            </ul>
            <h2>Tools I Now Appreciate</h2>
            <ul>
              <li><strong>Multimeter</strong>: Best $50 I\'ve spent</li>
              <li><strong>Jumper wires</strong>: Solid core, not stranded</li>
              <li><strong>Good lighting</strong>: Can\'t debug what you can\'t see</li>
              <li><strong>Magnifying glass</strong>: Tiny text on chips</li>
              <li><strong>Coffee</strong>: Debugging fuel</li>
            </ul>
            <h2>The Silver Lining</h2>
            <p>This frustrating experience taught me more than ten working circuits:</p>
            <ul>
              <li>Patience is mandatory, not optional</li>
              <li>Systematic approach saves time</li>
              <li>Good tools are worth the investment</li>
              <li>Every failure is a lesson</li>
              <li>The satisfaction of fixing it is worth the pain</li>
            </ul>
            <h2>Future Debugging Philosophy</h2>
            <ul>
              <li><strong>Assume nothing works</strong> until proven</li>
              <li><strong>Measure everything</strong> twice</li>
              <li><strong>Change one thing</strong> at a time</li>
              <li><strong>Document the process</strong> always</li>
              <li><strong>Take breaks</strong> when frustrated</li>
            </ul>
            <h2>The Working Circuit</h2>
            <p>It\'s beautiful. LED blinking steadily at 1 Hz. Such a simple thing, but I built it, debugged it, and understand every electron\'s path through it.</p>
            <p>Worth every frustrating minute.</p>
            <p><em>Note to self: Buy quality breadboards. And maybe some chocolate for next debugging session.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
