import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-04-12"
      title="Eagle CAD Tips: PCB Design Productivity Hacks"
      summary="Collection of Eagle CAD tricks learned through dozens of PCB designs. These shortcuts will save hours of tedious work."
      content={`After designing my 20th PCB this semester, I've collected some Eagle CAD productivity tips that transformed my workflow. Sharing these because good documentation is scarce.

## Essential User Language Programs (ULPs)

### 1. Autorouter Pre-Route
Before autorouting, run:
\`\`\`
run autorouter-setup
\`\`\`
Sets optimal parameters for 2-layer boards. Saves hours of manual tweaking.

### 2. BOM Generation
\`\`\`
run bom.ulp
\`\`\`
Exports formatted bill of materials with Digi-Key part numbers. No more manual spreadsheets!

### 3. 3D Package Generator
\`\`\`
run make-3d-package.ulp
\`\`\`
Creates 3D models from 2D footprints. Great for mechanical clearance checks.

## Keyboard Shortcuts That Matter

Memorize these or suffer:
- **Ripup + Ratsnest**: Alt+R, Alt+R (my most used combo)
- **Group Move**: Ctrl+Right Click (move multiple objects)
- **Change Width**: Right-click on trace (no menu diving)
- **Show/Hide Layers**: Click layer number (faster than checkboxes)
- **Copy with Rotate**: Ctrl+C, then right-click before placing

## Design Rule Mastery

### My Standard DRC
\`\`\`
Clearance: 8mil
Trace: 10mil minimum
Via: 0.3mm drill, 0.6mm diameter
Stop Mask: 4mil expansion
\`\`\`

### Special Rules
For high-current traces:
\`\`\`
class 1 power;
class 1 width 0.040;
\`\`\`

For differential pairs:
\`\`\`
class 2 differential;
class 2 clearance class 2 0.006;
\`\`\`

## Library Management

### Personal Library Structure
- **_MyPassives.lbr**: Common resistors/capacitors with verified footprints
- **_MyConnectors.lbr**: Connectors I actually use
- **_MyICs.lbr**: Chips with proven footprints
- **_MyMechanical.lbr**: Mounting holes, fiducials

The underscore puts them at the top of the list!

### Footprint Verification Ritual
1. Print 1:1 on paper
2. Place actual components
3. Check mechanical fit
4. Verify courtyard clearance
5. Add assembly drawing

Learned this after ordering boards with 0.5mm pitch instead of 0.65mm...

## Routing Strategies

### Power First
Always route in this order:
1. Power and ground (thick traces)
2. High-speed differential pairs
3. Critical signals (clocks, resets)
4. Everything else

### The Grid is Sacred
- Place components on 0.05" grid
- Route on 0.005" grid
- Vias on 0.025" grid

Makes manual cleanup much easier.

## Copper Pour Tricks

### Thermal Relief Settings
\`\`\`
Isolation: 0.012"
Thermal: 0.020"
Antipad: 125%
\`\`\`

Balances good connections with solderable pads.

### Multiple Ground Pours
For mixed signal boards:
- AGND on bottom
- DGND on top
- Connect at single point
- Use net classes to manage

## Version Control Integration

### Git-Friendly Settings
In eagle.rc:
\`\`\`
Option.BackupMode = 0
Option.AutoSaveInterval = 0
\`\`\`

Prevents backup files cluttering git.

### Meaningful Commits
- "Added USB section" ✓
- "Routed board" ✗
- "Fixed ground loop in audio section" ✓

## Common Mistakes to Avoid

1. **Forgetting paste layer on homemade stencils**
2. **Wrong pin 1 orientation on connectors**
3. **Traces too close to board edge**
4. **No mounting holes** (classic mistake)
5. **Text on copper layers** (gets manufactured as copper)

## Advanced Techniques

### Teardrop Pads
Strengthen via connections:
\`\`\`
run teardrops.ulp
\`\`\`

### Length Matching
For high-speed signals:
\`\`\`
run length-freq-ri.ulp
\`\`\`

### Panelization
For small boards:
\`\`\`
run panelize.ulp
\`\`\`

## My Eagle Workflow

1. Schematic capture (check ERC religiously)
2. Initial placement (functional blocks)
3. Critical routing (power, high-speed)
4. Autorouter for remaining (70% completion typical)
5. Manual cleanup (this is where the magic happens)
6. Copper pour
7. Silk screen cleanup
8. Generate Gerbers
9. Verify with online viewer
10. Order and pray

These tips cut my PCB design time in half. Eagle has quirks, but once you learn them, it's incredibly powerful. Now if only they'd fix the polygon rendering...`}
      tags={["eagle-cad","pcb-design","productivity","tips"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Eagle CAD Tips: PCB Design Productivity Hacks - Michael D'Angelo",
    description: "Collection of Eagle CAD tricks learned through dozens of PCB designs. These shortcuts will save hours of tedious work.",
  };
}