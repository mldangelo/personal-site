import Section from '@/components/ui/section';
import Table from '@/components/ui/table';
import { getGithubActivity } from '@/lib/github';

/** Server Component: same fetch-during-render, revalidate-hourly pattern as SiteStats. */
const GithubActivity = async () => {
  const data = await getGithubActivity();

  return (
    <Section title="(public) GitHub activity">
      <Table data={data} />
    </Section>
  );
};

export default GithubActivity;
