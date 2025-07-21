import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Building a Logic Analyzer with Arduino - Michael D'Angelo",
  description: "Commercial logic analyzers cost hundreds. Built my own 8-channel analyzer for $20. It's slow but educational!",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-02-25-building-a-logic-analyzer-with-arduino">
        <header>
          <h1 className="text-4xl font-bold mb-4">Building a Logic Analyzer with Arduino</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-02-25').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 14 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['logic-analyzer', 'arduino', 'diy', 'test-equipment'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Debugging SPI communication between two chips. Oscilloscope shows one signal at a time. Need to see clock, data, and chip select together. Time to build a logic analyzer!</p>
          <h2>What\'s a Logic Analyzer?</h2>
          <p>Think of it as a multi-channel digital oscilloscope:</p>
          <ul>
            <li>Records multiple digital signals simultaneously</li>
            <li>Shows timing relationships</li>
            <li>Perfect for debugging protocols</li>
            <li>Only cares about 0 or 1, not analog values</li>
          </ul>
          <h2>Commercial vs DIY</h2>
          <p>Saleae Logic 8: $400, 24MHz sample rate, beautiful software My version: $20, 1MHz sample rate, functional software</p>
          <p>For learning protocols at school? Mine's good enough!</p>
          <h2>The Hardware Design</h2>
          <p>Core idea: Use Arduino to sample 8 pins rapidly, send data to PC.</p>
          <h3>Version 1: Naive Approach</h3>
          <pre className="language-c"><code>{`void loop() {
    byte sample = PINB;  // Read 8 pins at once
    Serial.write(sample);
}`}</code></pre>
          <p>Problems:</p>
          <ul>
            <li>Serial baud rate limits sample rate</li>
            <li>No timing information</li>
            <li>No triggering</li>
          </ul>
          <p>Max sample rate: 115200/8 = 14.4kHz. Pathetic.</p>
          <h3>Version 2: Buffered Sampling</h3>
          <p>Sample into memory first, then transmit:</p>
          <pre className="language-c"><code>{`byte buffer[1024];  // ATmega328 has 2KB RAM
int pos = 0;

void capture() {
    while(pos < 1024) {
        buffer[pos++] = PINB;
        delayMicroseconds(1);  // 1MHz sample rate
    }
}`}</code></pre>
          <p>Better! But delayMicroseconds() isn't accurate.</p>
          <h3>Version 3: Timer-Driven Sampling</h3>
          <p>Use Timer1 for precise timing:</p>
          <pre className="language-c"><code>{`ISR(TIMER1_COMPA_vect) {
    if(capturing && pos < BUFFER_SIZE) {
        buffer[pos++] = PINB;
    }
}

void setup() {
    // Configure Timer1 for 1MHz
    OCR1A = 15;  // 16MHz / 16 = 1MHz
    TCCR1B = (1 << WGM12) | (1 << CS10);
    TIMSK1 = (1 << OCIE1A);
}`}</code></pre>
          <p>Now we're sampling at exactly 1MHz!</p>
          <h3>Adding Trigger Logic</h3>
          <p>Logic analyzer needs triggering to capture specific events:</p>
          <pre className="language-c"><code>{`void waitForTrigger() {
    byte triggerMask = 0x01;   // Trigger on bit 0
    byte triggerValue = 0x01;  // Rising edge
    byte lastSample = PINB;
    
    while(true) {
        byte sample = PINB;
        if((lastSample & triggerMask) == 0 && 
           (sample & triggerMask) == triggerValue) {
            break;  // Triggered!
        }
        lastSample = sample;
    }
}`}</code></pre>
          <h2>The Protocol</h2>
          <p>Defined simple serial protocol:</p>
          <p>Commands from PC:</p>
          <ul>
            <li>'C': Capture</li>
            <li>'T': Set trigger</li>
            <li>'R': Set sample rate</li>
            <li>'S': Get status</li>
          </ul>
          <p>Response format:</p>
          <ul>
            <li>[START][LENGTH][DATA...][CHECKSUM][END]</li>
          </ul>
          <h2>PC Software</h2>
          <p>First attempt: Arduino Serial Monitor. Useless for binary data.</p>
          <h3>Python to the Rescue!</h3>
          <p>Wrote Python script for capture and display:</p>
          <pre className="language-python"><code>{`import serial
import matplotlib.pyplot as plt

def capture_data(port, num_samples):
    ser = serial.Serial(port, 115200)
    ser.write(b'C')  # Start capture
    
    # Wait for data
    while ser.read() != b'START':
        pass
    
    length = ser.read(2)
    data = ser.read(length)
    
    return list(data)

def plot_logic(data):
    fig, axes = plt.subplots(8, 1, sharex=True)
    
    for bit in range(8):
        signal = [(d >> bit) & 1 for d in data]
        axes[bit].step(range(len(signal)), signal)
        axes[bit].set_ylim(-0.1, 1.1)
        axes[bit].set_ylabel(f'D{bit}')
    
    plt.show()`}</code></pre>
          <p>Basic but functional!</p>
          <h3>Adding Protocol Decoders</h3>
          <p>SPI decoder:</p>
          <pre className="language-python"><code>{`def decode_spi(clk, mosi, miso, cs):
    bytes_mosi = []
    bytes_miso = []
    current_mosi = 0
    current_miso = 0
    bit_count = 0
    
    for i in range(1, len(clk)):
        if cs[i] == 0:  # Chip selected
            if clk[i] == 1 and clk[i-1] == 0:  # Rising edge
                current_mosi = (current_mosi << 1) | mosi[i]
                current_miso = (current_miso << 1) | miso[i]
                bit_count += 1
                
                if bit_count == 8:
                    bytes_mosi.append(current_mosi)
                    bytes_miso.append(current_miso)
                    bit_count = 0
                    current_mosi = 0
                    current_miso = 0
    
    return bytes_mosi, bytes_miso`}</code></pre>
          <p>Now I can see actual SPI transactions!</p>
          <h2>Real-World Testing</h2>
          <h3>Test 1: UART Communication</h3>
          <p>Connected to Arduino sending "Hello":</p>
          <ul>
            <li>Clearly see start bits, data, stop bits</li>
            <li>Decoded ASCII values correctly</li>
            <li>Found baud rate mismatch (115200 vs 119200 actual)</li>
          </ul>
          <h3>Test 2: I2C Debugging</h3>
          <p>Debugging I2C EEPROM communication:</p>
          <ul>
            <li>Saw SDA and SCL relationship</li>
            <li>Caught missing ACK bit</li>
            <li>Problem: Pull-up resistors too large</li>
          </ul>
          <h3>Test 3: SPI Flash</h3>
          <p>Analyzing SPI flash commands:</p>
          <ul>
            <li>Captured full read sequence</li>
            <li>Saw chip select timing issue</li>
            <li>Fixed 10ns CS hold time violation</li>
          </ul>
          <h2>Performance Analysis</h2>
          <p>What can 1MHz sample rate actually capture?</p>
          <p>Good for:</p>
          <ul>
            <li>UART up to 115200 baud</li>
            <li>I2C up to 400kHz</li>
            <li>SPI up to 500kHz</li>
            <li>General GPIO debugging</li>
          </ul>
          <p>Not good for:</p>
          <ul>
            <li>USB (12MHz+)</li>
            <li>High-speed SPI (10MHz+)</li>
            <li>DDR memory</li>
            <li>Fast microcontroller buses</li>
          </ul>
          <p>But perfect for learning!</p>
          <h2>Improvements Made</h2>
          <h3>Compression</h3>
          <p>8 channels changing slowly = lots of repeated samples.</p>
          <p>Run-length encoding:</p>
          <pre className="language-c"><code>{`void compress_buffer() {
    byte last = buffer[0];
    byte count = 1;
    
    for(int i = 1; i < pos; i++) {
        if(buffer[i] == last && count < 255) {
            count++;
        } else {
            send_compressed(last, count);
            last = buffer[i];
            count = 1;
        }
    }
}`}</code></pre>
          <p>4x improvement for typical signals!</p>
          <h3>Variable Sample Rate</h3>
          <p>Added prescaler configuration:</p>
          <ul>
            <li>4MHz: /4 prescaler</li>
            <li>1MHz: /16 prescaler</li>
            <li>250kHz: /64 prescaler</li>
            <li>15.6kHz: /1024 prescaler</li>
          </ul>
          <p>Lower rates = longer captures.</p>
          <h3>Pre-trigger Buffer</h3>
          <p>Circular buffer to capture before trigger:</p>
          <pre className="language-c"><code>{`void circular_capture() {
    pos = 0;
    while(!triggered) {
        buffer[pos] = PINB;
        pos = (pos + 1) % BUFFER_SIZE;
        check_trigger();
    }
    // Continue capturing after trigger
}`}</code></pre>
          <p>See what led up to the event!</p>
          <h2>Limitations Hit</h2>
          <h3>Memory</h3>
          <p>2KB RAM - 1KB buffer = 1ms at 1MHz Solution: External SPI RAM chip (23K256)</p>
          <h3>Sample Rate</h3>
          <p>Arduino at 16MHz limits practical sample rate. Solution: FPGA (future project!)</p>
          <h3>Analog Threshold</h3>
          <p>Digital only assumes 2.5V threshold. Solution: Comparators with adjustable threshold.</p>
          <h2>Cost Breakdown</h2>
          <ul>
            <li>Arduino Nano clone: $5</li>
            <li>Headers and cables: $5</li>
            <li>Perfboard: $2</li>
            <li>Test clips: $8</li>
            <li>Total: $20</li>
          </ul>
          <p>Optional upgrades:</p>
          <ul>
            <li>23K256 RAM: $2</li>
            <li>Better clips: $15</li>
            <li>Metal enclosure: $10</li>
          </ul>
          <h2>Lessons Learned</h2>
          <p>1. <strong>Start simple</strong>: Basic version taught core concepts 2. <strong>Iterate quickly</strong>: Each version solved specific problems 3. <strong>Good enough works</strong>: Don't need Saleae quality for learning 4. <strong>Software matters</strong>: Half the work was PC side 5. <strong>Documentation crucial</strong>: Helped classmates build their own</p>
          <h2>Educational Value</h2>
          <p>Building this taught:</p>
          <ul>
            <li>Interrupt programming</li>
            <li>Serial protocols</li>
            <li>Python GUI programming</li>
            <li>Signal integrity basics</li>
            <li>Protocol analysis</li>
          </ul>
          <p>Worth way more than $20!</p>
          <h2>Future Enhancements</h2>
          <p>Version 2 plans:</p>
          <ul>
            <li>16 channels (use I/O expander)</li>
            <li>10MHz sample rate (external ADC)</li>
            <li>Analog channels (mixed-signal)</li>
            <li>Better triggering (pattern, serial)</li>
            <li>Web interface (ESP32?)</li>
          </ul>
          <p>But current version works for 90% of my needs.</p>
          <h2>Comparison with Scope</h2>
          <p>Logic Analyzer:</p>
          <ul>
            <li>Many channels</li>
            <li>Long time capture</li>
            <li>Protocol decode</li>
            <li>Digital only</li>
          </ul>
          <p>Oscilloscope:</p>
          <ul>
            <li>Analog details</li>
            <li>Signal integrity</li>
            <li>Noise analysis</li>
            <li>1-4 channels typically</li>
          </ul>
          <p>Need both for complete picture!</p>
          <h2>Open Source Release</h2>
          <p>Posted on GitHub with:</p>
          <ul>
            <li>Arduino firmware</li>
            <li>Python software</li>
            <li>PCB design files</li>
            <li>Build instructions</li>
          </ul>
          <p>Already 10 forks and improvements!</p>
          <h2>Using It for CubeSat</h2>
          <p>Debugging satellite communication board:</p>
          <ul>
            <li>8 channels monitoring SPI bus</li>
            <li>Caught timing violation in radio chip access</li>
            <li>Saved hours vs single-channel scope</li>
          </ul>
          <p>This tool has already paid for itself.</p>
          <h2>Final Thoughts</h2>
          <p>Is it as good as commercial? No. Did I learn a ton building it? Yes. Does it solve real problems? Absolutely.</p>
          <p>Sometimes the journey is worth more than the destination.</p>
          <p>To fellow students: Build your own tools. You'll understand them deeply and can customize for your exact needs.</p>
          <p><em>Currently working on: FPGA-based version with 100MHz sample rate. Because why not?</em></p>
        </div>
      </article>
    </>
  );
}