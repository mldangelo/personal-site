import type { Metadata } from 'next';
import Link from 'next/link';

import { SchemaGraph } from '@/components/Schema';
import Entry from '@/components/Speaking/Entry';
import PageWrapper from '@/components/Template/PageWrapper';
import { getAppearances } from '@/data/speaking';
import { createPageMetadata } from '@/lib/metadata';
import {
  breadcrumbNode,
  collectionPageNode,
  HOME_URL,
  SITE_URL,
} from '@/lib/schema';
import { AUTHOR_NAME } from '@/lib/utils';

const SPEAKING_URL = `${SITE_URL}/speaking/`;

const PAGE_TITLE = 'Speaking';

const SPEAKING_DESCRIPTION = `Panels and demos on AI security by ${AUTHOR_NAME}: prompt injection, agent security, and red teaming LLM applications.`;

function appearanceCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'appearance' : 'appearances'}`;
}

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: SPEAKING_DESCRIPTION,
  path: '/speaking/',
});

export default function SpeakingPage() {
  const appearances = getAppearances();

  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          collectionPageNode({
            url: SPEAKING_URL,
            name: PAGE_TITLE,
            description: SPEAKING_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(SPEAKING_URL, [
            { name: 'Home', url: HOME_URL },
            { name: PAGE_TITLE, url: SPEAKING_URL },
          ]),
        ]}
      />
      {/* The register's layout classes are shared with /projects. */}
      <div className="projects-page">
        <header className="projects-header">
          <h1 className="page-title">{PAGE_TITLE}</h1>
          <p className="page-subtitle">
            I talk about security for AI systems: prompt injection, agent
            security, and red teaming LLM applications. Most of it comes from
            building Promptfoo and now working on cyber products at OpenAI.
          </p>
        </header>

        <section className="projects-group" aria-labelledby="speaking-public">
          <div className="projects-group-header">
            <h2 id="speaking-public" className="projects-section-title">
              Public sessions
            </h2>
            {/* Counted, never typed. */}
            <span className="projects-section-count">
              {appearanceCountLabel(appearances.length)}
            </span>
          </div>
          <ol className="projects-register">
            {appearances.map((appearance) => (
              <li key={appearance.link}>
                <Entry data={appearance} />
              </li>
            ))}
          </ol>
        </section>

        <section className="projects-group" aria-labelledby="speaking-private">
          <div className="projects-group-header">
            <h2 id="speaking-private" className="projects-section-title">
              Closed-door sessions
            </h2>
          </div>
          <p>
            I also run closed-door sessions with security and engineering teams
            on behalf of OpenAI, which aren't listed here. If you're organizing
            an event or working on the same problems,{' '}
            <Link href="/contact/">get in touch</Link>.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
}
