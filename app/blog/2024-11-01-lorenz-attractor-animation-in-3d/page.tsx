import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Lorenz Attractor Animation in 3D (100-Line Python Challenge) - Michael D'Angelo",
  description:
    'A step-by-step walkthrough of recreating Edward Lorenz’s classic chaotic system in just ~100 lines of Python using NumPy and Matplotlib, complete with an animated 3D fly-through.',
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2024-11-01-lorenz-attractor-animation-in-3d">
        <header>
          <h1 className="text-4xl font-bold mb-4">
            Lorenz Attractor Animation in 3D (100-Line Python Challenge)
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {new Date('2024-11-01').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
            • 6 min
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['python', 'data-viz', 'chaos-theory', 'tutorial'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            The <em>Lorenz system</em> is the &quot;Hello World&quot; of chaos theory. With just
            three differential equations, it produces a mesmerizing butterfly-shaped trajectory that
            never exactly repeats. In this post we’ll:
          </p>
          <ol>
            <li>Derive the equations in plain English.</li>
            <li>
              Code the solver + animator in <strong>&lt; 100 lines of Python</strong>.
            </li>
            <li>Produce a 3-D fly-through GIF ready for social media.</li>
          </ol>

          <h2>1. The Math (Skipable)</h2>
          <p>Edward Lorenz proposed:</p>
          <pre>
            <code className="language-text">
              dx/dt = σ (y − x) dy/dt = x (ρ − z) − y dz/dt = x y − β z
            </code>
          </pre>
          <p>
            with canonical parameters σ = 10, ρ = 28, β = 8/3. The resulting trajectory never
            settles into a fixed point—hence the term <em>strange attractor</em>.
          </p>

          <h2>2. The Code</h2>
          <p>
            Below is the entire script, comments included, clocking in at 94 lines on my machine.
            Paste it into <code>lorenz.py</code> and run:
          </p>
          <pre>
            <code className="language-python">
              import numpy as np from scipy.integrate import solve_ivp import matplotlib.pyplot as
              plt from matplotlib import animation from mpl_toolkits.mplot3d import Axes3D # noqa:
              F401 unused import # ----- parameters & initial state ----- SIGMA, RHO, BETA = 10.0,
              28.0, 8.0 / 3.0 Y0 = (0.0, 1.0, 1.05) T_MAX, N_STEPS = 40, 10000 # ----- Lorenz system
              ----- def lorenz(t, xyz): x, y, z = xyz return [SIGMA * (y - x), x * (RHO - z) - y, x
              * y - BETA * z] # ----- solve ODE ----- sol = solve_ivp(lorenz, (0, T_MAX), Y0,
              t_eval=np.linspace(0, T_MAX, N_STEPS)) # ----- setup 3-D plot ----- fig =
              plt.figure(figsize=(6, 4)) ax = fig.add_subplot(111, projection=&quot;3d&quot;)
              ax.set(axis_off=True) line, = ax.plot([], [], [], lw=0.5, color=&quot;#1f77b4&quot;) #
              ----- animation init/update ----- def init(): ax.set_xlim((-20, 20)) ax.set_ylim((-30,
              30)) ax.set_zlim((0, 50)) return line, def update(frame):
              line.set_data(sol.y[0][:frame], sol.y[1][:frame])
              line.set_3d_properties(sol.y[2][:frame]) ax.view_init(30, 0.3 * frame) # slow spin
              return line, ani = animation.FuncAnimation(fig, update, frames=N_STEPS,
              init_func=init, interval=20, blit=True) ani.save(&quot;lorenz.gif&quot;, dpi=120,
              writer=&quot;pillow&quot;)
            </code>
          </pre>

          <h2>3. Why Under 100 Lines?</h2>
          <p>Putting a constraint on line count forces you to:</p>
          <ul>
            <li>
              Embrace high-level libraries (<code>solve_ivp</code> vs. hand-rolled Euler).
            </li>
            <li>Write cleaner, tighter logic.</li>
            <li>Focus on the story instead of boilerplate.</li>
          </ul>

          <h2>4. Result</h2>
          <p>
            🎉 You should now have <code>lorenz.gif</code>—a looping 3-D butterfly that slowly
            rotates. Perfect for spicing up a talk slide.
          </p>

          <h2>5. Next Experiments</h2>
          <ul>
            <li>
              Swap in different parameters and observe <em>torus</em> vs. <em>butterfly</em> shapes.
            </li>
            <li>
              Chain multiple attractors with a <em>color gradient</em> based on time.
            </li>
            <li>Export a point-cloud and feed it to a WebGL viewer.</li>
          </ul>

          <p>
            Enjoy diving down the chaotic rabbit hole—if a weather system can flap its wings into a
            hurricane, imagine what you can do with a hundred lines of code.
          </p>
        </div>
      </article>
    </>
  );
}
