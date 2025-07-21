#!/usr/bin/env tsx
import { promises as fs } from 'fs';
import path from 'path';

interface BlogPost {
  date: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  readTime: string;
}

const posts2011Final: BlogPost[] = [
  {
    date: '2011-01-20',
    title: 'Building a Laser Projector: Vector Graphics in the Air',
    summary: 'Created a laser projector using galvanometers and an Arduino. Drawing vector graphics with light beams. The future of displays might be photons.',
    content: `After seeing laser shows at concerts, I decided to build my own laser projector. Using salvaged galvanometers, a laser diode, and some clever programming, I can now draw vector graphics in mid-air. Warning: This project involves lasers. Safety first!

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

⚡🔦✨`,
    tags: ['laser', 'projector', 'optics', 'vector-graphics'],
    readTime: '14 min',
  },
  {
    date: '2011-02-28',
    title: 'Android Development: Building My First App',
    summary: 'Finally diving into mobile development. Built an electronics reference app for Android. Java feels verbose after C, but the platform potential is huge.',
    content: `After years of embedded C programming, I'm finally learning Android development. Built my first real app - an electronics reference tool with calculators and component databases. The transition from bare metal to Java frameworks is jarring but exciting.

## Why Android?

- Open source platform
- Java (familiar from CS courses)
- Huge user base
- Hardware access APIs
- Eclipse IDE (free)

iOS requires Mac + $99. Android needs just Eclipse.

## The App Concept: EE Pocket Reference

Every EE student needs:
- Resistor color codes
- Ohm's law calculator
- Op-amp configurations
- Filter designers
- Component pinouts
- Formula reference

Perfect learning project!

## Setting Up Development

Getting started in 2011:
\`\`\`bash
# Install Android SDK
wget http://dl.google.com/android/android-sdk_r10-linux_86.tgz
tar -xzf android-sdk_r10-linux_86.tgz

# Install platforms
android update sdk --no-ui

# Eclipse + ADT plugin
# (So many manual steps...)
\`\`\`

Development feels primitive compared to modern tools.

## First Activity - Ohm's Law Calculator

\`\`\`java
public class OhmsLawActivity extends Activity {
    EditText voltageInput, currentInput, resistanceInput;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.ohms_law);
        
        voltageInput = (EditText) findViewById(R.id.voltage);
        currentInput = (EditText) findViewById(R.id.current);
        resistanceInput = (EditText) findViewById(R.id.resistance);
        
        // Add text watchers for real-time calculation
        TextWatcher watcher = new TextWatcher() {
            public void afterTextChanged(Editable s) {
                calculateMissing();
            }
            // Other methods...
        };
    }
    
    private void calculateMissing() {
        try {
            double v = parseOrZero(voltageInput);
            double i = parseOrZero(currentInput);
            double r = parseOrZero(resistanceInput);
            
            // Calculate missing value
            if (v == 0 && i > 0 && r > 0) {
                v = i * r;
                voltageInput.setText(String.format("%.3f", v));
            }
            // Similar for other combinations...
        } catch (Exception e) {
            // Handle errors gracefully
        }
    }
}
\`\`\`

## Resistor Color Code Decoder

Using camera for color detection:
\`\`\`java
public class ColorDecoder implements Camera.PreviewCallback {
    @Override
    public void onPreviewFrame(byte[] data, Camera camera) {
        // Convert YUV to RGB
        int[] rgb = convertYUV420_NV21toRGB8888(data, width, height);
        
        // Sample center region
        int centerColor = sampleCenterAverage(rgb);
        
        // Map to nearest resistor color
        ResistorColor band = findNearestColor(centerColor);
        updateBandDisplay(band);
    }
    
    private ResistorColor findNearestColor(int rgb) {
        // Color matching in HSV space
        float[] hsv = new float[3];
        Color.RGBToHSV(
            Color.red(rgb), 
            Color.green(rgb), 
            Color.blue(rgb), 
            hsv
        );
        
        // Find closest standard color
        ResistorColor closest = null;
        float minDistance = Float.MAX_VALUE;
        
        for (ResistorColor color : ResistorColor.values()) {
            float distance = colorDistance(hsv, color.hsv);
            if (distance < minDistance) {
                minDistance = distance;
                closest = color;
            }
        }
        
        return closest;
    }
}
\`\`\`

## Database of Components

SQLite for component storage:
\`\`\`java
public class ComponentDatabase extends SQLiteOpenHelper {
    private static final String CREATE_TABLE = 
        "CREATE TABLE components (" +
        "id INTEGER PRIMARY KEY," +
        "name TEXT NOT NULL," +
        "category TEXT," +
        "pinout TEXT," +
        "datasheet_url TEXT" +
        ")";
    
    public List<Component> searchComponents(String query) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.query(
            "components",
            null,
            "name LIKE ?",
            new String[]{"%" + query + "%"},
            null, null, "name"
        );
        
        List<Component> results = new ArrayList<>();
        while (cursor.moveToNext()) {
            results.add(componentFromCursor(cursor));
        }
        
        return results;
    }
}
\`\`\`

## Filter Design Tool

Interactive Butterworth filter designer:
\`\`\`java
public class FilterDesigner {
    public FilterResponse designLowpass(
        double cutoffFreq, 
        int order, 
        double sampleRate
    ) {
        // Calculate normalized frequency
        double wc = 2 * Math.PI * cutoffFreq / sampleRate;
        
        // Generate poles
        Complex[] poles = new Complex[order];
        for (int k = 0; k < order; k++) {
            double theta = Math.PI * (2*k + 1) / (2*order);
            poles[k] = new Complex(
                -Math.sin(theta), 
                Math.cos(theta)
            ).multiply(wc);
        }
        
        // Convert to transfer function
        return polesToTransferFunction(poles);
    }
}
\`\`\`

## Custom Views for Visualization

Drawing frequency response:
\`\`\`java
public class FrequencyResponseView extends View {
    private FilterResponse response;
    private Paint gridPaint, tracePaint;
    
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        
        // Draw grid
        drawLogGrid(canvas);
        
        // Draw magnitude response
        Path path = new Path();
        for (int x = 0; x < getWidth(); x++) {
            double freq = pixelToFreq(x);
            double mag = response.getMagnitudeDb(freq);
            float y = (float) magToPixel(mag);
            
            if (x == 0) {
                path.moveTo(x, y);
            } else {
                path.lineTo(x, y);
            }
        }
        
        canvas.drawPath(path, tracePaint);
    }
}
\`\`\`

## Dealing with Fragmentation

Supporting Android 2.1 to 2.3:
\`\`\`java
private void setupActionBar() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
        // Use ActionBar
        getActionBar().setDisplayHomeAsUpEnabled(true);
    } else {
        // Custom title bar for older versions
        requestWindowFeature(Window.FEATURE_CUSTOM_TITLE);
        setContentView(R.layout.main);
        getWindow().setFeatureInt(
            Window.FEATURE_CUSTOM_TITLE, 
            R.layout.custom_title
        );
    }
}
\`\`\`

## Publishing to Android Market

The submission process:
1. Generate signed APK
2. Create developer account ($25)
3. Upload APK and assets
4. Write description
5. Set price (free)
6. Publish!

Within hours: First download!

## Initial Reception

First week statistics:
- Downloads: 847
- Active installs: 312
- Ratings: 4.2 stars
- Crashes: 3 (fixed quickly)

Reviews:
- "Perfect for EE students!"
- "Resistor scanner needs work"
- "Add more calculators please"

## Lessons Learned

### Android Quirks
1. **UI thread is sacred** - Never block it
2. **Memory is limited** - Bitmaps kill apps
3. **Lifecycle is complex** - Handle rotation!
4. **Permissions matter** - Users are suspicious
5. **Test on real devices** - Emulator lies

### Java After C
- Garbage collection feels weird
- Objects everywhere
- Verbose but safer
- IDEs are powerful
- Libraries for everything

## Future Features Planned

Based on user feedback:
- 555 timer calculator
- Logic gate reference
- Arduino pinouts
- Circuit simulator (ambitious!)
- Cloud sync

## Monetization Thoughts

Currently free, but considering:
- Pro version ($1.99)
- No ads (I hate ads)
- Extra calculators
- Offline datasheets
- Support development

## The Bigger Picture

Mobile computing is the future:
- Everyone has a smartphone
- Always connected
- Sensors everywhere
- Computing in pocket
- Platform for innovation

## Final Thoughts

Building for Android taught me:
- Users expect polish
- Testing is crucial
- Feedback is gold
- Iterate quickly
- Ship early

From embedded systems to mobile apps - the transition is challenging but rewarding. Same problem-solving, different constraints.

Now excuse me, I have crash reports to fix and features to add. The users have spoken!

📱⚡💡`,
    tags: ['android', 'mobile', 'java', 'app-development'],
    readTime: '13 min',
  },
  {
    date: '2011-03-25',
    title: 'FPGA Bitcoin Mining: Racing Against ASICs',
    summary: 'Upgraded from GPU to FPGA mining. Getting 200 MH/s on a Spartan-6. The efficiency is incredible, but ASICs are coming. The mining arms race accelerates.',
    content: `GPU mining is becoming less profitable as difficulty skyrockets. Time to level up to FPGAs. Built a Spartan-6 based Bitcoin miner achieving 200 MH/s at only 40W. The efficiency gain is massive, but rumors of ASICs have everyone nervous.

## Why FPGAs?

GPUs are power hungry:
- Radeon 5870: 300 MH/s at 200W
- FPGA LX150: 200 MH/s at 40W
- 5x better MH/s per watt!

With rising difficulty, efficiency is everything.

## The Hardware

### Development Board
Using Digilent Nexys 3:
- Spartan-6 LX16 for testing
- Later: Custom board with LX150
- USB for communication
- Adequate cooling crucial

### Custom PCB Design
Built dedicated mining board:
- Spartan-6 LX150
- Efficient power supplies
- Proper thermal design
- JTAG for programming
- USB for work distribution

## The Mining Algorithm

SHA-256 in hardware is beautiful:
\`\`\`verilog
module sha256_transform(
    input clk,
    input [511:0] block,
    input [255:0] state_in,
    output reg [255:0] state_out,
    output reg done
);

// Expand message schedule
wire [31:0] W[0:63];
generate
    for (genvar i = 0; i < 16; i = i + 1) begin
        assign W[i] = block[511-32*i : 480-32*i];
    end
    
    for (genvar i = 16; i < 64; i = i + 1) begin
        assign W[i] = sigma1(W[i-2]) + W[i-7] + 
                       sigma0(W[i-15]) + W[i-16];
    end
endgenerate

// Pipeline the rounds
reg [31:0] a, b, c, d, e, f, g, h;
reg [6:0] round;

always @(posedge clk) begin
    if (round < 64) begin
        // SHA-256 round function
        t1 = h + Sigma1(e) + Ch(e,f,g) + K[round] + W[round];
        t2 = Sigma0(a) + Maj(a,b,c);
        
        h <= g;
        g <= f;
        f <= e;
        e <= d + t1;
        d <= c;
        c <= b;
        b <= a;
        a <= t1 + t2;
        
        round <= round + 1;
    end else begin
        done <= 1;
    end
end
\`\`\`

## Optimization Techniques

### Fully Unrolled Pipeline
Each round gets dedicated hardware:
\`\`\`verilog
// 128-deep pipeline for double SHA-256
sha256_round round0(.clk(clk), .a_in(a0), .b_in(b0), ...);
sha256_round round1(.clk(clk), .a_in(a1), .b_in(b1), ...);
// ... 126 more rounds

// New nonce every clock cycle!
\`\`\`

### Resource Sharing
Clever optimization for LUTs:
\`\`\`verilog
// Share adders between rounds
assign common_sum = e + Sigma1(e) + Ch(e,f,g);
assign t1_even = common_sum + K_even + W_even;
assign t1_odd = common_sum + K_odd + W_odd;

// Multiplexer is cheaper than duplicate adders
assign t1 = round[0] ? t1_odd : t1_even;
\`\`\`

## Mining Controller

Python host software:
\`\`\`python
class FPGAMiner:
    def __init__(self, port):
        self.fpga = serial.Serial(port, 115200)
        self.work_queue = Queue()
        
    def get_work(self):
        # Fetch from pool
        response = requests.get(POOL_URL + '/getwork')
        work = json.loads(response.text)
        
        # Extract midstate for optimization
        header = work['data'][:160]
        midstate = calculate_midstate(header)
        
        return {
            'midstate': midstate,
            'data': work['data'][128:256],
            'target': work['target']
        }
    
    def submit_nonce(self, nonce):
        # Build block header with found nonce
        # Submit to pool
        pass
    
    def mine(self):
        while True:
            work = self.get_work()
            
            # Send to FPGA
            self.fpga.write(work['midstate'])
            self.fpga.write(work['data'])
            
            # Wait for results
            if self.fpga.in_waiting:
                nonce = struct.unpack('<I', self.fpga.read(4))[0]
                self.submit_nonce(nonce)
\`\`\`

## Performance Results

### Single LX150
- Hash rate: 200 MH/s
- Power consumption: 40W
- Efficiency: 5 MH/J
- Cost: $200
- ROI: 180 days (at current difficulty)

### Quad-FPGA Rig
Built 4-FPGA cluster:
- Combined: 800 MH/s
- Total power: 180W
- More efficient than any GPU

## Thermal Management

FPGAs run hot when maxed out:
- Junction temperature: 85°C
- Added heatsinks and fans
- Underclocked slightly for stability
- Monitor temperature constantly

\`\`\`verilog
// Temperature monitoring
wire [11:0] temperature;
XADC xadc_inst (
    .DCLK(clk),
    .DEN(1'b1),
    .DADDR(7'h00),
    .DO(temperature)
);

// Thermal throttling
always @(posedge clk) begin
    if (temperature > TEMP_LIMIT) begin
        enable_mining <= 0;
    end
end
\`\`\`

## The ASIC Threat

Butterfly Labs announced ASIC miner:
- 1 TH/s claimed
- 1000W power
- $30,000 price
- Delivery "soon"

If real, FPGAs become obsolete overnight.

## Mining Pool Statistics

After one month:
- Shares submitted: 1,247,332
- Blocks found: 3 (lucky!)
- BTC earned: 167.3
- Electricity cost: $15
- Profit: $167 (BTC at $1)

Still profitable, but margins shrinking.

## Community Development

Open sourced the design:
- GitHub repo popular
- Others improving efficiency
- Collaborative optimization
- Racing against time

Someone achieved 220 MH/s with better pipelining!

## Lessons in Hardware Mining

1. **Efficiency is king** - Electricity costs kill profits
2. **First mover advantage** - Early adopters profit most
3. **Arms race inevitable** - Someone always has better hardware
4. **Open source helps** - Community optimization powerful
5. **Adaptability required** - Be ready to pivot

## The Economics

Current mining landscape:
- Network hashrate: 1.5 TH/s
- Difficulty: 434,877
- BTC/day with 200 MH/s: 0.3
- Days to mine one block solo: Never

Pool mining now mandatory.

## Future Plans

If ASICs arrive:
- Repurpose FPGAs for altcoins
- Litecoin uses scrypt (ASIC resistant)
- Or return to research projects
- FPGAs always useful

## Philosophical Thoughts

Bitcoin mining evolution:
1. CPU (2009): Everyone could mine
2. GPU (2010): Gamers had advantage
3. FPGA (2011): Engineers take over
4. ASIC (2012?): Corporations only

Decentralization → Centralization?

## Technical Skills Gained

This project taught:
- Advanced Verilog
- Pipeline optimization
- Thermal management
- Power optimization
- Economic modeling

Worth it for education alone.

## Final Verdict

FPGA mining in 2011:
- Still profitable
- Great learning experience
- Efficiency breakthrough
- But time limited
- ASICs will dominate

Riding the wave while it lasts. 167 BTC earned so far. At $1 each, barely covers hardware. But what if Bitcoin goes to $10? $100? 

The real value: Learning hardware acceleration. These skills apply beyond mining.

Time to optimize the pipeline one more time. Every MH/s counts in this race.

⛏️💰🏃‍♂️`,
    tags: ['bitcoin', 'fpga', 'mining', 'hardware-acceleration'],
    readTime: '15 min',
  },
  {
    date: '2011-04-10',
    title: 'Teaching Arduino Workshop: Spreading the Hardware Love',
    summary: 'Organized my first Arduino workshop for beginners. Watching people\'s eyes light up when their LED blinks is magical. Teaching might be as rewarding as building.',
    content: `Organized a free Arduino workshop at Stanford for complete beginners. Twenty students showed up, most had never programmed or built circuits before. Three hours later, everyone had blinking LEDs, and several were planning robots. Teaching is addictive.

## The Planning

Spent weeks preparing:
- 20 Arduino Uno boards
- Component kits for each student
- Printed handouts
- Progressive exercises
- Backup everything

Budget: $400 (self-funded)

## Workshop Structure

### Hour 1: Foundations
Started with absolute basics:
- What is Arduino?
- Installing IDE
- First program upload
- Understanding pins
- Safety basics

"This is a resistor. It resists."

### Hour 2: Building
Hands-on exercises:
1. LED blink (the hello world)
2. Button input
3. PWM brightness
4. Multiple LEDs
5. Simple patterns

### Hour 3: Creating
Final project - traffic light:
- Red, yellow, green LEDs
- Proper timing
- Button for pedestrian crossing
- Extra credit: buzzer

## The Magic Moments

### First Blink
"IT'S WORKING! I MADE IT BLINK!"
- Sarah, English major

That excitement never gets old.

### Understanding Click
"Wait, so the computer is telling the light what to do?"
"And I told the computer what to do!"
"So I'm controlling electricity with words?"
"...I'M A WIZARD!"

Exactly.

## Code Examples Used

Started dead simple:
\`\`\`cpp
// Lesson 1: The Simplest Program
void setup() {
    pinMode(13, OUTPUT);
}

void loop() {
    digitalWrite(13, HIGH);
    delay(1000);
    digitalWrite(13, LOW);
    delay(1000);
}
\`\`\`

Built complexity gradually:
\`\`\`cpp
// Lesson 5: Interactive Traffic Light
int carRed = 12;
int carYellow = 11;
int carGreen = 10;
int pedButton = 2;
int pedRed = 9;
int pedGreen = 8;

void setup() {
    pinMode(carRed, OUTPUT);
    pinMode(carYellow, OUTPUT);
    pinMode(carGreen, OUTPUT);
    pinMode(pedRed, OUTPUT);
    pinMode(pedGreen, OUTPUT);
    pinMode(pedButton, INPUT_PULLUP);
    
    // Start with car green, pedestrian red
    digitalWrite(carGreen, HIGH);
    digitalWrite(pedRed, HIGH);
}

void loop() {
    if (digitalRead(pedButton) == LOW) {
        // Pedestrian wants to cross
        changeLights();
        delay(10000);  // Cross time
        changeLights();
    }
}

void changeLights() {
    // Car green to yellow
    digitalWrite(carGreen, LOW);
    digitalWrite(carYellow, HIGH);
    delay(2000);
    
    // Car yellow to red
    digitalWrite(carYellow, LOW);
    digitalWrite(carRed, HIGH);
    delay(1000);
    
    // Pedestrian can walk
    digitalWrite(pedRed, LOW);
    digitalWrite(pedGreen, HIGH);
}
\`\`\`

## Common Stumbling Blocks

### "It's Not Working!"
Troubleshooting checklist:
1. Is it plugged in?
2. Right COM port?
3. Board selected?
4. LED polarity?
5. Code uploaded?

90% were connection issues.

### Breadboard Confusion
Many never used breadboards:
- Drew power rail diagrams
- Color-coded jumper wires
- "Rows are connected" mantra
- Hands-on practice crucial

### Syntax Errors
Common mistakes:
- Missing semicolons
- Case sensitivity
- Curly brace matching
- = vs ==

IDE error messages are cryptic for beginners.

## Unexpected Questions

"Can I make a robot?"
"Yes! Start with wheels and motors."

"Can it connect to internet?"
"Yes! WiFi shields exist."

"Can it hack things?"
"... Let's focus on LEDs today."

"Is this how real products work?"
"Often, yes! Prototypes especially."

## Success Stories

### The Artist
Sculpture student immediately saw possibilities:
"I can make interactive art!"
Now planning LED installation.

### The Pre-Med
"I could build medical devices!"
Excited about biosensor potential.

### The Entrepreneur
Already planning Kickstarter:
"Automated plant waterer!"
(Everyone has this idea)

## Materials Created

Shared everything online:
- Slide deck (CC licensed)
- Exercise handouts
- Parts list with sources
- Video tutorials
- Follow-up resources

Downloaded 500+ times!

## Feedback Received

Anonymous survey results:
- "Best workshop ever" - 12
- "Finally understand programming" - 8
- "Want advanced workshop" - 15
- "Life-changing" - 3

Average rating: 4.8/5

## Lessons Learned Teaching

1. **Start simpler than simple**
2. **Physical results motivate**
3. **Debugging teaches most**
4. **Patience is crucial**
5. **Enthusiasm is contagious**

## The Follow-Up

Created mailing list:
- Weekly challenges
- Project showcases
- Group debugging
- Advanced topics

Half still active after month!

## Impact Beyond Workshop

Unexpected outcomes:
- Two students changed majors to EE
- Study group formed
- Maker space usage increased
- More workshops requested
- Department noticed

## Personal Reflection

Teaching revelations:
- Explaining solidifies understanding
- Beginners ask best questions
- Fresh perspectives valuable
- Patience muscle developed
- Joy is transferable

## Workshop 2.0 Plans

Based on feedback:
- Longer session (6 hours)
- More components
- Take-home kits
- Advanced track option
- Online follow-up course

## The Economics

Cost breakdown:
- Arduinos: $20 × 20 = $400
- Components: $5 × 20 = $100
- Printing: $50
- Total: $550
- Donations received: $200
- Net cost: $350

Worth every penny for impact.

## Scaling Thoughts

How to reach more people:
- Video series
- Online simulator
- Kit partnerships
- University funding
- Corporate sponsorship

Goal: 1000 students in 2012.

## The Bigger Picture

Why this matters:
- Democratizing technology
- Building confidence
- Creating makers
- Inspiring innovation
- Changing lives

One blinking LED at a time.

## Final Memory

Workshop ending, student approaches:
"I'm 45, majoring in history. Always thought technology was beyond me. Today, I made a computer do something. Thank you for showing me I'm not too old or too dumb to learn this."

Who's cutting onions in here?

## Call to Action

If you know Arduino:
- Teach someone
- Share knowledge
- Be patient
- Spread joy
- Change lives

The world needs more makers.

Next workshop: Advanced Arduino - Sensors and Servos. Already full.

Time to order more components...

🎓💡👥`,
    tags: ['arduino', 'teaching', 'workshop', 'education'],
    readTime: '12 min',
  },
  {
    date: '2011-05-15',
    title: 'Senior Design Demo Day: The Final Presentation',
    summary: 'Today we demonstrated our autonomous quadcopter to judges, professors, and industry representatives. Everything that could go wrong did. We still won second place.',
    content: `Senior Design Demo Day - the culmination of two semesters of work. Our autonomous search-and-rescue quadcopter was ready (mostly). The demo gods, however, had other plans. Here's how we turned disaster into second place.

## The Setup

Buffalo's Center for the Arts, 8 AM:
- 15 teams presenting
- Industry judges arriving
- Parents with cameras
- Our quadcopter in pieces

Last night's "final test" revealed motor mount crack.

## Emergency Repairs

### 7:00 AM - Problem Discovery
Motor mount fracture. No flight without fix.

### 7:30 AM - Hardware Store Run
Bought entire aisle of epoxy.

### 8:00 AM - Field Surgery
Team roles:
- Jake: Mixing epoxy
- Sarah: Holding pieces
- Ahmed: Hair dryer for curing
- Me: Praying

### 8:45 AM - Test Hover
It flies! Sort of. Vibration concerning.

"It'll hold for demo," Sarah says.
Narrator: It would not.

## The Presentation Slot

### 10:30 AM - Our Turn
Judges approach. Deep breaths.

"Tell us about your project."

The pitch:
- Autonomous search and rescue
- Computer vision for victim detection
- GPS waypoint navigation
- Return-to-home on battery low
- $1,200 budget

Judges intrigued.

## Demo Attempt #1

"Let's see it fly."

Power on. Motors spin. Liftoff!

Two feet up: CRACK.

Motor mount fails. Quadcopter tilts.
Emergency kill switch. Crash landing.

Silence.

"Well, that's unfortunate," judge says.

## The Recovery

### Quick Assessment
- Motor mount completely separated
- No structural damage
- Electronics intact
- 20 minutes until next slot

### Team Huddle
"We can fix this."
"With what?"
"Zip ties and hope."

### MacGyver Mode
- Zip ties as motor mount
- Duct tape reinforcement
- Weight rebalancing
- Code adjustment for vibration

## Demo Attempt #2

### 11:00 AM - Second Chance
Judges return, skeptical.

"Ready to try again?"

Power on. Gentler throttle.
It rises. It hovers. IT'S STABLE!

"Now show autonomous features."

## The Working Demo

### GPS Hold
Flip switch. Quadcopter locks position.
Wind gust. Compensates perfectly.
Judges nod approvingly.

### Obstacle Detection
Ultrasonic sensors working.
Approaches wall, stops, hovers.
"Impressive reaction time."

### Vision System
Red blanket on ground (victim).
Camera feed on laptop.
"TARGET DETECTED" overlay appears.
Quadcopter descends, hovers over target.

### Return to Home
Battery warning triggered.
Autonomous flight back.
Perfect landing at start point.

Applause!

## Technical Deep Dive for Judges

Explained our innovations:

### Control System
\`\`\`cpp
// Cascaded PID with feedforward
attitude_error = desired_attitude - current_attitude;
rate_command = kp_att * attitude_error + 
               kd_att * (attitude_error - last_error) +
               feedforward_rate;

rate_error = rate_command - current_rate;
motor_command = kp_rate * rate_error + 
                ki_rate * integral_rate_error +
                kd_rate * rate_derivative;
\`\`\`

### Vision Processing
\`\`\`python
# Real-time victim detection
def detect_victim(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    # Red color threshold
    mask = cv2.inRange(hsv, lower_red, upper_red)
    
    # Morphological ops
    kernel = np.ones((5,5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL)
    
    # Largest red blob = victim
    if contours:
        victim = max(contours, key=cv2.contourArea)
        return cv2.boundingRect(victim)
\`\`\`

Judges asking technical questions. Good sign!

## Other Teams' Projects

Tough competition:
- Solar panel optimizer (winner)
- Prosthetic hand controller
- Water quality monitor
- Smart traffic system
- Gesture-controlled wheelchair

All impressive. Winning uncertain.

## The Waiting

Judges deliberating. Teams nervous.
Replaying demo in heads.
"Should have used Loctite."
"Zip ties saved us."
"Did you see judge smile?"

## Results Announcement

### Third Place
"Smart Traffic Management System"

### Second Place
"Autonomous Search and Rescue Quadcopter"

WE PLACED! Despite catastrophic failure!

### First Place
"Maximum Power Point Tracking for Solar Arrays"
(Deserved. Thing was flawless.)

## Judges' Feedback

What they liked:
- Recovery from failure
- Technical complexity
- Real-world application
- Team problem-solving
- Working computer vision

What needs improvement:
- Mechanical robustness (obviously)
- Flight time (18 minutes)
- Weather resistance
- Cost reduction

## Lessons from Demo Day

1. **Murphy's Law is real** - Plan for failure
2. **Field repairs crucial** - Bring everything
3. **Team chemistry matters** - Stayed calm
4. **Story sells** - Recovery impressed judges
5. **Documentation helps** - Videos saved us

## The Aftermath

### Industry Interest
Two judges approached:
- Defense contractor wants details
- Startup founder exchanged cards
- "Ever considered commercializing?"

### Professor's Comment
"Best recovery I've seen in 10 years. That's real engineering - solving problems under pressure."

### Parent Reactions
My mom: "Why did it break?"
"Because that's what prototypes do."
"But you fixed it!"
"That's what engineers do."

## Technical Postmortem

What actually failed:
- 3D printed PLA motor mount
- Layer adhesion issue
- Vibration fatigue
- Should have been ABS
- Or aluminum

Fix for future:
- CNC machined mounts
- Vibration dampening
- Redundant attachment
- Better material choice

## Team Reflection

Pizza celebration that night:
- Exhausted but proud
- Second place feels like victory
- Bonds forged in crisis
- Already planning improvements
- Might continue post-graduation

## Impact on Future

This project opened doors:
- Resume highlight
- Interview stories
- Technical confidence
- Problem-solving proof
- Team experience

## The Real Win

Not the place or prize.
The real win:
- Built something that flies
- Solved hard problems
- Recovered from failure
- Worked as team
- Inspired others

One parent said: "My daughter wants to be an engineer now after seeing your presentation."

That's the real victory.

## Final Thoughts

Senior Design teaches more than technical skills. It teaches perseverance, teamwork, and grace under pressure.

Our quadcopter broke spectacularly. We fixed it with zip ties. It flew again. We placed second.

That's engineering in its purest form.

To future teams: Your demo will fail. Have zip ties ready. Keep calm. Solve the problem. Tell the story.

The judges aren't just evaluating your project. They're evaluating future engineers.

Show them what you're made of.

🚁🔧🏆`,
    tags: ['senior-design', 'demo-day', 'quadcopter', 'presentation'],
    readTime: '14 min',
  },
  {
    date: '2011-07-15',
    title: 'West Coast Electronics Surplus: Paradise Found',
    summary: 'Discovered Silicon Valley\'s electronic surplus stores. Halted Electronics, Weird Stuff Warehouse, and others. It\'s like Disneyland for hardware hackers.',
    content: `Coming from Buffalo where RadioShack was our only option, discovering Silicon Valley's electronic surplus stores blew my mind. Warehouses full of components, test equipment, and weird tech from defunct startups. I may have a problem.

## The Pilgrimage Begins

Lab mate mentioned Halted Electronics (HSC).
"It's dangerous. Bring cash. Leave credit cards."
"How dangerous?"
"I went for resistors. Spent $300."

Challenge accepted.

## Halted Electronics (Santa Clara)

### First Impressions
Walking in: Sensory overload.
- Bins of components everywhere
- That distinctive electronics smell
- Oscilloscopes stacked high
- Engineers wandering in daze

### The Treasures Found
My first haul:
- HP 1740A oscilloscope ($50!)
- 500 servo motors ($0.50 each)
- Box of 7400 series logic
- Nixie tubes (!!!)
- Mystery box labeled "RF stuff"

Total damage: $147
Total value: Priceless

### The Experience
Overheard conversations:
"Is this from the Apollo program?"
"I haven't seen these since the 70s!"
"My startup used these..."
"One man's trash..."

## Weird Stuff Warehouse (Sunnyvale)

### The Mecca
If Halted is church, Weird Stuff is the Vatican.
- 30,000 square feet
- Silicon Valley history museum
- Dot-com boom remnants
- "As-is" section (dangerous)

### Notable Finds
- Sun SparcStation ($20)
- SGI Indigo ($40)
- Cray CPU module (display piece)
- 1000 Ethernet cables ($10)
- Vintage HP calculators

### The Stories
Each item has history:
- "From Netscape's office"
- "Google's first servers"
- "Failed startup #4,827"

Silicon Valley archaeology.

## Anchor Electronics (Santa Clara)

### The Organized One
Unlike others, actually organized:
- Components in labeled drawers
- Prices clearly marked
- Staff knows location of everything
- Still has through-hole parts!

### Best For
- When you need specific part
- Quality components
- Helpful staff
- Not cheapest but reliable

## Action Electronics (Santa Clara)

### The Hidden Gem
Smaller but curated:
- High-end test equipment
- Military surplus
- Rare semiconductors
- Reasonable prices

Scored Tektronix 2465B scope for $200!

## The Surplus Culture

### Types of Shoppers

**The Regular**
Knows every employee.
"Steve, got any 2N3904s today?"
First name basis.

**The Tourist** (Me)
Wide-eyed wonder.
Buying everything.
Taking photos.

**The Specific Seeker**
"I need a left-handed framistan."
Actually finds it.

**The Recycler**
Selling old equipment.
Circle of life.

## Survival Strategies

### Set a Budget
- Bring cash only
- Leave when depleted
- ATM is the enemy

### Make Lists
- What you need
- What you want
- What you'll impulse buy anyway

### Time Management
- Allocate 3 hours minimum
- You will lose track
- Set phone alarms

## Epic Finds

### The Motherload
One Saturday, found:
- HP 8566B spectrum analyzer ($300)
- Working electron microscope ($500)
- Box of 1000 LEDs ($5)
- Vintage Altair 8800 (priceless)

Rented truck to haul home.

## The Dark Side

### Storage Crisis
Apartment becoming warehouse:
- "I'll use this someday"
- Boxes stacked to ceiling
- Roommate concerned
- Intervention threatened

### Project Queue
- 47 project ideas
- 3 actually started
- 0 completed
- ∞ more planned

## Community Aspect

### Knowledge Exchange
Random conversations invaluable:
"What's this do?"
"Oh, that's from missile guidance system."
"Want to grab coffee and discuss?"

New friendship formed.

### The Regulars
Characters you meet:
- Retired HP engineer (fountain of knowledge)
- Artist using electronics
- Startup founders scrapping
- Students like me (poor but enthusiastic)

## Online Extension

When stores closed:
- eBay (dangerous at 2 AM)
- Craigslist (adventure time)
- University surplus auctions
- Government auctions

Addiction has many forms.

## Impact on Projects

Surplus shopping enables:
- Projects impossible otherwise
- Experimentation freedom
- Learning through exploration
- "What if I..." moments

## The Economics

Rough calculations:
- Spent: $2,000 (year one)
- Retail value: $20,000+
- Projects enabled: Countless
- Education value: Immeasurable
- Storage unit: Now required

## Tips for Newbies

1. **Start small** - One store per trip
2. **Research prices** - Know good deals
3. **Test equipment** - Bring multimeter
4. **Ask questions** - People love sharing
5. **Check return policy** - Usually none

## Cultural Significance

These stores are:
- Silicon Valley museums
- Startup graveyards
- Engineer social clubs
- Inspiration sources
- Addiction enablers

## The Philosophy

Surplus shopping embodies:
- Recycling/sustainability
- Knowledge preservation
- Community building
- Affordable innovation
- Hacker culture

## Future Concerns

Worried trends:
- Stores closing (high rent)
- Moving online only
- Less interesting stock
- Corporate recyclers winning
- Culture dying

Must preserve these treasures!

## The Perfect Saturday

My routine:
1. Coffee and list-making
2. Halted Electronics (components)
3. Weird Stuff (exploration)
4. Lunch with findings
5. Anchor (specific needs)
6. Home to sort treasures
7. Dream of projects

## Final Thoughts

Silicon Valley surplus stores aren't just shops - they're churches of the hardware hacking religion. Where else can you buy parts from the Space Shuttle, chat with the engineer who designed them, and walk out with inspiration for ten new projects?

My name is Mike, and I'm a surplus addict.

The first step is admitting you have a problem.
The second step is driving to Halted.

See you in the aisles! 🛒🔧✨`,
    tags: ['surplus', 'silicon-valley', 'shopping', 'hardware'],
    readTime: '13 min',
  },
  {
    date: '2011-09-15',
    title: 'Publishing First IEEE Paper: From Research to Publication',
    summary: 'Our energy harvesting paper was accepted to IEEE! The journey from research to publication is long and humbling. Peer review is brutal but necessary.',
    content: `Just received the email: "We are pleased to inform you that your paper has been accepted for publication in IEEE Transactions on Circuits and Systems." First journal publication! The journey from lab bench to prestigious journal was longer and harder than expected.

## The Paper

Title: "A Multi-Source Ambient Energy Harvesting System with Adaptive Source Combining for Wireless Sensor Nodes"

Eight pages of dense technical content representing 18 months of work.

## The Research Journey

### Initial Failure (Months 1-6)
- Single source harvesting
- Never exceeded 500 μW
- Advisor disappointed
- Confidence shaken

### Breakthrough (Month 7)
- Idea during bike ride
- Multiple sources combined
- Adaptive algorithm
- Finally hit 1 mW!

### Verification (Months 8-12)
- Extensive testing
- Statistical validation
- Real-world deployment
- Reproducible results

## Writing Process

### First Draft
Two weeks of writing:
- 15 pages (too long)
- 127 references (too many)
- Passive voice everywhere
- Imposter syndrome maximum

### Advisor Feedback
Red ink massacre:
- "Unclear"
- "Why?"
- "Evidence?"
- "Rewrite entirely"

Brutal but necessary.

### Revisions
Version history:
- v1_initial.tex
- v2_after_advisor.tex
- v3_clarity.tex
- ...
- v47_final_maybe.tex
- v48_final_FINAL.tex
- v49_final_FINAL_v2.tex

## IEEE Submission

### Formatting Hell
IEEE requirements:
- Specific LaTeX template
- Exact column width
- Figure placement rules
- Reference format precise

Three days just formatting.

### The Submission
February 15, 11:58 PM:
- PDF generated
- Figures checked
- Abstract perfected
- Submit clicked
- Immediately found typo

## Peer Review Process

### The Wait
- Submitted: February
- Under review: March
- Still under review: April
- Still under review: May
- Anxiety: Increasing

### First Reviews (June)
Three reviewers:

**Reviewer 1**: Positive
"Novel approach to multi-source harvesting. Well-written. Minor revisions needed."

**Reviewer 2**: Critical
"Insufficient comparison with prior work. Mathematical derivation unclear. Major revisions required."

**Reviewer 3**: Harsh
"Contribution unclear. Why not use batteries? Experimental setup questionable."

Emotional rollercoaster.

## Major Revision

### Addressing Concerns
Two months of:
- Additional experiments
- Mathematical proofs
- 20 more references
- Complete rewrite of sections

### Response Letter
10 pages addressing every comment:
"We thank the reviewer for this insightful comment. We have addressed this by..."

Diplomatic writing at its finest.

### Resubmission
New version:
- 30% longer
- Clearer contributions
- More rigorous proofs
- Better comparisons

## Second Review Round

### The Verdict (September)
**Reviewer 1**: "Much improved. Accept."

**Reviewer 2**: "Authors addressed my concerns. Accept with minor revisions."

**Reviewer 3**: "Better but still skeptical. However, work is technically sound. Accept."

ACCEPTED!

## Final Preparations

### Copy Editing
IEEE's copy editor found:
- Inconsistent units
- Reference errors
- Grammar issues
- Figure quality problems

Another week of fixes.

### Proofs
Final PDF proof:
- Name spelled correctly ✓
- Affiliation correct ✓
- Figures look good ✓
- Equations formatted ✓

Signed off with trembling hands.

## Publication Day

October issue live:
- Downloaded PDF
- Sent to parents
- Posted on website
- Shared with lab
- Frame-worthy moment

## Impact Tracking

First month:
- Downloads: 127
- Citations: 0 (too early)
- Emails: 3 (questions)
- Implementation requests: 2

Small but meaningful start.

## Lessons Learned

### About Research
1. **Persistence essential** - First ideas usually fail
2. **Document everything** - You'll forget
3. **Reproducibility crucial** - Others must verify
4. **Collaboration helps** - Fresh perspectives

### About Writing
1. **Start early** - Writing takes forever
2. **Accept criticism** - Reviewers improve paper
3. **Clear > clever** - Communicate simply
4. **Figures matter** - Worth 1000 words

### About Academia
1. **Peer review works** - But it's brutal
2. **Patience required** - Everything takes months
3. **Networking matters** - Know your field
4. **Celebrate wins** - They're rare

## The Real Impact

Beyond the publication:
- Confidence boost
- Advisor impressed
- CV enhanced
- Skills developed
- Network expanded

## Advice for First-Timers

1. **Pick right venue** - Match paper to journal
2. **Read that journal** - Understand expectations
3. **Get feedback early** - Before submission
4. **Prepare for rejection** - It's normal
5. **Persist** - Revision not rejection

## The Bigger Picture

This paper represents:
- Countless failed experiments
- Late nights debugging
- Mathematical struggles
- Writing and rewriting
- Growth as researcher

One line on CV. Months of life.

## Future Papers

Already planning next:
- Conference paper (faster)
- Journal extension
- New research direction
- Collaboration opportunities

First paper hardest. Gets easier?

## Celebration

How we celebrated:
- Lab dinner (advisor paid!)
- Nice wine bottle
- Framed first page
- Called home
- Slept well finally

## Final Reflection

Publishing in IEEE Transactions:
- Dream achieved ✓
- Imposter syndrome reduced
- Research validated
- Career advanced
- Next goal set

The email notification will forever be starred.

From "just a student" to "published researcher."

That's Dr. Student to you (eventually).

📚🎓📰`,
    tags: ['publication', 'ieee', 'research', 'academic-writing'],
    readTime: '14 min',
  },
  {
    date: '2011-10-20',
    title: 'The Great California Earthquake: First Major Quake Experience',
    summary: 'Experienced my first real California earthquake - 5.3 magnitude. Lab equipment everywhere. East Coast boy learns why everything is bolted down here.',
    content: `Was debugging energy harvester at 2:47 PM when the building started swaying. My first thought: "Did I cause a resonance?" Then the shaking intensified. My first real California earthquake - 5.3 magnitude. Welcome to the Ring of Fire.

## The Moment

### 2:47:13 PM
Slight vibration. Thought it was construction.

### 2:47:15 PM
Desk moving. Coffee sloshing.
"Is this...?"

### 2:47:17 PM
Everything shaking. Oscilloscopes walking off benches.
"EARTHQUAKE!"

### 2:47:25 PM
Still shaking. Longer than expected.
Under desk now.

### 2:47:35 PM
Shaking stops. Silence. Then everyone talking at once.

## Immediate Aftermath

### Lab Status
Survey of damage:
- Oscilloscope on floor (survived!)
- Components everywhere
- Chemical bottles fine (secured)
- Server racks still standing
- Coffee tragically spilled

### Human Status
Everyone okay but:
- International students terrified
- California natives calm
- Me: Adrenaline overdose
- One student still coding

"Did the earth move for you too?" - Professor, attempting humor

## The California Response

Watching natives vs newcomers:

**California Natives:**
- "That was a good one"
- "Maybe 5.0?"
- "Felt like roller"
- Back to work in 5 minutes

**Rest of Us:**
- "ARE WE GOING TO DIE?"
- "Was that the big one?"
- "Should we evacuate?"
- "I'm calling my mom"

## Learning Earthquake Protocol

What I did wrong:
1. Didn't drop immediately
2. Tried to save equipment
3. Ran for doorway (outdated)
4. Forgot aftermath procedures

Correct procedure:
1. Drop, Cover, Hold On
2. Stay under desk
3. Wait for shaking to stop
4. Check for injuries
5. Evacuate if damaged

## The Science

Quickly researched:
- Magnitude: 5.3
- Depth: 7.1 km
- Location: San Jose (20 miles away)
- Type: Strike-slip fault
- Aftershocks expected

Stanford seismometer data fascinating!

## Aftershock Adventures

### 4:15 PM - First Aftershock (3.2)
Jumped under desk.
Californians didn't even pause conversation.

### 6:30 PM - Another (2.8)
Starting to recognize P-waves vs S-waves.

### 11:45 PM - In Bed (3.5)
Apartment on third floor = more movement.
Sleep impossible.

## Earthquake Proofing

Next day's activities:

### Lab Securing
- Strapped down all equipment
- Secured chemical storage
- Anchored tall shelves
- Museum putty everywhere
- Backup data offsite

### Apartment Prep
- Water storage (1 gal/person/day)
- Emergency food
- First aid kit
- Flashlights and batteries
- Shoes by bed

Roommate: "Now you're Californian!"

## Cultural Observations

### Earthquake Stories
Everyone has them:
- "In '89 Loma Prieta..."
- "The Northridge quake..."
- "I was in Japan when..."

Bonding through seismic experience.

### Prediction Discussions
Ongoing debates:
- "We're overdue for big one"
- "Small quakes relieve pressure"
- "Animal behavior indicators"
- "My app predicted this"

Science vs folklore.

## Tech Response

Silicon Valley solutions:
- Earthquake apps downloaded
- Raspberry Pi seismometer projects
- "Uber for earthquake supplies"
- Kickstarter for quake-proof desk

Everything's a startup opportunity.

## The Paranoia Phase

Following week:
- Every truck is earthquake
- Constantly checking USGS
- Earthquake kit expanding
- Exit routes memorized
- Questioning life choices

"Why did I leave stable ground?"

## Research Impact

Unexpected benefits:
- Vibration data for harvesting!
- Natural frequency measurements
- Structural response data
- New research ideas

"When life gives you earthquakes, harvest energy?"

## Family Reactions

Called home:
"There was an earthquake!"
"Are you hurt?"
"No, I'm fine."
"Come home immediately."
"Mom, it's California..."
"Exactly!"

Explaining plate tectonics to worried parents.

## Preparation Improvements

Serious preparations made:
- Emergency contacts list
- Out-of-state contact person
- Meeting locations planned
- Go-bag packed
- Cloud backup everything

## The New Normal

Adaptation stages:
1. **Week 1**: Jump at everything
2. **Week 2**: Check USGS constantly  
3. **Month 1**: Casual about small ones
4. **Month 2**: "Was that a truck or quake?"
5. **Month 3**: "Wake me if it's over 6.0"

## Earthquake Engineering Appreciation

New respect for:
- Base isolation systems
- Tuned mass dampers
- Seismic retrofitting
- Building codes
- Civil engineers

Everything designed to sway, not break.

## The Philosophical Impact

Earthquakes teach:
- Impermanence
- Preparedness value
- Community importance
- Nature's power
- Engineering's role

Ground isn't solid. Mind blown.

## One Month Later

Life changes:
- Always aware of exits
- Equipment secured properly
- Emergency supplies maintained
- USGS bookmarked
- California resident confirmed

## Advice for East Coasters

If you move here:
1. **Take it seriously** - But don't panic
2. **Prepare properly** - Kit and plan
3. **Learn the science** - Understanding helps
4. **Trust the buildings** - Engineering works
5. **Keep perspective** - Driving more dangerous

## Final Thoughts

First earthquake survived. California initiation complete.

The earth moved. I survived. Equipment (mostly) survived.

Now I understand why Californians are so chill. When the ground itself is temporary, you learn to adapt.

Still prefer this to Buffalo blizzards.

But maybe I'll bolt down my coffee mug...

🌍🔨📊`,
    tags: ['earthquake', 'california', 'safety', 'experience'],
    readTime: '12 min',
  },
  {
    date: '2011-11-30',
    title: 'Black Friday Electronics Shopping: Silicon Valley Edition',
    summary: 'First Black Friday in Silicon Valley. Fry\'s Electronics at 4 AM is an experience. Scored incredible deals on components and test equipment. My wallet hurts but my lab is happy.',
    content: `Experienced my first Silicon Valley Black Friday. Camped outside Fry's Electronics from 2 AM with other engineers. The deals were legendary, the crowd was nerdy, and my credit card may never recover. But my home lab is now properly equipped!

## The Planning

Started researching weeks before:
- Fry's ad leaked online
- Oscilloscope for $299 (normally $899)
- Component grab bags
- Tool sets half off
- FPGA dev boards discounted

Made a spreadsheet. Of course.

## The Camping Experience

### 11 PM Thursday - Arrival
Fry's Palo Alto. Line already forming.
Engineers with camping chairs and laptops.
Someone brought a generator.

### 2 AM - The Crowd
Line discussions:
- "I need that Rigol scope"
- "Building a render farm"
- "My startup needs servers"
- "Just here for capacitors"

My people.

### 4 AM - Door Rush Strategy
Veterans sharing wisdom:
- "Oscilloscopes are in back"
- "Components in aisle 3"
- "Avoid center aisles"
- "Meet at Arduino display after"

Battle plans drawn on napkins.

## 5 AM - DOORS OPEN

### The Sprint
Full run to test equipment.
Grabbed cart. Strategy mode activated.

**Priority 1**: Rigol DS1054Z oscilloscope
Last one! Victory!

**Priority 2**: Hakko soldering station
Got FX-888D for $59

**Priority 3**: Component grab bags
10 bags of assorted parts

## The Haul

Final damage:
- Rigol scope: $299 (saved $600)
- Hakko station: $59 (saved $60)
- Fluke 87V: $199 (saved $150)
- Component bags: $50
- Arduino mega (5x): $75
- Raspberry Pi: $25
- Various tools: $100

Total: $807
Retail value: ~$2,000

## Fellow Shoppers

Met interesting people:

### The Veteran
"Been coming since 1985. You should have seen the CPU wars."
Cart full of servers.

### The Student
"Upgrading my entire lab!"
Budget exactly $500.

### The Startup Founder
"Cheaper than AWS for prototype."
Buying 20 hard drives.

### The Confused Dad
"My son wants an Arduino?"
Helped him find right one.

## Fry's Culture

Unique observations:
- Cashiers discussing technical specs
- Customers helping each other
- Impromptu tutorials in aisles
- Price matching smartphones
- Everyone happy despite chaos

## Post-Shopping Celebration

Denny's at 7 AM with new friends:
- Comparing purchases
- Trading components
- Planning projects
- Exchanging contacts
- Nerding out completely

"What are you building?"
"Everything now!"

## Setting Up New Lab

Spent weekend organizing:
- Scope pride of place
- Soldering station ready
- Components sorted
- Tools arranged
- Projects planned

Roommate: "It looks like a real lab now!"

## The Maker Community

Black Friday brought together:
- Students on budgets
- Professionals upgrading
- Hobbyists stocking up
- Startups bootstrapping
- Retirees building

All united by love of building.

## Online Jealousy

Posted haul photo online:
- "That scope for $299?!"
- "No fair, I paid full price"
- "California privileges"
- "Ship me one!"

Silicon Valley perks real.

## Buyer's Remorse?

Brief moment of "Did I spend too much?"

Then used new scope:
- 4 channels!
- 100 MHz bandwidth!
- Deep memory!
- Intensity grading!

Remorse cured instantly.

## Project Acceleration

New equipment enabled:
- Better measurements
- Faster debugging
- Professional results
- More complex projects
- Actual documentation

Investment in tools = investment in future.

## Tips for Next Year

Lessons learned:
1. **Research deeply** - Know exact locations
2. **Arrive early** - 2 AM minimum
3. **Bring friends** - Team shopping works
4. **Set budget** - Easy to overspend
5. **Check online too** - Some deals better

## The Economics

Justified purchases:
- Good tools last decades
- Time saved valuable
- Better results
- Professional development
- Resale value high

Not spending - investing.

## Community Building

Black Friday bonds:
- Still chat with line friends
- Component swapping group
- Project collaboration
- Annual tradition started

## Cultural Comparison

Buffalo vs Silicon Valley Black Friday:
- TVs vs Test Equipment
- Crowds vs Nerds
- Fighting vs Helping
- Returns vs Keeping forever

Different worlds.

## The Addiction

Already planning next year:
- Higher budget
- Better strategy
- Team formation
- Multiple stores
- Vacation day saved

## Philosophical Thoughts

Black Friday represents:
- Maker empowerment
- Tool accessibility
- Community gathering
- Dream enabling
- Future building

Not consumerism - investment in creation.

## Final Verdict

First Silicon Valley Black Friday:
- Exhausting but exhilarating
- Expensive but worthwhile
- Chaotic but organized
- Commercial but communal

Would do again 10/10.

## Year Later Update

That equipment:
- Used daily
- Enabled better research
- Paid for itself
- Still working perfectly
- Best investment ever

Sometimes money well spent is money saved.

To future Black Fridays: May your deals be deep, your lines be short, and your projects be awesome.

See you at Fry's at 2 AM! 🛍️🔧💸`,
    tags: ['black-friday', 'shopping', 'electronics', 'silicon-valley'],
    readTime: '12 min',
  },
  {
    date: '2011-12-15',
    title: 'End of First PhD Year: Lessons in Humility and Growth',
    summary: 'Completing first year of Stanford PhD. Survived quals, published paper, learned I know nothing. The transition from star undergrad to struggling grad student is complete.',
    content: `Submitting final grades for fall quarter marks the end of my first full year as a PhD student. 365 days ago I arrived confident from undergrad success. Now I know enough to know I know nothing. This is apparently progress.

## The Numbers

First year metrics:
- Courses taken: 9
- Quals passed: 4
- Papers published: 1
- Coffee consumed: ~2,000 cups
- Imposter syndrome level: ∞
- Things I thought I knew: 0

## Academic Evolution

### January: Confident Ignorance
"PhD will be like undergrad but harder"
Sweet summer child.

### March: First Reality Check
Machine Learning problem set.
Everyone solving in 2 hours.
Me: 2 days, still wrong.

### June: Quals Terror
Two days of exams.
Lifetime of stress.
Somehow passed.

### September: Research Frustration
Six months for 1 mW improvement.
"Is this worth a PhD?"
Advisor: "Welcome to research."

### December: Acceptance
I know nothing.
This is normal.
Maybe even good?

## Lessons in Humility

### Lesson 1: Undergrad Success ≠ Grad Success
Undergrad: "Follow instructions, get A"
PhD: "Find the questions first"

### Lesson 2: Everyone is Brilliant
Classmate casually mentions:
"In my Nature paper..."
"When I worked at Google..."
"My third startup..."

Me: "I made an LED blink once."

### Lesson 3: Research is 99% Failure
Failed experiments: 127
Successful ones: 3
Papers from success: 1
Character built: Immeasurable

### Lesson 4: Work-Life Balance is a Myth
"Take weekends off"
*Laughs in PhD student*

### Lesson 5: Advisor Relationship is Everything
Good advisor = survivable PhD
Bad advisor = ...transfer

Lucky to have good one.

## Technical Growth

### What I Thought I Knew
- Circuit design ✓
- Programming ✓
- Signal processing ✓
- How to learn ✓

### What I Actually Knew
- Circuit basics ✗
- Script kiddie level ✗
- FFT... sometimes ✗
- Nothing ✗

### What I Know Now
- Still basics, but deeper
- Actual software engineering
- Math behind the magic
- How to learn properly

## Research Reality

Expected research:
1. Have brilliant idea
2. Test idea
3. Publish groundbreaking paper
4. Change world

Actual research:
1. Read 100 papers
2. Have okay idea
3. Fail for 6 months
4. Tiny improvement
5. Maybe publish
6. Repeat

## The Social Aspect

### Making Friends
Hard when everyone's drowning.
But shared suffering bonds:
- Late night lab sessions
- Communal coffee runs
- Debugging parties
- Quals study groups

### Dating in PhD
"What do you do?"
"Energy harvesting research."
"..."
"I make tiny amounts of power from nothing!"
"..."
*Changes subject to weather*

## Financial Reality

PhD "salary": $38,000
Bay Area costs: $LOL
- Rent: $14,400
- Food: $6,000
- Coffee: $2,000
- Sanity: Priceless

Ramen proficiency: Expert level

## Mental Health Journey

### The Lows
- November: "Why am I here?"
- Advisor meeting failures
- Watching friends' salaries
- Endless literature reviews
- Equipment breaking at 2 AM

### The Highs
- First working prototype
- Paper acceptance
- Advisor's "Good work"
- Teaching moments
- Breakthrough at 3 AM

Rollercoaster doesn't describe it.

## Skills Developed

### Technical
- Deep debugging patience
- Mathematical rigor
- Writing clearly
- Presenting confidently
- Accepting criticism

### Personal
- Resilience
- Humility
- Persistence
- Coffee tolerance
- Existential crisis management

## Comparing to Friends

Undergrad friends now:
- Making $100k+
- Buying cars
- Taking vacations
- Having lives

Me:
- Making coffee nervous
- Debugging at midnight
- Vacation? What's that?
- Life = research

No regrets. Usually.

## The Support System

Couldn't survive without:
- Lab mates who understand
- Advisor who pushes appropriately
- Family who pretends to understand
- Coffee shop that knows my order
- Therapist (no shame)

## Looking Forward

Year 2 goals:
- Define thesis direction
- Publish 2 papers
- Maintain sanity
- Exercise occasionally
- Call parents more

Realistic? Time will tell.

## Advice to Past Self

Dear First Day Mike:
1. You don't know anything (good!)
2. Everyone struggles (normal!)
3. Progress isn't linear (expect waves)
4. Take care of yourself (seriously)
5. It gets better (then worse, then better)

P.S. - Buy more coffee

## The Transformation

First day: "I'm going to revolutionize energy harvesting!"
Today: "I improved efficiency by 0.1% and that's huge!"

Scope narrowed. Depth increased.

## Why Continue?

Valid question at 3 AM debugging.
Because:
- Problems fascinate me
- Learning addicts me
- Challenge drives me
- Impact motivates me
- Too stubborn to quit

## The Verdict

First year of PhD:
- Hardest thing ever done ✓
- Most growth ever experienced ✓
- Confidence destroyed and rebuilt ✓
- Still want to continue ✓
- Slightly insane ✓

Success?

## Final Thought

One year ago: Knew everything, understood nothing.
Today: Know nothing, starting to understand.

This might be what progress looks like.

Four more years. Bring it on.

(After coffee. Lots of coffee.)

🎓💪☕`,
    tags: ['phd-life', 'reflection', 'stanford', 'personal-growth'],
    readTime: '13 min',
  },
  {
    date: '2011-06-01',
    title: 'Building a Digital Oscilloscope UI: When Hardware Meets Software',
    summary: 'Designing the user interface for a DIY digital oscilloscope. Learned that making test equipment intuitive is harder than making it work.',
    content: `After building the hardware for a DIY digital scope, I faced a new challenge: creating a UI that doesn\'t suck. Turns out, making test equipment intuitive is way harder than making it functional. Here\'s how I built a modern interface for ancient-looking equipment.

## The Hardware Platform

Starting point:
- STM32F429 (with LCD controller!)
- 320x240 TFT display
- Rotary encoders for control
- 100 MSps ADC frontend
- 2 channels

Basically a scope without a soul.

## UI Design Philosophy

Studied classic scopes:
- Tektronix 2465
- HP 54600
- Rigol DS1054Z

Common patterns:
- Dedicated knobs per function
- Minimal menu diving
- Visual feedback immediate
- Muscle memory friendly

## The Implementation

### Core Display Loop
\`\`\`c
void updateDisplay() {
    // Clear waveform area only
    clearWaveformArea();
    
    // Draw grid (cached to avoid flicker)
    drawGrid();
    
    // Draw waveforms
    drawChannel(0, YELLOW);
    drawChannel(1, CYAN);
    
    // Update measurements
    updateMeasurements();
    
    // Draw UI elements
    drawTimebase();
    drawTriggerLevel();
    drawChannelInfo();
}
\`\`\`

### Waveform Rendering
The hard part - making it smooth:
\`\`\`c
void drawChannel(int ch, uint16_t color) {
    int lastY = -1;
    
    for (int x = 0; x < SCREEN_WIDTH; x++) {
        // Map screen X to sample index
        int sampleIdx = x * samplesPerPixel;
        
        // Min/max decimation for aliasing prevention
        int minVal = 255, maxVal = 0;
        for (int i = 0; i < samplesPerPixel; i++) {
            uint8_t val = sampleBuffer[ch][sampleIdx + i];
            if (val < minVal) minVal = val;
            if (val > maxVal) maxVal = val;
        }
        
        // Draw vertical line between min/max
        int yMin = valueToScreen(minVal);
        int yMax = valueToScreen(maxVal);
        drawVLine(x, yMin, yMax, color);
        
        // Connect to previous sample
        if (lastY >= 0) {
            drawLine(x-1, lastY, x, yMin, color);
        }
        lastY = yMax;
    }
}
\`\`\`

### Phosphor Persistence Effect
Making it look analog:
\`\`\`c
// Triple buffer for persistence
uint16_t persistBuffer[3][SCREEN_WIDTH * SCREEN_HEIGHT];
int currentBuffer = 0;

void applyPersistence() {
    for (int i = 0; i < SCREEN_WIDTH * SCREEN_HEIGHT; i++) {
        // Blend three frames with decay
        uint16_t p1 = persistBuffer[0][i];
        uint16_t p2 = persistBuffer[1][i];
        uint16_t p3 = persistBuffer[2][i];
        
        // Extract RGB, apply decay
        uint8_t r = ((p1 >> 11) * 3 + (p2 >> 11) * 2 + (p3 >> 11)) / 6;
        uint8_t g = (((p1 >> 5) & 0x3F) * 3 + ((p2 >> 5) & 0x3F) * 2 + 
                     ((p3 >> 5) & 0x3F)) / 6;
        uint8_t b = ((p1 & 0x1F) * 3 + (p2 & 0x1F) * 2 + (p3 & 0x1F)) / 6;
        
        screenBuffer[i] = (r << 11) | (g << 5) | b;
    }
}
\`\`\`

## Control Interface

### Encoder Acceleration
Making knobs feel right:
\`\`\`c
typedef struct {
    int position;
    int velocity;
    uint32_t lastTime;
    float acceleration;
} EncoderState;

int readEncoderWithAccel(EncoderState *enc) {
    int delta = readEncoderRaw();
    uint32_t now = getTicks();
    uint32_t timeDelta = now - enc->lastTime;
    
    if (delta != 0) {
        // Calculate velocity
        enc->velocity = 1000 * delta / timeDelta;
        
        // Apply acceleration curve
        if (abs(enc->velocity) > 5) {
            delta *= (1 + log10(abs(enc->velocity)));
        }
        
        enc->position += delta;
        enc->lastTime = now;
    }
    
    return enc->position;
}
\`\`\`

### Context-Sensitive Controls
Same knob, different functions:
\`\`\`c
void handleMainEncoder(int delta) {
    switch (currentMode) {
        case MODE_TIMEBASE:
            adjustTimebase(delta);
            break;
        case MODE_TRIGGER:
            adjustTriggerLevel(delta);
            break;
        case MODE_VERTICAL:
            adjustVerticalScale(delta);
            break;
        case MODE_CURSORS:
            moveCursor(delta);
            break;
    }
    
    // Visual feedback
    highlightAdjustedParameter();
}
\`\`\`

## Visual Design

### Grid System
Classic scope look:
\`\`\`c
void drawGrid() {
    // Major divisions
    for (int i = 0; i <= 10; i++) {
        int x = i * 32;
        drawVLine(x, 0, 240, GRID_MAJOR);
    }
    
    for (int i = 0; i <= 8; i++) {
        int y = i * 30;
        drawHLine(0, y, 320, GRID_MAJOR);
    }
    
    // Minor divisions (dots)
    for (int x = 16; x < 320; x += 32) {
        for (int y = 15; y < 240; y += 30) {
            drawPixel(x, y, GRID_MINOR);
        }
    }
}
\`\`\`

### Measurement Display
Auto measurements that don't clutter:
\`\`\`c
void drawMeasurements() {
    // Semi-transparent background
    fillRectAlpha(0, 200, 100, 40, BLACK, 128);
    
    // Measurements in columns
    drawText(5, 205, "Vpp:", WHITE);
    drawText(35, 205, formatVoltage(vpp), YELLOW);
    
    drawText(5, 220, "Freq:", WHITE);
    drawText(35, 220, formatFrequency(freq), YELLOW);
}
\`\`\`

## Performance Optimization

### DMA-Driven Display
Can't waste CPU on graphics:
\`\`\`c
void initDMA2D() {
    // Configure DMA2D for fast fills
    DMA2D->CR = DMA2D_M2M;
    DMA2D->OPFCCR = DMA2D_RGB565;
    
    // Offload rectangle fills
    DMA2D->OOR = screenWidth - rectWidth;
    DMA2D->NLR = (rectWidth << 16) | rectHeight;
}

void fillRectDMA(int x, int y, int w, int h, uint16_t color) {
    // Set up source (solid color)
    DMA2D->OCOLR = color;
    
    // Set destination
    DMA2D->OMAR = (uint32_t)(frameBuffer + y * screenWidth + x);
    
    // Start transfer
    DMA2D->CR |= DMA2D_CR_START;
    
    // CPU free to do other things!
}
\`\`\`

### Dirty Region Tracking
Only update what changed:
\`\`\`c
typedef struct {
    int x, y, w, h;
    bool dirty;
} Region;

Region regions[16];

void markDirty(int x, int y, int w, int h) {
    // Find overlapping regions and merge
    // This saves massive CPU time
}

void updateDirtyRegions() {
    for (int i = 0; i < 16; i++) {
        if (regions[i].dirty) {
            updateRegion(&regions[i]);
            regions[i].dirty = false;
        }
    }
}
\`\`\`

## User Testing

Had other students try it:

### Feedback Round 1
- "Why does this knob do three things?"
- "Where's the autoset button?"
- "Menu system confusing"
- "Needs more color coding"

### Improvements Made
- Dedicated trigger level knob
- Big AUTOSET button
- Simplified menus
- Channel colors everywhere

### Feedback Round 2
- "Much better!"
- "Feels like real scope"
- "Still want touchscreen"
- "Add FFT mode"

## Advanced Features

### XY Mode
\`\`\`c
void drawXYMode() {
    for (int i = 0; i < sampleCount; i++) {
        int x = map(ch1Samples[i], 0, 255, 0, 320);
        int y = map(ch2Samples[i], 0, 255, 240, 0);
        
        // Intensity grading based on sample density
        intensityMap[y][x]++;
    }
    
    // Render with variable brightness
    for (int y = 0; y < 240; y++) {
        for (int x = 0; x < 320; x++) {
            if (intensityMap[y][x] > 0) {
                int brightness = min(intensityMap[y][x] * 20, 255);
                drawPixelBrightness(x, y, GREEN, brightness);
            }
        }
    }
}
\`\`\`

### Persistence Modes
Different modes for different uses:
- Off: Clean display
- Low: Some trail
- High: Phosphor look  
- Infinite: See all history

## Lessons Learned

1. **UI is harder than hardware** - Making it intuitive takes iteration
2. **Study the classics** - Good patterns exist for reasons
3. **Performance matters** - Laggy scope is unusable scope
4. **Less is more** - Feature creep kills usability
5. **Test with users** - Engineers aren't normal people

## Open Source Release

Put everything on GitHub:
- STM32 firmware
- UI framework
- Python PC software
- Hardware files

Community improvements:
- Touch screen support
- Color themes
- Protocol decoders
- Bode plot mode

## Future Ideas

- Gesture control
- Voice commands (why?)
- Network streaming
- AI-powered autoset
- Holographic display (dreaming)

## Conclusion

Building scope UI taught me that test equipment interfaces are deceptively complex. Every pixel serves a purpose. Every control has decades of convention behind it.

But when it works - when the waveform flows smoothly across the screen, when the knobs feel just right, when measurements appear instantly - it's magical.

Now I appreciate my Rigol even more. And understand why good scopes cost so much.

📊🎮✨`,
    tags: ['oscilloscope', 'ui-design', 'embedded', 'graphics'],
    readTime: '14 min',
  },
];

// Function to generate blog post files
async function generateBlogPosts() {
  console.log('🚀 Starting blog post generation for 2011 final posts...\n');
  
  for (const post of posts2011Final) {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Create slug from title
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Create directory path
    const dirPath = path.join(process.cwd(), 'app', 'blog', `${year}-${month}-${day}-${slug}`);
    
    // Create directory if it doesn't exist
    await fs.mkdir(dirPath, { recursive: true });
    
    // Create the page.tsx content
    const pageContent = `import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="${post.date}"
      title="${post.title.replace(/"/g, '\\"')}"
      summary="${post.summary.replace(/"/g, '\\"')}"
      content={\`${post.content.replace(/`/g, '\\`')}\`}
      tags={${JSON.stringify(post.tags)}}
      readTime="${post.readTime}"
    />
  );
}

export function generateMetadata() {
  return {
    title: "${post.title.replace(/"/g, '\\"')} - Michael D'Angelo",
    description: "${post.summary.replace(/"/g, '\\"')}",
  };
}`;

    // Write the file
    const filePath = path.join(dirPath, 'page.tsx');
    await fs.writeFile(filePath, pageContent, 'utf8');
    
    console.log(`✅ Created: ${post.title}`);
  }
  
  console.log(`\n📝 Summary:`);
  console.log(`   Created: ${posts2011Final.length} posts`);
  console.log(`   Year: 2011`);
  console.log(`   Topics: Laser projector, Android dev, FPGA mining, Arduino workshop, demo day, surplus stores, IEEE paper, earthquake, Black Friday, PhD year 1, scope UI`);
}

// Run the generator
generateBlogPosts().catch(console.error);