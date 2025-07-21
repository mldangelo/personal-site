import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">ISS Transit Photography: Precision Timing and Preparation</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2010-03-20">March 19, 2010</time>
              <span>•</span>
              <span>7 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">photography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">astrophotography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">space</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">iss</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Last night I captured something I've been planning for months - the International Space Station passing in front of the Moon. At 17 arcminutes wide and moving at 17,500 mph, you get exactly one chance.</p>
            <h2>The Planning</h2>
            <p>This shot requires obsessive preparation:</p>
            <h3>Tools Used:</h3>
            <ul>
              <li><strong>CalSky.com</strong> - Predicted exact transit time and path</li>
              <li><strong>Heavens-Above.com</strong> - ISS pass predictions</li>
              <li><strong>Google Earth</strong> - Found observation spot on center line</li>
              <li><strong>Stellarium</strong> - Moon position and phase</li>
            </ul>
            <h3>The Prediction:</h3>
            <ul>
              <li>Date: March 19, 2010</li>
              <li>Time: 21:47:32 EST (±1 second)</li>
              <li>Duration: 0.54 seconds</li>
              <li>Location: Specific GPS coordinates near Clarence, NY</li>
            </ul>
            <h2>The Preparation</h2>
            <p>Started preparing a week out:</p>
            <ul>
              <li><strong>Location scouting</strong> - Found field with clear western view</li>
              <li><strong>Equipment check</strong> - Batteries, memory cards, all settings</li>
              <li><strong>Practice runs</strong> - Photographed regular ISS passes</li>
              <li><strong>Time sync</strong> - Set camera clock to USNO atomic time</li>
              <li><strong>Weather monitoring</strong> - Obsessively checking forecasts</li>
            </ul>
            <h2>The Setup</h2>
            <p>Arrived 2 hours early:</p>
            <h3>Equipment:</h3>
            <ul>
              <li>Canon Rebel XS</li>
              <li>55-250mm lens at 250mm</li>
              <li>Sturdy tripod (borrowed from photo club)</li>
              <li>Remote shutter release</li>
              <li>Laptop for timing</li>
            </ul>
            <h3>Camera Settings:</h3>
            <ul>
              <li>Manual mode</li>
              <li>ISO 200 (Moon is bright!)</li>
              <li>1/1000s shutter</li>
              <li>f/8 (sharpest aperture)</li>
              <li>Manual focus on Moon craters</li>
              <li>Continuous shooting mode</li>
            </ul>
            <h2>The Moment</h2>
            <p>T-minus 5 minutes: Clear skies, Moon perfectly positioned</p>
            <p>T-minus 1 minute: Start test shots, verify focus</p>
            <p>T-minus 10 seconds: Deep breath, finger on shutter</p>
            <p>T-0: Hold down shutter, pray</p>
            <p>In 0.54 seconds, I shot 3 frames. The ISS appeared in exactly one.</p>
            <h2>The Shot</h2>
            <p className="text-gray-500 italic">[ISS silhouetted against Moon surface]</p>
            <p>It's just a small dark shape against the lunar surface, but that shape is a football field-sized space station with 6 humans aboard, captured from 240 miles away with a $400 camera setup.</p>
            <h2>Technical Challenges</h2>
            <ul>
              <li><strong>Precise timing</strong> - Off by 2 seconds = complete miss</li>
              <li><strong>Focus</strong> - ISS is same distance as Moon, thankfully</li>
              <li><strong>Tracking</strong> - At 250mm, had to lead the ISS path</li>
              <li><strong>Weather</strong> - Buffalo in March is risky</li>
              <li><strong>Exposure</strong> - Balance ISS silhouette vs Moon detail</li>
            </ul>
            <h2>What I Learned</h2>
            <ul>
              <li><strong>Preparation beats equipment</strong> - Guy next to me with $5k setup missed it</li>
              <li><strong>Multiple chances</strong> - ISS transits Sun too (with proper filter!)</li>
              <li><strong>Community</strong> - Local astronomy club members helped immensely</li>
              <li><strong>Persistence</strong> - This was attempt #3 after clouds ruined previous tries</li>
            </ul>
            <h2>Processing</h2>
            <p>Minimal processing needed:</p>
            <ul>
              <li>Slight crop to center ISS</li>
              <li>Adjusted curves for Moon detail</li>
              <li>Sharpened slightly</li>
              <li>That's it - the moment was captured in camera</li>
            </ul>
            <h2>Why This Matters</h2>
            <p>This isn't just a cool photo. It's:</p>
            <ul>
              <li>Humans in space, visible from Earth</li>
              <li>Precise intersection of orbital mechanics</li>
              <li>Achievement possible with basic equipment</li>
              <li>Connection between my earthbound camera and space exploration</li>
            </ul>
            <h2>Next Challenges</h2>
            <ul>
              <li><strong>Saturn transit</strong> - ISS passing in front of Saturn (much harder)</li>
              <li><strong>Solar transit</strong> - Need solar filter first</li>
              <li><strong>Double transit</strong> - ISS and another satellite together</li>
              <li><strong>Lunar eclipse + ISS</strong> - Ultimate combination</li>
            </ul>
            <h2>Tips for Others</h2>
            <p>Want to try this yourself?</p>
            <ul>
              <li><strong>Start with regular ISS passes</strong> - Practice tracking</li>
              <li><strong>Use transit prediction sites</strong> - Accuracy is everything</li>
              <li><strong>Scout locations in advance</strong> - No time during event</li>
              <li><strong>Have backup plan</strong> - Weather will ruin 50% of attempts</li>
              <li><strong>Shoot RAW</strong> - Maximum processing flexibility</li>
              <li><strong>Bring friends</strong> - More cameras = better odds</li>
            </ul>
            <h2>The Bigger Picture</h2>
            <p>Standing in that cold field, watching atomic clock countdown, I realized this hobby connects so many interests:</p>
            <ul>
              <li>Astronomy and orbital mechanics</li>
              <li>Photography and technical skills</li>
              <li>Planning and preparation</li>
              <li>Connection to human spaceflight</li>
            </ul>
            <p>When I showed this photo in my orbital mechanics class, the professor used it to explain angular velocity and relative motion. Not bad for a Friday night project!</p>
            <p>The next ISS lunar transit visible from Buffalo is in 6 weeks. I'll be ready.</p>
            <p><em>Check CalSky for transit predictions in your area. You might be surprised how often these events occur - you just need to be in exactly the right place at exactly the right time.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
