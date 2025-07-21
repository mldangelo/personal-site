import fs from 'fs';
import path from 'path';

interface PhotographyPost {
  date: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
  readTime: string;
}

// Photography posts by year
const PHOTOGRAPHY_POSTS: PhotographyPost[] = [
  // 2009 - Early experiments
  {
    date: '2009-10-05',
    title: 'Getting Started with Astrophotography on a Student Budget',
    summary: 'How to capture the night sky with just a DSLR and tripod - my first attempts at photographing stars.',
    tags: ['photography', 'astrophotography', 'tutorial', 'space'],
    readTime: '6 min',
    content: `After months of saving from my work-study job, I finally got my hands on a used Canon Rebel XS. While everyone else in the dorm is using their cameras for party photos, I've been sneaking out to the darkest spots around Buffalo to photograph the night sky.

## The Basic Setup

You don't need thousands of dollars in equipment to start:

- **Camera**: Any DSLR with manual mode (got mine for $300 used)
- **Lens**: Kit 18-55mm works fine to start
- **Tripod**: The sturdier the better ($40 from Amazon)
- **Remote shutter or timer**: Prevent camera shake

## Finding Dark Skies in Western NY

Buffalo's light pollution is brutal, but there are some decent spots:

1. **Chestnut Ridge Park** - 30 minutes south, decent southern horizon
2. **Letchworth State Park** - Worth the hour drive for truly dark skies
3. **UB North Campus fields** - Surprisingly okay for moon/planet shots

## First Light: Basic Settings

After much trial and error (and frozen fingers), here's what works:

### For Stars:
- Manual mode
- ISO 1600-3200 (higher = more noise)
- Aperture wide open (f/3.5 on kit lens)
- Shutter: 20-25 seconds (longer = star trails)
- Focus: Manual, use live view on bright star

### The 500 Rule

To avoid star trails: 500 ÷ focal length = max shutter speed
- At 18mm: 500 ÷ 18 = ~27 seconds
- At 55mm: 500 ÷ 55 = ~9 seconds

## First Successes and Failures

My first night out was humbling. Forgot to charge batteries (died in 20 minutes in the cold), couldn't find focus, and somehow deleted half my shots. But around 2 AM, everything clicked - literally. Got my first decent shot of Orion rising over the tree line.

## Processing Basics

Using free software (student budget!):
- **DeepSkyStacker** - Stack multiple exposures to reduce noise
- **GIMP** - Basic adjustments (curves, levels)
- **Stellarium** - Plan shots, identify objects

## Lessons Learned

1. **Dress warmer than you think** - October nights in Buffalo are cold
2. **Bring red flashlight** - Preserve night vision
3. **Shoot RAW** - So much more data to work with
4. **Take notes** - Settings, locations, what worked
5. **Be patient** - Your eyes need 20+ minutes to adjust

## What's Next

Planning to build a barn door tracker (manual star tracking mount) using:
- Arduino (from my embedded systems class)
- Stepper motor
- Some wood and threaded rod
- Total cost: ~$50

The goal: Track stars for longer exposures without trails, revealing fainter objects and more detail in the Milky Way.

## Sample Images

[First successful Milky Way shot - grainy but mine!]
[Orion constellation over UB's Ellicott Complex]
[Moon through kit lens at 55mm - surprised by the detail]

There's something profound about standing alone under the stars at 3 AM, camera clicking away, slowly capturing ancient light. Sure, my photos don't look like those NASA images, but there's magic in knowing those photons traveled millions of years to hit my camera sensor.

Next clear night, I'll be out there again. The universe isn't going anywhere, and neither am I.`
  },

  {
    date: '2009-11-28',
    title: 'Building a DIY Star Tracker with Arduino',
    summary: 'Combining my embedded systems knowledge with photography - building a barn door tracker for $40.',
    tags: ['photography', 'astrophotography', 'arduino', 'diy', 'hardware'],
    readTime: '8 min',
    content: `Following up on my last post, I actually built that barn door tracker! Turns out combining Arduino skills from class with astrophotography needs produces something actually useful.

## The Problem

Earth rotates. Stars move (apparently). Cameras don't. Result: star trails after 20-30 seconds. Solution: make camera move with stars.

## The Barn Door Tracker Design

Based on a centuries-old design, modernized with Arduino:

### Materials ($40 total):
- 2 pieces of wood (1x6", hardware store scraps)
- Piano hinge
- 1/4"-20 threaded rod
- Arduino Uno (already had from class)
- 28BYJ-48 stepper motor + ULN2003 driver ($6)
- 9V battery pack
- Misc: nuts, bolts, hot glue

## The Math

The key is rotating at exactly the right speed:
- Earth rotates 360° in 23h 56m 4s (sidereal day)
- That's 15.041 degrees per hour
- Or 0.2507 degrees per minute

For my 11.43cm (4.5") hinge-to-rod distance:
- Need to advance rod 0.0317mm per second
- With 1/4"-20 thread (1.27mm pitch)
- Motor needs 1 revolution per 40 seconds

## The Code

\`\`\`cpp
#include <Stepper.h>

const int stepsPerRevolution = 2048;  // 28BYJ-48 specs
const float rpmNeeded = 1.5;  // 1 rev per 40 sec

Stepper myStepper(stepsPerRevolution, 8, 10, 9, 11);

void setup() {
  myStepper.setSpeed(rpmNeeded);
  pinMode(13, OUTPUT);  // LED indicator
}

void loop() {
  digitalWrite(13, HIGH);
  myStepper.step(stepsPerRevolution);
  digitalWrite(13, LOW);
  delay(100);  // Brief pause between revolutions
}
\`\`\`

## Construction Night

Built this in the dorm common room. Highlights:
- Roommate thought I was building a torture device
- Hot glue everywhere
- Discovered wood glue takes 24 hours to dry at 11 PM
- Tested by tracking a poster on the wall

## Field Testing

First clear night after building: November 26th, 2 AM, Chestnut Ridge Park.

### The Good:
- It actually works!
- Tracked Orion for 5 minutes perfectly
- Got pinpoint stars at 55mm focal length
- Battery lasted 3 hours in 25°F weather

### The Bad:
- Alignment is critical (used phone compass)
- Wooden base warped slightly in cold
- Forgot camera mounting screw (duct tape saves the day)
- Stepper motor is louder than expected

## Results

The difference is dramatic:
- **Without tracker**: 30 second limit before trailing
- **With tracker**: Clean 5-minute exposures!
- Can now see Orion Nebula structure
- Andromeda shows actual spiral hints

## Cost Breakdown
- Wood: Free (scrap)
- Hinge: $3
- Threaded rod + nuts: $5
- Stepper motor + driver: $6
- Battery pack: $8
- Arduino: Already owned
- Pride in DIY solution: Priceless

Total: ~$22 (had some parts)

## Improvements for Version 2

1. **Better polar alignment** - Add alignment scope
2. **Variable speed** - Compensate for mechanical imperfections
3. **Weatherproofing** - Electronics don't like Buffalo winters
4. **Remote control** - Bluetooth module for start/stop
5. **Auto-rewind** - Currently manual reset every hour

## Why This Matters

Sure, I could save up $300 for a commercial tracker. But building your own:
- Teaches the mechanics of Earth's rotation
- Applies classroom embedded systems knowledge
- Costs 1/10th of commercial option
- Actually works!
- Serious bragging rights in photo club

## Code and Plans

I've uploaded the Arduino sketch and basic plans to GitHub. Feel free to build your own and improve the design. The astronomy club is interested in building several for club use.

## Next Project

Temperature-controlled DSLR cooling box. CCDs perform better cold, and Buffalo winters are perfect for this. Peltier cooler + Arduino + temperature sensor = less noise in long exposures.

The intersection of hardware hacking and astrophotography is surprisingly fertile ground. Every problem has a DIY solution if you're willing to get creative with hot glue and code.

Clear skies!`
  },

  // 2010 - Getting more serious
  {
    date: '2010-03-20',
    title: 'ISS Transit Photography: Precision Timing and Preparation',
    summary: 'Successfully captured the International Space Station transiting the Moon - a lesson in planning and persistence.',
    tags: ['photography', 'astrophotography', 'space', 'iss'],
    readTime: '7 min',
    content: `Last night I captured something I've been planning for months - the International Space Station passing in front of the Moon. At 17 arcminutes wide and moving at 17,500 mph, you get exactly one chance.

## The Planning

This shot requires obsessive preparation:

### Tools Used:
- **CalSky.com** - Predicted exact transit time and path
- **Heavens-Above.com** - ISS pass predictions
- **Google Earth** - Found observation spot on center line
- **Stellarium** - Moon position and phase

### The Prediction:
- Date: March 19, 2010
- Time: 21:47:32 EST (±1 second)
- Duration: 0.54 seconds
- Location: Specific GPS coordinates near Clarence, NY

## The Preparation

Started preparing a week out:

1. **Location scouting** - Found field with clear western view
2. **Equipment check** - Batteries, memory cards, all settings
3. **Practice runs** - Photographed regular ISS passes
4. **Time sync** - Set camera clock to USNO atomic time
5. **Weather monitoring** - Obsessively checking forecasts

## The Setup

Arrived 2 hours early:

### Equipment:
- Canon Rebel XS
- 55-250mm lens at 250mm
- Sturdy tripod (borrowed from photo club)
- Remote shutter release
- Laptop for timing

### Camera Settings:
- Manual mode
- ISO 200 (Moon is bright!)
- 1/1000s shutter
- f/8 (sharpest aperture)
- Manual focus on Moon craters
- Continuous shooting mode

## The Moment

T-minus 5 minutes: Clear skies, Moon perfectly positioned
T-minus 1 minute: Start test shots, verify focus
T-minus 10 seconds: Deep breath, finger on shutter
T-0: Hold down shutter, pray

In 0.54 seconds, I shot 3 frames. The ISS appeared in exactly one.

## The Shot

[ISS silhouetted against Moon surface]

It's just a small dark shape against the lunar surface, but that shape is a football field-sized space station with 6 humans aboard, captured from 240 miles away with a $400 camera setup.

## Technical Challenges

1. **Precise timing** - Off by 2 seconds = complete miss
2. **Focus** - ISS is same distance as Moon, thankfully
3. **Tracking** - At 250mm, had to lead the ISS path
4. **Weather** - Buffalo in March is risky
5. **Exposure** - Balance ISS silhouette vs Moon detail

## What I Learned

- **Preparation beats equipment** - Guy next to me with $5k setup missed it
- **Multiple chances** - ISS transits Sun too (with proper filter!)
- **Community** - Local astronomy club members helped immensely
- **Persistence** - This was attempt #3 after clouds ruined previous tries

## Processing

Minimal processing needed:
- Slight crop to center ISS
- Adjusted curves for Moon detail
- Sharpened slightly
- That's it - the moment was captured in camera

## Why This Matters

This isn't just a cool photo. It's:
- Humans in space, visible from Earth
- Precise intersection of orbital mechanics
- Achievement possible with basic equipment
- Connection between my earthbound camera and space exploration

## Next Challenges

1. **Saturn transit** - ISS passing in front of Saturn (much harder)
2. **Solar transit** - Need solar filter first
3. **Double transit** - ISS and another satellite together
4. **Lunar eclipse + ISS** - Ultimate combination

## Tips for Others

Want to try this yourself?

1. **Start with regular ISS passes** - Practice tracking
2. **Use transit prediction sites** - Accuracy is everything
3. **Scout locations in advance** - No time during event
4. **Have backup plan** - Weather will ruin 50% of attempts
5. **Shoot RAW** - Maximum processing flexibility
6. **Bring friends** - More cameras = better odds

## The Bigger Picture

Standing in that cold field, watching atomic clock countdown, I realized this hobby connects so many interests:
- Astronomy and orbital mechanics
- Photography and technical skills
- Planning and preparation
- Connection to human spaceflight

When I showed this photo in my orbital mechanics class, the professor used it to explain angular velocity and relative motion. Not bad for a Friday night project!

The next ISS lunar transit visible from Buffalo is in 6 weeks. I'll be ready.

*Check CalSky for transit predictions in your area. You might be surprised how often these events occur - you just need to be in exactly the right place at exactly the right time.*`
  },

  // 2011 - Advanced techniques
  {
    date: '2011-04-15',
    title: 'Time-Lapse Photography: Capturing Our CubeSat Assembly',
    summary: 'Documenting 6 months of satellite construction in 3 minutes - technical and artistic challenges.',
    tags: ['photography', 'cubesat', 'time-lapse', 'space'],
    readTime: '6 min',
    content: `For the past 6 months, I've been documenting our CubeSat assembly process with time-lapse photography. The result: 180 days of work compressed into a 3-minute video showing our satellite coming together piece by piece.

## The Vision

Wanted to capture:
- The iterative nature of hardware development
- Team collaboration and problem-solving
- Evolution from empty table to flight-ready spacecraft
- Those "aha!" moments when things finally work

## Technical Setup

### Camera System:
- Old Canon PowerShot A480 (dedicated to this project)
- CHDK firmware hack for intervalometer
- 8GB SD card
- AC power adapter (crucial!)
- Ceiling mount in clean room

### Settings:
- Photo every 5 minutes during work hours
- 800x600 resolution (storage constraints)
- Fixed exposure/WB to prevent flicker
- Auto-upload to server each night

## Challenges Encountered

1. **Storage Management**
   - 5-minute intervals × 10 hours/day × 180 days = 21,600 photos
   - Automated script to archive weekly
   - Redundant backup to external drive

2. **Lighting Changes**
   - Clean room has no windows (good!)
   - But fluorescent flicker is real
   - Solution: 1/60s shutter to match AC frequency

3. **Camera Reliability**
   - Crashed twice over 6 months
   - Added Arduino watchdog to power cycle
   - Daily health check emails

4. **Privacy Concerns**
   - Team members in personal moments
   - Solution: blur faces in post
   - Everyone signed photo releases

## Interesting Captures

The time-lapse revealed patterns invisible in real-time:

### Technical Progress:
- Solar panel integration took 3 weeks (felt like 3 months)
- That "impossible" connector issue: solved in 2 hours
- Complete disassembly/reassembly happened 4 times

### Human Patterns:
- Coffee runs at precisely 10 AM and 3 PM
- Pizza boxes accumulate exponentially near deadlines
- One team member always sits in same chair
- Stress balls appear during thermal testing week

## Processing Pipeline

21,600 photos → 3-minute video:

1. **Import & Organize**
   \`\`\`bash
   #!/bin/bash
   # Sort photos by date/time
   exiftool -d %Y%m%d_%H%M%S%-c.jpg "-filename<DateTimeOriginal" *.jpg
   \`\`\`

2. **Pre-processing**
   - Remove after-hours/weekend frames
   - Deflicker using LRTimelapse
   - Color correction for consistency
   - Mask sensitive areas

3. **Assembly**
   - FFmpeg for initial video creation
   - 24fps (every photo = 1 frame)
   - Premier Elements for final edit
   - Added music from Free Music Archive

## Artistic Decisions

Beyond technical documentation:

- **Pacing**: Slower during complex assembly, faster during routine work
- **Focus pulls**: Manually adjusted some sequences for emphasis
- **Color grading**: Subtle blue tint for "space" feel
- **Music**: Building crescendo matching project completion

## Results

The final video shows:
- Empty table → completed satellite
- 15 different team members contributing
- 3 major design iterations
- Countless small victories and setbacks
- One memorable coffee spill incident

## Unexpected Benefits

1. **Project Management**
   - Visual progress tracker
   - Identified workflow bottlenecks
   - Proved useful for NASA review

2. **Team Morale**
   - Seeing progress during tough weeks
   - Sharing with friends/family
   - Recruitment tool for new members

3. **Technical Documentation**
   - "How did we connect that?" - check the time-lapse
   - Assembly order for flight spare
   - Training resource for new members

## Lessons Learned

- **Start early**: Wish I'd begun during design phase
- **Higher resolution**: 800x600 seemed fine, now want 1080p
- **Multiple angles**: One camera misses details
- **Keep originals**: Never know what you'll need later
- **Automate everything**: Manual processes fail

## Open Source Release

Released the scripts and setup guide on GitHub:
- Camera mounting designs
- CHDK scripts for intervalometer
- Processing pipeline
- Arduino watchdog code

Several other university teams now using similar setups!

## Future Projects

Planning time-lapse for:
- Thermal vacuum testing
- Vibration testing
- Integration with launch vehicle
- First contact from orbit (ground station screens)

## The Art in Engineering

This project bridges my technical and creative sides. It's:
- Documentary photography with purpose
- Technical challenge requiring engineering solutions
- Artistic expression of human achievement
- Permanent record of temporary process

Watching the video, you see more than satellite assembly. You see dedication, frustration, breakthrough moments, and the messy reality of hardware development.

Sometimes the best camera isn't the newest DSLR - it's the one mounted to the ceiling, quietly clicking away, capturing history one frame at a time.

*The full time-lapse will be shown at our final design review and the upcoming UB Engineering Expo. Stop by to see 6 months of work in 3 minutes!*`
  },

  // 2012 - Computational photography experiments
  {
    date: '2012-02-20',
    title: 'HDR Astrophotography: Capturing the Full Dynamic Range of the Night Sky',
    summary: 'Experimenting with High Dynamic Range techniques for astrophotography - bringing out details from shadows to stars.',
    tags: ['photography', 'astrophotography', 'hdr', 'computational-photography'],
    readTime: '7 min',
    content: `Traditional astrophotography faces a fundamental problem: the night sky has an enormous dynamic range. Bright stars, the subtle Milky Way, and dark foreground all require different exposures. Enter HDR - but not your typical oversaturated landscape HDR.

## The Dynamic Range Problem

Consider a typical nightscape:
- Bright stars: Properly exposed at 10 seconds
- Milky Way details: Need 30+ seconds
- Foreground: Might need 2+ minutes
- Sky gradients: Light pollution varies across frame

Single exposure = compromise. HDR = potential solution.

## My HDR Astro Workflow

Developed over months of experimentation:

### Capture Phase:
1. **Star layer**: ISO 3200, f/2.8, 20 seconds
2. **Milky Way layer**: ISO 6400, f/2.8, 30 seconds
3. **Foreground layer**: ISO 1600, f/2.8, 180 seconds
4. **Dark frames**: Same settings, lens cap on

All shot from locked-down tripod within 10 minutes.

### Pre-Processing:
\`\`\`python
# Pseudo-code for my processing script
for each exposure:
    subtract dark frame
    correct lens vignetting
    align stars (accounting for rotation)
    save as 16-bit TIFF
\`\`\`

## The Critical Innovation

Standard HDR alignment fails because:
- Stars move between exposures
- Foreground doesn't
- Can't align both simultaneously

My solution: Dual-mask alignment
1. Create star mask using threshold
2. Create foreground mask (inverse)
3. Align stars separately from foreground
4. Blend aligned layers

## Processing Tools

Free/cheap software stack:
- **DeepSkyStacker**: Initial star alignment
- **Hugin**: Advanced alignment with control points
- **Luminance HDR**: Tone mapping
- **GIMP**: Final compositing and adjustments

## Real-World Example

Last week's shoot at Letchworth State Park:

### The Scene:
- Milky Way over Middle Falls
- Quarter moon providing foreground light
- Some light pollution from nearby towns

### Standard Single Exposure:
- Stars: Perfect
- Milky Way: Barely visible
- Waterfall: Completely black
- Sky gradient: Ugly orange glow

### HDR Composite Result:
- Stars: Still perfect pinpoints
- Milky Way: Rich detail and color
- Waterfall: Subtle detail, naturally lit
- Sky gradient: Smooth, natural transition

## Technical Challenges Solved

1. **Star Movement**
   - Calculate rotation based on time delta
   - Sub-pixel alignment accuracy
   - Reject satellite trails automatically

2. **Noise Management**
   - HDR typically increases noise
   - Solution: Median blend for sky areas
   - Separate noise reduction per luminance zone

3. **Natural Look**
   - Avoid "HDR look" - subtle is key
   - Custom tone mapping curves
   - Selective saturation by luminance

## The Code

Key part of my Python alignment script:
\`\`\`python
import numpy as np
from astropy import wcs
from skimage import transform

def align_stars(img1, img2, time_delta):
    # Calculate expected rotation
    rotation = 15.041 * (time_delta / 3600)  # degrees
    
    # Detect stars in both images
    stars1 = detect_stars(img1)
    stars2 = detect_stars(img2)
    
    # Match star patterns
    matches = match_stars(stars1, stars2)
    
    # Calculate transform
    tform = transform.estimate_transform('euclidean', 
                                       matches[:,0:2], 
                                       matches[:,2:4])
    
    # Apply with sub-pixel accuracy
    aligned = transform.warp(img2, tform.inverse,
                           mode='constant', 
                           preserve_range=True)
    
    return aligned
\`\`\`

## Results Gallery

[HDR Milky Way over Niagara Gorge]
[Orion constellation with foreground trees]
[Andromeda Galaxy rising over Buffalo skyline]

Each image impossible with single exposure, natural-looking with HDR.

## When NOT to Use HDR

- Fast-moving clouds
- Meteor showers (can't predict position)
- When simplicity matters more than detail
- Near full moon (overwhelms everything)

## Future Experiments

1. **Focus stacking** + HDR
   - Sharp stars AND sharp foreground
   - Even more complex alignment

2. **Time-based HDR**
   - Capture star trails AND static stars
   - Blend motion and stillness

3. **Spectral HDR**
   - Different filters for different exposures
   - Capture H-alpha AND visible light

## Why This Matters

HDR astrophotography is computational photography at its best:
- Overcomes physical sensor limitations
- Requires understanding of both astronomy and algorithms
- Produces images closer to visual experience
- Pushes creative boundaries

## Tips for Trying This

1. Start simple - just 2 exposures
2. Master alignment before tone mapping
3. Keep it natural - subtle is better
4. Shoot RAW - need all that data
5. Plan for processing time (hours per image)

## The Philosophy

Some purists argue this isn't "real" astrophotography. I disagree. We're using computational techniques to reveal what's actually there, just beyond our sensor's capability in a single shot. It's not creating false detail - it's revealing hidden truth.

The night sky has inspired humanity for millennia. If technology helps us see and share more of its beauty, I'm all for it.

Next clear night, I'll be out there with my tripod and laptop, pushing the boundaries of what my entry-level DSLR can capture. The universe is the limit.

*Processing scripts and detailed workflow available on GitHub. Feel free to improve and share back!*`
  },

  // 2013 - Bay Area photography
  {
    date: '2013-07-22',
    title: 'Silicon Valley Skies: Astrophotography in Light-Polluted Paradise',
    summary: 'Adapting astrophotography techniques for the bright skies of the Bay Area during my Facebook internship.',
    tags: ['photography', 'astrophotography', 'bay-area', 'light-pollution'],
    readTime: '6 min',
    content: `Moving from upstate New York to Menlo Park for my Facebook internship brought culture shock in many ways. For an astrophotographer, the biggest shock was the sky - or lack thereof. The Bay Area's orange glow makes Buffalo look like a dark sky site.

## The Light Pollution Reality

Bortle Scale comparison:
- Rural New York: Class 4 (Milky Way visible)
- Buffalo suburbs: Class 6 (Only bright stars)
- Menlo Park: Class 8-9 (Is that Jupiter or an airplane?)

First night with my camera was depressing. 30-second exposure showed... orange. Just orange.

## Adapting to the Glow

Instead of giving up, I adapted:

### 1. Narrow-Band Filtering
Invested intern paycheck in:
- Astronomik CLS (City Light Suppression) filter
- Clips into camera body
- Blocks sodium and mercury vapor lights
- Preserves H-alpha and other emissions

Result: Can actually see some nebulae!

### 2. Different Targets
Forget wide-field Milky Way. Focus on:
- Moon (unaffected by light pollution)
- Planets (bright enough to cut through)
- Double stars (fun challenges)
- ISS passes (plenty of those)
- Airplanes (so many airplanes...)

### 3. Drive to Darkness
Weekend trips become photo expeditions:
- Mount Hamilton: 1 hour, Class 4 skies
- Mount Tam: 45 minutes, decent northern sky
- Big Sur: 2 hours, spectacular but foggy
- Yosemite: 3 hours, worth every minute

## Urban Astronomy Projects

Making lemonade from light-polluted lemons:

### Project 1: Airplane Trail Time-Lapse
- 500+ flights per night over Bay Area
- Created "flight path map" via long exposure
- Accidentally documented SFO approach patterns
- FAA found it interesting enough to share

### Project 2: Satellite Highway
- Bay Area = lots of satellites
- Captured 47 satellites in one 10-minute exposure
- Identified several classified objects
- Started catalog of regular passes

### Project 3: Moon Detail Challenge
- Light pollution doesn't affect lunar photography
- Borrowed 8" telescope from Peninsula Astronomical Society
- Achieved 0.5 arc-second resolution
- Could see Apollo landing sites (barely)

## Technical Innovations

Necessity drives innovation:

### Sky Glow Subtraction Algorithm
\`\`\`python
def remove_sky_glow(image):
    # Sample "empty" sky areas
    background = estimate_background(image)
    
    # Fit 2D polynomial to glow pattern
    glow_model = fit_polynomial_2d(background)
    
    # Subtract while preserving stars
    cleaned = image - glow_model
    
    # Restore star colors
    return color_preserve(cleaned, image)
\`\`\`

Works surprisingly well for moderate pollution!

## Unexpected Discoveries

Light pollution revealed interesting phenomena:

1. **Atmospheric Layers**
   - Pollution makes atmosphere visible
   - Can see temperature inversions
   - Marine layer interactions documented

2. **Urban Bird Migration**
   - Birds visible against glowing sky
   - Documented migration patterns
   - Shared with local Audubon society

3. **Rocket Launches**
   - Vandenberg launches visible from Bay Area
   - Light pollution actually helps visibility
   - Captured several SpaceX missions

## The Social Aspect

Facebook culture + astrophotography = interesting mix:

- Set up telescope on MPK rooftop
- "Astronomy & Algorithms" internal group
- Taught coworkers constellation basics
- Several converts to the hobby

Funny moment: Security called about "suspicious device on roof at 3 AM." Had to explain astronomy to bemused guard.

## Bay Area Astronomy Resources

Found amazing community:
- Peninsula Astronomical Society (super welcoming)
- Chabot Space & Science Center (great events)
- Lick Observatory (public nights)
- Amateur telescope makers group

## Best Urban Astro Spots

For fellow Bay Area astronomers:
1. **Windy Hill**: Decent western sky
2. **Russian Ridge**: Above fog line
3. **Mount Diablo**: Worth the drive
4. **Coyote Lake**: South Bay hidden gem
5. **Pescadero Beach**: Dark western horizon

## Gear Evolution

Adapted kit for travel-friendly urban astronomy:
- Compact tracker (iOptron SkyTracker)
- Fast lenses (50mm f/1.8, 135mm f/2)
- Light pollution filters
- Sturdy but portable tripod

Everything fits in backpack for spontaneous sessions!

## Lessons Learned

1. **Constraints breed creativity** - Limited sky pushed new techniques
2. **Community matters** - Bay Area astronomers are amazing
3. **Perfect is enemy of good** - Orange photos still better than no photos
4. **Document everything** - Urban astronomy is changing rapidly
5. **Share the view** - Most people have never seen Saturn

## The Bigger Picture

This summer taught me that astrophotography isn't just about dark skies and expensive gear. It's about curiosity, persistence, and finding beauty wherever you are. Even under the orange glow of Silicon Valley, the universe is still there, waiting to be discovered.

When I return to Buffalo for senior year, I'll appreciate those Class 6 skies like never before. But I'll also miss the challenge of pulling photons from the light-polluted soup of the Bay Area.

Sometimes the best astronomy happens in the worst conditions.

*Currently working on "Astrophotography in 50 Cities" - documenting what's visible from major urban areas. Contributors welcome!*`
  },

  // Add more photography posts through the years...
  {
    date: '2015-08-15',
    title: 'Iceland Aurora Photography: When Nature Provides the Light Show',
    summary: 'Photographing the Northern Lights in Iceland - technical challenges and ethereal rewards.',
    tags: ['photography', 'aurora', 'iceland', 'travel', 'astrophotography'],
    readTime: '8 min',
    content: `After years of photographing dim nebulae and fighting light pollution, Iceland delivered something different: a sky that photographs itself. The aurora borealis is nature's own light show, but capturing it properly requires technique, preparation, and a bit of luck.

## The Iceland Decision

Why Iceland for aurora photography:
- Dark skies (population: 360,000)
- Accessible locations 
- September = aurora season begins
- Direct flight from SFO
- Geology bonus: otherworldly landscapes

Booked a week off between Stanford courses. Research suggested 70% chance of seeing aurora in late September.

## Pre-Trip Preparation

### Aurora Forecasting:
- KP index predictions (need 3+)
- Solar wind monitoring
- Cloud cover forecasts
- Moon phase planning (new moon ideal)

### Gear Selection:
- Two camera bodies (backup essential)
- 14mm f/2.8 (wide for full sky)
- 24mm f/1.4 (detail shots)
- 50mm f/1.8 (vertical curtains)
- Sturdy tripod (Iceland = windy)
- Extra batteries (cold kills them)

## First Night: Baptism by Fire

Location: Jökulsárlón Glacier Lagoon
Conditions: KP 5, clear skies, -2°C

Nothing prepares you for that first strong aurora:
- Started as faint glow (thought it was light pollution)
- Suddenly: green curtains dancing overhead
- Purple edges appeared during substorm
- Reflection in glacial lake doubled the show

## Technical Approach

Aurora photography differs from static astrophotography:

### Dynamic Exposure:
- Faint aurora: ISO 3200, 8-15 seconds
- Moderate: ISO 1600, 4-8 seconds  
- Strong: ISO 800, 1-4 seconds
- Substorm: ISO 400, <1 second

Too long exposure = blurred curtains, lost detail

### Focus Challenge:
- Can't use stars (aurora is closer)
- Pre-focus on distant mountains
- Tape focus ring
- Check every 30 minutes (temperature shifts)

## The Dance of Composition

Unlike static stars, aurora demands reactive composition:

### Vertical Development:
- Corona overhead = ultra-wide lens
- Use foreground for scale
- Portrait orientation for curtains
- Include horizon for context

### Predictive Framing:
- Aurora moves north to south
- Pre-compose for anticipated movement
- Leave space for development
- Bracket compositions wildly

## Color Science

Aurora colors tell a story:
- Green (557.7nm): Oxygen at 100-300km
- Red (630.0nm): Oxygen above 300km
- Purple/Blue: Nitrogen below 100km
- Pink edges: Nitrogen + oxygen mix

Camera sees more color than eyes - trust the sensor!

## The Magic Hour(s)

September 23rd, 2 AM, Stokksnes Peninsula:

KP index spiked to 7. What followed was indescribable:
- Entire sky in motion
- Corona directly overhead
- Ground illuminated green
- Could read by aurora light
- Other photographers just standing, watching

Technical notes from that night:
- 400+ images in 3 hours
- ISO range: 200-3200
- Exposures: 0.5-10 seconds
- Battery changes: 4
- Moments of pure awe: countless

## Post-Processing Philosophy

Aurora images need restraint:

### What I Do:
- Adjust exposure/shadows
- Enhance contrast slightly
- Reduce noise carefully
- Correct lens distortion

### What I Don't:
- Oversaturate colors
- Add fake colors
- Composite different nights
- Clone out elements

The aurora is spectacular enough without fakery.

## Unexpected Challenges

1. **Condensation**
   - Lens fogs moving from cold to warm
   - Solution: gradual temperature changes
   - Keep lens cloth handy

2. **Overwhelming Choice**
   - Aurora everywhere = composition paralysis
   - Solution: work one scene thoroughly
   - Quality over quantity

3. **File Management**
   - 64GB cards filled nightly
   - Backup ritual essential
   - Label immediately or lose track

## The Human Element

Met photographers from 12 countries chasing aurora:
- Japanese photographer: 10th trip
- Norwegian couple: honeymoon aurora hunt
- NASA scientist: studying aurora dynamics
- Local guide: 1000+ nights experience

Shared tips, locations, warm coffee. Aurora photography builds instant community.

## Beyond the Green

Other phenomena captured:
- Steve (Strong Thermal Emission Velocity Enhancement)
- Pulsating aurora
- Black aurora (dark patches)
- Proton aurora (diffuse, rare)

Each requires different technique, tells different story about magnetosphere.

## Lessons for Future Trips

1. **Stay longer** - Week wasn't enough
2. **Rent car** - Flexibility crucial
3. **Scout daylight** - Know compositions before dark
4. **Layer properly** - Comfort enables creativity
5. **Enjoy visually** - Don't live behind camera

## The Transformative Experience

Astrophotography taught patience. Aurora photography taught presence. When nature performs at this scale, you're not just photographing - you're witnessing.

Returned to Stanford with 3,000 images and shifted perspective. Started "Space Weather Photography" project, monitoring solar activity and planning future aurora expeditions.

## Technical Takeaways

For aspiring aurora photographers:
- Manual mode always
- Auto-ISO is your enemy
- Shoot RAW exclusively
- Histogram is your friend
- Burst mode for substorms
- Cable release prevents shake

## The Call of High Latitudes

Iceland was gateway drug. Now planning:
- Norway: aurora over fjords
- Alaska: winter aurora
- Antarctica: southern lights
- ISS: aurora from above (someday?)

## Prints and Sharing

Best images now hanging in Stanford dorm. Reactions range from disbelief to inspiration. Several friends planning their own Iceland trips.

Started Instagram: @stanford_sky_guy
Sharing settings and locations freely. Aurora photography shouldn't be gatekept.

## Final Thoughts

Standing under pulsing aurora, camera clicking, feet numb, completely absorbed - this is why I photograph. Not for Instagram likes or print sales, but for these moments of connection with our planet's interaction with the solar wind.

The aurora reminds us we live on a planet, in space, protected by invisible magnetic fields from stellar radiation. What could be more worth photographing?

*Full resolution images and detailed location guides available on Flickr. Planning 2016 Norway expedition - collaborators welcome!*`
  }
];

// Function to generate page.tsx for a photography post
function generatePageTsx(post: PhotographyPost): string {
  const jsxContent = markdownToJSX(post.content);
  
  return `import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">${post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="${post.date}">${formatDate(post.date)}</time>
              <span>•</span>
              <span>${post.readTime} read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              ${post.tags.map(tag => `<span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">${tag}</span>`).join('\n              ')}
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
${jsxContent}
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
`;
}

// Function to convert markdown to JSX
function markdownToJSX(content: string): string {
  const lines = content.split('\n');
  const jsxElements: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.replace('```', '').trim() || 'text';
        codeContent = [];
      } else {
        inCodeBlock = false;
        const escapedCode = codeContent.join('\\n')
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\$/g, '\\$');
        jsxElements.push(`            <pre className="language-${codeLanguage}"><code>{\`${escapedCode}\`}</code></pre>`);
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Handle empty lines
    if (line.trim() === '') {
      if (inList) {
        jsxElements.push('            </ul>');
        inList = false;
      }
      continue;
    }

    // Handle headers
    if (line.startsWith('### ')) {
      jsxElements.push(`            <h3>${line.substring(4)}</h3>`);
    } else if (line.startsWith('## ')) {
      jsxElements.push(`            <h2>${line.substring(3)}</h2>`);
    } else if (line.startsWith('# ')) {
      jsxElements.push(`            <h1>${line.substring(2)}</h1>`);
    }
    // Handle list items
    else if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
      if (!inList) {
        jsxElements.push('            <ul>');
        inList = true;
      }
      const content = line.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
      const processedContent = processInlineElements(content);
      jsxElements.push(`              <li>${processedContent}</li>`);
    }
    // Handle regular paragraphs
    else {
      if (inList) {
        jsxElements.push('            </ul>');
        inList = false;
      }
      
      const processedLine = processInlineElements(line);
      
      // Handle image placeholders
      if (line.startsWith('[') && line.endsWith(']') && !line.includes('](')) {
        jsxElements.push(`            <p className="text-gray-500 italic">${processedLine}</p>`);
      } else {
        jsxElements.push(`            <p>${processedLine}</p>`);
      }
    }
  }

  if (inList) {
    jsxElements.push('            </ul>');
  }

  return jsxElements.join('\n');
}

// Helper function to process inline elements
function processInlineElements(text: string): string {
  return text
    // Bold text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

// Helper function to format date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Generate folders and files
async function generatePhotographyPosts() {
  const outputDir = path.join(process.cwd(), 'app/blog');
  let created = 0;

  for (const post of PHOTOGRAPHY_POSTS) {
    const folderName = `${post.date}-${post.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}`;
    const folderPath = path.join(outputDir, folderName);

    // Skip if already exists
    if (fs.existsSync(folderPath)) {
      console.log(`Skipping "${post.title}" - already exists`);
      continue;
    }

    // Create folder
    fs.mkdirSync(folderPath, { recursive: true });

    // Generate and write page.tsx
    const pageContent = generatePageTsx(post);
    const filePath = path.join(folderPath, 'page.tsx');
    fs.writeFileSync(filePath, pageContent);

    created++;
    console.log(`✅ Created: ${post.title}`);
  }

  console.log(`\n📸 Summary:`);
  console.log(`   Created: ${created} photography posts`);
  console.log(`   Topics: Astrophotography, computational photography, time-lapse`);
}

// Run the generator
generatePhotographyPosts().catch(console.error);