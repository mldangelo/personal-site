import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-07-20"
      title="Silicon Valley Summer: Internships and Startups"
      summary="First summer in Silicon Valley. Everyone's starting companies, including my roommate. The startup bug is contagious."
      content={`Summer in Silicon Valley is unlike anywhere else. While officially doing research at Stanford, I'm surrounded by interns, entrepreneurs, and world-changing ambitions. The energy is intoxicating.

## The Intern Invasion

Bay Area population swells with interns:
- Google interns everywhere (colorful backpacks)
- Facebook interns (they look tired)
- Apple interns (can't talk about it)
- Startup interns (working for equity)

Stanford campus becomes intern central.

## My "Internship" - Research

Officially not interning, but research feels similar:
- Low pay ✓
- Long hours ✓
- Learning constantly ✓
- Free food hunting ✓
- Imposter syndrome ✓

Working on energy harvesting for wireless sensors. Trying to power devices from ambient RF. Theoretical limit: microwatts. Need: milliwatts. Physics: unforgiving.

## Roommate's Startup Journey

My roommate dropped out to start a company. Watching in real-time:

### Week 1: The Idea
"What if photos organized themselves?"
*Builds prototype in 48 hours*

### Week 2: The Pivot
"Actually, what if photos had AI captions?"
*Another prototype*

### Week 3: The Re-Pivot
"Forget photos. Grocery lists!"
*I stop tracking*

### Week 4: The Investment
"We got $50K from an angel!"
*How?!*

## Startup Events Everywhere

Can't throw stone without hitting a pitch event:
- "Disrupting X with AI"
- "Uber for Y"
- "Facebook for Z"
- "Blockchain for everything"

Free food quality directly proportional to funding round.

## The Y Combinator Effect

YC Demo Day approaching. Entire Valley buzzing:
- Coffee shops full of pitches
- "Stealth mode" startups everywhere
- NDAs for casual conversations
- FOMO intensifying

Attended one YC party. Felt like freshman at senior prom.

## Technical Talks Circuit

Summer tech talk season:
- **Google**: Machine learning at scale
- **Facebook**: Social graph architecture
- **LinkedIn**: Data infrastructure
- **Twitter**: Real-time systems

Key insight: Everyone's solving same problems at different scales.

## Hacker Houses

Visited friend's "hacker house":
- 12 people in 4-bedroom house
- Bunk beds in living room
- Whiteboards on every wall
- 3 startups operating from garage
- Rent: Still $6000/month

Silicon Valley housing is broken.

## The Pressure to Start Something

Every conversation:
"What are you working on?"
"PhD research in energy harvesting."
"But what's your startup?"
"I... don't have one?"
*Visible disappointment*

## Weekend Projects

Can't help but build:

### IoT Plant Monitor
- Moisture sensor + WiFi
- Tweets when thirsty
- 500 GitHub stars overnight
- "You should monetize this!"

### Parking Spot Finder
- Computer vision on phone
- Identifies empty spots
- Works 70% of time
- "This could be huge!"

Everything's a potential startup here.

## Stanford's Role

University embracing entrepreneurship:
- StartX accelerator
- Entrepreneurship courses
- Patent office hours
- "Leave of absence" normalized

Professors expect students to start companies.

## Meeting VCs

Coffee with venture capitalist (friend's connection):
"Tell me about your research."
*Explains energy harvesting*
"What's the market size?"
"Well, it's more about pushing boundaries..."
"Come back when you have customers."

Lesson learned.

## The Success Stories

Meeting Stanford entrepreneurs:
- Classmate sold company for $10M
- Lab mate's startup hiring rapidly
- Professor's spinoff going public
- Undergrad raising Series A

Success feels tangible here.

## The Failure Stories

But also:
- Roommate's friend: Failed, moving back home
- PhD student: Dropped out, startup folded
- Post-doc: Burned through savings
- Many: Living on credit cards

Survivorship bias is real.

## Cultural Observations

Silicon Valley summer insights:
1. **Everyone's optimistic** - Sometimes naively
2. **Failure celebrated** - "What did you learn?"
3. **Network > Knowledge** - Connections matter
4. **Youth favored** - Ageism visible
5. **Diversity lacking** - Working on it?

## My Research Progress

Actual PhD work:
- New antenna design: 15% more efficient
- Power management circuit: Sub-μW sleep
- First paper draft: In progress
- Advisor satisfaction: Moderate

Hard to focus with startup energy everywhere.

## The Burnout

By August, exhaustion visible:
- Coffee shop conversations repetitive
- "Disrupting" loses meaning
- Pitch fatigue sets in
- Missing pure research

Valley intensity isn't sustainable.

## Intern Exodus

End of summer:
- Google interns flood airport
- Housing prices drop slightly
- Coffee shops less crowded
- Normalcy returns briefly

Until next summer.

## Personal Reflection

First Silicon Valley summer thoughts:
1. **Entrepreneurship is infectious**
2. **Research feels slow** compared to startups
3. **Money flows freely** (if you fit pattern)
4. **Innovation is real** but hyped
5. **PhD still right choice** (I think?)

## The Dilemma

Constant internal debate:
- Continue PhD: Deep expertise, slower pace
- Join startup: Fast learning, high risk
- Start company: Ultimate challenge

Advisor's advice: "PhD first, startup later."
Valley's advice: "Why wait?"

## End of Summer

Labor Day approaching. New quarter starts soon.

Roommate's startup already pivoted twice more. Some interns return to school rich (stock). Others just tired.

I've got working energy harvester prototype. 100 microwatts from WiFi signals. Not revolutionary, but real research.

## The Balance

Learning to navigate:
- Valley ambition AND academic rigor
- Quick pivots AND deep thinking
- Network building AND focused research
- Startup culture AND PhD life

It's possible. Just exhausting.

## Conclusion

Silicon Valley summer: Where every idea is fundable, every problem is solvable, and every engineer is one pivot away from billions.

Reality is messier. But the energy, the ambition, the sheer possibility - it's addictive.

Back to research. But keeping one eye on the startup world. Because in Silicon Valley, you never know when inspiration—or investment—might strike.`}
      tags={["silicon-valley","startups","summer","phd-life"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Silicon Valley Summer: Internships and Startups - Michael D'Angelo",
    description: "First summer in Silicon Valley. Everyone's starting companies, including my roommate. The startup bug is contagious.",
  };
}