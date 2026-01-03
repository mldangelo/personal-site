---
title: How I Use Claude Code
date: "2026-01-03"
description: How I shipped 1,000+ PRs in 2025 with parallel agents and cross-model audits.
---

## Context

I spend most of my time building [Promptfoo](https://github.com/promptfoo/promptfoo), an open-source LLM evaluation tool. Before I bought a Max plan, I was burning through ~$10K/month in API credits.

![Anthropic API costs for July 2025 showing $9,986.20 in token usage](/images/writing/api-costs-july-2025.png)

That spend forced me to take agent workflows seriously. Max is heavily subsidized. I have two.

The workflow I landed on ships production changes at Promptfoo, contributes to open-source projects, and occasionally updates my personal site.

This is a direct description of how I use Claude Code day to day.

## My setup

- **Two Max plans.** I hit the weekly limit, so I run two accounts.
- **Ghostty with six worktrees.** Four copies of the Promptfoo repo, plus other repos I'm touching. Each worktree gets its own Claude Code session.
- **Claude Code with Opus 4.5.** I use the most capable model even if it's slower. Speed matters less when you're switching between six terminals.
- **Cross-model audits.** I regularly verify work with Codex and Gemini. Different models catch different things.
- **CLAUDE.md and AGENTS.md files** nested throughout the repo. I update them frequently. Whenever Claude makes a repeated mistake, the fix goes into a rules file.

No prompt magic. The leverage comes from parallelism and verification.

## Running without guardrails

I run everything with `claude --dangerously-skip-permissions`.

I fully expect this to burn me someday. But the friction of approving every file edit and command breaks the flow that makes this workflow valuable. The speed gain is worth the risk, for me, on these repos, with version control as a safety net.

This isn't advice. It's a tradeoff I've made with eyes open.

## Verification makes models better

Models improve dramatically when they can check their own work. Every layer of verification helps:

- **Typed languages.** TypeScript catches errors that would otherwise reach production. The type checker is a feedback loop Claude can use mid-task.
- **Unit tests.** Fast, specific, and Claude can run them after every change.
- **End-to-end tests.** For web work, I use the [Playwright MCP](https://github.com/microsoft/playwright-mcp). Claude can navigate pages, take screenshots, and verify actual behavior, not just code that looks right. I keep this scoped to trusted sites and handle login flows myself.
- **Linting and builds.** Catch formatting drift and build failures before they compound.

When Claude has access to these checks, it stops guessing and starts converging. The tighter the feedback loop, the better the output.

## The split of responsibility

**Agent:**
- Find the right files, make edits, run checks
- Open a browser and verify UI behavior
- Write small, scoped commits
- Draft PRs and release notes

**Me:**
- Set the goal and constraints
- Review the diff for semantic changes
- Run cross-model audits when it matters
- Decide when to ship
- Take accountability for what ships

A computer can never be held accountable. That's my job. Claude does the work; I own the outcome.

## Planning and context management

A few techniques that make a noticeable difference:

**Plan mode.** Before implementing anything complex, I ask Claude to plan first. No code. Just read the relevant files, understand the constraints, and propose an approach. This catches bad ideas before they're half-built.

**Reflection.** After a task, I ask Claude to reflect: what went well, what was harder than expected, and what would it do differently. This surfaces issues that wouldn't show up in a passing test suite.

**Working memory.** For multi-step work, I have Claude write plans and state to a markdown file. This persists across context resets and keeps the agent oriented when picking up where it left off.

**Fresh context for review.** Before opening a PR, I reset the context window and ask Claude to review the diff from scratch. An agent that just wrote the code will defend it. A fresh context provides something closer to an outside perspective.

**Audit requests.** I explicitly ask Claude to look for problems: edge cases, security issues, unnecessary complexity. "Review this" gets you a summary. "Audit this and tell me what's wrong" gets you useful criticism.

## Results

### Fixing a 7-year-old Winston bug

This one surprised me. I was debugging a logging issue in Promptfoo and asked Claude to investigate. Instead of just fixing our code, it looked at the Winston package source and found a bug that had been there for seven years: `logger.end()` could emit `finish` before the file write actually completed. In practice, you could call `logger.end()` and `process.exit()` and lose log lines.

Claude asked if I wanted to open a PR upstream. I wouldn't have thought to look there on my own.

The fix was adding a `_final()` hook to the File transport so the stream waits for the underlying `fs.WriteStream` to finish. Claude wrote a minimal repro and regression tests, then [opened the PR](https://github.com/winstonjs/winston/pull/2594). It merged, and the fix shipped in Winston v3.19.0.

### Static analysis and CVE work

I spend a lot of time on static analysis. At Promptfoo I built [code scanning](https://www.promptfoo.dev/docs/code-scanning/) and [model audit](https://www.promptfoo.dev/docs/model-audit/). I also audit other open-source projects, which has led to dozens of disclosed security vulnerabilities.

Claude Code reduces the overhead: finding the right files, tracing data flows, drafting fixes, running checks. I still validate every change myself, especially around security boundaries.

### Volume

I've merged 1,000+ PRs to Promptfoo in 2025. The four-worktree setup makes this possible: one agent implements while another verifies; a third reviews or explores edge cases. No blocking, no context switching.

[![8,482 GitHub contributions in 2025](/images/writing/github-contributions-2025.png)](https://github.com/mldangelo?tab=overview&from=2025-12-01&to=2025-12-31)

For comparison: I had [5,396 contributions in 2024](https://github.com/mldangelo?tab=overview&from=2024-12-01&to=2024-12-31), before these tools matured. Same person, better workflow.

## Cross-model verification

I regularly audit Claude's work with Codex and Gemini.

Different models have different blind spots:
- Claude sometimes over-abstracts or adds unnecessary flexibility
- Codex catches edge cases Claude glosses over
- Gemini flags structural issues the others miss

A second opinion from a different model family is cheap insurance.

For long-running work (refactors, accessibility cleanups, performance), a second verifier agent enforces completion. The task isn't done until the checks pass in a clean worktree.

## The rules files

I keep CLAUDE.md at the repo root and AGENTS.md files nested in subdirectories. Claude Code reads these automatically.

The failures are predictable:

- Claude runs the wrong command
- Claude forgets formatting conventions
- Claude edits the wrong directory
- Claude changes behavior while "fixing" something

So the rules stay short and tactical:

- Exact commands for lint/type-check/test/build
- Files not to touch without asking
- Code style preferences
- Where source-of-truth data lives

Whenever I see a repeated mistake, I add a rule. The trick isn't more rules. It's the few rules that prevent the mistakes you're actually seeing.

## The outcome

I ship more because I verify more. The same loop handles production changes at Promptfoo, open-source contributions, and the occasional personal site update.

I've never enjoyed coding more. I fix bugs during customer meetings. I keep going at 2am when a year ago I would have stopped. The friction is gone. What's left is the part I actually like.

---

## Links

- [Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Promptfoo](https://github.com/promptfoo/promptfoo)
- [Simon Willison on accountability](https://simonwillison.net/2025/Dec/18/code-proven-to-work/)
- [Boris Cherny on AI-assisted development](https://x.com/bcherny/status/2007179832300581177)
