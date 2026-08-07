import type { ReactNode } from 'react';

export interface StatRow {
  label: string;
  /** Matches a key in the GitHub repo API response; rows without one are static. */
  key?: string;
  link?: string;
  value?: string | ReactNode;
  format?: (value: string | ReactNode) => string;
}

export interface TableProps {
  data: StatRow[];
}

/** A ruled two-column figure list: label left, value right-aligned in mono. */
const Table = ({ data }: TableProps) => (
  <table className="w-full">
    <tbody>
      {data.map(({ label, link, value, format }) => (
        <tr key={label} className="border-b border-rule last:border-0">
          <td className="py-3 pr-4 text-[0.92rem] text-muted">{label}</td>
          <td className="py-3 text-right font-mono text-[0.85rem] text-fg tabular-nums">
            {link && value !== undefined ? (
              <a href={link} className="hover:text-accent">
                {format ? format(value) : value}
              </a>
            ) : (
              ((format && value !== undefined ? format(value) : value) ?? '—')
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
