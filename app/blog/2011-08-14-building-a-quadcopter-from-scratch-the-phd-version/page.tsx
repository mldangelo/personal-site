import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-08-15"
      title="Building a Quadcopter from Scratch: The PhD Version"
      summary="Starting fresh at Stanford means building a better quadcopter. This time with custom flight controller, advanced sensors, and actual control theory."
      content={`With access to Stanford's resources and knowledge from senior design, I'm building a quadcopter from scratch. Not from a kit. Every component designed, every line of code written, every control loop tuned. This is the PhD version.

## Why Another Quadcopter?

Senior design quad was good, but compromises were made:
- Used Arduino (too slow for advanced control)
- Basic sensors (just IMU and GPS)
- Simple PID control (no state estimation)
- Limited payload capacity

This time: No compromises.

## The Design Philosophy

Building for research, not just flight:
- Modular architecture for experiments
- Computational power for real-time vision
- Research-grade sensors
- Data logging everything
- Over-engineer first, optimize later

## Hardware Architecture

### Flight Controller
Custom board with:
- **MCU**: STM32F427 (180 MHz, FPU)
- **IMU**: MPU-9250 + secondary ICM-20689
- **Barometer**: MS5611 (high precision)
- **GPS**: Ublox M8Q with RTK capability
- **Radio**: 915 MHz for telemetry
- **Interfaces**: CAN, I2C, SPI, UART galore

### Power System
Learned from others' mistakes:
- **Motors**: T-Motor U3 700KV (efficiency)
- **ESCs**: 40A with telemetry feedback
- **Battery**: 4S 10,000mAh (25 min hover)
- **Power Module**: Hall effect current sensing
- **Redundancy**: Dual power paths

### Companion Computer
The brain for intelligence:
- NVIDIA Jetson TX1 (just released!)
- 256 CUDA cores for vision processing
- Running ROS for modularity
- Connected via high-speed UART

## Software Stack

### Flight Controller Firmware

Real-time operating system (FreeRTOS):
\`\`\`c
void vTask_AttitudeControl(void *pvParameters) {
    TickType_t xLastWakeTime = xTaskGetTickCount();
    
    while(1) {
        // Read sensors
        IMU_GetData(&imu_data);
        
        // State estimation (EKF)
        EKF_Update(&state, &imu_data, dt);
        
        // Control law
        Control_ComputeOutputs(&state, &setpoint, &motors);
        
        // Output to motors
        Motors_SetThrust(&motors);
        
        // Maintain 500Hz update rate
        vTaskDelayUntil(&xLastWakeTime, pdMS_TO_TICKS(2));
    }
}
\`\`\`

### State Estimation

Implementing proper Extended Kalman Filter:
\`\`\`c
// EKF state vector: [position, velocity, attitude, gyro_bias, accel_bias]
// 15 states total

void EKF_Predict(ekf_t *ekf, float dt) {
    // Predict state forward
    ekf->x[0] += ekf->x[3] * dt;  // position += velocity * dt
    ekf->x[1] += ekf->x[4] * dt;
    ekf->x[2] += ekf->x[5] * dt;
    
    // Predict attitude using quaternion integration
    Quaternion_Integrate(&ekf->q, &ekf->gyro, dt);
    
    // Update covariance
    Matrix_Multiply(&ekf->F, &ekf->P, &ekf->P_temp);
    Matrix_Add(&ekf->P_temp, &ekf->Q, &ekf->P);
}
\`\`\`

### Advanced Control

Beyond basic PID:
- Cascaded loops (attitude → angular rate → motor)
- Feedforward for aggressive maneuvers
- Adaptive gains based on battery voltage
- Anti-windup protection
- Notch filters for vibration

## Sensor Fusion

Multiple sensors for robustness:
1. **Dual IMUs**: Voting for fault detection
2. **Optical flow**: Velocity without GPS
3. **Lidar**: Altitude hold and landing
4. **Computer vision**: Feature tracking

All fused in EKF for optimal estimate.

## Computer Vision Integration

Using Jetson for real-time processing:

### Visual Odometry
\`\`\`python
class VisualOdometry:
    def __init__(self):
        self.orb = cv2.ORB_create(1000)
        self.matcher = cv2.BFMatcher(cv2.NORM_HAMMING)
        
    def process_frame(self, frame):
        # Detect features
        kp, desc = self.orb.detectAndCompute(frame, None)
        
        if self.last_desc is not None:
            # Match features
            matches = self.matcher.match(self.last_desc, desc)
            
            # Estimate motion
            E, mask = cv2.findEssentialMat(pts1, pts2)
            _, R, t, _ = cv2.recoverPose(E, pts1, pts2)
            
            # Send to flight controller
            self.send_visual_update(R, t)
\`\`\`

### Object Detection
Running YOLO on Jetson:
- 10 FPS on 640x480
- Detecting people, cars, signs
- Future: Custom training for targets

## Testing and Tuning

### System Identification
Measuring actual dynamics:
- Frequency sweeps for motor response
- Step responses for control gains
- Thrust mapping vs. PWM
- Battery voltage compensation

### Control Tuning
Systematic approach:
1. Rate loops first (inner)
2. Attitude loops (middle)
3. Position loops (outer)
4. Verify stability margins
5. Test disturbance rejection

## Flight Tests

### First Hover
After weeks of preparation:
- Tethered for safety
- Slowly increase throttle
- IT FLIES! And stable!
- Only minor oscillations

### Autonomous Flights
Progressive testing:
1. Altitude hold: ±5cm precision
2. Position hold: ±10cm in wind
3. Waypoint navigation: Smooth
4. Return to home: Reliable
5. Orbit mode: Cinematic!

## Performance Metrics

Achieved specifications:
- Flight time: 28 minutes hover
- Max speed: 20 m/s
- Position accuracy: ±15cm (GPS+vision)
- Attitude precision: ±0.5°
- Update rate: 500 Hz control loop
- Telemetry: 50 Hz full state

## Crashes and Lessons

Not everything perfect:

### Crash #1: Vibration
High-frequency oscillation → structural failure
Solution: Notch filter at frame resonance

### Crash #2: GPS Glitch  
Jumped 50m instantly → aggressive correction
Solution: Innovation gating in EKF

### Crash #3: Battery Failsafe
Ignored low voltage → fell from sky
Solution: Hard landing at 3.5V/cell

## Research Applications

Platform enables research:
1. **Aggressive maneuvers**: Flips, rolls at 400°/s
2. **Multi-agent coordination**: Swarm algorithms
3. **Vision-based navigation**: GPS-denied flight
4. **Fault tolerance**: Surviving motor failures
5. **AI pilot**: Learning from demonstrations

## Open Source Release

Sharing with community:
- Hardware designs on GitHub
- Firmware fully documented
- ROS packages available
- Build instructions detailed

Already 50+ forks, 10 pull requests!

## Cost Analysis

Building research-grade quad:
- Flight controller PCB: $200
- Sensors: $150
- Frame and motors: $400
- Jetson TX1: $500
- Batteries and misc: $300
- **Total: $1,550**

Commercial equivalent: $5,000+

## Future Upgrades

Planning additions:
- RTK GPS for cm accuracy
- Thermal camera for night ops
- LTE modem for unlimited range
- Sonic sensors for indoor
- Maybe even radar?

## Community Response

Shared at Stanford Robotics Club:
- "Can you help me build one?"
- "What about adding arms?"
- "Can it deliver burritos?"

Silicon Valley priorities...

## Reflection

This quadcopter represents PhD approach:
- Deep understanding of every component
- No black boxes
- Research-grade performance
- Extensible platform
- Knowledge shared freely

From Arduino-based senior design to custom flight computer with computer vision. The learning curve is exponential.

Building robots at Stanford with unlimited resources? Living the dream. Time to make it do something nobody's done before.`}
      tags={["quadcopter","robotics","control-systems","computer-vision"]}
      readTime="16 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Building a Quadcopter from Scratch: The PhD Version - Michael D'Angelo",
    description: "Starting fresh at Stanford means building a better quadcopter. This time with custom flight controller, advanced sensors, and actual control theory.",
  };
}