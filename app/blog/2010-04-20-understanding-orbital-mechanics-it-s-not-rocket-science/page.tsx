import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Understanding Orbital Mechanics: It's Not Rocket Science - Michael D'Angelo",
  description: "Finally grasping how orbits work after a semester of aerospace engineering. From Kepler to ground tracks, here's orbital mechanics made simple.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-04-20-understanding-orbital-mechanics-it-s-not-rocket-science">
        <header>
          <h1 className="text-4xl font-bold mb-4">Understanding Orbital Mechanics: It\'s Not Rocket Science</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-04-20').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 14 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['orbital-mechanics', 'space', 'physics', 'cubesat'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>"It's not rocket science" they say. Well, today it literally is. Taking Orbital Mechanics this semester and my brain hurts. But after weeks of confusion, it finally clicked. Here's what I wish someone had told me on day one.</p>
          <h2>The Fundamental Realization</h2>
          <p>Orbiting is just falling and missing Earth.</p>
          <p>Throw ball: Falls and hits ground Throw harder: Falls farther away Throw at 17,500 mph: Falls but Earth curves away at same rate</p>
          <p>That's it. Everything else is just math to describe this.</p>
          <h2>Newton\'s Cannonball</h2>
          <p>Newton imagined firing cannonball from mountain:</p>
          <ul>
            <li>Low speed: Hits Earth</li>
            <li>Higher speed: Goes farther</li>
            <li>Just right speed: Circles Earth</li>
            <li>Too fast: Escapes to space</li>
          </ul>
          <p>Our CubeSat needs "just right" speed.</p>
          <h2>The Two-Body Problem</h2>
          <p>Simplification: Only Earth and satellite exist.</p>
          <p>Newton's law: F = GMm/r² Centripetal force: F = mv²/r</p>
          <p>Set equal: v = √(GM/r)</p>
          <p>That's orbital velocity! For 400km altitude: v = √(398,600/6778) = 7.67 km/s</p>
          <p>17,163 mph. That's fast.</p>
          <h2>Kepler\'s Laws (Finally Make Sense)</h2>
          <h3>First Law: Orbits are Ellipses</h3>
          <p>Circle is special case ellipse. Most orbits slightly elliptical.</p>
          <p>Key terms:</p>
          <ul>
            <li>Apogee: Farthest from Earth</li>
            <li>Perigee: Closest to Earth</li>
            <li>Semi-major axis: Average distance</li>
          </ul>
          <h3>Second Law: Equal Areas</h3>
          <p>Satellite sweeps equal areas in equal time. Translation: Goes faster when closer to Earth.</p>
          <p>Like skater pulling arms in!</p>
          <h3>Third Law: Period Squared</h3>
          <p>T² ∝ a³</p>
          <p>Orbital period only depends on semi-major axis. Higher orbit = longer period.</p>
          <p>ISS (400km): 90 minutes GPS (20,000km): 12 hours GEO (35,786km): 24 hours</p>
          <h2>Orbital Elements</h2>
          <p>Six numbers completely describe any orbit:</p>
          <p>1. <strong>Semi-major axis (a)</strong>: Size 2. <strong>Eccentricity (e)</strong>: Shape (0=circle, 1=parabola) 3. <strong>Inclination (i)</strong>: Tilt from equator 4. <strong>RAAN (Ω)</strong>: Rotation around Earth 5. <strong>Argument of perigee (ω)</strong>: Rotation in plane 6. <strong>True anomaly (ν)</strong>: Where satellite is now</p>
          <p>Like GPS coordinates but for space!</p>
          <h2>Ground Tracks</h2>
          <p>Where satellite passes over Earth. Mind-blowing realization:</p>
          <p>Earth rotates under orbit!</p>
          <p>90-minute orbit crosses equator 16 times/day. But Earth rotates once. So ground track shifts west each orbit.</p>
          <p>Made MATLAB visualization:</p>
          <pre className="language-matlab"><code>{`for t = 0:60:5400  % 90 minutes
    % Calculate satellite position
    [r,v] = sgp4(tle, t);
    
    % Convert to lat/lon
    [lat,lon] = eci2lla(r, t);
    
    % Plot on map
    plot(lon, lat, 'r.');
end`}</code></pre>
          <p>Beautiful sinusoidal pattern!</p>
          <h2>Perturbations (Reality Strikes)</h2>
          <p>Perfect orbits don't exist. Why?</p>
          <h3>J2 - Earth Isn\'t Spherical</h3>
          <p>Earth bulges at equator. Extra gravity pulls on satellite.</p>
          <p>Effects:</p>
          <ul>
            <li>Orbit plane rotates (precession)</li>
            <li>Perigee moves (apsidal rotation)</li>
          </ul>
          <p>Can be useful! Sun-synchronous orbits use J2.</p>
          <h3>Atmospheric Drag</h3>
          <p>Even at 400km, thin atmosphere exists.</p>
          <p>Drag force: F = 0.5 × ρ × v² × Cd × A</p>
          <p>Our CubeSat:</p>
          <ul>
            <li>Area: 0.01 m²</li>
            <li>Cd: ~2.2</li>
            <li>Velocity: 7,670 m/s</li>
          </ul>
          <p>Result: Orbit decays ~100m/day</p>
          <h3>Solar Radiation Pressure</h3>
          <p>Photons have momentum! Push on satellite.</p>
          <p>Force tiny but continuous. Over time, changes orbit.</p>
          <h3>Third Body Effects</h3>
          <p>Moon and Sun pull on satellite. Usually negligible for LEO.</p>
          <h2>Station Keeping</h2>
          <p>How to maintain orbit?</p>
          <h3>Chemical Propulsion</h3>
          <ul>
            <li>High thrust</li>
            <li>Low efficiency</li>
            <li>Limited by fuel</li>
          </ul>
          <h3>Electric Propulsion</h3>
          <ul>
            <li>Low thrust</li>
            <li>High efficiency</li>
            <li>Perfect for CubeSat!</li>
          </ul>
          <p>Our design: None. Accept decay, plan mission accordingly.</p>
          <h2>Orbital Maneuvers</h2>
          <h3>Hohmann Transfer</h3>
          <p>Most efficient orbit change: 1. Burn at perigee to raise apogee 2. Burn at apogee to circularize</p>
          <p>Two burns, minimal fuel.</p>
          <h3>Plane Changes</h3>
          <p>Changing inclination expensive! ΔV = 2 × V × sin(Δi/2)</p>
          <p>45° plane change needs velocity equal to orbital velocity!</p>
          <p>Lesson: Launch into correct inclination.</p>
          <h2>Launch Windows</h2>
          <p>Can't launch anytime. Need:</p>
          <ul>
            <li>Correct orbital plane</li>
            <li>Proper sun angle</li>
            <li>Ground station coverage</li>
          </ul>
          <p>For ISS orbit: ~4 windows per day from Kennedy Space Center.</p>
          <h2>Relative Motion</h2>
          <p>Two satellites in same orbit drift apart slowly. Why?</p>
          <p>Even tiny differences accumulate:</p>
          <ul>
            <li>1 m/s velocity difference</li>
            <li>After one orbit: 5.4 km apart!</li>
          </ul>
          <p>Rendezvous is HARD.</p>
          <h2>STK - Satellite Tool Kit</h2>
          <p>Industry standard software. Student version free!</p>
          <p>Built our mission:</p>
          <ul>
            <li>Imported CubeSat model</li>
            <li>Set orbital elements</li>
            <li>Added ground stations</li>
            <li>Simulated full mission</li>
          </ul>
          <p>Discoveries:</p>
          <ul>
            <li>4-6 passes per day per station</li>
            <li>Max 12 minutes per pass</li>
            <li>Some passes barely above horizon</li>
          </ul>
          <h2>Link Budget Meets Orbits</h2>
          <p>Higher altitude pros:</p>
          <ul>
            <li>Longer passes</li>
            <li>Less drag</li>
            <li>Wider coverage</li>
          </ul>
          <p>Higher altitude cons:</p>
          <ul>
            <li>More path loss</li>
            <li>Harder to reach</li>
            <li>More radiation</li>
          </ul>
          <p>Sweet spot for CubeSat: 400-600km</p>
          <h2>Deorbit Planning</h2>
          <p>What goes up must come down. Eventually.</p>
          <p>25-year rule: Must deorbit within 25 years.</p>
          <p>Our CubeSat at 400km:</p>
          <ul>
            <li>Ballistic coefficient: 10 kg/m²</li>
            <li>Natural decay: ~2 years</li>
            <li>Compliant!</li>
          </ul>
          <p>At 700km: Would last 100+ years. Not allowed.</p>
          <h2>Coding Orbital Propagators</h2>
          <p>SGP4 most common. Implemented in Python:</p>
          <pre className="language-python"><code>{`def sgp4_step(satellite, minutes):
    # Pages of math here...
    # But basically:
    # 1. Account for perturbations
    # 2. Calculate new position
    # 3. Return r,v vectors
    pass`}</code></pre>
          <p>Libraries exist. Use them!</p>
          <h2>The GPS Revelation</h2>
          <p>GPS works because orbital mechanics predictable!</p>
          <ul>
            <li>Know satellite positions precisely</li>
            <li>Measure signal time delays</li>
            <li>Triangulate position</li>
          </ul>
          <p>If orbits were chaotic, no GPS.</p>
          <h2>Visualizing Orbits</h2>
          <p>Built 3D visualizer in Processing:</p>
          <ul>
            <li>Earth model</li>
            <li>Satellite track</li>
            <li>Ground coverage</li>
            <li>Real-time propagation</li>
          </ul>
          <p>Seeing orbit in 3D finally made inclination clear!</p>
          <h2>Common Misconceptions</h2>
          <h3>\"Satellites Need Fuel to Stay Up\"</h3>
          <p>No! Newton's first law. No fuel needed for orbit.</p>
          <h3>\"Higher is Faster\"</h3>
          <p>Opposite! Higher orbits move slower. ISS: 17,500 mph GEO: 6,876 mph</p>
          <h3>\"Straight Up Gets to Orbit\"</h3>
          <p>Need horizontal velocity! Rockets curve for reason.</p>
          <h2>Practical Applications</h2>
          <p>Choosing our orbit:</p>
          <ul>
            <li>Altitude: 450km (balance drag vs communication)</li>
            <li>Inclination: 51.6° (ISS orbit, rideshare opportunity)</li>
            <li>Eccentricity: 0.001 (nearly circular)</li>
          </ul>
          <p>Result: 93 minute period, 15.5 orbits/day</p>
          <h2>Resources That Helped</h2>
          <p>Books:</p>
          <ul>
            <li>Fundamentals of Astrodynamics (BMW book)</li>
            <li>Orbital Mechanics for Engineering Students</li>
          </ul>
          <p>Software:</p>
          <ul>
            <li>STK (free student version)</li>
            <li>GMAT (NASA, open source)</li>
            <li>Celestia (beautiful visualizer)</li>
          </ul>
          <p>Online:</p>
          <ul>
            <li>Orbital Mechanics course (YouTube)</li>
            <li>AGI tutorials</li>
            <li>NASA Horizons</li>
          </ul>
          <h2>The Beauty of It</h2>
          <p>Six numbers describe where something will be in space. Forever.</p>
          <p>That predictability enables:</p>
          <ul>
            <li>GPS</li>
            <li>Weather satellites</li>
            <li>Communications</li>
            <li>Science missions</li>
          </ul>
          <p>Kepler figured this out 400 years ago with just observations!</p>
          <h2>Next Steps</h2>
          <p>Learning:</p>
          <ul>
            <li>Interplanetary trajectories</li>
            <li>Formation flying</li>
            <li>Attitude dynamics</li>
            <li>Optimal control</li>
          </ul>
          <p>Our CubeSat just needs simple orbit. But understanding why is everything.</p>
          <p><em>Currently: Running 1-year mission simulation. Watching orbital decay, planning operations. Also building antenna tracking predictor. Orbits determine everything!</em></p>
        </div>
      </article>
    </>
  );
}