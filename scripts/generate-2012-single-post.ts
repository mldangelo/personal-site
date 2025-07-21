import fs from 'fs';
import path from 'path';
import type { BlogPost } from '../src/data/blog';

const post2012: BlogPost = {
  date: '2012-09-15',
  title: 'Building a Quadcopter Flight Controller from Scratch',
  summary: 'Commercial flight controllers are expensive. Built my own using Arduino, accelerometer, gyroscope, and lots of PID tuning.',
  content: `After crashing my quadcopter one too many times with buggy commercial controllers, I decided to build my own. How hard could it be? (Spoiler: Very hard, but incredibly educational!)

## The Hardware

Starting with the basics:
- Arduino Mega 2560 (need those extra pins)
- MPU-6050 (6-axis accelerometer/gyroscope)
- BMP180 barometric pressure sensor
- 4x 30A ESCs (Electronic Speed Controllers)
- 4x 1000KV brushless motors
- 10x4.5 props
- 3S 2200mAh LiPo battery

Total cost: ~$150 (vs $300+ for commercial)

## Understanding the Physics

The key to stable flight is understanding the forces:

\`\`\`cpp
// Basic physics model
struct QuadState {
  float roll;     // Rotation around X axis
  float pitch;    // Rotation around Y axis  
  float yaw;      // Rotation around Z axis
  float throttle; // Overall thrust
  
  float rollRate;  // Angular velocity
  float pitchRate;
  float yawRate;
};

// Motor mixing algorithm
void calculateMotorSpeeds(QuadState state, int motorSpeeds[4]) {
  // Motor layout (X configuration):
  // 1   2
  //  \\ /
  //   X
  //  / \\
  // 4   3
  
  motorSpeeds[0] = state.throttle + state.pitch + state.roll - state.yaw;
  motorSpeeds[1] = state.throttle + state.pitch - state.roll + state.yaw;
  motorSpeeds[2] = state.throttle - state.pitch - state.roll - state.yaw;
  motorSpeeds[3] = state.throttle - state.pitch + state.roll + state.yaw;
  
  // Constrain to valid ESC range
  for (int i = 0; i < 4; i++) {
    motorSpeeds[i] = constrain(motorSpeeds[i], 1000, 2000);
  }
}
\`\`\`

## Reading the Sensors

Getting clean sensor data is crucial:

\`\`\`cpp
#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

struct SensorData {
  float ax, ay, az;  // Accelerometer
  float gx, gy, gz;  // Gyroscope
  float altitude;    // Barometer
  float batteryVoltage;
};

void setupSensors() {
  Wire.begin();
  mpu.initialize();
  
  // Configure MPU6050
  mpu.setFullScaleGyroRange(MPU6050_GYRO_FS_250);
  mpu.setFullScaleAccelRange(MPU6050_ACCEL_FS_2);
  mpu.setDLPFMode(MPU6050_DLPF_BW_42);  // Low pass filter
  
  // Calibrate gyroscope
  calibrateGyro();
}

void calibrateGyro() {
  const int samples = 1000;
  long gxSum = 0, gySum = 0, gzSum = 0;
  
  for (int i = 0; i < samples; i++) {
    int16_t gx, gy, gz;
    mpu.getRotation(&gx, &gy, &gz);
    gxSum += gx;
    gySum += gy;
    gzSum += gz;
    delay(3);
  }
  
  gxOffset = gxSum / samples;
  gyOffset = gySum / samples;
  gzOffset = gzSum / samples;
}

SensorData readSensors() {
  SensorData data;
  int16_t ax, ay, az, gx, gy, gz;
  
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  
  // Convert to real units
  data.ax = ax / 16384.0;  // g
  data.ay = ay / 16384.0;
  data.az = az / 16384.0;
  
  data.gx = (gx - gxOffset) / 131.0;  // degrees/sec
  data.gy = (gy - gyOffset) / 131.0;
  data.gz = (gz - gzOffset) / 131.0;
  
  return data;
}
\`\`\`

## The Complementary Filter

Combining accelerometer and gyroscope data:

\`\`\`cpp
class ComplementaryFilter {
private:
  float roll, pitch;
  unsigned long lastTime;
  const float alpha = 0.98;  // Filter coefficient
  
public:
  void update(SensorData data) {
    unsigned long now = micros();
    float dt = (now - lastTime) / 1000000.0;
    lastTime = now;
    
    // Integrate gyroscope data
    roll += data.gx * dt;
    pitch += data.gy * dt;
    
    // Calculate angle from accelerometer
    float accelRoll = atan2(data.ay, data.az) * 180 / PI;
    float accelPitch = atan2(-data.ax, sqrt(data.ay*data.ay + data.az*data.az)) * 180 / PI;
    
    // Complementary filter
    roll = alpha * roll + (1 - alpha) * accelRoll;
    pitch = alpha * pitch + (1 - alpha) * accelPitch;
  }
  
  float getRoll() { return roll; }
  float getPitch() { return pitch; }
};
\`\`\`

## PID Controller Implementation

The heart of stability:

\`\`\`cpp
class PIDController {
private:
  float kp, ki, kd;
  float integral = 0;
  float previousError = 0;
  float lastTime = 0;
  
public:
  PIDController(float p, float i, float d) : kp(p), ki(i), kd(d) {}
  
  float calculate(float setpoint, float measurement) {
    float now = millis() / 1000.0;
    float dt = now - lastTime;
    
    if (dt < 0.001) return 0;  // Prevent division by zero
    
    float error = setpoint - measurement;
    
    // Proportional term
    float pTerm = kp * error;
    
    // Integral term with anti-windup
    integral += error * dt;
    integral = constrain(integral, -100, 100);
    float iTerm = ki * integral;
    
    // Derivative term with filter
    float derivative = (error - previousError) / dt;
    float dTerm = kd * derivative;
    
    previousError = error;
    lastTime = now;
    
    return pTerm + iTerm + dTerm;
  }
  
  void reset() {
    integral = 0;
    previousError = 0;
  }
};

// Create PID controllers for each axis
PIDController rollPID(4.0, 0.02, 1.5);
PIDController pitchPID(4.0, 0.02, 1.5);
PIDController yawPID(6.0, 0.02, 0.0);
\`\`\`

## The Main Flight Loop

Bringing it all together at 250Hz:

\`\`\`cpp
void setup() {
  Serial.begin(115200);
  setupSensors();
  setupESCs();
  setupRadioReceiver();
  
  // Wait for ESC initialization
  delay(5000);
}

void loop() {
  static unsigned long loopTimer = micros();
  
  // Read sensors
  SensorData sensors = readSensors();
  
  // Update orientation estimate
  orientationFilter.update(sensors);
  
  // Get current angles
  float currentRoll = orientationFilter.getRoll();
  float currentPitch = orientationFilter.getPitch();
  
  // Read RC commands
  RCCommands rc = readRadioCommands();
  
  // Safety check - kill switch
  if (rc.throttle < 1100 || !rc.armed) {
    stopMotors();
    rollPID.reset();
    pitchPID.reset();
    yawPID.reset();
    return;
  }
  
  // Calculate PID corrections
  float rollCorrection = rollPID.calculate(rc.roll, currentRoll);
  float pitchCorrection = pitchPID.calculate(rc.pitch, currentPitch);
  float yawCorrection = yawPID.calculate(rc.yawRate, sensors.gz);
  
  // Mix PID outputs to motor commands
  int motorCommands[4];
  motorCommands[0] = rc.throttle + pitchCorrection + rollCorrection - yawCorrection;
  motorCommands[1] = rc.throttle + pitchCorrection - rollCorrection + yawCorrection;
  motorCommands[2] = rc.throttle - pitchCorrection - rollCorrection - yawCorrection;
  motorCommands[3] = rc.throttle - pitchCorrection + rollCorrection + yawCorrection;
  
  // Send to ESCs
  for (int i = 0; i < 4; i++) {
    motorCommands[i] = constrain(motorCommands[i], 1000, 2000);
    motors[i].writeMicroseconds(motorCommands[i]);
  }
  
  // Maintain 250Hz loop rate
  while (micros() - loopTimer < 4000);
  loopTimer = micros();
}
\`\`\`

## Tuning PID Values

The most time-consuming part:

1. **Start with P only**: Increase until oscillation, then back off 20%
2. **Add D**: Increase to dampen oscillations
3. **Add I carefully**: Just enough to eliminate steady-state error
4. **Test incrementally**: One axis at a time, tied down

My final values after many crashes:
- Roll/Pitch: P=4.0, I=0.02, D=1.5
- Yaw: P=6.0, I=0.02, D=0.0

## First Successful Flight

After weeks of debugging:
- Hover achieved! (Only 3 broken props)
- Battery life: 12 minutes
- Stability: Better than some commercial controllers
- Response: Snappy but controllable
- Cost savings: $150 vs $300+

## Lessons Learned

1. **Vibration isolation is critical**: Foam mounting for the IMU
2. **Loop timing must be consistent**: Use timer interrupts
3. **Start with low PID values**: Aggressive tuning = broken props
4. **Log everything**: SD card logging saved me
5. **Have spare props**: Lots of spare props

## Future Improvements

- GPS for position hold
- Optical flow for indoor stability
- Altitude hold using barometer
- Wireless PID tuning
- Return to home feature

Building a flight controller taught me more about control systems than any textbook. Now excuse me while I order more props!`,
  tags: ['quadcopter', 'arduino', 'pid-control', 'flight-controller'],
  readTime: '20 min',
};

// Generate post
async function generatePost() {
  console.log('🚀 Generating single 2012 blog post...\n');
  
  const date = new Date(post2012.date);
  const slug = post2012.title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const fileName = `${post2012.date}-${slug}`;
  const dirPath = path.join(process.cwd(), 'app', 'blog', fileName);
  const filePath = path.join(dirPath, 'page.tsx');
  
  try {
    // Create directory
    await fs.promises.mkdir(dirPath, { recursive: true });
    
    // Generate page content with proper metadata
    const pageContent = `import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: '${post2012.title.replace(/'/g, "\\'")}',
  description: '${post2012.summary.replace(/'/g, "\\'")}',
  keywords: [${post2012.tags.map(tag => `'${tag}'`).join(', ')}],
  openGraph: {
    title: '${post2012.title.replace(/'/g, "\\'")}',
    description: '${post2012.summary.replace(/'/g, "\\'")}',
    type: 'article',
    publishedTime: '${post2012.date}',
    authors: ['Michael D\'Angelo'],
  },
};

const post = {
  date: '${post2012.date}',
  title: '${post2012.title.replace(/'/g, "\\'")}',
  content: \`${post2012.content.replace(/`/g, '\\`')}\`,
  tags: [${post2012.tags.map(tag => `'${tag}'`).join(', ')}],
  readTime: '${post2012.readTime}',
};

export default function ${post2012.title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return <BlogPost post={post} />;
}
`;
    
    await fs.promises.writeFile(filePath, pageContent);
    console.log(`✅ Created: ${post2012.title}`);
  } catch (error) {
    console.error(`❌ Error creating ${post2012.title}:`, error);
  }
}

generatePost().catch(console.error);