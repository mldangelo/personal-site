import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-02-18"
      title="Winning the Embedded Systems Design Contest"
      summary="Our team's adaptive bike light system won first place at the regional embedded design contest. Smart lighting based on ambient conditions and speed."
      content={`Just got back from Rochester where our team won first place in the IEEE Region 1 Embedded Systems Design Contest! Our adaptive bike light system beat 12 other universities. Here's how we built a winner.

## The Challenge

Design requirements:
- Improve bicycle safety
- Use embedded systems
- Cost under $100
- Build in 48 hours
- Present to industry judges

Perfect match for our skills.

## The Concept

Adaptive bike lighting that responds to:
- Ambient light level
- Bike speed
- Turn detection
- Proximity to cars
- Emergency braking

Not just a light - an intelligent safety system.

## Team Assembly

Our dream team:
- Me: Embedded systems and sensors
- Sarah: Mechanical and power
- Jake: Algorithms and control
- Ahmed: Mobile app and UI

Complementary skills = success.

## Hardware Design

### Core System
- MSP430F5529 (low power champion)
- MPU-6050 (accelerometer/gyroscope)
- GPS module (speed and location)
- Ultrasonic sensor (rear proximity)
- Light sensor (ambient detection)

### Lighting Array
- Front: 10W LED with lens
- Rear: 8x8 LED matrix
- Side: LED strips
- All PWM controlled

### Power System
- 5000mAh LiPo battery
- USB charging
- 15-hour runtime
- Battery protection circuit

## The Algorithms

### Adaptive Brightness
\`\`\`c
uint8_t calculate_brightness() {
    uint16_t ambient = read_light_sensor();
    float speed = get_gps_speed();
    
    // Base brightness on ambient inverse
    uint8_t base = map(ambient, 0, 1023, 255, 10);
    
    // Increase with speed (need more visibility)
    float speed_factor = 1.0 + (speed / 30.0);
    
    // Apply limits
    uint8_t brightness = base * speed_factor;
    return constrain(brightness, 10, 255);
}
\`\`\`

### Turn Signal Detection
Using gyroscope for lean angle:
\`\`\`c
void detect_turn() {
    float yaw_rate = mpu.getRotationZ();
    static float filtered_yaw = 0;
    
    // Low-pass filter
    filtered_yaw = 0.8 * filtered_yaw + 0.2 * yaw_rate;
    
    if (abs(filtered_yaw) > TURN_THRESHOLD) {
        if (filtered_yaw > 0) {
            activate_right_signal();
        } else {
            activate_left_signal();
        }
    }
}
\`\`\`

### Emergency Brake Detection
\`\`\`c
void check_emergency_brake() {
    float accel = mpu.getAccelerationX();
    
    if (accel < -3.0) {  // 3G deceleration
        // Rapid flash pattern
        for (int i = 0; i < 10; i++) {
            set_all_lights(255);
            delay(50);
            set_all_lights(0);
            delay(50);
        }
    }
}
\`\`\`

### Proximity Warning
Car approaching from behind:
\`\`\`c
void proximity_alert() {
    uint16_t distance = read_ultrasonic();
    
    if (distance < 200) {  // 2 meters
        // Calculate approach rate
        float approach_rate = calculate_approach_rate(distance);
        
        if (approach_rate > DANGER_THRESHOLD) {
            // Side LEDs flash outward
            emergency_pattern();
        }
    }
}
\`\`\`

## The Build Marathon

### Hour 0-8: Design and Planning
- Whiteboard sessions
- Component selection
- Task division
- Risk assessment

### Hour 8-16: Hardware Assembly
- PCB layout (toner transfer)
- Etching in hotel bathroom
- Component soldering
- 3D printing mounts

### Hour 16-24: Software Development
- Driver implementation
- Algorithm coding
- Integration testing
- Debug serial everywhere

### Hour 24-32: Integration
- Mount on test bike
- Parking lot testing
- Parameter tuning
- Feature refinement

### Hour 32-40: Polish
- Mobile app completion
- Demo preparation
- Presentation practice
- Documentation

### Hour 40-48: Final Push
- Last bug fixes
- Video recording
- Judge preparation
- Energy drink overdose

## The Demo

Presentation highlights:
1. **Standard mode** - Basic adaptive lighting
2. **Turn signals** - Lean to activate
3. **Emergency brake** - Dramatic stop demonstration
4. **Car approach** - Judge walks behind with ultrasonic target
5. **Mobile app** - Real-time stats and configuration

Judge quote: "This should be on every bike."

## Competition Day

### Other Projects
Strong competition:
- Smart farming sensors
- Medical alert system
- Home automation
- Drone delivery
- Wearable health monitor

All impressive. Nerves high.

### Our Advantages
What set us apart:
1. **Complete system** - Not just prototype
2. **Real-world tested** - Actual bike rides
3. **Cost effective** - $67 BOM cost
4. **Immediate application** - Solves real problem
5. **Professional polish** - Looks commercial

### The Announcement
"First place goes to... University at Buffalo for the Adaptive Bike Light System!"

Exhausted cheering. Worth every sleepless hour.

## Technical Innovations

Judges particularly liked:
1. **Sensor fusion** - Multiple inputs intelligently combined
2. **Power management** - Months on single charge
3. **Fail-safe design** - Defaults to basic light
4. **OTA updates** - Future improvements via app
5. **Open source** - Sharing with community

## Lessons from Victory

What we did right:
1. **Scoped appropriately** - Ambitious but achievable
2. **Played to strengths** - Used team skills well
3. **Tested constantly** - Found bugs early
4. **Polished presentation** - Practice paid off
5. **Solved real problem** - Judges could relate

## Post-Competition

Interest exploding:
- Local bike shop wants to sell
- Investors reaching out
- Patent discussion started
- Media coverage
- Open source community contributing

## The Code Release

Shared everything on GitHub:
- Hardware schematics
- Firmware source
- Mobile app code
- 3D print files
- Assembly instructions

Already 200+ stars, 50+ forks!

## Commercialization Question

Team discussing next steps:
- Patent core innovations?
- Kickstarter campaign?
- License to manufacturer?
- Start company?
- Stay open source?

Leaning toward open source with commercial version.

## Personal Reflection

This win validates years of learning:
- Embedded systems knowledge
- Team collaboration
- Rapid prototyping
- Presentation skills
- Real-world problem solving

From blinking LEDs to competition winner.

## Impact

Beyond the trophy:
- $5,000 prize (split 4 ways)
- Resume builder
- Industry connections
- Team confidence
- Validation of skills

But mostly: We built something useful.

## Future Development

Planned improvements:
- Bluetooth 4.0 (lower power)
- Integrated horn
- Theft detection
- Ride logging
- Social features

Community already contributing ideas.

## The Trophy

Sitting on my desk now. Engraved:
"IEEE Region 1 ESC 2011 - First Place"

More than metal and wood. Represents:
- Late nights debugging
- Team arguments resolved
- Problems solved creatively
- Ideas becoming reality
- Engineering at its best

## Final Thoughts

48 hours. 4 engineers. 1 bike. Countless Red Bulls.

We didn't just win a competition. We built something that could save lives. That's engineering's true reward.

Next year's team has big shoes to fill. But for now, time to catch up on sleep... and maybe patent this thing.

🚴‍♂️💡🏆`}
      tags={["competition","embedded-systems","teamwork","innovation"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Winning the Embedded Systems Design Contest - Michael D'Angelo",
    description: "Our team's adaptive bike light system won first place at the regional embedded design contest. Smart lighting based on ambient conditions and speed.",
  };
}