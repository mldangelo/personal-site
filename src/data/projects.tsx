export interface IProject {
  title: string;
  subtitle?: string;
  date: string;
  desc?: string;
  link?: string;
  pdf?: string;
  youtube?: string;
  kind?: string;
}

const data: IProject[] = [
  {
    title: 'Spring AI: Anthropic tool_choice support',
    date: '2025-10-16',
    desc: "Added tool_choice controls (auto, any, tool, none) for Claude function calling to Spring AI's AnthropicChatOptions, merged into the framework.",
    link: 'https://github.com/spring-projects/spring-ai/pull/4637',
    kind: 'open source contribution'
  },
  {
    title: 'Spring AI: Anthropic prompt cache management',
    date: '2025-09-22',
    desc: 'Added per-message TTL and configurable cache-block usage for Anthropic prompt caching, shipped in Spring AI 1.1.0-M2.',
    link: 'https://github.com/spring-projects/spring-ai/pull/4342',
    kind: 'open source contribution'
  },
  {
    title: 'Testcontainers Live',
    date: '2023-08-09',
    youtube: 'T_DKV7XCNgk'
  },
  {
    title: 'A System for Automated Facial Expression Recognition',
    date: '2019-12-01',
    pdf: 'papers/Automated-Facial-Exp.pdf'
  },
  {
    title:
      'A Review of Techniques Related to Automated Facial Expression Recognition',
    date: '2019-03-01',
    pdf: 'papers/LitReview.pdf'
  },
  {
    title: 'Machine Learning Feature Selection and Analysis',
    date: '2018-12-01',
    pdf: 'papers/MachineLearningFeatureSelectionAndAnalysis-Dase.pdf'
  }
];

export default data;
