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
        {data.map((pair) => (
          <TableRow
            format={pair.format}
            key={pair.label}
            label={pair.label}
            link={pair.link}
            value={pair.value}
          />
        ))}
      </tbody>
    </table>
  );
}
