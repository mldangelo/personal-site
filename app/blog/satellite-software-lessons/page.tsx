import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Building Satellites Taught Me About Software',
  description: "Fault tolerance isn't optional when you can't push a hotfix to space. Engineering principles from aerospace that made me a better software developer.",
};

export default function SatelliteSoftwareLessonsPage() {
  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            What Building Satellites Taught Me About Software
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime="2023-07-03">July 3, 2023</time>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span>25,000 views</span>
          </div>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="lead text-lg">
            In 2008, I joined a team building nanosatellites at Brown University. I was 19, had never soldered anything more complex than a LED, and suddenly found myself writing code that would run 400 miles above Earth. The lessons I learned debugging systems I could never physically touch fundamentally changed how I approach software engineering.
          </p>

          <h2>You Can't SSH Into Space</h2>
          <p>
            The first thing that hits you when writing satellite software is the finality of deployment. Once your code is flying at 17,000 mph in low Earth orbit, there's no rollback button. No quick patches. No "let me just SSH in and check the logs."
          </p>
          <p>
            Our satellite, EQUiSat, had exactly one shot to work. Here's what that meant in practice:
          </p>
          <pre className="language-c"><code>{`// Every. Single. Line. Had to be bulletproof.
void deploy_solar_panels() {
    // Check battery voltage first
    if (get_battery_voltage() < MIN_DEPLOYMENT_VOLTAGE) {
        log_error(ERROR_INSUFFICIENT_POWER);
        schedule_retry(RETRY_INTERVAL_SECONDS);
        return;
    }
    
    // Verify we're not in eclipse
    if (in_eclipse()) {
        log_error(ERROR_IN_ECLIPSE);
        schedule_retry(RETRY_INTERVAL_SECONDS);
        return;
    }
    
    // Check deployment hasn't already occurred
    if (read_deployment_flag()) {
        log_warning(WARNING_ALREADY_DEPLOYED);
        return;
    }
    
    // Redundant deployment mechanisms
    for (int i = 0; i < 3; i++) {
        activate_burn_wire(i);
        delay_ms(BURN_DURATION_MS);
        
        if (verify_panel_deployed(i)) {
            set_deployment_flag(i);
            log_success(SUCCESS_PANEL_DEPLOYED, i);
        } else {
            log_error(ERROR_DEPLOYMENT_FAILED, i);
            // Try backup mechanism
            activate_backup_release(i);
        }
    }
}`}</code></pre>

          <h2>Lesson 1: Design for Failure</h2>
          <p>
            In space, everything fails. Solar panels degrade. Batteries die. Cosmic rays flip bits in your memory. The satellite doesn't care about your beautiful architecture—it cares about surviving.
          </p>

          <h3>Triple Redundancy Everywhere</h3>
          <pre className="language-c"><code>{`typedef struct {
    uint16_t value_a;  // Primary sensor
    uint16_t value_b;  // Backup sensor
    uint16_t value_c;  // Tie-breaker
} TripleRedundant;

uint16_t get_reliable_reading(TripleRedundant* data) {
    // If all three agree, we're golden
    if (data->value_a == data->value_b && data->value_b == data->value_c) {
        return data->value_a;
    }
    
    // Two out of three agree
    if (data->value_a == data->value_b) return data->value_a;
    if (data->value_b == data->value_c) return data->value_b;
    if (data->value_a == data->value_c) return data->value_a;
    
    // All three disagree - return median
    return median3(data->value_a, data->value_b, data->value_c);
}`}</code></pre>

          <p>
            This paranoia about failure has served me well in production systems. Now when I design APIs, I think:
          </p>
          <ul>
            <li>What happens when the database is down?</li>
            <li>What if the cache is corrupted?</li>
            <li>How do we handle partial failures?</li>
            <li>Can we degrade gracefully?</li>
          </ul>

          <h2>Lesson 2: Watchdogs Are Your Friend</h2>
          <p>
            Our satellite had a hardware watchdog timer that would reset the entire system if not "pet" every 8 seconds. Miss the deadline? Automatic reboot. It seemed draconian until it saved us.
          </p>
          <pre className="language-c"><code>{`// Main control loop
void satellite_main_loop() {
    init_watchdog(WDT_8_SECONDS);
    
    while (1) {
        // Start of loop timing
        uint32_t loop_start = get_timestamp_ms();
        
        // Critical tasks that MUST complete
        read_sensors();
        update_attitude_control();
        check_battery_levels();
        
        // Pet the watchdog - we're still alive!
        reset_watchdog();
        
        // Non-critical tasks (can be interrupted)
        if (time_remaining_ms(loop_start) > 1000) {
            process_ground_commands();
            compress_telemetry();
        }
        
        // Ensure consistent loop timing
        while (get_timestamp_ms() - loop_start < LOOP_PERIOD_MS) {
            enter_low_power_mode();
        }
    }
}`}</code></pre>

          <p>
            I now implement similar patterns in production services:
          </p>
          <pre className="language-go"><code>{`func (s *Server) StartHealthMonitor() {
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop()
    
    for range ticker.C {
        ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
        
        if err := s.HealthCheck(ctx); err != nil {
            log.Error("Health check failed", "error", err)
            s.metrics.IncrementHealthCheckFailures()
            
            if s.consecutiveFailures > MaxFailures {
                log.Fatal("Too many health check failures, shutting down")
                // Let orchestrator restart us
                os.Exit(1)
            }
        } else {
            s.consecutiveFailures = 0
        }
        
        cancel()
    }
}`}</code></pre>

          <h2>Lesson 3: Telemetry Is Everything</h2>
          <p>
            When your system is 400 miles away, logs are gold. But bandwidth is extremely limited—we could only downlink 1200 bits per second. Every bit of telemetry had to count.
          </p>
          <pre className="language-c"><code>{`// Packed telemetry structure - every bit matters
typedef struct __attribute__((packed)) {
    uint32_t timestamp : 24;        // Seconds since boot (194 days max)
    uint8_t  battery_voltage : 8;   // 0-255 maps to 0-5V
    uint16_t solar_current : 10;    // 0-1023 maps to 0-2A
    uint8_t  temperature : 7;       // -64 to +63 Celsius
    uint8_t  error_flags : 8;       // Bit field for 8 error types
    uint8_t  mode : 3;              // 8 possible operating modes
    uint8_t  reset_count : 6;       // Counts up to 63 resets
} TelemetryPacket; // Total: 64 bits`}</code></pre>

          <p>
            This taught me to be surgical about logging and metrics:
          </p>
          <pre className="language-typescript"><code>{`class TelemetryCollector {
  // Don't log everything - log what matters
  collectCriticalMetrics() {
    return {
      // Business metrics
      activeUsers: this.cache.get('active_users') || 0,
      requestsPerSecond: this.calculateRPS(),
      errorRate: this.errors / this.total,
      
      // System health
      memoryUsageMB: process.memoryUsage().heapUsed / 1024 / 1024,
      eventLoopLagMs: this.eventLoopLag.mean(),
      dbConnectionsActive: this.dbPool.activeCount(),
      
      // Degradation indicators
      cacheHitRate: this.cacheHits / this.cacheRequests,
      avgResponseTimeMs: this.responseTime.percentile(0.95),
      queueDepth: this.jobQueue.length,
    };
  }
  
  // Compress before sending
  transmit(metrics: Metrics) {
    const compressed = zlib.gzipSync(JSON.stringify(metrics));
    const ratio = compressed.length / JSON.stringify(metrics).length;
    
    if (ratio > 0.5) {
      // Compression isn't helping - use binary format
      return this.toBinaryFormat(metrics);
    }
    
    return compressed;
  }
}`}</code></pre>

          <h2>Lesson 4: State Machines Save Lives</h2>
          <p>
            Our satellite had clearly defined operational modes, each with specific behaviors and transitions. No spaghetti code allowed when failure means losing a $50,000 satellite.
          </p>
          <pre className="language-c"><code>{`typedef enum {
    MODE_INITIAL_BOOT,
    MODE_DETUMBLE,
    MODE_CHARGING,
    MODE_NOMINAL,
    MODE_LOW_POWER,
    MODE_SAFE,
    MODE_EMERGENCY
} SatelliteMode;

typedef struct {
    SatelliteMode current;
    SatelliteMode previous;
    uint32_t mode_entry_time;
    uint8_t transition_count;
} StateMachine;

void update_satellite_mode(StateMachine* sm, SystemState* state) {
    SatelliteMode next = sm->current;
    
    switch (sm->current) {
        case MODE_NOMINAL:
            if (state->battery_voltage < CRITICAL_VOLTAGE) {
                next = MODE_LOW_POWER;
            } else if (state->temperature > MAX_SAFE_TEMP) {
                next = MODE_SAFE;
            }
            break;
            
        case MODE_LOW_POWER:
            if (state->battery_voltage > NOMINAL_VOLTAGE) {
                next = MODE_NOMINAL;
            } else if (state->battery_voltage < EMERGENCY_VOLTAGE) {
                next = MODE_EMERGENCY;
            }
            break;
            
        case MODE_EMERGENCY:
            // Only basic life support
            disable_all_experiments();
            minimize_power_consumption();
            if (state->battery_voltage > RECOVERY_VOLTAGE) {
                next = MODE_CHARGING;
            }
            break;
    }
    
    if (next != sm->current) {
        log_mode_transition(sm->current, next);
        sm->previous = sm->current;
        sm->current = next;
        sm->mode_entry_time = get_timestamp();
        sm->transition_count++;
    }
}`}</code></pre>

          <p>
            Now I use state machines for complex workflows:
          </p>
          <pre className="language-typescript"><code>{`class PaymentStateMachine {
  private transitions = {
    pending: ['processing', 'cancelled'],
    processing: ['completed', 'failed', 'refunding'],
    completed: ['refunding'],
    refunding: ['refunded', 'failed'],
    failed: ['retrying', 'cancelled'],
    retrying: ['processing', 'failed'],
    // Terminal states
    cancelled: [],
    refunded: [],
  };
  
  canTransition(from: State, to: State): boolean {
    return this.transitions[from]?.includes(to) ?? false;
  }
  
  transition(payment: Payment, to: State): Result {
    if (!this.canTransition(payment.state, to)) {
      return { 
        success: false, 
        error: `Invalid transition: ${payment.state} -> ${to}` 
      };
    }
    
    // Log state change for audit
    this.audit.log({
      paymentId: payment.id,
      from: payment.state,
      to: to,
      timestamp: Date.now(),
      actor: this.currentUser,
    });
    
    payment.state = to;
    payment.stateHistory.push({
      state: to,
      timestamp: Date.now(),
    });
    
    return { success: true };
  }
}`}</code></pre>

          <h2>Lesson 5: Test Like Your Life Depends On It</h2>
          <p>
            We couldn't test in actual space, so we got creative. Thermal vacuum chambers. Vibration tables. A helmholtz cage to simulate Earth's magnetic field. And lots of software simulation.
          </p>
          <pre className="language-python"><code>{`class SatelliteSimulator:
    def __init__(self):
        self.orbit = OrbitPropagator(altitude_km=400, inclination_deg=51.6)
        self.power = PowerModel(solar_panels=4, battery_capacity_wh=20)
        self.thermal = ThermalModel()
        self.attitude = AttitudeModel()
        
    def simulate_orbit(self, duration_hours=24):
        """Simulate a full day in orbit"""
        results = []
        
        for minute in range(duration_hours * 60):
            # Update position
            position = self.orbit.propagate(minute * 60)
            
            # Check eclipse
            in_eclipse = self.orbit.in_eclipse(position)
            
            # Update power
            solar_power = 0 if in_eclipse else self.calculate_solar_power(position)
            self.power.update(solar_power, load=2.5)  # 2.5W average load
            
            # Update temperature
            self.thermal.update(
                solar_flux=0 if in_eclipse else 1361,  # W/m²
                earth_ir=240,  # W/m²
                internal_dissipation=2.5  # W
            )
            
            # Check for failures
            if self.power.battery_voltage < 3.0:
                raise PowerFailure(f"Battery voltage critical at T+{minute}min")
            
            if self.thermal.temperature > 60:
                raise ThermalFailure(f"Overheating at T+{minute}min")
            
            results.append({
                'time': minute,
                'position': position,
                'battery_v': self.power.battery_voltage,
                'temperature': self.thermal.temperature,
                'in_eclipse': in_eclipse
            })
            
        return results`}</code></pre>

          <p>
            This obsession with testing carries into my software work:
          </p>
          <pre className="language-typescript"><code>{`describe('Payment Processing Under Extreme Conditions', () => {
  it('handles database failures during transaction', async () => {
    const payment = await createTestPayment();
    
    // Simulate DB failure mid-transaction
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('Connection lost'));
    
    const result = await processor.process(payment);
    
    expect(result.status).toBe('pending_retry');
    expect(payment.attempts).toBe(1);
    expect(auditLog.entries).toContainEqual({
      event: 'payment_retry_scheduled',
      reason: 'database_failure',
    });
  });
  
  it('maintains consistency during partial failures', async () => {
    // Test every possible failure point
    const failurePoints = [
      'after_auth',
      'after_capture',
      'after_inventory_update',
      'after_notification',
    ];
    
    for (const failurePoint of failurePoints) {
      const result = await simulateFailureAt(failurePoint);
      
      // System should always be in a consistent state
      expect(await verifySystemConsistency()).toBe(true);
      expect(await canRecoverFromState(result.state)).toBe(true);
    }
  });
});`}</code></pre>

          <h2>The Satellite's Legacy</h2>
          <p>
            EQUiSat launched on SpaceX CRS-14 in April 2018. It survived in space for over two years, far exceeding our six-month design life. Every time I got a notification that it had successfully downlinked telemetry, I felt a mix of pride and relief.
          </p>
          <p>
            But the real legacy isn't the satellite—it's how it changed my approach to software:
          </p>
          <ul>
            <li><strong>Design for failure:</strong> Everything breaks. Plan for it.</li>
            <li><strong>Make systems observable:</strong> You can't fix what you can't see.</li>
            <li><strong>State machines prevent chaos:</strong> Complex systems need clear states.</li>
            <li><strong>Test the edge cases:</strong> Normal conditions are the exception.</li>
            <li><strong>Simplicity wins:</strong> Clever code fails in space.</li>
          </ul>

          <h2>From Space to Earth</h2>
          <p>
            These days, I build systems that run in data centers, not orbit. But I still approach every system like it's going to space:
          </p>
          <ul>
            <li>What happens when this fails?</li>
            <li>How will we know it failed?</li>
            <li>Can we recover automatically?</li>
            <li>What's the simplest solution that works?</li>
          </ul>
          <p>
            Because whether your code is running 400 miles up or in AWS us-east-1, Murphy's Law still applies. The difference is, in space, everyone knows you can't push a hotfix.
          </p>

          <div className="mt-12 p-6 glass rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Learn More</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Interested in satellite development or aerospace software? Here are some resources:
            </p>
            <ul className="space-y-2">
              <li>
                <a href="http://brownspace.org" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Brown Space Engineering
                </a>
              </li>
              <li>
                <a href="https://www.n2yo.com/satellite/?s=43552" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Track EQUiSat Live
                </a>
              </li>
              <li>
                <a href="/projects/equisat" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EQUiSat Project Details →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  );
}