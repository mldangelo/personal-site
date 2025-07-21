import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'iPhone 5 Launch: The Maps Disaster',
  description: 'Got the iPhone 5 today. The hardware is amazing, but Apple Maps is a disaster. Building a maps comparison tool to document the failures.',
  keywords: ['iphone', 'apple-maps', 'ios', 'mobile'],
  openGraph: {
    title: 'iPhone 5 Launch: The Maps Disaster',
    description: 'Got the iPhone 5 today. The hardware is amazing, but Apple Maps is a disaster. Building a maps comparison tool to document the failures.',
    type: 'article',
    publishedTime: '2012-09-20',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-09-20',
  title: 'iPhone 5 Launch: The Maps Disaster',
  content: `Waited in line for the iPhone 5 this morning. The phone is fantastic - taller screen, LTE, lighter weight. But Apple Maps... oh boy.

## The Good: iPhone 5 Hardware

The device itself is excellent:
- 4" screen finally
- LTE is blazing fast
- Incredibly light
- Camera improvements
- A6 chip flies

## The Bad: Apple Maps

Testing Maps around Stanford:
- Stanford Hospital in wrong location
- Searching "Stanford" shows farm
- No transit directions
- Satellite imagery from 2007
- 3D view looks like melted buildings

## Building a Comparison Tool

Created a side-by-side comparison:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Maps Comparison: Apple vs Google</title>
  <style>
    .map-container {
      display: flex;
      height: 600px;
    }
    .map-frame {
      flex: 1;
      margin: 5px;
    }
  </style>
</head>
<body>
  <div class="map-container">
    <div class="map-frame">
      <h2>Apple Maps</h2>
      <iframe src="maps-apple-bridge.html"></iframe>
    </div>
    <div class="map-frame">
      <h2>Google Maps</h2>
      <iframe src="https://maps.google.com/maps"></iframe>
    </div>
  </div>
  
  <script>
    // Sync map movements between frames
    let syncing = false;
    
    window.addEventListener('message', (event) => {
      if (syncing) return;
      syncing = true;
      
      const { lat, lng, zoom } = event.data;
      // Update both maps to same position
      updateAppleMap(lat, lng, zoom);
      updateGoogleMap(lat, lng, zoom);
      
      setTimeout(() => syncing = false, 100);
    });
  </script>
</body>
</html>
\`\`\`

## Documenting the Failures

Created a database of map errors:

\`\`\`javascript
const mapErrors = [
  {
    location: 'Stanford Hospital',
    appleCoords: [37.4419, -122.1430],
    googleCoords: [37.4359, -122.1752],
    distance: '2.1 miles off',
    severity: 'critical'
  },
  {
    location: 'Brooklyn Bridge',
    issue: 'Labeled as highway ramp',
    screenshot: 'brooklyn-bridge-fail.png'
  },
  {
    location: 'Hoover Tower',
    issue: '3D view shows as twisted spire',
    screenshot: 'hoover-tower-melted.png'
  }
];

// Generate report
function generateMapReport() {
  const critical = mapErrors.filter(e => e.severity === 'critical');
  console.log(\`Found ${critical.length} critical navigation errors\`);
}
\`\`\`

## The Technical Challenge

Why maps are hard:
- Petabytes of data
- Complex routing algorithms
- Real-time traffic integration
- Business data accuracy
- Street view imagery
- Years of refinement needed

## Tim Cook's Apology

The CEO apology letter:
"We are extremely sorry for the frustration this has caused our customers..."

Recommending competitors - unprecedented!

## The Backlash

Social media exploding:
- #AppleMaps trending
- Tumblr blogs documenting fails
- "Get Lost with Apple Maps"
- Developers scrambling for alternatives

## Building a Google Maps iOS Wrapper

Quick solution for apps:

\`\`\`objective-c
@interface GoogleMapsView : UIView <UIWebViewDelegate>
@property (nonatomic, strong) UIWebView *webView;
@end

@implementation GoogleMapsView

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        self.webView = [[UIWebView alloc] initWithFrame:self.bounds];
        self.webView.delegate = self;
        [self addSubview:self.webView];
        
        NSString *htmlPath = [[NSBundle mainBundle] 
            pathForResource:@"googlemaps" ofType:@"html"];
        NSURL *url = [NSURL fileURLWithPath:htmlPath];
        [self.webView loadRequest:[NSURLRequest requestWithURL:url]];
    }
    return self;
}

- (void)centerMapOnLatitude:(double)lat longitude:(double)lng {
    NSString *js = [NSString stringWithFormat:
        @"centerMap(%f, %f);", lat, lng];
    [self.webView stringByEvaluatingJavaScriptFromString:js];
}
@end
\`\`\`

## Lessons Learned

This launch teaches us:
- Don't replace critical infrastructure prematurely
- Maps require years of data collection
- Users expect perfection for core features
- Competition benefits users
- Hubris has consequences

Google Maps app for iOS can't come soon enough!`,
  tags: ['iphone', 'apple-maps', 'ios', 'mobile'],
  readTime: '16 min',
};

export default function iPhone5LaunchTheMapsDisasterPage() {
  return <BlogPost post={post} />;
}
