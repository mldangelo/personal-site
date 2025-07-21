import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Building a Gesture Recognition System with Kinect',
  description: 'Using the Kinect SDK to build a gesture-controlled presentation system. No more clicking through slides!',
  keywords: ['kinect', 'gesture-recognition', 'computer-vision', 'nui'],
  openGraph: {
    title: 'Building a Gesture Recognition System with Kinect',
    description: 'Using the Kinect SDK to build a gesture-controlled presentation system. No more clicking through slides!',
    type: 'article',
    publishedTime: '2012-07-15',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-07-15',
  title: 'Building a Gesture Recognition System with Kinect',
  content: `Tired of clicking through presentations, I built a gesture recognition system using the Kinect. Wave your hand to advance slides, swipe to go back, and more!

## The Setup

Using Microsoft's Kinect SDK with C#:

\`\`\`csharp
private KinectSensor sensor;
private Skeleton[] skeletons;

void InitializeKinect()
{
    sensor = KinectSensor.KinectSensors[0];
    sensor.SkeletonStream.Enable();
    sensor.SkeletonFrameReady += OnSkeletonFrameReady;
    sensor.Start();
}

void OnSkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e)
{
    using (SkeletonFrame frame = e.OpenSkeletonFrame())
    {
        if (frame != null)
        {
            skeletons = new Skeleton[frame.SkeletonArrayLength];
            frame.CopySkeletonDataTo(skeletons);
            ProcessGestures();
        }
    }
}
\`\`\`

## Gesture Detection Algorithm

Built a state machine for gesture recognition:

\`\`\`csharp
public class GestureDetector
{
    private Queue<SkeletonPoint> rightHandPositions = new Queue<SkeletonPoint>();
    private const int HISTORY_SIZE = 30; // 1 second at 30fps
    
    public GestureType DetectGesture(Skeleton skeleton)
    {
        var rightHand = skeleton.Joints[JointType.HandRight].Position;
        rightHandPositions.Enqueue(rightHand);
        
        if (rightHandPositions.Count > HISTORY_SIZE)
            rightHandPositions.Dequeue();
        
        // Swipe Right: Hand moves left to right
        if (IsSwipeRight())
            return GestureType.SwipeRight;
            
        // Wave: Hand moves up and down repeatedly  
        if (IsWave())
            return GestureType.Wave;
            
        // Push: Hand moves forward quickly
        if (IsPush())
            return GestureType.Push;
            
        return GestureType.None;
    }
    
    private bool IsSwipeRight()
    {
        if (rightHandPositions.Count < 20) return false;
        
        var positions = rightHandPositions.ToArray();
        float deltaX = positions[positions.Length-1].X - positions[0].X;
        
        return deltaX > 0.3f; // 30cm movement
    }
}
\`\`\`

## PowerPoint Integration

Controlling presentations with gestures:

\`\`\`csharp
private void HandleGesture(GestureType gesture)
{
    switch (gesture)
    {
        case GestureType.SwipeRight:
            SendKeys.SendWait("{RIGHT}"); // Next slide
            ShowFeedback("Next Slide");
            break;
            
        case GestureType.SwipeLeft:
            SendKeys.SendWait("{LEFT}"); // Previous slide
            ShowFeedback("Previous Slide");
            break;
            
        case GestureType.Push:
            SendKeys.SendWait("{F5}"); // Start presentation
            ShowFeedback("Start Presentation");
            break;
            
        case GestureType.CloseFist:
            SendKeys.SendWait("{ESC}"); // Exit presentation
            ShowFeedback("Exit");
            break;
    }
}
\`\`\`

## Visual Feedback System

Showing users what the system sees:

\`\`\`csharp
private void DrawSkeleton(Skeleton skeleton, DrawingContext dc)
{
    foreach (Joint joint in skeleton.Joints)
    {
        if (joint.TrackingState == JointTrackingState.Tracked)
        {
            var point = SkeletonPointToScreen(joint.Position);
            dc.DrawEllipse(Brushes.Green, null, point, 5, 5);
        }
    }
    
    // Highlight active hand
    var rightHand = skeleton.Joints[JointType.HandRight];
    if (rightHand.TrackingState == JointTrackingState.Tracked)
    {
        var handPoint = SkeletonPointToScreen(rightHand.Position);
        dc.DrawEllipse(Brushes.Red, null, handPoint, 10, 10);
    }
}
\`\`\`

## Testing and Refinement

Challenges encountered:
- False positives from normal movement
- Gesture timing windows
- Multiple people in view
- Different body sizes

Solutions:
- Confidence thresholds
- Cooldown periods
- Primary user tracking
- Normalized coordinates

## Demo Day Success

Presented my final project using the system:
- No mouse or keyboard touched
- Smoothly controlled 30-slide presentation
- Audience loved the interaction
- Professor asked to use it!

## Future Improvements

Next features to add:
- Custom gesture training
- Voice commands integration
- Multi-display support
- Gesture recording/playback

The Kinect opens up amazing possibilities for natural user interfaces!`,
  tags: ['kinect', 'gesture-recognition', 'computer-vision', 'nui'],
  readTime: '16 min',
};

export default function BuildingaGestureRecognitionSystemwithKinectPage() {
  return <BlogPost post={post} />;
}
