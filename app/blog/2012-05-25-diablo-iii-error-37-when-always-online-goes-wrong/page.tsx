import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Diablo III Error 37: When Always-Online Goes Wrong',
  description: 'Diablo III launched with always-online DRM. Spent 4 hours staring at Error 37. Building my own game server to understand why.',
  keywords: ['gaming', 'diablo', 'servers', 'drm'],
  openGraph: {
    title: 'Diablo III Error 37: When Always-Online Goes Wrong',
    description: 'Diablo III launched with always-online DRM. Spent 4 hours staring at Error 37. Building my own game server to understand why.',
    type: 'article',
    publishedTime: '2012-05-25',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-05-25',
  title: 'Diablo III Error 37: When Always-Online Goes Wrong',
  content: `"Error 37: The servers are busy at this time. Please try again later." This is what millions of us saw trying to play Diablo III on launch night. Time to investigate why.

## The Launch Disaster

Timeline of frustration:
- 12:00 AM: Launch time! Excited to play
- 12:01 AM: Error 37
- 1:00 AM: Still Error 37
- 2:00 AM: Got in! Disconnected after 5 minutes
- 4:00 AM: Gave up, went to bed angry

## The Technical Problem

Built a simple game server to understand:

\`\`\`python
import asyncio
from collections import deque

class GameServer:
    def __init__(self, max_players=1000):
        self.max_players = max_players
        self.active_players = set()
        self.login_queue = deque()
        
    async def handle_login(self, player_id):
        if len(self.active_players) >= self.max_players:
            self.login_queue.append(player_id)
            return {"error": 37, "message": "Server full"}
        
        self.active_players.add(player_id)
        return {"success": True, "session": generate_session()}
    
    async def process_queue(self):
        while True:
            if self.login_queue and len(self.active_players) < self.max_players:
                player = self.login_queue.popleft()
                await self.handle_login(player)
            await asyncio.sleep(0.1)
\`\`\`

## Why Always-Online for Single Player?

Blizzard's reasons (and problems):
- Prevent piracy (anger legitimate customers)
- Real money auction house (legal issues)
- Prevent cheating (in single player?)
- Social features (I just want to play)

## The Scaling Challenge

Diablo III launch numbers:
- 3.5 million sales day one
- All trying to login simultaneously
- Each player needs server resources
- Even for single player mode

## Building a Scalable Architecture

How I'd handle it:

\`\`\`python
class ScalableGameService:
    def __init__(self):
        self.regions = ['us-west', 'us-east', 'eu', 'asia']
        self.shards = {region: [] for region in self.regions}
        
    def auto_scale(self, region, load):
        if load > 80:
            new_shard = self.spin_up_server(region)
            self.shards[region].append(new_shard)
        elif load < 20 and len(self.shards[region]) > 1:
            self.spin_down_server(self.shards[region].pop())
    
    def handle_login_request(self, player):
        region = self.get_player_region(player)
        best_shard = self.find_least_loaded_shard(region)
        
        if not best_shard:
            return self.queue_player(player)
        
        return best_shard.login(player)
\`\`\`

## Community Response

Forums and Reddit exploding:
- Memes about Error 37
- Refund demands
- "Single player shouldn't need internet"
- Comparisons to SimCity, Ubisoft DRM

## The Business Impact

Metacritic user score: 3.8/10 (critics: 88/100)
- Thousands of 0/10 reviews
- "Game might be good, can't play it"
- Stock price dropping
- Brand damage lasting

## Lessons for Online Services

What we learned:
1. **Launch capacity**: Plan for 5x expected load
2. **Graceful degradation**: Offline mode fallback
3. **Queue systems**: Better than hard errors
4. **Regional servers**: Distribute load
5. **Communication**: Be transparent about issues

## My Workaround

Created a local caching proxy:

\`\`\`javascript
// Cache game state locally
const gameCache = {
  saveGameState: (state) => {
    localStorage.setItem('gameState', JSON.stringify(state));
    // Sync when server available
    serverQueue.push({action: 'sync', data: state});
  },
  
  playOffline: () => {
    const cached = localStorage.getItem('gameState');
    if (cached) {
      return new OfflineGame(JSON.parse(cached));
    }
  }
};
\`\`\`

## The Bigger Picture

Always-online is the future, but:
- Infrastructure must be ready
- Fallbacks are essential
- User experience comes first
- Trust is hard to rebuild

Error 37 will live in infamy. At least it inspired some good engineering thinking!`,
  tags: ['gaming', 'diablo', 'servers', 'drm'],
  readTime: '16 min',
};

export default function DiabloIIIError37WhenAlwaysOnlineGoesWrongPage() {
  return <BlogPost post={post} />;
}
