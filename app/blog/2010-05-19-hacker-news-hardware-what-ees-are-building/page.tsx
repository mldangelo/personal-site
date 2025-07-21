import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-05-20"
      title="Hacker News Hardware: What EEs Are Building"
      summary="Surveying the hardware projects trending on Hacker News in 2010. From Arduino explosions to the dawn of Raspberry Pi rumors."
      content={`Been tracking hardware projects on Hacker News lately. The community is exploding with makers building amazing things. Here's what's trending in the EE/hardware space.

## The Arduino Revolution

Arduino has completely changed the game:
- **Barrier to entry**: Near zero
- **Community**: Incredible documentation
- **Libraries**: Someone's already solved your problem

Popular projects hitting the front page:
- Twitter-enabled coffee makers
- LED cubes (so many LED cubes)
- Home automation systems
- 3D printer controllers
- Quadcopter flight controllers

## The RepRap Movement

3D printing is having its moment:
- RepRap Mendel just released
- MakerBot selling kits
- Thingiverse growing exponentially

Built my own Mendel last month. Print quality is... artistic. But it WORKS!

## Open Source Hardware

Big shift happening:
- **SparkFun**: Leading the charge with OSHW
- **Adafruit**: Amazing tutorials and products
- **Dangerous Prototypes**: Bus Pirate changed debugging forever

The community sharing ethos from software is infecting hardware. Love it!

## Trending Topics

### Software Defined Radio (SDR)
USRP is expensive but RTL-SDR rumors are starting:
- $20 TV tuners as SDR receivers?
- GNU Radio getting easier
- Everyone wants to decode aircraft transponders

### ARM Processors
The Cortex-M3 is changing embedded:
- 32-bit processing for Arduino prices
- Real debugging (goodbye printf!)
- STM32 Discovery board for $10

### FPGAs Getting Accessible
- Papilio One making waves
- $50 FPGA boards appearing
- WebPack ISE now free for larger chips

## Cool Projects This Month

### 1. DIY Oscilloscope
Someone built a 100MHz scope for $200:
- FPGA + fast ADC
- USB to computer display
- Open source everything

### 2. Bitcoin Mining
New cryptocurrency thing called Bitcoin:
- People using GPUs to mine
- FPGA implementations starting
- Seems like a fad but interesting technically

### 3. Kinect Hacking
Microsoft's Kinect just got reverse engineered:
- Depth sensing for $150
- Open source drivers already
- Robotics applications exploding

## The Maker Movement

Hackerspaces popping up everywhere:
- Community workshops
- Shared expensive tools
- Knowledge exchange

Our local space just got a laser cutter. Game changer!

## What's Missing

Gaps in the ecosystem:
- **Good PCB design tutorials**: Eagle documentation is terrible
- **Analog expertise**: Everyone's doing digital
- **RF knowledge**: Still black magic to most
- **Power electronics**: Dangerously underrepresented

## Predictions

Based on current trends:
- ARM will eat 8-bit's lunch
- FPGAs will get Arduino-easy
- SDR will explode when cheap hardware arrives
- Some kind of "Raspberry Pi" computer board coming
- Hardware startups will be the next big thing

## My Contributions

Started contributing back:
- Posted my PLL tutorial (150 upvotes!)
- Shared FPGA starter guide
- Open sourced my function generator

The karma feels good!

## Business Opportunities

Seeing gaps that could be businesses:
- Better oscilloscope probes
- Modular test equipment
- Educational kits that don't suck
- Professional tools at hobbyist prices

## Community Wisdom

Best advice from HN hardware threads:
- "Buy a good scope first"
- "Current limiting saves parts"
- "Read the whole datasheet"
- "Measure twice, solder once"
- "When in doubt, add more capacitors"

## The Future

Hardware is having its "software moment":
- Barriers dropping
- Communities forming
- Tools improving
- Costs plummeting

Exciting time to be an EE. The convergence of accessible hardware, open source culture, and web communities is creating an explosion of innovation. Can't wait to see what next year brings!`}
      tags={["hacker-news","maker-movement","trends","community"]}
      readTime="12 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Hacker News Hardware: What EEs Are Building - Michael D'Angelo",
    description: "Surveying the hardware projects trending on Hacker News in 2010. From Arduino explosions to the dawn of Raspberry Pi rumors.",
  };
}