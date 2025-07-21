import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CubeSat Power Budget: Every Milliwatt Counts - Michael D'Angelo",
  description: "Calculating power generation and consumption for our CubeSat. When your solar panels generate 2 watts on a good day, efficiency becomes religion.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-03-01-cubesat-power-budget-every-milliwatt-counts">
        <header>
          <h1 className="text-4xl font-bold mb-4">CubeSat Power Budget: Every Milliwatt Counts</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-03-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 15 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['cubesat', 'power', 'space', 'engineering'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>First CubeSat team meeting as official member! My task: Calculate complete power budget. Sounds simple until you realize we're powered by solar panels the size of index cards. Here's my deep dive into spacecraft power engineering.</p>
          <h2>The Power Challenge</h2>
          <p>Our 1U CubeSat (10cm cube) has:</p>
          <ul>
            <li>5 faces for solar panels (one has antenna)</li>
            <li>Each panel: ~2W in full sun</li>
            <li>But we're tumbling, so average is way less</li>
            <li>Oh, and we're in Earth's shadow 35% of the time</li>
          </ul>
          <p>This is going to be tight.</p>
          <h2>Solar Panel Deep Dive</h2>
          <h3>The Cells</h3>
          <p>Using Spectrolab 29.5% efficiency GaAs cells:</p>
          <ul>
            <li>2.4W per cell @ 28°C</li>
            <li>But space is cold AND hot</li>
            <li>Efficiency drops 0.3%/°C above 28°C</li>
          </ul>
          <h3>Panel Configuration</h3>
          <p>Each face: 2 cells in series</p>
          <ul>
            <li>Open circuit voltage: 5.4V</li>
            <li>Peak power point: 4.6V @ 520mA</li>
            <li>Total: 2.4W per face theoretical</li>
          </ul>
          <p>But that's best case...</p>
          <h2>Orbital Mechanics Meets Power</h2>
          <p>Our orbit: 400km, 51.6° inclination (ISS orbit)</p>
          <p>Power generation depends on: 1. Sun angle (varies constantly) 2. Eclipse periods (35% of 90-minute orbit) 3. Tumbling rate (random orientation)</p>
          <h3>The Cosine Loss Problem</h3>
          <p>Power = Max Power × cos(angle)</p>
          <p>If sun hits panel at 60°: Only 50% power!</p>
          <p>Tumbling satellite math:</p>
          <ul>
            <li>Average cos(θ) over sphere = 1/π ≈ 0.318</li>
            <li>So average power per panel = 2.4W × 0.318 = 0.76W</li>
          </ul>
          <p>5 panels × 0.76W = 3.8W average in sun</p>
          <h3>Eclipse Calculations</h3>
          <p>Orbital period: 90 minutes</p>
          <ul>
            <li>Sunlight: 58 minutes (64%)</li>
            <li>Eclipse: 32 minutes (36%)</li>
          </ul>
          <p>Average power generation: 3.8W × 0.64 = 2.43W</p>
          <p>But wait, there's more losses...</p>
          <h2>Power System Efficiency</h2>
          <h3>Solar Panel to Battery</h3>
          <ul>
            <li>MPPT converter efficiency: 85%</li>
            <li>Battery charging efficiency: 90%</li>
            <li>Wiring/connector losses: 95%</li>
          </ul>
          <p>Total: 0.85 × 0.90 × 0.95 = 73%</p>
          <p>Actual average power to battery: 2.43W × 0.73 = 1.77W</p>
          <h3>Battery to Systems</h3>
          <ul>
            <li>Discharge efficiency: 95%</li>
            <li>Regulator efficiency: 90%</li>
          </ul>
          <p>Power available: 1.77W × 0.95 × 0.90 = 1.51W</p>
          <p>We have 1.5 watts. Total. For everything.</p>
          <h2>Power Consumption Audit</h2>
          <p>Time to count every milliamp...</p>
          <h3>Command & Data Handling</h3>
          <ul>
            <li>MSP430 microcontroller: 8mA @ 3.3V = 26mW</li>
            <li>SD card (intermittent): 50mA @ 3.3V = 165mW</li>
            <li>Sensors (temp, mag, gyro): 15mA @ 3.3V = 50mW</li>
          </ul>
          <p>Total: ~250mW continuous</p>
          <h3>Communication System</h3>
          <ul>
            <li>Receiver (always on): 15mA @ 3.3V = 50mW</li>
            <li>Transmitter (10% duty): 400mA @ 5V = 2W (200mW average)</li>
          </ul>
          <p>Total: ~250mW average</p>
          <h3>Attitude Determination</h3>
          <ul>
            <li>Magnetometer: 5mA @ 3.3V = 17mW</li>
            <li>Sun sensors: 10mA @ 3.3V = 33mW</li>
            <li>Processing: Included in C&DH</li>
          </ul>
          <p>Total: ~50mW</p>
          <h3>Payload (Camera)</h3>
          <ul>
            <li>Imaging: 150mA @ 3.3V = 500mW</li>
            <li>1 photo/orbit = 30 seconds</li>
            <li>Average: 500mW × (30/5400) = 2.8mW</li>
          </ul>
          <h3>Margins and Overhead</h3>
          <ul>
            <li>Clock/timers: 5mW</li>
            <li>Voltage references: 10mW</li>
            <li>Quiescent currents: 20mW</li>
          </ul>
          <p>Total: ~35mW</p>
          <h3>Grand Total</h3>
          <p>250 + 250 + 50 + 3 + 35 = 588mW</p>
          <p>We're using 588mW, generating 1510mW. Margin: 922mW (157%!)</p>
          <p>Looks good, but...</p>
          <h2>The Battery Sizing Problem</h2>
          <p>Eclipse lasts 32 minutes. Need 588mW × 0.53hr = 312mWh</p>
          <p>Battery capacity needed (with 80% depth of discharge): 312mWh / 0.8 = 390mWh = 105mAh @ 3.7V</p>
          <p>Our battery: 2600mAh Overkill? No! Here's why:</p>
          <h3>Battery Degradation</h3>
          <ul>
            <li>Lose 20% capacity per year</li>
            <li>Mission life: 2 years</li>
            <li>End of life: 2600 × 0.6 = 1560mAh</li>
          </ul>
          <h3>Temperature Effects</h3>
          <ul>
            <li>Capacity drops 50% at -20°C</li>
            <li>Worst case: 1560 × 0.5 = 780mAh</li>
          </ul>
          <p>Still plenty!</p>
          <h2>Dynamic Power Management</h2>
          <p>Can't run everything always. Implemented priority system:</p>
          <h3>Priority 1: Essential (Always On)</h3>
          <ul>
            <li>C&DH: 26mW</li>
            <li>Receiver: 50mW</li>
            <li>Thermal: 10mW</li>
          </ul>
          <p>Total: 86mW (minimum to stay alive)</p>
          <h3>Priority 2: Normal Ops</h3>
          <ul>
            <li>Sensors: 50mW</li>
            <li>Beacon TX: 200mW</li>
          </ul>
          <p>Total: 336mW</p>
          <h3>Priority 3: Science</h3>
          <ul>
            <li>Camera: 500mW (when active)</li>
            <li>High-rate TX: 2W (when active)</li>
          </ul>
          <h3>Power Management Algorithm</h3>
          <pre className="language-c"><code>{`if (battery_voltage < 3.2V) {
    mode = ESSENTIAL_ONLY;
} else if (battery_voltage < 3.6V) {
    mode = NORMAL_OPS;
} else {
    mode = FULL_SCIENCE;
}`}</code></pre>
          <h2>Thermal Considerations</h2>
          <p>Temperature affects everything!</p>
          <h3>Solar Panel Temperature</h3>
          <p>In sun: +80°C (efficiency drops 15%) In eclipse: -40°C (battery capacity drops)</p>
          <p>Thermal cycling is brutal.</p>
          <h3>Heater Power</h3>
          <p>Battery heater: 500mW when T < 0°C Adds significant load in eclipse!</p>
          <p>Updated power budget:</p>
          <ul>
            <li>Eclipse consumption: 588mW + 500mW = 1088mW</li>
            <li>Eclipse duration: 0.53hr</li>
            <li>Energy needed: 577mWh</li>
          </ul>
          <p>Still within battery capacity, but tighter.</p>
          <h2>Peak Power Analysis</h2>
          <p>Worst case simultaneous load:</p>
          <ul>
            <li>Everything on</li>
            <li>Transmitting high-rate</li>
            <li>Camera active</li>
            <li>Heaters on</li>
          </ul>
          <p>Total: 3.5W</p>
          <p>Can battery deliver? 2600mAh battery, 1C discharge = 2.6A @ 3.7V = 9.6W</p>
          <p>Yes, but voltage sags. Need good regulators.</p>
          <h2>Lessons from Other Missions</h2>
          <p>Studied failed CubeSats:</p>
          <h3>CUTE-1 (2003)</h3>
          <ul>
            <li>Failed after 1 month</li>
            <li>Cause: Battery overheating</li>
            <li>Lesson: Thermal management critical</li>
          </ul>
          <h3>XI-IV (2003)</h3>
          <ul>
            <li>Still working after 15+ years!</li>
            <li>Conservative power budget</li>
            <li>Lesson: Margins matter</li>
          </ul>
          <h3>Our Design Philosophy</h3>
          <p>Under-promise, over-deliver. Budget shows 1.5W generation? Design for 1W.</p>
          <h2>Power Budget Spreadsheet</h2>
          <p>Created detailed Excel model:</p>
          <ul>
            <li>Orbital parameters → eclipse timing</li>
            <li>Temperature → panel efficiency</li>
            <li>Component states → consumption</li>
            <li>Monte Carlo simulation for tumbling</li>
          </ul>
          <p>Key findings:</p>
          <ul>
            <li>Best case: 4W generation</li>
            <li>Worst case: 0.8W generation</li>
            <li>Design for worst case!</li>
          </ul>
          <h2>PCB Design for Power Efficiency</h2>
          <p>Designing the power board:</p>
          <h3>Copper Thickness</h3>
          <p>Using 2oz copper (vs standard 1oz)</p>
          <ul>
            <li>Lower resistance</li>
            <li>Better heat spreading</li>
            <li>Worth the extra cost</li>
          </ul>
          <h3>Trace Width</h3>
          <p>Calculated for 1% voltage drop:</p>
          <ul>
            <li>Main power: 2mm traces</li>
            <li>Battery: 3mm traces</li>
            <li>Grounds: Entire layer</li>
          </ul>
          <h3>Component Selection</h3>
          <ul>
            <li>LDO regulators: 50μA quiescent</li>
            <li>Switching regulators: >90% efficiency</li>
            <li>Schottky diodes: Low forward drop</li>
            <li>Tantalum caps: Low ESR</li>
          </ul>
          <p>Every millivolt matters!</p>
          <h2>Testing Plan</h2>
          <p>How to verify on ground:</p>
          <h3>Solar Simulator</h3>
          <ul>
            <li>Halogen lamps calibrated to 1367W/m²</li>
            <li>Thermal vacuum chamber</li>
            <li>Measure actual panel output</li>
          </ul>
          <h3>Battery Cycling</h3>
          <ul>
            <li>Simulate orbital temperature swings</li>
            <li>Charge/discharge cycles</li>
            <li>Measure capacity degradation</li>
          </ul>
          <h3>System-Level Test</h3>
          <ul>
            <li>Run flight software</li>
            <li>Simulate full orbits</li>
            <li>Verify positive power margin</li>
          </ul>
          <h2>Risk Mitigation</h2>
          <p>What if power generation is lower?</p>
          <h3>Backup Plans</h3>
          <p>1. Reduce beacon rate (save 100mW) 2. Lower transmit power (save 500mW) 3. Hibernate between passes (save 200mW) 4. Payload only in full sun (save average power)</p>
          <h3>Safe Mode</h3>
          <p>If battery < 3.0V:</p>
          <ul>
            <li>Everything off except timer</li>
            <li>Wake every orbit</li>
            <li>Beacon if power available</li>
            <li>Wait for recovery</li>
          </ul>
          <h2>The Human Side</h2>
          <p>Team debate over payload power:</p>
          <ul>
            <li>Science team: "We need 1W for camera!"</li>
            <li>Power team (me): "You get 500mW"</li>
            <li>Compromise: 500mW, but priority in full sun</li>
          </ul>
          <p>Engineering is negotiation.</p>
          <h2>Tools and Resources</h2>
          <p>Software used:</p>
          <ul>
            <li>MATLAB: Orbital calculations</li>
            <li>Excel: Power budget</li>
            <li>LTspice: Regulator design</li>
            <li>STK: Eclipse timing</li>
          </ul>
          <p>References:</p>
          <ul>
            <li>Spacecraft Power Systems by Patel</li>
            <li>CubeSat Power System Design book</li>
            <li>Previous mission reports</li>
          </ul>
          <h2>Current Status</h2>
          <p>Power budget: APPROVED!</p>
          <ul>
            <li>60% margin in worst case</li>
            <li>Meets all mission requirements</li>
            <li>Board design starting</li>
          </ul>
          <p>Next steps:</p>
          <ul>
            <li>Component procurement</li>
            <li>Board layout</li>
            <li>Solar panel testing</li>
            <li>Battery characterization</li>
          </ul>
          <h2>Reflections</h2>
          <p>Six months ago: "Just stick a battery in it" Now: Appreciating every aspect of power engineering</p>
          <p>Space is hard because:</p>
          <ul>
            <li>Can't add more panels later</li>
            <li>Can't replace batteries</li>
            <li>Thermal cycling is brutal</li>
            <li>Every milliwatt precious</li>
          </ul>
          <p>But that's what makes it exciting!</p>
          <h2>Final Numbers</h2>
          <p>Power Generation: 1.5W average Power Consumption: 0.6W average Battery Capacity: 2.6Ah @ 3.7V Mission Duration: 2 years Margin: 150%</p>
          <p>We're going to space!</p>
          <p><em>Next week: Designing the actual power board. Time to turn spreadsheets into silicon!</em></p>
        </div>
      </article>
    </>
  );
}