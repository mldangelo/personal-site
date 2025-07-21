import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-10-20"
      title="The Great California Earthquake: First Major Quake Experience"
      summary="Experienced my first real California earthquake - 5.3 magnitude. Lab equipment everywhere. East Coast boy learns why everything is bolted down here."
      content={`Was debugging energy harvester at 2:47 PM when the building started swaying. My first thought: "Did I cause a resonance?" Then the shaking intensified. My first real California earthquake - 5.3 magnitude. Welcome to the Ring of Fire.

## The Moment

### 2:47:13 PM
Slight vibration. Thought it was construction.

### 2:47:15 PM
Desk moving. Coffee sloshing.
"Is this...?"

### 2:47:17 PM
Everything shaking. Oscilloscopes walking off benches.
"EARTHQUAKE!"

### 2:47:25 PM
Still shaking. Longer than expected.
Under desk now.

### 2:47:35 PM
Shaking stops. Silence. Then everyone talking at once.

## Immediate Aftermath

### Lab Status
Survey of damage:
- Oscilloscope on floor (survived!)
- Components everywhere
- Chemical bottles fine (secured)
- Server racks still standing
- Coffee tragically spilled

### Human Status
Everyone okay but:
- International students terrified
- California natives calm
- Me: Adrenaline overdose
- One student still coding

"Did the earth move for you too?" - Professor, attempting humor

## The California Response

Watching natives vs newcomers:

**California Natives:**
- "That was a good one"
- "Maybe 5.0?"
- "Felt like roller"
- Back to work in 5 minutes

**Rest of Us:**
- "ARE WE GOING TO DIE?"
- "Was that the big one?"
- "Should we evacuate?"
- "I'm calling my mom"

## Learning Earthquake Protocol

What I did wrong:
1. Didn't drop immediately
2. Tried to save equipment
3. Ran for doorway (outdated)
4. Forgot aftermath procedures

Correct procedure:
1. Drop, Cover, Hold On
2. Stay under desk
3. Wait for shaking to stop
4. Check for injuries
5. Evacuate if damaged

## The Science

Quickly researched:
- Magnitude: 5.3
- Depth: 7.1 km
- Location: San Jose (20 miles away)
- Type: Strike-slip fault
- Aftershocks expected

Stanford seismometer data fascinating!

## Aftershock Adventures

### 4:15 PM - First Aftershock (3.2)
Jumped under desk.
Californians didn't even pause conversation.

### 6:30 PM - Another (2.8)
Starting to recognize P-waves vs S-waves.

### 11:45 PM - In Bed (3.5)
Apartment on third floor = more movement.
Sleep impossible.

## Earthquake Proofing

Next day's activities:

### Lab Securing
- Strapped down all equipment
- Secured chemical storage
- Anchored tall shelves
- Museum putty everywhere
- Backup data offsite

### Apartment Prep
- Water storage (1 gal/person/day)
- Emergency food
- First aid kit
- Flashlights and batteries
- Shoes by bed

Roommate: "Now you're Californian!"

## Cultural Observations

### Earthquake Stories
Everyone has them:
- "In '89 Loma Prieta..."
- "The Northridge quake..."
- "I was in Japan when..."

Bonding through seismic experience.

### Prediction Discussions
Ongoing debates:
- "We're overdue for big one"
- "Small quakes relieve pressure"
- "Animal behavior indicators"
- "My app predicted this"

Science vs folklore.

## Tech Response

Silicon Valley solutions:
- Earthquake apps downloaded
- Raspberry Pi seismometer projects
- "Uber for earthquake supplies"
- Kickstarter for quake-proof desk

Everything's a startup opportunity.

## The Paranoia Phase

Following week:
- Every truck is earthquake
- Constantly checking USGS
- Earthquake kit expanding
- Exit routes memorized
- Questioning life choices

"Why did I leave stable ground?"

## Research Impact

Unexpected benefits:
- Vibration data for harvesting!
- Natural frequency measurements
- Structural response data
- New research ideas

"When life gives you earthquakes, harvest energy?"

## Family Reactions

Called home:
"There was an earthquake!"
"Are you hurt?"
"No, I'm fine."
"Come home immediately."
"Mom, it's California..."
"Exactly!"

Explaining plate tectonics to worried parents.

## Preparation Improvements

Serious preparations made:
- Emergency contacts list
- Out-of-state contact person
- Meeting locations planned
- Go-bag packed
- Cloud backup everything

## The New Normal

Adaptation stages:
1. **Week 1**: Jump at everything
2. **Week 2**: Check USGS constantly  
3. **Month 1**: Casual about small ones
4. **Month 2**: "Was that a truck or quake?"
5. **Month 3**: "Wake me if it's over 6.0"

## Earthquake Engineering Appreciation

New respect for:
- Base isolation systems
- Tuned mass dampers
- Seismic retrofitting
- Building codes
- Civil engineers

Everything designed to sway, not break.

## The Philosophical Impact

Earthquakes teach:
- Impermanence
- Preparedness value
- Community importance
- Nature's power
- Engineering's role

Ground isn't solid. Mind blown.

## One Month Later

Life changes:
- Always aware of exits
- Equipment secured properly
- Emergency supplies maintained
- USGS bookmarked
- California resident confirmed

## Advice for East Coasters

If you move here:
1. **Take it seriously** - But don't panic
2. **Prepare properly** - Kit and plan
3. **Learn the science** - Understanding helps
4. **Trust the buildings** - Engineering works
5. **Keep perspective** - Driving more dangerous

## Final Thoughts

First earthquake survived. California initiation complete.

The earth moved. I survived. Equipment (mostly) survived.

Now I understand why Californians are so chill. When the ground itself is temporary, you learn to adapt.

Still prefer this to Buffalo blizzards.

But maybe I'll bolt down my coffee mug...

🌍🔨📊`}
      tags={["earthquake","california","safety","experience"]}
      readTime="12 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "The Great California Earthquake: First Major Quake Experience - Michael D'Angelo",
    description: "Experienced my first real California earthquake - 5.3 magnitude. Lab equipment everywhere. East Coast boy learns why everything is bolted down here.",
  };
}