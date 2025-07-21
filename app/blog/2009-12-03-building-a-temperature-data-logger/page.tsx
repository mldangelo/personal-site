import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Building a Temperature Data Logger - Michael D'Angelo",
  description: "Creating a standalone temperature logger with ATmega328, SD card storage, and real-time clock - my most complex project yet.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-12-03-building-a-temperature-data-logger">
        <header>
          <h1 className="text-4xl font-bold mb-4">Building a Temperature Data Logger</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-12-03').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 12 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['projects', 'microcontroller', 'data-logging', 'temperature'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Finals are next week, so naturally I decided to start a new project. (Engineering student logic: stressed about exams = build something complex.) Here's how I built a temperature data logger that stores months of data to an SD card.</p>
          <h2>The Motivation</h2>
          <p>Our dorm room has terrible heating. It's either Arctic tundra or Death Valley. I wanted data to show maintenance that yes, the temperature really does swing 20 degrees daily.</p>
          <p>Also, I needed a project combining everything I've learned this semester.</p>
          <h2>Design Requirements</h2>
          <ul>
            <li>Log temperature every 15 minutes</li>
            <li>Store data for at least 30 days</li>
            <li>Battery powered (outlet location constraints)</li>
            <li>Accurate timestamps</li>
            <li>Easy data retrieval</li>
            <li>Under $30 budget</li>
          </ul>
          <h2>Component Selection</h2>
          <h3>Microcontroller: ATmega328</h3>
          <p>Why: I know it, it's cheap ($3), low power consumption</p>
          <h3>Temperature Sensor: DS18B20</h3>
          <ul>
            <li>Digital output (no ADC calibration!)</li>
            <li>±0.5°C accuracy</li>
            <li>OneWire protocol (only needs one I/O pin)</li>
            <li>Waterproof version available</li>
          </ul>
          <h3>Storage: SD Card Module</h3>
          <ul>
            <li>Massive storage (even 128MB is overkill)</li>
            <li>FAT filesystem means computer readable</li>
            <li>SPI interface</li>
            <li>$5 on eBay</li>
          </ul>
          <h3>Real-Time Clock: DS1307</h3>
          <ul>
            <li>Keeps accurate time</li>
            <li>Battery backup</li>
            <li>I2C interface</li>
            <li>Crystal included</li>
          </ul>
          <h3>Display: 16×2 LCD</h3>
          <ul>
            <li>Shows current temp and time</li>
            <li>Confirms it's working</li>
            <li>Because blinking LEDs are so last month</li>
          </ul>
          <h2>The Build Process</h2>
          <h3>Day 1: Breadboard Prototype</h3>
          <p>Got each component working individually:</p>
          <ul>
            <li>Temperature reading: Check</li>
            <li>SD card writing: Check</li>
            <li>RTC reading: Check</li>
            <li>LCD display: Check</li>
          </ul>
          <p>Integration time!</p>
          <h3>Day 2: Integration Nightmare</h3>
          <p>Everything stopped working together. Why?</p>
          <ul>
            <li>Power issues: SD card draws 100mA peaks</li>
            <li>SPI conflicts: SD card was hogging the bus</li>
            <li>I2C pullups missing: RTC communication failed</li>
          </ul>
          <p>Fixed with:</p>
          <ul>
            <li>Bigger capacitors on power rail</li>
            <li>Proper CS (chip select) management</li>
            <li>4.7k pullup resistors on I2C</li>
          </ul>
          <h3>Day 3: Software Development</h3>
          <p>The main loop logic:</p>
          <pre className="language-c"><code>{`void loop() {
    if (minuteChanged()) {
        if (minutes % 15 == 0) {
            float temp = readTemperature();
            String timestamp = getRTCTime();
            logToSD(timestamp, temp);
            updateDisplay(timestamp, temp);
        }
    }
    sleep_mode();  // Save power
}`}</code></pre>
          <h3>Day 4: Power Optimization</h3>
          <p>Initial current draw: 50mA constant After optimization: 5mA average</p>
          <p>How:</p>
          <ul>
            <li>Sleep mode between readings</li>
            <li>Turn off LCD backlight</li>
            <li>Disable unused peripherals</li>
            <li>Run at lower clock speed (8MHz)</li>
          </ul>
          <p>Battery life calculation:</p>
          <ul>
            <li>2000mAh battery ÷ 5mA = 400 hours = 16 days</li>
          </ul>
          <p>Good enough!</p>
          <h3>Day 5: Enclosure and Polish</h3>
          <p>Found a plastic food container that fit perfectly. Drilled holes for:</p>
          <ul>
            <li>LCD window</li>
            <li>Power switch</li>
            <li>Temperature sensor cable</li>
            <li>SD card access</li>
          </ul>
          <h2>The Code Deep Dive</h2>
          <h3>SD Card Challenges</h3>
          <p>FAT filesystem on Arduino is memory hungry. Solution: Minimal FAT library and careful buffer management.</p>
          <pre className="language-c"><code>{`void logToSD(String time, float temp) {
    File dataFile = SD.open("templog.csv", FILE_WRITE);
    if (dataFile) {
        dataFile.print(time);
        dataFile.print(",");
        dataFile.println(temp);
        dataFile.close();
    }
}`}</code></pre>
          <h3>Timestamp Format</h3>
          <p>Decided on CSV format for easy Excel import:</p>
          <pre className="language-text"><code>{`2009-12-03 14:15:00,72.5
2009-12-03 14:30:00,71.8
2009-12-03 14:45:00,71.2`}</code></pre>
          <h3>Temperature Averaging</h3>
          <p>Single readings can be noisy. Solution: Average 10 readings:</p>
          <pre className="language-c"><code>{`float readTemperature() {
    float sum = 0;
    for(int i = 0; i < 10; i++) {
        sensors.requestTemperatures();
        sum += sensors.getTempFByIndex(0);
        delay(100);
    }
    return sum / 10.0;
}`}</code></pre>
          <h2>Problems Encountered</h2>
          <h3>The Midnight Bug</h3>
          <p>Logger stopped working every night at midnight. Why? RTC day rollover caused string buffer overflow. Classic off-by-one error.</p>
          <h3>SD Card Corruption</h3>
          <p>Occasionally corrupted SD card. Cause: Not closing files properly during power loss. Solution: Added big capacitor to maintain power during SD write.</p>
          <h3>Temperature Sensor Location</h3>
          <p>First attempt: Sensor inside enclosure. Result: Measured heat from electronics, not room. Fix: External sensor on 3-foot cable.</p>
          <h2>Data Analysis</h2>
          <p>After 5 days of logging:</p>
          <ul>
            <li>Confirmed: Room temperature varies from 58°F to 78°F daily</li>
            <li>Pattern: Coldest at 6 AM, warmest at 4 PM</li>
            <li>Discovery: Heating turns off at 11 PM, back on at 6 AM</li>
          </ul>
          <p>Graph made in Excel clearly shows the problem. Maintenance visit scheduled!</p>
          <h2>Cost Breakdown</h2>
          <ul>
            <li>ATmega328: $3</li>
            <li>DS18B20: $4</li>
            <li>SD card module: $5</li>
            <li>DS1307 RTC: $3</li>
            <li>16×2 LCD: $5</li>
            <li>Miscellaneous: $8</li>
            <li>Total: $28</li>
          </ul>
          <p>Under budget!</p>
          <h2>Lessons Learned</h2>
          <p>1. <strong>Integration is harder than individual components</strong>: Always 2. <strong>Power management matters</strong>: Even for plug-in projects 3. <strong>Data formats matter</strong>: CSV was the right choice 4. <strong>Test edge cases</strong>: Midnight rollover, power loss, card full 5. <strong>Document while building</strong>: I'm writing this from memory/notes</p>
          <h2>Future Improvements</h2>
          <p>Version 2 ideas:</p>
          <ul>
            <li>Multiple temperature sensors</li>
            <li>Humidity logging</li>
            <li>Wireless data retrieval</li>
            <li>Solar powered</li>
            <li>Web interface</li>
          </ul>
          <h2>Was It Worth It?</h2>
          <p>Absolutely! I now have:</p>
          <ul>
            <li>Practical SPI and I2C experience</li>
            <li>File system knowledge</li>
            <li>Power optimization skills</li>
            <li>A tool that solved a real problem</li>
            <li>Something cool for the portfolio</li>
          </ul>
          <h2>For Others Building This</h2>
          <p>Tips:</p>
          <ul>
            <li>Start simple (just temperature, no time)</li>
            <li>Add features incrementally</li>
            <li>Use libraries but understand them</li>
            <li>Test each component thoroughly first</li>
            <li>Keep good notes</li>
          </ul>
          <h2>The Bigger Picture</h2>
          <p>This project combined:</p>
          <ul>
            <li>Digital electronics (microcontroller)</li>
            <li>Analog sensors (temperature)</li>
            <li>Communication protocols (SPI, I2C, OneWire)</li>
            <li>File systems (FAT)</li>
            <li>Power management</li>
            <li>Practical problem solving</li>
          </ul>
          <p>Everything from this semester in one project!</p>
          <h2>Final Thoughts</h2>
          <p>Building something that solves a real problem is incredibly satisfying. Sure, I could have bought a commercial logger for $50, but then I wouldn't have learned anything.</p>
          <p>Now back to studying for finals. But first, let me check today's temperature graph...</p>
          <p><em>Update: Maintenance fixed our heating after seeing the data. Engineering win!</em></p>
        </div>
      </article>
    </>
  );
}