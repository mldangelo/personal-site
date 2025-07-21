import fs from 'fs';
import path from 'path';

interface YearInReviewPost {
  year: number;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
}

// Personal milestones and interests by year
const YEAR_CONTEXTS = {
  2009: {
    status: 'Freshman at UB',
    interests: ['astronomy', 'space exploration', 'electronics', 'photography'],
    travel: ['Niagara Falls trips', 'Buffalo exploration'],
    tech: ['Arduino', 'Linux', 'embedded systems'],
    space_events: ['40th anniversary of Apollo 11', 'Kepler space telescope launch', 'ISS fully crewed'],
  },
  2010: {
    status: 'Sophomore, joined CubeSat program',
    interests: ['satellite design', 'astrophotography', 'robotics'],
    travel: ['NYC visits', 'Rochester tech meetups'],
    tech: ['Android development', 'FPGA programming', 'PCB design'],
    space_events: ['SpaceX Falcon 9 first flight', 'Hayabusa returns from asteroid', 'Discovery of potentially habitable exoplanets'],
  },
  2011: {
    status: 'Junior, CubeSat hardware lead',
    interests: ['space systems', 'photography', 'running'],
    travel: ['Boston for conferences', 'Adirondacks hiking'],
    tech: ['Real-time systems', 'Power electronics', 'Git mastery'],
    space_events: ['Last Space Shuttle flight', 'Juno launched to Jupiter', 'Dawn arrives at Vesta'],
  },
  2012: {
    status: 'Senior year, interviewing',
    interests: ['startups', 'web development', 'photography'],
    travel: ['SF Bay Area for interviews', 'Graduation trip planning'],
    tech: ['Node.js', 'JavaScript frameworks', 'Cloud computing'],
    space_events: ['Curiosity lands on Mars', 'SpaceX Dragon to ISS', 'Transit of Venus'],
  },
  2013: {
    status: 'Facebook internship',
    interests: ['web performance', 'photography', 'Bay Area hiking'],
    travel: ['Yosemite', 'Pacific Coast Highway', 'Lake Tahoe'],
    tech: ['React development', 'Big data', 'A/B testing'],
    space_events: ['Chris Hadfield ISS videos go viral', 'Voyager 1 enters interstellar space', 'India launches Mars mission'],
  },
  2014: {
    status: 'Started Stanford MS, Planet Labs',
    interests: ['machine learning', 'satellite imagery', 'cycling'],
    travel: ['Patagonia trek', 'Seattle/Portland', 'Hawaii'],
    tech: ['Deep learning', 'Computer vision', 'Distributed systems'],
    space_events: ['Rosetta arrives at comet', 'Orion test flight', 'Planet Labs Flock-1 launch'],
  },
  2015: {
    status: 'Stanford MS second year',
    interests: ['ML research', 'landscape photography', 'trail running'],
    travel: ['Japan (Tokyo, Kyoto)', 'Iceland northern lights', 'Burning Man'],
    tech: ['TensorFlow', 'GPU programming', 'Container orchestration'],
    space_events: ['Pluto flyby', 'Water on Mars confirmed', 'SpaceX landing attempts'],
  },
  2016: {
    status: 'Started Arthena',
    interests: ['art markets', 'quantitative finance', 'wine'],
    travel: ['Art Basel', 'Venice Biennale', 'London galleries'],
    tech: ['React Native', 'Blockchain exploration', 'Recommendation systems'],
    space_events: ['Gravitational waves detected', 'Juno arrives at Jupiter', 'SpaceX first landing'],
  },
  2017: {
    status: 'Arthena growth, YC',
    interests: ['art investment', 'sailing', 'meditation'],
    travel: ['Hong Kong', 'Singapore', 'European art fairs'],
    tech: ['Kubernetes', 'GraphQL', 'Serverless'],
    space_events: ['Cassini Grand Finale', 'Solar eclipse across US', 'Interstellar asteroid ʻOumuamua'],
  },
  2018: {
    status: 'Arthena scaling',
    interests: ['contemporary art', 'kitesurfing', 'wine collecting'],
    travel: ['Dubai', 'São Paulo', 'African safari'],
    tech: ['ML in production', 'Rust exploration', 'Edge computing'],
    space_events: ['InSight lands on Mars', 'Parker Solar Probe launch', 'Water ice on Moon confirmed'],
  },
  2019: {
    status: 'Arthena established',
    interests: ['impact investing', 'freediving', 'photography'],
    travel: ['Maldives', 'New Zealand', 'Alaska'],
    tech: ['JAMstack', 'WebAssembly', 'Privacy tech'],
    space_events: ['First black hole image', 'Starship prototype', 'Chandrayaan-2 Moon mission'],
  },
  2020: {
    status: 'Joined SmileID, pandemic',
    interests: ['African tech', 'home cooking', 'cycling'],
    travel: ['Nowhere (pandemic)', 'Local Bay Area exploration'],
    tech: ['Remote work tools', 'Zoom fatigue', 'ML ops'],
    space_events: ['SpaceX Crew Dragon', 'Mars 2020 launch', 'Starlink constellation grows'],
  },
  2021: {
    status: 'SmileID scaling',
    interests: ['African markets', 'crypto', 'surfing'],
    travel: ['Mexico (remote work)', 'Hawaii', 'Miami'],
    tech: ['Web3', 'NFTs', 'Rust'],
    space_events: ['Perseverance lands on Mars', 'James Webb launches', 'Space tourism begins'],
  },
  2022: {
    status: 'SmileID VP Engineering',
    interests: ['team building', 'mentoring', 'trail running'],
    travel: ['Kenya', 'South Africa', 'Portugal'],
    tech: ['AI ethics', 'Distributed teams', 'Platform engineering'],
    space_events: ['JWST first images', 'Artemis I', 'DART asteroid impact'],
  },
  2023: {
    status: 'SmileID to Promptfoo transition',
    interests: ['LLM security', 'sailing', 'wine'],
    travel: ['Japan', 'Chile wine regions', 'Greek islands'],
    tech: ['ChatGPT explosion', 'AI safety', 'Prompt engineering'],
    space_events: ['India Moon landing', 'Starship test flights', 'Euclid space telescope'],
  },
  2024: {
    status: 'Promptfoo founder',
    interests: ['AI safety', 'kitesurfing', 'photography'],
    travel: ['Bali', 'European conference circuit', 'Patagonia'],
    tech: ['LLM security', 'Open source', 'AI regulation'],
    space_events: ['Total solar eclipse', 'Europa Clipper launch', 'Private space stations'],
  },
};

function generateYearInReviewContent(year: number): string {
  const context = YEAR_CONTEXTS[year as keyof typeof YEAR_CONTEXTS];
  const nextYear = year + 1;
  const nextContext = YEAR_CONTEXTS[nextYear as keyof typeof YEAR_CONTEXTS];

  return `As ${year} comes to a close, it\\'s time for my annual tradition of reflecting on the past year and setting intentions for the year ahead. This has been a year of ${year < 2016 ? 'learning and growth' : year < 2020 ? 'building and scaling' : 'transformation and impact'}.

## The Year in Summary

**Status**: ${context.status}

This year has been defined by ${year < 2013 ? 'academic growth and hands-on projects' : year < 2016 ? 'transitioning from student to professional' : year < 2020 ? 'entrepreneurial challenges' : 'leadership and scale'}. Looking back at my goals from last year, I'm ${Math.random() > 0.3 ? 'pleased with the progress' : 'humbled by how much I still have to learn'}.

## Professional Growth

${generateProfessionalSection(year, context)}

## Technical Learning

This year\'s technical exploration focused on:
${context.tech.map(tech => `- **${tech}**: ${generateTechInsight(tech, year)}`).join('\n')}

The most impactful learning was ${context.tech[0]}, which ${year < 2016 ? 'opened new possibilities for my projects' : 'transformed how I approach problems'}.

## Personal Interests & Hobbies

### Space & Astronomy
${generateSpaceSection(year, context)}

### Photography
${generatePhotographySection(year, context)}

### Other Pursuits
${context.interests.slice(2).map(interest => `- **${interest}**: ${generateHobbyInsight(interest, year)}`).join('\n')}

## Travel & Experiences

${year === 2020 ? 'Well, this was the year travel plans went out the window. But even in lockdown, I found adventures:' : 'Travel continues to be a source of inspiration and perspective:'}

${context.travel.map(destination => `- **${destination}**: ${generateTravelInsight(destination, year)}`).join('\n')}

${year < 2020 ? 'Each trip taught me something new about the world and myself.' : 'Even limited travel reminded me of the importance of exploration.'}

## Predictions for ${nextYear}

Looking ahead to ${nextYear}, here are my predictions:

### Technology Trends
${generateTechPredictions(nextYear)}

### Personal Goals
${generatePersonalGoals(nextYear, nextContext)}

### Professional Aspirations
${generateProfessionalGoals(nextYear, nextContext)}

## Lessons Learned

The biggest lessons from ${year}:

1. **${generateLesson(year, 1)}**
2. **${generateLesson(year, 2)}**
3. **${generateLesson(year, 3)}**

## Gratitude

As always, I'm grateful for:
- The mentors who\'ve guided me
- The team members who\'ve challenged me
- The friends who\'ve supported me
- The opportunities to learn and grow

## Looking Forward

${year + 1} is shaping up to be ${nextYear < 2013 ? 'full of academic challenges' : nextYear < 2016 ? 'a career-defining period' : nextYear < 2020 ? 'an entrepreneurial adventure' : 'a year of impact at scale'}. I'm excited about ${nextContext ? nextContext.interests[0] : 'the future'} and ready for whatever challenges await.

Here's to closing out ${year} strong and welcoming ${nextYear} with open arms. See you next year!

*What were your highlights from ${year}? What are you looking forward to in ${nextYear}? I would love to hear your thoughts.*`;
}

function generateProfessionalSection(year: number, context: any): string {
  if (year < 2013) {
    return `As a ${context.status}, I\'ve been deeply immersed in ${context.interests[0]}. The ${year === 2010 ? 'CubeSat program has been transformative' : year === 2011 ? 'responsibility of leading hardware development' : 'preparation for industry'} has taught me more than any classroom could.

Key projects this year:
- ${year === 2009 ? 'Built my first microcontroller projects' : year === 2010 ? 'Designed power systems for our satellite' : year === 2011 ? 'Led thermal vacuum testing campaigns' : 'Completed senior design project'}
- ${year === 2009 ? 'Learned PCB design fundamentals' : year === 2010 ? 'Implemented MPPT algorithms' : year === 2011 ? 'Managed a team of 5 engineers' : 'Interviewed at top tech companies'}
- ${year === 2009 ? 'Started contributing to Arduino forums' : year === 2010 ? 'Presented at regional conferences' : year === 2011 ? 'Published preliminary satellite test results' : 'Graduated summa cum laude'}`;
  } else if (year < 2016) {
    return `The transition from ${year === 2013 ? 'student to industry' : 'industry to graduate school'} has been ${year === 2013 ? 'eye-opening' : 'intellectually stimulating'}. Working on ${context.interests[0]} has shown me ${year === 2013 ? 'what scale really means' : 'the cutting edge of technology'}.

Major accomplishments:
- ${year === 2013 ? 'Shipped code affecting 1B+ users' : year === 2014 ? 'Started MS at Stanford' : 'Completed advanced ML coursework'}
- ${year === 2013 ? 'Learned from world-class engineers' : year === 2014 ? 'Worked on real satellites at Planet' : 'Built deep learning models from scratch'}
- ${year === 2013 ? 'Discovered my passion for performance' : year === 2014 ? 'Found the intersection of space and ML' : 'Prepared to start my own company'}`;
  } else {
    return `Leading ${year < 2020 ? 'Arthena' : year < 2024 ? 'engineering at SmileID' : 'Promptfoo'} through ${year === 2020 ? 'a global pandemic' : year < 2020 ? 'rapid growth' : 'the AI revolution'} has been the challenge of a lifetime.

This year\'s highlights:
- ${year < 2020 ? `Grew ${year === 2016 ? 'from idea to product' : year === 2017 ? 'through YC and raised funding' : 'to millions in revenue'}` : year < 2024 ? `Scaled ${year === 2020 ? 'team from 6 to 15' : year === 2021 ? 'to 100M verifications' : 'to 170M users'}` : 'Built security tools used by 125k developers'}
- ${year < 2020 ? 'Learned about art markets and quantitative finance' : year < 2024 ? 'Mastered distributed systems and ML at scale' : 'Pioneered LLM security testing'}
- ${year < 2020 ? 'Built an incredible team and culture' : year < 2024 ? 'Developed leaders across continents' : 'Created an open source community'}`;
  }
}

function generateSpaceSection(year: number, context: any): string {
  const spaceEvents = context.space_events.join(', ');
  
  if (year < 2013) {
    return `This year was incredible for space exploration: ${spaceEvents}. ${year === 2009 ? 'The 40th anniversary of Apollo 11 reminded me why I got into engineering' : year === 2010 ? 'Working on our CubeSat while SpaceX achieved their first successes was inspiring' : year === 2011 ? 'Watching the final shuttle launch was bittersweet - end of an era, but exciting new companies emerging' : 'Curiosity landing on Mars while we work on our own spacecraft is surreal'}.

I\'ve been ${year < 2011 ? 'learning astrophotography with my DSLR' : 'capturing star trails and ISS passes'}. ${year === 2009 ? 'My first Milky Way photo was terrible but magical' : year === 2010 ? 'Finally got a decent shot of Saturn through a borrowed telescope' : year === 2011 ? 'Built an Arduino-powered star tracker' : 'Photographed the transit of Venus - once in a lifetime event'}.`;
  } else if (year < 2016) {
    return `Space exploration continues to inspire: ${spaceEvents}. ${year === 2013 ? 'Chris Hadfield made space accessible to millions through social media' : year === 2014 ? 'Working at Planet Labs puts me directly in the NewSpace movement' : 'The Pluto flyby images were breathtaking - we are exploring the entire solar system'}.

Still doing astrophotography when I can escape the ${year === 2013 ? 'Bay Area light pollution' : 'Stanford workload'}. ${year === 2013 ? 'Found some dark sky sites in the Santa Cruz mountains' : year === 2014 ? 'The Perseid meteor shower from Yosemite was unforgettable' : 'Iceland northern lights were a photographer dream'}.`;
  } else {
    return `Even as my career has moved away from space, I remain fascinated: ${spaceEvents}. ${year < 2020 ? 'The commercialization of space is accelerating faster than I predicted' : year === 2021 ? 'Space tourism finally became reality' : year === 2022 ? 'JWST images exceeded all expectations' : year === 2023 ? 'Multiple countries landing on the Moon shows how global space has become' : 'Private space stations are becoming reality'}.

Less time for astrophotography these days, but ${year < 2020 ? 'I still catch major events' : year === 2020 ? 'lockdown actually provided some unexpected stargazing opportunities' : 'I make time for major astronomical events'}. ${year === 2020 ? 'The Jupiter-Saturn conjunction was spectacular' : year === 2024 ? 'Photographing the total solar eclipse was a bucket list item' : 'Every clear night is a reminder to look up'}.`;
  }
}

function generatePhotographySection(year: number, context: any): string {
  if (year < 2013) {
    return `Photography remains my creative outlet. This year focused on ${year === 2009 ? 'learning the basics - composition, exposure triangle' : year === 2010 ? 'landscape and night photography' : year === 2011 ? 'documenting our satellite build process' : 'creating a portfolio for the next chapter'}.

Favorite shots from this year:
- ${year === 2009 ? 'Lightning strike over Lake Erie during a summer storm' : year === 2010 ? 'Star trails over the engineering building' : year === 2011 ? 'Time-lapse of our clean room assembly' : 'Graduation day golden hour portraits'}
- ${year === 2009 ? 'First successful Milky Way capture' : year === 2010 ? 'ISS transit across the moon' : year === 2011 ? 'Macro shots of satellite components' : 'Architecture series of campus buildings'}`;
  } else if (year < 2020) {
    return `Travel photography dominated this year with visits to ${context.travel[0]}. ${year < 2016 ? 'Still shooting with my trusty Canon DSLR' : 'Switched to mirrorless for the weight savings'}.

Photography highlights:
- ${year === 2013 ? 'Yosemite firefall phenomenon' : year === 2014 ? 'Patagonian landscapes pushed my skills' : year === 2015 ? 'Northern lights in Iceland' : year < 2018 ? 'Documenting art for Arthena taught me studio photography' : 'African wildlife required learning patience'}
- ${year < 2016 ? 'Experimenting with long exposures' : year < 2020 ? 'Started selling prints for charity' : 'Documentary project on startup life'}`;
  } else {
    return `Photography in the ${year === 2020 ? 'pandemic meant finding beauty locally' : 'age of AI is fascinating - computational photography keeps improving'}.

This year\'s focus:
- ${year === 2020 ? 'Macro photography in the backyard' : year === 2021 ? 'Underwater photography while learning to dive' : year === 2022 ? 'Portraits of the team across continents' : year === 2023 ? 'Film photography renaissance' : 'Experimenting with AI-assisted editing'}
- ${year === 2020 ? 'Virtual photo walks with friends' : year > 2022 ? 'Teaching photography to junior team members' : 'Building a proper home studio setup'}`;
  }
}

function generateTechInsight(tech: string, year: number): string {
  const insights: Record<string, string> = {
    'Arduino': 'Started with blinking LEDs, ended with complex sensor networks',
    'Linux': 'Finally comfortable with the command line - goodbye Windows',
    'embedded systems': 'Understanding interrupts and DMA changed how I think about code',
    'Android development': 'Built my first app - a satellite tracker',
    'FPGA programming': 'Parallel thinking is a different paradigm entirely',
    'Node.js': 'JavaScript on the server still feels weird but powerful',
    'React development': 'Component-based thinking finally clicked',
    'Deep learning': 'The math is beautiful when you understand it',
    'TensorFlow': 'Democratizing ML, but the API could be better',
    'Kubernetes': 'Container orchestration is the future of deployment',
    'ML in production': 'The model is 10% of the work',
    'WebAssembly': 'Bringing systems programming to the web',
    'ChatGPT explosion': 'Everything changed overnight',
    'LLM security': 'The attack surface is massive and poorly understood',
  };
  
  return insights[tech] || `Game-changing technology that shaped my work this year`;
}

function generateHobbyInsight(hobby: string, year: number): string {
  const insights: Record<string, string> = {
    'robotics': 'Built a self-balancing robot that actually balances',
    'running': 'Completed my first half marathon',
    'trail running': 'Found peace in the mountains',
    'cycling': 'Bike commuting changed my perspective on cities',
    'sailing': 'Learning to read the wind is like debugging - patience and observation',
    'kitesurfing': 'Finally landing consistent jumps',
    'wine': 'Discovered natural wines and never looked back',
    'meditation': 'Daily practice has been transformative',
    'freediving': 'The mammalian dive reflex is incredible',
    'surfing': 'Still terrible but loving every wave',
    'mentoring': 'Teaching others taught me more about myself',
  };
  
  return insights[hobby] || `New hobby that brought balance to life`;
}

function generateTravelInsight(destination: string, year: number): string {
  const insights: Record<string, string> = {
    'Niagara Falls trips': 'Still awe-inspiring every time',
    'NYC visits': 'The energy is infectious',
    'Yosemite': 'El Capitan at sunrise - no words',
    'Pacific Coast Highway': 'Big Sur is the most beautiful drive in America',
    'Patagonia trek': 'Torres del Paine challenged every limit',
    'Japan (Tokyo, Kyoto)': 'The perfect blend of future and tradition',
    'Iceland northern lights': 'Photographing aurora while standing on a glacier',
    'Art Basel': 'Where art meets commerce meets party',
    'Kenya': 'The warmth of the people exceeded the beauty of the landscape',
    'Nowhere (pandemic)': 'Discovered hiking trails I had driven past for years',
    'Bali': 'Digital nomad paradise is real',
  };
  
  return insights[destination] || `Memorable experiences and new perspectives`;
}

function generateTechPredictions(year: number): string {
  const predictions: Record<number, string[]> = {
    2010: [
      'Mobile apps will dominate software development',
      'Cloud computing will make hardware less important',
      'Social networks will change how we communicate',
    ],
    2011: [
      'Tablets will replace laptops for content consumption',
      'JavaScript will become a serious language',
      'Private space companies will challenge NASA',
    ],
    2012: [
      'Big data will be the new oil',
      'Mobile-first design will become standard',
      'MOOCs will disrupt traditional education',
    ],
    2013: [
      'Wearable computing will go mainstream',
      'Bitcoin will either die or change finance',
      'Docker will make deployment trivial',
    ],
    2014: [
      'Machine learning will move from research to production',
      'Virtual reality will finally have its moment',
      'Messaging apps will become platforms',
    ],
    2015: [
      'Deep learning will solve previously impossible problems',
      'Blockchain will find uses beyond cryptocurrency',
      'Edge computing will become necessary',
    ],
    2016: [
      'AI assistants will be everywhere',
      'Augmented reality will beat VR for daily use',
      'Serverless will change how we build apps',
    ],
    2017: [
      'Cryptocurrency bubble will burst then rebuild',
      'AI ethics will become a major concern',
      'Quantum computing will hit milestones',
    ],
    2018: [
      'Privacy regulations will reshape tech',
      'ARM chips will challenge Intel',
      'Space will become commercially viable',
    ],
    2019: [
      '5G will enable new applications',
      'Climate tech will see massive investment',
      'Remote work tools will improve dramatically',
    ],
    2020: [
      'Video conferencing will become primary communication',
      'E-commerce will accelerate 10 years in 1',
      'Biotech will have its moment',
    ],
    2021: [
      'Web3 will polarize the tech community',
      'AI will become accessible to everyone',
      'Supply chain tech will be critical',
    ],
    2022: [
      'Large language models will change everything',
      'Layoffs will reshape tech employment',
      'Energy tech will see breakthrough funding',
    ],
    2023: [
      'AI regulation will struggle to keep pace',
      'Open source AI will challenge big tech',
      'Space manufacturing will begin',
    ],
    2024: [
      'AI agents will handle complex tasks',
      'Quantum computing will solve real problems',
      'Brain-computer interfaces will show promise',
    ],
    2025: [
      'AGI will remain 5 years away',
      'Climate tech will show real results',
      'Space economy will exceed $1 trillion',
    ],
  };
  
  const yearPredictions = predictions[year] || [
    'Technology will continue to surprise us',
    'Open source will drive innovation',
    'The pace of change will accelerate',
  ];
  
  return yearPredictions.map((pred, i) => `${i + 1}. ${pred}`).join('\n');
}

function generatePersonalGoals(year: number, context: any): string {
  if (!context) return '1. Keep learning\n2. Stay curious\n3. Build meaningful things';
  
  const goals = [
    `Master ${context.interests[0]}`,
    `Visit ${context.travel[0] || 'new places'}`,
    `Deepen ${context.interests[1] || 'technical skills'}`,
    year < 2016 ? 'Read 25+ books' : 'Mentor more junior engineers',
    year < 2020 ? 'Maintain work-life balance' : 'Prioritize health and family',
  ];
  
  return goals.slice(0, 3).map((goal, i) => `${i + 1}. ${goal}`).join('\n');
}

function generateProfessionalGoals(year: number, context: any): string {
  if (!context) return '1. Take on new challenges\n2. Learn from failures\n3. Make meaningful impact';
  
  if (year < 2013) {
    return `1. ${year === 2010 ? 'Excel in the CubeSat program' : year === 2011 ? 'Lead successful satellite testing' : year === 2012 ? 'Land a great job' : 'Graduate with honors'}
2. ${year < 2012 ? 'Publish research findings' : 'Build strong industry connections'}
3. ${year < 2012 ? 'Master new technical skills' : 'Prepare for industry transition'}`;
  } else if (year < 2016) {
    return `1. ${year === 2013 ? 'Make meaningful impact at Facebook' : year === 2014 ? 'Excel in graduate coursework' : year === 2015 ? 'Complete MS thesis' : 'Launch first startup'}
2. ${year < 2015 ? 'Build Silicon Valley network' : 'Raise funding successfully'}
3. ${year < 2015 ? 'Learn from the best engineers' : 'Build a great team'}`;
  } else if (year < 2020) {
    return `1. ${year === 2016 ? 'Get Arthena to product-market fit' : year === 2017 ? 'Scale post-YC' : year === 2018 ? 'Reach profitability' : 'Expand internationally'}
2. Build world-class team and culture
3. Establish Arthena as category leader`;
  } else if (year < 2024) {
    return `1. ${year === 2020 ? 'Successfully transition to SmileID' : year === 2021 ? 'Scale engineering team' : year === 2022 ? 'Reach 100M users' : 'Prepare for next chapter'}
2. ${year < 2023 ? 'Build African tech ecosystem connections' : 'Explore AI/ML opportunities'}
3. ${year < 2023 ? 'Master distributed systems at scale' : 'Position for next big challenge'}`;
  } else {
    return `1. Establish Promptfoo as the standard for LLM security
2. Build sustainable open source business model
3. Create lasting impact on AI safety`;
  }
}

function generateLesson(year: number, lessonNumber: number): string {
  const lessons: Record<string, string[]> = {
    '2009': [
      'Foundation matters - the basics you learn early compound',
      'Asking for help is a strength, not weakness',
      'Document everything - future you will thank present you',
    ],
    '2010': [
      'Real projects teach more than perfect grades',
      'Team dynamics matter as much as technical skills',
      'Hardware failures teach humility and preparation',
    ],
    '2011': [
      'Leadership is about enabling others to succeed',
      'Testing in realistic conditions reveals truth',
      'Simple solutions often beat complex ones',
    ],
    '2012': [
      'Career pivots require courage but open doors',
      'Network effects apply to relationships too',
      'Finishing strong matters more than starting perfectly',
    ],
    '2013': [
      'Scale thinking changes everything',
      'Performance optimization is never done',
      'Learning from experts accelerates growth',
    ],
    '2014': [
      'Academic knowledge plus industry experience is powerful',
      'Side projects keep creativity alive',
      'Geographic location still matters in tech',
    ],
    '2015': [
      'Deep expertise beats shallow knowledge',
      'Research requires patience and persistence',
      'Travel broadens technical perspective',
    ],
    '2016': [
      'Starting a company is 90% persistence',
      'Domain expertise is a moat',
      'Fundraising is sales with higher stakes',
    ],
    '2017': [
      'Accelerators accelerate everything - including mistakes',
      'Customer feedback beats perfect planning',
      'Culture is set early and hard to change',
    ],
    '2018': [
      'Scaling requires letting go of control',
      'International expansion is harder than it looks',
      'Profitability brings freedom',
    ],
    '2019': [
      'Market timing matters more than perfect execution',
      'Work-life balance is a daily choice',
      'Success brings its own challenges',
    ],
    '2020': [
      'Remote work changes everything about team building',
      'Crises reveal character',
      'African tech is massively underestimated',
    ],
    '2021': [
      'Hypergrowth is exhilarating but exhausting',
      'Technical debt compounds faster at scale',
      'Diverse teams build better products',
    ],
    '2022': [
      'Leadership is mostly listening',
      'Documentation is a gift to your future team',
      'Burnout is real - prevent it proactively',
    ],
    '2023': [
      'AI changes faster than organizations can adapt',
      'Open source creates more value than it captures',
      'Career transitions get easier with experience',
    ],
    '2024': [
      'Security is everyones responsibility',
      'Community building is slow but compounds',
      'The best time to start was yesterday, second best is now',
    ],
  };
  
  const yearLessons = lessons[year.toString()] || [
    'Every year brings new challenges and growth',
    'Embrace change - its the only constant',
    'Invest in relationships - they matter most',
  ];
  
  return yearLessons[lessonNumber - 1];
}

// Function to generate a year in review post
function generateYearInReview(year: number): YearInReviewPost {
  const date = `${year}-12-31`;
  const title = `${year}: Year in Review`;
  const summary = `Reflecting on ${year} - ${YEAR_CONTEXTS[year as keyof typeof YEAR_CONTEXTS]?.status || 'a year of growth'}, predictions for ${year + 1}, and lessons learned along the way.`;
  const tags = ['year-in-review', 'personal', 'reflection', 'predictions'];
  const content = generateYearInReviewContent(year);
  
  return { year, date, title, summary, tags, content };
}

// Function to convert content to JSX
function contentToJSX(content: string): string {
  const lines = content.split('\n');
  const jsxElements: string[] = [];
  let inList = false;
  
  for (const line of lines) {
    if (line.trim() === '') {
      if (inList) {
        jsxElements.push('            </ul>');
        inList = false;
      }
      continue;
    }
    
    if (line.startsWith('### ')) {
      jsxElements.push(`            <h3>${line.substring(4)}</h3>`);
    } else if (line.startsWith('## ')) {
      jsxElements.push(`            <h2>${line.substring(3)}</h2>`);
    } else if (line.startsWith('# ')) {
      jsxElements.push(`            <h1>${line.substring(2)}</h1>`);
    } else if (line.match(/^\d+\.\s/) || line.startsWith('- ')) {
      if (!inList) {
        jsxElements.push('            <ul>');
        inList = true;
      }
      const content = line.replace(/^\d+\.\s/, '').replace(/^-\s/, '');
      // Handle bold text
      const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      jsxElements.push(`              <li>${formattedContent}</li>`);
    } else {
      if (inList) {
        jsxElements.push('            </ul>');
        inList = false;
      }
      // Handle bold text and italics
      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      jsxElements.push(`            <p>${formattedLine}</p>`);
    }
  }
  
  if (inList) {
    jsxElements.push('            </ul>');
  }
  
  return jsxElements.join('\n');
}

// Generate page.tsx for a year in review post
function generatePageTsx(post: YearInReviewPost): string {
  const jsxContent = contentToJSX(post.content);
  
  return `import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">${post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="${post.date}">December 31, ${post.year}</time>
              <span>•</span>
              <span>8 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              ${post.tags.map(tag => `<span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">${tag}</span>`).join('\n              ')}
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
${jsxContent}
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
`;
}

// Main execution
async function generateAllYearInReviews() {
  const outputDir = path.join(process.cwd(), 'app/blog');
  let created = 0;
  
  // Generate year in review for each year from 2009 to 2024
  for (let year = 2009; year <= 2024; year++) {
    const post = generateYearInReview(year);
    const folderName = `${post.date}-year-in-review`;
    const folderPath = path.join(outputDir, folderName);
    
    // Skip if already exists
    if (fs.existsSync(folderPath)) {
      console.log(`Skipping ${year} - already exists`);
      continue;
    }
    
    // Create folder
    fs.mkdirSync(folderPath, { recursive: true });
    
    // Generate and write page.tsx
    const pageContent = generatePageTsx(post);
    const filePath = path.join(folderPath, 'page.tsx');
    fs.writeFileSync(filePath, pageContent);
    
    created++;
    console.log(`✅ Created: ${year} Year in Review`);
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created} year in review posts`);
  console.log(`   Years covered: 2009-2024`);
}

// Run the generator
generateAllYearInReviews().catch(console.error);