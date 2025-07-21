import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Spring Break Project: Building a GPS Data Logger - Michael D'Angelo",
  description: "While everyone else went to Florida, I stayed home and built a GPS tracker. Records position, altitude, and speed to SD card.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-03-10-spring-break-project-building-a-gps-data-logger">
        <header>
          <h1 className="text-4xl font-bold mb-4">Spring Break Project: Building a GPS Data Logger</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-03-10').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 14 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['gps', 'data-logger', 'arduino', 'projects'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Spring break. Roommates went to beaches. I went to SparkFun. Came back with GPS module and grand plans for a data logger. Here's how I spent my "vacation" building something actually useful.</p>
          <h2>The Inspiration</h2>
          <p>Upcoming summer road trip needs documentation beyond photos. Want to track:</p>
          <ul>
            <li>Exact route taken</li>
            <li>Speed profiles</li>
            <li>Elevation changes</li>
            <li>Points of interest</li>
          </ul>
          <p>Commercial GPS loggers: $200+ My version: $45</p>
          <p>Time to build!</p>
          <h2>Hardware Selection</h2>
          <h3>GPS Module: EM-406A</h3>
          <ul>
            <li>SiRF Star III chipset</li>
            <li>20 channel receiver</li>
            <li>5Hz update rate possible</li>
            <li>Serial output (4800 baud default)</li>
            <li>$40 from SparkFun</li>
          </ul>
          <p>Pros: Just works, good sensitivity Cons: No antenna flexibility</p>
          <h3>Microcontroller: ATmega328</h3>
          <p>Already familiar from Arduino projects. Running at 16MHz.</p>
          <h3>Storage: SD Card</h3>
          <p>Using 2GB card (massive overkill). FAT16 formatted for simplicity.</p>
          <h3>Display: 16×2 LCD</h3>
          <p>Shows current position, speed, satellite count. Essential for debugging.</p>
          <h3>Power: 18650 Li-Ion</h3>
          <p>Single cell, 2600mAh. Should run for 10+ hours.</p>
          <h2>The NMEA Protocol</h2>
          <p>GPS speaks NMEA 0183. Sentences look like:</p>
          <pre className="language-text"><code>{`\$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A`}</code></pre>
          <p>Decoding:</p>
          <ul>
            <li>$GPRMC: Recommended minimum data</li>
            <li>123519: Time (12:35:19 UTC)</li>
            <li>A: Status (Active)</li>
            <li>4807.038,N: Latitude</li>
            <li>01131.000,E: Longitude</li>
            <li>022.4: Speed in knots</li>
            <li>084.4: Course</li>
            <li>230394: Date</li>
          </ul>
          <p>Parsing this in Arduino = string manipulation nightmare.</p>
          <h2>Software Architecture</h2>
          <h3>Interrupt-Driven Serial</h3>
          <p>GPS spews data constantly. Can't miss sentences while writing SD card.</p>
          <pre className="language-c"><code>{`ISR(USART_RX_vect) {
    char c = UDR0;
    if (bufferPos < BUFFER_SIZE - 1) {
        buffer[bufferPos++] = c;
        if (c == '\\n') {
            sentenceReady = true;
        }
    }
}`}</code></pre>
          <h3>Sentence Parsing</h3>
          <p>Only care about GPRMC and GPGGA sentences:</p>
          <ul>
            <li>GPRMC: Position, speed, course</li>
            <li>GPGGA: Altitude, fix quality, satellite count</li>
          </ul>
          <pre className="language-c"><code>{`void parseNMEA(char* sentence) {
    if (strncmp(sentence, "\$GPRMC", 6) == 0) {
        parseRMC(sentence);
    } else if (strncmp(sentence, "\$GPGGA", 6) == 0) {
        parseGGA(sentence);
    }
}`}</code></pre>
          <h3>SD Card Logging</h3>
          <p>Log format: CSV for easy Excel import</p>
          <pre className="language-text"><code>{`DateTime,Latitude,Longitude,Altitude,Speed,Course,Satellites
2010-03-10 14:23:45,42.123456,-71.234567,45.2,65.3,235,8`}</code></pre>
          <p>Write every 5 seconds to minimize card wear.</p>
          <h2>Power Management Saga</h2>
          <p>First version: 8 hours battery life. Not enough.</p>
          <p>Power audit:</p>
          <ul>
            <li>GPS module: 45mA (constantly)</li>
            <li>ATmega328: 15mA</li>
            <li>SD card: 20mA average</li>
            <li>LCD backlight: 20mA</li>
          </ul>
          <p>Total: 100mA = 26 hours theoretical</p>
          <p>Where's the drain?</p>
          <h3>The Voltage Regulator Fail</h3>
          <p>Using 7805 linear regulator. Input: 4.2V, Output: 5V Wait... that doesn't work. Output was 3.8V!</p>
          <p>Switched to boost converter (MIN2606). Now:</p>
          <ul>
            <li>Input: 2.7-4.2V (battery range)</li>
            <li>Output: Solid 5V</li>
            <li>Efficiency: 85%</li>
          </ul>
          <p>Lesson: Check regulator dropout voltage!</p>
          <h3>Sleep Mode Optimization</h3>
          <p>GPS needs constant power, but MCU doesn't:</p>
          <pre className="language-c"><code>{`set_sleep_mode(SLEEP_MODE_IDLE);
sleep_enable();
sei();
sleep_cpu();
// Serial interrupt wakes us
sleep_disable();`}</code></pre>
          <p>Saved 10mA. Every bit helps.</p>
          <h2>Field Testing</h2>
          <h3>Test 1: Walk Around Campus</h3>
          <ul>
            <li>Acquisition time: 45 seconds (cold start)</li>
            <li>Accuracy: 3-5 meters</li>
            <li>Update rate: Solid 1Hz</li>
            <li>Building shadows cause dropouts</li>
          </ul>
          <h3>Test 2: Car Drive</h3>
          <ul>
            <li>Speed accurate to 0.1 mph (verified with car speedometer)</li>
            <li>Quick reacquisition after tunnels</li>
            <li>Altitude jumps around (+/- 10m)</li>
          </ul>
          <h3>Test 3: Bike Ride</h3>
          <p>Discovered problem: Vibration causes SD card errors! Solution: More secure card socket, foam padding.</p>
          <h2>Enclosure Design</h2>
          <p>Needed weatherproof case for real use.</p>
          <p>Found waterproof box at hardware store. Modifications:</p>
          <ul>
            <li>Hole for GPS antenna (sealed with epoxy)</li>
            <li>Waterproof power switch</li>
            <li>Clear window for LCD (plexiglass)</li>
            <li>Magnetic mount for car roof</li>
          </ul>
          <p>Total enclosure cost: $8</p>
          <h2>Data Visualization</h2>
          <p>Raw CSV is boring. Wrote Python script to generate KML for Google Earth:</p>
          <pre className="language-python"><code>{`def create_kml(csv_file):
    kml = simplekml.Kml()
    path = kml.newlinestring(name="GPS Track")
    
    coords = []
    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            coords.append((
                float(row['Longitude']),
                float(row['Latitude']),
                float(row['Altitude'])
            ))
    
    path.coords = coords
    path.style.linestyle.color = simplekml.Color.red
    path.style.linestyle.width = 5
    
    kml.save("track.kml")`}</code></pre>
          <p>Seeing my route overlaid on satellite imagery = mind blown!</p>
          <h2>Advanced Features Added</h2>
          <h3>Geofencing</h3>
          <p>Alert when entering/leaving defined areas:</p>
          <pre className="language-c"><code>{`typedef struct {
    float lat;
    float lon;
    float radius;
    char name[20];
} Geofence;

Geofence home = {42.1234, -71.2345, 0.1, "Home"};

if (distance(current, home) < home.radius) {
    if (!wasHome) {
        logEvent("Arrived home");
        wasHome = true;
    }
}`}</code></pre>
          <h3>Speed Alerts</h3>
          <p>Beep if exceeding set speed (useful for bike rides):</p>
          <pre className="language-c"><code>{`if (speed_mph > SPEED_LIMIT) {
    tone(BUZZER_PIN, 1000, 100);
}`}</code></pre>
          <h3>Statistics Display</h3>
          <p>Second LCD page shows:</p>
          <ul>
            <li>Trip distance</li>
            <li>Average speed</li>
            <li>Max speed</li>
            <li>Time elapsed</li>
          </ul>
          <h2>Lessons Learned</h2>
          <h3>Hardware Lessons</h3>
          <p>1. <strong>GPS needs clear sky view</strong>: Obvious but important 2. <strong>Backup power critical</strong>: Added coin cell for GPS memory 3. <strong>Connectors matter</strong>: Vibration kills breadboard connections 4. <strong>Waterproofing is hard</strong>: Many iterations to seal properly</p>
          <h3>Software Lessons</h3>
          <p>1. <strong>NMEA has many sentences</strong>: Only parse what you need 2. <strong>Float math is expensive</strong>: Use integer math where possible 3. <strong>Buffer overruns happen</strong>: Always check bounds 4. <strong>SD cards are slow</strong>: Buffer writes carefully</p>
          <h2>Real World Usage</h2>
          <p>Took it on test road trip to Niagara Falls:</p>
          <ul>
            <li>6 hours continuous logging</li>
            <li>15,000 data points recorded</li>
            <li>Battery lasted whole trip</li>
            <li>Zero crashes!</li>
          </ul>
          <p>Discovered:</p>
          <ul>
            <li>Speed trap locations (sudden deceleration)</li>
            <li>Favorite route has unnecessary detour</li>
            <li>Gas station stops clearly visible</li>
            <li>Elevation profile interesting</li>
          </ul>
          <h2>Cost Analysis</h2>
          <p>Final build:</p>
          <ul>
            <li>GPS module: $40</li>
            <li>ATmega328: $3</li>
            <li>SD card socket: $3</li>
            <li>LCD: $5</li>
            <li>Battery & charger: $10</li>
            <li>Enclosure & misc: $15</li>
          </ul>
          <p>Total: $76</p>
          <p>Over budget but worth it for features.</p>
          <h2>Compare to Smartphone</h2>
          <p>"Why not use phone GPS?"</p>
          <p>Good question! My logger:</p>
          <ul>
            <li>10+ hour battery life</li>
            <li>No cellular needed</li>
            <li>Raw NMEA access</li>
            <li>Customizable logging</li>
            <li>Learn by building</li>
          </ul>
          <p>Phone advantages:</p>
          <ul>
            <li>Already have it</li>
            <li>Better screen</li>
            <li>Maps included</li>
            <li>No building required</li>
          </ul>
          <p>Different use cases.</p>
          <h2>Open Source Release</h2>
          <p>Posted everything on GitHub:</p>
          <ul>
            <li>Schematic (Eagle files)</li>
            <li>Arduino code</li>
            <li>Python visualization scripts</li>
            <li>Build guide</li>
          </ul>
          <p>Already got pull request adding GLONASS support!</p>
          <h2>Future Improvements</h2>
          <p>Version 2 ideas:</p>
          <ul>
            <li>Bluetooth for wireless data transfer</li>
            <li>Accelerometer for dynamics</li>
            <li>Barometric pressure for better altitude</li>
            <li>Solar charging</li>
            <li>Multiple GPS constellation support</li>
          </ul>
          <p>But current version does everything I need.</p>
          <h2>The Payoff</h2>
          <p>Summer road trip: 2000 miles logged Generated beautiful visualization of entire route Speed graph shows every rest stop Elevation profile reveals mountain passes</p>
          <p>More importantly: Built something real that I use.</p>
          <h2>Tips for GPS Projects</h2>
          <p>1. <strong>Buy module with antenna</strong>: External antenna hassles not worth it 2. <strong>Test outdoors</strong>: GPS doesn't work indoors (duh) 3. <strong>Consider update rate</strong>: 1Hz plenty for most uses 4. <strong>Log raw NMEA</strong>: Can post-process later 5. <strong>Add timestamp</strong>: GPS time is UTC, convert for local</p>
          <h2>Educational Value</h2>
          <p>This project taught:</p>
          <ul>
            <li>Serial protocols (NMEA)</li>
            <li>Power optimization</li>
            <li>File systems (FAT16)</li>
            <li>Geographic calculations</li>
            <li>Data visualization</li>
          </ul>
          <p>Spring break well spent!</p>
          <p><em>Next project: Adding compass module for better course detection when stationary. Also want to log OBD-II data from car. This rabbit hole goes deep...</em></p>
        </div>
      </article>
    </>
  );
}