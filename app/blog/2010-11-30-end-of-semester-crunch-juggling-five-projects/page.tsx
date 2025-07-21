import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-12-01"
      title="End of Semester Crunch: Juggling Five Projects"
      summary="The last month of junior year fall - five major projects due, research deadlines, and trying to maintain sanity. This is engineering school."
      content={`It's December, which means every professor decided their final project should be due the same week. Current status: drowning in a sea of breadboards and code.

## The Project Lineup

### 1. Computer Architecture: MIPS CPU
Building a pipelined MIPS processor in Verilog:
- 5-stage pipeline
- Hazard detection
- Branch prediction
- Cache implementation

Currently debugging why it calculates 2+2=5. Probably a forwarding issue.

### 2. Control Systems: Inverted Pendulum
Classic control problem - balance a pendulum upright:
- State space controller
- Kalman filter for estimation
- Real hardware implementation

It balances! For about 3 seconds before violent oscillation.

### 3. Electromagnetics: Patch Antenna Array
Designing a 2.4GHz antenna array:
- 4 elements for beam steering
- Impedance matching network
- Radiation pattern measurement

SWR is 3:1. That's... not great.

### 4. DSP: Music Synthesizer
Building a polyphonic synthesizer:
- Multiple oscillator types
- ADSR envelopes
- Digital filters
- MIDI input

Sounds like a dying cat, but it's MY dying cat.

### 5. Power Electronics: Switching Converter
1kW boost converter design:
- 95% efficiency target
- Digital control loop
- Thermal management

Only caught fire once!

## Time Management Strategies

### The Calendar of Doom
Every hour scheduled:
- 6 AM: Wake up, coffee #1
- 7-12: Classes and labs
- 12-1: Lunch (optional)
- 1-6: Project work
- 6-7: Dinner (if remembered)
- 7-midnight: More projects
- Repeat

### Parallel Processing
Working multiple projects simultaneously:
- Verilog compiles while soldering
- Scope captures while coding
- Simulations run during lectures

### Study Group Dynamics
Our group has evolved roles:
- The Debugger (me)
- The Math Wizard
- The Documentation Guru
- The Hardware MacGyver
- The Coffee Provider (MVP)

## Lessons in Failure

This week's failures:
1. **Magic smoke** - Connected 12V to 3.3V rail
2. **Infinite loops** - Crashed the lab computer
3. **Resonance** - Shattered a sensor with ultrasound
4. **Thermal runaway** - Melted a breadboard

Each failure = learning experience (and good story).

## Sleep Deprivation Effects

Hour 24: Everything is funny
Hour 36: Code starts making sense
Hour 48: Hallucinating compiler errors
Hour 60: Achieve enlightenment (or delirium)

## The Home Stretch

With one week left:
- CPU almost works (for some definition of "works")
- Pendulum balances (if you squint)
- Antenna radiates (somewhere)
- Synthesizer makes sounds (intentionally!)
- Converter converts (without fire)

## Reflection

This is simultaneously:
- The hardest thing I've ever done
- The most educational experience
- Completely insane
- Exactly what I signed up for

Junior year is no joke. But seeing projects come together (even partially) makes it worthwhile.

Next semester: Take fewer classes. (Narrator: He would not take fewer classes.)`}
      tags={["university","projects","time-management","engineering"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "End of Semester Crunch: Juggling Five Projects - Michael D'Angelo",
    description: "The last month of junior year fall - five major projects due, research deadlines, and trying to maintain sanity. This is engineering school.",
  };
}