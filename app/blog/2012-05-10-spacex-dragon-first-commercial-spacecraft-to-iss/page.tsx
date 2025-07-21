import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'SpaceX Dragon: First Commercial Spacecraft to ISS',
  description: 'Watching SpaceX Dragon launch to the ISS. Private space flight is real, and it\'s spectacular.',
  keywords: ['spacex', 'dragon', 'space', 'innovation'],
  openGraph: {
    title: 'SpaceX Dragon: First Commercial Spacecraft to ISS',
    description: 'Watching SpaceX Dragon launch to the ISS. Private space flight is real, and it\'s spectacular.',
    type: 'article',
    publishedTime: '2012-05-10',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-05-10',
  title: 'SpaceX Dragon: First Commercial Spacecraft to ISS',
  content: `At 3:44 AM, I watched history being made. SpaceX's Dragon capsule launched atop a Falcon 9 rocket, becoming the first commercial spacecraft to visit the International Space Station.

## The Launch

Watched the livestream from my dorm:

\`\`\`
T-10 seconds: "Go for launch"
T-0: Main engine start
T+10: "Falcon 9 has cleared the tower"
T+2:30: First stage separation perfect
T+9:00: Dragon in orbit!
\`\`\`

Chills. Absolute chills.

## Why This Matters

This changes everything about space:
- NASA doesn't have monopoly
- Competition drives innovation
- Costs dropping rapidly
- Space is a business now

## The Technical Achievement

What SpaceX accomplished:
- Reliable rocket (3rd successful flight)
- Autonomous spacecraft
- ISS rendezvous and docking
- Reentry and splashdown
- All privately funded

## Comparing Costs

The economics are revolutionary:
- Space Shuttle: $450M per launch
- Soyuz: $70M per seat
- Falcon 9: $60M per launch
- Future goal: $20M

## My Connection

As someone who worked on CubeSats:
- We launched on converted ICBMs
- Limited to specific orbits
- Waited years for launches
- SpaceX changes this completely

## The Software Angle

SpaceX runs on modern tech:

\`\`\`python
# SpaceX uses Linux, C++, Python
# Their job posting mentioned:

def calculate_trajectory(position, velocity, time):
    # Numerical integration for orbit propagation
    # Real-time adjustments
    # Autonomous docking algorithms
    # All running on radiation-hardened computers
\`\`\`

They use Chromium for their displays!

## Elon Musk's Vision

His masterplan is becoming clear:
1. Prove commercial space works ✓
2. Make it routine
3. Reduce costs 100x
4. Make life multiplanetary

Sounds crazy until you watch it happen.

## Impact on Space Startups

This validates the entire industry:
- Planet Labs (where I might work)
- Skybox Imaging
- Moon Express
- Planetary Resources

The space rush is beginning.

## Personal Reflection

Watching this at Stanford, surrounded by future engineers:
- Some will work at SpaceX
- Others will start space companies
- We'll build on this foundation
- Mars doesn't seem impossible

## The Future

What's next:
- Reusable rockets (Grasshopper tests)
- Crew Dragon for astronauts
- Falcon Heavy for big payloads
- Mars Colonial Transporter?

Today, we watched a startup dock with the ISS. The future is here, and it's awesome.`,
  tags: ['spacex', 'dragon', 'space', 'innovation'],
  readTime: '15 min',
};

export default function SpaceXDragonFirstCommercialSpacecrafttoISSPage() {
  return <BlogPost post={post} />;
}
