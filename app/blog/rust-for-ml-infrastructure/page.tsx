import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why We Rewrote Our ML Pipeline in Rust',
  description: '10x performance improvement and 90% cost reduction. A case study in migrating Python ML infrastructure to Rust, including benchmarks and lessons learned.',
};

export default function RustForMLInfrastructurePage() {
  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Why We Rewrote Our ML Pipeline in Rust
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime="2023-08-15">August 15, 2023</time>
            <span>•</span>
            <span>15 min read</span>
            <span>•</span>
            <span>41,000 views</span>
          </div>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="lead text-lg">
            When our Python-based ML pipeline started costing $180,000/month to run, we knew something had to change. After months of optimization attempts—async processing, Cython extensions, multiprocessing pools—we were still hitting fundamental performance limits. Then we made a radical decision: rewrite everything in Rust. The results exceeded our wildest expectations.
          </p>

          <h2>The Breaking Point</h2>
          <p>
            Our ML infrastructure processed biometric data for 170 million users across Africa. Every day, we handled:
          </p>
          <ul>
            <li>50 million face verifications</li>
            <li>10 million document scans</li>
            <li>2TB of image preprocessing</li>
            <li>500GB of feature extraction</li>
          </ul>
          <p>
            The Python pipeline worked, but it was bleeding money. Here's what our costs looked like:
          </p>
          <pre className="language-python"><code>{`# Monthly Infrastructure Costs (Python)
compute_costs = {
    "preprocessing": {
        "instances": 120,  # c5.4xlarge
        "cost_per_hour": 0.68,
        "monthly": 58752  # $58,752
    },
    "feature_extraction": {
        "instances": 80,   # p3.2xlarge (GPU)
        "cost_per_hour": 3.06,
        "monthly": 176256  # $176,256
    },
    "matching": {
        "instances": 60,   # m5.8xlarge
        "cost_per_hour": 1.54,
        "monthly": 66528  # $66,528
    }
}
total_monthly = sum(c["monthly"] for c in compute_costs.values())
# Total: $301,536/month 😱`}</code></pre>

          <h2>Why Rust?</h2>
          <p>
            We evaluated several options:
          </p>
          <ul>
            <li><strong>Go:</strong> Great concurrency, but lacks SIMD support we needed</li>
            <li><strong>C++:</strong> Maximum performance, but memory safety concerns at scale</li>
            <li><strong>Julia:</strong> Good for numerics, but ecosystem too immature</li>
            <li><strong>Rust:</strong> Memory safety + performance + growing ML ecosystem</li>
          </ul>

          <h2>The Migration Strategy</h2>
          <p>
            We couldn't rewrite everything at once—we had to keep the service running. Our approach:
          </p>

          <h3>Phase 1: Performance Profiling</h3>
          <pre className="language-python"><code>{`import cProfile
import pstats
from memory_profiler import profile

@profile
def process_image(image_bytes):
    # Original Python implementation
    img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    faces = face_detector.detect(img)
    
    for face in faces:
        aligned = align_face(img, face)
        features = extract_features(aligned)
        normalized = normalize_features(features)
    
    return normalized

# Profiling revealed:
# - 40% time in numpy array copies
# - 25% time in Python loops
# - 20% time in GIL contention
# - 15% actual computation`}</code></pre>

          <h3>Phase 2: Rust Core with Python Bindings</h3>
          <p>
            We started by rewriting the hot paths in Rust and exposing them via PyO3:
          </p>
          <pre className="language-rust"><code>{`use pyo3::prelude::*;
use ndarray::{Array2, ArrayView2};
use rayon::prelude::*;

#[pyclass]
struct FaceProcessor {
    detector: Arc<dyn FaceDetector>,
    aligner: Arc<dyn FaceAligner>,
    extractor: Arc<dyn FeatureExtractor>,
}

#[pymethods]
impl FaceProcessor {
    #[new]
    fn new() -> PyResult<Self> {
        Ok(FaceProcessor {
            detector: Arc::new(RetinaFaceDetector::new()?),
            aligner: Arc::new(SimilarityTransform::new()),
            extractor: Arc::new(ArcFaceExtractor::new()?),
        })
    }

    fn process_batch(&self, images: Vec<Vec<u8>>) -> PyResult<Vec<Array2<f32>>> {
        // Process images in parallel using Rayon
        let results: Vec<_> = images
            .par_iter()
            .map(|img_bytes| self.process_single(img_bytes))
            .collect();
        
        // Convert to Python-compatible format
        Ok(results.into_iter().filter_map(Result::ok).collect())
    }
    
    fn process_single(&self, image_bytes: &[u8]) -> Result<Array2<f32>> {
        // Decode image using image-rs (faster than OpenCV)
        let img = image::load_from_memory(image_bytes)?;
        
        // Face detection with SIMD-optimized operations
        let faces = self.detector.detect_faces(&img)?;
        
        // Process faces in parallel
        let features: Vec<_> = faces
            .par_iter()
            .map(|face| {
                let aligned = self.aligner.align(&img, face)?;
                self.extractor.extract(&aligned)
            })
            .filter_map(Result::ok)
            .collect();
        
        // Return averaged features
        Ok(average_features(&features))
    }
}`}</code></pre>

          <h3>Phase 3: Full Rust Pipeline</h3>
          <p>
            Once we proved the concept, we went all-in:
          </p>
          <pre className="language-rust"><code>{`// Complete Rust ML pipeline
use tokio::runtime::Runtime;
use axum::{Router, Json};
use tower::ServiceBuilder;
use tower_http::compression::CompressionLayer;

struct MLPipeline {
    preprocessor: ImagePreprocessor,
    face_processor: FaceProcessor,
    matcher: BiometricMatcher,
    cache: Arc<DashMap<String, Features>>,
}

impl MLPipeline {
    async fn process_request(&self, req: VerificationRequest) -> Result<VerificationResponse> {
        // Check cache first
        if let Some(cached) = self.cache.get(&req.image_hash) {
            return self.matcher.verify(&cached, &req.reference_id).await;
        }
        
        // Decode and preprocess
        let image = self.preprocessor
            .decode_and_normalize(&req.image_data)
            .await?;
        
        // Extract features with CPU/GPU parallelism
        let features = self.face_processor
            .extract_features(image)
            .await?;
        
        // Cache for future requests
        self.cache.insert(req.image_hash.clone(), features.clone());
        
        // Perform matching
        self.matcher.verify(&features, &req.reference_id).await
    }
}

// SIMD-optimized feature matching
#[target_feature(enable = "avx2")]
unsafe fn cosine_similarity_avx2(a: &[f32], b: &[f32]) -> f32 {
    use std::arch::x86_64::*;
    
    let mut dot_product = _mm256_setzero_ps();
    let mut norm_a = _mm256_setzero_ps();
    let mut norm_b = _mm256_setzero_ps();
    
    for i in (0..a.len()).step_by(8) {
        let va = _mm256_loadu_ps(a.as_ptr().add(i));
        let vb = _mm256_loadu_ps(b.as_ptr().add(i));
        
        dot_product = _mm256_fmadd_ps(va, vb, dot_product);
        norm_a = _mm256_fmadd_ps(va, va, norm_a);
        norm_b = _mm256_fmadd_ps(vb, vb, norm_b);
    }
    
    // Horizontal sum
    let dot = hsum_ps_avx2(dot_product);
    let na = hsum_ps_avx2(norm_a).sqrt();
    let nb = hsum_ps_avx2(norm_b).sqrt();
    
    dot / (na * nb)
}`}</code></pre>

          <h2>The Results</h2>

          <h3>Performance Improvements</h3>
          <pre className="language-javascript"><code>{`const benchmarks = {
  imageDecoding: {
    python: 45,    // ms
    rust: 3,       // ms
    improvement: "15x faster"
  },
  faceDetection: {
    python: 120,   // ms
    rust: 8,       // ms
    improvement: "15x faster"
  },
  featureExtraction: {
    python: 85,    // ms
    rust: 12,      // ms (with SIMD)
    improvement: "7x faster"
  },
  matching1M: {
    python: 2400,  // ms (1M comparisons)
    rust: 45,      // ms (with AVX2)
    improvement: "53x faster"
  },
  totalPipeline: {
    python: 280,   // ms
    rust: 28,      // ms
    improvement: "10x faster"
  }
};`}</code></pre>

          <h3>Cost Reduction</h3>
          <pre className="language-javascript"><code>{`const newCosts = {
  before: {
    instances: 260,
    monthlyCompute: 301536,  // $301,536
    monthlybandwidth: 18000, // $18,000
    total: 319536           // $319,536/month
  },
  after: {
    instances: 24,          // 91% reduction
    monthlyCompute: 28800,  // $28,800
    monthlyBandwidth: 12000, // $12,000 (better compression)
    total: 40800           // $40,800/month
  },
  savings: {
    monthly: 278736,        // $278,736
    annual: 3344832,       // $3.3M 🎉
    percentage: 87.2       // 87.2% reduction
  }
};`}</code></pre>

          <h2>Unexpected Benefits</h2>

          <h3>1. Better Error Handling</h3>
          <p>
            Rust's Result type forced us to handle errors properly:
          </p>
          <pre className="language-rust"><code>{`// Python: Silent failures everywhere
try:
    result = process_image(img)
except:
    result = None  # 🤷 Who knows what went wrong

// Rust: Explicit error handling
match process_image(&img) {
    Ok(features) => features,
    Err(ProcessingError::FaceNotFound) => {
        metrics.increment_counter("face_not_found");
        return Err(ApiError::NoFaceDetected);
    }
    Err(ProcessingError::ImageCorrupt(e)) => {
        log::warn!("Corrupt image: {}", e);
        return Err(ApiError::InvalidImage(e.to_string()));
    }
    Err(e) => {
        log::error!("Unexpected error: {}", e);
        return Err(ApiError::Internal);
    }
}`}</code></pre>

          <h3>2. Memory Safety = Reliability</h3>
          <p>
            Our Python service had memory leaks that required daily restarts. The Rust service has been running for 6 months without a single memory-related issue.
          </p>

          <h3>3. Incredible Tooling</h3>
          <pre className="language-bash"><code>{`# Cargo makes dependency management a breeze
cargo add tokio --features full
cargo add ndarray --features blas
cargo add image

# Built-in benchmarking
cargo bench

# Amazing profiling with flamegraph
cargo flamegraph --bin ml-pipeline

# Fantastic error messages
error[E0382]: use of moved value: `features`
  --> src/pipeline.rs:42:15
   |
41 |     cache.insert(key, features);
   |                       -------- value moved here
42 |     Ok(features)
   |        ^^^^^^^^ value used here after move`}</code></pre>

          <h2>The Challenges</h2>

          <h3>1. Learning Curve</h3>
          <p>
            Rust has a steep learning curve. Our team spent 2 months learning before being productive. Key concepts that tripped us up:
          </p>
          <ul>
            <li>Ownership and borrowing</li>
            <li>Lifetimes in async code</li>
            <li>Trait bounds in generic code</li>
            <li>The Pin/Unpin rabbit hole</li>
          </ul>

          <h3>2. Ecosystem Gaps</h3>
          <p>
            Some ML libraries we relied on didn't have Rust equivalents. We had to:
          </p>
          <ul>
            <li>Write our own ONNX runtime bindings</li>
            <li>Port critical NumPy operations to ndarray</li>
            <li>Build custom image augmentation pipelines</li>
          </ul>

          <h3>3. Debugging Complexity</h3>
          <pre className="language-rust"><code>{`// This error message broke our brains for a week
error[E0495]: cannot infer an appropriate lifetime for autoref due to conflicting requirements
  --> src/lib.rs:123:45
   |
123 |         let features = self.extractor.extract(&aligned_face).await?;
   |                                       ^^^^^^^
   |
note: first, the lifetime cannot outlive the lifetime `'a` as defined on the method body at 120:5...`}</code></pre>

          <h2>Lessons Learned</h2>

          <h3>1. Profile Before Rewriting</h3>
          <p>
            We wasted a month rewriting parts that weren't bottlenecks. Always profile first:
          </p>
          <pre className="language-bash"><code>{`# Python profiling
python -m cProfile -o profile.out ml_pipeline.py
snakeviz profile.out

# Rust profiling  
cargo build --release
perf record --call-graph=dwarf target/release/ml-pipeline
perf report`}</code></pre>

          <h3>2. Incremental Migration Works</h3>
          <p>
            Don't rewrite everything at once. Our migration path:
          </p>
          <ol>
            <li>Identify hottest code paths (20% of code, 80% of runtime)</li>
            <li>Write Rust replacements with Python bindings</li>
            <li>A/B test Rust vs Python in production</li>
            <li>Gradually increase Rust traffic</li>
            <li>Rewrite remaining components</li>
          </ol>

          <h3>3. Rust Changes How You Think</h3>
          <p>
            After Rust, our Python code improved too. We started thinking about:
          </p>
          <ul>
            <li>Ownership of data</li>
            <li>Explicit error handling</li>
            <li>Zero-copy operations</li>
            <li>Cache-friendly data structures</li>
          </ul>

          <h2>Should You Rewrite in Rust?</h2>

          <h3>Yes, if:</h3>
          <ul>
            <li>Performance directly impacts costs (our case)</li>
            <li>You need predictable latency</li>
            <li>Memory safety is critical</li>
            <li>You have time to invest in learning</li>
          </ul>

          <h3>No, if:</h3>
          <ul>
            <li>Your bottleneck is I/O, not CPU</li>
            <li>Python performance is "good enough"</li>
            <li>You need to iterate quickly on algorithms</li>
            <li>Your team isn't ready for the learning curve</li>
          </ul>

          <h2>The Code</h2>
          <p>
            We've open-sourced key components of our Rust ML pipeline:
          </p>
          <ul>
            <li><a href="https://github.com/example/rust-face-detection" className="text-blue-600 dark:text-blue-400 hover:underline">rust-face-detection</a> - SIMD-optimized face detection</li>
            <li><a href="https://github.com/example/biometric-matching" className="text-blue-600 dark:text-blue-400 hover:underline">biometric-matching</a> - High-performance feature matching</li>
            <li><a href="https://github.com/example/ml-pipeline-rs" className="text-blue-600 dark:text-blue-400 hover:underline">ml-pipeline-rs</a> - The complete pipeline framework</li>
          </ul>

          <h2>What's Next?</h2>
          <p>
            Rust has fundamentally changed how we build ML infrastructure. We're now exploring:
          </p>
          <ul>
            <li><strong>WebAssembly:</strong> Running models in the browser</li>
            <li><strong>Embedded:</strong> Rust on edge devices</li>
            <li><strong>GPU Compute:</strong> Rust + CUDA for custom kernels</li>
          </ul>

          <p>
            The future of ML infrastructure isn't just about better models—it's about better systems. And Rust is helping us build those systems.
          </p>

          <div className="mt-12 p-6 glass rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Learn More</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Want to dive deeper into Rust for ML? Check out these resources:
            </p>
            <ul className="space-y-2">
              <li>
                <a href="https://www.rust-lang.org/learn" className="text-blue-600 dark:text-blue-400 hover:underline">
                  The Rust Programming Language Book
                </a>
              </li>
              <li>
                <a href="https://github.com/rust-ml" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Rust ML Organization
                </a>
              </li>
              <li>
                <a href="/blog/rust-ml-ecosystem" className="text-blue-600 dark:text-blue-400 hover:underline">
                  My guide to the Rust ML ecosystem →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  );
}