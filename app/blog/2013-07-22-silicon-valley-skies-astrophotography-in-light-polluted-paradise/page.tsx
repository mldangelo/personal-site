import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Silicon Valley Skies: Astrophotography in Light-Polluted Paradise</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2013-07-22">July 21, 2013</time>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">photography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">astrophotography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">bay-area</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">light-pollution</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Moving from upstate New York to Menlo Park for my Facebook internship brought culture shock in many ways. For an astrophotographer, the biggest shock was the sky - or lack thereof. The Bay Area's orange glow makes Buffalo look like a dark sky site.</p>
            <h2>The Light Pollution Reality</h2>
            <p>Bortle Scale comparison:</p>
            <ul>
              <li>Rural New York: Class 4 (Milky Way visible)</li>
              <li>Buffalo suburbs: Class 6 (Only bright stars)</li>
              <li>Menlo Park: Class 8-9 (Is that Jupiter or an airplane?)</li>
            </ul>
            <p>First night with my camera was depressing. 30-second exposure showed... orange. Just orange.</p>
            <h2>Adapting to the Glow</h2>
            <p>Instead of giving up, I adapted:</p>
            <h3>1. Narrow-Band Filtering</h3>
            <p>Invested intern paycheck in:</p>
            <ul>
              <li>Astronomik CLS (City Light Suppression) filter</li>
              <li>Clips into camera body</li>
              <li>Blocks sodium and mercury vapor lights</li>
              <li>Preserves H-alpha and other emissions</li>
            </ul>
            <p>Result: Can actually see some nebulae!</p>
            <h3>2. Different Targets</h3>
            <p>Forget wide-field Milky Way. Focus on:</p>
            <ul>
              <li>Moon (unaffected by light pollution)</li>
              <li>Planets (bright enough to cut through)</li>
              <li>Double stars (fun challenges)</li>
              <li>ISS passes (plenty of those)</li>
              <li>Airplanes (so many airplanes...)</li>
            </ul>
            <h3>3. Drive to Darkness</h3>
            <p>Weekend trips become photo expeditions:</p>
            <ul>
              <li>Mount Hamilton: 1 hour, Class 4 skies</li>
              <li>Mount Tam: 45 minutes, decent northern sky</li>
              <li>Big Sur: 2 hours, spectacular but foggy</li>
              <li>Yosemite: 3 hours, worth every minute</li>
            </ul>
            <h2>Urban Astronomy Projects</h2>
            <p>Making lemonade from light-polluted lemons:</p>
            <h3>Project 1: Airplane Trail Time-Lapse</h3>
            <ul>
              <li>500+ flights per night over Bay Area</li>
              <li>Created "flight path map" via long exposure</li>
              <li>Accidentally documented SFO approach patterns</li>
              <li>FAA found it interesting enough to share</li>
            </ul>
            <h3>Project 2: Satellite Highway</h3>
            <ul>
              <li>Bay Area = lots of satellites</li>
              <li>Captured 47 satellites in one 10-minute exposure</li>
              <li>Identified several classified objects</li>
              <li>Started catalog of regular passes</li>
            </ul>
            <h3>Project 3: Moon Detail Challenge</h3>
            <ul>
              <li>Light pollution doesn't affect lunar photography</li>
              <li>Borrowed 8" telescope from Peninsula Astronomical Society</li>
              <li>Achieved 0.5 arc-second resolution</li>
              <li>Could see Apollo landing sites (barely)</li>
            </ul>
            <h2>Technical Innovations</h2>
            <p>Necessity drives innovation:</p>
            <h3>Sky Glow Subtraction Algorithm</h3>
            <pre className="language-python"><code>{`def remove_sky_glow(image):\\n    # Sample "empty" sky areas\\n    background = estimate_background(image)\\n    \\n    # Fit 2D polynomial to glow pattern\\n    glow_model = fit_polynomial_2d(background)\\n    \\n    # Subtract while preserving stars\\n    cleaned = image - glow_model\\n    \\n    # Restore star colors\\n    return color_preserve(cleaned, image)`}</code></pre>
            <p>Works surprisingly well for moderate pollution!</p>
            <h2>Unexpected Discoveries</h2>
            <p>Light pollution revealed interesting phenomena:</p>
            <ul>
              <li><strong>Atmospheric Layers</strong></li>
            </ul>
            <p>   - Pollution makes atmosphere visible</p>
            <p>   - Can see temperature inversions</p>
            <p>   - Marine layer interactions documented</p>
            <ul>
              <li><strong>Urban Bird Migration</strong></li>
            </ul>
            <p>   - Birds visible against glowing sky</p>
            <p>   - Documented migration patterns</p>
            <p>   - Shared with local Audubon society</p>
            <ul>
              <li><strong>Rocket Launches</strong></li>
            </ul>
            <p>   - Vandenberg launches visible from Bay Area</p>
            <p>   - Light pollution actually helps visibility</p>
            <p>   - Captured several SpaceX missions</p>
            <h2>The Social Aspect</h2>
            <p>Facebook culture + astrophotography = interesting mix:</p>
            <ul>
              <li>Set up telescope on MPK rooftop</li>
              <li>"Astronomy & Algorithms" internal group</li>
              <li>Taught coworkers constellation basics</li>
              <li>Several converts to the hobby</li>
            </ul>
            <p>Funny moment: Security called about "suspicious device on roof at 3 AM." Had to explain astronomy to bemused guard.</p>
            <h2>Bay Area Astronomy Resources</h2>
            <p>Found amazing community:</p>
            <ul>
              <li>Peninsula Astronomical Society (super welcoming)</li>
              <li>Chabot Space & Science Center (great events)</li>
              <li>Lick Observatory (public nights)</li>
              <li>Amateur telescope makers group</li>
            </ul>
            <h2>Best Urban Astro Spots</h2>
            <p>For fellow Bay Area astronomers:</p>
            <ul>
              <li><strong>Windy Hill</strong>: Decent western sky</li>
              <li><strong>Russian Ridge</strong>: Above fog line</li>
              <li><strong>Mount Diablo</strong>: Worth the drive</li>
              <li><strong>Coyote Lake</strong>: South Bay hidden gem</li>
              <li><strong>Pescadero Beach</strong>: Dark western horizon</li>
            </ul>
            <h2>Gear Evolution</h2>
            <p>Adapted kit for travel-friendly urban astronomy:</p>
            <ul>
              <li>Compact tracker (iOptron SkyTracker)</li>
              <li>Fast lenses (50mm f/1.8, 135mm f/2)</li>
              <li>Light pollution filters</li>
              <li>Sturdy but portable tripod</li>
            </ul>
            <p>Everything fits in backpack for spontaneous sessions!</p>
            <h2>Lessons Learned</h2>
            <ul>
              <li><strong>Constraints breed creativity</strong> - Limited sky pushed new techniques</li>
              <li><strong>Community matters</strong> - Bay Area astronomers are amazing</li>
              <li><strong>Perfect is enemy of good</strong> - Orange photos still better than no photos</li>
              <li><strong>Document everything</strong> - Urban astronomy is changing rapidly</li>
              <li><strong>Share the view</strong> - Most people have never seen Saturn</li>
            </ul>
            <h2>The Bigger Picture</h2>
            <p>This summer taught me that astrophotography isn't just about dark skies and expensive gear. It's about curiosity, persistence, and finding beauty wherever you are. Even under the orange glow of Silicon Valley, the universe is still there, waiting to be discovered.</p>
            <p>When I return to Buffalo for senior year, I'll appreciate those Class 6 skies like never before. But I'll also miss the challenge of pulling photons from the light-polluted soup of the Bay Area.</p>
            <p>Sometimes the best astronomy happens in the worst conditions.</p>
            <p><em>Currently working on "Astrophotography in 50 Cities" - documenting what's visible from major urban areas. Contributors welcome!</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
