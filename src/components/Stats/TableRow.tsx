import type { ITableData } from './Table';

const TableRow = ({ label, link, value, format }: ITableData) => (
  <tr className="border-b border-rule last:border-0">
    <td className="py-3 pr-4 text-[0.92rem] text-muted">{label}</td>
    <td className="py-3 text-right font-mono text-[0.85rem] text-fg tabular-nums">
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
