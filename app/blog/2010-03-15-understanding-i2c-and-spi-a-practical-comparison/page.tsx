import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Understanding I2C and SPI: A Practical Comparison - Michael D'Angelo",
  description: "Finally understanding serial communication protocols after building projects with both. Here's what I learned about I2C and SPI the hard way.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-03-15-understanding-i2c-and-spi-a-practical-comparison">
        <header>
          <h1 className="text-4xl font-bold mb-4">Understanding I2C and SPI: A Practical Comparison</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-03-15').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 13 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['i2c', 'spi', 'protocols', 'communication'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Started the week confused about I2C and SPI. Ended it with working projects using both. Here's my practical guide to these essential communication protocols, learned through trial, error, and lots of scope traces.</p>
          <h2>The Communication Problem</h2>
          <p>Microcontrollers need to talk to:</p>
          <ul>
            <li>Sensors</li>
            <li>Displays</li>
            <li>Memory chips</li>
            <li>Other microcontrollers</li>
          </ul>
          <p>Parallel uses too many pins. Serial is the answer. But which protocol?</p>
          <h2>I2C: The Two-Wire Wonder</h2>
          <p>I2C (Inter-Integrated Circuit) uses just two wires:</p>
          <ul>
            <li>SDA (Serial Data)</li>
            <li>SCL (Serial Clock)</li>
          </ul>
          <p>Both are bidirectional with pull-up resistors.</p>
          <h3>My First I2C Project: Temperature Logger</h3>
          <p>Connected:</p>
          <ul>
            <li>Arduino (master)</li>
            <li>DS1307 RTC</li>
            <li>24LC256 EEPROM</li>
            <li>LM75 temperature sensor</li>
          </ul>
          <p>All on the same two wires!</p>
          <h3>How I2C Actually Works</h3>
          <p>Watched it on scope. Mind = blown.</p>
          <p>Start condition: SDA falls while SCL high</p>
          <pre className="language-text"><code>{`SCL: ‾‾‾‾‾‾‾‾‾‾‾‾|_|‾|_|‾|_
SDA: ‾‾‾‾‾‾|_______|‾|___|‾|_
      START  ADDR[6:0] R/W ACK`}</code></pre>
          <p>Each device has unique address. Master calls out address, matching device responds.</p>
          <h3>I2C Code That Actually Works</h3>
          <p>Reading temperature from LM75:</p>
          <pre className="language-c"><code>{`float readTemperature() {
    Wire.beginTransmission(0x48);  // LM75 address
    Wire.write(0x00);              // Temperature register
    Wire.endTransmission();
    
    Wire.requestFrom(0x48, 2);     // Read 2 bytes
    int16_t raw = Wire.read() << 8 | Wire.read();
    
    return raw / 256.0;            // Convert to celsius
}`}</code></pre>
          <p>So clean! No chip select pins, no complex timing.</p>
          <h3>I2C Gotchas I Hit</h3>
          <p>1. <strong>Pull-up Resistors</strong> First attempt: No pull-ups. Nothing worked. Solution: 4.7kΩ to VCC on both lines.</p>
          <p>2. <strong>Address Conflicts</strong> Two devices with same address = chaos. Solution: Many devices have address select pins.</p>
          <p>3. <strong>Speed Limitations</strong> Standard: 100kHz, Fast: 400kHz Tried 1MHz, devices stopped responding.</p>
          <p>4. <strong>Bus Capacitance</strong> Long wires = more capacitance = rounded signals. Keep wires short!</p>
          <h2>SPI: The Speed Demon</h2>
          <p>SPI uses four wires (minimum):</p>
          <ul>
            <li>MOSI (Master Out, Slave In)</li>
            <li>MISO (Master In, Slave Out)</li>
            <li>SCK (Serial Clock)</li>
            <li>SS/CS (Slave Select/Chip Select)</li>
          </ul>
          <p>Each slave needs its own CS pin.</p>
          <h3>My First SPI Project: SD Card Interface</h3>
          <p>SD cards speak SPI. Built data logger with:</p>
          <ul>
            <li>Arduino (master)</li>
            <li>SD card</li>
            <li>25LC256 SPI EEPROM (for comparison)</li>
          </ul>
          <h3>How SPI Actually Works</h3>
          <p>Full duplex! Data flows both directions simultaneously.</p>
          <p>Scope trace:</p>
          <pre className="language-text"><code>{`CS:   ‾‾‾‾|___________|‾‾‾‾
SCK:  ____|‾|_|‾|_|‾|_|____
MOSI: ____X=X=X=X=X=X=X____
MISO: ____X=X=X=X=X=X=X____`}</code></pre>
          <p>Master drives clock. Data sampled on edge (configurable which edge).</p>
          <h3>SPI Code Example</h3>
          <p>Reading from SPI EEPROM:</p>
          <pre className="language-c"><code>{`byte readEEPROM(uint16_t address) {
    digitalWrite(CS_PIN, LOW);
    
    SPI.transfer(0x03);          // Read command
    SPI.transfer(address >> 8);   // Address high byte
    SPI.transfer(address & 0xFF); // Address low byte
    byte data = SPI.transfer(0);  // Read data
    
    digitalWrite(CS_PIN, HIGH);
    return data;
}`}</code></pre>
          <p>More complex than I2C but blazing fast!</p>
          <h3>SPI Modes Confusion</h3>
          <p>Spent hours debugging. Learned about SPI modes:</p>
          <ul>
            <li>Mode 0: CPOL=0, CPHA=0 (most common)</li>
            <li>Mode 1: CPOL=0, CPHA=1</li>
            <li>Mode 2: CPOL=1, CPHA=0</li>
            <li>Mode 3: CPOL=1, CPHA=1</li>
          </ul>
          <p>Device datasheet specifies mode. Get it wrong = garbage data.</p>
          <h2>Head-to-Head Comparison</h2>
          <p>Built same project with both protocols:</p>
          <h3>Speed Test</h3>
          <p>Transferring 1KB:</p>
          <ul>
            <li>I2C @ 400kHz: 25ms</li>
            <li>SPI @ 8MHz: 1.3ms</li>
          </ul>
          <p>SPI is 20× faster!</p>
          <h3>Pin Count</h3>
          <p>Connecting 3 devices:</p>
          <ul>
            <li>I2C: 2 pins total</li>
            <li>SPI: 6 pins (3 CS + 3 shared)</li>
          </ul>
          <p>I2C wins for pin economy.</p>
          <h3>Distance Test</h3>
          <p>How far can signals travel?</p>
          <p>I2C with pull-ups:</p>
          <ul>
            <li>100kHz: 2 meters OK</li>
            <li>400kHz: 0.5 meters max</li>
          </ul>
          <p>SPI:</p>
          <ul>
            <li>1MHz: 0.3 meters</li>
            <li>8MHz: 0.1 meters (10cm!)</li>
          </ul>
          <p>I2C better for distance.</p>
          <h3>Protocol Complexity</h3>
          <p>I2C:</p>
          <ul>
            <li>Start/stop conditions</li>
            <li>Addressing</li>
            <li>Clock stretching</li>
            <li>Multi-master capable</li>
          </ul>
          <p>SPI:</p>
          <ul>
            <li>Just shift data</li>
            <li>CS handles addressing</li>
            <li>No overhead</li>
            <li>Master controls everything</li>
          </ul>
          <p>SPI simpler conceptually.</p>
          <h2>When to Use Which?</h2>
          <h3>Use I2C When:</h3>
          <ul>
            <li>Pin count matters</li>
            <li>Multiple devices needed</li>
            <li>Low speed OK (sensors, RTC)</li>
            <li>Longer distances</li>
            <li>Standard compliance needed</li>
          </ul>
          <h3>Use SPI When:</h3>
          <ul>
            <li>Speed critical</li>
            <li>Real-time data (ADCs, displays)</li>
            <li>Simple protocol needed</li>
            <li>Full duplex required</li>
            <li>Have pins to spare</li>
          </ul>
          <h2>Real Project: IMU Interface</h2>
          <p>Building IMU with:</p>
          <ul>
            <li>MPU6050 (I2C accelerometer/gyro)</li>
            <li>HMC5883L (I2C magnetometer)</li>
            <li>BMP180 (I2C pressure)</li>
            <li>SD card (SPI for logging)</li>
          </ul>
          <p>Mixed protocols! Common ground, separate buses.</p>
          <h3>The Code Architecture</h3>
          <pre className="language-c"><code>{`void setup() {
    Wire.begin();        // I2C bus
    Wire.setClock(400000); // Fast mode
    
    SPI.begin();         // SPI bus
    SPI.setClockDivider(SPI_CLOCK_DIV2); // 8MHz
    
    initSensors();       // Configure all devices
}

void loop() {
    readI2CSensors();    // Get sensor data
    logToSPI();          // Write to SD card
}`}</code></pre>
          <p>Both protocols coexisting peacefully!</p>
          <h2>Advanced Techniques</h2>
          <h3>I2C Clock Stretching</h3>
          <p>Slow devices can hold SCL low to pause master. Discovered when sensor stopped responding during complex calculations.</p>
          <h3>SPI Daisy Chaining</h3>
          <p>Some devices support connecting MISO→MOSI. One CS controls all. Mind = blown.</p>
          <h3>Multi-Master I2C</h3>
          <p>Multiple masters on same bus. Arbitration prevents conflicts. Haven't successfully implemented yet.</p>
          <h2>Debugging Tools</h2>
          <h3>Logic Analyzer</h3>
          <p>Best investment ever. Decodes protocols automatically. I2C: Shows address, data, ACK/NACK SPI: Shows each byte transferred</p>
          <h3>Oscilloscope</h3>
          <p>Essential for signal integrity. Check rise times, voltage levels, noise.</p>
          <h3>Bus Pirate</h3>
          <p>Universal serial tool. Can speak both protocols. Great for testing devices before writing code.</p>
          <h2>Common Problems and Solutions</h2>
          <h3>I2C Not Working</h3>
          <p>1. Check pull-ups (90% of problems) 2. Verify addresses (use I2C scanner) 3. Check voltage levels (3.3V vs 5V) 4. Reduce speed 5. Shorten wires</p>
          <h3>SPI Not Working</h3>
          <p>1. Check SPI mode 2. Verify CS polarity 3. Check byte order (MSB vs LSB first) 4. Measure clock speed 5. Add delays between transfers</p>
          <h2>Performance Optimization</h2>
          <h3>I2C Speed Tricks</h3>
          <ul>
            <li>Use fast mode (400kHz)</li>
            <li>Minimize protocol overhead</li>
            <li>Batch reads/writes</li>
            <li>Use repeated start</li>
          </ul>
          <h3>SPI Speed Tricks</h3>
          <ul>
            <li>Increase clock (check device limits)</li>
            <li>Use hardware SPI, not bitbang</li>
            <li>Optimize CS switching</li>
            <li>Use DMA if available</li>
          </ul>
          <h2>Power Considerations</h2>
          <p>I2C:</p>
          <ul>
            <li>Pull-ups constantly draw power</li>
            <li>Lower value = more power</li>
            <li>Trade-off with rise time</li>
          </ul>
          <p>SPI:</p>
          <ul>
            <li>No pull-ups needed</li>
            <li>Power only during transfers</li>
            <li>Better for battery devices</li>
          </ul>
          <h2>My Protocol Preferences</h2>
          <p>For sensors: I2C</p>
          <ul>
            <li>Clean wiring</li>
            <li>Standard interface</li>
            <li>Good enough speed</li>
          </ul>
          <p>For displays/storage: SPI</p>
          <ul>
            <li>Need the speed</li>
            <li>Worth extra pins</li>
            <li>Better for streaming data</li>
          </ul>
          <h2>Future Learning</h2>
          <p>Want to explore:</p>
          <ul>
            <li>CAN bus (automotive)</li>
            <li>1-Wire (unique addressing)</li>
            <li>RS-485 (long distance)</li>
            <li>USB (complex but everywhere)</li>
          </ul>
          <p>Serial protocols are everywhere!</p>
          <h2>Tips for Beginners</h2>
          <p>1. <strong>Start with working examples</strong>: Get known-good code first 2. <strong>Use scope/analyzer</strong>: Can't debug what you can't see 3. <strong>Check voltage levels</strong>: 3.3V device + 5V bus = dead device 4. <strong>Read datasheets carefully</strong>: Timing diagrams are critical 5. <strong>Keep wires short</strong>: Signal integrity matters</p>
          <h2>The Bigger Picture</h2>
          <p>Understanding these protocols opens doors:</p>
          <ul>
            <li>Can interface any sensor</li>
            <li>Design custom peripherals</li>
            <li>Debug existing systems</li>
            <li>Build complex projects</li>
          </ul>
          <p>From confusion to confidence in one week. Serial communication mastered!</p>
          <p><em>Currently designing CubeSat comm board using both protocols. I2C for housekeeping, SPI for high-speed radio. Best tool for each job!</em></p>
        </div>
      </article>
    </>
  );
}