import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-09-10"
      title="Junior Year Kickoff: Advanced Courses Begin"
      summary="Starting junior year with a killer course load - Electromagnetics, DSP, and Computer Architecture. The real engineering begins now."
      content={`Junior year started this week, and the difficulty just jumped an order of magnitude. This semester's lineup is intense:

## The Course Load

### EE 340: Electromagnetics
Maxwell's equations in all their glory. First lecture was 50 minutes of vector calculus review. I thought I knew math... I was wrong.

Key topics:
- Wave propagation
- Transmission lines
- Antennas
- Waveguides

Professor's quote: "If you can visualize curl and divergence in 3D, you'll do fine." I cannot.

### EE 371: Digital Signal Processing
Finally, the math behind all those FFT projects makes sense! Topics include:
- Z-transforms
- Digital filter design
- Sampling theory
- DFT/FFT algorithms

Already designing filters in MATLAB. So much more elegant than analog!

### CSE 341: Computer Architecture
Understanding what's inside the processor. Topics:
- Pipeline design
- Cache hierarchies
- Branch prediction
- VHDL processor implementation

We're building a MIPS processor from scratch. My FPGA board will finally get proper use!

### EE 382: Control Systems
Closing the loop on dynamic systems:
- Transfer functions
- Stability analysis
- PID controllers
- State space methods

Lab has actual motors and inverted pendulums. Theory meets reality!

## First Week Observations

The jump from sophomore to junior year is real:
1. **No more hand-holding** - Professors assume you know the basics cold
2. **Math intensity** - Every class is basically applied mathematics
3. **Lab complexity** - Gone are the simple LED blinkers
4. **Time management critical** - Each class assigns like it's the only one

## New Study Strategies

Had to evolve my approach:
- **Study groups essential** - Nobody understands everything alone
- **Office hours are mandatory** - Professors actually want to help
- **Start problem sets early** - They're not meant to be done in one night
- **Document everything** - Lab notebooks graded seriously now

## Research Opportunity

Professor from the DSP course invited me to join his research group! Working on acoustic signal processing for hearing aids. First meeting is next week.

## Goals for the Semester

1. Maintain >3.5 GPA (harder than it sounds)
2. Complete at least one significant personal project
3. Get involved in research
4. Start thinking about graduate school
5. Don't burn out

The workload is intimidating, but this is what I came here for. Real engineering knowledge, not just tinkering. Time to level up!`}
      tags={["university","courses","junior-year","education"]}
      readTime="11 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Junior Year Kickoff: Advanced Courses Begin - Michael D'Angelo",
    description: "Starting junior year with a killer course load - Electromagnetics, DSP, and Computer Architecture. The real engineering begins now.",
  };
}