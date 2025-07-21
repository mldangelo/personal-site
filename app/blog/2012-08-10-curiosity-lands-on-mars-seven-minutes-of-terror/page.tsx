import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Curiosity Lands on Mars: Seven Minutes of Terror',
  description: 'Stayed up all night to watch Curiosity land on Mars. The engineering behind the sky crane is absolutely insane.',
  keywords: ['mars', 'curiosity', 'nasa', 'space-exploration'],
  openGraph: {
    title: 'Curiosity Lands on Mars: Seven Minutes of Terror',
    description: 'Stayed up all night to watch Curiosity land on Mars. The engineering behind the sky crane is absolutely insane.',
    type: 'article',
    publishedTime: '2012-08-10',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-08-10',
  title: 'Curiosity Lands on Mars: Seven Minutes of Terror',
  content: `At 10:31 PM PDT, we held our breath as Curiosity began its descent to Mars. The "Seven Minutes of Terror" were the longest seven minutes of my life.

## The Watch Party

Stanford Mars researchers hosted viewing:
- JPL NASA TV feed on big screen
- Mars experts explaining each step
- Everyone nervous but excited
- Snacks themed "Mars bars"

## The Landing Sequence

The most complex landing ever attempted:

\`\`\`
Entry: 13,000 mph
↓
Guided entry (first time for Mars)
↓
Supersonic parachute deploy
↓
Heat shield separation
↓
Powered descent
↓
Sky crane maneuver (!!!)
↓
Touchdown
\`\`\`

## The Sky Crane

This still blows my mind:
- Hover using retro rockets
- Lower rover on cables
- Gently place on surface
- Cut cables and fly away
- All autonomous!

## Following Along in Code

NASA provided telemetry data:

\`\`\`python
# Parsing Mars landing telemetry
import json

def parse_edl_telemetry(data_stream):
    for packet in data_stream:
        telemetry = json.loads(packet)
        
        altitude = telemetry['altitude_meters']
        velocity = telemetry['velocity_mps']
        fuel_remaining = telemetry['fuel_percent']
        
        if telemetry['event'] == 'PARACHUTE_DEPLOY':
            print(f"Parachute deployed at {altitude}m")
        elif telemetry['event'] == 'SKY_CRANE_START':
            print("Sky crane maneuver initiated!")
        elif telemetry['event'] == 'TOUCHDOWN':
            print("TOUCHDOWN CONFIRMED!")
            celebrate()
\`\`\`

## The First Images

Minutes after landing:
- Thumbnail images arrive
- Dusty lens cap still on
- Shadow of rover visible
- Proof we made it!
- Room erupts in cheers

## The Technology Stack

Curiosity's computing power:
- RAD750 processor (200 MHz)
- 256 MB RAM
- 2 GB flash storage
- Runs VxWorks RTOS
- All radiation hardened

My laptop is 100x more powerful, but can't survive Mars!

## Software Engineering for Space

The challenges fascinate me:
- 14-minute communication delay
- No debugging after launch
- Radiation corrupts memory
- Must handle any scenario
- Testing is everything

## Stanford's Connection

Our researchers contributed:
- Landing site selection
- Instrument calibration
- Mission planning software
- Geological analysis tools

## Personal Impact

This landing reinforced my goals:
- Engineering can achieve impossible things
- Teamwork makes miracles happen
- Space exploration needs software
- Maybe work on space missions someday

## What's Next

Curiosity's mission:
- Search for past life signs
- Study Martian geology
- Prepare for human missions
- Last 2 years (still going in 2024!)

We just put a nuclear-powered, car-sized robot on another planet using a rocket-powered sky crane. Engineering doesn't get better than this!`,
  tags: ['mars', 'curiosity', 'nasa', 'space-exploration'],
  readTime: '15 min',
};

export default function CuriosityLandsonMarsSevenMinutesofTerrorPage() {
  return <BlogPost post={post} />;
}
