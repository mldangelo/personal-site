---
title: 'Becoming an IC again'
date: '2026-04-19'
description: 'Why returning to individual contributor work at OpenAI feels less like a step back and more like stepping into a new operating model.'
draft: true
---

In March, Promptfoo was acquired by OpenAI, and I started my first month there.

Promptfoo was a short company. We started it in mid-2024 and, less than two years later, I found myself starting over in a very different role.

For the first time in more than a decade, I am an individual contributor again.

That has been the biggest surprise of my first month at OpenAI. Not that the company is impressive. I expected that. Not that the mission matters. That part was obvious too.

The surprise is that becoming an IC again does not feel like stepping back.

It feels like getting closer to the frontier at exactly the moment IC work itself is being redefined.

## Promptfoo was short, but it was total

Even though Promptfoo was short, it was total.

For most of the last twenty months, it was my default context: the repo, the product, the customer calls, the roadmap, the support queue, the security work, the fundraising, the hiring plan, the weird edge cases, and the thing I checked first thing in the morning and last thing at night.

That is the strange thing about startups. Duration and intensity are not the same variable.

Now I am at OpenAI, but I am still working on the same underlying problem: helping teams build, evaluate, red-team, and ship AI systems more safely. The surface area changed. The scale changed. The number of people and systems involved changed. The core problem did not.

That continuity matters more to me than the title change.

## The founder-to-IC transition only looks smaller if you measure leverage by headcount

For most of my career, leverage meant people.

If you wanted to do more, you hired more. You built a team, divided work, added process, and absorbed the coordination tax that came with it. That model still matters, and always will for some problems.

But it is no longer the only serious path to leverage.

As a founder, especially a technical founder, your job expands until it includes everything. You write code, review PRs, talk to users, debug incidents, explain the roadmap, think about pricing, handle security reviews, answer support, and make sure the company is spending time on the right things.

Some of that is energizing. Some of it is just entropy with a calendar invite.

Being an IC again is narrower. In theory, that should feel smaller.

It does not.

It feels sharper.

I spend more of my time close to the artifact: reading code, writing code, testing agents, running evals, reviewing outputs, and tightening feedback loops. I have fewer things to route and more things to make.

There is a kind of clarity that comes from being directly responsible for something that either works or does not. Not a strategy doc. Not a hiring plan. Not an org chart. A thing.

I had forgotten how satisfying that is.

## Founder mode without the founder title

What survives after the founder title goes away?

You lose authority. You lose the final call. You lose ownership over the whole map.

But you can keep the useful reflexes.

You can still go deep instead of staying abstract.

You can still talk to users.

You can still notice when something feels off.

You can still care about the boring edge case.

You can still fix the small broken thing instead of scheduling the meeting about the broken thing.

You can still own the outcome, even when you do not own the org chart.

That is the part of founder mode I want to keep.

After an acquisition, the job is not to recreate the startup inside a bigger company. The job is to carry over the parts that mattered: ownership, urgency, customer obsession, and willingness to get into the details.

Founder mode without the founder title is just high-agency IC work.

Right now, that kind of IC work is getting much more powerful.

## ICs are getting leverage that used to require teams

This is the thing I keep coming back to.

Founders used to get leverage primarily by hiring people.

Now the highest-leverage ICs are starting to get leverage by directing agents, tools, worktrees, evals, and feedback loops.

That is not a metaphor. It is increasingly the day-to-day operating model.

OpenAI's public Codex updates describe the change pretty clearly. The [Codex app announcement](https://openai.com/index/introducing-the-codex-app/) framed it as a command center for multiple agents, with built-in worktrees, skills, and automations. The [April 16 product update](https://openai.com/index/codex-for-almost-everything/) pushed that further: PR review, multiple terminals, an in-app browser, background computer use, memory, and more ways to carry work forward over time.

That is not "autocomplete, but a bit better."

It is a different operating model for technical work.

One thread can investigate a bug. Another can try a refactor in a clean worktree. Another can review a diff from fresh context. Another can run tests, inspect logs, or work through a dead end in parallel. The work becomes less linear.

The scarce resource is no longer how quickly I can turn thoughts into code.

The scarce resource is judgment: what to delegate, how much context to provide, what success looks like, what to verify, when to trust the output, and when to throw it away and start over.

AI coding does not make engineering disappear.

It changes the bottleneck from typing speed to judgment density.

## Tokens are the new cloud spend

Earlier this year I wrote about [spending close to $10K in API credits in a month on interactive development work](/writing/shipping-with-claude-code/). At the time, that still felt mildly absurd.

Now it feels normal.

I have started thinking about tokens the way I used to think about cloud compute: not as a novelty, but as a resource you spend to get work done. Sometimes you waste it. Sometimes you underinvest because you are stuck in an old mental model. Sometimes the right answer is to spend more because the bottleneck is not cost, it is iteration speed.

The unit that matters is not tokens.

The unit that matters is verified progress.

Did the agent find the bug?

Did it run the tests?

Did it compare approaches?

Did it generate a useful reproduction?

Did it help me understand a system faster than I could have alone?

That is the metric I care about.

## This makes evals and security more important, not less

Working inside OpenAI has only reinforced something I already believed at Promptfoo: as agents become more capable, evaluation and security become more central.

The old question was, "Did the model answer correctly?"

That is no longer enough.

Now the questions look more like this:

- What tools did it use?
- What data did it access?
- What actions did it take?
- What policy was it following?
- What changed in the environment?
- Could the behavior be reproduced?
- Would we have caught the failure before deployment?

As models move from generating text to taking actions, those questions stop being edge cases. They become the job.

That is why this transition feels less like leaving Promptfoo behind and more like continuing the same mission in a larger system. The more connected and capable agents become, the more important it is to test them systematically, understand their behavior, and make failures legible before they become incidents.

Integration, at its best, is not assimilation. It is amplification.

## Why I am more bullish now

I have been close to AI progress for a while. Promptfoo only existed because teams were already shipping AI systems faster than their testing and governance practices could keep up.

But this month changed my intuition anyway.

I am more bullish now because the compounding is no longer only happening at the model layer.

The models are improving.

The tools around them are improving.

The workflows are improving.

The feedback loops are improving.

And the number of serious attempts one person can make in a day is increasing.

That last point feels underrated.

A lot of progress comes from being able to try more things with real rigor. Not random flailing. Serious attempts. Agents increase that number. Imperfectly, and not safely by default, but materially.

I do not think the story is "AI replaces all engineers."

I think the near-term story is more interesting than that.

The best ICs get much more leverage.

Engineering shifts toward judgment, verification, and system design.

Small teams can attack problems that used to require much larger organizations.

And the people closest to the work may feel the shift before the org chart does.

Managers get dashboards.

ICs get agents.

## One month in

I am still early. I am still learning the company, the systems, the people, and the places where I can be most useful.

But I already know this: becoming an IC again was the right move.

I thought it might feel like stepping back.

Instead, it feels like getting closer to the work at the exact moment the work is changing.

That feels like a good sign.

---

## Links

- [OpenAI to acquire Promptfoo](https://openai.com/index/openai-to-acquire-promptfoo/)
- [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/)
- [Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/)
- [What I learned shipping 1,000+ PRs with Claude Code](/writing/shipping-with-claude-code/)
