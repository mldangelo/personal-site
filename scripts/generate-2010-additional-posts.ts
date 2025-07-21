#!/usr/bin/env tsx
import { promises as fs } from 'fs';
import path from 'path';

interface BlogPost {
  date: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  readTime: string;
}

const posts2010Additional: BlogPost[] = [
  {
    date: '2010-06-15',
    title: 'My First PCB Etching: Adventures in Ferric Chloride',
    summary: 'Transitioning from perfboard to custom PCBs using the toner transfer method. Spoiler: ventilation is important!',
    content: `Finally took the plunge into PCB etching after months of dealing with messy perfboard projects. Armed with a laser printer, glossy paper, and a bottle of ferric chloride, I set out to create my first custom PCB.

## The Process

### 1. Design to Print
After designing the board in Eagle CAD, the hardest part was finding the right paper. Magazine pages worked best - the glossy coating releases the toner easily.

### 2. Toner Transfer
The clothes iron method is tricky. Too hot and the toner spreads. Too cold and it doesn't transfer. I ruined three boards before getting it right.

### 3. Etching Chemistry
Ferric chloride is nasty stuff. It stains everything it touches permanently. After accidentally creating modern art on my garage floor, I invested in proper containers and gloves.

### 4. Results
My first successful board was a simple LED blinker, but holding that professional-looking PCB felt like magic. No more wire wrapping!

## Lessons Learned

1. **Double-check your mirroring** - Nothing worse than a backwards PCB
2. **Drill before soldering** - Learned this the hard way
3. **Make multiple copies** - Etching is unpredictable
4. **Ventilation is crucial** - Those fumes are no joke

## Cost Analysis
- Laser printer toner: $0.02 per board
- Ferric chloride: $0.50 per board
- Copper clad board: $2.00
- Time: 2 hours
- Satisfaction: Priceless

Next project: double-sided boards with vias. This is going to be interesting...`,
    tags: ['pcb', 'etching', 'diy', 'electronics'],
    readTime: '12 min',
  },
  {
    date: '2010-06-25',
    title: 'Building a Spectrum Analyzer with FFT',
    summary: 'Creating a real-time audio spectrum analyzer using an ATmega328 and some clever math. Who says 8-bit can\'t do DSP?',
    content: `Ever since learning about Fourier transforms, I've wanted to build a real-time spectrum analyzer. Turns out you can do surprisingly good FFT on an 8-bit microcontroller with some optimization tricks.

## The Challenge

The ATmega328 has:
- 16 MHz clock
- 2KB RAM
- No hardware multiply

Not exactly DSP material, but constraints breed creativity!

## Implementation

### Fixed-Point Math
Floating point is too slow, so everything uses fixed-point arithmetic. I'm using Q15 format (1 sign bit, 15 fractional bits).

### Optimized FFT
Started with a radix-2 FFT, then optimized:
- Precomputed twiddle factors in PROGMEM
- Bit-reversal lookup table
- Assembly language for critical loops

### Display Output
32-band spectrum on an LED matrix. Each column shows one frequency bin, height indicates magnitude.

## Performance

With a 256-point FFT:
- Sampling rate: 9.6 kHz
- Frequency resolution: 37.5 Hz
- Update rate: 30 fps

Not bad for an Arduino!

## Code Optimization Journey

Started at 2 seconds per FFT. Current time: 33ms. Key optimizations:
1. Removed all divisions (shift instead)
2. Inline butterfly operations
3. Use symmetry properties
4. Careful register allocation

## Applications

Now I can finally see:
- Audio frequency content
- Mechanical vibrations (with accelerometer input)
- RF signals (with appropriate frontend)

Next step: logarithmic frequency scale for better music visualization.

The code is messy but it works. Sometimes that's good enough for a learning project!`,
    tags: ['dsp', 'fft', 'microcontroller', 'optimization'],
    readTime: '13 min',
  },
  {
    date: '2010-07-05',
    title: 'Internship Project: Industrial Motor Controller',
    summary: 'My summer internship project - designing a three-phase motor controller for industrial automation. Real engineering with real consequences.',
    content: `Started my summer internship at a local industrial automation company. My project: design a motor controller for their conveyor systems. No pressure - just don't burn down the factory!

## Project Requirements

- Control 5HP three-phase induction motors
- Variable speed (0-1800 RPM)
- Soft start/stop capability
- Overcurrent protection
- RS-485 communication
- Cost under $200

## The Design Process

### Week 1-2: Research
Spent two weeks reading application notes and motor control theory. Three-phase power is fascinating - it's like mechanical power transmission through electrical means.

### Week 3-4: Schematic Design
Key components:
- IGBT power stage (6 switches in bridge configuration)
- Gate drivers with isolation
- Current sensing on all three phases
- DSP for control algorithms
- Power supply with multiple isolated rails

### Week 5-6: PCB Layout
Four-layer board with careful attention to:
- High current paths (6 oz copper!)
- Gate drive routing
- Noise isolation
- Thermal management

### Week 7-8: Firmware Development
Implemented:
- Space vector PWM
- Field-oriented control
- PI speed/torque loops
- Fault detection
- Modbus communication

## Testing Adventures

First power-up was terrifying. Triple-checked everything, then hid behind a blast shield. Success! No smoke!

Progressive testing:
1. No load, low voltage
2. Resistive load
3. Small motor
4. Full 5HP motor

## Real-World Lessons

This isn't like university projects:
- Safety is paramount (arc flash is real)
- Documentation matters
- Cost constraints drive design
- Reliability > clever features
- Test, test, test

## Results

The controller works! Currently running on three conveyor lines. Seeing my design in actual production is incredibly satisfying.

My supervisor's comment: "Not bad for a sophomore." I'll take it!

Key takeaway: There's a huge difference between textbook knowledge and practical engineering. This internship is worth more than a whole semester of classes.`,
    tags: ['internship', 'motor-control', 'power-electronics', 'industrial'],
    readTime: '14 min',
  },
  {
    date: '2010-07-20',
    title: 'RF Black Magic: Building My First Radio',
    summary: 'Attempting to build an FM transmitter and discovering why RF engineering is considered dark arts. So many ways for signals to escape!',
    content: `After avoiding RF projects for two years, I finally decided to build an FM transmitter. How hard could it be? Turns out, RF really is black magic.

## The "Simple" Design

Started with a basic design:
- Colpitts oscillator (88-108 MHz)
- Varactor diode for FM modulation
- Buffer amplifier
- Output filter

Should have worked first try, right?

## Reality Check

### Attempt 1: The Frequency Drifter
Built the circuit on breadboard (mistake #1). It transmitted... somewhere between 80-120 MHz depending on:
- Temperature
- Nearby objects
- Phase of the moon
- Whether I was looking at it

### Attempt 2: Manhattan Style
Rebuilt on copper clad using "Manhattan style" construction. Better, but still drifted 5 MHz when I walked past.

### Attempt 3: Proper PCB
Designed a PCB with:
- Ground plane
- Shielded oscillator section
- SMA connectors
- Proper impedance matching

Finally stable! Frequency drift < 100 kHz.

## Lessons in RF Weirdness

1. **Everything is an antenna** - That "short" wire? It's a quarter wavelength at 100 MHz
2. **Parasitic capacitance matters** - Even 1 pF shifts frequency by MHz
3. **Ground isn't ground** - At RF, "ground" has impedance
4. **Shielding is essential** - My oscillator was picking up cell phone signals

## Debugging Tools

Borrowed some proper RF equipment:
- Spectrum analyzer (game changer!)
- Return loss bridge
- Frequency counter
- Near field probes

Seeing the actual spectrum revealed spurious emissions everywhere. No wonder it sounded terrible!

## Legal Note

Kept power under 100mW and added a low-pass filter to kill harmonics. Still probably violated several FCC regulations. For educational purposes only!

## Success... Sort Of

Final transmitter specs:
- Frequency stability: ±50 kHz
- Range: 100 feet
- Audio quality: "Recognizable"
- Spurious emissions: "Probably illegal"

Not exactly broadcast quality, but I can transmit music from my iPod to a radio across the room. That's pretty cool for a first attempt.

Next project: crystal-controlled transmitter. Stability through brute force!`,
    tags: ['rf', 'radio', 'fm-transmitter', 'analog'],
    readTime: '11 min',
  },
  {
    date: '2010-08-10',
    title: 'The Great Capacitor Plague: A Repair Adventure',
    summary: 'Discovering the early 2000s capacitor plague firsthand while fixing old motherboards. Sometimes failure teaches more than success.',
    content: `Bought a lot of "broken" electronics on eBay for parts. Turns out most had the same problem: bulging capacitors. Welcome to my introduction to the capacitor plague!

## The Discovery

Opening the first motherboard, I saw them immediately:
- Bulging tops
- Brown crusty leakage
- That distinctive "bad cap" smell

Research revealed this was a widespread problem from bad electrolyte formulas in the early 2000s.

## The Repair Process

### Equipment Needed
- Temperature-controlled iron
- Desoldering pump
- Good quality capacitors (Japanese brands!)
- Patience

### Technique Matters
Learned the hard way:
1. Don't pull - you'll rip traces
2. Add fresh solder before desoldering
3. Clean pads thoroughly
4. Check for corroded vias

## The Motherboard Graveyard

Fixed (or attempted to fix):
- 5 motherboards (3 successful)
- 2 graphics cards (both successful)
- 3 LCD monitors (2 successful)
- 1 DVD player (successful)

Total cost: $40 in capacitors
Value of working hardware: ~$300

## Interesting Failures

Not all were straightforward:
- One motherboard had corroded traces under the sockets
- A monitor had cascading failures from voltage spikes
- One graphics card worked... for exactly 10 minutes

## Chemistry Lesson

Researched why capacitors fail:
- Incomplete electrolyte formula
- Hydrogen gas generation
- Pressure buildup
- Seal failure
- Electrolyte leakage → corrosion

It's a perfect example of how a small chemistry error can cause billions in damage.

## Skills Gained

This project taught me:
- SMD desoldering techniques
- Trace repair with wire wrapping
- Reading capacitor codes
- Understanding failure modes
- The value of quality components

## The Economics

Interesting observation: People throw away repairable electronics. A $200 monitor becomes e-waste over $2 in capacitors. There's a business opportunity here...

Currently running my main desktop on a motherboard I fixed. Every boot feels like a small victory against planned obsolescence!`,
    tags: ['repair', 'capacitors', 'hardware', 'troubleshooting'],
    readTime: '12 min',
  },
  {
    date: '2010-08-25',
    title: 'Building an FPGA Development Board',
    summary: 'Designing my own FPGA development board because commercial ones are too expensive. Learning why they cost so much!',
    content: `FPGA development boards cost hundreds of dollars. As a broke student, I decided to build my own. How hard could it be? (Spoiler: very hard)

## The Plan

Target specs:
- Xilinx Spartan-3E (XC3S250E)
- 50 MHz oscillator
- USB programming via FT2232
- 64MB SDRAM
- Bunch of I/O headers
- Total budget: $50

## Schematic Design Challenges

### Power Supplies
FPGAs need multiple voltages:
- 1.2V core (3A!)
- 2.5V auxiliary
- 3.3V I/O

Designed a multi-output switching regulator. Efficiency matters when pulling 5+ watts.

### Decoupling Nightmare
The Xilinx datasheet recommends:
- 1 bulk cap per power pin
- 1 ceramic cap per power pin
- Power pins EVERYWHERE

My 144-pin FPGA needed 50+ capacitors!

### High-Speed Signals
SDRAM runs at 100+ MHz. Had to learn about:
- Impedance control
- Length matching
- Termination
- Signal integrity

This isn't like Arduino anymore...

## PCB Layout Adventure

### 6-Layer Board
Stackup:
1. Signal
2. Ground
3. Power (split planes)
4. Signal
5. Power
6. Signal

### The Routing Marathon
- 600+ nets
- All SDRAM traces length-matched (±0.1")
- Differential pairs for USB
- Via minimization for high-speed signals

KiCad crashed twice. I sympathize.

## Assembly Challenges

### 0.5mm Pin Pitch
The FPGA has 144 pins at 0.5mm pitch. My hands shake from coffee. This is problematic.

Solution: Flood with flux, drag solder, pray.

### The Reflow Oven
Built a reflow oven from a toaster oven and Arduino. Temperature profile is critical for BGAs.

## First Power-On

The moment of truth... IT WORKS! Well, mostly.

### What Works
- Power supplies stable
- FPGA configures
- LED blink program runs
- USB enumeration successful

### What Doesn't
- SDRAM timing issues (still debugging)
- One I/O bank dead (probably my soldering)
- Gets uncomfortably warm

## Lessons Learned

1. **There's a reason dev boards cost $300** - Engineering time, testing, support
2. **High-speed design is hard** - Every wire is a transmission line
3. **Thermal management matters** - FPGAs are power hungry
4. **Start simple** - Should have used SRAM first

Total cost: $48 (plus 100+ hours of work)
Educational value: Immense

Now I truly appreciate professional hardware design. Time to learn Verilog!`,
    tags: ['fpga', 'pcb-design', 'hardware', 'high-speed'],
    readTime: '15 min',
  },
  {
    date: '2010-09-10',
    title: 'Junior Year Kickoff: Advanced Courses Begin',
    summary: 'Starting junior year with a killer course load - Electromagnetics, DSP, and Computer Architecture. The real engineering begins now.',
    content: `Junior year started this week, and the difficulty just jumped an order of magnitude. This semester's lineup is intense:

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

The workload is intimidating, but this is what I came here for. Real engineering knowledge, not just tinkering. Time to level up!`,
    tags: ['university', 'courses', 'junior-year', 'education'],
    readTime: '11 min',
  },
  {
    date: '2010-09-25',
    title: 'The Art of Debugging: A Systematic Approach',
    summary: 'After three years of random debugging, finally developing a systematic approach. These techniques just saved a week-long project.',
    content: `After spending 20 hours debugging a SPI communication issue (it was a loose wire), I realized I need a better debugging methodology. Here's what I've learned:

## The Systematic Approach

### 1. Reproduce Reliably
Can't fix what you can't reproduce. This week's SPI bug only happened:
- After exactly 1000 transfers
- Only at 3.3V (not 5V)
- Only with 10k pull-ups (not 4.7k)

Weird, right? That's valuable information!

### 2. Binary Search
Cut the problem space in half repeatedly:
- Hardware vs Software?
- Transmit vs Receive?
- Master vs Slave?
- Timing vs Protocol?

Each test eliminates half the possibilities.

### 3. Change One Thing
The golden rule I keep breaking. This week I:
- Changed clock speed AND pull-up values
- Swapped chips AND cables
- Updated code AND wiring

No wonder debugging took forever!

## Essential Tools

### For Hardware
- **Oscilloscope** - Your eyes into the electrical domain
- **Logic analyzer** - Decodes protocols automatically
- **Multimeter** - Never trust a connection
- **Current probe** - Found a short this way

### For Firmware
- **Serial printf** - Still the best debugger
- **GPIO toggles** - Timing verification
- **Assertions** - Catch bugs early
- **Version control** - Git bisect is magic

## Common Failure Modes

My bug collection:
1. **Floating inputs** - Random behavior generator
2. **Race conditions** - Works 99% of the time
3. **Stack overflow** - Corrupts random variables
4. **Integer overflow** - The 65,536th iteration fails
5. **Impedance mismatch** - Signals reflect and interfere

## The Debugging Journal

Started keeping detailed notes:
- Symptom description
- Test conditions
- What worked/didn't work
- Root cause
- Prevention strategy

Already seeing patterns in my failures!

## This Week's Bug Post-Mortem

The SPI issue? Pull-up resistor was too weak. At 3.3V with 10k, the rise time was marginal. After 1000 transfers, cumulative timing error caused desynchronization.

Solution: 4.7k pull-ups or slower clock.

Time to find: 20 hours
Time to fix: 5 minutes

## Lessons Learned

1. **Trust nothing** - Verify every assumption
2. **Measure everything** - Guessing wastes time
3. **Document findings** - Future you will thank you
4. **Take breaks** - Fresh eyes see obvious problems
5. **Ask for help** - Sometimes you're too close to see it

Debugging is a skill like any other. Time to master it!`,
    tags: ['debugging', 'methodology', 'troubleshooting', 'engineering'],
    readTime: '13 min',
  },
  {
    date: '2010-10-15',
    title: 'DSP Project: Real-Time Audio Effects Processor',
    summary: 'Building a real-time audio effects processor for my DSP class. Reverb, echo, and distortion at 48kHz on a measly DSP chip.',
    content: `For our DSP class project, I'm building a real-time audio effects processor. The challenge: implement multiple effects on a fixed-point DSP with limited memory.

## Hardware Platform

Using the TI TMS320C5515 DSP:
- 120 MHz clock
- 320KB RAM
- Fixed-point only
- Stereo audio codec included

Not exactly a powerhouse, but that's the point!

## Implemented Effects

### 1. Digital Reverb
Using Schroeder reverberators:
- 4 comb filters in parallel
- 2 allpass filters in series
- Tuned for "concert hall" sound

Memory usage is the killer - need several seconds of delay lines.

### 2. Echo/Delay
Circular buffer implementation:
- Variable delay (10ms - 1s)
- Feedback control
- Wet/dry mix

Simple but sounds great!

### 3. Dynamic Range Compression
- RMS envelope detection
- Soft-knee compression curve
- Make-up gain
- Attack/release timing

Useful for evening out volume levels.

### 4. Distortion/Overdrive
Multiple algorithms:
- Hard clipping
- Soft clipping (tanh approximation)
- Tube emulation (even harmonics)
- Bit crushing

My favorite - makes everything sound like a garage band!

## Implementation Challenges

### Fixed-Point Math
Everything needs careful scaling:
\`\`\`c
// Q15 multiplication with saturation
int16_t q15_mul(int16_t a, int16_t b) {
    int32_t result = ((int32_t)a * b) >> 15;
    if (result > 32767) return 32767;
    if (result < -32768) return -32768;
    return (int16_t)result;
}
\`\`\`

### Memory Management
With only 320KB RAM and 48kHz stereo:
- Max delay: ~3.3 seconds
- Had to share buffers between effects
- Lots of circular buffer tricks

### Real-Time Constraints
At 48kHz, have 20.8μs per sample. With 120MHz clock, that's 2500 cycles. Sounds like a lot until you try to compute a reverb!

## Optimization Techniques

1. **Lookup tables** - Pre-compute trig functions
2. **Block processing** - Process 256 samples at once
3. **Ping-pong buffers** - DMA runs while processing
4. **Assembly optimization** - Critical inner loops

## User Interface

Simple but functional:
- 16x2 LCD display
- Rotary encoder for navigation
- 4 pots for parameter control
- Bypass switch for A/B comparison

## Results

It works! Can process stereo 48kHz audio with <5ms latency. Effects sound reasonably good (for a student project).

Professor's feedback: "Nice work, but your reverb sounds like a bathroom." Fair point - need better delay line tuning.

## What I Learned

1. **Real-time is hard** - Every cycle counts
2. **Fixed-point forces creativity** - Can't just throw floats at problems
3. **Psychoacoustics matter** - Small parameter changes have big perceptual effects
4. **DSP theory != implementation** - Textbook algorithms need major optimization

Next step: port this to the FPGA for parallel processing. Should be able to run 10x more effects!`,
    tags: ['dsp', 'audio', 'real-time', 'embedded'],
    readTime: '14 min',
  },
  {
    date: '2010-11-01',
    title: 'Building a CNC Machine: Sophomore\'s Ambition',
    summary: 'Attempting to build a CNC router from scratch. Because manually routing PCBs is tedious and I clearly need more projects.',
    content: `After hand-routing my 50th PCB trace, I decided to build a CNC machine. How hard could computer-controlled motors be? (Narrator: very hard)

## The Design

Target specifications:
- 12" x 12" x 3" work area
- 0.001" precision (optimistic!)
- Route PCBs and soft materials
- Total budget: $300

## Mechanical Design

### Frame Construction
Used 80/20 aluminum extrusion:
- Rigid and square
- Easy to modify
- Looks professional
- Only slightly over budget

### Linear Motion
Went with:
- 16mm linear rails (overkill but smooth)
- ACME lead screws (backlash issues...)
- NEMA 23 stepper motors
- Flexible couplings

## Electronics

### Motor Control
Built my own stepper drivers:
- L297/L298 chip set
- Microstepping for smoothness
- Current limiting for motor protection
- Lots of heat sinks

### Controller
Using GRBL on Arduino:
- G-code interpreter
- Motion planning
- Acceleration control
- USB interface

## Software Toolchain

1. **Design**: Eagle CAD for PCBs
2. **CAM**: pcb2gcode to generate toolpaths
3. **Control**: Universal Gcode Sender
4. **Post-processing**: Custom scripts for optimization

## First Tests

### The Good
- Motors turn!
- Follows G-code commands
- Can draw with a pen

### The Bad
- Backlash makes circles into ovals
- Vibration at certain speeds
- Z-axis loses steps under load
- Sounds like a robot death metal band

## Debugging Mechanical Systems

Harder than electronics:
- Can't use an oscilloscope on backlash
- Vibration couples everything
- Tolerances stack up
- Lubrication matters

## First PCB Attempt

Results:
- Traces: Wavy but complete
- Holes: More like ovals
- Board outline: Artistic interpretation
- Overall: "It's technically a PCB"

## Improvements Made

1. **Anti-backlash nuts** - Spring-loaded for consistency
2. **Microstepping** - 1/16 steps for smoothness
3. **Spindle upgrade** - Dremel to proper spindle
4. **Bed leveling** - Aluminum plate with adjustment screws

## Current Status

Can successfully mill:
- PCBs (with 0.01" tolerance)
- Acrylic panels
- Wood signs
- Foam for molds

Still can't mill:
- Anything requiring actual precision
- Metals (spindle not rigid enough)
- My frustration with mechanical engineering

## Lessons Learned

1. **Mechanical engineering is hard** - Respect to MechE students
2. **Rigidity is everything** - Flexible = inaccurate
3. **Buy precision parts** - Saving $20 costs hours
4. **Start with a kit** - Learn before designing

Total investment: $500 and 200 hours
PCBs milled successfully: 3
Pride in building it myself: Substantial

Next project: 3D printer. Because I clearly haven't learned my lesson about mechanical projects!`,
    tags: ['cnc', 'mechanical', 'pcb-milling', 'projects'],
    readTime: '15 min',
  },
  {
    date: '2010-11-15',
    title: 'Research Project: Acoustic Localization System',
    summary: 'First real research project - building an acoustic localization system for the hearing aid lab. Finding sound sources with millisecond precision.',
    content: `Started my first real research project in the DSP lab. Goal: build a system that can locate sound sources in 3D space using microphone arrays. Applications include hearing aids and surveillance systems.

## The Problem

Humans locate sounds using:
- Time difference between ears (ITD)
- Volume difference (ILD)
- Spectral cues from ear shape

Can we replicate this with microphones and DSP?

## System Architecture

### Hardware
- 8 MEMS microphones in 3D array
- Simultaneous sampling at 48kHz
- FPGA for data acquisition
- DSP for processing

### Microphone Array Geometry
Tried several configurations:
- Linear (simple but 1D only)
- Planar (2D localization)
- Spherical (3D but complex math)

Settled on cubic array - good 3D coverage and simple coordinates.

## Signal Processing Pipeline

### 1. Time Delay Estimation
Using Generalized Cross-Correlation (GCC-PHAT):
\`\`\`python
def gcc_phat(sig1, sig2):
    # FFT of both signals
    X1 = fft(sig1)
    X2 = fft(sig2)
    
    # Cross-power spectral density
    R = X1 * conj(X2)
    
    # PHAT weighting
    R = R / abs(R)
    
    # Inverse FFT gives correlation
    cc = real(ifft(R))
    
    # Peak location = time delay
    return argmax(cc)
\`\`\`

### 2. Multilateration
With time delays from multiple mic pairs:
- Set up hyperbolic equations
- Solve system (least squares)
- Get 3D position

Math gets ugly fast!

### 3. Beamforming
Once we know direction, enhance signal:
- Delay-and-sum beamforming
- Adaptive filters for noise suppression
- Up to 20dB improvement!

## Challenges Encountered

### Multipath Reflections
Sound bounces off walls, creating ghost sources. Solutions:
- First-arrival detection
- Statistical clustering
- Adaptive threshold

### Synchronization
Microsecond timing errors = meters of position error. Fixed with:
- Common clock to all ADCs
- Cable length calibration
- Temperature compensation

### Real-Time Processing
48kHz × 8 channels = 384k samples/second. Optimization required:
- FFT on FPGA
- Parallel correlation
- Efficient matrix operations

## Results

Current performance:
- Angular accuracy: ±5 degrees
- Distance accuracy: ±10% (1-5 meters)
- Update rate: 50 Hz
- Latency: <20ms

## Cool Discoveries

1. **You can "see" with sound** - Display shows sound sources like radar
2. **Materials matter** - Different surfaces create distinct reflection patterns
3. **Frequency matters** - High frequencies localize better but attenuate faster

## Applications Tested

- **Speaker tracking** - Follow person speaking in room
- **Noise source identification** - Find that annoying buzz
- **Acoustic camera** - Visualize sound field

## Professor's Feedback

"Good progress, but need more rigorous testing. Set up controlled experiments with known positions."

He's right - my testing was pretty ad-hoc.

## Next Steps

1. Improve multipath handling
2. Add machine learning for source classification
3. Miniaturize for hearing aid integration
4. Write paper for conference submission

This research stuff is addictive. Solving problems nobody has solved before!`,
    tags: ['research', 'dsp', 'acoustics', 'localization'],
    readTime: '16 min',
  },
  {
    date: '2010-12-01',
    title: 'End of Semester Crunch: Juggling Five Projects',
    summary: 'The last month of junior year fall - five major projects due, research deadlines, and trying to maintain sanity. This is engineering school.',
    content: `It's December, which means every professor decided their final project should be due the same week. Current status: drowning in a sea of breadboards and code.

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

Next semester: Take fewer classes. (Narrator: He would not take fewer classes.)`,
    tags: ['university', 'projects', 'time-management', 'engineering'],
    readTime: '13 min',
  },
  {
    date: '2010-12-20',
    title: 'Year in Review: From Novice to Engineer',
    summary: 'Reflecting on 2010 - a year of growth from hobbyist to serious engineering student. Projects completed, lessons learned, and setting ambitious goals for 2011.',
    content: `As 2010 comes to a close, I'm amazed at how much has changed. Started the year as a sophomore who could barely design a power supply. Ending it as a junior tackling DSP, control systems, and research projects.

## Projects Completed

### Spring Semester
- Function generator build
- Logic analyzer from Arduino
- First PCB designs
- Joined CubeSat team

### Summer
- Industrial motor controller internship
- Capacitor plague repair business
- FM transmitter adventures
- Started FPGA development board

### Fall Semester
- Real-time audio processor
- CNC machine build (mostly works!)
- Acoustic localization research
- Too many class projects

## Skills Acquired

### Technical Skills
- **PCB Design**: From breadboard to 6-layer boards
- **DSP**: FFTs, filters, and real-time processing
- **FPGA**: Verilog and high-speed design
- **RF**: No longer complete black magic
- **Control Theory**: Can balance things that shouldn't balance

### Soft Skills
- **Project Management**: Juggling multiple deadlines
- **Documentation**: Lab notebooks that others can read
- **Teamwork**: CubeSat team and study groups
- **Research**: Systematic investigation, not random hacking
- **Failure Recovery**: Everything breaks, fix it and move on

## Memorable Moments

1. **First successful PCB** - That feeling when it actually works
2. **Internship presentation** - Engineers taking me seriously
3. **Research breakthrough** - 3AM acoustic localization success
4. **CubeSat acceptance** - We're going to space!
5. **Dean's List** - Despite the project chaos

## Lessons Learned

### The Hard Way
- Always check polarity (RIP Arduino #3)
- Version control everything (lost a week's work)
- Sleep is not optional (hallucinated during finals)
- Buy quality tools first (cheap scope was expensive mistake)
- Ask for help sooner (professors actually want to help)

### The Good Way
- Document while building (future me is grateful)
- Test incrementally (big bang integration = big bang failure)
- Learn the math (handwaving doesn't work in junior year)
- Network actively (IEEE connections already paying off)
- Balance is crucial (burned out in November)

## By the Numbers

- Lines of code written: ~50,000
- PCBs designed: 12
- Components soldered: Thousands
- Magic smoke released: 7 times
- Coffee consumed: Immeasurable
- GPA maintained: 3.7 (somehow)

## Looking Ahead: 2011 Goals

### Academic
1. **Senior design project** - Something space-related
2. **Graduate school applications** - PhD or industry?
3. **Conference paper** - Submit acoustic research
4. **GRE preparation** - Ugh, standardized tests

### Technical
1. **Tape out a chip** - Use university's MOSIS access
2. **RF license** - Get amateur radio certification
3. **Machine learning** - Neural networks on FPGAs?
4. **Robotics** - Combine everything learned

### Personal
1. **Better work-life balance** - Burnout is real
2. **Industry internship** - Preferably aerospace
3. **Teaching** - TA for intro electronics
4. **Side business** - PCB design services?

## Predictions for 2011

Based on current trends:
- FPGAs will get cheaper and more accessible
- Tablets might become useful for engineering
- Electric vehicles will start going mainstream
- Private space companies will achieve orbit
- 3D printing will move beyond prototypes

## Final Thoughts

2010 was transformative. I'm no longer just building things for fun - I understand why they work. The combination of theory and practice finally clicked.

To future me reading this: Remember when a blinking LED was exciting? Now you're designing systems that talk to satellites. Keep that beginner's excitement while applying professional skills.

Here's to 2011 - may it be filled with successful projects, minimal magic smoke, and at least some sleep!`,
    tags: ['year-review', 'reflection', 'goals', 'personal'],
    readTime: '15 min',
  },
];

// Function to generate blog post files
async function generateBlogPosts() {
  console.log('🚀 Starting blog post generation for additional 2010 posts...\n');
  
  for (const post of posts2010Additional) {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Create slug from title
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Create directory path
    const dirPath = path.join(process.cwd(), 'app', 'blog', `${year}-${month}-${day}-${slug}`);
    
    // Create directory if it doesn't exist
    await fs.mkdir(dirPath, { recursive: true });
    
    // Create the page.tsx content
    const pageContent = `import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="${post.date}"
      title="${post.title.replace(/"/g, '\\"')}"
      summary="${post.summary.replace(/"/g, '\\"')}"
      content={\`${post.content.replace(/`/g, '\\`')}\`}
      tags={${JSON.stringify(post.tags)}}
      readTime="${post.readTime}"
    />
  );
}

export function generateMetadata() {
  return {
    title: "${post.title.replace(/"/g, '\\"')} - Michael D'Angelo",
    description: "${post.summary.replace(/"/g, '\\"')}",
  };
}`;

    // Write the file
    const filePath = path.join(dirPath, 'page.tsx');
    await fs.writeFile(filePath, pageContent, 'utf8');
    
    console.log(`✅ Created: ${post.title}`);
  }
  
  console.log(`\n📝 Summary:`);
  console.log(`   Created: ${posts2010Additional.length} posts`);
  console.log(`   Year: 2010`);
  console.log(`   Topics: PCB etching, FFT, internship, RF, capacitor plague, FPGA development`);
}

// Run the generator
generateBlogPosts().catch(console.error);