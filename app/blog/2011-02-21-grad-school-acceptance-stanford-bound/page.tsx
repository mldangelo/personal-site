import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-02-22"
      title="Grad School Acceptance: Stanford Bound!"
      summary="The envelope arrived. Starting PhD at Stanford in the fall. Excited, terrified, and ready for the next chapter."
      content={`Checked email obsessively for weeks. Then it arrived: "Congratulations! You have been admitted to Stanford University's Electrical Engineering PhD program."

I literally fell out of my chair.

## The Decision Process

Incredibly fortunate to have options:

### Stanford EE
- **Pros**: Silicon Valley, amazing faculty, startup culture
- **Research fit**: Embedded systems lab perfect match
- **Funding**: Full fellowship + stipend
- **Cons**: Cost of living, far from family

### MIT Media Lab
- **Pros**: Interdisciplinary, space projects
- **Research fit**: Future spacecraft systems
- **Funding**: RA position available
- **Cons**: Boston winters, more structured

### CMU Robotics
- **Pros**: Best robotics program, industry connections
- **Research fit**: Autonomous systems
- **Funding**: Teaching assistantship
- **Cons**: Pittsburgh (no offense)

### The Choice

Stanford won because:
1. Professor working on exactly what I want
2. Silicon Valley opportunities
3. Weather (shallow but true)
4. Startup ecosystem
5. That California energy

## Telling People

### Parents
"Where's Stanford?" - Mom
"It's... it's one of the best schools in the world."
"Oh. Is it expensive?"
*Explains PhD funding*
"They PAY you to go to school?!"

### Advisor
"Great choice. Now don't get distracted by startups... immediately."
He knows me too well.

### Friends
Mixed reactions:
- "California? Sellout!" (jokingly)
- "Can I crash on your couch?"
- "You'll fit right in with the nerds"

## The Path Here

Looking back at what got me here:

### GPA: 3.84
Not perfect, but consistent. That one C in English Lit still haunts me.

### GRE: 800Q/680V/5.5W
Quantitative perfect, verbal decent. Studied for months.

### Research
- Two published papers
- CubeSat project leadership
- Acoustic localization system
- Consistent lab presence

### Letters of Recommendation
Three professors who knew me well:
- Research advisor (2 years)
- Senior design advisor
- Electromagnetics professor

### Statement of Purpose
Rewrote 15 times. Key themes:
- Clear research vision
- Demonstrated hardware skills
- Passion for embedded systems
- Future goals aligned with program

## What This Means

### Academically
- 5-6 years of focused research
- World-class resources
- Brilliant peer group
- Pressure to perform

### Personally
- Moving across country
- Leaving comfort zone
- New chapter of life
- Growth opportunity

### Professionally
- Access to Silicon Valley
- Networking opportunities
- Credibility boost
- Research freedom

## Concerns

Being honest about fears:

1. **Imposter Syndrome**
   Everyone will be smarter

2. **Financial**
   Bay Area is expensive, even with stipend

3. **Workload**
   PhD is grueling journey

4. **Isolation**
   Leaving friends and family

5. **Failure**
   What if I can't cut it?

## Preparation Plans

### Summer Before
- Finish CubeSat launch
- Read advisor's papers
- Learn new skills (machine learning?)
- Save money
- Visit campus

### Skills to Develop
- Better programming practices
- Statistical analysis
- Technical writing
- Presentation skills
- Time management

### Mental Preparation
- This will be hard
- Failure is part of research
- Ask for help
- Maintain work-life balance
- Remember why I'm doing this

## The Bigger Picture

This isn't just about me. First generation college student, now PhD bound. My family sacrificed for this. I carry their dreams too.

## Thank You List

People who made this possible:
- Parents (always supportive)
- Professors who pushed me
- Lab mates who helped
- Friends who listened
- That one TA who explained pointers

## Looking Forward

Research interests for PhD:
- Ultra-low power embedded systems
- Energy harvesting
- Sensor networks
- Space systems
- Maybe some ML/embedded fusion

## The Email I'll Frame

"Dear Michael,

Congratulations! On behalf of the Department of Electrical Engineering, I am delighted to inform you that you have been admitted to the PhD program at Stanford University..."

Still doesn't feel real.

## Final Thoughts

Four years ago, I was struggling with basic circuits. Now Stanford thinks I can contribute to human knowledge. Either they made a mistake, or maybe, just maybe, I can do this.

Time to prove it's the latter.

California, here I come! 🌴

*PS - Already looking at bikes. Apparently everyone bikes at Stanford.*`}
      tags={["grad-school","stanford","personal","milestone"]}
      readTime="11 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Grad School Acceptance: Stanford Bound! - Michael D'Angelo",
    description: "The envelope arrived. Starting PhD at Stanford in the fall. Excited, terrified, and ready for the next chapter.",
  };
}