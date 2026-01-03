/**
 * Centralized profile data - single source of truth for identity information
 * Used by Hero, Footer, SideBar, resume page, and JSON Resume export
 */

export interface ProfileLocation {
  city: string;
  region: string;
  countryCode: string;
}

export interface ProfileCompany {
  name: string;
  url: string;
  role: string;
}

export interface Profile {
  name: string;
  label: string;
  email: string;
  url: string;
  image: string;
  summary: string;
  tagline: string[];
  chips: string[];
  bio: string;
  bioHtml: string;
  location: ProfileLocation;
  company: ProfileCompany;
}

const profile: Profile = {
  name: "Michael D'Angelo",
  label: 'Co-founder & CTO at Promptfoo',
  email: 'michael.l.dangelo@gmail.com',
  url: 'https://mldangelo.com',
  image: '/images/me.jpg',
  summary: `Engineering leader with 10+ years building products at the intersection of machine learning and security. Currently CTO & Co-founder at Promptfoo, building open-source LLM security tools. Stanford MS, YC alum, previously VP Engineering.`,
  tagline: [
    'the most widely adopted open-source LLM security platform.',
    'Building AI products for over a decade.',
  ],
  chips: ['YC Alum', 'Stanford ICME', 'Co-founded Arthena & Matroid'],
  bio: `Hi, I'm Michael. I am a Stanford ICME graduate, YC alumnus, and the co-founder and CTO of Promptfoo. Previously, I was VP of Engineering at SmileID, co-founder and CTO of Arthena, and co-founded Matroid.`,
  bioHtml: `Hi, I'm Michael. I am a <a href="https://icme.stanford.edu/">Stanford ICME</a> graduate, YC alumnus, and the co-founder and CTO of <a href="https://promptfoo.dev">Promptfoo</a>. Previously, I was VP of Engineering at <a href="https://usesmileid.com">SmileID</a>, co-founder and CTO of <a href="https://arthena.com">Arthena</a>, and co-founded <a href="https://matroid.com">Matroid</a>.`,
  location: {
    city: 'New York',
    region: 'NY',
    countryCode: 'US',
  },
  company: {
    name: 'Promptfoo',
    url: 'https://promptfoo.dev',
    role: 'Co-founder & CTO',
  },
};

export default profile;
