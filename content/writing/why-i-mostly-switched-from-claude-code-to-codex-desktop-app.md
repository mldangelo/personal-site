---
title: Why I Mostly Switched From Claude Code to the Codex Desktop App
date: '2026-05-10'
description: 'Why the Codex desktop app became my default coding-agent workspace: worktrees, threads, voice input, browser checks, automations, and reviewable boundaries.'
draft: true
---

I start most coding sessions with agents in the Codex desktop app now.

A few months ago, I wrote about [shipping with Claude Code](/writing/shipping-with-claude-code/). That workflow relied on multiple Ghostty panes, several git worktrees, Claude doing implementation, Codex and Gemini checking work, browser automation for UI testing, and a fair amount of manual coordination. It worked. I was the coordination layer.

Disclosure: Anthropic provides me with a complimentary Claude Code Max account, and I am genuinely grateful for it. I also work at OpenAI, and I have shipped a few small PRs into Codex.

Claude Code is still an excellent tool. I still use it for some tasks. The category is moving quickly, and my tooling may change again.

I mostly switched because Codex now gives me one place for the pieces I use every day: threads, worktrees, diffs, terminals, browser checks, queued follow-ups, automations, and voice input. The app is closer to a developer workspace than a chat window.

I have enough repetition now to judge daily friction. Over the last month, my coding-agent usage has averaged more than 1 billion tokens per day. I include that number because it changes what I notice. At that volume, small issues show up quickly. Task state, approvals, review surfaces, and resumable threads become daily concerns.

Part of that volume comes from how I have Codex configured. The Codex docs say `agents.max_threads` defaults to `6`; I set mine to `48`. `agents.max_depth` defaults to `1`; I set mine to `3`. That is an aggressive setup, and it increases token use and the risk of noisy fan-out. It also matches how I want to use the tool: many bounded checks running in parallel, with enough visibility that I can still review what happened.

## Recent updates

The Codex app launched before April 16. The April 16 update added enough of the pieces I use every day that I started treating it as my default workspace.

After that update, I could keep more of the work in one place: threads, worktrees, diffs, terminals, automations, local browser previews, screenshots, and supervised computer use.

A week later, the April 23 Codex changelog added three things relevant to my workflow: GPT-5.5 in Codex, browser use for local development servers and file-backed pages, and automatic review for eligible approval prompts before they run.

The early May updates continued in the same direction. The May 7 changelog added Codex for Chrome, which lets Codex work with signed-in browser state while keeping website access behind approvals, allowlists, and blocklists. The May 8 CLI release added a simpler `codex remote-control` entrypoint, paged thread views for app-server clients, plugin-sharing improvements, and fixes around turn diffs and thread resume/fork behavior. OpenAI also published a May 8 safety post about sandboxing, approvals, network policy, managed configuration, and agent-native telemetry.

Once I had more than one agent working at a time, the main overhead was orientation: reconstructing which branch each task was on, whether tests had already run, which diff I was reviewing, which screenshot was current, and whether I had already told the agent about an edge case.

The desktop app helped because it made each task easier to inspect without rebuilding the whole picture every time I switched context.

On a typical day, I might have one worktree fixing a flaky test, one thread reviewing an open PR, one trying a UI change against a local server, and one clicking through the app to check whether the change actually works. I move between them, review diffs, look at screenshots, approve commands, and stop the ones that are no longer on the right track.

![Codex desktop app with multiple active agent threads](/images/writing/codex-desktop-app-post/codex-app-overview.webp)

## State and boundaries

In daily use, the app keeps parallel work visible and separated.

Threads keep the work visible. Worktrees keep it isolated. Diffs, terminals, screenshots, and previews make it reviewable.

You can reproduce some of this with terminal panes and discipline. I did. The tradeoff is that more of the coordination stays in your head: which pane matters, which branch belongs to which task, which verification step already ran, and which follow-up still has to be sent.

In the app, a task includes a thread, a worktree, a diff, a terminal history, and a verification trail.

Whether the interface uses tabs is secondary. What matters is that agent state stays visible enough that I can run several tasks at once.

Queued follow-ups are part of this too. If I notice a correction while a thread is still working, I can queue the instruction and keep moving. It is a small feature that reduces interruptions, because I can steer an agent without stopping my own work.

![Codex editor view with a reviewable diff](/images/writing/codex-desktop-app-post/codex-editor-diff.webp)

## Worktrees as a unit of work

Worktrees were already central to my Claude Code setup. They let me run multiple tasks against the same repository without constant interference.

What changed in Codex was that the app made worktrees easier to create, inspect, and keep associated with a specific thread.

It changed how I scope agent tasks.

Before handing something to an agent, I usually ask whether it is a good worktree.

For me, a good worktree has four properties:

- a clear goal
- a reviewable diff
- a concrete verification step
- a rollback path if the experiment is wrong

If I cannot describe the diff, the verification step, and the rollback path, the task is usually not ready yet.

The other useful property is that a worktree is disposable. That makes it easier to experiment. The agent can try something, I can inspect the result, and I can discard it if the approach was wrong without contaminating other work.

Isolation helps. Cheap discard helps more.

## Operational concerns

The Claude-related part of the decision was operational.

Anthropic changed how Claude subscriptions interact with some third-party harnesses, Opus 4.7 introduced tokenizer changes that can increase token usage for the same input, and Claude had several visible incidents in April affecting Claude.ai, Claude Code, and API availability. Tools that ship this quickly are going to have limits, outages, pricing changes, and odd edge cases.

My conclusion from those changes is narrow: operational details matter more once agents become part of the workday.

When agents become part of the daily workflow, quota behavior, cache behavior, permissions, branch isolation, resumability, and review surfaces affect whether I can use the tool for hours without babysitting it.

Once I started building my day around agents, I cared much more about how the product exposed state, boundaries, and review loops. The surrounding workspace mattered more to me than it had a few months earlier.

GPT-5.5 matters here because of token efficiency. OpenAI says GPT-5.5 uses significantly fewer tokens to complete the same Codex tasks and is now the recommended choice for most Codex tasks when it appears in the model picker. I have not independently benchmarked that claim. At billion-token-per-day coding volume, token efficiency shows up in cost, latency, and limits.

## Long-running threads

Longer threads have been more usable for me in Codex.

I have had threads stay useful for much of a day. What mattered was that I could come back to the same thread repeatedly without reconstructing the task from scratch each time.

In practice, those long sessions were repeated cycles of implementation, test failure, patching, UI verification, summarization, and another pass.

That changed how I prompt. For shorter tasks, I still tend to over-specify. For longer ones, I usually give Codex the objective, the constraints, and the definition of done, then steer as needed.

Over time, the thread turns into a running implementation log.

## Voice input

Voice input mattered more than I expected.

The main benefit is that voice lowers the cost of adding context. Speed is secondary.

When I type everything, I often omit details I actually care about: what we already tried, why the previous attempt failed, what behavior matters most, what I expect to break, and how I intend to verify the result.

With voice, I am more likely to include those details first and clean up the transcription second. The resulting instructions are usually better.

## Automations

I use automations mainly for recurring checks that I want returned as an inbox.

The first automations I care about are ordinary tasks:

- tell me which PRs are stuck
- check whether this branch still passes
- look for regressions in the flows I keep forgetting to test
- flag docs or issues that drifted

The Codex app can run those checks in the current project or in a separate worktree and send findings back to Triage. That extends the agent beyond interactive sessions to recurring maintenance work.

A lot of useful engineering work is repetitive, easy to defer, and easy to forget.

![Codex automation setup for recurring background checks](/images/writing/codex-desktop-app-post/codex-automations.webp)

## Computer use

Computer use is useful, and it needs the most caution.

For local previews and public pages, the in-app browser is useful. For signed-in browser workflows, the Chrome extension is the more precise tool because it can use the active browser profile while asking for website access. For broader GUI-only tasks, supervised computer use can operate the real app with real permissions.

The developer use case I use most is background QA. One thread can make a change in a worktree while another clicks through the app, checks a flow, and comes back with screenshots and notes. That gives me a second pass without stopping implementation.

Outside QA, computer use helps with tasks that sit in an awkward middle ground: too annoying to do manually, not worth building software for. Large repetitive cleanup inside bad web UIs, testing flows that do not justify a custom integration, and extracting signal from awkward interfaces all fit that category.

The main caveat is security.

Once an agent can read, browse, and act, ordinary content becomes part of the attack surface. A PDF, a spreadsheet, a PR description, a browser tab, or an email thread can all affect an agent that has tools. Signed-in pages are effectively your account. Desktop access expands the blast radius.

The feature is useful under supervision, with clear scope and review. The safety work around sandboxing, approvals, network rules, and telemetry matters because these tools are becoming part of real development workflows rather than occasional experiments.

## Why I switched

I am describing the workflow I use every day rather than ranking models for everyone.

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

Together, these changes reduced the amount of manual coordination I was doing every day.

Claude Code was where I first built this workflow. Codex is where I now run most of it.

## Responsibility

Responsibility stays with me.

The agent still does implementation. I still do review, judgment, prioritization, and taste.

My working pattern is ordinary: bounded tasks, review loops, several active threads, and a human who still owns the outcome.

The value is practical. I can attempt more work in parallel without losing track of what is happening.

Right now, the Codex desktop app is where I prefer to run that work.

---

## Sources

- [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/) - OpenAI's February 2, 2026 launch post for the desktop app, with a March 4 update noting Windows availability
- [Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/) - OpenAI's April 16, 2026 product update covering broader computer use, more plugins, PR review, memory preview, SSH, multiple terminals, and the expanded workspace direction
- [Introducing GPT-5.5](https://openai.com/index/introducing-gpt-5-5/) - OpenAI's April 23, 2026 model release, including GPT-5.5 availability in Codex and token-efficiency claims for Codex tasks
- [Codex changelog](https://developers.openai.com/codex/changelog) - official Codex release notes, including GPT-5.5 in Codex, browser use, automatic approval reviews, Codex for Chrome, CLI 0.129.0, and CLI 0.130.0
- [Codex app features](https://developers.openai.com/codex/app/features) - official features documentation for threads, worktrees, diffs, terminals, voice dictation, the in-app browser, and computer use
- [Codex app automations](https://developers.openai.com/codex/app/automations) - official automations documentation covering recurring tasks, worktree execution, and Triage
- [Codex app computer use](https://developers.openai.com/codex/app/computer-use) - official computer use documentation, permissions, and safety guidance
- [Codex Chrome extension](https://developers.openai.com/codex/app/chrome-extension) - official documentation for using Chrome with Codex, including website approvals, allowlists, blocklists, browser history, and data handling
- [Subagents](https://developers.openai.com/codex/subagents) - official documentation for `agents.max_threads`, `agents.max_depth`, defaults, and token-use cautions
- [Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/) - OpenAI's May 8, 2026 write-up on sandboxing, approvals, network policy, managed configuration, and agent-native telemetry
- [Tell HN: Anthropic no longer allowing Claude Code subscriptions to use OpenClaw](https://news.ycombinator.com/item?id=47633396) - public discussion of the third-party harness policy change
- [Pro Max 5x quota exhausted in 1.5 hours despite moderate usage](https://news.ycombinator.com/item?id=47739260) - public discussion of quota burn and cache behavior
- [Introducing Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7) - Anthropic's release notes on tokenizer and effort-level changes
- [Claude status](https://status.claude.com/) - incident history for Claude.ai, Claude Code, and API availability
