import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-07-04"
      title="CubeSat Launch Day: Three Years of Work Reaches Space"
      summary="Our satellite finally launches! Watching three years of work ride a rocket to orbit. The anxiety, excitement, and first contact from space."
      content={`Today, July 4th 2011, at 5:39 AM PDT, our CubeSat rode a Minotaur-IV rocket from Vandenberg Air Force Base into orbit. Three years of work now circles Earth every 90 minutes. Here's the launch day story.

## T-24 Hours: Final Preparations

### Pre-Launch Checkout
At the integration facility:
- Final battery charge: 95%
- Systems check: All green
- Remove before flight tags: Removed
- Team photo with satellite: ✓
- Trying not to cry: Failed

### The Handover
Physically giving our satellite to launch personnel:
"Take care of our baby."
"We'll get it to orbit safely."

Three years of late nights in a small metal box. Now it's out of our hands.

## Launch Day

### 2:00 AM - Wake Up
Couldn't sleep anyway. Check email obsessively. Review orbital parameters one more time.

### 3:30 AM - Arrive at Viewing Site
Fog. Of course there's fog. Can't see launch pad 10 miles away.

Team assembled:
- 12 team members
- 3 advisors
- 5 family members
- 1 very nervous project lead (me)

### 4:00 AM - Weather Brief
"50% chance of visibility at launch."
Rockets don't care about fog, but we want to see it!

### 5:00 AM - Final Poll
Launch director polls all stations:
"Propulsion?" "GO"
"Range?" "GO"
"Payload?" "GO"

Our satellite is the payload. We're GO.

### 5:30 AM - Terminal Count
T-minus 10 minutes. Fog lifting slightly. Can see pad lights.

Team huddles together. Some prayers. Some silence. All anxiety.

### 5:39 AM - LAUNCH

The countdown: "3... 2... 1... Ignition!"

Bright light pierces fog. Ground shakes. Rumble arrives seconds later.

The Minotaur rises, disappears into fog after 10 seconds. But we know it's climbing.

"Vehicle is supersonic."
"Mach 1.5 and climbing."
"Stage separation confirmed."

Each callout = relief.

### 5:52 AM - Orbital Insertion
"All payloads deployed successfully."

WE'RE IN SPACE!

Cheering. Crying. Hugging. Three years of work now orbiting at 17,500 mph.

## The Waiting Game

### T+45 Minutes - First Pass Preparation
Rush to ground station. Our first communication window in 45 minutes.

Boot up systems:
- Antenna tracking: Enabled
- Receiver: Configured
- Decoder: Ready
- Heart rate: Dangerous

### T+90 Minutes - First Pass

Antenna points to horizon. Waiting.

Static... Static... 

Then: BEEP BEEP BEEP

"WE HAVE SIGNAL!"

Telemetry floods screen:
- Battery voltage: 7.8V
- Temperature: 15°C
- Solar panels: Deployed
- Status: ALIVE

Our satellite is talking to us from space!

## Decoding First Data

### Health Check
All systems nominal:
- Power system: Charging
- Communications: Strong signal
- Attitude control: Stable
- Payload: Standby

It survived launch. It's working. We built something that works in space.

### First Image
Download first Earth image. Low resolution, but it's EARTH. FROM OUR SATELLITE.

Post to Twitter: "Hello Earth, from UB CubeSat!"
Goes viral in university community.

## The Celebration

### Immediate
- Champagne at 7 AM (don't judge)
- Call families
- Update university PR
- More crying

### Press Coverage
- Local news interviews
- University homepage feature
- Department newsletter
- Even hometown paper calls

"UB Students Successfully Launch Satellite"

## Reflection on the Journey

### 2008: The Beginning
- Knew nothing about satellites
- Thought space was for NASA only
- Joined team as freshman

### 2009: Learning
- First PCB design
- Power budget struggles
- "Why doesn't it work?" phase

### 2010: Building
- Integration nightmares
- Thermal vacuum testing
- Vibration test failures

### 2011: Success
- Final assembly
- Launch campaign
- Orbital operations

## Lessons Learned

### Technical
1. **Space is hard** - Every detail matters
2. **Test everything** - Then test again
3. **Documentation crucial** - Saved us multiple times
4. **Redundancy works** - Backup systems activated
5. **Simple is reliable** - Complex features all failed

### Team Dynamics
1. **Trust is essential** - Can't micromanage everything
2. **Communication breaks** - Have protocols
3. **Celebrate small wins** - Maintains morale
4. **Document decisions** - People forget why
5. **Include everyone** - Best ideas come from unexpected places

## What's Next

### Operations Phase
- Daily passes (4-5 per day)
- Data collection
- Science objectives
- Anomaly resolution

### Personal Journey
- PhD at Stanford starts in September
- Bringing space experience
- Already planning next mission
- CubeSat knowledge valuable

## The Bigger Picture

We're part of the CubeSat revolution:
- Universities accessing space
- $100K missions vs $100M
- Rapid iteration possible
- Students becoming space engineers

## Thank You List

This happened because of:
- Advisors who believed
- Team members who sacrificed
- University funding support
- Family patience
- Coffee (so much coffee)

## One Week Later Update

Satellite still operational:
- 100+ successful passes
- 50 MB data downloaded
- Minor anomalies resolved
- Exceeding mission requirements

Expected lifetime: 6 months
Hoping for: Years

## Advice for Future Teams

Starting a CubeSat project?
1. **Start simpler than you think**
2. **Budget 3x time expected**
3. **Test earlier than comfortable**
4. **Document obsessively**
5. **Enjoy the journey**

## The Moment

Sitting in Stanford apartment. Our satellite passes overhead. Pull out phone app, watch the dot traverse sky.

That dot is our satellite. We put it there.

From freshman who couldn't solder to satellite designer. From Buffalo basement to space.

Dreams do reach orbit. Happy Independence Day indeed. 🚀🛰️🎆`}
      tags={["cubesat","space","launch","milestone"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "CubeSat Launch Day: Three Years of Work Reaches Space - Michael D'Angelo",
    description: "Our satellite finally launches! Watching three years of work ride a rocket to orbit. The anxiety, excitement, and first contact from space.",
  };
}