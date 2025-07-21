import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Thanksgiving Break Project: FM Radio from Scratch</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-11-25">November 24, 2009</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">radio</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">electronics</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">project</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">analog</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Campus is empty, roommate went home, and I have the room to myself. Perfect time for a project I\'ve wanted to try: building an FM radio receiver from basic components. No IC radios - that\'s cheating.</p>
            <h2>Why Build a Radio?</h2>
            <ul>
              <li>Understand RF fundamentals</li>
              <li>Learn analog circuit design</li>
              <li>Actually use that electromagnetics theory</li>
              <li>Impress family at Thanksgiving dinner</li>
              <li>Because it\'s there</li>
            </ul>
            <h2>The Design Choice</h2>
            <p>After research, going with superheterodyne receiver:</p>
            <ul>
              <li>Better selectivity than simple designs</li>
              <li>Teaches multiple concepts</li>
              <li>Complex enough to be interesting</li>
              <li>Simple enough to actually work</li>
            </ul>
            <h2>Circuit Blocks Needed</h2>
            <ul>
              <li><strong>RF Amplifier</strong> - Boost tiny antenna signal</li>
              <li><strong>Local Oscillator</strong> - Generate mixing frequency</li>
              <li><strong>Mixer</strong> - Create intermediate frequency</li>
              <li><strong>IF Amplifier</strong> - Most gain happens here</li>
              <li><strong>Detector</strong> - Extract audio from FM</li>
              <li><strong>Audio Amplifier</strong> - Drive speaker</li>
            </ul>
            <p>Each block is a learning experience.</p>
            <h2>The Build Begins</h2>
            <h3>RF Front End</h3>
            <p>Starting with antenna and RF amp:</p>
            <pre className="language-text"><code>{`Antenna → L1/C1 Tank → Q1 RF Amp → Output\\n          88-108MHz     2N3904`}</code></pre>
            <p>Winding coils is an art:</p>
            <ul>
              <li>5 turns of 20AWG wire</li>
              <li>6mm diameter form (Sharpie marker)</li>
              <li>Spread turns for lower inductance</li>
              <li>Silver wire would be better (don\'t have)</li>
            </ul>
            <p>First problem: How to test without spectrum analyzer?</p>
            <h3>The Oscillator Challenge</h3>
            <p>Local oscillator needs to tune 98.7 - 118.7 MHz (FM band + 10.7 MHz IF):</p>
            <ul>
              <li>Using Colpitts oscillator design</li>
              <li>Variable capacitor from old radio</li>
              <li>Frequency stability is... questionable</li>
            </ul>
            <p>Spent 3 hours getting stable oscillation. Touching circuit changes frequency. Everything changes frequency. Welcome to RF.</p>
            <h3>Mixer Mathematics</h3>
            <p>Mixer creates sum and difference frequencies:</p>
            <ul>
              <li>RF input: 100 MHz (example)</li>
              <li>LO input: 110.7 MHz</li>
              <li>Outputs: 210.7 MHz (sum), 10.7 MHz (difference)</li>
            </ul>
            <p>IF filter passes only 10.7 MHz. In theory.</p>
            <p>Using diode ring mixer:</p>
            <ul>
              <li>4x 1N4148 diodes in ring</li>
              <li>Transformers from junk box</li>
              <li>Balance is critical</li>
              <li>My first attempt: received everything except FM</li>
            </ul>
            <h3>IF Strip</h3>
            <p>10.7 MHz is standard FM IF frequency. Why? Industry standard = cheap filters available.</p>
            <p>Built 3-stage IF amplifier:</p>
            <ul>
              <li>Each stage: ~20dB gain</li>
              <li>Total: 60dB gain</li>
              <li>Bandwidth: ~200 kHz</li>
              <li>Lots of oscillation problems</li>
            </ul>
            <p>Solution: Shield between stages using tin cans. Literally. Altoids tins = RF shielding.</p>
            <h3>FM Detection</h3>
            <p>FM detection is harder than AM. Using ratio detector:</p>
            <ul>
              <li>Converts frequency changes to amplitude</li>
              <li>Requires precisely tuned transformer</li>
              <li>Took 6 attempts to wind correctly</li>
              <li>Still not quite right</li>
            </ul>
            <p>Audio quality: \"Recognizable\" being generous.</p>
            <h2>First Reception!</h2>
            <p>After 14 hours total build time:</p>
            <ul>
              <li>Tuned to 101.3 (strongest local station)</li>
              <li>Heard music! And static. Lots of static.</li>
              <li>Audio distorted but intelligible</li>
              <li>Range: About 3 miles from transmitter</li>
            </ul>
            <p>Success tastes like solder flux and coffee.</p>
            <h2>Problems Encountered</h2>
            <h3>Oscillator Drift</h3>
            <p>LO frequency drifts with:</p>
            <ul>
              <li>Temperature (a lot)</li>
              <li>Power supply voltage</li>
              <li>Moon phase (feels like it)</li>
              <li>Me walking near it</li>
            </ul>
            <p>Partial solution: Voltage regulator, shielding, prayer.</p>
            <h3>Selectivity</h3>
            <p>Receives multiple stations simultaneously. IF filter not sharp enough. Commercial radios use ceramic/crystal filters. I have LC circuits.</p>
            <h3>Sensitivity</h3>
            <p>Need outdoor antenna for most stations. Indoor reception only for closest transmitter. More RF gain needed, but oscillation lurks.</p>
            <h3>Spurious Responses</h3>
            <p>Receiving stations at wrong dial positions:</p>
            <ul>
              <li>Image frequencies</li>
              <li>Harmonic mixing</li>
              <li>Direct IF breakthrough</li>
            </ul>
            <p>RF is hard.</p>
            <h2>Measurements and Testing</h2>
            <p>Without proper test equipment, getting creative:</p>
            <ul>
              <li>Frequency counter: Arduino + prescaler</li>
              <li>Signal strength: Analog meter + diode</li>
              <li>Audio quality: Ears + patience</li>
              <li>Alignment: Trial and error</li>
            </ul>
            <p>Ordered used oscilloscope on eBay. Christmas present to self.</p>
            <h2>Current Performance</h2>
            <ul>
              <li>Frequency range: 88-102 MHz (can\'t reach top of band)</li>
              <li>Sensitivity: ~100 µV (rough estimate)</li>
              <li>Audio output: 100 mW into 8Ω speaker</li>
              <li>Current draw: 45 mA @ 9V</li>
              <li>Size: Covers entire desk</li>
              <li>Wife acceptance factor: Zero</li>
            </ul>
            <h2>Improvements Needed</h2>
            <ul>
              <li><strong>Better filtering</strong> - Ceramic IF filters ordered</li>
              <li><strong>AFC circuit</strong> - Automatic frequency control</li>
              <li><strong>Squelch</strong> - Mute when no signal</li>
              <li><strong>Stereo decoder</strong> - Eventually</li>
              <li><strong>Proper PCB</strong> - Breadboard RF is painful</li>
            </ul>
            <h2>What I Learned</h2>
            <h3>RF is Black Magic</h3>
            <ul>
              <li>Everything affects everything</li>
              <li>Shielding is not optional</li>
              <li>Short leads or death</li>
              <li>Ground planes are your friend</li>
            </ul>
            <h3>Analog is Hard</h3>
            <ul>
              <li>No compiler to find errors</li>
              <li>Debugging requires understanding</li>
              <li>Component tolerances matter</li>
              <li>Temperature coefficients are real</li>
            </ul>
            <h3>Theory vs Practice</h3>
            <ul>
              <li>Textbook circuits need adaptation</li>
              <li>Parasitic elements everywhere</li>
              <li>\"Ideal\" components don\'t exist</li>
              <li>Murphy\'s Law squared</li>
            </ul>
            <h2>Cost Analysis</h2>
            <ul>
              <li>Components: ~$20 (had most)</li>
              <li>Time: 14 hours so far</li>
              <li>Education: Priceless</li>
              <li>Retail FM radio: $10</li>
            </ul>
            <p>Worth it? Absolutely.</p>
            <h2>Family Reactions</h2>
            <p>Dad: \"You built that? Does it work?\"</p>
            <p>Mom: \"That\'s nice dear. Clear the table for dinner.\"</p>
            <p>Sister: \"Can it play my iPod?\"</p>
            <p>Grandpa: \"I built one in the war. Used tubes.\"</p>
            <p>Grandpa wins.</p>
            <h2>Next Steps</h2>
            <ul>
              <li>Rebuild on PCB (ugly style)</li>
              <li>Add fine tuning control</li>
              <li>Implement AGC</li>
              <li>Try stereo decoder</li>
              <li>Build matching AM radio</li>
            </ul>
            <h2>Resources That Helped</h2>
            <ul>
              <li>ARRL Handbook (borrowed from library)</li>
              <li><a href=\"https://youtube.com/w2aew\">W2AEW YouTube videos</a></li>
              <li>Various ham radio forums</li>
              <li>Lots of trial and error</li>
            </ul>
            <h2>Final Thoughts</h2>
            <p>Building a radio from scratch is humbling. What seems simple (receive FM) involves:</p>
            <ul>
              <li>Maxwell\'s equations in practice</li>
              <li>Signal processing</li>
              <li>Precision analog design</li>
              <li>Patience of a saint</li>
            </ul>
            <p>But when voices emerge from static you created from components you understand - that\'s magic. Real magic.</p>
            <p>Now to clean up before roommate returns...</p>
            <p><em>Update: Grandpa spent hour examining circuit. His verdict: \"Not bad for solid state.\" High praise from a tube man.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
