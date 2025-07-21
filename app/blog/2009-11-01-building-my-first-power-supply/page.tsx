import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Building My First Power Supply - Michael D'Angelo",
  description: "Designing and building a variable bench power supply from scratch - transformer, rectification, regulation, and lots of learning.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-11-01-building-my-first-power-supply">
        <header>
          <h1 className="text-4xl font-bold mb-4">Building My First Power Supply</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-11-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 12 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['electronics', 'power-supply', 'projects', 'diy'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Every electronics hobbyist needs a good bench power supply. Instead of buying one, I decided to build my own. Here's my journey from wall outlet to regulated DC, with all the mistakes and victories along the way.</p>
          <h2>The Requirements</h2>
          <p>What I needed:</p>
          <ul>
            <li>Variable voltage: 0-15V</li>
            <li>Current capacity: At least 1A</li>
            <li>Current limiting (to save components during oops moments)</li>
            <li>Voltage and current displays</li>
            <li>Clean output (minimal ripple)</li>
          </ul>
          <p>Budget: $50 (college student reality)</p>
          <h2>The Design Process</h2>
          <h3>Starting with the Basics</h3>
          <p>AC wall outlet → Transformer → Rectifier → Filter → Regulator → Output</p>
          <p>Simple, right? (Narrator: It wasn't simple)</p>
          <h3>Component Selection</h3>
          <p><strong>Transformer</strong>: Found a 18V, 2A transformer at a surplus store ($10)</p>
          <ul>
            <li>Why 18V for 15V output? Dropout voltage for regulator</li>
            <li>Why 2A for 1A output? Efficiency and heat</li>
          </ul>
          <p><strong>Rectifier</strong>: Built a bridge rectifier with 1N4007 diodes</p>
          <ul>
            <li>PIV rating: 1000V (overkill but safe)</li>
            <li>Current rating: 1A each</li>
            <li>Cost: $0.40 total</li>
          </ul>
          <p><strong>Filter Capacitor</strong>: 4700μF, 35V electrolytic</p>
          <ul>
            <li>Bigger = less ripple</li>
            <li>Voltage rating 2x expected max</li>
            <li>Cost: $3</li>
          </ul>
          <p><strong>Regulator</strong>: LM317 adjustable regulator</p>
          <ul>
            <li>1.2V to 37V output range</li>
            <li>1.5A capacity</li>
            <li>Built-in thermal protection</li>
            <li>Cost: $1.50</li>
          </ul>
          <h2>The Build</h2>
          <h3>The Scary Part: Working with AC Mains</h3>
          <p>First time working with 120V AC. Safety first:</p>
          <ul>
            <li>Unplugged while wiring</li>
            <li>Heat shrink on all connections</li>
            <li>Fuse on the input (learned this after blowing a breaker)</li>
            <li>Grounded metal case</li>
          </ul>
          <h3>Rectification and Filtering</h3>
          <p>Built the bridge rectifier on perfboard. First measurement: 25V DC with 3V of ripple. That's... not good.</p>
          <p>Problem: 4700μF wasn't enough. Solution: Parallel another 4700μF. Ripple dropped to 0.5V. Much better!</p>
          <h3>The Regulation Stage</h3>
          <p>LM317 circuit is deceptively simple:</p>
          <ul>
            <li>R1: 240Ω from output to adjust pin</li>
            <li>R2: 5kΩ potentiometer from adjust to ground</li>
            <li>Output voltage = 1.25 × (1 + R2/R1)</li>
          </ul>
          <p>First test: Magic smoke! Forgot the heat sink. LM317 #2 worked better.</p>
          <h3>Adding Meters</h3>
          <p>Digital meters from eBay:</p>
          <ul>
            <li>Voltage: 0-30V LED display ($4)</li>
            <li>Current: 0-10A LED display ($5)</li>
          </ul>
          <p>Current sensing through 0.1Ω, 5W resistor. Ohm's law: V = IR, so 1A = 0.1V drop.</p>
          <h2>The Enclosure</h2>
          <p>Old computer power supply case (free from recycling):</p>
          <ul>
            <li>Already has AC input and fan</li>
            <li>Plenty of room</li>
            <li>Metal for shielding</li>
            <li>Looks somewhat professional</li>
          </ul>
          <p>Cutting square holes for meters = harder than expected. Dremel is your friend.</p>
          <h2>Problems and Solutions</h2>
          <h3>Oscillation Issues</h3>
          <p>Output was oscillating at 100kHz. Invisible to multimeter, obvious on scope.</p>
          <p>Solution:</p>
          <ul>
            <li>0.1μF ceramic capacitor on LM317 input</li>
            <li>10μF electrolytic on output</li>
            <li>Keep leads short</li>
          </ul>
          <h3>Heat Management</h3>
          <p>At full load, LM317 dissipates: (18V - 5V) × 1A = 13W</p>
          <p>That's HOT. Solutions:</p>
          <ul>
            <li>Massive heat sink from old PC</li>
            <li>Thermal paste (important!)</li>
            <li>Case fan running constantly</li>
          </ul>
          <h3>Current Limiting</h3>
          <p>Added a second LM317 as current regulator:</p>
          <ul>
            <li>Series resistor sets max current</li>
            <li>LED indicates current limit mode</li>
            <li>Saves components during short circuits</li>
          </ul>
          <h2>Testing and Calibration</h2>
          <h3>Ripple Measurement</h3>
          <p>At 1A load:</p>
          <ul>
            <li>15V output: <10mV ripple</li>
            <li>5V output: <5mV ripple</li>
          </ul>
          <p>Good enough for most projects!</p>
          <h3>Load Testing</h3>
          <p>Used power resistors as dummy loads:</p>
          <ul>
            <li>15Ω = 1A at 15V</li>
            <li>5Ω = 1A at 5V</li>
          </ul>
          <p>Ran for 1 hour at full load. Warm but stable.</p>
          <h3>Accuracy Check</h3>
          <p>Compared to lab power supply:</p>
          <ul>
            <li>Set to 5.00V, measured 4.98V</li>
            <li>Set to 12.00V, measured 11.95V</li>
          </ul>
          <p>Within 1% - I'll take it!</p>
          <h2>Lessons Learned</h2>
          <p>1. <strong>Transformers are heavy</strong>: And expensive when bought new 2. <strong>Heat sinks matter</strong>: More than you think 3. <strong>Measure twice, cut once</strong>: Especially on enclosures 4. <strong>Capacitors store energy</strong>: Discharge before working! 5. <strong>Datasheets are crucial</strong>: Read them completely</p>
          <h2>Cost Breakdown</h2>
          <ul>
            <li>Transformer: $10 (surplus)</li>
            <li>Capacitors: $6</li>
            <li>LM317s: $3</li>
            <li>Diodes: $1</li>
            <li>Meters: $9</li>
            <li>Enclosure: Free</li>
            <li>Hardware/misc: $8</li>
            <li>Heat sink: $5 (surplus)</li>
          </ul>
          <p>Total: $42 (under budget!)</p>
          <h2>Future Improvements</h2>
          <p>Version 2 ideas:</p>
          <ul>
            <li>Dual outputs for ±15V</li>
            <li>Fine/coarse voltage adjustment</li>
            <li>USB charging port</li>
            <li>Battery backup option</li>
            <li>Overcurrent protection circuit</li>
          </ul>
          <h2>Was It Worth It?</h2>
          <p>Absolutely! I now have:</p>
          <ul>
            <li>A custom power supply that meets my needs</li>
            <li>Deep understanding of power supply design</li>
            <li>Confidence to work with AC mains (safely)</li>
            <li>Cool project for my resume</li>
          </ul>
          <p>Plus, the satisfaction of using equipment you built yourself is priceless.</p>
          <h2>Resources for Others</h2>
          <p>If you want to build one:</p>
          <ul>
            <li>Start with a kit first (safer for AC mains newcomers)</li>
            <li>LM317 calculator: www.electronics-tutorials.com</li>
            <li>Always use a fuse!</li>
            <li>Test with low voltage first</li>
          </ul>
          <p>Remember: Electricity demands respect. Be safe, take your time, and enjoy the process of creating something useful!</p>
          <p>Next project: Dual-rail supply for op-amp circuits. The adventure continues!</p>
        </div>
      </article>
    </>
  );
}