import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Understanding Microcontroller Interrupts: From Polling to Elegance - Michael D'Angelo",
  description: "Finally grasping interrupts after struggling with timing-critical code. Here's how interrupts changed everything about my embedded programming.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-02-20-understanding-microcontroller-interrupts-from-polling-to-elegance">
        <header>
          <h1 className="text-4xl font-bold mb-4">Understanding Microcontroller Interrupts: From Polling to Elegance</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-02-20').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 13 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['microcontroller', 'interrupts', 'embedded', 'programming'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Spent all week trying to read a rotary encoder while also updating an LCD and checking buttons. Code was a mess of timing issues. Then I discovered interrupts. Game changer.</p>
          <h2>The Problem with Polling</h2>
          <p>My original approach (spoiler: it's bad):</p>
          <pre className="language-c"><code>{`void loop() {
    // Check button
    if (digitalRead(BUTTON_PIN) == LOW) {
        handleButton();
    }
    
    // Check encoder
    if (encoderChanged()) {
        updateEncoder();
    }
    
    // Update display
    if (millis() - lastUpdate > 100) {
        updateLCD();
        lastUpdate = millis();
    }
    
    // Do actual work
    processData();
}`}</code></pre>
          <p>Problems:</p>
          <ul>
            <li>Missed button presses during LCD update</li>
            <li>Encoder steps lost during processing</li>
            <li>Timing dependent on execution speed</li>
            <li>Code becomes spaghetti fast</li>
          </ul>
          <h2>Enter Interrupts</h2>
          <p>Interrupts literally interrupt normal code when events happen. Like someone tapping your shoulder - you handle it immediately, then resume what you were doing.</p>
          <p>My revelation: Let hardware handle timing!</p>
          <h2>Types of Interrupts</h2>
          <h3>External Interrupts</h3>
          <p>Triggered by pins changing state.</p>
          <p>ATmega328 has two: INT0 (pin 2), INT1 (pin 3)</p>
          <p>Modes:</p>
          <ul>
            <li>LOW: Trigger while pin is low</li>
            <li>CHANGE: Any state change</li>
            <li>RISING: Low to high transition</li>
            <li>FALLING: High to low transition</li>
          </ul>
          <p>Perfect for buttons and encoders!</p>
          <h3>Timer Interrupts</h3>
          <p>Triggered by hardware timers.</p>
          <p>Use cases:</p>
          <ul>
            <li>Precise timing</li>
            <li>PWM generation</li>
            <li>Regular sampling</li>
            <li>Timeout detection</li>
          </ul>
          <p>No more millis() checking!</p>
          <h3>Other Interrupts</h3>
          <ul>
            <li>UART: Data received/sent</li>
            <li>ADC: Conversion complete</li>
            <li>SPI/I2C: Transfer complete</li>
            <li>Watchdog: System hang detection</li>
          </ul>
          <p>Each peripheral can interrupt when ready.</p>
          <h2>My First Interrupt: Button Debouncing</h2>
          <p>Problem: Mechanical buttons "bounce" - multiple transitions per press.</p>
          <p>Polling solution: Complicated state machine Interrupt solution: Elegant!</p>
          <pre className="language-c"><code>{`volatile bool buttonPressed = false;
volatile unsigned long lastInterrupt = 0;

void setup() {
    pinMode(2, INPUT_PULLUP);
    attachInterrupt(0, buttonISR, FALLING);
}

void buttonISR() {
    unsigned long now = millis();
    if (now - lastInterrupt > 200) {  // Debounce
        buttonPressed = true;
        lastInterrupt = now;
    }
}

void loop() {
    if (buttonPressed) {
        handleButton();
        buttonPressed = false;
    }
    // Rest of code runs uninterrupted
}`}</code></pre>
          <p>Button works perfectly regardless of what loop() is doing!</p>
          <h2>Rotary Encoder: The Interrupt Killer App</h2>
          <p>Rotary encoders need fast response to catch all transitions. Perfect for interrupts.</p>
          <pre className="language-c"><code>{`volatile int encoderPos = 0;
volatile byte lastEncoded = 0;

void setup() {
    pinMode(2, INPUT_PULLUP);  // A
    pinMode(3, INPUT_PULLUP);  // B
    
    attachInterrupt(0, updateEncoder, CHANGE);
    attachInterrupt(1, updateEncoder, CHANGE);
}

void updateEncoder() {
    byte MSB = digitalRead(2);
    byte LSB = digitalRead(3);
    byte encoded = (MSB << 1) | LSB;
    byte sum = (lastEncoded << 2) | encoded;
    
    if(sum == 0b1101 || sum == 0b0100 || 
       sum == 0b0010 || sum == 0b1011) encoderPos++;
    if(sum == 0b1110 || sum == 0b0111 || 
       sum == 0b0001 || sum == 0b1000) encoderPos--;
    
    lastEncoded = encoded;
}`}</code></pre>
          <p>Never miss a step, no matter how fast you spin!</p>
          <h2>Timer Interrupts: Precise Timing</h2>
          <p>Needed to sample audio at exactly 8kHz. millis() wasn't cutting it.</p>
          <p>Timer1 to the rescue:</p>
          <pre className="language-c"><code>{`void setup() {
    cli();  // Disable interrupts
    
    // Set Timer1 for 8kHz
    TCCR1A = 0;
    TCCR1B = 0;
    TCNT1 = 0;
    
    OCR1A = 1999;  // 16MHz/8/1000 - 1
    TCCR1B |= (1 << WGM12);  // CTC mode
    TCCR1B |= (1 << CS11);   // 8 prescaler
    TIMSK1 |= (1 << OCIE1A); // Enable interrupt
    
    sei();  // Enable interrupts
}

ISR(TIMER1_COMPA_vect) {
    // Called exactly 8000 times per second
    int sample = analogRead(A0);
    processSample(sample);
}`}</code></pre>
          <p>Sampling is now rock-solid, regardless of main code!</p>
          <h2>The Rules of Interrupts</h2>
          <h3>Rule 1: Keep ISRs Short</h3>
          <p>Interrupts block other interrupts. Long ISR = missed events.</p>
          <p>Bad:</p>
          <pre className="language-c"><code>{`void buttonISR() {
    lcd.clear();
    lcd.print("Button pressed!");  // Too slow!
    delay(1000);  // NEVER!
}`}</code></pre>
          <p>Good:</p>
          <pre className="language-c"><code>{`volatile bool buttonFlag = true;  // Set flag, handle later`}</code></pre>
          <h3>Rule 2: Volatile Variables</h3>
          <p>Variables modified in ISR must be volatile. Tells compiler they can change anytime.</p>
          <pre className="language-c"><code>{`volatile int count = 0;  // Correct
int count = 0;          // Optimizer might break this`}</code></pre>
          <h3>Rule 3: Atomic Access</h3>
          <p>Multi-byte variables need protection:</p>
          <pre className="language-c"><code>{`// Reading 16-bit value safely
cli();  // Disable interrupts
int temp = largeCounter;
sei();  // Re-enable`}</code></pre>
          <h3>Rule 4: No delay(), Serial, or malloc()</h3>
          <p>These functions use interrupts internally. Calling from ISR = deadlock.</p>
          <h2>Priority and Nested Interrupts</h2>
          <p>ATmega328 interrupts have fixed priority (vector table order).</p>
          <p>If multiple trigger simultaneously: 1. Reset (highest) 2. External Interrupt 0 3. External Interrupt 1 4. Timer interrupts ... etc</p>
          <p>Can enable nested interrupts with sei() in ISR, but dangerous!</p>
          <h2>Real Project: Frequency Counter</h2>
          <p>Built frequency counter using interrupts:</p>
          <pre className="language-c"><code>{`volatile unsigned long pulseCount = 0;
unsigned long lastTime = 0;

void setup() {
    // Input signal to INT0
    attachInterrupt(0, countPulse, RISING);
    
    // Timer2 for 1-second gate time
    setupTimer2();
}

void countPulse() {
    pulseCount++;
}

ISR(TIMER2_OVF_vect) {
    static int overflows = 0;
    if (++overflows >= 61) {  // ~1 second
        unsigned long freq = pulseCount;
        pulseCount = 0;
        overflows = 0;
        displayFrequency(freq);
    }
}`}</code></pre>
          <p>Measures up to 8MHz accurately!</p>
          <h2>Debugging Interrupts (The Hard Part)</h2>
          <p>Interrupts are invisible to normal debugging. My techniques:</p>
          <h3>LED Debugging</h3>
          <p>Toggle LED in ISR:</p>
          <pre className="language-c"><code>{`ISR() {
    PORTB ^= (1 << 5);  // Toggle pin 13
    // Rest of ISR
}`}</code></pre>
          <h3>Logic Analyzer</h3>
          <p>Best investment ever. See exactly when interrupts fire.</p>
          <h3>Scope Tricks</h3>
          <p>Output pulse at ISR start/end:</p>
          <pre className="language-c"><code>{`ISR() {
    PORTD |= (1 << 4);   // Set high
    // ISR code
    PORTD &= ~(1 << 4);  // Set low
}`}</code></pre>
          <p>Pulse width = ISR execution time!</p>
          <h2>Common Pitfalls I Hit</h2>
          <h3>Forgotten sei()</h3>
          <p>Spent 2 hours debugging. Interrupts were configured but never enabled. Always call sei()!</p>
          <h3>Interrupt Storm</h3>
          <p>Configured INT0 for LOW trigger. Pin was low. ISR fired continuously. System hung.</p>
          <h3>Race Conditions</h3>
          <p>Main code and ISR accessing same variable without protection. Intermittent bugs are the worst.</p>
          <h3>Stack Overflow</h3>
          <p>Too many nested function calls in ISR. Random crashes. Keep ISRs simple!</p>
          <h2>When NOT to Use Interrupts</h2>
          <p>Interrupts aren't always the answer:</p>
          <ul>
            <li>Very frequent events (overhead too high)</li>
            <li>Complex processing needed</li>
            <li>When timing isn't critical</li>
            <li>Learning/debugging (polling is simpler)</li>
          </ul>
          <h2>The Power of Interrupts</h2>
          <p>My encoder+LCD+button project:</p>
          <ul>
            <li>Before interrupts: 200 lines, buggy</li>
            <li>After interrupts: 100 lines, bulletproof</li>
          </ul>
          <p>Current project uses 5 interrupt sources:</p>
          <ul>
            <li>Encoder input</li>
            <li>Button matrix</li>
            <li>Timer for display refresh</li>
            <li>UART for commands</li>
            <li>ADC for monitoring</li>
          </ul>
          <p>All running smoothly together!</p>
          <h2>Resources That Helped</h2>
          <ul>
            <li>Nick Gammon's interrupt tutorial (absolute gold)</li>
            <li>ATmega328 datasheet (chapter 11)</li>
            <li>Arduino attachInterrupt() reference</li>
            <li>avrfreaks forum (saved me many times)</li>
          </ul>
          <h2>Next Level: Sleep Modes</h2>
          <p>Just discovered interrupts can wake processor from sleep:</p>
          <pre className="language-c"><code>{`set_sleep_mode(SLEEP_MODE_PWR_DOWN);
sleep_enable();
sleep_cpu();  // ZZZ until interrupt
// Interrupt wakes us here`}</code></pre>
          <p>Battery life went from days to months!</p>
          <h2>Final Thoughts</h2>
          <p>Interrupts transformed my embedded programming. From fighting timing to elegant event-driven code.</p>
          <p>To fellow students: Yes, the learning curve is steep. But once it clicks, you'll never go back to polling.</p>
          <p>Now if you'll excuse me, I need to add interrupt-driven SPI to my CubeSat communication board...</p>
          <p><em>Update: Just implemented 6-channel PWM using timer interrupts. Servos have never been smoother!</em></p>
        </div>
      </article>
    </>
  );
}