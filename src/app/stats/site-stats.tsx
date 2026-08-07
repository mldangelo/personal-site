import Section from '@/components/ui/section';
import Table from '@/components/ui/table';
import { getSiteStats } from '@/lib/github';

/**
 * Server Component: the GitHub numbers are fetched during rendering and
 * revalidated hourly, so they arrive in the HTML. This used to be a client
 * `useEffect` fetch, which meant an empty table on first paint and no figures
 * for crawlers.
 */
const SiteStats = async () => {
  const data = await getSiteStats();

  return (
    <Section title="This site">
      <Table data={data} />
    </Section>
  );
};

export default SiteStats;
