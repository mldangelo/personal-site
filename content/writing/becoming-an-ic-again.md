---
title: 'OpenAI, one month in'
date: '2026-04-19'
description: 'One month after Promptfoo was acquired by OpenAI, what has changed in my work, how Promptfoo is doing, and why I am more optimistic about coding agents and evaluation.'
draft: true
---

It has been about a month since Promptfoo was acquired by OpenAI and I started working there.

The main change has been scope. I am back in an individual contributor role for the first time in more than a decade, and I am still working on the same core problem that led me to start Promptfoo: helping teams build and evaluate AI systems with enough rigor for real deployments.

Promptfoo was a short company by startup standards. We started it in mid-2024. Less than two years later, I was starting a new role inside a much larger organization. The work itself was substantial, and it continues inside a larger system.

## Promptfoo one month in

A month in, Promptfoo continues to grow.

One month in, the project is above 20,000 GitHub stars and above 700,000 downloads per month. Those are useful indicators because they answer the immediate concern many people have after an acquisition: does the product continue to matter, and does development continue?

Development has continued, and I have started spending more time on Promptfoo again, especially around coding-agent evals, red teaming, and coding harnesses. That work follows directly from the original product. Promptfoo began as an evaluation tool and grew into a broader platform for AI security, red teaming, and governance. Coding agents make those concerns concrete. Once an agent can read files, use tools, edit code, run tests, and operate in a semi-open environment, a plausible answer is only one part of the evaluation target.

That work requires a harness, a repeatable environment, and a clear record of what task was assigned, what tools were available, what the agent attempted, what it changed, how success was measured, and where it failed. It also requires a realistic way to test adversarial behavior. That is why coding-agent evals and red teaming matter to me. They are a direct extension of the original Promptfoo thesis as models become agents.

## Returning to IC work

The biggest personal change has been returning to individual contributor work. As a founder, especially a technical founder, your role expands until it includes almost everything: product decisions, customer conversations, engineering management, hiring, fundraising, incident response, security reviews, roadmap debates, and the long tail of operational work that accumulates around any growing company.

There are obvious upsides to that breadth, but it also means a smaller fraction of your week is spent directly building. In the last month, a larger share of my time has gone back to reading code, writing code, running evals, reviewing outputs, and working directly on artifacts. That feels different from founder work. It also feels like a substantial source of leverage.

Management is still often treated as the default progression for ambitious technical people, and IC work is still often treated as a narrower path. That framing fits the present moment poorly. The leverage available to strong ICs is increasing quickly in environments where agents, tooling, and evaluation infrastructure are all improving at the same time.

## What has changed about IC work

In my own workflow, I can attempt more in a day than I could even a year ago.

The change comes from the ability to operate multiple threads of work in parallel, isolate tasks in separate worktrees, ask one system to implement and another to review, use browser and terminal tools to verify behavior, and build tighter loops between intent, execution, and evaluation. OpenAI's recent Codex product work reflects that change directly. The public announcements about the Codex app and the April 16 product update described a setup built around parallel agents, worktrees, automation, PR review, multiple terminals, browser-based workflows, and memory. Whatever toolchain becomes standard, technical work is becoming more concurrent and more reviewable.

In this workflow, effectiveness depends more on structuring tasks, constraining environments, defining success criteria, and evaluating output. Manual work and judgment remain important. The review and evaluation loop occupies a larger share of the job than it used to.

I have felt that directly in my own workflow. A month into this role, I am writing code regularly, and I am also spending significant time on eval design, failure analysis, review, and verification. That mix is new for me, and I do not expect it to be temporary.

## Why I am more optimistic now

After a month there, I am more optimistic than I was before joining.

The near-term change I see is that experienced engineers can do more as several systems improve together. The models are improving. The surrounding tools are improving. Evaluation workflows are improving. The environments in which agents can be tested are improving. The number of serious attempts a single person can make in a day is increasing. Those changes compound.

Hiring is another signal. We are hiring across several areas, which reflects the amount of work ahead.

I see the Promptfoo acquisition as a scale change. The questions that mattered before still matter now, and they now matter across a broader range of products and workflows. As coding agents become more capable, the need for better evaluation, better harnesses, and better security practices will increase with them.

## One month in

A month is a short window, and I am still learning where I can be most useful. It is long enough to see a few patterns. Promptfoo continues to grow. I am spending more time building again. Coding-agent evaluation has moved closer to the center of the work. The practical surface area of IC work continues to expand.

That is enough to make me more optimistic than I was a month ago.

---

## Links

- [OpenAI to acquire Promptfoo](https://openai.com/index/openai-to-acquire-promptfoo/)
- [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/)
- [Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/)
- [What I learned shipping 1,000+ PRs with Claude Code](/writing/shipping-with-claude-code/)
