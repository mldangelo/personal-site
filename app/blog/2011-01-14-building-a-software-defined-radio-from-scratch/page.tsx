import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-01-15"
      title="Building a Software Defined Radio from Scratch"
      summary="Creating a complete SDR system with an FPGA and high-speed ADC. DC to daylight, here we come!"
      content={`After playing with RTL-SDR dongles and USRP boards, I decided to build my own software defined radio from scratch. Goal: understand every component from antenna to bits.

## System Architecture

The signal chain:
1. **Antenna** → Wideband discone (25 MHz - 1.3 GHz)
2. **Frontend** → Switchable filters and LNA
3. **Mixer** → Quadrature downconversion
4. **ADC** → 14-bit, 125 MSPS
5. **FPGA** → Digital downconversion and decimation
6. **USB 3.0** → Stream to computer
7. **Software** → GNU Radio for demodulation

## RF Frontend Design

### Input Protection
Learned the hard way: RF inputs need protection.
- Gas discharge tube for lightning
- PIN diode limiter for overload
- Never exceed ADC max input!

### Low Noise Amplifier
Used the MGA-82563 MMIC:
- 0.5 dB noise figure
- 20 dB gain
- 0.1-6 GHz bandwidth
- Bias tee for single supply

### Filter Bank
Switchable bandpass filters:
- HF: 0-30 MHz
- VHF: 30-300 MHz  
- UHF: 300-1000 MHz
- L-band: 1-2 GHz

PIN diode switches for selection. Software controlled.

## Quadrature Downconversion

The key to SDR: I/Q demodulation.

### Local Oscillator
Si5351 clock generator:
- 8 kHz to 160 MHz output
- Two outputs, 90° phase shift
- I²C controlled
- 0.5 ppm stability with TCXO

### Mixer
Using the LT5560 for downconversion:
- DC to 4 GHz RF input
- Excellent linearity
- Integrated baluns
- Differential I/Q outputs

## High-Speed ADC

The heart of the system: LTC2145-14
- 14-bit resolution
- 125 MSPS sampling rate
- LVDS outputs
- 73 dB SNR

PCB layout was critical:
- Differential pairs length matched
- Solid ground plane
- Separate analog/digital supplies
- Clock jitter < 1 ps RMS

## FPGA Processing

Using Spartan-6 LX45:

### Digital Downconverter
Implemented in Verilog:
\`\`\`verilog
// NCO for fine frequency tuning
always @(posedge clk) begin
    phase_acc <= phase_acc + freq_word;
end

// CORDIC for sine/cosine generation
assign sin_out = cordic_sin(phase_acc[31:16]);
assign cos_out = cordic_cos(phase_acc[31:16]);

// Complex multiplication
assign i_mixed = (adc_i * cos_out) - (adc_q * sin_out);
assign q_mixed = (adc_i * sin_out) + (adc_q * cos_out);
\`\`\`

### CIC Decimator
Reduces data rate for USB:
- Programmable decimation: 4 to 4096
- Three stages
- Bit growth handled carefully
- Compensation filter for droop

### USB 3.0 Interface

Using FT601 for streaming:
- Up to 400 MB/s throughput
- 32-bit FIFO interface
- Flow control for reliability

## Software Stack

### Device Driver
Linux kernel module for low latency:
- DMA transfers
- Ring buffer management
- Zero-copy to userspace

### GNU Radio Integration
Created custom blocks:
- Source block for IQ streaming
- Control block for frequency/gain
- Calibration utilities

### Applications Built

1. **FM Broadcast Receiver**
   - Stereo decoding works!
   - RDS data extraction
   - Better than my car radio

2. **Aircraft Tracker (ADS-B)**
   - Decode 1090 MHz transmissions
   - Plot aircraft on map
   - See planes 200 miles away

3. **Weather Satellite Receiver**
   - NOAA APT signals
   - Live weather images
   - Automated pass predictions

4. **Amateur Radio**
   - All-mode receiver
   - PSK31, RTTY, packet
   - Contact the ISS!

## Performance Achieved

Specifications:
- Frequency range: 0-60 MHz (direct sampling)
- Bandwidth: Up to 56 MHz
- Sensitivity: -130 dBm (narrowband)
- Dynamic range: 85 dB
- Phase noise: -100 dBc/Hz @ 10 kHz

## Challenges Overcome

### Clock Distribution
Getting clean clocks everywhere:
- Star distribution topology
- Matched trace lengths
- Proper termination
- Lots of bypassing

### Thermal Management
FPGA gets hot at full bandwidth:
- Heatsink with fan
- Thermal vias under FPGA
- Temperature monitoring

### EMI/RFI
SDR in a computer = noise city:
- Shielded enclosure mandatory
- Filtered power entry
- Common mode chokes on USB
- Gaskets on all seams

## Total Cost

- PCB fabrication: $100 (4-layer)
- Components: $250
- Enclosure: $50
- Mistakes: $200 (blown parts)
- **Total: $600**

Compared to $3,000 for equivalent commercial unit!

## Lessons Learned

1. **RF is unforgiving** - Every detail matters
2. **Layout is critical** - Bad layout = bad performance
3. **Calibration required** - IQ imbalance is real
4. **Processing power** - Never enough FPGA resources
5. **Documentation sparse** - Most SDR stuff is tribal knowledge

## Future Improvements

- Transmit capability (carefully!)
- Higher sampling rate ADC
- Larger FPGA
- Multiple coherent channels
- GPS disciplined oscillator

## Conclusion

Building an SDR from scratch taught me more about radio than any textbook. It's one thing to read about quadrature demodulation, another to debug I/Q imbalance at 3 AM.

Now I can literally see the radio spectrum. It's like having RF vision. The invisible world of signals is invisible no more!`}
      tags={["sdr","fpga","rf","gnu-radio"]}
      readTime="16 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Building a Software Defined Radio from Scratch - Michael D'Angelo",
    description: "Creating a complete SDR system with an FPGA and high-speed ADC. DC to daylight, here we come!",
  };
}