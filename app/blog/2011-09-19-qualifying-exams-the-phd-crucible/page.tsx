import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-09-20"
      title="Qualifying Exams: The PhD Crucible"
      summary="Survived the electrical engineering PhD qualifying exams at Stanford. Two days of pure academic trial by fire. Still shaking, but I passed."
      content={`Just walked out of the second day of PhD qualifying exams. My hands are still shaking from adrenaline and excessive caffeine. Two days, four exams, covering everything from electromagnetics to signal processing. The infamous Stanford EE quals - where dreams go to die or get forged into determination. I survived.

## The Beast Unveiled

Stanford EE Quals structure:
- 4 exams over 2 days
- 3 hours each
- Choose 4 from 10 topics
- Need to pass all 4
- One retake allowed
- Fail twice = goodbye PhD

Pass rate: ~70% first attempt.

## My Chosen Tortures

Selected based on strengths(?):
1. **Circuits and Devices**
2. **Digital Systems**  
3. **Signal Processing**
4. **Electromagnetics**

Avoided: Control Theory, Semiconductor Physics (nightmares).

## The Preparation Monastery

### 3 Months Out
Formed study group:
- 5 stressed PhD students
- Daily 4-hour sessions
- Rotated teaching topics
- Shared notes and pain

Study dungeon: EE basement, no windows.

### The Materials Mountain
- Previous exams: 10 years worth
- Textbooks: 12 doorstops
- Practice problems: 1000+
- Coffee consumed: Uncountable
- Anxiety level: ∞

### Study Strategy
\`\`\`python
while days_until_quals > 0:
    for topic in qual_topics:
        review_fundamentals(topic)
        solve_problems(topic, n=20)
        teach_others(topic)  # Best learning
        panic_slightly()
    
    days_until_quals -= 1
    stress_level *= 1.1
\`\`\`

## Day 1, Exam 1: Circuits and Devices

### 8:00 AM - The Beginning
Walk into room. 30 other victims. Professor smiles sadistically.

"You have 3 hours. Begin."

### Problem 1: Op-Amp Design
Design compensated op-amp with specs:
- Gain: 80dB
- Phase margin: 60°
- Power: 1mW
- Load: 10pF

*Deep breath. I know this.*

Drew circuit. Calculated transconductances. Derived transfer function. Added compensation capacitor. 45 minutes gone.

### Problem 2: Thermal Noise
Calculate total output noise of complex circuit.

*Every resistor is a noise source. Remember that.*

Noise power spectral densities. Integration over frequency. Forgot factor of 4kT. Caught it. Fixed it. Sweating.

### Problem 3: Switched Capacitor Filter
Design 5th order Butterworth.

*Thank god for study group practice.*

State variables. Charge conservation. Z-transform. Running out of time. Scribbling madly.

"Time. Pencils down."

### Post-Exam Autopsy
Comparing answers outside:
"What did you get for problem 2?"
"4.2 nV/√Hz"
"I got 4.8..."
"Shit."

## Day 1, Exam 2: Digital Systems

### 2:00 PM - Round Two
Still shaking from morning. More coffee. Bad idea.

### Problem 1: Cache Design
Design 2-way set associative cache:
- 64KB size
- 32-byte blocks
- LRU replacement

Drawing blocks. Calculating tag bits. Addressing logic. This is CS stuff but I'm managing.

### Problem 2: Verilog Implementation
Implement pipelined multiplier.

\`\`\`verilog
module pipelined_mult(
    input clk,
    input [15:0] a, b,
    output reg [31:0] product
);
    // Partial products
    reg [31:0] pp0, pp1, pp2, pp3;
    
    always @(posedge clk) begin
        // Pipeline stages
        pp0 <= a[3:0] * b;
        pp1 <= a[7:4] * b;
        // ... etc
    end
endmodule
\`\`\`

Hope this is right. Moving on.

### Problem 3: Timing Analysis
Critical path in complex circuit.

Setup time. Hold time. Clock skew. Propagation delays. So many subscripts. Brain melting.

"Time."

Stagger outside. Day 1 complete.

## The Longest Night

Can't sleep. Tomorrow is:
- Signal Processing (math heavy)
- Electromagnetics (physics heavy)

Study group meets at midnight. Desperate last-minute review.

"Remember, for Maxwell's equations..."
"Convolution in time is multiplication in frequency..."
"We're all going to die."

3 AM. Force myself to bed.

## Day 2, Exam 1: Signal Processing

### 8:00 AM - The Mathematical Onslaught

### Problem 1: Optimal Filter Design
Design Wiener filter for noisy signal.

*Okay. Minimize mean square error.*

Set up equations. Take derivatives. Set to zero. Matrix inversion. Why is there a complex conjugate here? Oh right, Hermitian.

### Problem 2: Spectral Estimation
Compare periodogram vs. Welch method.

Variance-bias tradeoff. Window functions. Overlap percentage. Drawing power spectral densities.

### Problem 3: Multirate DSP
Design decimation system.

Anti-aliasing filters. Noble identities. Polyphase decomposition. My hand is cramping.

"Time."

One more to go.

## Day 2, Exam 2: Electromagnetics

### 2:00 PM - The Final Boss

Room full of exhausted students. We look like zombies. Professor cheerful. Sadist.

### Problem 1: Waveguide Modes
Calculate cutoff frequencies for rectangular waveguide.

*Maxwell's equations. Boundary conditions. Separate variables.*

TE and TM modes. Bessel functions appearing. Why always Bessel functions?

### Problem 2: Antenna Array
Design phased array for beam steering.

Element spacing. Grating lobes. Array factor. Phase shifters. So tired. Keep writing.

### Problem 3: Transmission Lines
Matching network for complex load.

Smith chart! Blessed Smith chart. Rotating around. Adding stubs. Find the match. Please be right.

"Time. Congratulations on completing quals."

## The Aftermath

### Immediate
Walk outside. Sunlight feels alien. Other students:
- Crying (understandable)
- Laughing (hysteria)
- Sleeping on bench (smart)
- Calling parents (emotional)

### The Wait
Results in 2 weeks. Longest 2 weeks ever.

Daily routine:
1. Wake up in panic
2. Remember quals are over
3. Panic about results
4. Distract with research
5. Fail at distraction
6. Repeat

## Results Day

Email appears:
"Qualifier Results Available"

Heart rate: 200 BPM.

Click link. Load scores:
- Circuits: PASS
- Digital: PASS
- Signal Processing: PASS
- Electromagnetics: PASS

I PASSED ALL FOUR!

Immediate actions:
1. Call parents
2. Text study group
3. Buy beer
4. Sleep for 20 hours

## Reflection on the Ordeal

### What Quals Really Test
Not just knowledge:
- Pressure handling
- Time management
- Problem solving speed
- Mental endurance
- Will to continue

### Why This Matters
Quals are saying:
"Can you handle PhD pressure?"
"Do you have foundation?"
"Will you persevere?"

Apparently, yes.

### The Bonding
Study group became family:
- Shared trauma bonds
- Everyone passed!
- Friends for life
- Still have nightmares

## Advice for Future Victims

1. **Start early** - 3 months minimum
2. **Form study group** - Essential
3. **Do old exams** - Patterns exist
4. **Sleep before** - All-nighter = fail
5. **Trust preparation** - You know more than you think

## The Changed Person

Pre-quals me:
- Thought I knew basics
- Confident in knowledge
- Casual about fundamentals

Post-quals me:
- Know I know basics
- Humble about knowledge
- Fundamentals are sacred

## What's Next

With quals passed:
- Focus on research
- No more classes (mostly)
- Thesis proposal next
- Actual PhD work begins

The hazing is over. Time to contribute to human knowledge.

## Late Night Thought

It's 2 AM. Can't sleep (PTSD?). Thinking about those two days.

Quals aren't just an exam. They're a transformation. You go in a student. You come out... different. Harder. More focused. Ready.

They break you down to build you up. And somehow, I'm still standing.

## The Badge of Honor

"Passed Stanford EE Quals" on resume.
Those four words represent:
- 500 hours studying
- 12 hours of exams
- Infinite stress
- Proven capability

Worth every painful second.

Tomorrow: Back to research. Tonight: Celebrate survival.

The PhD continues. The worst is over. (Right? RIGHT?)

📚💀✅`}
      tags={["phd","quals","exams","stanford"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Qualifying Exams: The PhD Crucible - Michael D'Angelo",
    description: "Survived the electrical engineering PhD qualifying exams at Stanford. Two days of pure academic trial by fire. Still shaking, but I passed.",
  };
}