import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-12-20"
      title="Year in Review: From CubeSat to Stanford PhD"
      summary="Reflecting on 2011 - launched a satellite, graduated college, started PhD at Stanford, and discovered Silicon Valley. What a journey."
      content={`As 2011 draws to a close, I'm sitting in my Stanford office at midnight (as usual), reflecting on what might be the most transformative year of my life. From launching a satellite to starting a PhD, this year changed everything.

## Major Milestones

### January - Senior Spring
Started the year at UB:
- Senior design quadcopter
- Grad school applications pending
- CubeSat integration crunch
- Last semester with friends

Seemed busy then. Cute in retrospect.

### February - Acceptance
Stanford acceptance changed trajectory:
- Dream school said yes
- California adventure awaiting
- Imposter syndrome beginning
- Future suddenly different

Still have the acceptance email starred.

### March - First Conference
ICASSP in Prague:
- First international presentation
- Acoustic localization paper
- Networking with researchers
- Confidence boost needed

Learned I could play with the big kids.

### May - Graduation
Four years at UB complete:
- BS in Electrical Engineering
- Magna Cum Laude
- Satellite builder
- California bound

Walked across stage. Parents cried. I might have too.

### May - Cross Country
3,000 miles to new life:
- Car packed with oscilloscopes
- Desert, mountains, dreams
- Arrived at Stanford
- New chapter begins

That drive was meditation and transition.

### July - Space Success
CubeSat launched successfully:
- Three years of work
- Reached orbit safely
- Communicated from space
- Team achievement unlocked

Watching our satellite launch = career highlight.

### September - PhD Begins
Stanford life starts:
- Classes harder than expected
- Research direction unclear
- Silicon Valley culture shock
- Learning constantly

The deep end of the pool.

### October - Jobs Passes
Silicon Valley mourns:
- Steve Jobs dies
- Industry reflects
- Innovation inspiration
- "Stay hungry, stay foolish"

His Stanford speech hits different as student here.

### November - Building Again
Never stop making:
- Halloween mesh network
- Quadcopter 2.0
- Raspberry Pi experiments
- Research slowly progressing

Building things keeps me grounded.

## Technical Growth

### Skills Acquired
This year's learning:
- **VLSI Design**: Drawing transistors
- **Machine Learning**: Math intensity
- **Mesh Networking**: Distributed systems
- **Energy Harvesting**: Physics limits
- **Research Process**: Papers and pain

### Projects Completed
Built this year:
- CubeSat (launched!)
- SDR from scratch
- Autonomous quadcopter
- Halloween scare network
- Various energy harvesters
- Too many failed experiments

Failure teaches most.

### Papers Published
- ICASSP acoustic localization
- ISLPED submission (pending)
- CubeSat lessons learned (writing)

Publishing is harder than building.

## Personal Evolution

### From Buffalo
Small town kid → Silicon Valley researcher
- Comfortable → Challenged daily
- Big fish → Tiny minnow
- Undergrad confidence → PhD humility
- Regional view → Global perspective

Growth requires discomfort.

### Mindset Shifts
- "Building for fun" → "Building for impact"
- "Good enough" → "Push the boundary"
- "I know things" → "I know nothing"
- "Fear failure" → "Fail faster"

Stanford changes you.

### Life Lessons
2011 taught me:
1. **Dream big** - They might say yes
2. **Ship it** - Perfect is enemy of done
3. **Ask questions** - Everyone's learning
4. **Network matters** - But substance more
5. **Health first** - Burnout helps nobody

## Silicon Valley Observations

Living here 6 months:
- **Innovation everywhere** - But hype too
- **Money flows** - To specific patterns
- **Failure accepted** - If you learn
- **Network effects** - Real and powerful
- **Reality distortion** - Stay grounded

It's simultaneously inspiring and exhausting.

## Challenges Faced

### Academic
- Imposter syndrome constant
- Course difficulty shocking
- Research progress slow
- Time management failing
- Stress levels maximal

PhD is supposed to be hard. It is.

### Personal
- 3,000 miles from family
- Making new friends at 22
- Dating? What's that?
- Financial stress real
- Work-life balance mythical

Growing pains necessary.

### Technical
- Energy harvesting stubborn
- Physics has limits
- Theory meets reality
- Complexity overwhelming
- Progress non-linear

Research is humbling.

## Gratitude List

People who made this year possible:
- **Parents**: Unwavering support
- **UB Professors**: Foundation builders
- **CubeSat Team**: Dream achievers
- **Stanford Advisor**: Patient guide
- **New Friends**: Sanity savers

Success requires community.

## Looking Ahead to 2012

### Q1 Goals
- Pass qualifying exams
- Submit ISLPED paper
- Energy harvesting breakthrough?
- Maintain health
- Visit home

### Year Goals
- Define thesis direction
- Publish 2 papers
- Build something impactful
- Teach a course
- Stay hungry

### Life Goals
- PhD in 4 years (aggressive)
- Technical leadership
- Start company?
- Space involvement
- Change world (cliché but sincere)

## By the Numbers

2011 statistics:
- Miles moved: 3,000
- Satellites launched: 1
- Papers published: 1
- All-nighters: ~50
- Coffee consumed: ~1,500 cups
- New friends made: Dozens
- Life changed: Completely

## The Transformation

January 2011 Mike:
- Undergraduate at UB
- Building for fun
- Regional perspective
- Confident in knowledge

December 2011 Mike:
- PhD student at Stanford
- Building for impact
- Global perspective
- Humbled by ignorance

Same person, different world.

## Late Night Thoughts

It's 1 AM. Lab is quiet. Silicon Valley lights twinkle outside. Oscilloscope hums beside me. Energy harvester shows 400 microwatts. Progress.

A year ago, I was debugging CubeSat firmware in Buffalo snow. Now I'm pushing physics boundaries in California sunshine. Life moves fast when you say yes to opportunities.

## The Journey

2011 was about transitions:
- Student → Researcher
- Builder → Scholar
- Follower → Leader
- Dreamer → Doer

Each transition painful but necessary.

## Closing Reflection

This year launched more than satellites. It launched a new chapter of life. From Buffalo winters to Stanford palm trees. From undergraduate projects to PhD research. From comfortable to challenged.

The CubeSat reaching orbit proved dreams can fly. Stanford acceptance proved hard work pays off. Silicon Valley proved innovation thrives on ambition.

2012 will bring new challenges. Qualifying exams. Research struggles. Paper rejections. Silicon Valley pressures.

But also: Knowledge. Growth. Impact. Community. Purpose.

As Jobs said at Stanford: "Stay hungry. Stay foolish."

After this year, I'm hungrier than ever. And just foolish enough to believe I can make a difference.

Here's to 2011 - the year everything changed.
Here's to 2012 - the year we build on it.

Happy New Year from Stanford! 🎊🚀📚`}
      tags={["year-review","reflection","stanford","personal"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Year in Review: From CubeSat to Stanford PhD - Michael D'Angelo",
    description: "Reflecting on 2011 - launched a satellite, graduated college, started PhD at Stanford, and discovered Silicon Valley. What a journey.",
  };
}