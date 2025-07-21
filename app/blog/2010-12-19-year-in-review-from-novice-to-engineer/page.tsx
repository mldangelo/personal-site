import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-12-20"
      title="Year in Review: From Novice to Engineer"
      summary="Reflecting on 2010 - a year of growth from hobbyist to serious engineering student. Projects completed, lessons learned, and setting ambitious goals for 2011."
      content={`As 2010 comes to a close, I'm amazed at how much has changed. Started the year as a sophomore who could barely design a power supply. Ending it as a junior tackling DSP, control systems, and research projects.

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

Here's to 2011 - may it be filled with successful projects, minimal magic smoke, and at least some sleep!`}
      tags={["year-review","reflection","goals","personal"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Year in Review: From Novice to Engineer - Michael D'Angelo",
    description: "Reflecting on 2010 - a year of growth from hobbyist to serious engineering student. Projects completed, lessons learned, and setting ambitious goals for 2011.",
  };
}