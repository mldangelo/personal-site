import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Understanding Digital Logic: From Gates to Systems - Michael D'Angelo",
  description: "Deep dive into digital design - moving beyond basic gates to understanding complex digital systems and state machines.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-01-15-understanding-digital-logic-from-gates-to-systems">
        <header>
          <h1 className="text-4xl font-bold mb-4">Understanding Digital Logic: From Gates to Systems</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-01-15').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 10 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['digital-logic', 'education', 'fpga', 'verilog'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Started Digital Systems class this week, and it's like the scales fell from my eyes. We're moving beyond "this is an AND gate" to "this is how computers actually work." Mind = blown.</p>
          <h2>The Hierarchy of Digital Design</h2>
          <p>Professor started with this pyramid:</p>
          <ul>
            <li>Transistors (bottom)</li>
            <li>Gates</li>
            <li>Combinational Logic</li>
            <li>Sequential Logic</li>
            <li>Finite State Machines</li>
            <li>Processors (top)</li>
          </ul>
          <p>Last semester: Bottom two levels This semester: ALL THE LEVELS</p>
          <h2>Combinational vs Sequential: The Key Distinction</h2>
          <h3>Combinational Logic</h3>
          <p>Output depends only on current inputs. No memory, no history.</p>
          <p>Examples:</p>
          <ul>
            <li>Adders</li>
            <li>Multiplexers</li>
            <li>Decoders</li>
            <li>ALUs</li>
          </ul>
          <p>Built my first 4-bit adder this week. Just 20 gates to add two numbers. Then realized my calculator has millions of these. Perspective.</p>
          <h3>Sequential Logic</h3>
          <p>Output depends on inputs AND previous state. This is where magic happens.</p>
          <p>The revelation: Add memory to combinational logic = computer.</p>
          <p>Basic building block: The flip-flop</p>
          <ul>
            <li>Stores one bit</li>
            <li>Changes on clock edge</li>
            <li>Foundation of all memory</li>
          </ul>
          <h2>State Machines: How Computers Think</h2>
          <p>This week's lab: Design a vending machine controller.</p>
          <p>States:</p>
          <ul>
            <li>IDLE: Waiting for money</li>
            <li>FIVE: 5 cents deposited</li>
            <li>TEN: 10 cents deposited</li>
            <li>FIFTEEN: 15 cents deposited</li>
            <li>VEND: Dispense product</li>
          </ul>
          <p>My implementation:</p>
          <pre className="language-verilog"><code>{`always @(posedge clk) begin
    case (current_state)
        IDLE: if (nickel) next_state = FIVE;
              else if (dime) next_state = TEN;
        FIVE: if (nickel) next_state = TEN;
              else if (dime) next_state = FIFTEEN;
        // ... etc
    endcase
end`}</code></pre>
          <p>First time writing Verilog. It's weird but powerful.</p>
          <h2>The Clock: Heartbeat of Digital Systems</h2>
          <p>Everything synchronizes to the clock. Period.</p>
          <p>Key insights:</p>
          <ul>
            <li>Faster clock ≠ always better (power consumption)</li>
            <li>Setup and hold times are critical</li>
            <li>Clock skew can break everything</li>
            <li>Metastability is real and terrifying</li>
          </ul>
          <p>Built a 1MHz clock generator with 555 timer. Watched it on scope. That regular pulse controls EVERYTHING.</p>
          <h2>Timing Diagrams: The Language of Digital</h2>
          <p>Learning to read timing diagrams is like learning a new language. But once you can read them, you can debug anything.</p>
          <p>Example from this week's homework:</p>
          <pre className="language-text"><code>{`CLK  : _|‾|_|‾|_|‾|_|‾|_
D    : ____|‾‾‾‾‾|_____
Q    : ______|‾‾‾‾‾|___`}</code></pre>
          <p>D changes, but Q waits for clock edge. Sequential logic in action!</p>
          <h2>Real Implementation: FPGA Introduction</h2>
          <p>Holy crap. FPGAs are magic.</p>
          <ul>
            <li>Reconfigurable hardware</li>
            <li>Thousands of logic elements</li>
            <li>Build any digital circuit</li>
            <li>Change functionality in seconds</li>
          </ul>
          <p>Got to play with a Spartan-3 board. Implemented my vending machine. IT WORKED.</p>
          <p>The power: I designed hardware, not software. But changed it like software. Brain hurts (in a good way).</p>
          <h2>Practical Project: Binary Calculator</h2>
          <p>Weekend project: 4-bit binary calculator</p>
          <ul>
            <li>Two 4-bit inputs (DIP switches)</li>
            <li>Function select (ADD, SUB, AND, OR)</li>
            <li>5-bit output (LEDs)</li>
            <li>All combinational logic</li>
          </ul>
          <p>Used 74-series chips:</p>
          <ul>
            <li>74LS283: 4-bit adder</li>
            <li>74LS86: XOR gates (for subtraction)</li>
            <li>74LS08: AND gates</li>
            <li>74LS32: OR gates</li>
            <li>74LS157: Multiplexer (select function)</li>
          </ul>
          <p>Three breadboards. 200+ wires. 8 hours debugging. Worth it.</p>
          <h2>The Abstraction Layer Revelation</h2>
          <p>Each level abstracts the complexity below:</p>
          <ul>
            <li>Transistors: Analog beasts tamed into digital</li>
            <li>Gates: Hide transistor complexity</li>
            <li>Combinational: Hide gate complexity</li>
            <li>Sequential: Hide timing complexity</li>
            <li>FSMs: Hide state complexity</li>
            <li>Processors: Hide everything</li>
          </ul>
          <p>Engineering is abstraction. Mind = blown (again).</p>
          <h2>Common Pitfalls I Hit</h2>
          <p>1. <strong>Race Conditions</strong>: When signals race through different paths - Solution: Synchronize everything to clock</p>
          <p>2. <strong>Glitches</strong>: Brief unwanted outputs during transitions - Solution: Register outputs</p>
          <p>3. <strong>Fan-out Limits</strong>: One output driving too many inputs - Solution: Buffer gates</p>
          <p>4. <strong>Timing Violations</strong>: Signals changing too close to clock - Solution: Careful design, lots of simulation</p>
          <h2>Tools I\'m Learning</h2>
          <ul>
            <li><strong>Logisim</strong>: Circuit simulation (great for learning)</li>
            <li><strong>Verilog</strong>: Hardware description language</li>
            <li><strong>ModelSim</strong>: Industry-standard simulator</li>
            <li><strong>Xilinx ISE</strong>: FPGA development</li>
          </ul>
          <p>Steep learning curve, but powerful tools.</p>
          <h2>The \"Aha!\" Moments</h2>
          <p>1. <strong>Multiplication is just repeated addition</strong>: Built 4-bit multiplier, finally understood 2. <strong>Memory is just feedback</strong>: Connect output to input = storage 3. <strong>CPUs are just big state machines</strong>: Fetch, decode, execute, repeat 4. <strong>Everything is binary</strong>: Even analog at the bottom</p>
          <h2>Next Projects</h2>
          <p>1. <strong>8-bit CPU</strong>: Design simple processor from scratch 2. <strong>VGA Controller</strong>: Generate video signals 3. <strong>Digital Oscilloscope</strong>: Sample and display waveforms 4. <strong>Frequency Counter</strong>: Measure unknown signals</p>
          <h2>Why This Matters</h2>
          <p>Every electronic device has digital logic:</p>
          <ul>
            <li>Your phone: Billions of gates</li>
            <li>Your car: Dozens of microcontrollers</li>
            <li>Your microwave: Simple state machine</li>
            <li>Everything smart: Digital at its core</li>
          </ul>
          <p>Understanding this layer is crucial.</p>
          <h2>Study Tips for Digital Logic</h2>
          <p>1. <strong>Draw everything</strong>: Can't visualize? Can't understand 2. <strong>Build physically</strong>: Theory + practice = understanding 3. <strong>Simulate before building</strong>: Save time and components 4. <strong>Think in states</strong>: What state am I in? Where next? 5. <strong>Master timing</strong>: When matters as much as what</p>
          <h2>The Bigger Picture</h2>
          <p>Six months ago: "Computers are magic" Now: "Computers are complex but understandable" Future: "I can build a computer"</p>
          <p>This class is the bridge from electronics to computer engineering. Everything connects.</p>
          <p>To future students: This is where it gets hard but also where it gets amazing. Push through. The view from the top is worth it.</p>
          <p><em>Currently debugging my calculator. Why does 2+2=5? Check next post for the answer (spoiler: timing issue).</em></p>
        </div>
      </article>
    </>
  );
}