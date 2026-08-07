import type { ITableData } from './Table';

const TableRow = ({ label, link, value, format }: ITableData) => (
  <tr className="border-b border-border last:border-0">
    <td className="py-2.5 pr-4 text-sm text-muted">{label}</td>
    <td className="py-2.5 text-right font-mono text-sm tabular-nums">
      {link && format && value ? (
        <a href={link} className="hover:text-accent">
          {format(value)}
        </a>
      ) : (
        value
      )}
    </td>
  </tr>
);

export default TableRow;
