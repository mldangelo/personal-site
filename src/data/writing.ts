export interface WritingItem {
  title: string;
  url: string;
  date: string;
  description: string;
}

const data: WritingItem[] = [
  {
    title: 'How AI Regulation Changed in 2025',
    url: 'https://www.promptfoo.dev/blog/ai-regulation-2025/',
    date: '2025-12-15',
    description:
      'Why "AI compliance questions" appeared in security questionnaires and RFPs, and how policy becomes contract requirements.',
  },
  {
    title:
      "Why Attack Success Rate (ASR) Isn't Comparable Across Jailbreak Papers",
    url: 'https://www.promptfoo.dev/blog/asr-not-portable-metric/',
    date: '2025-12-12',
    description:
      "ASR isn't portable across papers because measurement choices dominate the headline number. Includes math and a checklist for reading papers.",
  },
  {
    title: 'GPT-5.2 Initial Trust and Safety Assessment',
    url: 'https://www.promptfoo.dev/blog/gpt-5.2-trust-safety-assessment/',
    date: '2025-12-11',
    description:
      'Day-zero red team of GPT-5.2 focusing on jailbreak resilience and harmful content.',
  },
  {
    title: 'Real-Time Fact Checking for LLM Outputs',
    url: 'https://www.promptfoo.dev/blog/llm-search-rubric-assertions/',
    date: '2025-11-28',
    description:
      'Introduces search-rubric, an assertion where a search-enabled judge verifies time-sensitive claims during evals and CI.',
  },
  {
    title:
      'When AI becomes the attacker: The rise of AI-orchestrated cyberattacks',
    url: 'https://www.promptfoo.dev/blog/anthropic-threat-intelligence-vibe-hacking/',
    date: '2025-11-10',
    description:
      'Connects malware querying LLMs at runtime with "vibe hacking" case studies. Defense needs continuous testing.',
  },
  {
    title:
      'Reinforcement Learning with Verifiable Rewards Makes Models Faster, Not Smarter',
    url: 'https://www.promptfoo.dev/blog/rlvr-explained/',
    date: '2025-10-24',
    description:
      'RLVR gains are often "search compression" rather than new reasoning ability.',
  },
  {
    title: "Prompt Injection vs Jailbreaking: What's the Difference?",
    url: 'https://www.promptfoo.dev/blog/jailbreaking-vs-prompt-injection/',
    date: '2025-08-18',
    description:
      'Jailbreaking targets model safety training; prompt injection targets application trust boundaries.',
  },
  {
    title: 'AI Safety vs AI Security in LLM Applications: What Teams Must Know',
    url: 'https://www.promptfoo.dev/blog/ai-safety-vs-security/',
    date: '2025-08-17',
    description:
      'Safety protects people from harmful outputs; security protects systems from adversarial manipulation.',
  },
  {
    title: 'Evaluating political bias in LLMs',
    url: 'https://www.promptfoo.dev/blog/grok-4-political-bias/',
    date: '2025-07-24',
    description:
      'Open methodology and dataset (2,500 political statements) to measure political leaning in models.',
  },
  {
    title: "Testing Humanity's Last Exam with Promptfoo",
    url: 'https://www.promptfoo.dev/docs/guides/hle-benchmark/',
    date: '',
    description: 'Guide on using Promptfoo to test the HLE benchmark.',
  },
];

export default data;
