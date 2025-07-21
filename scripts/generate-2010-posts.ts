import fs from 'fs';
import path from 'path';

interface BlogPost {
  date: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  readTime: string;
}

const posts2010: BlogPost[] = [
  {
    date: '2010-01-10',
    title: 'New Year, New Projects: 2010 Technical Goals',
    summary: 'Setting ambitious technical goals for sophomore year - from joining the CubeSat team to mastering PCB design.',
    content: `New year, new decade, new challenges. As I start my second semester at UB, I'm setting some ambitious technical goals for 2010. Here's what I want to accomplish and why.

## Reflecting on 2009

Last semester was about survival - learning the basics, finding my footing, building confidence. I went from barely knowing Ohm's Law to building digital clocks and power supplies. Good start, but now it's time to level up.

## Technical Goals for 2010

### 1. Join the UB Nanosatellite Team
The university has a CubeSat program building actual satellites. ACTUAL SATELLITES. That go to SPACE. I need to be part of this.

Requirements to join:
- GPA above 3.0 (check!)
- Complete application project
- Interview with current team
- Commit 10+ hours/week

I'm starting the application project this week - a power distribution board for their test platform.

### 2. Master PCB Design
Breadboards are great for prototypes, but real engineering happens on PCBs. Goals:
- Learn Eagle CAD (industry standard)
- Design and fabricate 5 PCBs
- Move from through-hole to surface mount
- Understand design for manufacturability

First project: A proper Arduino shield instead of breadboard mess.

### 3. Get Amateur Radio License
Why? 
- CubeSat team requires it (satellite communications)
- Access to more spectrum for projects
- Join the amateur radio community
- Emergency preparedness

Studying for Technician class exam in February.

### 4. Build Serious Test Equipment
Can't always rely on school lab. Want to build:
- Function generator (analog + digital)
- Logic analyzer (FPGA-based)
- LCR meter
- Improved power supply (dual rail, current limiting)

These are complex projects that'll push my skills.

### 5. Learn a Real Programming Language
Arduino is training wheels. Time to learn:
- C (properly, not Arduino C++)
- Python (for data analysis)
- MATLAB (required for signals class anyway)
- Maybe Verilog (FPGAs are the future)

### 6. Complete One Major Project Per Month
January: GPS data logger
February: Spectrum analyzer
March: SDR receiver
April: CubeSat subsystem
May: Wireless sensor network
June-August: Summer internship projects
September: Advanced microcontroller project
October: RF transmitter (legal!)
November: FPGA development board
December: Year-end mega project

### 7. Document Everything Better
This blog is good, but I need:
- Proper lab notebook
- GitHub for code (just learned about version control!)
- Video documentation
- Technical write-ups for portfolio

## Academic Goals

### Course Load
Spring 2010:
- EE 202: Circuit Analysis II (AC circuits, here we come)
- EE 205: Signals and Systems
- CSE 241: Digital Systems
- MTH 306: Differential Equations
- PHY 207: General Physics III

This is where it gets real. No more "intro" classes.

### Target: Dean's List
3.5+ GPA. Ambitious but achievable if I:
- Start assignments early
- Form study groups day 1
- Attend every office hour
- Actually read textbooks BEFORE lecture

## Skill Development

### Hard Skills
- SMD soldering (those 0603 components aren't soldering themselves)
- Oscilloscope mastery (all those knobs have purposes)
- Network analysis (S-parameters, Smith charts)
- Power analysis (battery life calculations)
- EMC basics (stop creating interference)

### Soft Skills
- Technical presentation (conference talks?)
- Team leadership (aiming for IEEE officer position)
- Project management (Gantt charts, here I come)
- Technical writing (papers, not just blogs)

## Resources and Budget

### Financial Reality
College student budget: ~$100/month for projects

Strategy:
- Salvage everything possible
- Group buys with IEEE chapter
- Apply for project grants
- Summer internship savings

### Time Management
Credit hours: 17
CubeSat: 10 hrs/week
IEEE: 5 hrs/week
Projects: 10 hrs/week
Sleep: ...what's that?

It's aggressive, but sophomore year is for pushing limits.

## Why These Goals?

Industry is moving fast. By graduation (2012), I need:
- Real project experience
- Technical depth
- Leadership experience
- Professional network
- Portfolio of work

These goals position me for competitive internships and eventually full-time positions.

## Accountability

Publishing these goals publicly for accountability. Will post monthly updates on progress. 

Failed goals are learning experiences. Achieved goals are stepping stones.

## The Bigger Picture

2010 is about transformation:
- From student to engineer
- From follower to leader  
- From consumer to creator
- From local to global thinking

Space hardware? Radio communications? Advanced test equipment? Sophomore me is dreaming big.

But that's the point. Dream big, work hard, build cool stuff.

Here's to 2010 - the year I level up from electronics hobbyist to serious engineer.

*First goal: Submit CubeSat application by January 31st. If you're reading this after that date, check later posts to see if I made it!*`,
    tags: ['goals', 'personal', 'planning', 'new-year'],
    readTime: '8 min',
  },
  {
    date: '2010-01-15',
    title: 'Understanding Digital Logic: From Gates to Systems',
    summary: 'Deep dive into digital design - moving beyond basic gates to understanding complex digital systems and state machines.',
    content: `Started Digital Systems class this week, and it's like the scales fell from my eyes. We're moving beyond "this is an AND gate" to "this is how computers actually work." Mind = blown.

## The Hierarchy of Digital Design

Professor started with this pyramid:
- Transistors (bottom)
- Gates
- Combinational Logic
- Sequential Logic
- Finite State Machines
- Processors (top)

Last semester: Bottom two levels
This semester: ALL THE LEVELS

## Combinational vs Sequential: The Key Distinction

### Combinational Logic
Output depends only on current inputs. No memory, no history.

Examples:
- Adders
- Multiplexers
- Decoders
- ALUs

Built my first 4-bit adder this week. Just 20 gates to add two numbers. Then realized my calculator has millions of these. Perspective.

### Sequential Logic
Output depends on inputs AND previous state. This is where magic happens.

The revelation: Add memory to combinational logic = computer.

Basic building block: The flip-flop
- Stores one bit
- Changes on clock edge
- Foundation of all memory

## State Machines: How Computers Think

This week's lab: Design a vending machine controller.

States:
- IDLE: Waiting for money
- FIVE: 5 cents deposited
- TEN: 10 cents deposited
- FIFTEEN: 15 cents deposited
- VEND: Dispense product

My implementation:
\`\`\`verilog
always @(posedge clk) begin
    case (current_state)
        IDLE: if (nickel) next_state = FIVE;
              else if (dime) next_state = TEN;
        FIVE: if (nickel) next_state = TEN;
              else if (dime) next_state = FIFTEEN;
        // ... etc
    endcase
end
\`\`\`

First time writing Verilog. It's weird but powerful.

## The Clock: Heartbeat of Digital Systems

Everything synchronizes to the clock. Period.

Key insights:
- Faster clock ≠ always better (power consumption)
- Setup and hold times are critical
- Clock skew can break everything
- Metastability is real and terrifying

Built a 1MHz clock generator with 555 timer. Watched it on scope. That regular pulse controls EVERYTHING.

## Timing Diagrams: The Language of Digital

Learning to read timing diagrams is like learning a new language. But once you can read them, you can debug anything.

Example from this week's homework:
\`\`\`
CLK  : _|‾|_|‾|_|‾|_|‾|_
D    : ____|‾‾‾‾‾|_____
Q    : ______|‾‾‾‾‾|___
\`\`\`

D changes, but Q waits for clock edge. Sequential logic in action!

## Real Implementation: FPGA Introduction

Holy crap. FPGAs are magic.
- Reconfigurable hardware
- Thousands of logic elements
- Build any digital circuit
- Change functionality in seconds

Got to play with a Spartan-3 board. Implemented my vending machine. IT WORKED. 

The power: I designed hardware, not software. But changed it like software. Brain hurts (in a good way).

## Practical Project: Binary Calculator

Weekend project: 4-bit binary calculator
- Two 4-bit inputs (DIP switches)
- Function select (ADD, SUB, AND, OR)
- 5-bit output (LEDs)
- All combinational logic

Used 74-series chips:
- 74LS283: 4-bit adder
- 74LS86: XOR gates (for subtraction)
- 74LS08: AND gates
- 74LS32: OR gates
- 74LS157: Multiplexer (select function)

Three breadboards. 200+ wires. 8 hours debugging. Worth it.

## The Abstraction Layer Revelation

Each level abstracts the complexity below:
- Transistors: Analog beasts tamed into digital
- Gates: Hide transistor complexity
- Combinational: Hide gate complexity
- Sequential: Hide timing complexity
- FSMs: Hide state complexity
- Processors: Hide everything

Engineering is abstraction. Mind = blown (again).

## Common Pitfalls I Hit

1. **Race Conditions**: When signals race through different paths
   - Solution: Synchronize everything to clock

2. **Glitches**: Brief unwanted outputs during transitions
   - Solution: Register outputs

3. **Fan-out Limits**: One output driving too many inputs
   - Solution: Buffer gates

4. **Timing Violations**: Signals changing too close to clock
   - Solution: Careful design, lots of simulation

## Tools I'm Learning

- **Logisim**: Circuit simulation (great for learning)
- **Verilog**: Hardware description language
- **ModelSim**: Industry-standard simulator
- **Xilinx ISE**: FPGA development

Steep learning curve, but powerful tools.

## The "Aha!" Moments

1. **Multiplication is just repeated addition**: Built 4-bit multiplier, finally understood
2. **Memory is just feedback**: Connect output to input = storage
3. **CPUs are just big state machines**: Fetch, decode, execute, repeat
4. **Everything is binary**: Even analog at the bottom

## Next Projects

1. **8-bit CPU**: Design simple processor from scratch
2. **VGA Controller**: Generate video signals
3. **Digital Oscilloscope**: Sample and display waveforms
4. **Frequency Counter**: Measure unknown signals

## Why This Matters

Every electronic device has digital logic:
- Your phone: Billions of gates
- Your car: Dozens of microcontrollers
- Your microwave: Simple state machine
- Everything smart: Digital at its core

Understanding this layer is crucial.

## Study Tips for Digital Logic

1. **Draw everything**: Can't visualize? Can't understand
2. **Build physically**: Theory + practice = understanding  
3. **Simulate before building**: Save time and components
4. **Think in states**: What state am I in? Where next?
5. **Master timing**: When matters as much as what

## The Bigger Picture

Six months ago: "Computers are magic"
Now: "Computers are complex but understandable"
Future: "I can build a computer"

This class is the bridge from electronics to computer engineering. Everything connects.

To future students: This is where it gets hard but also where it gets amazing. Push through. The view from the top is worth it.

*Currently debugging my calculator. Why does 2+2=5? Check next post for the answer (spoiler: timing issue).*`,
    tags: ['digital-logic', 'education', 'fpga', 'verilog'],
    readTime: '10 min',
  },
  {
    date: '2010-01-20',
    title: 'Oscilloscope Deep Dive: Mastering Your Most Important Tool',
    summary: 'Everything I\'ve learned about oscilloscopes - from basic operation to advanced triggering. Your scope is your eyes into the electronic world.',
    content: `After a semester of randomly turning knobs and hoping for the best, I decided to properly master the oscilloscope. Here's everything I've learned about this essential tool.

## Why Oscilloscopes Matter

You can't debug what you can't see. Multimeters show averages. Scopes show truth.

Real example from last week:
- Multimeter: "5V DC, looks good!"
- Oscilloscope: "5V with 2V of 60Hz ripple and random spikes"

One tool lies. One reveals.

## The Basics I Wish I Knew Earlier

### What You're Actually Seeing
The screen shows voltage (vertical) over time (horizontal). That's it. Everything else is just controlling these two axes.

### Critical Controls
1. **Vertical (Voltage)**
   - Volts/division: How much voltage each square represents
   - Position: Moves trace up/down
   - Coupling: AC/DC/GND (more on this later)

2. **Horizontal (Time)**  
   - Time/division: How much time each square represents
   - Position: Moves trace left/right

3. **Trigger**
   - Level: At what voltage to start drawing
   - Slope: Rising or falling edge
   - Mode: Auto/Normal/Single

Master these three, master the scope.

## Coupling: The Most Misunderstood Setting

### DC Coupling
Shows everything - DC level + AC components.
Use for: Most measurements, logic levels, power supplies

### AC Coupling
Blocks DC, shows only AC components.
Use for: Ripple on power supplies, audio signals, small signals on large DC offset

### Ground
Shows 0V reference line.
Use for: Setting baseline, checking probe compensation

Example that saved my project:
Debugging Arduino communication. DC coupling showed signal sitting at 5V. Switched to AC coupling, saw tiny 100mV data pulses I was missing.

## Triggering: The Magic That Freezes Time

Without proper triggering, waveforms dance around uselessly.

### Edge Triggering
Most common. Triggers when signal crosses voltage threshold.

My goto settings:
- Rising edge for digital signals
- Level at 50% of signal amplitude
- Normal mode for stable signals

### Advanced Triggering I Actually Use

**Pulse Width Triggering**: Find glitches
Set to trigger on pulses shorter/longer than expected. Found a 10ns glitch crashing my microcontroller.

**Video Triggering**: For video signals
Built a Pong game. Video trigger locked onto sync pulses perfectly.

## Measurements: Beyond Eyeballing

### Automatic Measurements
Modern scopes measure everything automatically:
- Frequency
- Period  
- Amplitude
- Rise/fall time
- Duty cycle

But understanding manual measurement is crucial.

### Manual Measurement Technique
1. Count divisions
2. Multiply by scale
3. Account for probe attenuation

Example: 3.5 divisions × 2V/div × 10× probe = 70V

### Cursor Measurements
Best of both worlds. Position cursors, scope does the math.

Pro tip: Use cursors for time measurements. Way more accurate than counting squares.

## Probes: The Unsung Heroes

### ×1 Probes
- No attenuation
- High capacitance (~100pF)
- Use below 1MHz

### ×10 Probes  
- 10:1 attenuation
- Low capacitance (~15pF)
- Use for most measurements

### Probe Compensation
ALWAYS compensate probes before measuring. 

How:
1. Connect to cal output
2. Adjust trimmer until square
3. Under-compensated: rounded corners
4. Over-compensated: overshoot

Spent 2 hours debugging "circuit problems" that were just uncompensated probes.

## Real Measurements I Do Weekly

### Digital Signals
Settings: 
- 2V/div (for 5V logic)
- Time base depends on frequency
- Trigger on rising edge at 2.5V

Look for:
- Clean edges (no ringing)
- Proper voltage levels
- Timing relationships

### Power Supply Ripple
Settings:
- AC coupling
- 20mV/div or less
- Trigger on line frequency (60Hz)

Critical: Use short ground lead! Long ground = antenna = fake noise.

### Clock Signals
Settings:
- 50% trigger level
- Measure rise time
- Check duty cycle
- Look for jitter

Found 20ns of jitter killing my SPI communication. Scope revealed, fixed with better layout.

## Advanced Techniques That Saved Me

### XY Mode
Plots one channel vs another instead of vs time.

Used for:
- Phase measurements (Lissajous patterns)
- Hysteresis loops
- Component testing

Built component tester: Apply sine wave, plot V vs I, see component behavior.

### FFT (Frequency Domain)
See frequency content of signals.

Real use case: Debugging power supply noise
Time domain: Messy noise
FFT: Clear spike at 150kHz - switching frequency!

### Persistence Mode
Shows signal history, reveals intermittent issues.

Found occasional glitch in I2C communication. Normal trigger missed it. Persistence showed it happening every ~1000 transactions.

## Scope Limitations I Learned The Hard Way

### Bandwidth
Scope bandwidth = highest frequency accurately measured.

Rule of thumb: Bandwidth should be 5× highest frequency.

Learned when 20MHz scope showed square wave as sine wave. Signal had harmonics beyond scope bandwidth.

### Sample Rate  
Digital scopes sample signals. Too slow = aliasing.

Need 10+ samples per period for accurate reconstruction.

### Memory Depth
Determines how long you can capture at high sample rates.

Calculation: Time captured = Memory depth ÷ Sample rate

## My Scope Setup Evolution

### Freshman Year
- Ancient analog scope
- One channel at a time
- Confused by everything

### Now (Sophomore)
- Digital scope with FFT
- Using both channels effectively
- Triggering properly
- Actually understanding what I see

### Dream Setup
- 4 channels
- 100MHz+ bandwidth  
- Deep memory
- Serial decode
- Current probes

## Common Mistakes I Made (So You Don't Have To)

1. **Forgetting probe attenuation**: Measured 0.5V, was actually 5V
2. **Ground loops**: Connected scope ground to circuit ground at multiple points
3. **Loading the circuit**: ×1 probe on high-impedance circuit
4. **AC coupling confusion**: "Where did my DC level go?"
5. **Bad triggering**: Unstable display, thought circuit was broken

## Practical Exercises That Built My Skills

1. **Measure wall outlet** (CAREFULLY! Use proper probe ratings)
2. **Characterize 555 timer output**
3. **Decode serial communication by hand**
4. **Measure switch bounce**
5. **Find noise sources in circuits**

## Tips From Hard-Won Experience

1. **Always start with known signal**: Calibration output confirms scope works
2. **Think about what you expect**: Before measuring, predict the signal
3. **Use the right ground point**: Closest to signal, shortest lead
4. **Save screenshots**: Documentation for later
5. **Learn your scope's features**: Read the manual, seriously

## Resources That Actually Helped

- Tektronix "XYZs of Oscilloscopes" (free PDF)
- W2AEW YouTube channel (scope tutorials)
- Lab TA who stayed late explaining triggering

## The Payoff

Proper scope usage has:
- Saved countless hours debugging
- Revealed problems I didn't know existed
- Taught me how circuits really behave
- Made me confident in my measurements

## Final Wisdom

The oscilloscope is your window into the electronic world. Blurry window = blurry understanding.

Time invested in mastering your scope pays back 100×.

To beginners: Don't be intimidated. Start with one knob at a time.

To everyone: Respect the probe compensation.

*Next week: Building a function generator to create signals for my scope to measure. The circle of test equipment life continues!*`,
    tags: ['test-equipment', 'oscilloscope', 'tutorial', 'measurement'],
    readTime: '12 min',
  },
  {
    date: '2010-01-25',
    title: 'Building a Function Generator for Under $50',
    summary: 'Tired of borrowing the lab\'s function generator, I built my own. Here\'s how to build a versatile signal source on a student budget.',
    content: `The lab has three function generators. The class has 30 students. You do the math. Time to build my own! Here's how I created a surprisingly capable function generator for the price of a textbook.

## Why Build Your Own?

Besides availability issues:
- Learn how signal generation actually works
- Customize for your specific needs
- Save money (commercial ones are $300+)
- Because you can

## Design Requirements

What I needed:
- Sine, square, and triangle waves
- 1Hz to 1MHz frequency range
- Adjustable amplitude (0-10V)
- DC offset control
- TTL output for logic circuits
- Total budget: $50

## The Design Evolution

### Attempt 1: 555 Timer (Failed)
First thought: 555 timer does square waves, just filter for sine!

Reality: 
- Frequency changes = filter needs change
- Limited frequency range
- Terrible sine waves

Lesson: 555s are great for many things, not this.

### Attempt 2: Wien Bridge Oscillator (Partially Worked)
Classic analog approach using op-amp.

Pros:
- Beautiful sine waves
- Simple circuit

Cons:
- Frequency changes require dual ganged pot (expensive)
- Limited range without switching components
- No other waveforms

Good learning experience, but not practical.

### Attempt 3: XR2206 Function Generator IC (Success!)
Found this amazing chip that does everything.

The XR2206:
- Sine, square, triangle outputs
- 0.01Hz to 1MHz range
- Single resistor frequency control
- Internal everything

Exactly what I needed!

## The Build

### Core Circuit
\`\`\`
XR2206 connections:
- Timing capacitor: Selectable (1nF to 10μF)
- Timing resistor: 10k pot for fine control
- Amplitude control: 50k pot
- DC offset: Another 50k pot
- Output buffer: TL072 op-amp
\`\`\`

### Frequency Range Switching
Used a rotary switch to select timing capacitors:
- 10μF: 0.01Hz - 10Hz
- 1μF: 0.1Hz - 100Hz  
- 100nF: 1Hz - 1kHz
- 10nF: 10Hz - 10kHz
- 1nF: 100Hz - 100kHz
- 100pF: 1kHz - 1MHz

Six ranges with 1000:1 adjustment each = huge coverage!

### Output Stage
Added TL072 dual op-amp:
- First stage: Buffer and amplitude control
- Second stage: DC offset addition
- Protection: 1kΩ series resistor
- BNC connector for proper connection

### TTL Output
Bonus feature! Used comparator (LM311) on square wave:
- Always 0-5V output
- Perfect for digital circuits
- Separate BNC connector

### Power Supply
Needed ±12V for op-amps. Solutions considered:
1. Wall wart + DC-DC converter (expensive)
2. Batteries (annoying)
3. USB + boost converters (chose this!)

Used two MT3608 boost modules:
- USB in → +12V and -12V out
- Added linear regulators for clean power
- Works from any USB port!

## The Enclosure

Found aluminum project box at surplus store: $5

Layout:
- Front: Frequency/amplitude/offset knobs, range switch
- Back: Power input, main output, TTL output
- Top: Waveform selector switch

Drilling aluminum tip: Step bits are your friend. Regular bits grab and tear.

## Calibration Adventure

### Frequency Calibration
Used frequency counter (that I built last month!) to calibrate.

Process:
1. Set to each range
2. Adjust trimmer caps
3. Mark dial with actual frequencies

Achieved ±2% accuracy across range. Good enough!

### Amplitude Calibration  
Borrowed scope from lab (ironic, I know).

Marked knob for common values:
- 1V, 2V, 5V, 10V peak-to-peak

### Distortion Trimming
XR2206 has distortion adjustment for sine waves.

Before adjustment: 5% THD
After adjustment: 0.5% THD

Not audio-grade, but fine for testing.

## Cost Breakdown

- XR2206 IC: $8 (eBay)
- TL072 op-amp: $1
- LM311 comparator: $1
- MT3608 modules (2): $4
- Capacitors (kit): $5
- Resistors/pots: $8
- BNC connectors (3): $6
- Enclosure: $5
- Switch/knobs: $7
- Misc (wire, PCB): $5

Total: $50 exactly!

## Performance Tests

### Frequency Range
Spec: 1Hz - 1MHz
Actual: 0.1Hz - 1.2MHz
Overdelivered!

### Rise Time
Square wave: <50ns
Good enough for most digital work.

### Amplitude Stability
±0.1dB from 10Hz to 100kHz
Rolls off above that, but still usable.

## Real-World Use Cases

Already used it for:
1. **Testing audio amp**: 1kHz sine wave
2. **Clock for digital project**: 10kHz square wave
3. **Filter response testing**: Swept 10Hz to 10kHz
4. **PWM simulation**: Variable duty cycle square wave
5. **LED fading**: 0.5Hz triangle wave

## Lessons Learned

### What Went Right
- XR2206 is amazing for the price
- USB power was brilliant choice
- Range switching gives huge flexibility
- TTL output super useful

### What I'd Change
- Add frequency counter display
- Include sweep function
- Better knobs (these feel cheap)
- Silk screen labels (hand written = ugly)

## Comparing to Commercial Units

Lab's HP 33120A:
- Frequency accuracy: 0.001% (mine: 2%)
- More waveforms (arbitrary, noise)
- GPIB interface
- Price: $1500

For student use, mine does 90% of what the HP does at 3% of the cost.

## Future Upgrades

Planning version 2:
- Microcontroller for digital control
- LCD showing frequency/amplitude
- Sweep and modulation functions
- Maybe DDS chip for better accuracy

But for now, this works great!

## Build Tips

If you build one:
1. **Use IC socket**: XR2206 is expensive to kill
2. **Good capacitors**: Timing caps affect stability
3. **Shield sensitive areas**: 1MHz signals radiate
4. **Add test points**: Debugging made easier
5. **Heat sink regulators**: They get warm

## The Best Part

No more waiting for lab equipment! Need a signal at 2AM? Got it. Want to test something at home? No problem.

## Educational Value

Building this taught:
- Analog circuit design
- Power supply design
- Enclosure fabrication
- Calibration techniques
- Cost/performance tradeoffs

Worth way more than $50 in education.

## Resources

- XR2206 datasheet (incredibly detailed)
- Elliott Sound Products function gen article
- EEVblog forum (answered my questions)

## Final Thoughts

Is it perfect? No. 
Is it good enough? Absolutely.
Did I learn a ton? Definitely.

Sometimes "good enough" is perfect for a student.

Next project: Digital oscilloscope to go with it. Complete test bench for under $100!

*Update: Just helped three classmates build their own. Starting a cottage industry here...*`,
    tags: ['test-equipment', 'function-generator', 'diy', 'analog'],
    readTime: '11 min',
  },
  {
    date: '2010-02-01',
    title: 'Power Supply Design: Linear vs Switching',
    summary: 'Built both linear and switching regulators this week. Here\'s a practical comparison from someone who melted a heat sink learning the difference.',
    content: `This week's power electronics lab: Build 5V supplies using both linear and switching regulators. Same spec, vastly different results. Here's what I learned the hard way.

## The Challenge

Design requirements:
- Input: 12V battery
- Output: 5V @ 2A
- Ripple: <50mV
- Efficiency: "as high as possible"

Two teams: Linear vs Switching. I was on Team Linear. Spoiler: We lost on efficiency.

## Linear Regulator: The Simple Approach

### The Design
Used the classic LM7805 regulator.

Circuit complexity: 
- Input capacitor
- LM7805
- Output capacitor
- Done

Total parts: 3 (plus heat sink... big heat sink)

### The Build
Breadboarded in 5 minutes. Working in 10. "This is easy!" I thought.

Then we measured efficiency.

### The Brutal Math
- Input: 12V @ 0.85A = 10.2W
- Output: 5V @ 2A = 10W
- Efficiency: 10W/10.2W = 98%!

Wait, that can't be right...

Oh. Load was only drawing 0.85A, not 2A. Let's force 2A load:

- Input: 12V @ 2A = 24W
- Output: 5V @ 2A = 10W
- Efficiency: 10W/24W = 41.7%

Where's the other 14W going? Touch the heat sink. OW! That's where.

### Heat Sink Calculations
Power dissipation: (12V - 5V) × 2A = 14W

LM7805 thermal resistance: 5°C/W junction-to-case
Required heat sink: Less than 3°C/W to keep under 100°C

That's a BIG heat sink. Like, computer CPU cooler big.

### Linear Regulator Reality

Pros:
- Dead simple
- Low noise (measured <5mV ripple)
- No EMI
- Cheap ($1 for regulator)
- Fast transient response

Cons:
- Terrible efficiency at large voltage drops
- Massive heat generation
- Big heat sink = not cheap
- Size and weight

## Switching Regulator: The Efficient Approach

Watched Team Switching build theirs. Way more complex.

### Their Design
Used MC34063 switching controller (old but educational).

Parts list:
- MC34063 IC
- Inductor (big one)
- Schottky diode
- Timing capacitor
- Feedback resistors
- Input/output capacitors
- Current sense resistor

Total parts: ~15

### The Theory (Simplified)
Instead of burning excess power as heat, switching regulators:
1. Turn on, connect input to output through inductor
2. Current builds in inductor
3. Turn off, inductor current continues through diode
4. Repeat at high frequency (52kHz in their case)
5. Output capacitor smooths to DC

It's like filling a bucket with rapid small pours instead of continuous flow.

### Their Results
After 3 hours of debugging (vs our 10 minutes):

- Input: 12V @ 0.92A = 11W
- Output: 5V @ 2A = 10W
- Efficiency: 10W/11W = 91%!

But:
- Ripple: 125mV (worse than spec)
- EMI: Oscilloscope probe picked up noise 6 inches away
- Cost: ~$5 in parts

### The Smell of Victory (and Burning Inductors)
First attempt: Undersized inductor. Magic smoke at 1.5A load.

Key lesson: Inductor saturation current matters! When inductors saturate:
- Inductance drops
- Current spikes
- Things burn

Second inductor: 3A rated. Worked perfectly.

## Head-to-Head Comparison

Built both side by side for testing:

### Efficiency Across Loads
Load: 0.1A
- Linear: 41% (same as 2A!)
- Switching: 78%

Load: 1A  
- Linear: 41%
- Switching: 89%

Load: 2A
- Linear: 41%
- Switching: 91%

Linear efficiency depends on voltage drop, not load. Mind = blown.

### Transient Response
Applied step load (0.5A to 1.5A):

Linear: 10μs recovery, 20mV dip
Switching: 200μs recovery, 150mV dip

Linear wins for fast loads.

### Noise Comparison
Spectrum analyzer reveals all:

Linear: Noise floor (-80dBm)
Switching: Spikes at 52kHz and harmonics

For sensitive analog? Linear. For digital? Switching is fine.

### Temperature After 1 Hour
Linear: Heat sink at 95°C (ouch)
Switching: Inductor at 45°C (warm)

No contest on thermal management.

## When to Use What

### Use Linear When:
- Low current (<500mA)
- Small voltage drop (Vin - Vout < 3V)
- Noise sensitive (audio, RF, precision analog)
- Simplicity matters
- Cost sensitive at low power

### Use Switching When:
- High current
- Large voltage drop  
- Battery powered (efficiency = battery life)
- Size/weight matters
- Heat is a problem

## Real Design Example

Designing power for my CubeSat project:

Input: 7.4V battery
Outputs needed:
- 5V @ 500mA (digital)
- 3.3V @ 1A (processor)
- ±12V @ 50mA (analog)

My solution:
- 5V: Switching (efficiency matters)
- 3.3V: Switching (from 5V rail)
- ±12V: Linear (low current, low noise needed)

Best of both worlds!

## Modern Solutions

Discovered integrated modules:
- Buck modules: $2 on eBay, 3A, tiny
- No external inductor needed
- Just add capacitors

But you learn nothing using modules. Build discretely first, use modules later.

## Lab Disasters and Lessons

### Team Linear's Melted Breadboard
Forgot heat sink initially. LM7805 got so hot it melted breadboard plastic. Lesson: Thermal protection exists for a reason.

### Team Switching's Oscillation
Their first attempt oscillated at 3MHz instead of 52kHz. Wrong inductor value. Scope showed beautiful sine wave... at wrong frequency.

### My Blown Capacitor  
Put electrolytic backwards on switching output. POP! Aluminum confetti everywhere. Lesson: Polarity matters, even "after" the diode.

## Practical Tips

### For Linear Designs:
1. Calculate heat dissipation FIRST
2. Use TO-220 package for >1W dissipation
3. Thermal compound on heat sink
4. Add protection diodes
5. Parallel regulators for current sharing

### For Switching Designs:
1. Layout is CRITICAL (short, wide traces)
2. Use recommended inductor values
3. Schottky diodes only (fast recovery)
4. Keep feedback path away from noise
5. Add input filter to prevent conducted EMI

## The Future is Switching

New switching tech is amazing:
- Synchronous rectification (95%+ efficiency)
- GaN FETs (smaller, faster)
- Digital control (programmable output)
- Multi-phase (ripple cancellation)

But fundamentals remain: Energy storage in magnetics vs dissipation as heat.

## Cost Analysis (Student Budget Edition)

5V @ 2A supply total cost:
- Linear: $1 (IC) + $8 (heat sink) = $9
- Switching: $5 (parts) + $0 (no heat sink) = $5

Switching wins on total system cost!

## What This Taught Me

1. **No perfect solution**: Always tradeoffs
2. **Efficiency has a cost**: Complexity
3. **Theory vs practice**: Parasitic elements matter
4. **Thermal is crucial**: Heat kills electronics
5. **Start simple**: Linear first, then switching

## Next Steps

Building a bench supply with both:
- Switching pre-regulator (efficiency)
- Linear post-regulator (low noise)
- Best of both worlds

## Final Thoughts

A year ago, "power supply" meant wall wart. Now I understand the engineering inside.

Both topologies have their place. Smart engineers know when to use which.

Also, always use a heat sink. Burned fingers teach unforgettable lessons.

*Currently designing switching supply for robot project. Goal: 90% efficiency. Will document the inevitable magic smoke releases.*`,
    tags: ['power-supply', 'linear', 'switching', 'efficiency'],
    readTime: '12 min',
  },
  {
    date: '2010-02-05',
    title: 'Satellite Communications 101: Getting Signal from Space',
    summary: 'Preparing for the CubeSat team interview by learning about satellite communications. How do you talk to something flying 400km overhead at 7.5km/s?',
    content: `CubeSat team interview is next week. They'll definitely ask about satellite communications. Time to learn how we'll talk to our bird once it's in orbit. Turns out, it's harder than "point antenna at sky."

## The Basic Challenge

Our CubeSat will be:
- 400km above Earth
- Moving at 7.5 km/s
- Visible for ~10 minutes per pass
- Transmitting with 1 watt (max)
- Size of a Rubik's cube

How do you communicate with that?!

## Radio Fundamentals for Space

### The Link Budget
This equation rules everything:

Received Power = Transmitted Power + Gains - Losses

In dB:
Pr = Pt + Gt + Gr - Lp - La - Lmisc

Where:
- Pt = Transmit power
- Gt = Transmit antenna gain
- Gr = Receive antenna gain  
- Lp = Path loss (big one)
- La = Atmospheric loss
- Lmisc = Cable loss, pointing loss, etc.

### Path Loss: The Enemy
Free space path loss (FSPL):
Lp = 20×log10(d) + 20×log10(f) + 32.45

For our CubeSat:
- Distance: 400-2000km (depends on elevation)
- Frequency: 437 MHz (70cm amateur band)
- Path loss: 125-140 dB

That's a signal reduction of 10^14. Brutal.

## Frequency Bands for CubeSats

### VHF (144-148 MHz)
Pros:
- Less path loss
- Simple antennas
- Penetrates atmosphere well

Cons:
- Large antennas on spacecraft
- Limited bandwidth
- Crowded band

### UHF (430-440 MHz)
Most popular for CubeSats!

Pros:
- Good compromise size/performance
- Lots of amateur equipment
- Reasonable path loss

Cons:
- Still needs directional ground antenna
- Some atmospheric noise

### S-Band (2.4 GHz)
For high data rates.

Pros:
- More bandwidth available
- Smaller antennas

Cons:
- Higher path loss
- Needs precise pointing
- More expensive equipment

## Modulation Schemes

### CW (Morse Code)
Simplest possible. Our beacon will use this.
- Very narrow bandwidth
- Works with weak signals
- Easy to decode by ear

### FSK (Frequency Shift Keying)
Digital data transmission.
- Shifts between two frequencies for 0 and 1
- Good weak signal performance
- Standard packet radio protocols

### BPSK/QPSK (Phase Shift Keying)
For higher data rates.
- More bits per symbol
- Requires better signal-to-noise ratio
- What pros use

## The Doppler Effect

Satellite moving = frequency shifts!

Maximum Doppler shift:
Δf = ±(v/c) × f

For LEO at 437 MHz:
- Max shift: ±10 kHz
- Rate of change: 60 Hz/second at closest approach

Must constantly retune radio during pass. Fun!

## Ground Station Design

What we need to build:

### Antennas
Researched options:

1. **Yagi-Uda (Beam)**
   - Gain: 10-15 dBi
   - Directional (needs pointing)
   - Cheap to build

2. **Crossed Yagi (Circular Polarization)**
   - Handles satellite tumbling
   - 3dB loss but worth it
   - More complex

3. **Helical**
   - Natural circular polarization
   - Good gain (15 dBi)
   - Narrow beamwidth

We'll probably use crossed Yagi.

### Antenna Tracking
Options:
1. Manual (cheapest, exhausting)
2. Azimuth/Elevation rotator ($500+)
3. Fixed antenna with wide beam (less gain)

Starting manual, dreaming of automatic.

### Radio Equipment
- Transceiver: Yaesu FT-817 or similar
- Power: 5W should be enough
- Computer interface for digital modes
- Software defined radio for receiving

### Software
- Prediction: Where's the satellite?
- Tracking: Point the antenna
- Demodulation: Decode the data
- Command: Send instructions

## Link Budget Calculation

Let's see if this actually works:

Downlink at 437 MHz:
- Transmit power: +30 dBm (1W)
- Transmit antenna gain: 0 dBi (omnidirectional)
- Path loss: -130 dB (average)
- Receive antenna gain: +12 dBi (Yagi)
- Cable/misc losses: -3 dB

Received power: 30 + 0 - 130 + 12 - 3 = -91 dBm

Radio sensitivity: -110 dBm
Link margin: 19 dB

It works! Barely. No margin for error though.

## Protocol Considerations

### AX.25 Packet Radio
Standard for amateur satellites.
- Based on X.25
- Error detection/correction
- Addressing built in
- Well supported

### Custom Protocols
For efficiency, might design our own.
- Minimize overhead
- Optimize for space environment
- Include forward error correction

## Real Hardware Testing

Built a 437 MHz Yagi this week:
- 7 elements
- About 11 dBi gain (calculated)
- $20 in aluminum rod and PVC

Tested by listening to active satellites:
- Heard CW beacon from AO-27
- Decoded packet from ISS!
- Doppler shift very noticeable

Actually hearing signals from space = mind blown.

## Challenges Specific to CubeSats

### Power Budget
1 watt is optimistic. Reality:
- Solar panels generate ~2W average
- Battery capacity limited
- Must share with other systems

Might only transmit 10% of the time.

### Antenna Deployment
CubeSat antennas must:
- Fit inside before launch
- Deploy reliably in space
- Survive temperature extremes

Common solution: Tape measure material!

### Tumbling
CubeSat will tumble randomly.
- Antenna pattern constantly changing
- Polarization rotating
- Signal fading in and out

Why circular polarization matters.

## Regulatory Hurdles

Can't just transmit to space!

Need:
- Amateur radio license (getting mine!)
- Frequency coordination
- Power limits compliance
- International agreements

So much paperwork for 1 watt.

## Learning from Other Missions

Studied successful CubeSat missions:

### AMSAT CubeSats
- Simple FM repeaters
- Proven reliable
- Great first mission

### University CubeSats
- Often too ambitious
- Complex = more failure modes
- KISS principle wins

### Commercial CubeSats  
- Higher frequencies
- Directional antennas
- Not applicable for us

## Ground Station Networks

Don't need to do it alone!

### SatNOGS
- Global network of ground stations
- Open source
- Automatic tracking
- Free to use!

### AMSAT Network
- Amateur radio operators worldwide
- Will help track and decode
- Invaluable for global coverage

## Preparing for Interview

Key points to emphasize:
1. Understand link budgets
2. Know frequency allocations
3. Appreciate Doppler effects
4. Have realistic data rate expectations
5. Consider operational constraints

Practice questions:
- "How much data can we downlink per pass?"
- "What's our link margin?"
- "How do we handle Doppler?"

## The Reality Check

Talking to spacecraft is HARD:
- Weak signals
- Limited time windows
- Equipment complexity
- Environmental challenges

But people do it every day. We can too.

## Next Steps

Before interview:
1. Finish building ground station
2. Track more satellites
3. Calculate link budgets for different scenarios
4. Learn GNU Radio basics
5. Practice CW (just in case)

## The Excitement

In 2 years, we might be receiving data from our own satellite. 

Our hardware. In space. Sending us data.

How cool is that?!

*Update: Spent all night tracking satellites. Decoded weather image from NOAA-15. Space is addictive.*`,
    tags: ['satellite', 'communications', 'rf', 'cubesat'],
    readTime: '11 min',
  },
  {
    date: '2010-02-10',
    title: 'PCB Design with Eagle: Moving Beyond Breadboards',
    summary: 'Finally learning PCB design! Here\'s my journey from breadboard chaos to professional printed circuit boards using Eagle CAD.',
    content: `After spending 20 minutes finding a loose wire in my breadboard rat's nest, I decided it's time to learn PCB design. Downloaded Eagle CAD (free version) and dove in. Here's what I've learned so far.

## Why PCBs?

Breadboards are great for prototyping, but:
- Unreliable connections
- Parasitic capacitance (~2pF between rows)
- Can't handle high frequencies
- Look unprofessional
- Fall apart when moved

PCBs solve all of these.

## Getting Started with Eagle

### First Impressions
UI is... unique. Not intuitive at all. But it's free for small boards (80cm²) and industry standard, so I'm pushing through.

Key concepts that confused me:
- Schematic ≠ Board layout
- Libraries contain parts
- Every part needs symbol AND footprint
- Layers matter (a lot)

### The Workflow
1. Draw schematic (logical connections)
2. Add parts from libraries
3. Connect with nets (not wires!)
4. Switch to board layout
5. Place components
6. Route traces
7. Design rule check (DRC)
8. Generate Gerber files

Seems simple. It's not.

## My First PCB: LED Blinker

Started simple: 555 timer blinking an LED.

### Schematic Capture
Found 555 timer in library. Placed it. Easy!

Wait, why are there 3 different 555 symbols? Turns out:
- Different packages (DIP-8, SOIC-8, etc.)
- Different manufacturers
- Different pin arrangements

Lesson: Check the datasheet AND footprint.

### The Footprint Fiasco
Proudly finished schematic. Switched to board view. Parts everywhere with white lines (airwires) showing connections.

Started placing components. Looked good!

Then realized: I used 0805 footprint for resistors. I have 1/4W through-hole resistors.

That's... not going to work.

Lesson: Know your actual components BEFORE designing.

## Second Attempt: Arduino Shield

Decided to make something useful: Arduino prototyping shield with:
- Breadboard area
- LED indicators
- Reset button
- Power filtering

### Learning Proper Schematic Style

My first schematic: Spaghetti mess
Proper schematic: Organized, labeled, logical flow

Tips learned:
- Power connections at top
- Ground at bottom
- Signal flow left to right
- Use net names for clarity
- Add values to all components

### Board Layout Enlightenment

This is where the magic happens. Converting schematic to physical reality.

Key realizations:
1. **Component placement is 90% of the work**
   - Minimize crossing connections
   - Keep related parts together
   - Think about trace routing

2. **Trace width matters**
   - Power traces: Wider (24 mil minimum)
   - Signals: 10-12 mil is fine
   - Use trace width calculator!

3. **Ground planes are amazing**
   - Dedicate entire layer to ground
   - Reduces noise
   - Easier routing
   - Better for high frequency

### Design Rules

Eagle's DRC (Design Rule Check) saved me from expensive mistakes:
- Traces too close (8 mil minimum for cheap fabs)
- Drill sizes wrong
- Silkscreen over pads
- Acute angles (acid traps)

Run DRC obsessively!

## Advanced Techniques I'm Learning

### Multi-Layer Boards
2 layers: Good for simple designs
4 layers: Power/ground planes + 2 signal layers

My shield is 2-layer:
- Top: Most traces and components
- Bottom: Ground plane and few traces

### Vias
Connect between layers. Types:
- Through-hole (normal)
- Blind (one side only)
- Buried (internal layers)

Using lots of vias to stitch ground planes together.

### Copper Pours
Fill empty areas with copper (usually ground).
Benefits:
- Less etching for fab
- Better current handling
- EMI shielding

Looks professional too!

## Getting It Made

### Generating Gerbers
Industry standard format. Separate file for each layer:
- Top copper (.GTL)
- Bottom copper (.GBL)
- Soldermask (.GTS/.GBS)
- Silkscreen (.GTO/.GBO)
- Drill file (.TXT)

Eagle CAM processor automates this. Still confusing first time.

### Choosing a Fab

For prototype quantities:
- OSH Park: $5/sq inch, purple boards, US-made
- JLCPCB: $2 for 10 boards(!), from China
- Advanced Circuits: $33 each, fast turnaround

Went with JLCPCB. $2 + $15 shipping = $17 for 10 boards!

### The Waiting Game

Ordered Sunday night. Boards manufactured Tuesday. Shipped Wednesday. 

Tracking obsessively.

Modern manufacturing is incredible.

## Common Beginner Mistakes (I Made Most of Them)

1. **Wrong footprints**: Measure your actual parts!
2. **No mounting holes**: Boards need mechanical support
3. **Tiny text**: Silkscreen has minimum size (0.8mm height)
4. **Power traces too thin**: Calculate current needs
5. **No test points**: Add them, future you will thank you
6. **Components too close**: Leave room for soldering iron
7. **No polarity markings**: Which way does LED go?
8. **Forgetting paste layer**: Important for stencils
9. **Acute angles**: Creates acid traps during etching
10. **No ground plane**: Just use one, trust me

## Tips That Would've Saved Me Hours

### Organization
- Name nets descriptively (VCC_5V not N$1)
- Use consistent grid (0.1" for through-hole)
- Group related components
- Add notes on schematic

### Libraries
- Download proven libraries (Adafruit, SparkFun)
- Check footprints against datasheets
- Make your own for weird parts
- Save custom libraries separately

### Routing
- Route power first
- Then critical signals
- Use 45° angles, not 90°
- Keep analog and digital separate
- Minimize via count

### Documentation
- Add name, date, version to silkscreen
- Include test point labels
- Mark pin 1 on connectors
- Add voltage labels

## The Learning Resources That Actually Helped

- SparkFun Eagle tutorials (start here!)
- Contextual Electronics on YouTube
- /r/PrintedCircuitBoard subreddit
- Eagle forums (solutions to everything)

## First Boards Arrived!

Two weeks later: Purple PCBs from OSH Park!

The excitement of holding YOUR design, professionally made, is indescribable.

Assembly results:
- Everything fit! (Mostly)
- Reset button footprint slightly off
- Forgot pullup resistor on one LED
- Otherwise perfect!

Cost breakdown:
- PCB: $15 for 3
- Components: $10
- Satisfaction: Priceless

## What's Next

Now that I can make PCBs:
- CubeSat power distribution board
- Better function generator (current one is breadboarded)
- Custom Arduino with only features I need
- SMD practice board

## The Bigger Picture

PCB design is a superpower. You can:
- Make custom tools
- Miniaturize projects  
- Look professional
- Actually sell products

Worth learning? Absolutely.

## Final Advice

To EE students on the fence:
1. Download Eagle today
2. Design something simple
3. Order boards (it's cheap!)
4. Be amazed at what you created

The future is custom hardware. Time to start building it.

*Currently designing 4-layer board for CubeSat communication system. If freshman me could see this...*`,
    tags: ['pcb', 'eagle', 'design', 'hardware'],
    readTime: '12 min',
  },
  {
    date: '2010-02-20',
    title: 'Understanding Microcontroller Interrupts: From Polling to Elegance',
    summary: 'Finally grasping interrupts after struggling with timing-critical code. Here\'s how interrupts changed everything about my embedded programming.',
    content: `Spent all week trying to read a rotary encoder while also updating an LCD and checking buttons. Code was a mess of timing issues. Then I discovered interrupts. Game changer.

## The Problem with Polling

My original approach (spoiler: it's bad):

\`\`\`c
void loop() {
    // Check button
    if (digitalRead(BUTTON_PIN) == LOW) {
        handleButton();
    }
    
    // Check encoder
    if (encoderChanged()) {
        updateEncoder();
    }
    
    // Update display
    if (millis() - lastUpdate > 100) {
        updateLCD();
        lastUpdate = millis();
    }
    
    // Do actual work
    processData();
}
\`\`\`

Problems:
- Missed button presses during LCD update
- Encoder steps lost during processing
- Timing dependent on execution speed
- Code becomes spaghetti fast

## Enter Interrupts

Interrupts literally interrupt normal code when events happen. Like someone tapping your shoulder - you handle it immediately, then resume what you were doing.

My revelation: Let hardware handle timing!

## Types of Interrupts

### External Interrupts
Triggered by pins changing state.

ATmega328 has two: INT0 (pin 2), INT1 (pin 3)

Modes:
- LOW: Trigger while pin is low
- CHANGE: Any state change
- RISING: Low to high transition
- FALLING: High to low transition

Perfect for buttons and encoders!

### Timer Interrupts
Triggered by hardware timers.

Use cases:
- Precise timing
- PWM generation
- Regular sampling
- Timeout detection

No more millis() checking!

### Other Interrupts
- UART: Data received/sent
- ADC: Conversion complete
- SPI/I2C: Transfer complete
- Watchdog: System hang detection

Each peripheral can interrupt when ready.

## My First Interrupt: Button Debouncing

Problem: Mechanical buttons "bounce" - multiple transitions per press.

Polling solution: Complicated state machine
Interrupt solution: Elegant!

\`\`\`c
volatile bool buttonPressed = false;
volatile unsigned long lastInterrupt = 0;

void setup() {
    pinMode(2, INPUT_PULLUP);
    attachInterrupt(0, buttonISR, FALLING);
}

void buttonISR() {
    unsigned long now = millis();
    if (now - lastInterrupt > 200) {  // Debounce
        buttonPressed = true;
        lastInterrupt = now;
    }
}

void loop() {
    if (buttonPressed) {
        handleButton();
        buttonPressed = false;
    }
    // Rest of code runs uninterrupted
}
\`\`\`

Button works perfectly regardless of what loop() is doing!

## Rotary Encoder: The Interrupt Killer App

Rotary encoders need fast response to catch all transitions. Perfect for interrupts.

\`\`\`c
volatile int encoderPos = 0;
volatile byte lastEncoded = 0;

void setup() {
    pinMode(2, INPUT_PULLUP);  // A
    pinMode(3, INPUT_PULLUP);  // B
    
    attachInterrupt(0, updateEncoder, CHANGE);
    attachInterrupt(1, updateEncoder, CHANGE);
}

void updateEncoder() {
    byte MSB = digitalRead(2);
    byte LSB = digitalRead(3);
    byte encoded = (MSB << 1) | LSB;
    byte sum = (lastEncoded << 2) | encoded;
    
    if(sum == 0b1101 || sum == 0b0100 || 
       sum == 0b0010 || sum == 0b1011) encoderPos++;
    if(sum == 0b1110 || sum == 0b0111 || 
       sum == 0b0001 || sum == 0b1000) encoderPos--;
    
    lastEncoded = encoded;
}
\`\`\`

Never miss a step, no matter how fast you spin!

## Timer Interrupts: Precise Timing

Needed to sample audio at exactly 8kHz. millis() wasn't cutting it.

Timer1 to the rescue:

\`\`\`c
void setup() {
    cli();  // Disable interrupts
    
    // Set Timer1 for 8kHz
    TCCR1A = 0;
    TCCR1B = 0;
    TCNT1 = 0;
    
    OCR1A = 1999;  // 16MHz/8/1000 - 1
    TCCR1B |= (1 << WGM12);  // CTC mode
    TCCR1B |= (1 << CS11);   // 8 prescaler
    TIMSK1 |= (1 << OCIE1A); // Enable interrupt
    
    sei();  // Enable interrupts
}

ISR(TIMER1_COMPA_vect) {
    // Called exactly 8000 times per second
    int sample = analogRead(A0);
    processSample(sample);
}
\`\`\`

Sampling is now rock-solid, regardless of main code!

## The Rules of Interrupts

### Rule 1: Keep ISRs Short
Interrupts block other interrupts. Long ISR = missed events.

Bad:
\`\`\`c
void buttonISR() {
    lcd.clear();
    lcd.print("Button pressed!");  // Too slow!
    delay(1000);  // NEVER!
}
\`\`\`

Good:
\`\`\`c
volatile bool buttonFlag = true;  // Set flag, handle later
\`\`\`

### Rule 2: Volatile Variables
Variables modified in ISR must be volatile. Tells compiler they can change anytime.

\`\`\`c
volatile int count = 0;  // Correct
int count = 0;          // Optimizer might break this
\`\`\`

### Rule 3: Atomic Access
Multi-byte variables need protection:

\`\`\`c
// Reading 16-bit value safely
cli();  // Disable interrupts
int temp = largeCounter;
sei();  // Re-enable
\`\`\`

### Rule 4: No delay(), Serial, or malloc()
These functions use interrupts internally. Calling from ISR = deadlock.

## Priority and Nested Interrupts

ATmega328 interrupts have fixed priority (vector table order).

If multiple trigger simultaneously:
1. Reset (highest)
2. External Interrupt 0
3. External Interrupt 1
4. Timer interrupts
... etc

Can enable nested interrupts with sei() in ISR, but dangerous!

## Real Project: Frequency Counter

Built frequency counter using interrupts:

\`\`\`c
volatile unsigned long pulseCount = 0;
unsigned long lastTime = 0;

void setup() {
    // Input signal to INT0
    attachInterrupt(0, countPulse, RISING);
    
    // Timer2 for 1-second gate time
    setupTimer2();
}

void countPulse() {
    pulseCount++;
}

ISR(TIMER2_OVF_vect) {
    static int overflows = 0;
    if (++overflows >= 61) {  // ~1 second
        unsigned long freq = pulseCount;
        pulseCount = 0;
        overflows = 0;
        displayFrequency(freq);
    }
}
\`\`\`

Measures up to 8MHz accurately!

## Debugging Interrupts (The Hard Part)

Interrupts are invisible to normal debugging. My techniques:

### LED Debugging
Toggle LED in ISR:
\`\`\`c
ISR() {
    PORTB ^= (1 << 5);  // Toggle pin 13
    // Rest of ISR
}
\`\`\`

### Logic Analyzer
Best investment ever. See exactly when interrupts fire.

### Scope Tricks
Output pulse at ISR start/end:
\`\`\`c
ISR() {
    PORTD |= (1 << 4);   // Set high
    // ISR code
    PORTD &= ~(1 << 4);  // Set low
}
\`\`\`

Pulse width = ISR execution time!

## Common Pitfalls I Hit

### Forgotten sei()
Spent 2 hours debugging. Interrupts were configured but never enabled. Always call sei()!

### Interrupt Storm
Configured INT0 for LOW trigger. Pin was low. ISR fired continuously. System hung.

### Race Conditions
Main code and ISR accessing same variable without protection. Intermittent bugs are the worst.

### Stack Overflow
Too many nested function calls in ISR. Random crashes. Keep ISRs simple!

## When NOT to Use Interrupts

Interrupts aren't always the answer:
- Very frequent events (overhead too high)
- Complex processing needed
- When timing isn't critical
- Learning/debugging (polling is simpler)

## The Power of Interrupts

My encoder+LCD+button project:
- Before interrupts: 200 lines, buggy
- After interrupts: 100 lines, bulletproof

Current project uses 5 interrupt sources:
- Encoder input
- Button matrix
- Timer for display refresh
- UART for commands
- ADC for monitoring

All running smoothly together!

## Resources That Helped

- Nick Gammon's interrupt tutorial (absolute gold)
- ATmega328 datasheet (chapter 11)
- Arduino attachInterrupt() reference
- avrfreaks forum (saved me many times)

## Next Level: Sleep Modes

Just discovered interrupts can wake processor from sleep:

\`\`\`c
set_sleep_mode(SLEEP_MODE_PWR_DOWN);
sleep_enable();
sleep_cpu();  // ZZZ until interrupt
// Interrupt wakes us here
\`\`\`

Battery life went from days to months!

## Final Thoughts

Interrupts transformed my embedded programming. From fighting timing to elegant event-driven code.

To fellow students: Yes, the learning curve is steep. But once it clicks, you'll never go back to polling.

Now if you'll excuse me, I need to add interrupt-driven SPI to my CubeSat communication board...

*Update: Just implemented 6-channel PWM using timer interrupts. Servos have never been smoother!*`,
    tags: ['microcontroller', 'interrupts', 'embedded', 'programming'],
    readTime: '13 min',
  },
  {
    date: '2010-02-25',
    title: 'Building a Logic Analyzer with Arduino',
    summary: 'Commercial logic analyzers cost hundreds. Built my own 8-channel analyzer for $20. It\'s slow but educational!',
    content: `Debugging SPI communication between two chips. Oscilloscope shows one signal at a time. Need to see clock, data, and chip select together. Time to build a logic analyzer!

## What's a Logic Analyzer?

Think of it as a multi-channel digital oscilloscope:
- Records multiple digital signals simultaneously  
- Shows timing relationships
- Perfect for debugging protocols
- Only cares about 0 or 1, not analog values

## Commercial vs DIY

Saleae Logic 8: $400, 24MHz sample rate, beautiful software
My version: $20, 1MHz sample rate, functional software

For learning protocols at school? Mine's good enough!

## The Hardware Design

Core idea: Use Arduino to sample 8 pins rapidly, send data to PC.

### Version 1: Naive Approach
\`\`\`c
void loop() {
    byte sample = PINB;  // Read 8 pins at once
    Serial.write(sample);
}
\`\`\`

Problems:
- Serial baud rate limits sample rate
- No timing information
- No triggering

Max sample rate: 115200/8 = 14.4kHz. Pathetic.

### Version 2: Buffered Sampling
Sample into memory first, then transmit:

\`\`\`c
byte buffer[1024];  // ATmega328 has 2KB RAM
int pos = 0;

void capture() {
    while(pos < 1024) {
        buffer[pos++] = PINB;
        delayMicroseconds(1);  // 1MHz sample rate
    }
}
\`\`\`

Better! But delayMicroseconds() isn't accurate.

### Version 3: Timer-Driven Sampling
Use Timer1 for precise timing:

\`\`\`c
ISR(TIMER1_COMPA_vect) {
    if(capturing && pos < BUFFER_SIZE) {
        buffer[pos++] = PINB;
    }
}

void setup() {
    // Configure Timer1 for 1MHz
    OCR1A = 15;  // 16MHz / 16 = 1MHz
    TCCR1B = (1 << WGM12) | (1 << CS10);
    TIMSK1 = (1 << OCIE1A);
}
\`\`\`

Now we're sampling at exactly 1MHz!

### Adding Trigger Logic
Logic analyzer needs triggering to capture specific events:

\`\`\`c
void waitForTrigger() {
    byte triggerMask = 0x01;   // Trigger on bit 0
    byte triggerValue = 0x01;  // Rising edge
    byte lastSample = PINB;
    
    while(true) {
        byte sample = PINB;
        if((lastSample & triggerMask) == 0 && 
           (sample & triggerMask) == triggerValue) {
            break;  // Triggered!
        }
        lastSample = sample;
    }
}
\`\`\`

## The Protocol

Defined simple serial protocol:

Commands from PC:
- 'C': Capture
- 'T': Set trigger
- 'R': Set sample rate
- 'S': Get status

Response format:
- [START][LENGTH][DATA...][CHECKSUM][END]

## PC Software

First attempt: Arduino Serial Monitor. Useless for binary data.

### Python to the Rescue!
Wrote Python script for capture and display:

\`\`\`python
import serial
import matplotlib.pyplot as plt

def capture_data(port, num_samples):
    ser = serial.Serial(port, 115200)
    ser.write(b'C')  # Start capture
    
    # Wait for data
    while ser.read() != b'START':
        pass
    
    length = ser.read(2)
    data = ser.read(length)
    
    return list(data)

def plot_logic(data):
    fig, axes = plt.subplots(8, 1, sharex=True)
    
    for bit in range(8):
        signal = [(d >> bit) & 1 for d in data]
        axes[bit].step(range(len(signal)), signal)
        axes[bit].set_ylim(-0.1, 1.1)
        axes[bit].set_ylabel(f'D{bit}')
    
    plt.show()
\`\`\`

Basic but functional!

### Adding Protocol Decoders

SPI decoder:
\`\`\`python
def decode_spi(clk, mosi, miso, cs):
    bytes_mosi = []
    bytes_miso = []
    current_mosi = 0
    current_miso = 0
    bit_count = 0
    
    for i in range(1, len(clk)):
        if cs[i] == 0:  # Chip selected
            if clk[i] == 1 and clk[i-1] == 0:  # Rising edge
                current_mosi = (current_mosi << 1) | mosi[i]
                current_miso = (current_miso << 1) | miso[i]
                bit_count += 1
                
                if bit_count == 8:
                    bytes_mosi.append(current_mosi)
                    bytes_miso.append(current_miso)
                    bit_count = 0
                    current_mosi = 0
                    current_miso = 0
    
    return bytes_mosi, bytes_miso
\`\`\`

Now I can see actual SPI transactions!

## Real-World Testing

### Test 1: UART Communication
Connected to Arduino sending "Hello":
- Clearly see start bits, data, stop bits
- Decoded ASCII values correctly
- Found baud rate mismatch (115200 vs 119200 actual)

### Test 2: I2C Debugging
Debugging I2C EEPROM communication:
- Saw SDA and SCL relationship
- Caught missing ACK bit
- Problem: Pull-up resistors too large

### Test 3: SPI Flash
Analyzing SPI flash commands:
- Captured full read sequence
- Saw chip select timing issue
- Fixed 10ns CS hold time violation

## Performance Analysis

What can 1MHz sample rate actually capture?

Good for:
- UART up to 115200 baud
- I2C up to 400kHz
- SPI up to 500kHz
- General GPIO debugging

Not good for:
- USB (12MHz+)
- High-speed SPI (10MHz+)
- DDR memory
- Fast microcontroller buses

But perfect for learning!

## Improvements Made

### Compression
8 channels changing slowly = lots of repeated samples.

Run-length encoding:
\`\`\`c
void compress_buffer() {
    byte last = buffer[0];
    byte count = 1;
    
    for(int i = 1; i < pos; i++) {
        if(buffer[i] == last && count < 255) {
            count++;
        } else {
            send_compressed(last, count);
            last = buffer[i];
            count = 1;
        }
    }
}
\`\`\`

4x improvement for typical signals!

### Variable Sample Rate
Added prescaler configuration:
- 4MHz: /4 prescaler
- 1MHz: /16 prescaler  
- 250kHz: /64 prescaler
- 15.6kHz: /1024 prescaler

Lower rates = longer captures.

### Pre-trigger Buffer
Circular buffer to capture before trigger:

\`\`\`c
void circular_capture() {
    pos = 0;
    while(!triggered) {
        buffer[pos] = PINB;
        pos = (pos + 1) % BUFFER_SIZE;
        check_trigger();
    }
    // Continue capturing after trigger
}
\`\`\`

See what led up to the event!

## Limitations Hit

### Memory
2KB RAM - 1KB buffer = 1ms at 1MHz
Solution: External SPI RAM chip (23K256)

### Sample Rate
Arduino at 16MHz limits practical sample rate.
Solution: FPGA (future project!)

### Analog Threshold
Digital only assumes 2.5V threshold.
Solution: Comparators with adjustable threshold.

## Cost Breakdown

- Arduino Nano clone: $5
- Headers and cables: $5
- Perfboard: $2
- Test clips: $8
- Total: $20

Optional upgrades:
- 23K256 RAM: $2
- Better clips: $15
- Metal enclosure: $10

## Lessons Learned

1. **Start simple**: Basic version taught core concepts
2. **Iterate quickly**: Each version solved specific problems
3. **Good enough works**: Don't need Saleae quality for learning
4. **Software matters**: Half the work was PC side
5. **Documentation crucial**: Helped classmates build their own

## Educational Value

Building this taught:
- Interrupt programming
- Serial protocols
- Python GUI programming
- Signal integrity basics
- Protocol analysis

Worth way more than $20!

## Future Enhancements

Version 2 plans:
- 16 channels (use I/O expander)
- 10MHz sample rate (external ADC)
- Analog channels (mixed-signal)
- Better triggering (pattern, serial)
- Web interface (ESP32?)

But current version works for 90% of my needs.

## Comparison with Scope

Logic Analyzer:
- Many channels
- Long time capture
- Protocol decode
- Digital only

Oscilloscope:
- Analog details
- Signal integrity
- Noise analysis
- 1-4 channels typically

Need both for complete picture!

## Open Source Release

Posted on GitHub with:
- Arduino firmware
- Python software
- PCB design files
- Build instructions

Already 10 forks and improvements!

## Using It for CubeSat

Debugging satellite communication board:
- 8 channels monitoring SPI bus
- Caught timing violation in radio chip access
- Saved hours vs single-channel scope

This tool has already paid for itself.

## Final Thoughts

Is it as good as commercial? No.
Did I learn a ton building it? Yes.
Does it solve real problems? Absolutely.

Sometimes the journey is worth more than the destination.

To fellow students: Build your own tools. You'll understand them deeply and can customize for your exact needs.

*Currently working on: FPGA-based version with 100MHz sample rate. Because why not?*`,
    tags: ['logic-analyzer', 'arduino', 'diy', 'test-equipment'],
    readTime: '14 min',
  },
  {
    date: '2010-03-01',
    title: 'CubeSat Power Budget: Every Milliwatt Counts',
    summary: 'Calculating power generation and consumption for our CubeSat. When your solar panels generate 2 watts on a good day, efficiency becomes religion.',
    content: `First CubeSat team meeting as official member! My task: Calculate complete power budget. Sounds simple until you realize we're powered by solar panels the size of index cards. Here's my deep dive into spacecraft power engineering.

## The Power Challenge

Our 1U CubeSat (10cm cube) has:
- 5 faces for solar panels (one has antenna)
- Each panel: ~2W in full sun
- But we're tumbling, so average is way less
- Oh, and we're in Earth's shadow 35% of the time

This is going to be tight.

## Solar Panel Deep Dive

### The Cells
Using Spectrolab 29.5% efficiency GaAs cells:
- 2.4W per cell @ 28°C
- But space is cold AND hot
- Efficiency drops 0.3%/°C above 28°C

### Panel Configuration
Each face: 2 cells in series
- Open circuit voltage: 5.4V
- Peak power point: 4.6V @ 520mA
- Total: 2.4W per face theoretical

But that's best case...

## Orbital Mechanics Meets Power

Our orbit: 400km, 51.6° inclination (ISS orbit)

Power generation depends on:
1. Sun angle (varies constantly)
2. Eclipse periods (35% of 90-minute orbit)
3. Tumbling rate (random orientation)

### The Cosine Loss Problem
Power = Max Power × cos(angle)

If sun hits panel at 60°: Only 50% power!

Tumbling satellite math:
- Average cos(θ) over sphere = 1/π ≈ 0.318
- So average power per panel = 2.4W × 0.318 = 0.76W

5 panels × 0.76W = 3.8W average in sun

### Eclipse Calculations
Orbital period: 90 minutes
- Sunlight: 58 minutes (64%)
- Eclipse: 32 minutes (36%)

Average power generation:
3.8W × 0.64 = 2.43W

But wait, there's more losses...

## Power System Efficiency

### Solar Panel to Battery
- MPPT converter efficiency: 85%
- Battery charging efficiency: 90%
- Wiring/connector losses: 95%

Total: 0.85 × 0.90 × 0.95 = 73%

Actual average power to battery: 2.43W × 0.73 = 1.77W

### Battery to Systems
- Discharge efficiency: 95%
- Regulator efficiency: 90%

Power available: 1.77W × 0.95 × 0.90 = 1.51W

We have 1.5 watts. Total. For everything.

## Power Consumption Audit

Time to count every milliamp...

### Command & Data Handling
- MSP430 microcontroller: 8mA @ 3.3V = 26mW
- SD card (intermittent): 50mA @ 3.3V = 165mW
- Sensors (temp, mag, gyro): 15mA @ 3.3V = 50mW
Total: ~250mW continuous

### Communication System
- Receiver (always on): 15mA @ 3.3V = 50mW
- Transmitter (10% duty): 400mA @ 5V = 2W (200mW average)
Total: ~250mW average

### Attitude Determination
- Magnetometer: 5mA @ 3.3V = 17mW
- Sun sensors: 10mA @ 3.3V = 33mW
- Processing: Included in C&DH
Total: ~50mW

### Payload (Camera)
- Imaging: 150mA @ 3.3V = 500mW
- 1 photo/orbit = 30 seconds
- Average: 500mW × (30/5400) = 2.8mW

### Margins and Overhead
- Clock/timers: 5mW
- Voltage references: 10mW
- Quiescent currents: 20mW
Total: ~35mW

### Grand Total
250 + 250 + 50 + 3 + 35 = 588mW

We're using 588mW, generating 1510mW.
Margin: 922mW (157%!)

Looks good, but...

## The Battery Sizing Problem

Eclipse lasts 32 minutes. Need 588mW × 0.53hr = 312mWh

Battery capacity needed (with 80% depth of discharge):
312mWh / 0.8 = 390mWh = 105mAh @ 3.7V

Our battery: 2600mAh
Overkill? No! Here's why:

### Battery Degradation
- Lose 20% capacity per year
- Mission life: 2 years
- End of life: 2600 × 0.6 = 1560mAh

### Temperature Effects
- Capacity drops 50% at -20°C
- Worst case: 1560 × 0.5 = 780mAh

Still plenty!

## Dynamic Power Management

Can't run everything always. Implemented priority system:

### Priority 1: Essential (Always On)
- C&DH: 26mW
- Receiver: 50mW
- Thermal: 10mW
Total: 86mW (minimum to stay alive)

### Priority 2: Normal Ops
- Sensors: 50mW
- Beacon TX: 200mW
Total: 336mW

### Priority 3: Science
- Camera: 500mW (when active)
- High-rate TX: 2W (when active)

### Power Management Algorithm
\`\`\`c
if (battery_voltage < 3.2V) {
    mode = ESSENTIAL_ONLY;
} else if (battery_voltage < 3.6V) {
    mode = NORMAL_OPS;
} else {
    mode = FULL_SCIENCE;
}
\`\`\`

## Thermal Considerations

Temperature affects everything!

### Solar Panel Temperature
In sun: +80°C (efficiency drops 15%)
In eclipse: -40°C (battery capacity drops)

Thermal cycling is brutal.

### Heater Power
Battery heater: 500mW when T < 0°C
Adds significant load in eclipse!

Updated power budget:
- Eclipse consumption: 588mW + 500mW = 1088mW
- Eclipse duration: 0.53hr
- Energy needed: 577mWh

Still within battery capacity, but tighter.

## Peak Power Analysis

Worst case simultaneous load:
- Everything on
- Transmitting high-rate
- Camera active
- Heaters on

Total: 3.5W

Can battery deliver? 
2600mAh battery, 1C discharge = 2.6A @ 3.7V = 9.6W

Yes, but voltage sags. Need good regulators.

## Lessons from Other Missions

Studied failed CubeSats:

### CUTE-1 (2003)
- Failed after 1 month
- Cause: Battery overheating
- Lesson: Thermal management critical

### XI-IV (2003)
- Still working after 15+ years!
- Conservative power budget
- Lesson: Margins matter

### Our Design Philosophy
Under-promise, over-deliver. Budget shows 1.5W generation? Design for 1W.

## Power Budget Spreadsheet

Created detailed Excel model:
- Orbital parameters → eclipse timing
- Temperature → panel efficiency
- Component states → consumption
- Monte Carlo simulation for tumbling

Key findings:
- Best case: 4W generation
- Worst case: 0.8W generation
- Design for worst case!

## PCB Design for Power Efficiency

Designing the power board:

### Copper Thickness
Using 2oz copper (vs standard 1oz)
- Lower resistance
- Better heat spreading
- Worth the extra cost

### Trace Width
Calculated for 1% voltage drop:
- Main power: 2mm traces
- Battery: 3mm traces
- Grounds: Entire layer

### Component Selection
- LDO regulators: 50μA quiescent
- Switching regulators: >90% efficiency
- Schottky diodes: Low forward drop
- Tantalum caps: Low ESR

Every millivolt matters!

## Testing Plan

How to verify on ground:

### Solar Simulator
- Halogen lamps calibrated to 1367W/m²
- Thermal vacuum chamber
- Measure actual panel output

### Battery Cycling
- Simulate orbital temperature swings
- Charge/discharge cycles
- Measure capacity degradation

### System-Level Test
- Run flight software
- Simulate full orbits
- Verify positive power margin

## Risk Mitigation

What if power generation is lower?

### Backup Plans
1. Reduce beacon rate (save 100mW)
2. Lower transmit power (save 500mW)
3. Hibernate between passes (save 200mW)
4. Payload only in full sun (save average power)

### Safe Mode
If battery < 3.0V:
- Everything off except timer
- Wake every orbit
- Beacon if power available
- Wait for recovery

## The Human Side

Team debate over payload power:
- Science team: "We need 1W for camera!"
- Power team (me): "You get 500mW"
- Compromise: 500mW, but priority in full sun

Engineering is negotiation.

## Tools and Resources

Software used:
- MATLAB: Orbital calculations
- Excel: Power budget
- LTspice: Regulator design
- STK: Eclipse timing

References:
- Spacecraft Power Systems by Patel
- CubeSat Power System Design book
- Previous mission reports

## Current Status

Power budget: APPROVED!
- 60% margin in worst case
- Meets all mission requirements
- Board design starting

Next steps:
- Component procurement
- Board layout
- Solar panel testing
- Battery characterization

## Reflections

Six months ago: "Just stick a battery in it"
Now: Appreciating every aspect of power engineering

Space is hard because:
- Can't add more panels later
- Can't replace batteries
- Thermal cycling is brutal
- Every milliwatt precious

But that's what makes it exciting!

## Final Numbers

Power Generation: 1.5W average
Power Consumption: 0.6W average
Battery Capacity: 2.6Ah @ 3.7V
Mission Duration: 2 years
Margin: 150%

We're going to space!

*Next week: Designing the actual power board. Time to turn spreadsheets into silicon!*`,
    tags: ['cubesat', 'power', 'space', 'engineering'],
    readTime: '15 min',
  },
  {
    date: '2010-03-05',
    title: 'Thermal Management in Small Satellites',
    summary: 'Space is hot AND cold. Learning to manage temperatures when your satellite swings from -40°C to +80°C every 45 minutes.',
    content: `Just got thermal simulation results for our CubeSat. Components will see temperature swings of 120°C every orbit. Some chips are rated for -40 to +85°C. This is going to be interesting...

## The Thermal Environment of Space

Space isn't just cold - it's thermally bizarre:
- Sunlight side: +120°C possible
- Shadow side: -100°C possible
- No air for convection
- Only radiation heat transfer
- 90-minute thermal cycles

Our little CubeSat will experience 16 sunrises per day!

## Heat Sources and Sinks

### Sources (Things Making Heat)
1. **Solar radiation**: 1367 W/m² in space
2. **Earth IR**: ~240 W/m² average
3. **Albedo**: Reflected sunlight from Earth (~30%)
4. **Internal power**: Our electronics dissipate ~600mW

### Sinks (Where Heat Goes)
1. **Deep space**: 3K background (essentially 0)
2. **Radiation only**: No convection or conduction

The equation that rules everything:
Power_in = Power_out (at equilibrium)

## First-Order Thermal Model

Simple sphere approximation:

Heat in:
- Solar: 1367 W/m² × Area × absorptivity
- Earth IR: 240 W/m² × View factor × Area
- Internal: 0.6W

Heat out:
- Radiation: ε × σ × A × T⁴

Where:
- ε = emissivity
- σ = Stefan-Boltzmann constant
- A = surface area
- T = temperature (Kelvin)

Solving for T... we get wild temperature swings.

## Surface Treatments Matter

Different surfaces, different thermal properties:

### Aluminum (Bare)
- Solar absorptivity (α): 0.09
- IR emissivity (ε): 0.03
- α/ε ratio: 3.0 (gets hot!)

### White Paint
- α: 0.2
- ε: 0.9
- α/ε: 0.22 (stays cool)

### Black Anodized
- α: 0.9
- ε: 0.9
- α/ε: 1.0 (moderate)

### Solar Cells
- α: 0.8 (absorbs light for power)
- ε: 0.8
- But only 30% becomes electricity, rest is heat!

## Our Thermal Design Challenge

Requirements:
- Batteries: 0°C to 45°C (tight!)
- Electronics: -40°C to 85°C
- Solar panels: -100°C to 100°C (tough)
- Structure: Aluminum (high conductivity)

Current prediction: -30°C to +65°C

Too cold for batteries in eclipse!

## Passive Thermal Control

No power for active heating/cooling. Must be clever:

### Surface Finishes
Decided on:
- Solar panels: As is (need sunlight)
- Radiator faces: White paint (reject heat)
- Other faces: Alodine (moderate properties)

### Thermal Mass
Adding thermal mass dampens swings:
- Aluminum structure helps
- Battery is biggest thermal mass
- PCBs add some mass

But 1U CubeSat doesn't have much mass...

### Insulation
MLI (Multi-Layer Insulation) too complex for CubeSat.
Using:
- Kapton tape (poor man's MLI)
- Strategic gaps (air is good insulator)
- Thermal isolation washers

### Thermal Straps
Copper tape conducting heat:
- From hot components to radiators
- From solar panels to battery (warmth)
- Flexible for assembly

## Component-Level Analysis

### Battery Thermal Management
Biggest concern. Needs 0-45°C.

Solutions:
1. Mount in center (most stable)
2. Thermal strap to solar panels (heating)
3. Insulate from cold structure
4. Maybe add heater...

### Transmitter Heat
TX amp dissipates 10W when on!

Solutions:
1. Thermal strap to structure
2. Duty cycle limit (10%)
3. Temperature sensor for protection

### Solar Panel Temperature
Gets hot in sun: +80°C predicted

Effects:
- Efficiency drops 0.3%/°C
- Thermal stress on solder joints
- Differential expansion issues

Can't do much - they need sun exposure.

## Thermal Modeling Tools

### Simple Spreadsheet
Started here. Energy balance calculations.
Good for rough estimates.

### Thermal Desktop
Industry standard. Learning curve steep.
- CAD model import
- Orbital heating
- Radiation view factors
- Transient analysis

### COMSOL
Multiphysics including thermal.
Great for detailed component analysis.

### Homebrew MATLAB
Wrote simple transient solver:

\`\`\`matlab
% Thermal capacitance
C = mass * specific_heat;

% Time loop
for t = 1:duration
    Q_solar = solar_flux(t) * area * alpha;
    Q_earth = earth_ir * view_factor * area;
    Q_internal = power_dissipation(t);
    Q_rad = epsilon * sigma * area * T^4;
    
    dT = (Q_solar + Q_earth + Q_internal - Q_rad) / C * dt;
    T = T + dT;
end
\`\`\`

Results match Thermal Desktop within 5°C!

## Heater Design Dilemma

Battery needs heating in eclipse. Options:

### Resistive Heater
Simple! But:
- Uses precious power (500mW)
- Needs thermostat control
- Could drain battery it's protecting

### Radioisotope (Just Kidding)
Would solve everything but:
- Regulatory nightmare
- Way over budget
- Team voted no

### Phase Change Material
Paraffin wax stores/releases heat:
- Melts at 25°C
- Stores 200 J/g
- Passive operation!

Testing small amount around battery.

## Thermal Vacuum Testing Plans

Can't trust simulations alone. Need testing:

### Poor Man's Thermal Vac
- Vacuum chamber (borrowed from MechE)
- Liquid nitrogen (cold)
- Heat lamps (hot)
- Thermocouples everywhere

### Test Profile
1. Pump down to <10^-5 Torr
2. Cold soak to -40°C
3. Rapid transition to hot
4. Cycle 8 times (full day)
5. Monitor all temperatures

### Expected Issues
- Outgassing from PCBs
- Thermal expansion mismatches
- Cold batteries not working
- Hot transmitter shutting down

## Lessons from Other Missions

### SUCCESS Story: CanX-2
Used careful thermal design:
- White paint on radiators
- Battery heater (only when needed)
- Survived 5+ years!

### FAILURE Story: [Redacted] University
- No thermal analysis done
- Battery froze first eclipse
- Mission lost

Thermal kills satellites.

## Design Iterations

### Version 1: Isothermal Assumption
"Aluminum conducts well, it'll be uniform temperature"
Reality: 20°C gradients!

### Version 2: Add Radiator
"Big white radiator panel!"
Problem: Got too cold in eclipse

### Version 3: Balanced Design
- Moderate surface finishes
- Strategic insulation
- Accept temperature cycling
- Design components for it

## Component Selection Impact

Choosing components for temperature:

### Extended Temperature Range
- Costs 2-3x more
- Often larger packages
- Worth it for critical parts

### Military/Automotive Grade
- Better than commercial
- Not as good as space grade
- Good compromise for CubeSat

### Derating
Running components well below limits:
- 85°C rated part? Use to 60°C
- Increases reliability dramatically

## Thermal Interface Materials

Getting heat from chip to structure:

### Thermal Pads
- Sil-Pad: 1-3 W/mK
- Easy to use
- Compressible
- Good for production

### Thermal Paste
- Arctic Silver: 8.9 W/mK
- Messy application
- Best performance
- Flight concerns?

### Graphite Sheets
- 300+ W/mK (in plane)
- Expensive
- Amazing for spreading
- Testing for TX amplifier

## Current Design Status

Latest simulation results:
- Battery: -5°C to 35°C (add heater)
- Electronics: -25°C to 55°C (good!)
- Solar panels: -60°C to 80°C (expected)
- TX amp: Max 70°C (acceptable)

Almost there!

## The Heater Control Algorithm

If we add battery heater:

\`\`\`c
if (battery_temp < 0°C && battery_voltage > 3.6V) {
    heater_on();
} else if (battery_temp > 5°C || battery_voltage < 3.4V) {
    heater_off();
}
\`\`\`

Simple bang-bang control. Uses 500mW when on.

## Manufacturing Considerations

Thermal design affects assembly:
- Different expansion coefficients
- Stress on solder joints
- Need flexible connections
- Thermal paste application procedure

Working with assembly team on process.

## Future Improvements

For next CubeSat:
- Deployable radiator?
- Smart surface coatings
- Active thermal control
- Better thermal isolation

But first, make this one work!

## Key Takeaways

1. **Space thermal is non-intuitive**: Hot AND cold
2. **Surface properties dominate**: α/ε ratio is key
3. **Batteries are sensitive**: Design around them
4. **Test, test, test**: Simulation lies
5. **Margin is your friend**: Assume worse than predicted

## Resources Found Helpful

- Gilmore's "Spacecraft Thermal Control Handbook"
- NASA thermal design guides
- Previous CubeSat thermal papers
- Thermal Desktop tutorials

## Team Dynamics

Thermal affects everyone:
- Power: "Don't waste energy on heating!"
- Structures: "Don't complicate my design!"
- Comms: "Keep my amp cool!"
- Software: "Another sensor to monitor?"

Compromise is key.

## Next Steps

1. Finalize surface treatments
2. Order thermal interface materials
3. Build thermal model for testing
4. Vacuum chamber test
5. Iterate based on results

## Personal Growth

Six months ago: "Space is cold, add heaters"
Now: Understanding radiation heat transfer, view factors, and thermal capacitance

Engineering school doesn't teach spacecraft thermal. Learning by doing!

*Currently building thermal test model with 20 thermocouples. Going to cycle this thing until something breaks or we're confident. Probably both.*`,
    tags: ['cubesat', 'thermal', 'space', 'engineering'],
    readTime: '14 min',
  },
];

function generatePageTsx(post: BlogPost): string {
  const jsxContent = markdownToJSX(post.content);
  const readTime = post.readTime || calculateReadTime(post.content);

  return `import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "${post.title.replace(/"/g, '\\"')} - Michael D'Angelo",
  description: "${post.summary.replace(/"/g, '\\"')}",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="${post.date}-${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
        <header>
          <h1 className="text-4xl font-bold mb-4">${post.title.replace(/'/g, "\\'")}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('${post.date}').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • ${readTime}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {[${post.tags.map(tag => `'${tag}'`).join(', ')}].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
${jsxContent}
        </div>
      </article>
    </>
  );
}`;
}

function markdownToJSX(markdown: string): string {
  const lines = markdown.split('\n');
  const jsxElements: string[] = [];
  let currentParagraph: string[] = [];
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeLines: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  function processParagraph() {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join(' ').trim();
      if (content) {
        const processedContent = content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        jsxElements.push(`          <p>${processedContent}</p>`);
      }
      currentParagraph = [];
    }
  }

  function processList() {
    if (listItems.length > 0) {
      jsxElements.push('          <ul>');
      listItems.forEach(item => {
        const processedItem = item
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\`([^\`]+)\`/g, '<code>$1</code>');
        jsxElements.push(`            <li>${processedItem}</li>`);
      });
      jsxElements.push('          </ul>');
      listItems = [];
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        processParagraph();
        processList();
        inCodeBlock = true;
        codeLanguage = line.replace('```', '').trim() || 'text';
        codeLines = [];
      } else {
        const codeContent = codeLines.join('\n');
        const escapedCode = codeContent
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\$/g, '\\$');
        jsxElements.push(`          <pre className="language-${codeLanguage}"><code>{\`${escapedCode}\`}</code></pre>`);
        inCodeBlock = false;
        codeLanguage = '';
        codeLines = [];
      }
    } else if (inCodeBlock) {
      codeLines.push(line);
    } else if (line.startsWith('### ')) {
      processParagraph();
      processList();
      jsxElements.push(`          <h3>${escapeJSX(line.substring(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      processParagraph();
      processList();
      jsxElements.push(`          <h2>${escapeJSX(line.substring(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      processParagraph();
      processList();
      jsxElements.push(`          <h1>${escapeJSX(line.substring(2))}</h1>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      processParagraph();
      const listItem = line.substring(2).trim();
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(listItem);
    } else if (line.trim() === '') {
      processParagraph();
      processList();
    } else {
      if (inList) {
        processList();
      }
      currentParagraph.push(line.trim());
    }
  }

  processParagraph();
  processList();

  return jsxElements.join('\n');
}

function escapeJSX(text: string): string {
  return text
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}

// Generate the blog posts
posts2010.forEach(post => {
  const date = post.date;
  const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const dir = `app/blog/${date}-${slug}`;
  const filePath = `${dir}/page.tsx`;

  // Check if directory exists
  if (fs.existsSync(dir)) {
    console.log(`Skipping "${post.title}" - already exists`);
    return;
  }

  // Create directory
  fs.mkdirSync(dir, { recursive: true });

  // Generate and write the page.tsx file
  const pageContent = generatePageTsx(post);
  fs.writeFileSync(filePath, pageContent);

  console.log(`✅ Created: ${post.title}`);
});

console.log(`\n📝 Summary:`);
console.log(`   Created: ${posts2010.length} posts`);
console.log(`   Year: 2010`);
console.log(`   Topics: CubeSat, test equipment, power systems, thermal management`);