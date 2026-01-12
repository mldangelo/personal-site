# Social Media Copy

## Hacker News

```
I got my first CVE (CVE-2026-22609) using an LLM-assisted security research workflow. This isn't "ask ChatGPT to find vulnerabilities"—it's agents accelerating every phase while you stay responsible for judgment.

The workflow is a funnel with aggressive pruning:

RECON (50) → worth investigating? → STATIC (15)
STATIC (15) → real code evidence? → DYNAMIC (5)
DYNAMIC (5) → PoC actually worked? → TRIAGE (2)
TRIAGE (2) → vulnerability or hazard? → DISCLOSURE (1)
DISCLOSURE (1) → maintainer accepts? → OUTCOME (0-1)

That's a 2% conversion rate. Most research yields zero CVEs, and that's fine.

The agent executes every phase—including dynamic verification (spinning up sandboxes, running PoCs). You judge at each gate.

Key insight: the triage gate matters most. Vulnerability (framework violates its own contract) vs hazard (sharp tool, app misuse required). If exploiting it requires opt-in config AND obvious misuse, it's a hazard—don't file it.

This is where the industry is heading. OpenAI's Aardvark (in private beta) does the same pattern—scan codebases, propose patches. It's already found novel CVEs.

The bottleneck isn't finding candidates anymore. It's triage.

Full write-up with priming techniques and context reset tricks: <link>
```

## LinkedIn

```
Got my first CVE assigned (CVE-2026-22609) after reporting a static-analysis bypass in an open-source security tool.

The bug was simple—an incomplete blocklist—but the workflow to get from suspicion to accepted fix is what mattered.

The workflow is a funnel:
• RECON: 50 candidates → reject "won't fix" categories
• STATIC: 15 hypotheses → reject solid guards
• DYNAMIC: 5 PoCs → reject false positives
• TRIAGE: 2 verified → reject hazards (app misuse required)
• DISCLOSURE: 1 CVE-worthy → maintainer may still reject

That's a 2% conversion rate. Most research yields zero CVEs.

The agent executes every phase—recon, static analysis, dynamic verification, remediation. You judge at every gate.

Before filing, ask: "Would I accept this report if I were the maintainer?"

Full write-up with review gates at each transition: <link>
```

## Twitter/X Thread

```
Got my first CVE using LLM-assisted security research. Here's the workflow:

1/ It's a funnel. Each phase has a review gate that rejects candidates:

RECON (50) → STATIC (15) → DYNAMIC (5) → TRIAGE (2) → DISCLOSURE (1) → OUTCOME (0-1)

That's a 2% conversion rate. Most research yields zero CVEs.

2/ The agent executes every phase:
- Recon (security policy, past CVEs, closed issues)
- Static analysis (find guards, draft PoCs)
- Dynamic verification (spin up sandbox, RUN the exploits)
- Remediation (draft patches)

You judge at each gate.

3/ The triage gate is where most "findings" die.

Vulnerability: framework violates its own contract
Hazard: sharp tool, app misuse required

If it requires opt-in config + obvious misuse, it's a hazard. Don't file it.

4/ Priming matters. Don't ask "find vulnerabilities."

Ask:
- "What assumptions does this guard make that could be violated?"
- "What's missing from this blocklist?"
- "Assuming you've bypassed layer N, what can you reach?"

5/ When stuck, reset context:
- Hard reset: new conversation, summarize what you've learned
- Perspective reset: "why might this be secure?" instead of "how do I break it?"

6/ This is where the industry is heading. OpenAI's Aardvark (in private beta) does the same pattern. The bottleneck isn't finding candidates. It's triage.

Full write-up: <link>
```
