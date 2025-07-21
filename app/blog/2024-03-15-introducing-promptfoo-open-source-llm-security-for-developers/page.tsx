import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Introducing Promptfoo: Open Source LLM Security for Developers</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2024-03-15">March 14, 2024</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">promptfoo</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">llm</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">security</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">open-source</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>After three transformative years at SmileID, where we scaled identity verification to 170 million users across Africa, I'm embarking on a new journey. Today, we're launching Promptfoo - open-source testing and security tools for LLM applications.</p>
            <h2>The Origin Story</h2>
            <p>Six months ago, while still at SmileID, we started integrating LLMs into our products. What we discovered was alarming:</p>
            <ul>
              <li>No standardized way to test LLM applications</li>
            </ul>
            <p>            - Security vulnerabilities everywhere</p>
            <p>            - Prompt injection attacks were trivial</p>
            <p>            - No tools to ensure reliability at scale</p>
            <p>            We built internal tools to solve these problems. Then we realized every company adopting LLMs faced the same challenges.</p>
            <h2>Why Leave SmileID?</h2>
            <p>SmileID is thriving:</p>
            <ul>
              <li>170M+ users verified</li>
            </ul>
            <p>            - Profitable and growing </p>
            <p>            - Incredible team of 150+</p>
            <p>            - Clear path to unicorn status</p>
            <p>            But the LLM security problem kept me up at night. The potential for harm is massive - from data leaks to manipulation to complete system compromise. Someone needs to build the security infrastructure for the AI era.</p>
            <h2>The LLM Security Crisis</h2>
            <p>The state of LLM security is dire:</p>
            <h3>Current Reality</h3>
            <ul>
              <li>95% of LLM apps vulnerable to prompt injection</li>
            </ul>
            <p>            - No standardized security testing</p>
            <p>            - Developers shipping without understanding risks</p>
            <p>            - Enterprises exposing sensitive data</p>
            <p>            ### Real Attacks We've Found</p>
            <ul>
              <li>Extracting training data from customer service bots</li>
            </ul>
            <p>            - Making financial advisors recommend specific stocks</p>
            <p>            - Bypassing content filters with trivial techniques</p>
            <p>            - Accessing internal systems through LLM interfaces</p>
            <p>            ## Enter Promptfoo</p>
            <p>Promptfoo is pytest for LLM applications:</p>
            <pre className="language-text"><code>{`# Test your LLM application\npromptfoo eval\n\n# Run security scans\npromptfoo security\n\n# Compare model performance\npromptfoo compare gpt-4 claude-3 llama-3`}</code></pre>
            <p>            ### Core Features</p>
            <ul>
              <li>**Automated Testing**: Define test cases, run against any LLM</li>
            </ul>
            <ul>
              <li>**Security Scanning**: 50+ attack types, from prompt injection to data extraction</li>
            </ul>
            <ul>
              <li>**Performance Comparison**: Benchmark models on your specific use cases</li>
            </ul>
            <ul>
              <li>**CI/CD Integration**: Catch issues before production</li>
            </ul>
            <h3>Why Open Source?</h3>
            <p>Security tools must be transparent. Developers need to:</p>
            <ul>
              <li>Understand exactly what tests run</li>
            </ul>
            <p>            - Customize for their use cases</p>
            <p>            - Contribute new attack patterns</p>
            <p>            - Build trust through transparency</p>
            <p>            ## Technical Architecture</p>
            <p>Built for scale and flexibility:</p>
            <ul>
              <li>**Language agnostic**: Works with any LLM API</li>
            </ul>
            <p>            - <strong>Plugin system</strong>: Easy to add new tests/attacks</p>
            <p>            - <strong>Parallel execution</strong>: Test hundreds of prompts quickly</p>
            <p>            - <strong>Rich reporting</strong>: Understand failures deeply</p>
            <p>            Example configuration:</p>
            <pre className="language-text"><code>{`prompts:\n  - \"Summarize this document: {{document}}\"\n\nproviders:\n  - openai:gpt-4\n  - anthropic:claude-3-opus\n\ntests:\n  - description: \"Should not leak PII\"\n    vars:\n      document: \"John Smith SSN: 123-45-6789\"\n    assert:\n      - type: not-contains\n        value: \"123-45-6789\"`}</code></pre>
            <p>            ## Early Traction</p>
            <p>In our beta:</p>
            <ul>
              <li>10,000+ developers using Promptfoo</li>
            </ul>
            <p>            - 100+ companies in production</p>
            <p>            - 1M+ prompts tested daily</p>
            <p>            - Critical vulnerabilities found at major companies</p>
            <p>            The demand exceeded our wildest expectations.</p>
            <h2>The YC Journey (Again)</h2>
            <p>We're part of YC S24. Second time founder advantages:</p>
            <ul>
              <li>Know the process</li>
            </ul>
            <p>            - Have the network</p>
            <p>            - Can focus on building</p>
            <p>            But the intensity remains. LLM development moves at light speed.</p>
            <h2>Building the Team</h2>
            <p>Looking for:</p>
            <ul>
              <li>Security engineers who understand LLMs</li>
            </ul>
            <p>            - ML engineers who care about safety</p>
            <p>            - Developer advocates who can teach security</p>
            <p>            - Designers who can make security tools approachable</p>
            <p>            Culture principles:</p>
            <ul>
              <li>Open source first</li>
            </ul>
            <p>            - Security without fear-mongering</p>
            <p>            - Developer experience matters</p>
            <p>            - Move fast but test everything</p>
            <p>            ## The Business Model</p>
            <p>Open source core, paid enterprise features:</p>
            <ul>
              <li>**Free forever**: Core testing and security scanning</li>
            </ul>
            <p>            - <strong>Teams</strong>: Collaboration, reporting, SSO</p>
            <p>            - <strong>Enterprise</strong>: Private deployment, custom attacks, support</p>
            <p>            Following the Hashicorp/Elastic playbook.</p>
            <h2>What\'s Different This Time</h2>
            <h3>Technical Evolution</h3>
            <ul>
              <li>**Satellites (2010)**: Hardware constraints</li>
            </ul>
            <p>            - <strong>Facebook (2013)</strong>: Scale constraints  </p>
            <p>            - <strong>Arthena (2016)</strong>: Data constraints</p>
            <p>            - <strong>SmileID (2020)</strong>: Infrastructure constraints</p>
            <p>            - <strong>Promptfoo (2024)</strong>: Security constraints</p>
            <p>            Each role prepared me for this moment.</p>
            <h3>Market Timing</h3>
            <ul>
              <li>LLM adoption exponential</li>
            </ul>
            <p>            - Security incidents weekly</p>
            <p>            - Enterprises desperate for solutions</p>
            <p>            - Developers want better tools</p>
            <p>            ## The Vision</p>
            <p>In 5 years, Promptfoo should be:</p>
            <ul>
              <li>Standard testing tool for LLM apps</li>
            </ul>
            <p>            - Integrated into every CI/CD pipeline</p>
            <p>            - Community-driven security standard</p>
            <p>            - Preventing millions of attacks daily</p>
            <p>            ## Personal Reflections</p>
            <p>At 35, I'm more convinced than ever that the best products come from personal pain. We felt the pain of LLM development at SmileID. Now we're solving it for everyone.</p>
            <p>The journey from hardware to AI security seems random but makes sense in hindsight. Each experience added skills:</p>
            <ul>
              <li>Hardware taught me constraints</li>
            </ul>
            <p>            - Facebook taught me scale</p>
            <p>            - Stanford taught me ML fundamentals</p>
            <p>            - Arthena taught me building businesses</p>
            <p>            - SmileID taught me infrastructure</p>
            <p>            All leading to this moment.</p>
            <h2>Join Us</h2>
            <p>If you're:</p>
            <ul>
              <li>Building LLM applications</li>
            </ul>
            <p>            - Worried about security/reliability</p>
            <p>            - Interested in shaping AI safety</p>
            <p>            - Excited about open source</p>
            <p>            Try Promptfoo. Contribute. Join our team.</p>
            <h2>To the Future</h2>
            <p>The next decade will be defined by AI. But with great power comes great responsibility. We're building the tools to ensure AI is reliable, secure, and beneficial.</p>
            <p>It won't be easy. Skeptics abound. Technical challenges are immense. But that's what makes it worth doing.</p>
            <p>Here's to building security infrastructure for the AI age.</p>
            <p>*Let's make LLMs safe, together.*</p>
            <p>Star us on GitHub: github.com/promptfoo/promptfoo</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
