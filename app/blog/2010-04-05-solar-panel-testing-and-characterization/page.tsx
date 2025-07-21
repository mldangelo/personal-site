import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Solar Panel Testing and Characterization - Michael D'Angelo",
  description: "Testing solar panels for our CubeSat. Learning how to measure I-V curves, calculate efficiency, and predict space performance.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-04-05-solar-panel-testing-and-characterization">
        <header>
          <h1 className="text-4xl font-bold mb-4">Solar Panel Testing and Characterization</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-04-05').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 14 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['solar', 'testing', 'cubesat', 'power'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Got our CubeSat solar cells! Tiny 30% efficient GaAs cells that cost more than my car. Time to test them thoroughly before trusting them in space. Here's my deep dive into solar panel characterization.</p>
          <h2>The Test Subjects</h2>
          <p>Received:</p>
          <ul>
            <li>10x Spectrolab UTJ cells</li>
            <li>28.5% efficiency (claimed)</li>
            <li>2.4W per cell at AM0</li>
            <li>$200 each (gulp)</li>
          </ul>
          <p>Handle with extreme care!</p>
          <h2>Building a Solar Simulator</h2>
          <p>Can't test with sunlight - too variable. Built simulator:</p>
          <h3>Light Source</h3>
          <ul>
            <li>500W halogen work light</li>
            <li>Color temperature: 3200K (not ideal)</li>
            <li>Solution: Blue filter to approximate solar spectrum</li>
          </ul>
          <h3>Calibration</h3>
          <p>Borrowed pyranometer from meteorology department:</p>
          <ul>
            <li>Measured: 850 W/m²</li>
            <li>Needed: 1367 W/m² (AM0)</li>
            <li>Moved light closer, added second lamp</li>
          </ul>
          <h3>Reference Cell</h3>
          <p>Silicon reference cell with known calibration:</p>
          <ul>
            <li>Provides standard for intensity</li>
            <li>Accounts for spectrum differences</li>
            <li>Temperature compensated</li>
          </ul>
          <h2>The I-V Curve Tracer</h2>
          <p>Built automated system to trace current-voltage characteristics:</p>
          <h3>Hardware</h3>
          <ul>
            <li>Electronic load (MOSFET + op-amp)</li>
            <li>Current sense resistor (0.1Ω precision)</li>
            <li>16-bit ADC for measurements</li>
            <li>Temperature sensor on cell</li>
          </ul>
          <h3>Software Approach</h3>
          <pre className="language-python"><code>{`def trace_iv_curve(cell, light_intensity):
    voltages = []
    currents = []
    
    for v in numpy.linspace(0, voc, 100):
        set_load_voltage(v)
        time.sleep(0.1)  # Settle
        
        current = measure_current()
        voltages.append(v)
        currents.append(current)
    
    return voltages, currents`}</code></pre>
          <h3>Key Parameters Extracted</h3>
          <ul>
            <li>Isc: Short circuit current</li>
            <li>Voc: Open circuit voltage</li>
            <li>Pmax: Maximum power point</li>
            <li>FF: Fill factor = Pmax/(Isc × Voc)</li>
          </ul>
          <h2>First Test Results</h2>
          <p>Room temperature, 1 sun intensity:</p>
          <ul>
            <li>Isc: 520mA</li>
            <li>Voc: 2.7V</li>
            <li>Pmax: 1.1W</li>
            <li>Fill factor: 0.78</li>
          </ul>
          <p>That's... less than spec. What's wrong?</p>
          <h2>Temperature Effects</h2>
          <p>Solar cells hate heat. Built temperature-controlled test:</p>
          <h3>Setup</h3>
          <ul>
            <li>Peltier cooler under cell</li>
            <li>Thermistor on cell surface</li>
            <li>PID temperature control</li>
            <li>Test range: -20°C to +80°C</li>
          </ul>
          <h3>Results</h3>
          <p>Temperature coefficient: -2.2mV/°C for Voc</p>
          <p>At 80°C (space hot case):</p>
          <ul>
            <li>Power drops 15%!</li>
            <li>Efficiency: 24.3%</li>
          </ul>
          <p>At -20°C (space cold case):</p>
          <ul>
            <li>Power increases 8%</li>
            <li>Efficiency: 30.8%</li>
          </ul>
          <p>Thermal management critical!</p>
          <h2>Spectrum Response</h2>
          <p>Different light sources, different results:</p>
          <h3>Measuring Quantum Efficiency</h3>
          <p>Used monochromator (borrowed from physics):</p>
          <ul>
            <li>Swept 400-1100nm</li>
            <li>Measured current at each wavelength</li>
            <li>Calculated electrons per photon</li>
          </ul>
          <p>GaAs peaks around 850nm. Silicon at 950nm.</p>
          <h3>LED Test Array</h3>
          <p>Built array with different color LEDs:</p>
          <ul>
            <li>Blue: Poor response</li>
            <li>Green: Better</li>
            <li>Red: Good</li>
            <li>IR: Excellent</li>
          </ul>
          <p>Explains why halogen (lots of IR) gives optimistic results.</p>
          <h2>Angle of Incidence Testing</h2>
          <p>Satellites tumble. How does angle affect power?</p>
          <h3>Cosine Loss Verification</h3>
          <p>Built rotating mount. Results follow cosine law perfectly:</p>
          <ul>
            <li>0°: 100% power</li>
            <li>30°: 86.6% (cos 30°)</li>
            <li>60°: 50% (cos 60°)</li>
            <li>75°: 25.9% (cos 75°)</li>
          </ul>
          <p>No surprises, physics works!</p>
          <h3>Anti-Reflection Coating</h3>
          <p>Noticed reflection increases at sharp angles. AR coating critical for space performance.</p>
          <h2>Series Connection Testing</h2>
          <p>CubeSat needs higher voltage. Connected cells in series:</p>
          <h3>Matching Is Critical</h3>
          <p>Tested 10 cells individually. Current varies ±3%.</p>
          <p>In series: Weakest cell limits entire string!</p>
          <p>Matched cells within 1%:</p>
          <ul>
            <li>String 1: Cells 2,5,7</li>
            <li>String 2: Cells 1,6,9</li>
            <li>String 3: Cells 3,4,8</li>
            <li>Cell 10: Backup</li>
          </ul>
          <h3>Bypass Diodes</h3>
          <p>Added Schottky diodes across each cell:</p>
          <ul>
            <li>Prevents reverse bias damage</li>
            <li>Allows current flow if cell shaded</li>
            <li>Small power loss but worth it</li>
          </ul>
          <h2>Simulating Space Conditions</h2>
          <h3>Vacuum Testing</h3>
          <p>Convinced MechE to let us use vacuum chamber:</p>
          <ul>
            <li>Pumped to 10^-5 Torr</li>
            <li>No convection cooling!</li>
            <li>Cell temperature rose quickly</li>
          </ul>
          <p>Added thermal straps to heat sink. Much better.</p>
          <h3>Radiation Concerns</h3>
          <p>Can't test radiation easily. Literature review shows:</p>
          <ul>
            <li>GaAs very radiation tolerant</li>
            <li>Expect 2-3% degradation per year</li>
            <li>Cover glass helps</li>
          </ul>
          <p>Designing for end-of-life performance.</p>
          <h2>Building Test Panels</h2>
          <p>Made three test configurations:</p>
          <h3>Panel A: Basic</h3>
          <ul>
            <li>2 cells in series</li>
            <li>Direct connection</li>
            <li>No protection</li>
          </ul>
          <h3>Panel B: Protected</h3>
          <ul>
            <li>2 cells in series</li>
            <li>Bypass diodes</li>
            <li>Reverse polarity protection</li>
          </ul>
          <h3>Panel C: Advanced</h3>
          <ul>
            <li>2 cells in series</li>
            <li>Maximum power point tracking</li>
            <li>Temperature compensation</li>
          </ul>
          <h2>MPPT Circuit Design</h2>
          <p>Solar cells have optimal operating point. Built tracker:</p>
          <h3>Perturb and Observe Algorithm</h3>
          <pre className="language-c"><code>{`void mppt_track() {
    float power = voltage * current;
    
    if (power > last_power) {
        // Going right direction
        if (voltage > last_voltage) {
            voltage += step;
        } else {
            voltage -= step;
        }
    } else {
        // Wrong direction, reverse
        if (voltage > last_voltage) {
            voltage -= step;
        } else {
            voltage += step;
        }
    }
    
    last_power = power;
    last_voltage = voltage;
}`}</code></pre>
          <p>Tracks maximum power point as conditions change!</p>
          <h2>Long Duration Testing</h2>
          <p>Running panels outside for a month:</p>
          <ul>
            <li>Data logger records power every minute</li>
            <li>Weather station for correlation</li>
            <li>Degradation monitoring</li>
          </ul>
          <p>Findings:</p>
          <ul>
            <li>Morning dew reduces output</li>
            <li>Partial shading devastating</li>
            <li>Temperature cycling hasn't broken anything (yet)</li>
          </ul>
          <h2>Cost-Performance Analysis</h2>
          <p>GaAs cells:</p>
          <ul>
            <li>30% efficient</li>
            <li>$100/watt</li>
            <li>Space qualified</li>
          </ul>
          <p>Silicon cells:</p>
          <ul>
            <li>20% efficient</li>
            <li>$2/watt</li>
            <li>Not space rated</li>
          </ul>
          <p>For CubeSat: GaAs worth it (barely) For terrestrial: Silicon wins</p>
          <h2>Lessons Learned</h2>
          <p>1. <strong>Temperature matters more than expected</strong>: Design for hot case 2. <strong>Matching critical for series</strong>: Test every cell 3. <strong>Real conditions != lab</strong>: Outdoor testing essential 4. <strong>Protection circuits necessary</strong>: Space is unforgiving 5. <strong>Data, data, data</strong>: Measure everything</p>
          <h2>Tools Worth Having</h2>
          <ul>
            <li>I-V curve tracer (build or buy)</li>
            <li>Good light source with known spectrum</li>
            <li>Temperature control capability</li>
            <li>Precision current measurement</li>
            <li>Data logging setup</li>
          </ul>
          <h2>Future Work</h2>
          <p>Planning:</p>
          <ul>
            <li>Plasma cleaning effects</li>
            <li>Atomic oxygen resistance</li>
            <li>Cover glass attachment</li>
            <li>Deployment mechanism testing</li>
            <li>Thermal cycling (-80°C to +80°C)</li>
          </ul>
          <h2>Documentation Package</h2>
          <p>Created for team:</p>
          <ul>
            <li>I-V curves for each cell</li>
            <li>Temperature coefficients</li>
            <li>Series matching recommendations</li>
            <li>MPPT settings</li>
            <li>Predicted power budget</li>
          </ul>
          <h2>The Reality Check</h2>
          <p>These tiny cells will power our satellite. In space. For years.</p>
          <p>No pressure.</p>
          <p>But seeing them convert light to electricity, understanding exactly how they work, measuring their limits - it's no longer scary. It's just engineering.</p>
          <h2>Tips for Solar Testing</h2>
          <p>1. <strong>Start with cheap cells</strong>: Learn on $5 silicon before $200 GaAs 2. <strong>Control temperature</strong>: Heat kills performance 3. <strong>Measure spectrum</strong>: Not all light sources equal 4. <strong>Match cells carefully</strong>: Weakest link problem 5. <strong>Plan for degradation</strong>: Design for end-of-life</p>
          <p>Next: Integrating panels onto CubeSat structure. Time to make it real!</p>
          <p><em>Currently: Building larger solar simulator with proper AM0 filter. Also designing cover glass attachment procedure. These cells are too expensive to mess up!</em></p>
        </div>
      </article>
    </>
  );
}