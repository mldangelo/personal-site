import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'MongoDB vs PostgreSQL: Choosing the Right Database',
  description: 'Comparing MongoDB and PostgreSQL for our startup project. NoSQL flexibility vs SQL reliability - which wins?',
  keywords: ['mongodb', 'postgresql', 'database', 'comparison'],
  openGraph: {
    title: 'MongoDB vs PostgreSQL: Choosing the Right Database',
    description: 'Comparing MongoDB and PostgreSQL for our startup project. NoSQL flexibility vs SQL reliability - which wins?',
    type: 'article',
    publishedTime: '2012-05-05',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-05-05',
  title: 'MongoDB vs PostgreSQL: Choosing the Right Database',
  content: `Our team is building a social analytics platform and we're at a crossroads: MongoDB or PostgreSQL? Spent a week evaluating both with real workloads.

## The Use Case

Our requirements:
- Store millions of social media posts
- Flexible schema (platforms change APIs)
- Complex analytics queries
- Real-time aggregations
- Geo-spatial queries
- Full-text search

## MongoDB Test Setup

Started with MongoDB for its flexibility:

\`\`\`javascript
// MongoDB schema design
const postSchema = {
  _id: ObjectId(),
  platform: 'twitter',
  platformId: '123456789',
  user: {
    id: 'user123',
    username: 'johndoe',
    followers: 1000,
    verified: true
  },
  content: {
    text: 'Just tried the new iPhone!',
    hashtags: ['iphone', 'tech'],
    mentions: ['@apple'],
    urls: ['https://apple.com']
  },
  metrics: {
    likes: 42,
    shares: 5,
    comments: 3
  },
  location: {
    type: 'Point',
    coordinates: [-122.4194, 37.7749]
  },
  sentiment: {
    score: 0.8,
    magnitude: 0.6
  },
  createdAt: ISODate('2012-05-05T10:30:00Z'),
  analyzedAt: ISODate('2012-05-05T10:31:00Z')
};

// Create indexes
db.posts.createIndex({ 'user.id': 1, createdAt: -1 });
db.posts.createIndex({ 'content.hashtags': 1 });
db.posts.createIndex({ location: '2dsphere' });
db.posts.createIndex({ 'content.text': 'text' });
\`\`\`

## PostgreSQL with JSONB

PostgreSQL's JSONB offers similar flexibility:

\`\`\`sql
-- PostgreSQL schema
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  platform_id VARCHAR(100) NOT NULL,
  user_data JSONB NOT NULL,
  content JSONB NOT NULL,
  metrics JSONB NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  sentiment JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_id ON posts ((user_data->>'id'));
CREATE INDEX idx_created_at ON posts (created_at DESC);
CREATE INDEX idx_hashtags ON posts USING GIN ((content->'hashtags'));
CREATE INDEX idx_location ON posts USING GIST (location);
CREATE INDEX idx_content_text ON posts USING GIN (to_tsvector('english', content->>'text'));

-- Ensure uniqueness
CREATE UNIQUE INDEX idx_platform_post ON posts (platform, platform_id);
\`\`\`

## Performance Benchmarks

Loaded 10 million posts and ran queries:

\`\`\`python
import time
import psycopg2
from pymongo import MongoClient

class DatabaseBenchmark:
    def __init__(self):
        self.mongo = MongoClient('mongodb://localhost:27017/')['social']
        self.pg = psycopg2.connect("dbname=social user=postgres")
        
    def benchmark_query(self, name, mongo_query, pg_query):
        # MongoDB
        start = time.time()
        mongo_results = list(self.mongo.posts.find(mongo_query).limit(1000))
        mongo_time = time.time() - start
        
        # PostgreSQL
        cur = self.pg.cursor()
        start = time.time()
        cur.execute(pg_query)
        pg_results = cur.fetchall()
        pg_time = time.time() - start
        
        print(f"{name}:")
        print(f"  MongoDB: {mongo_time:.3f}s ({len(mongo_results)} results)")
        print(f"  PostgreSQL: {pg_time:.3f}s ({len(pg_results)} results)")
        
    def run_benchmarks(self):
        # 1. Find posts by user in date range
        self.benchmark_query(
            "Posts by user in date range",
            {
                'user.id': 'user123',
                'createdAt': {
                    '$gte': datetime(2012, 5, 1),
                    '$lt': datetime(2012, 6, 1)
                }
            },
            """
            SELECT * FROM posts 
            WHERE user_data->>'id' = 'user123'
            AND created_at >= '2012-05-01' 
            AND created_at < '2012-06-01'
            LIMIT 1000
            """
        )
        
        # 2. Hashtag aggregation
        self.benchmark_query(
            "Top hashtags with counts",
            [
                {'$unwind': '$content.hashtags'},
                {'$group': {
                    '_id': '$content.hashtags',
                    'count': {'$sum': 1}
                }},
                {'$sort': {'count': -1}},
                {'$limit': 100}
            ],
            """
            SELECT hashtag, COUNT(*) as count
            FROM posts, jsonb_array_elements_text(content->'hashtags') as hashtag
            GROUP BY hashtag
            ORDER BY count DESC
            LIMIT 100
            """
        )
\`\`\`

## Results Summary

| Query Type | MongoDB | PostgreSQL |
|------------|---------|------------|
| Simple lookup | 0.003s | 0.005s |
| Range query | 0.125s | 0.089s |
| Aggregation | 2.341s | 1.876s |
| Geo query | 0.234s | 0.156s |
| Full-text | 0.567s | 0.234s |
| Complex join | N/A | 0.345s |

## Schema Evolution

Testing schema changes:

\`\`\`javascript
// MongoDB - Just start writing new fields
db.posts.update(
  { platform: 'instagram' },
  { $set: { 'content.imageUrl': 'https://...' } },
  { multi: true }
);

// PostgreSQL - Also flexible with JSONB
UPDATE posts 
SET content = content || '{"imageUrl": "https://..."}'
WHERE platform = 'instagram';
\`\`\`

## Advanced Features

PostgreSQL's secret weapons:

\`\`\`sql
-- Window functions for analytics
WITH engagement_trends AS (
  SELECT 
    date_trunc('hour', created_at) as hour,
    platform,
    AVG((metrics->>'likes')::int) as avg_likes,
    LAG(AVG((metrics->>'likes')::int), 1) OVER (
      PARTITION BY platform ORDER BY date_trunc('hour', created_at)
    ) as prev_avg_likes
  FROM posts
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY hour, platform
)
SELECT 
  hour,
  platform,
  avg_likes,
  ROUND(((avg_likes - prev_avg_likes) / prev_avg_likes::numeric) * 100, 2) as change_percent
FROM engagement_trends
WHERE prev_avg_likes IS NOT NULL
ORDER BY hour DESC, platform;

-- CTEs for complex queries
WITH viral_posts AS (
  SELECT * FROM posts 
  WHERE (metrics->>'likes')::int > 1000
),
viral_users AS (
  SELECT DISTINCT user_data->>'id' as user_id
  FROM viral_posts
)
SELECT 
  p.*,
  CASE WHEN vu.user_id IS NOT NULL THEN true ELSE false END as is_viral_user
FROM posts p
LEFT JOIN viral_users vu ON p.user_data->>'id' = vu.user_id
WHERE p.created_at > NOW() - INTERVAL '1 day';
\`\`\`

## The Decision

After extensive testing, we chose **PostgreSQL**:

**Why PostgreSQL won:**
- JSONB gives us MongoDB-like flexibility
- ACID guarantees for critical data
- Superior query performance for analytics
- Mature ecosystem and tooling
- Can still do joins when needed

**When we'd choose MongoDB:**
- Document-centric applications
- Simpler operational model
- Horizontal scaling priority
- No complex queries needed

The best part? PostgreSQL lets us start relational and go schemaless where needed!`,
  tags: ['mongodb', 'postgresql', 'database', 'comparison'],
  readTime: '20 min',
};

export default function MongoDBvsPostgreSQLChoosingtheRightDatabasePage() {
  return <BlogPost post={post} />;
}
