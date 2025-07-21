import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-11-01"
      title="Building a CNC Machine: Sophomore's Ambition"
      summary="Attempting to build a CNC router from scratch. Because manually routing PCBs is tedious and I clearly need more projects."
      content={`After hand-routing my 50th PCB trace, I decided to build a CNC machine. How hard could computer-controlled motors be? (Narrator: very hard)

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

Next project: 3D printer. Because I clearly haven't learned my lesson about mechanical projects!`}
      tags={["cnc","mechanical","pcb-milling","projects"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Building a CNC Machine: Sophomore's Ambition - Michael D'Angelo",
    description: "Attempting to build a CNC router from scratch. Because manually routing PCBs is tedious and I clearly need more projects.",
  };
}