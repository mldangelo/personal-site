import data from '../../data/stats/personal';
import Table from './Table';

const PersonalStats = () => (
  <section className="rounded-xl border border-border p-5">
    <h2 className="mb-3 font-mono text-xs tracking-widest text-accent uppercase">
      About me
    </h2>
    <Table data={data} />
  </section>
);

export default PersonalStats;
