import data from '../../data/stats/personal';
import Section from '../Template/Section';
import Table from './Table';

const PersonalStats = () => (
  <Section title="About me">
    <Table data={data} />
  </Section>
);

export default PersonalStats;
