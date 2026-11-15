import TableRow, { type StatRow } from './TableRow';

/**
 * The frame is the size container a cramped table stacks against, and the
 * roles are explicit because that stacking restyles the table's parts as
 * blocks, which drops their table semantics in some browsers.
 */
export default function Table({ data }: { data: readonly StatRow[] }) {
  return (
    <div className="stat-table-frame">
      <table className="stat-table" role="table">
        <thead className="sr-only" role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">
              Statistic
            </th>
            <th scope="col" role="columnheader">
              Value
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {data.map((row) => (
            <TableRow key={row.label} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
