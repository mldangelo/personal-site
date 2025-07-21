import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Finals Prep: Circuit Analysis Study Guide</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-12-01">November 30, 2009</time>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">study-guide</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">circuits</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">finals</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Finals are in two weeks. Circuit Analysis is the make-or-break class for EE freshmen. Time to create a study guide that would make Maxwell proud.</p>
            <h2>The Big Picture</h2>
            <p>Circuit Analysis is really about five things:</p>
            <ul>
              <li><strong>Ohm\'s Law and power</strong> (V=IR, P=IV)</li>
              <li><strong>KCL and KVL</strong> (Kirchhoff\'s laws)</li>
              <li><strong>Series/parallel combinations</strong></li>
              <li><strong>Node and mesh analysis</strong></li>
              <li><strong>Thevenin/Norton equivalents</strong></li>
            </ul>
            <p>Master these, pass the class. Simple? No. Possible? Yes.</p>
            <h2>1. Fundamentals Review</h2>
            <h3>Ohm\'s Law Extended</h3>
            <p>Not just V=IR. The complete picture:</p>
            <ul>
              <li>V = IR (voltage across resistor)</li>
              <li>P = IV = I²R = V²/R (power dissipated)</li>
              <li>G = 1/R (conductance, sometimes easier)</li>
            </ul>
            <p>Units matter! V[volts], I[amps], R[ohms], P[watts]</p>
            <h3>Sources</h3>
            <p><strong>Voltage source</strong>: Maintains constant voltage</p>
            <ul>
              <li>Ideal: Zero internal resistance</li>
              <li>Real: Small series resistance</li>
            </ul>
            <p><strong>Current source</strong>: Maintains constant current</p>
            <ul>
              <li>Ideal: Infinite internal resistance  </li>
              <li>Real: Large parallel resistance</li>
            </ul>
            <p>Remember: Can\'t short voltage source, can\'t open current source.</p>
            <h2>2. Kirchhoff\'s Laws (The Foundation)</h2>
            <h3>KCL (Current Law)</h3>
            <p>Sum of currents at a node = 0</p>
            <ul>
              <li>Current in = Current out</li>
              <li>Watch sign conventions!</li>
              <li>Works because charge isn\'t created/destroyed</li>
            </ul>
            <p>Example:</p>
            <pre className="language-text"><code>{`    I1\\n    ↓\\n→I2—•—I3→\\n    ↓\\n    I4\\n\\nAt node: I1 + I2 - I3 - I4 = 0`}</code></pre>
            <h3>KVL (Voltage Law)</h3>
            <p>Sum of voltages around closed loop = 0</p>
            <ul>
              <li>Voltage rises = Voltage drops</li>
              <li>Pick direction, stick with it</li>
              <li>Works because of conservation of energy</li>
            </ul>
            <h2>3. Series and Parallel</h2>
            <h3>Series (Current same, voltages add)</h3>
            <pre className="language-text"><code>{`R_total = R1 + R2 + R3 + ...\\nV_total = V1 + V2 + V3 + ...\\nI is same through all`}</code></pre>
            <p>Voltage divider:</p>
            <p>V_R1 = V_total × (R1/(R1+R2))</p>
            <h3>Parallel (Voltage same, currents add)</h3>
            <pre className="language-text"><code>{`1/R_total = 1/R1 + 1/R2 + 1/R3 + ...\\nI_total = I1 + I2 + I3 + ...\\nV is same across all`}</code></pre>
            <p>Current divider:</p>
            <p>I_R1 = I_total × (R2/(R1+R2))</p>
            <p>Quick parallel trick:</p>
            <p>R1 || R2 = (R1 × R2)/(R1 + R2)</p>
            <h2>4. Analysis Methods</h2>
            <h3>Node Voltage Method</h3>
            <ul>
              <li>Pick reference node (ground)</li>
              <li>Label node voltages (V1, V2, etc.)</li>
              <li>Write KCL at each node (except reference)</li>
              <li>Solve system of equations</li>
            </ul>
            <p>Example 3-node circuit:</p>
            <pre className="language-text"><code>{`Node 1: (V1-V2)/R1 + (V1-V3)/R2 + I_source = 0\\nNode 2: (V2-V1)/R1 + V2/R3 = 0\\nNode 3: (V3-V1)/R2 + V3/R4 = 0`}</code></pre>
            <h3>Mesh Current Method</h3>
            <ul>
              <li>Label mesh currents (clockwise)</li>
              <li>Write KVL for each mesh</li>
              <li>Solve system of equations</li>
            </ul>
            <p>Easier when more loops than nodes.</p>
            <h2>5. Thevenin/Norton Equivalents</h2>
            <p>Any linear circuit can be reduced to:</p>
            <ul>
              <li><strong>Thevenin</strong>: Voltage source + series resistance</li>
              <li><strong>Norton</strong>: Current source + parallel resistance</li>
            </ul>
            <h3>Finding Thevenin:</h3>
            <ul>
              <li>Remove load</li>
              <li>Find V_oc (open circuit voltage) = V_th</li>
              <li>Find I_sc (short circuit current)</li>
              <li>R_th = V_oc / I_sc</li>
            </ul>
            <h3>Norton:</h3>
            <ul>
              <li>I_N = I_sc</li>
              <li>R_N = R_th</li>
              <li>V_th = I_N × R_N</li>
            </ul>
            <h2>Common Exam Problems</h2>
            <h3>Type 1: Find the Current</h3>
            <p>Given complex circuit, find current through specific resistor.</p>
            <p>Strategy:</p>
            <ul>
              <li>Simplify using series/parallel</li>
              <li>Use current divider if applicable</li>
              <li>Or use node/mesh analysis</li>
            </ul>
            <h3>Type 2: Maximum Power Transfer</h3>
            <p>Load resistor for maximum power: R_load = R_thevenin</p>
            <p>P_max = V_th² / (4×R_th)</p>
            <h3>Type 3: Op-Amp Circuits</h3>
            <p>Remember ideal op-amp rules:</p>
            <ul>
              <li>No current into inputs</li>
              <li>V+ = V- (virtual short)</li>
              <li>Output does whatever to satisfy rules 1&2</li>
            </ul>
            <h2>Practice Problem Walkthrough</h2>
            <p>Circuit: 12V source, 3Ω and 6Ω in parallel, then 4Ω in series.</p>
            <p>Find: Current from source.</p>
            <p>Solution:</p>
            <ul>
              <li>3Ω || 6Ω = (3×6)/(3+6) = 18/9 = 2Ω</li>
              <li>Total R = 2Ω + 4Ω = 6Ω  </li>
              <li>I = V/R = 12V/6Ω = 2A</li>
            </ul>
            <p>Always check: P_source = 12V × 2A = 24W</p>
            <p>P_dissipated = I²R = 4×6 = 24W ✓</p>
            <h2>Memory Tricks</h2>
            <h3>Color Code</h3>
            <p><strong>B</strong>ad <strong>B</strong>eer <strong>R</strong>ots <strong>O</strong>ur <strong>Y</strong>oung <strong>G</strong>uts <strong>B</strong>ut <strong>V</strong>odka <strong>G</strong>oes <strong>W</strong>ell</p>
            <p>(Black Brown Red Orange Yellow Green Blue Violet Gray White)</p>
            <p>0     1     2   3      4      5     6    7      8    9</p>
            <h3>Unit Circle for AC</h3>
            <p>When we get to AC (next semester):</p>
            <ul>
              <li>0°: cos=1, sin=0</li>
              <li>90°: cos=0, sin=1</li>
              <li>180°: cos=-1, sin=0</li>
              <li>270°: cos=0, sin=-1</li>
            </ul>
            <h2>Study Schedule</h2>
            <h3>Week 1 (This week)</h3>
            <ul>
              <li>Mon/Wed/Fri: Work ALL homework problems again</li>
              <li>Tue/Thu: Find extra problems online</li>
              <li>Weekend: Make formula sheet</li>
            </ul>
            <h3>Week 2 (Next week)</h3>
            <ul>
              <li>Mon: Node analysis practice</li>
              <li>Tue: Mesh analysis practice</li>
              <li>Wed: Thevenin/Norton</li>
              <li>Thu: Mixed problems</li>
              <li>Fri: Review formula sheet</li>
              <li>Weekend: Practice exams</li>
            </ul>
            <h2>Formula Sheet Strategy</h2>
            <p>Allowed one 8.5\"×11\" sheet. Organization is key:</p>
            <p>Front:</p>
            <ul>
              <li>Basic laws (top left)</li>
              <li>Series/parallel formulas (top right)</li>
              <li>Node analysis steps (middle left)</li>
              <li>Mesh analysis steps (middle right)</li>
              <li>Common equivalents (bottom)</li>
            </ul>
            <p>Back:</p>
            <ul>
              <li>Op-amp circuits</li>
              <li>Example problems (tiny writing)</li>
              <li>Common mistakes list</li>
              <li>Unit conversions</li>
            </ul>
            <h2>Common Mistakes to Avoid</h2>
            <ul>
              <li><strong>Sign errors</strong> - Pick convention, stick with it</li>
              <li><strong>Unit mismatches</strong> - kΩ vs Ω</li>
              <li><strong>Calculator modes</strong> - Degrees vs radians</li>
              <li><strong>Parallel formula</strong> - It\'s product/sum, not sum/product</li>
              <li><strong>Power calculations</strong> - Use same reference for V and I</li>
            </ul>
            <h2>Resources</h2>
            <h3>Textbook Actually Useful Pages</h3>
            <ul>
              <li>Ch 2: Basic laws (p. 43-67)</li>
              <li>Ch 3: Analysis methods (p. 89-125)</li>
              <li>Ch 4: Theorems (p. 156-189)</li>
            </ul>
            <h3>Online Gold</h3>
            <ul>
              <li>AllAboutCircuits.com tutorials</li>
              <li>MIT OCW 6.002 lectures</li>
              <li>CircuitLab for verification</li>
            </ul>
            <h3>Study Group</h3>
            <p>Meeting Tue/Thu 7-10 PM in Furnas 206</p>
            <p>Bring: Calculator, problems, caffeine</p>
            <h2>Confidence Boosters</h2>
            <p>Problems I can now solve that seemed impossible in September:</p>
            <ul>
              <li>5-node circuits</li>
              <li>Dependent sources</li>
              <li>Bridge circuits</li>
              <li>Multi-source networks</li>
            </ul>
            <p>That\'s progress.</p>
            <h2>The Mental Game</h2>
            <p>Circuit analysis is pattern recognition:</p>
            <ul>
              <li>See circuit type</li>
              <li>Choose best method</li>
              <li>Apply systematically</li>
              <li>Check answer sensibility</li>
            </ul>
            <p>It\'s not magic. It\'s method.</p>
            <h2>Final Prep Checklist</h2>
            <ul>
              <li>[ ] Rework all homework</li>
              <li>[ ] Complete 5 practice exams</li>
              <li>[ ] Formula sheet perfected</li>
              <li>[ ] Calculator batteries fresh</li>
              <li>[ ] Sleep night before (yeah right)</li>
            </ul>
            <h2>Motivational Note</h2>
            <p>Every electrical engineer before me passed this class. The electrons don\'t care if I understand them - they follow the laws regardless. My job is just to learn their rules.</p>
            <p>Two weeks to show what I\'ve learned. Time to make Kirchhoff proud.</p>
            <p><em>If you\'re reading this, future me: You survived midterms. You\'ll survive finals. Just remember: KCL at nodes, KVL around loops, and coffee in bloodstream.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
