import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Battery Management Systems for CubeSats - Michael D'Angelo",
  description: "Designing battery protection for space is serious business. One lithium fire and mission over. Here's how we're keeping our batteries safe.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-04-25-battery-management-systems-for-cubesats">
        <header>
          <h1 className="text-4xl font-bold mb-4">Battery Management Systems for CubeSats</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-04-25').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 15 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['battery', 'bms', 'power', 'safety', 'cubesat'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>After seeing a lithium battery fire video in lab safety training, I'm taking battery management very seriously. Our CubeSat uses 18650 cells - same chemistry that occasionally makes headlines. Here's our deep dive into keeping them safe in space.</p>
          <h2>The Battery Challenge</h2>
          <p>Space batteries face:</p>
          <ul>
            <li>Temperature extremes (-40°C to +60°C)</li>
            <li>Vacuum (no convection cooling)</li>
            <li>No maintenance possible</li>
            <li>Radiation effects</li>
            <li>5000+ charge cycles</li>
          </ul>
          <p>One thermal runaway = mission over.</p>
          <h2>Cell Selection</h2>
          <p>Chose Panasonic NCR18650B:</p>
          <ul>
            <li>3400mAh capacity</li>
            <li>LiNiCoAlO2 chemistry</li>
            <li>Safer than LiCoO2</li>
            <li>Space heritage (similar cells)</li>
            <li>Good temperature range</li>
          </ul>
          <p>Built 2S2P pack: 7.4V nominal, 6800mAh</p>
          <h2>Protection Requirements</h2>
          <p>Must monitor and control:</p>
          <ul>
            <li>Cell voltages (±5mV accuracy)</li>
            <li>Current (charge and discharge)</li>
            <li>Temperature (each cell)</li>
            <li>Cell balancing</li>
            <li>Fault protection</li>
          </ul>
          <p>Commercial BMS chips exist, but we're building custom for education.</p>
          <h2>The BMS Architecture</h2>
          <h3>Voltage Monitoring</h3>
          <p>Using TI BQ76920 analog front-end:</p>
          <ul>
            <li>Monitors 3-5 cells</li>
            <li>14-bit ADC</li>
            <li>±5mV accuracy</li>
            <li>I2C interface</li>
          </ul>
          <p>Connected to our MSP430 microcontroller.</p>
          <h3>Current Sensing</h3>
          <p>High-side sensing with INA219:</p>
          <ul>
            <li>0.1Ω shunt resistor</li>
            <li>±3.2A range</li>
            <li>12-bit resolution</li>
            <li>Counts coulombs!</li>
          </ul>
          <h3>Temperature Monitoring</h3>
          <p>10K NTC thermistors on each cell:</p>
          <ul>
            <li>Epoxied to cell surface</li>
            <li>4-wire measurement</li>
            <li>±0.5°C accuracy</li>
            <li>Thermal fuses as backup</li>
          </ul>
          <h2>Cell Balancing</h2>
          <p>Cells drift apart over time. Must equalize.</p>
          <h3>Passive Balancing</h3>
          <p>Bleed resistors discharge high cells:</p>
          <pre className="language-text"><code>{`Cell 1: 4.15V ━━━[100Ω]━━━ FET
Cell 2: 4.18V ━━━[100Ω]━━━ FET (ON)
Cell 3: 4.16V ━━━[100Ω]━━━ FET
Cell 4: 4.17V ━━━[100Ω]━━━ FET`}</code></pre>
          <p>Simple but wastes energy as heat.</p>
          <h3>Active Balancing Attempt</h3>
          <p>Tried flying capacitor approach:</p>
          <ul>
            <li>Capacitor shuttles charge between cells</li>
            <li>More efficient</li>
            <li>Complex switching</li>
            <li>EMI nightmare!</li>
          </ul>
          <p>Stuck with passive for reliability.</p>
          <h2>Protection Circuits</h2>
          <h3>Overvoltage Protection</h3>
          <p>Hardware comparator per cell:</p>
          <ul>
            <li>Triggers at 4.25V</li>
            <li>Disconnects charge FET</li>
            <li>Latching until reset</li>
          </ul>
          <p>Software monitors at 4.20V (early warning).</p>
          <h3>Undervoltage Protection</h3>
          <p>Critical! Below 2.5V damages cells.</p>
          <ul>
            <li>Hardware cutoff at 2.7V</li>
            <li>Software warning at 3.0V</li>
            <li>Disconnects load FET</li>
          </ul>
          <h3>Overcurrent Protection</h3>
          <p>Both directions:</p>
          <ul>
            <li>Charge: 1C max (3.4A)</li>
            <li>Discharge: 2C max (6.8A)</li>
            <li>Electronic fuse (eFuse) chips</li>
          </ul>
          <h3>Temperature Protection</h3>
          <p>Charge: 0°C to 45°C Discharge: -20°C to 60°C</p>
          <p>Outside range: Reduce current or disconnect.</p>
          <h2>The Firmware</h2>
          <p>Main loop runs at 10Hz:</p>
          <pre className="language-c"><code>{`void bms_task() {
    read_voltages();
    read_current();
    read_temperatures();
    
    check_overvoltage();
    check_undervoltage();
    check_overcurrent();
    check_temperature();
    
    balance_cells();
    calculate_soc();
    report_telemetry();
}`}</code></pre>
          <h3>State of Charge Estimation</h3>
          <p>Coulomb counting with voltage correlation:</p>
          <pre className="language-c"><code>{`float calculate_soc() {
    // Coulomb counting
    consumed_mah += current * dt / 3600;
    soc_coulomb = 100 * (1 - consumed_mah / capacity);
    
    // Voltage-based estimate
    soc_voltage = voltage_to_soc(pack_voltage);
    
    // Weighted average
    return 0.8 * soc_coulomb + 0.2 * soc_voltage;
}`}</code></pre>
          <h3>Cell Balancing Algorithm</h3>
          <pre className="language-c"><code>{`void balance_cells() {
    float avg_voltage = average(cell_voltages);
    
    for (int i = 0; i < 4; i++) {
        if (cell_voltages[i] > avg_voltage + 0.010) {
            enable_balance_fet(i);
        } else {
            disable_balance_fet(i);
        }
    }
}`}</code></pre>
          <p>Balance only when charging/idle. Not during discharge.</p>
          <h2>Testing the BMS</h2>
          <h3>Fault Injection Testing</h3>
          <p>Deliberately caused every fault:</p>
          <p>1. <strong>Overvoltage</strong>: Raised supply to 4.3V - Result: Instant disconnect ✓</p>
          <p>2. <strong>Undervoltage</strong>: Drained cell to 2.6V - Result: Load disconnected at 2.7V ✓</p>
          <p>3. <strong>Overcurrent</strong>: Shorted output briefly - Result: eFuse tripped in 10μs ✓</p>
          <p>4. <strong>Overtemperature</strong>: Heat gun to 50°C - Result: Charge disabled ✓</p>
          <h3>Cycle Testing</h3>
          <p>Automated charge/discharge cycling:</p>
          <ul>
            <li>500 cycles completed</li>
            <li>Capacity retention: 94%</li>
            <li>Balancing keeps cells within 20mV</li>
          </ul>
          <h3>Thermal Chamber Testing</h3>
          <p>-40°C to +60°C with vacuum:</p>
          <ul>
            <li>Heaters needed below 0°C</li>
            <li>Performance degrades but safe</li>
            <li>No thermal runaway scenarios</li>
          </ul>
          <h2>Lessons from Testing</h2>
          <h3>Discovery 1: Self-Discharge Varies</h3>
          <p>Cells self-discharge at different rates. After 1 month storage:</p>
          <ul>
            <li>Cell 1: 4.08V</li>
            <li>Cell 2: 4.11V</li>
            <li>Cell 3: 4.06V</li>
            <li>Cell 4: 4.09V</li>
          </ul>
          <p>Need periodic balancing even when idle.</p>
          <h3>Discovery 2: Contact Resistance</h3>
          <p>Spot-welded connections crucial. Soldering attempt:</p>
          <ul>
            <li>Added 10mΩ resistance</li>
            <li>60mV drop at 6A!</li>
            <li>Excess heat</li>
          </ul>
          <p>Professional spot welder acquired.</p>
          <h3>Discovery 3: EMI from Balancing</h3>
          <p>PWM balancing created noise. Solution: Slow linear control Less efficient but cleaner.</p>
          <h2>Safety Features</h2>
          <h3>Hardware Watchdog</h3>
          <p>Independent watchdog timer:</p>
          <ul>
            <li>BMS must pet every second</li>
            <li>Miss = disconnect everything</li>
            <li>Prevents software lockup danger</li>
          </ul>
          <h3>Redundant Temperature Sensing</h3>
          <ul>
            <li>Primary: Thermistors + ADC</li>
            <li>Backup: Thermal fuses (one-time)</li>
            <li>Tertiary: PTC resettable fuses</li>
          </ul>
          <h3>Communication Isolation</h3>
          <p>BMS isolated from main computer:</p>
          <ul>
            <li>Optocoupled I2C</li>
            <li>Separate grounds</li>
            <li>Prevents fault propagation</li>
          </ul>
          <h2>Integration Challenges</h2>
          <h3>Mechanical Design</h3>
          <p>Battery box from aluminum:</p>
          <ul>
            <li>Thermal conduction</li>
            <li>EMI shielding</li>
            <li>Vibration damping</li>
            <li>Venting for pressure</li>
          </ul>
          <h3>Connector Selection</h3>
          <p>Went through several iterations:</p>
          <ul>
            <li>Molex Micro-Fit: Too big</li>
            <li>JST: Not rated for current</li>
            <li>Samtec: Perfect! Small, 10A rated</li>
          </ul>
          <h3>Wire Gauge</h3>
          <p>AWG 20 for main power:</p>
          <ul>
            <li>3.3mΩ/foot</li>
            <li>11A capacity</li>
            <li>Flexible enough</li>
          </ul>
          <p>Calculated voltage drop acceptable.</p>
          <h2>BMS Communication Protocol</h2>
          <p>Reports to main computer:</p>
          <pre className="language-text"><code>{`{
  "pack_voltage": 7.38,
  "pack_current": -1.25,
  "cell_voltages": [3.68, 3.70, 3.69, 3.69],
  "temperatures": [22.3, 22.5, 22.8, 22.6],
  "soc": 67.2,
  "health": 94.3,
  "cycles": 127,
  "faults": "none"
}`}</code></pre>
          <p>Updated every second via I2C.</p>
          <h2>Power Budget Impact</h2>
          <p>BMS consumes:</p>
          <ul>
            <li>Monitoring: 15mA continuous</li>
            <li>Balancing: 40mA when active</li>
            <li>Protection: 5mA</li>
            <li>Total: ~20mA average</li>
          </ul>
          <p>Acceptable overhead for safety.</p>
          <h2>Radiation Considerations</h2>
          <p>SEU (Single Event Upset) concerns:</p>
          <ul>
            <li>Added voting logic</li>
            <li>CRC on communications</li>
            <li>Parameter limit checking</li>
            <li>Default-safe design</li>
          </ul>
          <p>If values corrupted, fail safe.</p>
          <h2>Future Improvements</h2>
          <p>Version 2 ideas:</p>
          <ul>
            <li>Active balancing (more complex)</li>
            <li>Individual cell control</li>
            <li>Predictive failure detection</li>
            <li>Wireless monitoring</li>
            <li>Integrated heating</li>
          </ul>
          <p>But current design solid for mission.</p>
          <h2>Documentation Package</h2>
          <p>Created comprehensive docs:</p>
          <ul>
            <li>Schematic with annotations</li>
            <li>Layout guidelines</li>
            <li>Test procedures</li>
            <li>Fault handling guide</li>
            <li>Assembly instructions</li>
          </ul>
          <h2>The Reality Check</h2>
          <p>Batteries are dangerous. Period.</p>
          <p>But with proper design:</p>
          <ul>
            <li>Monitor everything</li>
            <li>Protect against faults</li>
            <li>Test thoroughly</li>
            <li>Document clearly</li>
          </ul>
          <p>Can be made safe enough for space.</p>
          <h2>Cost Breakdown</h2>
          <ul>
            <li>BQ76920 AFE: $8</li>
            <li>MSP430: $3</li>
            <li>Protection circuits: $15</li>
            <li>Connectors: $20</li>
            <li>PCB: $25</li>
            <li>Miscellaneous: $30</li>
            <li>Total: ~$100</li>
          </ul>
          <p>Not bad for custom space-grade BMS!</p>
          <h2>Key Takeaways</h2>
          <p>1. <strong>Never trust batteries</strong>: Always assume worst case 2. <strong>Protection layers</strong>: Hardware AND software 3. <strong>Test everything</strong>: Especially fault conditions 4. <strong>Balance regularly</strong>: Cells drift apart 5. <strong>Document thoroughly</strong>: Others will maintain</p>
          <p>Next: Environmental testing complete pack. Vibration, thermal vacuum, and EMI. Fingers crossed!</p>
          <p><em>Currently: Analyzing telemetry from 500-hour test. So far so good! Also designing battery heater control algorithm. Space is cold.</em></p>
        </div>
      </article>
    </>
  );
}