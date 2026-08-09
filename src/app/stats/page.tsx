import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageHeader from '@/components/ui/page-header';
import Section from '@/components/ui/section';
import Table from '@/components/ui/table';
import personal from '@/data/stats/personal';
import { pageMetadata } from '@/lib/metadata';
import GithubActivity from './github-activity';
import SiteStats from './site-stats';

export const metadata: Metadata = pageMetadata({
  title: 'Stats',
  description: 'Some statistics about Austin Dase and dase.dev',
  path: '/stats',
  imageAlt: 'Preview card for Austin Dase website and personal stats'
});

const Stats = () => (
  <>
    <PageHeader eyebrow="Stats" title="Stats">
      <p>Numbers about me and this site, most of them fetched live.</p>
    </PageHeader>

    <Section title="About me">
      <Table data={personal} />
    </Section>

    <Suspense
      fallback={
        <Section title="GitHub activity">
          <p className="font-mono text-[0.8rem] text-faint">Loading…</p>
        </Section>
      }
    >
      <GithubActivity />
    </Suspense>

    <Suspense
      fallback={
        <Section title="This site">
          <p className="font-mono text-[0.8rem] text-faint">Loading…</p>
        </Section>
      }
    >
      <SiteStats />
    </Suspense>
  </>
);

export default Stats;
