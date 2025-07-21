import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Understanding Ohm's Law: More Than V=IR</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-10-01">September 30, 2009</time>
              <span>•</span>
              <span>4 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">electronics</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">learning</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">fundamentals</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Every electronics journey starts with Ohm\'s Law. V = IR. Voltage equals current times resistance. Simple, right?</p>
            <p>Not really. Two weeks into actually building circuits, I\'m realizing this \"simple\" equation is profound.</p>
            <h2>The Equation Everyone Knows</h2>
            <p>V = IR. Or rearranged:</p>
            <ul>
              <li>I = V/R (current equals voltage divided by resistance)</li>
              <li>R = V/I (resistance equals voltage divided by current)</li>
            </ul>
            <p>My high school physics teacher wrote it on the board, we memorized it, done. But that\'s like saying you understand cooking because you know heat + food = cooked food.</p>
            <h2>What It Actually Means</h2>
            <h3>Voltage: The Push</h3>
            <p>Voltage isn\'t electricity - it\'s electrical pressure. Like water pressure in pipes:</p>
            <ul>
              <li>Higher voltage = stronger push</li>
              <li>No voltage difference = no current flow</li>
              <li>Voltage can exist without current (open circuit)</li>
            </ul>
            <p>Built a simple LED circuit today. 9V battery, 470Ω resistor, LED. The battery provides \"pressure,\" the resistor restricts flow, the LED uses energy.</p>
            <h3>Current: The Flow</h3>
            <p>Current is the actual movement of electrons. Measured in amperes (amps):</p>
            <ul>
              <li>1 amp = 6.24 × 10^18 electrons per second</li>
              <li>That\'s 6,240,000,000,000,000,000 electrons. Per second.</li>
              <li>Through a wire the size of a human hair</li>
            </ul>
            <p>Mind = blown.</p>
            <h3>Resistance: The Opposition</h3>
            <p>Everything opposes electron flow to some degree:</p>
            <ul>
              <li>Conductors: very low resistance</li>
              <li>Insulators: very high resistance  </li>
              <li>Semiconductors: controllable resistance (that\'s the magic)</li>
            </ul>
            <p>Even wire has resistance. Found out the hard way when my long jumper wires caused voltage drop.</p>
            <h2>Real-World Revelations</h2>
            <h3>Power Loss in Wires</h3>
            <p>P = I²R. Power loss is proportional to current squared. That\'s why:</p>
            <ul>
              <li>Power lines use high voltage (lower current for same power)</li>
              <li>Thick wires needed for high current</li>
              <li>Your phone charger cable can get warm</li>
            </ul>
            <h3>Voltage Dividers Everywhere</h3>
            <p>Two resistors in series create a voltage divider. This pattern is everywhere:</p>
            <ul>
              <li>Volume controls</li>
              <li>Sensor interfaces</li>
              <li>Reference voltages</li>
              <li>Even inside chips</li>
            </ul>
            <p>Built one with a potentiometer today. Turning the knob and watching voltage change on the multimeter was oddly satisfying.</p>
            <h3>Current Is The Same Through Series Components</h3>
            <p>This took me embarrassingly long to really grasp. In a series circuit:</p>
            <ul>
              <li>Same current flows through everything</li>
              <li>Different components drop different voltages</li>
              <li>But current is identical</li>
            </ul>
            <p>Like water through different sized pipes in series - flow rate is constant, pressure drops vary.</p>
            <h2>The Non-Ideal Reality</h2>
            <p>Textbook Ohm\'s Law assumes ideal components. Reality laughs:</p>
            <ul>
              <li>Resistors change with temperature</li>
              <li>Wires have resistance and inductance</li>
              <li>Capacitors have resistance (ESR)</li>
              <li>Nothing is truly linear</li>
            </ul>
            <p>My \"1kΩ\" resistor? Actually 983Ω. And it changes when it heats up.</p>
            <h2>Practical Applications</h2>
            <p>Started applying this understanding:</p>
            <h3>LED Current Limiting</h3>
            <p>LED needs ~20mA, forward voltage ~2V. With 9V battery:</p>
            <ul>
              <li>Voltage across resistor: 9V - 2V = 7V</li>
              <li>Needed resistance: R = 7V / 0.02A = 350Ω</li>
              <li>Used 330Ω (standard value), gives 21mA. Close enough.</li>
            </ul>
            <p>Without Ohm\'s Law? Magic smoke.</p>
            <h3>Measuring Unknown Resistance</h3>
            <p>Multimeter broken? No problem:</p>
            <ul>
              <li>Apply known voltage</li>
              <li>Measure current</li>
              <li>Calculate: R = V/I</li>
            </ul>
            <p>Used this to find resistance of random components. Pencil graphite: ~10kΩ/inch. Cool!</p>
            <h2>The Deeper Understanding</h2>
            <p>Ohm\'s Law isn\'t just about circuits. It\'s about relationships:</p>
            <ul>
              <li>Cause (voltage) creates effect (current) moderated by property (resistance)</li>
              <li>Similar to F = ma in mechanics</li>
              <li>Or flow = pressure/resistance in hydraulics</li>
            </ul>
            <p>It\'s a fundamental pattern of how the universe works.</p>
            <h2>Common Misconceptions (That I Had)</h2>
            <ul>
              <li><strong>\"Current flows from positive to negative\"</strong> - Conventional current does. Electrons flow opposite. Confused me for days.</li>
            </ul>
            <ul>
              <li><strong>\"Resistance uses up current\"</strong> - No! Resistance causes voltage drop. Current same on both sides.</li>
            </ul>
            <ul>
              <li><strong>\"More voltage always means more current\"</strong> - Only if resistance stays constant. </li>
            </ul>
            <ul>
              <li><strong>\"Ohm\'s Law applies to everything\"</strong> - Nope. Diodes, transistors, and other non-linear components laugh at your linear assumptions.</li>
            </ul>
            <h2>Building Intuition</h2>
            <p>Starting to develop circuit intuition:</p>
            <ul>
              <li>See 10kΩ with 5V? Think \"0.5mA\"</li>
              <li>See LED without resistor? Think \"fire\"</li>
              <li>See parallel resistors? Think \"less than smallest\"</li>
            </ul>
            <p>It\'s becoming automatic. That\'s when you know you\'re getting it.</p>
            <h2>Next Steps</h2>
            <p>Now that I truly get Ohm\'s Law:</p>
            <ul>
              <li>Kirchhoff\'s Laws (sum of currents, sum of voltages)</li>
              <li>AC circuits (where everything gets complex - literally)</li>
              <li>Semiconductor physics (where Ohm breaks down)</li>
            </ul>
            <p>But everything builds on this foundation.</p>
            <h2>The Beautiful Simplicity</h2>
            <p>V = IR. Three variables. One relationship. Infinite applications.</p>
            <p>From nano-scale transistors to continental power grids, this simple equation governs electron flow. Master it, and you\'re on your way to mastering electronics.</p>
            <p>Even if your roommate thinks you\'re crazy for getting excited about it at 2 AM.</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
