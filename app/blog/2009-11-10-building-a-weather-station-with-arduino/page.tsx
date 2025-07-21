import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Building a Weather Station with Arduino</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-11-10">November 9, 2009</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">arduino</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">sensors</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">project</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">weather</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Buffalo weather is insane. Yesterday: 65°F and sunny. Today: 38°F and snowing. So naturally, I decided to build a weather station to track just how crazy it gets.</p>
            <h2>Project Goals</h2>
            <p>Build a system that:</p>
            <ul>
              <li>Measures temperature, humidity, and pressure</li>
              <li>Logs data to SD card</li>
              <li>Displays current conditions on LCD</li>
              <li>Uploads to web (eventually)</li>
              <li>Costs less than a textbook</li>
            </ul>
            <p>Spoiler: Achieved all but the last one.</p>
            <h2>Hardware Selection</h2>
            <h3>The Sensors</h3>
            <p>After researching (and checking my budget):</p>
            <ul>
              <li><strong>DHT22</strong>: Temperature & humidity ($10)</li>
              <li><strong>BMP085</strong>: Barometric pressure ($20)</li>
              <li><strong>Arduino Uno</strong>: Brain of operation (already had)</li>
              <li><strong>16x2 LCD</strong>: Display ($5)</li>
              <li><strong>SD card module</strong>: Data logging ($8)</li>
              <li><strong>RTC DS1307</strong>: Real-time clock ($5)</li>
            </ul>
            <p>Total damage: ~$48 (there goes eating out for two weeks)</p>
            <h3>The Build</h3>
            <p>Breadboard is getting crowded:</p>
            <pre className="language-text"><code>{`DHT22:\\n- Data → Pin 2\\n- VCC → 5V\\n- GND → GND\\n- 10kΩ pullup resistor\\n\\nBMP085 (I2C):\\n- SDA → A4\\n- SCL → A5\\n- VCC → 3.3V (important!)\\n- GND → GND\\n\\nLCD (I2C backpack to save pins):\\n- SDA → A4 (shared with BMP085)\\n- SCL → A5 (shared)\\n- VCC → 5V\\n- GND → GND\\n\\nSD Card (SPI):\\n- CS → Pin 10\\n- MOSI → Pin 11\\n- MISO → Pin 12\\n- SCK → Pin 13\\n\\nRTC (I2C):\\n- SDA → A4 (I2C bus party)\\n- SCL → A5\\n- VCC → 5V\\n- GND → GND`}</code></pre>
            <h2>The Code</h2>
            <p>Getting everything to play nice took some work:</p>
            <pre className="language-cpp"><code>{`#include <DHT.h>\\n#include <Wire.h>\\n#include <Adafruit_BMP085.h>\\n#include <LiquidCrystal_I2C.h>\\n#include <SD.h>\\n#include <RTClib.h>\\n\\n// Initialize components\\nDHT dht(2, DHT22);\\nAdafruit_BMP085 bmp;\\nLiquidCrystal_I2C lcd(0x27, 16, 2);\\nRTC_DS1307 rtc;\\n\\nconst int chipSelect = 10;\\nFile dataFile;\\n\\nvoid setup() {\\n  Serial.begin(9600);\\n  \\n  // Initialize everything\\n  dht.begin();\\n  bmp.begin();\\n  lcd.init();\\n  lcd.backlight();\\n  rtc.begin();\\n  \\n  if (!SD.begin(chipSelect)) {\\n    lcd.print("SD Card Error!");\\n    while(1);\\n  }\\n  \\n  // Create header in CSV file\\n  dataFile = SD.open("weather.csv", FILE_WRITE);\\n  if (dataFile) {\\n    dataFile.println("DateTime,Temp_C,Humidity,Pressure_Pa");\\n    dataFile.close();\\n  }\\n}\\n\\nvoid loop() {\\n  // Read sensors\\n  float temp = dht.readTemperature();\\n  float humidity = dht.readHumidity();\\n  float pressure = bmp.readPressure();\\n  \\n  // Get timestamp\\n  DateTime now = rtc.now();\\n  \\n  // Display on LCD\\n  lcd.clear();\\n  lcd.setCursor(0,0);\\n  lcd.print("T:");\\n  lcd.print(temp);\\n  lcd.print("C H:");\\n  lcd.print(humidity);\\n  lcd.print("%");\\n  \\n  lcd.setCursor(0,1);\\n  lcd.print("P:");\\n  lcd.print(pressure/100); // Convert to hPa\\n  lcd.print(" hPa");\\n  \\n  // Log to SD card\\n  dataFile = SD.open("weather.csv", FILE_WRITE);\\n  if (dataFile) {\\n    dataFile.print(now.year());\\n    dataFile.print("/");\\n    dataFile.print(now.month());\\n    dataFile.print("/");\\n    dataFile.print(now.day());\\n    dataFile.print(" ");\\n    dataFile.print(now.hour());\\n    dataFile.print(":");\\n    dataFile.print(now.minute());\\n    dataFile.print(",");\\n    dataFile.print(temp);\\n    dataFile.print(",");\\n    dataFile.print(humidity);\\n    dataFile.print(",");\\n    dataFile.println(pressure);\\n    dataFile.close();\\n  }\\n  \\n  delay(60000); // Log every minute\\n}`}</code></pre>
            <h2>Challenges and Solutions</h2>
            <h3>1. I2C Address Conflicts</h3>
            <p>Three devices on I2C bus. LCD and RTC had same default address (0x27). Solution: Solder jumper on LCD backpack to change to 0x3F.</p>
            <h3>2. Power Issues</h3>
            <p>SD card module draws more current than expected. Arduino regulator getting warm. Added external 5V power supply (phone charger + some sketchy wiring).</p>
            <h3>3. Sensor Accuracy</h3>
            <p>DHT22 temperature reading 3°C higher than actual. Heat from nearby components? Moved sensor away from Arduino using longer wires.</p>
            <h3>4. Time Drift</h3>
            <p>RTC losing ~2 minutes per day. Cheap module. For now, resync manually weekly. Future: GPS time sync?</p>
            <h2>First Results</h2>
            <p>24 hours of data reveals Buffalo weather patterns:</p>
            <ul>
              <li>Temperature swing: 22°C to 8°C</li>
              <li>Humidity: 45% to 89%</li>
              <li>Pressure drop before snow: confirmed!</li>
            </ul>
            <p>Plotted in Excel (learning gnuplot next):</p>
            <ul>
              <li>Clear correlation between pressure drop and precipitation</li>
              <li>Humidity spikes before temperature drops</li>
              <li>Indoor heating cycles visible in data</li>
            </ul>
            <h2>The Enclosure</h2>
            <p>Can\'t leave breadboard exposed. Built enclosure from:</p>
            <ul>
              <li>Cardboard box (Amazon delivery)</li>
              <li>Hot glue (so much hot glue)</li>
              <li>Plastic bottle (sensor shield from heating)</li>
            </ul>
            <p>Not pretty, but functional. Version 2 will use 3D printed case (when I get access to printer).</p>
            <h2>Future Improvements</h2>
            <h3>Version 2.0 Plans</h3>
            <ul>
              <li>Wind speed/direction (anemometer)</li>
              <li>Rain gauge (tipping bucket)</li>
              <li>UV sensor</li>
              <li>Light sensor (for cloud cover)</li>
              <li>Solar power?</li>
            </ul>
            <h3>Data Analysis</h3>
            <ul>
              <li>Upload to web server (PHP script in progress)</li>
              <li>Graphing with Python/matplotlib</li>
              <li>Prediction algorithm?</li>
              <li>Compare with official weather data</li>
            </ul>
            <h3>Integration Ideas</h3>
            <ul>
              <li>Tweet the weather hourly</li>
              <li>LED indicators for conditions</li>
              <li>Alarm for extreme changes</li>
              <li>Connect to home automation?</li>
            </ul>
            <h2>Lessons Learned</h2>
            <ul>
              <li><strong>Sensor placement matters</strong> - Temperature especially sensitive</li>
              <li><strong>Power budget everything</strong> - Arduino can\'t power all sensors</li>
              <li><strong>Data logging fills SD cards</strong> - 1-minute intervals = 130KB/day</li>
              <li><strong>Calibration is crucial</strong> - Compare with known good source</li>
              <li><strong>Start simple, add features</strong> - Basic version working > complex version planned</li>
            </ul>
            <h2>Cost-Benefit Analysis</h2>
            <p>Commercial weather station: $150-300</p>
            <p>My version: $48 + 20 hours</p>
            <p>Benefits of DIY:</p>
            <ul>
              <li>Learned I2C, SPI protocols</li>
              <li>Data in format I want</li>
              <li>Can add any sensor</li>
              <li>Bragging rights</li>
            </ul>
            <h2>The Best Part</h2>
            <p>Showed system to Physics professor. Response: \"Can you build one for the department?\" </p>
            <p>Might have accidentally started a business?</p>
            <h2>Resources</h2>
            <ul>
              <li><a href=\"https://learn.adafruit.com\">Adafruit tutorials</a> - Sensor guides</li>
              <li><a href=\"https://forum.arduino.cc\">Arduino forum</a> - Debugging help</li>
              <li><a href=\"https://www.wunderground.com\">Weather Underground</a> - API for comparison</li>
            </ul>
            <h2>Next Steps</h2>
            <ul>
              <li>Weatherproof enclosure for outdoor deployment</li>
              <li>Web interface for remote monitoring</li>
              <li>Add prediction based on pressure trends</li>
              <li>Connect to dorm room automation system</li>
              <li>Sleep (eventually)</li>
            </ul>
            <h2>Final Thoughts</h2>
            <p>Two weeks ago, I didn\'t know what I2C was. Now I have three devices talking on the same bus, logging weather data every minute.</p>
            <p>This is why I love engineering. See problem → Build solution → Create new problems → Repeat.</p>
            <p><em>Current conditions: 12°C, 67% humidity, 1013 hPa, and 100% satisfaction</em></p>
            <p>UPDATE: Roommate wants one for his hometown. Business plan brewing...</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
