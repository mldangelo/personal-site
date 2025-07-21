import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Time-Lapse Photography: Capturing Our CubeSat Assembly</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2011-04-15">April 14, 2011</time>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">photography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">cubesat</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">time-lapse</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">space</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>For the past 6 months, I've been documenting our CubeSat assembly process with time-lapse photography. The result: 180 days of work compressed into a 3-minute video showing our satellite coming together piece by piece.</p>
            <h2>The Vision</h2>
            <p>Wanted to capture:</p>
            <ul>
              <li>The iterative nature of hardware development</li>
              <li>Team collaboration and problem-solving</li>
              <li>Evolution from empty table to flight-ready spacecraft</li>
              <li>Those "aha!" moments when things finally work</li>
            </ul>
            <h2>Technical Setup</h2>
            <h3>Camera System:</h3>
            <ul>
              <li>Old Canon PowerShot A480 (dedicated to this project)</li>
              <li>CHDK firmware hack for intervalometer</li>
              <li>8GB SD card</li>
              <li>AC power adapter (crucial!)</li>
              <li>Ceiling mount in clean room</li>
            </ul>
            <h3>Settings:</h3>
            <ul>
              <li>Photo every 5 minutes during work hours</li>
              <li>800x600 resolution (storage constraints)</li>
              <li>Fixed exposure/WB to prevent flicker</li>
              <li>Auto-upload to server each night</li>
            </ul>
            <h2>Challenges Encountered</h2>
            <ul>
              <li><strong>Storage Management</strong></li>
            </ul>
            <p>   - 5-minute intervals × 10 hours/day × 180 days = 21,600 photos</p>
            <p>   - Automated script to archive weekly</p>
            <p>   - Redundant backup to external drive</p>
            <ul>
              <li><strong>Lighting Changes</strong></li>
            </ul>
            <p>   - Clean room has no windows (good!)</p>
            <p>   - But fluorescent flicker is real</p>
            <p>   - Solution: 1/60s shutter to match AC frequency</p>
            <ul>
              <li><strong>Camera Reliability</strong></li>
            </ul>
            <p>   - Crashed twice over 6 months</p>
            <p>   - Added Arduino watchdog to power cycle</p>
            <p>   - Daily health check emails</p>
            <ul>
              <li><strong>Privacy Concerns</strong></li>
            </ul>
            <p>   - Team members in personal moments</p>
            <p>   - Solution: blur faces in post</p>
            <p>   - Everyone signed photo releases</p>
            <h2>Interesting Captures</h2>
            <p>The time-lapse revealed patterns invisible in real-time:</p>
            <h3>Technical Progress:</h3>
            <ul>
              <li>Solar panel integration took 3 weeks (felt like 3 months)</li>
              <li>That "impossible" connector issue: solved in 2 hours</li>
              <li>Complete disassembly/reassembly happened 4 times</li>
            </ul>
            <h3>Human Patterns:</h3>
            <ul>
              <li>Coffee runs at precisely 10 AM and 3 PM</li>
              <li>Pizza boxes accumulate exponentially near deadlines</li>
              <li>One team member always sits in same chair</li>
              <li>Stress balls appear during thermal testing week</li>
            </ul>
            <h2>Processing Pipeline</h2>
            <p>21,600 photos → 3-minute video:</p>
            <ul>
              <li><strong>Import & Organize</strong></li>
            </ul>
            <p>   ```bash</p>
            <p>   #!/bin/bash</p>
            <p>   # Sort photos by date/time</p>
            <p>   exiftool -d %Y%m%d_%H%M%S%-c.jpg "-filename<DateTimeOriginal" *.jpg</p>
            <p>   ```</p>
            <ul>
              <li><strong>Pre-processing</strong></li>
            </ul>
            <p>   - Remove after-hours/weekend frames</p>
            <p>   - Deflicker using LRTimelapse</p>
            <p>   - Color correction for consistency</p>
            <p>   - Mask sensitive areas</p>
            <ul>
              <li><strong>Assembly</strong></li>
            </ul>
            <p>   - FFmpeg for initial video creation</p>
            <p>   - 24fps (every photo = 1 frame)</p>
            <p>   - Premier Elements for final edit</p>
            <p>   - Added music from Free Music Archive</p>
            <h2>Artistic Decisions</h2>
            <p>Beyond technical documentation:</p>
            <ul>
              <li><strong>Pacing</strong>: Slower during complex assembly, faster during routine work</li>
              <li><strong>Focus pulls</strong>: Manually adjusted some sequences for emphasis</li>
              <li><strong>Color grading</strong>: Subtle blue tint for "space" feel</li>
              <li><strong>Music</strong>: Building crescendo matching project completion</li>
            </ul>
            <h2>Results</h2>
            <p>The final video shows:</p>
            <ul>
              <li>Empty table → completed satellite</li>
              <li>15 different team members contributing</li>
              <li>3 major design iterations</li>
              <li>Countless small victories and setbacks</li>
              <li>One memorable coffee spill incident</li>
            </ul>
            <h2>Unexpected Benefits</h2>
            <ul>
              <li><strong>Project Management</strong></li>
            </ul>
            <p>   - Visual progress tracker</p>
            <p>   - Identified workflow bottlenecks</p>
            <p>   - Proved useful for NASA review</p>
            <ul>
              <li><strong>Team Morale</strong></li>
            </ul>
            <p>   - Seeing progress during tough weeks</p>
            <p>   - Sharing with friends/family</p>
            <p>   - Recruitment tool for new members</p>
            <ul>
              <li><strong>Technical Documentation</strong></li>
            </ul>
            <p>   - "How did we connect that?" - check the time-lapse</p>
            <p>   - Assembly order for flight spare</p>
            <p>   - Training resource for new members</p>
            <h2>Lessons Learned</h2>
            <ul>
              <li><strong>Start early</strong>: Wish I'd begun during design phase</li>
              <li><strong>Higher resolution</strong>: 800x600 seemed fine, now want 1080p</li>
              <li><strong>Multiple angles</strong>: One camera misses details</li>
              <li><strong>Keep originals</strong>: Never know what you'll need later</li>
              <li><strong>Automate everything</strong>: Manual processes fail</li>
            </ul>
            <h2>Open Source Release</h2>
            <p>Released the scripts and setup guide on GitHub:</p>
            <ul>
              <li>Camera mounting designs</li>
              <li>CHDK scripts for intervalometer</li>
              <li>Processing pipeline</li>
              <li>Arduino watchdog code</li>
            </ul>
            <p>Several other university teams now using similar setups!</p>
            <h2>Future Projects</h2>
            <p>Planning time-lapse for:</p>
            <ul>
              <li>Thermal vacuum testing</li>
              <li>Vibration testing</li>
              <li>Integration with launch vehicle</li>
              <li>First contact from orbit (ground station screens)</li>
            </ul>
            <h2>The Art in Engineering</h2>
            <p>This project bridges my technical and creative sides. It's:</p>
            <ul>
              <li>Documentary photography with purpose</li>
              <li>Technical challenge requiring engineering solutions</li>
              <li>Artistic expression of human achievement</li>
              <li>Permanent record of temporary process</li>
            </ul>
            <p>Watching the video, you see more than satellite assembly. You see dedication, frustration, breakthrough moments, and the messy reality of hardware development.</p>
            <p>Sometimes the best camera isn't the newest DSLR - it's the one mounted to the ceiling, quietly clicking away, capturing history one frame at a time.</p>
            <p><em>The full time-lapse will be shown at our final design review and the upcoming UB Engineering Expo. Stop by to see 6 months of work in 3 minutes!</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
