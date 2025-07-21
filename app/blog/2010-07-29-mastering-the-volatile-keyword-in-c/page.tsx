import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-07-30"
      title="Mastering the Volatile Keyword in C"
      summary="After a week debugging interrupt handlers, finally understanding when and why to use volatile. This keyword will save your embedded projects."
      content={`Spent three days debugging an interrupt handler that "randomly" failed. The culprit? Missing volatile keyword. Time to properly understand this misunderstood part of C.

## The Mysterious Bug

My interrupt handler looked fine:
\`\`\`c
int flag = 0;

void interrupt_handler() {
    flag = 1;
}

int main() {
    while(flag == 0) {
        // Wait for interrupt
    }
    // Never gets here!
}
\`\`\`

With optimization on, the loop never exits. Why?

## Compiler Optimization Gone Wrong

The compiler sees:
1. flag is set to 0
2. Nothing in the while loop changes flag
3. Therefore, flag is always 0
4. Optimize to: while(1)

It doesn't know about interrupts!

## Enter Volatile

\`\`\`c
volatile int flag = 0;
\`\`\`

This tells the compiler: "This variable can change at any time, outside your view. Always read it from memory."

## When to Use Volatile

### 1. Hardware Registers
\`\`\`c
#define GPIO_PORT (*(volatile uint32_t*)0x40021000)

// Read actual hardware state every time
if (GPIO_PORT & 0x01) {
    // Pin is high
}
\`\`\`

### 2. Interrupt Shared Variables
\`\`\`c
volatile uint32_t tick_count = 0;

void SysTick_Handler() {
    tick_count++;  // Modified in ISR
}

void delay_ms(uint32_t ms) {
    uint32_t start = tick_count;
    while ((tick_count - start) < ms) {
        // Actually re-reads tick_count
    }
}
\`\`\`

### 3. Multi-threaded Shared Data
\`\`\`c
volatile int stop_thread = 0;

void* worker_thread(void* arg) {
    while (!stop_thread) {
        do_work();
    }
    return NULL;
}
\`\`\`

## Common Misconceptions

### Volatile Is NOT Atomic
\`\`\`c
volatile int counter = 0;
counter++;  // Still NOT atomic!
\`\`\`

This is actually:
1. Read counter
2. Add 1
3. Write back

Interrupts can happen between steps!

### Volatile Is NOT a Memory Barrier
Doesn't prevent CPU reordering. For that, you need proper memory barriers.

### Volatile Is NOT Thread-Safe
Prevents compiler optimization, not race conditions. Still need mutexes!

## Real-World Examples

### UART Receive
\`\`\`c
volatile char uart_buffer[256];
volatile uint8_t uart_head = 0;
volatile uint8_t uart_tail = 0;

void UART_IRQHandler() {
    uart_buffer[uart_head++] = UART->DR;
}

char uart_getc() {
    while (uart_head == uart_tail) {
        // Wait for data
    }
    return uart_buffer[uart_tail++];
}
\`\`\`

### Watchdog Timer
\`\`\`c
volatile uint32_t wdt_counter = 0;

void WDT_IRQHandler() {
    wdt_counter = 0;  // Reset by interrupt
}

void main_loop() {
    while (1) {
        wdt_counter++;
        if (wdt_counter > WDT_TIMEOUT) {
            system_reset();  // We're stuck!
        }
        do_work();
    }
}
\`\`\`

## Assembly Analysis

Compiled with -O2:

Without volatile:
\`\`\`asm
mov r0, #0       ; Load 0 once
loop:
    b loop       ; Infinite loop!
\`\`\`

With volatile:
\`\`\`asm
loop:
    ldr r0, [r1] ; Actually read memory
    cmp r0, #0   ; Check value
    beq loop     ; Loop if still 0
\`\`\`

## Debugging Tips

1. **Mysterious infinite loops?** Check volatile
2. **Works with -O0 but not -O2?** Probably missing volatile
3. **Interrupt flags not working?** Volatile!
4. **Hardware registers reading wrong?** Volatile!

## Performance Impact

Volatile prevents optimization:
- No register caching
- No loop optimization
- No dead code elimination

Use sparingly! Only for variables that truly need it.

## Best Practices

1. **Document why**: Comment volatile usage
2. **Minimize scope**: Make only what's necessary volatile
3. **Consider alternatives**: Sometimes better architecture avoids volatile
4. **Test optimized**: Always test with optimization on
5. **Use stdatomic.h**: For truly atomic operations (C11)

## Conclusion

Volatile is a promise to the compiler: "Trust me, this can change." Use it for:
- Hardware registers
- ISR communication
- External modification

Don't use it for:
- Thread synchronization (use proper primitives)
- Atomic operations (use atomic types)
- General "please don't optimize" (fix your code instead)

Understanding volatile transformed my embedded programming. No more mysterious bugs that disappear in debug mode!`}
      tags={["c-programming","embedded","volatile","optimization"]}
      readTime="15 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Mastering the Volatile Keyword in C - Michael D'Angelo",
    description: "After a week debugging interrupt handlers, finally understanding when and why to use volatile. This keyword will save your embedded projects.",
  };
}