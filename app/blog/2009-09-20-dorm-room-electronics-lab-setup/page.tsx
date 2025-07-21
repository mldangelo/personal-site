import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Dorm Room Electronics Lab Setup</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-09-20">September 19, 2009</time>
              <span>•</span>
              <span>4 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">electronics</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">diy</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">university</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Living in a 12x15 foot shared dorm room presents unique challenges when you need space for electronics projects. But with some creativity (and a very patient roommate), I\'ve managed to create a functional workspace.</p>
            <h2>The Space Constraints</h2>
            <p>Spaulding Quad rooms are... cozy. Split between two people:</p>
            <ul>
              <li>Two beds (lofted for space)</li>
              <li>Two desks (tiny)</li>
              <li>Two dressers</li>
              <li>One closet (shared)</li>
              <li>About 3 feet of walking space</li>
            </ul>
            <p>And I need to fit an electronics lab in here.</p>
            <h2>The Setup</h2>
            <h3>Under-Bed Workshop</h3>
            <p>Lofted my bed to maximum height (6 feet). Underneath:</p>
            <ul>
              <li>Plastic storage drawers for components</li>
              <li>Toolbox with essential tools</li>
              <li>Power strip with surge protection (crucial!)</li>
              <li>Anti-static mat rolled up when not in use</li>
            </ul>
            <h3>Desk Configuration</h3>
            <p>My desk has become command central:</p>
            <ul>
              <li>Monitor on swing arm (frees up desk space)</li>
              <li>Pegboard backing (dorm-friendly Command strips)</li>
              <li>Small parts organizers on pegboard</li>
              <li>Desk lamp with magnifying glass attachment</li>
            </ul>
            <h3>Essential Tools (Dorm Edition)</h3>
            <p>Had to be selective - no room for everything:</p>
            <ul>
              <li>Weller WLC100 soldering station (compact)</li>
              <li>Digital multimeter (Fluke 117 - splurged)</li>
              <li>Breadboards (various sizes)</li>
              <li>Wire strippers, flush cutters, tweezers</li>
              <li>USB oscilloscope (PicoScope 2204A - saved space)</li>
            </ul>
            <h3>Component Organization</h3>
            <p>Fishing tackle boxes are perfect:</p>
            <ul>
              <li>Resistor kit organized by value</li>
              <li>Capacitor assortment</li>
              <li>LED variety pack</li>
              <li>Basic IC collection (555s, op-amps, logic gates)</li>
              <li>Arduino Uno and shields</li>
            </ul>
            <h2>The Roommate Treaty</h2>
            <p>Mike (business major roommate) was... concerned. We established ground rules:</p>
            <ul>
              <li>No soldering after 10 PM</li>
              <li>Fume extractor fan is mandatory</li>
              <li>Keep chemicals (flux, cleaner) in sealed container</li>
              <li>His side of room is a no-fly zone for projects</li>
              <li>I buy pizza when projects get too annoying</li>
            </ul>
            <h2>Power Considerations</h2>
            <p>Dorm room power is sketchy. Learned the hard way:</p>
            <ul>
              <li>15A circuit shared with 3 other rooms</li>
              <li>Microwave + soldering iron = blown breaker</li>
              <li>UPS battery backup for computer (saved me twice)</li>
              <li>Power strip with individual switches (power management)</li>
            </ul>
            <h2>Ventilation Challenges</h2>
            <p>Soldering in a dorm room requires creativity:</p>
            <ul>
              <li>Window fan for exhaust (when weather permits)</li>
              <li>Small fume extractor with carbon filter</li>
              <li>Door open when working (met neighbors this way)</li>
              <li>Scheduled heavy soldering for when Mike\'s in class</li>
            </ul>
            <h2>First Projects</h2>
            <p>Already completed in the new space:</p>
            <ul>
              <li>LED cube (3x3x3 - learned about multiplexing)</li>
              <li>Arduino temperature logger</li>
              <li>Fixed three floor-mates\' broken electronics</li>
              <li>Started breadboarding 555 timer circuits</li>
            </ul>
            <h2>Unexpected Benefits</h2>
            <p>This setup has made me popular:</p>
            <ul>
              <li>\"The guy who can fix things\"</li>
              <li>Teaching interested floor-mates basic electronics</li>
              <li>Informal study group forming around projects</li>
              <li>RA thinks it\'s educational (staying on his good side)</li>
            </ul>
            <h2>Lessons Learned</h2>
            <ul>
              <li><strong>Organization is everything</strong> - Limited space means no mess tolerance</li>
              <li><strong>Safety first</strong> - Fire extinguisher within reach always</li>
              <li><strong>Community building</strong> - Shared interests overcome cramped quarters</li>
              <li><strong>Time management</strong> - Can\'t work all night anymore (roommate needs sleep)</li>
            </ul>
            <h2>Future Upgrades</h2>
            <p>Planning for next semester:</p>
            <ul>
              <li>Better ventilation solution</li>
              <li>Quieter fume extractor</li>
              <li>Maybe a 3D printer (if Mike doesn\'t revolt)</li>
              <li>Definitely more storage</li>
            </ul>
            <h2>The Reality</h2>
            <p>It\'s not ideal. A proper lab would have:</p>
            <ul>
              <li>Actual workbenches</li>
              <li>Proper ventilation</li>
              <li>Storage space</li>
              <li>Room to spread out</li>
            </ul>
            <p>But constraints breed creativity. This tiny space is producing real projects, and I\'m learning more about efficient design than any class could teach.</p>
            <p>Plus, debugging code at 2 AM is much easier when your electronics bench is three feet from your bed.</p>
            <p>Mike\'s tolerance level: 7/10 (pizza helps)</p>
            <p>My satisfaction level: 9/10 (would be 10/10 with more space)</p>
            <p>Next project: Building a custom PCB... in a dorm room. What could go wrong?</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
