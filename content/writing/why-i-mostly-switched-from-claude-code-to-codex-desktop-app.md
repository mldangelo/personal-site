---
title: Why I Mostly Switched From Claude Code to the Codex Desktop App
date: '2026-06-23'
description: 'How the Codex desktop app became my default coding workspace, and where Claude Code still wins.'
---

I now start most coding sessions in the Codex desktop app.

A few months ago, I wrote about [shipping with Claude Code](/writing/shipping-with-claude-code/). That post describes the setup I had then: multiple Ghostty panes, several git worktrees, Claude doing implementation, Codex and Gemini checking the work, browser automation for UI testing, and a fair amount of manual coordination. It worked. I was the coordination layer.

Disclosure: I work at OpenAI, and I have shipped a few small PRs into Codex. I am writing here in a personal capacity. Anthropic provides me with a complimentary Claude Code Max account, and I am grateful for it. Claude Code is still an excellent tool, and I still use it daily for some tasks. The category is moving quickly, and this is a snapshot of my setup as of late spring 2026.

I mostly switched because Codex now gives me one place for the pieces I use every day: threads, worktrees, diffs, terminals, browser checks, queued follow-ups, automations, and voice input. It feels more like a developer workspace than a chat window, and at the volume I work, having all of it in one window cuts a lot of day-to-day friction.

That volume is high enough that small workflow problems show up fast. Over the last month my coding-agent usage has averaged more than 3 billion tokens a day. The number sounds absurd, and most of it is cached input: the same repo context read again and again across dozens of parallel threads. I track it as a measure of how much work is moving through the tool, not what I'm spending. At that volume, the boring parts decide everything: approvals, review surfaces, and whether a thread picks back up where it left off.

Part of that volume comes from how I have Codex configured. The docs say `agents.max_threads` defaults to `6`; I set mine to `48`. `agents.max_depth` defaults to `1`; I set mine to `3`. Don't do this unless you have effectively unlimited tokens. It burns context fast and turns weak task boundaries into a lot of expensive, noisy fan-out. I get away with it because my work is mostly small, bounded checks running side by side, and I can still see enough to review what each one did. It's also why I default to GPT-5.5 in Codex when it's available: OpenAI says it uses significantly fewer tokens on the same tasks, and at my volume that turns straight into lower cost and fewer limit walls. I haven't benchmarked the claim myself, but the token math is the whole reason it's relevant to me.

## How the workflow changed

The Codex app shipped on February 2, 2026, but the April 16 update was the point where enough of my workflow fit inside the app that I started treating it as my default. By then it had the parts I lived in: threads, worktrees, diffs, terminals, automations, local browser previews, screenshots, and supervised computer use. The later April and early May releases filled in the rest: GPT-5.5 in Codex, browser use for local development servers and file-backed pages, automatic review for eligible approval prompts, and Codex for Chrome. OpenAI also published a safety post covering sandboxing, approvals, network policy, managed configuration, and telemetry.

Once I had more than one agent going, the overhead was orientation: reconstructing which branch each task was on, whether tests had already run, which diff I was looking at, which screenshot was current, and whether I'd already warned the agent about some edge case. The desktop app helped because I could inspect a task without rebuilding the whole picture every time I switched context.

On a typical day I might have one worktree fixing a flaky test, one thread reviewing an open PR, one trying a UI change against a local server, and one clicking through the app to see whether the change actually works. I move between them, read diffs, look at screenshots, approve commands, and kill the ones that have wandered off track. Each one is a single thread: a prompt, a work summary, the changed files, and a review action.

![Codex thread showing a completed dark mode change and review action](/images/writing/codex-desktop-app-post/codex-app-overview.webp)

The screenshots in this post are official product images. My own workspaces are full of private code and internal context, and they are a lot messier than the product renders.

## State and boundaries

Most of what the app buys me is keeping parallel work straight. I can see what each agent is doing in its own thread, the diffs and terminals are one click away, and queued follow-ups let me correct a thread without stopping it. If I spot a fix while an agent is mid-task, I queue the instruction and keep going, instead of waiting for it to finish so I can interrupt.

I used to approximate this with terminal panes, naming conventions, and notes to myself. The cost was holding it all in my head: which pane was which, which branch went with which task, what I'd already verified, what I still needed to say. The specific UI is beside the point. What I needed was for that state to live somewhere other than my memory.

![Codex diff summary with a queued follow-up prompt](/images/writing/codex-desktop-app-post/codex-editor-diff.webp)

## Worktrees as a unit of work

Worktrees are where the isolation actually comes from, and they were already central to my Claude Code setup: they let me run several tasks against one repo without them stepping on each other. What Codex changed is that spinning up a worktree and pinning it to a thread got easy enough that I started scoping tasks around them. Now a task is a bundle: a thread, its worktree, the diff, and whatever I ran to verify it.

Before I hand something off, I ask whether it makes a good worktree. A good one has a clear goal, a diff I'll be able to review, a concrete way to confirm it worked, and a way to back out if it didn't. If I can't describe those last three up front, the task usually isn't ready. I also like that a worktree is disposable: an agent can try an approach, I can look at what it did, and if it went sideways I throw it away without touching anything else.

## Long-running threads

Long threads hold up better in Codex than they used to for me. I've had one stay useful for most of a day, and the win is simply coming back to it without rebuilding the context each time. Those sessions are mostly the same loop on repeat: implement, watch a test fail, patch, check the UI, summarize, go again. The thread slowly becomes a log of everything that happened.

That changed how I prompt. On short tasks I still tend to over-specify. On long ones I give Codex the goal, the constraints, and what "done" looks like, then correct it as it goes.

## Voice input

Voice input caught me off guard, and not because it's faster. It lowers the friction of adding context. When I type, I tend to leave out the details I actually care about: what we already tried, why the last attempt failed, what I expect to break, how I plan to check it. Speaking, I get those in first and fix the transcription afterward, and the instructions come out better for it.

## Automations

I mostly use automations for recurring checks I want delivered like an inbox: which PRs are stuck, whether this branch still passes, regressions in the flows I always forget to test, docs that have drifted. They can run in the current project or a separate worktree and drop their findings into Triage, so the agent keeps working between my sessions. A lot of real engineering work is repetitive and easy to forget, and this is where it goes.

![Codex automation confirmation for a weekly planning task](/images/writing/codex-desktop-app-post/codex-automations.webp)

## Browser and computer use

Browser and computer use are the most useful of these features and the ones I'm most careful with. I split them across three surfaces: the in-app browser for local previews and public pages; Codex for Chrome, the browser extension, for signed-in work where it needs my actual profile; and supervised computer use for GUI tasks outside the browser. Keep local QA in the in-app browser. Signed-in sites need tighter approvals and allowlists, because that's a live session you're handing over. Desktop access is the one I watch hardest, since it drives the real app with real permissions. (At the April launch, computer use was macOS-only.)

Background QA is the case I lean on most. While one thread implemented the dark-mode change in the screenshot above, another opened the local preview, clicked through the toggle, and came back with shots of the states that looked wrong. I got that second pass without pausing the implementation, and what came back was concrete: a screenshot, the step that failed, and a diff to review. Outside QA, computer use is good for the awkward jobs that are too tedious to do by hand but too small to build a tool for: bulk cleanup in a bad web UI, a fiddly testing flow, pulling signal out of an interface that fights you.

Security is the real catch. The moment an agent can read and act on content, that content becomes part of your attack surface. The realistic threat is prompt injection through ordinary material: a PDF, a spreadsheet, a PR description, a browser tab, or an email thread can each carry instructions to an agent that holds tools. A signed-in page is effectively your account, and desktop access widens the blast radius further. It's worth the risk under supervision, with tight scope and a human in the loop, which is why the sandboxing, approval, and network controls are what make these features usable for real development instead of one-off demos.

## Limits and rough edges

Some of this was just operational. Over April, the Claude Code tradeoffs got more visible to me: quota and rate-limit behavior, the third-party harness policy, tokenizer changes, and a few incidents. Some of that I hit myself; some I'm taking from public reports. Anthropic raised Claude Code limits on May 6, which is good for users.

Codex has its own rough edges. High subagent counts burn tokens fast, background work can spray out into noisy checks, and the browser and computer-use features need careful permissions. The app has more surface area than a terminal-first tool, so I spend more time deciding which surface should own a given task. And once agents were running all day, a pile of unglamorous things — cache behavior, permissions, branch isolation, whether a thread resumes cleanly — became what decides whether I can work for hours without babysitting. I pay far more attention now to how a tool exposes its state and where it lets me review than I did a few months ago.

## Where Claude Code still fits

I still reach for Claude Code for second opinions, for terminal-first work, and for the workflows I'd already built around its commands and project memory. Plan Mode is still a good discipline on bigger changes: read first, write the plan, then build against it. And I still like Claude's Chrome workflow for quick interactive checks.

## Where this nets out

So the claim is a modest one. Claude Code helped me build this workflow; Codex is currently a better place to run most of it. No single feature tipped the balance. It was getting the threads, worktrees, diffs, follow-ups, browser surfaces, and automations into one place, with sessions I can actually resume. The result is that I hand-coordinate far less than I used to.

None of this replaces the part I keep for myself. Agents can write the code, run the tests, and summarize what they did, but I still read the diff and decide what ships. The more of them I run, the more scaffolding I want around them: mostly tests and firm approval boundaries, so a bad run can't get far. The payoff is simple: I can attempt more in parallel without losing the plot.

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
- [Higher usage limits for Claude and a compute deal with SpaceX](https://www.anthropic.com/news/higher-limits-spacex) - Anthropic's May 6, 2026 announcement of higher Claude Code and Opus API limits
- [Tell HN: Anthropic no longer allowing Claude Code subscriptions to use OpenClaw](https://news.ycombinator.com/item?id=47633396) - public discussion of the third-party harness policy change
- [Pro Max 5x quota exhausted in 1.5 hours despite moderate usage](https://news.ycombinator.com/item?id=47739260) - public discussion of quota burn and cache behavior
- [Introducing Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7) - Anthropic's release notes on tokenizer and effort-level changes
- [Claude status](https://status.claude.com/) - incident history for Claude.ai, Claude Code, and API availability
