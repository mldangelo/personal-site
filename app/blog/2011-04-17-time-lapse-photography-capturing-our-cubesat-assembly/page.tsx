import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-04-18"
      title="Time-Lapse Photography: Capturing Our CubeSat Assembly"
      summary="Documenting 6 months of satellite construction in 3 minutes. Technical challenges of long-term time-lapse and the art of showing progress."
      content={`Our CubeSat is nearly complete, and I've been capturing its assembly with time-lapse photography since January. 50,000 photos later, we have a mesmerizing 3-minute video showing a satellite being born.

## The Setup

### Camera System
- Canon T2i with AC adapter (crucial!)
- Manual focus locked
- Manual exposure (1/60, f/8, ISO 400)
- 18-55mm lens at 24mm
- Mounted to ceiling with heavy-duty clamp

### Intervalometer
Built my own with Arduino:
\`\`\`cpp
const int INTERVAL = 60000;  // 1 minute
const int WORK_START = 8;    // 8 AM
const int WORK_END = 22;     // 10 PM

void loop() {
    DateTime now = rtc.now();
    
    if (now.hour() >= WORK_START && now.hour() < WORK_END) {
        triggerCamera();
        delay(INTERVAL);
    } else {
        // Sleep during off hours
        delay(3600000);  // Check every hour
    }
}
\`\`\`

### Lighting Consistency
Major challenge! Solution:
- Blocked windows (no natural light)
- LED panels on timers
- Color temperature locked at 5600K
- Light meter readings logged

## Technical Challenges

### Storage Management
- 18 MP × 50,000 photos = 900 GB raw files
- Automated transfer to NAS every night
- Redundant backups (learned the hard way)
- JPEG proxy files for preview

### Camera Maintenance
Over 6 months:
- Sensor cleaning: 3 times
- Lens cleaning: Weekly
- Position checks: Daily
- One power outage incident

### Stability
Preventing camera movement:
- Vibration dampening mount
- Marked floor positions
- "DO NOT TOUCH" signs everywhere
- One accidental kick (visible in final video)

## Processing Pipeline

### 1. Import and Organize
Python script for sorting:
\`\`\`python
import os
from datetime import datetime
import shutil

def organize_photos(source_dir, dest_dir):
    for filename in os.listdir(source_dir):
        if filename.endswith('.JPG'):
            # Extract date from EXIF
            date = get_exif_date(os.path.join(source_dir, filename))
            
            # Create date-based directory
            date_dir = os.path.join(dest_dir, date.strftime('%Y-%m-%d'))
            os.makedirs(date_dir, exist_ok=True)
            
            # Move file
            shutil.move(
                os.path.join(source_dir, filename),
                os.path.join(date_dir, filename)
            )
\`\`\`

### 2. Deflicker
Time-lapse flicker is awful. Used custom script:
\`\`\`python
def deflicker(images):
    # Calculate average brightness for each image
    brightnesses = [get_average_brightness(img) for img in images]
    
    # Smooth brightness curve
    smoothed = gaussian_filter1d(brightnesses, sigma=5)
    
    # Adjust each image
    for i, img in enumerate(images):
        adjustment = smoothed[i] / brightnesses[i]
        images[i] = adjust_brightness(img, adjustment)
    
    return images
\`\`\`

### 3. Stabilization
Despite precautions, slight drift occurred:
- Used Adobe After Effects warp stabilizer
- Tracked corner of workbench
- Sub-pixel alignment achieved

### 4. Speed Ramping
Not all moments are equal:
- Slow during interesting assembly
- Fast during lunch breaks
- Super slow for milestone moments
- Music-synchronized tempo changes

## Interesting Captures

### The Human Element
- Evolution of team dynamics
- Fashion changes over 6 months
- Hair growth (surprisingly noticeable)
- Coffee cup accumulation

### Technical Milestones
1. **First PCB arrival** - Team excitement visible
2. **Solar panel attachment** - Delicate process
3. **The dropped screw incident** - 2 hours condensed to 5 seconds
4. **Integration complete** - Actual cheering

### Unexpected Moments
- Spider building web in corner (kept it)
- Janitor photobombing at 2 AM
- Power outage candle-lit assembly
- Pizza delivery time-lapse within time-lapse

## Color Grading

Created consistent look:
- Slight desaturation (technical feel)
- Teal/orange split tone
- Vignetting to focus attention
- Matched shots despite lighting changes

## Audio Design

### Music Selection
Composed custom soundtrack:
- Building intensity matching progress
- 120 BPM for easy sync
- Electronic/orchestral hybrid
- Climax at final assembly

### Sound Effects
Subtle additions:
- Servo whirs during precise moments
- Clicking for fast sequences
- Heartbeat during tense operations
- Silence for dramatic effect

## The Final Product

### Statistics
- Duration: 3 minutes 24 seconds
- Frame rate: 24 fps (4,896 frames used)
- Resolution: 1080p
- File size: 847 MB (ProRes)
- Render time: 14 hours

### Distribution
Posted everywhere:
- YouTube: 75K views in first week
- University website: Featured content
- NASA education: Shared to 50K followers
- Local news: "Students Build Satellite"

## Lessons Learned

### Planning
1. **Start earlier** - Missed first month
2. **Multiple angles** - One camera limiting
3. **Higher interval** - 50K photos excessive
4. **Better signage** - Prevent disturbances
5. **Automated processing** - Manual work killed me

### Technical
1. **RAW necessary** - JPEG limits grading
2. **Backup everything** - Corruption happens
3. **Monitor daily** - Catch issues early
4. **Light consistency** - Most important factor
5. **Audio 50%** - Sound design crucial

## Behind the Scenes

### Storage Array
Built custom NAS:
- 4×4TB drives in RAID 5
- Automated offload script
- Network attached for team access
- Version control for edits

### Preview System
Daily time-lapse generation:
\`\`\`bash
#!/bin/bash
# Generate daily preview
ffmpeg -pattern_type glob -i '*.JPG'     -vf "scale=1920:1080,deflicker"     -c:v h264 -crf 25     daily_preview.mp4

# Upload to team Dropbox
rclone copy daily_preview.mp4 dropbox:CubeSat/TimeLapse/
\`\`\`

## Impact

### Team Morale
- Daily previews motivated team
- Visible progress combated frustration
- Accountability (on camera!)
- Pride in documentation

### Educational Value
- Shows real engineering process
- Failures included (important!)
- Time investment visible
- Inspired other teams

### Personal Growth
- Learned video production
- Patience (so much patience)
- Planning complex projects
- Mixed technical/artistic skills

## Future Plans

For next project:
1. **Motion control** - Motorized slider
2. **Multiple cameras** - Different angles
3. **4K resolution** - Future-proof
4. **Live streaming** - Real-time progress
5. **AI analysis** - Auto-highlight detection

## Tips for Others

Starting a long-term time-lapse?
1. **Test everything** - One week trial run
2. **Automate early** - Manual = burnout
3. **Plan storage** - 3× expected amount
4. **Mark positions** - Tape everywhere
5. **Tell everyone** - Prevent interference
6. **Start now** - Can't go back in time

## Conclusion

This time-lapse became more than documentation - it's the story of our team building something incredible. Every frame represents hours of work, problems solved, and dreams taking shape.

When we launch this satellite, we'll have more than memories. We'll have proof of every step, every setback, and every success.

Time-lapse photography: turning months of grinding into minutes of magic. ✨📸🛰️`}
      tags={["photography","cubesat","time-lapse","documentation"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Time-Lapse Photography: Capturing Our CubeSat Assembly - Michael D'Angelo",
    description: "Documenting 6 months of satellite construction in 3 minutes. Technical challenges of long-term time-lapse and the art of showing progress.",
  };
}