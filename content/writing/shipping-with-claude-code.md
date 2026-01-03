---
title: How I Use Claude Code
date: "2026-01-03"
description: Multiple agents, multiple models, one verification loop.
---

## Context

I spend most of my time building [Promptfoo](https://github.com/promptfoo/promptfoo), an open-source LLM evaluation tool. Before I bought a Max plan, I was burning through ~$10K/month in API credits.

![Anthropic API costs for July 2025 showing $9,986.20 in token usage](/images/writing/api-costs-july-2025.png)

That spend forced me to take agent workflows seriously. Max is heavily subsidized—if you're doing any serious work with Claude, you should have one. I have two.

The workflow I landed on ships production changes at Promptfoo, contributes to open-source projects, and occasionally updates my personal site when the cost is negligible.

This is a direct description of how I use Claude Code day to day.

## The setup

- **Two Max plans.** I hit the weekly limit, so I run two accounts.
- **Ghostty with six worktrees.** Four copies of the Promptfoo repo, plus other repos I'm touching. Each worktree gets its own Claude Code session.
- **Claude Code with Opus 4.5.** I use the most capable model even if it's slower. Speed matters less when you're switching between six terminals.
- **Cross-model audits.** I regularly verify work with Codex and Gemini. Different models catch different things.
- **CLAUDE.md and AGENTS.md files** nested throughout the repo. I update them frequently—whenever Claude makes a repeated mistake, the fix goes into a rules file.

No prompt magic. The leverage comes from parallelism and verification.

## Verification makes models better

Models improve dramatically when they can check their own work. Every layer of verification helps:

- **Typed languages.** TypeScript catches errors that would otherwise reach production. The type checker is a feedback loop Claude can use mid-task.
- **Unit tests.** Fast, specific, and Claude can run them after every change.
- **End-to-end tests.** For web work, I use the [Playwright MCP](https://github.com/microsoft/playwright-mcp). Claude can navigate pages, take screenshots, and verify actual behavior—not just code that looks right. I keep this scoped to trusted sites and handle login flows myself.
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

This keeps speed high without lowering the bar.

## Planning and context management

A few techniques that make a noticeable difference:

**Plan mode.** Before implementing anything complex, I ask Claude to plan first. No code—just read the relevant files, understand the constraints, and propose an approach. This catches bad ideas before they're half-built.

**Reflection.** After a task, I ask Claude to reflect: what went well, what was harder than expected, what would it do differently. This surfaces issues that wouldn't show up in a passing test suite.

**Working memory.** For multi-step work, I have Claude write plans and state to a markdown file. This persists across context resets and keeps the agent oriented when picking up where it left off.

**Fresh context for review.** Before opening a PR, I reset the context window and ask Claude to review the diff from scratch. An agent that just wrote the code will defend it. A fresh context provides something closer to an outside perspective.

**Audit requests.** I explicitly ask Claude to look for problems: edge cases, security issues, unnecessary complexity. "Review this" gets you a summary. "Audit this and tell me what's wrong" gets you useful criticism.

## Examples that actually shipped

### Fixing a 7-year-old Winston bug

I used Claude Code to track down a long-standing Winston issue where `logger.end()` could emit `finish` before the file write actually completed. In practice, you could call `logger.end()` and `process.exit()` and lose log lines.

The fix was adding a `_final()` hook to the File transport so the stream waits for the underlying `fs.WriteStream` to finish before emitting `finish`. I added a minimal repro and regression tests, opened a PR, and it merged.

That change shipped in Winston v3.19.0.

### Static analysis and CVE work

At Promptfoo I spend a lot of time on static analysis and security work. I've found and disclosed dozens of CVEs. Claude Code reduces the overhead: finding the right files, tracing data flows, drafting fixes, running checks. I still validate every change myself, especially around security boundaries.

### Multi-file refactors

The four-worktree setup pays off for large refactors. One agent implements changes across the codebase while another runs verification in a clean worktree. A third can review the diff or explore edge cases. No blocking, no context switching.

## Cross-model verification

I regularly audit Claude's work with Codex and Gemini.

Different models have different blind spots:
- Claude sometimes over-abstracts or adds unnecessary flexibility
- Codex catches edge cases Claude glosses over
- Gemini flags structural issues the others miss

A second opinion from a different model family is cheap insurance.

## Long-running tasks

Some tasks need multiple passes: accessibility cleanups, refactors, performance work, UI polish.

I don't end them with "looks good." I end them when the verification list is green:

- Lint passes
- Type-check passes
- Tests pass
- Build succeeds
- Browser smoke test passes

Stop hooks and a second verifier agent make that reliable. I'm not chasing autonomy—I want fewer half-finished endings.

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

Whenever I see a repeated mistake, I add a rule. The trick isn't more rules—it's the few rules that prevent the mistakes you're actually seeing.

## The outcome

I ship more because I verify more. The same loop handles production changes at Promptfoo, open-source contributions, and the occasional personal site update.

The workflow isn't about trusting AI more. It's about making verification cheap enough that problems get caught early.

---

## Links

- [Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Promptfoo](https://github.com/promptfoo/promptfoo)
