import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PIC vs AVR vs Arduino: A Beginner's Comparison - Michael D'Angelo",
  description: "Diving into the microcontroller wars - comparing popular platforms from a student perspective.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-11-12-pic-vs-avr-vs-arduino-a-beginner-s-comparison">
        <header>
          <h1 className="text-4xl font-bold mb-4">PIC vs AVR vs Arduino: A Beginner\'s Comparison</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-11-12').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 12 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['microcontrollers', 'comparison', 'embedded', 'programming'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>The eternal debate in our IEEE lab: Which microcontroller platform is best for beginners? After spending time with all three major players, here's my take on PIC vs AVR vs Arduino from a student's perspective.</p>
          <h2>My Testing Setup</h2>
          <p>To be fair, I built the same project on all three:</p>
          <ul>
            <li>Temperature logger with LCD display</li>
            <li>Reads sensor every minute</li>
            <li>Stores data to memory</li>
            <li>Displays on 16×2 LCD</li>
          </ul>
          <p>Simple enough to be doable, complex enough to show differences.</p>
          <h2>Arduino: The Gentle Introduction</h2>
          <h3>What I Used</h3>
          <ul>
            <li>Arduino Duemilanove (ATmega328)</li>
            <li>$30 from SparkFun</li>
          </ul>
          <h3>The Good</h3>
          <ul>
            <li><strong>Plug and play</strong>: USB cable, no programmer needed</li>
            <li><strong>Amazing libraries</strong>: LCD, temperature sensor, everything had a library</li>
            <li><strong>Community</strong>: Every problem I had was already solved online</li>
            <li><strong>IDE</strong>: Simple, works on Windows/Mac/Linux</li>
          </ul>
          <h3>The Code</h3>
          <pre className="language-cpp"><code>{`#include <LiquidCrystal.h>
#include <OneWire.h>

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
OneWire ds(10);

void setup() {
  lcd.begin(16, 2);
  lcd.print("Temp Logger");
}

void loop() {
  float temp = readTemperature();
  lcd.setCursor(0, 1);
  lcd.print(temp);
  delay(60000);
}`}</code></pre>
          <p>Total time to working project: 2 hours</p>
          <h3>The Bad</h3>
          <ul>
            <li><strong>Abstraction overload</strong>: Don't really learn how microcontrollers work</li>
            <li><strong>Resource hungry</strong>: Bootloader uses space, libraries aren't optimized</li>
            <li><strong>Cost</strong>: $30 for a $3 microcontroller on a board</li>
          </ul>
          <h2>PIC: The Industry Standard</h2>
          <h3>What I Used</h3>
          <ul>
            <li>PIC16F877A</li>
            <li>PICkit 2 programmer</li>
            <li>Total cost: ~$15</li>
          </ul>
          <h3>The Good</h3>
          <ul>
            <li><strong>Industry relevant</strong>: Many companies use PIC</li>
            <li><strong>Free tools</strong>: MPLAB IDE is actually decent</li>
            <li><strong>Variety</strong>: Huge range from 8-pin to 100+ pin</li>
            <li><strong>Peripherals</strong>: Built-in everything (ADC, PWM, UART, etc.)</li>
          </ul>
          <h3>The Code (Assembly)</h3>
          <pre className="language-asm"><code>{`    LIST P=16F877A
    #INCLUDE <P16F877A.INC>

    ORG 0x00
    GOTO MAIN

MAIN:
    BSF STATUS, RP0    ; Bank 1
    MOVLW B'00000110'  ; Configure ADC
    MOVWF ADCON1
    BCF STATUS, RP0    ; Bank 0
    
    ; LCD init (20+ lines of code...)
    ; ADC read (15+ lines of code...)
    ; Display (30+ lines of code...)`}</code></pre>
          <p>Total time to working project: 2 days</p>
          <h3>The Bad</h3>
          <ul>
            <li><strong>Learning curve</strong>: Assembly or poorly documented C</li>
            <li><strong>Configuration bits</strong>: Endless frustration with fuses</li>
            <li><strong>Programmer required</strong>: Extra $25-50 investment</li>
          </ul>
          <h2>AVR: The Sweet Middle Ground</h2>
          <h3>What I Used</h3>
          <ul>
            <li>ATmega16</li>
            <li>USBasp programmer</li>
            <li>Total cost: ~$10</li>
          </ul>
          <h3>The Good</h3>
          <ul>
            <li><strong>Clean architecture</strong>: RISC design is elegant</li>
            <li><strong>GCC support</strong>: Proper C compiler, not weird dialects</li>
            <li><strong>Good documentation</strong>: Datasheets actually make sense</li>
            <li><strong>Fast</strong>: Generally faster than PIC at same clock speed</li>
          </ul>
          <h3>The Code (C with avr-gcc)</h3>
          <pre className="language-c"><code>{`#include <avr/io.h>
#include <util/delay.h>
#include "lcd.h"

int main(void) {
    lcd_init();
    adc_init();
    
    while(1) {
        uint16_t temp = adc_read(0);
        lcd_clear();
        lcd_puts("Temp: ");
        lcd_putint(temp);
        _delay_ms(60000);
    }
}`}</code></pre>
          <p>Total time to working project: 8 hours</p>
          <h3>The Bad</h3>
          <ul>
            <li><strong>Less common in industry</strong>: PIC still dominates</li>
            <li><strong>Programmer needed</strong>: Though many DIY options</li>
            <li><strong>Fewer variants</strong>: Less choice than PIC</li>
          </ul>
          <h2>The Deeper Comparison</h2>
          <h3>Development Environment</h3>
          <ul>
            <li><strong>Arduino</strong>: Arduino IDE - simple but limited</li>
            <li><strong>PIC</strong>: MPLAB - powerful but complex</li>
            <li><strong>AVR</strong>: Various options - I used Eclipse + AVR plugin</li>
          </ul>
          <h3>Learning Curve</h3>
          <p>1. <strong>Arduino</strong>: 1 hour to blink LED 2. <strong>AVR</strong>: 1 day to blink LED 3. <strong>PIC</strong>: 2 days to blink LED (those config bits!)</p>
          <h3>Understanding Gained</h3>
          <ul>
            <li><strong>Arduino</strong>: Low - too much hidden</li>
            <li><strong>PIC</strong>: High - forced to understand everything</li>
            <li><strong>AVR</strong>: Medium - good balance</li>
          </ul>
          <h3>Community Support</h3>
          <ul>
            <li><strong>Arduino</strong>: Massive - every question answered</li>
            <li><strong>AVR</strong>: Good - AVR Freaks forum is helpful</li>
            <li><strong>PIC</strong>: Good - Microchip forums active</li>
          </ul>
          <h3>Cost for 10 Projects</h3>
          <ul>
            <li><strong>Arduino</strong>: $300 (10 boards)</li>
            <li><strong>PIC</strong>: $50 (chips + programmer)</li>
            <li><strong>AVR</strong>: $40 (chips + programmer)</li>
          </ul>
          <h2>Real-World Performance</h2>
          <p>Ran benchmark: Calculate 1000 prime numbers</p>
          <ul>
            <li><strong>Arduino (16MHz)</strong>: 245ms (includes library overhead)</li>
            <li><strong>AVR (16MHz)</strong>: 89ms (optimized C)</li>
            <li><strong>PIC (20MHz)</strong>: 134ms (assembly)</li>
          </ul>
          <p>AVR wins on efficiency!</p>
          <h2>My Recommendations</h2>
          <h3>For Absolute Beginners</h3>
          <p><strong>Arduino</strong>, no question. You'll build confidence and see results fast. Move to raw AVR later.</p>
          <h3>For Resume Building</h3>
          <p><strong>PIC</strong>. More companies use it, especially in automotive and industrial.</p>
          <h3>For Learning Fundamentals</h3>
          <p><strong>AVR or PIC in assembly</strong>. You'll understand what's really happening.</p>
          <h3>For Rapid Prototyping</h3>
          <p><strong>Arduino</strong>. Those libraries save massive time.</p>
          <h3>For Production Products</h3>
          <p><strong>PIC or AVR</strong>. Lower cost, more control.</p>
          <h2>The Plot Twist</h2>
          <p>Guess what? Arduino IS an AVR with training wheels! You can: 1. Start with Arduino 2. Graduate to using AVR-GCC with Arduino hardware 3. Finally move to bare AVR chips</p>
          <p>Best of both worlds!</p>
          <h2>What I\'m Using Now</h2>
          <ul>
            <li><strong>Quick projects</strong>: Arduino</li>
            <li><strong>Learning</strong>: Raw AVR with avr-gcc</li>
            <li><strong>Class requirements</strong>: Whatever professor wants</li>
          </ul>
          <h2>Future Thoughts</h2>
          <p>ARM Cortex-M series is coming fast. More power, similar price. STM32 Discovery boards look amazing. The landscape is changing!</p>
          <h2>Bottom Line</h2>
          <p>There's no "best" platform. There's only "best for your current needs."</p>
          <p>My advice: 1. Start with Arduino to build confidence 2. Learn AVR or PIC to understand fundamentals 3. Use whatever makes sense for each project</p>
          <p>The religious wars in the forums are silly. They're all just tools. Learn them all, use what works.</p>
          <p>Now if you'll excuse me, I have a temperature logger to optimize. This Arduino version is using 2KB for what should be 200 bytes...</p>
        </div>
      </article>
    </>
  );
}