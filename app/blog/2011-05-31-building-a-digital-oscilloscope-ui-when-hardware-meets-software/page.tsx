import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-06-01"
      title="Building a Digital Oscilloscope UI: When Hardware Meets Software"
      summary="Designing the user interface for a DIY digital oscilloscope. Learned that making test equipment intuitive is harder than making it work."
      content={`After building the hardware for a DIY digital scope, I faced a new challenge: creating a UI that doesn't suck. Turns out, making test equipment intuitive is way harder than making it functional. Here's how I built a modern interface for ancient-looking equipment.

## The Hardware Platform

Starting point:
- STM32F429 (with LCD controller!)
- 320x240 TFT display
- Rotary encoders for control
- 100 MSps ADC frontend
- 2 channels

Basically a scope without a soul.

## UI Design Philosophy

Studied classic scopes:
- Tektronix 2465
- HP 54600
- Rigol DS1054Z

Common patterns:
- Dedicated knobs per function
- Minimal menu diving
- Visual feedback immediate
- Muscle memory friendly

## The Implementation

### Core Display Loop
\`\`\`c
void updateDisplay() {
    // Clear waveform area only
    clearWaveformArea();
    
    // Draw grid (cached to avoid flicker)
    drawGrid();
    
    // Draw waveforms
    drawChannel(0, YELLOW);
    drawChannel(1, CYAN);
    
    // Update measurements
    updateMeasurements();
    
    // Draw UI elements
    drawTimebase();
    drawTriggerLevel();
    drawChannelInfo();
}
\`\`\`

### Waveform Rendering
The hard part - making it smooth:
\`\`\`c
void drawChannel(int ch, uint16_t color) {
    int lastY = -1;
    
    for (int x = 0; x < SCREEN_WIDTH; x++) {
        // Map screen X to sample index
        int sampleIdx = x * samplesPerPixel;
        
        // Min/max decimation for aliasing prevention
        int minVal = 255, maxVal = 0;
        for (int i = 0; i < samplesPerPixel; i++) {
            uint8_t val = sampleBuffer[ch][sampleIdx + i];
            if (val < minVal) minVal = val;
            if (val > maxVal) maxVal = val;
        }
        
        // Draw vertical line between min/max
        int yMin = valueToScreen(minVal);
        int yMax = valueToScreen(maxVal);
        drawVLine(x, yMin, yMax, color);
        
        // Connect to previous sample
        if (lastY >= 0) {
            drawLine(x-1, lastY, x, yMin, color);
        }
        lastY = yMax;
    }
}
\`\`\`

### Phosphor Persistence Effect
Making it look analog:
\`\`\`c
// Triple buffer for persistence
uint16_t persistBuffer[3][SCREEN_WIDTH * SCREEN_HEIGHT];
int currentBuffer = 0;

void applyPersistence() {
    for (int i = 0; i < SCREEN_WIDTH * SCREEN_HEIGHT; i++) {
        // Blend three frames with decay
        uint16_t p1 = persistBuffer[0][i];
        uint16_t p2 = persistBuffer[1][i];
        uint16_t p3 = persistBuffer[2][i];
        
        // Extract RGB, apply decay
        uint8_t r = ((p1 >> 11) * 3 + (p2 >> 11) * 2 + (p3 >> 11)) / 6;
        uint8_t g = (((p1 >> 5) & 0x3F) * 3 + ((p2 >> 5) & 0x3F) * 2 + 
                     ((p3 >> 5) & 0x3F)) / 6;
        uint8_t b = ((p1 & 0x1F) * 3 + (p2 & 0x1F) * 2 + (p3 & 0x1F)) / 6;
        
        screenBuffer[i] = (r << 11) | (g << 5) | b;
    }
}
\`\`\`

## Control Interface

### Encoder Acceleration
Making knobs feel right:
\`\`\`c
typedef struct {
    int position;
    int velocity;
    uint32_t lastTime;
    float acceleration;
} EncoderState;

int readEncoderWithAccel(EncoderState *enc) {
    int delta = readEncoderRaw();
    uint32_t now = getTicks();
    uint32_t timeDelta = now - enc->lastTime;
    
    if (delta != 0) {
        // Calculate velocity
        enc->velocity = 1000 * delta / timeDelta;
        
        // Apply acceleration curve
        if (abs(enc->velocity) > 5) {
            delta *= (1 + log10(abs(enc->velocity)));
        }
        
        enc->position += delta;
        enc->lastTime = now;
    }
    
    return enc->position;
}
\`\`\`

### Context-Sensitive Controls
Same knob, different functions:
\`\`\`c
void handleMainEncoder(int delta) {
    switch (currentMode) {
        case MODE_TIMEBASE:
            adjustTimebase(delta);
            break;
        case MODE_TRIGGER:
            adjustTriggerLevel(delta);
            break;
        case MODE_VERTICAL:
            adjustVerticalScale(delta);
            break;
        case MODE_CURSORS:
            moveCursor(delta);
            break;
    }
    
    // Visual feedback
    highlightAdjustedParameter();
}
\`\`\`

## Visual Design

### Grid System
Classic scope look:
\`\`\`c
void drawGrid() {
    // Major divisions
    for (int i = 0; i <= 10; i++) {
        int x = i * 32;
        drawVLine(x, 0, 240, GRID_MAJOR);
    }
    
    for (int i = 0; i <= 8; i++) {
        int y = i * 30;
        drawHLine(0, y, 320, GRID_MAJOR);
    }
    
    // Minor divisions (dots)
    for (int x = 16; x < 320; x += 32) {
        for (int y = 15; y < 240; y += 30) {
            drawPixel(x, y, GRID_MINOR);
        }
    }
}
\`\`\`

### Measurement Display
Auto measurements that don't clutter:
\`\`\`c
void drawMeasurements() {
    // Semi-transparent background
    fillRectAlpha(0, 200, 100, 40, BLACK, 128);
    
    // Measurements in columns
    drawText(5, 205, "Vpp:", WHITE);
    drawText(35, 205, formatVoltage(vpp), YELLOW);
    
    drawText(5, 220, "Freq:", WHITE);
    drawText(35, 220, formatFrequency(freq), YELLOW);
}
\`\`\`

## Performance Optimization

### DMA-Driven Display
Can't waste CPU on graphics:
\`\`\`c
void initDMA2D() {
    // Configure DMA2D for fast fills
    DMA2D->CR = DMA2D_M2M;
    DMA2D->OPFCCR = DMA2D_RGB565;
    
    // Offload rectangle fills
    DMA2D->OOR = screenWidth - rectWidth;
    DMA2D->NLR = (rectWidth << 16) | rectHeight;
}

void fillRectDMA(int x, int y, int w, int h, uint16_t color) {
    // Set up source (solid color)
    DMA2D->OCOLR = color;
    
    // Set destination
    DMA2D->OMAR = (uint32_t)(frameBuffer + y * screenWidth + x);
    
    // Start transfer
    DMA2D->CR |= DMA2D_CR_START;
    
    // CPU free to do other things!
}
\`\`\`

### Dirty Region Tracking
Only update what changed:
\`\`\`c
typedef struct {
    int x, y, w, h;
    bool dirty;
} Region;

Region regions[16];

void markDirty(int x, int y, int w, int h) {
    // Find overlapping regions and merge
    // This saves massive CPU time
}

void updateDirtyRegions() {
    for (int i = 0; i < 16; i++) {
        if (regions[i].dirty) {
            updateRegion(&regions[i]);
            regions[i].dirty = false;
        }
    }
}
\`\`\`

## User Testing

Had other students try it:

### Feedback Round 1
- "Why does this knob do three things?"
- "Where's the autoset button?"
- "Menu system confusing"
- "Needs more color coding"

### Improvements Made
- Dedicated trigger level knob
- Big AUTOSET button
- Simplified menus
- Channel colors everywhere

### Feedback Round 2
- "Much better!"
- "Feels like real scope"
- "Still want touchscreen"
- "Add FFT mode"

## Advanced Features

### XY Mode
\`\`\`c
void drawXYMode() {
    for (int i = 0; i < sampleCount; i++) {
        int x = map(ch1Samples[i], 0, 255, 0, 320);
        int y = map(ch2Samples[i], 0, 255, 240, 0);
        
        // Intensity grading based on sample density
        intensityMap[y][x]++;
    }
    
    // Render with variable brightness
    for (int y = 0; y < 240; y++) {
        for (int x = 0; x < 320; x++) {
            if (intensityMap[y][x] > 0) {
                int brightness = min(intensityMap[y][x] * 20, 255);
                drawPixelBrightness(x, y, GREEN, brightness);
            }
        }
    }
}
\`\`\`

### Persistence Modes
Different modes for different uses:
- Off: Clean display
- Low: Some trail
- High: Phosphor look  
- Infinite: See all history

## Lessons Learned

1. **UI is harder than hardware** - Making it intuitive takes iteration
2. **Study the classics** - Good patterns exist for reasons
3. **Performance matters** - Laggy scope is unusable scope
4. **Less is more** - Feature creep kills usability
5. **Test with users** - Engineers aren't normal people

## Open Source Release

Put everything on GitHub:
- STM32 firmware
- UI framework
- Python PC software
- Hardware files

Community improvements:
- Touch screen support
- Color themes
- Protocol decoders
- Bode plot mode

## Future Ideas

- Gesture control
- Voice commands (why?)
- Network streaming
- AI-powered autoset
- Holographic display (dreaming)

## Conclusion

Building scope UI taught me that test equipment interfaces are deceptively complex. Every pixel serves a purpose. Every control has decades of convention behind it.

But when it works - when the waveform flows smoothly across the screen, when the knobs feel just right, when measurements appear instantly - it's magical.

Now I appreciate my Rigol even more. And understand why good scopes cost so much.

📊🎮✨`}
      tags={["oscilloscope","ui-design","embedded","graphics"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Building a Digital Oscilloscope UI: When Hardware Meets Software - Michael D'Angelo",
    description: "Designing the user interface for a DIY digital oscilloscope. Learned that making test equipment intuitive is harder than making it work.",
  };
}