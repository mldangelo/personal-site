import TableRow from './TableRow';
import type { TableProps } from './types';

export default function Table({ data }: TableProps) {
  return (
    <table className="stat-table">
      <thead className="sr-only">
        <tr>
          <th scope="col">Statistic</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((reading) => (
          <TableRow
            key={reading.label}
            label={reading.label}
            link={reading.link}
            source={reading.source}
            value={reading.value}
          />
        ))}
      </tbody>
    </table>
  );
}
