import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-08-25"
      title="Building an FPGA Development Board"
      summary="Designing my own FPGA development board because commercial ones are too expensive. Learning why they cost so much!"
      content={`FPGA development boards cost hundreds of dollars. As a broke student, I decided to build my own. How hard could it be? (Spoiler: very hard)

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

Now I truly appreciate professional hardware design. Time to learn Verilog!`}
      tags={["fpga","pcb-design","hardware","high-speed"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Building an FPGA Development Board - Michael D'Angelo",
    description: "Designing my own FPGA development board because commercial ones are too expensive. Learning why they cost so much!",
  };
}