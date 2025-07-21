import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-09-05"
      title="First Quarter as PhD Student: Classes, Research, and Survival"
      summary="The first quarter at Stanford begins. Graduate courses are different, research is hard, and everyone seems smarter. But slowly finding my rhythm."
      content={`First quarter as a Stanford PhD student officially begins. The honeymoon period is over. Now it's time for the real work: graduate courses, research progress, and figuring out how to survive in this pressure cooker.

## The Course Load

Three courses for first quarter:

### EE 271: Advanced VLSI Design
Not your undergraduate digital design:
- Custom silicon layout
- Sub-threshold circuit design  
- Variation-aware design
- Tape out actual chip

Professor: "If your chip doesn't work, you fail."
No pressure.

### CS 229: Machine Learning (Ng)
The legendary course:
- 300+ students packed in
- Andrew Ng teaching personally
- Mathematical rigor intense
- Problem sets destroy weekends

Everyone says take it. Everyone's right. Everyone's also suffering.

### EE 384X: Packet Switch Architectures
How the internet actually works:
- Router architecture
- Scheduling algorithms
- Buffer management
- 100Gbps+ design challenges

Taught by Nick McKeown. Invented OpenFlow. Casual.

## Research Reality Check

First real meeting with advisor:
"Show me your progress."
*Shows energy harvesting prototype*
"This harvests 100 microwatts?"
"Yes! Up from 10!"
"We need milliwatts. Think differently."

Back to drawing board.

## The PhD Student Life

### Daily Schedule
- 6:00 AM: Wake up, gym (sanity maintenance)
- 8:00 AM: Coffee, emails, panic about deadlines
- 9:00 AM: Classes
- 12:00 PM: Free lunch seminar (survival strategy)
- 1:00 PM: Research time
- 6:00 PM: More free food
- 7:00 PM: Problem sets
- 12:00 AM: Question life choices
- 1:00 AM: Sleep (maybe)

### Office Assignment
Got desk in Gates building:
- Shared with 3 other students
- One monitor from 2003
- Chair probably violates Geneva Convention
- But it's MINE

Decorated with oscilloscope and CubeSat photo.

## The Learning Curve

### VLSI Design Pain
Drawing transistors for hours:
\`\`\`
Layout rules violated: 127
DRC clean after: 47 iterations
LVS matches after: ∞ attempts
Sanity remaining: 0
\`\`\`

Custom designing 8-bit processor. Every. Single. Transistor.

### Machine Learning Math
Problem set 1 returns:
Mean: 75/100
My score: 72/100
Below average at Stanford. Wonderful.

Study group forms immediately. Survival requires collaboration.

### Network Architecture Insights
Learning how Internet really works:
- Packets don't route themselves
- Buffers are everything
- Scheduling is NP-hard
- Internet held together by prayers

Building 4x4 packet switch in Verilog. Debugging takes days.

## Research Progress

Trying new approaches:

### Ambient RF Harvesting
- Built rectenna array
- Measured power from WiFi, cellular, TV
- Result: 250 μW peak, 50 μW average
- Still not enough

### Mechanical Vibration
- Piezoelectric harvester
- Tested on HVAC systems
- Result: 1-2 mW possible
- But not universal

### Hybrid Approach?
Maybe combining sources:
- Solar for daytime
- RF for communication
- Vibration where available
- Thermal differences?

Advisor: "Now you're thinking like a researcher."

## The Imposter Syndrome

Everyone seems smarter:
- Classmate: "I implemented this paper over weekend"
- Other classmate: "My startup just got funded"
- Lab mate: "Submitting to Nature"
- Me: "I made an LED blink with harvested energy"

Remember: Everyone feels this way. Right? RIGHT?

## Stanford Culture Observations

### The Good
- Resources truly unlimited
- Professors accessible
- Peers brilliant and helpful
- Weather still perfect
- Innovation everywhere

### The Intense  
- Competition subtle but real
- Work-life balance nonexistent
- Startup pressure constant
- Success expected
- Failure not discussed

## First Conference Submission

Advisor: "Submit to ISLPED"
Me: "But my results aren't ready"
Advisor: "They never are. Submit."

Writing first Stanford paper:
- 2 weeks of experiments
- 1 week of writing
- 3 days without sleep
- 47 draft versions
- Submitted 3 minutes before deadline

## Social Life (What's That?)

Attempts at balance:
- Friday pizza talks (work disguised as social)
- Hiking (discussing research)
- Parties (networking events)
- Dating (explaining research kills mood)

## The Valley Bubble

Living in Silicon Valley bubble:
- $8 coffee normal
- Everyone has startup idea
- Discussions about "changing world"
- Reality distortion field strong
- Easy to lose perspective

Weekend trip to Santa Cruz helps. Ocean doesn't care about your startup.

## Financial Stress

PhD stipend math:
- Monthly income: $3,166
- Rent: $1,200
- Food: $500 (cooking everything)
- Transport: $100 (bike life)
- Remaining: $1,366
- Unexpected expenses: $1,400

Credit card balance growing. Part of PhD experience?

## Health Concerns

First quarter taking toll:
- Sleep average: 5 hours
- Coffee consumption: 6 cups/day
- Exercise: Declining
- Stress level: Maximum
- Eye twitch: Constant

Counseling center busy. Not just me then.

## Small Victories

But progress exists:
- First successful chip simulation
- ML assignment finally clicked
- Router handles 1Gbps
- Energy harvester improving
- Made friends in cohort

Celebrating small wins crucial.

## Advisor Relationship

Learning to work with advisor:
- Meetings weekly (prepared or die)
- Expectations high but fair
- Pushes beyond comfort zone
- Actually cares about development
- Gives credit generously

Lucky match. Others not so fortunate.

## End of Quarter Crunch

Finals week approaches:
- VLSI chip due
- ML project due
- Network implementation due
- Research paper reviews back
- Sleep becomes legend

Everyone in survival mode. Gates building becomes home.

## Quarter Reflection

Survived first quarter. Lessons:
1. **Graduate courses are HARD**
2. **Research requires creativity**
3. **Time management crucial**
4. **Imposter syndrome normal**
5. **Support network essential**

GPA: 3.7 (B+ in ML, A- in others)
Not stellar, but survived.

## Winter Break Plans

Two weeks "off":
- Revise conference paper
- Catch up on sleep
- Visit family (explain why PhD)
- Read papers for next quarter
- Maybe actual rest?

Who am I kidding.

## Looking Ahead

Winter quarter coming:
- Quals preparation beginning
- Research direction solidifying
- Course load similar
- Experience helps (hopefully)
- Survival seems possible

## The Verdict

First quarter at Stanford: Brutal but transformative.

Every day is challenging. Every week brings growth. Every month feels like a year.

This is what I came for. This is what shapes researchers. This is the Stanford PhD experience.

Tired? Exhausted. 
Quitting? Never.
Ready for more? Somehow, yes.

Bring on winter quarter. ⚡📚💪`}
      tags={["stanford","phd-life","courses","research"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "First Quarter as PhD Student: Classes, Research, and Survival - Michael D'Angelo",
    description: "The first quarter at Stanford begins. Graduate courses are different, research is hard, and everyone seems smarter. But slowly finding my rhythm.",
  };
}