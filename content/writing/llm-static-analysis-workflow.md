---
title: 'LLM-assisted security research: a workflow that finds real bugs'
date: '2026-01-11'
description: 'A repeatable workflow for finding, verifying, and responsibly disclosing security issues using an LLM coding agent. Includes lessons on what maintainers will actually accept.'
---

I recently got my first CVE assigned, **CVE-2026-22609**, from a static-analysis bypass I reported in [fickling](https://github.com/trailofbits/fickling), a pickle security scanner ([advisory](https://github.com/trailofbits/fickling/security/advisories/GHSA-q5qq-mvfm-j35x)). The root cause was simple: an incomplete blocklist that let dangerous imports slip through. The workflow to get from suspicion to accepted fix is what mattered.

**The meta-lesson: most findings aren't something maintainers will treat as a vulnerability in the framework itself, and knowing the difference matters.**

At Promptfoo, I've been using LLM-driven static analysis as a core part of security research. Not "ask the model to hack things," but a disciplined workflow where coding agents accelerate every phase—while I stay responsible for verification and judgment.

## How this relates to traditional pen testing

White-box application pen testers follow a **static-then-dynamic** pattern:

1. **Static analysis** - Use code access to find candidate vulnerabilities (grep, SAST tools, manual review)
2. **Dynamic verification** - Spin up the application and prove the candidates are actually exploitable
3. **Reporting** - Document findings with reproduction steps

The static phase finds *possible* bugs. The dynamic phase proves *actual* bugs. A SAST tool might flag potential SQL injection, but you can't know if it's reachable and exploitable without running the application.

This workflow follows the same pattern. The difference is **agents accelerate every phase**:

- **Recon**: Read security policies, past CVEs, and closed issues
- **Static analysis**: Generate semantic hypotheses about where security controls might fail, not just pattern matches
- **Dynamic verification**: Spin up the sandbox, execute PoCs, capture output, document evidence
- **Remediation**: Draft patches and regression tests that match project style

## The funnel: most candidates get rejected

This workflow is a funnel, not a pipeline. Each phase aggressively prunes candidates:

![Security research funnel showing candidates narrowing from 50 to 0-1 through RECON, STATIC, DYNAMIC, TRIAGE, and DISCLOSURE phases](/images/security-funnel.svg)

**Most research yields zero CVEs.** That's fine—a 2% conversion rate from candidates to accepted CVEs is a *successful* audit. Each rejected candidate teaches you something about the project's security model.

## Step 0: Recon (before touching code)

Most researchers skip recon because it's slow. With agents:

```
Read SECURITY.md. Summarize: scope, "won't fix" categories.
```

```
Find all CVEs for this project. Table: class, component, root cause.
```

```
Search closed issues for rejected security reports. Why rejected?
```

```
"Unopinionated" or "secure by default"? Stance on misuse bugs?
```

**Output:** Vulnerability classes likely to be accepted, framing that's worked before.

## One loop in practice

Before explaining the full workflow, here's what one iteration actually looked like for the fickling CVE.

**The hypothesis:** Pickle scanners use blocklists. Blocklists get stale. Standard library modules get added that enable code execution.

**The search:**
```bash
rg -n "UNSAFE\|dangerous\|block" --type py
```

This landed in `analysis.py:47`, a tuple called `UNSAFE_IMPORTS` containing modules like `os`, `subprocess`, `builtins`.

**The question:** What's missing? I had the agent check Python's stdlib for modules that can execute code but weren't in the list.

**The PoC:** A pickle payload importing `ctypes` (enables arbitrary memory access and code execution) that the scanner labeled `LIKELY_SAFE`.

```python
# poc.py - 4 lines that proved the bypass
import pickle
payload = b"..." # crafted payload importing ctypes
result = fickling.check_safety(payload)
assert result == "LIKELY_SAFE"  # should have been UNSAFE
```

**The patch:** Add the missing modules to the tuple, plus a regression test.

**The test:** Fails before patch (payload rated safe), passes after (payload rated unsafe).

That's the whole loop: hypothesis, search, PoC, patch, test. The rest of this post explains how to do it systematically.

## The mental model

LLMs hallucinate but are fast. Treat outputs as hypotheses. The trick is a tight feedback loop:

- Every claim needs a file path and line number
- Every hypothesis needs a runnable command that proves it
- Every patch needs a test that fails before and passes after

If the agent can't point to concrete code, it's brainstorming, not analysis.

## Priming the agent for vulnerabilities

How you prompt matters. A generic "find vulnerabilities in this code" produces generic results. Targeted priming produces targeted findings.

**Seed with the recon output.** Before any code analysis, give the agent:
- The security policy (what's in scope, what's "won't fix")
- Past CVEs in this project (what they've accepted, fix patterns)
- Past CVEs in *similar* projects (what vulnerability classes affect this domain)
- The project's stated security model ("we sanitize X but trust Y")

This context shapes everything. An agent that knows "this project has had three blocklist bypass CVEs" will look for blocklist bypasses.

**Frame as bypass, not bug-finding.** These prompts work better than "find vulnerabilities":

```
"What assumptions does this security control make that could be violated?"
"How would you bypass this guard if you controlled input X?"
"What's missing from this blocklist/allowlist?"
"Where does this code fail open instead of fail closed?"
"What would a malicious actor with knowledge of the codebase try?"
```

**Use the "assumed breach" model.** Instead of "can you break in?", ask "assuming you've bypassed layer N, what can you reach?" This often finds more interesting bugs because you skip the boring entry-point hunting.

**Provide negative examples.** Show the agent a few known vulnerabilities in similar code, then ask "are there similar patterns here?" Pattern-matching against known-bad is more reliable than open-ended hunting.

## Resetting context when stuck

Long conversations accumulate assumptions. When stuck:

- **Hard reset:** New conversation, summarize what you've learned
- **Perspective reset:** "Why might X be secure?" instead of "how do I break X?"
- **Persona reset:** Approach as a code reviewer, a developer who'd misuse the API, or a maintainer evaluating the report
- **Scope reset:** Zoom out to architecture, zoom in to a specific line

## Step 1: Sandbox the repo

Clean checkout, no secrets, limited network, pinned dependencies. I use Claude Code scoped to one directory. Log every command—if I can't hand someone a commit hash, a command, and expected output, it's not a finding.

## Step 2: Build an exploit catalog

Before touching code, I build a threat model specific to what the project does. Keep it focused.

A pickle scanner should make me think "blocklist bypass" and "deserialization gadgets." A web framework? Path traversal, SSRF, header injection. A CI tool? Command injection and artifact poisoning.

Common exploit classes I seed:

**Parsing and deserialization:** untrusted `pickle`, `yaml.load`, `eval`, `exec`; template engines that compile user input; plugin loading from paths or URLs.

**Command and process boundaries:** `subprocess` with `shell=True` or string-built commands; environment variable injection; file writes to locations that later get executed.

**Network and path boundaries:** SSRF, open redirects, URL parsing edge cases; path traversal, zip slip, symlink attacks; missing auth on "fetch remote" or "download artifact."

**Language-specific sharp edges:** Python (`ctypes`, `marshal`, `runpy`, `importlib`), Node (`child_process`, `vm`, prototype pollution, ReDoS), Go (`text/template` vs `html/template`, unsafe reflection).

## Step 3: Find the guards

Locate enforcement points: allowlists, blocklists, heuristics. Search for `safe`, `unsafe`, `sanitize`, `validate`, `allow`, `deny`, `block`.

In my CVE, the guard was a hardcoded tuple of "unsafe modules"—exactly the pattern that creates bypasses.

Also check: **what flags disable the guards?** Options like `--no-verify` or `--skip-integrity-check`. Most bypasses come from fail-open logic.

## Step 4: Attempt bypasses with minimal PoCs

For each exploit class, construct the smallest reproduction. The PoC should prove the dangerous action is reachable, the guard fails, and impact is real.

My bar: **small enough to paste into a GitHub issue without attachments.**

Also generate negative controls—inputs that *should* be caught. This catches false negatives.

## Step 5: Verify in the sandbox

The agent spins up the software, executes the PoC, captures output, documents evidence (commit hash + command + result). You review.

If the PoC doesn't work, it's not a finding. LLMs will confidently propose PoCs that don't work. Dynamic verification proves the bug is real.

## Step 6: Patch and test

A good patch is minimal, readable, tested (fails before, passes after), and matches project style.

**Two patterns:** (1) Convert lists into policies—if the bug is "forgot X in a list," restructure so it's harder to miss. (2) Encode the bug as a test—one regression test is worth paragraphs.

After patching, verify: original PoC now caught, known-good still works, existing tests pass.

## The hard part: knowing what's actually a CVE

This is where most security research fails.

![CVE test checklist showing questions to ask and vulnerability vs hazard distinction](/images/cve-test.svg)

If exploiting the issue requires opt-in config *and* obvious misuse, it's a hazard. Document it, don't file it.

**In practice:** While reviewing Express.js, I generated candidates with working PoCs. Most were hazards. "User input to template render allows option pollution"—hazard (obvious misuse). "Redirect reflects user input without scheme validation"—Express issued [CVE-2024-43796](https://github.com/expressjs/express/security/advisories/GHSA-qw6h-vgh9-j6wx) for this in certain circumstances. The line is blurry.

## Understanding maintainer psychology

**"Unopinionated" frameworks (Express, Flask):** "We're a thin wrapper. Misuse is your bug." They accept reports where the framework does something wrong, not where apps misuse APIs.

**"Batteries included" frameworks (Rails, Django):** More likely to accept "you should block X by default."

Burning credibility on rejected reports makes future reports harder. When in doubt, file a documentation PR instead.

## When NOT to file CVEs

**CVE-worthy:** Default-config vulns, control bypasses, framework disabling dependency security.

**Documentation PR:** "Misuse leads to bad things," config-dependent with clear docs.

**Don't file:** Multiple developer mistakes required, clearly documented intended behavior.

When you do file, 90 days before publishing is the norm.

## This is where the industry is heading

This workflow isn't novel—it's where the industry is converging. OpenAI's Aardvark, now in private beta, scans codebases and proposes patches. It's already found novel CVEs.

The pattern: agent executes mechanical work, human reviews at decision points. The bottleneck isn't finding candidates—models are increasingly good at that. The bottleneck is **triage**: what's exploitable, what maintainers will accept, what's worth disclosure overhead.

## If you want to try this

Pick a security-focused tool you use—scanners have explicit security claims to test. Clone it, read SECURITY.md, then ask: "What's the blocklist missing? Where does it fail open?"

---

## Cheatsheet

![Security research workflow diagram showing phases from RECON through DISCLOSURE with review gates](/images/security-workflow.svg)

**Agent executes every phase. Human judges at every gate.**

**Funnel:** 50 candidates → 15 hypotheses → 5 PoCs → 2 verified → 1 CVE-worthy → 0-1 accepted

**Key prompts:**
```
RECON:    "What vulnerability classes has this project accepted CVEs for?"
STATIC:   "What assumptions does this guard make that could be violated?"
DYNAMIC:  "Run this PoC and capture the output with commit hash."
TRIAGE:   "Does this require opt-in config AND obvious misuse? If yes, it's a hazard."
```

**Exploit hypothesis template:**
```
Target:   [function or endpoint]
Guard:    [security control and location]
Bypass:   [how the guard fails]
Repro:    [one command that proves it]
Success:  [expected vs actual behavior]
```

**The triage test:** Would I accept this report if I were the maintainer?

---

If you try this and find something real, I'd love to hear about it. And if you're a maintainer who receives a report from this workflow, know that the goal is to help, not to pad a CVE count.

*Thanks to the fickling maintainers at Trail of Bits for a quick and professional response.*
