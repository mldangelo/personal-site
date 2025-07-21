import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-06-15"
      title="My First PCB Etching: Adventures in Ferric Chloride"
      summary="Transitioning from perfboard to custom PCBs using the toner transfer method. Spoiler: ventilation is important!"
      content={`Finally took the plunge into PCB etching after months of dealing with messy perfboard projects. Armed with a laser printer, glossy paper, and a bottle of ferric chloride, I set out to create my first custom PCB.

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

Next project: double-sided boards with vias. This is going to be interesting...`}
      tags={["pcb","etching","diy","electronics"]}
      readTime="12 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "My First PCB Etching: Adventures in Ferric Chloride - Michael D'Angelo",
    description: "Transitioning from perfboard to custom PCBs using the toner transfer method. Spoiler: ventilation is important!",
  };
}