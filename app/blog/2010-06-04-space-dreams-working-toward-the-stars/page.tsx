import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-06-05"
      title="Space Dreams: Working Toward the Stars"
      summary="Reflecting on my fascination with space and how it drives my engineering education. From model rockets to CubeSats, the journey skyward."
      content={`Looking at the ISS through my telescope last night, I'm reminded why I chose engineering. Space has captivated me since childhood, and every circuit I design, every line of code I write, is one step closer to contributing to humanity's journey beyond Earth.

## The Inspiration

Growing up, I devoured everything space-related:
- **Books**: Sagan's "Pale Blue Dot" changed my worldview
- **Movies**: Apollo 13 showed engineering under pressure
- **News**: Watching Spirit and Opportunity land on Mars in 2004

But it was October 4, 2004, that really sparked things - SpaceShipOne won the X Prize. Private space flight was possible!

## From Dreams to Reality

### High School: Model Rockets
Started with Estes kits, quickly moved to scratch builds:
- Altimeter payload with PIC microcontroller
- GPS tracking system
- Onboard video (harder than it sounds in 2007!)
- Highest flight: 3,200 feet

### University: CubeSat Team
Joining UB's CubeSat team connected dreams to reality:
- Designing actual space hardware
- Learning about radiation hardening
- Thermal cycling tests (-40°C to +80°C)
- Writing flight software that can't be debugged after launch

## Current Projects

### 1. Ground Station
Building a satellite tracking station:
- 2.4 GHz Yagi antenna array
- Computer-controlled Az/El mount
- SDR-based receiver
- Can hear amateur satellites!

### 2. High-Altitude Balloon
Preparing for edge-of-space flight:
- Arduino-based flight computer
- GPS/APRS tracking
- Temperature/pressure logging
- Cameras for Earth photography
- Target: 100,000 feet

### 3. Radiation Testing
How do electronics survive space?
- Building cosmic ray detector
- Testing memory bit flips
- ECC algorithm implementation
- Fascinating failure modes!

## Why Space Drives Everything

Space is the ultimate engineering challenge:
- **No room for error**: Can't fix it once launched
- **Extreme environment**: Temperature, radiation, vacuum
- **Power constraints**: Every milliwatt matters
- **Reliability required**: Must work for years

These constraints make you a better engineer everywhere.

## Following the Industry

Exciting developments in 2010:
- SpaceX almost reached orbit (next time!)
- Virgin Galactic showing progress
- Bigelow inflatable habitats
- Google Lunar X Prize teams forming
- NASA's commercial crew program

The barrier to space is dropping rapidly.

## Academic Path

Tailoring my education for aerospace:
- **Orbital Mechanics**: Self-studying, not offered here
- **Control Systems**: Critical for attitude control
- **RF Communications**: How else to talk to spacecraft?
- **Reliability Engineering**: When failure isn't an option
- **Embedded Systems**: Computers that can't crash

## The CubeSat Experience

Our 10x10x10cm satellite is teaching real lessons:
- Systems engineering complexity
- Team coordination challenges
- Documentation importance
- Testing, testing, testing
- Budget constraints (very NASA-like!)

Launch planned for 2012. Fingers crossed!

## Side Projects

Everything connects to space somehow:
- **Star tracker**: Camera + image processing = attitude determination
- **Reaction wheel**: Brushless motor control for satellite pointing
- **Solar panel tester**: Characterizing cells for power system
- **Vacuum chamber**: Built from old pressure cooker

## Future Goals

Short term (graduation):
- Complete CubeSat project
- Internship at aerospace company
- High-power rocketry certification
- Publish space-related research

Long term (dream big):
- Work on Mars mission hardware
- Design deep space probe systems
- Contribute to human spaceflight
- Maybe see Earth from above?

## Why It Matters

Carl Sagan said it best: "The Earth is the only world known so far to harbor life... There is perhaps no better demonstration of the folly of human conceits than this distant image of our tiny world."

Engineering for space puts everything in perspective. Every problem solved, every system designed, potentially enables humanity's next giant leap.

## Community

Found my tribe:
- Amateur radio operators bouncing signals off the moon
- High-power rocketeers pushing the amateur altitude records
- Satellite trackers cataloging everything in orbit
- Space enthusiasts building the future

To anyone reading this with similar dreams: keep building, keep learning, keep looking up. The space age isn't over - it's just beginning, and we're the generation that will make it happen.`}
      tags={["space","personal","cubesat","inspiration"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Space Dreams: Working Toward the Stars - Michael D'Angelo",
    description: "Reflecting on my fascination with space and how it drives my engineering education. From model rockets to CubeSats, the journey skyward.",
  };
}