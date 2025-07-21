import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Building an Arduino Weather Station',
  description: 'Created a solar-powered weather station with Arduino. Monitoring temperature, humidity, pressure, and uploading to the cloud.',
  keywords: ['arduino', 'weather-station', 'iot', 'sensors'],
  openGraph: {
    title: 'Building an Arduino Weather Station',
    description: 'Created a solar-powered weather station with Arduino. Monitoring temperature, humidity, pressure, and uploading to the cloud.',
    type: 'article',
    publishedTime: '2012-04-05',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-04-05',
  title: 'Building an Arduino Weather Station',
  content: `Built a complete weather station using Arduino that runs on solar power and uploads data to the cloud. Perfect for continuous environmental monitoring!

## Hardware Components

The shopping list:
- Arduino Uno
- DHT22 (temperature & humidity)
- BMP180 (pressure sensor)
- Wind speed sensor (anemometer)
- Wind direction sensor (wind vane)
- Rain gauge (tipping bucket)
- 6V solar panel
- 3.7V Li-ion battery
- TP4056 charging module
- ESP8266 WiFi module

Total cost: ~$85

## Circuit Design

Connecting everything together:

\`\`\`cpp
// Pin definitions
#define DHT_PIN 2
#define WIND_SPEED_PIN 3  // Interrupt pin
#define WIND_VANE_PIN A0
#define RAIN_GAUGE_PIN 4  // Interrupt pin
#define BATTERY_PIN A1

// I2C for BMP180
// SDA -> A4
// SCL -> A5

// ESP8266 serial
// TX -> Pin 7
// RX -> Pin 8
\`\`\`

## The Arduino Code

Main weather station logic:

\`\`\`cpp
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_BMP085.h>
#include <SoftwareSerial.h>

DHT dht(DHT_PIN, DHT22);
Adafruit_BMP085 bmp;
SoftwareSerial esp8266(7, 8);

// Wind speed variables
volatile unsigned long windRotations = 0;
unsigned long lastWindCheck = 0;
float windSpeed = 0;

// Rain gauge variables  
volatile unsigned long rainTips = 0;
float rainfall = 0;

void setup() {
  Serial.begin(9600);
  esp8266.begin(115200);
  
  dht.begin();
  bmp.begin();
  
  // Interrupts for wind and rain
  attachInterrupt(digitalPinToInterrupt(WIND_SPEED_PIN), countWindRotation, RISING);
  attachInterrupt(digitalPinToInterrupt(RAIN_GAUGE_PIN), countRainfall, RISING);
  
  connectWiFi();
}

void loop() {
  // Read sensors every 5 minutes
  static unsigned long lastRead = 0;
  if (millis() - lastRead > 300000) {  // 5 minutes
    lastRead = millis();
    
    WeatherData data = readSensors();
    sendToCloud(data);
  }
}

struct WeatherData {
  float temperature;
  float humidity;
  float pressure;
  float windSpeed;
  int windDirection;
  float rainfall;
  float batteryVoltage;
};

WeatherData readSensors() {
  WeatherData data;
  
  // DHT22 readings
  data.temperature = dht.readTemperature();
  data.humidity = dht.readHumidity();
  
  // BMP180 readings
  data.pressure = bmp.readPressure() / 100.0;  // Convert to hPa
  
  // Calculate wind speed
  unsigned long timeSinceLastCheck = millis() - lastWindCheck;
  float rotationsPerSecond = windRotations / (timeSinceLastCheck / 1000.0);
  data.windSpeed = rotationsPerSecond * 2.4;  // km/h calibration factor
  windRotations = 0;
  lastWindCheck = millis();
  
  // Wind direction from analog reading
  int vaneValue = analogRead(WIND_VANE_PIN);
  data.windDirection = mapWindDirection(vaneValue);
  
  // Rainfall (0.2794mm per tip)
  data.rainfall = rainTips * 0.2794;
  rainTips = 0;  // Reset after reading
  
  // Battery monitoring
  int batteryADC = analogRead(BATTERY_PIN);
  data.batteryVoltage = (batteryADC / 1024.0) * 5.0 * 2;  // Voltage divider
  
  return data;
}

void countWindRotation() {
  windRotations++;
}

void countRainfall() {
  rainTips++;
}
\`\`\`

## WiFi Communication

Sending data to the cloud:

\`\`\`cpp
void sendToCloud(WeatherData data) {
  String cmd = "AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80\r\n";
  esp8266.print(cmd);
  delay(2000);
  
  String getStr = "GET /update?api_key=" + API_KEY;
  getStr += "&field1=" + String(data.temperature);
  getStr += "&field2=" + String(data.humidity);
  getStr += "&field3=" + String(data.pressure);
  getStr += "&field4=" + String(data.windSpeed);
  getStr += "&field5=" + String(data.windDirection);
  getStr += "&field6=" + String(data.rainfall);
  getStr += "&field7=" + String(data.batteryVoltage);
  getStr += "\r\n\r\n";
  
  cmd = "AT+CIPSEND=" + String(getStr.length()) + "\r\n";
  esp8266.print(cmd);
  delay(1000);
  
  esp8266.print(getStr);
  delay(1000);
  
  esp8266.println("AT+CIPCLOSE");
}
\`\`\`

## Power Management

Solar charging circuit and power optimization:

\`\`\`cpp
void enterSleepMode() {
  // Configure wake-up sources
  attachInterrupt(0, wakeUp, RISING);  // Wind sensor
  attachInterrupt(1, wakeUp, RISING);  // Rain sensor
  
  // Enter power-down mode
  set_sleep_mode(SLEEP_MODE_PWR_DOWN);
  sleep_enable();
  sleep_mode();
  
  // CPU resumes here after wake-up
  sleep_disable();
}

void optimizePower() {
  // Disable unused peripherals
  ADCSRA = 0;  // Disable ADC
  power_spi_disable();
  power_timer1_disable();
  power_timer2_disable();
  power_twi_disable();
  
  // Only wake every 5 minutes or on interrupt
  for (int i = 0; i < 37; i++) {  // ~5 minutes
    enterSleepMode();
  }
  
  // Re-enable peripherals for reading
  power_all_enable();
  ADCSRA = bit(ADEN);  // Enable ADC
}
\`\`\`

## Data Visualization

Created a web dashboard:

\`\`\`javascript
// Fetch data from ThingSpeak
async function fetchWeatherData() {
  const response = await fetch(
    'https://api.thingspeak.com/channels/YOUR_CHANNEL/feeds.json?results=288'
  );
  const data = await response.json();
  
  return data.feeds.map(feed => ({
    time: new Date(feed.created_at),
    temperature: parseFloat(feed.field1),
    humidity: parseFloat(feed.field2),
    pressure: parseFloat(feed.field3),
    windSpeed: parseFloat(feed.field4),
    windDirection: parseInt(feed.field5),
    rainfall: parseFloat(feed.field6),
    battery: parseFloat(feed.field7)
  }));
}

// Create temperature chart
function createTemperatureChart(data) {
  const trace = {
    x: data.map(d => d.time),
    y: data.map(d => d.temperature),
    type: 'scatter',
    name: 'Temperature (°C)',
    line: { color: 'red' }
  };
  
  const layout = {
    title: 'Temperature Over Time',
    xaxis: { title: 'Time' },
    yaxis: { title: 'Temperature (°C)' }
  };
  
  Plotly.newPlot('tempChart', [trace], layout);
}
\`\`\`

## Weatherproofing

Built a stevenson screen from PVC:
- White PVC pipes and fittings
- Louvered sides for airflow
- Double roof for sun protection
- Sealed electronics box
- Drainage holes

## Calibration

Comparing with official weather station:
- Temperature: ±0.3°C accuracy
- Humidity: ±2% accuracy
- Pressure: ±1 hPa accuracy
- Wind speed: ±10% accuracy

## Results and Insights

After one month of operation:
- Identified microclimates in garden
- Correlated pressure drops with rain
- Discovered wind patterns
- Battery lasted through cloudy week

Building your own weather station is incredibly satisfying and educational!`,
  tags: ['arduino', 'weather-station', 'iot', 'sensors'],
  readTime: '19 min',
};

export default function BuildinganArduinoWeatherStationPage() {
  return <BlogPost post={post} />;
}
