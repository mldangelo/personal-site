import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-05-07"
      title="Graduation Day: From Buffalo to Silicon Valley"
      summary="Four years of engineering education complete. Diploma in hand, California bound. Reflecting on the journey and looking ahead."
      content={`Today I walked across the stage at UB's Center for the Arts and received my Bachelor of Science in Electrical Engineering. Four years of all-nighters, failed projects, successful builds, and incredible growth. Now it's time for the next chapter.

## By the Numbers

The undergraduate experience quantified:
- Credits completed: 144
- Final GPA: 3.84
- All-nighters: ~200
- Coffee consumed: ~8,000 cups
- Components burned: 47
- Projects built: 100+
- Friends made: Countless
- Debt accumulated: $32,000
- Worth it: Absolutely

## The Ceremony

### 6:00 AM - Preparation
Iron the gown. Find the cap. Panic about the tassel side.

### 8:00 AM - Family Arrives
Parents drove 6 hours. Mom cries before anything even happens. Dad asks if I can fix his phone after this.

### 9:30 AM - Engineering Breakfast
Department reception. Professor mentions my oscilloscope prank in his speech. Mixed pride and embarrassment.

### 11:00 AM - The Walk
"Michael D'Angelo, Electrical Engineering, Magna Cum Laude"

Those 3 seconds walking across stage represent 4 years of work. Don't trip. Don't trip. Didn't trip!

### 12:30 PM - Photos
Every possible combination:
- With diploma
- With parents  
- With professors
- With CubeSat team
- With burned Arduino (tradition)

## Reflection on Four Years

### Freshman Year (2007-2008)
- Couldn't solve basic circuits
- First LED blink = magic
- Discovered passion for embedded
- GPA: 3.6 (C in English)

### Sophomore Year (2008-2009)
- Built first real projects
- Joined IEEE chapter
- Started research
- GPA: 3.8

### Junior Year (2009-2010)
- CubeSat team leadership
- First conference paper
- Internship at automation company
- GPA: 3.9

### Senior Year (2010-2011)
- Senior design success
- Grad school acceptance
- Launch preparation
- GPA: 3.9

## Memorable Professors

The educators who shaped me:

### Dr. Wireless
"If you can't explain it simply, you don't understand it."
Taught me RF isn't actually magic.

### Prof. Circuits
"Current flows in loops. ALWAYS."
Said this 1000 times. Finally sank in around time 800.

### Dr. DSP
"The Fourier Transform is your friend."
Made math beautiful. Still my friend.

### Prof. Embedded
"Read the datasheet. All of it."
Best advice ever. Saved countless hours.

## Final Projects Summary

What I'm most proud of:
1. **CubeSat** - Launching to space!
2. **Acoustic localization** - Published research
3. **SDR from scratch** - Actually works
4. **Autonomous quadcopter** - Sometimes flies
5. **LED cube** - Still mesmerizing

## Lessons Beyond Engineering

### Technical Skills
- Problem decomposition
- Systematic debugging  
- Documentation discipline
- Project planning
- Team dynamics

### Life Skills
- Time management (forced)
- Stress handling (required)
- Coffee appreciation (essential)
- Sleep deprivation (mastered)
- Friendship value (priceless)

## The Stanford Transition

### What's Next
- Summer: CubeSat launch
- August: Drive to California
- September: PhD begins
- 2016?: Dr. D'Angelo (weird)

### Concerns
- Imposter syndrome intensifying
- Bay Area cost of living
- Academic pressure
- Missing Buffalo wings

### Excitement
- World-class resources
- Silicon Valley access
- Weather upgrade
- New challenges

## Thank You Notes

People who made this possible:

### Parents
For believing in the kid who took apart everything. For not complaining (much) when I set the garage on fire. For driving to every presentation.

### Team Members
For late night debugging sessions. For covering when I broke things. For celebrating small victories.

### Professors
For office hours patience. For recommendation letters. For pushing harder.

### Janitors
For not reporting the 3 AM lab sessions. For saving my projects from trash. For the understanding nods.

## Advice for Future Students

Starting your EE journey?

1. **Build constantly** - Theory needs practice
2. **Document everything** - Future you will thank you
3. **Join clubs early** - Community matters
4. **Take hard professors** - Growth requires challenge
5. **Sleep sometimes** - Burnout is real
6. **Have fun** - It goes fast

## The Bitter Sweet

Leaving Buffalo means leaving:
- $1 pizza slices
- Brutal winters that build character
- Professors who became mentors
- Lab that feels like home
- Friends who understand op-amp jokes

## Looking Forward

Goals for next 5 years:
- Complete PhD
- Contribute to space technology
- Start a company?
- Stay connected to UB
- Give back to community

## The Last Lab Visit

Spent last night in the lab. Cleaned my bench. Organized components for next student. Left note: "Your turn to create magic. -Mike 2011"

Found similar note from 2007. Circle complete.

## Final Thoughts

Four years ago, I was terrified of calculus and couldn't solder straight. Today, I'm heading to Stanford to push the boundaries of embedded systems.

To every professor who stayed late, every TA who explained pointers again, every classmate who shared notes, every family member who pretended to understand my projects - thank you.

Buffalo made me an engineer. Time to see what California makes me.

Let's go Bulls! Forever proud to be UB Engineering.

*Now to pack everything I own and drive 3,000 miles. What could go wrong?*

🎓⚡🚀`}
      tags={["graduation","university","personal","milestone"]}
      readTime="12 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Graduation Day: From Buffalo to Silicon Valley - Michael D'Angelo",
    description: "Four years of engineering education complete. Diploma in hand, California bound. Reflecting on the journey and looking ahead.",
  };
}