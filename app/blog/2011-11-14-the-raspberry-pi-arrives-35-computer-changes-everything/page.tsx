import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-11-15"
      title="The Raspberry Pi Arrives: $35 Computer Changes Everything"
      summary="Got my hands on one of the first Raspberry Pi boards. This $35 computer is going to democratize computing and launch a million projects."
      content={`Through a connection at Cambridge, I got early access to a Raspberry Pi Model B. This credit-card sized computer costs $35 and runs Linux. It's going to change everything about computer education and embedded projects.

## First Impressions

Opening the anti-static bag:
- Tiny! Credit card sized
- Feels substantial despite size
- That beautiful BCM2835 SoC
- GPIO pins calling to me
- Smells like revolution

## Specifications

What $35 gets you:
- 700 MHz ARM11
- 256 MB RAM (Model A has 128MB)
- HDMI output
- 2x USB ports
- Ethernet
- SD card storage
- GPIO pins!

Not powerful, but powerful enough.

## First Boot

Moment of truth:
1. Write Debian image to SD card
2. Connect HDMI, keyboard, power
3. Red LED lights up
4. Boot messages scroll by
5. Linux prompt appears!

Full computer for $35. Still can't believe it.

## Benchmarking

Let's see what it can do:
\`\`\`bash
$ cat /proc/cpuinfo
Processor : ARMv6-compatible processor rev 7 (v6l)
BogoMIPS : 697.95

$ free -m
             total  used  free
Mem:          186    38   148

$ hdparm -tT /dev/mmcblk0
Timing cached reads: 188 MB in 2.00 seconds = 93.96 MB/sec
Timing buffered disk reads: 60 MB in 3.06 seconds = 19.62 MB/sec
\`\`\`

Not fast, but usable!

## GPIO Exploration

The killer feature - 26 GPIO pins:
\`\`\`python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)

# Blink LED
for i in range(10):
    GPIO.output(18, GPIO.HIGH)
    time.sleep(0.5)
    GPIO.output(18, GPIO.LOW)
    time.sleep(0.5)
\`\`\`

Python libraries already available. Amazing community.

## Performance Tests

### Web Server
Installed nginx:
- Serves static pages fine
- PHP works but slow
- Could handle small site

### Desktop Environment  
LXDE runs... eventually:
- Takes 45 seconds to load
- Browsing painful but possible
- Youtube? Don't even try

### Compilation
Compiling hello world:
\`\`\`bash
$ time gcc hello.c -o hello
real    0m2.847s
\`\`\`

Slower than my laptop but totally workable.

## First Real Project: PiCam Security System

Built in an afternoon:

### Hardware
- RPi Model B
- USB webcam
- PIR motion sensor
- LED indicator

### Software
\`\`\`python
#!/usr/bin/env python
import RPi.GPIO as GPIO
import subprocess
import datetime
import time

PIR_PIN = 23
LED_PIN = 24

GPIO.setmode(GPIO.BCM)
GPIO.setup(PIR_PIN, GPIO.IN)
GPIO.setup(LED_PIN, GPIO.OUT)

def capture_image():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"capture_{timestamp}.jpg"
    subprocess.call(["fswebcam", "-r", "640x480", filename])
    return filename

def motion_detected(channel):
    GPIO.output(LED_PIN, GPIO.HIGH)
    print(f"Motion detected at {datetime.datetime.now()}")
    
    filename = capture_image()
    print(f"Image saved: {filename}")
    
    time.sleep(5)  # Cooldown
    GPIO.output(LED_PIN, GPIO.LOW)

GPIO.add_event_detect(PIR_PIN, GPIO.RISING, 
                      callback=motion_detected,
                      bouncetime=300)

print("PiCam Security System Active")
print("Press Ctrl+C to exit")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    GPIO.cleanup()
\`\`\`

Total cost: $50. Works perfectly!

## Educational Impact

This will revolutionize CS education:
- Every student can have one
- Real computer, not microcontroller
- Learn Linux, programming, hardware
- GPIO bridges physical world

Already planning workshop for local school.

## Community Response

Forums exploding:
- "What should I build first?"
- "Can it run Minecraft?" (Barely)
- "Cluster of 64 Pis?"
- "Media center for parents?"
- "Robot brain upgrade!"

Everyone has ideas.

## Comparison Shopping

What else $35 buys:
- 0.5 Arduino Unos
- 0.1 BeagleBone
- 2 movie tickets
- 5 Starbucks coffees
- ∞ learning potential

No competition really.

## Limitations Discovered

Being honest:
- SD card corruption common
- Power supply critical (needs 1A)
- USB power limited
- No analog inputs
- Heat can be issue

But for $35? Minor complaints.

## Project Ideas Brewing

My growing list:
1. Cluster computing teaching tool
2. Software defined radio platform
3. Home automation hub
4. Retro gaming console
5. Weather station network
6. Quadcopter brain upgrade
7. Distributed sensor mesh
8. Machine learning edge node

Too many ideas, not enough time.

## The Bigger Picture

Why this matters:
- Democratizes computing
- Enables makers worldwide
- Educational game-changer
- IoT development platform
- Spark for innovation

Wozniak would be proud.

## Ordering More

Immediately ordered 5 more:
- One for each project
- Gifts for maker friends
- Backup (SD cards die)
- Because I can

Limit 1 per person currently. Demand insane.

## Teaching Opportunity

Planning Stanford workshop:
"Intro to Physical Computing with Raspberry Pi"
- Basic Linux
- Python programming
- GPIO control
- Simple projects

Making computing accessible.

## Industry Impact

This will disrupt:
- Educational computing
- Embedded systems
- IoT development
- Prototype market
- Maybe everything?

At $35, why not put computer in everything?

## One Month Later

Built so far:
- Security camera
- Temperature logger
- Spotify player
- VPN server
- Retro game emulator

Still have 3 boards left!

## The Philosophy

Eben Upton's vision:
- Affordable computing
- Inspire next generation
- Learn by doing
- No black boxes

Same philosophy as open source movement.

## Global Impact

Thinking bigger:
- Developing world education
- Research on budget
- Startup enabler
- Creativity democratizer

This little board could change lives.

## Personal Reflection

The Raspberry Pi represents everything I love about engineering:
- Elegant simplicity
- Incredible capability
- Accessible to all
- Community-driven
- Endless possibilities

It's not the fastest computer. It's not the most capable. But at $35, it might be the most important.

## Future Predictions

In 5 years:
- Pi in every classroom
- Millions of makers enabled
- New generation of programmers
- IoT explosion
- Version 2, 3, 4...

The revolution starts with a $35 computer.

## Conclusion

Holding this tiny board, I see the future of computing. Not in expensive workstations or locked-down tablets, but in accessible, hackable, affordable computers that anyone can program.

The Raspberry Pi isn't just a product. It's a movement. And I'm all in.

Time to order more SD cards... 🥧`}
      tags={["raspberry-pi","single-board-computer","education","makers"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "The Raspberry Pi Arrives: $35 Computer Changes Everything - Michael D'Angelo",
    description: "Got my hands on one of the first Raspberry Pi boards. This $35 computer is going to democratize computing and launch a million projects.",
  };
}