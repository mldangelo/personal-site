import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Satellite Communications 101: Getting Signal from Space - Michael D'Angelo",
  description: "Preparing for the CubeSat team interview by learning about satellite communications. How do you talk to something flying 400km overhead at 7.5km/s?",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-02-05-satellite-communications-101-getting-signal-from-space">
        <header>
          <h1 className="text-4xl font-bold mb-4">Satellite Communications 101: Getting Signal from Space</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-02-05').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 11 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['satellite', 'communications', 'rf', 'cubesat'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>CubeSat team interview is next week. They'll definitely ask about satellite communications. Time to learn how we'll talk to our bird once it's in orbit. Turns out, it's harder than "point antenna at sky."</p>
          <h2>The Basic Challenge</h2>
          <p>Our CubeSat will be:</p>
          <ul>
            <li>400km above Earth</li>
            <li>Moving at 7.5 km/s</li>
            <li>Visible for ~10 minutes per pass</li>
            <li>Transmitting with 1 watt (max)</li>
            <li>Size of a Rubik's cube</li>
          </ul>
          <p>How do you communicate with that?!</p>
          <h2>Radio Fundamentals for Space</h2>
          <h3>The Link Budget</h3>
          <p>This equation rules everything:</p>
          <p>Received Power = Transmitted Power + Gains - Losses</p>
          <p>In dB: Pr = Pt + Gt + Gr - Lp - La - Lmisc</p>
          <p>Where:</p>
          <ul>
            <li>Pt = Transmit power</li>
            <li>Gt = Transmit antenna gain</li>
            <li>Gr = Receive antenna gain</li>
            <li>Lp = Path loss (big one)</li>
            <li>La = Atmospheric loss</li>
            <li>Lmisc = Cable loss, pointing loss, etc.</li>
          </ul>
          <h3>Path Loss: The Enemy</h3>
          <p>Free space path loss (FSPL): Lp = 20×log10(d) + 20×log10(f) + 32.45</p>
          <p>For our CubeSat:</p>
          <ul>
            <li>Distance: 400-2000km (depends on elevation)</li>
            <li>Frequency: 437 MHz (70cm amateur band)</li>
            <li>Path loss: 125-140 dB</li>
          </ul>
          <p>That's a signal reduction of 10^14. Brutal.</p>
          <h2>Frequency Bands for CubeSats</h2>
          <h3>VHF (144-148 MHz)</h3>
          <p>Pros:</p>
          <ul>
            <li>Less path loss</li>
            <li>Simple antennas</li>
            <li>Penetrates atmosphere well</li>
          </ul>
          <p>Cons:</p>
          <ul>
            <li>Large antennas on spacecraft</li>
            <li>Limited bandwidth</li>
            <li>Crowded band</li>
          </ul>
          <h3>UHF (430-440 MHz)</h3>
          <p>Most popular for CubeSats!</p>
          <p>Pros:</p>
          <ul>
            <li>Good compromise size/performance</li>
            <li>Lots of amateur equipment</li>
            <li>Reasonable path loss</li>
          </ul>
          <p>Cons:</p>
          <ul>
            <li>Still needs directional ground antenna</li>
            <li>Some atmospheric noise</li>
          </ul>
          <h3>S-Band (2.4 GHz)</h3>
          <p>For high data rates.</p>
          <p>Pros:</p>
          <ul>
            <li>More bandwidth available</li>
            <li>Smaller antennas</li>
          </ul>
          <p>Cons:</p>
          <ul>
            <li>Higher path loss</li>
            <li>Needs precise pointing</li>
            <li>More expensive equipment</li>
          </ul>
          <h2>Modulation Schemes</h2>
          <h3>CW (Morse Code)</h3>
          <p>Simplest possible. Our beacon will use this.</p>
          <ul>
            <li>Very narrow bandwidth</li>
            <li>Works with weak signals</li>
            <li>Easy to decode by ear</li>
          </ul>
          <h3>FSK (Frequency Shift Keying)</h3>
          <p>Digital data transmission.</p>
          <ul>
            <li>Shifts between two frequencies for 0 and 1</li>
            <li>Good weak signal performance</li>
            <li>Standard packet radio protocols</li>
          </ul>
          <h3>BPSK/QPSK (Phase Shift Keying)</h3>
          <p>For higher data rates.</p>
          <ul>
            <li>More bits per symbol</li>
            <li>Requires better signal-to-noise ratio</li>
            <li>What pros use</li>
          </ul>
          <h2>The Doppler Effect</h2>
          <p>Satellite moving = frequency shifts!</p>
          <p>Maximum Doppler shift: Δf = ±(v/c) × f</p>
          <p>For LEO at 437 MHz:</p>
          <ul>
            <li>Max shift: ±10 kHz</li>
            <li>Rate of change: 60 Hz/second at closest approach</li>
          </ul>
          <p>Must constantly retune radio during pass. Fun!</p>
          <h2>Ground Station Design</h2>
          <p>What we need to build:</p>
          <h3>Antennas</h3>
          <p>Researched options:</p>
          <p>1. <strong>Yagi-Uda (Beam)</strong> - Gain: 10-15 dBi - Directional (needs pointing) - Cheap to build</p>
          <p>2. <strong>Crossed Yagi (Circular Polarization)</strong> - Handles satellite tumbling - 3dB loss but worth it - More complex</p>
          <p>3. <strong>Helical</strong> - Natural circular polarization - Good gain (15 dBi) - Narrow beamwidth</p>
          <p>We'll probably use crossed Yagi.</p>
          <h3>Antenna Tracking</h3>
          <p>Options: 1. Manual (cheapest, exhausting) 2. Azimuth/Elevation rotator ($500+) 3. Fixed antenna with wide beam (less gain)</p>
          <p>Starting manual, dreaming of automatic.</p>
          <h3>Radio Equipment</h3>
          <ul>
            <li>Transceiver: Yaesu FT-817 or similar</li>
            <li>Power: 5W should be enough</li>
            <li>Computer interface for digital modes</li>
            <li>Software defined radio for receiving</li>
          </ul>
          <h3>Software</h3>
          <ul>
            <li>Prediction: Where's the satellite?</li>
            <li>Tracking: Point the antenna</li>
            <li>Demodulation: Decode the data</li>
            <li>Command: Send instructions</li>
          </ul>
          <h2>Link Budget Calculation</h2>
          <p>Let's see if this actually works:</p>
          <p>Downlink at 437 MHz:</p>
          <ul>
            <li>Transmit power: +30 dBm (1W)</li>
            <li>Transmit antenna gain: 0 dBi (omnidirectional)</li>
            <li>Path loss: -130 dB (average)</li>
            <li>Receive antenna gain: +12 dBi (Yagi)</li>
            <li>Cable/misc losses: -3 dB</li>
          </ul>
          <p>Received power: 30 + 0 - 130 + 12 - 3 = -91 dBm</p>
          <p>Radio sensitivity: -110 dBm Link margin: 19 dB</p>
          <p>It works! Barely. No margin for error though.</p>
          <h2>Protocol Considerations</h2>
          <h3>AX.25 Packet Radio</h3>
          <p>Standard for amateur satellites.</p>
          <ul>
            <li>Based on X.25</li>
            <li>Error detection/correction</li>
            <li>Addressing built in</li>
            <li>Well supported</li>
          </ul>
          <h3>Custom Protocols</h3>
          <p>For efficiency, might design our own.</p>
          <ul>
            <li>Minimize overhead</li>
            <li>Optimize for space environment</li>
            <li>Include forward error correction</li>
          </ul>
          <h2>Real Hardware Testing</h2>
          <p>Built a 437 MHz Yagi this week:</p>
          <ul>
            <li>7 elements</li>
            <li>About 11 dBi gain (calculated)</li>
            <li>$20 in aluminum rod and PVC</li>
          </ul>
          <p>Tested by listening to active satellites:</p>
          <ul>
            <li>Heard CW beacon from AO-27</li>
            <li>Decoded packet from ISS!</li>
            <li>Doppler shift very noticeable</li>
          </ul>
          <p>Actually hearing signals from space = mind blown.</p>
          <h2>Challenges Specific to CubeSats</h2>
          <h3>Power Budget</h3>
          <p>1 watt is optimistic. Reality:</p>
          <ul>
            <li>Solar panels generate ~2W average</li>
            <li>Battery capacity limited</li>
            <li>Must share with other systems</li>
          </ul>
          <p>Might only transmit 10% of the time.</p>
          <h3>Antenna Deployment</h3>
          <p>CubeSat antennas must:</p>
          <ul>
            <li>Fit inside before launch</li>
            <li>Deploy reliably in space</li>
            <li>Survive temperature extremes</li>
          </ul>
          <p>Common solution: Tape measure material!</p>
          <h3>Tumbling</h3>
          <p>CubeSat will tumble randomly.</p>
          <ul>
            <li>Antenna pattern constantly changing</li>
            <li>Polarization rotating</li>
            <li>Signal fading in and out</li>
          </ul>
          <p>Why circular polarization matters.</p>
          <h2>Regulatory Hurdles</h2>
          <p>Can't just transmit to space!</p>
          <p>Need:</p>
          <ul>
            <li>Amateur radio license (getting mine!)</li>
            <li>Frequency coordination</li>
            <li>Power limits compliance</li>
            <li>International agreements</li>
          </ul>
          <p>So much paperwork for 1 watt.</p>
          <h2>Learning from Other Missions</h2>
          <p>Studied successful CubeSat missions:</p>
          <h3>AMSAT CubeSats</h3>
          <ul>
            <li>Simple FM repeaters</li>
            <li>Proven reliable</li>
            <li>Great first mission</li>
          </ul>
          <h3>University CubeSats</h3>
          <ul>
            <li>Often too ambitious</li>
            <li>Complex = more failure modes</li>
            <li>KISS principle wins</li>
          </ul>
          <h3>Commercial CubeSats  </h3>
          <ul>
            <li>Higher frequencies</li>
            <li>Directional antennas</li>
            <li>Not applicable for us</li>
          </ul>
          <h2>Ground Station Networks</h2>
          <p>Don't need to do it alone!</p>
          <h3>SatNOGS</h3>
          <ul>
            <li>Global network of ground stations</li>
            <li>Open source</li>
            <li>Automatic tracking</li>
            <li>Free to use!</li>
          </ul>
          <h3>AMSAT Network</h3>
          <ul>
            <li>Amateur radio operators worldwide</li>
            <li>Will help track and decode</li>
            <li>Invaluable for global coverage</li>
          </ul>
          <h2>Preparing for Interview</h2>
          <p>Key points to emphasize: 1. Understand link budgets 2. Know frequency allocations 3. Appreciate Doppler effects 4. Have realistic data rate expectations 5. Consider operational constraints</p>
          <p>Practice questions:</p>
          <ul>
            <li>"How much data can we downlink per pass?"</li>
            <li>"What's our link margin?"</li>
            <li>"How do we handle Doppler?"</li>
          </ul>
          <h2>The Reality Check</h2>
          <p>Talking to spacecraft is HARD:</p>
          <ul>
            <li>Weak signals</li>
            <li>Limited time windows</li>
            <li>Equipment complexity</li>
            <li>Environmental challenges</li>
          </ul>
          <p>But people do it every day. We can too.</p>
          <h2>Next Steps</h2>
          <p>Before interview: 1. Finish building ground station 2. Track more satellites 3. Calculate link budgets for different scenarios 4. Learn GNU Radio basics 5. Practice CW (just in case)</p>
          <h2>The Excitement</h2>
          <p>In 2 years, we might be receiving data from our own satellite.</p>
          <p>Our hardware. In space. Sending us data.</p>
          <p>How cool is that?!</p>
          <p><em>Update: Spent all night tracking satellites. Decoded weather image from NOAA-15. Space is addictive.</em></p>
        </div>
      </article>
    </>
  );
}