---
title: Why I Mostly Switched From Claude Code to the Codex Desktop App
date: '2026-04-19'
description: 'Why I mostly switched from Claude Code to the Codex desktop app: visible threads, isolated worktrees, queued follow-ups, automations, and tighter review loops.'
draft: true
---

I now start most coding sessions with agents in the Codex desktop app instead of Claude Code.

A few months ago, I wrote about [shipping with Claude Code](/writing/shipping-with-claude-code/). That workflow relied on multiple Ghostty panes, several git worktrees, Claude doing implementation, Codex and Gemini checking work, browser automation for UI testing, and a fair amount of manual coordination.

Disclosure: Anthropic provides me with a complimentary Claude Code Max account, which I appreciate. I also work at OpenAI. This is not a neutral market survey. It is a report on how my own workflow changed.

Claude Code is still an excellent tool. I still use it, and I would switch again if another product fit my workflow better.

I mostly switched because the Codex desktop app reduced the amount of manual coordination in my day. That change mattered more to me than model differences did.

## What changed

The Codex app launched before April 16. That date matters to me because the April 16 update was the point where I started using it as my default workspace instead of as a secondary tool.

By April 16, more of the workflow I had been assembling by hand was available in one place: threads, worktrees, diffs, terminals, automations, local browser previews, screenshots, and supervised computer use.

Once I had more than one agent working at a time, the main problem became keeping track of what was happening.

Which branch is this task on? Did it already run tests? Which diff am I reviewing? Is that screenshot from the current attempt or the previous one? Did I already tell the agent about the edge case I care about? Which thread is blocked, and which one is still making progress?

The desktop app helped because it made each task easier to inspect without rebuilding the whole picture every time I switched context.

On a typical day, I might have one worktree fixing a flaky test, one thread reviewing an open PR, one trying a UI change against a local server, and one clicking through the app to check whether the change actually works. I move between them, review diffs, look at screenshots, approve commands, and stop the ones that are no longer on the right track.

That is the main reason I mostly switched.

> Screenshot placeholder: Codex desktop app with multiple active threads and worktrees visible at once.

## State and boundaries

What the app does best is keep parallel work visible and separated.

Threads keep the work visible. Worktrees keep it isolated. Diffs, terminals, screenshots, and previews make it reviewable.

You can reproduce some of this with terminal panes and discipline. I did. The tradeoff is that more of the coordination stays in your head: which pane matters, which branch belongs to which task, which verification step already ran, and which follow-up still has to be sent.

In the app, a task includes a thread, a worktree, a diff, a terminal history, and a verification trail.

Whether the interface uses tabs is secondary. What matters is that agent state stays visible enough that I can run several tasks at once.

Queued follow-ups are part of this too. If I notice a correction while a thread is still working, I can queue the instruction and keep moving. That is a small feature, but it reduces interruptions. It means I do not have to stop what I am doing just to steer an agent in the moment.

This is also why I care less than I used to about isolated model comparisons. In my workflow, a model inside a system I can inspect and review is more useful than one inside a system I cannot manage easily.

> Screenshot placeholder: single Codex thread showing terminal output, diff, and verification context together.

## Worktrees as a unit of work

Worktrees were already central to my Claude Code setup. They let me run multiple tasks against the same repository without constant interference.

What changed in Codex was that the app made worktrees easier to create, inspect, and keep associated with a specific thread.

That changed how I think about agent tasks.

Before handing something to an agent, I usually ask whether it is a good worktree.

For me, a good worktree has four properties:

- a clear goal
- a reviewable diff
- a concrete verification step
- a rollback path if the experiment is wrong

If I cannot describe the diff, the verification step, and the rollback path, the task is usually not ready yet.

The other useful property is that a worktree is disposable. That makes it easier to experiment. The agent can try something, I can inspect the result, and I can discard it if the approach was wrong without contaminating other work.

That sounds basic, but it changes how aggressively I use agents. Isolation helps. Cheap discard helps more.

## Operational concerns

Some of the decision was operational.

Anthropic changed how Claude subscriptions interact with some third-party harnesses, Opus 4.7 introduced tokenizer changes that can increase token usage for the same input, and Claude had several visible incidents in April affecting Claude.ai, Claude Code, and API availability. Those are normal kinds of issues for a fast-moving product category, and none of them make Claude Code unimportant or suddenly bad.

They also made me less comfortable relying on product behavior that is hard to see directly.

When agents become part of the daily workflow, quota behavior, cache behavior, permissions, branch isolation, resumability, and review surfaces stop being side details. They become part of the tool.

Every serious AI product is going to have limits, outages, pricing changes, and odd edge cases.

Once I started building my day around agents, I cared much more about how the product exposed state, boundaries, and review loops. The surrounding workspace mattered more to me than it had a few months earlier.

## Long-running threads

Longer threads have been more usable for me in Codex.

I have had threads stay useful for much of a day. What mattered was that I could come back to the same thread repeatedly without reconstructing the task from scratch each time.

In practice, those long sessions were repeated cycles of implementation, test failure, patching, UI verification, summarization, and another pass.

That changed how I prompt. For shorter tasks, I still tend to over-specify. For longer ones, I usually give Codex the objective, the constraints, and the definition of done, then steer as needed.

The thread becomes less like a single exchange and more like a running implementation log.

## Voice input

Voice input mattered more than I expected.

The main benefit is that voice lowers the cost of adding context. Speed is secondary.

When I type everything, I often omit details I actually care about: what we already tried, why the previous attempt failed, what behavior matters most, what I expect to break, and how I intend to verify the result.

With voice, I am more likely to include those details first and clean up the transcription second. That usually produces better instructions.

## Automations

I use automations mainly for recurring checks that I want returned as an inbox.

The first automations I care about are ordinary tasks:

- tell me which PRs are stuck
- check whether this branch still passes
- look for regressions in the flows I keep forgetting to test
- flag docs or issues that drifted

That is exactly why they are useful.

The Codex app can run those checks in the current project or in a separate worktree and send findings back to Triage. That makes the agent feel less like a prompt-driven assistant and more like a system for recurring maintenance work.

This matters because a lot of useful engineering work is repetitive, easy to defer, and easy to forget.

> Screenshot placeholder: Codex automation or Triage view showing recurring tasks and findings.

## Computer use

Computer use is useful, and it needs the most caution.

For local previews and public pages, the in-app browser is useful. For signed-in workflows, existing browser profiles, or GUI-only tasks, the more relevant feature is supervised computer use operating the real app with real permissions.

The developer use case that stands out most for me is background QA. One thread can make a change in a worktree while another clicks through the app, checks a flow, and comes back with screenshots and notes. That is a straightforward improvement in how I split work.

More broadly, computer use helps with a category of tasks that sits in an awkward middle ground: too annoying to do manually, not worth building software for. Large repetitive cleanup inside bad web UIs, testing flows that do not justify a custom integration, and extracting signal from awkward interfaces all fit that category.

The caveat is security.

Once an agent can read, browse, and act, ordinary content becomes part of the attack surface. A PDF, a spreadsheet, a PR description, a browser tab, or an email thread can all affect an agent that has tools. Signed-in pages are effectively your account. Desktop access expands the blast radius.

The feature is usable under supervision, with clear scope and review.

> Screenshot placeholder: background QA or computer-use thread returning screenshots and notes after a test pass.

## Why I switched

I am describing my own workflow, not making a universal claim that Codex is better than Claude Code.

For my workflow, Codex is now the better workspace.

The difference comes from a combination of features:

- visible threads
- isolated worktrees
- integrated diffs and terminal output
- queued follow-ups
- local previews and screenshots
- recurring checks through automations
- supervised computer use for QA and other GUI-only work
- longer threads that are easier to resume

That combination reduced the amount of manual coordination I was doing every day.

Claude Code was where I first built this workflow. Codex is where I now run most of it.

## What did not change

Responsibility did not change.

The agent still does implementation. I still do review, judgment, prioritization, and taste.

The "autonomous employee" framing is not especially useful for how I work. What works better for me is a more ordinary pattern: bounded tasks, review loops, several active threads, and a human who still owns the outcome.

For me, the value of the current generation of tools is that they let me attempt more work in parallel without losing track of what is happening.

Right now, the Codex desktop app does that better for me than Claude Code does.

---

## Sources

- [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/) - OpenAI's February 2, 2026 launch post for the desktop app, with a March 4 update noting Windows availability
- [Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/) - OpenAI's April 16, 2026 product update covering broader computer use, more plugins, PR review, memory preview, SSH, multiple terminals, and the expanded workspace direction
- [Codex app features](https://developers.openai.com/codex/app/features) - official features documentation for threads, worktrees, diffs, terminals, voice dictation, the in-app browser, and computer use
- [Codex app automations](https://developers.openai.com/codex/app/automations) - official automations documentation covering recurring tasks, worktree execution, and Triage
- [Codex app computer use](https://developers.openai.com/codex/app/computer-use) - official computer use documentation, permissions, and safety guidance
- [Tell HN: Anthropic no longer allowing Claude Code subscriptions to use OpenClaw](https://news.ycombinator.com/item?id=47633396) - public discussion of the third-party harness policy change
- [Pro Max 5x quota exhausted in 1.5 hours despite moderate usage](https://news.ycombinator.com/item?id=47739260) - public discussion of quota burn and cache behavior
- [Introducing Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7) - Anthropic's release notes on tokenizer and effort-level changes
- [Claude status](https://status.claude.com/) - incident history for Claude.ai, Claude Code, and API availability
