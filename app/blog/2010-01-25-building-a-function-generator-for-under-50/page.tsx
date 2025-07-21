import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Building a Function Generator for Under $50 - Michael D'Angelo",
  description: "Tired of borrowing the lab's function generator, I built my own. Here's how to build a versatile signal source on a student budget.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-01-25-building-a-function-generator-for-under-50">
        <header>
          <h1 className="text-4xl font-bold mb-4">Building a Function Generator for Under $50</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-01-25').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 11 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['test-equipment', 'function-generator', 'diy', 'analog'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>The lab has three function generators. The class has 30 students. You do the math. Time to build my own! Here's how I created a surprisingly capable function generator for the price of a textbook.</p>
          <h2>Why Build Your Own?</h2>
          <p>Besides availability issues:</p>
          <ul>
            <li>Learn how signal generation actually works</li>
            <li>Customize for your specific needs</li>
            <li>Save money (commercial ones are $300+)</li>
            <li>Because you can</li>
          </ul>
          <h2>Design Requirements</h2>
          <p>What I needed:</p>
          <ul>
            <li>Sine, square, and triangle waves</li>
            <li>1Hz to 1MHz frequency range</li>
            <li>Adjustable amplitude (0-10V)</li>
            <li>DC offset control</li>
            <li>TTL output for logic circuits</li>
            <li>Total budget: $50</li>
          </ul>
          <h2>The Design Evolution</h2>
          <h3>Attempt 1: 555 Timer (Failed)</h3>
          <p>First thought: 555 timer does square waves, just filter for sine!</p>
          <p>Reality:</p>
          <ul>
            <li>Frequency changes = filter needs change</li>
            <li>Limited frequency range</li>
            <li>Terrible sine waves</li>
          </ul>
          <p>Lesson: 555s are great for many things, not this.</p>
          <h3>Attempt 2: Wien Bridge Oscillator (Partially Worked)</h3>
          <p>Classic analog approach using op-amp.</p>
          <p>Pros:</p>
          <ul>
            <li>Beautiful sine waves</li>
            <li>Simple circuit</li>
          </ul>
          <p>Cons:</p>
          <ul>
            <li>Frequency changes require dual ganged pot (expensive)</li>
            <li>Limited range without switching components</li>
            <li>No other waveforms</li>
          </ul>
          <p>Good learning experience, but not practical.</p>
          <h3>Attempt 3: XR2206 Function Generator IC (Success!)</h3>
          <p>Found this amazing chip that does everything.</p>
          <p>The XR2206:</p>
          <ul>
            <li>Sine, square, triangle outputs</li>
            <li>0.01Hz to 1MHz range</li>
            <li>Single resistor frequency control</li>
            <li>Internal everything</li>
          </ul>
          <p>Exactly what I needed!</p>
          <h2>The Build</h2>
          <h3>Core Circuit</h3>
          <pre className="language-text"><code>{`XR2206 connections:
- Timing capacitor: Selectable (1nF to 10μF)
- Timing resistor: 10k pot for fine control
- Amplitude control: 50k pot
- DC offset: Another 50k pot
- Output buffer: TL072 op-amp`}</code></pre>
          <h3>Frequency Range Switching</h3>
          <p>Used a rotary switch to select timing capacitors:</p>
          <ul>
            <li>10μF: 0.01Hz - 10Hz</li>
            <li>1μF: 0.1Hz - 100Hz</li>
            <li>100nF: 1Hz - 1kHz</li>
            <li>10nF: 10Hz - 10kHz</li>
            <li>1nF: 100Hz - 100kHz</li>
            <li>100pF: 1kHz - 1MHz</li>
          </ul>
          <p>Six ranges with 1000:1 adjustment each = huge coverage!</p>
          <h3>Output Stage</h3>
          <p>Added TL072 dual op-amp:</p>
          <ul>
            <li>First stage: Buffer and amplitude control</li>
            <li>Second stage: DC offset addition</li>
            <li>Protection: 1kΩ series resistor</li>
            <li>BNC connector for proper connection</li>
          </ul>
          <h3>TTL Output</h3>
          <p>Bonus feature! Used comparator (LM311) on square wave:</p>
          <ul>
            <li>Always 0-5V output</li>
            <li>Perfect for digital circuits</li>
            <li>Separate BNC connector</li>
          </ul>
          <h3>Power Supply</h3>
          <p>Needed ±12V for op-amps. Solutions considered: 1. Wall wart + DC-DC converter (expensive) 2. Batteries (annoying) 3. USB + boost converters (chose this!)</p>
          <p>Used two MT3608 boost modules:</p>
          <ul>
            <li>USB in → +12V and -12V out</li>
            <li>Added linear regulators for clean power</li>
            <li>Works from any USB port!</li>
          </ul>
          <h2>The Enclosure</h2>
          <p>Found aluminum project box at surplus store: $5</p>
          <p>Layout:</p>
          <ul>
            <li>Front: Frequency/amplitude/offset knobs, range switch</li>
            <li>Back: Power input, main output, TTL output</li>
            <li>Top: Waveform selector switch</li>
          </ul>
          <p>Drilling aluminum tip: Step bits are your friend. Regular bits grab and tear.</p>
          <h2>Calibration Adventure</h2>
          <h3>Frequency Calibration</h3>
          <p>Used frequency counter (that I built last month!) to calibrate.</p>
          <p>Process: 1. Set to each range 2. Adjust trimmer caps 3. Mark dial with actual frequencies</p>
          <p>Achieved ±2% accuracy across range. Good enough!</p>
          <h3>Amplitude Calibration  </h3>
          <p>Borrowed scope from lab (ironic, I know).</p>
          <p>Marked knob for common values:</p>
          <ul>
            <li>1V, 2V, 5V, 10V peak-to-peak</li>
          </ul>
          <h3>Distortion Trimming</h3>
          <p>XR2206 has distortion adjustment for sine waves.</p>
          <p>Before adjustment: 5% THD After adjustment: 0.5% THD</p>
          <p>Not audio-grade, but fine for testing.</p>
          <h2>Cost Breakdown</h2>
          <ul>
            <li>XR2206 IC: $8 (eBay)</li>
            <li>TL072 op-amp: $1</li>
            <li>LM311 comparator: $1</li>
            <li>MT3608 modules (2): $4</li>
            <li>Capacitors (kit): $5</li>
            <li>Resistors/pots: $8</li>
            <li>BNC connectors (3): $6</li>
            <li>Enclosure: $5</li>
            <li>Switch/knobs: $7</li>
            <li>Misc (wire, PCB): $5</li>
          </ul>
          <p>Total: $50 exactly!</p>
          <h2>Performance Tests</h2>
          <h3>Frequency Range</h3>
          <p>Spec: 1Hz - 1MHz Actual: 0.1Hz - 1.2MHz Overdelivered!</p>
          <h3>Rise Time</h3>
          <p>Square wave: <50ns Good enough for most digital work.</p>
          <h3>Amplitude Stability</h3>
          <p>±0.1dB from 10Hz to 100kHz Rolls off above that, but still usable.</p>
          <h2>Real-World Use Cases</h2>
          <p>Already used it for: 1. <strong>Testing audio amp</strong>: 1kHz sine wave 2. <strong>Clock for digital project</strong>: 10kHz square wave 3. <strong>Filter response testing</strong>: Swept 10Hz to 10kHz 4. <strong>PWM simulation</strong>: Variable duty cycle square wave 5. <strong>LED fading</strong>: 0.5Hz triangle wave</p>
          <h2>Lessons Learned</h2>
          <h3>What Went Right</h3>
          <ul>
            <li>XR2206 is amazing for the price</li>
            <li>USB power was brilliant choice</li>
            <li>Range switching gives huge flexibility</li>
            <li>TTL output super useful</li>
          </ul>
          <h3>What I\'d Change</h3>
          <ul>
            <li>Add frequency counter display</li>
            <li>Include sweep function</li>
            <li>Better knobs (these feel cheap)</li>
            <li>Silk screen labels (hand written = ugly)</li>
          </ul>
          <h2>Comparing to Commercial Units</h2>
          <p>Lab's HP 33120A:</p>
          <ul>
            <li>Frequency accuracy: 0.001% (mine: 2%)</li>
            <li>More waveforms (arbitrary, noise)</li>
            <li>GPIB interface</li>
            <li>Price: $1500</li>
          </ul>
          <p>For student use, mine does 90% of what the HP does at 3% of the cost.</p>
          <h2>Future Upgrades</h2>
          <p>Planning version 2:</p>
          <ul>
            <li>Microcontroller for digital control</li>
            <li>LCD showing frequency/amplitude</li>
            <li>Sweep and modulation functions</li>
            <li>Maybe DDS chip for better accuracy</li>
          </ul>
          <p>But for now, this works great!</p>
          <h2>Build Tips</h2>
          <p>If you build one: 1. <strong>Use IC socket</strong>: XR2206 is expensive to kill 2. <strong>Good capacitors</strong>: Timing caps affect stability 3. <strong>Shield sensitive areas</strong>: 1MHz signals radiate 4. <strong>Add test points</strong>: Debugging made easier 5. <strong>Heat sink regulators</strong>: They get warm</p>
          <h2>The Best Part</h2>
          <p>No more waiting for lab equipment! Need a signal at 2AM? Got it. Want to test something at home? No problem.</p>
          <h2>Educational Value</h2>
          <p>Building this taught:</p>
          <ul>
            <li>Analog circuit design</li>
            <li>Power supply design</li>
            <li>Enclosure fabrication</li>
            <li>Calibration techniques</li>
            <li>Cost/performance tradeoffs</li>
          </ul>
          <p>Worth way more than $50 in education.</p>
          <h2>Resources</h2>
          <ul>
            <li>XR2206 datasheet (incredibly detailed)</li>
            <li>Elliott Sound Products function gen article</li>
            <li>EEVblog forum (answered my questions)</li>
          </ul>
          <h2>Final Thoughts</h2>
          <p>Is it perfect? No. Is it good enough? Absolutely. Did I learn a ton? Definitely.</p>
          <p>Sometimes "good enough" is perfect for a student.</p>
          <p>Next project: Digital oscilloscope to go with it. Complete test bench for under $100!</p>
          <p><em>Update: Just helped three classmates build their own. Starting a cottage industry here...</em></p>
        </div>
      </article>
    </>
  );
}