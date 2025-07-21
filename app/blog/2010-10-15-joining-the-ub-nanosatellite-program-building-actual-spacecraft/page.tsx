import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Joining the UB Nanosatellite Program: Building Actual Spacecraft</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2010-10-15">October 14, 2010</time>
              <span>•</span>
              <span>4 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">cubesat</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">space</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">hardware</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">leadership</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Big news - I've just been selected as Hardware Lead for the UB Nanosatellite Program! We're building a 3U CubeSat called GLADOS (yes, Portal references abound in engineering departments). This is exactly the kind of hands-on experience I came to engineering school for.</p>
            <h2>What\'s a CubeSat?</h2>
            <p>For the uninitiated, CubeSats are miniature satellites based on 10cm × 10cm × 10cm units. Our 3U CubeSat is three units tall, so roughly 10 × 10 × 30 cm - about the size of a loaf of bread. Despite the small size, it's a fully functional spacecraft that will actually go to orbit.</p>
            <p>The constraints are intense:</p>
            <ul>
              <li>Mass: &lt; 4 kg</li>
            </ul>
            <p>            - Power: ~5W average from solar panels</p>
            <p>            - Must survive launch vibrations</p>
            <p>            - Must operate in space environment (-40°C to +85°C)</p>
            <p>            - No physical access after launch (obviously)</p>
            <p>            ## My Role: Power Subsystem</p>
            <p>As Hardware Lead, I'm responsible for the power subsystem - basically, keeping GLADOS alive in space. This involves:</p>
            <h3>Solar Panels</h3>
            <ul>
              <li>5 panels with triple-junction GaAs cells</li>
            </ul>
            <p>            - ~7W peak power generation</p>
            <p>            - Must handle extreme temperature cycling</p>
            <p>            ### Battery System</p>
            <ul>
              <li>Lithium-ion batteries (similar to laptop batteries)</li>
            </ul>
            <p>            - Must survive hundreds of charge/discharge cycles</p>
            <p>            - Thermal management is critical</p>
            <p>            ### Power Distribution</p>
            <ul>
              <li>Convert and regulate voltages for different subsystems</li>
            </ul>
            <p>            - Protect against overcurrent/overvoltage</p>
            <p>            - Implement redundancy for critical systems</p>
            <p>            ### Power Management</p>
            <ul>
              <li>Maximum Power Point Tracking (MPPT) for solar panels</li>
            </ul>
            <p>            - Battery charge/discharge control</p>
            <p>            - Load scheduling when power is limited</p>
            <p>            ## The Team</p>
            <p>We have about 20 students across different disciplines:</p>
            <ul>
              <li>Mechanical engineers designing the structure</li>
            </ul>
            <p>            - Aerospace engineers working on attitude control</p>
            <p>            - Computer engineers building the flight computer</p>
            <p>            - Physics students developing the payload</p>
            <p>            - Even some business students helping with funding</p>
            <p>            The interdisciplinary aspect is incredible. I'm learning as much from team meetings as from classes.</p>
            <h2>Technical Challenges</h2>
            <p>The power system faces unique challenges:</p>
            <h3>1. Orbital Dynamics</h3>
            <p>In Low Earth Orbit (LEO), we'll experience:</p>
            <ul>
              <li>90-minute orbits</li>
            </ul>
            <p>            - ~35 minutes of sunlight, 55 minutes of eclipse</p>
            <p>            - Rapid temperature swings</p>
            <p>            - Varying sun angles</p>
            <p>            ### 2. Radiation</p>
            <p>Space radiation can cause:</p>
            <ul>
              <li>Single Event Upsets (SEUs) - bit flips in electronics</li>
            </ul>
            <p>            - Total dose degradation over time</p>
            <p>            - Latch-up events that can destroy components</p>
            <p>            We're using radiation-tolerant components and implementing error correction.</p>
            <h3>3. Thermal Management</h3>
            <p>Without air for convection, thermal management is critical:</p>
            <ul>
              <li>Components can overheat in sun</li>
            </ul>
            <p>            - Batteries can freeze in eclipse</p>
            <p>            - Thermal cycling causes mechanical stress</p>
            <p>            ### 4. Reliability</p>
            <p>We can't fix anything after launch. Every component needs:</p>
            <ul>
              <li>Extensive testing</li>
            </ul>
            <p>            - Redundancy where possible</p>
            <p>            - Graceful degradation modes</p>
            <p>            - Conservative design margins</p>
            <p>            ## Current Progress</p>
            <p>We're in the preliminary design phase:</p>
            <ul>
              <li>Completed initial power budget (tight but doable)</li>
            </ul>
            <p>            - Selected solar cells and batteries</p>
            <p>            - Designing the power distribution board</p>
            <p>            - Starting on the battery management system</p>
            <p>            Next steps:</p>
            <ul>
              <li>Prototype the MPPT algorithm</li>
            </ul>
            <p>            - Thermal vacuum testing of batteries</p>
            <p>            - Vibration testing of solar panel mounts</p>
            <p>            - Design review with NASA (they're partially funding this!)</p>
            <p>            ## Learning Experiences</p>
            <p>Just a few weeks in, I've already learned tons:</p>
            <h3>Technical Skills</h3>
            <ul>
              <li>PCB design for high-reliability systems</li>
            </ul>
            <p>            - Power electronics at a deeper level</p>
            <p>            - Systems engineering principles</p>
            <p>            - Space environment considerations</p>
            <p>            ### Soft Skills</p>
            <ul>
              <li>Leading a technical team</li>
            </ul>
            <p>            - Presenting to faculty advisors</p>
            <p>            - Writing proposals and documentation</p>
            <p>            - Managing budgets and timelines</p>
            <p>            ## Why This Matters</p>
            <p>Building spacecraft as an undergrad is incredible for several reasons:</p>
            <ul>
              <li>**Real consequences** - This will actually fly. No room for \"good enough\"</li>
            </ul>
            <ul>
              <li>**Complete lifecycle** - From design to launch to operations</li>
            </ul>
            <ul>
              <li>**Industry relevance** - CubeSats are booming commercially</li>
            </ul>
            <ul>
              <li>**Research opportunities** - Our payload will collect real scientific data</li>
            </ul>
            <h2>Personal Reflections</h2>
            <p>When I chose EE over CS, this is exactly what I had in mind - building real hardware that does amazing things. There's something profound about building a device that will orbit Earth, looking down at all of us.</p>
            <p>The responsibility is sobering. I'm designing systems that need to work autonomously, hundreds of miles above Earth, in an environment we can't fully replicate in testing. Every design decision matters.</p>
            <h2>Looking Forward</h2>
            <p>Over the next two years, we'll:</p>
            <ul>
              <li>Complete design and prototyping</li>
            </ul>
            <p>            - Build and test the flight model</p>
            <p>            - Integrate with launch vehicle</p>
            <p>            - Launch! (Tentatively 2012)</p>
            <p>            - Operate from our ground station</p>
            <p>            I'll be documenting the journey here - the successes, failures, late nights in the lab, and hopefully, the moment we receive our first transmission from space.</p>
            <p>For any students reading this: get involved in project teams! Classes teach theory, but projects teach engineering. Find something you're passionate about and dive in. You'll learn more than you ever imagined.</p>
            <p>Ad astra! 🚀</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
