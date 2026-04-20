---
title: Why I Mostly Switched From Claude Code to the Codex Desktop App
date: '2026-04-19'
description: 'Why I mostly switched from Claude Code to the Codex desktop app: worktrees, tabs, automations, long-running sessions, background QA, and supervised computer use.'
draft: true
---

## Context

A few months ago I wrote about [shipping 1,000+ PRs with Claude Code](/writing/shipping-with-claude-code/).

Disclosure: Anthropic provides me with a complimentary Claude Code Max account, which I appreciate. I also work at OpenAI. So this is not a neutral market survey. It is a note about how my workflow changed.

At the time, my setup was basically a small agentic factory: Ghostty panes, multiple git worktrees, Plan Mode, Claude doing implementation, Codex and Gemini checking work, browser automation for UI testing, and a lot of manual coordination.

It worked. It worked well enough that I changed how I build software.

What changed for me on April 16, 2026 was not that Codex became a smarter text box. It was that OpenAI finally shipped the environment I had been faking by hand.

I have almost completely switched to the Codex desktop app.

Not because Claude Code is bad. Claude Code is still excellent, and this whole space changes weekly. I switched because the Codex app matches how I actually work now: multiple tasks in parallel, isolated worktrees, long-running threads, terminals, diffs, screenshots, browser state, automations, and review in one place.

The model matters, but the application layer is what made me switch.

Part of the motivation was also that the last month made some of the hidden costs of agentic coding harder to ignore. Claude users spent a lot of time talking about quota burn, cache behavior, outages, and restrictions around third-party harnesses. None of that makes Claude Code unimportant or suddenly bad. It does make reliability, legibility, and product surface more important than they looked a few months ago.

If I am going to build my day around agents, I do not just need the model to be smart. I need to understand what it is doing, where it is working, how much context it is carrying, what branch it touched, how to review it, and whether I can keep it running without constantly watching the quota meter.

On a normal day I might have one thread fixing a bug, another reviewing a PR, another trying a UI change in a worktree, and another running tests. The important change is that each thread keeps its own context and can keep moving while I do something else.

> Screenshot placeholder: Codex desktop app with multiple active threads and worktrees visible at once.

## Why the app changed the workflow

I used to think of Codex as something I would call from the terminal, often as a verifier.

That pattern still works. Different model families still have different blind spots, and I still like getting a second opinion on important changes.

But the desktop app changed the role Codex plays in my day. I keep Codex open now the way I used to keep my terminal open.

It is not just a place to type prompts. It is a workspace for running agents.

OpenAI described the Codex app as a command center for agents. That is close enough to how I use it. Built-in worktrees, multiple threads, automations, diffs, terminals, and browser state are workflow primitives, not cosmetic features.

That distinction matters. A better model in a workflow I cannot manage is less useful than a slightly worse model inside a system that actually fits how I work.

The practical change was not "Codex got smarter." It was that Codex became easier to operate over long sessions.

Threads, terminals, diffs, browser state, screenshots, artifacts, and worktrees make the system easier to inspect and resume. That lowers the coordination cost.

## Tabs make parallel agents manageable

Tabs sound like a small detail, but they solve a real coordination problem.

The hard part of agentic coding is not only model quality. It is state management.

What is each agent doing? Which branch is it on? Did it run tests? Is it blocked? What files did it touch? Do I need to look at a diff, a terminal, a browser, or an artifact?

You can manage all of this in terminal panes. I did. But when you do, you are the orchestration layer.

The Codex app lowers that overhead. A thread becomes a visible unit of work. I can glance at it, resume it, redirect it, inspect the diff, check the terminal output, or let it keep running while I move to something else.

That sounds small until you are juggling five tasks and two of them have been alive for hours.

It also reduces context rebuild. I try to keep the important rules and conventions in the repo so I can switch tools without losing my mind, but there is still real value in not having to reconstruct the last week of decisions every time I come back to a task.

This is why the app matters more to me than benchmark discourse. A slightly better model in a worse workflow often loses.

> Screenshot placeholder: single Codex thread showing terminal output, diff, and browser state together.

## Worktrees make parallel agents practical

The other major unlock is built-in worktree support.

In my Claude Code setup, worktrees were one of the reasons the workflow worked at all. They let me run multiple agents against the same repo without constantly stepping on myself. The cost was that I had to manage the boundaries manually.

Codex makes worktrees feel first-class.

Each task gets a boundary. Boundaries make delegation safer. Safer delegation means I am willing to run more agents at once.

It also changes how I frame tasks.

I no longer think, "Can I ask the agent to do this?" I think, "Is this a good worktree?"

A good worktree has:

- a clear goal
- a reviewable diff
- a concrete way to verify the result

That verification might be a test, a screenshot, a local server, a repro, or a PR comment. The more concrete the finish line, the better Codex tends to do.

## Long-running sessions changed my expectations

The most surprising change has been how long I can keep Codex productively running on a task.

I have had sessions that lasted something like 12 hours. Not one giant prompt where it solved everything, but a long-running implementation thread: inspect, change, run, fail, retry, check UI, summarize, continue.

That changes how I prompt.

For short sessions, I tend to over-specify. For longer sessions, I give Codex the objective, the constraints, and the definition of done. Then I steer.

The interaction starts to look less like request-and-response and more like delegation with review loops.

Long-running tasks are more useful when the app keeps the session alive and easy to resume while other work is happening.

## Automations are where this gets bigger than coding

The feature I think people are underestimating is automations.

Automations turn recurring work into an inbox. That is a much bigger deal than "run this command every morning."

The obvious use cases are engineering chores:

- check flaky tests
- summarize PRs that need review
- scan for regressions
- run dependency updates in a clean worktree
- verify whether a branch still passes
- flag docs that drifted

Those are useful. The more interesting category is mixed work: the tasks that cross code, docs, terminals, browser state, and human workflows.

Automations are the first feature that made Codex feel useful to me outside of one-off coding sessions.

If the agent can work across those surfaces and report back cleanly, it becomes easier to hand recurring chores to the system instead of remembering to run them myself.

> Screenshot placeholder: Codex automation or inbox view showing recurring tasks and findings.

## Voice makes context cheap

I did not expect voice input to matter much.

The bottleneck with agents is often not that I do not know what I want. It is that typing all the context feels expensive, so I under-specify the task.

I skip the weird edge case. I forget to mention the failed attempt from an hour ago. I do not explain the product reason behind the change.

Voice makes that context cheaper to provide.

I can say the messy version first:

- here is what we tried
- here is why it failed
- here is the behavior I actually want
- here is the thing I am worried you will break
- here is how to verify it

Then I can clean up the transcript before sending.

That is not just faster prompting. It is usually better prompting, because I include context I would otherwise omit.

## Computer use is most useful for background QA

Computer use is useful, but easy to misuse if you get sloppy with permissions.

It also makes the product broader than a coding tool.

Browser automation was already useful. Computer use is different. It can operate the messy interfaces that are usually too annoying to automate and too repetitive to justify writing a custom tool for.

The most practical use case for me is background QA.

One thread can implement in a worktree while another clicks through the app like a user, checks regressions, and comes back with screenshots and notes. That was one of the first moments where computer use seemed operationally useful rather than just novel.

One of the strangest useful things I have done with Codex was helping triage roughly 3,000 LinkedIn connections.

Not to blast automated messages. Not to spam people. Just to work through a bad human interface and help sort signal from noise.

That kind of task usually dies in the gap between "too annoying to do manually" and "not worth building software for." Computer use helps with that class of work.

It can click through the real UI, inspect what is on screen, summarize, categorize, and keep going while I supervise.

That last part matters.

The skeptical reaction to desktop control is correct. The more useful the agent becomes, the more dangerous sloppy permissions become. Signed-in browser pages are your account. Desktop access expands the attack surface. Sensitive workflows need supervision and scope.

The deeper problem is not just "what if the model makes a mistake." Once an agent can read, browse, and act, ordinary content becomes part of the attack surface. A PDF, a spreadsheet, a docs page, a PR description, a browser tab, or an email thread can all shape an agent that has tools.

That does not weaken the case for Codex. It just means the workable version is supervised, scoped, and review-heavy.

> Screenshot placeholder: background QA or computer-use thread returning screenshots and notes after a test pass.

## Why I switched

The important comparison is not "Codex is objectively better than Claude Code."

I do not think that is a stable claim. Frontier model quality moves too fast, and there are still tasks where Claude feels stronger.

Claude got me into the agentic coding workflow. Codex made that workflow feel more dependable and inspectable.

I also do not have any real vendor loyalty here. If someone else gives me a better version of this environment six weeks from now, I will switch again.

The claim I am actually making is narrower:

Codex is good enough as a model, and better enough as a workspace, that switching became rational for me.

Claude Code helped me discover that parallel worktrees plus fast verification loops could radically increase throughput. The Codex app took the same operating model and made it native:

- tabs keep the work visible
- worktrees keep the work isolated
- terminals and diffs keep the work reviewable
- voice makes context cheap
- automations turn chores into an inbox
- background computer use makes verification and UI work parallel
- computer use more broadly opens workflows that were previously too awkward to automate
- long-running threads make the agent feel persistent instead of disposable

That combination matters more to me than any single benchmark result.

## The real win is leverage, not autonomy

The online debate around coding agents often collapses into the wrong question.

People ask whether the model is autonomous enough, smart enough, or trustworthy enough to replace the human. I do not think that is the most useful frame.

The more useful frame is leverage.

Codex lets me safely run more useful work in parallel. It handles more of the tedious coordination layer. It lowers the cost of delegation. It widens the set of tasks that are worth attempting.

But I still own the outcome.

That part did not change from my Claude Code workflow. The agent does implementation. I do review, judgment, prioritization, and taste.

That is also why I do not find the "autonomous employee" framing very interesting. The working pattern is closer to pair programming at scale: multiple agents, bounded tasks, tight verification loops, human accountability.

The best AI coding tool is no longer just the model that writes the best function. It is the system that lets me safely run the most useful work in parallel.

Right now, for me, that is the Codex desktop app.

---

## Sources

- [Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/) - OpenAI's April 16, 2026 product update covering computer use, automations, memory, in-app browser support, SSH, PR review, and additional plugins
- [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/) - OpenAI's launch post for the desktop app, including worktrees, parallel threads, automations, and the "command center for agents" framing
- [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540) - OpenAI help documentation covering app availability, worktrees, automations, git functionality, and plan details
