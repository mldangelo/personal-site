import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-02-10"
      title="GPU Computing with CUDA: Parallel Processing Power"
      summary="Discovering the massive parallel processing power of GPUs. From bitcoin mining to neural networks, CUDA changes everything."
      content={`Just installed my first real GPU - an NVIDIA GTX 460 - and discovered CUDA programming. The parallel processing power is mind-blowing. Suddenly, computations that took hours run in seconds.

## Why GPU Computing?

CPUs are optimized for sequential tasks:
- Few cores (2-4 typical)
- Complex control logic
- Large caches
- Branch prediction

GPUs are optimized for parallel tasks:
- Hundreds of cores (336 on GTX 460!)
- Simple control logic
- Small caches
- Same operation on many data points

Perfect for embarrassingly parallel problems.

## Getting Started with CUDA

### Hello World
\`\`\`cuda
__global__ void hello_kernel() {
    printf("Hello from thread %d\n", threadIdx.x);
}

int main() {
    hello_kernel<<<1, 10>>>();
    cudaDeviceSynchronize();
    return 0;
}
\`\`\`

That <<<1, 10>>> syntax? That's launching 10 parallel threads!

### Understanding the Hierarchy
- **Thread**: Single execution unit
- **Block**: Group of threads (up to 1024)
- **Grid**: Group of blocks
- **Warp**: 32 threads executing in lockstep

## First Real Project: Matrix Multiplication

### CPU Version (Naive)
\`\`\`c
void matrix_multiply_cpu(float *A, float *B, float *C, int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            float sum = 0;
            for (int k = 0; k < N; k++) {
                sum += A[i*N + k] * B[k*N + j];
            }
            C[i*N + j] = sum;
        }
    }
}
\`\`\`

Time for 1024×1024: 8.2 seconds

### GPU Version (Basic)
\`\`\`cuda
__global__ void matrix_multiply_gpu(float *A, float *B, float *C, int N) {
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    
    if (row < N && col < N) {
        float sum = 0;
        for (int k = 0; k < N; k++) {
            sum += A[row*N + k] * B[k*N + col];
        }
        C[row*N + col] = sum;
    }
}
\`\`\`

Time for 1024×1024: 0.12 seconds (68× speedup!)

### GPU Version (Optimized with Shared Memory)
\`\`\`cuda
__global__ void matrix_multiply_tiled(float *A, float *B, float *C, int N) {
    __shared__ float As[TILE_SIZE][TILE_SIZE];
    __shared__ float Bs[TILE_SIZE][TILE_SIZE];
    
    int bx = blockIdx.x, by = blockIdx.y;
    int tx = threadIdx.x, ty = threadIdx.y;
    
    int row = by * TILE_SIZE + ty;
    int col = bx * TILE_SIZE + tx;
    
    float sum = 0;
    
    for (int t = 0; t < (N + TILE_SIZE - 1) / TILE_SIZE; t++) {
        if (row < N && t*TILE_SIZE + tx < N)
            As[ty][tx] = A[row*N + t*TILE_SIZE + tx];
        else
            As[ty][tx] = 0;
            
        if (col < N && t*TILE_SIZE + ty < N)
            Bs[ty][tx] = B[(t*TILE_SIZE + ty)*N + col];
        else
            Bs[ty][tx] = 0;
            
        __syncthreads();
        
        for (int k = 0; k < TILE_SIZE; k++)
            sum += As[ty][k] * Bs[k][tx];
            
        __syncthreads();
    }
    
    if (row < N && col < N)
        C[row*N + col] = sum;
}
\`\`\`

Time for 1024×1024: 0.018 seconds (455× speedup!)

## Bitcoin Mining

Perfect CUDA application:
\`\`\`cuda
__global__ void bitcoin_mine(uint32_t *nonce_start, uint32_t *results) {
    uint32_t nonce = *nonce_start + blockIdx.x * blockDim.x + threadIdx.x;
    
    // Simplified - real implementation is more complex
    uint32_t hash[8];
    sha256_transform(block_header, nonce, hash);
    
    if (hash[7] == 0 && hash[6] == 0) {  // Difficulty check
        results[0] = nonce;  // Found valid hash!
    }
}
\`\`\`

Getting 95 MH/s vs 2 MH/s on CPU!

## Neural Network Training

Training a simple feedforward network:

### Forward Pass
\`\`\`cuda
__global__ void forward_pass(float *input, float *weights, 
                            float *output, int n_in, int n_out) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n_out) {
        float sum = 0;
        for (int i = 0; i < n_in; i++) {
            sum += input[i] * weights[i * n_out + idx];
        }
        output[idx] = 1.0f / (1.0f + expf(-sum));  // Sigmoid
    }
}
\`\`\`

Training MNIST: 50× faster than CPU!

## Image Processing

Gaussian blur on GPU:
\`\`\`cuda
__global__ void gaussian_blur(uint8_t *input, uint8_t *output, 
                             int width, int height) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    
    if (x >= width || y >= height) return;
    
    float kernel[5][5] = { /* Gaussian kernel values */ };
    float sum = 0;
    
    for (int ky = -2; ky <= 2; ky++) {
        for (int kx = -2; kx <= 2; kx++) {
            int px = min(max(x + kx, 0), width - 1);
            int py = min(max(y + ky, 0), height - 1);
            sum += input[py * width + px] * kernel[ky+2][kx+2];
        }
    }
    
    output[y * width + x] = (uint8_t)sum;
}
\`\`\`

Processing 1080p video in real-time!

## Profiling and Optimization

Using nvprof revealed issues:
1. **Memory bandwidth limited** - Use shared memory
2. **Low occupancy** - Adjust block size
3. **Divergent warps** - Minimize branches
4. **Uncoalesced access** - Align memory patterns

## Lessons Learned

### The Good
1. **Massive speedups possible** - 100× is common
2. **Great for specific problems** - Parallel, arithmetic heavy
3. **Active ecosystem** - Libraries for everything
4. **Skills transfer** - OpenCL, compute shaders similar

### The Challenging
1. **Different programming model** - Think parallel
2. **Memory management** - Manual and complex
3. **Debugging is hard** - Thousands of threads
4. **Not everything parallelizes** - Amdahl's Law

## Future Projects

Now that I have GPU power:
- Ray tracing renderer
- Fluid dynamics simulation
- Deep learning experiments
- Protein folding?
- Password cracking (ethically!)

## Resources That Helped

- NVIDIA's CUDA guides (excellent)
- Udacity's CS344 course
- GPU Gems books
- Stack Overflow (as always)

## Conclusion

CUDA programming opened a new world of computational possibilities. Problems I thought were intractable on my desktop suddenly become feasible.

The future is parallel, and it's incredibly exciting. Time to port everything to GPU!`}
      tags={["cuda","gpu","parallel-computing","optimization"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "GPU Computing with CUDA: Parallel Processing Power - Michael D'Angelo",
    description: "Discovering the massive parallel processing power of GPUs. From bitcoin mining to neural networks, CUDA changes everything.",
  };
}