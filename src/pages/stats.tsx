import Personal from '../components/Stats/Personal';
import Site from '../components/Stats/Site';
import PageHeader from '../components/Template/PageHeader';
import Main from '../layouts/Main';

const Stats = () => (
  <Main
    title="Stats"
    description="Some statistics about Austin Dase and dase.dev"
  >
    <PageHeader eyebrow="Stats" title="Stats">
      <p>Numbers about me and this site, most of them fetched live.</p>
    </PageHeader>

    <div className="grid gap-6 sm:grid-cols-2">
      <Personal />
      <Site />
    </div>
  </Main>
);

export default Stats;
