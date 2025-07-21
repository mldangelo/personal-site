import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Building a Clean Room on a Budget - Michael D'Angelo",
  description: "Assembling flight hardware requires clean environment. Built ISO Class 100,000 clean room for under $500. Here's how.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-04-15-building-a-clean-room-on-a-budget">
        <header>
          <h1 className="text-4xl font-bold mb-4">Building a Clean Room on a Budget</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-04-15').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 13 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['clean-room', 'diy', 'cubesat', 'contamination'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>"Don't even breathe on the solar cells." That's when I realized we need a clean room. Professional clean room: $50,000+. Our budget: $500. Time to get creative.</p>
          <h2>Why Clean Rooms Matter</h2>
          <p>For satellites:</p>
          <ul>
            <li>Dust = thermal problems</li>
            <li>Fingerprints = optical degradation</li>
            <li>Contamination = mission failure</li>
          </ul>
          <p>One spec of dust in wrong place could kill our CubeSat.</p>
          <h2>Clean Room Basics</h2>
          <p>ISO classifications (particles per cubic meter):</p>
          <ul>
            <li>Class 1: <10 particles (semiconductor fabs)</li>
            <li>Class 1000: <1000 particles (medical devices)</li>
            <li>Class 100,000: <100,000 particles (our target)</li>
          </ul>
          <p>Regular room: ~5,000,000 particles. We need 50× cleaner.</p>
          <h2>Our Design Approach</h2>
          <p>Started with unused corner of lab:</p>
          <ul>
            <li>8' × 10' space</li>
            <li>Concrete floor</li>
            <li>No windows (good!)</li>
            <li>Single door</li>
          </ul>
          <p>Goal: Create positive pressure filtered environment.</p>
          <h2>The PVC Frame Solution</h2>
          <p>Built frame from PVC pipe:</p>
          <ul>
            <li>1" Schedule 40 PVC</li>
            <li>Corner fittings</li>
            <li>Total cost: $75</li>
          </ul>
          <p>Why PVC?</p>
          <ul>
            <li>Cheap</li>
            <li>Easy to clean</li>
            <li>No particle generation</li>
            <li>Reconfigurable</li>
          </ul>
          <p>Frame design: 8' × 10' × 8' tall box.</p>
          <h2>Walls: Plastic Sheeting Done Right</h2>
          <p>Used 6 mil clear plastic sheeting:</p>
          <ul>
            <li>Anti-static treated (critical!)</li>
            <li>Overlap seams by 6"</li>
            <li>Seal with vinyl tape</li>
            <li>Total cost: $50</li>
          </ul>
          <p>Pro tip: Iron seams for perfect seal (low heat, parchment paper barrier).</p>
          <h2>The Heart: Air Filtration</h2>
          <h3>HEPA Filter Selection</h3>
          <p>Found HEPA filters at industrial surplus:</p>
          <ul>
            <li>24" × 24" × 12" deep</li>
            <li>99.97% efficient at 0.3 microns</li>
            <li>Rated 1000 CFM</li>
            <li>Cost: $100 each (new: $400)</li>
          </ul>
          <p>Bought two for redundancy.</p>
          <h3>Blower System</h3>
          <p>Box fans won't work - not enough pressure.</p>
          <p>Solution: Squirrel cage blower from old HVAC:</p>
          <ul>
            <li>1200 CFM capacity</li>
            <li>Variable speed (rheostat control)</li>
            <li>Free from scrapyard!</li>
          </ul>
          <h3>Pre-filtration</h3>
          <p>HEPA filters expensive. Protect with pre-filters:</p>
          <ul>
            <li>Furnace filters (MERV 8)</li>
            <li>Changed weekly</li>
            <li>$5 each</li>
          </ul>
          <h2>Air Flow Design</h2>
          <p>Laminar flow ideal but complex. Went with turbulent dilution:</p>
          <ul>
            <li>Filters in ceiling</li>
            <li>Air flows down</li>
            <li>Exits at floor level</li>
            <li>10+ air changes per hour</li>
          </ul>
          <p>Built ceiling plenum from plywood and sealed thoroughly.</p>
          <h2>Pressure Management</h2>
          <p>Positive pressure keeps contamination out:</p>
          <ul>
            <li>~0.05" water column above ambient</li>
            <li>Measured with manometer</li>
            <li>Achieved by restricting exhaust</li>
          </ul>
          <p>Added vinyl flap at floor for pressure relief.</p>
          <h2>Entry Protocol</h2>
          <p>Built anteroom from same materials:</p>
          <ul>
            <li>4' × 4' changing area</li>
            <li>Sticky mats for shoes</li>
            <li>Gowning bench</li>
          </ul>
          <p>Air shower substitute: Shop vacuum in reverse with HEPA filter.</p>
          <h2>Lighting Without Contamination</h2>
          <p>Regular fluorescents generate particles.</p>
          <p>Solution: LED strip lights</p>
          <ul>
            <li>Sealed in clear tubes</li>
            <li>No UV emission</li>
            <li>Low heat</li>
            <li>Bright enough for assembly</li>
          </ul>
          <h2>Environmental Monitoring</h2>
          <p>Can't manage what you don't measure.</p>
          <h3>Particle Counter</h3>
          <p>Rental too expensive. Built one!</p>
          <ul>
            <li>Laser diode</li>
            <li>Photodetector</li>
            <li>Arduino counting pulses</li>
            <li>Calibrated against real counter</li>
          </ul>
          <p>Not super accurate but shows trends.</p>
          <h3>Temperature/Humidity</h3>
          <ul>
            <li>DHT22 sensors</li>
            <li>Display outside room</li>
            <li>Log to SD card</li>
            <li>Maintain 68°F, 45% RH</li>
          </ul>
          <h2>Work Surfaces</h2>
          <p>ESD-safe critical for electronics:</p>
          <ul>
            <li>ESD mats on tables</li>
            <li>Wrist straps mandatory</li>
            <li>Ionizing bar for stubborn charges</li>
            <li>Conductive floor paint</li>
          </ul>
          <h2>Clean Room Garments</h2>
          <p>Full bunny suits overkill. Our protocol:</p>
          <ul>
            <li>Hair nets</li>
            <li>Disposable lab coats</li>
            <li>Nitrile gloves</li>
            <li>No makeup/cologne</li>
            <li>Closed-toe shoes</li>
          </ul>
          <p>Bulk purchase: $50</p>
          <h2>Tool Management</h2>
          <p>Dedicated clean room tools:</p>
          <ul>
            <li>Stainless steel tweezers</li>
            <li>Cleaned with IPA</li>
            <li>Stored in sealed containers</li>
            <li>Never leave clean room</li>
          </ul>
          <h2>Cleaning Protocols</h2>
          <p>Daily:</p>
          <ul>
            <li>Mop floor with IPA solution</li>
            <li>Wipe surfaces</li>
            <li>Check/clean sticky mats</li>
            <li>Empty trash</li>
          </ul>
          <p>Weekly:</p>
          <ul>
            <li>Deep clean all surfaces</li>
            <li>Check filter pressure drop</li>
            <li>Inspect plastic walls</li>
            <li>Particle count survey</li>
          </ul>
          <h2>Validation Testing</h2>
          <p>Borrowed real particle counter for validation:</p>
          <ul>
            <li>Center of room: 75,000 particles/m³</li>
            <li>Near filter: 10,000 particles/m³</li>
            <li>During work: 150,000 particles/m³</li>
          </ul>
          <p>Success! Class 100,000 achieved.</p>
          <h2>First Real Use: Solar Panel Assembly</h2>
          <p>Task: Attach cells to PCB substrate</p>
          <p>Protocol: 1. Pre-clean all parts outside 2. Gown up in anteroom 3. Enter clean room 4. Unpack on clean bench 5. Assembly with minimal motion 6. Package in clean container</p>
          <p>Result: Zero visible contamination!</p>
          <h2>Problems and Solutions</h2>
          <h3>Static Everywhere</h3>
          <p>Plastic walls = static nightmare Solution: Humidity control and anti-static spray</p>
          <h3>Filter Loading</h3>
          <p>Pre-filters clog quickly during construction Solution: Run outside air through window filter first</p>
          <h3>Temperature Control</h3>
          <p>Blower adds heat, no AC in corner Solution: Portable AC with HEPA filter on output</p>
          <h3>Vibration</h3>
          <p>Blower vibration disturbs delicate work Solution: Isolation mounts, flex coupling</p>
          <h2>Cost Breakdown</h2>
          <ul>
            <li>PVC frame: $75</li>
            <li>Plastic sheeting: $50</li>
            <li>HEPA filters: $200</li>
            <li>Blower: Free (scrapyard)</li>
            <li>Pre-filters: $50</li>
            <li>LED lights: $40</li>
            <li>ESD supplies: $60</li>
            <li>Garments: $50</li>
            <li>Misc (tape, tools): $75</li>
          </ul>
          <p>Total: $600 (slightly over budget but worth it)</p>
          <h2>Lessons Learned</h2>
          <p>1. <strong>Start simple</strong>: Basic clean room better than none 2. <strong>Seal everything</strong>: Tiny leaks defeat purpose 3. <strong>Monitor constantly</strong>: Can't improve without data 4. <strong>Train everyone</strong>: One person's mistake contaminates all 5. <strong>Maintain discipline</strong>: Protocols only work if followed</p>
          <h2>Comparison to Professional</h2>
          <p>Professional clean room:</p>
          <ul>
            <li>Better filtration</li>
            <li>Precise control</li>
            <li>Validated systems</li>
            <li>Automatic monitoring</li>
            <li>$$$$</li>
          </ul>
          <p>Our clean room:</p>
          <ul>
            <li>Good enough filtration</li>
            <li>Basic control</li>
            <li>DIY validation</li>
            <li>Manual monitoring</li>
            <li>$600</li>
          </ul>
          <p>For student satellite? Ours works fine.</p>
          <h2>Future Improvements</h2>
          <p>Planning:</p>
          <ul>
            <li>Airlock instead of anteroom</li>
            <li>Better particle counter</li>
            <li>Automatic logging</li>
            <li>UV sterilization</li>
            <li>Pass-through chamber</li>
          </ul>
          <h2>Impact on Project</h2>
          <p>Before clean room:</p>
          <ul>
            <li>Constant contamination worries</li>
            <li>Fingerprints on optics</li>
            <li>Dust in mechanisms</li>
            <li>Flux residue everywhere</li>
          </ul>
          <p>After:</p>
          <ul>
            <li>Confident assembly</li>
            <li>Clean hardware</li>
            <li>Professional results</li>
            <li>Team takes it seriously</li>
          </ul>
          <h2>Tips for Others</h2>
          <p>1. <strong>Location matters</strong>: Away from traffic 2. <strong>Seal floor</strong>: Concrete generates dust 3. <strong>No cardboard</strong>: Particle generator 4. <strong>Dedicated supplies</strong>: Don't share with dirty lab 5. <strong>Make it official</strong>: Signs and protocols</p>
          <h2>The Unexpected Benefits</h2>
          <p>Clean room became special place:</p>
          <ul>
            <li>Quiet focus area</li>
            <li>Team bonding during gowning</li>
            <li>Sense of "real" space work</li>
            <li>Impressive for visitors</li>
          </ul>
          <h2>Documentation</h2>
          <p>Created:</p>
          <ul>
            <li>Assembly procedures</li>
            <li>Cleaning protocols</li>
            <li>Entry/exit checklist</li>
            <li>Contamination log</li>
            <li>Filter change schedule</li>
          </ul>
          <h2>The Reality</h2>
          <p>Is it perfect? No. Does it work? Yes. Would NASA approve? Probably not. Does our hardware stay clean? Absolutely.</p>
          <p>Sometimes "good enough" is perfect for the application.</p>
          <p><em>Next project: Pass-through UV sterilization chamber. Also investigating ultrasonic cleaning bath for tools. Clean room version 2.0 coming soon!</em></p>
        </div>
      </article>
    </>
  );
}