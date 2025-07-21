import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Thermal Management in Small Satellites - Michael D'Angelo",
  description: "Space is hot AND cold. Learning to manage temperatures when your satellite swings from -40°C to +80°C every 45 minutes.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-03-05-thermal-management-in-small-satellites">
        <header>
          <h1 className="text-4xl font-bold mb-4">Thermal Management in Small Satellites</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-03-05').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 14 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['cubesat', 'thermal', 'space', 'engineering'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Just got thermal simulation results for our CubeSat. Components will see temperature swings of 120°C every orbit. Some chips are rated for -40 to +85°C. This is going to be interesting...</p>
          <h2>The Thermal Environment of Space</h2>
          <p>Space isn't just cold - it's thermally bizarre:</p>
          <ul>
            <li>Sunlight side: +120°C possible</li>
            <li>Shadow side: -100°C possible</li>
            <li>No air for convection</li>
            <li>Only radiation heat transfer</li>
            <li>90-minute thermal cycles</li>
          </ul>
          <p>Our little CubeSat will experience 16 sunrises per day!</p>
          <h2>Heat Sources and Sinks</h2>
          <h3>Sources (Things Making Heat)</h3>
          <p>1. <strong>Solar radiation</strong>: 1367 W/m² in space 2. <strong>Earth IR</strong>: ~240 W/m² average 3. <strong>Albedo</strong>: Reflected sunlight from Earth (~30%) 4. <strong>Internal power</strong>: Our electronics dissipate ~600mW</p>
          <h3>Sinks (Where Heat Goes)</h3>
          <p>1. <strong>Deep space</strong>: 3K background (essentially 0) 2. <strong>Radiation only</strong>: No convection or conduction</p>
          <p>The equation that rules everything: Power_in = Power_out (at equilibrium)</p>
          <h2>First-Order Thermal Model</h2>
          <p>Simple sphere approximation:</p>
          <p>Heat in:</p>
          <ul>
            <li>Solar: 1367 W/m² × Area × absorptivity</li>
            <li>Earth IR: 240 W/m² × View factor × Area</li>
            <li>Internal: 0.6W</li>
          </ul>
          <p>Heat out:</p>
          <ul>
            <li>Radiation: ε × σ × A × T⁴</li>
          </ul>
          <p>Where:</p>
          <ul>
            <li>ε = emissivity</li>
            <li>σ = Stefan-Boltzmann constant</li>
            <li>A = surface area</li>
            <li>T = temperature (Kelvin)</li>
          </ul>
          <p>Solving for T... we get wild temperature swings.</p>
          <h2>Surface Treatments Matter</h2>
          <p>Different surfaces, different thermal properties:</p>
          <h3>Aluminum (Bare)</h3>
          <ul>
            <li>Solar absorptivity (α): 0.09</li>
            <li>IR emissivity (ε): 0.03</li>
            <li>α/ε ratio: 3.0 (gets hot!)</li>
          </ul>
          <h3>White Paint</h3>
          <ul>
            <li>α: 0.2</li>
            <li>ε: 0.9</li>
            <li>α/ε: 0.22 (stays cool)</li>
          </ul>
          <h3>Black Anodized</h3>
          <ul>
            <li>α: 0.9</li>
            <li>ε: 0.9</li>
            <li>α/ε: 1.0 (moderate)</li>
          </ul>
          <h3>Solar Cells</h3>
          <ul>
            <li>α: 0.8 (absorbs light for power)</li>
            <li>ε: 0.8</li>
            <li>But only 30% becomes electricity, rest is heat!</li>
          </ul>
          <h2>Our Thermal Design Challenge</h2>
          <p>Requirements:</p>
          <ul>
            <li>Batteries: 0°C to 45°C (tight!)</li>
            <li>Electronics: -40°C to 85°C</li>
            <li>Solar panels: -100°C to 100°C (tough)</li>
            <li>Structure: Aluminum (high conductivity)</li>
          </ul>
          <p>Current prediction: -30°C to +65°C</p>
          <p>Too cold for batteries in eclipse!</p>
          <h2>Passive Thermal Control</h2>
          <p>No power for active heating/cooling. Must be clever:</p>
          <h3>Surface Finishes</h3>
          <p>Decided on:</p>
          <ul>
            <li>Solar panels: As is (need sunlight)</li>
            <li>Radiator faces: White paint (reject heat)</li>
            <li>Other faces: Alodine (moderate properties)</li>
          </ul>
          <h3>Thermal Mass</h3>
          <p>Adding thermal mass dampens swings:</p>
          <ul>
            <li>Aluminum structure helps</li>
            <li>Battery is biggest thermal mass</li>
            <li>PCBs add some mass</li>
          </ul>
          <p>But 1U CubeSat doesn't have much mass...</p>
          <h3>Insulation</h3>
          <p>MLI (Multi-Layer Insulation) too complex for CubeSat. Using:</p>
          <ul>
            <li>Kapton tape (poor man's MLI)</li>
            <li>Strategic gaps (air is good insulator)</li>
            <li>Thermal isolation washers</li>
          </ul>
          <h3>Thermal Straps</h3>
          <p>Copper tape conducting heat:</p>
          <ul>
            <li>From hot components to radiators</li>
            <li>From solar panels to battery (warmth)</li>
            <li>Flexible for assembly</li>
          </ul>
          <h2>Component-Level Analysis</h2>
          <h3>Battery Thermal Management</h3>
          <p>Biggest concern. Needs 0-45°C.</p>
          <p>Solutions: 1. Mount in center (most stable) 2. Thermal strap to solar panels (heating) 3. Insulate from cold structure 4. Maybe add heater...</p>
          <h3>Transmitter Heat</h3>
          <p>TX amp dissipates 10W when on!</p>
          <p>Solutions: 1. Thermal strap to structure 2. Duty cycle limit (10%) 3. Temperature sensor for protection</p>
          <h3>Solar Panel Temperature</h3>
          <p>Gets hot in sun: +80°C predicted</p>
          <p>Effects:</p>
          <ul>
            <li>Efficiency drops 0.3%/°C</li>
            <li>Thermal stress on solder joints</li>
            <li>Differential expansion issues</li>
          </ul>
          <p>Can't do much - they need sun exposure.</p>
          <h2>Thermal Modeling Tools</h2>
          <h3>Simple Spreadsheet</h3>
          <p>Started here. Energy balance calculations. Good for rough estimates.</p>
          <h3>Thermal Desktop</h3>
          <p>Industry standard. Learning curve steep.</p>
          <ul>
            <li>CAD model import</li>
            <li>Orbital heating</li>
            <li>Radiation view factors</li>
            <li>Transient analysis</li>
          </ul>
          <h3>COMSOL</h3>
          <p>Multiphysics including thermal. Great for detailed component analysis.</p>
          <h3>Homebrew MATLAB</h3>
          <p>Wrote simple transient solver:</p>
          <pre className="language-matlab"><code>{`% Thermal capacitance
C = mass * specific_heat;

% Time loop
for t = 1:duration
    Q_solar = solar_flux(t) * area * alpha;
    Q_earth = earth_ir * view_factor * area;
    Q_internal = power_dissipation(t);
    Q_rad = epsilon * sigma * area * T^4;
    
    dT = (Q_solar + Q_earth + Q_internal - Q_rad) / C * dt;
    T = T + dT;
end`}</code></pre>
          <p>Results match Thermal Desktop within 5°C!</p>
          <h2>Heater Design Dilemma</h2>
          <p>Battery needs heating in eclipse. Options:</p>
          <h3>Resistive Heater</h3>
          <p>Simple! But:</p>
          <ul>
            <li>Uses precious power (500mW)</li>
            <li>Needs thermostat control</li>
            <li>Could drain battery it's protecting</li>
          </ul>
          <h3>Radioisotope (Just Kidding)</h3>
          <p>Would solve everything but:</p>
          <ul>
            <li>Regulatory nightmare</li>
            <li>Way over budget</li>
            <li>Team voted no</li>
          </ul>
          <h3>Phase Change Material</h3>
          <p>Paraffin wax stores/releases heat:</p>
          <ul>
            <li>Melts at 25°C</li>
            <li>Stores 200 J/g</li>
            <li>Passive operation!</li>
          </ul>
          <p>Testing small amount around battery.</p>
          <h2>Thermal Vacuum Testing Plans</h2>
          <p>Can't trust simulations alone. Need testing:</p>
          <h3>Poor Man\'s Thermal Vac</h3>
          <ul>
            <li>Vacuum chamber (borrowed from MechE)</li>
            <li>Liquid nitrogen (cold)</li>
            <li>Heat lamps (hot)</li>
            <li>Thermocouples everywhere</li>
          </ul>
          <h3>Test Profile</h3>
          <p>1. Pump down to <10^-5 Torr 2. Cold soak to -40°C 3. Rapid transition to hot 4. Cycle 8 times (full day) 5. Monitor all temperatures</p>
          <h3>Expected Issues</h3>
          <ul>
            <li>Outgassing from PCBs</li>
            <li>Thermal expansion mismatches</li>
            <li>Cold batteries not working</li>
            <li>Hot transmitter shutting down</li>
          </ul>
          <h2>Lessons from Other Missions</h2>
          <h3>SUCCESS Story: CanX-2</h3>
          <p>Used careful thermal design:</p>
          <ul>
            <li>White paint on radiators</li>
            <li>Battery heater (only when needed)</li>
            <li>Survived 5+ years!</li>
          </ul>
          <h3>FAILURE Story: [Redacted] University</h3>
          <ul>
            <li>No thermal analysis done</li>
            <li>Battery froze first eclipse</li>
            <li>Mission lost</li>
          </ul>
          <p>Thermal kills satellites.</p>
          <h2>Design Iterations</h2>
          <h3>Version 1: Isothermal Assumption</h3>
          <p>"Aluminum conducts well, it'll be uniform temperature" Reality: 20°C gradients!</p>
          <h3>Version 2: Add Radiator</h3>
          <p>"Big white radiator panel!" Problem: Got too cold in eclipse</p>
          <h3>Version 3: Balanced Design</h3>
          <ul>
            <li>Moderate surface finishes</li>
            <li>Strategic insulation</li>
            <li>Accept temperature cycling</li>
            <li>Design components for it</li>
          </ul>
          <h2>Component Selection Impact</h2>
          <p>Choosing components for temperature:</p>
          <h3>Extended Temperature Range</h3>
          <ul>
            <li>Costs 2-3x more</li>
            <li>Often larger packages</li>
            <li>Worth it for critical parts</li>
          </ul>
          <h3>Military/Automotive Grade</h3>
          <ul>
            <li>Better than commercial</li>
            <li>Not as good as space grade</li>
            <li>Good compromise for CubeSat</li>
          </ul>
          <h3>Derating</h3>
          <p>Running components well below limits:</p>
          <ul>
            <li>85°C rated part? Use to 60°C</li>
            <li>Increases reliability dramatically</li>
          </ul>
          <h2>Thermal Interface Materials</h2>
          <p>Getting heat from chip to structure:</p>
          <h3>Thermal Pads</h3>
          <ul>
            <li>Sil-Pad: 1-3 W/mK</li>
            <li>Easy to use</li>
            <li>Compressible</li>
            <li>Good for production</li>
          </ul>
          <h3>Thermal Paste</h3>
          <ul>
            <li>Arctic Silver: 8.9 W/mK</li>
            <li>Messy application</li>
            <li>Best performance</li>
            <li>Flight concerns?</li>
          </ul>
          <h3>Graphite Sheets</h3>
          <ul>
            <li>300+ W/mK (in plane)</li>
            <li>Expensive</li>
            <li>Amazing for spreading</li>
            <li>Testing for TX amplifier</li>
          </ul>
          <h2>Current Design Status</h2>
          <p>Latest simulation results:</p>
          <ul>
            <li>Battery: -5°C to 35°C (add heater)</li>
            <li>Electronics: -25°C to 55°C (good!)</li>
            <li>Solar panels: -60°C to 80°C (expected)</li>
            <li>TX amp: Max 70°C (acceptable)</li>
          </ul>
          <p>Almost there!</p>
          <h2>The Heater Control Algorithm</h2>
          <p>If we add battery heater:</p>
          <pre className="language-c"><code>{`if (battery_temp < 0°C && battery_voltage > 3.6V) {
    heater_on();
} else if (battery_temp > 5°C || battery_voltage < 3.4V) {
    heater_off();
}`}</code></pre>
          <p>Simple bang-bang control. Uses 500mW when on.</p>
          <h2>Manufacturing Considerations</h2>
          <p>Thermal design affects assembly:</p>
          <ul>
            <li>Different expansion coefficients</li>
            <li>Stress on solder joints</li>
            <li>Need flexible connections</li>
            <li>Thermal paste application procedure</li>
          </ul>
          <p>Working with assembly team on process.</p>
          <h2>Future Improvements</h2>
          <p>For next CubeSat:</p>
          <ul>
            <li>Deployable radiator?</li>
            <li>Smart surface coatings</li>
            <li>Active thermal control</li>
            <li>Better thermal isolation</li>
          </ul>
          <p>But first, make this one work!</p>
          <h2>Key Takeaways</h2>
          <p>1. <strong>Space thermal is non-intuitive</strong>: Hot AND cold 2. <strong>Surface properties dominate</strong>: α/ε ratio is key 3. <strong>Batteries are sensitive</strong>: Design around them 4. <strong>Test, test, test</strong>: Simulation lies 5. <strong>Margin is your friend</strong>: Assume worse than predicted</p>
          <h2>Resources Found Helpful</h2>
          <ul>
            <li>Gilmore's "Spacecraft Thermal Control Handbook"</li>
            <li>NASA thermal design guides</li>
            <li>Previous CubeSat thermal papers</li>
            <li>Thermal Desktop tutorials</li>
          </ul>
          <h2>Team Dynamics</h2>
          <p>Thermal affects everyone:</p>
          <ul>
            <li>Power: "Don't waste energy on heating!"</li>
            <li>Structures: "Don't complicate my design!"</li>
            <li>Comms: "Keep my amp cool!"</li>
            <li>Software: "Another sensor to monitor?"</li>
          </ul>
          <p>Compromise is key.</p>
          <h2>Next Steps</h2>
          <p>1. Finalize surface treatments 2. Order thermal interface materials 3. Build thermal model for testing 4. Vacuum chamber test 5. Iterate based on results</p>
          <h2>Personal Growth</h2>
          <p>Six months ago: "Space is cold, add heaters" Now: Understanding radiation heat transfer, view factors, and thermal capacitance</p>
          <p>Engineering school doesn't teach spacecraft thermal. Learning by doing!</p>
          <p><em>Currently building thermal test model with 20 thermocouples. Going to cycle this thing until something breaks or we're confident. Probably both.</em></p>
        </div>
      </article>
    </>
  );
}