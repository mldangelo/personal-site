import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Iceland Aurora Photography: When Nature Provides the Light Show</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2015-08-15">August 14, 2015</time>
              <span>•</span>
              <span>8 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">photography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">aurora</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">iceland</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">travel</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">astrophotography</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>After years of photographing dim nebulae and fighting light pollution, Iceland delivered something different: a sky that photographs itself. The aurora borealis is nature's own light show, but capturing it properly requires technique, preparation, and a bit of luck.</p>
            <h2>The Iceland Decision</h2>
            <p>Why Iceland for aurora photography:</p>
            <ul>
              <li>Dark skies (population: 360,000)</li>
              <li>Accessible locations </li>
              <li>September = aurora season begins</li>
              <li>Direct flight from SFO</li>
              <li>Geology bonus: otherworldly landscapes</li>
            </ul>
            <p>Booked a week off between Stanford courses. Research suggested 70% chance of seeing aurora in late September.</p>
            <h2>Pre-Trip Preparation</h2>
            <h3>Aurora Forecasting:</h3>
            <ul>
              <li>KP index predictions (need 3+)</li>
              <li>Solar wind monitoring</li>
              <li>Cloud cover forecasts</li>
              <li>Moon phase planning (new moon ideal)</li>
            </ul>
            <h3>Gear Selection:</h3>
            <ul>
              <li>Two camera bodies (backup essential)</li>
              <li>14mm f/2.8 (wide for full sky)</li>
              <li>24mm f/1.4 (detail shots)</li>
              <li>50mm f/1.8 (vertical curtains)</li>
              <li>Sturdy tripod (Iceland = windy)</li>
              <li>Extra batteries (cold kills them)</li>
            </ul>
            <h2>First Night: Baptism by Fire</h2>
            <p>Location: Jökulsárlón Glacier Lagoon</p>
            <p>Conditions: KP 5, clear skies, -2°C</p>
            <p>Nothing prepares you for that first strong aurora:</p>
            <ul>
              <li>Started as faint glow (thought it was light pollution)</li>
              <li>Suddenly: green curtains dancing overhead</li>
              <li>Purple edges appeared during substorm</li>
              <li>Reflection in glacial lake doubled the show</li>
            </ul>
            <h2>Technical Approach</h2>
            <p>Aurora photography differs from static astrophotography:</p>
            <h3>Dynamic Exposure:</h3>
            <ul>
              <li>Faint aurora: ISO 3200, 8-15 seconds</li>
              <li>Moderate: ISO 1600, 4-8 seconds  </li>
              <li>Strong: ISO 800, 1-4 seconds</li>
              <li>Substorm: ISO 400, <1 second</li>
            </ul>
            <p>Too long exposure = blurred curtains, lost detail</p>
            <h3>Focus Challenge:</h3>
            <ul>
              <li>Can't use stars (aurora is closer)</li>
              <li>Pre-focus on distant mountains</li>
              <li>Tape focus ring</li>
              <li>Check every 30 minutes (temperature shifts)</li>
            </ul>
            <h2>The Dance of Composition</h2>
            <p>Unlike static stars, aurora demands reactive composition:</p>
            <h3>Vertical Development:</h3>
            <ul>
              <li>Corona overhead = ultra-wide lens</li>
              <li>Use foreground for scale</li>
              <li>Portrait orientation for curtains</li>
              <li>Include horizon for context</li>
            </ul>
            <h3>Predictive Framing:</h3>
            <ul>
              <li>Aurora moves north to south</li>
              <li>Pre-compose for anticipated movement</li>
              <li>Leave space for development</li>
              <li>Bracket compositions wildly</li>
            </ul>
            <h2>Color Science</h2>
            <p>Aurora colors tell a story:</p>
            <ul>
              <li>Green (557.7nm): Oxygen at 100-300km</li>
              <li>Red (630.0nm): Oxygen above 300km</li>
              <li>Purple/Blue: Nitrogen below 100km</li>
              <li>Pink edges: Nitrogen + oxygen mix</li>
            </ul>
            <p>Camera sees more color than eyes - trust the sensor!</p>
            <h2>The Magic Hour(s)</h2>
            <p>September 23rd, 2 AM, Stokksnes Peninsula:</p>
            <p>KP index spiked to 7. What followed was indescribable:</p>
            <ul>
              <li>Entire sky in motion</li>
              <li>Corona directly overhead</li>
              <li>Ground illuminated green</li>
              <li>Could read by aurora light</li>
              <li>Other photographers just standing, watching</li>
            </ul>
            <p>Technical notes from that night:</p>
            <ul>
              <li>400+ images in 3 hours</li>
              <li>ISO range: 200-3200</li>
              <li>Exposures: 0.5-10 seconds</li>
              <li>Battery changes: 4</li>
              <li>Moments of pure awe: countless</li>
            </ul>
            <h2>Post-Processing Philosophy</h2>
            <p>Aurora images need restraint:</p>
            <h3>What I Do:</h3>
            <ul>
              <li>Adjust exposure/shadows</li>
              <li>Enhance contrast slightly</li>
              <li>Reduce noise carefully</li>
              <li>Correct lens distortion</li>
            </ul>
            <h3>What I Don't:</h3>
            <ul>
              <li>Oversaturate colors</li>
              <li>Add fake colors</li>
              <li>Composite different nights</li>
              <li>Clone out elements</li>
            </ul>
            <p>The aurora is spectacular enough without fakery.</p>
            <h2>Unexpected Challenges</h2>
            <ul>
              <li><strong>Condensation</strong></li>
            </ul>
            <p>   - Lens fogs moving from cold to warm</p>
            <p>   - Solution: gradual temperature changes</p>
            <p>   - Keep lens cloth handy</p>
            <ul>
              <li><strong>Overwhelming Choice</strong></li>
            </ul>
            <p>   - Aurora everywhere = composition paralysis</p>
            <p>   - Solution: work one scene thoroughly</p>
            <p>   - Quality over quantity</p>
            <ul>
              <li><strong>File Management</strong></li>
            </ul>
            <p>   - 64GB cards filled nightly</p>
            <p>   - Backup ritual essential</p>
            <p>   - Label immediately or lose track</p>
            <h2>The Human Element</h2>
            <p>Met photographers from 12 countries chasing aurora:</p>
            <ul>
              <li>Japanese photographer: 10th trip</li>
              <li>Norwegian couple: honeymoon aurora hunt</li>
              <li>NASA scientist: studying aurora dynamics</li>
              <li>Local guide: 1000+ nights experience</li>
            </ul>
            <p>Shared tips, locations, warm coffee. Aurora photography builds instant community.</p>
            <h2>Beyond the Green</h2>
            <p>Other phenomena captured:</p>
            <ul>
              <li>Steve (Strong Thermal Emission Velocity Enhancement)</li>
              <li>Pulsating aurora</li>
              <li>Black aurora (dark patches)</li>
              <li>Proton aurora (diffuse, rare)</li>
            </ul>
            <p>Each requires different technique, tells different story about magnetosphere.</p>
            <h2>Lessons for Future Trips</h2>
            <ul>
              <li><strong>Stay longer</strong> - Week wasn't enough</li>
              <li><strong>Rent car</strong> - Flexibility crucial</li>
              <li><strong>Scout daylight</strong> - Know compositions before dark</li>
              <li><strong>Layer properly</strong> - Comfort enables creativity</li>
              <li><strong>Enjoy visually</strong> - Don't live behind camera</li>
            </ul>
            <h2>The Transformative Experience</h2>
            <p>Astrophotography taught patience. Aurora photography taught presence. When nature performs at this scale, you're not just photographing - you're witnessing.</p>
            <p>Returned to Stanford with 3,000 images and shifted perspective. Started "Space Weather Photography" project, monitoring solar activity and planning future aurora expeditions.</p>
            <h2>Technical Takeaways</h2>
            <p>For aspiring aurora photographers:</p>
            <ul>
              <li>Manual mode always</li>
              <li>Auto-ISO is your enemy</li>
              <li>Shoot RAW exclusively</li>
              <li>Histogram is your friend</li>
              <li>Burst mode for substorms</li>
              <li>Cable release prevents shake</li>
            </ul>
            <h2>The Call of High Latitudes</h2>
            <p>Iceland was gateway drug. Now planning:</p>
            <ul>
              <li>Norway: aurora over fjords</li>
              <li>Alaska: winter aurora</li>
              <li>Antarctica: southern lights</li>
              <li>ISS: aurora from above (someday?)</li>
            </ul>
            <h2>Prints and Sharing</h2>
            <p>Best images now hanging in Stanford dorm. Reactions range from disbelief to inspiration. Several friends planning their own Iceland trips.</p>
            <p>Started Instagram: @stanford_sky_guy</p>
            <p>Sharing settings and locations freely. Aurora photography shouldn't be gatekept.</p>
            <h2>Final Thoughts</h2>
            <p>Standing under pulsing aurora, camera clicking, feet numb, completely absorbed - this is why I photograph. Not for Instagram likes or print sales, but for these moments of connection with our planet's interaction with the solar wind.</p>
            <p>The aurora reminds us we live on a planet, in space, protected by invisible magnetic fields from stellar radiation. What could be more worth photographing?</p>
            <p><em>Full resolution images and detailed location guides available on Flickr. Planning 2016 Norway expedition - collaborators welcome!</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
