---
title: Why I Mostly Switched From Claude Code to the Codex Desktop App
date: '2026-05-10'
description: 'Why the Codex desktop app became my default coding-agent workspace: worktrees, threads, voice input, browser checks, automations, and reviewable boundaries.'
---

I now start most coding sessions in the Codex desktop app.

A few months ago, I wrote about [shipping with Claude Code](/writing/shipping-with-claude-code/). That post describes the setup I had then: multiple Ghostty panes, several git worktrees, Claude doing implementation, Codex and Gemini checking the work, browser automation for UI testing, and a fair amount of manual coordination. It worked. I was the coordination layer.

Disclosure: I work at OpenAI, and I have shipped a few small PRs into Codex. I am writing here in a personal capacity. Anthropic provides me with a complimentary Claude Code Max account, and I am genuinely grateful for it. Claude Code is still an excellent tool, and I still use it daily for some tasks. The category is moving quickly, and this is a snapshot of my workflow in May 2026.

I mostly switched because Codex now gives me one place for the pieces I use every day: threads, worktrees, diffs, terminals, browser checks, queued follow-ups, automations, and voice input. The app is closer to a developer workspace than a chat window, and at the volume I work, that consolidation matters.

That volume is high enough that small workflow problems surface fast. Over the last month my coding-agent usage has averaged more than 3 billion tokens per day — total throughput across every agent and thread I run in parallel, which I treat as a measure of how much work moves through the tool rather than a bill. At that scale, task state, approvals, review surfaces, and resumable threads stop being conveniences and become daily concerns.

Part of that volume comes from how I have Codex configured. The Codex docs say `agents.max_threads` defaults to `6`; I set mine to `48`. `agents.max_depth` defaults to `1`; I set mine to `3`. Do not do this unless you have effectively unlimited tokens: it burns through context quickly, creates noisy fan-out, and makes weak task boundaries expensive. It works for me because my work pattern is many bounded checks running in parallel, with enough visibility that I can still review what happened.

## How the workflow changed

The Codex app shipped on February 2, 2026, but the April 16 update was the point where enough of my workflow fit inside the app that I started treating it as my default workspace. The pieces that mattered were threads, worktrees, diffs, terminals, automations, local browser previews, screenshots, and supervised computer use. The later April and early May updates that mattered most were GPT-5.5 in Codex, browser use for local development servers and file-backed pages, automatic review for eligible approval prompts, and Codex for Chrome. OpenAI also published a safety post covering sandboxing, approvals, network policy, managed configuration, and telemetry.

Once I had more than one agent working at a time, the main overhead was orientation: reconstructing which branch each task was on, whether tests had already run, which diff I was reviewing, which screenshot was current, and whether I had already told the agent about an edge case. The desktop app helped because it made each task easier to inspect without rebuilding the whole picture every time I switched context.

On a typical day I might have one worktree fixing a flaky test, one thread reviewing an open PR, one trying a UI change against a local server, and one clicking through the app to check whether the change actually works. I move between them, review diffs, look at screenshots, approve commands, and stop the ones that are no longer on the right track. The basic unit is a single thread: a prompt, a work summary, the changed files, and a review action.

![Codex thread showing a completed dark mode change and review action](/images/writing/codex-desktop-app-post/codex-app-overview.webp)

The screenshots in this post are official product images. My own workspaces contain private code, accounts, and internal context, and they are messier than the product renders.

## State and boundaries

In daily use, the app keeps parallel work visible and separated: threads make the work visible, worktrees keep it isolated, and diffs, terminals, screenshots, and previews make it reviewable. A task ends up bundling all of that together — a thread, a worktree, a diff, a terminal history, and a verification trail — so I can run several at once without losing track of any of them.

I reproduced some of this before with terminal panes, naming conventions, and manual notes. The tradeoff was that more of the coordination stayed in my head: which pane mattered, which branch belonged to which task, which verification step had already run, and which follow-up still had to be sent. Whether the interface uses tabs or something else is secondary; what matters is that agent state stays visible enough to keep several tasks moving.

Queued follow-ups are a small part of this that I lean on more than I expected. If I notice a correction while a thread is still working, I can queue the instruction and keep moving, which lets me steer an agent without stopping my own work.

![Codex diff summary with a queued follow-up prompt](/images/writing/codex-desktop-app-post/codex-editor-diff.webp)

## Worktrees as a unit of work

Worktrees were already central to my Claude Code setup — they let me run multiple tasks against the same repository without constant interference. What changed in Codex is that the app made worktrees easier to create, inspect, and keep associated with a specific thread, and that changed how I scope agent tasks.

Before handing something to an agent, I now ask whether the task is a good worktree. For me, a good worktree has four properties: a clear goal, a reviewable diff, a concrete verification step, and a rollback path if the experiment is wrong. If I cannot describe the diff, the verification step, and the rollback path, the task usually is not ready yet. The other useful property is that a worktree is disposable: the agent can try something, I can inspect the result, and I can discard it if the approach was wrong without contaminating other work.

## Long-running threads

Longer threads have been more usable for me in Codex. I have had threads stay useful for much of a day, and what mattered was being able to come back to the same one repeatedly without reconstructing the task from scratch. In practice those long sessions were repeated cycles of implementation, test failure, patching, UI verification, summarization, and another pass, and over time the thread turns into a running implementation log.

That changed how I prompt. For shorter tasks I still tend to over-specify. For longer ones I usually give Codex the objective, the constraints, and the definition of done, then steer as needed.

## Voice input

Voice input mattered more than I expected, and the main benefit is not speed — it lowers the cost of adding context. When I type everything, I often omit details I actually care about: what we already tried, why the previous attempt failed, what behavior matters most, what I expect to break, and how I intend to verify the result. With voice I am more likely to include those details first and clean up the transcription second, and the resulting instructions are usually better.

## Automations

I use automations mainly for recurring checks that I want returned as an inbox: tell me which PRs are stuck, check whether this branch still passes, look for regressions in the flows I keep forgetting to test, flag docs or issues that drifted. The app can run those checks in the current project or in a separate worktree and send findings back to Triage, which extends the agent beyond interactive sessions into recurring maintenance work. A lot of useful engineering work is repetitive, easy to defer, and easy to forget, and this is where it goes.

![Codex automation confirmation for a weekly planning task](/images/writing/codex-desktop-app-post/codex-automations.webp)

## Browser and computer use

Browser and computer use are useful, and they need the most caution. I use three surfaces: the in-app browser for local previews, file-backed pages, and public pages; the Chrome extension for signed-in workflows where Codex needs my active browser profile; and supervised computer use for GUI-only tasks outside the browser. The distinction matters. Local QA should usually stay inside the in-app browser, logged-in websites need tighter approvals, allowlists, and blocklists, and desktop tasks need the most caution because they operate the real app with real permissions. (At launch, computer use was macOS-only.)

The developer use case I rely on most is background QA. One thread makes a change in a worktree while another opens the local preview, clicks through the changed path, and comes back with screenshots and the failures it found. That gives me a second pass without stopping implementation, and the useful output is concrete: the screenshot, the step that broke, and the diff I can review. Outside QA, computer use helps with tasks in an awkward middle ground — too annoying to do by hand, too small to justify building software for — like large repetitive cleanup inside bad web UIs, small testing flows, and extracting signal from clumsy interfaces.

The main caveat is security. Once an agent can read, browse, and act, ordinary content becomes part of the attack surface. The threat model is prompt injection through normal content: a PDF, a spreadsheet, a PR description, a browser tab, or an email thread can all affect an agent that has tools. Signed-in pages are effectively your account, and desktop access expands the blast radius. The feature is genuinely useful under supervision, with clear scope and review — which is why the safety work around sandboxing, approvals, network rules, and telemetry matters as these tools become part of real development workflows rather than occasional experiments.

## Limits and rough edges

Some of the decision was operational. April made the Claude Code tradeoffs more visible to me: quota behavior, third-party harness policy, tokenizer changes, and incidents all became part of the developer experience. Anthropic also raised Claude Code limits on May 6, which is good for users.

Codex has its own rough edges. High subagent counts can waste tokens quickly, background work can fan out into noisy checks, and browser and computer use require careful permissions. The desktop app also has more moving parts than a terminal-first tool, so I spend more time thinking about which surface should own a task. Once agents became part of my daily workflow, quota behavior, cache behavior, permissions, branch isolation, resumability, and review surfaces all started to determine whether I could use a tool for hours without babysitting it, and I cared much more about how a product exposes state, boundaries, and review loops than I had a few months earlier.

GPT-5.5 matters here because of token efficiency. OpenAI says it uses significantly fewer tokens on the same Codex tasks, and the Codex docs recommend it for most tasks when it is available. I have not independently benchmarked that claim, but for heavy agent use, token efficiency shows up directly in cost, latency, and limits.

## Where Claude Code still fits

I still reach for Claude Code for second opinions, terminal-first work, and workflows I already built around Claude-specific commands and project memory. Its Plan Mode remains a useful discipline for larger changes: read first, write a plan, then implement against that plan. I also still like Claude's Chrome workflow for quick interactive browser checks.

## The takeaway

The conclusion is narrow: Claude Code helped me build the workflow, and Codex currently gives me a better place to operate most of it. What tipped it was the combination — visible threads, isolated worktrees, integrated diffs and terminal output, queued follow-ups, the in-app browser, Chrome extension, and supervised computer use for different browser and GUI work, recurring checks through automations, and longer threads that are easier to resume. Together they cut the amount of manual coordination I was doing every day.

None of it removes the part I keep. Agents can implement, test, and summarize, but I still review the diff, check behavior changes, and decide what ships. The more agents I run, the more structure I want around them: tests, scripts, worktrees, reviewable diffs, and explicit approval boundaries. The value is practical — Codex lets me attempt more work in parallel without losing track of what is happening.

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
