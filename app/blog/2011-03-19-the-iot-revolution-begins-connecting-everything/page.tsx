import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-03-20"
      title="The IoT Revolution Begins: Connecting Everything"
      summary="Building internet-connected devices before \"IoT\" was cool. WiFi modules are finally cheap enough for hobby projects!"
      content={`The Microchip WiFi module just dropped to $30, and the ESP8266 rumors are starting. We're on the verge of connecting everything to the internet. Built three IoT projects this week alone!

## Project 1: Smart Dorm Room

Living in the future, one sensor at a time.

### The System
- **Temperature/humidity**: DHT22 sensors
- **Motion detection**: PIR sensors  
- **Door sensor**: Magnetic reed switch
- **Lighting**: RGB LED strips
- **Brain**: Arduino + WiFi shield
- **Backend**: PHP script on shared hosting

### Features Implemented
1. **Auto lighting** - Lights on when door opens after sunset
2. **Climate logging** - Graphs of temperature over time
3. **Presence detection** - Texts me if door opens when I'm out
4. **Party mode** - Lights pulse to music
5. **Statistics** - Time spent in room, sleep patterns

### The Code
\`\`\`cpp
void loop() {
    if (motionDetected() && isDark()) {
        fadeIn(lights, 2000);
        lastMotion = millis();
    }
    
    if (millis() - lastMotion > 300000) {  // 5 min
        fadeOut(lights, 5000);
    }
    
    if (millis() - lastUpdate > 60000) {  // 1 min
        postToServer(temperature, humidity, presence);
        lastUpdate = millis();
    }
}
\`\`\`

### Web Dashboard
Simple PHP + MySQL:
\`\`\`php
<?php
$temp = $_POST['temp'];
$humidity = $_POST['humidity'];
$time = time();

$sql = "INSERT INTO readings (temp, humidity, timestamp) 
        VALUES ($temp, $humidity, $time)";
mysqli_query($conn, $sql);

// Check for alerts
if ($temp > 85) {
    mail("me@email.com", "Room too hot!", "Currently $temp°F");
}
?>
\`\`\`

## Project 2: Cafeteria Crowd Tracker

How busy is the dining hall?

### The Approach
- WiFi module counts probe requests
- Estimates crowd based on phone density
- Updates every 5 minutes
- Public web interface

### Privacy Considerations
- Only count, don't store MACs
- Hash MACs for uniqueness
- Clear data hourly
- Posted privacy notice

### Results
Can predict:
- Peak meal times
- Best times to avoid crowds
- Special event impacts
- Weekend patterns

Students love it! Website gets 500 hits/day.

## Project 3: Laundry Alert System

The killer app for dorms.

### Problem
- 4 washers/dryers for 50 students
- People forget their laundry
- Angry confrontations

### Solution  
- Current sensor on each machine
- Detects running/stopped states
- Web interface shows availability
- Notifications when cycle completes

### Implementation
\`\`\`cpp
float current = readCurrent(A0);
bool running = current > THRESHOLD;

if (wasRunning && !running) {
    // Machine just stopped
    notifyUser(machineId);
    updateWebStatus(machineId, "Available");
}

wasRunning = running;
\`\`\`

### Unexpected Benefits
- 30% reduction in wait times
- Fewer abandoned loads
- Data shows usage patterns
- Maintenance predictions

## The Backend Challenge

### Shared Hosting Limitations
- No persistent processes
- No websockets
- Limited CPU
- Basic PHP only

### Workarounds
- Polling every 30 seconds
- Cron jobs for cleanup
- File-based queuing
- Creative caching

### Database Schema
Keep it simple:
\`\`\`sql
CREATE TABLE sensor_data (
    id INT AUTO_INCREMENT,
    device_id VARCHAR(32),
    sensor_type VARCHAR(32),
    value FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_device_time (device_id, timestamp)
);
\`\`\`

## Power Consumption Reality

WiFi is hungry:
- Transmit: 300mA
- Receive: 100mA  
- Sleep: 10mA

Battery life calculations:
- Always on: 6 hours
- Update every minute: 2 days
- Update every hour: 2 weeks
- Deep sleep between: 2 months

Power optimization crucial!

## Security Disasters

Learned the hard way:

### Mistake 1: HTTP Basic Auth
Someone sniffed password, turned lights into strobe. Migraine induced.

### Mistake 2: No Rate Limiting
Script kiddie found endpoint. 50,000 requests. Hosting suspended.

### Mistake 3: SQL Injection
\`\`\`php
$id = $_GET['id'];
$sql = "SELECT * FROM devices WHERE id = $id";  // DON'T DO THIS
\`\`\`

Room temperature set to 9999°F in database.

### Fixes Applied
- HTTPS everywhere (even self-signed)
- API keys for each device
- Rate limiting (10 requests/minute)
- Prepared statements
- Input validation

## Lessons Learned

### Technical
1. **WiFi range sucks** - Walls are the enemy
2. **Time sync matters** - NTP is your friend
3. **Debugging remote devices** - Add lots of logging
4. **OTA updates** - Essential for deployed devices
5. **Watchdog timers** - WiFi code crashes randomly

### Practical
1. **Start simple** - Blink LED over internet first
2. **Plan for failure** - Network will go down
3. **Cache aggressively** - Reduce server load
4. **Battery included** - Power outages happen
5. **Physical security** - People unplug things

## The Future Vision

Imagine when every device has an IP:
- Fridge orders milk
- Lights follow you
- Energy optimization
- Predictive maintenance
- Context-aware computing

We're building the nervous system of the world!

## Current Costs

Making IoT accessible:
- Arduino: $30
- WiFi shield: $30
- Sensors: $20
- Total: $80 per node

Still expensive, but dropping fast.

## Community Response

Posted projects online:
- GitHub stars: 127
- Forks: 34
- Pull requests: 8
- "How-to" blog posts: 3
- Copycats on campus: 7

Open source FTW!

## What's Next

Working on:
1. Mesh networking between nodes
2. Local processing (edge computing?)
3. Voice control integration
4. Machine learning for patterns
5. Standardized protocol

The ESP8266 rumors sound promising. $5 WiFi would change everything!

## Philosophical Questions

As we connect everything:
- Privacy implications?
- Security nightmares?
- Dependency concerns?
- Environmental impact?
- Social changes?

Building the future requires thinking about consequences.

For now, I'm just excited my dorm room texts me. Living in the future, one connected device at a time!`}
      tags={["iot","wifi","projects","embedded"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "The IoT Revolution Begins: Connecting Everything - Michael D'Angelo",
    description: "Building internet-connected devices before \"IoT\" was cool. WiFi modules are finally cheap enough for hobby projects!",
  };
}