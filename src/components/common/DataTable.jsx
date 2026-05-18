import { cn } from '../../lib/utils';
import { TableRowSkeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { Inbox } from 'lucide-react';

export function DataTable({
  columns,
  data,
  loading,
  emptyTitle = 'No data found',
  emptyDescription,
  renderRow,
  className,
}) {
  if (loading) {
    return (
      <div className={cn('overflow-x-auto rounded-xl border border-border', className)}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {columns.map((col) => (
                <th key={col.key} className="p-4 text-left font-medium text-muted-foreground">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={columns.length} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data?.length) {
    return <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cn('overflow-x-auto rounded-xl border border-border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            {columns.map((col) => (
              <th key={col.key} className="p-4 text-left font-medium text-muted-foreground whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

