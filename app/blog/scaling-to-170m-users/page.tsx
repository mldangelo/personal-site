import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scaling Biometric Systems to 170 Million Users',
  description: 'Lessons learned building identity verification infrastructure across Africa. From 10 QPS to 10,000 QPS: architecture decisions, edge computing, and offline-first design.',
};

export default function ScalingTo170MUsersPage() {
  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Scaling Biometric Systems to 170 Million Users
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime="2023-11-28">November 28, 2023</time>
            <span>•</span>
            <span>18 min read</span>
            <span>•</span>
            <span>32,000 views</span>
          </div>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="lead text-lg">
            When I joined SmileID as VP of Engineering, we were processing 50,000 identity verifications per day across 3 countries. Two years later, we hit 170 million unique users, 10,000 queries per second, and expanded to 14 African countries. This is the story of how we built one of the largest biometric systems in Africa, the technical challenges we faced, and the unconventional solutions we implemented.
          </p>

          <h2>The African Context</h2>
          <p>
            Building technology for Africa requires throwing out most Silicon Valley playbooks. Here's what we were dealing with:
          </p>
          <ul>
            <li><strong>Connectivity:</strong> 2G networks are still common. 3G is a luxury. 4G is urban-only.</li>
            <li><strong>Devices:</strong> $20 Android phones with 512MB RAM running Android 4.4</li>
            <li><strong>Power:</strong> Daily power outages lasting 4-12 hours</li>
            <li><strong>Infrastructure:</strong> Limited cloud regions, high latency to US/EU servers</li>
            <li><strong>Data costs:</strong> Mobile data can cost 10% of monthly income</li>
          </ul>
          <p>
            These constraints shaped every architectural decision we made.
          </p>

          <h2>The Journey: 10 QPS to 10,000 QPS</h2>

          <h3>Phase 1: The Monolith That Could (10-100 QPS)</h3>
          <p>
            We started with a Django monolith. Controversial? Maybe. Smart? Absolutely. Here's why:
          </p>
          <pre className="language-python"><code>{`# Our initial architecture was deliberately simple
class BiometricVerification(models.Model):
    user_id = models.UUIDField(primary_key=True)
    selfie_image = models.ImageField(upload_to='selfies/')
    id_document = models.ImageField(upload_to='documents/')
    face_vector = models.BinaryField()  # 512-dimension face embedding
    confidence_score = models.FloatField()
    verified_at = models.DateTimeField()
    
    class Meta:
        indexes = [
            models.Index(fields=['user_id', 'verified_at']),
            # Spatial index for face vector similarity search
            GinIndex(fields=['face_vector'], name='face_vector_gin'),
        ]`}</code></pre>
          <p>
            The monolith allowed us to iterate quickly, understand our domain deeply, and most importantly—ship features that users needed. We resisted the microservices hype until we had clear boundaries.
          </p>

          <h3>Phase 2: Strategic Decomposition (100-1,000 QPS)</h3>
          <p>
            As we grew, specific bottlenecks emerged. We decomposed strategically:
          </p>
          <pre className="language-yaml"><code>{`# Service boundaries emerged from actual pain points
services:
  - name: face-detection
    language: rust
    why: "CPU-bound, needed 10x performance improvement"
    
  - name: document-ocr
    language: python
    why: "Best ML libraries, could tolerate 200ms latency"
    
  - name: biometric-matching
    language: go
    why: "High concurrency, low latency requirements"
    
  - name: user-api
    language: python
    why: "Complex business logic, team expertise"`}</code></pre>

          <h3>Phase 3: Edge-First Architecture (1,000-10,000 QPS)</h3>
          <p>
            The game-changer was moving compute to the edge. We deployed lightweight verification nodes in each country:
          </p>
          <pre className="language-typescript"><code>{`// Edge node architecture
interface EdgeNode {
  location: string;
  capabilities: {
    faceDetection: boolean;
    livenessCheck: boolean;
    documentOCR: boolean;
    offlineMode: boolean;
  };
  
  // Each node maintains a local cache
  cache: {
    recentVerifications: LRUCache<string, VerificationResult>;
    faceVectors: BloomFilter<FaceVector>;
    blacklist: Set<string>;
  };
  
  // Sync with central cluster
  syncInterval: Duration;
  conflictResolution: 'last-write-wins' | 'vector-clock';
}`}</code></pre>

          <h2>The Offline-First Revolution</h2>
          <p>
            Our biggest breakthrough was embracing offline-first design. In Nigeria, our largest market, internet connectivity is reliable only 60% of the time. We built our mobile SDK to work completely offline:
          </p>

          <h3>1. On-Device Biometric Processing</h3>
          <pre className="language-kotlin"><code>{`class OfflineBiometricProcessor {
    private val faceDetector = MobileNetV2.load("face_detection_model.tflite")
    private val livenessModel = CustomCNN.load("liveness_model.tflite")
    
    suspend fun processOffline(selfie: Bitmap): VerificationToken {
        // Step 1: Face detection (25ms on low-end devices)
        val faces = faceDetector.detectFaces(selfie)
        
        // Step 2: Liveness detection (50ms)
        val livenessScore = livenessModel.checkLiveness(faces.first())
        
        // Step 3: Generate cryptographic proof
        val proof = generateMerkleProof(
            imageHash = selfie.sha256(),
            faceVector = faces.first().toVector(),
            timestamp = System.currentTimeMillis(),
            deviceId = getSecureDeviceId()
        )
        
        // Step 4: Create offline token for later sync
        return VerificationToken(
            proof = proof,
            expiresAt = 72.hours.fromNow(),
            canSyncOffline = true
        )
    }
}`}</code></pre>

          <h3>2. Eventual Consistency Model</h3>
          <p>
            We designed our system to handle verifications that could be hours or even days old:
          </p>
          <pre className="language-go"><code>{`// Conflict resolution for offline verifications
type VerificationMerger struct {
    strategy MergeStrategy
}

func (vm *VerificationMerger) Merge(
    offline []OfflineVerification,
    online []OnlineVerification,
) ([]Verification, error) {
    // Sort by trust score, not timestamp
    sort.Slice(offline, func(i, j int) bool {
        return vm.calculateTrustScore(offline[i]) > 
               vm.calculateTrustScore(offline[j])
    })
    
    // Trust score factors:
    // - Device reputation (past fraud rate)
    // - Cryptographic proof validity
    // - Time drift compensation
    // - Location consistency
    
    merged := make([]Verification, 0)
    for _, v := range offline {
        if vm.isValid(v) && !vm.isDuplicate(v, online) {
            merged = append(merged, vm.promote(v))
        }
    }
    
    return merged, nil
}`}</code></pre>

          <h2>Optimizing for African Networks</h2>

          <h3>1. Adaptive Quality Streaming</h3>
          <p>
            We built a system that dynamically adjusts image quality based on network conditions:
          </p>
          <pre className="language-javascript"><code>{`class AdaptiveImageUploader {
  async upload(image: File): Promise<UploadResult> {
    const networkQuality = await this.measureNetworkQuality();
    
    // Start with lowest quality that maintains biometric accuracy
    let quality = this.getOptimalQuality(networkQuality);
    let attempt = 0;
    
    while (attempt < 3) {
      try {
        const compressed = await this.compress(image, quality);
        const result = await this.uploadWithTimeout(compressed, {
          timeout: this.calculateTimeout(compressed.size, networkQuality),
          chunkSize: networkQuality < 0.5 ? 16384 : 65536, // 16KB vs 64KB chunks
        });
        
        return result;
      } catch (error) {
        quality *= 0.7; // Reduce quality by 30%
        attempt++;
        
        if (attempt === 3) {
          // Fall back to offline mode
          return this.queueForOfflineSync(image);
        }
      }
    }
  }
  
  private calculateTimeout(size: number, quality: number): number {
    // Assume 2G speeds (20 Kbps) for worst case
    const worstCaseTime = (size * 8) / (20 * 1024);
    return Math.min(worstCaseTime * 3, 30000); // 3x buffer, max 30s
  }
}`}</code></pre>

          <h3>2. Delta Sync Protocol</h3>
          <p>
            Instead of sending full images, we developed a delta sync protocol:
          </p>
          <pre className="language-python"><code>{`class DeltaSyncProtocol:
    def generate_delta(self, image: np.ndarray, reference: np.ndarray) -> bytes:
        # Use perceptual hashing to find similar regions
        phash_new = self.perceptual_hash(image)
        phash_ref = self.perceptual_hash(reference)
        
        # Identify changed blocks (8x8 pixel blocks)
        changed_blocks = []
        for i in range(0, image.shape[0], 8):
            for j in range(0, image.shape[1], 8):
                block_new = image[i:i+8, j:j+8]
                block_ref = reference[i:i+8, j:j+8]
                
                if self.block_distance(block_new, block_ref) > threshold:
                    changed_blocks.append({
                        'position': (i, j),
                        'data': self.compress_block(block_new)
                    })
        
        # Average reduction: 70% for similar images
        return self.encode_delta(changed_blocks)`}</code></pre>

          <h2>The Face Matching Challenge at Scale</h2>
          
          <h3>1. Hierarchical Face Indexing</h3>
          <p>
            With 170M face vectors, linear search was impossible. We built a hierarchical index:
          </p>
          <pre className="language-rust"><code>{`struct HierarchicalFaceIndex {
    // Level 1: Country-based sharding
    country_shards: HashMap<CountryCode, RegionalIndex>,
    
    // Level 2: Demographic clustering (age, gender estimation)
    demographic_clusters: Vec<DemographicCluster>,
    
    // Level 3: Vector quantization for approximate search
    quantized_index: IVFIndex,
    
    // Level 4: Exact search within candidates
    exact_vectors: Vec<FaceVector>,
}

impl HierarchicalFaceIndex {
    fn search(&self, query: &FaceVector, k: usize) -> Vec<Match> {
        // Step 1: Route to correct shard (1ms)
        let shard = self.route_to_shard(query);
        
        // Step 2: Get demographic cluster (5ms)
        let cluster = shard.estimate_demographics(query);
        
        // Step 3: Approximate nearest neighbor search (20ms)
        let candidates = cluster.search_approximate(query, k * 10);
        
        // Step 4: Exact reranking (10ms)
        let matches = self.exact_rerank(candidates, query, k);
        
        // Total: ~36ms for searching 170M vectors
        matches
    }
}`}</code></pre>

          <h3>2. Fraud Detection at Scale</h3>
          <p>
            We built a real-time fraud detection system that processes every verification:
          </p>
          <pre className="language-python"><code>{`class FraudDetectionPipeline:
    def __init__(self):
        self.models = {
            'face_spoof': self.load_antispoofing_model(),
            'document_fraud': self.load_document_model(),
            'behavioral': self.load_behavioral_model(),
            'network_analysis': self.load_graph_model()
        }
    
    async def analyze(self, verification: Verification) -> FraudScore:
        # Parallel fraud checks
        results = await asyncio.gather(
            self.check_face_spoofing(verification.selfie),
            self.check_document_authenticity(verification.document),
            self.analyze_behavior_patterns(verification.metadata),
            self.check_network_fraud(verification.device_id)
        )
        
        # Weighted ensemble
        weights = [0.4, 0.3, 0.2, 0.1]  # Tuned on 10M labeled examples
        fraud_score = sum(w * r.score for w, r in zip(weights, results))
        
        # Real-time feedback loop
        if fraud_score > 0.8:
            await self.trigger_manual_review(verification)
            await self.update_device_reputation(verification.device_id, -10)
        
        return FraudScore(
            score=fraud_score,
            reasons=self.explain_score(results),
            confidence=self.calculate_confidence(results)
        )`}</code></pre>

          <h2>Infrastructure and DevOps</h2>

          <h3>1. Multi-Region Architecture</h3>
          <pre className="language-yaml"><code>{`# Our Kubernetes setup across African regions
regions:
  - name: nigeria-lagos
    provider: aws
    nodes: 45
    special_config:
      # Lagos has frequent power outages
      battery_backup: true
      redundant_networking: true
  
  - name: kenya-nairobi
    provider: google-cloud
    nodes: 30
    special_config:
      # Better connectivity to East Africa
      edge_locations: ["kampala", "dar-es-salaam"]
  
  - name: south-africa-cape-town
    provider: azure
    nodes: 25
    special_config:
      # Serves Southern African countries
      compliance: ["popia", "gdpr"]

# Cross-region replication
replication:
  strategy: "eventual-consistency"
  lag_target: "< 5 minutes"
  conflict_resolution: "vector-clocks"`}</code></pre>

          <h3>2. Chaos Engineering for African Infrastructure</h3>
          <p>
            We built custom chaos engineering tools that simulate African infrastructure challenges:
          </p>
          <pre className="language-go"><code>{`type AfricanChaosMonkey struct {
    scenarios []ChaosScenario
}

func (acm *AfricanChaosMonkey) RunScenarios() {
    scenarios := []ChaosScenario{
        // Simulate 2G network conditions
        &NetworkDegradation{
            Bandwidth:  20 * Kbps,
            Latency:    800 * Millisecond,
            PacketLoss: 0.15, // 15% packet loss
        },
        
        // Simulate power outages
        &PowerOutage{
            Duration: 4 * Hour,
            AffectedNodes: 0.3, // 30% of nodes
        },
        
        // Simulate mobile money API failures
        &ThirdPartyFailure{
            Service: "MobileMoneyAPI",
            ErrorRate: 0.25,
            Timeout: 30 * Second,
        },
        
        // Simulate device clock drift (common issue)
        &ClockDrift{
            MaxDrift: 6 * Hour,
            AffectedDevices: 0.4,
        },
    }
    
    for _, scenario := range scenarios {
        acm.execute(scenario)
        acm.measureRecovery()
    }
}`}</code></pre>

          <h2>Lessons Learned</h2>

          <h3>1. Embrace Constraints</h3>
          <p>
            African infrastructure constraints forced us to build better software:
          </p>
          <ul>
            <li><strong>Offline-first:</strong> Made our system resilient to any network condition</li>
            <li><strong>Edge computing:</strong> Reduced latency and bandwidth costs</li>
            <li><strong>Efficient algorithms:</strong> Every byte and millisecond counted</li>
          </ul>

          <h3>2. Local Context Matters</h3>
          <p>
            Technical solutions must align with local realities:
          </p>
          <ul>
            <li>SMS is more reliable than push notifications</li>
            <li>USSD interfaces reach more users than apps</li>
            <li>Feature phones still matter (we built a USSD + SMS verification flow)</li>
            <li>Power banks are part of your infrastructure planning</li>
          </ul>

          <h3>3. Fraud Patterns are Regional</h3>
          <p>
            Different countries had completely different fraud patterns:
          </p>
          <pre className="language-python"><code>{`fraud_patterns = {
    'nigeria': {
        'common': ['face_morphing', 'sim_swap', 'device_farms'],
        'detection': 'behavioral_biometrics'
    },
    'kenya': {
        'common': ['document_forgery', 'identity_theft'],
        'detection': 'document_verification_enhanced'
    },
    'ghana': {
        'common': ['synthetic_identities', 'age_fabrication'],
        'detection': 'cross_reference_national_db'
    }
}`}</code></pre>

          <h3>4. Build for the Next Billion Users</h3>
          <p>
            The next billion internet users won't have iPhone 15s and fiber connections. They'll have:
          </p>
          <ul>
            <li>$50 Android phones</li>
            <li>Intermittent 2G/3G connectivity</li>
            <li>Pay-per-MB data plans</li>
            <li>Shared devices</li>
            <li>Limited digital literacy</li>
          </ul>
          <p>
            Building for these users isn't just about reaching new markets—it's about building better, more resilient systems for everyone.
          </p>

          <h2>The Impact</h2>
          <p>
            Today, SmileID's infrastructure:
          </p>
          <ul>
            <li>Processes 10,000+ verifications per second</li>
            <li>Maintains 99.95% uptime despite infrastructure challenges</li>
            <li>Reduced verification time from 5 minutes to 8 seconds</li>
            <li>Decreased data usage by 85% through optimization</li>
            <li>Enabled financial inclusion for 50M+ previously unbanked users</li>
          </ul>

          <h2>What's Next?</h2>
          <p>
            We're now working on:
          </p>
          <ul>
            <li><strong>Federated learning:</strong> Train models on-device without uploading sensitive data</li>
            <li><strong>Blockchain identity:</strong> Decentralized identity verification</li>
            <li><strong>Satellite connectivity:</strong> Partnering with Starlink for rural coverage</li>
            <li><strong>Voice biometrics:</strong> For feature phone users</li>
          </ul>

          <h2>Conclusion</h2>
          <p>
            Scaling to 170 million users in Africa taught us that constraints breed innovation. By embracing the unique challenges of the African market—unreliable connectivity, low-end devices, and infrastructure gaps—we built a system that's not just resilient but revolutionary.
          </p>
          <p>
            The future of technology isn't being built in Silicon Valley. It's being forged in Lagos traffic jams, Nairobi's silicon savannah, and Ghana's mobile money kiosks. And it's more exciting than anything I've ever worked on.
          </p>

          <div className="mt-12 p-6 glass rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Interested in scaling systems for emerging markets?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              I occasionally advise startups building for the next billion users. Reach out if you're tackling similar challenges.
            </p>
            <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
              Get in touch →
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}