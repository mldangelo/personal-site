import TableRow, { type StatRow } from './TableRow';

export default function Table({ data }: { data: readonly StatRow[] }) {
  return (
    <table className="stat-table">
      <thead className="sr-only">
        <tr>
          <th scope="col">Statistic</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <TableRow key={row.label} {...row} />
        ))}
      </tbody>
    </table>
  );
}
