import fs from 'fs';
import path from 'path';
import type { BlogPost } from '../src/data/blog';

const posts2012Batch3: BlogPost[] = [
  {
    date: '2012-01-25',
    title: 'Building a Bitcoin Price Tracker',
    summary: 'Bitcoin is at $5. Built a real-time price tracker with historical charts. This digital currency thing might actually work.',
    content: `Bitcoin is slowly gaining traction, and I'm fascinated by the technology. Built a price tracker to monitor this experiment in digital currency.

## The Simple Backend

Aggregating prices from multiple exchanges:

\`\`\`python
import requests
import json
from datetime import datetime

class BitcoinPriceTracker:
    def __init__(self):
        self.exchanges = {
            'mtgox': 'https://mtgox.com/api/1/BTCUSD/ticker',
            'bitstamp': 'https://www.bitstamp.net/api/ticker/',
            'btce': 'https://btc-e.com/api/2/btc_usd/ticker'
        }
        
    def get_prices(self):
        prices = {}
        for exchange, url in self.exchanges.items():
            try:
                response = requests.get(url, timeout=5)
                data = response.json()
                
                if exchange == 'mtgox':
                    prices[exchange] = float(data['return']['last']['value'])
                elif exchange == 'bitstamp':
                    prices[exchange] = float(data['last'])
                elif exchange == 'btce':
                    prices[exchange] = float(data['ticker']['last'])
                    
            except Exception as e:
                print(f"Error fetching from {exchange}: {e}")
                
        return prices
    
    def calculate_average(self, prices):
        if prices:
            return sum(prices.values()) / len(prices)
        return 0
\`\`\`

## Real-Time Updates with WebSockets

Pushing price updates to the browser:

\`\`\`javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const tracker = new BitcoinPriceTracker();

// Update prices every 30 seconds
setInterval(async () => {
  const prices = await tracker.getPrices();
  const average = tracker.calculateAverage(prices);
  
  const update = {
    timestamp: new Date().toISOString(),
    prices: prices,
    average: average,
    change24h: calculateDayChange(average)
  };
  
  // Broadcast to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(update));
    }
  });
}, 30000);
\`\`\`

## Frontend Chart with D3.js

Visualizing price history:

\`\`\`javascript
function createPriceChart(containerId) {
  const margin = {top: 20, right: 30, bottom: 40, left: 50};
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  
  const svg = d3.select(containerId)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
    
  const g = svg.append('g')
    .attr('transform', \`translate(\${margin.left},\${margin.top})\`);
  
  // Scales
  const x = d3.scaleTime().rangeRound([0, width]);
  const y = d3.scaleLinear().rangeRound([height, 0]);
  
  // Line generator
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.price));
    
  return function updateChart(data) {
    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => d.price)]);
    
    // Update axes
    g.selectAll('.axis').remove();
    
    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', \`translate(0,\${height})\`)
      .call(d3.axisBottom(x));
      
    g.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', '#000')
      .attr('y', -10)
      .text('Price ($)');
      
    // Update line
    const path = g.selectAll('.line')
      .data([data]);
      
    path.enter().append('path')
      .attr('class', 'line')
      .merge(path)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2);
  };
}
\`\`\`

## Mining Profitability Calculator

Is it worth mining?

\`\`\`python
def calculate_mining_profitability(
    hashrate_mhs,  # Megahashes per second
    power_watts,
    electricity_cost_kwh,
    bitcoin_price
):
    # Current network difficulty (updates every 2016 blocks)
    difficulty = 1379223.4296725
    
    # Bitcoins per block
    block_reward = 50  # Halves every 210,000 blocks
    
    # Calculate bitcoins mined per day
    seconds_per_day = 86400
    hashes_per_day = hashrate_mhs * 1e6 * seconds_per_day
    
    # Probability of finding a block
    target = 0x00000000ffff0000000000000000000000000000000000000000000000000000
    probability = target / (difficulty * 2**256)
    
    # Expected bitcoins per day
    blocks_per_day = hashes_per_day * probability / (2**32)
    bitcoins_per_day = blocks_per_day * block_reward
    
    # Revenue
    revenue_per_day = bitcoins_per_day * bitcoin_price
    
    # Costs
    power_kwh_per_day = power_watts * 24 / 1000
    electricity_cost_per_day = power_kwh_per_day * electricity_cost_kwh
    
    # Profit
    profit_per_day = revenue_per_day - electricity_cost_per_day
    
    return {
        'bitcoins_per_day': bitcoins_per_day,
        'revenue_per_day': revenue_per_day,
        'electricity_cost_per_day': electricity_cost_per_day,
        'profit_per_day': profit_per_day,
        'roi_days': float('inf') if profit_per_day <= 0 else hardware_cost / profit_per_day
    }
\`\`\`

## Current State of Bitcoin

As of January 2012:
- Price: ~$5
- Market cap: ~$50 million
- Daily volume: ~$1 million
- Mining: Still profitable with GPUs
- Adoption: Mostly tech enthusiasts

## Why I'm Interested

The technology is revolutionary:
- Decentralized consensus
- Cryptographic security
- Limited supply
- Borderless transfers
- Programmable money

Whether it succeeds or fails, we're witnessing a fascinating experiment in digital currency!`,
    tags: ['bitcoin', 'cryptocurrency', 'websockets', 'd3js'],
    readTime: '16 min',
  },
  {
    date: '2012-02-25',
    title: 'WebRTC First Look: Peer-to-Peer Video in the Browser',
    summary: 'Google released WebRTC in Chrome. Built a video chat app with no servers - the future of communication is peer-to-peer.',
    content: `WebRTC (Web Real-Time Communication) just landed in Chrome Canary. This technology enables peer-to-peer audio, video, and data sharing directly between browsers. Mind = blown.

## Building a Simple Video Chat

The basics are surprisingly simple:

\`\`\`javascript
// Get user media
navigator.getUserMedia = navigator.getUserMedia || 
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia;

// Get local video stream
navigator.getUserMedia(
  { video: true, audio: true },
  (stream) => {
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;
    localStream = stream;
    
    // Ready to connect to peer
    initializePeerConnection();
  },
  (error) => {
    console.error('getUserMedia error:', error);
  }
);
\`\`\`

## The PeerConnection Magic

Setting up peer-to-peer connection:

\`\`\`javascript
function initializePeerConnection() {
  // STUN server helps with NAT traversal
  const configuration = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  };
  
  pc = new webkitRTCPeerConnection(configuration);
  
  // Add local stream
  pc.addStream(localStream);
  
  // Handle remote stream
  pc.onaddstream = (event) => {
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = event.stream;
  };
  
  // Handle ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      sendToSignalingServer({
        type: 'ice-candidate',
        candidate: event.candidate
      });
    }
  };
}
\`\`\`

## Signaling Server

The only server needed - just for initial connection:

\`\`\`javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const rooms = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch(data.type) {
      case 'join':
        joinRoom(ws, data.room);
        break;
        
      case 'offer':
      case 'answer':
      case 'ice-candidate':
        // Relay to other peer in room
        relayToPeer(ws, data);
        break;
    }
  });
});

function joinRoom(ws, roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, []);
  }
  
  const room = rooms.get(roomId);
  room.push(ws);
  
  if (room.length === 2) {
    // Tell first peer to create offer
    room[0].send(JSON.stringify({ type: 'create-offer' }));
  }
}

function relayToPeer(ws, data) {
  const room = findRoomForSocket(ws);
  if (room) {
    const peer = room.find(s => s !== ws);
    if (peer) {
      peer.send(JSON.stringify(data));
    }
  }
}
\`\`\`

## The Offer/Answer Dance

Establishing the connection:

\`\`\`javascript
// Creating an offer (caller)
async function createOffer() {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  
  sendToSignalingServer({
    type: 'offer',
    offer: offer
  });
}

// Handling offer and creating answer (callee)
async function handleOffer(offer) {
  await pc.setRemoteDescription(offer);
  
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  
  sendToSignalingServer({
    type: 'answer',
    answer: answer
  });
}

// Handling answer (caller)
async function handleAnswer(answer) {
  await pc.setRemoteDescription(answer);
  // Connection established!
}
\`\`\`

## Data Channels Too!

Not just video - send any data:

\`\`\`javascript
// Create data channel
const dataChannel = pc.createDataChannel('chat', {
  ordered: true,
  maxRetransmits: 3
});

dataChannel.onopen = () => {
  console.log('Data channel opened!');
  dataChannel.send('Hello peer!');
};

dataChannel.onmessage = (event) => {
  console.log('Received:', event.data);
  displayChatMessage(event.data);
};

// Receive data channel on other side
pc.ondatachannel = (event) => {
  const channel = event.channel;
  channel.onmessage = handleDataChannelMessage;
};
\`\`\`

## Building a Screen Sharing Feature

WebRTC can share screens too:

\`\`\`javascript
async function shareScreen() {
  try {
    // Chrome experimental flag needed
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });
    
    // Replace video track
    const videoTrack = stream.getVideoTracks()[0];
    const sender = pc.getSenders().find(
      s => s.track && s.track.kind === 'video'
    );
    
    sender.replaceTrack(videoTrack);
    
    // Switch back when screen share ends
    videoTrack.onended = () => {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    };
  } catch (err) {
    console.error('Error sharing screen:', err);
  }
}
\`\`\`

## Performance Considerations

Testing connection quality:

\`\`\`javascript
// Monitor connection stats
setInterval(async () => {
  const stats = await pc.getStats();
  
  stats.forEach((report) => {
    if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
      console.log(\`Bitrate: \${report.bytesReceived * 8 / 1000} kbps\`);
      console.log(\`Packets lost: \${report.packetsLost}\`);
      console.log(\`Jitter: \${report.jitter}\`);
    }
  });
}, 1000);
\`\`\`

## Security and Privacy

Important considerations:
- Always use HTTPS
- getUserMedia requires user permission
- Peer connections are encrypted (DTLS)
- No data goes through my servers!

## What This Enables

The possibilities are endless:
- Video conferencing without servers
- Peer-to-peer file sharing
- Collaborative editing
- Distributed CDNs
- Multiplayer games

WebRTC is going to change how we build real-time applications. No more central servers for everything!`,
    tags: ['webrtc', 'peer-to-peer', 'video-chat', 'real-time'],
    readTime: '17 min',
  },
  {
    date: '2012-03-15',
    title: 'Analyzing Twitter Sentiment with Natural Language Processing',
    summary: 'Built a real-time sentiment analysis tool for Twitter. Tracking public opinion on tech topics using Python and NLTK.',
    content: `Twitter is a goldmine of public opinion data. Built a sentiment analysis system to track what people really think about tech trends in real-time.

## Setting Up Twitter Streaming

Using the Twitter API to get real-time tweets:

\`\`\`python
import tweepy
from textblob import TextBlob
import json

class TwitterStreamListener(tweepy.StreamListener):
    def __init__(self, sentiment_analyzer):
        super().__init__()
        self.sentiment_analyzer = sentiment_analyzer
        self.tweet_count = 0
        
    def on_status(self, status):
        # Skip retweets
        if hasattr(status, 'retweeted_status'):
            return
            
        tweet_text = status.text
        sentiment = self.sentiment_analyzer.analyze(tweet_text)
        
        self.store_tweet({
            'id': status.id_str,
            'text': tweet_text,
            'user': status.user.screen_name,
            'created_at': status.created_at,
            'sentiment': sentiment
        })
        
        self.tweet_count += 1
        if self.tweet_count % 100 == 0:
            print(f"Processed {self.tweet_count} tweets")
            
    def on_error(self, status_code):
        if status_code == 420:  # Rate limit
            return False
\`\`\`

## Sentiment Analysis with NLTK

Building the sentiment analyzer:

\`\`\`python
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

class SentimentAnalyzer:
    def __init__(self):
        # Download required NLTK data
        nltk.download('vader_lexicon')
        nltk.download('punkt')
        nltk.download('stopwords')
        
        self.sia = SentimentIntensityAnalyzer()
        self.stop_words = set(stopwords.words('english'))
        
    def preprocess_text(self, text):
        # Remove URLs
        text = re.sub(r'http\\S+', '', text)
        
        # Remove mentions and hashtags for analysis
        text = re.sub(r'@\\w+|#\\w+', '', text)
        
        # Convert to lowercase
        text = text.lower()
        
        # Tokenize
        tokens = word_tokenize(text)
        
        # Remove stopwords
        tokens = [t for t in tokens if t not in self.stop_words]
        
        return ' '.join(tokens)
        
    def analyze(self, text):
        processed = self.preprocess_text(text)
        scores = self.sia.polarity_scores(processed)
        
        # Classify based on compound score
        compound = scores['compound']
        if compound >= 0.05:
            sentiment = 'positive'
        elif compound <= -0.05:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
            
        return {
            'sentiment': sentiment,
            'scores': scores,
            'processed_text': processed
        }
\`\`\`

## Real-Time Dashboard

Visualizing sentiment trends:

\`\`\`javascript
class SentimentDashboard {
  constructor() {
    this.ws = new WebSocket('ws://localhost:8080');
    this.sentimentData = {
      positive: [],
      negative: [],
      neutral: []
    };
    
    this.setupChart();
    this.setupWebSocket();
  }
  
  setupChart() {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Positive',
          data: [],
          borderColor: 'green',
          fill: false
        }, {
          label: 'Negative',
          data: [],
          borderColor: 'red',
          fill: false
        }, {
          label: 'Neutral',
          data: [],
          borderColor: 'gray',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Percentage'
            },
            min: 0,
            max: 100
          }
        }
      }
    });
  }
  
  updateChart(sentimentCounts) {
    const total = Object.values(sentimentCounts).reduce((a, b) => a + b, 0);
    
    if (total === 0) return;
    
    const percentages = {
      positive: (sentimentCounts.positive / total) * 100,
      negative: (sentimentCounts.negative / total) * 100,
      neutral: (sentimentCounts.neutral / total) * 100
    };
    
    const time = new Date().toLocaleTimeString();
    
    // Add new data point
    this.chart.data.labels.push(time);
    this.chart.data.datasets[0].data.push(percentages.positive);
    this.chart.data.datasets[1].data.push(percentages.negative);
    this.chart.data.datasets[2].data.push(percentages.neutral);
    
    // Keep only last 20 points
    if (this.chart.data.labels.length > 20) {
      this.chart.data.labels.shift();
      this.chart.data.datasets.forEach(dataset => dataset.data.shift());
    }
    
    this.chart.update();
  }
}
\`\`\`

## Topic-Specific Analysis

Tracking sentiment for different tech topics:

\`\`\`python
class TopicSentimentTracker:
    def __init__(self):
        self.topics = {
            'apple': ['apple', 'iphone', 'ipad', 'mac', 'ios'],
            'google': ['google', 'android', 'chrome', 'gmail'],
            'facebook': ['facebook', 'fb', 'zuckerberg'],
            'bitcoin': ['bitcoin', 'btc', 'cryptocurrency', 'crypto'],
            'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml']
        }
        
        self.topic_sentiments = {topic: [] for topic in self.topics}
        
    def categorize_tweet(self, tweet_text):
        text_lower = tweet_text.lower()
        categories = []
        
        for topic, keywords in self.topics.items():
            if any(keyword in text_lower for keyword in keywords):
                categories.append(topic)
                
        return categories
        
    def update_sentiment(self, tweet_text, sentiment):
        categories = self.categorize_tweet(tweet_text)
        
        for category in categories:
            self.topic_sentiments[category].append({
                'sentiment': sentiment['sentiment'],
                'score': sentiment['scores']['compound'],
                'timestamp': datetime.now()
            })
    
    def get_topic_summary(self, topic, hours=1):
        cutoff_time = datetime.now() - timedelta(hours=hours)
        recent_sentiments = [
            s for s in self.topic_sentiments[topic] 
            if s['timestamp'] > cutoff_time
        ]
        
        if not recent_sentiments:
            return None
            
        positive = sum(1 for s in recent_sentiments if s['sentiment'] == 'positive')
        negative = sum(1 for s in recent_sentiments if s['sentiment'] == 'negative')
        neutral = sum(1 for s in recent_sentiments if s['sentiment'] == 'neutral')
        total = len(recent_sentiments)
        
        avg_score = sum(s['score'] for s in recent_sentiments) / total
        
        return {
            'topic': topic,
            'total_tweets': total,
            'positive_percent': (positive / total) * 100,
            'negative_percent': (negative / total) * 100,
            'neutral_percent': (neutral / total) * 100,
            'average_score': avg_score
        }
\`\`\`

## Interesting Findings

Early results from the system:

1. **iPhone sentiment**: 70% positive, spikes during launches
2. **Facebook**: 45% negative (privacy concerns)
3. **Bitcoin**: Highly volatile, correlates with price
4. **Windows 8**: 60% negative (Metro confusion)
5. **Google**: Consistently 65% positive

## Challenges and Solutions

- **Sarcasm detection**: Still hard for NLP
- **Emoji handling**: Added emoji sentiment lexicon
- **Language mix**: Focused on English for now
- **Bot filtering**: Added user behavior checks

This tool provides fascinating insights into public tech sentiment in real-time!`,
    tags: ['nlp', 'sentiment-analysis', 'twitter', 'python'],
    readTime: '18 min',
  },
  {
    date: '2012-04-05',
    title: 'Building an Arduino Weather Station',
    summary: 'Created a solar-powered weather station with Arduino. Monitoring temperature, humidity, pressure, and uploading to the cloud.',
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
  String cmd = "AT+CIPSTART=\\"TCP\\",\\"api.thingspeak.com\\",80\\r\\n";
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
  getStr += "\\r\\n\\r\\n";
  
  cmd = "AT+CIPSEND=" + String(getStr.length()) + "\\r\\n";
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
  },
  {
    date: '2012-05-05',
    title: 'MongoDB vs PostgreSQL: Choosing the Right Database',
    summary: 'Comparing MongoDB and PostgreSQL for our startup project. NoSQL flexibility vs SQL reliability - which wins?',
    content: `Our team is building a social analytics platform and we're at a crossroads: MongoDB or PostgreSQL? Spent a week evaluating both with real workloads.

## The Use Case

Our requirements:
- Store millions of social media posts
- Flexible schema (platforms change APIs)
- Complex analytics queries
- Real-time aggregations
- Geo-spatial queries
- Full-text search

## MongoDB Test Setup

Started with MongoDB for its flexibility:

\`\`\`javascript
// MongoDB schema design
const postSchema = {
  _id: ObjectId(),
  platform: 'twitter',
  platformId: '123456789',
  user: {
    id: 'user123',
    username: 'johndoe',
    followers: 1000,
    verified: true
  },
  content: {
    text: 'Just tried the new iPhone!',
    hashtags: ['iphone', 'tech'],
    mentions: ['@apple'],
    urls: ['https://apple.com']
  },
  metrics: {
    likes: 42,
    shares: 5,
    comments: 3
  },
  location: {
    type: 'Point',
    coordinates: [-122.4194, 37.7749]
  },
  sentiment: {
    score: 0.8,
    magnitude: 0.6
  },
  createdAt: ISODate('2012-05-05T10:30:00Z'),
  analyzedAt: ISODate('2012-05-05T10:31:00Z')
};

// Create indexes
db.posts.createIndex({ 'user.id': 1, createdAt: -1 });
db.posts.createIndex({ 'content.hashtags': 1 });
db.posts.createIndex({ location: '2dsphere' });
db.posts.createIndex({ 'content.text': 'text' });
\`\`\`

## PostgreSQL with JSONB

PostgreSQL's JSONB offers similar flexibility:

\`\`\`sql
-- PostgreSQL schema
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  platform_id VARCHAR(100) NOT NULL,
  user_data JSONB NOT NULL,
  content JSONB NOT NULL,
  metrics JSONB NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  sentiment JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_id ON posts ((user_data->>'id'));
CREATE INDEX idx_created_at ON posts (created_at DESC);
CREATE INDEX idx_hashtags ON posts USING GIN ((content->'hashtags'));
CREATE INDEX idx_location ON posts USING GIST (location);
CREATE INDEX idx_content_text ON posts USING GIN (to_tsvector('english', content->>'text'));

-- Ensure uniqueness
CREATE UNIQUE INDEX idx_platform_post ON posts (platform, platform_id);
\`\`\`

## Performance Benchmarks

Loaded 10 million posts and ran queries:

\`\`\`python
import time
import psycopg2
from pymongo import MongoClient

class DatabaseBenchmark:
    def __init__(self):
        self.mongo = MongoClient('mongodb://localhost:27017/')['social']
        self.pg = psycopg2.connect("dbname=social user=postgres")
        
    def benchmark_query(self, name, mongo_query, pg_query):
        # MongoDB
        start = time.time()
        mongo_results = list(self.mongo.posts.find(mongo_query).limit(1000))
        mongo_time = time.time() - start
        
        # PostgreSQL
        cur = self.pg.cursor()
        start = time.time()
        cur.execute(pg_query)
        pg_results = cur.fetchall()
        pg_time = time.time() - start
        
        print(f"{name}:")
        print(f"  MongoDB: {mongo_time:.3f}s ({len(mongo_results)} results)")
        print(f"  PostgreSQL: {pg_time:.3f}s ({len(pg_results)} results)")
        
    def run_benchmarks(self):
        # 1. Find posts by user in date range
        self.benchmark_query(
            "Posts by user in date range",
            {
                'user.id': 'user123',
                'createdAt': {
                    '$gte': datetime(2012, 5, 1),
                    '$lt': datetime(2012, 6, 1)
                }
            },
            """
            SELECT * FROM posts 
            WHERE user_data->>'id' = 'user123'
            AND created_at >= '2012-05-01' 
            AND created_at < '2012-06-01'
            LIMIT 1000
            """
        )
        
        # 2. Hashtag aggregation
        self.benchmark_query(
            "Top hashtags with counts",
            [
                {'$unwind': '$content.hashtags'},
                {'$group': {
                    '_id': '$content.hashtags',
                    'count': {'$sum': 1}
                }},
                {'$sort': {'count': -1}},
                {'$limit': 100}
            ],
            """
            SELECT hashtag, COUNT(*) as count
            FROM posts, jsonb_array_elements_text(content->'hashtags') as hashtag
            GROUP BY hashtag
            ORDER BY count DESC
            LIMIT 100
            """
        )
\`\`\`

## Results Summary

| Query Type | MongoDB | PostgreSQL |
|------------|---------|------------|
| Simple lookup | 0.003s | 0.005s |
| Range query | 0.125s | 0.089s |
| Aggregation | 2.341s | 1.876s |
| Geo query | 0.234s | 0.156s |
| Full-text | 0.567s | 0.234s |
| Complex join | N/A | 0.345s |

## Schema Evolution

Testing schema changes:

\`\`\`javascript
// MongoDB - Just start writing new fields
db.posts.update(
  { platform: 'instagram' },
  { $set: { 'content.imageUrl': 'https://...' } },
  { multi: true }
);

// PostgreSQL - Also flexible with JSONB
UPDATE posts 
SET content = content || '{"imageUrl": "https://..."}'
WHERE platform = 'instagram';
\`\`\`

## Advanced Features

PostgreSQL's secret weapons:

\`\`\`sql
-- Window functions for analytics
WITH engagement_trends AS (
  SELECT 
    date_trunc('hour', created_at) as hour,
    platform,
    AVG((metrics->>'likes')::int) as avg_likes,
    LAG(AVG((metrics->>'likes')::int), 1) OVER (
      PARTITION BY platform ORDER BY date_trunc('hour', created_at)
    ) as prev_avg_likes
  FROM posts
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY hour, platform
)
SELECT 
  hour,
  platform,
  avg_likes,
  ROUND(((avg_likes - prev_avg_likes) / prev_avg_likes::numeric) * 100, 2) as change_percent
FROM engagement_trends
WHERE prev_avg_likes IS NOT NULL
ORDER BY hour DESC, platform;

-- CTEs for complex queries
WITH viral_posts AS (
  SELECT * FROM posts 
  WHERE (metrics->>'likes')::int > 1000
),
viral_users AS (
  SELECT DISTINCT user_data->>'id' as user_id
  FROM viral_posts
)
SELECT 
  p.*,
  CASE WHEN vu.user_id IS NOT NULL THEN true ELSE false END as is_viral_user
FROM posts p
LEFT JOIN viral_users vu ON p.user_data->>'id' = vu.user_id
WHERE p.created_at > NOW() - INTERVAL '1 day';
\`\`\`

## The Decision

After extensive testing, we chose **PostgreSQL**:

**Why PostgreSQL won:**
- JSONB gives us MongoDB-like flexibility
- ACID guarantees for critical data
- Superior query performance for analytics
- Mature ecosystem and tooling
- Can still do joins when needed

**When we'd choose MongoDB:**
- Document-centric applications
- Simpler operational model
- Horizontal scaling priority
- No complex queries needed

The best part? PostgreSQL lets us start relational and go schemaless where needed!`,
    tags: ['mongodb', 'postgresql', 'database', 'comparison'],
    readTime: '20 min',
  },
  {
    date: '2012-06-05',
    title: 'Building a Music Visualizer with Web Audio API',
    summary: 'The Web Audio API just landed in Chrome. Creating stunning audio visualizations with JavaScript and Canvas.',
    content: `Chrome just shipped the Web Audio API, opening up incredible possibilities for audio processing in the browser. Built a music visualizer that reacts to audio in real-time!

## Getting Started with Web Audio

The basics of the Web Audio API:

\`\`\`javascript
// Create audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load and decode audio file
async function loadAudio(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

// Play audio
function playAudio(audioBuffer) {
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
  return source;
}
\`\`\`

## Creating the Analyzer

Setting up frequency analysis:

\`\`\`javascript
class AudioVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audioContext = new AudioContext();
    
    // Create analyzer node
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    
    // Canvas setup
    this.width = canvas.width;
    this.height = canvas.height;
    
    // Visual settings
    this.barWidth = (this.width / this.bufferLength) * 2.5;
    this.barGap = 1;
  }
  
  connectSource(source) {
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }
  
  draw() {
    requestAnimationFrame(() => this.draw());
    
    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Clear canvas
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw frequency bars
    let x = 0;
    
    for (let i = 0; i < this.bufferLength; i++) {
      const barHeight = (this.dataArray[i] / 255) * this.height;
      
      // Color based on frequency and amplitude
      const r = barHeight + (25 * (i / this.bufferLength));
      const g = 250 * (i / this.bufferLength);
      const b = 50;
      
      this.ctx.fillStyle = \`rgb(\${r}, \${g}, \${b})\`;
      this.ctx.fillRect(x, this.height - barHeight, this.barWidth, barHeight);
      
      x += this.barWidth + this.barGap;
    }
  }
}
\`\`\`

## Advanced Visualizations

Creating different visual effects:

\`\`\`javascript
class CircularVisualizer extends AudioVisualizer {
  draw() {
    requestAnimationFrame(() => this.draw());
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw circular visualization
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = 100;
    
    for (let i = 0; i < this.bufferLength; i++) {
      const amplitude = this.dataArray[i] / 255;
      const angle = (i / this.bufferLength) * Math.PI * 2;
      
      // Calculate positions
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + amplitude * 100);
      const y2 = centerY + Math.sin(angle) * (radius + amplitude * 100);
      
      // Draw line
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      
      // Color based on amplitude
      const hue = (i / this.bufferLength) * 360;
      this.ctx.strokeStyle = \`hsl(\${hue}, 100%, \${50 + amplitude * 50}%)\`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }
}
\`\`\`

## Waveform Visualization

Showing the actual waveform:

\`\`\`javascript
class WaveformVisualizer extends AudioVisualizer {
  constructor(canvas) {
    super(canvas);
    this.waveArray = new Uint8Array(this.analyser.fftSize);
  }
  
  draw() {
    requestAnimationFrame(() => this.draw());
    
    // Get waveform data
    this.analyser.getByteTimeDomainData(this.waveArray);
    
    // Clear with gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw waveform
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.beginPath();
    
    const sliceWidth = this.width / this.waveArray.length;
    let x = 0;
    
    for (let i = 0; i < this.waveArray.length; i++) {
      const v = this.waveArray[i] / 128.0;
      const y = v * this.height / 2;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    this.ctx.stroke();
    
    // Draw frequency bars on top
    this.analyser.getByteFrequencyData(this.dataArray);
    
    for (let i = 0; i < this.bufferLength; i += 10) {
      const barHeight = (this.dataArray[i] / 255) * this.height * 0.5;
      const x = (i / this.bufferLength) * this.width;
      
      this.ctx.fillStyle = \`hsla(\${(i / this.bufferLength) * 360}, 100%, 50%, 0.5)\`;
      this.ctx.fillRect(x, this.height - barHeight, 5, barHeight);
    }
  }
}
\`\`\`

## 3D Visualization with Three.js

Taking it to another dimension:

\`\`\`javascript
class ThreeJSVisualizer {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);
    
    // Create visualization objects
    this.bars = [];
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(\`hsl(\${(i * j) / 1024 * 360}, 100%, 50%)\`)
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(i - 16, 0, j - 16);
        this.scene.add(bar);
        this.bars.push(bar);
      }
    }
    
    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 20, 0);
    this.scene.add(light);
    
    this.camera.position.set(30, 30, 30);
    this.camera.lookAt(0, 0, 0);
  }
  
  update(dataArray) {
    // Update bar heights based on frequency data
    for (let i = 0; i < this.bars.length; i++) {
      const dataIndex = Math.floor(i / this.bars.length * dataArray.length);
      const scale = dataArray[dataIndex] / 255 * 10 + 0.1;
      this.bars[i].scale.y = scale;
      this.bars[i].position.y = scale / 2;
    }
    
    // Rotate camera
    const time = Date.now() * 0.001;
    this.camera.position.x = Math.cos(time) * 40;
    this.camera.position.z = Math.sin(time) * 40;
    this.camera.lookAt(0, 0, 0);
    
    this.renderer.render(this.scene, this.camera);
  }
}
\`\`\`

## Microphone Input

Visualizing live audio:

\`\`\`javascript
async function setupMicrophoneInput(visualizer) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = visualizer.audioContext.createMediaStreamSource(stream);
    visualizer.connectSource(source);
    visualizer.draw();
  } catch (err) {
    console.error('Error accessing microphone:', err);
  }
}
\`\`\`

## Performance Optimization

Keeping it smooth at 60fps:

\`\`\`javascript
class OptimizedVisualizer extends AudioVisualizer {
  constructor(canvas) {
    super(canvas);
    this.skipFrames = 0;
    this.targetFPS = 60;
    this.lastFrameTime = 0;
  }
  
  draw() {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    
    // Skip frame if running too slow
    if (delta < 1000 / this.targetFPS) {
      requestAnimationFrame(() => this.draw());
      return;
    }
    
    this.lastFrameTime = now;
    
    // Use lower resolution data for better performance
    const step = Math.max(1, Math.floor(this.bufferLength / 128));
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // ... render with step
    
    requestAnimationFrame(() => this.draw());
  }
}
\`\`\`

The Web Audio API opens up amazing possibilities for creative audio applications right in the browser!`,
    tags: ['web-audio-api', 'visualization', 'canvas', 'javascript'],
    readTime: '18 min',
  },
  {
    date: '2012-07-05',
    title: 'Reverse Engineering the Leap Motion Controller',
    summary: 'Got early access to Leap Motion. Reverse engineering the USB protocol to understand how this magic 3D hand tracking works.',
    content: `Just received my Leap Motion developer unit! This tiny device tracks hand movements in 3D with incredible precision. Time to figure out how it works.

## First Impressions

The hardware:
- Tiny USB device (3" x 1.2" x 0.5")
- Two cameras and three IR LEDs
- Tracks hands above device
- Sub-millimeter precision claimed
- 200+ FPS tracking

## The Official SDK

Started with their JavaScript API:

\`\`\`javascript
const controller = new Leap.Controller();

controller.on('frame', (frame) => {
  console.log(\`Hands: \${frame.hands.length}\`);
  console.log(\`Fingers: \${frame.fingers.length}\`);
  
  frame.hands.forEach((hand) => {
    console.log(\`Hand position: \${hand.palmPosition}\`);
    console.log(\`Hand velocity: \${hand.palmVelocity}\`);
    
    hand.fingers.forEach((finger) => {
      console.log(\`  Finger \${finger.type}: \${finger.tipPosition}\`);
    });
  });
});

controller.connect();
\`\`\`

## USB Protocol Analysis

Time to go deeper with Wireshark:

\`\`\`python
import usb.core
import usb.util
import struct

# Find Leap Motion device
VENDOR_ID = 0x045e  # Leap Motion vendor ID
PRODUCT_ID = 0x0783  # Leap Motion product ID

device = usb.core.find(idVendor=VENDOR_ID, idProduct=PRODUCT_ID)

if device is None:
    raise ValueError('Leap Motion not found')

# Claim interface
if device.is_kernel_driver_active(0):
    device.detach_kernel_driver(0)

device.set_configuration()

# Read raw data
endpoint = device[0][(0,0)][0]

while True:
    try:
        data = device.read(endpoint.bEndpointAddress, 
                          endpoint.wMaxPacketSize)
        
        # Parse header
        magic = struct.unpack('<I', data[0:4])[0]
        timestamp = struct.unpack('<Q', data[4:12])[0]
        frame_id = struct.unpack('<I', data[12:16])[0]
        
        print(f"Frame {frame_id} at {timestamp}")
        
        # Image data starts at offset 64
        if len(data) > 64:
            analyze_image_data(data[64:])
            
    except usb.core.USBError:
        pass
\`\`\`

## Image Processing Pipeline

Reconstructing their algorithm:

\`\`\`python
import cv2
import numpy as np

class LeapImageProcessor:
    def __init__(self):
        self.calibration = self.load_calibration()
        
    def process_stereo_images(self, left_img, right_img):
        # 1. Undistort images using calibration
        left_undist = cv2.undistort(left_img, 
                                    self.calibration['left_matrix'],
                                    self.calibration['left_dist'])
        right_undist = cv2.undistort(right_img,
                                     self.calibration['right_matrix'], 
                                     self.calibration['right_dist'])
        
        # 2. Find bright spots (IR reflections from hands)
        left_spots = self.find_ir_spots(left_undist)
        right_spots = self.find_ir_spots(right_undist)
        
        # 3. Stereo matching
        matches = self.stereo_match(left_spots, right_spots)
        
        # 4. Triangulate 3D positions
        points_3d = self.triangulate(matches)
        
        # 5. Hand tracking
        hands = self.track_hands(points_3d)
        
        return hands
    
    def find_ir_spots(self, image):
        # Threshold for IR reflections
        _, binary = cv2.threshold(image, 200, 255, cv2.THRESH_BINARY)
        
        # Find contours
        contours, _ = cv2.findContours(binary, 
                                       cv2.RETR_EXTERNAL,
                                       cv2.CHAIN_APPROX_SIMPLE)
        
        spots = []
        for contour in contours:
            # Calculate centroid
            M = cv2.moments(contour)
            if M['m00'] > 0:
                cx = int(M['m10'] / M['m00'])
                cy = int(M['m01'] / M['m00'])
                area = cv2.contourArea(contour)
                spots.append({
                    'position': (cx, cy),
                    'area': area,
                    'contour': contour
                })
        
        return spots
    
    def triangulate(self, matches):
        points_3d = []
        
        for left_point, right_point in matches:
            # Simplified triangulation
            disparity = left_point[0] - right_point[0]
            
            if disparity > 0:
                # depth = baseline * focal_length / disparity
                depth = (60 * 400) / disparity  # mm
                
                # Convert to 3D
                x = (left_point[0] - 320) * depth / 400
                y = (left_point[1] - 240) * depth / 400
                z = depth
                
                points_3d.append((x, y, z))
        
        return points_3d
\`\`\`

## Hand Model Fitting

How they identify fingers:

\`\`\`python
class HandTracker:
    def __init__(self):
        self.hand_model = self.create_hand_model()
        self.kalman_filters = {}
        
    def create_hand_model(self):
        # Skeletal hand model with constraints
        return {
            'palm': {'size': 80, 'fingers': []},
            'thumb': {'length': [30, 25, 20], 'angles': []},
            'index': {'length': [45, 25, 20], 'angles': []},
            'middle': {'length': [50, 30, 25], 'angles': []},
            'ring': {'length': [45, 30, 25], 'angles': []},
            'pinky': {'length': [35, 25, 20], 'angles': []}
        }
    
    def fit_hand_model(self, points_3d):
        # 1. Find palm center (largest cluster)
        palm_cluster = self.find_palm_cluster(points_3d)
        palm_center = np.mean(palm_cluster, axis=0)
        
        # 2. Find finger tips (farthest points from palm)
        finger_candidates = []
        for point in points_3d:
            dist = np.linalg.norm(point - palm_center)
            if dist > 50:  # mm
                finger_candidates.append(point)
        
        # 3. Classify fingers based on position
        fingers = self.classify_fingers(finger_candidates, palm_center)
        
        # 4. Apply skeletal constraints
        constrained_hand = self.apply_constraints(palm_center, fingers)
        
        return constrained_hand
    
    def apply_kalman_filter(self, hand_id, measurement):
        if hand_id not in self.kalman_filters:
            # Initialize Kalman filter for new hand
            kf = cv2.KalmanFilter(18, 18)  # 3D position + velocity for palm + 5 fingers
            # ... setup matrices ...
            self.kalman_filters[hand_id] = kf
        
        kf = self.kalman_filters[hand_id]
        prediction = kf.predict()
        corrected = kf.correct(measurement)
        
        return corrected
\`\`\`

## Gesture Recognition

Building on top of hand tracking:

\`\`\`javascript
class GestureRecognizer {
  constructor() {
    this.gestureHistory = [];
    this.historySize = 30; // frames
  }
  
  addFrame(frame) {
    this.gestureHistory.push(frame);
    if (this.gestureHistory.length > this.historySize) {
      this.gestureHistory.shift();
    }
    
    return this.detectGestures();
  }
  
  detectGestures() {
    const gestures = [];
    
    if (this.detectSwipe()) {
      gestures.push({ type: 'swipe', direction: this.getSwipeDirection() });
    }
    
    if (this.detectPinch()) {
      gestures.push({ type: 'pinch', scale: this.getPinchScale() });
    }
    
    if (this.detectCircle()) {
      gestures.push({ type: 'circle', progress: this.getCircleProgress() });
    }
    
    return gestures;
  }
  
  detectSwipe() {
    if (this.gestureHistory.length < 10) return false;
    
    const recentFrames = this.gestureHistory.slice(-10);
    const firstPos = recentFrames[0].hands[0]?.palmPosition;
    const lastPos = recentFrames[9].hands[0]?.palmPosition;
    
    if (!firstPos || !lastPos) return false;
    
    const distance = Math.sqrt(
      Math.pow(lastPos[0] - firstPos[0], 2) +
      Math.pow(lastPos[1] - firstPos[1], 2) +
      Math.pow(lastPos[2] - firstPos[2], 2)
    );
    
    return distance > 100; // mm
  }
}
\`\`\`

## Performance Analysis

Measuring the magic:

\`\`\`
Tracking Performance:
- Frame rate: 200+ FPS confirmed
- Latency: ~20ms from movement to API
- Accuracy: ±0.5mm in optimal conditions
- Range: 25-600mm above device
- Field of view: 150° x 120°

CPU Usage:
- Leap Service: 15-20% CPU
- Image processing: GPU accelerated
- USB bandwidth: ~60 MB/s
\`\`\`

## Building a Demo

Minority Report-style interface:

\`\`\`javascript
// 3D interface controlled by hand
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight);

// Create floating UI elements
const elements = [];
for (let i = 0; i < 10; i++) {
  const geometry = new THREE.BoxGeometry(10, 10, 1);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00,
    transparent: true,
    opacity: 0.7 
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 50
  );
  scene.add(cube);
  elements.push(cube);
}

// Leap Motion control
controller.on('frame', (frame) => {
  if (frame.hands.length > 0) {
    const hand = frame.hands[0];
    
    // Map hand position to 3D space
    const handMesh = scene.getObjectByName('hand');
    if (handMesh) {
      handMesh.position.set(
        hand.palmPosition[0] / 2,
        hand.palmPosition[1] / 2 - 100,
        hand.palmPosition[2] / 2
      );
    }
    
    // Grab gesture - closed fist
    if (hand.grabStrength > 0.8) {
      // Find nearest element
      const nearest = findNearestElement(hand.palmPosition);
      if (nearest) {
        nearest.material.color.setHex(0xff0000);
        // Move with hand
        nearest.position.copy(handMesh.position);
      }
    }
  }
});
\`\`\`

The Leap Motion is incredibly impressive. The computer vision and tracking algorithms are sophisticated - this is the future of human-computer interaction!`,
    tags: ['leap-motion', 'reverse-engineering', 'computer-vision', '3d-tracking'],
    readTime: '20 min',
  },
  {
    date: '2012-08-05',
    title: 'Building a DNS Server in Python',
    summary: 'Ever wondered how DNS works? Built my own DNS server from scratch to really understand the protocol.',
    content: `DNS is one of those things we use every day but rarely think about. To truly understand it, I built a DNS server from scratch in Python.

## Understanding DNS Protocol

DNS uses UDP port 53 for queries:

\`\`\`python
import socket
import struct

class DNSHeader:
    def __init__(self):
        self.id = 0
        self.flags = 0
        self.qdcount = 0  # Number of questions
        self.ancount = 0  # Number of answers
        self.nscount = 0  # Number of authority records
        self.arcount = 0  # Number of additional records
    
    def pack(self):
        return struct.pack('!HHHHHH', 
                          self.id, self.flags,
                          self.qdcount, self.ancount,
                          self.nscount, self.arcount)
    
    @classmethod
    def unpack(cls, data):
        header = cls()
        (header.id, header.flags, header.qdcount,
         header.ancount, header.nscount, header.arcount) = struct.unpack('!HHHHHH', data[:12])
        return header
\`\`\`

## Parsing DNS Questions

Handling domain name queries:

\`\`\`python
class DNSQuestion:
    def __init__(self):
        self.qname = ''
        self.qtype = 0
        self.qclass = 0
    
    @classmethod
    def unpack(cls, data, offset):
        question = cls()
        
        # Parse domain name
        labels = []
        while True:
            length = data[offset]
            offset += 1
            
            if length == 0:
                break
                
            labels.append(data[offset:offset+length].decode('ascii'))
            offset += length
        
        question.qname = '.'.join(labels)
        
        # Parse type and class
        question.qtype, question.qclass = struct.unpack('!HH', data[offset:offset+4])
        offset += 4
        
        return question, offset
    
    def pack(self):
        # Encode domain name
        data = b''
        for label in self.qname.split('.'):
            data += bytes([len(label)]) + label.encode('ascii')
        data += b'\\x00'
        
        # Add type and class
        data += struct.pack('!HH', self.qtype, self.qclass)
        
        return data
\`\`\`

## Building DNS Responses

Creating answer records:

\`\`\`python
class DNSRecord:
    def __init__(self, name, type_, class_, ttl, data):
        self.name = name
        self.type = type_
        self.class_ = class_
        self.ttl = ttl
        self.data = data
    
    def pack(self):
        # Encode name
        data = b''
        for label in self.name.split('.'):
            data += bytes([len(label)]) + label.encode('ascii')
        data += b'\\x00'
        
        # Add type, class, TTL
        data += struct.pack('!HHI', self.type, self.class_, self.ttl)
        
        # Add data
        if self.type == 1:  # A record
            ip_bytes = bytes(map(int, self.data.split('.')))
            data += struct.pack('!H', 4)  # Data length
            data += ip_bytes
        elif self.type == 28:  # AAAA record
            import ipaddress
            ip_bytes = ipaddress.IPv6Address(self.data).packed
            data += struct.pack('!H', 16)  # Data length
            data += ip_bytes
        
        return data
\`\`\`

## The DNS Server

Putting it all together:

\`\`\`python
import threading

class DNSServer:
    def __init__(self, host='0.0.0.0', port=53):
        self.host = host
        self.port = port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.bind((host, port))
        
        # Simple DNS database
        self.records = {
            'example.com': {
                1: '93.184.216.34',      # A record
                28: '2606:2800:220:1:248:1893:25c8:1946'  # AAAA record
            },
            'test.example.com': {
                1: '192.168.1.100'
            }
        }
    
    def start(self):
        print(f"DNS Server listening on {self.host}:{self.port}")
        
        while True:
            data, addr = self.socket.recvfrom(512)
            
            # Handle in thread to support multiple clients
            thread = threading.Thread(target=self.handle_query, args=(data, addr))
            thread.start()
    
    def handle_query(self, data, addr):
        # Parse DNS query
        header = DNSHeader.unpack(data)
        
        # Parse questions
        offset = 12
        questions = []
        for _ in range(header.qdcount):
            question, offset = DNSQuestion.unpack(data, offset)
            questions.append(question)
            print(f"Query from {addr}: {question.qname} (type {question.qtype})")
        
        # Build response
        response = self.build_response(header, questions)
        
        # Send response
        self.socket.sendto(response, addr)
    
    def build_response(self, query_header, questions):
        # Create response header
        header = DNSHeader()
        header.id = query_header.id
        header.flags = 0x8180  # Response, no error
        header.qdcount = len(questions)
        header.ancount = 0
        
        # Start building response
        response = header.pack()
        
        # Add questions back
        for question in questions:
            response += question.pack()
        
        # Add answers
        answers = []
        for question in questions:
            if question.qname in self.records:
                if question.qtype in self.records[question.qname]:
                    answer = DNSRecord(
                        question.qname,
                        question.qtype,
                        question.qclass,
                        300,  # TTL
                        self.records[question.qname][question.qtype]
                    )
                    answers.append(answer)
                    header.ancount += 1
        
        # Update header with answer count
        response = header.pack() + response[12:]
        
        # Add answer records
        for answer in answers:
            response += answer.pack()
        
        return response
\`\`\`

## Recursive DNS Resolution

Acting as a full resolver:

\`\`\`python
class RecursiveDNSServer(DNSServer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cache = {}  # Simple cache
        self.root_servers = [
            '198.41.0.4',  # a.root-servers.net
            '199.9.14.201', # b.root-servers.net
            # ... more root servers
        ]
    
    def resolve_recursive(self, domain, qtype):
        # Check cache first
        cache_key = f"{domain}:{qtype}"
        if cache_key in self.cache:
            cached = self.cache[cache_key]
            if cached['expires'] > time.time():
                return cached['data']
        
        # Start from root servers
        nameservers = self.root_servers.copy()
        
        while nameservers:
            for ns in nameservers:
                try:
                    result = self.query_nameserver(ns, domain, qtype)
                    
                    if result.get('answer'):
                        # Cache the result
                        self.cache[cache_key] = {
                            'data': result['answer'],
                            'expires': time.time() + result.get('ttl', 300)
                        }
                        return result['answer']
                    
                    if result.get('authority'):
                        # Follow the authority
                        nameservers = self.extract_nameservers(result['authority'])
                        break
                        
                except Exception as e:
                    print(f"Error querying {ns}: {e}")
                    continue
        
        return None
    
    def query_nameserver(self, nameserver, domain, qtype):
        # Build query
        header = DNSHeader()
        header.id = random.randint(0, 65535)
        header.flags = 0x0100  # Recursion desired
        header.qdcount = 1
        
        question = DNSQuestion()
        question.qname = domain
        question.qtype = qtype
        question.qclass = 1
        
        query = header.pack() + question.pack()
        
        # Send to nameserver
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(2)
        sock.sendto(query, (nameserver, 53))
        
        response, _ = sock.recvfrom(512)
        sock.close()
        
        # Parse response
        return self.parse_response(response)
\`\`\`

## DNS Security Extensions (DNSSEC)

Adding basic DNSSEC validation:

\`\`\`python
import hashlib
import base64

class DNSSECValidator:
    def __init__(self):
        self.trusted_keys = {}  # Root zone KSK
    
    def validate_response(self, response):
        # Look for RRSIG records
        rrsigs = [r for r in response.additional if r.type == 46]
        
        for rrsig in rrsigs:
            if self.validate_signature(rrsig, response):
                return True
        
        return False
    
    def validate_signature(self, rrsig, response):
        # Parse RRSIG
        rrsig_data = self.parse_rrsig(rrsig.data)
        
        # Find corresponding DNSKEY
        dnskey = self.find_dnskey(rrsig_data['key_tag'])
        if not dnskey:
            return False
        
        # Verify signature
        signed_data = self.construct_signed_data(response, rrsig_data)
        
        try:
            # Simplified - real DNSSEC uses RSA/DSA/ECDSA
            import rsa
            key = rsa.PublicKey.load_pkcs1(dnskey)
            rsa.verify(signed_data, rrsig_data['signature'], key)
            return True
        except:
            return False
\`\`\`

## Performance Testing

Benchmarking our DNS server:

\`\`\`python
import time
import concurrent.futures

def benchmark_dns_server(server_ip, queries_per_second=100, duration=10):
    query_count = 0
    error_count = 0
    latencies = []
    
    def send_query():
        nonlocal query_count, error_count
        
        try:
            start = time.time()
            socket_client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            socket_client.settimeout(1)
            
            # Build query for random domain
            domain = f"test{random.randint(0, 1000)}.example.com"
            query = build_dns_query(domain)
            
            socket_client.sendto(query, (server_ip, 53))
            response, _ = socket_client.recvfrom(512)
            
            latency = (time.time() - start) * 1000  # ms
            latencies.append(latency)
            query_count += 1
            
        except Exception as e:
            error_count += 1
        finally:
            socket_client.close()
    
    # Run benchmark
    start_time = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        while time.time() - start_time < duration:
            futures = []
            for _ in range(queries_per_second // 10):  # Batch of queries
                futures.append(executor.submit(send_query))
            
            # Wait for batch to complete
            concurrent.futures.wait(futures)
            time.sleep(0.1)
    
    # Calculate statistics
    avg_latency = sum(latencies) / len(latencies) if latencies else 0
    p95_latency = sorted(latencies)[int(len(latencies) * 0.95)] if latencies else 0
    
    print(f"Queries: {query_count}")
    print(f"Errors: {error_count}")
    print(f"Avg latency: {avg_latency:.2f}ms")
    print(f"P95 latency: {p95_latency:.2f}ms")
    print(f"QPS: {query_count / duration:.1f}")
\`\`\`

## Results

Testing on my laptop:
- 5,000+ queries per second
- ~0.2ms average latency
- Recursive resolution works!
- Basic caching implemented
- DNSSEC validation framework

Building a DNS server taught me so much about how the internet really works!`,
    tags: ['dns', 'networking', 'python', 'protocols'],
    readTime: '22 min',
  },
];

// Generate posts
async function generatePosts() {
  console.log('🚀 Starting blog post generation for 2012 batch 3...\n');
  
  let createdCount = 0;
  
  for (const post of posts2012Batch3) {
    const date = new Date(post.date);
    const slug = post.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const fileName = `${post.date}-${slug}`;
    const dirPath = path.join(process.cwd(), 'app', 'blog', fileName);
    const filePath = path.join(dirPath, 'page.tsx');
    
    try {
      // Create directory
      await fs.promises.mkdir(dirPath, { recursive: true });
      
      // Generate page content with proper metadata
      const pageContent = `import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: '${post.title.replace(/'/g, "\\'")}',
  description: '${post.summary.replace(/'/g, "\\'")}',
  keywords: [${post.tags.map(tag => `'${tag}'`).join(', ')}],
  openGraph: {
    title: '${post.title.replace(/'/g, "\\'")}',
    description: '${post.summary.replace(/'/g, "\\'")}',
    type: 'article',
    publishedTime: '${post.date}',
    authors: ['Michael D\'Angelo'],
  },
};

const post = {
  date: '${post.date}',
  title: '${post.title.replace(/'/g, "\\'")}',
  content: \`${post.content.replace(/`/g, '\\`')}\`,
  tags: [${post.tags.map(tag => `'${tag}'`).join(', ')}],
  readTime: '${post.readTime}',
};

export default function ${post.title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return <BlogPost post={post} />;
}
`;
      
      await fs.promises.writeFile(filePath, pageContent);
      console.log(`✅ Created: ${post.title}`);
      createdCount++;
    } catch (error) {
      console.error(`❌ Error creating ${post.title}:`, error);
    }
  }
  
  console.log(`\n📝 Summary:
   Created: ${createdCount} posts
   Year: 2012
   Topics: Bitcoin tracker, WebRTC, sentiment analysis, Arduino weather station, database comparison, music visualizer, Leap Motion, DNS server`);
}

generatePosts().catch(console.error);