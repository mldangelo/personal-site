import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Lessons from Vacuum Chamber Testing</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2011-06-10">June 9, 2011</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">cubesat</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">testing</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">hardware</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">space</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Just finished a week of thermal vacuum testing for GLADOS, and wow - space is a harsh mistress. We put our power subsystem prototype through its paces in UB's vacuum chamber, simulating the extreme conditions of orbit. The results were... educational.</p>
            <h2>The Test Setup</h2>
            <p>Our vacuum chamber can:</p>
            <ul>
              <li>Pump down to 10^-6 Torr (essentially space vacuum)</li>
            </ul>
            <p>            - Temperature range: -65°C to +125°C</p>
            <p>            - Solar simulation with xenon lamps</p>
            <p>            - Full data logging of all parameters</p>
            <p>            We ran multiple test profiles:</p>
            <ul>
              <li>**Startup from cold** (-40°C)</li>
            </ul>
            <ul>
              <li>**Thermal cycling** (90-minute orbits)</li>
            </ul>
            <ul>
              <li>**Hot survival** (+85°C continuous)</li>
            </ul>
            <ul>
              <li>**Solar panel performance** across temperature range</li>
            </ul>
            <h2>What Worked</h2>
            <p>The good news first:</p>
            <h3>Solar Panels Exceeded Expectations</h3>
            <p>Our GaAs solar cells actually perform better in cold conditions. At -40°C, we saw 8% higher efficiency than room temperature. This partially compensates for reduced battery performance in cold.</p>
            <h3>Thermal Design Validated</h3>
            <p>Our thermal straps and radiators kept critical components within limits. The power FETs never exceeded 100°C even in worst-case power dissipation.</p>
            <h3>Redundancy Paid Off</h3>
            <p>When one voltage regulator started acting flaky at temperature extremes, the backup kicked in seamlessly. Redundancy isn't paranoia - it's insurance.</p>
            <h2>What Failed Spectacularly</h2>
            <p>Now the fun part - everything that went wrong:</p>
            <h3>Battery Heater Incident</h3>
            <p>Our battery heater control failed during cold testing. The heater stuck on, raising battery temperature to 65°C before we killed power. Lessons learned:</p>
            <ul>
              <li>Hardware temperature limits on heaters</li>
            </ul>
            <p>            - Independent thermal cutoffs</p>
            <p>            - Better thermal modeling of runaway conditions</p>
            <p>            ### Connector Disaster</p>
            <p>One power connector literally fell apart during thermal cycling. Turns out the specific connector wasn't rated for our temperature range. The thermal expansion/contraction fatigued the solder joints.</p>
            <p>Fix: Switch to space-rated Micro-D connectors (3x the cost, 10x the reliability).</p>
            <h3>Firmware Bug From Hell</h3>
            <pre className="language-text"><code>{`// What we had:\nif (battery_temp < MIN_TEMP) {\n    enable_heater();\n}\n\n// What we needed:\nif (battery_temp < MIN_TEMP && heater_power < MAX_HEATER_POWER) {\n    enable_heater();\n} else if (battery_temp > MAX_TEMP || heater_power >= MAX_HEATER_POWER) {\n    disable_heater();\n}`}</code></pre>
            <p>            Simple oversight, potentially mission-ending consequences.</p>
            <h3>Unexpected Outgassing</h3>
            <p>Some of our conformal coating outgassed in vacuum, leaving residue on optical surfaces. We had to switch to space-qualified coatings (Parylene-C).</p>
            <h2>The Reality of Space Hardware</h2>
            <p>This testing drove home several points:</p>
            <h3>1. Earth Experience Doesn\'t Transfer</h3>
            <p>Your intuition about thermal behavior is wrong in vacuum. Without convection:</p>
            <ul>
              <li>Hot things stay hot</li>
            </ul>
            <p>            - Cold things stay cold  </p>
            <p>            - Thermal gradients can be extreme</p>
            <p>            - Radiative heat transfer dominates</p>
            <p>            ### 2. Everything is Coupled</p>
            <p>In vacuum, thermal becomes electrical becomes mechanical:</p>
            <ul>
              <li>Battery voltage drops with temperature</li>
            </ul>
            <p>            - Solar panel efficiency changes</p>
            <p>            - Mechanical tolerances shift</p>
            <p>            - Timing crystals drift</p>
            <p>            ### 3. Test Like You Fly</p>
            <p>We found issues we never would have caught with benchtop testing:</p>
            <ul>
              <li>Connectors that work fine at room temp</li>
            </ul>
            <p>            - Thermal paths we didn't model correctly</p>
            <p>            - Component behaviors at extreme temperatures</p>
            <p>            ## Design Changes</p>
            <p>Based on testing, we're making significant changes:</p>
            <h3>Thermal</h3>
            <ul>
              <li>Adding MLI (Multi-Layer Insulation) blankets</li>
            </ul>
            <p>            - Better thermal strapping for batteries</p>
            <p>            - Redesigned heater control with hardware safety</p>
            <p>            ### Electrical</p>
            <ul>
              <li>All connectors upgraded to space-rated</li>
            </ul>
            <p>            - Additional bypass capacitors (temperature stable)</p>
            <p>            - Wider voltage margins for cold operation</p>
            <p>            ### Software</p>
            <ul>
              <li>Temperature-based parameter adjustment</li>
            </ul>
            <p>            - Better fault detection and recovery</p>
            <p>            - Graceful degradation modes</p>
            <p>            ## The Human Side</p>
            <p>Beyond the technical lessons, this week taught me about engineering under pressure:</p>
            <h3>Sleep Deprivation is Real</h3>
            <p>We ran tests 24/7 to maximize chamber time. Taking shifts to monitor systems at 3 AM gives you a new appreciation for mission control.</p>
            <h3>Murphy\'s Law is Optimistic</h3>
            <p>Everything that can go wrong will. At the worst possible time. Plan accordingly.</p>
            <h3>Documentation Matters</h3>
            <p>When troubleshooting a failure at hour 47 of testing, good notes are worth their weight in gold.</p>
            <h3>Team Dynamics Under Stress</h3>
            <p>Nothing bonds a team like collectively watching your hardware fail at 2 AM, then brainstorming fixes over terrible coffee.</p>
            <h2>Looking Forward</h2>
            <p>We have one more round of thermal vacuum testing after implementing fixes. Then it's on to:</p>
            <ul>
              <li>Vibration testing (shake table fun!)</li>
            </ul>
            <p>            - EMC testing (electromagnetic compatibility)</p>
            <p>            - Full system integration tests</p>
            <p>            - Environmental testing of the flight model</p>
            <p>            ## Advice for Future Space Hardware Engineers</p>
            <ul>
              <li>**Test early and often** - Finding issues in thermal vac is better than finding them in orbit</li>
            </ul>
            <ul>
              <li>**Margin is your friend** - If calculations say you need 5W, design for 7W</li>
            </ul>
            <ul>
              <li>**Question everything** - \"Space-rated\" doesn\'t mean infallible</li>
            </ul>
            <ul>
              <li>**Document failures** - They\'re more valuable than successes</li>
            </ul>
            <ul>
              <li>**Respect the environment** - Space wants to kill your hardware</li>
            </ul>
            <h2>Final Thoughts</h2>
            <p>This week was exhausting, frustrating, and absolutely thrilling. Watching our hardware survive (mostly) in space-like conditions makes the late nights and endless debugging worth it.</p>
            <p>We're building something that will orbit Earth. Every failed component, every design iteration, every test brings us closer to that goal. The margin for error is zero, but that's what makes it exciting.</p>
            <p>Next time you see a satellite photo or GPS on your phone, remember - someone tested that hardware until it broke, fixed it, and tested it again. Space is hard, but that's what makes it worth doing.</p>
            <p>*Note to self: Order more coffee for next test campaign. And maybe a sleeping bag for the lab.*</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
