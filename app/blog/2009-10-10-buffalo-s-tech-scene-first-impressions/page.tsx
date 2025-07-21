import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Buffalo's Tech Scene: First Impressions</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-10-10">October 9, 2009</time>
              <span>•</span>
              <span>4 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">buffalo</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">tech-scene</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">community</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Two months in Buffalo, and I\'m starting to discover there\'s more tech here than just the university. You have to dig a bit, but it\'s there.</p>
            <h2>The University Bubble</h2>
            <p>It\'s easy to stay in the UB bubble:</p>
            <ul>
              <li>North Campus to South Campus shuttle</li>
              <li>Everything you need within walking distance</li>
              <li>Student groups for every interest</li>
              <li>Why venture out?</li>
            </ul>
            <p>But curiosity won out. Started exploring.</p>
            <h2>Downtown Reality</h2>
            <p>First trip downtown was... sobering:</p>
            <ul>
              <li>Lots of empty buildings</li>
              <li>\"Buffalo: City of No Illusions\" feels accurate</li>
              <li>But signs of life in pockets</li>
              <li>Tech companies hidden in renovated warehouses</li>
            </ul>
            <p>Not Silicon Valley. But not dead either.</p>
            <h2>The Hidden Tech Scene</h2>
            <h3>Buffalo Niagara Medical Campus</h3>
            <p>Biotech is bigger than I realized:</p>
            <ul>
              <li>Hauptman-Woodward Institute (protein crystallography)</li>
              <li>Roswell Park (cancer research with serious computing needs)</li>
              <li>UB medical school spinning off startups</li>
              <li>Need for embedded systems in medical devices</li>
            </ul>
            <p>Might be internship opportunities here.</p>
            <h3>Former Industrial Sites</h3>
            <p>The old industrial infrastructure is being repurposed:</p>
            <ul>
              <li>Larkinville: warehouses becoming tech offices</li>
              <li>Buffalo Billion: state money trying to attract tech</li>
              <li>StartUp NY: tax breaks for companies near universities</li>
              <li>Empty factories with cheap rent attracting startups</li>
            </ul>
            <h3>Local Companies (That I\'ve Found)</h3>
            <ul>
              <li><strong>Synacor</strong>: Portal software, publicly traded, right in Buffalo</li>
              <li><strong>Liazon</strong>: Benefits software startup (heard they\'re growing fast)</li>
              <li><strong>Campus Labs</strong>: Education software, started by UB grads</li>
              <li><strong>Local Motion</strong>: GPS tracking for fleets</li>
            </ul>
            <p>Not huge, but real tech companies with real jobs.</p>
            <h2>Meetup Scene</h2>
            <p>Found some regular gatherings:</p>
            <ul>
              <li><strong>Buffalo JavaScript Meetup</strong>: Monthly, 20-30 people</li>
              <li><strong>WNY Ruby Users Group</strong>: Small but dedicated</li>
              <li><strong>Buffalo Hardware Meetup</strong>: Just started, perfect for me!</li>
              <li><strong>Startup Weekend Buffalo</strong>: Happening next month</li>
            </ul>
            <p>The hardware meetup is in a makerspace called Buffalo Lab. Mind = blown that this exists.</p>
            <h2>Buffalo Lab Makerspace</h2>
            <p>This place is amazing:</p>
            <ul>
              <li>3D printers (RepRap and MakerBot)</li>
              <li>Laser cutter (60W, can cut acrylic)</li>
              <li>Full electronics bench</li>
              <li>Woodworking tools</li>
              <li>Monthly membership: $40 (student discount!)</li>
            </ul>
            <p>Already planning to join. The Arduino workshop next week looks perfect.</p>
            <h2>Coffee Shop Culture</h2>
            <p>Finding the tech-friendly coffee spots:</p>
            <ul>
              <li><strong>Spot Coffee</strong>: WiFi works, outlets available</li>
              <li><strong>Café Aroma</strong>: Quieter, good for coding</li>
              <li><strong>Tim Hortons</strong>: Everywhere, cheap, Canadian</li>
              <li><strong>Starbucks</strong>: Reliable but crowded</li>
            </ul>
            <p>The Spot Coffee on Chippewa seems to be unofficial tech worker hangout.</p>
            <h2>Unexpected Discoveries</h2>
            <h3>Ham Radio Community</h3>
            <p>The Buffalo Amateur Radio Repeater Association (BARRA) is active:</p>
            <ul>
              <li>Weekly nets on 2m/70cm</li>
              <li>Monthly meetings</li>
              <li>Field Day participation</li>
              <li>Willing to help newcomers get licensed</li>
            </ul>
            <p>Planning to get my Technician license over winter break.</p>
            <h3>Retro Computing</h3>
            <p>Found a group restoring old computers:</p>
            <ul>
              <li>Commodore 64s, Apple IIs, even a PDP-11</li>
              <li>Monthly swap meets</li>
              <li>Teaching programming on vintage hardware</li>
              <li>Preservation of computing history</li>
            </ul>
            <p>Fascinating to see where we came from.</p>
            <h2>The Rust Belt Reality</h2>
            <p>Buffalo is post-industrial, no denying it:</p>
            <ul>
              <li>Population half what it was in 1950s</li>
              <li>Winters are brutal (so I\'m told)</li>
              <li>Brain drain is real</li>
              <li>But cost of living is amazing</li>
            </ul>
            <p>My dorm costs what a closet would in San Francisco.</p>
            <h2>Why This Matters</h2>
            <p>Could I find more tech in Boston or NYC? Sure. But:</p>
            <ul>
              <li>Less competition for opportunities</li>
              <li>Stronger community (everyone helps everyone)</li>
              <li>Room to make an impact</li>
              <li>Professors have time for undergrads</li>
            </ul>
            <p>Plus, Niagara Falls is 20 minutes away. Hard to beat that.</p>
            <h2>Building Community</h2>
            <p>Starting to get involved:</p>
            <ul>
              <li>Joined IEEE student chapter</li>
              <li>Attending Buffalo Hardware Meetup</li>
              <li>Planning Arduino workshop for dorm</li>
              <li>Maybe start a UB Makers club?</li>
            </ul>
            <p>In a smaller tech scene, it\'s easier to make connections.</p>
            <h2>Future Potential</h2>
            <p>Buffalo might surprise people:</p>
            <ul>
              <li>Cheap power (Niagara Falls)</li>
              <li>Cool climate (natural data center cooling)</li>
              <li>Fiber infrastructure being built</li>
              <li>Canadian tech scene 90 minutes away</li>
              <li>Universities producing talent</li>
            </ul>
            <p>If remote work takes off, places like Buffalo could boom.</p>
            <h2>The Verdict</h2>
            <p>No, it\'s not Silicon Valley. Or Boston. Or even Pittsburgh.</p>
            <p>But there\'s real tech happening here. Real problems being solved. Real opportunities for someone willing to look.</p>
            <p>And wings. Really good wings.</p>
            <p>Maybe that\'s enough for now.</p>
            <p><em>Next goal: Get to every tech meetup this semester. And try every wing place. For science.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
