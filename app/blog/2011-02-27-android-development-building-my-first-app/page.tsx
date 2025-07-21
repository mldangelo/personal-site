import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-02-28"
      title="Android Development: Building My First App"
      summary="Finally diving into mobile development. Built an electronics reference app for Android. Java feels verbose after C, but the platform potential is huge."
      content={`After years of embedded C programming, I'm finally learning Android development. Built my first real app - an electronics reference tool with calculators and component databases. The transition from bare metal to Java frameworks is jarring but exciting.

## Why Android?

- Open source platform
- Java (familiar from CS courses)
- Huge user base
- Hardware access APIs
- Eclipse IDE (free)

iOS requires Mac + $99. Android needs just Eclipse.

## The App Concept: EE Pocket Reference

Every EE student needs:
- Resistor color codes
- Ohm's law calculator
- Op-amp configurations
- Filter designers
- Component pinouts
- Formula reference

Perfect learning project!

## Setting Up Development

Getting started in 2011:
\`\`\`bash
# Install Android SDK
wget http://dl.google.com/android/android-sdk_r10-linux_86.tgz
tar -xzf android-sdk_r10-linux_86.tgz

# Install platforms
android update sdk --no-ui

# Eclipse + ADT plugin
# (So many manual steps...)
\`\`\`

Development feels primitive compared to modern tools.

## First Activity - Ohm's Law Calculator

\`\`\`java
public class OhmsLawActivity extends Activity {
    EditText voltageInput, currentInput, resistanceInput;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.ohms_law);
        
        voltageInput = (EditText) findViewById(R.id.voltage);
        currentInput = (EditText) findViewById(R.id.current);
        resistanceInput = (EditText) findViewById(R.id.resistance);
        
        // Add text watchers for real-time calculation
        TextWatcher watcher = new TextWatcher() {
            public void afterTextChanged(Editable s) {
                calculateMissing();
            }
            // Other methods...
        };
    }
    
    private void calculateMissing() {
        try {
            double v = parseOrZero(voltageInput);
            double i = parseOrZero(currentInput);
            double r = parseOrZero(resistanceInput);
            
            // Calculate missing value
            if (v == 0 && i > 0 && r > 0) {
                v = i * r;
                voltageInput.setText(String.format("%.3f", v));
            }
            // Similar for other combinations...
        } catch (Exception e) {
            // Handle errors gracefully
        }
    }
}
\`\`\`

## Resistor Color Code Decoder

Using camera for color detection:
\`\`\`java
public class ColorDecoder implements Camera.PreviewCallback {
    @Override
    public void onPreviewFrame(byte[] data, Camera camera) {
        // Convert YUV to RGB
        int[] rgb = convertYUV420_NV21toRGB8888(data, width, height);
        
        // Sample center region
        int centerColor = sampleCenterAverage(rgb);
        
        // Map to nearest resistor color
        ResistorColor band = findNearestColor(centerColor);
        updateBandDisplay(band);
    }
    
    private ResistorColor findNearestColor(int rgb) {
        // Color matching in HSV space
        float[] hsv = new float[3];
        Color.RGBToHSV(
            Color.red(rgb), 
            Color.green(rgb), 
            Color.blue(rgb), 
            hsv
        );
        
        // Find closest standard color
        ResistorColor closest = null;
        float minDistance = Float.MAX_VALUE;
        
        for (ResistorColor color : ResistorColor.values()) {
            float distance = colorDistance(hsv, color.hsv);
            if (distance < minDistance) {
                minDistance = distance;
                closest = color;
            }
        }
        
        return closest;
    }
}
\`\`\`

## Database of Components

SQLite for component storage:
\`\`\`java
public class ComponentDatabase extends SQLiteOpenHelper {
    private static final String CREATE_TABLE = 
        "CREATE TABLE components (" +
        "id INTEGER PRIMARY KEY," +
        "name TEXT NOT NULL," +
        "category TEXT," +
        "pinout TEXT," +
        "datasheet_url TEXT" +
        ")";
    
    public List<Component> searchComponents(String query) {
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.query(
            "components",
            null,
            "name LIKE ?",
            new String[]{"%" + query + "%"},
            null, null, "name"
        );
        
        List<Component> results = new ArrayList<>();
        while (cursor.moveToNext()) {
            results.add(componentFromCursor(cursor));
        }
        
        return results;
    }
}
\`\`\`

## Filter Design Tool

Interactive Butterworth filter designer:
\`\`\`java
public class FilterDesigner {
    public FilterResponse designLowpass(
        double cutoffFreq, 
        int order, 
        double sampleRate
    ) {
        // Calculate normalized frequency
        double wc = 2 * Math.PI * cutoffFreq / sampleRate;
        
        // Generate poles
        Complex[] poles = new Complex[order];
        for (int k = 0; k < order; k++) {
            double theta = Math.PI * (2*k + 1) / (2*order);
            poles[k] = new Complex(
                -Math.sin(theta), 
                Math.cos(theta)
            ).multiply(wc);
        }
        
        // Convert to transfer function
        return polesToTransferFunction(poles);
    }
}
\`\`\`

## Custom Views for Visualization

Drawing frequency response:
\`\`\`java
public class FrequencyResponseView extends View {
    private FilterResponse response;
    private Paint gridPaint, tracePaint;
    
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        
        // Draw grid
        drawLogGrid(canvas);
        
        // Draw magnitude response
        Path path = new Path();
        for (int x = 0; x < getWidth(); x++) {
            double freq = pixelToFreq(x);
            double mag = response.getMagnitudeDb(freq);
            float y = (float) magToPixel(mag);
            
            if (x == 0) {
                path.moveTo(x, y);
            } else {
                path.lineTo(x, y);
            }
        }
        
        canvas.drawPath(path, tracePaint);
    }
}
\`\`\`

## Dealing with Fragmentation

Supporting Android 2.1 to 2.3:
\`\`\`java
private void setupActionBar() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
        // Use ActionBar
        getActionBar().setDisplayHomeAsUpEnabled(true);
    } else {
        // Custom title bar for older versions
        requestWindowFeature(Window.FEATURE_CUSTOM_TITLE);
        setContentView(R.layout.main);
        getWindow().setFeatureInt(
            Window.FEATURE_CUSTOM_TITLE, 
            R.layout.custom_title
        );
    }
}
\`\`\`

## Publishing to Android Market

The submission process:
1. Generate signed APK
2. Create developer account ($25)
3. Upload APK and assets
4. Write description
5. Set price (free)
6. Publish!

Within hours: First download!

## Initial Reception

First week statistics:
- Downloads: 847
- Active installs: 312
- Ratings: 4.2 stars
- Crashes: 3 (fixed quickly)

Reviews:
- "Perfect for EE students!"
- "Resistor scanner needs work"
- "Add more calculators please"

## Lessons Learned

### Android Quirks
1. **UI thread is sacred** - Never block it
2. **Memory is limited** - Bitmaps kill apps
3. **Lifecycle is complex** - Handle rotation!
4. **Permissions matter** - Users are suspicious
5. **Test on real devices** - Emulator lies

### Java After C
- Garbage collection feels weird
- Objects everywhere
- Verbose but safer
- IDEs are powerful
- Libraries for everything

## Future Features Planned

Based on user feedback:
- 555 timer calculator
- Logic gate reference
- Arduino pinouts
- Circuit simulator (ambitious!)
- Cloud sync

## Monetization Thoughts

Currently free, but considering:
- Pro version ($1.99)
- No ads (I hate ads)
- Extra calculators
- Offline datasheets
- Support development

## The Bigger Picture

Mobile computing is the future:
- Everyone has a smartphone
- Always connected
- Sensors everywhere
- Computing in pocket
- Platform for innovation

## Final Thoughts

Building for Android taught me:
- Users expect polish
- Testing is crucial
- Feedback is gold
- Iterate quickly
- Ship early

From embedded systems to mobile apps - the transition is challenging but rewarding. Same problem-solving, different constraints.

Now excuse me, I have crash reports to fix and features to add. The users have spoken!

📱⚡💡`}
      tags={["android","mobile","java","app-development"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Android Development: Building My First App - Michael D'Angelo",
    description: "Finally diving into mobile development. Built an electronics reference app for Android. Java feels verbose after C, but the platform potential is huge.",
  };
}