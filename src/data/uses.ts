export interface Tool {
  name: string;
  description: string;
  link?: string;
  price?: string;
  note?: string;
}

export interface UseCategory {
  category: string;
  items: Tool[];
}

export const uses: UseCategory[] = [
  {
    category: 'Hardware',
    items: [
      {
        name: 'MacBook Pro 16" (M3 Max, 64GB RAM)',
        description: 'Primary development machine. Handles large language models and complex builds without breaking a sweat.',
        price: '$4,999',
        note: 'The unified memory architecture is a game-changer for ML workloads.',
      },
      {
        name: 'Mac Studio (M2 Ultra)',
        description: 'Dedicated ML training rig. Lives in the home lab running experiments 24/7.',
        price: '$6,999',
      },
      {
        name: 'LG UltraFine 5K Display (2x)',
        description: 'Dual 27" setup. The pixel density matches the MacBook perfectly.',
        price: '$1,299 each',
        link: 'https://www.apple.com/shop/product/HMUA2VC/A/lg-ultrafine-5k-display',
      },
      {
        name: 'Herman Miller Aeron Chair',
        description: 'Worth every penny for 12+ hour coding sessions. Got the remastered version.',
        price: '$1,795',
      },
      {
        name: 'IKEA Idasen Standing Desk',
        description: 'Motorized sit/stand desk. Simple, reliable, and doesn\'t break the bank.',
        price: '$599',
        link: 'https://www.ikea.com/us/en/p/idasen-desk-sit-stand-black-dark-gray-s79280998/',
      },
      {
        name: 'Keychron Q2 (Gateron Brown)',
        description: 'QMK compatible, hot-swappable switches. Perfect 65% layout.',
        price: '$169',
        link: 'https://www.keychron.com/products/keychron-q2-qmk-custom-mechanical-keyboard',
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'The scroll wheel alone is worth it. MagSpeed is addictive.',
        price: '$99',
      },
      {
        name: 'AirPods Pro (2nd gen)',
        description: 'Transparency mode for calls, noise cancellation for deep work.',
        price: '$249',
      },
      {
        name: 'Nikon D750',
        description: 'Primary camera body. Full frame, incredible low light performance.',
        price: '$1,996 (body)',
        note: 'Still shooting after 8 years and 200k+ actuations.',
      },
      {
        name: 'Nikon D800',
        description: '36MP for landscape work. The detail is stunning.',
        price: '$2,996 (body)',
      },
      {
        name: 'Mamiya 6II',
        description: 'Medium format film camera. 6x6 negatives are magical.',
        price: '$3,500',
        note: 'Found this gem in Tokyo. Best travel camera I\'ve owned.',
      },
    ],
  },
  {
    category: 'Development',
    items: [
      {
        name: 'VS Code',
        description: 'Primary editor. Running ~40 extensions, perfectly tuned over years.',
        link: 'https://code.visualstudio.com/',
        note: 'Key extensions: Copilot, Error Lens, GitLens, Prettier, ESLint',
      },
      {
        name: 'Cursor',
        description: 'AI-first editor for exploratory coding. The future is here.',
        link: 'https://cursor.sh/',
        price: '$20/month',
      },
      {
        name: 'Warp',
        description: 'Terminal with IDE features. Command palette and AI commands are killer.',
        link: 'https://www.warp.dev/',
        price: 'Free (for now)',
      },
      {
        name: 'tmux + zsh + oh-my-zsh',
        description: 'Terminal multiplexer setup. Muscle memory from 15+ years.',
        note: 'Custom theme based on agnoster with git status integration.',
      },
      {
        name: 'Docker Desktop',
        description: 'Container management. Resource limits prevent laptop meltdown.',
        link: 'https://www.docker.com/products/docker-desktop/',
      },
      {
        name: 'TablePlus',
        description: 'Database GUI that doesn\'t suck. Native performance.',
        link: 'https://tableplus.com/',
        price: '$89 lifetime',
      },
      {
        name: 'Proxyman',
        description: 'HTTP debugging proxy. Charles for the modern era.',
        link: 'https://proxyman.io/',
        price: '$49',
      },
      {
        name: 'GitHub Copilot',
        description: 'AI pair programmer. Autocomplete on steroids.',
        link: 'https://github.com/features/copilot',
        price: '$10/month',
      },
    ],
  },
  {
    category: 'AI & ML Tools',
    items: [
      {
        name: 'Promptfoo',
        description: 'LLM testing framework. We built it, I use it daily.',
        link: 'https://promptfoo.dev',
        note: 'Automated red-teaming saves hours of manual testing.',
      },
      {
        name: 'Claude (Anthropic)',
        description: 'AI assistant for coding, writing, and thinking through problems.',
        link: 'https://claude.ai',
        price: '$20/month Pro',
      },
      {
        name: 'OpenAI API',
        description: 'GPT-4, embeddings, and fine-tuning for production apps.',
        link: 'https://platform.openai.com',
        price: '~$500/month',
      },
      {
        name: 'Weights & Biases',
        description: 'Experiment tracking, model versioning, hyperparameter sweeps.',
        link: 'https://wandb.ai/',
        price: '$50/month team',
      },
      {
        name: 'Hugging Face Pro',
        description: 'Model hosting, datasets, and Spaces for demos.',
        link: 'https://huggingface.co/pricing',
        price: '$9/month',
      },
      {
        name: 'RunPod',
        description: 'GPU cloud for training. Cheaper than AWS for experiments.',
        link: 'https://runpod.io/',
        note: 'A100 80GB at $2.09/hr is unbeatable.',
      },
      {
        name: 'LangSmith',
        description: 'LLM observability and debugging in production.',
        link: 'https://smith.langchain.com/',
        price: '$39/month',
      },
    ],
  },
  {
    category: 'Productivity',
    items: [
      {
        name: 'Linear',
        description: 'Issue tracking built for speed. Keyboard shortcuts for everything.',
        link: 'https://linear.app',
        price: '$8/user/month',
        note: 'The Cmd+K interface should be standard everywhere.',
      },
      {
        name: 'Notion',
        description: 'Knowledge base, project docs, and personal wiki.',
        link: 'https://notion.so',
        price: '$10/month',
      },
      {
        name: 'Raycast',
        description: 'Launcher, window manager, clipboard history, and 100+ extensions.',
        link: 'https://raycast.com',
        price: '$96/year Pro',
        note: 'The AI commands alone justify the price.',
      },
      {
        name: '1Password',
        description: 'Password manager with excellent CLI integration.',
        link: 'https://1password.com',
        price: '$36/year',
      },
      {
        name: 'Superhuman',
        description: 'Email client that makes inbox zero achievable.',
        link: 'https://superhuman.com',
        price: '$30/month',
        note: 'Expensive but the keyboard shortcuts save hours weekly.',
      },
      {
        name: 'Obsidian',
        description: 'Markdown notes with bidirectional linking. My second brain.',
        link: 'https://obsidian.md',
        price: '$50/year Sync',
      },
      {
        name: 'Alfred',
        description: 'Automation and workflows. Using it since v1.',
        link: 'https://alfredapp.com',
        price: '£59 Powerpack',
      },
    ],
  },
  {
    category: 'Design & Content',
    items: [
      {
        name: 'Figma',
        description: 'UI/UX design and prototyping. Dev mode is fantastic.',
        link: 'https://figma.com',
        price: '$15/month',
      },
      {
        name: 'Excalidraw',
        description: 'Whiteboard for technical diagrams. Perfect imperfection.',
        link: 'https://excalidraw.com',
        note: 'Self-hosted version for sensitive architecture diagrams.',
      },
      {
        name: 'Adobe Lightroom Classic',
        description: 'Photo organization and RAW processing. 50k+ photos catalogued.',
        price: '$9.99/month',
      },
      {
        name: 'DaVinci Resolve Studio',
        description: 'Video editing when needed. Overkill but incredible.',
        link: 'https://www.blackmagicdesign.com/products/davinciresolve',
        price: '$295 one-time',
      },
      {
        name: 'ScreenFloat',
        description: 'Floating screenshot tool. Essential for multi-monitor work.',
        link: 'https://screenfloat.app',
        price: '$14.99',
      },
      {
        name: 'CleanShot X',
        description: 'Screenshots, GIFs, and screen recording. Annotation tools are perfect.',
        link: 'https://cleanshot.com',
        price: '$29 one-time',
      },
    ],
  },
  {
    category: 'Infrastructure & DevOps',
    items: [
      {
        name: 'AWS',
        description: 'Primary cloud provider. EC2, RDS, S3, Lambda, and 20+ other services.',
        note: 'Monthly bill: $3-5k depending on experiments.',
      },
      {
        name: 'Vercel',
        description: 'Frontend hosting with incredible DX. Deploy previews are magic.',
        link: 'https://vercel.com',
        price: '$20/month Pro',
      },
      {
        name: 'Cloudflare',
        description: 'CDN, DNS, Workers, R2 storage. The Swiss Army knife of the internet.',
        price: '$20/month Pro',
      },
      {
        name: 'Datadog',
        description: 'Monitoring, APM, and logs. Expensive but comprehensive.',
        link: 'https://datadoghq.com',
        price: '~$800/month',
      },
      {
        name: 'PlanetScale',
        description: 'Serverless MySQL with branching. Git for databases.',
        link: 'https://planetscale.com',
        price: '$39/month',
      },
      {
        name: 'Supabase',
        description: 'Postgres, auth, and realtime. Open source Firebase alternative.',
        link: 'https://supabase.com',
        price: '$25/month Pro',
      },
    ],
  },
  {
    category: 'Home Lab',
    items: [
      {
        name: 'Synology DS1821+',
        description: '8-bay NAS with 64TB raw storage. RAID 6 for redundancy.',
        price: '$1,099 + drives',
        note: 'Running Docker containers, Time Machine, and media server.',
      },
      {
        name: 'Ubiquiti Dream Machine SE',
        description: 'Network controller, firewall, and NVR in one.',
        price: '$499',
      },
      {
        name: 'Raspberry Pi Cluster (4x Pi 4)',
        description: 'Kubernetes learning environment. Also runs Home Assistant.',
        price: '$75 each',
      },
      {
        name: 'Intel NUC 12 Pro',
        description: 'Local GitLab runner and build server.',
        price: '$899',
      },
      {
        name: 'APC Smart-UPS 1500VA',
        description: 'Battery backup for the whole rack. Peace of mind.',
        price: '$729',
      },
    ],
  },
];