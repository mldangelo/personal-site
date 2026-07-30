import type { Metadata } from 'next';
import Link from 'next/link';

import { SchemaGraph } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';
import projects from '@/data/projects';
import { HOME_URL, profilePageNode } from '@/lib/schema';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils';

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  // The homepage builds its openGraph in the root layout, so it only needs
  // the canonical here. `trailingSlash: true` makes `/` the canonical form.
  alternates: { canonical: `${SITE_URL}/` },
};

export default function HomePage() {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <PageWrapper mainClassName="page-main--hero">
      <SchemaGraph
        nodes={[profilePageNode({ url: HOME_URL, name: AUTHOR_NAME })]}
      />
      <Hero />
      <section className="home-writing" aria-labelledby="home-projects-title">
        <div className="home-writing-header">
          <div>
            <span className="home-section-kicker">Selected work</span>
            <h2 id="home-projects-title">Engineering projects</h2>
          </div>
          <Link href="/projects/" className="home-writing-all">
            View projects
          </Link>
        </div>
        <div className="home-writing-list">
          {featuredProjects.map((project) => (
            <Link
              key={project.title}
              href="/projects/"
              className="home-writing-item"
            >
              <span className="home-writing-meta">{project.subtitle}</span>
              <h3>{project.title}</h3>
              <p>{project.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
