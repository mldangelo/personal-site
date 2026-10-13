import TableRow from './TableRow';
import type { TableProps } from './types';

/**
 * One table per source. The caption says where its readings came from, once
 * for every row beneath it, and it is the table's accessible name as well.
 */
export default function Table({ caption, data, source }: TableProps) {
  return (
    <table className="stat-table" data-source={source}>
      <caption className="stat-table-caption">{caption}</caption>
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
            value={reading.value}
          />
        ))}
      </tbody>
    </table>
  );
}
