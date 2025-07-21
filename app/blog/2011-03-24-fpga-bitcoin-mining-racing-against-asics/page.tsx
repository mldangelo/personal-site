import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-03-25"
      title="FPGA Bitcoin Mining: Racing Against ASICs"
      summary="Upgraded from GPU to FPGA mining. Getting 200 MH/s on a Spartan-6. The efficiency is incredible, but ASICs are coming. The mining arms race accelerates."
      content={`GPU mining is becoming less profitable as difficulty skyrockets. Time to level up to FPGAs. Built a Spartan-6 based Bitcoin miner achieving 200 MH/s at only 40W. The efficiency gain is massive, but rumors of ASICs have everyone nervous.

## Why FPGAs?

GPUs are power hungry:
- Radeon 5870: 300 MH/s at 200W
- FPGA LX150: 200 MH/s at 40W
- 5x better MH/s per watt!

With rising difficulty, efficiency is everything.

## The Hardware

### Development Board
Using Digilent Nexys 3:
- Spartan-6 LX16 for testing
- Later: Custom board with LX150
- USB for communication
- Adequate cooling crucial

### Custom PCB Design
Built dedicated mining board:
- Spartan-6 LX150
- Efficient power supplies
- Proper thermal design
- JTAG for programming
- USB for work distribution

## The Mining Algorithm

SHA-256 in hardware is beautiful:
\`\`\`verilog
module sha256_transform(
    input clk,
    input [511:0] block,
    input [255:0] state_in,
    output reg [255:0] state_out,
    output reg done
);

// Expand message schedule
wire [31:0] W[0:63];
generate
    for (genvar i = 0; i < 16; i = i + 1) begin
        assign W[i] = block[511-32*i : 480-32*i];
    end
    
    for (genvar i = 16; i < 64; i = i + 1) begin
        assign W[i] = sigma1(W[i-2]) + W[i-7] + 
                       sigma0(W[i-15]) + W[i-16];
    end
endgenerate

// Pipeline the rounds
reg [31:0] a, b, c, d, e, f, g, h;
reg [6:0] round;

always @(posedge clk) begin
    if (round < 64) begin
        // SHA-256 round function
        t1 = h + Sigma1(e) + Ch(e,f,g) + K[round] + W[round];
        t2 = Sigma0(a) + Maj(a,b,c);
        
        h <= g;
        g <= f;
        f <= e;
        e <= d + t1;
        d <= c;
        c <= b;
        b <= a;
        a <= t1 + t2;
        
        round <= round + 1;
    end else begin
        done <= 1;
    end
end
\`\`\`

## Optimization Techniques

### Fully Unrolled Pipeline
Each round gets dedicated hardware:
\`\`\`verilog
// 128-deep pipeline for double SHA-256
sha256_round round0(.clk(clk), .a_in(a0), .b_in(b0), ...);
sha256_round round1(.clk(clk), .a_in(a1), .b_in(b1), ...);
// ... 126 more rounds

// New nonce every clock cycle!
\`\`\`

### Resource Sharing
Clever optimization for LUTs:
\`\`\`verilog
// Share adders between rounds
assign common_sum = e + Sigma1(e) + Ch(e,f,g);
assign t1_even = common_sum + K_even + W_even;
assign t1_odd = common_sum + K_odd + W_odd;

// Multiplexer is cheaper than duplicate adders
assign t1 = round[0] ? t1_odd : t1_even;
\`\`\`

## Mining Controller

Python host software:
\`\`\`python
class FPGAMiner:
    def __init__(self, port):
        self.fpga = serial.Serial(port, 115200)
        self.work_queue = Queue()
        
    def get_work(self):
        # Fetch from pool
        response = requests.get(POOL_URL + '/getwork')
        work = json.loads(response.text)
        
        # Extract midstate for optimization
        header = work['data'][:160]
        midstate = calculate_midstate(header)
        
        return {
            'midstate': midstate,
            'data': work['data'][128:256],
            'target': work['target']
        }
    
    def submit_nonce(self, nonce):
        # Build block header with found nonce
        # Submit to pool
        pass
    
    def mine(self):
        while True:
            work = self.get_work()
            
            # Send to FPGA
            self.fpga.write(work['midstate'])
            self.fpga.write(work['data'])
            
            # Wait for results
            if self.fpga.in_waiting:
                nonce = struct.unpack('<I', self.fpga.read(4))[0]
                self.submit_nonce(nonce)
\`\`\`

## Performance Results

### Single LX150
- Hash rate: 200 MH/s
- Power consumption: 40W
- Efficiency: 5 MH/J
- Cost: $200
- ROI: 180 days (at current difficulty)

### Quad-FPGA Rig
Built 4-FPGA cluster:
- Combined: 800 MH/s
- Total power: 180W
- More efficient than any GPU

## Thermal Management

FPGAs run hot when maxed out:
- Junction temperature: 85°C
- Added heatsinks and fans
- Underclocked slightly for stability
- Monitor temperature constantly

\`\`\`verilog
// Temperature monitoring
wire [11:0] temperature;
XADC xadc_inst (
    .DCLK(clk),
    .DEN(1'b1),
    .DADDR(7'h00),
    .DO(temperature)
);

// Thermal throttling
always @(posedge clk) begin
    if (temperature > TEMP_LIMIT) begin
        enable_mining <= 0;
    end
end
\`\`\`

## The ASIC Threat

Butterfly Labs announced ASIC miner:
- 1 TH/s claimed
- 1000W power
- $30,000 price
- Delivery "soon"

If real, FPGAs become obsolete overnight.

## Mining Pool Statistics

After one month:
- Shares submitted: 1,247,332
- Blocks found: 3 (lucky!)
- BTC earned: 167.3
- Electricity cost: $15
- Profit: $167 (BTC at $1)

Still profitable, but margins shrinking.

## Community Development

Open sourced the design:
- GitHub repo popular
- Others improving efficiency
- Collaborative optimization
- Racing against time

Someone achieved 220 MH/s with better pipelining!

## Lessons in Hardware Mining

1. **Efficiency is king** - Electricity costs kill profits
2. **First mover advantage** - Early adopters profit most
3. **Arms race inevitable** - Someone always has better hardware
4. **Open source helps** - Community optimization powerful
5. **Adaptability required** - Be ready to pivot

## The Economics

Current mining landscape:
- Network hashrate: 1.5 TH/s
- Difficulty: 434,877
- BTC/day with 200 MH/s: 0.3
- Days to mine one block solo: Never

Pool mining now mandatory.

## Future Plans

If ASICs arrive:
- Repurpose FPGAs for altcoins
- Litecoin uses scrypt (ASIC resistant)
- Or return to research projects
- FPGAs always useful

## Philosophical Thoughts

Bitcoin mining evolution:
1. CPU (2009): Everyone could mine
2. GPU (2010): Gamers had advantage
3. FPGA (2011): Engineers take over
4. ASIC (2012?): Corporations only

Decentralization → Centralization?

## Technical Skills Gained

This project taught:
- Advanced Verilog
- Pipeline optimization
- Thermal management
- Power optimization
- Economic modeling

Worth it for education alone.

## Final Verdict

FPGA mining in 2011:
- Still profitable
- Great learning experience
- Efficiency breakthrough
- But time limited
- ASICs will dominate

Riding the wave while it lasts. 167 BTC earned so far. At $1 each, barely covers hardware. But what if Bitcoin goes to $10? $100? 

The real value: Learning hardware acceleration. These skills apply beyond mining.

Time to optimize the pipeline one more time. Every MH/s counts in this race.

⛏️💰🏃‍♂️`}
      tags={["bitcoin","fpga","mining","hardware-acceleration"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "FPGA Bitcoin Mining: Racing Against ASICs - Michael D'Angelo",
    description: "Upgraded from GPU to FPGA mining. Getting 200 MH/s on a Spartan-6. The efficiency is incredible, but ASICs are coming. The mining arms race accelerates.",
  };
}