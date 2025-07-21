import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-01-28"
      title="Senior Design: Autonomous Search and Rescue Quadcopter"
      summary="Building a drone that can find lost hikers autonomously. Computer vision, GPS navigation, and lots of crashes."
      content={`Our senior design project is ambitious: build a quadcopter that can autonomously search for and locate missing persons. Four months to go from concept to demo. No pressure.

## Team Dynamics

Our team of four:
- Me: Flight controller and sensors
- Jake: Computer vision and AI
- Sarah: Mechanical design and power
- Ahmed: Communications and ground station

Weekly advisor meetings keep us honest.

## System Requirements

Defined after meeting with local search and rescue:
1. **Flight time**: 20+ minutes
2. **Range**: 2 km radius
3. **Payload**: Camera + compute
4. **Detection**: Find red objects (emergency blankets)
5. **Autonomous**: GPS waypoint navigation
6. **Return**: Auto-land when battery low
7. **Cost**: Under $1,500

## Mechanical Design

### Frame Selection
After much debate, went with:
- DJI F450 frame
- Simple, proven design
- Replacement parts available
- 450mm motor-to-motor
- Plenty of mounting space

### Propulsion
- Motors: T-Motor MN2214 920KV
- ESCs: 30A with SimonK firmware
- Props: 10x4.5 carbon fiber
- 3S 5000mAh LiPo battery

Calculated thrust: 2:1 ratio fully loaded.

## Flight Controller

Building our own (because senior design):

### Hardware
- STM32F405 microcontroller
- MPU9250 9-axis IMU
- MS5611 barometer
- Ublox NEO-M8N GPS
- 2.4 GHz radio for manual override

### Sensor Fusion
Implementing extended Kalman filter:
\`\`\`c
// Simplified EKF update
void ekf_update(float dt) {
    // Prediction step
    predict_state(dt);
    predict_covariance(dt);
    
    // Update with accelerometer
    if (new_accel_data) {
        update_with_accel();
    }
    
    // Update with GPS
    if (new_gps_data) {
        update_with_gps();
    }
    
    // Extract Euler angles
    extract_attitude();
}
\`\`\`

### Control Loops
Cascaded PID controllers:
- Inner loop: Angular rate (400 Hz)
- Middle loop: Angle (100 Hz)  
- Outer loop: Position (50 Hz)

Tuning these is an art form.

## Computer Vision System

### Hardware
- Raspberry Pi 3 (just released!)
- Pi Camera v2
- 3-axis gimbal for stabilization

### Detection Algorithm
Finding red objects in wilderness:
1. Convert RGB to HSV
2. Threshold for red hues
3. Morphological operations
4. Contour detection
5. Size/shape filtering

### Performance Optimization
Getting 10 FPS on Pi:
- Reduce resolution to 640x480
- Skip frames when processing
- Use NEON instructions
- Optimize with Cython

## Autonomous Navigation

### Mission Planning
Simple grid search pattern:
\`\`\`python
def generate_search_pattern(center, radius, spacing):
    waypoints = []
    for x in range(-radius, radius, spacing):
        for y in range(-radius, radius, spacing):
            lat = center.lat + (x / 111111.0)
            lon = center.lon + (y / 111111.0)
            waypoints.append((lat, lon, altitude))
    return waypoints
\`\`\`

### Obstacle Avoidance
Basic implementation:
- Ultrasonic sensors (4x HC-SR04)
- Simple reactive behavior
- Increase altitude if obstacle detected

Not perfect but prevents most crashes.

## Communication System

### Telemetry Link
- 433 MHz LoRa modules
- 2 km range achieved
- MAVLink protocol
- 56 kbps effective throughput

### Video Downlink
- 5.8 GHz analog transmitter
- Real-time pilot view
- Records onboard for analysis

## Ground Station Software

Built with Python + Qt:
- Real-time telemetry display
- Map with GPS position
- Video feed with object detection overlay
- Mission upload/download
- Emergency stop button (important!)

## Testing Chronicles

### First Flight Attempt
Result: Immediate flip and crash
Problem: Motor order wrong
Damage: Two props
Lesson: Check everything twice

### Second Flight  
Result: Unstable oscillations
Problem: PID gains too high
Damage: None (landed quickly)
Lesson: Start with low gains

### Third Flight
Result: Stable hover!
Problem: Drifts significantly
Solution: Compass calibration

### Autonomous Test #1
Result: Flew into tree
Problem: GPS accuracy ±5 meters
Solution: Increase altitude margins

### Vision Test
Found test target successfully!
Range: 50 meters
False positives: Red leaves...

## Current Status

With two months left:
- ✓ Stable manual flight
- ✓ GPS hold working
- ✓ Waypoint navigation (mostly)
- ✓ Object detection (needs work)
- ⚠️ Battery life: 18 minutes (close)
- ⚠️ Range: 1.5 km (working on it)
- ❌ Reliability: 60% success rate

## Budget Breakdown

- Frame and motors: $300
- Flight controller components: $150
- Raspberry Pi + camera: $100
- GPS and sensors: $100
- Batteries and charger: $200
- Radio equipment: $150
- Miscellaneous/repairs: $500
- **Total: $1,500** (exactly on budget!)

## Lessons Learned

1. **Start simple** - Basic hover before autonomy
2. **Test incrementally** - Each subsystem separately
3. **Have spare parts** - Crashes will happen
4. **Document everything** - For the final report
5. **Team communication** - Daily standups help

## Demo Day Preparation

Three demos planned:
1. Manual flight showing stability
2. Autonomous grid search
3. Target detection and location

Hoping the demo gods are merciful.

## Future Work

If we had more time:
- Better obstacle avoidance (lidar?)
- Thermal camera for night search
- Longer flight time (bigger battery)
- AI for better object recognition
- Multiple drone coordination

This project combined everything from four years of engineering education. Control theory, embedded systems, computer vision, communications - it's all here.

Win or lose on demo day, we built something that flies. That's pretty cool.`}
      tags={["senior-design","quadcopter","autonomous","computer-vision"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Senior Design: Autonomous Search and Rescue Quadcopter - Michael D'Angelo",
    description: "Building a drone that can find lost hikers autonomously. Computer vision, GPS navigation, and lots of crashes.",
  };
}