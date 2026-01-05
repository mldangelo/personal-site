---
title: Notes on the Eurostar chatbot "vulnerability" report
date: '2026-01-05'
description: Looking at what makes something a vulnerability versus a hardening opportunity in LLM applications.
---

_I work on [Promptfoo](https://github.com/promptfoo/promptfoo), an open-source LLM red teaming tool._

On December 22, 2025, Pen Test Partners published ["Eurostar AI vulnerability: when a chatbot goes off the rails"](https://www.pentestpartners.com/security-blog/eurostar-ai-vulnerability-when-a-chatbot-goes-off-the-rails/) claiming four "distinct security issues" in Eurostar's public chatbot.

Based on what's demonstrated in that post, most of this isn't a vulnerability. It's a mix of expected LLM behavior, hardening opportunities, and one low-severity web bug.

Here's why that distinction matters.

## What makes something a vulnerability

A vulnerability generally means:

1. **A security boundary was crossed** - auth, authorization, isolation, trust boundaries, code execution in another user's context
2. **There is demonstrated impact** - data exfiltration, account compromise, unauthorized actions, cross-user effects

OWASP's LLM Top 10 includes prompt injection and insecure output handling as real categories, but explicitly notes that severity depends on context and agency: what the model is allowed to touch and do.

The Pen Test Partners post doesn't demonstrate either crossing a boundary or concrete harm.

## What the report actually shows

The post calls these "vulnerabilities" but doesn't demonstrate unauthorized access to other users' data, unauthorized actions, cross-user XSS, or any actual exploit chain with impact. Instead, several findings are paired with what _could_ happen if the chatbot had more capabilities.

**1. Guardrail bypass via client-side history manipulation**

The server validates only the latest message but trusts the client-submitted `chat_history`. Make the latest message harmless, edit earlier messages to carry prompts that would fail the guardrail.

This is a client-trust issue. The question is: what does bypassing the guardrail enable? For a public help chatbot with no tools or privileged access, bypassing it just means you can steer the model with different text. That's the default property of an LLM. The guardrail bypass matters if it's enforcing authorization, but no unauthorized action is shown.

**2. System prompt extraction via prompt injection**

Standard prompt injection extracted the system prompt. The post frames this as "information disclosure" but also notes that prompt injection here did not expose other users' data.

The industry trend is moving away from treating prompts as secrets. Anthropic publishes system prompts for Claude's consumer apps. xAI publishes Grok prompts on GitHub. The meaningful question is: what can someone do with that knowledge? In this case, nothing beyond what's already possible.

**3. HTML rendering without sanitization**

The system prompt instructs the model to return HTML for links, and those snippets render directly in the UI. This allows arbitrary HTML/JS output.

This is the clearest web security issue - it maps to OWASP's "Insecure Output Handling" category. But the post acknowledges this is "only" self-XSS as demonstrated. Self-XSS is widely treated as low severity unless you can demonstrate exploitation of other users. HackerOne explicitly lists "self-exploitation, such as self-XSS" as ineligible unless it affects other accounts.

Could this escalate to real XSS? Yes, if chat transcripts are shown to support agents, if conversations are shared, or if payloads persist and replay in someone else's session. Those are common blind XSS patterns. But the post doesn't demonstrate that chain.

**4. Unverified conversation/message IDs**

The backend accepted non-UUID values like "1" or "hello" for conversation and message IDs. Testing cross-user access would have been out of scope.

This could be an IDOR or lead to stored XSS across users, but neither is shown. The post offers a hypothetical about injecting a payload and reusing a conversation ID so a victim loads it, which requires specific (unconfirmed) system behavior about how chats are stored and replayed.

## What would have made this a real vulnerability

If the report had shown any of:

- **Cross-user data access** - reading another user's chats, bookings, personal details
- **Unauthorized actions** - changing bookings, issuing refunds, triggering support workflows, querying internal systems
- **Non-self XSS** - stored/shared XSS executing in another user's session or in an agent/admin console
- **A demonstrated exploit chain** - prompt injection → tool misuse / auth bypass → impact

OWASP's point about "agency" is exactly this: prompt injection becomes severe when the model is wired to tools, data stores, or workflows without robust authorization and output handling. None of that is shown here.

## What this actually is

The hardening recommendations in the post are sound: don't render model output as raw HTML, validate inputs, enforce decisions server-side, bind IDs to sessions. Those are good engineering practices.

But calling these "AI vulnerabilities" overstates what's demonstrated:

- A client-trust weakness (only security-relevant if the model has privileged actions or sensitive data)
- Prompt injection extracting a system prompt (not inherently sensitive; industry is publishing these)
- Self-XSS (should be fixed, but acknowledged as low severity)
- Unverified IDs without demonstrated cross-user impact (could be hardened)

The author even acknowledges this: "these issues weren't desperately serious" and frames concern around future features. That's a reasonable conclusion for an internal security review. It's not the same as a public vulnerability disclosure.

---

The real finding: there's an insecure-output-handling bug (HTML rendering) that should be fixed. The rest is about not trusting the client, not treating prompts as secrets, and not confusing guardrails with security.

---

## Links

- [Eurostar AI vulnerability report](https://www.pentestpartners.com/security-blog/eurostar-ai-vulnerability-when-a-chatbot-goes-off-the-rails/) - Pen Test Partners
- [Hacker News discussion](https://news.ycombinator.com/item?id=46492063) - Comments on the Eurostar report
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) - OWASP Foundation
- [LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) - OWASP Gen AI Security
- [System Prompts](https://platform.claude.com/docs/en/release-notes/system-prompts) - Claude documentation
- [Grok prompts repository](https://github.com/xai-org/grok-prompts) - xAI on GitHub
- [Core Ineligible Findings](https://docs.hackerone.com/en/articles/8494488-core-ineligible-findings) - HackerOne documentation
- [The Ultimate Guide to XSS](https://www.bugcrowd.com/blog/the-ultimate-guide-to-finding-and-escalating-xss-bugs/) - Bugcrowd
