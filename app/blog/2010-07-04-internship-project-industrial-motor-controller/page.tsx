import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-07-05"
      title="Internship Project: Industrial Motor Controller"
      summary="My summer internship project - designing a three-phase motor controller for industrial automation. Real engineering with real consequences."
      content={`Started my summer internship at a local industrial automation company. My project: design a motor controller for their conveyor systems. No pressure - just don't burn down the factory!

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

Key takeaway: There's a huge difference between textbook knowledge and practical engineering. This internship is worth more than a whole semester of classes.`}
      tags={["internship","motor-control","power-electronics","industrial"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Internship Project: Industrial Motor Controller - Michael D'Angelo",
    description: "My summer internship project - designing a three-phase motor controller for industrial automation. Real engineering with real consequences.",
  };
}