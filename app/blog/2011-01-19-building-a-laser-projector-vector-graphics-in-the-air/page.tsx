import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-01-20"
      title="Building a Laser Projector: Vector Graphics in the Air"
      summary="Created a laser projector using galvanometers and an Arduino. Drawing vector graphics with light beams. The future of displays might be photons."
      content={`After seeing laser shows at concerts, I decided to build my own laser projector. Using salvaged galvanometers, a laser diode, and some clever programming, I can now draw vector graphics in mid-air. Warning: This project involves lasers. Safety first!

## The Concept

Unlike regular projectors (raster), laser projectors draw vectors:
- Point-to-point drawing
- No pixels, just paths
- Persistence of vision creates images
- Incredibly sharp at any size

Think of it as a very fast Etch-a-Sketch with light.

## Hardware Components

### Laser Source
- 5mW 532nm green laser module
- Green most visible to human eye
- TTL modulation capable
- Safety glasses mandatory!

### Galvanometers
Found old galvos from broken laser printer:
- 30,000 points per second capability
- ±20 degree deflection
- Closed-loop feedback
- Surprisingly accurate

### Driver Electronics
Built custom DAC for galvo control:
\`\`\`cpp
// 12-bit DAC control for X/Y position
void moveToPoint(int x, int y) {
    // Scale to DAC range (0-4095)
    uint16_t dac_x = map(x, -2048, 2048, 0, 4095);
    uint16_t dac_y = map(y, -2048, 2048, 0, 4095);
    
    // Send to DACs via SPI
    writeDACX(dac_x);
    writeDACY(dac_y);
    
    // Wait for galvos to settle
    delayMicroseconds(100);
}
\`\`\`

### Safety Interlock System
Because lasers are dangerous:
- Key switch for arming
- Emergency stop button
- Enclosure interlock
- Audible warning when active

## Software: ILDA File Support

Implementing industry standard ILDA format:
\`\`\`cpp
struct ILDAPoint {
    int16_t x;
    int16_t y;
    uint8_t status;  // Laser on/off, color
};

void playILDAFile(const char* filename) {
    File file = SD.open(filename);
    ILDAHeader header;
    file.read(&header, sizeof(header));
    
    for (int i = 0; i < header.numPoints; i++) {
        ILDAPoint point;
        file.read(&point, sizeof(point));
        
        moveToPoint(point.x, point.y);
        setLaserState(point.status & 0x40);
    }
}
\`\`\`

## Optimization Challenges

### Blanking
When moving between disconnected lines:
\`\`\`cpp
void drawLine(Point start, Point end) {
    // Turn off laser during repositioning
    laserOff();
    moveToPoint(start.x, start.y);
    delayMicroseconds(200);  // Settling time
    
    // Turn on and draw
    laserOn();
    interpolateLine(start, end);
}
\`\`\`

### Corner Dwelling
Sharp corners need extra time:
\`\`\`cpp
float calculateDwellTime(Point prev, Point curr, Point next) {
    float angle = calculateAngle(prev, curr, next);
    // Sharper angles need more dwell
    return map(angle, 0, 180, 500, 50);  // microseconds
}
\`\`\`

## Creating Content

### Text Rendering
Vector font engine:
\`\`\`cpp
void drawText(const char* text, int x, int y, float scale) {
    for (int i = 0; text[i]; i++) {
        VectorGlyph* glyph = getGlyph(text[i]);
        
        for (int j = 0; j < glyph->numStrokes; j++) {
            Stroke s = glyph->strokes[j];
            drawLine(
                {x + s.x1 * scale, y + s.y1 * scale},
                {x + s.x2 * scale, y + s.y2 * scale}
            );
        }
        
        x += glyph->width * scale;
    }
}
\`\`\`

### Animation System
Frame-based animation:
\`\`\`cpp
class LaserAnimation {
    std::vector<Frame> frames;
    int currentFrame = 0;
    uint32_t lastFrameTime = 0;
    
    void update() {
        if (millis() - lastFrameTime > frameDelay) {
            displayFrame(frames[currentFrame]);
            currentFrame = (currentFrame + 1) % frames.size();
            lastFrameTime = millis();
        }
    }
};
\`\`\`

## Cool Effects Achieved

### 3D Wireframe Cube
Rotating 3D cube projection:
- 3D to 2D transformation
- Hidden line removal
- Smooth rotation
- Mesmerizing to watch

### Audio Visualizer
Real-time frequency display:
- FFT of audio input
- Map to laser patterns
- Beat detection for effects
- Music becomes visual

### Lissajous Patterns
Classic laser show patterns:
- X = sin(a*t + δ)
- Y = sin(b*t)
- Varying frequency ratios
- Beautiful mathematical art

## Performance Metrics

Current system capabilities:
- 30,000 points/second
- 60 FPS for simple animations
- 15 FPS for complex scenes
- Flicker-free above 25 FPS

## Safety Lessons

What I learned (the hard way):
1. **Never look into beam** - Even reflections hurt
2. **Use safety glasses** - Specific to wavelength
3. **Enclosed beam path** - No accidental exposure
4. **Warning signs** - Legal requirement
5. **Interlock everything** - Multiple safety layers

## Public Display

Showed at maker faire:
- Kids loved it (behind safety glass)
- Drew custom messages on request
- "Can it play Asteroids?" (Yes!)
- Many "How to build" questions

## Future Improvements

- RGB laser for full color
- Faster galvos (60k pps)
- Beam effects (diffraction gratings)
- DMX control for shows
- Multiple projector sync

## Code Release

Open sourced everything:
- Hardware schematics
- Arduino firmware
- Python ILDA tools
- Safety guidelines
- Vector font library

GitHub: 200+ stars already!

## Lessons Learned

1. **Lasers demand respect** - Safety always first
2. **Analog control matters** - DAC quality shows
3. **Timing is critical** - Microseconds matter
4. **Less is more** - Simple patterns most effective
5. **Document safety** - Liability is real

## Applications Beyond Fun

Practical uses discovered:
- PCB exposure with UV laser
- Light painting photography
- Scientific visualization
- Architectural projection
- Emergency signaling

## The Magic Moment

First successful vector image drawn in air. Simple smiley face, but seeing it float in space, drawn by light itself... that's when you realize you're literally painting with photons.

We've come a long way from cave paintings.

Time to design more complex patterns. And maybe add that RGB upgrade...

⚡🔦✨`}
      tags={["laser","projector","optics","vector-graphics"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Building a Laser Projector: Vector Graphics in the Air - Michael D'Angelo",
    description: "Created a laser projector using galvanometers and an Arduino. Drawing vector graphics with light beams. The future of displays might be photons.",
  };
}