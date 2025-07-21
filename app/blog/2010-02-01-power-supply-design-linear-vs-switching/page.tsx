import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Power Supply Design: Linear vs Switching - Michael D'Angelo",
  description: "Built both linear and switching regulators this week. Here's a practical comparison from someone who melted a heat sink learning the difference.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-02-01-power-supply-design-linear-vs-switching">
        <header>
          <h1 className="text-4xl font-bold mb-4">Power Supply Design: Linear vs Switching</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-02-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 12 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['power-supply', 'linear', 'switching', 'efficiency'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>This week's power electronics lab: Build 5V supplies using both linear and switching regulators. Same spec, vastly different results. Here's what I learned the hard way.</p>
          <h2>The Challenge</h2>
          <p>Design requirements:</p>
          <ul>
            <li>Input: 12V battery</li>
            <li>Output: 5V @ 2A</li>
            <li>Ripple: <50mV</li>
            <li>Efficiency: "as high as possible"</li>
          </ul>
          <p>Two teams: Linear vs Switching. I was on Team Linear. Spoiler: We lost on efficiency.</p>
          <h2>Linear Regulator: The Simple Approach</h2>
          <h3>The Design</h3>
          <p>Used the classic LM7805 regulator.</p>
          <p>Circuit complexity:</p>
          <ul>
            <li>Input capacitor</li>
            <li>LM7805</li>
            <li>Output capacitor</li>
            <li>Done</li>
          </ul>
          <p>Total parts: 3 (plus heat sink... big heat sink)</p>
          <h3>The Build</h3>
          <p>Breadboarded in 5 minutes. Working in 10. "This is easy!" I thought.</p>
          <p>Then we measured efficiency.</p>
          <h3>The Brutal Math</h3>
          <ul>
            <li>Input: 12V @ 0.85A = 10.2W</li>
            <li>Output: 5V @ 2A = 10W</li>
            <li>Efficiency: 10W/10.2W = 98%!</li>
          </ul>
          <p>Wait, that can't be right...</p>
          <p>Oh. Load was only drawing 0.85A, not 2A. Let's force 2A load:</p>
          <ul>
            <li>Input: 12V @ 2A = 24W</li>
            <li>Output: 5V @ 2A = 10W</li>
            <li>Efficiency: 10W/24W = 41.7%</li>
          </ul>
          <p>Where's the other 14W going? Touch the heat sink. OW! That's where.</p>
          <h3>Heat Sink Calculations</h3>
          <p>Power dissipation: (12V - 5V) × 2A = 14W</p>
          <p>LM7805 thermal resistance: 5°C/W junction-to-case Required heat sink: Less than 3°C/W to keep under 100°C</p>
          <p>That's a BIG heat sink. Like, computer CPU cooler big.</p>
          <h3>Linear Regulator Reality</h3>
          <p>Pros:</p>
          <ul>
            <li>Dead simple</li>
            <li>Low noise (measured <5mV ripple)</li>
            <li>No EMI</li>
            <li>Cheap ($1 for regulator)</li>
            <li>Fast transient response</li>
          </ul>
          <p>Cons:</p>
          <ul>
            <li>Terrible efficiency at large voltage drops</li>
            <li>Massive heat generation</li>
            <li>Big heat sink = not cheap</li>
            <li>Size and weight</li>
          </ul>
          <h2>Switching Regulator: The Efficient Approach</h2>
          <p>Watched Team Switching build theirs. Way more complex.</p>
          <h3>Their Design</h3>
          <p>Used MC34063 switching controller (old but educational).</p>
          <p>Parts list:</p>
          <ul>
            <li>MC34063 IC</li>
            <li>Inductor (big one)</li>
            <li>Schottky diode</li>
            <li>Timing capacitor</li>
            <li>Feedback resistors</li>
            <li>Input/output capacitors</li>
            <li>Current sense resistor</li>
          </ul>
          <p>Total parts: ~15</p>
          <h3>The Theory (Simplified)</h3>
          <p>Instead of burning excess power as heat, switching regulators: 1. Turn on, connect input to output through inductor 2. Current builds in inductor 3. Turn off, inductor current continues through diode 4. Repeat at high frequency (52kHz in their case) 5. Output capacitor smooths to DC</p>
          <p>It's like filling a bucket with rapid small pours instead of continuous flow.</p>
          <h3>Their Results</h3>
          <p>After 3 hours of debugging (vs our 10 minutes):</p>
          <ul>
            <li>Input: 12V @ 0.92A = 11W</li>
            <li>Output: 5V @ 2A = 10W</li>
            <li>Efficiency: 10W/11W = 91%!</li>
          </ul>
          <p>But:</p>
          <ul>
            <li>Ripple: 125mV (worse than spec)</li>
            <li>EMI: Oscilloscope probe picked up noise 6 inches away</li>
            <li>Cost: ~$5 in parts</li>
          </ul>
          <h3>The Smell of Victory (and Burning Inductors)</h3>
          <p>First attempt: Undersized inductor. Magic smoke at 1.5A load.</p>
          <p>Key lesson: Inductor saturation current matters! When inductors saturate:</p>
          <ul>
            <li>Inductance drops</li>
            <li>Current spikes</li>
            <li>Things burn</li>
          </ul>
          <p>Second inductor: 3A rated. Worked perfectly.</p>
          <h2>Head-to-Head Comparison</h2>
          <p>Built both side by side for testing:</p>
          <h3>Efficiency Across Loads</h3>
          <p>Load: 0.1A</p>
          <ul>
            <li>Linear: 41% (same as 2A!)</li>
            <li>Switching: 78%</li>
          </ul>
          <p>Load: 1A</p>
          <ul>
            <li>Linear: 41%</li>
            <li>Switching: 89%</li>
          </ul>
          <p>Load: 2A</p>
          <ul>
            <li>Linear: 41%</li>
            <li>Switching: 91%</li>
          </ul>
          <p>Linear efficiency depends on voltage drop, not load. Mind = blown.</p>
          <h3>Transient Response</h3>
          <p>Applied step load (0.5A to 1.5A):</p>
          <p>Linear: 10μs recovery, 20mV dip Switching: 200μs recovery, 150mV dip</p>
          <p>Linear wins for fast loads.</p>
          <h3>Noise Comparison</h3>
          <p>Spectrum analyzer reveals all:</p>
          <p>Linear: Noise floor (-80dBm) Switching: Spikes at 52kHz and harmonics</p>
          <p>For sensitive analog? Linear. For digital? Switching is fine.</p>
          <h3>Temperature After 1 Hour</h3>
          <p>Linear: Heat sink at 95°C (ouch) Switching: Inductor at 45°C (warm)</p>
          <p>No contest on thermal management.</p>
          <h2>When to Use What</h2>
          <h3>Use Linear When:</h3>
          <ul>
            <li>Low current (<500mA)</li>
            <li>Small voltage drop (Vin - Vout < 3V)</li>
            <li>Noise sensitive (audio, RF, precision analog)</li>
            <li>Simplicity matters</li>
            <li>Cost sensitive at low power</li>
          </ul>
          <h3>Use Switching When:</h3>
          <ul>
            <li>High current</li>
            <li>Large voltage drop</li>
            <li>Battery powered (efficiency = battery life)</li>
            <li>Size/weight matters</li>
            <li>Heat is a problem</li>
          </ul>
          <h2>Real Design Example</h2>
          <p>Designing power for my CubeSat project:</p>
          <p>Input: 7.4V battery Outputs needed:</p>
          <ul>
            <li>5V @ 500mA (digital)</li>
            <li>3.3V @ 1A (processor)</li>
            <li>±12V @ 50mA (analog)</li>
          </ul>
          <p>My solution:</p>
          <ul>
            <li>5V: Switching (efficiency matters)</li>
            <li>3.3V: Switching (from 5V rail)</li>
            <li>±12V: Linear (low current, low noise needed)</li>
          </ul>
          <p>Best of both worlds!</p>
          <h2>Modern Solutions</h2>
          <p>Discovered integrated modules:</p>
          <ul>
            <li>Buck modules: $2 on eBay, 3A, tiny</li>
            <li>No external inductor needed</li>
            <li>Just add capacitors</li>
          </ul>
          <p>But you learn nothing using modules. Build discretely first, use modules later.</p>
          <h2>Lab Disasters and Lessons</h2>
          <h3>Team Linear\'s Melted Breadboard</h3>
          <p>Forgot heat sink initially. LM7805 got so hot it melted breadboard plastic. Lesson: Thermal protection exists for a reason.</p>
          <h3>Team Switching\'s Oscillation</h3>
          <p>Their first attempt oscillated at 3MHz instead of 52kHz. Wrong inductor value. Scope showed beautiful sine wave... at wrong frequency.</p>
          <h3>My Blown Capacitor  </h3>
          <p>Put electrolytic backwards on switching output. POP! Aluminum confetti everywhere. Lesson: Polarity matters, even "after" the diode.</p>
          <h2>Practical Tips</h2>
          <h3>For Linear Designs:</h3>
          <p>1. Calculate heat dissipation FIRST 2. Use TO-220 package for >1W dissipation 3. Thermal compound on heat sink 4. Add protection diodes 5. Parallel regulators for current sharing</p>
          <h3>For Switching Designs:</h3>
          <p>1. Layout is CRITICAL (short, wide traces) 2. Use recommended inductor values 3. Schottky diodes only (fast recovery) 4. Keep feedback path away from noise 5. Add input filter to prevent conducted EMI</p>
          <h2>The Future is Switching</h2>
          <p>New switching tech is amazing:</p>
          <ul>
            <li>Synchronous rectification (95%+ efficiency)</li>
            <li>GaN FETs (smaller, faster)</li>
            <li>Digital control (programmable output)</li>
            <li>Multi-phase (ripple cancellation)</li>
          </ul>
          <p>But fundamentals remain: Energy storage in magnetics vs dissipation as heat.</p>
          <h2>Cost Analysis (Student Budget Edition)</h2>
          <p>5V @ 2A supply total cost:</p>
          <ul>
            <li>Linear: $1 (IC) + $8 (heat sink) = $9</li>
            <li>Switching: $5 (parts) + $0 (no heat sink) = $5</li>
          </ul>
          <p>Switching wins on total system cost!</p>
          <h2>What This Taught Me</h2>
          <p>1. <strong>No perfect solution</strong>: Always tradeoffs 2. <strong>Efficiency has a cost</strong>: Complexity 3. <strong>Theory vs practice</strong>: Parasitic elements matter 4. <strong>Thermal is crucial</strong>: Heat kills electronics 5. <strong>Start simple</strong>: Linear first, then switching</p>
          <h2>Next Steps</h2>
          <p>Building a bench supply with both:</p>
          <ul>
            <li>Switching pre-regulator (efficiency)</li>
            <li>Linear post-regulator (low noise)</li>
            <li>Best of both worlds</li>
          </ul>
          <h2>Final Thoughts</h2>
          <p>A year ago, "power supply" meant wall wart. Now I understand the engineering inside.</p>
          <p>Both topologies have their place. Smart engineers know when to use which.</p>
          <p>Also, always use a heat sink. Burned fingers teach unforgettable lessons.</p>
          <p><em>Currently designing switching supply for robot project. Goal: 90% efficiency. Will document the inevitable magic smoke releases.</em></p>
        </div>
      </article>
    </>
  );
}