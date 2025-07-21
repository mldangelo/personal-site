import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-02-05"
      title="Building a Bitcoin Mining Rig: Early Days of Crypto"
      summary="Bitcoin is at $1. Building a GPU mining rig in my dorm room. This internet money thing might be interesting."
      content={`Bitcoin hit $1 today. After reading the Satoshi whitepaper last month, I'm convinced this is revolutionary. Time to build a mining rig in my dorm room. What could go wrong?

## Understanding Bitcoin

After deep diving into the whitepaper:
- Decentralized digital currency
- Proof of work consensus
- SHA-256 hashing
- 21 million supply cap
- No central authority

Either genius or insane. Maybe both.

## The Mining Concept

Mining = solving cryptographic puzzles:
1. Take block of transactions
2. Add nonce (random number)
3. Hash with SHA-256
4. Check if hash < target
5. If not, try different nonce
6. First to find valid hash wins block

Currently: 50 BTC per block. Worth $50!

## CPU Mining (Failed Attempt)

Started with CPU mining:
\`\`\`python
import hashlib
import time

def mine_block(block_data, target):
    nonce = 0
    start = time.time()
    
    while True:
        data = block_data + str(nonce)
        hash_result = hashlib.sha256(data.encode()).hexdigest()
        
        if hash_result < target:
            elapsed = time.time() - start
            print(f"Found! Nonce: {nonce}")
            print(f"Hash: {hash_result}")
            print(f"Time: {elapsed:.2f}s")
            return nonce
            
        nonce += 1
        
        if nonce % 1000000 == 0:
            hps = nonce / (time.time() - start)
            print(f"Tried {nonce}, {hps:.0f} H/s")
\`\`\`

Result: 2 MH/s. Network hashrate: 100+ GH/s. 
Probability of finding block: effectively zero.

## GPU Mining Research

GPUs much better for parallel hashing:
- CPU: 4 cores, complex
- GPU: 100s of cores, simple
- Perfect for repetitive tasks

Ordered two AMD 5870s from Newegg.

## Building the Rig

### Hardware
- 2x AMD Radeon 5870 ($400 each)
- Sempron CPU (cheapest possible)
- 2GB RAM (minimum needed)
- 1200W PSU (GPUs hungry!)
- Milk crate "case" (airflow)
- Total: ~$1,200

### Dorm Room Challenges
- Power: On edge of circuit breaker
- Heat: Like a space heater
- Noise: Sounds like jet engine
- Roommate: Not happy

"It's for computer science research!"

## Mining Software

Using Phoenix Miner with OpenCL:
\`\`\`bash
./phoenix.py -u http://mining.bitcoin.cz:8332   -k poclbm DEVICE=0 VECTORS AGGRESSION=12   BFI_INT WORKSIZE=256
\`\`\`

Each GPU: ~300 MH/s
Total: 600 MH/s
30x faster than CPU!

## Joining a Mining Pool

Solo mining impossible now. Joined Slush's pool:
- Proportional payout system
- 2% fee
- ~1000 miners
- Find blocks together
- Split rewards

First payout: 0.1 BTC in 24 hours!

## The Economics

Daily calculations:
- Hashrate: 600 MH/s
- Pool percentage: 0.01%
- Blocks/day: 144
- BTC/block: 50
- My share: ~0.72 BTC/day
- Value: $0.72/day
- Electricity: $2/day

Currently losing money. But what if Bitcoin goes up?

## Temperature Management

GPUs running at 90°C+:
- Removed window screen
- Box fan blowing outside air
- GPUs undervolted slightly
- Still concerning

Buffalo winter is helping!

## Coding Custom Monitoring

Built monitoring system:
\`\`\`python
import subprocess
import time
import requests

def get_gpu_stats():
    # Parse aticonfig output
    temp = subprocess.check_output(
        ["aticonfig", "--adapter=all", "--od-gettemperature"]
    )
    return parse_temperature(temp)

def check_mining_stats():
    # Query pool API
    response = requests.get(
        "https://mining.bitcoin.cz/api/",
        auth=("user", "pass")
    )
    return response.json()

while True:
    temps = get_gpu_stats()
    stats = check_mining_stats()
    
    print(f"GPU0: {temps[0]}°C, GPU1: {temps[1]}°C")
    print(f"Hashrate: {stats['hashrate']} MH/s")
    print(f"Balance: {stats['balance']} BTC")
    
    if any(t > 95 for t in temps):
        send_alert("GPU OVERHEATING!")
        
    time.sleep(60)
\`\`\`

## Network Difficulty Rising

Watching difficulty increase:
- January: 16,307
- February: 25,997 (+59%!)
- More miners joining
- Arms race beginning
- GPU shortage starting

My 600 MH/s becoming less significant daily.

## First Bitcoin Transaction

Wanted to test the system:
1. Sent 1 BTC to friend
2. He sent 0.9 back
3. 0.1 BTC fee/test
4. Worked perfectly!
5. Magic internet money is real

Transaction on blockchain forever: [txid]

## Dorm Administration Issue

RA knock on door:
"What's that noise?"
"Computer project."
"Why is your room so hot?"
"Computers generate heat."
"Is this a fire hazard?"
"...no?"

Had to move rig to friend's apartment.

## Lessons Learned

1. **Early adopter advantage real** - Difficulty lower
2. **Hardware arms race inevitable** - FPGAs coming
3. **Electricity cost crucial** - Location matters
4. **Heat/noise major issues** - Residential mining hard
5. **Decentralization powerful** - No one can stop it

## Community Involvement

Bitcoin community tiny but passionate:
- BitcoinTalk forums active
- IRC channels 24/7
- Everyone knows everyone
- Cypherpunk ideals strong
- Price speculation constant

Feels like early internet.

## Future Predictions

My Bitcoin thoughts:
- Will hit $10 (10x!)
- Governments will notice
- Better mining hardware coming
- Other cryptocurrencies will emerge
- Blockchain has other uses

Keeping all mined BTC. This is bigger than money.

## Technical Fascination

Beyond profit, the technology amazes:
- Byzantine Generals Problem solved
- Trustless consensus achieved
- Cryptographic elegance
- Economic incentives aligned
- Truly novel invention

Satoshi is a genius.

## Current Status

3 months of mining:
- Total mined: 47 BTC
- Current value: $47
- Electricity cost: $180
- Net: -$133

But if Bitcoin hits $100...

## The Bigger Picture

This isn't about getting rich (though that'd be nice). It's about:
- Financial sovereignty
- Technological revolution
- Decentralized future
- Cryptographic proof > trust
- Being part of history

We're witnessing/building the future of money.

## Advice for Others

Want to start mining?
1. **Calculate profitability** - Difficulty only goes up
2. **Consider electricity cost** - Makes or breaks you
3. **Manage heat/noise** - Harder than expected
4. **Join pool immediately** - Solo mining dead
5. **HODL** - This is just beginning

## Final Thoughts

Sitting in lab, watching my Bitcoin balance slowly increase. Each fraction representing computational work converted to value. 

In 10 years, we'll either laugh at this folly or marvel at being early. I'm betting on the latter.

The revolution won't be centralized. ₿🚀`}
      tags={["bitcoin","cryptocurrency","mining","gpu"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Building a Bitcoin Mining Rig: Early Days of Crypto - Michael D'Angelo",
    description: "Bitcoin is at $1. Building a GPU mining rig in my dorm room. This internet money thing might be interesting.",
  };
}