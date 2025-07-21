import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Getting Started with Astrophotography on a Student Budget</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-10-05">October 4, 2009</time>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">photography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">astrophotography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">tutorial</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">space</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>After months of saving from my work-study job, I finally got my hands on a used Canon Rebel XS. While everyone else in the dorm is using their cameras for party photos, I've been sneaking out to the darkest spots around Buffalo to photograph the night sky.</p>
            <h2>The Basic Setup</h2>
            <p>You don't need thousands of dollars in equipment to start:</p>
            <ul>
              <li><strong>Camera</strong>: Any DSLR with manual mode (got mine for $300 used)</li>
              <li><strong>Lens</strong>: Kit 18-55mm works fine to start</li>
              <li><strong>Tripod</strong>: The sturdier the better ($40 from Amazon)</li>
              <li><strong>Remote shutter or timer</strong>: Prevent camera shake</li>
            </ul>
            <h2>Finding Dark Skies in Western NY</h2>
            <p>Buffalo's light pollution is brutal, but there are some decent spots:</p>
            <ul>
              <li><strong>Chestnut Ridge Park</strong> - 30 minutes south, decent southern horizon</li>
              <li><strong>Letchworth State Park</strong> - Worth the hour drive for truly dark skies</li>
              <li><strong>UB North Campus fields</strong> - Surprisingly okay for moon/planet shots</li>
            </ul>
            <h2>First Light: Basic Settings</h2>
            <p>After much trial and error (and frozen fingers), here's what works:</p>
            <h3>For Stars:</h3>
            <ul>
              <li>Manual mode</li>
              <li>ISO 1600-3200 (higher = more noise)</li>
              <li>Aperture wide open (f/3.5 on kit lens)</li>
              <li>Shutter: 20-25 seconds (longer = star trails)</li>
              <li>Focus: Manual, use live view on bright star</li>
            </ul>
            <h3>The 500 Rule</h3>
            <p>To avoid star trails: 500 ÷ focal length = max shutter speed</p>
            <ul>
              <li>At 18mm: 500 ÷ 18 = ~27 seconds</li>
              <li>At 55mm: 500 ÷ 55 = ~9 seconds</li>
            </ul>
            <h2>First Successes and Failures</h2>
            <p>My first night out was humbling. Forgot to charge batteries (died in 20 minutes in the cold), couldn't find focus, and somehow deleted half my shots. But around 2 AM, everything clicked - literally. Got my first decent shot of Orion rising over the tree line.</p>
            <h2>Processing Basics</h2>
            <p>Using free software (student budget!):</p>
            <ul>
              <li><strong>DeepSkyStacker</strong> - Stack multiple exposures to reduce noise</li>
              <li><strong>GIMP</strong> - Basic adjustments (curves, levels)</li>
              <li><strong>Stellarium</strong> - Plan shots, identify objects</li>
            </ul>
            <h2>Lessons Learned</h2>
            <ul>
              <li><strong>Dress warmer than you think</strong> - October nights in Buffalo are cold</li>
              <li><strong>Bring red flashlight</strong> - Preserve night vision</li>
              <li><strong>Shoot RAW</strong> - So much more data to work with</li>
              <li><strong>Take notes</strong> - Settings, locations, what worked</li>
              <li><strong>Be patient</strong> - Your eyes need 20+ minutes to adjust</li>
            </ul>
            <h2>What's Next</h2>
            <p>Planning to build a barn door tracker (manual star tracking mount) using:</p>
            <ul>
              <li>Arduino (from my embedded systems class)</li>
              <li>Stepper motor</li>
              <li>Some wood and threaded rod</li>
              <li>Total cost: ~$50</li>
            </ul>
            <p>The goal: Track stars for longer exposures without trails, revealing fainter objects and more detail in the Milky Way.</p>
            <h2>Sample Images</h2>
            <p className="text-gray-500 italic">[First successful Milky Way shot - grainy but mine!]</p>
            <p className="text-gray-500 italic">[Orion constellation over UB's Ellicott Complex]</p>
            <p className="text-gray-500 italic">[Moon through kit lens at 55mm - surprised by the detail]</p>
            <p>There's something profound about standing alone under the stars at 3 AM, camera clicking away, slowly capturing ancient light. Sure, my photos don't look like those NASA images, but there's magic in knowing those photons traveled millions of years to hit my camera sensor.</p>
            <p>Next clear night, I'll be out there again. The universe isn't going anywhere, and neither am I.</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
