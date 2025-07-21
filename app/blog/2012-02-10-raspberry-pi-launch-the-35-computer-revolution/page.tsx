import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Raspberry Pi Launch: The $35 Computer Revolution',
  description: 'After months of waiting, finally got my Raspberry Pi! This credit-card sized computer is going to change everything.',
  keywords: ['raspberry-pi', 'hardware', 'maker', 'education'],
  openGraph: {
    title: 'Raspberry Pi Launch: The $35 Computer Revolution',
    description: 'After months of waiting, finally got my Raspberry Pi! This credit-card sized computer is going to change everything.',
    type: 'article',
    publishedTime: '2012-02-10',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-02-10',
  title: 'Raspberry Pi Launch: The $35 Computer Revolution',
  content: `It's here! After crashing the RS Components and Farnell websites on launch day, my Raspberry Pi finally arrived. This $35 computer is a game-changer.

## Unboxing the Future

The package is tiny:
- Credit card sized board
- 700MHz ARM processor
- 256MB RAM
- HDMI, USB, Ethernet
- GPIO pins for hardware projects

## First Boot

SD card with Debian:

\`\`\`bash
pi@raspberrypi:~$ uname -a
Linux raspberrypi 3.1.9+ #90 PREEMPT armv6l GNU/Linux

pi@raspberrypi:~$ cat /proc/cpuinfo
Processor : ARMv6-compatible processor rev 7 (v6l)
BogoMIPS  : 697.95
\`\`\`

It works!

## Performance Tests

Not a speed demon, but usable:
- Boot time: 35 seconds
- Python scripts: Perfectly fine
- Web browsing: Slow but functional
- 1080p video: Smooth playback!

## First Project: Home Automation Hub

Built a simple home automation system:

\`\`\`python
import RPi.GPIO as GPIO
import time

# Control LED via GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)

def toggle_light(state):
    GPIO.output(18, state)
    
# Web interface to control from phone
from flask import Flask
app = Flask(__name__)

@app.route('/light/<state>')
def light_control(state):
    toggle_light(state == 'on')
    return f'Light is {state}'
\`\`\`

## The Educational Impact

This changes computing education:
- Every kid can have a computer
- Hardware becomes accessible
- Linux learning built-in
- Programming is tangible

## Community Explosion

The forums are on fire:
- Media centers
- Robotics projects  
- Weather stations
- Arcade machines
- Cluster computing

## Comparing to Arduino

Different tools for different jobs:
- Arduino: Real-time, low power, sensors
- Raspberry Pi: Full OS, networking, compute

Both in my toolkit now!

## Supply and Demand

Current situation:
- 10,000 units sold in first day
- Massive backorder
- eBay prices at $200+
- More production coming

## The Vision Realized

Eben Upton's vision coming true:
- Affordable computing for all
- Bringing back bedroom programming
- Hardware experimentation
- Global impact

This little board is going to inspire a generation of makers. Can't wait to see what we build!`,
  tags: ['raspberry-pi', 'hardware', 'maker', 'education'],
  readTime: '15 min',
};

export default function RaspberryPiLaunchThe35ComputerRevolutionPage() {
  return <BlogPost post={post} />;
}
