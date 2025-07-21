import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "The Beauty of Fourier Analysis - Michael D'Angelo",
  description: "That moment when Fourier transforms finally clicked - seeing signals in the frequency domain changes everything.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-11-07-the-beauty-of-fourier-analysis">
        <header>
          <h1 className="text-4xl font-bold mb-4">The Beauty of Fourier Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-11-07').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 10 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['mathematics', 'signals', 'dsp', 'education'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Today in Signals & Systems, Professor Chen showed us something that literally changed how I see the world. Fourier analysis isn't just math - it's a completely different way of understanding signals. Here's my attempt to explain why this is so mind-blowing.</p>
          <h2>The Problem That Started It All</h2>
          <p>We had this square wave on the oscilloscope. Professor asked: "What frequencies are in this signal?"</p>
          <p>My answer: "Uh... whatever frequency the square wave is?"</p>
          <p>Wrong. So very wrong.</p>
          <h2>The Revelation</h2>
          <p>A square wave contains:</p>
          <ul>
            <li>The fundamental frequency</li>
            <li>3rd harmonic at 1/3 amplitude</li>
            <li>5th harmonic at 1/5 amplitude</li>
            <li>7th harmonic at 1/7 amplitude</li>
            <li>... and so on forever</li>
          </ul>
          <p>Wait, what? A simple square wave has infinite frequency components?</p>
          <h2>The Demo That Blew My Mind</h2>
          <p>Professor connected a function generator to a spectrum analyzer. First, a sine wave:</p>
          <ul>
            <li>One spike at 1kHz</li>
            <li>Nothing else</li>
            <li>Clean and simple</li>
          </ul>
          <p>Then, a square wave at 1kHz:</p>
          <ul>
            <li>Spike at 1kHz (fundamental)</li>
            <li>Spike at 3kHz (3rd harmonic)</li>
            <li>Spike at 5kHz (5th harmonic)</li>
            <li>... spikes all the way up</li>
          </ul>
          <p>The math predicted exactly what we saw. That's when it clicked.</p>
          <h2>Building a Square Wave from Sines</h2>
          <p>We then did the reverse - built a square wave by adding sine waves:</p>
          <pre className="language-text"><code>{`v(t) = sin(ωt) + (1/3)sin(3ωt) + (1/5)sin(5ωt) + ...`}</code></pre>
          <p>With just 5 terms, it looked pretty square. With 50 terms in MATLAB, nearly perfect.</p>
          <h2>Why This Matters</h2>
          <p>This isn't just academic exercise. Real applications everywhere:</p>
          <h3>Audio Compression (MP3)</h3>
          <ul>
            <li>Transform audio to frequency domain</li>
            <li>Remove frequencies humans can't hear</li>
            <li>Store only what matters</li>
            <li>Transform back for playback</li>
          </ul>
          <p>That's why MP3s are smaller than WAV files!</p>
          <h3>Image Compression (JPEG)</h3>
          <ul>
            <li>2D Fourier transform on image blocks</li>
            <li>Keep low frequencies (general shapes)</li>
            <li>Discard high frequencies (fine details)</li>
            <li>That's why JPEGs get blocky when over-compressed</li>
          </ul>
          <h3>Radio Communications</h3>
          <ul>
            <li>AM radio: Shifting signals in frequency domain</li>
            <li>Each station occupies specific frequency band</li>
            <li>Your radio filters out all but desired frequency</li>
            <li>Fourier analysis shows why this works</li>
          </ul>
          <h2>The Lab Exercise</h2>
          <p>Built a simple audio equalizer: 1. Input music signal 2. FFT to get frequency components 3. Adjust amplitudes (boost bass, cut treble, etc.) 4. Inverse FFT back to time domain 5. Output modified music</p>
          <p>It worked! I could literally see and modify the frequency content of music.</p>
          <h2>The Mathematical Beauty</h2>
          <p>The Fourier Transform pair:</p>
          <p>Time domain ↔ Frequency domain</p>
          <p>What's complicated in one domain might be simple in the other:</p>
          <ul>
            <li>Convolution in time = Multiplication in frequency</li>
            <li>Differentiation in time = Multiplication by jω in frequency</li>
          </ul>
          <h2>Practical Examples I Now Understand</h2>
          <h3>Why Guitar Amps Sound Different</h3>
          <ul>
            <li>Tube amps add even harmonics (warm sound)</li>
            <li>Transistor amps add odd harmonics (harsh sound)</li>
            <li>It's all about frequency content!</li>
          </ul>
          <h3>Why Old Phone Calls Sound Bad</h3>
          <ul>
            <li>Limited to 300-3400 Hz</li>
            <li>Missing low frequencies (no bass)</li>
            <li>Missing high frequencies (no clarity)</li>
            <li>Fourier shows exactly what's missing</li>
          </ul>
          <h3>Why Oscilloscope Bandwidth Matters</h3>
          <ul>
            <li>20MHz scope can't show harmonics above 20MHz</li>
            <li>Square wave looks rounded</li>
            <li>Missing high-frequency components</li>
            <li>Need bandwidth ≥ 10× signal frequency</li>
          </ul>
          <h2>The \"Aha!\" Moments</h2>
          <p>1. <strong>Everything is frequencies</strong>: Even "DC" signals have frequency content (at 0 Hz)</p>
          <p>2. <strong>Filters make sense now</strong>: Low-pass filters remove high frequencies - that's why edges get rounded</p>
          <p>3. <strong>Sampling theorem is obvious</strong>: Need to sample at >2× highest frequency to capture all information</p>
          <h2>My New Perspective</h2>
          <p>Walking around campus, I now think:</p>
          <ul>
            <li>That bird chirp? Fundamental around 3kHz with harmonics</li>
            <li>Fluorescent light buzz? 60Hz plus harmonics</li>
            <li>WiFi signal? 2.4GHz carrier with modulation sidebands</li>
          </ul>
          <h2>Simple Experiment You Can Try</h2>
          <p>1. Download a spectrum analyzer app 2. Whistle a pure tone (close to sine wave) 3. Then hum (lots of harmonics) 4. See the difference in frequency content</p>
          <p>Or: 1. Play a note on a guitar 2. Look at the spectrum 3. Each peak is a harmonic 4. Different guitars have different harmonic patterns</p>
          <h2>What\'s Next</h2>
          <p>Now I want to understand:</p>
          <ul>
            <li>Laplace transforms (Fourier's big brother)</li>
            <li>Z-transforms (for digital signals)</li>
            <li>Wavelet transforms (time AND frequency info)</li>
          </ul>
          <h2>The Big Picture</h2>
          <p>Fourier analysis is like having X-ray vision for signals. You see the hidden structure, the building blocks, the essence of what makes a signal unique.</p>
          <p>To my fellow students struggling with this: Don't just memorize the formulas. Play with spectrum analyzers, build filters, see the frequency domain in action. When it clicks, it's beautiful.</p>
          <p>Jean-Baptiste Joseph Fourier figured this out in 1807 while studying heat transfer. 200+ years later, it's still blowing students' minds.</p>
          <p>Mine included.</p>
        </div>
      </article>
    </>
  );
}