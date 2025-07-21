import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Building a Bitcoin Price Tracker',
  description: 'Bitcoin is at $5. Built a real-time price tracker with historical charts. This digital currency thing might actually work.',
  keywords: ['bitcoin', 'cryptocurrency', 'websockets', 'd3js'],
  openGraph: {
    title: 'Building a Bitcoin Price Tracker',
    description: 'Bitcoin is at $5. Built a real-time price tracker with historical charts. This digital currency thing might actually work.',
    type: 'article',
    publishedTime: '2012-01-25',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-01-25',
  title: 'Building a Bitcoin Price Tracker',
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
    .attr('transform', \`translate(${margin.left},${margin.top})\`);
  
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
      .attr('transform', \`translate(0,${height})\`)
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
};

export default function BuildingaBitcoinPriceTrackerPage() {
  return <BlogPost post={post} />;
}
