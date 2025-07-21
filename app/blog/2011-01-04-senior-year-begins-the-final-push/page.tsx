import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-01-05"
      title="Senior Year Begins: The Final Push"
      summary="Starting the last semester at UB with senior design, grad school applications, and the CubeSat launch approaching. The pressure is real."
      content={`Senior spring semester started today. The hallways feel different when you know it's your last time walking them as an undergrad. Between senior design, the CubeSat launch window, and grad school decisions, this is going to be intense.

## The Course Load

### EE 494: Senior Design Project
Our capstone project: An autonomous quadcopter for search and rescue. Team of four EE/CS students. We have one semester to go from concept to working prototype.

Requirements:
- Autonomous navigation
- Object detection (find red objects = victims)
- 20-minute flight time
- Return to home on low battery
- Total budget: $1,500

Already ordered parts. The living room looks like a drone factory exploded.

### EE 478: Advanced Digital Design
FPGA-based computer vision. Perfect timing with the quadcopter project. Topics include:
- High-speed image processing
- Hardware acceleration
- Pipeline optimization
- Real-time constraints

Professor is letting us use the new Virtex-6 boards. These things cost more than my car.

### EE 483: Integrated Circuit Design
Actually designing chips! Using Cadence tools to design a simple CMOS processor.
- Schematic capture
- Layout (so tedious)
- DRC/LVS checking
- SPICE simulation

Tapeout through MOSIS if our design passes review. Actual silicon!

### CSE 421: Operating Systems
Finally understanding what happens below main():
- Kernel development
- Device drivers
- Memory management
- Real-time scheduling

Building a basic RTOS for ARM. Relevant for everything embedded.

## CubeSat Update

Launch window confirmed: July 2011! After three years of work, our satellite will actually go to space. Current status:
- Flight hardware: 90% complete
- Software: Endless testing
- Documentation: NASA wants EVERYTHING documented
- Team morale: Cautiously optimistic

## Grad School Applications

Submitted applications to:
1. **MIT** - Media Lab, working on space systems
2. **Stanford** - EE department, focus on embedded systems
3. **Carnegie Mellon** - Robotics Institute
4. **Berkeley** - EECS, wireless systems
5. **Michigan** - Aerospace Engineering

GRE scores came back: 800Q/680V. Good enough? We'll see.

## Research Progress

Acoustic localization paper accepted to ICASSP 2011! First real publication. Professor wants me to present it in Prague. First conference, first international travel. Nervous but excited.

## Side Projects

Can't stop building:
1. **Software Defined Radio** - Finally got GNU Radio working with USRP
2. **Kinect Hacking** - Depth sensing for robot navigation
3. **Bitcoin Mining** - FPGA implementation getting 100 MH/s
4. **3D Printer Upgrades** - Dual extruder for dissolvable support

## Industry Interviews

Starting to interview for backup plans:
- SpaceX (systems engineering)
- Intel (CPU design)
- Qualcomm (wireless systems)
- Local defense contractors

The SpaceX interview was intense. Eight hours of technical questions. They really want people who can work 80-hour weeks.

## Time Management

Daily schedule is brutal:
- 6 AM: Gym (staying sane)
- 7-12: Classes
- 12-1: CubeSat team meeting
- 1-5: Senior design work
- 5-6: Dinner
- 6-10: Research/homework
- 10-12: Side projects

Weekends don't exist anymore.

## Reflection

Four years ago, I could barely solder. Now I'm designing satellites and teaching others. The imposter syndrome is real, but so is the progress.

This semester will determine the next phase of life. Grad school or industry? Academia or startups? Space or terrestrial? 

Whatever happens, I'm going to make these last months count. Time to push harder than ever.

The countdown begins: 4 months to graduation, 6 months to launch. Let's do this.`}
      tags={["university","senior-year","cubesat","grad-school"]}
      readTime="12 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Senior Year Begins: The Final Push - Michael D'Angelo",
    description: "Starting the last semester at UB with senior design, grad school applications, and the CubeSat launch approaching. The pressure is real.",
  };
}