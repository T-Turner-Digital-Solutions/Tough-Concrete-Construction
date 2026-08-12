import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  /** Hidden below md breakpoint — shown instead inside the mobile card. */
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

/**
 * Adapts to a real table on desktop and stacked cards on mobile so admin
 * tables (leads, jobs, invoices, bids...) stay usable on a phone in the field.
 */
export function DataTable<T>({ columns, rows, rowKey, emptyMessage = 'Nothing here yet.', onRowClick }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-concrete-300 bg-concrete-50 p-8 text-center text-sm text-concrete-500">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-concrete-200 bg-white shadow-card md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-concrete-200 bg-concrete-50">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className={cn('whitespace-nowrap px-4 py-3 font-semibold uppercase tracking-wide text-xs text-concrete-500', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-concrete-100">
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn('transition-colors', onRowClick && 'cursor-pointer hover:bg-concrete-50')}
              >
                {columns.map((col) => (
                  <td key={col.header} className={cn('px-4 py-3 align-middle', col.className)}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div
            key={rowKey(row)}
            onClick={() => onRowClick?.(row)}
            className={cn('rounded-xl border border-concrete-200 bg-white p-4 shadow-card', onRowClick && 'cursor-pointer active:bg-concrete-50')}
          >
            {columns.map((col) => (
              <div key={col.header} className="flex items-center justify-between gap-3 py-1 text-sm first:pt-0 last:pb-0">
                <span className="text-xs font-semibold uppercase tracking-wide text-concrete-400">{col.header}</span>
                <span className="text-right text-concrete-800">{col.cell(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
